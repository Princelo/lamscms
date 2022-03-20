<?php
namespace App\Actions\Settings;

use Psr\Http\Message\ResponseInterface as Response;

class ViewSettingsAction extends SettingsAction
{

    protected function action(): Response
    {
        $settings = $this->settingsRepository->get();
        return $this->respondWithData($settings);
    }
}
