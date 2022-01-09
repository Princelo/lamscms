<?php
namespace App\Pagination;

use PDO;
use PDOStatement;

class Pagination
{
    private array $equals = [];
    private array $likes = [];
    private array $endsWith = [];
    private array $compares = [];
    private array $includes = [];

    public function __construct(
        private int $page,
        private int $size
    )
    {
    }

    public function equal(string $column, $value)
    {
        array_push($this->equals, [$column, $value]);
    }

    public function like(string $column, string $value)
    {
        array_push($this->likes, [$column, $value]);
    }

    public function endsWith(string $column, string $value)
    {
        array_push($this->endsWith, [$column, $value]);
    }

    public function greaterThan(string $column, $value)
    {
        array_push($this->compares, [$column, $value, ">"]);
    }

    public function greaterOrEqual(string $column, $value)
    {
        array_push($this->compares, [$column, $value, ">="]);
    }

    public function lessThan(string $column, $value)
    {
        array_push($this->compares, [$column, $value, "<"]);
    }

    public function lessOrEqual(string $column, $value)
    {
        array_push($this->compares, [$column, $value, "<="]);
    }

    public function notEqual(string $column, $value)
    {
        array_push($this->compares, [$column, $value, "<>"]);
    }

    public function in(string $column, array $values)
    {
        array_push($this->includes, [$column, $values]);
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getLimit(): int
    {
        return ($this->page-1) * $this->size;
    }

    public function getFilters(): string|false
    {
        if (empty($this->equals) && empty($this->compares) && empty($this->likes) && empty($this->endsWith)
            && empty($this->includes)) {
            return false;
        }
        $filters = "where ";
        $and = " ";
        foreach ($this->equals as $equal)
        {
            [$column] = $equal;
            $filters .= $and;
            $filters .= $column." = :".$column;
            $and = " and ";
        }
        foreach ($this->likes as $like) {
            [$column] = $like;
            $filters .= $and;
            $filters .= $column." like :_like_".$column;
            $and = " and ";
        }
        foreach ($this->endsWith as $endsWith) {
            [$column] = $endsWith;
            $filters .= $and;
            $filters .= $column." like :_ends_with_".$column;
            $and = " and ";
        }
        foreach ($this->compares as $compare) {
            [$column, , $operation] = $compare;
            $filters .= $and;
            $filters .= $column." ".$operation." :".$column;
            $and = " and ";
        }
        foreach ($this->includes as $include) {
            [$column, $values] = $include;
            $filters .= $and;
            $filters .= $column." in ";
            $filters .= sql_in($values, fn ($v) => quote($v));
            $and = " and ";
        }
        return $filters;
    }

    public function bindValues(PDOStatement $statement)
    {
        foreach ($this->equals as $equal)
        {
            [$column, $value] = $equal;
            $statement->bindValue(":".$column, $value);
        }
        foreach ($this->likes as $like) {
            [$column, $value] = $like;
            $statement->bindValue(":_like_".$column, "%".$value."%");
        }
        foreach ($this->endsWith as $endsWith) {
            [$column, $value] = $endsWith;
            $statement->bindValue(":_ends_with_".$column, $value."%");
        }
        foreach ($this->compares as $compare) {
            [$column, $value] = $compare;
            $statement->bindValue(":".$column, $value);
        }
    }
}
