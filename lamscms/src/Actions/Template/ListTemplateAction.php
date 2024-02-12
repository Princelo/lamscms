<?php
namespace App\Actions\Template;

use App\Actions\PaginationRequest;
use App\Pagination\Pagination;
use Psr\Http\Message\ResponseInterface as Response;

class ListTemplateAction extends TemplateAction
{

    protected function action(): Response
    {
        $hasBody = file_get_contents('php://input') != null;
        if ($hasBody) {
            $formArray = (array) $this->getFormData();
            $request = new PaginationRequest(...$formArray);
        } else {
            return $this->respondWithData($this->templateRepository->all());
        }
        $pagination = new Pagination($request->getPage(), $request->getSize());
        $paginated = $this->templateRepository->paginated($pagination);
        return $this->respondWithData($paginated);
    }
}
