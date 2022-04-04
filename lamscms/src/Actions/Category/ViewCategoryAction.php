<?php
declare(strict_types=1);

namespace App\Actions\Category;

use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;

class ViewCategoryAction extends CategoryAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $category = $this->categoryRepository->one($id);
        if ($category == null) {
            throw new DomainRecordNotFoundException("the category you queried doesn't exist");
        }

        return $this->respondWithData($category);
    }
}
