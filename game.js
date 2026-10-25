import { Player } from "./scripts/player.js";

const player1 = new Player(true);
const player2 = new Player(true);

player1.gameboard.placeShip(0, 0, 3, "horizontal");
player1.gameboard.placeShip(0, 5, 2, "horizontal");
player1.gameboard.placeShip(7, 4, 1, "horizontal");
player1.gameboard.placeShip(3, 0, 3, "vertical");
player1.gameboard.placeShip(1, 1, 3, "vertical");

player2.gameboard.placeShip(0, 0, 3, "vertical");
player2.gameboard.placeShip(0, 5, 2, "vertical");
player2.gameboard.placeShip(7, 4, 1, "vertical");
player2.gameboard.placeShip(3, 0, 3, "horizontal");
player2.gameboard.placeShip(1, 1, 3, "horizontal");

const game = {
  current: player1,
  enemy: player2,
  over: false,
  winner: null,
};

const nameOf = (p) => (p === player1 ? "Player1" : "Player2");

function playTurn(row, col) {
  if (game.over) return;

  const attacker = game.current;
  const defender = game.enemy;
  let result;

  if (attacker.isComputer) {
    [row, col, result] = attacker.randomAttack(defender.gameboard);
  } else {
    result = attacker.randomAttack(defender.gameboard, row, col);

    if (result === "already-attacked") return;
  }

  console.log(`${nameOf(attacker)} attacks [${row}, ${col}}]: ${result}`);

  if (defender.gameboard.allSunk()) {
    game.over = true;
    game.winner = attacker;
    return;
  }

  [game.current, game.enemy] = [game.enemy, game.current];
}

while (!game.over) {
  playTurn();
}

console.log(`${nameOf(game.winner)} wins!`);