const input = document.getElementById("input");
const buttonInput = document.getElementById("buttonInput");
const list = document.getElementById("list");

function addTask() {
  const taskText = input.value;
  if (taskText === "") {
    alert("Необходимо заполнить поле ввода");
    return;
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'х';
  deleteButton.className = 'delete-btn';

  const listItem = document.createElement('li');
  listItem.textContent = taskText;
  listItem.appendChild(deleteButton);
  list.appendChild(listItem);
  input.value = '';

  listItem.addEventListener('click', function() {
        this.classList.toggle('completed');
    });

    deleteButton.addEventListener('click', function() {
    listItem.remove();
  });
}


buttonInput.addEventListener('click', addTask);