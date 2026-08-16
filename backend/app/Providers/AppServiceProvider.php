<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Case-insensitive LIKE that works identically on PostgreSQL and SQLite
        // (used by the test suite), unlike the PostgreSQL-only "ilike" operator.
        Builder::macro('whereLikeInsensitive', function (string $column, string $value) {
            /** @var Builder $this */
            return $this->whereRaw('LOWER('.$column.') LIKE ?', ['%'.mb_strtolower($value).'%']);
        });

        Builder::macro('orWhereLikeInsensitive', function (string $column, string $value) {
            /** @var Builder $this */
            return $this->orWhereRaw('LOWER('.$column.') LIKE ?', ['%'.mb_strtolower($value).'%']);
        });
    }
}
