const canvas = document.getElementById("root"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      ctx = canvas.getContext("2d");

var squareWidth = 50,
    numberOfCols = canvas.width/squareWidth,
    y = 0,
    speed = 0.8,
    right = false,
    left = false,
    posX = [0, squareWidth, 2*squareWidth],
    timeOut = false,
    squares = [
      {
       x: posX[1],
       y: 0,
       isActive: true,
       show: true
      }
    ];

function handleKeyDown(e){
  if(e.key === "Right" || e.key === "ArrowRight"){
    right = true;
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = true;
  }
}

function handleKeyUp(e){
  if(e.key === "Right" || e.key === "ArrowRight"){
    right = false;
  }
  if(e.key === "Left" || e.key === "ArrowLeft"){
    left = false;
  }
}

function main(){    
  ctx.clearRect(0,0,canvas.width, canvas.height);

  for(const s of squares){
    drawBreak(s.x, s.y, squareWidth);
    let col = posX.indexOf(s.x);

    // Falling effect
    let squareBottomPosY = s.y + squareWidth;

    if(squareBottomPosY <= availableHeight(col)){
      s.y += speed;
    }else{
      s.isActive = false;
    }

    // Sideways movement
    if(left && s.isActive && (s.x === posX[1] || s.x === posX[2])){
      if(isLeftAvailable(s) && timeOut === false){
        let i = posX.indexOf(s.x);
        s.x = posX[i - 1];
        timeOut = true;
        setTimeout(()=>{ timeOut = false },120)
      }
    }

    if(right && s.isActive && (s.x === posX[0] || s.x === posX[1])){
      if(isRightAvailable(s) && timeOut === false){
        let i = posX.indexOf(s.x);
        s.x = posX[i + 1];
        timeOut = true;
        setTimeout(()=>{ timeOut = false },120)
      }
    }
  }

  if(squares[squares.length - 1].isActive === false){
    squares.push({"x": posX[1], "y": 0, "isActive":true, "show": true});
  }

  /* If three squares have the same Y position and are not moving make them 
     disappear and add points to score  */
   
  let count = 0;
  let y_registered = null;
  for(let a = 0; a < squares.length; a++){
      for(let b = a+1; b < squares.length; b++){
        // Compare only if neither piece is moving
        if(squares[a].isActive === false && squares[b].isActive === false){
          if(squares[a].y === squares[b].y){
            count++;
          }
        }
    }
    if(count === numberOfCols - 1){
      squares = squares.filter(square => square.y !== squares[a].y);
      for(const s of squares){
        s.isActive = true;
      }
      break;
    }else{
      count = 0; // reset counter
    }
  }
    
  }

// Columns {0,1,2, .... }
function availableHeight(column){
  let occupied = 0;
  for(const s of squares){
    if(s.x === posX[column] && s.isActive === false) occupied += squareWidth; 
  }
  return canvas.height - occupied;
}

function isRightAvailable(movingSquare){
  heightOccupied = 0;

  let rightCol = posX.indexOf(movingSquare.x) + 1;

  for(const s of squares){
    if(s.x === posX[rightCol] && s.isActive === false){
      heightOccupied += squareWidth;
    }
  }

  console.log(heightOccupied)

  if(movingSquare.y + squareWidth < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
  
}

function isLeftAvailable(movingSquare){
  heightOccupied = 0;

  // Get left column
  let leftCol = posX.indexOf(movingSquare.x) - 1;

  for(const s of squares){
    if(s.x === posX[leftCol] && s.isActive === false){
      heightOccupied += squareWidth;
    }
  }

  console.log(heightOccupied)

  if(movingSquare.y + squareWidth < canvas.height - heightOccupied){
    return true;
  } else{
    return false;
  }
  
}



function drawBreak(posX, posY, width){
  ctx.beginPath();
  ctx.rect(posX, posY, width, width);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}



var interval = setInterval(main, 10);

resumeBtn.addEventListener("click", () => interval = setInterval(game, 10))
pauseBtn.addEventListener("click", () => clearInterval(interval) )
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);