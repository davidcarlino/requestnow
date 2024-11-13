# Load environment variables from .env file
if (Test-Path "./dashtar/frontend/.env.production") {
    Get-Content "./dashtar/frontend/.env.production" | ForEach-Object {
        if ($_ -match '^([^#].+?)=(.+)') {
            $name = $matches[1]
            $value = $matches[2]
            Set-Item -Path "Env:$name" -Value $value
        }
    }
}

# Set variables from environment
$FTP_HOST = $env:VITE_APP_FTP_HOST
$FTP_USER = $env:VITE_APP_FTP_USER
$FTP_PASS = $env:VITE_APP_FTP_PASS
$REMOTE_DIR = $env:VITE_APP_FTP_REMOTE_DIR
$LOCAL_DIR = $env:VITE_APP_FTP_LOCAL_DIR

# Check if WinSCP is installed
$winscpPath = "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com"
if (-not (Test-Path $winscpPath)) {
    Write-Host "WinSCP is not installed. Attempting to install using Chocolatey..."
    
    # Check if Chocolatey is installed
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Chocolatey..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    }
    
    # Install WinSCP
    Write-Host "Installing WinSCP..."
    choco install winscp -y
    
    if (-not (Test-Path $winscpPath)) {
        Write-Host "WinSCP installation failed. Please install it manually from https://winscp.net/"
        exit 1
    }
    Write-Host "WinSCP installed successfully!"
}

# Navigate to the frontend directory
Set-Location $LOCAL_DIR

# Print current directory (for debugging)
Write-Host "Current directory: $(Get-Location)"

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Build the project
Write-Host "Building the project..."
npm run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Exiting."
    exit 1
}

Write-Host "Starting FTP process..."
Write-Host "FTP Host: $FTP_HOST"
Write-Host "Remote Directory: $REMOTE_DIR"

# Create WinSCP script
$winscpScript = @"
option batch abort
option confirm off
open ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}:21 -rawsettings ProxyPort=0 FtpSecure=0

# List contents before deletion
ls $REMOTE_DIR

# Delete existing files
rm $REMOTE_DIR/*

# List contents after deletion
ls $REMOTE_DIR

# Upload new build
lcd ./dist
cd $REMOTE_DIR
put -resume -transfer=binary *

# Set permissions (if FTP server supports SITE command)
chmod 644 $REMOTE_DIR/*
chmod 755 $REMOTE_DIR/

# List contents after upload
ls $REMOTE_DIR

exit
"@

# Save WinSCP script to temporary file
$scriptPath = [System.IO.Path]::GetTempFileName()
$winscpScript | Out-File -FilePath $scriptPath -Encoding ASCII

# Execute WinSCP script and log output
$logPath = "ftp_log.txt"
& $winscpPath /script="$scriptPath" /log="$logPath"

# Check if WinSCP transfer was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nFTP transfer completed successfully!" -ForegroundColor Green
    Write-Host "Deployment completed successfully!"
}
else {
    Write-Host "`nFTP transfer failed. Please check ftp_log.txt for details." -ForegroundColor Red
    Write-Host "Deployment failed."
    exit 1
}

Write-Host "Check ftp_log.txt for full transfer details."

# Clean up temporary script file
Remove-Item $scriptPath 