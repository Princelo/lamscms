<?php
declare(strict_types=1);

namespace App\Actions\Article;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class DeleteArticlesAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        if (!isset($formData['ids'])) {
            throw new HttpBadRequestException($this->request, "please specify articles to delete");
        }
        $this->articleRepository->deleteMultiple($formData['ids']);
        return $this->respondWithData("The articles have been deleted successfully");
    }
}
