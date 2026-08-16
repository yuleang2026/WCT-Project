<?php

use App\Http\Controllers\Api\Customer\BookingController;
use App\Http\Controllers\Api\Customer\ContractController;
use App\Http\Controllers\Api\Customer\InvoiceController;
use App\Http\Controllers\Api\Customer\NotificationController;
use App\Http\Controllers\Api\Customer\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:customer,admin,superadmin'])
    ->prefix('customer')
    ->group(function () {
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::post('/bookings/event', [BookingController::class, 'storeEvent']);
        Route::post('/bookings/office', [BookingController::class, 'storeOffice']);
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

        Route::get('/contracts', [ContractController::class, 'index']);
        Route::get('/contracts/{contract}', [ContractController::class, 'show']);
        Route::post('/contracts/{contract}/sign', [ContractController::class, 'sign']);
        Route::get('/contracts/{contract}/download', [ContractController::class, 'download']);

        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::get('/payments/{payment}/proof', [PaymentController::class, 'downloadProof']);

        Route::get('/invoices', [InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
        Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    });
