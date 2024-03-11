import * as XLSX from "xlsx";

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

export function getAvailableComputers(filePath: string): Computer[] {
    console.log("filePath", filePath);
    const wb = XLSX.readFile(filePath);
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

export function getUserPreferences(filePath: string): UserPreference[] {
    console.log("filePath", filePath);
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
