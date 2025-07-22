
// This is a simple in-memory store for activity logs.
// In a real application, this would be a real-time database.

export type Activity = {
    type: 'USER_LOGIN' | 'FILE_UPLOAD' | 'ADMIN_LOGIN' | 'USER_REGISTER' | 'SYSTEM_INIT';
    text: string;
    time: string;
};

// This is our "database" table for activities.
const activityLog: Activity[] = [];

/**
 * Adds an activity to the log.
 * @param activity The activity to add.
 */
export function addActivityLog(activity: Omit<Activity, 'time'>): void {
    const newActivity: Activity = {
        ...activity,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    activityLog.unshift(newActivity); // Add to the beginning of the array
}

/**
 * Retrieves the entire activity log.
 * @returns A list of all stored activities.
 */
export function getActivityLog(): Activity[] {
    return [...activityLog]; // Return a copy
}

// Add an initial system message.
addActivityLog({ type: 'SYSTEM_INIT', text: 'System initialized. Awaiting first file upload.' });
