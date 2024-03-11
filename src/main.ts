import { allocateComputers } from "./allocate";
import { getAvailableComputers, getUserPreferences } from "./xlsxReader";

// Paths to your Excel files
const inventoryPath = "../data/it-inventory.xlsx";
const userPreferencesPath = "../data/preferences.xlsx";

function main() {
    try {
        // Retrieve the available computers from the inventory
        const availableComputers = getAvailableComputers(inventoryPath);

        // Retrieve the user preferences
        const userPreferences = getUserPreferences(userPreferencesPath);

        // Allocate the computers based on user preferences
        const allocations = allocateComputers(
            availableComputers,
            userPreferences
        );

        // Output the allocations
        console.log("Computer Allocations:", allocations);
        console.log("Hello world");

        // Here you might want to do something with the allocations,
        // like saving them to a file or sending them somewhere else
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
