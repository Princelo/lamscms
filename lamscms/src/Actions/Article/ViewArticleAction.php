<?php
declare(strict_types=1);

namespace App\Actions\Article;

use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;

class ViewArticleAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $article = $this->articleRepository->one($id);
        if ($article == null) {
            throw new DomainRecordNotFoundException("the article you queried doesn't exist");
        }

        return $this->respondWithData($article);
    }
}
