import { UserPreference, Computer } from "./xlsxReader";

type Allocation = {
    userName: string;
    userEmail: string;
    computer: Computer | null;
};

export function allocateComputers(
    computers: Computer[],
    userPreferences: UserPreference[]
): Allocation[] {
    let allocations: Allocation[] = [];

    // Create a Set of available computer serial numbers
    let availableComputerSerials = new Set(
        computers.map((computer) => computer["Serial #"])
    );

    // Randomize user order for fairness
    userPreferences.sort(() => Math.random() - 0.5);

    // Loop through each user
    userPreferences.forEach((user) => {
        let allocatedComputer: Computer | null = null;

        // Loop through the given user's preferences
        for (const preference of user.preferences) {
            if (availableComputerSerials.has(preference)) {
                // Allocate the first available preferred computer
                allocatedComputer =
                    computers.find((c) => c["Serial #"] === preference) || null;
                if (allocatedComputer) {
                    // If found, remove it from the set of available computers
                    availableComputerSerials.delete(preference);
                    break;
                }
            }
        }

        allocations.push({
            userName: user.userName,
            userEmail: user.userEmail, // Assuming userEmail should be used as userId
            computer: allocatedComputer,
        });
    });

    return allocations;
}
