<?php
namespace App\Repository;

use PDO;

class CategoryRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }
}
