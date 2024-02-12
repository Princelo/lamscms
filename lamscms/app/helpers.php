<?php

use Slim\Psr7\UploadedFile;

function random_password(): string
{
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = []; //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}

function request_body(): string
{
    return file_get_contents('php://input');
}

function validate_form(array $formData, array $mustContains): array
{
    $missingFields = [];
    foreach ($mustContains as $field) {
        if (!array_key_exists($field, $formData)) {
            array_push($missingFields, $field);
        }
    }
    return $missingFields;
}

function quote($str, $sign = "\""): string
{
    if (!starts_with($str, $sign)) {
        $str = $sign . $str;
    }
    if (!ends_with($str, $sign)) {
        $str .= $sign;
    }
    return $str;
}

function starts_with($haystack, $needle): bool
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function ends_with($haystack, $needle): bool
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function now(): string
{
    return date("Y-m-d H:i:s");
}

function current_user(): string
{
    return $_SESSION['user'] ?? 'unknown';
}

function str_to_date(?string $str): ?DateTime
{
    if ($str == null) return null;
    $converted = date_create_from_format("Y-m-d H:i:s", $str);
    if (!$converted) return null;
    return $converted;
}

function sql_in(array $ids, callable $fn = null): string
{
    if ($fn == null) {
        $fn = fn ($v) => intval($v);
    }
    $inStatement = "(";
    $comma = "";
    foreach ($ids as $id) {
        $inStatement .= $comma;
        $inStatement .= $fn($id);
        $comma = ", ";
    }
    $inStatement = ")";
    return $inStatement;
}

function get_file_extension(string $mimetype): string
{
    switch ($mimetype) {
        case "image/png":
            return ".png";
        case "image/jpeg":
            return ".jpg";
        case "image/webp":
            return ".webp";
        case "image/gif":
            return ".gif";
        case "video/webm":
            return ".webm";
        case "audio/webm":
            return ".weba";
        case "audio/wav":
            return ".wav";
        case "video/3gpp":
            return ".3gp";
        case "audio/3gpp":
            return ".3gp";
        case "video/3gpp2":
            return ".3g2";
        case "audio/3gp2":
            return ".3g2";
        case "video/mp2t":
            return ".ts";
        case "audio/opus":
            return ".opus";
        case "video/ogg":
            return ".ogv";
        case "audio/ogg":
            return ".oga";
        case "video/mpeg":
            return ".mpeg";
        case "video/mp4":
            return ".mp4";
        case "audio/mpeg":
            return ".mp3";
        case "audio/midi":
            return ".mid";
        case "audio/x-midi":
            return ".mid";
        case "image/bmp":
            return ".bmp";
        case "image/avif":
            return ".avif";
        case "video/x-msvideo":
            return ".avi";
        case "audio/aac":
            return ".aac";
        default:
            return "bin";
    }
}

function get_mimetype(UploadedFile $uploadedFile): string
{
    $finfo = new \finfo(FILEINFO_MIME);
    $mimetype = $finfo->file($uploadedFile->getFilePath());
    $mimetypeParts = preg_split('/\s*[;,]\s*/', $mimetype);
    return strtolower($mimetypeParts[0]);
}
