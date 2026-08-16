<?php

use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\SpaceController;
use Illuminate\Support\Facades\Route;

Route::get('/spaces', [SpaceController::class, 'index']);
Route::get('/spaces/{space}', [SpaceController::class, 'show']);
Route::get('/spaces/{space}/availability', [SpaceController::class, 'availability']);
Route::get('/equipment', [EquipmentController::class, 'index']);
