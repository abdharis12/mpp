<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('employee_code', 100)->index();
            $table->string('name')->index();
            $table->string('position')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'employee_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
