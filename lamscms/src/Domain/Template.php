<?php
namespace App\Domain;

use JsonSerializable;

class Template implements JsonSerializable
{
    public function __construct(
        private string $title,
        private string $type,
        private ?string $body = null,
        private ?int $id = null,
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
     * @return ?string
     */
    public function getBody(): ?string
    {
        return $this->body;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @return int|null
     */
    public function getID(): ?int
    {
        return $this->id;
    }

    public function setID(int $id)
    {
        $this->id = $id;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'body' => $this->body,
        ];
    }
}
