# Simple API Testing Script for PrivacyTreasuryAI
# Testing core functionality systematically

param(
    [string]$BaseUrl = $env:PRIVACY_TREASURY_API_URL
)

if (-not $BaseUrl) {
    $BaseUrl = "http://localhost:3001"
}

$baseUrl = $BaseUrl.TrimEnd('/')
$passedTests = 0
$totalTests = 0

Write-Host "[Smoke] PrivacyTreasuryAI API Testing Started" -ForegroundColor Green
Write-Host "Target base URL: $baseUrl" -ForegroundColor Yellow
Write-Host ("=" * 50)

function TestAPI {
    param([string]$name, [scriptblock]$test)
    $script:totalTests++
    Write-Host "[Test] $name" -ForegroundColor Cyan
    try {
        & $test
        Write-Host "   Passed" -ForegroundColor Green
        $script:passedTests++
    } catch {
        Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 1: Homepage
TestAPI "Homepage" {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    if (-not $response.success -or -not $response.data.message) { throw "No message in response" }
}

# Test 2: Portfolio Analysis
TestAPI "Portfolio Analysis" {
    $body = '{"assets":[{"symbol":"ETH","amount":10,"valueUSD":16000},{"symbol":"USDC","amount":10000,"valueUSD":10000}]}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/analyze-portfolio" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.totalValueUSD) { throw "No portfolio analysis data" }
}

# Test 3: AI Recommendations
TestAPI "AI Recommendations" {
    $body = '{"currentAllocation":{"ETH":60,"USDC":40},"marketConditions":{"volatility":"HIGH","trend":"BULLISH"}}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai-recommendations" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.recommendations) { throw "No AI recommendations" }
}

# Test 4: ML Optimization
TestAPI "ML Portfolio Optimization" {
    $body = '{"portfolio":[{"symbol":"ETH","amount":10,"valueUSD":16000}],"riskTolerance":7}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ml-optimization" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.optimization) { throw "No ML optimization data" }
}

# Test 5: Risk Assessment
TestAPI "Risk Assessment" {
    $body = '{"portfolio":[{"symbol":"ETH","amount":10,"valueUSD":16000}],"timeframe":"30_DAYS"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/risk-assessment" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.riskAssessment) { throw "No risk assessment data" }
}

# Test 6: Cross-Chain Rebalancing
TestAPI "Cross-Chain Rebalancing" {
    $body = '{"walletAddress":"0x1234","targetAllocation":{"ETH":40,"USDC":60}}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cross-chain-rebalancing" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.rebalancing) { throw "No rebalancing data" }
}

# Test 7: Game Treasury Operation
TestAPI "Game Treasury Operation" {
    $body = '{"gameId":"dega-rpg-01","playerId":"player123","operation":"mint","amount":100,"tokenType":"DEGA"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/game-treasury-operation" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.operation) { throw "No game operation data" }
}

# Test 8: Create Player Wallet
TestAPI "Create Player Wallet" {
    $body = '{"playerId":"newplayer456","gameId":"dega-rpg-01"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/create-player-wallet" -Method POST -Body $body -Headers $headers
    if (-not $response.success -or -not $response.data.wallet) { throw "No wallet creation data" }
}

# Test 9: DEGA Service Status
TestAPI "DEGA Service Status" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/dega-service-status" -Method GET
    if (-not $response.success -or -not $response.data.status) { throw "DEGA service not operational" }
}

# Test 10: Gas Optimization
TestAPI "Gas Optimization" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/gas-optimization" -Method GET
    if (-not $response.success -or -not $response.data.gasOptimization) { throw "No gas optimization data" }
}

# Results Summary
Write-Host ("=" * 50)
Write-Host "Summary: $passedTests of $totalTests tests passed" -ForegroundColor Yellow

if ($passedTests -eq $totalTests) {
    Write-Host "All smoke tests passed" -ForegroundColor Green
} else {
    $failedTests = $totalTests - $passedTests
    Write-Host "$failedTests tests failed. Review logs above." -ForegroundColor Red
}

Write-Host "Smoke testing complete" -ForegroundColor Cyan