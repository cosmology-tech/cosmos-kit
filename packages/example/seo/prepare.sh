#!/bin/bash

export S3_BUCKET=test.cosmoskit.com

(cd out &&
  find . -type f -name '*.html' | while read HTMLFILE; do
    HTMLFILESHORT=${HTMLFILE:2}
    # HTMLFILE_WITHOUT_INDEX=${HTMLFILESHORT::${#HTMLFILESHORT}-11}

    HTMLFILE_WITHOUT_INDEX=${HTMLFILESHORT//index.html/}
    HTMLFILE_WITHOUT_HTML=${HTMLFILE_WITHOUT_INDEX//.html/}


    # cp /about/index.html to /about
    aws s3 cp s3://$S3_BUCKET/${HTMLFILESHORT} s3://$S3_BUCKET/$HTMLFILE_WITHOUT_HTML
    echo aws s3 cp s3://$S3_BUCKET/${HTMLFILESHORT} s3://$S3_BUCKET/$HTMLFILE_WITHOUT_HTML

    if [ $? -ne 0 ]; then
      echo "***** Failed renaming build to $S3_BUCKET (html)"
      exit 1
    fi
  done)
