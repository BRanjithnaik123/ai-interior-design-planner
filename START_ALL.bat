@echo off
title DesignAI - Full Stack Startup
color 0A

echo ============================================
echo   DesignAI Full Stack - Starting Up
echo ============================================
echo.

REM Start Backend in a new window
echo [1/2] Starting Backend (FastAPI on port 8000)...
start "DesignAI Backend" cmd /k "cd /d ""c:\Users\HP 745 G6\Desktop\AI\backend"" && call venv\Scripts\activate.bat && pip install Pillow numpy --quiet && echo. && echo [AI ENGINE] Starting server... && echo. && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend in a new window
echo [2/2] Starting Frontend (Next.js on port 3000)...
start "DesignAI Frontend" cmd /k "cd /d ""c:\Users\HP 745 G6\Desktop\AI\frontend"" && npm run dev"

echo.
echo ============================================
echo   Both servers starting!
echo ============================================
echo.
echo   Backend:  http://localhost:8000
echo   AI Status: http://localhost:8000/api/v1/ai-status
echo   Frontend: http://localhost:3000
echo   Studio:   http://localhost:3000/studio
echo.
echo   Wait ~10 seconds, then open the URLs above.
echo.
pause
