<?php
declare(strict_types=1);

namespace App\Actions\Article;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteArticleAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->articleRepository->delete($id);
        return $this->respondWithData("The article has been deleted successfully");
    }
}
