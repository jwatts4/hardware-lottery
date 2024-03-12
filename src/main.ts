import { allocateComputers } from "./allocate";
import path from "path";
import {
  getAvailableComputers,
  getUserPreferences,
  getFakeUserPreferences,
  writeAllocationsToExcel,
  UserPreference,
  Computer,
} from "./xlsxReader";

const inventoryPath = path.join(__dirname, "../data/it-inventory.xlsx");
const userPreferencesPath = path.join(__dirname, "../data/preferences.xlsx");
const savePath = path.join(__dirname, "../data/allocations.xlsx");
const testSavePath = path.join(__dirname, "../data/test-allocations.xlsx");

async function main() {
  try {
    const availableComputers: Computer[] = getAvailableComputers(inventoryPath);
    // Test preferences
    const fakeUserPreferences: UserPreference[] =
      getFakeUserPreferences(inventoryPath);
    const fakeAllocations = allocateComputers(
      availableComputers,
      fakeUserPreferences
    );
    writeAllocationsToExcel(testSavePath, fakeAllocations);

    // Real preferences
    const userPreferences: UserPreference[] =
      getUserPreferences(userPreferencesPath);
    const allocations = allocateComputers(availableComputers, userPreferences);
    writeAllocationsToExcel(savePath, allocations);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
