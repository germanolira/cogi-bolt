let timerId: number | null = null
let timeRemaining: number = 0

self.onmessage = (e: MessageEvent) => {
  const { type, duration } = e.data
  // console.log('👷 Worker received:', {
  //   type,
  //   duration,
  //   currentTimerId: timerId,
  // })

  switch (type) {
    case 'START':
      if (timerId !== null) {
        // console.log('⚠️ Clearing existing timer:', timerId)
        clearInterval(timerId)
        timerId = null
      }
      timeRemaining = duration
      startTimer()
      break
    case 'PAUSE':
      pauseTimer()
      break
    case 'RESET':
      resetTimer(duration)
      break
  }
}

function startTimer() {
  // console.log('⏰ Starting timer with:', {
  //   timeRemaining,
  //   currentTimerId: timerId,
  // })
  if (timerId === null) {
    timerId = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining -= 1
        // console.log('⏱️ Tick:', timeRemaining)
        self.postMessage({ type: 'TICK', timeRemaining })
      } else {
        // console.log('⏰ Timer complete!')
        self.postMessage({ type: 'COMPLETE' })
        pauseTimer()
      }
    }, 1000)
    // console.log('📌 New timer created:', timerId)
  }
}

function pauseTimer() {
  // console.log('⏸️ Pausing timer:', timerId)
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

function resetTimer(duration: number) {
  // console.log('🔄 Resetting timer to:', duration)
  pauseTimer()
  timeRemaining = duration
  self.postMessage({ type: 'TICK', timeRemaining })
}
