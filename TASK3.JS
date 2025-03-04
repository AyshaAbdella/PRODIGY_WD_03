// script.js
const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetGameBtn = document.getElementById("resetGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const changeSymbolBtn = document.getElementById("changeSymbolBtn");
const playerXScoreElem = document.getElementById("playerXScore");
const playerOScoreElem = document.getElementById("playerOScore");
const chooseXBtn = document.getElementById("chooseX");
const chooseOBtn = document.getElementById("chooseO");
const symbolSelection = document.getElementById("symbolSelection");
const twoPlayerModeBtn = document.getElementById("twoPlayerMode");
const vsComputerModeBtn = document.getElementById("vsComputerMode");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isVsComputer = false; // Default mode is 2 players
let playerSymbol = "X"; // Player's chosen symbol (X or O)
let computerSymbol = "O"; // Computer's symbol
let playerXScore = 0;
let playerOScore = 0;

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

// Hide symbol selection by default
symbolSelection.style.display = "none";

// Handle cell click
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  // Update game state and UI
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  // Check for a winner or draw
  checkForWinner();

  // Switch turns or let the computer play
  if (gameActive) {
    if (isVsComputer) {
      currentPlayer = computerSymbol; // Switch to computer's turn
      setTimeout(computerMove, 500); // Delay for better UX
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch to the other player
      statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }
}

// Computer's move (simple AI)
function computerMove() {
  const emptyCells = gameState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((cell) => cell !== null);

  if (emptyCells.length > 0) {
    const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomCellIndex] = computerSymbol;
    cells[randomCellIndex].textContent = computerSymbol;

    // Check for a winner or draw after the computer's move
    checkForWinner();

    // Switch back to the player's turn
    if (gameActive) {
      currentPlayer = playerSymbol;
      statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }
}

// Check for a winner or draw
function checkForWinner() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
      gameState[a] === "" ||
      gameState[b] === "" ||
      gameState[c] === ""
    ) {
      continue;
    }
    if (
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c]
    ) {
      roundWon = true;
      // Highlight the winning cells
      cells[a].classList.add("winning-cell");
      cells[b].classList.add("winning-cell");
      cells[c].classList.add("winning-cell");
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    updateScore(currentPlayer);
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }
}

// Update the score
function updateScore(winner) {
  if (winner === "X") {
    playerXScore++;
    playerXScoreElem.textContent = playerXScore;
  } else if (winner === "O") {
    playerOScore++;
    playerOScoreElem.textContent = playerOScore;
  }
}

// Reset the game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = playerSymbol; // Reset to player's symbol
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("winning-cell"); // Remove winning cell styles
  });
}

// New Game: Reset both the game board and the scores
function newGame() {
  resetGame(); // Reset the game board
  playerXScore = 0;
  playerOScore = 0;
  playerXScoreElem.textContent = playerXScore;
  playerOScoreElem.textContent = playerOScore;
}

// Change symbol (X or O)
function changeSymbol() {
  if (!isVsComputer) {
    symbolSelection.style.display = "block";
  }
}

// Set player symbol
function setPlayerSymbol(symbol) {
  playerSymbol = symbol;
  computerSymbol = symbol === "X" ? "O" : "X";
  symbolSelection.style.display = "none"; // Hide symbol selection
  resetGame();
}

// Set game mode to 2 players
function setTwoPlayerMode() {
  isVsComputer = false;
  symbolSelection.style.display = "block"; // Show symbol selection
  resetGame();
  statusText.textContent = "Player X's Turn";
}

// Set game mode to vs computer
function setVsComputerMode() {
  isVsComputer = true;
  symbolSelection.style.display = "none"; // Hide symbol selection
  resetGame();
  statusText.textContent = "Player X's Turn";
}

// Event Listeners
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetGameBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", newGame); // Updated to call newGame
changeSymbolBtn.addEventListener("click", changeSymbol);
chooseXBtn.addEventListener("click", () => setPlayerSymbol("X"));
chooseOBtn.addEventListener("click", () => setPlayerSymbol("O"));
twoPlayerModeBtn.addEventListener("click", setTwoPlayerMode);
vsComputerModeBtn.addEventListener("click", setVsComputerMode);