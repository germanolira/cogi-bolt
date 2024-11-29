let timerId: number | null = null;
let timeRemaining: number = 0;

self.onmessage = (e: MessageEvent) => {
  const { type, duration } = e.data;
  
  switch (type) {
    case 'START':
      timeRemaining = duration;
      startTimer();
      break;
    case 'PAUSE':
      pauseTimer();
      break;
    case 'RESET':
      resetTimer(duration);
      break;
  }
};

function startTimer() {
  if (timerId === null) {
    timerId = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining -= 1;
        self.postMessage({ type: 'TICK', timeRemaining });
      } else {
        self.postMessage({ type: 'COMPLETE' });
        pauseTimer();
      }
    }, 1000);
  }
}

function pauseTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetTimer(duration: number) {
  pauseTimer();
  timeRemaining = duration;
  self.postMessage({ type: 'TICK', timeRemaining });
}