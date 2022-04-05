<?php
namespace App\Pagination;

use PDOStatement;

class Pagination
{
    private array $equals = [];
    private array $likes = [];
    private array $endsWith = [];
    private array $compares = [];
    private array $includes = [];
    private array $group = [];

    public function __construct(
        private int $page = 1,
        private int $size = 5
    )
    {
    }

    public function group(): Pagination
    {
        $grouped = new Pagination();
        array_push($this->group, $grouped);
        return $grouped;
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

    public function getFilters($defaultOperator = " and "): string|false
    {
        if (empty($this->equals) && empty($this->compares) && empty($this->likes) && empty($this->endsWith)
            && empty($this->includes) && empty($this->group)) {
            return false;
        }
        $filters = " ( ";
        $operator = " ";
        foreach ($this->equals as $equal)
        {
            [$column] = $equal;
            $filters .= $operator;
            $filters .= $column." = :".$column;
            $operator = $defaultOperator;
        }
        foreach ($this->likes as $like) {
            [$column] = $like;
            $filters .= $operator;
            $filters .= $column." like :_like_".$column;
            $operator = $defaultOperator;
        }
        foreach ($this->endsWith as $endsWith) {
            [$column] = $endsWith;
            $filters .= $operator;
            $filters .= $column." like :_ends_with_".$column;
            $operator = $defaultOperator;
        }
        foreach ($this->compares as $compare) {
            [$column, , $operation] = $compare;
            $filters .= $operator;
            $filters .= $column." ".$operation." :".$this->operationAsString($operation).$column;
            $operator = $defaultOperator;
        }
        foreach ($this->includes as $include) {
            [$column, $values] = $include;
            $filters .= $operator;
            $filters .= $column." in ";
            $filters .= sql_in($values, fn ($v) => quote($v));
            $operator = $defaultOperator;
        }
        foreach ($this->group as $grouped) {
            $filters .= $operator;
            $filters .= $grouped->getFilters(" or ");
            $operator = $defaultOperator;
        }
        return $filters." ) ";
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
            [$column, $value, $operation] = $compare;
            if ($value instanceof \DateTime) {
                $statement->bindValue(":".$this->operationAsString($operation).$column, $value->format('Y-m-d H:i:s'));
            } else {
                $statement->bindValue(":".$this->operationAsString($operation).$column, $value);
            }
        }
        foreach ($this->group as $grouped) {
            $grouped->bindValues($statement);
        }
    }

    private function operationAsString(string $operation): string
    {
        switch ($operation)
        {
            case ">":
                return "_gt_";
            case "<":
                return "_lt_";
            case ">=":
                return "_ge_";
            case "<=":
                return "_le_";
            case "<>":
                return "_neq_";
        }
        return "";
    }
}
