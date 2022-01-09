<?php
declare(strict_types=1);

namespace App\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class ResetPasswordAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormData();
        if (!property_exists($formData, "id")) {
            $this->logger->error("bad request. the request doesn't contain id field.",
                [request_body()]);
            throw new HttpBadRequestException($this->request, "Request doesn't contain id field.");
        }
        $id = $formData->id;
        $password = $this->userRepository->resetPassword($id);
        return $this->respondWithData(['password' => $password]);
    }
}
