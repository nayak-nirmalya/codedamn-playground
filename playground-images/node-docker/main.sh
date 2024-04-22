#!/bin/bash

export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="$AWS_DEFAULT_REGION"

# exec aws s3 sync . s3://f09e3233-6a0e-4aec-b82b-77fbdedc08dd

printenv
node index.js
ls -al
