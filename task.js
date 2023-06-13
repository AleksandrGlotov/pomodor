const btnAddTask = document.querySelector(".add-task");
const inputTask = document.querySelector(".input-task");
const taskList = document.querySelector(".task-items")
const clearTaskButton = document.querySelector(".task-clear")

//список задач
let tasks = []

btnAddTask.onclick = () => {
  addTask(inputTask.value)
}

const addTask = (item) => {
  //если инпут не пустой, то создает объект задачи с уникалным id, текстом и флагом выполения
  if (item !== "") {

    const task = {
      id: Date.now(),
      text: item,
      isCompleted: false
    }
    //добавляем задачу в массив задач
    tasks.push(task)
    //добавляем массив задач в localstorage(чтобы после обновления страницы оставались задачи)
    addToLocaleStorage(tasks)
    //очищаем инпут
    inputTask.value = ""
  }
}

const renderTaskList = (tasks) => {
  //очищаем список отрендериных задач
  taskList.innerHTML = ""
  //заново рендерим список задач
  tasks.forEach((item, index) => {
    const checked = item.isCompleted ? 'checked' : null

    const div = document.createElement("div")
    div.setAttribute("class","task-item")
    div.setAttribute("data-key", item.id)
    if (item.isCompleted == true) {
      div.classList.add("checked")
    }

    div.innerHTML = `
      <input id=${item.id} type="checkbox" class="checkbox" ${checked}>
      <label for=${item.id} class="task-text">
        ${index + 1} ${item.text}
      </label>
      <button class="task-delete">
      </button>
    `;
    
    taskList.append(div)
  });

}
//функция добавления массива задач в localstorage
const addToLocaleStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
  renderTaskList(tasks)
}

//функция, которая берет массив задач из localstorage
const getLocalStorage = () => {
  const reference = localStorage.getItem("tasks")

  if (reference) {
    tasks = JSON.parse(reference)
    renderTaskList(tasks)
  }
}

//смена значения чекбокса на противопожное 
const toggle = (id) => {
  tasks.forEach( item => {
    if (item.id == id) {
      item.isCompleted = !item.isCompleted
    }
  })
  addToLocaleStorage(tasks)
}

//функция удаления задачи
const deleteTask = (id) => {
  tasks = tasks.filter( i => i.id != id)
  addToLocaleStorage(tasks)
}

clearTaskButton.onclick = () => {
  localStorage.removeItem("tasks");
  tasks = []
  addToLocaleStorage(tasks)
}

getLocalStorage()

//берем значение атрибута data-key у родительского элемента чекбокса и кнопки удаления
taskList.addEventListener("click", function(event) {
  if (event.target.type === "checkbox") {
    toggle(event.target.parentElement.getAttribute("data-key"))
  }
  if (event.target.classList.contains("task-delete")) {
    deleteTask(event.target.parentElement.getAttribute("data-key"))
  }
})


