$body = @{
    identifier = "admin@sajhakirana.com"
    password = "admin123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testing Admin Login..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:5003/auth/admin/login" -ForegroundColor Gray
Write-Host "Email: admin@sajhakirana.com" -ForegroundColor Gray
Write-Host "Password: admin123" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5003/auth/admin/login" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response:" -ForegroundColor Yellow
        $responseBody | ConvertFrom-Json | ConvertTo-Json -Depth 10
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
