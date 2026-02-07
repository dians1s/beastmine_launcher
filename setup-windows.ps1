# BeastMine Launcher - Windows Setup Script
# Run as Administrator in PowerShell

Write-Host "=== BeastMine Launcher Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if winget is available
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "Installing winget..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://aka.ms/getwinget" -OutFile "$env:TEMP\winget.msixbundle"
    Add-AppxPackage -Path "$env:TEMP\winget.msixbundle"
}

# Install Visual Studio Build Tools (includes linker)
Write-Host "Installing Visual Studio Build Tools..." -ForegroundColor Yellow
winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"

# Install Rust (if not installed)
if (!(Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Rust..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://win.rustup.rs" -OutFile "$env:TEMP\rustup-init.exe"
    & "$env:TEMP\rustup-init.exe" -y
    $env:PATH += ";$env:USERPROFILE\.cargo\bin"
}

# Install Node.js (if not installed)
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    winget install --id OpenJS.NodeJS.LTS
}

Write-Host ""
Write-Host "=== Installation Complete ===" -ForegroundColor Green
Write-Host "Please RESTART your terminal/IDE and then run:" -ForegroundColor Cyan
Write-Host "  cd beastmine-launcher" -ForegroundColor White
Write-Host "  cargo build --release" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
