# Hardware Lottery

This program is meant to read in an it-inventory.xlsx file and a preferences.xlsx file, then
allocate computers in the inventory to users in accordance with their preferences. The results
of the allocation algorithm will be written to a new `allocations.xlsx` file in the data/ folder.

## Usage

The program expects an `it-inventory.xlsx` file and a `preferences.xlsx` file located in a `data/`
folder at the project root.

To run the program, begin by installing all dependencies with `npm install`, then enter `npm run start`
to compile the typescript and execute the main file.
