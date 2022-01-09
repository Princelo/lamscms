<?php
declare(strict_types=1);

namespace App\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $username = $this->args['username'];
        $this->userRepository->delete($username);
        return $this->respondWithData("The user has been deleted successfully");
    }
}
