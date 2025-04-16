/**
 * main.js
 * Main entry point for the chess application
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the chess model
    const chessModel = new ChessModel();
    
    // Get the board element
    const boardElement = document.getElementById('chess-board');
    
    // Initialize the UI controller with the model and board element
    const uiController = new ChessUIController(chessModel, boardElement);
    
    // Render the initial board
    uiController.render();
    
    // Optional: Add a game status message element
    const gameStatusElement = document.createElement('div');
    gameStatusElement.id = 'game-status';
    document.getElementById('game-container').appendChild(gameStatusElement);
    
    // Optional: Add a turn indicator
    const turnIndicator = document.createElement('div');
    turnIndicator.id = 'turn-indicator';
    document.getElementById('game-container').appendChild(turnIndicator);
    
    // Initial turn indicator update
    uiController.updateTurnIndicator();
});

/**
 * Initialize event listeners for UI controls
 */
function initializeUIControls(model, controller) {
    // Flip board button
    const flipButton = document.getElementById('flip-board');
    if (flipButton) {
        flipButton.addEventListener('click', function() {
            controller.flipBoard();
        });
    }
    
    // New game button
    const newGameButton = document.getElementById('new-game');
    if (newGameButton) {
        newGameButton.addEventListener('click', function() {
            model.resetGame();
            controller.renderBoard();
        });
    }
    
    // Undo move button
    const undoButton = document.getElementById('undo-move');
    if (undoButton) {
        undoButton.addEventListener('click', function() {
            const success = model.undoLastMove();
            if (success) {
                controller.renderBoard();
            }
        });
    }
    
    // Add more UI controls as needed
} 