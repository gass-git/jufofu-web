import { setPieces } from "../engine-v4.js"

const bombImage = new Image()

bombImage.src = "inGame_images/blackCircle.png"

export default class Bomb {
  type: string;
  color: string | null;
  image: object;
  x: number;
  y: number;
  isActive: boolean;
  usingColumns: number[];
  usingRows: number[];

  constructor() {
    this.type = "bomb"
    this.color = null,
      this.image = bombImage,
      this.x = 120,
      this.y = 0,
      this.isActive = true,
      this.usingColumns = [3],
      this.usingRows = [0]
  }

  static explode(p: Bomb, savedPositions: any, pieces: any) {

    let bombColumn = p.usingColumns[0],
      bombRow = p.usingRows[0];

    // Sorrounding fragments     
    let sorroundingArea = [
      { row: bombRow - 1, column: bombColumn - 1 },   // top-left 
      { row: bombRow - 1, column: bombColumn },       // top
      { row: bombRow - 1, column: bombColumn + 1 },   // top-right
      { row: bombRow, column: bombColumn - 1 },       // left
      { row: bombRow, column: bombColumn + 1 },       // right
      { row: bombRow + 1, column: bombColumn - 1 },   // bottom-left
      { row: bombRow + 1, column: bombColumn },       // bottom
      { row: bombRow + 1, column: bombColumn + 1 }    // bottom-right
    ]

    // Destroy all sorrounding pieces that are not crystal
    pieces = pieces.filter((p: any) => {

      let destroyPiece = false

      if (p.type === "block") {

        let pieceRow = p.usingRows[0],
          pieceColumn = p.usingColumns[0];

        for (const area of sorroundingArea) {

          if (pieceRow === area.row && pieceColumn === area.column) {

            if (p.color !== "crystal") {
              destroyPiece = true
              break
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
        })

        return false // Remove the piece
      }
      else {
        return true // Keep the piece
      }
    })

    setPieces(pieces)

  }

}