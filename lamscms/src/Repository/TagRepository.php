<?php
namespace App\Repository;

use PDO;

class TagRepository
{

    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function insert(array $tags, int $articleID)
    {
        $sql = <<<SQL
            insert into tag(name, article_id)
            values
        SQL;
        $split = "(";
        foreach ($tags as $tag) {
            $sql .= $split;
            $sql .= $this->pdo->quote($tag);
            $sql .= ", $articleID";
            $sql .= ")";
            $split = ", (";
        }
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
    }

    public function findArticleTags(int $articleID): array
    {
        $sql = "select * from tag where article_id = :article_id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":article_id", $articleID);
        $statement->execute();
        return $statement->fetchAll();
    }

    public function findArticleIDs(string $tag): array
    {
        $sql = "select article_id from tag where name = :name";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":name", $tag);
        $statement->execute();
        $records = $statement->fetchAll();
        return array_map(
            fn ($record) => intval($record['article_id']), $records
        );
    }

    public function update(array $tags, int $articleID)
    {
        $this->pdo->beginTransaction();
        $this->deleteTagsOfArticleID($articleID);
        $this->insert($tags, $articleID);
        $this->pdo->commit();
    }

    public function deleteTagsOfArticleID(int $articleID)
    {
        $sql = "delete from tag where article_id = :article_id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":article_id", $articleID);
        $statement->execute();
    }

    public function deleteTagsOfArticleIDs(array $articleIDs)
    {
        $sql = "delete from tag where article_id in ";
        $sql .= sql_in($articleIDs);
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
    }
}
