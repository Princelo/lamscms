<?php
declare(strict_types=1);

namespace App\Actions\Article;

use App\Actions\Action;
use App\Repository\ArticleRepository;
use Psr\Log\LoggerInterface;

abstract class ArticleAction extends Action
{
    /**
     * @param LoggerInterface $logger
     * @param ArticleRepository $articleRepository
     */
    public function __construct(
        LoggerInterface $logger,
        protected ArticleRepository $articleRepository
    ) {
        parent::__construct($logger);
    }
}
