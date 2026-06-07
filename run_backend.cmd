@echo off
title DesignAI Backend Server
color 0A

echo.
echo  ================================================================
echo   DesignAI Backend - Production Server
echo   Dual Provider: OpenAI (chat/analysis) + Pollinations (images)
echo  ================================================================
echo.

REM Navigate to backend directory (relative to this script's location)
cd /d "%~dp0backend"
if not exist "venv\Scripts\activate.bat" (
    echo  [ERROR] Virtual environment not found at: %cd%\venv
    echo  Please create it first: python -m venv venv
    echo.
    pause
    exit /b 1
)

echo  [1/5] Activating virtual environment...
call venv\Scripts\activate.bat
echo        Done.
echo.

echo  [2/5] Checking OpenAI SDK...
python -c "import openai; print('       OpenAI SDK v' + openai.__version__ + ' installed')" 2>nul
if %errorlevel% neq 0 (
    echo        OpenAI SDK missing. Installing now...
    pip install "openai>=1.0.0" --quiet
    python -c "import openai; print('       OpenAI SDK v' + openai.__version__ + ' installed')" 2>nul
    if %errorlevel% neq 0 (
        echo        [WARN] OpenAI SDK install failed - backend will use Pollinations fallback
    )
)
echo.

echo  [3/5] Checking other dependencies...
pip install Pillow numpy httpx python-dotenv --quiet 2>nul
echo        Core dependencies verified.
echo.

echo  [4/5] Verifying .env configuration...
python -c "from dotenv import load_dotenv; load_dotenv(); import os; k=os.getenv('OPENAI_API_KEY',''); u=os.getenv('OPENAI_BASE_URL',''); m=os.getenv('OPENAI_MODEL',''); print('       OPENAI_API_KEY  = ' + (k[:4]+'...'+k[-4:] if len(k)>8 else '(not set)')); print('       OPENAI_BASE_URL = ' + (u if u else '(not set)')); print('       OPENAI_MODEL    = ' + (m if m else '(not set)'))" 2>nul
if %errorlevel% neq 0 (
    echo        [WARN] Could not read .env - check python-dotenv is installed
)
echo.

echo  [5/5] Starting FastAPI server...
echo.
echo  ================================================================
echo   Backend URL:   http://localhost:8000
echo   API Docs:      http://localhost:8000/docs
echo   Health Check:  http://localhost:8000/health
echo   AI Status:     http://localhost:8000/api/v1/ai-status
echo   OpenAI Test:   http://localhost:8000/api/v1/openai-test
echo  ================================================================
echo.
echo   Press Ctrl+C to stop the server.
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

echo.
echo  Server stopped.
pause
