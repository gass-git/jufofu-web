import Piece from '../piece.js'

export default class Block extends Piece {
  isRearranging: boolean;
  prevRowPos: number | null;

  constructor(color: string, blockImages: any) {
    super('block', color, blockImages[color], [3], [0])
    this.isRearranging = false
    this.prevRowPos = null
  }
}