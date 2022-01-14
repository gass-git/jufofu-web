// Interface constants
const canvas = document.getElementById("canvas"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("startBtn"),
      ctx = canvas.getContext("2d");

// Block pieces images
const greenBlock = new Image(),
      blueBlock = new Image(),
      greyBlock = new Image(),
      orangeBlock = new Image(),
      pinkBlock = new Image(),
      redBlock = new Image(),
      yellowBlock = new Image();
      
greenBlock.src = "images/greenTile.png";
blueBlock.src = "images/blueTile.png";
greyBlock.src = "images/greyTile-transparent.png";
orangeBlock.src = "images/orangeTile.png";
pinkBlock.src = "images/pinkTile.png";
redBlock.src = "images/redTile.png";
yellowBlock.src = "images/yellowTile.png";

// Special pieces images
const bombImage = new Image(),
      greyBrick = new Image();  
      
bombImage.src = "images/blackCircle.png";
greyBrick.src = "images/longGrey-2-transparent.png";

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

const columnWidth = 40,
      columnHeight = 40;

const column_ini = 4;

const x_ini = 4 * columnWidth;

/*** Note: to get the coordinates x,y multiply the
* column and row index by the columnWidth and columnHeight 
*/

// Pieces arrays
var pieces = [],
    numberOfColors_init = 2,
    activeBrickColors = ["green", "blue", "yellow"],
    brickColorsToAdd = ["orange", "pink"];

const framesForActivation = 8000; // 100 equals 1 second

function randomActiveColor(){
  let delta = activeBrickColors.length - 1,
      rand = Math.round(Math.random() * delta);
  return activeBrickColors[rand];
}


// Movement variables
const speed = 1, 
      boost = 6;

var right = false,
    left = false,
    down = false;

// Other global variables   
var score = 0,
    timeOut = false,
    frames = 0, 
    isGameOver = false;

class block {
  constructor(color){
    this.type = "block",
    this.color = color,
    this.image = getImage(color),
    this.x = x_ini,
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.column = [4],
    this.row = [10]
  }
}
class joker {
  constructor(x, y, state){
    this.type = "joker",
    this.color = "grey",
    this.image = greyBlock,
    this.x = x_ini,
    this.y = 0,
    this.isMoving = true, 
    this.isActive = state,
    this.column = 4,
    this.row = 10
  }
}
class verticalBrick {
  constructor(){
    this.type = "verticalBrick",
    this.color = "grey",
    this.image = greyBrick,
    this.x = x_ini,
    this.y = 0,
    this.isMoving = true, 
    this.isActive = true,
    this.usingColumns = [4],
    this.usingRows = [9,10]
  }
}

function init(){
  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(){
  /**
   * Create a new piece at the start of the game or if
   * the pieces array is empty.
   */
  if(frames === 0 || pieces.length === 0){
      pieces.push(
        new block(randomActiveColor())
      );
  }

  /**
   * When frames reach a certain amount activate a new 
   * brick color if more remain available.
   */
  let max = numberOfColors_init + brickColorsToAdd.length;  
  
  if(frames === framesForActivation && activeBrickColors.length < max){
    activateNewColor();

    // Reset frames
    frames = 0; 
  }

  // Count the frames
  frames++;

  /**
   * Create a new piece if the last one is not active.  
   * 
   * Note: the function input is the number of pieces that must be in play 
   * to start creating bombs.
   */
  createNewPiece(8);

  /**
   * Update score and clear canvas
   */
  scoreDiv.innerHTML = score;
  ctx.clearRect(0,0,canvas.width, canvas.height);

  /**
   * Loop through all the pieces in play
   */
  pieces.forEach((piece) => {
    drawPieces(piece.type, piece.image, piece.x, piece.y);
    
    handleVerticalMovement(piece);
    handleHorizontalMovement(piece);

    /**
     * The following function repositions the piece on the
     * Y axis in case are not well positioned.
     */
    fixVerticalPosition(piece);

    // Bomb logic
    let lastPiece = pieces[pieces.length - 1];

    if(lastPiece.type === "bomb" && lastPiece.isMoving === false){
      let bomb = lastPiece;

      bombExplosion(bomb);

      /* Important: when pieces are removed all other pieces
            that where above them will move */
      for(const s of pieces){
        s.isMoving = true;
      }

    }

  });

  /**
   * Count the number of pieces in each row and add them to 
   * numberOfPieces_inRows array.
   */
  pieces.forEach((piece) => {
    handlePiecesInRowCount(piece);
  });

  numberOfPieces_inRows.forEach((piecesInRow, index) => {
    buildRowsDetails(piecesInRow, index);
  });
  
  
  
    // console.log(numberOfPieces_inRows);
  


  /**
   * This section handles the removal of pieces 
   * and the score.
   */
  let jokerBrickMatchedRows = 0,
      inRows = [];

  rowsDetails.forEach((row) => {    

    if(row.hasJokerBrick){
      jokerBrickMatchedRows++;
      inRows.push(row.number);
    }
    else if(row.colorsMatch){
     
      // Remove block pieces in row
      pieces = pieces.filter((p) => { 
        if(p.type !== "jokerBrick" && p.row === row.number){
          return false;
        }
        else{
          return true;
        }
      });

      // Sum up score
      score += 60;

      // Reset numberOfPieces_inRows array
      numberOfPieces_inRows.forEach((el, i) => {
        numberOfPieces_inRows[i] = 0;
      });

      /**
       * Important: when pieces are removed all other pieces
       * that where above them will move 
       */ 
      for(const p of pieces){
        p.isMoving = true;
      }

    }
  });

  /**
   * If there is a joker brick in two matched
   * colored rows, then remove these rows.
   */
  if(jokerBrickMatchedRows === 2){
    for(const r of inRows){
      pieces = pieces.filter((p) => {
        if(p.type === "jokerBrick"){
          if(p.topRow === r || p.bottomRow === r){
            return false;
          }
        }
        else if(p.row === r){
            return false;
        }
        else{
          return true;
        }
      });
    }

    // Sum up score
    score += 12;

    // Reset numberOfPieces_inRows array
    numberOfPieces_inRows.forEach((el, i) => {
      numberOfPieces_inRows[i] = 0;
    });

    /**
     * Important: when pieces are removed all other pieces
     * that where above them will move 
     */ 
    for(const s of pieces){
        s.isMoving = true;
    }

  }

  // Reset rowsDetails
  rowsDetails = [];

  isGameOver ? null : window.requestAnimationFrame(gameLoop);  
}