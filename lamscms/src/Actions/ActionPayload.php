<?php

declare(strict_types=1);

namespace App\Actions;

use JsonSerializable;

class ActionPayload implements JsonSerializable
{

    /**
     * @param int $statusCode
     * @param array|object|string|null $data
     * @param ActionError|null $error
     */
    public function __construct(
        public int $statusCode = 200,
        public object|array|string|null $data = null,
        public ?ActionError $error = null
    )
    {
    }

    /**
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return array|null|object|string
     */
    public function getData(): object|array|string|null
    {
        return $this->data;
    }

    /**
     * @return ActionError|null
     */
    public function getError(): ?ActionError
    {
        return $this->error;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        $payload = [
            'statusCode' => $this->statusCode,
        ];

        if ($this->data !== null) {
            $payload['data'] = $this->data;
        } elseif ($this->error !== null) {
            $payload['error'] = $this->error;
        }

        return $payload;
    }
}
