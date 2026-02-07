# BeastMine Launcher - Windows Build Helper
# Запустите от имени администратора

$ErrorActionPreference = "Stop"

Write-Host "=== BeastMine Launcher Build Helper ===" -ForegroundColor Cyan

# Пути
$InstallDir = "$env:USERPROFILE\mingw64"
$DownloadUrl = "https://github.com/brechtsanders/winlibs_mingw/releases/download/13.2.0-16.0.6-11.0.1-ucrt-r1/winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r1.zip"

# Проверяем, установлен ли уже
if (Test-Path "$InstallDir\bin\gcc.exe") {
    Write-Host "MinGW уже установлен в $InstallDir" -ForegroundColor Green
} else {
    Write-Host "Скачивание MinGW-w64..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $DownloadUrl -OutFile "$env:TEMP\mingw.zip" -UseBasicParsing
        Write-Host "Распаковка..." -ForegroundColor Yellow
        Expand-Archive -Path "$env:TEMP\mingw.zip" -DestinationPath $env:USERPROFILE -Force
        Write-Host "MinGW установлен!" -ForegroundColor Green
    } catch {
        Write-Host "Ошибка при установке: $_" -ForegroundColor Red
        exit 1
    }
}

# Добавляем в PATH пользователя
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($CurrentPath -notlike "*$InstallDir\bin*") {
    Write-Host "Добавление MinGW в PATH..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$InstallDir\bin", "User")
    $env:Path = "$env:Path;$InstallDir\bin"
    Write-Host "PATH обновлен!" -ForegroundColor Green
}

# Создаем конфиг Cargo
$CargoConfigDir = "$env:USERPROFILE\.cargo"
$CargoConfigFile = "$CargoConfigDir\config.toml"

if (!(Test-Path $CargoConfigDir)) {
    New-Item -ItemType Directory -Path $CargoConfigDir -Force | Out-Null
}

$ConfigContent = @"
[target.x86_64-pc-windows-gnu]
linker = "$($InstallDir.Replace('\', '/'))/bin/gcc.exe"
ar = "$($InstallDir.Replace('\', '/'))/bin/ar.exe"

[build]
target = "x86_64-pc-windows-gnu"

[target.x86_64-pc-windows-gnu.dlltool]
path = "$($InstallDir.Replace('\', '/'))/bin/dlltool.exe"
"@

Set-Content -Path $CargoConfigFile -Value $ConfigContent
Write-Host "Конфигурация Cargo создана!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Установка завершена! ===" -ForegroundColor Green
Write-Host ""
Write-Host "ВАЖНО: Перезапустите терминал и выполните:" -ForegroundColor Yellow
Write-Host "  cd beastmine-launcher" -ForegroundColor Cyan
Write-Host "  cargo build --release" -ForegroundColor Cyan
Write-Host ""

# Проверяем, что все файлы на месте
if (Test-Path "$InstallDir\bin\dlltool.exe") {
    Write-Host "✓ dlltool.exe найден" -ForegroundColor Green
} else {
    Write-Host "✗ dlltool.exe НЕ найден" -ForegroundColor Red
}

if (Test-Path "$InstallDir\bin\gcc.exe") {
    Write-Host "✓ gcc.exe найден" -ForegroundColor Green
} else {
    Write-Host "✗ gcc.exe НЕ найден" -ForegroundColor Red
}

Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
