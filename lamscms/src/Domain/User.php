<?php
namespace App\Domain;

use JsonSerializable;

class User implements JsonSerializable
{
    public function __construct(
        private string $role,
        private bool $enabled,
        private ?string $username = null,
        private ?string $password = null,
        private ?int $id = null,
    )
    {
    }

    /**
     * @return ?string
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * @return string|null
     */
    public function getPassword(): string|null
    {
        return $this->password;
    }

    /**
     * @return int|null
     */
    public function getID(): ?int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setID(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }


    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'id'       => $this->id,
            'username' => $this->username,
            'role'     => $this->role,
            'enabled'  => $this->enabled,
            'roleName' => $this->role == 'admin' ? 'System Admin' : 'Super Admin',
        ];
    }
}
