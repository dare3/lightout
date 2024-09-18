import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        // Randomly set each cell as true (lit) or false (unlit)
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** Check if all cells are turned off (i.e., false) */
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  /** Flip cell and the cells around it */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);
      const boardCopy = oldBoard.map(row => [...row]); // Deep copy the board

      const flipCell = (y, x) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Flip this cell and the surrounding ones
      flipCell(y, x);
      flipCell(y, x - 1); // left
      flipCell(y, x + 1); // right
      flipCell(y - 1, x); // above
      flipCell(y + 1, x); // below

      return boardCopy;
    });
  }

  /** Render the game board */
  function renderBoard() {
    return (
      <table className="Board">
        <tbody>
          {board.map((row, y) => (
            <tr key={y}>
              {row.map((cell, x) => (
                <Cell
                  key={`${y}-${x}`}
                  isLit={cell}
                  flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // If the player has won, display a winning message
  if (hasWon()) {
    return <div className="Board-win">You won!</div>;
  }

  return renderBoard();
}

export default Board;
