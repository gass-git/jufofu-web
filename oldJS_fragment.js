let filledRows = []; 

  /**
   * Compare all the pieces
   */
  for(let a = 0; a < pieces.length; a++){
    
    let colorsInRow = [];
    let piece_a = pieces[a];


    for(let b = a + 1; b < pieces.length; b++){

      let piece_b = pieces[b];
      let jokerBrickInRow = false;

      // Compare only if neither of the pieces are moving
      if(piece_a.isMoving === false && piece_b.isMoving === false){
        
        /**
         * If colorsInRow array is empty and the piece is not
         * already in filledRows array add piece_a 
         * Note: this line repeats due to the loop,make sure
         * to add this piece only once. 
         * 
         */
        if(colorsInRow.length < 1){
          colorsInRow.push(piece_a.color);
        }
        
        // If there is a jokerBrick in this row register it on a boolean
        if(piece_a.type === "jokerBrick" || piece_b.type ==="jokerBrick"){
          if(jokerBrickInRow === false){
            jokerBrickInRow = true;
          }
        } 

        /**
         * Don't compare if a BLOCK piece is already inside the filledRowsArr.
         * 
         * JokerBrick "piece.inFilledRowsArr" property should always be FALSE,
         * becuase it can be in two rows.
         * 
         * Comparisons:
         * 
         * Case one: block or joker are in the same row.
         * Case two: change piece B posY if piece A is a jokerBrick.
         * Case three: change piece A posY if piece B is a jokerBrick.
         * 
         * If any of these conditions are met then add the pieces to
         * the colorsInRow array.
         * 
         */
        
          if(piece_a.y === piece_b.y){
            if(piece_b.pushedInRowArr === false){
              colorsInRow.push(piece_b.color);
              piece_b.pushedInRowArr = true;
            }
          }
          else if(piece_a.type === "jokerBrick" && piece_b.y === piece_a.y + blockHeight){
            if(piece_b.pushedInRowArr === false){
              colorsInRow.push(piece_b.color);
              piece_b.pushedInRowArr = true;
            }
          }
        
        if(piece_b.type === "jokerBrick" && piece_a.y === piece_b.y + blockHeight){
          colorsInRow.push(piece_b.color);
        }
        

        /**
         * If the array colorsInRow is full register the position Y 
         * from piece_a. 
         * 
         * Note: if piece_a is a jokerBrick then posY should be calculated
         * as piece_a.y + blockHeight;
         * 
         */

        

        if(colorsInRow.length === columns){
          if(piece_a.type !== "jockerBrick"){
            filledRows.push(
              {
                colors: colorsInRow, 
                posY: piece_a.y,
                rowHasJokerBrick: jokerBrickInRow
              }
            );
          }
          else{
            filledRows.push(
              {
                colors: colorsInRow, 
                posY: piece_a.y + blockHeight,
                rowHasJokerBrick: jokerBrickInRow
              }
            );
          }
        }

      }
    }

  }