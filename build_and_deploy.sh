#!/bin/bash

# Load environment variables from .env file
if [ -f "./dashtar/frontend/.env.production" ]; then
    export $(cat "./dashtar/frontend/.env.production" | grep -v '^#' | xargs)
fi

# Set variables from environment
FTP_HOST="${VITE_APP_FTP_HOST}"
FTP_USER="${VITE_APP_FTP_USER}"
FTP_PASS="${VITE_APP_FTP_PASS}"
REMOTE_DIR="${VITE_APP_FTP_REMOTE_DIR}"
LOCAL_DIR="${VITE_APP_FTP_LOCAL_DIR}"

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "lftp is not installed. Attempting to install..."
    
    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            # Debian/Ubuntu
            echo "Installing lftp using apt-get..."
            sudo apt-get update
            sudo apt-get install -y lftp
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            echo "Installing lftp using yum..."
            sudo yum install -y lftp
        elif command -v dnf &> /dev/null; then
            # Fedora
            echo "Installing lftp using dnf..."
            sudo dnf install -y lftp
        else
            echo "Could not determine package manager. Please install lftp manually:"
            echo "For Debian/Ubuntu: sudo apt-get install lftp"
            echo "For CentOS/RHEL: sudo yum install lftp"
            echo "For Fedora: sudo dnf install lftp"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Installing lftp using Homebrew..."
            brew install lftp
        else
            echo "Homebrew is not installed. Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            echo "Installing lftp using Homebrew..."
            brew install lftp
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        echo "For Windows, please install lftp using one of these methods:"
        echo "1. Using Chocolatey: choco install lftp"
        echo "2. Using MSYS2: pacman -S lftp"
        echo "3. Using Cygwin: Install lftp through the Cygwin installer"
        echo "4. Using WSL (Windows Subsystem for Linux): wsl sudo apt-get install lftp"
        exit 1
    else
        echo "Unknown operating system. Please install lftp manually."
        exit 1
    fi
    
    # Check if installation was successful
    if ! command -v lftp &> /dev/null; then
        echo "lftp installation failed. Please install it manually."
        exit 1
    fi
    echo "lftp installed successfully!"
fi

# Navigate to the frontend directory
cd "$LOCAL_DIR" || exit

# Print current directory (for debugging)
echo "Current directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install --force

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Exiting."
    exit 1
fi

# Find the path to lftp
LFTP_PATH=$(command -v lftp)

echo "Starting FTP process..."
echo "FTP Host: $FTP_HOST"
echo "Remote Directory: $REMOTE_DIR"

# Use lftp with improved connection settings
lftp -d -c "
  # Connection settings
  set ftp:ssl-allow no;
  set ssl:verify-certificate no;
  set net:max-retries 3;
  set net:reconnect-interval-base 5;
  set net:reconnect-interval-multiplier 1;
  set net:connection-limit 5;
  set net:connection-takeover yes;
  set ftp:use-feat no;
  
  # Open connection
  open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST:21;
  
  # List contents before deletion
  echo 'Contents of remote directory before deletion:';
  ls $REMOTE_DIR;
  
  # Delete all files and directories in the remote directory
  echo 'Deleting contents of remote directory...';
  rm -rf $REMOTE_DIR/*;
  
  # List contents after deletion
  echo 'Contents of remote directory after deletion:';
  ls $REMOTE_DIR;
  
  # Upload new build with reduced parallelism
  echo 'Uploading new build...';
  mirror -R -v --parallel=3 --use-cache --no-empty-dirs \
    --exclude-glob .DS_Store --exclude-glob Thumbs.db \
    dist/ $REMOTE_DIR;
  
  # Ensure correct permissions for uploaded files
  echo 'Setting correct permissions...';
  find $REMOTE_DIR -type f -exec chmod 644 {} \;;
  find $REMOTE_DIR -type d -exec chmod 755 {} \;;
  
  # List contents after upload
  echo 'Contents of remote directory after upload:';
  ls $REMOTE_DIR;
  
  bye;
" 2>&1 | tee ftp_log.txt

# Check if lftp command was successful
if [ $? -eq 0 ]; then
    echo -e "\n\033[0;32mFTP transfer completed successfully!\033[0m"
    echo "Deployment completed successfully!"
else
    echo -e "\n\033[0;31mFTP transfer failed. Please check ftp_log.txt for details.\033[0m"
    echo "Deployment failed."
    exit 1
fi

echo "Check ftp_log.txt for full transfer details."
