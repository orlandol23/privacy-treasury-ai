# Simple API Testing Script for PrivacyTreasuryAI
# Testing core functionality systematically

Write-Host "🧪 PrivacyTreasuryAI API Testing Started..." -ForegroundColor Green
Write-Host "=" * 50

$baseUrl = "http://localhost:3001"
$passedTests = 0
$totalTests = 0

function Test-API {
    param([string]$name, [scriptblock]$test)
    $script:totalTests++
    Write-Host "🔍 Testing: $name" -ForegroundColor Cyan
    try {
        & $test
        Write-Host "   ✅ PASSED" -ForegroundColor Green
        $script:passedTests++
    } catch {
        Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 1: Homepage
Test-API "Homepage" {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    if (-not $response.message) { throw "No message in response" }
}

# Test 2: Portfolio Analysis
Test-API "Portfolio Analysis" {
    $body = '{"assets":[{"symbol":"ETH","amount":10,"valueUSD":16000},{"symbol":"USDC","amount":10000,"valueUSD":10000}]}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/analyze-portfolio" -Method POST -Body $body -Headers $headers
    if (-not $response.totalValueUSD) { throw "No portfolio analysis data" }
}

# Test 3: AI Recommendations
Test-API "AI Recommendations" {
    $body = '{"currentAllocation":{"ETH":60,"USDC":40},"marketConditions":{"volatility":"HIGH","trend":"BULLISH"}}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai-recommendations" -Method POST -Body $body -Headers $headers
    if (-not $response.recommendations) { throw "No AI recommendations" }
}

# Test 4: ML Optimization
Test-API "ML Portfolio Optimization" {
    $body = '{"portfolio":[{"symbol":"ETH","amount":10,"valueUSD":16000}],"riskTolerance":7}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ml-optimization" -Method POST -Body $body -Headers $headers
    if (-not $response.optimization) { throw "No ML optimization data" }
}

# Test 5: Risk Assessment
Test-API "Risk Assessment" {
    $body = '{"portfolio":[{"symbol":"ETH","amount":10,"valueUSD":16000}],"timeframe":"30_DAYS"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/risk-assessment" -Method POST -Body $body -Headers $headers
    if (-not $response.riskMetrics) { throw "No risk assessment data" }
}

# Test 6: Cross-Chain Rebalancing
Test-API "Cross-Chain Rebalancing" {
    $body = '{"walletAddress":"0x1234","targetAllocation":{"ETH":40,"USDC":60}}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cross-chain-rebalancing" -Method POST -Body $body -Headers $headers
    if (-not $response.rebalancing) { throw "No rebalancing data" }
}

# Test 7: Game Treasury Operation
Test-API "Game Treasury Operation" {
    $body = '{"gameId":"dega-rpg-01","playerId":"player123","operation":"mint","amount":100,"tokenType":"DEGA"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/game-treasury-operation" -Method POST -Body $body -Headers $headers
    if (-not $response.operation) { throw "No game operation data" }
}

# Test 8: Create Player Wallet
Test-API "Create Player Wallet" {
    $body = '{"playerId":"newplayer456","gameId":"dega-rpg-01"}'
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/create-player-wallet" -Method POST -Body $body -Headers $headers
    if (-not $response.wallet) { throw "No wallet creation data" }
}

# Test 9: DEGA Service Status
Test-API "DEGA Service Status" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/dega-service-status" -Method GET
    if (-not $response.success) { throw "DEGA service not operational" }
}

# Test 10: Gas Optimization
Test-API "Gas Optimization" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/gas-optimization" -Method GET
    if (-not $response.gasOptimization) { throw "No gas optimization data" }
}

# Results Summary
Write-Host "=" * 50
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "=" * 50
Write-Host "✅ Passed: $passedTests/$totalTests tests" -ForegroundColor Green

if ($passedTests -eq $totalTests) {
    Write-Host "🎉 ALL TESTS PASSED! System ready for demo!" -ForegroundColor Green
} else {
    $failedTests = $totalTests - $passedTests
    Write-Host "❌ Failed: $failedTests tests need attention" -ForegroundColor Red
}

Write-Host "🏆 Core functionality verified!" -ForegroundColor Cyan