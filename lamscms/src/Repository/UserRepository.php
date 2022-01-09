<?php
namespace App\Repository;

use App\Domain\User;
use PDO;

class UserRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function one(int $id): ?User
    {
        $statement = $this->pdo->prepare("select * from user where id = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();
        $user = $statement->fetch();
        if (!$user) {
            return null;
        }
        return $this->toUser($user);
    }

    public function findUserOfRole(string $role): array
    {
        $statement = $this->pdo->prepare("select * from user where role = :role");
        $statement->bindParam(":role", $role);
        $statement->execute();
        $users = $statement->fetchAll();
        return array_map(
            fn ($user) => $this->toUser($user),
            $users
        );
    }

    public function all(): array
    {
        $statement = $this->pdo->prepare("select * from user");
        $statement->execute();
        $users = $statement->fetchAll();
        return array_map(
            fn ($user) => $this->toUser($user),
            $users
        );
    }

    public function create(User $user): int
    {
        $sql = <<<SQL
            insert into user(username, password, role, enabled)
            values (:username, :password, :role, :enabled)
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":username", $user->getUsername());
        $statement->bindValue(":password", $user->getPassword());
        $statement->bindValue(":role", $user->getRole());
        $statement->bindValue(":enabled", intval($user->isEnabled()));
        $statement->execute();
        return $this->pdo->lastInsertId();
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

    public function resetPassword(int $id): string
    {
        $newPassword = randomPassword();
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $sql = "update user set password = :password where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":password", $newPasswordHash);
        $statement->bindValue(":id", $id);
        $statement->execute();
        return $newPassword;
    }

    public function delete(string $username)
    {
        $sql = "delete from user where username = :username";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":username", $username);
        $statement->execute();
    }

    public function update(User $user): ?User
    {
        $sql = "update user set enabled = :enabled, role = :role where id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":enabled", intval($user->isEnabled()));
        $statement->bindValue(":role", $user->getRole());
        $statement->bindValue(":id", $user->getID());
        $statement->execute();
        return $this->one($user->getID());
    }


    private function toUser(array $record): ?User
    {
        return $record != null
            ? new User(...$record)
            : null;
    }

}
