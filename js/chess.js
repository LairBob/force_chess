/**
 * Main Chess Application
 * Initializes and connects the game model and UI controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game model
    const gameModel = new ChessGameModel();
    
    // Initialize the UI controller with the game model
    const uiController = new ChessUIController(gameModel);
    
    // Initialize the UI
    uiController.initialize();
}); 