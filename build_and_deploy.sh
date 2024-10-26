#!/bin/bash

# Set variables
FTP_HOST="ftp.gigmaster.co"
FTP_USER="upwork@gigmaster.co"
FTP_PASS="Chetan2024!!"
REMOTE_DIR="/public_html/requestnow"
LOCAL_DIR="./dashtar/frontend"

# Navigate to the frontend directory
cd "$LOCAL_DIR" || exit

# Print current directory (for debugging)
echo "Current directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Exiting."
    exit 1
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "lftp is not installed. Please install it and try again."
    exit 1
fi

# Find the path to lftp
LFTP_PATH=$(command -v lftp)

echo "Starting FTP process..."
echo "FTP Host: $FTP_HOST"
echo "Remote Directory: $REMOTE_DIR"

# Use lftp
lftp -d -c "
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
