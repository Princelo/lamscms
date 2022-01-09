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
        $formArray = (array) $this->getFormData();
        $request = new ListArticleRequest(...$formArray);
        $pagination = new Pagination($request->getPage(), $request->getSize());
        if ($request->getKeyword() != null && !empty($request->getKeyword())) {
            $pagination->like("title", $request->getKeyword());
            $pagination->like("preview", $request->getKeyword());
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
        $paginated = $this->articleRepository->paginated($pagination);

        return $this->respondWithData($paginated);
    }
}
