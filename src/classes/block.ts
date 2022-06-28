// Block images ----------------------------------------------------
const greenBlock = new Image()
const blueBlock = new Image()
const pinkBlock = new Image()
const crystalBlock = new Image()
const yellowBlock = new Image()
const redBlock = new Image()
const whiteBlock = new Image()
const orangeBlock = new Image()

crystalBlock.src = "inGame_images/crystalBlock.png"
blueBlock.src = "inGame_images/blueBlock.png"
greenBlock.src = "inGame_images/greenBlock.png"
yellowBlock.src = "inGame_images/yellowBlock.png"
redBlock.src = "inGame_images/redBlock.png"
pinkBlock.src = "inGame_images/pinkBlock.png"
whiteBlock.src = "inGame_images/whiteBlock.png"
orangeBlock.src = "inGame_images/orangeBlock.png"
// -----------------------------------------------------------------

interface BlockImage {
  [key: string]: object
}

const blockImages: BlockImage = {
  green: greenBlock,
  blue: blueBlock,
  crystal: crystalBlock,
  pink: pinkBlock,
  yellow: yellowBlock,
  red: redBlock,
  white: whiteBlock,
  orange: orangeBlock
}

export default class Block {
  type: string;
  color: string;
  image: object;
  x: number;
  y: number;
  isRearranging: boolean;
  prevRowPos: number | null;
  isActive: boolean;
  usingColumns: number[];
  usingRows: number[];

  constructor(color: string) {
    this.type = "block"
    this.color = color,
      this.image = blockImages[color],
      this.x = 120,
      this.y = 0,
      this.isRearranging = false,
      this.prevRowPos = null,
      this.isActive = true,
      this.usingColumns = [3],
      this.usingRows = [0]
  }
}