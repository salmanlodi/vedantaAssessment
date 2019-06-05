#!/bin/bash

git fetch 

npx babel app --out-dir dist/app --ignore node_modules --extensions '.js,.jsx,.ts,.tsx'
pm2 restart 3
pm2 logs 3
