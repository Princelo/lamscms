<?php
declare(strict_types=1);

namespace App\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;

class ListUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $params = $this->request->getQueryParams();
        if (isset($params['role'])) {
            $users = $this->userRepository->findUserOfRole($params['role']);
        } else {
            $users = $this->userRepository->all();
        }

        return $this->respondWithData($users);
    }
}
