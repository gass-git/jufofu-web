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
       isMoving: true,
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
    if(s.y + squareWidth <  availableHeight(col) && s.isMoving){
      s.y += speed;
    }else{
      s.isMoving = false;
    }

    // Sideways movement
    if(left && timeOut === false && s.isMoving && (s.x === posX[1] || s.x === posX[2])){
      
      // Check left
      if(isLeftAvailable(s)){
        let i = posX.indexOf(s.x);
        console.log(posX[i])
        s.x = posX[i - 1];
        timeOut = true;
        setTimeout(()=>{ timeOut = false },120)
      }
    }else if(right && timeOut === false && s.isMoving && (s.x === posX[0] || s.x === posX[1])){
      // Check left
      if(isRightAvailable(s)){
        let i = posX.indexOf(s.x);
        s.x = posX[i + 1];
        timeOut = true;
        setTimeout(()=>{ timeOut = false },120)
        console.log(s)
      }
    }
  }

  if(squares[squares.length - 1].isMoving === false){
    squares.push({"x": posX[1], "y": 0, "isMoving":true, "show": true});
  }

  /* If three squares have the same Y position and are not moving make them 
     disappear and add points to score  */
   
  let count = 0;
  let y_registered = null;
  for(let a = 0; a < squares.length; a++){
      for(let b = a+1; b < squares.length; b++){
        // Compare only if neither piece is moving
        if(squares[a].isMoving === false && squares[b].isMoving === false){
          if(squares[a].y === squares[b].y){
            count++;
          }
        }
    }
    if(count === numberOfCols - 1){
      squares = squares.filter(square => square.y !== squares[a].y);
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
function availableHeight(column){
  let occupied = 0;
  for(const s of squares){
    if(s.x === posX[column] && s.isMoving === false) occupied += squareWidth; 
  }
  return canvas.height - occupied;
}

function isRightAvailable(movingSquare){
  heightOccupied = 0;

  let rightCol = posX.indexOf(movingSquare.x) + 1;

  for(const s of squares){
    if(s.x === posX[rightCol] && s.isMoving === false){
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
    if(s.x === posX[leftCol] && s.isMoving === false){
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