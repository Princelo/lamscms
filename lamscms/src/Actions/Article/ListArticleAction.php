<?php
declare(strict_types=1);

namespace App\Actions\Article;

use App\Pagination\Pagination;
use App\Repository\ArticleRepository;
use App\Repository\TagRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;

class ListArticleAction extends ArticleAction
{
    public function __construct(LoggerInterface $logger, ArticleRepository $articleRepository,
                                private TagRepository $tagRepository)
    {
        parent::__construct($logger, $articleRepository);
    }

    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $hasBody = file_get_contents('php://input') != null;
        if ($hasBody) {
            $formArray = (array) $this->getFormData();
            $request = new ListArticleRequest(...$formArray);
        } else {
            $request = new ListArticleRequest();
        }
        $pagination = new Pagination($request->getPage(), $request->getSize());
        if ($request->getKeyword() != null && !empty($request->getKeyword())) {
            $grouped = $pagination->group();
            $grouped->like("title", $request->getKeyword());
            $grouped->like("preview", $request->getKeyword());
            $articleIDs = $this->tagRepository->findArticleIDs($request->getKeyword());
            if (!empty($articleIDs)) {
                $pagination->in("id", $articleIDs);
            }
        }
        if ($request->getPublished() != null) {
            $pagination->equal("published", $request->getPublished());
        }
        if ($request->getPublishedSince()) {
            $pagination->greaterOrEqual("published_at", $request->getPublishedSince());
        }
        if ($request->getPublishedUntil()) {
            $pagination->lessOrEqual("published_at", $request->getPublishedUntil());
        }
        $this->logger->error($pagination->getFilters());
        $paginated = $this->articleRepository->paginated($pagination);

        return $this->respondWithData($paginated);
    }
}
