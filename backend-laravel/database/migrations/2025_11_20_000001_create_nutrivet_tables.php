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
        // Roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->tinyIncrements('role_id');
            $table->string('role_name', 50)->unique();
            $table->string('role_description')->nullable();
            $table->timestamps();

            $table->index('role_name');
        });

        // Provinces table
        Schema::create('provinces', function (Blueprint $table) {
            $table->smallIncrements('province_id');
            $table->string('province_name', 100)->unique();
            $table->timestamp('created_at')->useCurrent();

            $table->index('province_name');
        });

        // Municipalities table
        Schema::create('municipalities', function (Blueprint $table) {
            $table->smallIncrements('municipality_id');
            $table->unsignedSmallInteger('province_id');
            $table->string('municipality_name', 100);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('province_id')->references('province_id')->on('provinces')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->index('province_id');
            $table->index('municipality_name');
            $table->unique(['municipality_name', 'province_id'], 'uk_municipality_province');
        });

        // Barangays table
        Schema::create('barangays', function (Blueprint $table) {
            $table->smallIncrements('barangay_id');
            $table->unsignedSmallInteger('municipality_id');
            $table->string('barangay_name', 100);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('municipality_id')->references('municipality_id')->on('municipalities')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->index('municipality_id');
            $table->index('barangay_name');
            $table->unique(['barangay_name', 'municipality_id'], 'uk_barangay_municipality');
        });



        // User addresses table
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedSmallInteger('barangay_id');
            $table->string('sitio', 100)->nullable();
            $table->string('street_address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->foreign('barangay_id')->references('barangay_id')->on('barangays')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->index('user_id');
            $table->index('barangay_id');
            $table->index(['latitude', 'longitude'], 'idx_coordinates');
            $table->index('is_primary');
        });

        // Animal types table
        Schema::create('animal_types', function (Blueprint $table) {
            $table->smallIncrements('animal_type_id');
            $table->string('animal_type_name', 50)->unique();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('animal_type_name');
        });

        // Animal purposes table
        Schema::create('animal_purposes', function (Blueprint $table) {
            $table->smallIncrements('purpose_id');
            $table->string('purpose_name', 50)->unique();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('purpose_name');
        });

        // Insurance application statuses table
        Schema::create('insurance_application_statuses', function (Blueprint $table) {
            $table->tinyIncrements('status_id');
            $table->string('status_name', 50)->unique();
            $table->string('status_description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('status_name');
        });

        // Insurance applications table
        Schema::create('insurance_applications', function (Blueprint $table) {
            $table->id('application_id');
            $table->foreignId('applicant_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedSmallInteger('barangay_id');
            $table->unsignedSmallInteger('animal_type_id');
            $table->unsignedSmallInteger('purpose_id');
            $table->unsignedTinyInteger('status_id')->default(1);
            $table->string('animal_type_other', 100)->nullable()->comment('For "Other" animal types');
            $table->string('contact_number', 20);
            $table->unsignedInteger('number_of_heads');
            $table->unsignedSmallInteger('age_months')->nullable();
            $table->string('breed', 100)->nullable();
            $table->string('basic_color', 50)->nullable();
            $table->unsignedInteger('male_count')->default(0);
            $table->unsignedInteger('female_count')->default(0);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->text('admin_notes')->nullable();

            $table->foreign('barangay_id')->references('barangay_id')->on('barangays')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('animal_type_id')->references('animal_type_id')->on('animal_types')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('purpose_id')->references('purpose_id')->on('animal_purposes')
                ->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('status_id')->references('status_id')->on('insurance_application_statuses')
                ->onDelete('restrict')->onUpdate('cascade');

            $table->index('applicant_id');
            $table->index('status_id');
            $table->index('animal_type_id');
            $table->index('submitted_at');
            $table->index('reviewed_by');
            $table->index(['applicant_id', 'status_id', 'submitted_at'], 'idx_composite_search');
        });

        // Disease categories table
        Schema::create('disease_categories', function (Blueprint $table) {
            $table->smallIncrements('category_id');
            $table->string('category_name', 100)->unique();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('category_name');
        });

        // Diseases table
        Schema::create('diseases', function (Blueprint $table) {
            $table->smallIncrements('disease_id');
            $table->unsignedSmallInteger('category_id')->nullable();
            $table->string('disease_name');
            $table->string('common_name')->nullable();
            $table->text('description')->nullable();
            $table->text('symptoms')->nullable();
            $table->text('treatment')->nullable();
            $table->text('prevention')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('category_id')->references('category_id')->on('disease_categories')
                ->onDelete('set null')->onUpdate('cascade');
            $table->index('disease_name');
            $table->index('category_id');
            $table->index('is_active');
        });

        // Report statuses table
        Schema::create('report_statuses', function (Blueprint $table) {
            $table->tinyIncrements('report_status_id');
            $table->string('status_name', 50)->unique();
            $table->string('status_description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('status_name');
        });

        // Disease reports table
        Schema::create('disease_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedSmallInteger('disease_id')->nullable();
            $table->string('disease_name_custom')->nullable()->comment('For diseases not in master list');
            $table->string('animal_name')->nullable();
            $table->unsignedTinyInteger('report_status_id')->default(1);
            $table->text('description');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('report_date');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->text('admin_notes')->nullable();

            $table->foreign('disease_id')->references('disease_id')->on('diseases')
                ->onDelete('set null')->onUpdate('cascade');
            $table->foreign('report_status_id')->references('report_status_id')->on('report_statuses')
                ->onDelete('restrict')->onUpdate('cascade');

            $table->index('reporter_id');
            $table->index('disease_id');
            $table->index('report_status_id');
            $table->index('report_date');
            $table->index(['latitude', 'longitude'], 'idx_coordinates');
            $table->index('submitted_at');
            $table->index(['reporter_id', 'report_status_id', 'report_date'], 'idx_composite_search');
        });

        // Report images table
        Schema::create('report_images', function (Blueprint $table) {
            $table->id('image_id');
            $table->foreignId('report_id')->constrained('disease_reports', 'report_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('image_path', 500);
            $table->string('image_filename');
            $table->unsignedInteger('image_size')->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamp('uploaded_at')->useCurrent();

            $table->index('report_id');
            $table->index('is_primary');
        });

        // Advisory severities table
        Schema::create('advisory_severities', function (Blueprint $table) {
            $table->tinyIncrements('severity_id');
            $table->string('severity_name', 50)->unique();
            $table->string('severity_color', 50)->nullable();
            $table->string('severity_description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('severity_name');
        });

        // Advisory categories table
        Schema::create('advisory_categories', function (Blueprint $table) {
            $table->smallIncrements('category_id');
            $table->string('category_name', 100)->unique();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('category_name');
        });

        // Advisories table
        Schema::create('advisories', function (Blueprint $table) {
            $table->id('advisory_id');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedSmallInteger('category_id')->nullable();
            $table->unsignedTinyInteger('severity_id');
            $table->string('title', 500);
            $table->text('description');
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('category_id')->references('category_id')->on('advisory_categories')
                ->onDelete('set null')->onUpdate('cascade');
            $table->foreign('severity_id')->references('severity_id')->on('advisory_severities')
                ->onDelete('restrict')->onUpdate('cascade');

            $table->index('created_by');
            $table->index('category_id');
            $table->index('severity_id');
            $table->index('is_active');
            $table->index('published_at');
            $table->index(['is_active', 'severity_id', 'published_at'], 'idx_composite_search');
        });

        // Advisory reads table
        Schema::create('advisory_reads', function (Blueprint $table) {
            $table->id('read_id');
            $table->foreignId('advisory_id')->constrained('advisories', 'advisory_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('read_at')->useCurrent();

            $table->unique(['advisory_id', 'user_id'], 'uk_advisory_user');
            $table->index('advisory_id');
            $table->index('user_id');
        });

        // Activity logs table
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->string('action_type', 100);
            $table->string('table_name', 100)->nullable();
            $table->unsignedInteger('record_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('user_id');
            $table->index('action_type');
            $table->index('table_name');
            $table->index('created_at');
            $table->index(['user_id', 'action_type', 'created_at'], 'idx_composite_search');
        });

        // Notifications table
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->string('notification_type', 50);
            $table->string('title');
            $table->text('message');
            $table->string('related_table', 100)->nullable();
            $table->unsignedInteger('related_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('read_at')->nullable();

            $table->index('user_id');
            $table->index('is_read');
            $table->index('created_at');
            $table->index(['user_id', 'is_read', 'created_at'], 'idx_composite_search');
        });

        // System settings table
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id('setting_id');
            $table->string('setting_key', 100)->unique();
            $table->text('setting_value')->nullable();
            $table->string('setting_type', 50)->default('string');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();

            $table->index('setting_key');
            $table->index('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('advisory_reads');
        Schema::dropIfExists('advisories');
        Schema::dropIfExists('advisory_categories');
        Schema::dropIfExists('advisory_severities');
        Schema::dropIfExists('report_images');
        Schema::dropIfExists('disease_reports');
        Schema::dropIfExists('report_statuses');
        Schema::dropIfExists('diseases');
        Schema::dropIfExists('disease_categories');
        Schema::dropIfExists('insurance_applications');
        Schema::dropIfExists('insurance_application_statuses');
        Schema::dropIfExists('animal_purposes');
        Schema::dropIfExists('animal_types');
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('barangays');
        Schema::dropIfExists('municipalities');
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('roles');
    }
};
