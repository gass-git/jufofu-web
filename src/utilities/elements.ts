// HTML elements ---------------------------------------------------
const canvas: any = document.getElementById("canvas") as HTMLDivElement
const ctx = canvas.getContext("2d") as HTMLElement
const scoreDiv = document.getElementById("score") as HTMLDivElement
const startBtn = document.getElementById("startBtn") as HTMLDivElement
const progressBar = document.getElementById("progress-bar") as HTMLDivElement
const bombsInventory = document.getElementById("bombs-inventory") as HTMLDivElement
//------------------------------------------------------------------

export {
  canvas,
  ctx,
  scoreDiv,
  startBtn,
  progressBar,
  bombsInventory
}