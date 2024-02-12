<?php
namespace App\Repository;

use App\Domain\Article;
use App\Pagination\Pagination;
use DateTime;
use PDO;
use Psr\Log\LoggerInterface;

class ArticleRepository
{
    public function __construct(
        private PDO $pdo,
        private TagRepository $tagRepository,
        private AttachmentRepository $attachmentRepository,
        protected LoggerInterface $logger
    )
    {
    }

    public function one(int $id): ?Article
    {
        $sql = <<<SQL
            select
                article.id,
                article.title,
                article.category,
                article.body,
                article.mobile_body "mobileBody",
                article.published,
                article.is_headline "isHeadline",
                article.priority,
                article.preview,
                article.avatar_url "avatarURL",
                article.avatar_name "avatarName",
                article.created_at "createdAt",
                article.created_by "createdBy",
                article.modified_at "modifiedAt",
                article.modified_by "modifiedBy",
                article.published_at "publishedAt",
                article.published_by "publishedBy"
            from article where article.id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $record = $statement->fetch();
        if (!$record) {
            return null;
        }
        $article = $this->toArticle($record);
        //$article->setTags($tags);
        return $article;
    }

    public function paginated(Pagination $pagination): array
    {
        $offset = $pagination->getOffset();
        $size = $pagination->getSize();
        $filters = $pagination->getFilters();
        $where = "";
        if ($filters) $where = " where ".$filters;
        $sql = <<<SQL
            select
                id,
                title,
                category,
                body,
                mobile_body "mobileBody",
                published,
                is_headline "isHeadline",
                priority,
                preview,
                avatar_url "avatarURL",
                avatar_name "avatarName",
                created_at "createdAt",
                created_by "createdBy",
                modified_at "modifiedAt",
                modified_by "modifiedBy",
                published_at "publishedAt",
                published_by "publishedBy"
            from article
                $where
            limit {$size} offset {$offset}
        SQL;
        $statement = $this->pdo->prepare($sql);
        $pagination->bindValues($statement);
        $statement->execute();
        $articles = $statement->fetchAll();
        $articles = array_map(
            fn ($article) => $this->toArticle($article),
            $articles
        );
        $sql = <<<SQL
            select count(*) as count from article
                $where
        SQL;
        $statement = $this->pdo->prepare($sql);
        $pagination->bindValues($statement);
        $statement->execute();
        $count = $statement->fetchColumn();
        $count = intval($count);
        return [
            'total' => $count,
            'perPage' => $pagination->getSize(),
            'currentPage' => $pagination->getPage(),
            'data' => $articles,
            'sql' => $sql
        ];
    }

    public function create(Article $article): int
    {
        $sql = <<<SQL
            insert into article(title, category, body, mobile_body, published, is_headline,
                                priority, preview, avatar_url, avatar_name, created_at, created_by,
                                published_at, published_by, text)
            values (:title, :category, :body, :mobile_body, :published, :is_headline,
                    :priority, :preview, :avatar_url, :avatar_name, :created_at, :created_by,
                    :published_at, :published_by, :text)
        SQL;

        $statement = $this->pdo->prepare($sql);
        $now = new DateTime();
        $createdAt = $article->getCreatedAt() ?? $now;
        $statement->bindValue(":created_at", $createdAt->format("Y-m-d H:i:s"));
        $statement->bindValue(":created_by", $article->getCreatedBy());
        if ($article->isPublished()) {
            $statement->bindValue(":published_at", $now->format("Y-m-d H:i:s"));
            $statement->bindValue(":published_by", $article->getPublishedBy());
        } else {
            $statement->bindValue(":published_at", null);
            $statement->bindValue(":published_by", null);
        }
        $statement->bindValue(":title", $article->getTitle());
        $statement->bindValue(":category", $article->getCategory());
        $statement->bindValue(":body", $article->getBody());
        $statement->bindValue(":mobile_body", $article->getMobileBody());
        $statement->bindValue(":published", intval($article->isPublished()));
        $statement->bindValue(":is_headline", intval($article->isHeadline()));
        $statement->bindValue(":priority", $article->getPriority());
        $statement->bindValue(":preview", $article->getPreview());
        $statement->bindValue(":avatar_url", $article->getAvatarURL());
        $statement->bindValue(":avatar_name", $article->getAvatarName());
        $statement->bindValue(":text", $article->getText());
        $this->pdo->beginTransaction();
        $statement->execute();

        $articleID = $this->pdo->lastInsertId();

        if ($article->getTags() != null && !empty($article->getTags())) {
            $this->tagRepository->insert($article->getTags(), $articleID);
        }
        $this->pdo->commit();
        return $articleID;
    }

    public function validatePassword(string $username, string $password): bool
    {
        $sql = "select password from user where username = :username";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":username", $username);
        $statement->execute();
        $passwordHash = $statement->fetch();
        if (!$passwordHash) {
            return false;
        }
        return password_verify($password, $passwordHash['password']);
    }

    public function changePassword(string $username, string $password)
    {
        $sql = "update user set password = :password where username = :username";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":password", password_hash($password, PASSWORD_DEFAULT));
        $statement->bindValue(":username", $username);
        $statement->execute();
    }

    public function resetPassword(string $username): string
    {
        $newPassword = random_password();
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $sql = "update user set password = :password where username = :username";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":password", $newPasswordHash);
        $statement->bindValue(":username", $username);
        $statement->execute();
        return $newPassword;
    }

    public function delete(int $id)
    {
        $this->pdo->beginTransaction();
        $sql = "delete from article where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $this->tagRepository->deleteTagsOfArticleID($id);
        $this->pdo->commit();
    }

    public function deleteMultiple(array $ids)
    {
        $this->pdo->beginTransaction();
        $sql = "delete from article where id in ";
        $sql .= sql_in($ids);
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
        $this->tagRepository->deleteTagsOfArticleIDs($ids);
        $this->pdo->commit();
    }

    public function update(Article $article): ?Article
    {
        $this->pdo->beginTransaction();
        if ($article->isPublished()) {
            $alreadyPublished = $this->one($article->getId())->isPublished();
            if (!$alreadyPublished) {
                $this->publish($article->getId());
            }
        }
        $sql = <<<SQL
            update article
            set title = :title,
                category = :category,
                body = :body,
                mobile_body = :mobile_body,
                published = :published,
                is_headline = :is_headline,
                priority = :priority,
                preview = :preview,
                avatar_url = :avatar_url,
                avatar_name = :avatar_name,
                modified_at = :modified_at,
                modified_by = :modified_by
            where id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $article->getID());
        $statement->bindValue(":title", $article->getTitle());
        $statement->bindValue(":category", $article->getCategory());
        $statement->bindValue(":body", $article->getBody());
        $statement->bindValue(":mobile_body", $article->getMobileBody());
        $statement->bindValue(":published", intval($article->isPublished()));
        $statement->bindValue(":is_headline", intval($article->isHeadline()));
        $statement->bindValue(":priority", $article->getPriority());
        $statement->bindValue(":preview", $article->getPreview());
        $statement->bindValue(":avatar_url", $article->getAvatarURL());
        $statement->bindValue(":avatar_name", $article->getAvatarName());
        $statement->bindValue(":modified_at", now());
        $statement->bindValue(":modified_by", current_user());
        $statement->execute();
        $this->pdo->commit();
        $this->tagRepository->update($article->getTags(), $article->getID());
        return $this->one($article->getID());
    }

    public function publish(int $id)
    {
        $sql = "update article
                set published = 1,
                    published_at = :published_at,
                    published_by = :published_by
                where id = :id and coalesce(published, 0) = 0";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":published_at", now());
        $statement->bindValue(":published_by", current_user());
        $statement->bindValue(":id", $id);
        $statement->execute();
    }

    public function publishMultiple(array $ids)
    {
        $sql = "update article
                set published = 1,
                    published_at = :published_at,
                    published_by = :published_by
                where id in ".sql_in($ids)." and coalesce(published, 0) = 0";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":published_at", now());
        $statement->bindValue(":published_by", current_user());
        $statement->execute();
    }

    private function toArticle(array $record): ?Article
    {
        if ($record == null) {
            return null;
        }
        $tags = array_map(fn ($record) => $record['name'], $this->tagRepository->findArticleTags($record['id']));
        $article = new Article(
            $record['title'],
            $record['category'],
            $record['body'],
            null,
            $record['published'],
            $record['isHeadline'],
            $record['priority'],
            $record['preview'],
            $record['avatarURL'],
            $record['avatarName'],
            $tags,
            $record['id'],
            str_to_date($record['createdAt']),
            $record['createdBy'],
            str_to_date($record['modifiedAt']),
            $record['modifiedBy'],
            str_to_date($record['publishedAt']),
            $record['publishedBy'],
            null
        );
        return $article;
    }

}
