const tallCrystal = new Image()
const flatCrystal = new Image()

tallCrystal.src = "inGame_images/tallCrystal.png"
flatCrystal.src = "inGame_images/flatCrystal.png"

export default class Long {
  type: string;
  isVertical: boolean;
  color: string;
  image: object;
  x: number;
  y: number;
  isRearranging: boolean;
  prevBottomRowPos: number | null;
  isActive: boolean;
  usingColumns: number[];
  usingRows: number[];

  constructor() {
    this.type = "long",
      this.isVertical = true,
      this.color = "crystal",
      this.image = tallCrystal,
      this.x = 120,
      this.y = 0,
      this.isRearranging = false,
      this.prevBottomRowPos = null,
      this.isActive = true,
      this.usingColumns = [3],
      this.usingRows = [0, 1, 2]
  }

  static rotate(p: Long, matrix: any, maxColumn_index: number) {

    if (p.isVertical) {

      /**
       * Before rotating let's check if the piece can rotate
       */

      // Check canvas borders
      if (p.usingColumns[0] > 0 && p.usingColumns[0] < maxColumn_index) {

        let M = matrix
        let pieceColumn = p.usingColumns[0]
        let pieceRow = p.usingRows
        let pieceMiddleRow = p.usingRows[1]
        let left_fragment_1: any = M[pieceRow[0]][pieceColumn - 1]
        let left_fragment_2: any = M[pieceRow[1]][pieceColumn - 1]
        let left_fragment_3: any = M[pieceRow[2]][pieceColumn - 1]
        let right_fragment_1: any = M[pieceRow[0]][pieceColumn + 1]
        let right_fragment_2: any = M[pieceRow[1]][pieceColumn + 1]
        let right_fragment_3: any = M[pieceRow[2]][pieceColumn + 1]

        // Rotating area conditions
        let c = [
          !left_fragment_1.isOccupied,
          !left_fragment_2.isOccupied,
          !left_fragment_3.isOccupied,
          !right_fragment_1.isOccupied,
          !right_fragment_2.isOccupied,
          !right_fragment_3.isOccupied
        ]

        // Is rotation possible ?
        if (c[0] && c[1] && c[2] && c[3] && c[4] && c[5]) {
          p.isVertical = false
          p.x -= 40
          p.y += 40
          p.usingColumns = [pieceColumn - 1, pieceColumn, pieceColumn + 1]
          p.usingRows = [pieceMiddleRow]
          p.image = flatCrystal
        }

      }
    }

    else if (!p.isVertical) {

      /**
       * Before rotating let's check if the piece can rotate
       */
      let M = matrix,
        pieceColumn = p.usingColumns,
        pieceRow = p.usingRows[0],
        topLeft_fragment: any = M[pieceRow - 1][pieceColumn[0]],
        topMiddle_fragment: any = M[pieceRow - 1][pieceColumn[1]],
        topRight_fragment: any = M[pieceRow - 1][pieceColumn[2]];

      // Rotation area conditions    
      let c = [
        !topLeft_fragment.isOccupied,
        !topMiddle_fragment.isOccupied,
        !topRight_fragment.isOccupied
      ]

      if (c[0] && c[1] && c[2]) {

        p.isVertical = true
        p.x += 40
        p.y -= 40
        p.usingColumns = [pieceColumn[1]]
        p.usingRows = [pieceRow - 1, pieceRow, pieceRow + 1]
        p.image = tallCrystal
      }
    }

  }
}