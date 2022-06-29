import { gameLoop } from './engine.js'
import { handleKeyDown, handleKeyUp } from './handlers/keyHandlers.js'
import { startBtn } from './utilities/elements.js'
import handleStartBtn from './handlers/handleStartBtn.js'

export function init() {
  window.requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", handleKeyDown, false)
document.addEventListener("keyup", handleKeyUp, false)
startBtn.addEventListener("click", handleStartBtn, false)

