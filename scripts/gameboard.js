import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
  }

  canPlaceShip(row, col, size, orientation) {
    for (let i = 0; i < size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;

      if (r > 9 || c > 9) return false;
      if (this.board[r][c] !== null) return false;
    }
    return true;
  }

  placeShip(row, col, size, orientation) {
    if (!this.canPlaceShip(row, col, size, orientation)) return false;

    const ship = new Ship(size);
    this.ships.push(ship);

    for (let i = 0; i < size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      this.board[r][c] = ship;
    }

    return true;
  }

  receiveAttack(row, col) {
    if (this.hasBeenAttacked(row, col)) return "already-attacked";

    const ship = this.board[row][col];

    if (!ship) {
      this.missedAttacks.push([row, col]);
      return "miss";
    }

    ship.hit();
    this.hitAttacks.push([row, col]);
    return ship.isSunk() ? "sunk" : "hit";
  }

  hasBeenAttacked(row, col) {
    return [...this.missedAttacks, ...this.hitAttacks].some(
      ([r, c]) => r === row && c === col,
    );
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk() === true);
  }
}
