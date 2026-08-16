<?php

use App\Http\Controllers\Api\SuperAdmin\AuditLogController;
use App\Http\Controllers\Api\SuperAdmin\SettingController;
use App\Http\Controllers\Api\SuperAdmin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin,superadmin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/settings', [SettingController::class, 'index']);
    });

Route::middleware(['auth:sanctum', 'role:superadmin'])
    ->prefix('superadmin')
    ->group(function () {
        Route::apiResource('users', UserController::class)->except(['show']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);

        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });
