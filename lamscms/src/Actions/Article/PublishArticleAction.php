<?php
declare(strict_types=1);

namespace App\Actions\Article;

use Psr\Http\Message\ResponseInterface as Response;

class PublishArticleAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->articleRepository->publish($id);
        return $this->respondWithData("The article has been published successfully");
    }
}
