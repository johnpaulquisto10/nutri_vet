<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Models ===\n\n";

// Test Role
echo "1. Testing Role model:\n";
$roles = App\Models\Role::all();
foreach ($roles as $role) {
    echo "   - {$role->role_name} (ID: {$role->role_id})\n";
}

// Test User with Role
echo "\n2. Testing User with Role relationship:\n";
$users = App\Models\User::with('role')->get();
foreach ($users as $user) {
    $roleName = $user->role ? $user->role->role_name : 'NULL';
    echo "   - {$user->full_name} ({$user->email}) => Role: {$roleName} (role_id: {$user->role_id})\n";
}

// Test specific admin user
echo "\n3. Testing Admin User specifically:\n";
$admin = App\Models\User::with('role')->where('email', 'admin@nutrivet.com')->first();
if ($admin) {
    echo "   - Admin found: {$admin->full_name}\n";
    echo "   - role_id field: {$admin->role_id}\n";
    echo "   - Relation loaded: " . ($admin->relationLoaded('role') ? 'YES' : 'NO') . "\n";
    echo "   - Role object: " . ($admin->role ? 'EXISTS' : 'NULL') . "\n";
    if ($admin->role) {
        echo "   - Role name: {$admin->role->role_name}\n";
        echo "   - Role ID from object: {$admin->role->role_id}\n";
    }
}

echo "\n=== Done ===\n";
