import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
  }

  attack(enemyBoard, row, col) {
    if (this.isComputer) return false;
    return enemyBoard.receiveAttack(row, col); // "hit" | "miss" | "sunk" | "already-attacked"
  }

  randomAttack(enemyBoard) {
    if (!this.isComputer) return false;

    const options = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!enemyBoard.hasBeenAttacked(r, c)) options.push([r, c]);
      }
    }
    if (options.length === 0) return false;

    const [row, col] = options[Math.floor(Math.random() * options.length)];
    enemyBoard.receiveAttack(row, col);
    return [row, col];
  }
}
