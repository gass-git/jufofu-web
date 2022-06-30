export default class Piece {
  type: string;
  color: string | null;
  image: object;
  x: number;
  y: number;
  isActive: boolean;
  usingColumns: number[];
  usingRows: number[];

  constructor(
    type: string,
    color: string | null,
    image: object,
    usingColumns: number[],
    usingRows: number[]
  ) {
    this.type = type
    this.color = color
    this.image = image
    this.x = 120
    this.y = 0
    this.isActive = true
    this.usingColumns = usingColumns
    this.usingRows = usingRows
  }
}