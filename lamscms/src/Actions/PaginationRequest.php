<?php
namespace App\Actions;

readonly class PaginationRequest
{
    public function __construct(
        private int $page = 1,
        private int $size = 5,
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


}
