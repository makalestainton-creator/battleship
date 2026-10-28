import { playTurn, nameOf, createGame } from "./scripts/game.js";

const game = createGame();
const { player1, player2 } = game;
player1.isComputer = true;

player1.gameboard.placeShipsRandomly();
player2.gameboard.placeShipsRandomly();

let turns = 0;
while (!game.over && turns < 500) {
  playTurn(game);
  turns++;
}

console.log(`${nameOf(game.winner)} wins!`);
