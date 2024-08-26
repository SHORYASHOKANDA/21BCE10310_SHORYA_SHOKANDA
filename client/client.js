const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('current-player');
let currentPlayer = 'A';

// Create a 5x5 grid
const createBoard = () => {
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (i < 5 || i >= 20) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.textContent = (i < 5) ? 'A-P' + (i + 1) : 'B-P' + (i - 19);
            cell.appendChild(piece);
        }
        boardElement.appendChild(cell);
    }
};

// Initialize the board
createBoard();
