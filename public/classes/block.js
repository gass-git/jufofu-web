var Block = /** @class */ (function () {
    function Block(color, blockImages) {
        this.type = "block";
        this.color = color,
            this.image = blockImages[color],
            this.x = 120,
            this.y = 0,
            this.isRearranging = false,
            this.prevRowPos = null,
            this.isActive = true,
            this.usingColumns = [3],
            this.usingRows = [0];
    }
    return Block;
}());
export default Block;
