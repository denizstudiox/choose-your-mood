@echo off
REM ====== Choose Your Mood — kiosk baslatici ======
REM Chrome'u tam ekran (kiosk) modda acar. Cikmak icin: Alt+F4
setlocal
set "PAGE=%~dp0index.html"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
  start "" "%CHROME%" --kiosk --start-fullscreen --no-first-run ^
    --disable-pinch --overscroll-history-navigation=0 ^
    --disable-features=TranslateUI --autoplay-policy=no-user-gesture-required ^
    --user-data-dir="%~dp0.kiosk-profile" "file:///%PAGE:\=/%"
) else (
  echo Chrome bulunamadi, varsayilan tarayici aciliyor...
  start "" "%PAGE%"
)
endlocal
