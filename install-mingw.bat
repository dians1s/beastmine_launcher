@echo off
chcp 65001 >nul
echo === BeastMine Launcher - Установка MinGW ===
echo.

:: Проверяем права администратора
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ОШИБКА] Запустите от имени администратора!
    pause
    exit /b 1
)

set "MINGW_DIR=%USERPROFILE%\mingw64"
set "ZIP_URL=https://github.com/brechtsanders/winlibs_mingw/releases/download/13.2.0-16.0.6-11.0.1-ucrt-r1/winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r1.zip"

:: Проверяем, установлен ли уже MinGW
if exist "%MINGW_DIR%\bin\gcc.exe" (
    echo [OK] MinGW уже установлен
    goto :configure
)

echo [*] Скачивание MinGW (это займет несколько минут)...
powershell -Command "& {Invoke-WebRequest -Uri '%ZIP_URL%' -OutFile '%TEMP%\mingw.zip'; Expand-Archive -Path '%TEMP%\mingw.zip' -DestinationPath '%USERPROFILE%' -Force}"

if errorlevel 1 (
    echo [ОШИБКА] Не удалось скачать или распаковать MinGW
    pause
    exit /b 1
)

echo [OK] MinGW установлен

:configure
echo [*] Настройка окружения...

:: Добавляем в PATH
setx PATH "%PATH%;%MINGW_DIR%\bin" /M >nul 2>&1
set "PATH=%PATH%;%MINGW_DIR%\bin"

:: Создаем конфиг Cargo
if not exist "%USERPROFILE%\.cargo" mkdir "%USERPROFILE%\.cargo"

(
echo [target.x86_64-pc-windows-gnu]
echo linker = "%MINGW_DIR:\=/%/bin/gcc.exe"
echo ar = "%MINGW_DIR:\=/%/bin/ar.exe"
echo.
echo [build]
echo target = "x86_64-pc-windows-gnu"
) > "%USERPROFILE%\.cargo\config.toml"

echo [OK] Настройка завершена

echo.
echo ========================================
echo === УСТАНОВКА ЗАВЕРШЕНА! ===
echo ========================================
echo.
echo ВАЖНО: Перезапустите терминал CMD или PowerShell!
echo.
echo Затем выполните:
echo   cd beastmine-launcher
echo   cargo build --release
echo.
echo Нажмите любую клавишу для выхода...
pause >nul
