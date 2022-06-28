var right = false;
var left = false;
var down = false;
var up = false;
var spacebar = false;
function handleKeyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        right = true;
    }
    if (e.key === "Left" || e.key === "ArrowLeft") {
        left = true;
    }
    if (e.key === "Down" || e.key === "ArrowDown") {
        down = true;
    }
    if (e.key === "Up" || e.key === "ArrowUp") {
        up = true;
    }
    if (e.keyCode === 32) {
        spacebar = true;
    }
}
function handleKeyUp(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        right = false;
    }
    if (e.key === "Left" || e.key === "ArrowLeft") {
        left = false;
    }
    if (e.key === "Down" || e.key === "ArrowDown") {
        down = false;
    }
    if (e.key === "Up" || e.key === "ArrowUp") {
        up = false;
    }
    if (e.keyCode === 32) {
        spacebar = false;
    }
}
export { handleKeyDown, handleKeyUp, right, left, down, up, spacebar };
