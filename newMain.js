const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d");

const greenBlock = new Image(),
      greyBrick = new Image();
      
greenBlock.src = "images/greenTile.png";
greyBrick.src = "images/horizontalGrey.png";      

// The matrix will save the color and a boolean for place occupancy

// matrix[rowIndex][columnIndex]

var matrix = [
  [{},{},{},{},{},{}],  // y:0
  [{},{},{},{},{},{}],  // y:40
  [{},{},{},{},{},{}],  // y:80
  [{},{},{},{},{},{}],  // y:120
  [{},{},{},{},{},{}],  // y:160
  [{},{},{},{},{},{}],  // ....
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
    this.x = 80,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.usingColumns = [2, 3],
    this.usingRows = [0]
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
    pieces.push(new block());
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

  let n;
  down ? n = 10 : n = 40 // Booster

  if(frames > n){
    
    console.log(matrix)

    let lastAvailableRow, numbers = [];

    /**
     * If the piece has a length of two fragments
     * then check the last available row on those two columns.
     * 
     */
    AP['usingColumns'].forEach(column => {

      for(let row = 0; row <= maxRow_index; row++){

        let fragment = matrix[row][column]
        
        /**
         * "fragment.isNotActive" means that the fragment is not been occupied by 
         * an active piece.
         * 
         */
        if(fragment.isOccupied && fragment.pieceIsParked){
          numbers.push(row) // Push row number if fragment is been occupied by an inactive piece
        }
      }

    })
        

    /**
     * In case the numbers array is empty the highest occupied
     * row will be the max row.
     * 
     * The last available row is retrieved by the row number of the highest 
     * piece in the column minus one.
     * 
     */

    

    numbers.length > 0 ? lastAvailableRow = Math.min(...numbers) - 1 : lastAvailableRow = maxRow_index;

    // console.log(maxRow_index)
    // console.log(AP.usingRows)

    // Can the active piece move to the next row?
    AP['usingRows'].forEach((row, i) => {
      
      if(row < lastAvailableRow){
        AP['usingRows'][i] += 1
  
        // Update coordinate y
        AP.y += 40 
      }
      else{
        // Deactivate piece and create a new one
        AP.isActive = false
        pieces.push(new brick())
      }
    })

    

      // Reset frame count
      frames = 0

  }
  

  /**
   * @abstract
   * 
   * HORIZONTAL MOVEMENT
   * 
   */
    /*let left_fragment = matrix[AP.row][AP.column - 1]

    if(left && AP.column > 0 && !timeOut && !left_fragment.isOccupied){
      AP.column -= 1;
      AP.x -= 40;
      timeOut = true;
      setTimeout(() => { timeOut = false }, 120);
    }

    let right_fragment = matrix[AP.row][AP.column + 1]

    if(right && AP.column < maxColumn_index && !timeOut && !right_fragment.isOccupied){
      AP.column += 1;
      AP.x += 40;
      timeOut = true;
      setTimeout(() => { timeOut = false }, 120);
    }

*/
  
  

  




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

        fragment.color = p.color
        fragment.isOccupied = true

        p.isActive ? null : fragment.pieceIsParked = true

      })
    })

    
  })

    
  

  window.requestAnimationFrame(gameLoop)
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


