@echo off
chcp 65001 >nul
title Bot WhatsApp - Agendamento APMP (lembretes)
cd /d "C:\Users\lisan\agendamento-apmp"

:loop
echo ============================================
echo  Iniciando bot de lembretes WhatsApp - APMP
echo  %date% %time%
echo  (Pode minimizar. NAO feche esta janela.)
echo ============================================
node bot-whatsapp.js
echo.
echo  ! O bot parou. Reiniciando em 10 segundos...
echo  (Para encerrar de vez, feche esta janela.)
timeout /t 10 /nobreak >nul
goto loop
