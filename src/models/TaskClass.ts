import { TaskPriority } from "./TaskPriority.js";

export class Task {
    id: string;
    title: string;
    priority: TaskPriority;
    isCompleted: boolean;

    constructor(title: string, priority: TaskPriority ) {
        this.id = Date.now().toString(); // Unique ID based on timestamp
        this.title = title;
        this.priority = priority;
        this.isCompleted = false;
    }
}