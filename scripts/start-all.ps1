# PowerShell script to start both backend and frontend concurrently
Write-Host "🚀 Starting Discord Clone App..." -ForegroundColor Green
Write-Host "📊 Backend will run on http://localhost:9000" -ForegroundColor Blue
Write-Host "🌐 Frontend will run on http://localhost:3000" -ForegroundColor Blue

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; Write-Host "Starting Backend..." -ForegroundColor Yellow; npm install; npm start'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd frontend; Write-Host "Starting Frontend..." -ForegroundColor Yellow; npm install; npm start'

Write-Host "✅ Both services starting in separate windows..." -ForegroundColor Green
