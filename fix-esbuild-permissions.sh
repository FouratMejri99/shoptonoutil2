#!/bin/bash
# Fix esbuild permissions for Vite build

# Find and fix esbuild binary permissions
find . -name "esbuild" -type f -path "*/node_modules/*" -exec chmod +x {} \; 2>/dev/null

# Also fix @esbuild binaries specifically
find . -name "esbuild" -type f -path "*/@esbuild/*/bin/*" -exec chmod +x {} \; 2>/dev/null

# Fix any .node files
find . -name "*.node" -type f -path "*/node_modules/*" -exec chmod +x {} \; 2>/dev/null

echo "Fixed esbuild permissions"
