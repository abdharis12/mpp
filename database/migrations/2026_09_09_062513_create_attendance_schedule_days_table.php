<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_schedule_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_schedule_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('day_of_week')->unsigned()->index();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_working_day')->default(false);
            $table->timestamps();

            $table->unique(['attendance_schedule_id', 'day_of_week'], 'schedule_days_schedule_day_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_schedule_days');
    }
};
