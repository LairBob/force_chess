/**
 * Force Chess - Main Application
 * Initializes and connects the chess model and UI controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the chess model
    const chessModel = new ChessModel();
    
    // Get the chess board element
    const boardElement = document.querySelector('.chess-board');
    
    // Initialize the UI controller
    const chessController = new ChessUIController(chessModel, boardElement);
    
    // Render the initial board
    chessController.render();
}); 