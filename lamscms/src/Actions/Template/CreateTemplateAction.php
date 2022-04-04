<?php
namespace App\Actions\Template;

use App\Domain\Template;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class CreateTemplateAction extends TemplateAction
{

    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["title", "type", "body"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $template = new Template(...$formData);
        $id = $this->templateRepository->create($template);
        $template->setID($id);
        return $this->respondWithData($template);
    }
}
