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
SCRIPTS=(
launchpadx
mpd218
)

buildScripts(){
    echo "$1"
    echo "- Copying"
    CORE_TS_FILES=src/@core/core_*.ts
    DESTINATION=src/$1

    rm -f "$DESTINATION/core_*.ts" 2> /dev/null
    cp $CORE_TS_FILES "$DESTINATION/"
    
    rm -f "$DESTINATION/tsconfig.json"
    JSON_PRESET=src/@core/tsconfig.json
    cp $JSON_PRESET "$DESTINATION/"

    echo "- Compiling "
    tsc --project "$DESTINATION/"
    echo "- Done"
}

echo "Begining compilation"
for instrument in "${SCRIPTS[@]}"
do
    buildScripts $instrument
done


#
# Copy all outputs to destination folder
#
echo ""
echo "Copying to $DESTINATION/out"
rm -rd -f "$DESTINATION_FOLDER/out"
cp -r src/out "$DESTINATION_FOLDER/out"

#
#
#
echo ""
echo "~ ~ FIN ~ ~"