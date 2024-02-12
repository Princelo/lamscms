<?php
namespace App\Actions\Article;

use DateTime;

readonly class ListArticleRequest
{
    public function __construct(
        private int     $page = 1,
        private int     $size = 5,
        private ?string $keyword = null,
        private ?string $published = null,
        private ?string $publishedSince = null,
        private ?string $publishedUntil = null,
        private ?string $category = null,
    )
    {
    }

    /**
     * @return int
     */
    public function getPage(): int
    {
        return $this->page;
    }

    /**
     * @return int
     */
    public function getSize(): int
    {
        return $this->size;
    }

    /**
     * @return string|null
     */
    public function getKeyword(): ?string
    {
        if ($this->keyword == null) return $this->keyword;
        return trim($this->keyword);
    }

    /**
     * @return string|null
     */
    public function getPublished(): ?string
    {
        return $this->published;
    }

    /**
     * @return DateTime|false
     */
    public function getPublishedSince(): DateTime|false
    {
        if ($this->publishedSince == null) return false;
        return date_create_from_format("Y-m-d", $this->publishedSince);
    }

    /**
     * @return DateTime|false
     */
    public function getPublishedUntil(): DateTime|false
    {
        if ($this->publishedUntil == null) return false;
        return str_to_date($this->publishedUntil." 23:59:59");
    }

    /**
     * @return string|null
     */
    public function getCategory(): ?string
    {
        return $this->category;
    }

}
