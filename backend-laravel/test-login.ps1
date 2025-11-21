$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "admin@nutrivet.com"
    password = "password"
} | ConvertTo-Json

Write-Host "Testing Admin Login..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Headers $headers -Body $body
    Write-Host "Success! Response:" -ForegroundColor Green
    Write-Host "User: $($response.user.full_name)"
    Write-Host "Email: $($response.user.email)"
    Write-Host "Role: $($response.role)"
    Write-Host "Token: $($response.token.Substring(0, 20))..."
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode
}

Write-Host "`n`nTesting Farmer Login..." -ForegroundColor Cyan
$body2 = @{
    email = "farmer@nutrivet.com"
    password = "password"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Headers $headers -Body $body2
    Write-Host "Success! Response:" -ForegroundColor Green
    Write-Host "User: $($response2.user.full_name)"
    Write-Host "Email: $($response2.user.email)"
    Write-Host "Role: $($response2.role)"
    Write-Host "Token: $($response2.token.Substring(0, 20))..."
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
