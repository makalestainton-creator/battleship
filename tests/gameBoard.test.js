import { Gameboard } from "../scripts/gameboard.js";

test("places a ship horizontally", () => {
  const gb = new Gameboard();

  expect(gb.placeShip(0, 0, 3, "horizontal")).toBe(true);
  expect(gb.board[0][2]).not.toBeNull();
  expect(gb.board[1][0]).toBeNull();
});

test("rejects ship that goes off the board", () => {
  expect(new Gameboard().placeShip(0, 8, 3, "horizontal")).toBe(false);
});

test("rejects overlapping ships", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 3, "horizontal");
  expect(gb.placeShip(0, 2, 3, "vertical")).toBe(false);
});

test("attacking an empty cell adds the cell to missedAttacks", () => {
  const gb = new Gameboard();
  gb.receiveAttack(0, 0);
  expect(gb.missedAttacks.length).toBe(1);
  expect(gb.hitAttacks.length).toBe(0);
});

test("attacking a ship adds it to hitAttacks", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 3, "horizontal");
  gb.receiveAttack(0, 0);
  expect(gb.missedAttacks.length).toBe(0);
  expect(gb.hitAttacks.length).toBe(1);
});

test("attacking a ship enough times sinks is", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 2, "horizontal");

  gb.receiveAttack(0, 0);
  expect(gb.receiveAttack(0, 1)).toBe("sunk");
});

test("allSunk returns true when there's no ship", () => {
  const gb = new Gameboard();
  expect(gb.allSunk()).toBe(true);
});

test("allSunk returns false when there's an unsunk ship", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 2, "horizontal");
  gb.placeShip(1, 0, 2, "horizontal");

  gb.receiveAttack(0, 0);
  gb.receiveAttack(0, 1);
  gb.receiveAttack(1, 0);

  expect(gb.allSunk()).toBe(false);
});

test("allSunk returns true when all ships are sunk", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 2, "horizontal");
  gb.placeShip(1, 0, 2, "horizontal");

  gb.receiveAttack(0, 0);
  gb.receiveAttack(0, 1);
  gb.receiveAttack(1, 0);
  gb.receiveAttack(1, 1);

  expect(gb.allSunk()).toBe(true);
});

test("miss is recorded", () => {
  const gb = new Gameboard();
  expect(gb.receiveAttack(0, 0)).toBe("miss");
  expect(gb.missedAttacks).toContainEqual([0, 0]);
});

test("hit and sunk are reported", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 2, "horizontal");
  expect(gb.receiveAttack(0, 0)).toBe("hit");
  expect(gb.receiveAttack(0, 1)).toBe("sunk");
});

test("same square can't be attacked twice", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 2, "horizontal");
  gb.receiveAttack(0, 0);
  expect(gb.receiveAttack(0, 0)).toBe("already-attacked");
  expect(gb.ships[0].isSunk()).toBe(false);
});

test("allSunk is true only when every ship is sunk", () => {
  const gb = new Gameboard();
  gb.placeShip(0, 0, 1, "horizontal");
  expect(gb.allSunk()).toBe(false);
  gb.receiveAttack(0, 0);
  expect(gb.allSunk()).toBe(true);
});
