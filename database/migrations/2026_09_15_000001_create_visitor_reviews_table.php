<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('origin')->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('body');
            $table->string('youtube_url', 500)->nullable();
            $table->boolean('is_visible')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('is_visible');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_reviews');
    }
};
