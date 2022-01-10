const instructionsBtn = document.getElementById('instructionsBtn'),
      instructions = document.getElementById('instructions');
     /* startBtn = document.getElementById('startBtn');*/

instructionsBtn.addEventListener('click', () => {

  // Show instructions only if the game has not started
  if(startBtn.innerText === 'start game'){

    if(instructions.style.display === 'block'){
      instructions.style.display = 'none';
      instructionsBtn.innerText = 'show instructions'
    }
    else{
      instructions.style.display = 'block';
      instructionsBtn.innerText = 'hide instructions';
    }

  } 
  else{
    alert("You cannot see the instructions during a game. In case you'd like to do so, reload the browser.");
  }


});

/**
 * If the user clicks on start game and the instructions
 * are displayed, hide them.
 *   
 */ 
startBtn.addEventListener('click', () => {
  
  if(instructions.style.display === 'block'){
    instructions.style.display = 'none';
    instructionsBtn.innerText = 'show instructions';
  }
  
});