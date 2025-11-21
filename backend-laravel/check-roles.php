<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING ROLES IN DATABASE ===\n\n";

$roles = \App\Models\Role::all();

if ($roles->count() === 0) {
    echo "❌ NO ROLES FOUND! Run seeders first:\n";
    echo "   php artisan db:seed\n\n";
} else {
    echo "✅ Roles found:\n";
    foreach ($roles as $role) {
        echo "   - ID: {$role->role_id}, Name: '{$role->role_name}'\n";
    }
    echo "\n";

    $farmer = \App\Models\Role::where('role_name', 'Farmer')->first();
    if ($farmer) {
        echo "✅ Farmer role exists (ID: {$farmer->role_id})\n";
    } else {
        echo "⚠️ Looking for 'Farmer' with capital F...\n";
        $farmerLower = \App\Models\Role::where('role_name', 'farmer')->first();
        if ($farmerLower) {
            echo "✅ Found 'farmer' with lowercase (ID: {$farmerLower->role_id})\n";
            echo "   You need to update the role name to 'Farmer'\n";
        } else {
            echo "❌ No farmer role found!\n";
        }
    }
}
