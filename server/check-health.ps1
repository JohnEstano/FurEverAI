# Quick health check for FurEver.AI backend
Write-Host "🔍 Checking FurEver.AI Backend..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Server Status: " -NoNewline -ForegroundColor Green
    Write-Host $data.status
    Write-Host "📝 Message: " -NoNewline -ForegroundColor Yellow
    Write-Host $data.message
    Write-Host "🤖 Models Loaded: " -NoNewline -ForegroundColor Magenta
    Write-Host $data.models_loaded
    
    if ($data.models_loaded -eq $true) {
        Write-Host "`n🎉 All systems operational! Backend is ready." -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Server is running but models are not loaded." -ForegroundColor Yellow
        Write-Host "   Place .pkl files in server/models/ directory" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot connect to backend at http://localhost:5000" -ForegroundColor Red
    Write-Host "   Make sure the server is running:" -ForegroundColor Yellow
    Write-Host "   cd server" -ForegroundColor Cyan
    Write-Host "   python server.py" -ForegroundColor Cyan
}
