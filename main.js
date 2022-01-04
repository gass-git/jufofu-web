// Interface constants
const canvas = document.getElementById("root"),
      scoreDiv = document.getElementById("score"),
      startBtn = document.getElementById("start"),
      ctx = canvas.getContext("2d");

// Pieces 
const greenTile = new Image(),
      blueTile = new Image(),
      greyTile = new Image(),
      orangeTile = new Image(),
      pinkTile = new Image(),
      redTile = new Image(),
      yellowTile = new Image(),
      blackCircle = new Image();

greenTile.src = "images/greenTile.png";
blueTile.src = "images/blueTile.png";
greyTile.src = "images/greyTile.png";
orangeTile.src = "images/orangeTile.png";
pinkTile.src = "images/pinkTile.png";
redTile.src = "images/redTile.png";
yellowTile.src = "images/yellowTile.png";
blackCircle.src = "images/blackCircle.png";

const activeTileTypes = [greenTile, blueTile, greyTile],
      tileTypesToActivate = [orangeTile, pinkTile, redTile, yellowTile];

      // Number of frames required to activate a new tile type
      framesForActivation = 6000; // 100 equals 1 second

// General game constants      
const pieceWidth = 40,
      bombRadius = 40,
      numberOfColumns = canvas.width/pieceWidth,
      positions_x_axis = [],
      speed = 1, // IMPORTANT: speed and boost must be multiples of 2
      boost = 6,
      isBoostEnabled = true;

// Populate positions_x_axis array      
for(let i = 0; i < numberOfColumns; i++){
  positions_x_axis.push(pieceWidth*i);
}

// Movement variables
var right = false,
    left = false,
    down = false;

// Other global variables   
var score = 0,
    timeOut = false,
    pieces = [],
    frames = 0, 
    isGameOver = false;

class piece {
  constructor(type, image){
    this.type = type,
    this.tileType = image, 
    this.width = pieceWidth,
    this.x = positions_x_axis[2],
    this.y = 0,
    this.isMoving = true,
    this.isActive = true
  }
}

function init(){
  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(){
  /* Create a new piece at the start of the game or if
   the pieces array is empty */
  if(frames === 0 || pieces.length === 0){
    pieces.push(
      new piece("tile", randomTileType())
    ); 
  }

  // Create a new piece if 

  // When frames reach a certain amount activate a new tile type
  let max = 3 + tileTypesToActivate.length;
  if(frames === framesForActivation && activeTileTypes.length < max){
    activeTileTypes.push(tileTypesToActivate[activeTileTypes.length - 3]);
    
    // Reset frames
    frames = 0; 
  }

  // Count the frames
  frames++;
  
  // Create a new piece if the last one is not active.  
  let numberOfPieces = pieces.length,
      lastPiece = pieces[numberOfPieces - 1];

  // If there are more than 5 pieces in the game, bombs have a chance of 20% to be created.        
  if(lastPiece.isActive === false && numberOfPieces <= 5){
    pieces.push(new piece("tile", randomTileType())); 
  }
  else if(lastPiece.isActive === false && numberOfPieces > 5){
    // Check if it is game over before creating a new piece.
    if(lastPiece.y === 0 && lastPiece.isMoving === false){
      isGameOver = true;
      showGameOverMsg();
    }else{
      Math.random() <= 0.2 ? pieces.push(new piece("bomb", blackCircle)) : pieces.push(new piece("tile", randomTileType()));
    }
  }

  scoreDiv.innerHTML = score;
  ctx.clearRect(0,0,canvas.width, canvas.height);

  pieces.forEach((piece) => {
    
    drawTile(piece.tileType, piece.x, piece.y);
    
    /* -- Vertical movement -- */
    let col = positions_x_axis.indexOf(piece.x),
        pieceBottomPosY = piece.y + piece.width;

    if(pieceBottomPosY <= availableHeight(col)){
      if(down && piece.isActive && pieceBottomPosY + speed*boost < availableHeight(col)){
        piece.y += speed*boost;
      }else{
        piece.y += speed;
      }
    }else{
      piece.isMoving = false;
      piece.isActive = false;
    }

 
    /* -- Horizontal movement -- */
    if(piece.isActive){
      if(left){
        // Does the piece have a column available to the left?
        if(piece.x !== positions_x_axis[0]){
          if(isLeftAvailable(piece) && timeOut === false){
            let i = positions_x_axis.indexOf(piece.x); 
            piece.x = positions_x_axis[i - 1];
            timeOut = true;
            setTimeout(()=>{ timeOut = false },120)
          }
        }
      }
      else if(right){
        // Does the piece have a column available to the right?
        if(piece.x !== positions_x_axis[positions_x_axis.length - 1]){
          if(isRightAvailable(piece) && timeOut === false){
            let i = positions_x_axis.indexOf(piece.x);
            piece.x = positions_x_axis[i + 1];
            timeOut = true;
            setTimeout(()=>{ timeOut = false },120)
          }
        }  
      }
    }
  });

  // Update the last piece variable  
  lastPiece = pieces[pieces.length - 1];

  // Bomb logic
  if(lastPiece.type === "bomb" && lastPiece.isMoving === false){
    let bomb = lastPiece;

    bombExplosion(bomb);

    /* Important: when pieces are removed all other pieces
          that where above them will move */
    for(const s of pieces){
      s.isMoving = true;
    }

  } // If the current piece is not a bomb do the following
  else{ 
    let tilesInRow = [];
    for(let a = 0; a < pieces.length; a++){
      tilesInRow = [];
      for(let b = a+1; b < pieces.length; b++){
        // Compare only if neither of the pieces are moving
        if(pieces[a].isActive === false && pieces[b].isActive === false){
          // Are pieces in the same row?
          if(Math.floor(pieces[a].y) === Math.floor(pieces[b].y)){
            // If the tilesInRow array is empty add pieces[a]
            /* Note: is important to add this piece only once because this
              line repeats itself inside this loop. */
            if(tilesInRow.length < 1){
              tilesInRow.push(pieces[a].tileType);
            }
            tilesInRow.push(pieces[b].tileType);
          }
        }
      }

      let tileTypeCount = 0, removeRow = false, jokersCount = 0;

      // Count jokers in this column
      tilesInRow.forEach((type) => {
        type === greyTile ? jokersCount++ : null
      })

      // Remove row ?
      tilesInRow.forEach((type) => {
        for(const tileType of tilesInRow){
          type === tileType && type !== greyTile ? tileTypeCount++ : null;
        }
        tileTypeCount + jokersCount === numberOfColumns ? removeRow = true : tileTypeCount = 0;
      })
      
      if(removeRow){
        // Remove aligned pieces of the same color
        pieces = pieces.filter(p => Math.floor(p.y) !== Math.floor(pieces[a].y));

        // Add points to total score
        score += numberOfPieces;

        /* Important: when pieces are removed all other pieces
          that where above them will move */
        for(const s of pieces){
          s.isMoving = true;
        }
        break;
      }else{
        count = 0; // reset counter
      }
    }
  }
  
  isGameOver ? null : window.requestAnimationFrame(gameLoop);
      
}

function randomTileType(){
  let rand = Math.round(Math.random() * (activeTileTypes.length - 1));
  return activeTileTypes[rand];
}

function bombExplosion(bomb){
  // Remove tiles sorrounding the bomb at moment of impact
  pieces = pieces.filter((p) => { 
    let c = [
      p.x === bomb.x - pieceWidth && p.y === bomb.y,  // Check left
      p.x === bomb.x + pieceWidth && p.y === bomb.y,  // Check right
      p.x === bomb.x && p.y === bomb.y + pieceWidth,  // Check below
      p.x === bomb.x && p.y === bomb.y - pieceWidth,   // Check above
      p.x === bomb.x - pieceWidth && p.y === bomb.y - pieceWidth, // Check the diagonal left-top
      p.x === bomb.x - pieceWidth && p.y === bomb.y + pieceWidth, // Check the diagonal left-bottom
      p.x === bomb.x + pieceWidth && p.y === bomb.y - pieceWidth, // Check the diagonal right-top 
      p.x === bomb.x + pieceWidth && p.y === bomb.y + pieceWidth, // Check the diagonal right-bottom 
    ];

    if(c[0] || c[1] ||  c[2] ||  c[3] ||  c[4] ||  c[5] ||  c[6] || c[7]){
      return false;
    }else{
      return true;
    }
  });

  // Remove the bomb
  pieces = pieces.filter((p) => { 
    if(p.type === bomb.type){
      return false;
    }else{
      return true;
    }
  });
}

function showGameOverMsg(){
  alert('Game Over');
  interval = clearInterval(interval);
  startBtn.innerText = "start game";
}

// Columns {0,1,2, .... }
function availableHeight(col){
  let occupied = 0;
  // Sum up the pixels been occupied on a column
  pieces.forEach((piece) => {
    if(piece.x === positions_x_axis[col]){
      if(piece.isMoving === false && piece.isActive === false){
        occupied += pieceWidth;
      }  
    }
  });
  return (canvas.height - occupied);
}

function isRightAvailable(movingpiece){
  let heightOccupied = 0,
      rightCol = positions_x_axis.indexOf(movingpiece.x) + 1;

  /* 
    Check if there are piece to the right side and if so
    get the height been occupied by them.
  */  
  pieces.forEach((s) => {
    if(s.x === positions_x_axis[rightCol] && s.isActive === false){
      heightOccupied += s.width;
    }
  });

  // Can the active piece move to the right?
  if(movingpiece.y + movingpiece.width < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
}

function isLeftAvailable(movingpiece){
  let heightOccupied = 0,
      leftCol = positions_x_axis.indexOf(movingpiece.x) - 1;

  /* 
    Check if there are piece to the left side and if so
    get the height been occupied by them.
  */     
  pieces.forEach((s) => {
    if(s.x === positions_x_axis[leftCol] && s.isActive === false){
      heightOccupied += s.width;
    }
  });

  // Can the active piece move to the left?
  if(movingpiece.y + movingpiece.width < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
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


function drawTile(image, posX, posY){
    ctx.drawImage(image, posX, posY);
    if(image === greyTile){    
      ctx.font = "24px Helvetica";
      ctx.fillStyle = "#9A0680";
      ctx.fillText("J", posX + 14, posY + pieceWidth - 11);
    }
    else if(image === blackCircle){    
      ctx.font = "24px Helvetica";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("B", posX + 13, posY + pieceWidth - 11);
    }
  }

startBtn.addEventListener("click", () => {
  if(startBtn.innerText === "start game"){
    if(pieces.length > 0){
      pieces = [];
    }
    interval = init();
    startBtn.innerText = "game started";
  }
});


document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);