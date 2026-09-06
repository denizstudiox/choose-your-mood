@echo off
REM ====== Choose Your Mood — yerel ag sunucusu ======
REM Ayni Wi-Fi'daki telefon/tabletten acmak icin.
REM Kapatmak: bu pencereyi kapatin ya da Ctrl+C
cd /d "%~dp0"
echo.
echo   Bu bilgisayardan : http://localhost:5003
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo   Telefondan       : http:%%a:5003
echo.
python -m http.server 5003 --bind 0.0.0.0
