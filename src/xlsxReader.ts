import * as XLSX from "xlsx";

type UserPreference = {
    userEmail: string;
    userName: string;
    preferences: string[]; // Array of computer serial numbers in preference order
};

type Computer = {
    "Machine Name": string;
    "Serial #": string;
    Charger: string;
};

function getAvailableComputers(filePath: string) {
    const wb = XLSX.readFile(filePath);
    const sheetNames = ["Laptops", "Mini PCs", "Desktops", "Workstations"];

    const availableComputers: { [sheetName: string]: Computer[] } = {};

    sheetNames.forEach((sheetName) => {
        const ws = wb.Sheets[sheetName];
        if (ws) {
            // An array of arrays, where each sub-array is a row
            const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

            const headers: string[] = data[0]; // First row is the header
            const rows: any[] = data.slice(1); // Rest of the rows (data minus the header row)

            availableComputers[sheetName] = rows.map((row) => {
                const computer: any = {};

                // Discards irrelevant columns
                headers.forEach((key, index) => {
                    if (key === "Serial #") {
                        computer["Serial #"] = row[index];
                    } else if (key === "Machine Name") {
                        computer["Machine Name"] = row[index];
                    } else if (key === "Charger") {
                        computer["Charger"] = row[index];
                    }
                });

                return computer as Computer;
            });
        } else {
            console.log(`Error: worksheet not found: ${sheetName}`);
            availableComputers[sheetName] = [];
        }
    });

    return availableComputers;
}

function getUserPreferences(filePath: string): UserPreference[] {
    const wb = XLSX.readFile(filePath);
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

const inventoryPath = "../src/it-inventory.xlsx";
const availableComputers = getAvailableComputers(inventoryPath);
console.log(availableComputers);

const preferencesPath = "../src/preferences.xlsx";
const userPreferences = getUserPreferences(preferencesPath);
console.log(userPreferences);

export { getAvailableComputers, getUserPreferences };
