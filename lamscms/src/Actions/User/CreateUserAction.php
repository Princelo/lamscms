<?php
declare(strict_types=1);

namespace App\Actions\User;

use App\Domain\User;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class CreateUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $mustContains = ["username", "password"];
        $missingFields = validate_form($formData, $mustContains);
        if (!empty($missingFields)) {
            $this->logger->error("bad request. the request should contain fields:",
                [$mustContains, request_body()]);
            throw new HttpBadRequestException($this->request, "the request body you sent is invalid");
        }
        if (mb_strtolower($formData['username']) == 'unknown') {
            throw new HttpBadRequestException($this->request, "can not use a built in username \"unknown\"");
        }
        $role = $formData['role'] ?? 'admin';
        $enabled = $formData['enabled'] ?? false;
        $user = new User(username: $formData['username'],
                         role: $role,
                         enabled: $enabled,
                         password: password_hash($formData['password'], PASSWORD_DEFAULT));
        $id = $this->userRepository->create($user);
        $user->setID($id);
        return $this->respondWithData($user);
    }
}
