# Load environment variables from .env file
$envFilePath = "./dashtar/frontend/.env.production"
if (Test-Path $envFilePath) {
    Get-Content $envFilePath | ForEach-Object {
        if ($_ -notmatch '^#') {
            $name, $value = $_ -split '='
            [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
        }
    }
}

# Set variables from environment
$FTP_HOST = $env:VITE_APP_FTP_HOST
$FTP_USER = $env:VITE_APP_FTP_USER
$FTP_PASS = $env:VITE_APP_FTP_PASS
$REMOTE_DIR = $env:VITE_APP_FTP_REMOTE_DIR
$LOCAL_DIR = $env:VITE_APP_FTP_LOCAL_DIR

# Check if lftp is installed
if (-not (Get-Command lftp -ErrorAction SilentlyContinue)) {
    Write-Host "lftp is not installed. Attempting to install..."

    # Check if Chocolatey is installed
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Chocolatey is not installed. Installing Chocolatey first..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    }

    Write-Host "Installing lftp using Chocolatey..."
    choco install lftp -y

    # Check if installation was successful
    if (-not (Get-Command lftp -ErrorAction SilentlyContinue)) {
        Write-Host "lftp installation failed. Please install it manually."
        exit 1
    }
    Write-Host "lftp installed successfully!"
}

# Navigate to the frontend directory
Set-Location -Path $LOCAL_DIR

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

# Use lftp
$lftpCommand = @"
set ftp:ssl-allow no;
set ssl:verify-certificate no;
set net:max-retries 3;
set net:reconnect-interval-base 5;
set net:reconnect-interval-multiplier 1;
open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST:21;

# List contents before deletion
echo 'Contents of remote directory before deletion:';
ls $REMOTE_DIR;

# Delete all files and directories in the remote directory
echo 'Deleting contents of remote directory...';
mrm $REMOTE_DIR/*;

# List contents after deletion
echo 'Contents of remote directory after deletion:';
ls $REMOTE_DIR;

# Upload new build
echo 'Uploading new build...';
mirror -R -v --parallel=10 --exclude-glob .DS_Store --exclude-glob Thumbs.db dist/ $REMOTE_DIR;

# Ensure correct permissions for uploaded files
echo 'Setting correct permissions...';
chmod -R 644 $REMOTE_DIR/*;
find $REMOTE_DIR -type d -exec chmod 755 {} +;

# List contents after upload
echo 'Contents of remote directory after upload:';
ls $REMOTE_DIR;

bye;
"@

$lftpCommand | lftp 2>&1 | Tee-Object -FilePath ftp_log.txt

# Check if lftp command was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n`e[0;32mFTP transfer completed successfully!`e[0m"
    Write-Host "Deployment completed successfully!"
} else {
    Write-Host "`n`e[0;31mFTP transfer failed. Please check ftp_log.txt for details.`e[0m"
    Write-Host "Deployment failed."
    exit 1
}

Write-Host "Check ftp_log.txt for full transfer details."