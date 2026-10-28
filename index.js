import { createGame, playTurn } from "./scripts/game.js";

const game = createGame();
const { player1, player2 } = game;

const plyrOneBoard = document.querySelector(".plyr1-board");
const plyrTwoBoard = document.querySelector(".plyr2-board");
const thinkingIcon = document.querySelector(".thinking-icon");
const humanIcon = document.querySelector(".human-icon");
const winIcon = document.querySelector(".win-icon");
const turnText = document.querySelector(".turn-text");

player1.gameboard.placeShipsRandomly();
player2.gameboard.placeShipsRandomly();

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

  const computerTurn = !game.over && game.current === player2;
  const humanTurn = !game.over && game.current === player1;
  const humanWon = game.over && game.winner === player1;

  thinkingIcon.hidden = !computerTurn;
  humanIcon.hidden = !humanTurn;
  winIcon.hidden = !humanWon;

  if (game.over) {
    turnText.textContent =
      game.winner === player1 ? "You win!" : "Computer wins!";
  } else {
    turnText.textContent =
      game.current === player1
        ? "Your turn: attack the enemy board"
        : "Computer is thinking...";
  }
}

plyrTwoBoard.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell || game.over || game.current !== player1) return;

  playTurn(game, Number(cell.dataset.row), Number(cell.dataset.col));
  render();

  if (!game.over && game.current === player2) {
    setTimeout(() => {
      playTurn(game);
      render();
    }, 600);
  }
});

render();
