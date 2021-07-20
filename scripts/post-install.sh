#!/bin/sh

echo "Post Install Script:"

if [ ! -f ".env" ]; then
  touch .env
fi

node ./scripts/hash_generator.js