import * as XLSX from "xlsx";

type Computer = {
    "Machine Name": string;
    CPU: string;
    RAM: string;
    Storage: string;
    "Purchase Date": Date;
    "Warranty Expiry": Date;
};

function getAvailableComputers(filePath: string) {
    const wb = XLSX.readFile(filePath);
    const sheetNames = ["Laptops", "Mini PCs", "Desktops", "Workstations"];
    const serialField = "Serial #";

    const availableComputers: { [sheetName: string]: Computer[] } = {};

    sheetNames.forEach((sheetName) => {
        const ws = wb.Sheets[sheetName];
        if (ws) {
            const data: string[][] = XLSX.utils.sheet_to_json(ws, {
                header: 1,
            });
            const serialIndex = data[0].indexOf(serialField);
        } else {
            console.log(`Error: worksheet not found: ${sheetName}`);
            serialNumbers[sheetName] = [];
        }
    });

    return serialNumbers;
}

const filePath = "../src/it-inventory.xlsx";

// readExcelFile(filePath);
console.log(getAvailableComputers(filePath));
