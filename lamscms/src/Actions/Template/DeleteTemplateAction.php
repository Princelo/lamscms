<?php
declare(strict_types=1);

namespace App\Actions\Template;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteTemplateAction extends TemplateAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $this->templateRepository->delete($id);
        return $this->respondWithData("The template has been deleted successfully");
    }
}
