<?php
namespace App\Actions\Settings;

use App\Actions\Action;
use App\Repository\SettingsRepository;
use Psr\Log\LoggerInterface;

abstract class SettingsAction extends Action
{
    public function __construct(
        LoggerInterface $logger,
        protected SettingsRepository $settingsRepository
    )
    {
        parent::__construct($logger);
    }
}
