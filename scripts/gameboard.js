import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
  }

  canPlaceShip(row, col, size, orientation) {
    if (![row, col, size].every(Number.isInteger)) return false;
    if (orientation !== "horizontal" && orientation !== "vertical")
      return false;
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

  placeShipsRandomly(sizes = [5, 4, 3, 3, 2]) {
    for (const size of sizes) {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        placed = this.placeShip(row, col, size, orientation);
      }
    }
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
