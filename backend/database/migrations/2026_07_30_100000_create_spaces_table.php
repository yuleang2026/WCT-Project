<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spaces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['event', 'office'])->index();
            $table->text('description')->nullable();
            $table->unsignedInteger('capacity')->default(0);
            $table->decimal('price', 12, 2)->default(0);
            $table->enum('price_unit', ['hour', 'day', 'month'])->default('hour');
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->string('location')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
