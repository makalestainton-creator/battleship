import { Player } from "./player.js";

export function createGame() {
  const player1 = new Player(false);
  const player2 = new Player(true);

  return {
    player1,
    player2,
    current: player1,
    enemy: player2,
    over: false,
    winner: null,
  };
}

export const nameOf = (game, player) => (player === game.player1 ? "Player1" : "Player2");

export function playTurn(game, row, col) {
  if (game.over) return;

  const attacker = game.current;
  const defender = game.enemy;
  let result;

  if (attacker.isComputer) {
    [row, col, result] = attacker.randomAttack(defender.gameboard);
  } else {
    result = attacker.attack(defender.gameboard, row, col);
    if (result === "already-attacked") return;
  }

  console.log(`${nameOf(game, attacker)} attacks [${row}, ${col}]: ${result}`);

  if (defender.gameboard.allSunk()) {
    game.over = true;
    game.winner = attacker;
    return;
  }

  [game.current, game.enemy] = [game.enemy, game.current];
}
