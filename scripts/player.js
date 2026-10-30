import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.wins = 0;
  }

  attack(enemyBoard, row, col) {
    if (this.isComputer) return false;
    return enemyBoard.receiveAttack(row, col);
  }

  randomAttack(enemyBoard) {
    if (!this.isComputer) return false;

    const targets = this.#getTargets(enemyBoard);
    const options = targets.length > 0 ? targets : this.#getUntried(enemyBoard);
    if (options.length === 0) return false;

    const [row, col] = options[Math.floor(Math.random() * options.length)];
    const result = enemyBoard.receiveAttack(row, col);
    return [row, col, result];
  }

  #getUntried(enemyBoard) {
    const cells = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!enemyBoard.hasBeenAttacked(r, c)) cells.push([r, c]);
      }
    }
    return cells;
  }

  #getTargets(enemyBoard) {
    const wounded = new Map();
    for (const [r, c] of enemyBoard.hitAttacks) {
      const ship = enemyBoard.board[r][c];
      if (ship.isSunk()) continue;
      if (!wounded.has(ship)) wounded.set(ship, []);
      wounded.get(ship).push([r, c]);
    }

    const targets = [];
    const add = (r, c) => {
      const onBoard = r >= 0 && r < 10 && c >= 0 && c < 10;
      const duplicate = targets.some(([tr, tc]) => tr === r && tc === c);
      if (onBoard && !duplicate && !enemyBoard.hasBeenAttacked(r, c)) {
        targets.push([r, c]);
      }
    };

    for (const cells of wounded.values()) {
      const sameRow =
        cells.length > 1 && cells.every(([r]) => r === cells[0][0]);
      const sameCol =
        cells.length > 1 && cells.every(([, c]) => c === cells[0][1]);

      for (const [r, c] of cells) {
        if (!sameCol) {
          add(r, c - 1);
          add(r, c + 1);
        }
        if (!sameRow) {
          add(r - 1, c);
          add(r + 1, c);
        }
      }
    }

    return targets;
  }
}
