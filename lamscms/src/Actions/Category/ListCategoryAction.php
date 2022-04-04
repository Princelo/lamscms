<?php
namespace App\Actions\Category;

use Psr\Http\Message\ResponseInterface as Response;

class ListCategoryAction extends CategoryAction
{

    protected function action(): Response
    {
        return $this->respondWithData($this->categoryRepository->all());
    }
}
