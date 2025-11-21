<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING ADMIN VIEW OF INSURANCE APPLICATIONS ===\n\n";

// Get all applications with relationships
$applications = \App\Models\InsuranceApplication::with([
    'applicant',
    'barangay',
    'animalType',
    'purpose',
    'status'
])->orderBy('submitted_at', 'desc')->get();

echo "📊 Total Applications: {$applications->count()}\n\n";

foreach ($applications as $app) {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "ID: {$app->application_id}\n";
    echo "Applicant: {$app->applicant->name}\n";
    echo "Animal Type: " . ($app->animalType ? $app->animalType->type_name : 'N/A') . "\n";
    echo "Purpose: {$app->purpose->purpose_name}\n";
    echo "Barangay: {$app->barangay->barangay_name}\n";
    echo "Number of Heads: {$app->number_of_heads}\n";
    echo "Status: {$app->status->status_name}\n";
    echo "Submitted: {$app->submitted_at}\n";
}

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✅ Admin dapat makita lahat ng applications na ito!\n";
echo "👉 Check http://localhost:5173/admin/insurance-applications\n";
