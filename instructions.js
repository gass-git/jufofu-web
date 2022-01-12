const instructionsBtn = document.getElementById('instructionsBtn'),
      instructions = document.getElementById('instructions'),
      tooltip = document.getElementById('tooltip');

instructionsBtn.addEventListener('click', () => {

  // Show instructions only if the game has not started
  if(startBtn.innerText === 'start game'){

    if(instructions.style.display === 'block'){
      instructions.style.display = 'none';
      instructionsBtn.innerText = 'show instructions';
    }
    else{
      instructions.style.display = 'block';
      instructionsBtn.innerText = 'hide instructions';
    }

  }  
  else if (tooltip.style.display === "none") {
      tooltip.style.display = "block";

      setTimeout(() => {
        tooltip.style.display = "none";
      },5000)

    }
})

/**
 * If the user clicks on start game and the instructions
 * are displayed, hide them.
 */ 
startBtn.addEventListener('click', () => {
  
  if(instructions.style.display === 'block'){
    instructions.style.display = 'none';
    instructionsBtn.innerText = 'show instructions';
  }
  
})