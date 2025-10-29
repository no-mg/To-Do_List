import { fetchTasks } from "./api.js";

const input = document.getElementById("input");
const buttonInput = document.getElementById("buttonInput");
const list = document.getElementById("list");
const search = document.getElementById("search");

const btnDark = document.querySelector(".button_dark");
const btnLight = document.querySelector(".button_light");

// Cообщение, если задач нет
const emptyMessage = document.createElement("p");
emptyMessage.textContent = "У вас пока что нет задач";
emptyMessage.id = "emptyMessage";
list.after(emptyMessage);

// Сообщение, если после применения фильтров ничего нет
const searchMessage = document.createElement("p");
searchMessage.textContent = "По запросу ничего не найдено";
searchMessage.id = "searchMessage";
searchMessage.style.display = "none";
list.after(searchMessage);

// Модальное окно
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const saveDesc = document.getElementById("save-desc");
const closeDesc = document.getElementById("close-desc");

let currentTask = null;

updateEmptyMessage();

// Функция для создания новой задачи
function createTaskItem(taskText, taskDesc = "") {
  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  listItem.appendChild(taskSpan);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "button-wrapper";

  // кнопка для дополнительный информации
  const descButton = document.createElement("button");
  descButton.className = "desc-btn";
  descButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="19" cy="12" r="2" fill="currentColor"/>
    </svg>`;
  buttonWrapper.appendChild(descButton);

  // кнопка для удаления
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.87426 7.61505C3.80724 6.74386 4.49607 6 5.36983 6H12.6302C13.504 6 14.1928 6.74385 14.1258 7.61505L13.6065 14.365C13.5464 15.1465 12.8948 15.75 12.1109 15.75H5.88907C5.10526 15.75 4.4536 15.1465 4.39348 14.365L3.87426 7.61505Z" stroke="#E50000"/>
      <path d="M14.625 3.75H3.375" stroke="#E50000" stroke-linecap="round"/>
      <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="#E50000"/>
      <path d="M10.5 9V12.75" stroke="#E50000" stroke-linecap="round"/>
      <path d="M7.5 9V12.75" stroke="#E50000" stroke-linecap="round"/>
    </svg>`;
  buttonWrapper.appendChild(deleteButton);

  listItem.appendChild(buttonWrapper);
  listItem.dataset.desc = taskDesc;

  // События
  descButton.addEventListener("click", (e) => {
    e.stopPropagation();
    currentTask = listItem;
    modalTitle.textContent = taskText;
    modalDesc.value = taskDesc || "";
    if (!modalDesc.value) modalDesc.placeholder = "Добавить описание...";
    modal.style.display = "flex";
  });

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    listItem.remove();
    updateEmptyMessage();
  });

  listItem.addEventListener("click", () => {
    listItem.classList.toggle("completed");
  });

  return listItem;
}

// Загружаем задачи из json

window.addEventListener("DOMContentLoaded", async () => {
  const tasks = await fetchTasks();
  tasks.forEach((task) => {
    const listItem = createTaskItem(task.title, task.desc);
    list.appendChild(listItem);
  });
  updateEmptyMessage();
});

// Добавление новой задачи не из json

function addTask() {
  const taskText = input.value.trim();
  if (taskText.length < 3) {
    alert("Заметка должна содержать минимум 3 символа");
    return;
  }
  const listItem = createTaskItem(taskText);
  list.appendChild(listItem);
  input.value = "";
  updateEmptyMessage();
}

// Модальное окно

saveDesc.addEventListener("click", () => {
  if (currentTask) {
    currentTask.dataset.desc = modalDesc.value;
  }
  modal.style.display = "none";
});

closeDesc.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Сообщение, если задач нет

function updateEmptyMessage() {
  const hasTasks = list.children.length > 0;
  emptyMessage.style.display = hasTasks ? "none" : "flex";
}

// Функция для поиска задач

function searchTasks() {
  const filter = search.value.toLowerCase();
  const tasks = document.querySelectorAll("#list li");
  let anyVisible = false;

  tasks.forEach((task) => {
    const text = task.querySelector("span").textContent.toLowerCase();
    if (text.includes(filter)) {
      task.style.display = "flex";
      anyVisible = true;
    } else {
      task.style.display = "none";
    }
  });
  searchMessage.style.display = anyVisible ? "none" : "block";
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
buttonInput.addEventListener("click", addTask);
search.addEventListener("input", searchTasks);

// Смена темы
btnDark.addEventListener("click", () => {
  document.documentElement.classList.add("theme-dark");
  localStorage.setItem("theme", "dark");
});

btnLight.addEventListener("click", () => {
  document.documentElement.classList.remove("theme-dark");
  localStorage.setItem("theme", "light");
});

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("theme-dark");
  }
});
