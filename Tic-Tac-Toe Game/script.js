const board = document.getElementById('board');
const cells = Array.from(board.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const xWinsEl = document.getElementById('xWins');
const oWinsEl = document.getElementById('oWins');
const tiesEl = document.getElementById('ties');
const resetBtn = document.getElementById('resetBtn');
const resetScoresBtn = document.getElementById('resetScoresBtn');
const winnerOverlay = document.getElementById('winnerOverlay');
const winnerText = document.getElementById('winnerText');
const overlayPlayAgain = document.getElementById('overlayPlayAgain');
const winLine = document.getElementById('winLine');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let scores = { X: 0, O: 0, ties: 0 };

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateScoreboard() {
  xWinsEl.textContent = scores.X;
  oWinsEl.textContent = scores.O;
  tiesEl.textContent = scores.ties;
}

function resetBoard() {
  gameState.fill('');
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(c => { c.textContent = ''; c.className = 'cell'; });
  statusEl.textContent = "Player X's turn";
  hideWinLine();
}

function resetScores() {
  scores = { X: 0, O: 0, ties: 0 };
  updateScoreboard();
  resetBoard();
}

function checkWinner() {
  for (const combo of wins) {
    const [a,b,c] = combo;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return { winner: gameState[a], combo };
    }
  }
  if (gameState.every(v => v)) return { winner: 'T' };
  return { winner: null };
}

function showWinLine(combo) {
  const a = cells[combo[0]].getBoundingClientRect();
  const c = cells[combo[2]].getBoundingClientRect();
  const bRect = board.getBoundingClientRect();
  const x1 = a.left + a.width/2 - bRect.left;
  const y1 = a.top + a.height/2 - bRect.top;
  const x2 = c.left + c.width/2 - bRect.left;
  const y2 = c.top + c.height/2 - bRect.top;
  const dx = x2-x1, dy=y2-y1;
  const len = Math.hypot(dx,dy);
  const angle = Math.atan2(dy,dx)*180/Math.PI;
  winLine.style.width = len+'px';
  winLine.style.transform = `translate(${x1}px,${y1}px) rotate(${angle}deg)`;
  winLine.style.opacity = 1;
}

function hideWinLine() {
  winLine.style.opacity = 0;
}

board.addEventListener('click', e => {
  const cell = e.target.closest('.cell');
  if (!cell || !gameActive) return;
  const idx = parseInt(cell.dataset.index);
  if (gameState[idx]) return;
  gameState[idx] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  const res = checkWinner();
  if (res.winner === 'X' || res.winner === 'O') {
    gameActive = false;
    scores[res.winner]++;
    updateScoreboard();
    showWinLine(res.combo);
    winnerText.textContent = `Player ${res.winner} Wins!`;
    winnerOverlay.classList.add('visible');
  } else if (res.winner === 'T') {
    gameActive = false;
    scores.ties++;
    updateScoreboard();
    winnerText.textContent = "It's a Tie!";
    winnerOverlay.classList.add('visible');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
  }
});

resetBtn.addEventListener('click', resetBoard);
resetScoresBtn.addEventListener('click', resetScores);
winnerOverlay.addEventListener('click', () => { winnerOverlay.classList.remove('visible'); resetBoard(); });
overlayPlayAgain.addEventListener('click', e => { e.stopPropagation(); winnerOverlay.classList.remove('visible'); resetBoard(); });

updateScoreboard();
resetBoard();
