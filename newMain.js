const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d");

const greenBlock = new Image(),
      tallGrey = new Image(),
      greyBrick = new Image();
      
greenBlock.src = "images/greenTile.png";
greyBrick.src = "images/horizontalGrey.png";    
tallGrey.src = "images/tallGrey.png"; 

// The matrix will save the color and a boolean for place occupancy

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

const column_ini = 4;

var maxRow_index = matrix.length - 1;

var maxColumn_index = matrix[0].length - 1;

// Pieces arrays
var pieces = [];



// Movement variables
const speed = 1, 
      boost = 6;

var right = false,
    left = false,
    down = false;

var timeOut = true;

// Other global variables   
var score = 0,
    timeOut = false,
    frames = 0, 
    isGameOver = false;

/**
 * @abstract
 * 
 * Pieces
 * 
 */

 class block {
  constructor(){
    this.type = "block"
    this.color = "green",
    this.image = greenBlock,
    this.x = 120,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0]
  }
}

class brick {
  constructor(){
    this.type = "brick",
    this.color = "grey",
    this.image = greyBrick,
    this.x = 120,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.usingColumns = [3, 4],
    this.usingRows = [0]
  }
}

class tall{
  constructor(){
    this.type = "tall",
    this.color = "grey",
    this.image = tallGrey,
    this.x = 120,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.usingColumns = [3],
    this.usingRows = [0, 1]
  }
}

var frames = 0

function init(){
  window.requestAnimationFrame(gameLoop)
}

function gameLoop(){
  
  // Clean the canvas and count the frames
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  frames++


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
   * @abstract 
   * 
   * VERTICAL MOVEMENT
   * 
   */
  let n
  down ? n = 10 : n = 40 // Booster

  if(frames > n){
    
    let lowestAvailableRow = GET_lowestAvailableRow(AP)

    

    // Can the active piece move to the next row?    
    if(AP.type === "block" || AP.type === "brick"){
    
      if(AP['usingRows'][0] + 1 < lowestAvailableRow){
        
        // Update row of piece
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

    if(AP.type === "tall"){
      if(AP['usingRows'][1] + 1 < lowestAvailableRow){
        
        // Update rows of piece
        AP['usingRows'][0] += 1
        AP['usingRows'][1] += 1

        // Update coordinate y
        AP.y += 40 
      }
      else{ 
        // Deactivate piece and create a new one
        AP.isActive = false
        pieces.push(randomPiece())
      }
    }          

    // Reset frame count
    frames = 0
  }
  

  /**
   * @abstract
   * 
   * HORIZONTAL MOVEMENT
   * 
   */
  let left_fragment = matrix[ AP['usingRows'][0] ][ AP['usingColumns'][0] - 1 ]
  
    if(left && AP['usingColumns'][0] > 0 && !timeOut && !left_fragment.isOccupied){
      
      if(AP.type === "block" || AP.type === "tall"){
        AP.usingColumns[0] -= 1
      }
      
      if(AP.type === "brick"){
        AP.usingColumns[0] -= 1
        AP.usingColumns[1] -= 1
      }
      
      AP.x -= 40;
      timeOut = true;
      setTimeout(() => { timeOut = false }, 120);
    }

  if(right){
  
    let right_fragment

      if(AP.type === 'block' || AP.type === 'tall'){ 
      
          right_fragment = matrix[ AP['usingRows'][0] ][ AP['usingColumns'][0] + 1 ]
          
          if(AP['usingColumns'][0] < maxColumn_index && !timeOut && !right_fragment.isOccupied){
            AP['usingColumns'][0] += 1
            AP.x += 40
            timeOut = true
            setTimeout(() => { timeOut = false }, 120)
          }
      }


      if(AP.type === 'brick'){
      
          right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[1] + 1]

          if(AP['usingColumns'][1] < maxColumn_index && !timeOut && !right_fragment.isOccupied){
            AP['usingColumns'][0] += 1
            AP['usingColumns'][1] += 1
            AP.x += 40
            timeOut = true
            setTimeout(() => { timeOut = false }, 120)
          }
      }
    
  }
  

  /**
   * @abstract Matching rows
   * 
   */
  
  let savedRows = []

  matrix.forEach((rowArray, rowIndex) => {

    let brick_fragmentCount = 0,
        greenCount = 0,
        tall_inRow = false;

    rowArray.forEach((fragment) => {

      if(fragment.isOccupied && fragment.pieceIsParked){
        
        if(fragment.type === "tall"){
          tall_inRow = true
        }

       if(fragment.type === "brick"){
          brick_fragmentCount++
       } 

       if(fragment.color === "green"){
          greenCount++
       }

      }

    })

    let conditions = [
      brick_fragmentCount + greenCount === maxColumn_index + 1,
      brick_fragmentCount + greenCount === maxColumn_index
    ]

    if(conditions[0]){

      pieces = pieces.filter(p => {
                  if(p['usingRows'][0] === rowIndex){
                    return false // Remove
                  }
                  else{
                    return true // Dont remove
                  }
                })      
    }

    // Register the row
    if(conditions[1] && tall_inRow){
      savedRows.push(rowIndex)
    }

    if(savedRows.length === 2){

      // Filter pieces of the first saved row  
      pieces = pieces.filter(p => {
        if(p['usingRows'][0] === savedRows[0]){
          return false // Remove
        }
        else{
          return true // Dont remove
        }
      }) 
      
      // Filter pieces of the second saved row  
      pieces = pieces.filter(p => {
        if(p['usingRows'][0] === savedRows[1]){
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
        pieceIsParked: false
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

          if(!p.isActive && p['usingRows'][1] < lowestAvailableRow){
        
            let pieceInRow = p['usingRows'][1]
    
            let delta = lowestAvailableRow - pieceInRow
            
            p.y += 40 * delta;
            p['usingRows'][0] = lowestAvailableRow - 1;
            p['usingRows'][1] = lowestAvailableRow;
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
      
      case "brick": 
        initialRow = piece['usingRows'][0] + 1
        break

      case "tall":
        initialRow = piece['usingRows'][1] + 1 
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
   * Only one tall piece is allowed to be in play
   * 
   * Note: this condition makes the matching colors work properly
   * with the tall piece
   */ 
  let tall_inPlay = false

  for(const piece of pieces){
    if(piece.type === "tall"){
      tall_inPlay = true
      break
    }
  }

  if(rand < 0.3 && !tall_inPlay){
    return new tall()
  }
  else if(rand < 0.7){
    return new block()
  }
  else{
    return new brick()
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


