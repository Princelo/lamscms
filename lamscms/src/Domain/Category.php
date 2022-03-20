<?php
namespace App\Domain;

use JsonSerializable;

class Category implements JsonSerializable
{
    public function __construct(
        private string $title,
        private string $code,
        private ?int $id = null,
        private ?int $parentID = null,
    )
    {
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return int|null
     */
    public function getParentID(): ?int
    {
        return $this->parentID;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'parentID' => $this->parentID,
            'title' => $this->title,
            'code' => $this->code,
        ];
    }
}
