#!/bin/bash
clear
cat ascii_art.txt
nodemon --watch client/partials --watch server -e html,js
