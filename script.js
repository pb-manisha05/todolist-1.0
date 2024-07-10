document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date');
    const todoList = document.getElementById('todo-list');
    const completedTasks = document.getElementById('completed-tasks');

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        if (todoText === '' || dueDate === '') return;

        const addedDate = new Date().toLocaleDateString();

        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = todoText;
        span.addEventListener('click', () => toggleComplete(li));

        const dateSpan = document.createElement('span');
        dateSpan.textContent = `Added: ${addedDate}`;
        dateSpan.classList.add('date');

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = `Due: ${dueDate}`;
        dueDateSpan.classList.add('due-date');

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTodo(li, span));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(li));

        li.appendChild(span);
        li.appendChild(dateSpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
        todoInput.value = '';
        dueDateInput.value = '';
        saveTodos();
        updateCompletedTasks();
    }

    function toggleComplete(li) {
        li.classList.toggle('completed');
        const completionDate = new Date().toLocaleDateString();
        if (li.classList.contains('completed')) {
            const completionSpan = document.createElement('span');
            completionSpan.textContent = `Completed: ${completionDate}`;
            completionSpan.classList.add('date');
            li.appendChild(completionSpan);
        } else {
            const completionSpan = li.querySelector('.date:last-of-type');
            if (completionSpan) li.removeChild(completionSpan);
        }
        saveTodos();
        updateCompletedTasks();
    }

    function editTodo(li, span) {
        const currentText = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.classList.add('edit-input');

        const saveButton = document.createElement('button');
        saveButton.classList.add('save');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => saveEdit(li, input, span));

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => cancelEdit(li, span, input, saveButton, cancelButton));

        li.replaceChild(input, span);
        li.replaceChild(saveButton, li.querySelector('.edit'));
        li.replaceChild(cancelButton, li.querySelector('.delete'));
    }

    function saveEdit(li, input, span) {
        const newText = input.value.trim();
        if (newText === '') return;

        span.textContent = newText;
        li.replaceChild(span, input);
        li.replaceChild(createEditButton(li, span), li.querySelector('.save'));
        li.replaceChild(createDeleteButton(li), li.querySelector('.cancel'));
        saveTodos();
    }

    function cancelEdit(li, span, input, saveButton, cancelButton) {
        li.replaceChild(span, input);
        li.replaceChild(createEditButton(li, span), saveButton);
        li.replaceChild(createDeleteButton(li), cancelButton);
    }

    function createEditButton(li, span) {
        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTodo(li, span));
        return editButton;
    }

    function createDeleteButton(li) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(li));
        return deleteButton;
    }

    function deleteTodo(li) {
        todoList.removeChild(li);
        saveTodos();
        updateCompletedTasks();
    }

    function saveTodos() {
        const todos = [];
        todoList.querySelectorAll('li').forEach((li) => {
            const text = li.querySelector('span').textContent;
            const addedDate = li.querySelector('.date').textContent.replace('Added: ', '');
            const dueDate = li.querySelector('.due-date').textContent.replace('Due: ', '');
            const completed = li.classList.contains('completed');
            const completionDate = completed ? li.querySelector('.date:last-of-type').textContent.replace('Completed: ', '') : null;
            todos.push({ text, addedDate, dueDate, completed, completionDate });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(({ text, addedDate, dueDate, completed, completionDate }) => {
            const li = document.createElement('li');
            if (completed) li.classList.add('completed');

            const span = document.createElement('span');
            span.textContent = text;
            span.addEventListener('click', () => toggleComplete(li));

            const dateSpan = document.createElement('span');
            dateSpan.textContent = `Added: ${addedDate}`;
            dateSpan.classList.add('date');

            const dueDateSpan = document.createElement('span');
            dueDateSpan.textContent = `Due: ${dueDate}`;
            dueDateSpan.classList.add('due-date');

            const editButton = createEditButton(li, span);
            const deleteButton = createDeleteButton(li);

            li.appendChild(span);
            li.appendChild(dateSpan);
            li.appendChild(dueDateSpan);
            li.appendChild(editButton);
            li.appendChild(deleteButton);

            if (completed && completionDate) {
                const completionSpan = document.createElement('span');
                completionSpan.textContent = `Completed: ${completionDate}`;
                completionSpan.classList.add('date');
                li.appendChild(completionSpan);
            }

            todoList.appendChild(li);
        });
        updateCompletedTasks();
    }

    function updateCompletedTasks() {
        const completedCount = todoList.querySelectorAll('li.completed').length;
        completedTasks.textContent = `Completed Tasks: ${completedCount}`;
    }

    loadTodos();
});
