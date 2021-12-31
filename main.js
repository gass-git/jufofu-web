const canvas = document.getElementById("root"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      scoreDiv = document.getElementById("score"),
      ctx = canvas.getContext("2d"),
      colors = ["#FC9918", "#F14A16", "#35589A"],
      squareWidth = 35,
      cols = canvas.width/squareWidth,
      positions_x_axis = [],
      speed = 0.8,
      boost = 5;

for(let i = 0; i < cols; i++){
  positions_x_axis.push(squareWidth*i);
}

var score = 0,
    right = false,
    left = false,
    down = false,
    timeOut = false,
    squares = [];
      
function randomColor(){
  let rand = Math.round(Math.random() * (colors.length - 1));
  return colors[rand];
}

function randomPoints(){
  let rand = Math.random();
  if(rand < 0.1){
    return 9;
    }else if(rand < 0.2){
      return 5;
      }else if(rand < 0.5){
        return 2;
        }else {
          return 1;
        }
}

class square {
  constructor(){
    this.width = squareWidth,
    this.points = randomPoints(),
    this.color = randomColor(),
    this.x = positions_x_axis[2],
    this.y = 0,
    this.isMoving = true,
    this.isActive = true
  }
}

function main(){
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
      square.color,
      square.points
    );
    
    // Falling effect
    let col = positions_x_axis.indexOf(square.x),
        squareBottomPosY = square.y + square.width;

    if(squareBottomPosY <= availableHeight(col)){
      if(down && square.isActive && squareBottomPosY + boost < availableHeight(col)){
        square.y += boost + speed;
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

  /* IF:
  - three squares have the same Y axis position. 
  - are not moving.
  ----> Make them disappear and add points to score.  
  */
  let count = 0;
  for(let a = 0; a < squares.length; a++){
    
    for(let b = a+1; b < squares.length; b++){
      // Compare only if neither of the pieces are moving
      if(squares[a].isActive === false && squares[b].isActive === false){
        if(Math.floor(squares[a].y) === Math.floor(squares[b].y)){
          count++;
        }
      }
    }
    // For the case of three columns we only need a count of 2 (e.g: a = b and a = c)
    if(count === cols - 1){
      
      // Check if pieces are of the same color
      let colorCount = 0;
      let sameColor = false;
      for(const s of squares){
        if(Math.floor(s.y) === Math.floor(squares[a].y) && s.color === squares[a].color){
          colorCount++;
        }
      }
      if(colorCount === 3){
        sameColor = true;
      }

      // Add points to total score
      for(const s of squares){
        if(Math.floor(s.y) === Math.floor(squares[a].y)){
          if(sameColor){
            score += s.points * 2;
          }else{
            score += s.points;
          }
        }
      }
      
      // Remove aligned squares
      squares = squares.filter(square => Math.floor(square.y) !== Math.floor(squares[a].y));
      
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

function drawPiece(posX, posY, color, points){
  ctx.beginPath();
  ctx.rect(posX, posY, squareWidth, squareWidth);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font= "28px Helvetica";
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.fillText(points, posX+9, posY-7 + squareWidth);
  ctx.closePath();
}


var interval = setInterval(main, 10);

resumeBtn.addEventListener("click", () => interval = setInterval(main, 10))
pauseBtn.addEventListener("click", () => clearInterval(interval) )
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);