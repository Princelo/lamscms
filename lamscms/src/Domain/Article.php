<?php
namespace App\Domain;

use JsonSerializable;
use DateTime;

class Article implements JsonSerializable
{
    public function __construct(
        private string $title,
        private int $category,
        private string|null $body = null,
        private string|null $mobileBody = null,
        private bool $published = false,
        private bool $isHeadline = false,
        private int $priority = 0,
        private string|null $preview = null,
        private string|null $avatarURL = null,
        private string|null $avatarName = null,
        private array|null $tags = null,
        private int|null $id = null,
        private ?DateTime $createdAt = null,
        private string|null $createdBy = null,
        private ?DateTime $modifiedAt = null,
        private string|null $modifiedBy = null,
        private ?DateTime $publishedAt = null,
        private string|null $publishedBy = null,
        private string|null $text = null
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
     * @return int
     */
    public function getCategory(): int
    {
        return $this->category;
    }

    /**
     * @return string|null
     */
    public function getBody(): ?string
    {
        return $this->body;
    }

    /**
     * @return string|null
     */
    public function getMobileBody(): ?string
    {
        return $this->mobileBody;
    }

    /**
     * @return bool
     */
    public function isPublished(): bool
    {
        return $this->published;
    }

    /**
     * @return bool
     */
    public function isHeadline(): bool
    {
        return $this->isHeadline;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @return string|null
     */
    public function getPreview(): ?string
    {
        return $this->preview;
    }

    /**
     * @return string|null
     */
    public function getAvatarURL(): ?string
    {
        return $this->avatarURL;
    }

    /**
     * @return string|null
     */
    public function getAvatarName(): ?string
    {
        return $this->avatarName;
    }

    /**
     * @return array|null
     */
    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(array $tags): ?array
    {
        return $this->tags = $tags;
    }

    /**
     * @return int|null
     */
    public function getID(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setID(?int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @return string|null
     */
    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    /**
     * @return DateTime|null
     */
    public function getModifiedAt(): ?DateTime
    {
        return $this->modifiedAt;
    }

    /**
     * @return string|null
     */
    public function getModifiedBy(): ?string
    {
        return $this->modifiedBy;
    }

    /**
     * @return DateTime|null
     */
    public function getPublishedAt(): ?DateTime
    {
        return $this->publishedAt;
    }

    /**
     * @return string|null
     */
    public function getPublishedBy(): ?string
    {
        return $this->publishedBy;
    }

    /**
     * @param string $text
     */
    public function setText(string $text): void {
        $this->text = $text;
    }

    /**
     * @return string|null
     */
    public function getText(): ?string
    {
        return $this->text;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'body' => $this->body,
            'mobileBody' => $this->mobileBody,
            'published' => $this->published,
            'isHeadline' => $this->isHeadline,
            'priority' => $this->priority,
            'preview' => $this->preview,
            'avatarURL' => $this->avatarURL,
            'avatarName' => $this->avatarName,
            'tags' => $this->tags,
            'createdAt' => $this->createdAt?->format('Y-m-d H:i:s'),
            'createdBy' => $this->createdBy,
            'modifiedAt' => $this->modifiedAt?->format('Y-m-d H:i:s'),
            'modifiedBy' => $this->modifiedBy,
            'publishedAt' => $this->publishedAt?->format('Y-m-d H:i:s'),
            'publishedBy' => $this->publishedBy,
            'text' => $this->text,
        ];
    }
}
