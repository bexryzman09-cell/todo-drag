
const form = document.querySelector('.form');
const input = document.querySelector('.todo');
const columns = document.querySelectorAll('.columns');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Сохранение задач
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Показ задач
function showTasks() {
    columns.forEach(column => {
        column.innerHTML = '';
    });

    tasks.forEach(task => {
        const column = document.querySelector(
            '[data-count="' + task.status + '"]'
        );

        if (!column) return;

        // Карточка задачи
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.id = task.id;

        // Текст задачи
        const text = document.createElement('span');
        text.className = 'card-text';
        text.textContent = task.text;

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.type = 'button';

        // Удаление задачи
        deleteBtn.addEventListener('click', function () {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            showTasks();
        });

        card.append(text, deleteBtn);

        // Перетаскивание
        card.addEventListener('dragstart', function () {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('dragging');
        });

        column.append(card);
    });

    countTasks();
}

// Добавление задачи
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = input.value.trim();

    if (text === '') return;

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        status: 'todo'
    });

    input.value = '';

    saveTasks();
    showTasks();
});

// Перетаскивание между колонками
columns.forEach(column => {
    column.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    column.addEventListener('drop', function (e) {
        e.preventDefault();

        const card = document.querySelector('.dragging');

        if (!card) return;

        const task = tasks.find(
            item => String(item.id) === card.dataset.id
        );

        if (!task) return;

        task.status = column.dataset.count;

        saveTasks();
        showTasks();
    });
});


// Запуск
showTasks();
