#!/bin/bash


arg1=$1
arg2=$2

srcDest=${arg1:="$HOME/work/root/server/zanata-war/src/main/webapp/resources/script/"}
deployedDest=${arg2:="/NotBackedUp/tools/jboss-eap/standalone/deployments/zanata.war/resources/script/"}

echo "$srcDest"
echo "$deployedDest"

cp bundle.js ${srcDest}/UserContributions.js
cp bundle.js ${deployedDest}/UserContributions.js
