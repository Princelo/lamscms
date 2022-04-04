<?php
namespace App\Actions\Template;

use App\Actions\Action;
use App\Repository\TemplateRepository;
use Psr\Log\LoggerInterface;

abstract class TemplateAction extends Action
{
    public function __construct(LoggerInterface $logger,
                                protected TemplateRepository $templateRepository)
    {
        parent::__construct($logger);
    }
}
