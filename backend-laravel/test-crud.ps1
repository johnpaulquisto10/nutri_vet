# Comprehensive CRUD Testing Script for NutriVet Backend

$baseUrl = "http://127.0.0.1:8000/api"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NutriVet CRUD Operations Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Login as farmer
Write-Host "`n1. Logging in as Farmer..." -ForegroundColor Yellow
$farmerLoginBody = @{
    email = "farmer@nutrivet.com"
    password = "password"
} | ConvertTo-Json

$farmerAuth = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $farmerLoginBody
$farmerHeaders = $headers.Clone()
$farmerHeaders["Authorization"] = "Bearer $($farmerAuth.token)"
Write-Host "   ✅ Farmer logged in" -ForegroundColor Green

# Login as admin
Write-Host "`n2. Logging in as Admin..." -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@nutrivet.com"
    password = "password"
} | ConvertTo-Json

$adminAuth = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $adminLoginBody
$adminHeaders = $headers.Clone()
$adminHeaders["Authorization"] = "Bearer $($adminAuth.token)"
Write-Host "   ✅ Admin logged in" -ForegroundColor Green

# Get reference data
Write-Host "`n3. Getting Reference Data..." -ForegroundColor Yellow
$barangays = Invoke-RestMethod -Uri "$baseUrl/reference/barangays" -Method GET -Headers $farmerHeaders
$animalTypes = Invoke-RestMethod -Uri "$baseUrl/reference/animal-types" -Method GET -Headers $farmerHeaders
$purposes = Invoke-RestMethod -Uri "$baseUrl/reference/animal-purposes" -Method GET -Headers $farmerHeaders
$diseases = Invoke-RestMethod -Uri "$baseUrl/reference/diseases" -Method GET -Headers $farmerHeaders
$categories = Invoke-RestMethod -Uri "$baseUrl/reference/advisory-categories" -Method GET -Headers $adminHeaders
$severities = Invoke-RestMethod -Uri "$baseUrl/reference/advisory-severities" -Method GET -Headers $adminHeaders
Write-Host "   ✅ Reference data loaded" -ForegroundColor Green

# ===== INSURANCE APPLICATION CRUD =====
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  INSURANCE APPLICATION CRUD" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n4. Creating Insurance Application..." -ForegroundColor Yellow
$insuranceBody = @{
    animal_type_id = $animalTypes[0].id
    purpose_id = $purposes[0].id
    barangay_id = $barangays[0].id
    contact_number = "0928-123-4567"
    number_of_heads = 5
    age_months = 12
    breed = "Native"
    basic_color = "Brown"
    male_count = 2
    female_count = 3
} | ConvertTo-Json

try {
    $newApplication = Invoke-RestMethod -Uri "$baseUrl/insurance-applications" -Method POST -Headers $farmerHeaders -Body $insuranceBody
    Write-Host "   ✅ Insurance application created: ID $($newApplication.application.application_id)" -ForegroundColor Green
    $appId = $newApplication.application.application_id
} catch {
    Write-Host "   ❌ Failed to create application: $_" -ForegroundColor Red
}

Write-Host "`n5. Updating Insurance Application..." -ForegroundColor Yellow
$updateBody = @{
    number_of_heads = 7
    male_count = 3
    female_count = 4
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "$baseUrl/insurance-applications/$appId" -Method PUT -Headers $farmerHeaders -Body $updateBody
    Write-Host "   ✅ Application updated: Heads increased to $($updated.application.number_of_heads)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to update application: $_" -ForegroundColor Red
}

Write-Host "`n6. Admin Approving Application..." -ForegroundColor Yellow
$approveBody = @{
    admin_notes = "All requirements verified. Approved for insurance."
} | ConvertTo-Json

try {
    $approved = Invoke-RestMethod -Uri "$baseUrl/admin/insurance-applications/$appId/approve" -Method POST -Headers $adminHeaders -Body $approveBody
    Write-Host "   ✅ Application approved by admin" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to approve application: $_" -ForegroundColor Red
}

# ===== DISEASE REPORT CRUD =====
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  DISEASE REPORT CRUD" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n7. Creating Disease Report..." -ForegroundColor Yellow
$reportBody = @{
    disease_id = $diseases[0].id
    description = "Fever, loss of appetite, nasal discharge. 3 animals affected."
    animal_name = "Pig #123"
    latitude = 13.1234
    longitude = 121.5678
    address = "Farm located in Barangay Bansud"
} | ConvertTo-Json

try {
    $newReport = Invoke-RestMethod -Uri "$baseUrl/disease-reports" -Method POST -Headers $farmerHeaders -Body $reportBody
    Write-Host "   ✅ Disease report created: ID $($newReport.report.report_id)" -ForegroundColor Green
    $reportId = $newReport.report.report_id
} catch {
    Write-Host "   ❌ Failed to create report: $_" -ForegroundColor Red
}

Write-Host "`n8. Admin Investigating Report..." -ForegroundColor Yellow
$investigateBody = @{
    admin_notes = "Field team dispatched. Initial assessment shows ASF symptoms."
} | ConvertTo-Json

try {
    $investigating = Invoke-RestMethod -Uri "$baseUrl/admin/disease-reports/$reportId/investigate" -Method POST -Headers $adminHeaders -Body $investigateBody
    Write-Host "   ✅ Report status changed to investigating" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to investigate report: $_" -ForegroundColor Red
}

Write-Host "`n9. Admin Resolving Report..." -ForegroundColor Yellow
$resolveBody = @{
    admin_notes = "Vaccination completed. Area quarantined for 30 days. All affected animals recovered."
} | ConvertTo-Json

try {
    $resolved = Invoke-RestMethod -Uri "$baseUrl/admin/disease-reports/$reportId/resolve" -Method POST -Headers $adminHeaders -Body $resolveBody
    Write-Host "   ✅ Report resolved successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to resolve report: $_" -ForegroundColor Red
}

# ===== ADVISORY CRUD =====
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  ADVISORY CRUD" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n10. Creating Advisory..." -ForegroundColor Yellow
$advisoryBody = @{
    title = "African Swine Fever Alert"
    description = "Farmers are advised to implement strict biosecurity measures. Avoid contact with infected animals. Report any symptoms immediately to the veterinary office."
    category_id = $categories[0].id
    severity_id = $severities[0].id
    expires_at = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
} | ConvertTo-Json

try {
    $newAdvisory = Invoke-RestMethod -Uri "$baseUrl/admin/advisories" -Method POST -Headers $adminHeaders -Body $advisoryBody
    Write-Host "   ✅ Advisory created: ID $($newAdvisory.advisory.advisory_id)" -ForegroundColor Green
    $advisoryId = $newAdvisory.advisory.advisory_id
} catch {
    Write-Host "   ❌ Failed to create advisory: $_" -ForegroundColor Red
}

Write-Host "`n11. Farmer Marking Advisory as Read..." -ForegroundColor Yellow
try {
    $marked = Invoke-RestMethod -Uri "$baseUrl/advisories/$advisoryId/read" -Method POST -Headers $farmerHeaders
    Write-Host "   ✅ Advisory marked as read" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to mark advisory as read: $_" -ForegroundColor Red
}

Write-Host "`n12. Updating Advisory..." -ForegroundColor Yellow
$updateAdvisoryBody = @{
    description = "UPDATED: African Swine Fever Alert - New cases reported in nearby barangays. Enhanced monitoring required. Contact the vet office for free consultation."
} | ConvertTo-Json

try {
    $updatedAdvisory = Invoke-RestMethod -Uri "$baseUrl/admin/advisories/$advisoryId" -Method PUT -Headers $adminHeaders -Body $updateAdvisoryBody
    Write-Host "   ✅ Advisory updated successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to update advisory: $_" -ForegroundColor Red
}

# ===== FINAL STATISTICS =====
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  FINAL STATISTICS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n13. Farmer Dashboard..." -ForegroundColor Yellow
try {
    $farmerDash = Invoke-RestMethod -Uri "$baseUrl/dashboard" -Method GET -Headers $farmerHeaders
    Write-Host "   ✅ Farmer Statistics:" -ForegroundColor Green
    Write-Host "      - Total Applications: $($farmerDash.statistics.total_applications)" -ForegroundColor Gray
    Write-Host "      - Approved Applications: $($farmerDash.statistics.approved_applications)" -ForegroundColor Gray
    Write-Host "      - Total Reports: $($farmerDash.statistics.total_reports)" -ForegroundColor Gray
    Write-Host "      - Unread Advisories: $($farmerDash.statistics.unread_advisories)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to get farmer dashboard: $_" -ForegroundColor Red
}

Write-Host "`n14. Admin Dashboard..." -ForegroundColor Yellow
try {
    $adminDash = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method GET -Headers $adminHeaders
    Write-Host "   ✅ Admin Statistics:" -ForegroundColor Green
    Write-Host "      - Total Farmers: $($adminDash.statistics.total_farmers)" -ForegroundColor Gray
    Write-Host "      - Total Applications: $($adminDash.statistics.total_applications)" -ForegroundColor Gray
    Write-Host "      - Approved Applications: $($adminDash.statistics.approved_applications)" -ForegroundColor Gray
    Write-Host "      - Total Reports: $($adminDash.statistics.total_reports)" -ForegroundColor Gray
    Write-Host "      - Resolved Reports: $($adminDash.statistics.resolved_reports)" -ForegroundColor Gray
    Write-Host "      - Active Advisories: $($adminDash.statistics.active_advisories)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to get admin dashboard: $_" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  CRUD Tests Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
