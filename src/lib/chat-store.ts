
// This is a simple in-memory store for chat messages.
// In a real application, this would be a real-time database.

export interface Message {
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    sent: boolean;
    file?: { name: string; size: string };
    replyTo?: Message;
}

// This is our "database" table for messages.
const messages: Message[] = [];

let nextId = 1;

/**
 * Adds a message to the store.
 * @param message The message to add, without id or time.
 */
export function addMessage(message: Omit<Message, 'id' | 'time'>): void {
    const newMessage: Message = {
        ...message,
        id: nextId++,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    messages.push(newMessage);
}

/**
 * Retrieves all messages from the store.
 * @returns A list of all stored messages.
 */
export function getMessages(): Message[] {
    return [...messages]; // Return a copy to prevent direct mutation
}
