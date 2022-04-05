<?php
declare(strict_types=1);

use App\Actions\Article\CreateArticleAction;
use App\Actions\Article\DeleteArticleAction;
use App\Actions\Article\DeleteArticlesAction;
use App\Actions\Article\PublishArticleAction;
use App\Actions\Article\PublishArticlesAction;
use App\Actions\Article\UpdateArticleAction;
use App\Actions\Article\ViewArticleAction;
use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\ListCategoryAction;
use App\Actions\Category\ListParentCandidatesOfCategoryAction;
use App\Actions\Category\MoveCategoryDownAction;
use App\Actions\Category\MoveCategoryUpAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Actions\Category\ViewCategoryAction;
use App\Actions\Settings\UpdateSettingsAction;
use App\Actions\Settings\ViewSettingsAction;
use App\Actions\Template\CreateTemplateAction;
use App\Actions\Template\DeleteTemplateAction;
use App\Actions\Template\ListTemplateAction;
use App\Actions\Template\UpdateTemplateAction;
use App\Actions\Template\ViewTemplateAction;
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
    $app->post('/articles', ListArticleAction::class);
    $app->post('/article', CreateArticleAction::class);
    $app->put('/article', UpdateArticleAction::class);
    $app->delete('/article/{id}', DeleteArticleAction::class);
    $app->delete('/articles', DeleteArticlesAction::class);
    $app->post('/article/publish-article/{id}', PublishArticleAction::class);
    $app->post('/article/publish-articles', PublishArticlesAction::class);

    $app->patch('/settings', UpdateSettingsAction::class);
    $app->get('/settings', ViewSettingsAction::class);

    $app->get('/categories', ListCategoryAction::class);
    $app->get('/category/parentCandidates', ListParentCandidatesOfCategoryAction::class);
    $app->get('/category/parentCandidates/{id}', ListParentCandidatesOfCategoryAction::class);
    $app->get('/category/{id}', ViewCategoryAction::class);
    $app->post('/category', CreateCategoryAction::class);
    $app->delete('/category/{id}', DeleteCategoryAction::class);
    $app->post('/category/move-up/{id}', MoveCategoryUpAction::class);
    $app->post('/category/move-down/{id}', MoveCategoryDownAction::class);
    $app->put('/category/{id}', UpdateCategoryAction::class);

    $app->get('/templates', ListTemplateAction::class);
    $app->get('/template/{id}', ViewTemplateAction::class);
    $app->post('/template', CreateTemplateAction::class);
    $app->delete('/template/{id}', DeleteTemplateAction::class);
    $app->put('/template/{id}', UpdateTemplateAction::class);
};
