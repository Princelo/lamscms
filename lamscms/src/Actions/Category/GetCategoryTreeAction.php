<?php
namespace App\Actions\Category;

use App\Domain\Category;
use Psr\Http\Message\ResponseInterface as Response;

class GetCategoryTreeAction extends CategoryAction
{

    protected function action(): Response
    {
        $categories = $this->categoryRepository->all();
        $rootCategories = [];
        foreach ($categories as $category) {
            $category->setChildren($this->findChildren($category, $categories));
        }
        foreach ($categories as $category) {
            if (!array_key_exists($category->getID(), $this->nonRootCategories)) {
                array_push($rootCategories, $category);
            }
        }
        return $this->respondWithData($rootCategories);
    }

    private array $nonRootCategories = [];

    private function findChildren(Category $parent, array $categories): array
    {
        $children = [];
        foreach ($categories as $category) {
            if ($category->getParentID() == $parent->getID()) {
                $this->nonRootCategories[$category->getID()] = true;
                array_push($children, $category);
            }
        }
        return $children;
    }
}
