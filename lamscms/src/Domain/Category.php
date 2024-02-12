<?php
namespace App\Domain;

use JsonSerializable;

class Category implements JsonSerializable
{
    public function __construct(
        private string $title,
        private string $code,
        private string $type,
        private ?bool $containsContent = false,
        private ?bool $hidden = false,
        private ?string $listPageTemplate = null,
        private ?string $detailPageTemplate = null,
        private ?int $sort = 0,
        private ?int $id = null,
        private ?int $parentID = null,
        private ?string $parent = null,
        private ?array $children = [],
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
     * @return int|null
     */
    public function getParentID(): ?int
    {
        return $this->parentID;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    /**
     * @param string|null $parent
     */
    public function setParent(?string $parent): void
    {
        $this->parent = $parent;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @return bool|null
     */
    public function containsContent(): ?bool
    {
        return $this->containsContent;
    }

    /**
     * @return bool|null
     */
    public function isHidden(): ?bool
    {
        return $this->hidden;
    }

    /**
     * @return string|null
     */
    public function getListPageTemplate(): ?string
    {
        return $this->listPageTemplate;
    }

    /**
     * @return string|null
     */
    public function getDetailPageTemplate(): ?string
    {
        return $this->detailPageTemplate;
    }

    public function setChildren(array $children)
    {
        $this->children = $children;
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
            'parent' => $this->parent,
            'type' => $this->type,
            'hidden' => $this->hidden,
            'containsContent' => $this->containsContent,
            'listPageTemplate' => $this->listPageTemplate,
            'detailPageTemplate' => $this->detailPageTemplate,
            'children' => $this->children
        ];
    }
}
