import { startBtn } from "./utilities/elements.js";
var instructionsBtn = document.getElementById('instructionsBtn');
var instructions = document.getElementById('instructions');
var tooltip = document.getElementById('tooltip');
instructionsBtn.addEventListener('click', function () {
    // Show instructions only if the game has not started
    if (startBtn.innerText === 'Start Game') {
        if (instructions.style.display === 'block') {
            instructions.style.display = 'none';
            instructionsBtn.innerText = 'How to Play?';
        }
        else {
            instructions.style.display = 'block';
            instructionsBtn.innerText = 'Hide Instructions';
        }
    }
    else if (tooltip.style.display === "none") {
        tooltip.style.display = "block";
        setTimeout(function () {
            tooltip.style.display = "none";
        }, 5000);
    }
    // @ts-ignore: Unreachable code error
    document.activeElement.blur();
});
// If the user clicks on start game and the instructions are displayed, hide them.
startBtn.addEventListener('click', function () {
    if (instructions.style.display === 'block') {
        instructions.style.display = 'none';
        instructionsBtn.innerText = 'How to Play?';
    }
});
