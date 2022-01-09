<?php
declare(strict_types=1);

namespace App\Actions\User;

use App\Actions\Action;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;

abstract class UserAction extends Action
{
    /**
     * @param LoggerInterface $logger
     * @param UserRepository $userRepository
     */
    public function __construct(
        LoggerInterface $logger,
        protected UserRepository $userRepository
    ) {
        parent::__construct($logger);
    }
}
