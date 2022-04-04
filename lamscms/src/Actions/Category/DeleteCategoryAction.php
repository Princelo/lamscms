<?php
declare(strict_types=1);

namespace App\Actions\Category;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteCategoryAction extends CategoryAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->categoryRepository->delete($id);
        return $this->respondWithData("The category has been deleted successfully");
    }
}
