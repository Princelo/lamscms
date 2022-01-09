<?php
namespace App\Actions\Article;

use DateTime;

class ListArticleRequest
{
    public function __construct(
        private int     $page = 1,
        private int     $size = 5,
        private ?string $keyword = null,
        private ?bool   $published = null,
        private ?string $publishedSince = null,
        private ?string $publishedUntil = null,
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
     * @return bool|null
     */
    public function getPublished(): ?bool
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

}
