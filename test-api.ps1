# API Test Script for NutriVet Backend
# Test all critical endpoints

$baseUrl = "http://127.0.0.1:8000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NutriVet API Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login
Write-Host "[TEST 1] Testing Login Endpoint..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "farmer@nutrivet.com"
        password = "password"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginData -ContentType "application/json"
    
    if ($response.token) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        Write-Host "  User: $($response.user.full_name)" -ForegroundColor White
        Write-Host "  Role: $($response.role)" -ForegroundColor White
        $token = $response.token
    } else {
        Write-Host "✗ Login failed - no token returned" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Get Profile
Write-Host "[TEST 2] Testing Profile Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Get -Headers $headers
    
    if ($response.user) {
        Write-Host "✓ Profile retrieved successfully!" -ForegroundColor Green
        Write-Host "  Name: $($response.user.full_name)" -ForegroundColor White
        Write-Host "  Email: $($response.user.email)" -ForegroundColor White
    } else {
        Write-Host "✗ Profile request failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Profile request failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Reference Data - Barangays
Write-Host "[TEST 3] Testing Reference Data - Barangays..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reference/barangays" -Method Get -Headers $headers
    
    if ($response.Count -gt 0) {
        Write-Host "✓ Retrieved $($response.Count) barangays" -ForegroundColor Green
        Write-Host "  Sample: $($response[0].name), $($response[0].municipality)" -ForegroundColor White
    } else {
        Write-Host "✗ No barangays found" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Barangays request failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Animal Types
Write-Host "[TEST 4] Testing Reference Data - Animal Types..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reference/animal-types" -Method Get -Headers $headers
    
    if ($response.Count -gt 0) {
        Write-Host "✓ Retrieved $($response.Count) animal types" -ForegroundColor Green
        Write-Host "  Sample: $($response[0].name)" -ForegroundColor White
    } else {
        Write-Host "✗ No animal types found" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Animal types request failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Dashboard Stats
Write-Host "[TEST 5] Testing Dashboard Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard" -Method Get -Headers $headers
    
    if ($response.statistics) {
        Write-Host "✓ Dashboard stats retrieved successfully!" -ForegroundColor Green
        Write-Host "  Total Applications: $($response.statistics.total_applications)" -ForegroundColor White
        Write-Host "  Total Reports: $($response.statistics.total_reports)" -ForegroundColor White
    } else {
        Write-Host "✗ Dashboard request failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Dashboard request failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Insurance Applications
Write-Host "[TEST 6] Testing Insurance Applications..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/insurance-applications" -Method Get -Headers $headers
    
    Write-Host "✓ Insurance applications endpoint working!" -ForegroundColor Green
    Write-Host "  Total: $($response.total)" -ForegroundColor White
    Write-Host "  Current Page: $($response.current_page)" -ForegroundColor White
} catch {
    Write-Host "✗ Insurance applications request failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Admin Login
Write-Host "[TEST 7] Testing Admin Login..." -ForegroundColor Yellow
try {
    $adminLogin = @{
        email = "admin@nutrivet.com"
        password = "password"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $adminLogin -ContentType "application/json"
    
    if ($response.token -and $response.role -eq "admin") {
        Write-Host "✓ Admin login successful!" -ForegroundColor Green
        Write-Host "  User: $($response.user.full_name)" -ForegroundColor White
        $adminToken = $response.token
    } else {
        Write-Host "✗ Admin login failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Admin login failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 8: Admin Dashboard
Write-Host "[TEST 8] Testing Admin Dashboard..." -ForegroundColor Yellow
try {
    $adminHeaders = @{
        "Authorization" = "Bearer $adminToken"
        "Accept" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $adminHeaders
    
    if ($response.statistics) {
        Write-Host "✓ Admin dashboard retrieved successfully!" -ForegroundColor Green
        Write-Host "  Total Farmers: $($response.statistics.total_farmers)" -ForegroundColor White
        Write-Host "  Total Applications: $($response.statistics.total_applications)" -ForegroundColor White
    } else {
        Write-Host "✗ Admin dashboard request failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Admin dashboard request failed: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   API Tests Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server is running on: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "API Documentation: BACKEND_API_DOCUMENTATION.md" -ForegroundColor Cyan
Write-Host ""
