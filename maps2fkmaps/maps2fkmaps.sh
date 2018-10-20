#!/bin/bash

if [ ! -f "$1" ];
then
	echo "Argument is either not a file or does not exist. Aborting ..."
	exit 1
fi

echo "Step 1: Simple name replacements ..."
./maps2fkmaps-worker.sh "$1"

echo "Step 2: Removal of structures absent in FKmod ..."
./maps2fkmaps-worker.py "$1"
