<?php
declare(strict_types=1);

namespace App\Actions\User;

use App\Domain\User;
use App\Messages\DefaultMessage;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class UpdateUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["id", "enabled", "role"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        $user = new User(...$formData);
        $updated = $this->userRepository->update($user);
        return $this->respondWithData($updated);
    }
}
