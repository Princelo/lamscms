<?php
namespace App\Actions\Category;

use Psr\Http\Message\ResponseInterface as Response;

class MoveCategoryUpAction extends CategoryAction
{

    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->categoryRepository->moveUp($id);
        return $this->respondWithData("The category has been moved up successfully");
    }
}
