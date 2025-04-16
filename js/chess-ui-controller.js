/**
 * Chess UI Controller - Handles user interaction with the board
 * Manages UI state like selected pieces, highlighting, and user interactions
 * while delegating game logic to the model.
 */
class ChessUIController {
    constructor(chessModel, boardElement) {
        this.model = chessModel;
        this.boardElement = boardElement;
        this.selectedSquare = null;
        this.highlightedSquares = [];
        this.boardOrientation = 'white'; // 'white' or 'black'
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
        
        // Set up buttons
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('undo-btn').addEventListener('click', () => this.undoMove());
        document.getElementById('flip-board-btn').addEventListener('click', () => this.flipBoard());
    }

    render() {
        // Clear the board
        this.boardElement.innerHTML = '';
        
        const board = this.model.getBoard();
        
        // Determine rendering order based on orientation
        const rowOrder = this.boardOrientation === 'white' 
            ? [0, 1, 2, 3, 4, 5, 6, 7] 
            : [7, 6, 5, 4, 3, 2, 1, 0];
        const colOrder = this.boardOrientation === 'white' 
            ? [0, 1, 2, 3, 4, 5, 6, 7] 
            : [7, 6, 5, 4, 3, 2, 1, 0];
        
        // Create squares and pieces
        for (let i = 0; i < 8; i++) {
            const row = rowOrder[i];
            
            for (let j = 0; j < 8; j++) {
                const col = colOrder[j];
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add light/dark square colors
                if ((row + col) % 2 === 0) {
                    square.classList.add('light-square');
                } else {
                    square.classList.add('dark-square');
                }
                
                // Add piece if there is one
                const piece = board[row][col];
                if (piece) {
                    // Use Unicode chess pieces
                    const pieceSymbols = {
                        'white': {
                            'pawn': '♙',
                            'rook': '♖',
                            'knight': '♘',
                            'bishop': '♗',
                            'queen': '♕',
                            'king': '♔'
                        },
                        'black': {
                            'pawn': '♟',
                            'rook': '♜',
                            'knight': '♞',
                            'bishop': '♝',
                            'queen': '♛',
                            'king': '♚'
                        }
                    };
                    
                    square.textContent = pieceSymbols[piece.color][piece.type];
                }
                
                // Add highlighting if needed
                if (this.selectedSquare && this.selectedSquare.row === row && this.selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                // Add valid move highlights
                if (this.highlightedSquares.some(sq => sq.row === row && sq.col === col)) {
                    square.classList.add('valid-move');
                }
                
                this.boardElement.appendChild(square);
            }
        }
        
        // Update turn indicator
        this.updateTurnIndicator();
    }

    updateTurnIndicator() {
        const turnIndicator = document.getElementById('turn-indicator');
        if (turnIndicator) {
            const currentPlayer = this.model.getCurrentPlayer();
            turnIndicator.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
            turnIndicator.className = `turn-indicator ${currentPlayer}-turn`;
        }
    }

    handleBoardClick(event) {
        // Find the clicked square
        const square = event.target.closest('.square');
        if (!square) return;
        
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        // If no square is selected yet, select this one if it has a piece of the current player
        if (!this.selectedSquare) {
            const piece = this.model.getBoard()[row][col];
            if (piece && piece.color === this.model.getCurrentPlayer()) {
                this.selectedSquare = { row, col };
                this.highlightedSquares = this.model.getValidMoves(row, col);
                this.render();
            }
        } 
        // If a square is already selected
        else {
            // Check if the clicked square is a valid move
            const isValidMove = this.highlightedSquares.some(
                move => move.row === row && move.col === col
            );
            
            if (isValidMove) {
                // Make the move
                this.model.makeMove(
                    this.selectedSquare.row, 
                    this.selectedSquare.col,
                    row,
                    col
                );
                
                // Clear selection and highlights
                this.selectedSquare = null;
                this.highlightedSquares = [];
                this.render();
                
                // Check for game over
                if (this.model.isGameOver()) {
                    this.showGameOverMessage();
                }
            } 
            // If clicking on another of the player's pieces, select that one instead
            else {
                const piece = this.model.getBoard()[row][col];
                if (piece && piece.color === this.model.getCurrentPlayer()) {
                    this.selectedSquare = { row, col };
                    this.highlightedSquares = this.model.getValidMoves(row, col);
                    this.render();
                } 
                // Otherwise, clear the selection
                else {
                    this.selectedSquare = null;
                    this.highlightedSquares = [];
                    this.render();
                }
            }
        }
    }

    newGame() {
        this.model.resetGame();
        this.selectedSquare = null;
        this.highlightedSquares = [];
        this.render();
    }

    undoMove() {
        if (this.model.undoLastMove()) {
            this.selectedSquare = null;
            this.highlightedSquares = [];
            this.render();
        }
    }

    flipBoard() {
        this.boardOrientation = this.boardOrientation === 'white' ? 'black' : 'white';
        this.render();
    }

    showGameOverMessage() {
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
            // In a real implementation, we'd determine the game result more specifically
            statusElement.textContent = 'Game Over';
        }
    }
}

// Export the controller class
window.ChessUIController = ChessUIController; 