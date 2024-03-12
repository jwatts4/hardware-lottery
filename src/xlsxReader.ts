import * as XLSX from "xlsx";
import { faker } from "@faker-js/faker";
import { Allocation } from "./allocate";

export type UserPreference = {
  userEmail: string;
  userName: string;
  preferences: string[]; // Array of computer serial numbers in preference order
};

export type Computer = {
  "Machine Name": string;
  "Serial #": string;
  Charger: string;
};

export function getAvailableComputers(inventoryPath: string): Computer[] {
  const wb = XLSX.readFile(inventoryPath);
  const sheetNames = ["Laptops", "Mini PCs", "Desktops", "Workstations"];

  const availableComputers: Computer[] = [];

  sheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    if (ws) {
      // An array of arrays, where each sub-array is a row
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers: string[] = data[0]; // First row is the header
      const rows: any[] = data.slice(1); // Rest of the rows (data minus the header row)

      rows.forEach((row) => {
        const computer: Partial<Computer> = {};

        // Map relevant columns to computer properties
        headers.forEach((key, index) => {
          if (key === "Serial #") {
            computer["Serial #"] = row[index];
          } else if (key === "Machine Name") {
            computer["Machine Name"] = row[index];
          } else if (key === "Charger") {
            computer["Charger"] = row[index];
          }
        });

        // Add the computer object to the array if it has been properly formed
        if (computer["Serial #"] && computer["Machine Name"]) {
          availableComputers.push(computer as Computer);
        }
      });
    } else {
      console.log(`Error: worksheet not found: ${sheetName}`);
    }
  });

  return availableComputers;
}

export function getUserPreferences(preferencePath: string): UserPreference[] {
  const wb = XLSX.readFile(preferencePath);
  const ws = wb.Sheets["Sheet1"];

  // An array of arrays, where each sub-array is a row
  const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const headers: string[] = data[0]; // First row is the header
  const rows: any[][] = data.slice(1); // Rest of the rows (data minus the header row)

  // Produce an array of objects, where each object is a user preference, using the headers as keys
  const userPreferences: UserPreference[] = rows.map((row) => {
    const userPreference: any = {};
    userPreference.preferences = [];

    // Discards irrelevant columns
    headers.forEach((key, index) => {
      if (key === "Email") {
        userPreference["userEmail"] = row[index];
      } else if (key === "Name") {
        userPreference["userName"] = row[index];
      } else if (key === "First Choice - Serial Number") {
        userPreference.preferences.push(row[index]);
      } else if (key === "Second Choice - Serial Number") {
        userPreference.preferences.push(row[index]);
      } else if (key === "Third Choice - Serial Number") {
        userPreference.preferences.push(row[index]);
      }
    });
    return userPreference as UserPreference;
  });

  return userPreferences;
}

export function getFakeUserPreferences(
  inventoryPath: string,
  numResponses: number = 25
): UserPreference[] {
  const availableComputers = getAvailableComputers(inventoryPath);
  const shuffledComputers = availableComputers.sort(() => Math.random() - 0.5);
  const userPreferences: UserPreference[] = [];

  for (let i = 0; i < numResponses; i++) {
    const userName = faker.person.fullName();
    const userEmail = faker.internet.email({
      firstName: userName.split(" ")[0].toLowerCase(),
      lastName: userName.split(" ")[1].toLowerCase(),
      provider: "enovapower.com",
      allowSpecialCharacters: false,
    });

    // Each user will have a set of up to 3 unique serial number preferences.
    function getRandomIndices(length: number) {
      let randomIndices: number[] = [];
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * length);
        while (randomIndices.includes(randomIndex)) {
          randomIndex = Math.floor(Math.random() * shuffledComputers.length);
        }
        randomIndices.push(randomIndex);
      }
      return randomIndices;
    }

    const randomIndices = getRandomIndices(shuffledComputers.length);

    const preferences: string[] = randomIndices.map((index) => {
      return shuffledComputers[index]["Serial #"];
    });

    userPreferences.push({
      userName: userName,
      userEmail: userEmail,
      preferences: preferences,
    });
  }

  return userPreferences;
}

export function writeAllocationsToExcel(
  savePath: string,
  allocations: Allocation[]
): void {
  const transformedAllocations = allocations.map((allocation) => ({
    "User Name": allocation.userName,
    "User Email": allocation.userEmail,
    "Serial Number": allocation.computer
      ? allocation.computer["Serial #"]
      : "n/a",
    "Machine Name": allocation.computer
      ? allocation.computer["Machine Name"]
      : "n/a",
  }));

  const wb = XLSX.utils.book_new();
  // Build a worksheet manually to include headers
  const ws = XLSX.utils.json_to_sheet([], {
    header: ["User Name", "User Email", "Serial Number", "Machine Name"],
  });

  // Starting from A2 to leave A1 for header titles
  XLSX.utils.sheet_add_json(ws, transformedAllocations, {
    origin: "A2",
    skipHeader: true,
  });

  XLSX.utils.book_append_sheet(wb, ws, "Allocations");
  XLSX.writeFile(wb, savePath);
}
