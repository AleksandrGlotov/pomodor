let timer;
let workDuration = 1; //кол-во минут помодоро
let shortBreakDuration = 5; //начальное кол-во минут короткого перерыва
let longBreakDuration = 15; //начальное кол-во минут длинного перерыва
let seconds = 3; //кол-во секунд

let workMinutes = workDuration - 1;
let breakCount = 1; //счетчик перерывов
let pomodoroCount = 1; //счетчик помодоро
let shortBreakCount = 0; //счетчик коротких перерывов
let pomodoroPieces = 5; //начальное кол-во помодоро

const $title = document.querySelector(".title");
const $minutes = document.querySelector(".timer__minutes");
const $seconds = document.querySelector(".timer__seconds");
const $pomodoro = document.querySelector(".pomodoro");
const $shortBreak = document.querySelector(".short-break");
const $longBreak = document.querySelector(".long-break");

const btnStart = document.getElementById("start");
const btnPause = document.getElementById("pause");
const btnReset = document.getElementById("reset");

const pomodoroDecrement = document.getElementById("pomodoro-dec");
const pomodoroIncrement = document.getElementById("pomodoro-inc");
const btnShortBreakDecrement = document.getElementById("short-break-dec");
const btnShortBreakIncrement = document.getElementById("short-break-inc");
const btnLongBreakDecrement = document.getElementById("long-break-dec");
const btnLongBreakIncrement = document.getElementById("long-break-inc");
const btnLock = document.querySelectorAll(".btn_count, #start")

const btnAddTask = document.querySelector(".add-task");
const inputTask = document.querySelector(".input-task");
const taskList = document.querySelector(".task-items")

const RemainingTime = () => {
  console.log($title.textContent, breakCount, pomodoroPieces);
  seconds = seconds - 1;
  if (seconds === 0) {
    // при достижении секунд 0 уменьшаем минуты на 1
    workMinutes = workMinutes - 1;
    // при достижении таймера 0 увеличваем счетчик перерывов и делаем проверку
    // нечетные это помодоро, кратные 2,4,6 - короткие перерывы, кратные 9 - длинные
    if (workMinutes === -1) {
      breakCount++;
      if (breakCount % 8 === 0) {
        workMinutes = longBreakDuration - 1;
        $title.textContent = `Long break #${pomodoroCount - shortBreakCount}`;
      } else if (breakCount % 2 === 0) {
        workMinutes =  shortBreakDuration - 1;
        shortBreakCount++;
        $title.textContent = `Short break #${shortBreakCount}`;
      } else {
        workMinutes = workDuration - 1;
        pomodoroCount++;
        pomodoroPieces--;
        if (pomodoroPieces !== 0) {
          $title.textContent = `Pomodoro #${pomodoroCount}`;
        } else {
          $title.textContent = `The end`;
          clearInterval(timer);
        }
      }
    }
    (pomodoroPieces !== 0) ? seconds = 3 : seconds = 0
  }
  $minutes.textContent =
    workMinutes < 10 ? "0" + workMinutes : seconds == 60 ? workMinutes + 1 : workMinutes;
  $seconds.textContent = 
  seconds < 10 ? "0" + seconds : seconds == 60 ? "00" : seconds;
};


//запустить таймер и заблокировать кнопку Start
btnStart.onclick = () => {
  timer = setInterval(RemainingTime, 1000);
  for ( btn of btnLock) {
    btn.disabled = true
  }
};

//остнановить таймер и разблокировать кнопку Start
btnPause.onclick = () => {
  clearInterval(timer);
  btnStart.disabled = false;
};

//перезагрузить страницу и сбросить все настройки к изначальным
btnReset.onclick = () => {
  window.location.reload();
};

//уменьшение и увеличение соответсвующих счетчиков
pomodoroDecrement.onclick = () => {
  pomodoroPieces > 1 ? pomodoroPieces-- : null;
  $pomodoro.textContent = pomodoroPieces;
};
pomodoroIncrement.onclick = () => {
  pomodoroPieces < 16 ? pomodoroPieces++ : null;
  $pomodoro.textContent = pomodoroPieces;
};
btnShortBreakDecrement.onclick = () => {
  shortBreakDuration > 1 ? shortBreakDuration-- : null;
  $shortBreak.textContent = shortBreakDuration;
};
btnShortBreakIncrement.onclick = () => {
  shortBreakDuration < 10 ? shortBreakDuration++ : null;
  $shortBreak.textContent = shortBreakDuration;
};
btnLongBreakDecrement.onclick = () => {
  longBreakDuration > 10 ? longBreakDuration-- : null;
  $longBreak.textContent = longBreakDuration;
};
btnLongBreakIncrement.onclick = () => {
  longBreakDuration < 30 ? longBreakDuration++ : null;
  $longBreak.textContent = longBreakDuration;
};

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
      <input type="checkbox" class="checkbox" ${checked}>
        <span class="task-text">
          ${index + 1} ${item.text}
        </span>
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


