<?php
namespace App\Actions\Template;

use Psr\Http\Message\ResponseInterface as Response;

class ListTemplateAction extends TemplateAction
{

    protected function action(): Response
    {
        return $this->respondWithData($this->templateRepository->all());
    }
}
