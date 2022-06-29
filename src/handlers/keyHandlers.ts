var right: boolean = false
var left: boolean = false
var down: boolean = false
var up: boolean = false
var spacebar: boolean = false

function handleKeyDown(e: { key: string, keyCode: number }) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    right = true
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    left = true
  }
  if (e.key === "Down" || e.key === "ArrowDown") {
    down = true
  }
  if (e.key === "Up" || e.key === "ArrowUp") {
    up = true
  }
  if (e.keyCode === 32) {
    spacebar = true
  }
}
function handleKeyUp(e: { key: string, keyCode: number }) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    right = false
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    left = false
  }
  if (e.key === "Down" || e.key === "ArrowDown") {
    down = false
  }
  if (e.key === "Up" || e.key === "ArrowUp") {
    up = false
  }
  if (e.keyCode === 32) {
    spacebar = false
  }
}

export { handleKeyDown, handleKeyUp, right, left, down, up, spacebar }