<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InsuranceApplicationController;
use App\Http\Controllers\Api\DiseaseReportController;
use App\Http\Controllers\Api\AdvisoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReferenceDataController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'farmerDashboard']);
    Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);

    // Insurance applications
    Route::get('/insurance-applications', [InsuranceApplicationController::class, 'index']);
    Route::post('/insurance-applications', [InsuranceApplicationController::class, 'store']);
    Route::get('/insurance-applications/{id}', [InsuranceApplicationController::class, 'show']);
    Route::put('/insurance-applications/{id}', [InsuranceApplicationController::class, 'update']);
    Route::delete('/insurance-applications/{id}', [InsuranceApplicationController::class, 'destroy']);
    Route::get('/insurance-applications/stats/summary', [InsuranceApplicationController::class, 'statistics']);

    // Admin insurance routes
    Route::post('/admin/insurance-applications/{id}/approve', [InsuranceApplicationController::class, 'approve']);
    Route::post('/admin/insurance-applications/{id}/reject', [InsuranceApplicationController::class, 'reject']);

    // Disease reports
    Route::get('/disease-reports', [DiseaseReportController::class, 'index']);
    Route::post('/disease-reports', [DiseaseReportController::class, 'store']);
    Route::get('/disease-reports/{id}', [DiseaseReportController::class, 'show']);
    Route::put('/disease-reports/{id}', [DiseaseReportController::class, 'update']);
    Route::delete('/disease-reports/{id}', [DiseaseReportController::class, 'destroy']);
    Route::get('/disease-reports/map/data', [DiseaseReportController::class, 'mapData']);
    Route::get('/disease-reports/stats/summary', [DiseaseReportController::class, 'statistics']);

    // Admin disease report routes
    Route::post('/admin/disease-reports/{id}/investigate', [DiseaseReportController::class, 'investigate']);
    Route::post('/admin/disease-reports/{id}/resolve', [DiseaseReportController::class, 'resolve']);

    // Advisories
    Route::get('/advisories', [AdvisoryController::class, 'index']);
    Route::get('/advisories/{id}', [AdvisoryController::class, 'show']);
    Route::post('/advisories/{id}/read', [AdvisoryController::class, 'markAsRead']);
    Route::get('/advisories/unread/count', [AdvisoryController::class, 'unreadCount']);

    // Admin advisory routes
    Route::post('/admin/advisories', [AdvisoryController::class, 'store']);
    Route::put('/admin/advisories/{id}', [AdvisoryController::class, 'update']);
    Route::delete('/admin/advisories/{id}', [AdvisoryController::class, 'destroy']);

    // Reference data (for dropdowns)
    Route::get('/reference/barangays', [ReferenceDataController::class, 'barangays']);
    Route::get('/reference/animal-types', [ReferenceDataController::class, 'animalTypes']);
    Route::get('/reference/animal-purposes', [ReferenceDataController::class, 'animalPurposes']);
    Route::get('/reference/diseases', [ReferenceDataController::class, 'diseases']);
    Route::get('/reference/disease-categories', [ReferenceDataController::class, 'diseaseCategories']);
    Route::get('/reference/advisory-categories', [ReferenceDataController::class, 'advisoryCategories']);
    Route::get('/reference/advisory-severities', [ReferenceDataController::class, 'advisorySeverities']);
});
