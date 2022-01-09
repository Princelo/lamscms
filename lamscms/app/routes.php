<?php
declare(strict_types=1);

use App\Actions\Article\CreateArticleAction;
use App\Actions\Article\DeleteArticleAction;
use App\Actions\Article\DeleteArticlesAction;
use App\Actions\Article\UpdateArticleAction;
use App\Actions\Article\ViewArticleAction;
use App\Actions\User\ChangePasswordAction;
use App\Actions\User\CreateUserAction;
use App\Actions\User\DeleteUserAction;
use App\Actions\User\UpdateUserAction;
use App\Actions\User\ListUserAction;
use App\Actions\User\ResetPasswordAction;
use App\Actions\User\ViewUserAction;
use App\Actions\Article\ListArticleAction;
use Slim\App;

return function (App $app) {
    $app->get('/user/{id}', ViewUserAction::class);
    $app->get('/users', ListUserAction::class);
    $app->post('/user', CreateUserAction::class);
    $app->delete('/user/{username}', DeleteUserAction::class);
    $app->patch('/user', UpdateUserAction::class);
    $app->post('/user/reset-password', ResetPasswordAction::class);
    $app->post('/user/change-password', ChangePasswordAction::class);

    $app->get('/article/{id}', ViewArticleAction::class);
    $app->get('/articles', ListArticleAction::class);
    $app->post('/article', CreateArticleAction::class);
    $app->put('/article', UpdateArticleAction::class);
    $app->delete('/article/{id}', DeleteArticleAction::class);
    $app->delete('/articles', DeleteArticlesAction::class);
    $app->post('/article/publish-article/{id}', PublishArticleAction::class);
    $app->post('/article/publish-articles', PublishArticlesAction::class);
};
