/**
 * Todo List Application
 * Features: Add, edit, delete tasks, filter, search, local storage persistence
 */

class TodoApp {
    constructor() {
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.contextMenu = document.getElementById('contextMenu');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.clearAllBtn = document.getElementById('clearAll');

        // Stats elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.progressFillEl = document.getElementById('progressFill');
        this.allCountEl = document.getElementById('allCount');
        this.activeCountEl = document.getElementById('activeCount');
        this.completedCountEl = document.getElementById('completedCount');

        // State
        this.todos = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.editingId = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the app
     */
    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.closest('.filter-btn').dataset.filter;
                this.updateFilterButtons();
                this.render();
            });
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });

        // Clear buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());

        // Context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.todo-item')) {
                e.preventDefault();
                this.showContextMenu(e, e.target.closest('.todo-item'));
            }
        });

        // Close context menu on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.contextMenu.classList.remove('active');
            }
        });

        // Context menu actions
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const todoId = this.contextMenu.dataset.todoId;
                this.handleContextMenuAction(action, todoId);
                this.contextMenu.classList.remove('active');
            });
        });
    }

    /**
     * Add a new todo
     */
    addTodo() {
        const text = this.todoInput.value.trim();

        if (!text) {
            this.showNotification('Please enter a task!', 'warning');
            return;
        }

        if (text.length > 500) {
            this.showNotification('Task is too long (max 500 characters)', 'warning');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
        this.showNotification('Task added!', 'success');
    }

    /**
     * Toggle todo completion status
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.render();
        }
    }

    /**
     * Delete a todo
     */
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
            this.showNotification('Task deleted!', 'success');
        }
    }

    /**
     * Edit a todo
     */
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const newText = prompt('Edit task:', todo.text);
            if (newText !== null && newText.trim()) {
                todo.text = newText.trim();
                todo.updatedAt = new Date().toISOString();
                this.saveTodos();
                this.render();
                this.showNotification('Task updated!', 'success');
            }
        }
    }

    /**
     * Duplicate a todo
     */
    duplicateTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const newTodo = {
                id: Date.now(),
                text: `${todo.text} (copy)`,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.todos.unshift(newTodo);
            this.saveTodos();
            this.render();
            this.showNotification('Task duplicated!', 'success');
        }
    }

    /**
     * Handle context menu actions
     */
    handleContextMenuAction(action, todoId) {
        switch (action) {
            case 'edit':
                this.editTodo(parseInt(todoId));
                break;
            case 'delete':
                this.deleteTodo(parseInt(todoId));
                break;
            case 'duplicate':
                this.duplicateTodo(parseInt(todoId));
                break;
        }
    }

    /**
     * Show context menu
     */
    showContextMenu(e, todoItem) {
        const todoId = todoItem.dataset.id;
        this.contextMenu.dataset.todoId = todoId;
        this.contextMenu.style.top = e.clientY + 'px';
        this.contextMenu.style.left = e.clientX + 'px';
        this.contextMenu.classList.add('active');
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!', 'warning');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
            this.showNotification('Completed tasks cleared!', 'success');
        }
    }

    /**
     * Clear all todos
     */
    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('No tasks to clear!', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            this.todos = [];
            this.saveTodos();
            this.render();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    /**
     * Get filtered todos
     */
    getFilteredTodos() {
        let filtered = this.todos;

        // Apply filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // Apply search
        if (this.searchTerm) {
            filtered = filtered.filter(t =>
                t.text.toLowerCase().includes(this.searchTerm)
            );
        }

        return filtered;
    }

    /**
     * Update filter button states
     */
    updateFilterButtons() {
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    /**
     * Render the todo list
     */
    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.emptyState.classList.add('active');
        } else {
            this.emptyState.classList.remove('active');
            filteredTodos.forEach(todo => {
                this.todoList.appendChild(this.createTodoElement(todo));
            });
        }

        this.updateStats();
    }

    /**
     * Create todo element
     */
    createTodoElement(todo) {
        const li = document.createElement('div');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        textSpan.title = todo.text;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'todo-meta';
        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        timeSpan.textContent = this.formatDate(todo.createdAt);
        metaDiv.appendChild(timeSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'todo-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit (or right-click)';
        editBtn.addEventListener('click', () => this.editTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-btn danger';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(metaDiv);
        li.appendChild(actionsDiv);

        return li;
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;
        const progress = total === 0 ? 0 : (completed / total) * 100;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.progressFillEl.style.width = progress + '%';

        this.allCountEl.textContent = total;
        this.activeCountEl.textContent = active;
        this.completedCountEl.textContent = completed;
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today ' + date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Simple console notification (can be replaced with toast library)
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    /**
     * Save todos to local storage
     */
    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('Local storage quota exceeded');
            } else {
                console.error('Error saving todos:', e);
            }
        }
    }

    /**
     * Load todos from local storage
     */
    loadTodos() {
        try {
            const stored = localStorage.getItem('todos');
            this.todos = stored ? JSON.parse(stored) : [];
            
            // Validate todo structure
            this.todos = this.todos.filter(todo =>
                todo && typeof todo === 'object' && todo.id && typeof todo.text === 'string'
            );
        } catch (e) {
            console.error('Error loading todos:', e);
            this.todos = [];
        }
    }

    /**
     * Export todos as JSON
     */
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import todos from JSON
     */
    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.todos = imported;
                    this.saveTodos();
                    this.render();
                    this.showNotification('Todos imported successfully!', 'success');
                }
            } catch (err) {
                this.showNotification('Invalid import file', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
