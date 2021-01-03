@echo off

color E
echo Installation/mise a jour des dependances en cours. Veuillez patienter..
call npm install >NUL
call npm update
echo.
color 2
echo Installation/mise a jour reussie avec succes

if NOT ["%errorlevel%"]==["0"] (
  pause
  exit /b %errorlevel%
)

echo.
color E
echo Lancement du bot..
echo.

call node index.js

if NOT ["%errorlevel%"]==["0"] (
  pause
  exit /b %errorlevel%
)