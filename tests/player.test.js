import { Player } from "../scripts/player.js";
import { Gameboard } from "../scripts/gameboard.js";

test("computer never attacks the same square twice", () => {
  const enemy = new Gameboard();
  const computer = new Player(true);
  const seen = new Set();

  for (let i = 0; i < 100; i++) {
    const [r, c] = computer.randomAttack(enemy);
    seen.add(`${r},${c}`);
  }

  expect(seen.size).toBe(100); // all unique
  expect(computer.randomAttack(enemy)).toBe(false); // board exhausted
});
