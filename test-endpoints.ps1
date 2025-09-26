# ========================================
# PrivacyTreasuryAI API Endpoint Testing Script
# Testing all 21 endpoints systematically
# ========================================

$baseUrl = "http://localhost:3001"
$testResults = @()

Write-Host "🧪 Starting Comprehensive API Testing..." -ForegroundColor Green
Write-Host "🚀 PrivacyTreasuryAI - Testing 21 Endpoints" -ForegroundColor Yellow
Write-Host "=" * 50

# Helper function to test endpoints
function Test-Endpoint {
    param(
        [string]$method,
        [string]$endpoint,
        [object]$body = $null,
        [string]$description
    )
    
    Write-Host "🔍 Testing: $description" -ForegroundColor Cyan
    Write-Host "   $method $endpoint"
    
    try {
        $headers = @{
            'Content-Type' = 'application/json'
        }
        
        if ($body) {
            $jsonBody = $body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method $method -Body $jsonBody -Headers $headers -TimeoutSec 30
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method $method -Headers $headers -TimeoutSec 30
        }
        
        Write-Host "   ✅ SUCCESS" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{
            Endpoint = $endpoint
            Method = $method
            Status = "SUCCESS"
            Description = $description
        }
        return $response
    }
    catch {
        Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{
            Endpoint = $endpoint
            Method = $method
            Status = "FAILED"
            Description = $description
            Error = $_.Exception.Message
        }
        return $null
    }
    
    Write-Host ""
}

# ========================================
# 1. CORE TREASURY ENDPOINTS (6)
# ========================================
Write-Host "🏛️ TESTING CORE TREASURY ENDPOINTS" -ForegroundColor Magenta

# Test 1: Homepage
Test-Endpoint -method "GET" -endpoint "/" -description "Homepage"

# Test 2: Portfolio Analysis
$portfolioData = @{
    portfolio = @(
        @{ symbol = "ETH"; amount = 10; valueUSD = 16000 },
        @{ symbol = "USDC"; amount = 10000; valueUSD = 10000 },
        @{ symbol = "MATIC"; amount = 5000; valueUSD = 3500 }
    )
}
Test-Endpoint -method "POST" -endpoint "/api/analyze-portfolio" -body $portfolioData -description "Portfolio Analysis"

# Test 3: Private Transaction
$txData = @{
    from = "0xDAO_Treasury_Address"
    to = "0xRecipient_Address"
    amount = 1000
    assetType = "USDC"
    privateMetadata = @{
        reason = "Strategic investment"
        category = "Investment"
    }
}
Test-Endpoint -method "POST" -endpoint "/api/private-transaction" -body $txData -description "Private Transaction"

# Test 4: AI Recommendations
$marketData = @{
    marketConditions = @{
        volatility = "HIGH"
        trend = "BULLISH"
        fear_greed_index = 75
    }
    portfolio = @(
        @{ symbol = "ETH"; amount = 10; valueUSD = 16000 },
        @{ symbol = "USDC"; amount = 10000; valueUSD = 10000 }
    )
}
Test-Endpoint -method "POST" -endpoint "/api/ai-recommendations" -body $marketData -description "AI Recommendations"

# Test 5: Simulate Rebalance
$rebalanceData = @{
    currentPortfolio = @(
        @{ symbol = "ETH"; amount = 10; valueUSD = 16000 },
        @{ symbol = "USDC"; amount = 10000; valueUSD = 10000 }
    )
    targetAllocation = @(
        @{ symbol = "ETH"; targetPercentage = 60 },
        @{ symbol = "USDC"; targetPercentage = 40 }
    )
}
Test-Endpoint -method "POST" -endpoint "/api/simulate-rebalance" -body $rebalanceData -description "Simulate Rebalance"

# Test 6: Agent Communication
$agentData = @{
    message = "Analyze current market conditions for treasury optimization"
    targetAgent = "TreasuryAnalystAgent"
}
Test-Endpoint -method "POST" -endpoint "/api/agent-communication" -body $agentData -description "Agent Communication"

# ========================================
# 2. ADVANCED ML ENDPOINTS (4)
# ========================================
Write-Host "🤖 TESTING ADVANCED ML ENDPOINTS" -ForegroundColor Magenta

# Test 7: ML Optimization
$mlData = @{
    portfolio = @(
        @{ symbol = "ETH"; amount = 10; valueUSD = 16000; historicalReturns = @(0.05, -0.02, 0.08) },
        @{ symbol = "USDC"; amount = 10000; valueUSD = 10000; historicalReturns = @(0.01, 0.01, 0.01) }
    )
    riskTolerance = 7
    timeHorizon = "1_YEAR"
}
Test-Endpoint -method "POST" -endpoint "/api/ml-optimization" -body $mlData -description "ML Portfolio Optimization"

# Test 8: Risk Assessment
$riskData = @{
    portfolio = @(
        @{ symbol = "ETH"; amount = 10; valueUSD = 16000 },
        @{ symbol = "USDC"; amount = 10000; valueUSD = 10000 }
    )
    timeframe = "30_DAYS"
}
Test-Endpoint -method "POST" -endpoint "/api/risk-assessment" -body $riskData -description "Risk Assessment"

# Test 9: Yield Optimization
$yieldData = @{
    assets = @("ETH", "USDC", "MATIC")
    amount = 50000
    riskLevel = "MODERATE"
}
Test-Endpoint -method "POST" -endpoint "/api/yield-optimization" -body $yieldData -description "Yield Optimization"

# Test 10: Correlation Analysis
Test-Endpoint -method "GET" -endpoint "/api/correlation-analysis" -description "Correlation Analysis"

# ========================================
# 3. CROSS-CHAIN ENDPOINTS (4)
# ========================================
Write-Host "🌉 TESTING CROSS-CHAIN ENDPOINTS" -ForegroundColor Magenta

# Test 11: Multi-Chain Balances
$walletData = @{
    walletAddress = "0x1234567890123456789012345678901234567890"
    chains = @("ethereum", "polygon", "arbitrum", "solana")
}
Test-Endpoint -method "POST" -endpoint "/api/multi-chain-balances" -body $walletData -description "Multi-Chain Balances"

# Test 12: Cross-Chain Bridge
$bridgeData = @{
    fromChain = "ethereum"
    toChain = "polygon"
    asset = "USDC"
    amount = 1000
    recipient = "0x1234567890123456789012345678901234567890"
}
Test-Endpoint -method "POST" -endpoint "/api/cross-chain-bridge" -body $bridgeData -description "Cross-Chain Bridge"

# Test 13: Gas Optimization
Test-Endpoint -method "GET" -endpoint "/api/gas-optimization" -description "Gas Optimization"

# Test 14: Cross-Chain Rebalancing
$crossChainRebalanceData = @{
    walletAddress = "0x1234567890123456789012345678901234567890"
    targetAllocation = @{
        ETH = 40
        USDC = 30
        SOL = 20
        MATIC = 10
    }
}
Test-Endpoint -method "POST" -endpoint "/api/cross-chain-rebalancing" -body $crossChainRebalanceData -description "Cross-Chain Rebalancing"

# ========================================
# 4. DEGA MCP GAMING ENDPOINTS (7)
# ========================================
Write-Host "🎮 TESTING DEGA MCP GAMING ENDPOINTS" -ForegroundColor Magenta

# Test 15: Game Treasury Operation
$gameOpData = @{
    gameId = "dega-rpg-01"
    playerId = "player123"
    operation = "mint"
    amount = 100
    tokenType = "DEGA"
}
Test-Endpoint -method "POST" -endpoint "/api/dega/game-operation" -body $gameOpData -description "Game Treasury Operation"

# Test 16: Create Player Wallet
$walletCreateData = @{
    playerId = "newplayer456"
    gameId = "dega-rpg-01"
}
Test-Endpoint -method "POST" -endpoint "/api/dega/create-wallet" -body $walletCreateData -description "Create Player Wallet"

# Test 17: Authenticate Player
$authData = @{
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"
}
Test-Endpoint -method "POST" -endpoint "/api/dega/authenticate" -body $authData -description "Authenticate Player"

# Test 18: MCP Agent Communication
$mcpData = @{
    targetAgent = "GameAnalyticsAgent"
    method = "gaming.treasury.balance"
    params = @{
        playerId = "player123"
    }
}
Test-Endpoint -method "POST" -endpoint "/api/dega/mcp-communicate" -body $mcpData -description "MCP Agent Communication"

# Test 19: Gaming Analytics
$analyticsData = @{
    gameId = "dega-rpg-01"
}
Test-Endpoint -method "POST" -endpoint "/api/dega/analytics" -body $analyticsData -description "Gaming Analytics"

# Test 20: Metachin Optimization
Test-Endpoint -method "POST" -endpoint "/api/dega/metachin-optimize" -description "Metachin Optimization"

# Test 21: DEGA Service Status
Test-Endpoint -method "GET" -endpoint "/api/dega/status" -description "DEGA Service Status"

# ========================================
# TEST RESULTS SUMMARY
# ========================================
Write-Host "=" * 50
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "=" * 50

$successCount = ($testResults | Where-Object { $_.Status -eq "SUCCESS" }).Count
$failureCount = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$totalTests = $testResults.Count

Write-Host "✅ Successful Tests: $successCount/$totalTests" -ForegroundColor Green
Write-Host "❌ Failed Tests: $failureCount/$totalTests" -ForegroundColor Red
Write-Host ""

if ($failureCount -gt 0) {
    Write-Host "❌ FAILED ENDPOINTS:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAILED" } | ForEach-Object {
        Write-Host "   $($_.Method) $($_.Endpoint) - $($_.Description)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "      Error: $($_.Error)" -ForegroundColor DarkRed
        }
    }
    Write-Host ""
}

if ($successCount -eq $totalTests) {
    Write-Host "🎉 ALL TESTS PASSED! System is ready for demo!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Review and fix issues before demo." -ForegroundColor Yellow
}

Write-Host "=" * 50
Write-Host "🏆 Testing Complete! Total Endpoints: $totalTests" -ForegroundColor Cyan