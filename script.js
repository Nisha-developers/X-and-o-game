// DOM Elements
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const roundsInput = document.getElementById('rounds');
const roundsLeft = document.getElementById('rounds-left');
const restartButton = document.getElementById('restart');

// Game State Variables
let currentPlayer = 'X';
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];
let scores = { X: 0, O: 0 };
let totalRounds = parseInt(roundsInput.value);
let roundsRemaining = totalRounds;

// Initialize the Game
function initializeGame() {
  roundsRemaining = totalRounds;
  roundsLeft.textContent = roundsRemaining;
  updateTurnIndicator();
  clearBoard();
}

// Clear the Board
function clearBoard() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning');
  });
  gameActive = true;
}

// Handle Cell Click
function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = cell.getAttribute('data-index');

  // Ignore if cell is already filled or game is over
  if (board[cellIndex] !== '' || !gameActive) return;

  // Update board and cell
  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;

  // Check for win or draw
  if (checkWin()) {
    endGame(currentPlayer);
  } else if (board.every(cell => cell !== '')) {
    endGame(null); // Draw
  } else {
    // Switch turn
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
  }
}

// Update Turn Indicator
function updateTurnIndicator() {
  turnIndicator.textContent = `Player ${currentPlayer}`;
}

// Check Win
function checkWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(combination);
      return true;
    }
  }
  return false;
}

// Highlight Winning Cells
function highlightWinningCells(combination) {
  combination.forEach(index => {
    cells[index].classList.add('winning');
  });
}

// End Game
function endGame(winner) {
  gameActive = false;

  if (winner) {
    scores[winner]++;
    updateScores();
    roundsRemaining--;
  } else {
    roundsRemaining--; // Draw counts as a round
  }

  roundsLeft.textContent = roundsRemaining;

  if (roundsRemaining === 0) {
    setTimeout(() => alert('Game over! Final scores:\nX: ' + scores.X + '\nO: ' + scores.O), 500);
  } else {
    setTimeout(clearBoard, 1500);
  }
}

// Update Scores
function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

// Restart Game
function restartGame() {
  scores = { X: 0, O: 0 };
  updateScores();
  initializeGame();
}

// Handle Rounds Change
function handleRoundsChange() {
  totalRounds = parseInt(roundsInput.value);
  if (isNaN(totalRounds) || totalRounds < 1) {
    alert('Please enter a valid number of rounds (minimum 1).');
    roundsInput.value = 3;
    totalRounds = 3;
  }
  initializeGame();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
roundsInput.addEventListener('change', handleRoundsChange);

// Start the Game
initializeGame();
