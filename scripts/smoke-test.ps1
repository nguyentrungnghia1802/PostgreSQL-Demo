# Smoke test for PostgreSQL Feature Showcase
# Prerequisites: backend running on http://localhost:4000
# Run from repo root: .\scripts\smoke-test.ps1

$BASE = "http://localhost:4000"
$pass = 0
$fail = 0

function Test-Endpoint {
  param(
    [string]$Label,
    [string]$Url,
    [string]$Method = "GET",
    [string]$Body = $null
  )

  try {
    if ($Method -eq "POST") {
      $response = Invoke-RestMethod -Uri $Url -Method POST -ContentType "application/json" -Body ($Body ?? "{}")
    } else {
      $response = Invoke-RestMethod -Uri $Url -Method GET
    }
    Write-Host "  [PASS] $Label" -ForegroundColor Green
    $script:pass++
  } catch {
    Write-Host "  [FAIL] $Label - $($_.Exception.Message)" -ForegroundColor Red
    $script:fail++
  }
}

Write-Host "`nPostgreSQL Feature Showcase — Smoke Tests`n" -ForegroundColor Cyan

Test-Endpoint "GET /api/health"                  "$BASE/api/health"
Test-Endpoint "GET /api/health/db"               "$BASE/api/health/db"
Test-Endpoint "GET /api/demo/features"           "$BASE/api/demo/features"
Test-Endpoint "GET /api/demo/transaction/state"  "$BASE/api/demo/transaction/state"
Test-Endpoint "GET /api/demo/counts"             "$BASE/api/demo/counts"
Test-Endpoint "POST /api/demo/reset-all"         "$BASE/api/demo/reset-all" "POST"

Write-Host "`nResults: $pass passed, $fail failed`n" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
