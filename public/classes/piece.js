var Piece = /** @class */ (function () {
    function Piece(type, color, image, usingColumns, usingRows) {
        this.type = type,
            this.color = color,
            this.image = image,
            this.x = 120,
            this.y = 0,
            this.isActive = true,
            this.usingColumns = usingColumns,
            this.usingRows = usingRows;
    }
    return Piece;
}());
export default Piece;
