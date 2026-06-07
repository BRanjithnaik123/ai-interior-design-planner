@echo off
echo ================================================================
echo   DesignAI - Quick Verification (No Server Required)
echo ================================================================
echo.

cd /d "%~dp0backend"

echo [1] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo [2] Checking Python dependencies...
echo.
python -c "import fastapi; print(f'  fastapi     v{fastapi.__version__}  OK')" 2>nul || echo   fastapi     MISSING
python -c "import uvicorn; print(f'  uvicorn     v{uvicorn.__version__}  OK')" 2>nul || echo   uvicorn     MISSING
python -c "import openai; print(f'  openai      v{openai.__version__}  OK')" 2>nul || echo   openai      MISSING - run: pip install "openai>=1.0.0"
python -c "import httpx; print(f'  httpx       v{httpx.__version__}  OK')" 2>nul || echo   httpx       MISSING
python -c "import pydantic; print(f'  pydantic    v{pydantic.__version__}  OK')" 2>nul || echo   pydantic    MISSING
python -c "import dotenv; print('  python-dotenv  OK')" 2>nul || echo   dotenv      MISSING
python -c "import sqlalchemy; print(f'  sqlalchemy  v{sqlalchemy.__version__}  OK')" 2>nul || echo   sqlalchemy  MISSING
python -c "from PIL import Image; import PIL; print(f'  Pillow      v{PIL.__version__}  OK')" 2>nul || echo   Pillow      MISSING
echo.

echo [3] Checking .env variables...
echo.
python -c "from dotenv import load_dotenv; load_dotenv(); import os; k=os.getenv('OPENAI_API_KEY',''); u=os.getenv('OPENAI_BASE_URL',''); m=os.getenv('OPENAI_MODEL',''); print(f'  OPENAI_API_KEY  = {k[:4]}...{k[-4:]}' if len(k)>8 else f'  OPENAI_API_KEY  = {k or \"(empty)\"}'); print(f'  OPENAI_BASE_URL = {u or \"(empty)\"}'); print(f'  OPENAI_MODEL    = {m or \"(empty)\"}')"
echo.

echo [4] Checking module imports...
echo.
python -c "from app.config import settings; print(f'  app.config         OK  (project={settings.PROJECT_NAME})')" 2>nul || echo   app.config         FAIL
python -c "from app.services.openai_service import OPENAI_MODEL; print(f'  openai_service     OK  (model={OPENAI_MODEL})')" 2>nul || echo   openai_service     FAIL
python -c "from app.services.ai_service import generate_design, build_prompt, analyze_room; print('  ai_service         OK  (all functions)')" 2>nul || echo   ai_service         FAIL
python -c "from app.main import app; print(f'  app.main           OK  (title={app.title})')" 2>nul || echo   app.main           FAIL
echo.

echo [5] Running integration verification script...
echo.
python verify_integration.py 2>nul
if %errorlevel% neq 0 (
    echo   Verification script encountered errors. See output above.
)

echo.
echo ================================================================
echo   NEXT STEPS:
echo   1. If openai is MISSING: pip install "openai>=1.0.0"
echo   2. Replace API key in backend\.env line 22
echo   3. Start server: start_backend.bat
echo   4. Test: http://localhost:8000/api/v1/openai-test
echo ================================================================
pause
