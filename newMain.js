const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d");

// Block images ------------------------------------
const greenBlock = new Image(),
      blueBlock = new Image(),
      redBlock = new Image(),
      orangeBlock = new Image(),
      pinkBlock = new Image(),
      crystalBlock = new Image();

crystalBlock.src = "inGame_images/crystalBlock.png"
blueBlock.src = "inGame_images/blueBlock.png"
greenBlock.src = "inGame_images/greenBlock.png"
redBlock.src = "inGame_images/redBlock.png"
orangeBlock.src = "inGame_images/orangeBlock.png"
pinkBlock.src = "inGame_images/pinkBlock.png"
// -------------------------------------------------


// Brick image -------------------------------------
const crystalBrick = new Image()

crystalBrick.src = "inGame_images/crystalBrick.png"    
// -------------------------------------------------


// Tall images -------------------------------------
const tallCrystal = new Image(),
      flatCrystal = new Image();

tallCrystal.src = "inGame_images/tallCrystal.png"
flatCrystal.src = "inGame_images/flatCrystal.png"
// -------------------------------------------------      

// Bomb image --------------------------------------
const bombImage = new Image()

bombImage.src = "inGame_images/blackCircle.png"
// -------------------------------------------------


const blockImages = {
  green: greenBlock,
  blue: blueBlock,
  crystal: crystalBlock,
  orange: orangeBlock,
  pink: pinkBlock,
  red: redBlock
}

var colorsInPlay = [
  "red",
  "blue",
  "crystal"
]

const colorsToActive = [
  "orange",
  "pink",
  "green"
]

// Frames needed to activate new color
var framesForNewColor = 100

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
    up = false;

// Other global variables   
var score = 0,
    totalFrameCount = 0,
    frameCount = 0, 
    isGameOver = false,
    timeOut = false,
    tallInPlay = false;

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
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0]
  }
}

class brick {
  constructor(){
    this.type = "brick",
    this.color = "crystal",
    this.image = crystalBrick,
    this.x = 120,
    this.y = 0,
    this.isActive = true,
    this.usingColumns = [3, 4],
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

class tall{
  constructor(){
    this.type = "tall",
    this.isVertical = true,
    this.color = "crystal",
    this.image = tallCrystal,
    this.x = 120,
    this.y = 0,
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

  // Add new colors to the game after a certain number of frames 
  if(totalFrameCount === framesForNewColor){
    colorsInPlay.push(colorsToActive[0])
  }
  else if(totalFrameCount === framesForNewColor * 2){
    colorsInPlay.push(colorsToActive[1])
  }
  else if(totalFrameCount === framesForNewColor * 3){
    colorsInPlay.push(colorsToActive[2])
  }


  // Create the first piece
  if(pieces.length === 0){
    pieces.push(randomPiece());
  }


  var AP // Active piece

  // Draw all the pieces and initialize the active piece
  pieces.forEach(p => {
    drawPiece(p.image, p.x, p.y)
    p.isActive ? AP = p : null
  })

  /**
   * @abstract Rotation
   * 
   */
  if(up && AP.type === "tall" && !timeOut){
    
    rotateTall(AP)
    timeOut = true;
    setTimeout(() => { timeOut = false }, 120);
  }


  /** 
   * @abstract 
   * 
   * VERTICAL MOVEMENT
   * 
   */
  let n
  down ? n = 5 : n = 40 // Booster

  if(frameCount > n){
    
    let lowestAvailableRow = GET_lowestAvailableRow(AP)

    

    // Can the active piece move to the next row?    
    if(AP.type === "block" || AP.type === "brick" || AP.type === "bomb"){
    
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
        console.log(AP.usingRows[0])  
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
        pieces.push(randomPiece())

      }
    }

    if(AP.type === "tall"){

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
          pieces.push(randomPiece())
        }

      }

      if(AP.isVertical === false){

        if(AP['usingRows'][0] + 1 < lowestAvailableRow){
        
          // Update rows of piece
          AP['usingRows'][0] += 1
  
          // Update coordinate y
          AP.y += 40 
        }
        else{ 
          // Deactivate piece and create a new one
          AP.isActive = false
          pieces.push(randomPiece())
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

    if(AP.type === "tall"){

      if(AP.isVertical){
        left_fragment = matrix[ AP.usingRows[2] ][ AP.usingColumns[0] - 1 ]

        // Can it move to the left?
        if(AP.usingColumns[0] > 0 && !left_fragment.isOccupied){
        
          AP.usingColumns[0] -= 1
          AP.x -= 40;
        }
      }

      else if(!AP.isVertical){
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

    if(AP.type !== "tall"){

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

          case "brick":
            AP.usingColumns[0] -= 1
            AP.usingColumns[1] -= 1
            AP.x -= 40;
        }

      }     
    }

    timeOut = true;
    setTimeout(() => { timeOut = false }, 120);
  }
  

  if(right && !timeOut){
  
    let right_fragment

    if(AP.type === "tall"){

      if(AP.isVertical){
        right_fragment = matrix[ AP.usingRows[2] ][ AP.usingColumns[0] + 1 ]

        // Can it move to the right?
        if(AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied){
        
          AP.usingColumns[0] += 1
          AP.x += 40;
        }
      }

      else if(!AP.isVertical){
        right_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[0] - 1 ]

         // Can it move to the right?
        if(AP['usingColumns'][0] > 0 && !right_fragment.isOccupied){

          AP.usingColumns[0] += 1
          AP.usingColumns[1] += 1
          AP.usingColumns[2] += 1
          AP.x += 40;
        }
      }

    }

    if(AP.type !== "tall"){

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

          case "brick":

            right_fragment = matrix[ AP.usingRows[0] ][ AP.usingColumns[1] + 1 ]

            if(AP.usingColumns[1] < maxColumn_index && !right_fragment.isOccupied){

              AP.usingColumns[0] += 1
              AP.usingColumns[1] += 1
              AP.x += 40
            }
            break
        }

           
    }

    timeOut = true;
    setTimeout(() => { timeOut = false }, 120);
  }
  

  /**
   * @abstract Matching rows
   * 
   */
  
  let savedRows = []

  matrix.forEach((rowFragments, rowIndex) => {

    let vertical_tall_inRow = false;

    let count = {
      blue: 0,
      green: 0,
      crystal: 0
    }

    rowFragments.forEach((fragment) => { // Loop through row columns

      if(fragment.isOccupied && fragment.pieceIsParked){
        
        fragment.piecePosition === "vertical" ? vertical_tall_inRow = true : null

        fragment.color === "crystal" && fragment.piecePosition !== "vertical" ? count.crystal++ : null

        fragment.color === "green" && fragment.piecePosition !== "vertical" ? count.green++ : null

        fragment.color === "blue" && fragment.piecePosition !== "vertical" ? count.blue++ : null

      }
    })

    // Conditions
    let c = [
      count.crystal + count.blue === maxColumn_index + 1,
      count.crystal + count.green === maxColumn_index + 1,  
      count.crystal + count.green === maxColumn_index,
      count.crystal + count.blue === maxColumn_index            

    ]

    if(c[0] || c[1]){

      pieces = pieces.filter(p => {
                  if(p.usingRows[0] === rowIndex){
                    return false // Remove
                  }
                  else{
                    return true // Dont remove
                  }
                })      
    }

    // Register the row if there is a tall in a matching row
    if(c[2] || c[3]){
      vertical_tall_inRow ? savedRows.push(rowIndex) : null
    }
    
    /**
     * If there are two rows matching colors with a tall piece in it, go 
     * ahead and remove the pieces.
     */
    if(savedRows.length === 3){

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

        if(p.type === "tall"){
          p.isVertical ? fragment.piecePosition = "vertical" : null
        }

      })
    })

    
  })

    /** 
       * If pieces have been filtered out re-arrange pieces
       * above.
       * 
       */ 
     pieces.forEach(p => {
        
      let lowestAvailableRow = GET_lowestAvailableRow(p)

      switch(p.type){

        case "block":

          if(!p.isActive && p['usingRows'][0] < lowestAvailableRow){
        
            let pieceInRow = p['usingRows'][0]
    
            let delta = lowestAvailableRow - pieceInRow
            
            p.y += 40 * delta
            p['usingRows'][0] = lowestAvailableRow
          }
          break

        case "brick":

          if(!p.isActive && p['usingRows'][0] < lowestAvailableRow){
        
            let pieceInRow = p['usingRows'][0]
    
            let delta = lowestAvailableRow - pieceInRow
            
            p.y += 40 * delta
            p['usingRows'][0] = lowestAvailableRow
          }
          break

        case "tall":

          if(p.isVertical){

            if(!p.isActive && p['usingRows'][2] < lowestAvailableRow){
          
              let pieceInRow = p['usingRows'][2]
      
              let delta = lowestAvailableRow - pieceInRow
              
              p.y += 40 * delta;
              p['usingRows'][0] = lowestAvailableRow - 2;
              p['usingRows'][1] = lowestAvailableRow - 1;
              p['usingRows'][2] = lowestAvailableRow;

            }
          }

          if(p.isVertical === false){

            if(!p.isActive && p['usingRows'][0] < lowestAvailableRow){
          
              let pieceInRow = p['usingRows'][0]
    
              let delta = lowestAvailableRow - pieceInRow

              p.y += 40 * delta;
              p['usingRows'][0] = lowestAvailableRow;

            }

          }

          break

      }

      
    
    })
  


  

  window.requestAnimationFrame(gameLoop)
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
     * In the case of the "tall" piece the lower row
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

      case "brick": 
        initialRow = piece['usingRows'][0] + 1
        break

      case "tall":

        if(piece.isVertical){
          initialRow = piece['usingRows'][2] + 1 
        }

        if(piece.isVertical === false){
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

function randomPiece(){
  let rand = Math.random()

  /**
   * Only one tallInPlay is allowed to be in play,
   * having more would create many issues..
   */

  // Is there a tallInPlay?
  for(const p of pieces){
    
    if(p.type === "tall"){
     tallInPlay = true
     break
    }
    else {
     tallInPlay = false
    }
  }

  // Get random color from colors in play
  let randomColor = colorsInPlay[ Math.floor( Math.random() * (colorsInPlay.length - 1) ) ];
  console.log(randomColor)

  if(rand < 0.05){
    return new bomb()
  }
  if(rand < 0.8){
    return new block(randomColor) 
  }
  else if(rand < 0.9 && !tallInPlay){ 
    return new tall()
  }
  else{
    return new brick()
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
      return false // Remove the piece
    }
    else{
      return true // Keep the piece
    }

  })

}

function rotateTall(p){

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
    right = true;
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = true;
  }
  if(e.key === "Down" || e.key === "ArrowDown"){
    down = true;
  }
  if(e.key === "Up" || e.key === "ArrowUp"){
    up = true;
  }
}
function handleKeyUp(e){
  if(e.key === "Right" || e.key === "ArrowRight"){
    right = false;
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = false;
  }
  if(e.key === "Down" || e.key === "ArrowDown"){
    down = false;
  }
  if(e.key === "Up" || e.key === "ArrowUp"){
    up = false;
  }
}

startBtn.addEventListener('click', () => {
  if(startBtn.innerText === 'start game'){
    pieces.length > 0 ? pieces = [] : null
    startBtn.innerText = 'end game'
    init()
  }
  else{
    location.reload()
  }
})


