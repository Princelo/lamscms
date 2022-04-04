<?php
declare(strict_types=1);

namespace App\Actions\Category;

use App\Domain\Category;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class UpdateCategoryAction extends CategoryAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["title", "code"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $formData['id'] = intval($this->args['id']);
        $category = new Category(...$formData);
        $updated = $this->categoryRepository->update($category);
        return $this->respondWithData($updated);
    }
}
