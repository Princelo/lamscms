<?php
declare(strict_types=1);

namespace App\Actions\Article;

use App\Domain\Article;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class CreateArticleAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["title", "category"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $article = new Article(...$formData);
        $id = $this->articleRepository->create($article);
        $article->setID($id);
        return $this->respondWithData($article);
    }
}
