<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== DISEASE REPORTS IN DATABASE ===" . PHP_EOL . PHP_EOL;

$reports = App\Models\DiseaseReport::select('report_id', 'disease_name_custom', 'animal_name', 'latitude', 'longitude', 'address')
    ->orderBy('report_id')
    ->get();

echo "Total Reports: " . $reports->count() . PHP_EOL . PHP_EOL;

if ($reports->count() === 0) {
    echo "⚠️  NO REPORTS FOUND IN DATABASE!" . PHP_EOL;
} else {
    foreach ($reports as $r) {
        echo "Report ID: " . $r->report_id . PHP_EOL;
        echo "  Disease: " . ($r->disease_name_custom ?? 'N/A') . PHP_EOL;
        echo "  Animal: " . ($r->animal_name ?? 'N/A') . PHP_EOL;
        echo "  Latitude: " . ($r->latitude ?? 'NULL') . PHP_EOL;
        echo "  Longitude: " . ($r->longitude ?? 'NULL') . PHP_EOL;
        echo "  Address: " . ($r->address ?? 'N/A') . PHP_EOL;

        if (!$r->latitude || !$r->longitude) {
            echo "  ⚠️  MISSING COORDINATES!" . PHP_EOL;
        }

        echo PHP_EOL;
    }
}

echo "=== END ===" . PHP_EOL;
