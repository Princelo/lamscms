<?php
namespace App\Actions\Category;

use Psr\Http\Message\ResponseInterface as Response;

class ListParentCandidatesOfCategoryAction extends CategoryAction
{

    protected function action(): Response
    {
        $all = $this->categoryRepository->all();
        $parentCandidates = array_values(array_filter($all, fn ($candidate) => !$candidate->containsContent()));
        if (isset($this->args['id'])) {
            $id = intval($this->args['id']);
            $parentCandidates = $this->filtered($all, $id);
        }
        return $this->respondWithData($parentCandidates);
    }

    private function filtered(array $parentCandidates, int $id): array
    {
        $parentCandidates = array_values(array_filter($parentCandidates,
            fn ($candidate) => $candidate->getID() != $id));
        foreach ($parentCandidates as $v) {
            if ($v->getParentID() == $id) {
                $parentCandidates = $this->filtered($parentCandidates, $v->getID());
            }
        }
        return $parentCandidates;
    }
}
