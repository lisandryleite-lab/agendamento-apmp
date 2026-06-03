@echo off
chcp 65001 >nul
title Reset do Bot WhatsApp - Agendamento APMP
cd /d "%~dp0"

echo ============================================
echo   Reset da sessao do bot WhatsApp (APMP)
echo ============================================
echo.

REM 1) Zera a sessao Baileys no MongoDB (forca QR novo)
echo [1/2] Apagando a sessao quebrada no banco...
node reset-bot-session.js
if errorlevel 1 (
  echo.
  echo  X Falhou ao resetar. Verifique sua internet e o MONGODB_URI no .env
  echo.
  pause
  exit /b 1
)
echo.

REM 2) Descobre a URL do bot (pergunta na 1a vez, guarda em bot-url.txt)
set "URLFILE=%~dp0bot-url.txt"
set "BOTURL="
if exist "%URLFILE%" set /p BOTURL=<"%URLFILE%"

if "%BOTURL%"=="" (
  echo Cole a URL do bot no Railway ^(ex.: https://seu-bot.up.railway.app^)
  set /p BOTURL="URL: "
  > "%URLFILE%" echo %BOTURL%
)

echo.
echo [2/2] Abrindo a pagina do QR code no navegador...
start "" "%BOTURL%/qr"

echo.
echo ============================================
echo  Agora no celular:
echo   WhatsApp - Aparelhos conectados - Conectar aparelho
echo   e escaneie o QR code que abriu no navegador.
echo.
echo  Se nao aparecer QR, reinicie o servico do bot no
echo  Railway (Deployments - Restart) e atualize a pagina.
echo ============================================
echo.
pause
