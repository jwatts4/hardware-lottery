"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
function getAvailableComputers(filePath) {
    const wb = XLSX.readFile(filePath);
    const sheetNames = ["Laptops", "Mini PCs", "Desktops", "Workstations"];
    const serialField = "Serial #";
    const availableComputers = {};
    sheetNames.forEach((sheetName) => {
        const ws = wb.Sheets[sheetName];
        if (ws) {
            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1,
            });
            const serialIndex = data[0].indexOf(serialField);
        }
        else {
            console.log(`Error: worksheet not found: ${sheetName}`);
            serialNumbers[sheetName] = [];
        }
    });
    return serialNumbers;
}
const filePath = "../src/it-inventory.xlsx";
// readExcelFile(filePath);
console.log(getAvailableComputers(filePath));
