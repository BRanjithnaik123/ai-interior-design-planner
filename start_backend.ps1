<#
.SYNOPSIS
    DesignAI Backend Launcher (PowerShell)
.DESCRIPTION
    Starts the FastAPI backend with OpenAI + Pollinations dual provider.
    Right-click > Run with PowerShell, or run from terminal.
#>

$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "DesignAI Backend Server"

Write-Host ""
Write-Host " ================================================================" -ForegroundColor Cyan
Write-Host "   DesignAI Backend - Production Server" -ForegroundColor White
Write-Host "   Dual Provider: OpenAI (chat) + Pollinations (images)" -ForegroundColor Gray
Write-Host " ================================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "backend"

if (-Not (Test-Path $BackendDir)) {
    Write-Host " [ERROR] Backend directory not found: $BackendDir" -ForegroundColor Red
    Read-Host " Press Enter to exit"
    exit 1
}

Set-Location $BackendDir

# Check venv
$VenvActivate = Join-Path $BackendDir "venv\Scripts\Activate.ps1"
if (-Not (Test-Path $VenvActivate)) {
    Write-Host " [ERROR] Virtual environment not found at: $BackendDir\venv" -ForegroundColor Red
    Write-Host " Create it with: python -m venv venv" -ForegroundColor Yellow
    Read-Host " Press Enter to exit"
    exit 1
}

# Step 1: Activate venv
Write-Host " [1/5] Activating virtual environment..." -ForegroundColor Yellow
& $VenvActivate
Write-Host "        Done." -ForegroundColor Green
Write-Host ""

# Step 2: Check OpenAI SDK
Write-Host " [2/5] Checking OpenAI SDK..." -ForegroundColor Yellow
try {
    $ver = python -c "import openai; print(openai.__version__)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "        OpenAI SDK v$ver installed" -ForegroundColor Green
    } else {
        throw "not installed"
    }
} catch {
    Write-Host "        Installing OpenAI SDK..." -ForegroundColor Yellow
    pip install "openai>=1.0.0" --quiet 2>$null
    $ver = python -c "import openai; print(openai.__version__)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "        OpenAI SDK v$ver installed" -ForegroundColor Green
    } else {
        Write-Host "        [WARN] Install failed - will use Pollinations fallback" -ForegroundColor DarkYellow
    }
}
Write-Host ""

# Step 3: Dependencies
Write-Host " [3/5] Verifying dependencies..." -ForegroundColor Yellow
pip install Pillow numpy httpx python-dotenv --quiet 2>$null
Write-Host "        Core dependencies OK." -ForegroundColor Green
Write-Host ""

# Step 4: Check .env
Write-Host " [4/5] Checking .env configuration..." -ForegroundColor Yellow
python -c @"
from dotenv import load_dotenv; load_dotenv(); import os
k=os.getenv('OPENAI_API_KEY','')
u=os.getenv('OPENAI_BASE_URL','')
m=os.getenv('OPENAI_MODEL','')
kd = k[:4]+'...'+k[-4:] if len(k)>8 else '(not set)'
print(f'        OPENAI_API_KEY  = {kd}')
print(f'        OPENAI_BASE_URL = {u or "(not set)"}')
print(f'        OPENAI_MODEL    = {m or "(not set)"}')
if k == 'PASTE_MY_TOKEN_HERE':
    print('        [WARN] API key is placeholder - replace in .env')
"@ 2>$null
Write-Host ""

# Step 5: Start server
Write-Host " [5/5] Starting FastAPI server..." -ForegroundColor Yellow
Write-Host ""
Write-Host " ================================================================" -ForegroundColor Cyan
Write-Host "   Backend URL:   " -NoNewline; Write-Host "http://localhost:8000" -ForegroundColor Green
Write-Host "   API Docs:      " -NoNewline; Write-Host "http://localhost:8000/docs" -ForegroundColor Green
Write-Host "   Health Check:  " -NoNewline; Write-Host "http://localhost:8000/health" -ForegroundColor Green
Write-Host "   AI Status:     " -NoNewline; Write-Host "http://localhost:8000/api/v1/ai-status" -ForegroundColor Green
Write-Host "   OpenAI Test:   " -NoNewline; Write-Host "http://localhost:8000/api/v1/openai-test" -ForegroundColor Green
Write-Host " ================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Write-Host ""
Write-Host " Server stopped." -ForegroundColor Yellow
Read-Host " Press Enter to exit"
