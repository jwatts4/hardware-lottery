import { allComputerSerialNumbers } from "./inventory";

type UserPreference = {
    userId: string;
    preferences: string[]; // Array of computer serial numbers in preference order
};

// Example user preferences data
const userPreferences: UserPreference[] = [
    { userId: "user1", preferences: ["PC0D7FPE", "R90RXK4", "PC0DUC0CA"] },
    { userId: "user2", preferences: ["PC0DF6A1", "R90RXK4", "R90TFB6H"] },
    { userId: "user3", preferences: ["R90RXK4", "PF12UBDL", "PC0D7FPE"] },
    // ... more users
];

// Allocation function
function allocateComputers(
    allComputerSerialNumbers: string[],
    userPreferences: UserPreference[]
): any[] {
    let allocations: { userId: string; computerSerial: string | null }[] = [];

    let availableComputers = new Set(allComputerSerialNumbers);

    // Randomize user order for fairness
    userPreferences.sort(() => Math.random() - 0.5);

    userPreferences.forEach((user) => {
        let allocatedSerial: string | null = null;

        for (const preference of user.preferences) {
            if (availableComputers.has(preference)) {
                // User will only get one of their preferences
                allocatedSerial = preference;
                availableComputers.delete(preference);
                break;
            }
        }

        allocations.push({
            userId: user.userId,
            computerSerial: allocatedSerial,
        });
    });

    // Add all users who didn't get a computer to the allocations list with `null`
    allocations = allocations.map((allocation) => {
        if (allocation.computerSerial === null) {
            console.log(`No computers left for ${allocation.userId}`);
        }
        return allocation;
    });

    return allocations;
}

// Execute the allocation
const allocations = allocateComputers(
    allComputerSerialNumbers,
    userPreferences
);

// Output the allocations
console.log(allocations);

export {};
