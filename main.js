const canvas = document.getElementById("root"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      ctx = canvas.getContext("2d");

var squareWidth = 50,
    y = 0,
    speed = 0.3,
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

// Columns {0,1,2, .... }
function availableHeight(column){
  let occupied = 0;
  for(const s of squares){
    if(s.x === posX[column] && s.isMoving === false) occupied += squareWidth; 
  }
  return canvas.height - occupied;
}

function game(){    
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
      let i = posX.indexOf(s.x);
      console.log(posX[i])
      s.x = posX[i - 1];
      timeOut = true;
      setTimeout(()=>{ timeOut = false },120)
      console.log(s)
    }else if(right && timeOut === false && s.isMoving && (s.x === posX[0] || s.x === posX[1])){
      let i = posX.indexOf(s.x);
      s.x = posX[i + 1];
      timeOut = true;
      setTimeout(()=>{ timeOut = false },120)
      console.log(s)
    }
  }

  if(squares[squares.length - 1].isMoving === false){
    squares.push({"x": posX[1], "y": 0, "isMoving":true, "show": true});
  }
}

function drawBreak(posX, posY, width){
  ctx.beginPath();
  ctx.rect(posX, posY, width, width);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}



var interval = setInterval(game, 10);

resumeBtn.addEventListener("click", () => interval = setInterval(game, 10))
pauseBtn.addEventListener("click", () => clearInterval(interval) )
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);