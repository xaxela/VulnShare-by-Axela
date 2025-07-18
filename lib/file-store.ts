
// This is a simple in-memory store for files.
// In a real application, this would be a database.

export type StoredFile = {
    name: string;
    description: string;
};

// This is our "database" table.
const files: StoredFile[] = [];

/**
 * Adds a file to the store.
 * @param file The file to add.
 */
export function addFile(file: StoredFile): void {
    // Avoid adding duplicate file names
    if (!files.some(f => f.name === file.name)) {
        files.push(file);
    }
}

/**
 * Retrieves all files from the store.
 * @returns A list of all stored files.
 */
export function getFiles(): StoredFile[] {
    return [...files]; // Return a copy to prevent direct mutation
}
