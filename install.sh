# Copies relevant files to the Bitwig directory.

# Create env file
if [[ ! -f ".env" ]]; then
    echo "Please specify the directory to copy files to:"
    read dest
    echo "DESTINATION_FOLDER=$dest" >> .env
    exit
fi

source ./.env
echo "target: '$DESTINATION_FOLDER'"
echo ""
# If there's an issue you may need to escape strings.

set -e

#
# Build and copy all scripts
#

# All scripts that live in src/*

rm -rd -f src/out

buildScripts(){
    echo "$1"
    echo "- Copying"
    CORE_TS_FILES=src/@core/core_*.ts
    DESTINATION=$1

    rm -f "$DESTINATION/core_*.ts" 2> /dev/null
    [[ ! -d "$DESTINATION/core" ]] && mkdir "$DESTINATION/core/";
    cp $CORE_TS_FILES "$DESTINATION/core/"
    
    rm -f "$DESTINATION/tsconfig.json"
    JSON_PRESET=src/@core/tsconfig.json
    cp $JSON_PRESET "$DESTINATION/"

    echo "- Compiling "
    tsc --project "$DESTINATION/"
    echo "- Done"
}


for controlFile in src/*; do
    echo $controlFile
    if [[ "$controlFile" == "src/out" || "$controlFile" == "src/@core" ]]; then
        echo "Skipping $controlFile"
    else 
        buildScripts "$controlFile"
    fi
done

#
# Combine files
#
echo "Begin single file generation"
for controlFile in src/out/*.control.js; do
    echo "generating $controlFile"
    NEW_TARGET="$controlFile.final"

    # add all core files to control files
    rm -f $NEW_TARGET


    echo "//" >> $NEW_TARGET
    echo "// Copyright (c) 2022 Eric Robert Olson" >> $NEW_TARGET
    echo "// MIT License" >> $NEW_TARGET
    echo "//" >> $NEW_TARGET
    echo "// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND" >> $NEW_TARGET
    echo "// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND" >> $NEW_TARGET
    echo "// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND" >> $NEW_TARGET
    echo "// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND" >> $NEW_TARGET
    echo "//" >> $NEW_TARGET
    echo "" >> $NEW_TARGET


    # Core files
    for utilFile in src/out/core/*.js; do
        if [[ "$utilFile" != "$controlFile" ]]; then
            echo "//" >> $NEW_TARGET
            echo "// $utilFile" >> $NEW_TARGET
            echo "//" >> $NEW_TARGET
            echo "$(cat $utilFile)" >> $NEW_TARGET
            echo "- $utilFile done"
        fi
    done

    # Any other JS files
    echo "If you are missing any files ensure that you're sourcing them before appending them to the file."
    for utilFile in src/out/*.js src/out/**/*.js src/out/**/**/*.js; do
        if [[ "$utilFile" != "$controlFile" ]]; then
            echo "//" >> $NEW_TARGET
            echo "// $utilFile" >> $NEW_TARGET
            echo "//" >> $NEW_TARGET
            echo "$(cat $utilFile)" >> $NEW_TARGET
            echo "- $utilFile done"
        fi
    done


    echo "//" >> $NEW_TARGET
    echo "// $controlFile" >> $NEW_TARGET
    echo "//" >> $NEW_TARGET
    echo "$(cat $controlFile)" >> $NEW_TARGET
    echo "- $controlFile done"
    rm -f $controlFile

    mv $NEW_TARGET $controlFile
    cp $controlFile plugins/ 

  #  cat "$controlFile"
done

#
# Copy all outputs to destination folder
#
echo ""
echo "Copying to $DESTINATION/out"
#rm -rd -f "$DESTINATION_FOLDER/out"
cp -r src/out "$DESTINATION_FOLDER/out"

#
#
#
echo ""
echo "~ ~ FIN ~ ~"
