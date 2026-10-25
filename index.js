import { game, playTurn, player1, player2 } from "./scripts/game.js";

const plyrOneBoard = document.querySelector(".plyr1-board");
const plyrTwoBoard = document.querySelector(".plyr2-board");
const statusEl = document.querySelector(".status");

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

function renderBoard(player, boardEl, showShips) {
  const gb = player.gameboard;
  boardEl.innerHTML = "";

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (gb.hasBeenAttacked(r, c)) {
        cell.classList.add(gb.board[r][c] ? "hit" : "miss");
      } else if (showShips && gb.board[r][c]) {
        cell.classList.add("ship");
      }

      boardEl.appendChild(cell);
    }
  }
}

function render() {
  renderBoard(player1, plyrOneBoard, true);
  renderBoard(player2, plyrTwoBoard, false);

  if (game.over) {
    statusEl.textContent =
      game.winner === player1 ? "You win!" : "Computer wins!";
  } else {
    statusEl.textContent =
      game.current === player1
        ? "Your turn: attack the enemy board"
        : "Computer is thinking...";
  }
}

plyrTwoBoard.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell || game.over || game.current !== player1) return;

  playTurn(Number(cell.dataset.row), Number(cell.dataset.col));
  render();

  if (!game.over && game.current === player2) {
    setTimeout(() => {
      playTurn();
      render();
    }, 600);
  }
});

render();
