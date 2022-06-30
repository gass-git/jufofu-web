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
import Piece from '../piece.js';
var tallCrystal = new Image();
var flatCrystal = new Image();
tallCrystal.src = "inGame_images/tallCrystal.png";
flatCrystal.src = "inGame_images/flatCrystal.png";
var Long = /** @class */ (function (_super) {
    __extends(Long, _super);
    function Long() {
        var _this = _super.call(this, 'long', 'crystal', tallCrystal, [3], [0, 1, 2]) || this;
        _this.isVertical = true;
        _this.isRearranging = false;
        _this.prevBottomRowPos = null;
        return _this;
    }
    Long.rotate = function (p, matrix, maxColumn_index) {
        if (p.isVertical) {
            /**
             * Before rotating let's check if the piece can rotate
             */
            // Check canvas borders
            if (p.usingColumns[0] > 0 && p.usingColumns[0] < maxColumn_index) {
                var M = matrix;
                var pieceColumn = p.usingColumns[0];
                var pieceRow = p.usingRows;
                var pieceMiddleRow = p.usingRows[1];
                var left_fragment_1 = M[pieceRow[0]][pieceColumn - 1];
                var left_fragment_2 = M[pieceRow[1]][pieceColumn - 1];
                var left_fragment_3 = M[pieceRow[2]][pieceColumn - 1];
                var right_fragment_1 = M[pieceRow[0]][pieceColumn + 1];
                var right_fragment_2 = M[pieceRow[1]][pieceColumn + 1];
                var right_fragment_3 = M[pieceRow[2]][pieceColumn + 1];
                // Rotating area conditions
                var c = [
                    !left_fragment_1.isOccupied,
                    !left_fragment_2.isOccupied,
                    !left_fragment_3.isOccupied,
                    !right_fragment_1.isOccupied,
                    !right_fragment_2.isOccupied,
                    !right_fragment_3.isOccupied
                ];
                // Is rotation possible ?
                if (c[0] && c[1] && c[2] && c[3] && c[4] && c[5]) {
                    p.isVertical = false;
                    p.x -= 40;
                    p.y += 40;
                    p.usingColumns = [pieceColumn - 1, pieceColumn, pieceColumn + 1];
                    p.usingRows = [pieceMiddleRow];
                    p.image = flatCrystal;
                }
            }
        }
        else if (!p.isVertical) {
            /**
             * Before rotating let's check if the piece can rotate
             */
            var M = matrix, pieceColumn = p.usingColumns, pieceRow = p.usingRows[0], topLeft_fragment = M[pieceRow - 1][pieceColumn[0]], topMiddle_fragment = M[pieceRow - 1][pieceColumn[1]], topRight_fragment = M[pieceRow - 1][pieceColumn[2]];
            // Rotation area conditions    
            var c = [
                !topLeft_fragment.isOccupied,
                !topMiddle_fragment.isOccupied,
                !topRight_fragment.isOccupied
            ];
            if (c[0] && c[1] && c[2]) {
                p.isVertical = true;
                p.x += 40;
                p.y -= 40;
                p.usingColumns = [pieceColumn[1]];
                p.usingRows = [pieceRow - 1, pieceRow, pieceRow + 1];
                p.image = tallCrystal;
            }
        }
    };
    return Long;
}(Piece));
export default Long;
