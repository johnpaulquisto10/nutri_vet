<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('role_id')->after('id')->default(2);
            $table->string('full_name')->after('role_id')->nullable();
            $table->string('phone_number', 20)->after('email')->nullable();
            $table->boolean('is_active')->after('phone_number')->default(true);
            $table->timestamp('last_login_at')->after('is_active')->nullable();

            $table->foreign('role_id')->references('role_id')->on('roles')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->index('role_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropIndex(['role_id']);
            $table->dropIndex(['is_active']);
            $table->dropColumn(['role_id', 'full_name', 'phone_number', 'is_active', 'last_login_at']);
        });
    }
};
