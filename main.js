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

// Pieces arrays
var pieces = [],
    numberOfPieces_inRows = [0,0,0,0,0,0,0,0,0,0],
    numberOfColors_init = 2,
    activeBrickColors = ["green", "blue"],
    brickColorsToAdd = ["orange", "pink", "red", "yellow"];

const framesForActivation = 6000; // 100 equals 1 second

function randomActiveColor(){
  let delta = activeBrickColors.length - 1,
      rand = Math.round(Math.random() * delta);
  return activeBrickColors[rand];
}

// Grid
const rows = 10,
      columns = 6;

// Global game constants
const blockWidth = 40,
      blockHeight = 40,
      positions_x_axis = [],
      speed = 1, // IMPORTANT: speed and boost must be multiples of 2
      boost = 6;

// Populate positions_x_axis array      
for(let i = 0; i < columns; i++){
  positions_x_axis.push(blockWidth*i);
}

// Movement variables
var right = false,
    left = false,
    down = false;

// Other global variables   
var score = 0,
    timeOut = false,
    frames = 0, 
    isGameOver = false;

var rowsDetails = [];

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
  createNewPiece(10);

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

class block {
  constructor(color){
    this.type = "block",
    this.color = color,
    this.image = getImage(color),
    this.width = blockWidth,
    this.height = blockHeight,
    this.x = positions_x_axis[3],
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.column = 4,
    this.row = 10,
    this.counted = false
  }
}
class joker {
  constructor(x, y, state){
    this.type = "joker",
    this.color = "grey",
    this.image = greyBlock,
    this.width = blockWidth,
    this.height = blockHeight,
    this.x = x,
    this.y = y,
    this.isMoving = true, 
    this.isActive = state,
    this.column = 4,
    this.row = 10,
    this.counted = false
  }
}
class jokerBrick {
  constructor(){
    this.type = "jokerBrick",
    this.color = "grey",
    this.image = greyBrick,
    this.width = blockWidth,
    this.height = blockHeight * 2,
    this.x = positions_x_axis[3],
    this.y = 0,
    this.isMoving = true, 
    this.isActive = true,
    this.column = 4,
    this.topRow = 10,
    this.bottomRow = 9,
    this.countedTopRow = false,
    this.countedBottomRow = false
  }
}
class bomb {
  constructor(){
    this.type = "bomb",
    this.color = "black",
    this.image = bombImage,
    this.width = blockWidth,
    this.height = blockHeight,
    this.x = positions_x_axis[3],
    this.y = 0,
    this.isMoving = true,
    this.isActive = true,
    this.column = 4,
    this.row = 10
  }
}
function fixVerticalPosition(piece){
  const positionsY = [1, 41, 81, 121, 161, 201, 241, 281, 321, 361];

    if(piece.isMoving === false){
      for(const y of positionsY){
        if(piece.y > y && piece.y < y + 10){ piece.y = y }
      }
    }
}

function bombExplosion(bomb){
  
  let piecesDestroyed = 0;

  let brickAboveBomb = false, 
      brickUnderBomb = false, 
      brickToLeftOfBomb = false,
      brickToRightOfBomb = false;
  
  /**
   * Remove pieces sorrounding the bomb at moment of impact.
   *  
   */ 

  // Conditions for blocks and for some joker bricks cases
  pieces = pieces.filter((p) => { 
    let c = [
      p.x === bomb.x - blockWidth && p.y === bomb.y,                  // Check left (for block or first half of joker brick)
      p.x === bomb.x + blockWidth && p.y === bomb.y,                  // Check right (for block or first hald of joker brick)
      p.x === bomb.x && p.y === bomb.y + blockWidth,                  // Check below (for block and joker brick)
      p.x === bomb.x && p.y === bomb.y - blockWidth,                  // Check above (for block)
      p.x === bomb.x - blockWidth && p.y === bomb.y - blockWidth,     // Check the diagonal left-top (for block)
      p.x === bomb.x - blockWidth && p.y === bomb.y + blockWidth,     // Check the diagonal left-bottom (for block and joker brick)
      p.x === bomb.x + blockWidth && p.y === bomb.y - blockWidth,     // Check the diagonal right-top (for block) 
      p.x === bomb.x + blockWidth && p.y === bomb.y + blockWidth,     // Check the diagonal right-bottom (for block and joker brick)
    ];

    // Conditions only for joker bricks
    let c2 = [
      p.x === bomb.x - blockWidth && p.y === bomb.y + blockHeight,    // Check left (for second half of joker brick)
      p.x === bomb.x + blockWidth && p.y === bomb.y + blockHeight,    // Check right (for second half of joker brick)
      p.x === bomb.x && p.y === bomb.y - 2 * blockWidth,              // Check above (for joker block)
      p.x === bomb.x - blockWidth && p.y === bomb.y - 2 * blockWidth,  // Check the diagonal left-top (for joker brick)
      p.x === bomb.x + blockWidth && p.y === bomb.y - 2 * blockWidth  // Check the diagonal right-top (for joker brick)
    ]

    if(c[0] || c[1] ||  c[2] ||  c[3] ||  c[4] ||  c[5] ||  c[6] || c[7]){
 
      if(p.type === "jokerBrick"){

        // Is there a brick below?
        if(p.y > bomb.y){
          brickUnderBomb = true;
          //console.log('There is a brick below the bomb')
        }

        // Is there a brick to the left?
        if(p.x < bomb.x){
          brickToLeftOfBomb = true;
          //console.log('There is a brick to the left of the bomb');
        }

        // Is there a brick to the right?
        if(p.x > bomb.x){
          brickToRightOfBomb = true;
          // console.log('There is a brick to the right of the bomb');
        }
      }
      
      piecesDestroyed++; // Count to sum up the score
      return false; // Remove piece
    }

    if(c2[0] || c2[1] || c2[2] || c2[3] || c2[4]){

      // Is there a brick above?
      if(p.y < bomb.y){
        brickAboveBomb = true;
        // console.log('There is a brick above the bomb')
      }

      // Is there a brick to the left?
      if(p.x < bomb.x){
        brickToLeftOfBomb = true;
        // console.log('There is a brick to the left of the bomb');
      }

      // Is there a brick to the right?
      if(p.x > bomb.x){
        brickToRightOfBomb = true;
        // console.log('There is a brick to the right of the bomb');
      }

      piecesDestroyed++; // Count to sum up the score
      return false; // Remove piece
    }

    else{
      return true;
    }
  });

  console.log(piecesDestroyed)

  /**
   * Update score
   */
  score += piecesDestroyed;

  /**
   * Transform the brick to a block joker
   */
  if(brickAboveBomb){
    
    if(brickToLeftOfBomb){
      let isActive = false,
          x = bomb.x - blockWidth,
          y = bomb.y - blockHeight * 2;
          
      pieces.push(
        new joker(x, y, isActive)
      );
    }
    else if(brickToRightOfBomb){
      let isActive = false,
          x = bomb.x + blockWidth,
          y = bomb.y - blockHeight * 2;
          
      pieces.push(
        new joker(x, y, isActive)
      );
    } 
    else{
      let isActive = false,
          x = bomb.x,
          y = bomb.y - blockHeight * 2;
          
      pieces.push(
        new joker(x, y, isActive)
      );  
    }    

  } 

  if(brickUnderBomb){

    if(brickToLeftOfBomb){
      let isActive = false,
          x = bomb.x - blockWidth,
          y = bomb.y + 2 * blockHeight;
          
      pieces.push(
        new joker(x, y, isActive)
      );
    } 
    else if(brickToRightOfBomb){
      let isActive = false,
          x = bomb.x + blockWidth,
          y = bomb.y + 2 * blockHeight;
          
      pieces.push(
        new joker(x, y, isActive)
      );
    } 
    else{ 
      let isActive = false,
          x = bomb.x,
          y = bomb.y + 2 * blockHeight;
          
      pieces.push(
        new joker(x, y, isActive)
      );
    }

    /**
     * Important: when this joker piece is created, it
     * does not move, by consequence the row is not updated,
     * so it's necessary to do it once the piece comes alive.
     */
    let lastPiece = pieces[pieces.length - 1];
    lastPiece.row = getRow(lastPiece.y);  

  } 

  

  // Remove the bomb
  pieces = pieces.filter((p) => { 
    if(p.type === bomb.type){
      return false;
    }else{
      return true;
    }
  });

  // Reset the number of pieces in rows array
  numberOfPieces_inRows = [0,0,0,0,0,0,0,0,0,0];

}
function handlePiecesInRowCount(piece){
  /**
   * If pieces move, update counted boolean property
   * to false.
   * 
   */
    if(piece.type !== "jokerBrick"){
      if(piece.isMoving){
        piece.counted = false;
      }
    }
    else{
      if(piece.isMoving){
        piece.countedTopRow = false;
        piece.countedBottomRow = false;
      }
    }

  for(let row = 0; row < rows; row++){
    if(piece.type !== "jokerBrick" && piece.isMoving === false && piece.counted === false){
      if(piece.row === row){
        numberOfPieces_inRows[row - 1]++;
        piece.counted = true;
      }
    }
    else if(piece.isMoving === false){
      if(piece.topRow === row && piece.countedTopRow === false){
        numberOfPieces_inRows[row - 1]++;
        piece.countedTopRow = true;
      }
      else if(piece.bottomRow == row && piece.countedBottomRow === false){
        numberOfPieces_inRows[row - 1]++;
        piece.countedBottomRow = true;
      }
    }
  }
}
function buildRowsDetails(piecesInRow, index){
  let colorsInRow = [];

  // If the row is full check colors
  if(piecesInRow === columns){      
    let rowNumber = index + 1;
    
    // Check colors for blocks and jokers
    for(const p of pieces){
      if(p.type === "block" || p.type === "joker"){
        if(p.row === rowNumber){
          colorsInRow.push(p.color);
        }
      }
    }

    for(const p of pieces){
      if(p.type === "jokerBrick"){
        if(p.topRow === rowNumber || p.bottomRow === rowNumber){
          colorsInRow.push(p.color);
        }
      }
    }

  }

  if(colorsInRow.length === columns){
    let colorForComparing;
    let colorForComparingFound = false;
    let colorsMatch;

    for(const color of colorsInRow){
      if(color !== "grey"){
        colorForComparing = color;
        colorForComparingFound = true;
      }
    }
    
    for(const color of colorsInRow){
      if(colorForComparing === color || color === "grey"){
        colorsMatch = true;
      }
      else{
        colorsMatch = false;
        break;
      }
    } 

    if(colorsMatch){
      let rowNumber = index + 1,
          hasJokerBrick;

      // Is there a jokerBrick in this row?
      for(const p of pieces){
        if(p.type === "jokerBrick"){
          if(p.bottomRow === rowNumber || p.topRow === rowNumber){
            hasJokerBrick = true;
            break;
          }
          else{
            hasJokerBrick = false;
          }
        }
      }

      rowsDetails.push(
        {
          number: index + 1,
          colorsMatch: colorsMatch,
          hasJokerBrick: hasJokerBrick
        }
      );

    }
  }
}
function handleVerticalMovement(piece){
  let col = positions_x_axis.indexOf(piece.x),
        pieceBottomPosY = piece.y + piece.height;

    if(pieceBottomPosY <= availableHeight(col)){
      if(down && piece.isActive){
        if(pieceBottomPosY + speed * boost < availableHeight(col)){
          piece.y += speed * boost;
        }
        else{
          piece.y += speed;
        }
      }
      else{
        piece.y += speed;
      }

      // Update piece ROW position
      if(piece.type === "jokerBrick"){
        piece.topRow = getRow(piece.y);
        piece.bottomRow = getRow(piece.y + blockHeight);
      }
      else{
        piece.row = getRow(piece.y);
      }
    }
    else{
      piece.isMoving = false;
      piece.isActive = false;
    }

}
function handleHorizontalMovement(piece){
  if(piece.isActive){
    if(left){
      // Does the piece have a column available to the left?
      if(piece.x !== positions_x_axis[0]){
        if(isLeftAvailable(piece) && timeOut === false){
          let i = positions_x_axis.indexOf(piece.x); 
          piece.x = positions_x_axis[i - 1];
          timeOut = true;

          // Update piece COLUMN position
          piece.column = getColumn(piece.x);

          setTimeout(()=>{ timeOut = false }, 120);
        }
      }
    }
    else if(right){
      // Does the piece have a column available to the right?
      if(piece.x !== positions_x_axis[positions_x_axis.length - 1]){
        if(isRightAvailable(piece) && timeOut === false){
          let i = positions_x_axis.indexOf(piece.x);
          piece.x = positions_x_axis[i + 1];

          // Update piece COLUMN position
          piece.column = getColumn(piece.x);

          timeOut = true;
          setTimeout(()=>{ timeOut = false }, 120);
        }
      }  
    }
  }
}
function createNewPiece(N){
  let numberOfPieces = pieces.length,
      lastPiece = pieces[numberOfPieces - 1];

  // Check if it is game over before creating a new piece.
  if(lastPiece.y < blockHeight && lastPiece.isMoving === false){
    console.log(lastPiece.y)
    isGameOver = true;
    showGameOverMsg();
  }

  // If there are more than N pieces in the game, bombs can be created.     
  if(lastPiece.isActive === false && numberOfPieces <= N){
    if(Math.random() > 0.2){
      pieces.push(
        new block(randomActiveColor())
      );
    }
    else{
      pieces.push(
        new joker(positions_x_axis[3], 0, true)
      );
    }
  }
  else if(lastPiece.isActive === false && numberOfPieces > N){
    
    // Is there an active jokerBrick?
    let jokerBrickInPlay = false;
    for(const p of pieces){
      if(p.type === "jokerBrick"){ 
        jokerBrickInPlay = true;
        break;
      }
    }
    
    if(Math.random() <= 0.2){
        pieces.push(
          new bomb()
        );
      } // Only one jokerBrick is allowed to be in play
      else if(Math.random() <= 0.4 && jokerBrickInPlay === false){
        pieces.push(
          new jokerBrick()
        );
      }
      else{
        pieces.push(
          new block(randomActiveColor())
        );
      }
  }
}
function activateNewColor(){
  let toIndex = activeBrickColors.length - numberOfColors_init;
    
    activeBrickColors.push(
      brickColorsToAdd[toIndex]
    );
}
function getImage(color){
  switch(color){
    case "green": return greenBlock;
    case "blue": return blueBlock;
    case "orange": return orangeBlock;
    case "pink": return pinkBlock;
    case "red": return redBlock;
    case "yellow": return yellowBlock;
  }
}
function getColumn(positionX){

  switch(positionX){
    case 0: return 1;
    case 40: return 2;
    case 80: return 3;
    case 120: return 4;
    case 160: return 5;
    case 200: return 6;
  }

}
function getRow(positionY){
    
  if(0 <= positionY && positionY <= 40){
    return 10;
  }else if(positionY <= 80){
    return 9;
  }else if(positionY <= 120){
    return 8;
  }else if(positionY <= 160){
    return 7;
  }else if(positionY <= 200){
    return 6;
  }else if(positionY <= 240){
    return 5;
  }else if(positionY <= 280){
    return 4;
  }else if(positionY <= 320){
    return 3;
  }else if(positionY <= 360){
    return 2;
  }else{
    return 1;
  }
}
function availableHeight(col){
  let occupied = 0;
  // Sum up the pixels been occupied on a column
  pieces.forEach((piece) => {
    if(piece.x === positions_x_axis[col]){
      if(piece.isMoving === false && piece.isActive === false){
        occupied += piece.height;
      }  
    }
  });
  return (canvas.height - occupied);
}
function isRightAvailable(movingPiece){
  let heightOccupied = 0,
      rightCol = positions_x_axis.indexOf(movingPiece.x) + 1;

  /**
   * Check if there are piece to the right side and if so
   * get the height been occupied by them. 
   */
  pieces.forEach((p) => {
    if(p.x === positions_x_axis[rightCol] && p.isActive === false){
      heightOccupied += p.height;
    }
  });

  // Can the active piece move to the right?
  if(movingPiece.y + movingPiece.width < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
}
function isLeftAvailable(movingPiece){
  let heightOccupied = 0,
      leftCol = positions_x_axis.indexOf(movingPiece.x) - 1;

  /**
   * Check if there are piece to the left side and if so
   * get the height been occupied by them.
   */     
  pieces.forEach((p) => {
    if(p.x === positions_x_axis[leftCol] && p.isActive === false){
      heightOccupied += p.height;
    }
  });

  // Can the active piece move to the left?
  if(movingPiece.y + movingPiece.width < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
}
function showGameOverMsg(){
  alert('Game Over');
}
function drawPieces(type, image, posX, posY){
  ctx.drawImage(image, posX, posY);

    if(type === "bomb"){
      ctx.font = "24px Helvetica";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("B", posX + 13, posY + blockWidth - 11);
    }
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

var restart = sessionStorage.getItem("restart");


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
startBtn.addEventListener("click", () => {
  if(startBtn.innerText === "start game"){
    if(pieces.length > 0){
      pieces = [];
    }
    startBtn.innerText = "restart game";
    init();
  }else{
    sessionStorage.setItem("restart", "true");
    location.reload()
  }
});

window.onload = () => {
  if(restart){
    sessionStorage.clear();
    startBtn.innerText = "restart game";
    init();
  }
};

document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);