import { game, playTurn, nameOf, player1, player2 } from "./scripts/game.js";

player1.isComputer = true;

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

while (!game.over) {
  playTurn();
}

console.log(`${nameOf(game.winner)} wins!`);