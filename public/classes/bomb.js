import { setPieces } from "../engine-v4.js";
var bombImage = new Image();
bombImage.src = "inGame_images/blackCircle.png";
var Bomb = /** @class */ (function () {
    function Bomb() {
        this.type = "bomb";
        this.color = null,
            this.image = bombImage,
            this.x = 120,
            this.y = 0,
            this.isActive = true,
            this.usingColumns = [3],
            this.usingRows = [0];
    }
    Bomb.explode = function (p, savedPositions, pieces) {
        var bombColumn = p.usingColumns[0], bombRow = p.usingRows[0];
        // Sorrounding fragments     
        var sorroundingArea = [
            { row: bombRow - 1, column: bombColumn - 1 },
            { row: bombRow - 1, column: bombColumn },
            { row: bombRow - 1, column: bombColumn + 1 },
            { row: bombRow, column: bombColumn - 1 },
            { row: bombRow, column: bombColumn + 1 },
            { row: bombRow + 1, column: bombColumn - 1 },
            { row: bombRow + 1, column: bombColumn },
            { row: bombRow + 1, column: bombColumn + 1 } // bottom-right
        ];
        // Destroy all sorrounding pieces that are not crystal
        pieces = pieces.filter(function (p) {
            var destroyPiece = false;
            if (p.type === "block") {
                var pieceRow = p.usingRows[0], pieceColumn = p.usingColumns[0];
                for (var _i = 0, sorroundingArea_1 = sorroundingArea; _i < sorroundingArea_1.length; _i++) {
                    var area = sorroundingArea_1[_i];
                    if (pieceRow === area.row && pieceColumn === area.column) {
                        if (p.color !== "crystal") {
                            destroyPiece = true;
                            break;
                        }
                    }
                }
            }
            if (destroyPiece === true) {
                // Save positions for particle animations
                savedPositions.push({
                    x: p.x + 9,
                    y: p.y + 10,
                    frameCount: 5
                });
                return false; // Remove the piece
            }
            else {
                return true; // Keep the piece
            }
        });
        setPieces(pieces);
    };
    return Bomb;
}());
export default Bomb;
