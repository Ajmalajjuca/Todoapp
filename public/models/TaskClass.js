export class Task {
    constructor(title, priority) {
        this.id = Date.now().toString(); // Unique ID based on timestamp
        this.title = title;
        this.priority = priority;
        this.isCompleted = false;
    }
}
