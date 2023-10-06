#!/bin/bash

PARAMS=('-q 75')

if [ $# -ne 0 ]; then
	PARAMS=$@;
fi

cd $(pwd)

shopt -s nullglob nocaseglob extglob

for FILE in *.@(jpg|jpeg|tif|tiff|png|ico); do 
    cwebp $PARAMS "$FILE" -o "${FILE%.*}".webp;
done
