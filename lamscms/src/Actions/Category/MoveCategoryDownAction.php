<?php
namespace App\Actions\Category;

use Psr\Http\Message\ResponseInterface as Response;

class MoveCategoryDownAction extends CategoryAction
{

    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->categoryRepository->moveDown($id);
        return $this->respondWithData("The category has been moved down successfully");
    }
}
