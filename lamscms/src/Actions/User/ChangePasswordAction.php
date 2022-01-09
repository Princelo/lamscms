<?php
declare(strict_types=1);

namespace App\Actions\User;

use App\Actions\ActionError;
use App\Actions\ActionPayload;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class ChangePasswordAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["username", "oldPassword", "newPassword"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $username = $formData['username'];
        if (!$this->userRepository->validatePassword($username, $formData['oldPassword'])) {
            $error = new ActionError(ActionError::VERIFICATION_ERROR, "The old password you sent is not correct.");
            $payload = new ActionPayload(401, error: $error);
            return $this->respond($payload);
        }
        $this->userRepository->changePassword($username, $formData['newPassword']);
        return $this->respondWithData("password changed successfully");
    }

}
