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
var Block = /** @class */ (function () {
    function Block(color) {
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
