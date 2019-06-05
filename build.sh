#!/bin/bash

sudo rm -rf dist && sudo mkdir dist
npx babel app --out-dir dist/app --ignore node_modules  --extensions '.js,.jsx,.ts,.tsx'
cp package.json dist
cp index.js dist
cp ./.env dist
cp -r bin dist
cp -r config dist
cd dist && sudo mkdir logs && sudo npm install -only=production