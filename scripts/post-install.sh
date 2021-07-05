#!/bin/sh

echo "Post Install Script:"

echo "Setting kernel version"

if [ ! -f ".env" ]; then
  echo "file .env does not exist. creating..."
  touch .env
fi

echo "Creating hash versions"
node ./scripts/hash_generator.js

echo ""
echo "Post install script done! 😘😘😘"
echo ""
