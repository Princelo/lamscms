<?php
declare(strict_types=1);

namespace App\Actions\Template;

use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;

class ViewTemplateAction extends TemplateAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = intval($this->args['id']);
        $template = $this->templateRepository->one($id);
        if ($template == null) {
            throw new DomainRecordNotFoundException("the template you queried doesn't exist");
        }

        return $this->respondWithData($template);
    }
}
