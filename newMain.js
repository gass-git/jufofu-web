const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d");

const greenBlock = new Image();
      
greenBlock.src = "images/greenTile.png";
      
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

class block {
  constructor(color){
    this.type = "block",
    this.color = "green",
    this.image = greenBlock,
    this.x = 120,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.column = 3,
    this.row = 0
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
  pieces.length === 0 ? pieces.push(new block()) : null

  var activePiece;

  // Draw all the pieces and initialize the active piece
  pieces.forEach(p => {
    drawPiece(p.image, p.x, p.y)
    p.isActive ? activePiece = p : null
  })



  /** 
   * @abstract 
   * 
   * VERTICAL MOVEMENT
   * 
   */
  if(frames === 40){
    
      let availableRow, numbers = [];
    
      for(let row = 0; row <= maxRow_index; row++){
          
          let fragment = matrix[row][activePiece.column]
          
          /**
           * "fragment.isNotActive" means that the fragment is not been occupied by 
           * an active piece.
           * 
           */
          if(fragment.isOccupied && fragment.isNotActive){
            numbers.push(row)
          }
          
        }

        /**
         * In case the numbers array is empty the highest occupied
         * row will be the max row.
         * 
         * The available row is retrieved by the row number of the highest 
         * piece in the column minus one.
         * 
         */
        numbers.length > 0 ? availableRow = Math.min(...numbers) - 1 : availableRow = maxRow_index;

        // Can the active piece move to the next row?
        let conditions = [
          activePiece.row < maxRow_index,               // Canvas limit row
          activePiece.row < availableRow    // Column height available
        ]

        if(conditions[0] && conditions[1]){
          activePiece.row++

          // Update coordinate y
          activePiece.y = activePiece.row * 40
        }
        else{
          // Deactivate piece and create a new one
          activePiece.isActive = false
          pieces.push(new block())
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
  if(left && activePiece.column > 0 && !timeOut){
    activePiece.column -= 1;
    activePiece.x -= 40;
    timeOut = true;
    setTimeout(() => { timeOut = false }, 120);
  }

  if(right && activePiece.column < maxColumn_index && !timeOut){
    activePiece.column += 1;
    activePiece.x += 40;
    timeOut = true;
    setTimeout(() => { timeOut = false }, 120);
  }

  if(down){
    // Pending
    console.log('down')
  }
  
  

  




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
        isNotActive: true
      }

    })
  }

  // Populate with the position of each piece
  pieces.forEach(p => {
    let fragment = matrix[p.row][p.column]

    fragment.color = p.color
    fragment.isOccupied = true
    fragment.isNotActive = !p.isActive
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


