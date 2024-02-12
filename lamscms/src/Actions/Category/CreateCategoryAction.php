<?php
namespace App\Actions\Category;

use App\Domain\Category;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class CreateCategoryAction extends CategoryAction
{

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
        $category = new Category(...$formData);
        $id = $this->categoryRepository->create($category);
        $category->setID($id);
        return $this->respondWithData($category);
    }
}
