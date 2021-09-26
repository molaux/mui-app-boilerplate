#!/bin/bash
title=$(echo "$1" | sed s#^./src/##g | sed 's%/% > %g')
if [ ! -e "$1/README.md" ] ; then
  echo "initializing default $1/README.md...";
  cat <<- EOF > "$1/README.md"
  # $title

  [API documentation](API.md)


  ## Introduction

EOF
fi
 echo "Building $1/API.md...";
yarn --silent run jsdoc2md "$1/*.js" > "$1/API.md"