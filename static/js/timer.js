const durationMinutes = { focus: 25, shortBreak: 5, longBreak: 15 };
const modeLabels = { focus: "Focus", shortBreak: "Short break", longBreak: "Long break" };
const sessionsPerCycle = 4;

let currentMode = "focus";
let completedFocusSessions = 0;
let remainingMs = durationMinutes[currentMode] * 60 * 1000;
let endTimeMs = null;
let intervalId = null;

const timerDisplay = document.querySelector("#timer-display");
const startButton = document.querySelector("#start-timer");
const pauseButton = document.querySelector("#pause-timer");
const resetButton = document.querySelector("#reset-timer");
const modeButtons = document.querySelectorAll("[data-mode]");
const currentModeDisplay = document.querySelector("#current-mode");
const cycleProgress = document.querySelector("#cycle-progress");
const cycleIndicators = document.querySelectorAll(".cycle-indicators span");

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
    completeSession();
    return;
  }
  renderTimer();
}

function pauseTimer() {
  if (intervalId === null) {
    return;
  }

  // Capture time at the click, including any fraction of a second since the last update.
  remainingMs = Math.max(0, endTimeMs - Date.now());
  if (remainingMs === 0) {
    completeSession();
    return;
  }
  stopCountdown();
  renderTimer();
}

function resetTimer() {
  stopCountdown();
  remainingMs = durationMinutes[currentMode] * 60 * 1000;
  renderTimer();
}

function selectMode(mode) {
  currentMode = mode;
  resetTimer();
  currentModeDisplay.textContent = modeLabels[currentMode];
  modeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === currentMode));
  });
}

function completeSession() {
  let nextMode = "focus";
  if (currentMode === "focus") {
    // If the user skipped the full cycle's long break, count the next focus in a new cycle.
    completedFocusSessions = (completedFocusSessions % sessionsPerCycle) + 1;
    nextMode = completedFocusSessions === sessionsPerCycle ? "longBreak" : "shortBreak";
  } else if (currentMode === "longBreak" && completedFocusSessions === sessionsPerCycle) {
    completedFocusSessions = 0;
  }

  selectMode(nextMode);
  renderCycleProgress();
}

function renderCycleProgress() {
  const progress = `${completedFocusSessions} of ${sessionsPerCycle} focus sessions completed`;
  if (cycleProgress.textContent !== progress) {
    cycleProgress.textContent = progress;
  }
  cycleIndicators.forEach((indicator, index) => {
    indicator.classList.toggle("completed", index < completedFocusSessions);
  });
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
modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.mode !== currentMode) {
      selectMode(button.dataset.mode);
    }
  });
});
renderTimer();
