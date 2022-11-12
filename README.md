# bitwig-scripts

A collection of instrument scripts for Bitwig.

# Installation

- Run `sh install.sh` to build and copy files to Bitwig. You may need to set the `DESTINATION_FOLDER` environment variable within `.env` manually depending on OS.

# Developer Notes

- The main controller script _must_ follow the path of `{name}.control.ts`
- This uses a stupid simple pattern of `src/@core` is copied to all files.
