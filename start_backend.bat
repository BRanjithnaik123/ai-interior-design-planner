@echo off
echo ================================================================
echo   DesignAI Backend - Production Verification Startup
echo   Dual Provider: OpenAI (chat/analysis) + Pollinations (images)
echo ================================================================
echo.

cd /d "%~dp0backend"

echo [1/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo [2/5] Installing/updating dependencies...
pip install "openai>=1.0.0" Pillow numpy httpx --quiet 2>nul
if %errorlevel% neq 0 (
    echo     WARNING: pip install may have had issues, trying without --quiet...
    pip install "openai>=1.0.0"
)

echo [3/5] Verifying OpenAI SDK installation...
python -c "import openai; print(f'    OpenAI SDK v{openai.__version__} - OK')"
if %errorlevel% neq 0 (
    echo     ERROR: OpenAI SDK not installed. Running: pip install openai
    pip install openai
)

echo [4/5] Verifying .env configuration...
python -c "from dotenv import load_dotenv; load_dotenv(); import os; key=os.getenv('OPENAI_API_KEY',''); url=os.getenv('OPENAI_BASE_URL',''); model=os.getenv('OPENAI_MODEL',''); print(f'    API Key:  {key[:4]}...{key[-4:] if len(key)>8 else \"(short)\"}'); print(f'    Base URL: {url}'); print(f'    Model:    {model}')"

echo [5/5] Starting FastAPI server on port 8000...
echo.
echo ================================================================
echo   Server starting at: http://localhost:8000
echo   API docs at:        http://localhost:8000/docs
echo   Health check:       http://localhost:8000/health
echo   AI Status:          http://localhost:8000/api/v1/ai-status
echo   OpenAI Test:        http://localhost:8000/api/v1/openai-test
echo ================================================================
echo.
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
