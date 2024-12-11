import {TaskPriority} from './models/TaskPriority.js'
import {Task} from './models/TaskClass.js'

// Task Manager Class
class TaskManager {
    private tasks: Task[] = [];
    private storageKey:string ='tasks';

    constructor(){
        this.loadFromStorage()
    }
    addTask(task: Task): void {
        this.tasks.push(task);
        this.saveToStorage()
        this.renderTasks();
    }

    removeTask(taskId: string): void {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToStorage()
        this.renderTasks();
    }

    toggleTaskCompletion(taskId: string): void {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.isCompleted = !task.isCompleted;
            this.saveToStorage()
            this.renderTasks();
        }
    }

    private saveToStorage():void{
        localStorage.setItem(this.storageKey,JSON.stringify(this.tasks))
    }

    private loadFromStorage():void{
        const data = localStorage.getItem(this.storageKey);
        if(data){
            this.tasks = JSON.parse(data).map((task:any)=>{
                return new Task(task.title, task.priority);
            })
            this.renderTasks();
        }
    }
    renderTasks(): void {
        const taskList = document.querySelector('.todo-list') as HTMLUListElement;
        
        taskList.innerHTML = ''; // Clear existing tasks

        this.tasks.forEach(task => {
            // Create task element
            const taskItem = document.createElement('li');
            console.log('taskItem>>',taskItem);
            
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

    private addEventListeners(): void {
        // Checkbox for marking tasks complete/incomplete
        document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                const taskId = target.dataset.id!;
                
                this.toggleTaskCompletion(taskId);
            });
        });

        // Delete button
        document.querySelectorAll('.todo-item button').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLButtonElement;
                
                const taskId = target.dataset.id!;
                

                this.removeTask(taskId);
            });
        });
    }
}

// Main Functionality
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();

    const addButton = document.querySelector('.todo-input button') as HTMLButtonElement;
    const inputElement = document.getElementById('todo') as HTMLInputElement;
    const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;

    // Add task event
    addButton.addEventListener('click', () => {
        const taskTitle = inputElement.value.trim();
        const taskPriority = parseInt(prioritySelect.value) as TaskPriority;

        if (taskTitle) {
            const newTask = new Task(taskTitle, taskPriority);
            taskManager.addTask(newTask);

            // Clear input field
            inputElement.value = '';
        } else {
            alert('Task title cannot be empty!');
        }
    });
});

