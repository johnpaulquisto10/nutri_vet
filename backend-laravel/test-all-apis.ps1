# Comprehensive API Test Script for NutriVet Backend

$baseUrl = "http://127.0.0.1:8000/api"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NutriVet Backend API Tests" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test Admin Login
Write-Host "1. Testing Admin Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@nutrivet.com"
        password = "password"
    } | ConvertTo-Json
    
    $adminAuth = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $loginBody
    Write-Host "   ✅ Admin login successful" -ForegroundColor Green
    Write-Host "   User: $($adminAuth.user.full_name)" -ForegroundColor Gray
    Write-Host "   Role: $($adminAuth.role)" -ForegroundColor Gray
    
    $adminToken = $adminAuth.token
    $adminHeaders = $headers.Clone()
    $adminHeaders["Authorization"] = "Bearer $adminToken"
} catch {
    Write-Host "   ❌ Admin login failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Test Farmer Login
Write-Host "`n2. Testing Farmer Login..." -ForegroundColor Yellow
try {
    $farmerLoginBody = @{
        email = "farmer@nutrivet.com"
        password = "password"
    } | ConvertTo-Json
    
    $farmerAuth = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $farmerLoginBody
    Write-Host "   ✅ Farmer login successful" -ForegroundColor Green
    Write-Host "   User: $($farmerAuth.user.full_name)" -ForegroundColor Gray
    Write-Host "   Role: $($farmerAuth.role)" -ForegroundColor Gray
    
    $farmerToken = $farmerAuth.token
    $farmerHeaders = $headers.Clone()
    $farmerHeaders["Authorization"] = "Bearer $farmerToken"
} catch {
    Write-Host "   ❌ Farmer login failed: $_" -ForegroundColor Red
    exit 1
}

# 3. Test Reference Data Endpoints
Write-Host "`n3. Testing Reference Data Endpoints..." -ForegroundColor Yellow

$referenceEndpoints = @(
    "barangays",
    "animal-types",
    "animal-purposes",
    "diseases",
    "disease-categories",
    "advisory-categories",
    "advisory-severities"
)

foreach ($endpoint in $referenceEndpoints) {
    try {
        $data = Invoke-RestMethod -Uri "$baseUrl/reference/$endpoint" -Method GET -Headers $adminHeaders
        $count = $data.Count
        Write-Host "   ✅ $endpoint : $count records" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $endpoint failed: $_" -ForegroundColor Red
    }
}

# 4. Test Admin Dashboard
Write-Host "`n4. Testing Admin Dashboard..." -ForegroundColor Yellow
try {
    $adminDash = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method GET -Headers $adminHeaders
    Write-Host "   ✅ Admin dashboard accessible" -ForegroundColor Green
    Write-Host "   Total Farmers: $($adminDash.total_farmers)" -ForegroundColor Gray
    Write-Host "   Total Disease Reports: $($adminDash.total_disease_reports)" -ForegroundColor Gray
    Write-Host "   Total Insurance Applications: $($adminDash.total_insurance_applications)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Admin dashboard failed: $_" -ForegroundColor Red
}

# 5. Test Farmer Dashboard
Write-Host "`n5. Testing Farmer Dashboard..." -ForegroundColor Yellow
try {
    $farmerDash = Invoke-RestMethod -Uri "$baseUrl/dashboard" -Method GET -Headers $farmerHeaders
    Write-Host "   ✅ Farmer dashboard accessible" -ForegroundColor Green
    Write-Host "   Total Animals: $($farmerDash.total_animals)" -ForegroundColor Gray
    Write-Host "   Pending Insurance: $($farmerDash.pending_insurance_applications)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Farmer dashboard failed: $_" -ForegroundColor Red
}

# 6. Test Disease Reports Listing
Write-Host "`n6. Testing Disease Reports..." -ForegroundColor Yellow
try {
    $reports = Invoke-RestMethod -Uri "$baseUrl/disease-reports" -Method GET -Headers $farmerHeaders
    Write-Host "   ✅ Disease reports listing: $($reports.data.Count) reports" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Disease reports failed: $_" -ForegroundColor Red
}

# 7. Test Insurance Applications Listing
Write-Host "`n7. Testing Insurance Applications..." -ForegroundColor Yellow
try {
    $insurance = Invoke-RestMethod -Uri "$baseUrl/insurance-applications" -Method GET -Headers $farmerHeaders
    Write-Host "   ✅ Insurance applications listing: $($insurance.data.Count) applications" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Insurance applications failed: $_" -ForegroundColor Red
}

# 8. Test Advisories Listing
Write-Host "`n8. Testing Advisories..." -ForegroundColor Yellow
try {
    $advisories = Invoke-RestMethod -Uri "$baseUrl/advisories" -Method GET -Headers $farmerHeaders
    Write-Host "   ✅ Advisories listing: $($advisories.data.Count) advisories" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Advisories failed: $_" -ForegroundColor Red
}

# 9. Test Profile Retrieval
Write-Host "`n9. Testing Profile Retrieval..." -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/profile" -Method GET -Headers $adminHeaders
    Write-Host "   ✅ Profile retrieved" -ForegroundColor Green
    Write-Host "   Name: $($profile.user.full_name)" -ForegroundColor Gray
    Write-Host "   Email: $($profile.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Profile retrieval failed: $_" -ForegroundColor Red
}

# 10. Test Logout
Write-Host "`n10. Testing Logout..." -ForegroundColor Yellow
try {
    $logout = Invoke-RestMethod -Uri "$baseUrl/logout" -Method POST -Headers $farmerHeaders
    Write-Host "   ✅ Logout successful: $($logout.message)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Logout failed: $_" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Tests Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
