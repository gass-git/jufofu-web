var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Bomb from './classes/bomb.js';
import Block from './classes/block.js';
import Long from './classes/long.js';
import { handleKeyDown, handleKeyUp, right, left, down, up, spacebar } from './functions/keyHandlers.js';
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);
// HTML elements ---------------------------------------------------
var canvas = document.getElementById("canvas");
var scoreDiv = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var ctx = canvas.getContext("2d");
var progressBar = document.getElementById("progress-bar");
var bombsInventory = document.getElementById("bombs-inventory");
//------------------------------------------------------------------
// Block images ----------------------------------------------------
var greenBlock = new Image();
var blueBlock = new Image();
var pinkBlock = new Image();
var crystalBlock = new Image();
var yellowBlock = new Image();
var redBlock = new Image();
var whiteBlock = new Image();
var orangeBlock = new Image();
crystalBlock.src = "inGame_images/crystalBlock.png";
blueBlock.src = "inGame_images/blueBlock.png";
greenBlock.src = "inGame_images/greenBlock.png";
yellowBlock.src = "inGame_images/yellowBlock.png";
redBlock.src = "inGame_images/redBlock.png";
pinkBlock.src = "inGame_images/pinkBlock.png";
whiteBlock.src = "inGame_images/whiteBlock.png";
orangeBlock.src = "inGame_images/orangeBlock.png";
// -----------------------------------------------------------------
// Particle image -------------------------------------------------
var particle = new Image();
particle.src = 'inGame_images/particle.png';
// Save coordinates of blocks removed
var savedPositions = [];
var blockImages = {
    green: greenBlock,
    blue: blueBlock,
    crystal: crystalBlock,
    pink: pinkBlock,
    yellow: yellowBlock,
    red: redBlock,
    white: whiteBlock,
    orange: orangeBlock
};
var colorsInPlay = [
    "yellow",
    "blue",
    "crystal"
];
// matrix[rowIndex][columnIndex]
var matrix = [
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}]
];
var maxRow_index = matrix.length - 1;
var maxColumn_index = matrix[0].length - 1;
/**
 * Movement variables
 *
 * `speed` is the rate of frames at which the blocks
 * drop.
 *
 * The smaller the `boost` number, the fastest
 * the piece will drop.
 *
 */
var speed = 40;
var boost = 5;
// Other global variables   
var score = 0;
var scoreMultiplayer = 1;
var totalFrameCount = 0;
var frameCount = 0;
var isGameOver = false;
var timeOut = false;
var longInPlay = false;
// Variable for progress bar functionality
var fill = 0;
// Bomb inventory
var bombsAvailable = 0;
var throwBomb = false;
// Pieces arrays
var pieces = [];
export function setPieces(newArray) {
    pieces = newArray;
}
function init() {
    window.requestAnimationFrame(gameLoop);
}
function gameLoop() {
    /**
     * - Add speed and increase score reward as game evolves and
     *
     * - Add new colors to the game after a certain
     * number of frames.
     */
    switch (totalFrameCount) {
        case 1000:
            colorsInPlay.push("pink");
            break;
        case 2000:
            speed = 35;
            scoreMultiplayer = 2;
            colorsInPlay.push("white");
            break;
        case 4000:
            speed = 30;
            scoreMultiplayer = 3;
            break;
        case 7000:
            speed = 25;
            scoreMultiplayer = 4;
            colorsInPlay.push("orange");
            break;
        case 10000:
            speed = 20;
            scoreMultiplayer = 5;
            break;
        default:
            break;
    }
    // Clean the canvas and count the frames
    // @ts-ignore: Unreachable code error
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    totalFrameCount++;
    frameCount++;
    // Update score
    scoreDiv.innerText = score.toString();
    // Create the first piece
    if (pieces.length === 0) {
        pieces = __spreadArray(__spreadArray([], pieces, true), [createPiece()], false);
    }
    var AP; // Active piece
    // Draw all the pieces and initialize the active piece
    pieces.forEach(function (p) {
        drawPiece(p.image, p.x, p.y);
        p.isActive ? AP = p : null;
    });
    /**
     * @abstract Throw bomb on next turn ?
     *
     */
    if (spacebar && !throwBomb && bombsAvailable > 0) {
        throwBomb = true;
        bombsInventory.removeChild(bombsInventory.childNodes[bombsAvailable - 1]);
    }
    /**
     * Rotation
     */
    if (up && AP.type === "long" && !timeOut) {
        Long.rotate(AP, matrix, maxColumn_index);
        timeOut = true;
        setTimeout(function () { timeOut = false; }, 120);
    }
    /**
     * VERTICAL MOVEMENT
     */
    var n;
    // Show available bombs 
    var node = document.createElement("span");
    var imageElement = document.createElement("img");
    imageElement.src = "inGame_images/blackCircle.png";
    node.appendChild(imageElement);
    if (down) {
        n = boost;
        // Bombs inventory
        if (fill < 100) {
            fill += 0.2;
        }
        else {
            fill = 0;
            // Maximum capacity of bombs in inventory
            bombsAvailable < 6 ? bombsAvailable++ : null;
            // Append new bomb to inventory DIV
            bombsInventory.appendChild(node);
        }
    }
    else {
        n = speed;
    }
    // Update progress bar
    progressBar.style.width = fill + '%';
    if (frameCount > n) {
        var lowestAvailableRow = GET_lowestAvailableRow(AP);
        // Can the active piece move to the next row?    
        if (AP.type === "block" || AP.type === "bomb") {
            if (AP.usingRows[0] < lowestAvailableRow) {
                if (AP.type !== "bomb" && AP.usingRows[0] + 1 < lowestAvailableRow) {
                    // Update row of piece
                    AP.usingRows[0] += 1;
                    // Update coordinate y
                    AP.y += 40;
                }
                else {
                    // Update row of bomb
                    AP.usingRows[0] += 1;
                    // Update coordinate y
                    AP.y += 40;
                }
            }
            else {
                if (AP.type === "bomb") {
                    // Destroy sorrounding color pieces
                    Bomb.explode(AP, savedPositions, pieces);
                    // Destroy bomb
                    pieces = pieces.filter(function (p) { return p.type !== "bomb"; });
                }
                else {
                    // Deactivate piece
                    AP.isActive = false;
                }
                // Create a new piece
                pieces.push(createPiece());
            }
        }
        if (AP.type === "long") {
            if (AP.isVertical) {
                if (AP['usingRows'][2] + 1 < lowestAvailableRow) {
                    // Update rows of piece
                    AP['usingRows'][0] += 1;
                    AP['usingRows'][1] += 1;
                    AP['usingRows'][2] += 1;
                    // Update coordinate y
                    AP.y += 40;
                }
                else {
                    // Deactivate piece and create a new one
                    AP.isActive = false;
                    pieces.push(createPiece());
                }
            }
            else {
                if (AP['usingRows'][0] + 1 < lowestAvailableRow) {
                    // Update rows of piece
                    AP['usingRows'][0] += 1;
                    // Update coordinate y
                    AP.y += 40;
                }
                else {
                    // Deactivate piece and create a new one
                    AP.isActive = false;
                    pieces.push(createPiece());
                }
            }
        }
        // Reset frame count
        frameCount = 0;
    }
    /**
     * HORIZONTAL MOVEMENT
     */
    if (left && !timeOut) {
        var left_fragment = void 0;
        if (AP.type === "long") {
            if (AP.isVertical) {
                left_fragment = matrix[AP.usingRows[2]][AP.usingColumns[0] - 1];
                // Can it move to the left?
                if (AP.usingColumns[0] > 0 && !left_fragment.isOccupied) {
                    AP.usingColumns[0] -= 1;
                    AP.x -= 40;
                }
            }
            else {
                left_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] - 1];
                // Can it move to the left?
                if (AP['usingColumns'][0] > 0 && !left_fragment.isOccupied) {
                    AP.usingColumns[0] -= 1;
                    AP.usingColumns[1] -= 1;
                    AP.usingColumns[2] -= 1;
                    AP.x -= 40;
                }
            }
        }
        if (AP.type !== "long") {
            left_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] - 1];
            if (AP.usingColumns[0] > 0 && !left_fragment.isOccupied) {
                switch (AP.type) {
                    case "block":
                        AP.usingColumns[0] -= 1;
                        AP.x -= 40;
                        break;
                    case "bomb":
                        AP.usingColumns[0] -= 1;
                        AP.x -= 40;
                        break;
                }
            }
        }
        timeOut = true;
        setTimeout(function () { timeOut = false; }, 120);
    }
    if (right && !timeOut) {
        var right_fragment = void 0;
        if (AP.type === "long") {
            if (AP.isVertical) {
                right_fragment = matrix[AP.usingRows[2]][AP.usingColumns[0] + 1];
                // Can it move to the right?
                if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {
                    AP.usingColumns[0] += 1;
                    AP.x += 40;
                }
            }
            else {
                right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[2] + 1];
                // Can it move to the right?
                if (AP.usingColumns[2] < maxColumn_index && !right_fragment.isOccupied) {
                    AP.usingColumns[0] += 1;
                    AP.usingColumns[1] += 1;
                    AP.usingColumns[2] += 1;
                    AP.x += 40;
                }
            }
        }
        if (AP.type !== "long") {
            switch (AP.type) {
                case "block":
                    right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] + 1];
                    if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {
                        AP.usingColumns[0] += 1;
                        AP.x += 40;
                    }
                    break;
                case "bomb":
                    right_fragment = matrix[AP.usingRows[0]][AP.usingColumns[0] + 1];
                    if (AP.usingColumns[0] < maxColumn_index && !right_fragment.isOccupied) {
                        AP.usingColumns[0] += 1;
                        AP.x += 40;
                    }
                    break;
            }
        }
        timeOut = true;
        setTimeout(function () { timeOut = false; }, 120);
    }
    /**
     * Matching rows
     */
    var savedRows = [];
    matrix.forEach(function (rowFragments, rowIndex) {
        var vertical_long_inRow = false;
        var count = {
            blue: 0,
            orange: 0,
            yellow: 0,
            pink: 0,
            crystal: 0,
            white: 0
        };
        rowFragments.forEach(function (fragment) {
            if (fragment.isOccupied && fragment.pieceIsParked) {
                fragment.piecePosition === "vertical" ? vertical_long_inRow = true : null;
                fragment.color === "crystal" && fragment.piecePosition !== "vertical" ? count.crystal++ : null;
                fragment.color === "yellow" && fragment.piecePosition !== "vertical" ? count.yellow++ : null;
                fragment.color === "blue" && fragment.piecePosition !== "vertical" ? count.blue++ : null;
                fragment.color === "orange" && fragment.piecePosition !== "vertical" ? count.orange++ : null;
                fragment.color === "pink" && fragment.piecePosition !== "vertical" ? count.pink++ : null;
                fragment.color === "white" && fragment.piecePosition !== "vertical" ? count.white++ : null;
            }
        });
        // Conditions
        var c = [
            count.crystal + count.blue === maxColumn_index + 1,
            count.crystal + count.orange === maxColumn_index + 1,
            count.crystal + count.yellow === maxColumn_index + 1,
            count.crystal + count.pink === maxColumn_index + 1,
            count.crystal + count.white === maxColumn_index + 1,
            count.crystal + count.orange === maxColumn_index,
            count.crystal + count.blue === maxColumn_index,
            count.crystal + count.yellow === maxColumn_index,
            count.crystal + count.pink === maxColumn_index,
            count.crystal + count.white === maxColumn_index
        ];
        if (c[0] || c[1] || c[2] || c[3] || c[4]) {
            pieces = pieces.filter(function (p) {
                if (p.usingRows[0] === rowIndex) {
                    return false; // Remove
                }
                else {
                    return true; // Dont remove
                }
            });
            score += 60 * scoreMultiplayer;
        }
        // Register the row if there is a long in a matching row
        if (c[5] || c[6] || c[7] || c[8] || c[9]) {
            vertical_long_inRow ? savedRows.push(rowIndex) : null;
        }
        /**
         * If there are two rows matching colors with a long piece in it, go
         * ahead and remove the pieces.
         */
        if (savedRows.length === 3) {
            score += 70 * scoreMultiplayer;
            var _loop_2 = function (row) {
                pieces = pieces.filter(function (p) {
                    if (p.usingRows[0] === row) {
                        return false; // Remove
                    }
                    else {
                        return true; // Dont remove
                    }
                });
            };
            for (var _i = 0, savedRows_1 = savedRows; _i < savedRows_1.length; _i++) {
                var row = savedRows_1[_i];
                _loop_2(row);
            }
        }
    });
    /**
     * Start with a clean matrix and then fill it
     * with the position of each piece.
     */
    matrix = [
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}]
    ];
    var _loop_1 = function (row) {
        matrix[row].forEach(function (column, i) {
            matrix[row][i] = {
                color: null,
                type: null,
                isOccupied: false,
                pieceIsParked: false,
                piecePosition: null
            };
        });
    };
    // Populate matrix with empty objects
    for (var row = 0; row < matrix.length; row++) {
        _loop_1(row);
    }
    // Populate with the position of each piece
    pieces.forEach(function (p) {
        p.usingColumns.forEach(function (column) {
            p.usingRows.forEach(function (row) {
                var fragment = matrix[row][column];
                fragment.type = p.type;
                fragment.color = p.color;
                fragment.isOccupied = true;
                if (!p.isActive) {
                    fragment.pieceIsParked = true;
                }
                if (p.type === "long") {
                    p.isVertical ? fragment.piecePosition = "vertical" : null;
                }
            });
        });
    });
    /**
     * If pieces have been filtered out, re-arrange pieces position
     * above the lines been removed.
     *
     */
    pieces.forEach(function (p) {
        var lowestAvailableRow = GET_lowestAvailableRow(p);
        switch (p.type) {
            case "block":
                if (!p.isActive) {
                    if (p.usingRows[0] < lowestAvailableRow) {
                        p.isRearranging = true;
                        p.prevRowPos = p.usingRows[0];
                        p.usingRows[0] = lowestAvailableRow;
                    }
                    if (p.isRearranging) {
                        var delta = p.usingRows[0] - p.prevRowPos, y_distance = 40 * delta;
                        // Smooth falling effect: it takes 5 frames to fall into lowest available row
                        if (p.usingRows[0] * 40 - p.y > 0) {
                            p.y += y_distance / 10;
                        }
                        else {
                            p.isRearranging = false;
                        }
                    }
                }
                break;
            case "long":
                if (!p.isActive && p.isVertical) {
                    if (p.usingRows[2] < lowestAvailableRow) {
                        p.isRearranging = true;
                        p.prevBottomRowPos = p.usingRows[2];
                        p.usingRows[0] = lowestAvailableRow - 2;
                        p.usingRows[1] = lowestAvailableRow - 1;
                        p.usingRows[2] = lowestAvailableRow;
                    }
                    if (p.isRearranging) {
                        var delta = p.usingRows[2] - p.prevBottomRowPos, y_distance = 40 * delta;
                        // Smooth falling effect: it takes 5 frames to fall into lowest available row
                        if (p.usingRows[2] * 40 - (p.y + 80) > 0) {
                            p.y += y_distance / 10;
                        }
                        else {
                            p.isRearranging = false;
                        }
                    }
                }
                if (!p.isActive && !p.isVertical) {
                    if (p.usingRows[0] < lowestAvailableRow) {
                        p.isRearranging = true;
                        p.prevBottomRowPos = p.usingRows[0];
                        p.usingRows[0] = lowestAvailableRow;
                    }
                    if (p.isRearranging) {
                        var delta = p.usingRows[0] - p.prevBottomRowPos, y_distance = 40 * delta;
                        // Smooth falling effect: it takes 5 frames to fall into lowest available row
                        if (p.usingRows[0] * 40 - p.y > 0) {
                            p.y += y_distance / 10;
                        }
                        else {
                            p.isRearranging = false;
                        }
                    }
                }
                break;
        }
    });
    // If there is a parked piece in row index "0" is game over
    var fragment;
    for (var _i = 0, _a = matrix[0]; _i < _a.length; _i++) {
        fragment = _a[_i];
        if (fragment.isOccupied && fragment.pieceIsParked) {
            isGameOver = true;
            alert('Game over\nScore: ' + score);
            break;
        }
    }
    // Animation effects: sparkles on bomb explosion
    if (savedPositions.length > 0) {
        savedPositions.forEach(function (pos, i) {
            drawPiece(particle, pos.x, pos.y);
            savedPositions[i].frameCount -= 1;
        });
    }
    savedPositions = savedPositions.filter(function (pos) { return pos.frameCount > 0; });
    isGameOver ? location.reload() : window.requestAnimationFrame(gameLoop);
}
function GET_lowestAvailableRow(piece) {
    var resultRow;
    var numbers = [];
    // Loop through all the columns that the piece is using
    piece['usingColumns'].forEach(function (column) {
        /**
         * The initial row of the loop will be the lower
         * row been used by the piece + 1
         *
         * In the case of the "long" piece the lower row
         * is piece['usingRows'][1]
         *
         * The initial row will switch depending of the piece
         * type.
         */
        var initialRow;
        switch (piece.type) {
            case "block":
                initialRow = piece['usingRows'][0] + 1;
                break;
            case "bomb":
                initialRow = piece['usingRows'][0] + 1;
                break;
            case "long":
                if (piece.isVertical) {
                    initialRow = piece['usingRows'][2] + 1;
                }
                else {
                    initialRow = piece['usingRows'][0] + 1;
                }
                break;
        }
        // Loop through all the rows that are below the piece
        for (var row = initialRow; row <= maxRow_index; row++) {
            var fragment = matrix[row][column];
            if (fragment.isOccupied && fragment.pieceIsParked) {
                numbers.push(row); // Push row number if fragment is been occupied by an inactive piece
            }
        }
    });
    /**
     * In case the numbers array is empty, the last
     * available row will equal maxRow_index.
     */
    numbers.length > 0 ? resultRow = Math.min.apply(Math, numbers) - 1 : resultRow = maxRow_index;
    return resultRow;
}
function createPiece() {
    if (throwBomb) {
        throwBomb = false;
        bombsAvailable -= 1;
        return new Bomb();
    }
    else {
        var rand = Math.random();
        /**
         * Only one longInPlay is allowed to be in play,
         * having more would create many issues..
         */
        // Is there a longInPlay?
        for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
            var p = pieces_1[_i];
            if (p.type === "long") {
                longInPlay = true;
                break;
            }
            else {
                longInPlay = false;
            }
        }
        // Get random color from colors in play
        var randomColor = colorsInPlay[Math.floor(Math.random() * (colorsInPlay.length))];
        // IMPORTANT: make sure the function ALWAYS returns a piece
        if (rand < 0.15 && !longInPlay) {
            return new Long();
        }
        else if (rand < 0.25) {
            return new Block('crystal', blockImages);
        }
        else {
            return new Block(randomColor, blockImages);
        }
    }
}
function drawPiece(image, x, y) {
    // @ts-ignore: Unreachable code error
    ctx.drawImage(image, x, y);
}
startBtn.addEventListener('click', function () {
    if (startBtn.innerText === 'Start Game') {
        pieces.length > 0 ? pieces = [] : null;
        startBtn.innerText = 'End Game';
        init();
    }
    else {
        location.reload();
    }
    document.activeElement.blur();
});
