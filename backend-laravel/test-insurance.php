<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get all applications
$applications = \App\Models\InsuranceApplication::with(['status', 'animalType', 'applicant'])->get();

echo "Total applications: " . $applications->count() . "\n\n";

foreach ($applications as $app) {
    echo "ID: {$app->application_id}\n";
    echo "Applicant: {$app->applicant->name}\n";
    echo "Animal Type: {$app->animalType->type_name}\n";
    echo "Status: {$app->status->status_name}\n";
    echo "Heads: {$app->number_of_heads}\n";
    echo "Submitted: {$app->submitted_at}\n";
    echo "---\n";
}
