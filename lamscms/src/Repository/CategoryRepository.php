<?php
namespace App\Repository;

use App\Domain\Category;
use PDO;

class CategoryRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function one(int $id): ?Category
    {
        $sql = <<<SQL
            select
                id,
                parent_id parentID,
                title,
                code,
                type,
                list_page_template listPageTemplate,
                detail_page_template detailPageTemplate,
                contains_content containsContent,
                hidden,
                sort,
                (select title from category where id = o.parent_id) parent
            from category o where id = :id
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $category = $statement->fetch();
        return new Category(...$category);
    }

    public function all(): array
    {
        $sql = <<<SQL
            select
                id,
                parent_id parentID,
                title,
                code,
                type,
                list_page_template listPageTemplate,
                detail_page_template detailPageTemplate,
                contains_content containsContent,
                hidden,
                (select title from category where id = o.parent_id) parent
            from
                category o
            order by sort
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
        $categories = $statement->fetchAll();
        return array_map(
            fn ($category) => new Category(...$category),
            $categories
        );
    }

    public function create(Category $category): int
    {
        $sql = <<<SQL
            insert into category(title, code, parent_id, sort, type, list_page_template,
                                 detail_page_template, contains_content, hidden)
            values (:title, :code, :parent_id, :sort, :type, :list_page_template,
                    :detail_page_template, :contains_content, :hidden)
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":title", $category->getTitle());
        $statement->bindValue(":code", $category->getCode());
        $statement->bindValue(":parent_id", $category->getParentID());
        $statement->bindValue(":sort", $this->currentSortNumber());
        $statement->bindValue(":type", $category->getType());
        $statement->bindValue(":list_page_template", $category->getListPageTemplate());
        $statement->bindValue(":detail_page_template", $category->getDetailPageTemplate());
        $statement->bindValue(":contains_content", $category->containsContent() ? 1 : 0);
        $statement->bindValue(":hidden", $category->isHidden() ? 1 : 0);
        $statement->execute();
        return $this->pdo->lastInsertId();
    }

    public function update(Category $category): ?Category
    {
        $sql = <<<SQL
            update category
            set title = :title,
                code = :code,
                parent_id = :parent_id,
                type = :type,
                list_page_template = :list_page_template,
                detail_page_template = :detail_page_template,
                contains_content = :contains_content,
                hidden = :hidden
            where id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $category->getID());
        $statement->bindValue(":title", $category->getTitle());
        $statement->bindValue(":code", $category->getCode());
        $statement->bindValue(":parent_id", $category->getParentID());
        $statement->bindValue(":type", $category->getType());
        $statement->bindValue(":list_page_template", $category->getListPageTemplate());
        $statement->bindValue(":detail_page_template", $category->getDetailPageTemplate());
        $statement->bindValue(":contains_content", $category->containsContent() ? 1 : 0);
        $statement->bindValue(":hidden", $category->isHidden() ? 1 : 0);
        $statement->execute();
        return $this->one($category->getID());
    }

    public function moveUp(int $id)
    {
        $category = $this->one($id);
        $previous = $this->previous($id);
        if ($previous != null) {
            $this->exchangePosition($category, $previous);
        }
    }

    public function moveDown(int $id)
    {
        $category = $this->one($id);
        $previous = $this->next($id);
        if ($previous != null) {
            $this->exchangePosition($category, $previous);
        }
    }

    public function delete($id)
    {
        $sql = "delete from category where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
    }

    private function previous(int $id): ?Category
    {
        $sql = <<<SQL
            select
                id,
                parent_id parentID,
                title,
                code,
                type,
                list_page_template listPageTemplate,
                detail_page_template detailPageTemplate,
                contains_content containsContent,
                hidden,
                sort
            from category where sort < (select sort from category where id = :id)
            order by sort desc limit 1
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $category = $statement->fetch();
        return $category == null ? null : new Category(...$category);
    }

    private function next(int $id): ?Category
    {
        $sql = <<<SQL
            select
                id,
                parent_id parentID,
                title,
                code,
                type,
                list_page_template listPageTemplate,
                detail_page_template detailPageTemplate,
                contains_content containsContent,
                hidden,
                sort
            from category where sort > (select sort from category where id = :id)
            order by sort limit 1
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $category = $statement->fetch();
        return $category == null ? null : new Category(...$category);
    }

    private function exchangePosition(Category $category1, Category $category2)
    {
        $this->pdo->beginTransaction();
        $sql = <<<SQL
            update category set sort = :sort where id = :id
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $category1->getID());
        $statement->bindValue(":sort", $category2->getSort());
        $statement->execute();
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $category2->getID());
        $statement->bindValue(":sort", $category1->getSort());
        $statement->execute();
        $this->pdo->commit();
    }

    private function currentSortNumber(): int
    {
        $sql = <<<SQL
            select max(sort) + 1 from category
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
        $sortNumber = $statement->fetchColumn();
        return $sortNumber == null ? 1 : $sortNumber;
    }
}
