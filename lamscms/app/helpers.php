<?php

function randomPassword(): string
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
