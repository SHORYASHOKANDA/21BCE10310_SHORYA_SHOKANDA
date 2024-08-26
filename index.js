const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let gameState = {
    board: Array(25).fill(null),  // Initialize a 5x5 grid (25 cells) with null
    currentPlayer: 'Player 1'     // Set the first player to 'Player 1'
};

// Function to broadcast the current game state to all connected clients
function broadcastGameState() {
    const data = JSON.stringify({
        updateBoard: true,
        board: gameState.board
    });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Function to handle a player's move
function handleMove(index) {
    if (gameState.board[index] === null) { // Check if the cell is empty
        gameState.board[index] = gameState.currentPlayer;  // Set the cell to the current player's mark
        gameState.currentPlayer = gameState.currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1'; // Switch players
        broadcastGameState();  // Send the updated game state to all clients
        checkGameOver();  // Check if the game is over
    }
}

// Function to check if the game is over
function checkGameOver() {
    const allOccupied = gameState.board.every(cell => cell !== null); // Check if all cells are occupied
    if (allOccupied) {
        broadcastGameOver(gameState.currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1'); // The player who just moved wins
    }
}

// Function to broadcast the game over state and the winner
function broadcastGameOver(winner) {
    const data = JSON.stringify({
        gameOver: true,
        winner: winner
    });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Handle new connections
wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.move !== undefined) {
            handleMove(data.move);
        }
    });

    // Send the initial game state to the newly connected client
    ws.send(JSON.stringify({
        updateBoard: true,
        board: gameState.board
    }));
});
