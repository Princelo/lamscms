<?php
namespace App\Actions\Category;

use App\Actions\Action;
use App\Repository\CategoryRepository;
use Psr\Log\LoggerInterface;

abstract class CategoryAction extends Action
{
    public function __construct(LoggerInterface $logger,
                                protected CategoryRepository $categoryRepository)
    {
        parent::__construct($logger);
    }
}
