import Bomb from './classes/pieces/bomb.js'
import Long from './classes/pieces/long.js'
import drawPiece from './functions/drawPiece.js'
import getLowestAvailableRow from './functions/getLowestAvailableRow.js'
import handleDifficulty from './handlers/handleDifficulty.js'
import { right, left, down, up, spacebar } from './handlers/keyHandlers.js'
import { canvas, ctx, scoreDiv, progressBar, bombsInventory } from './utilities/elements.js'
import { greenBlock, blueBlock, pinkBlock, crystalBlock, yellowBlock, redBlock, whiteBlock, orangeBlock, particle } from './utilities/sprites.js'
import createPiece from './functions/createPiece.js'
import { BlockImage, Position } from './typeInterfaces.js'
import resetMatrix from './functions/resetMatrix.js'
import handleRotation from './handlers/handleRotation.js'

// matrix[rowIndex][columnIndex]
export var matrix: object[][] = [
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}]
]

export var blockImages: BlockImage = {
  green: greenBlock,
  blue: blueBlock,
  crystal: crystalBlock,
  pink: pinkBlock,
  yellow: yellowBlock,
  red: redBlock,
  white: whiteBlock,
  orange: orangeBlock
}

export var maxRow_index = matrix.length - 1
export var maxColumn_index = matrix[0].length - 1
export var speed: number = 40                       // rate of frames at which the piece falls
export var boost: number = 5                        // the smaller the number, the faster the piece will fall
export var score: number = 0
export var scoreMultiplier: number = 1
export var totalFrameCount: number = 0
export var frameCount: number = 0
export var isGameOver: boolean = false
export var timeOut: boolean = false
export var longInPlay: boolean = false
export var fill: number = 0                         // variable for progress bar functionality
export var bombsAvailable: number = 0
export var throwBomb: boolean = false
export var pieces: any = []
export var colorsInPlay: string[] = ["yellow", "blue", "crystal"]
export var savedPositions: Position[] = []          // coordinates of blocks removed

// setters
export const setPieces = (newArr: any) => (pieces = newArr)
export const setColorsInPlay = (newArr: any) => (colorsInPlay = newArr)
export const setSpeed = (newSpeed: number) => (speed = newSpeed)
export const setScoreMultiplier = (newMultiplier: number) => (scoreMultiplier = newMultiplier)
export const setThrowBomb = (boo: boolean) => (throwBomb = boo)
export const setBombsAvailable = (n: number) => (bombsAvailable = n)
export const setLongInPlay = (boo: boolean) => (longInPlay = boo)
export const setMatrix = (arr: object[][]) => (matrix = arr)
export const updateTimeOut = (boo: boolean) => (timeOut = boo)

export function gameLoop() {
  handleDifficulty()

  // Clean the canvas and count the frames
  // @ts-ignore: Unreachable code error
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  totalFrameCount++
  frameCount++

  // Update score
  scoreDiv.innerText = score.toString()

  // Create the first piece
  if (pieces.length === 0) setPieces([...pieces, createPiece()])

  var AP: any; // Active piece

  // Draw all the pieces and initialize the active piece
  pieces.forEach((p: any) => {
    drawPiece(p.image, p.x, p.y, ctx, canvas)
    p.isActive ? AP = p : null
  })

  /**
   * Throw bomb on next turn ?
   */
  if (spacebar && !throwBomb && bombsAvailable > 0) {
    throwBomb = true
    bombsInventory.removeChild(bombsInventory.childNodes[bombsAvailable - 1])
  }

  /**
   * Rotation
   */
  if (up && AP.type === "long" && !timeOut) {
    handleRotation(AP)
  }

  /** 
   * VERTICAL MOVEMENT
   */
  let n: number;

  // Show available bombs 
  var node = document.createElement("span")
  var imageElement = document.createElement("img")
  imageElement.src = "inGame_images/blackCircle.png"
  node.appendChild(imageElement)

  if (down) {
    n = boost

    // Bombs inventory
    if (fill < 100) {
      fill += 0.2
    }
    else {
      fill = 0

      // Maximum capacity of bombs in inventory
      bombsAvailable < 6 ? bombsAvailable++ : null

      // Append new bomb to inventory DIV
      bombsInventory.appendChild(node)
    }
  }
  else {
    n = speed
  }

  // Update progress bar
  progressBar.style.width = fill + '%'

  if (frameCount > n) {

    let lowestAvailableRow = getLowestAvailableRow(AP, matrix, maxRow_index)

    // Can the active piece move to the next row?    
    if (AP.type === "block" || AP.type === "bomb") {

      if (AP.usingRows[0] < lowestAvailableRow) {

        if (AP.type !== "bomb" && AP.usingRows[0] + 1 < lowestAvailableRow) {
          // Update row of piece
          AP.usingRows[0] += 1

          // Update coordinate y
          AP.y += 40
        }
        else {
          // Update row of bomb
          AP.usingRows[0] += 1

          // Update coordinate y
          AP.y += 40
        }
      }
      else {

        if (AP.type === "bomb") {

          // Destroy sorrounding color pieces
          Bomb.explode(AP, savedPositions, pieces)

          // Destroy bomb
          pieces = pieces.filter((p: any) => p.type !== "bomb")
        }
        else {
          // Deactivate piece
          AP.isActive = false
        }

        // Create a new piece
        setPieces([...pieces, createPiece()])
      }
    }

    if (AP.type === "long") {

      if (AP.isVertical) {

        if (AP['usingRows'][2] + 1 < lowestAvailableRow) {

          // Update rows of piece
          AP['usingRows'][0] += 1
          AP['usingRows'][1] += 1
          AP['usingRows'][2] += 1

          // Update coordinate y
          AP.y += 40
        }
        else {
          // Deactivate piece and create a new one
          AP.isActive = false
          setPieces([...pieces, createPiece()])
        }

      }
      else {

        if (AP['usingRows'][0] + 1 < lowestAvailableRow) {

          // Update rows of piece
          AP['usingRows'][0] += 1

          // Update coordinate y
          AP.y += 40
        }
        else {
          // Deactivate piece and create a new one
          AP.isActive = false
          setPieces([...pieces, createPiece()])
        }
      }
    }

    // Reset frame count
    frameCount = 0
  }

  /**
   * HORIZONTAL MOVEMENT
   */
  if (left && !timeOut) {

    let left_fragment: any;

    if (AP.type === "long") {

      if (AP.isVertical) {
        left_fragment = matrix[AP.usingRows[2]][AP.usingColumns[0] - 1]

        // Can it move to the left?
        if (AP.usingColumns[0] > 0 && !left_fragment.isOccupied) {

          AP.usingColumns[0] -= 1
          AP.x -= 40;
        }
      }
      else {
        left_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] - 1]

        // Can it move to the left?
        if (AP['usingColumns'][0] > 0 && !left_fragment.isOccupied) {

          AP.usingColumns[0] -= 1
          AP.usingColumns[1] -= 1
          AP.usingColumns[2] -= 1
          AP.x -= 40;
        }
      }
    }

    if (AP.type !== "long") {

      left_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] - 1]

      if (AP.usingColumns[0] > 0 && !left_fragment.isOccupied) {

        switch (AP.type) {

          case "block":
            AP.usingColumns[0] -= 1
            AP.x -= 40;
            break

          case "bomb":
            AP.usingColumns[0] -= 1
            AP.x -= 40;
            break
        }
      }
    }

    timeOut = true
    setTimeout(() => { timeOut = false }, 120)
  }

  if (right && !timeOut) {

    let right_fragment: any;

    if (AP.type === "long") {

      if (AP.isVertical) {
        right_fragment = matrix[AP.usingRows[2]][AP.usingColumns[0] + 1]

        // Can it move to the right?
        if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {

          AP.usingColumns[0] += 1
          AP.x += 40;
        }
      }
      else {
        right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[2] + 1]

        // Can it move to the right?
        if (AP.usingColumns[2] < maxColumn_index && !right_fragment.isOccupied) {

          AP.usingColumns[0] += 1
          AP.usingColumns[1] += 1
          AP.usingColumns[2] += 1
          AP.x += 40;
        }
      }
    }

    if (AP.type !== "long") {

      switch (AP.type) {

        case "block":

          right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] + 1]

          if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {

            AP.usingColumns[0] += 1
            AP.x += 40
          }
          break

        case "bomb":

          right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] + 1]

          if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {

            AP.usingColumns[0] += 1
            AP.x += 40
          }
          break

      }
    }

    timeOut = true
    setTimeout(() => { timeOut = false }, 120)
  }


  /**
   * Matching rows
   */
  let savedRows: number[] = []

  matrix.forEach((rowFragments, rowIndex) => {

    let vertical_long_inRow = false;

    let count = {
      blue: 0,
      orange: 0,
      yellow: 0,
      pink: 0,
      crystal: 0,
      white: 0
    }

    rowFragments.forEach((fragment: any) => { // Loop through row columns

      if (fragment.isOccupied && fragment.pieceIsParked) {

        fragment.piecePosition === "vertical" ? vertical_long_inRow = true : null

        fragment.color === "crystal" && fragment.piecePosition !== "vertical" ? count.crystal++ : null

        fragment.color === "yellow" && fragment.piecePosition !== "vertical" ? count.yellow++ : null

        fragment.color === "blue" && fragment.piecePosition !== "vertical" ? count.blue++ : null

        fragment.color === "orange" && fragment.piecePosition !== "vertical" ? count.orange++ : null

        fragment.color === "pink" && fragment.piecePosition !== "vertical" ? count.pink++ : null

        fragment.color === "white" && fragment.piecePosition !== "vertical" ? count.white++ : null
      }
    })

    // Conditions
    let c = [
      count.crystal + count.blue === maxColumn_index + 1,
      count.crystal + count.orange === maxColumn_index + 1,
      count.crystal + count.yellow === maxColumn_index + 1,
      count.crystal + count.pink === maxColumn_index + 1,
      count.crystal + count.white === maxColumn_index + 1,
      count.crystal + count.orange === maxColumn_index,
      count.crystal + count.blue === maxColumn_index,
      count.crystal + count.yellow === maxColumn_index,
      count.crystal + count.pink === maxColumn_index,
      count.crystal + count.white === maxColumn_index
    ]

    if (c[0] || c[1] || c[2] || c[3] || c[4]) {

      pieces = pieces.filter((p: any) => {
        if (p.usingRows[0] === rowIndex) {
          return false // Remove
        }
        else {
          return true // Dont remove
        }
      })

      score += 60 * scoreMultiplier
    }

    // Register the row if there is a long in a matching row
    if (c[5] || c[6] || c[7] || c[8] || c[9]) {
      vertical_long_inRow ? savedRows.push(rowIndex) : null
    }

    /**
     * If there are two rows matching colors with a long piece in it, go 
     * ahead and remove the pieces.
     */
    if (savedRows.length === 3) {

      score += 70 * scoreMultiplier

      for (const row of savedRows)

        pieces = pieces.filter((p: any) => {
          if (p.usingRows[0] === row) {
            return false // Remove
          }
          else {
            return true // Dont remove
          }
        })
    }

  })

  /**
   * Start with a clean matrix and then fill it
   * with the position of each piece.
   */
  resetMatrix()

  // Populate matrix with empty objects
  for (let row = 0; row < matrix.length; row++) {
    matrix[row].forEach((column, i) => {

      matrix[row][i] = {
        color: null,
        type: null,
        isOccupied: false,
        pieceIsParked: false,
        piecePosition: null
      }

    })
  }

  // Populate with the position of each piece
  pieces.forEach((p: any) => {

    p.usingColumns.forEach((column: number) => {
      p.usingRows.forEach((row: number) => {

        let fragment: any = matrix[row][column]

        fragment.type = p.type
        fragment.color = p.color
        fragment.isOccupied = true

        if (!p.isActive) {
          fragment.pieceIsParked = true
        }

        if (p.type === "long") {
          p.isVertical ? fragment.piecePosition = "vertical" : null
        }
      })
    })
  })

  /** 
   * If pieces have been filtered out, re-arrange pieces position
   * above the lines been removed.
   */
  pieces.forEach((p: any) => {

    let lowestAvailableRow = getLowestAvailableRow(p, matrix, maxRow_index)

    switch (p.type) {
      case "block":
        if (!p.isActive) {

          if (p.usingRows[0] < lowestAvailableRow) {

            p.isRearranging = true
            p.prevRowPos = p.usingRows[0]
            p.usingRows[0] = lowestAvailableRow
          }

          if (p.isRearranging) {
            let delta = p.usingRows[0] - p.prevRowPos,
              y_distance = 40 * delta;

            // Smooth falling effect: it takes 5 frames to fall into lowest available row
            if (p.usingRows[0] * 40 - p.y > 0) {
              p.y += y_distance / 10
            }
            else {
              p.isRearranging = false
            }
          }
        }
        break

      case "long":
        if (!p.isActive && p.isVertical) {

          if (p.usingRows[2] < lowestAvailableRow) {

            p.isRearranging = true
            p.prevBottomRowPos = p.usingRows[2]
            p.usingRows[0] = lowestAvailableRow - 2
            p.usingRows[1] = lowestAvailableRow - 1
            p.usingRows[2] = lowestAvailableRow
          }

          if (p.isRearranging) {
            let delta = p.usingRows[2] - p.prevBottomRowPos,
              y_distance = 40 * delta;

            // Smooth falling effect: it takes 5 frames to fall into lowest available row
            if (p.usingRows[2] * 40 - (p.y + 80) > 0) {
              p.y += y_distance / 10
            }
            else {
              p.isRearranging = false
            }
          }

        }

        if (!p.isActive && !p.isVertical) {

          if (p.usingRows[0] < lowestAvailableRow) {

            p.isRearranging = true
            p.prevBottomRowPos = p.usingRows[0]
            p.usingRows[0] = lowestAvailableRow
          }

          if (p.isRearranging) {
            let delta = p.usingRows[0] - p.prevBottomRowPos,
              y_distance = 40 * delta;

            // Smooth falling effect: it takes 5 frames to fall into lowest available row
            if (p.usingRows[0] * 40 - p.y > 0) {
              p.y += y_distance / 10
            }
            else {
              p.isRearranging = false
            }
          }
        }
        break
    }
  })

  // If there is a parked piece in row index "0" is game over
  let fragment: any;

  for (fragment of matrix[0]) {
    if (fragment.isOccupied && fragment.pieceIsParked) {
      isGameOver = true
      alert('Game over\nScore: ' + score)
      break
    }
  }

  // Animation effects: sparkles on bomb explosion
  if (savedPositions.length > 0) {
    savedPositions.forEach((pos, i) => {
      drawPiece(particle, pos.x, pos.y, ctx, canvas)
      savedPositions[i].frameCount -= 1
    })
  }

  savedPositions = savedPositions.filter(pos => pos.frameCount > 0)

  isGameOver ? location.reload() : window.requestAnimationFrame(gameLoop)
}