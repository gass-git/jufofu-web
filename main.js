const canvas = document.getElementById("root"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      scoreDiv = document.getElementById("score"),
      ctx = canvas.getContext("2d"),
      colors = ["#FC9918", "#F14A16", "#35589A", "#146356"];

function randomColor(){
  let rand = Math.round(Math.random() * (colors.length - 1));
  return colors[rand];
}

function randomPoints(){
  let rand = Math.random();
  if(rand < 0.1){
    return 100;
    }else if(rand < 0.2){
      return 50;
      }else if(rand < 0.5){
        return 20;
        }else {
          return 1;
        }
}

var score = 0,
    squareWidth = 50,
    numberOfCols = canvas.width/squareWidth,
    y = 0,
    speed = 0.8,
    boost = 5,
    right = false,
    left = false,
    down = false,
    posX = [0, squareWidth, 2*squareWidth],
    timeOut = false,
    squares = [
      {
        points: randomPoints(),
        color: randomColor(),
        x: posX[1],
        y: 0,
        isMoving: true,
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

function main(){
  scoreDiv.innerHTML = score;
  
  ctx.clearRect(0,0,canvas.width, canvas.height);

  for(const s of squares){
    drawPiece(s.x, s.y, s.color, s.points);

    let col = posX.indexOf(s.x);

    // Falling effect
    let squareBottomPosY = s.y + squareWidth;

    if(squareBottomPosY <= availableHeight(col)){
      if(down && s.isActive && squareBottomPosY + boost < availableHeight(col)){
        s.y += boost + speed;
      }else{
        s.y += speed;
      }
    }else{
      s.isMoving = false;
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

  // Create a new square if the last square in the array is not active
  if(squares[squares.length - 1].isActive === false){
    squares.push({
      "points": randomPoints(),
      "color": randomColor(), 
      "x": posX[1], 
      "y": 0, 
      "isMoving":true,
      "isActive":true, 
      "show": true
    });
  }

  /* If three squares have the same Y position and are not moving make them 
     disappear and add points to score  */
   
  let count = 0;
  for(let a = 0; a < squares.length; a++){
      for(let b = a+1; b < squares.length; b++){
        // Compare only if neither piece is moving
        if(squares[a].isActive === false && squares[b].isActive === false){
          console.log('squares a ' + Math.floor(squares[a].y))
          console.log('squares b ' + Math.floor(squares[b].y))
          if(Math.floor(squares[a].y) === Math.floor(squares[b].y)){
            count++;
          }
        }
    }
    // For the case of three columns we only need a count of 2 (e.g: a = b and a = c)
    if(count === numberOfCols - 1){
      
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
  // Sum up the pixels been occupied in a column
  for(const s of squares){
    if(s.x === posX[col] && s.isMoving === false && s.isActive === false) occupied += squareWidth; 
  }
  return (canvas.height - occupied);
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

function drawPiece(posX, posY, color, points){
  ctx.beginPath();
  ctx.rect(posX, posY, squareWidth, squareWidth);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font= "30px Comic Sans MS";
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.fillText(points, posX, posY + squareWidth);
  ctx.closePath();
}

var interval = setInterval(main, 10);

resumeBtn.addEventListener("click", () => interval = setInterval(game, 10))
pauseBtn.addEventListener("click", () => clearInterval(interval) )
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);