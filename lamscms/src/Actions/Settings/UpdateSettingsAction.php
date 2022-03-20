<?php
namespace App\Actions\Settings;

use App\Domain\Settings;
use Psr\Http\Message\ResponseInterface as Response;

class UpdateSettingsAction extends SettingsAction
{

    protected function action(): Response
    {
        $formData = $this->getFormDataAsArray();
        $settings = new Settings(...$formData);
        $updated = $this->settingsRepository->update($settings);
        return $this->respondWithData($updated);
    }
}
