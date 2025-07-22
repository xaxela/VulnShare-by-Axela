
// This is a simple in-memory store for users.
// In a real application, this would be a database.

export type StoredUser = {
    email: string;
    password: string; // In a real app, this should be a hashed password.
};

// This is our "database" table for users.
const users: StoredUser[] = [];

/**
 * Adds a user to the store.
 * @param user The user to add.
 */
export function addUser(user: StoredUser): void {
    if (!users.some(u => u.email === user.email)) {
        users.push(user);
    }
}

/**
 * Updates the password for a specific user.
 * @param email The email of the user to update.
 * @param newPassword The new password.
 */
export function updateUserPassword(email: string, newPassword: string): void {
    const user = users.find(u => u.email === email);
    if (user) {
        user.password = newPassword;
    }
}


/**
 * Checks if a user with the given email exists.
 * @param email The email to check.
 * @returns True if the user exists, false otherwise.
 */
export function userExists(email: string): boolean {
    return users.some(u => u.email === email);
}

/**
 * Retrieves a user by email.
 * @param email The email of the user to retrieve.
 * @returns The user object or undefined if not found.
 */
export function getUser(email: string): StoredUser | undefined {
    return users.find(u => u.email === email);
}

/**
 * Verifies a user's credentials.
 * @param email The user's email.
 * @param password The user's password.
 * @returns True if the credentials are valid, false otherwise.
 */
export function verifyUser(email: string, password: string): boolean {
    const user = getUser(email);
    return !!user && user.password === password;
}

/**
 * Retrieves all users from the store.
 * @returns A list of all stored users.
 */
export function getUsers(): StoredUser[] {
    return [...users]; // Return a copy to prevent direct mutation
}

// Add the default demo user to the store initially
addUser({ email: 'demo@vulnshare.local', password: 'password' });
