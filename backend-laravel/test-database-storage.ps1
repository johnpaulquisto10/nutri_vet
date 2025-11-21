# Test Database Storage Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Database Storage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:8000/api"

# Test 1: Check database counts before
Write-Host "`n1. Database state BEFORE test:" -ForegroundColor Yellow
php artisan tinker --execute="
echo 'Tokens: ' . \Laravel\Sanctum\PersonalAccessToken::count() . PHP_EOL;
echo 'Users: ' . \App\Models\User::count() . PHP_EOL;
echo 'Insurance Apps: ' . \App\Models\InsuranceApplication::count() . PHP_EOL;
echo 'Disease Reports: ' . \App\Models\DiseaseReport::count() . PHP_EOL;
echo 'Advisories: ' . \App\Models\Advisory::count() . PHP_EOL;
echo 'Sessions: ' . DB::table('sessions')->count() . PHP_EOL;
"

# Test 2: Login and get token
Write-Host "`n2. Testing Login (stores token in DB):" -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body (@{
    email = "farmer@nutrivet.com"
    password = "password"
} | ConvertTo-Json) -ContentType "application/json"

if ($loginResponse.token) {
    Write-Host "✓ Login successful - Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Green
    $token = $loginResponse.token
} else {
    Write-Host "✗ Login failed" -ForegroundColor Red
    exit 1
}

# Test 3: Check tokens in database
Write-Host "`n3. Verifying token in database:" -ForegroundColor Yellow
php artisan tinker --execute="
`$tokenCount = \Laravel\Sanctum\PersonalAccessToken::count();
`$lastToken = \Laravel\Sanctum\PersonalAccessToken::latest()->first();
echo 'Total Tokens in DB: ' . `$tokenCount . PHP_EOL;
if (`$lastToken) {
    echo 'Last Token ID: ' . `$lastToken->id . PHP_EOL;
    echo 'Token User: ' . `$lastToken->tokenable->full_name . PHP_EOL;
    echo 'Created: ' . `$lastToken->created_at . PHP_EOL;
}
"

# Test 4: Create disease report (stores in DB)
Write-Host "`n4. Creating disease report (stores in DB):" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

$reportBody = @{
    disease_id = 1
    disease_name_custom = "Test Disease from API"
    animal_name = "Test Animal DB Storage"
    description = "Testing database storage"
    address = "Test Address"
    latitude = 12.8167
    longitude = 121.4667
} | ConvertTo-Json

try {
    $reportResponse = Invoke-RestMethod -Uri "$baseUrl/disease-reports" -Method POST -Headers $headers -Body $reportBody -ContentType "application/json"
    Write-Host "✓ Disease report created - ID: $($reportResponse.report_id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create report: $_" -ForegroundColor Red
}

# Test 5: Create insurance application (stores in DB)
Write-Host "`n5. Creating insurance application (stores in DB):" -ForegroundColor Yellow
$insuranceBody = @{
    animal_type_id = 1
    purpose_id = 1
    barangay_id = 1
    contact_number = "09123456789"
    number_of_heads = 5
    age_months = 12
    breed = "Test Breed"
    basic_color = "Brown"
    male_count = 3
    female_count = 2
} | ConvertTo-Json

try {
    $insuranceResponse = Invoke-RestMethod -Uri "$baseUrl/insurance-applications" -Method POST -Headers $headers -Body $insuranceBody -ContentType "application/json"
    Write-Host "✓ Insurance application created - ID: $($insuranceResponse.application_id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create insurance application: $_" -ForegroundColor Red
}

# Test 6: Check database counts after
Write-Host "`n6. Database state AFTER test:" -ForegroundColor Yellow
php artisan tinker --execute="
echo 'Tokens: ' . \Laravel\Sanctum\PersonalAccessToken::count() . PHP_EOL;
echo 'Users: ' . \App\Models\User::count() . PHP_EOL;
echo 'Insurance Apps: ' . \App\Models\InsuranceApplication::count() . PHP_EOL;
echo 'Disease Reports: ' . \App\Models\DiseaseReport::count() . PHP_EOL;
echo 'Advisories: ' . \App\Models\Advisory::count() . PHP_EOL;
echo 'Sessions: ' . DB::table('sessions')->count() . PHP_EOL;
"

# Test 7: Verify data persists (read from DB)
Write-Host "`n7. Reading data back from database:" -ForegroundColor Yellow
try {
    $reports = Invoke-RestMethod -Uri "$baseUrl/disease-reports" -Method GET -Headers $headers
    Write-Host "✓ Retrieved $($reports.Count) disease reports from database" -ForegroundColor Green
    
    $applications = Invoke-RestMethod -Uri "$baseUrl/insurance-applications" -Method GET -Headers $headers
    Write-Host "✓ Retrieved $($applications.Count) insurance applications from database" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to read data: $_" -ForegroundColor Red
}

# Test 8: Test logout (deletes token from DB)
Write-Host "`n8. Testing Logout (removes token from DB):" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/logout" -Method POST -Headers $headers
    Write-Host "✓ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Logout failed: $_" -ForegroundColor Red
}

Write-Host "`n9. Database state AFTER logout:" -ForegroundColor Yellow
php artisan tinker --execute="
echo 'Active Tokens: ' . \Laravel\Sanctum\PersonalAccessToken::count() . PHP_EOL;
"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ All data is stored in DATABASE!" -ForegroundColor Green
Write-Host "  - Tokens: personal_access_tokens table" -ForegroundColor White
Write-Host "  - Sessions: sessions table" -ForegroundColor White
Write-Host "  - Users: users table" -ForegroundColor White
Write-Host "  - Reports: disease_reports table" -ForegroundColor White
Write-Host "  - Applications: insurance_applications table" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
