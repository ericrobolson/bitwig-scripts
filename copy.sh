# Copies relevant files to the Bitwig directory.

# Create env file
if [[ ! -f ".env" ]]; then
    echo "Please specify the directory to copy files to:"
    read dest
    echo "DESTINATION_FOLDER=$dest" >> .env
    exit
fi

source ./.env
# If there's an issue you may need to escape strings.


set -e

# Build files
tsc

# Copy files to dest
cp -r out/ "$DESTINATION_FOLDER"

#DESTINATION_FOLDER
ls "$DESTINATION_FOLDER"
