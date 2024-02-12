<?php
declare(strict_types=1);

namespace App\Actions\Article;

use App\Domain\Article;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class UpdateArticleAction extends ArticleAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["title", "category", "body", "published", "isHeadline", "priority",
            "preview", "avatarURL", "tags"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $formData['id'] = intval($this->args['id']);
        $article = new Article(...$formData);
        $updated = $this->articleRepository->update($article);
        return $this->respondWithData($updated);
    }
}
