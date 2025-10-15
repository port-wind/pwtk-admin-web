#!/bin/bash

# manage-version.sh
# Script to manage version number in package.json with custom auto-increment logic

# Exit on error
set -e

# Logging functions
error_exit() { echo "ERROR: $1" >&2; exit 1; }
success_message() { echo "SUCCESS: $1"; }
info_message() { echo "INFO: $1"; }

# Ensure we're in the project directory
PROJECT_DIR=$(pwd)
info_message "Working in project directory: $PROJECT_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    error_exit "package.json not found in $PROJECT_DIR"
fi

# Read current version from package.json
CURRENT_VERSION=$(grep -m 1 '"version":' package.json | awk -F '"' '{print $4}')
if [ -z "$CURRENT_VERSION" ]; then
    error_exit "Could not read version from package.json"
fi

# Parse version components (x.y.z)
IFS='.' read -r x y z <<< "$CURRENT_VERSION"
info_message "Current version: $CURRENT_VERSION (x=$x, y=$y, z=$z)"

# Check if z is a number
if ! [[ "$z" =~ ^[0-9]+$ ]]; then
    error_exit "Patch version (z) must be a number, got: $z"
fi

# Auto-increment z, with carry-over to y if z > 99
z=$((z + 1))
if [ "$z" -gt 99 ]; then
    info_message "Patch version exceeded 99, incrementing minor version (y)..."
    y=$((y + 1))
    z=0
fi

# Construct new version
NEW_VERSION="$x.$y.$z"
info_message "New version: $NEW_VERSION"

# Update package.json with the new version
# Use sed to replace the version in package.json
sed -i '' -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$NEW_VERSION\"/" package.json || error_exit "Failed to update package.json"
success_message "Updated package.json to version $NEW_VERSION"

# Export the version as an environment variable for the build
export VITE_APP_VERSION=$NEW_VERSION
info_message "Exported VITE_APP_VERSION=$VITE_APP_VERSION for build"

# Output the new version for verification
echo "---------------------------------------------"
echo "New version: $NEW_VERSION"
echo "---------------------------------------------"

exit 0