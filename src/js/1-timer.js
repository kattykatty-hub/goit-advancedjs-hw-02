import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Вибір елементів
const dateTimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('button[data-start]');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let interval = null;

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();
    if (selectedDate < Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'top-center'
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      userSelectedDate = selectedDate;
    }
  }
};

// Ініціалізація flatpickr
flatpickr(dateTimePicker, options);

// Функція для форматування чисел з ведучим нулем
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для перетворення мілісекунд в об'єкт часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення інтерфейсу таймера
function updateTimer() {
  const now = Date.now();
  const timeRemaining = userSelectedDate - now;

  if (timeRemaining <= 0) {
    clearInterval(interval);
    Object.values(timerFields).forEach(field => field.textContent = '00');
    startButton.disabled = false;
    dateTimePicker.disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeRemaining);

  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

// Обробник події натискання на кнопку Start
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;
  interval = setInterval(updateTimer, 1000);
});