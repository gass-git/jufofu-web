const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d"),
      progressBar = document.getElementById("progress-bar"),
      bombsInventory = document.getElementById("bombs-inventory");

// Block images ------------------------------------
const greenBlock = new Image(),
      blueBlock = new Image(),
      pinkBlock = new Image(),
      crystalBlock = new Image(),
      yellowBlock = new Image(),
      redBlock = new Image(),
      whiteBlock = new Image(),
      orangeBlock = new Image();

crystalBlock.src = "inGame_images/crystalBlock.png"
blueBlock.src = "inGame_images/blueBlock.png"
greenBlock.src = "inGame_images/greenBlock.png"
yellowBlock.src = "inGame_images/yellowBlock.png"
redBlock.src = "inGame_images/redBlock.png"
pinkBlock.src = "inGame_images/pinkBlock.png"
whiteBlock.src = "inGame_images/whiteBlock.png"
orangeBlock.src = "inGame_images/orangeBlock.png"
// -------------------------------------------------

// long piece images -------------------------------------
const tallCrystal = new Image(),
      flatCrystal = new Image();

tallCrystal.src = "inGame_images/tallCrystal.png"
flatCrystal.src = "inGame_images/flatCrystal.png"
// -------------------------------------------------      

// Bomb image --------------------------------------
const bombImage = new Image()

bombImage.src = "inGame_images/blackCircle.png"
// -------------------------------------------------

// Variable to register coordinates of blocks removed
var savedPositions = []

const blockImages = {
  green: greenBlock,
  blue: blueBlock,
  crystal: crystalBlock,
  pink: pinkBlock,
  yellow: yellowBlock,
  red: redBlock,
  white: whiteBlock,
  orange: orangeBlock
}

var colorsInPlay = [
  "yellow",
  "blue",
  "crystal"
]

const bigParticle = new Image(),
      smallParticle = new Image();

bigParticle.src = 'inGame_images/bigParticle.png'
smallParticle.src = 'inGame_images/smallParticle.png';     


// matrix[rowIndex][columnIndex]
var matrix = [
  [{},{},{},{},{},{}],  
  [{},{},{},{},{},{}],  
  [{},{},{},{},{},{}],  
  [{},{},{},{},{},{}],  
  [{},{},{},{},{},{}],  
  [{},{},{},{},{},{}], 
  [{},{},{},{},{},{}],
  [{},{},{},{},{},{}],
  [{},{},{},{},{},{}],
  [{},{},{},{},{},{}]
];

var maxRow_index = matrix.length - 1,
    maxColumn_index = matrix[0].length - 1;

// Pieces arrays
var pieces = [];

// Movement variables
const speed = 1, 
      boost = 6;

var right = false,
    left = false,
    down = false,
    up = false,
    spacebar = false;

// Other global variables   
var score = 0,
    totalFrameCount = 0,
    frameCount = 0, 
    isGameOver = false,
    timeOut = false,
    longInPlay = false;

// Variable for progress bar functionality
var fill = 0

// Bomb inventory
var bombsAvailable = 0,
    throwBomb = false;

/**
 * @abstract Piece classes
 * 
 */
class block {
  constructor(color){
    this.type = "block"
    this.color = color,
    this.image = blockImages[color],
    this.x = 120,
    this.y = 0,
    this.isRearranging = false,
    this.prevRowPos = null,
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0]
  }
}
class bomb{
  constructor(){
    this.type = "bomb"
    this.color = null,
    this.image = bombImage,
    this.x = 120,
    this.y = 0,
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0]
  }
}
class long{
  constructor(){
    this.type = "long",
    this.isVertical = true,
    this.color = "crystal",
    this.image = tallCrystal,
    this.x = 120,
    this.y = 0,
    this.isRearranging = false,
    this.prevBottomRowPos = null,
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0, 1, 2]
  }
}

function init(){
  window.requestAnimationFrame(gameLoop)
}

function gameLoop(){
  
  // Clean the canvas and count the frames
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  totalFrameCount++
  frameCount++

  // Update score
  scoreDiv.innerText = score

  /**
   * Add new colors to the game after a certain
   * number of frames.
   */
  switch(totalFrameCount){
    
    case 1000:
      colorsInPlay.push("pink")
      break
     
    case 2000:
      colorsInPlay.push("white")
      break 
      
    case 5000:
      colorsInPlay.push("orange")
      break   

    default:
      break  
  }
  
  // Create the first piece
  if(pieces.length === 0){
    pieces.push(createPiece());
  }

  var AP // Active piece

  // Draw all the pieces and initialize the active piece
  pieces.forEach(p => {
    drawPiece(p.image, p.x, p.y)
    p.isActive ? AP = p : null
  })

  /**
   * @abstract Throw bomb on next turn ?
   * 
   */
  if(spacebar && !throwBomb && bombsAvailable > 0){
    
    throwBomb = true
    bombsInventory.removeChild(bombsInventory.childNodes[bombsAvailable - 1])
  }


  /**
   * @abstract Rotation
   * 
   */
  if(up && AP.type === "long" && !timeOut){
    
    rotateLong(AP)
    timeOut = true
    setTimeout(() => { timeOut = false }, 120)
  }


  /** 
   * @abstract 
   * 
   * VERTICAL MOVEMENT
   * 
   */
  let n

  // Show available bombs 
  var node = document.createElement("span")
  var imageElement = document.createElement("img")
  imageElement.src = "inGame_images/blackCircle.png"
  node.appendChild(imageElement)

  if(down){ 
    n = 5 // Booster

    // Bombs inventory
    if(fill < 100){
      fill += 0.2
    }
    else{
      fill = 0

      // Maximum capacity of bombs in inventory
      bombsAvailable <= 8 ?  bombsAvailable++ : null

      // Append new bomb to inventory DIV
      bombsInventory.appendChild(node)
    }
  }
  else{
    n = 40
  }
  
  // Update progress bar
  progressBar.style.width = fill + '%'


  if(frameCount > n){
    
    let lowestAvailableRow = GET_lowestAvailableRow(AP)

    // Can the active piece move to the next row?    
    if(AP.type === "block" || AP.type === "bomb"){
    
      if(AP.usingRows[0] < lowestAvailableRow){
        
        if(AP.type !== "bomb" && AP.usingRows[0] + 1 < lowestAvailableRow){
          // Update row of piece
          AP.usingRows[0] += 1
    
          // Update coordinate y
          AP.y += 40 
        }
        else{
          // Update row of bomb
          AP.usingRows[0] += 1
    
          // Update coordinate y
          AP.y += 40 
        }
      }
      else{ 
        
        if(AP.type === "bomb"){

          // Destroy sorrounding color pieces
          explode(AP)
    
          // Destroy bomb
          pieces = pieces.filter(p => p.type !== "bomb")
        }
        else{
          // Deactivate piece
          AP.isActive = false
        }

        // Create a new piece
        pieces.push(createPiece())
      }
    }

    if(AP.type === "long"){

      if(AP.isVertical){

        if(AP['usingRows'][2] + 1 < lowestAvailableRow){
        
          // Update rows of piece
          AP['usingRows'][0] += 1
          AP['usingRows'][1] += 1
          AP['usingRows'][2] += 1
  
          // Update coordinate y
          AP.y += 40 
        }
        else{ 
          // Deactivate piece and create a new one
          AP.isActive = false
          pieces.push(createPiece())
        }

      }
      else{

        if(AP['usingRows'][0] + 1 < lowestAvailableRow){
        
          // Update rows of piece
          AP['usingRows'][0] += 1
  
          // Update coordinate y
          AP.y += 40 
        }
        else{ 
          // Deactivate piece and create a new one
          AP.isActive = false
          pieces.push(createPiece())
        }
      }
    }          

    // Reset frame count
    frameCount = 0
  }
  

  /**
   * @abstract
   * 
   * HORIZONTAL MOVEMENT
   * 
   */
  if(left && !timeOut){
    
    let left_fragment

    if(AP.type === "long"){

      if(AP.isVertical){
        left_fragment = matrix[ AP.usingRows[2] ][ AP.usingColumns[0] - 1 ]

        // Can it move to the left?
        if(AP.usingColumns[0] > 0 && !left_fragment.isOccupied){
        
          AP.usingColumns[0] -= 1
          AP.x -= 40;
        }
      }
      else{
        left_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[0] - 1 ]

         // Can it move to the left?
        if(AP['usingColumns'][0] > 0 && !left_fragment.isOccupied){

          AP.usingColumns[0] -= 1
          AP.usingColumns[1] -= 1
          AP.usingColumns[2] -= 1
          AP.x -= 40;
        }
      }
    }

    if(AP.type !== "long"){

      left_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[0] - 1 ]

      if(AP.usingColumns[0] > 0 && !left_fragment.isOccupied){

        switch(AP.type){

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
  
  if(right && !timeOut){
  
    let right_fragment

    if(AP.type === "long"){

      if(AP.isVertical){
        right_fragment = matrix[ AP.usingRows[2] ][ AP.usingColumns[0] + 1 ]

        // Can it move to the right?
        if(AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied){
        
          AP.usingColumns[0] += 1
          AP.x += 40;
        }
      }
      else{
        right_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[2] + 1 ]

         // Can it move to the right?
        if(AP.usingColumns[2] < maxColumn_index && !right_fragment.isOccupied){

          AP.usingColumns[0] += 1
          AP.usingColumns[1] += 1
          AP.usingColumns[2] += 1
          AP.x += 40;
        }
      }
    }

    if(AP.type !== "long"){

        switch(AP.type){

          case "block":

            right_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[0] + 1 ]

            if(AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied){
              
              AP.usingColumns[0] += 1
              AP.x += 40
            }
            break

          case "bomb":  

            right_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[0] + 1 ]

            if(AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied){
              
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
   * @abstract Matching rows
   * 
   */
  let savedRows = []

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

    rowFragments.forEach((fragment) => { // Loop through row columns

      if(fragment.isOccupied && fragment.pieceIsParked){
        
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

    if(c[0] || c[1] || c[2] || c[3] || c[4]){

      pieces = pieces.filter(p => {
                  if(p.usingRows[0] === rowIndex){
                    return false // Remove
                  }
                  else{
                    return true // Dont remove
                  }
                })      

      score += 10 * ( maxRow_index + 1 )
    }

    // Register the row if there is a long in a matching row
    if(c[5] || c[6] || c[7] || c[8] || c[9]){
      vertical_long_inRow ? savedRows.push(rowIndex) : null
    }
    
    /**
     * If there are two rows matching colors with a long piece in it, go 
     * ahead and remove the pieces.
     */
    if(savedRows.length === 3){

      score += 10 * 3 * ( maxRow_index + 1 )

      for(const row of savedRows)

      pieces = pieces.filter(p => {
        if(p.usingRows[0] === row){
          return false // Remove
        }
        else{
          return true // Dont remove
        }
      })       
    }

  })

 
  /**
   * @abstract Update matrix
   * 
   * Start with a clean matrix and then fill it
   * with the position of each piece.
   * 
   */  
  matrix = [
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],  
    [{},{},{},{},{},{}],
    [{},{},{},{},{},{}],
    [{},{},{},{},{},{}],
    [{},{},{},{},{},{}]
  ];

  // Populate matrix with empty objects
  for(let row = 0; row < matrix.length; row++){
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
  pieces.forEach(p => {

    p['usingColumns'].forEach((column) => {
      p['usingRows'].forEach((row) => {

        let fragment = matrix[row][column]

        fragment.type = p.type
        fragment.color = p.color
        fragment.isOccupied = true

        p.isActive ? null : fragment.pieceIsParked = true

        if(p.type === "long"){
          p.isVertical ? fragment.piecePosition = "vertical" : null
        }

      })
    })

    
  })

    /** 
       * If pieces have been filtered out, re-arrange pieces position
       * above the lines been removed.
       * 
       */ 
     pieces.forEach(p => {
        
      let lowestAvailableRow = GET_lowestAvailableRow(p)

      switch(p.type){

        case "block":

          if(!p.isActive){

            if(p.usingRows[0] < lowestAvailableRow){

              p.isRearranging = true
              p.prevRowPos = p.usingRows[0]
              p.usingRows[0] = lowestAvailableRow
            }

            if(p.isRearranging){
              let delta = p.usingRows[0] - p.prevRowPos,
                  y_distance = 40 * delta;
              
              // Smooth falling effect: it takes 5 frames to fall into lowest available row
              if(p.usingRows[0] * 40 - p.y > 0){
                p.y += y_distance / 10
              }
              else{
                p.isRearranging = false
              }
            }

          }
          break

        case "long":

          if(!p.isActive && p.isVertical){

            if(p.usingRows[2] < lowestAvailableRow){

              p.isRearranging = true
              p.prevBottomRowPos = p.usingRows[2]           
              p.usingRows[0] = lowestAvailableRow - 2
              p.usingRows[1] = lowestAvailableRow - 1
              p.usingRows[2] = lowestAvailableRow
            }

            if(p.isRearranging){
              let delta = p.usingRows[2] - p.prevBottomRowPos,
                  y_distance = 40 * delta;
              
              // Smooth falling effect: it takes 5 frames to fall into lowest available row
              if(p.usingRows[2] * 40 - ( p.y + 80 ) > 0){
                p.y += y_distance / 10
              }
              else{
                p.isRearranging = false
              }
            }

          }

          if(!p.isActive && !p.isVertical){

              if(p.usingRows[0] < lowestAvailableRow){

                p.isRearranging = true
                p.prevBottomRowPos = p.usingRows[0]
                p.usingRows[0] = lowestAvailableRow
              }
  
              if(p.isRearranging){
                let delta = p.usingRows[0] - p.prevBottomRowPos,
                    y_distance = 40 * delta;
                
                // Smooth falling effect: it takes 5 frames to fall into lowest available row
                if(p.usingRows[0] * 40 - p.y > 0){
                  p.y += y_distance / 10
                }
                else{
                  p.isRearranging = false
                }
              }

          }

          break

      }

      
    
    })
  
    // If there is a parked piece in row index "0" is game over
    for(const fragment of matrix[0]){

      if(fragment.isOccupied && fragment.pieceIsParked){
        isGameOver = true
        alert('Game over\nScore: ' + score)
        break
      }

    }

    /**
     * @abstract
     * 
     * Animation effects
     * 
     */
    if(savedPositions.length > 0){

      savedPositions.forEach((pos, i) => {

        if(pos.frameCount > 4){
          drawPiece(bigParticle, pos.x, pos.y)
          savedPositions[i].frameCount -= 1
        }


        if(pos.pendingAnimations <= 4){
          drawPiece(smallParticle, pos.x, pos.y)
          savedPositions[i].frameCount -= 1
        }
      })
    }

  savedPositions = savedPositions.filter(pos => pos.frameCount > 0)


  isGameOver ? location.reload() : window.requestAnimationFrame(gameLoop)
}

function GET_lowestAvailableRow(piece){

  let resultRow, 
      numbers = [];

  // Loop through all the columns that the piece is using
  piece['usingColumns'].forEach(column => {

    /**
     * The initial row of the loop will be the lower  
     * row been used by the piece + 1
     * 
     * In the case of the "long" piece the lower row
     * is piece['usingRows'][1]
     * 
     * The initial row will switch depending of the piece
     * type.
     * 
     */
    let initialRow

    switch(piece.type){

      case "block": 
        initialRow = piece['usingRows'][0] + 1
        break
      
      case "bomb": 
        initialRow = piece['usingRows'][0] + 1
        break

      case "long":
        if(piece.isVertical){
          initialRow = piece['usingRows'][2] + 1 
        }
        else{
          initialRow = piece['usingRows'][0] + 1 
        }
        break
    }

    // Loop through all the rows that are below the piece
    for(let row = initialRow; row <= maxRow_index; row++){

      let fragment = matrix[row][column]
      
      if(fragment.isOccupied && fragment.pieceIsParked){
        numbers.push(row) // Push row number if fragment is been occupied by an inactive piece
      }
    }
  })
  

  /**
  * In case the numbers array is empty, the last available
  * row will equal maxRow_index.
  */
  numbers.length > 0 ? resultRow = Math.min(...numbers) - 1 : resultRow = maxRow_index

  return resultRow
}

function createPiece(){
  
  if(throwBomb){

    throwBomb = false
    bombsAvailable -= 1
    return new bomb()
  }else{

    let rand = Math.random()

    /**
     * Only one longInPlay is allowed to be in play,
     * having more would create many issues..
     */

    // Is there a longInPlay?
    for(const p of pieces){
      
      if(p.type === "long"){
      longInPlay = true
      break
      }
      else {
      longInPlay = false
      }
    }

    // Get random color from colors in play
    let randomColor = colorsInPlay[ Math.floor( Math.random() * (colorsInPlay.length) ) ]

    // IMPORTANT: make sure the function ALWAYS returns a piece
    if(rand < 0.15 && !longInPlay){ 
      return new long()
    }
    else if(rand < 0.25){
      return new block('crystal') 
    }
    else {
      return new block(randomColor) 
    }
  }
  
}

function explode(p){
  
  let bombColumn = p.usingColumns[0],
      bombRow = p.usingRows[0];

  // Sorrounding fragments     
  let sorroundingArea = [
    {row: bombRow - 1, column: bombColumn - 1},   // top-left 
    {row: bombRow - 1, column: bombColumn},       // top
    {row: bombRow - 1, column: bombColumn + 1},   // top-right
    {row: bombRow, column: bombColumn - 1},       // left
    {row: bombRow, column: bombColumn + 1},       // right
    {row: bombRow + 1, column: bombColumn - 1},   // bottom-left
    {row: bombRow + 1, column: bombColumn},       // bottom
    {row: bombRow + 1, column: bombColumn + 1}    // bottom-right
  ]

  

  // Destroy all sorrounding pieces that are not crystal
  pieces = pieces.filter(p => {

    let destroyPiece = false

    if(p.type === "block"){
      
      let pieceRow = p.usingRows[0],
          pieceColumn = p.usingColumns[0];

      for(const area of sorroundingArea){

        if(pieceRow === area.row && pieceColumn === area.column){

          if(p.color !== "crystal"){
            destroyPiece = true
            break
          }
        }
      }
    }
  
    if(destroyPiece === true){
      
      // Save positions for particle animations
      savedPositions.push({
        x: p.x + 9,
        y: p.y + 10,
        frameCount: 10
      })

      return false // Remove the piece
    }
    else{
      return true // Keep the piece
    }

  })

  
}

function rotateLong(p){

  if(p.isVertical){

    /**
     * Before rotating let's check if the piece can rotate
     */

    // Check canvas borders
    if(p.usingColumns[0] > 0 && p.usingColumns < maxColumn_index){

      let M = matrix,
          pieceColumn = p.usingColumns[0],
          pieceRow = p.usingRows,
          pieceMiddleRow = p.usingRows[1],
          left_fragment_1 = M[pieceRow[0]][pieceColumn - 1],
          left_fragment_2 = M[pieceRow[1]][pieceColumn - 1],
          left_fragment_3 = M[pieceRow[2]][pieceColumn - 1],
          right_fragment_1 = M[pieceRow[0]][pieceColumn + 1],
          right_fragment_2 = M[pieceRow[1]][pieceColumn + 1],
          right_fragment_3 = M[pieceRow[2]][pieceColumn + 1];

      // Rotating area conditions
      let c = [
        !left_fragment_1.isOccupied,
        !left_fragment_2.isOccupied,
        !left_fragment_3.isOccupied,
        !right_fragment_1.isOccupied,
        !right_fragment_2.isOccupied,
        !right_fragment_3.isOccupied
      ]

      // Is rotation possible ?
      if(c[0] && c[1] && c[2] && c[3] && c[4] && c[5]){
        p.isVertical = false
        p.x -= 40
        p.y += 40
        p.usingColumns = [ pieceColumn - 1,  pieceColumn, pieceColumn + 1 ]
        p.usingRows = [ pieceMiddleRow ] 
        p.image = flatCrystal
      }

    }
  }
  
  else if(!p.isVertical){

    /**
     * Before rotating let's check if the piece can rotate
     */
    let M = matrix,
        pieceColumn = p.usingColumns,
        pieceRow = p.usingRows[0],
        topLeft_fragment = M[pieceRow - 1][pieceColumn[0]],
        topMiddle_fragment = M[pieceRow - 1][pieceColumn[1]],
        topRight_fragment = M[pieceRow - 1][pieceColumn[2]];

    // Rotation area conditions    
    let c = [
      !topLeft_fragment.isOccupied,
      !topMiddle_fragment.isOccupied,
      !topRight_fragment.isOccupied
    ]

    if(c[0] && c[1] && c[2]){

      p.isVertical = true
      p.x += 40
      p.y -= 40
      p.usingColumns = [ pieceColumn[1] ]
      p.usingRows = [ pieceRow - 1, pieceRow, pieceRow + 1 ] 
      p.image = tallCrystal
    }
  }

}



document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);

function drawPiece(image, x, y){
  ctx.drawImage(image, x, y)
}

function handleKeyDown(e){
  if(e.key === "Right" || e.key === "ArrowRight"){
    right = true
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = true
  }
  if(e.key === "Down" || e.key === "ArrowDown"){
    down = true
  }
  if(e.key === "Up" || e.key === "ArrowUp"){
    up = true
  }
  if(e.keyCode === 32){
    spacebar = true
  }
}
function handleKeyUp(e){
  if(e.key === "Right" || e.key === "ArrowRight"){
    right = false
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = false
  }
  if(e.key === "Down" || e.key === "ArrowDown"){
    down = false
  }
  if(e.key === "Up" || e.key === "ArrowUp"){
    up = false
  }
  if(e.keyCode === 32){
    spacebar = false
  }
}

startBtn.addEventListener('click', () => {
  if(startBtn.innerText === 'Start Game'){
    pieces.length > 0 ? pieces = [] : null
    startBtn.innerText = 'End Game'
    init()
  }
  else{
    location.reload()
  }
})


