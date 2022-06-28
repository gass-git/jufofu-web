interface BlockImage {
  [key: string]: object
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

  constructor(color: string, blockImages: any) {
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