<?php
namespace App\Repository;

use App\Domain\Attachment;
use PDO;

class AttachmentRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function one(int $id): ?Attachment
    {
        $sql = <<<SQL
            select
                id,
                name,
                type,
                path,
                uploaded_at uploadedAt
            from attachment where id = :id
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
        $attachment = $statement->fetch();
        return new Attachment(...$attachment);
    }

    public function add(Attachment $attachment): int
    {
        $sql = <<<SQL
            insert into attachment(name, type, path)
            values (:name, :type, :path)
        SQL;
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":name", $attachment->getName());
        $statement->bindValue(":type", $attachment->getType());
        $statement->bindValue(":path", $attachment->getPath());
        $statement->execute();
        return $this->pdo->lastInsertId();
    }

    public function delete($id)
    {
        $sql = "delete from attachment where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", $id);
        $statement->execute();
    }

    public function findIDByPath($path)
    {
        $sql = "select id from attachment where path = :path";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":path", $path);
        $statement->execute();
        $res = $statement->fetch();
        return $res['id'];
    }

}
