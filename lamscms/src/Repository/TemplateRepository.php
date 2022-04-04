<?php
namespace App\Repository;

use App\Domain\Template;
use PDO;

class TemplateRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function one(int $id): ?Template
    {
        $sql = <<<SQL
            select
                id,
                title,
                type,
                body
            from template where id = :id
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $template = $statement->fetch();
        return new Template(...$template);
    }

    public function all(): array
    {
        $sql = <<<SQL
            select
                id,
                title,
                type,
                body
            from
                template
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->execute();
        $templates = $statement->fetchAll();
        return array_map(
            fn ($template) => new Template(...$template),
            $templates
        );
    }

    public function create(Template $template): int
    {
        $sql = <<<SQL
            insert into template(title, type, body)
            values (:title, :type, :body)
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":title", $template->getTitle());
        $statement->bindValue(":type", $template->getType());
        $statement->bindValue(":body", $template->getBody());
        $statement->execute();
        return $this->pdo->lastInsertId();
    }

    public function update(Template $template): ?Template
    {
        $sql = <<<SQL
            update template
            set title = :title,
                type = :type,
                body = :body
            where id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $template->getID());
        $statement->bindValue(":title", $template->getTitle());
        $statement->bindValue(":type", $template->getType());
        $statement->bindValue(":body", $template->getBody());
        $statement->execute();
        return $this->one($template->getID());
    }

    public function delete($id)
    {
        $sql = "delete from template where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
    }

}
