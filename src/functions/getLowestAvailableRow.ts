export default function getLowestAvailableRow(
  piece: any,
  matrix: any,
  maxRow_index: any
) {

  let resultRow
  let numbers: number[] = []

  // Loop through all the columns that the piece is using
  piece['usingColumns'].forEach((column: number) => {

    /**
     * The initial row of the loop will be the lower  
     * row been used by the piece + 1
     * 
     * In the case of the "long" piece the lower row
     * is piece['usingRows'][1]
     * 
     * The initial row will switch depending of the piece
     * type.
     */
    let initialRow

    switch (piece.type) {

      case "block":
        initialRow = piece['usingRows'][0] + 1
        break

      case "bomb":
        initialRow = piece['usingRows'][0] + 1
        break

      case "long":
        if (piece.isVertical) {
          initialRow = piece['usingRows'][2] + 1
        }
        else {
          initialRow = piece['usingRows'][0] + 1
        }
        break
    }

    // Loop through all the rows that are below the piece
    for (let row = initialRow; row <= maxRow_index; row++) {

      let fragment: any = matrix[row][column]

      if (fragment.isOccupied && fragment.pieceIsParked) {
        numbers.push(row) // Push row number if fragment is been occupied by an inactive piece
      }
    }
  })

  /** 
   * In case the numbers array is empty, the last 
   * available row will equal maxRow_index.
   */
  numbers.length > 0 ? resultRow = Math.min(...numbers) - 1 : resultRow = maxRow_index
  return resultRow
}