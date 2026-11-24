const defaultDurationMs = 25 * 60 * 1000;
let remainingMs = defaultDurationMs;
let endTimeMs = null;
let intervalId = null;

const timerDisplay = document.querySelector("#timer-display");
const startButton = document.querySelector("#start-timer");
const pauseButton = document.querySelector("#pause-timer");
const resetButton = document.querySelector("#reset-timer");

function startTimer() {
  if (intervalId !== null || remainingMs === 0) {
    return;
  }

  endTimeMs = Date.now() + remainingMs;
  intervalId = setInterval(updateCountdown, 250);
  renderTimer();
}

function stopCountdown() {
  clearInterval(intervalId);
  intervalId = null;
  endTimeMs = null;
}

function updateCountdown() {
  // Derive time from the deadline so delayed callbacks do not slow the countdown.
  remainingMs = Math.max(0, endTimeMs - Date.now());
  if (remainingMs === 0) {
    stopCountdown();
  }
  renderTimer();
}

function pauseTimer() {
  if (intervalId === null) {
    return;
  }

  // Capture time at the click, including any fraction of a second since the last update.
  remainingMs = Math.max(0, endTimeMs - Date.now());
  stopCountdown();
  renderTimer();
}

function resetTimer() {
  stopCountdown();
  remainingMs = defaultDurationMs;
  renderTimer();
}

function renderTimer() {
  // Keep a partial second visible until it has fully elapsed.
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;

  const isRunning = intervalId !== null;
  startButton.disabled = isRunning || remainingMs === 0;
  pauseButton.disabled = !isRunning;
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
renderTimer();
