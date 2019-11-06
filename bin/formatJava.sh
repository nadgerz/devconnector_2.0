#!/bin/sh

startDir=${1:-"."}

java -jar ~/bin/google-java-format-1.7-all-deps.jar --replace $(find ${startDir} -type f -name \*.java)

