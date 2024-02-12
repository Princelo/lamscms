<?php
namespace App\Domain;

use DateTime;
use JsonSerializable;

class Attachment implements JsonSerializable
{
    public function __construct(
        private string $name,
        private string $type,
        private string $path,
        private ?DateTime $uploadedAt = null,
        private ?int $id = null,
    )
    {
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return ?string
     */
    public function getPath(): ?string
    {
        return $this->path;
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

    /**
     * @return ?DateTime
     */
    public function getUploadedAt(): ?DateTime
    {
        return $this->uploadedAt;
    }



    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'path' => $this->path,
            'uploadedAt' => $this->uploadedAt,
        ];
    }
}
