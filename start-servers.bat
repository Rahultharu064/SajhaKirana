@echo off
echo Starting SajhaKirana servers...
echo.

echo Starting backend server...
start /B cmd /C "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start /B cmd /C "cd frontend && npm run dev"

echo.
echo Servers are starting up...
echo - Backend: http://localhost:5003
echo - Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
