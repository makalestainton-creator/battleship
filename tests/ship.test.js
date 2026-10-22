import { Ship } from "../scripts/ship.js";

test("new ship is not sunk", () => {
  expect(new Ship(3).isSunk()).toBe(false);
});

test("ship sinks after enough hits", () => {
  const shp = new Ship(2);
  shp.hit();
  shp.hit();
  expect(shp.isSunk()).toBe(true);
});
