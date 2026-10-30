import { createGame, playTurn } from "./scripts/game.js";

const plyrOneBoard = document.querySelector(".plyr1-board");
const plyrTwoBoard = document.querySelector(".plyr2-board");

const thinkingIcon = document.querySelector(".thinking-icon");
const humanIcon = document.querySelector(".human-icon");
const winIcon = document.querySelector(".win-icon");
const turnText = document.querySelector(".turn-text");

const humanTurnElm = document.querySelector(
  ".plyr1-board-container .turn-indicator",
);
const computerTurnElm = document.querySelector(
  ".plyr2-board-container .turn-indicator",
);

const humanScoreElms = document.querySelectorAll(".human-score");
const computerScoreElms = document.querySelectorAll(".comp-score");

const sideBar = document.querySelector(".side-bar");

const scores = { human: 0, computer: 0 };
let game, player1, player2;
let computerTimer = null;

function startGame() {
  clearTimeout(computerTimer); // cancel any pending computer move

  game = createGame();
  ({ player1, player2 } = game);

  player1.gameboard.placeShipsRandomly();
  player2.gameboard.placeShipsRandomly();

  sideBar.classList.remove("open");
  render();
}

const attackCount = (gb) => gb.hitAttacks.length + gb.missedAttacks.length;

function gameInProgress() {
  return (
    !game.over &&
    attackCount(player1.gameboard) + attackCount(player2.gameboard) > 0
  );
}

// New fleets, scores kept
function newGame() {
  if (gameInProgress() && !confirm("Abandon the current game?")) return;
  startGame();
}

// New fleets, scores reset to 0
function restart() {
  const hasProgress =
    gameInProgress() || scores.human > 0 || scores.computer > 0;
  if (hasProgress && !confirm("Reset the scores and start over?")) return;

  scores.human = 0;
  scores.computer = 0;
  startGame();
}

// A win is counted exactly once, right after the move that ends the game
function afterTurn() {
  if (game.over && !game.scored) {
    game.scored = true;
    if (game.winner === player1) scores.human++;
    else scores.computer++;
  }
  render();
}

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

function renderScores() {
  humanScoreElms.forEach((elm) => (elm.textContent = scores.human));
  computerScoreElms.forEach((elm) => (elm.textContent = scores.computer));
}

function render() {
  renderBoard(player1, plyrOneBoard, true);
  renderBoard(player2, plyrTwoBoard, false);

  const computerTurn = !game.over && game.current === player2;
  const humanTurn = !game.over && game.current === player1;
  const humanWon = game.over && game.winner === player1;

  humanTurnElm.classList.toggle("active", humanTurn);
  computerTurnElm.classList.toggle("active", computerTurn);

  thinkingIcon.hidden = !computerTurn;
  humanIcon.hidden = !humanTurn;
  winIcon.hidden = !humanWon;

  if (game.over) {
    turnText.textContent = humanWon ? "You win!" : "Computer wins!";
  } else {
    turnText.textContent = humanTurn
      ? "Your turn: attack the enemy board"
      : "Computer is thinking...";
  }

  renderScores();
}

plyrTwoBoard.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell || game.over || game.current !== player1) return;

  playTurn(game, Number(cell.dataset.row), Number(cell.dataset.col));
  afterTurn();

  if (!game.over && game.current === player2) {
    computerTimer = setTimeout(() => {
      playTurn(game);
      afterTurn();
    }, 600);
  }
});

document
  .querySelectorAll(".new-game")
  .forEach((btn) => btn.addEventListener("click", newGame));
document
  .querySelectorAll(".restart")
  .forEach((btn) => btn.addEventListener("click", restart));

document.querySelector(".menu-btn").addEventListener("click", () => {
  sideBar.classList.toggle("open");
});

startGame();
