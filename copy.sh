#!/bin/bash


arg1=$1
arg2=$2

srcDest=${arg1:="$HOME/work/root/server/zanata-war/src/main/webapp/resources/script/user-profile/"}
deployedDest=${arg2:="/NotBackedUp/tools/jboss-eap/standalone/deployments/zanata.war/resources/script/user-profile/"}

echo "will copy bundle.js and bundle.js.map to [$srcDest] and [$deployedDest]"

cp bundle.js ${srcDest}
cp bundle.js.map ${srcDest} 
cp bundle.js ${deployedDest}
cp bundle.js.map ${srcDest}

