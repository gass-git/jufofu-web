import { init } from '../main.js';
import { pieces, setPieces } from '../engine.js';
import { startBtn } from '../utilities/elements.js';
export default function handleStartBtn() {
    if (startBtn.innerText === 'Start Game') {
        pieces.length > 0 ? setPieces([]) : null;
        startBtn.innerText = 'End Game';
        init();
    }
    else {
        location.reload();
    }
    document.activeElement.blur();
}
