// Данные
let tasks = [];
let habits = [
    { name: '🔥 Ранний подъём', streak: 12 },
    { name: '🎯 Спорт', streak: 8 }
];

// Загрузка данных из localStorage
function loadTasks() {
    const saved = localStorage.getItem('progress-tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        // Тестовые задачи
        tasks = [
            { id: 1, text: 'Позвонить клиенту', completed: false },
            { id: 2, text: 'Зарядка', completed: true },
            { id: 3, text: 'Купить ткань', completed: false },
            { id: 4, text: 'Снять видео', completed: false },
            { id: 5, text: 'Ответить в боте', completed: false }
        ];
    }
    renderTasks();
}

// Сохранение в localStorage
function saveTasks() {
    localStorage.setItem('progress-tasks', JSON.stringify(tasks));
}

// Отображение даты
function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('ru-RU', options);
}

// Отображение задач
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;

    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const allTasks = [...incompleteTasks, ...completedTasks];

    tasksList.innerHTML = allTasks.map(task => `
        <div class="task-item" data-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="delete-task" onclick="deleteTask(${task.id})">🗑️</div>
        </div>
    `).join('');

    updateProgress();
    updateAnalytics();
}

// Переключение задачи
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Удаление задачи
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Добавление новой задачи
function addNewTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        closeModal();
        input.value = '';
    }
}

// Обновление прогресса
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('todayPercent').textContent = percent + '%';
    document.getElementById('todayProgress').style.width = percent + '%';
}

// Обновление аналитики
function updateAnalytics() {
    // Задачи за месяц (тест)
    const monthlyTasks = tasks.length * 3;
    document.getElementById('monthlyTasks').textContent = monthlyTasks;

    // Лучший день
    document.getElementById('bestDay').textContent = Math.max(...tasks.map(t => t.completed ? 1 : 0), 0);

    // Серия (тест)
    const streak = tasks.some(t => !t.completed) ? 3 : 5;
    document.getElementById('streak').textContent = streak;
}

// Управление модальным окном
function openModal() {
    document.getElementById('taskModal').classList.add('active');
    document.getElementById('taskInput').focus();
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateDate();

    // Кнопка добавления
    document.getElementById('addTaskBtn').addEventListener('click', openModal);

    // Закрытие модалки по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Закрытие по клику вне модалки
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('taskModal')) closeModal();
    });
});
