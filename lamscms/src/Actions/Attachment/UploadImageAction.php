<?php
declare(strict_types=1);

namespace App\Actions\Attachment;

use App\Actions\Action;
use App\Domain\Attachment;
use App\Repository\AttachmentRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;
use Slim\Exception\HttpBadRequestException;
use StdClass;

class UploadImageAction extends Action
{
    /**
     * @param LoggerInterface $logger
     * @param AttachmentRepository $attachmentRepository
     */
    public function __construct(
        LoggerInterface $logger,
        private AttachmentRepository $attachmentRepository
    ) {
        parent::__construct($logger);
    }

    protected function action(): Response
    {
        $uploadedFiles = $this->request->getUploadedFiles();
        $uploadedFile = $uploadedFiles['file'];
        $mimetype = get_mimetype($uploadedFile);
        if ( ! in_array(get_mimetype($uploadedFile),
            ['image/png',
             'image/gif',
             'image/jpeg',
             'image/webp',
             'image/pjpeg',
             'image/x-png'])) {
            //throw new HttpBadRequestException($this->request, "The type of file uploaded is not allowed");
            $response = new StdClass;
            $response->error = "The type of file uploaded is not allowed";
            $this->response->getBody()->write(stripslashes(json_encode($response)));
            return $this->response->withHeader('Content-Type', 'application/json');
        }
        $size = $uploadedFile->getSize() / 1048576;
        if ($size > 50) {
            $response = new StdClass;
            $response->error = "Maximum 50M of file size";
            $this->response->getBody()->write(stripslashes(json_encode($response)));
            return $this->response->withHeader('Content-Type', 'application/json');
            //throw new HttpBadRequestException($this->request, "Maximum 50M of file size");
        }
        $dest = getcwd().DIRECTORY_SEPARATOR."attachments".DIRECTORY_SEPARATOR;
        $md5 = md5(random_password());
        $newName = $md5.get_file_extension($mimetype);
        $uploadedFile->moveTo($dest.$newName);
        $attachment = new Attachment($uploadedFile->getClientFilename(), $mimetype, $newName);
        $this->attachmentRepository->add($attachment);
        $response = new StdClass;
        $response->link = "http://localhost:8080/attachments/$newName";
        $response->url = "http://localhost:8080/attachments/$newName";
        $this->response->getBody()->write(stripslashes(json_encode($response)));
        return $this->response->withHeader('Content-Type', 'application/json');
    }
}
