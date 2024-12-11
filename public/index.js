import { TaskPriority } from './models/TaskPriority.js';
import { Task } from './models/TaskClass.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.storageKey = 'tasks';
        this.loadFromStorage();
    }
    addTask(task) {
        this.tasks.push(task);
        this.saveToStorage();
        this.renderTasks();
    }
    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToStorage();
        this.renderTasks();
    }
    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.isCompleted = !task.isCompleted;
            this.saveToStorage();
            this.renderTasks();
        }
    }
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }
    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.tasks = JSON.parse(data).map((task) => {
                return new Task(task.title, task.priority);
            });
            this.renderTasks();
        }
    }
    renderTasks() {
        const taskList = document.querySelector('.todo-list');
        taskList.innerHTML = ''; // Clear existing tasks
        this.tasks.forEach(task => {
            // Create task element
            const taskItem = document.createElement('li');
            console.log('taskItem>>', taskItem);
            taskItem.className = `todo-item ${task.isCompleted ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="todo-item-left">
                    <input type="checkbox" class="custom-checkbox" ${task.isCompleted ? 'checked' : ''} data-id="${task.id}">
                    <span>${task.title}</span>
                    <span class="priority-badge ${TaskPriority[task.priority].toLowerCase()}">
                        ${TaskPriority[task.priority]}
                    </span>
                </div>
                <button data-id="${task.id}">❌</button>
            `;
            taskList.appendChild(taskItem);
        });
        // Add event listeners for task actions
        this.addEventListeners();
    }
    addEventListeners() {
        // Checkbox for marking tasks complete/incomplete
        document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const target = event.target;
                const taskId = target.dataset.id;
                this.toggleTaskCompletion(taskId);
            });
        });
        // Delete button
        document.querySelectorAll('.todo-item button').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                const taskId = target.dataset.id;
                this.removeTask(taskId);
            });
        });
    }
}
// Main Functionality
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const addButton = document.querySelector('.todo-input button');
    const inputElement = document.getElementById('todo');
    const prioritySelect = document.getElementById('priority-select');
    // Add task event
    addButton.addEventListener('click', () => {
        const taskTitle = inputElement.value.trim();
        const taskPriority = parseInt(prioritySelect.value);
        if (taskTitle) {
            const newTask = new Task(taskTitle, taskPriority);
            taskManager.addTask(newTask);
            // Clear input field
            inputElement.value = '';
        }
        else {
            alert('Task title cannot be empty!');
        }
    });
});
