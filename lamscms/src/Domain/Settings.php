<?php
namespace App\Domain;

use DateTime;

class Settings implements \JsonSerializable
{
    public function __construct(
        private ?string   $address,
        private ?string   $title,
        private ?string   $subTitle,
        private ?string   $keywords,
        private ?string   $description,
        private ?DateTime $modifiedAt = null,
        private ?string   $modifiedBy = null
    )
    {
    }

    /**
     * @return ?string
     */
    public function getAddress(): ?string
    {
        return $this->address;
    }

    /**
     * @return ?string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @return ?string
     */
    public function getSubTitle(): ?string
    {
        return $this->subTitle;
    }

    /**
     * @return ?string
     */
    public function getKeywords(): ?string
    {
        return $this->keywords;
    }

    /**
     * @return ?string
     */
    public function getDescription(): ?string
    {
        return $this->description;
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
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'address' => $this->address,
            'title' => $this->title,
            'subTitle' => $this->subTitle,
            'keywords' => $this->keywords,
            'description' => $this->description,
        ];
    }
}
