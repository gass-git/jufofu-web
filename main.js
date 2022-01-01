// Interface constants
const canvas = document.getElementById("root"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      scoreDiv = document.getElementById("score"),
      ctx = canvas.getContext("2d");

// Color constants    
const jokerColor = "#E1E8EB",
      colors = ["#FFC900", "#7900FF", jokerColor],
      colorsToAdd = ["#34BE82", "#FF7F00", "#727200", "#AA6739"],
      framesToAddColor = 6000; // 100 equals 1 second

// General game constants      
const squareWidth = 40,
      numberOfColumns = canvas.width/squareWidth,
      positions_x_axis = [],
      speed = 1.5,
      boost = 7,
      isBoostEnabled = false;

// Populate positions_x_axis array      
for(let i = 0; i < numberOfColumns; i++){
  positions_x_axis.push(squareWidth*i);
}

// Movement variables
var right = false,
    left = false,
    down = false;

// Other global variables   
var score = 0,
    timeOut = false,
    squares = [],
    frames = 0,
    addedColorsCount = 0;
      
function randomColor(){
  let rand = Math.round(Math.random() * (colors.length - 1));
  return colors[rand];
}

class square {
  constructor(){
    this.width = squareWidth,
    this.color = randomColor(),
    this.x = positions_x_axis[2],
    this.y = 0,
    this.isMoving = true,
    this.isActive = true
  }
}

function main(){
  // Count the frames
  frames++;
  // When frames reach a certain amount push a new color to the colors array
  if(frames === framesToAddColor){
    colors.push(colorsToAdd[addedColorsCount]);
    addedColorsCount++;
    frames = 0;
  }

  /* 
  - create a square at the start of the game.
  - create a square if the last one is not active. 
  */
  let arrLength = squares.length,
      lastSquare = squares[arrLength - 1];

  if(arrLength < 1 || lastSquare.isActive === false){
    squares.push(new square()); 
  }

  scoreDiv.innerHTML = score;
  ctx.clearRect(0,0,canvas.width, canvas.height);

  squares.forEach((square) => {
    drawPiece(
      square.x,
      square.y,
      square.color
    );
    
    // Falling effect
    let col = positions_x_axis.indexOf(square.x),
        squareBottomPosY = square.y + square.width;

    if(squareBottomPosY <= availableHeight(col)){
      if(down && square.isActive && squareBottomPosY < availableHeight(col)){
        isBoostEnabled ? square.y += boost + speed : square.y += speed;
      }else{
        square.y += speed;
      }
    }else{
      square.isMoving = false;
      square.isActive = false;
    }

    /* 
      HORIZONTAL MOVEMENT
    */
    if(left && square.isActive){
       // Does the square have a column available to the left?
      if(square.x !== positions_x_axis[0]){
        if(isLeftAvailable(square) && timeOut === false){
          let i = positions_x_axis.indexOf(square.x); 
          square.x = positions_x_axis[i - 1];
          timeOut = true;
          setTimeout(()=>{ timeOut = false },120)
        }
      }
    }

    if(right && square.isActive){
      // Does the square have a column available to the right?
      if(square.x !== positions_x_axis[positions_x_axis.length - 1]){
        if(isRightAvailable(square) && timeOut === false){
          let i = positions_x_axis.indexOf(square.x);
          square.x = positions_x_axis[i + 1];
          timeOut = true;
          setTimeout(()=>{ timeOut = false },120)
        }
      }  
    }
  });

  let count = 0;
  let colorsInRow = [];
  for(let a = 0; a < squares.length; a++){
    colorsInRow = [];
    for(let b = a+1; b < squares.length; b++){
      // Compare only if neither of the pieces are moving
      if(squares[a].isActive === false && squares[b].isActive === false){
        // Are squares in the same row?
        if(Math.floor(squares[a].y) === Math.floor(squares[b].y)){
          // If the colorsInRow array is empty add squares[a]
          // Note: is important to add this square only once because it repeats inside this loop
          if(colorsInRow.length < 1){
            colorsInRow.push(squares[a].color);
          }
          colorsInRow.push(squares[b].color);
          count++;
        }
      }
    }

    let colorCount = 0, removeRow = false, jokersCount = 0;

    // Count jokers in this column
    colorsInRow.forEach((color) => {
      color === jokerColor ? jokersCount++ : null
    });

    // Remove row ?
    colors.forEach((color) => {
      for(const squareColor of colorsInRow){
        color === squareColor && color !== jokerColor ? colorCount++ : null;
      }
      colorCount + jokersCount === numberOfColumns ? removeRow = true : colorCount = 0;
    });
    
    if(removeRow){
      // Remove aligned squares of the same color
      squares = squares.filter(square => Math.floor(square.y) !== Math.floor(squares[a].y));

      // Add points to total score
      score += numberOfColumns;
      
      /* Important: when pieces are removed all other pieces
         that where above them will move */
      for(const s of squares){
        s.isMoving = true;
      }
      break;
    }else{
      count = 0; // reset counter
    }
  }
}

// Columns {0,1,2, .... }
function availableHeight(col){
  let occupied = 0;
  // Sum up the pixels been occupied on a column
  squares.forEach((square) => {
    if(square.x === positions_x_axis[col]){
      if(square.isMoving === false && square.isActive === false){
        occupied += squareWidth;
      }  
    }
  });
  return (canvas.height - occupied);
}

function isRightAvailable(movingSquare){
  let heightOccupied = 0,
      rightCol = positions_x_axis.indexOf(movingSquare.x) + 1;

  /* 
    Check if there are square to the right side and if so
    get the height been occupied by them.
  */  
  squares.forEach((s) => {
    if(s.x === positions_x_axis[rightCol] && s.isActive === false){
      heightOccupied += s.width;
    }
  });

  // Can the active square move to the right?
  if(movingSquare.y + movingSquare.width < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
}

function isLeftAvailable(movingSquare){
  let heightOccupied = 0,
      leftCol = positions_x_axis.indexOf(movingSquare.x) - 1;

  /* 
    Check if there are square to the left side and if so
    get the height been occupied by them.
  */     
  squares.forEach((s) => {
    if(s.x === positions_x_axis[leftCol] && s.isActive === false){
      heightOccupied += s.width;
    }
  });

  // Can the active square move to the left?
  if(movingSquare.y + movingSquare.width < canvas.height - heightOccupied){
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

function drawPiece(posX, posY, color){
  ctx.beginPath();
  ctx.rect(posX, posY, squareWidth, squareWidth);
  ctx.fillStyle = color;
  ctx.fill();
  
  if(color === jokerColor){
    ctx.font= "30px Helvetica";
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.fillText("J", posX + 12, posY + squareWidth - 8);
  }
  
  ctx.closePath();
}

var interval = setInterval(main, 10);

resumeBtn.addEventListener("click", () => interval = setInterval(main, 10))
pauseBtn.addEventListener("click", () => clearInterval(interval) )
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);