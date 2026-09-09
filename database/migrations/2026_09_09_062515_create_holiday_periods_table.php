<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holiday_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('holiday_id')->constrained()->cascadeOnDelete();
            $table->date('holiday_date')->index();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_full_day')->default(false);
            $table->timestamps();

            $table->unique(['holiday_id', 'holiday_date', 'start_time', 'end_time'], 'holiday_periods_period_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holiday_periods');
    }
};
