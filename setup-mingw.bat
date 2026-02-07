@echo off
echo === BeastMine Launcher Quick Setup ===
echo.

:: Download and extract MinGW
set "MINGW_URL=https://github.com/brechtsanders/winlibs_mingw/releases/download/13.2.0-16.0.6-11.0.1-ucrt-r1/winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r1.zip"
set "MINGW_DIR=%USERPROFILE%\mingw64"

if not exist "%MINGW_DIR%\bin\gcc.exe" (
    echo Downloading MinGW (this may take a few minutes)...
    powershell -Command "Invoke-WebRequest -Uri '%MINGW_URL%' -OutFile '%TEMP%\mingw.zip'"
    
    echo Extracting MinGW...
    powershell -Command "Expand-Archive -Path '%TEMP%\mingw.zip' -DestinationPath '%USERPROFILE%' -Force"
)

:: Add to PATH
setx PATH "%PATH%;%MINGW_DIR%\bin" /M >nul 2>&1
set "PATH=%PATH%;%MINGW_DIR%\bin"

:: Set Cargo config for GNU toolchain
mkdir "%USERPROFILE%\.cargo" 2>nul
echo [target.x86_64-pc-windows-gnu] > "%USERPROFILE%\.cargo\config.toml"
echo linker = "%MINGW_DIR:\=/%/bin/gcc.exe" >> "%USERPROFILE%\.cargo\config.toml"
echo. >> "%USERPROFILE%\.cargo\config.toml"
echo [build] >> "%USERPROFILE%\.cargo\config.toml"
echo target = "x86_64-pc-windows-gnu" >> "%USERPROFILE%\.cargo\config.toml"

echo.
echo === Setup Complete! ===
echo Please RESTART your terminal and run:
echo   cd beastmine-launcher
echo   cargo build --release
echo.
pause
