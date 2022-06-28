import { gameLoop, pieces, setPieces } from './engine.js'
import { startBtn } from './utilities/elements.js'

function init() {
  window.requestAnimationFrame(gameLoop)
}

startBtn.addEventListener('click', () => {
  if (startBtn.innerText === 'Start Game') {
    pieces.length > 0 ? setPieces([]) : null
    startBtn.innerText = 'End Game'
    init()
  }
  else {
    location.reload()
  }

  (document.activeElement as HTMLElement).blur();
})