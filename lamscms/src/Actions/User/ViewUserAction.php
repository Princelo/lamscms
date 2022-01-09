<?php
declare(strict_types=1);

namespace App\Actions\User;

use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;

class ViewUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $id = $this->args['id'];
        $user = $this->userRepository->one(intval($id));
        if ($user == null) {
            throw new DomainRecordNotFoundException("the user you queried doesn't exist");
        }

        return $this->respondWithData($user);
    }
}
