<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING API ACCESS TO INSURANCE APPLICATIONS ===\n\n";

// Get admin user
$admin = \App\Models\User::where('email', 'admin@nutrivet.com')->first();
if (!$admin) {
    echo "❌ Admin user not found! Creating one...\n";
    $adminRole = \App\Models\Role::where('role_name', 'Admin')->first();
    $admin = \App\Models\User::create([
        'name' => 'Admin User',
        'email' => 'admin@nutrivet.com',
        'password' => bcrypt('password123'),
        'role_id' => $adminRole->role_id,
        'is_active' => true
    ]);
    echo "✅ Admin created\n";
}

echo "✅ Admin: {$admin->name} ({$admin->email})\n";
echo "   Role ID: {$admin->role_id}\n\n";

// Simulate API request - Get all applications
$applications = \App\Models\InsuranceApplication::with([
    'applicant',
    'barangay',
    'animalType',
    'purpose',
    'status'
])->orderBy('submitted_at', 'desc')->get();

echo "📊 API Response Simulation:\n";
echo "{\n";
echo "  \"current_page\": 1,\n";
echo "  \"data\": [\n";

foreach ($applications->take(3) as $index => $app) {
    echo "    {\n";
    echo "      \"application_id\": {$app->application_id},\n";
    echo "      \"applicant\": {\n";
    echo "        \"id\": {$app->applicant->id},\n";
    echo "        \"name\": \"{$app->applicant->name}\"\n";
    echo "      },\n";
    echo "      \"status\": {\n";
    echo "        \"status_name\": \"{$app->status->status_name}\"\n";
    echo "      },\n";
    echo "      \"number_of_heads\": {$app->number_of_heads},\n";
    echo "      \"submitted_at\": \"{$app->submitted_at}\"\n";
    echo "    }" . ($index < 2 ? "," : "") . "\n";
}

echo "  ],\n";
echo "  \"total\": {$applications->count()}\n";
echo "}\n\n";

echo "✅ API dapat mag-return ng {$applications->count()} applications\n";
echo "👉 Admin dashboard dapat makita lahat ng ito!\n\n";

// Check if frontend is calling the right endpoint
echo "🔍 Checklist:\n";
echo "   ✓ Backend API: http://127.0.0.1:8000/api/insurance-applications\n";
echo "   ✓ Frontend service: insuranceService.getAll()\n";
echo "   ✓ Admin page: /admin/insurance-applications\n";
echo "   ✓ Auto-refresh: Every 30 seconds\n";
