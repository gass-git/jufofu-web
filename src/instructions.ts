import { startBtn } from "./utilities/elements.js"

const instructionsBtn = document.getElementById('instructionsBtn') as HTMLElement
const instructions = document.getElementById('instructions') as HTMLElement
const tooltip = document.getElementById('tooltip') as HTMLElement

instructionsBtn.addEventListener('click', () => {

  // Show instructions only if the game has not started
  if (startBtn.innerText === 'Start Game') {
    if (instructions.style.display === 'block') {
      instructions.style.display = 'none'
      instructionsBtn.innerText = 'How to Play?'
    }
    else {
      instructions.style.display = 'block'
      instructionsBtn.innerText = 'Hide Instructions'
    }
  }
  else if (tooltip.style.display === "none") {
    tooltip.style.display = "block"
    setTimeout(() => {
      tooltip.style.display = "none"
    }, 5000)
  }
  // @ts-ignore: Unreachable code error
  document.activeElement.blur()

})


// If the user clicks on start game and the instructions are displayed, hide them.
startBtn.addEventListener('click', () => {
  if (instructions.style.display === 'block') {
    instructions.style.display = 'none'
    instructionsBtn.innerText = 'How to Play?'
  }
})