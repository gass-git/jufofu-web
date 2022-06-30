var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { setPieces } from "../../engine.js";
import Piece from '../piece.js';
var bombImage = new Image();
bombImage.src = "inGame_images/blackCircle.png";
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        return _super.call(this, 'bomb', null, bombImage, [3], [0]) || this;
    }
    Bomb.explode = function (p, savedPositions, pieces) {
        var bombColumn = p.usingColumns[0];
        var bombRow = p.usingRows[0];
        // sorrounding fragments     
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
        // destroy all sorrounding pieces that are not crystal
        pieces = pieces.filter(function (p) {
            var destroyPiece = false;
            if (p.type === "block") {
                var pieceRow = p.usingRows[0];
                var pieceColumn = p.usingColumns[0];
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
}(Piece));
export default Bomb;
