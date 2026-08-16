<?php

use App\Http\Controllers\Api\Admin\BookingController;
use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\EquipmentController;
use App\Http\Controllers\Api\Admin\InvoiceController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\SpaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin,superadmin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        Route::get('/bookings', [BookingController::class, 'index']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::post('/bookings/{booking}/approve', [BookingController::class, 'approve']);
        Route::post('/bookings/{booking}/reject', [BookingController::class, 'reject']);
        Route::post('/bookings/{booking}/complete', [BookingController::class, 'complete']);
        Route::post('/bookings/{booking}/invoices/monthly', [InvoiceController::class, 'generateMonthly']);

        Route::apiResource('spaces', SpaceController::class);
        Route::post('/spaces/{space}/image', [SpaceController::class, 'uploadImage']);

        Route::apiResource('equipment', EquipmentController::class)->except(['show']);

        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::get('/payments/{payment}/proof', [PaymentController::class, 'downloadProof']);
        Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
        Route::post('/payments/{payment}/reject', [PaymentController::class, 'reject']);

        Route::get('/invoices', [InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
        Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download']);

        Route::get('/contracts', [ContractController::class, 'index']);
        Route::get('/contracts/{contract}', [ContractController::class, 'show']);
        Route::post('/contracts/{contract}/regenerate', [ContractController::class, 'regenerate']);
        Route::get('/contracts/{contract}/download', [ContractController::class, 'download']);

        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/bookings/excel', [ReportController::class, 'exportBookingsExcel']);
        Route::get('/reports/bookings/pdf', [ReportController::class, 'exportBookingsPdf']);
        Route::get('/reports/revenue/excel', [ReportController::class, 'exportRevenueExcel']);
    });
