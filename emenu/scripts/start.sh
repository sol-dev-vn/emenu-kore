#!/bin/bash

# Build and start script for the eMenu application
echo "Starting eMenu application with build step..."

# Run build
echo "Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful, starting server..."
    npm start
else
    echo "Build failed, exiting with error"
    exit 1
fi