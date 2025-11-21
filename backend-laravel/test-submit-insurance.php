<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING INSURANCE APPLICATION SUBMISSION ===\n\n";

// Get farmer user
$farmer = \App\Models\User::where('email', 'farmer@nutrivet.com')->first();
if (!$farmer) {
    echo "❌ Farmer user not found!\n";
    exit(1);
}

echo "✅ Farmer found: {$farmer->name}\n";

// Get reference data
$animalType = \App\Models\AnimalType::first();
$purpose = \App\Models\AnimalPurpose::first();
$barangay = \App\Models\Barangay::first();
$pendingStatus = \App\Models\InsuranceApplicationStatus::where('status_name', 'Pending')->first();

echo "✅ Animal Type: {$animalType->type_name}\n";
echo "✅ Purpose: {$purpose->purpose_name}\n";
echo "✅ Barangay: {$barangay->barangay_name}\n";
echo "✅ Status: {$pendingStatus->status_name}\n\n";

// Create application
$application = \App\Models\InsuranceApplication::create([
    'applicant_id' => $farmer->id,
    'animal_type_id' => $animalType->animal_type_id,
    'purpose_id' => $purpose->purpose_id,
    'barangay_id' => $barangay->barangay_id,
    'status_id' => $pendingStatus->status_id,
    'contact_number' => '09123456789',
    'number_of_heads' => 10,
    'age_months' => 18,
    'breed' => 'Philippine Native',
    'basic_color' => 'Brown',
    'male_count' => 4,
    'female_count' => 6,
    'submitted_at' => now()
]);

echo "✅ APPLICATION CREATED!\n";
echo "   ID: {$application->application_id}\n";
echo "   Applicant: {$application->applicant->name}\n";
echo "   Animal Type: {$application->animalType->type_name}\n";
echo "   Barangay: {$application->barangay->barangay_name}\n";
echo "   Heads: {$application->number_of_heads}\n";
echo "   Status: {$application->status->status_name}\n\n";

// Check total applications
$total = \App\Models\InsuranceApplication::count();
echo "📊 Total applications in database: {$total}\n";

echo "\n✅ Test completed successfully!\n";
echo "👉 Refresh admin dashboard to see the new application\n";
