document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const board = document.getElementById('chessboard');
    let selectedPiece = null;
    
    // Initialize the board
    initializeBoard();
    
    function initializeBoard() {
        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add click event for square (for moving pieces)
                square.addEventListener('click', handleSquareClick);
                
                board.appendChild(square);
            }
        }
        
        // Set up initial pieces
        setupInitialPosition();
    }
    
    function setupInitialPosition() {
        // Define piece positions
        const initialSetup = {
            // Black pieces
            '0-0': { type: 'rook', color: 'black' },
            '0-1': { type: 'knight', color: 'black' },
            '0-2': { type: 'bishop', color: 'black' },
            '0-3': { type: 'queen', color: 'black' },
            '0-4': { type: 'king', color: 'black' },
            '0-5': { type: 'bishop', color: 'black' },
            '0-6': { type: 'knight', color: 'black' },
            '0-7': { type: 'rook', color: 'black' },
            
            // Black pawns
            '1-0': { type: 'pawn', color: 'black' },
            '1-1': { type: 'pawn', color: 'black' },
            '1-2': { type: 'pawn', color: 'black' },
            '1-3': { type: 'pawn', color: 'black' },
            '1-4': { type: 'pawn', color: 'black' },
            '1-5': { type: 'pawn', color: 'black' },
            '1-6': { type: 'pawn', color: 'black' },
            '1-7': { type: 'pawn', color: 'black' },
            
            // White pawns
            '6-0': { type: 'pawn', color: 'white' },
            '6-1': { type: 'pawn', color: 'white' },
            '6-2': { type: 'pawn', color: 'white' },
            '6-3': { type: 'pawn', color: 'white' },
            '6-4': { type: 'pawn', color: 'white' },
            '6-5': { type: 'pawn', color: 'white' },
            '6-6': { type: 'pawn', color: 'white' },
            '6-7': { type: 'pawn', color: 'white' },
            
            // White pieces
            '7-0': { type: 'rook', color: 'white' },
            '7-1': { type: 'knight', color: 'white' },
            '7-2': { type: 'bishop', color: 'white' },
            '7-3': { type: 'queen', color: 'white' },
            '7-4': { type: 'king', color: 'white' },
            '7-5': { type: 'bishop', color: 'white' },
            '7-6': { type: 'knight', color: 'white' },
            '7-7': { type: 'rook', color: 'white' }
        };
        
        // Place pieces on the board
        for (const position in initialSetup) {
            const [row, col] = position.split('-');
            const piece = initialSetup[position];
            createPiece(parseInt(row), parseInt(col), piece.type, piece.color);
        }
    }
    
    function createPiece(row, col, type, color) {
        const square = getSquare(row, col);
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.dataset.type = type;
        pieceElement.dataset.color = color;
        
        // Set the piece's appearance based on Unicode chess symbols
        pieceElement.textContent = getPieceSymbol(type, color);
        pieceElement.style.fontSize = '50px';
        
        // Add click event for piece selection
        pieceElement.addEventListener('click', handlePieceClick);
        
        square.appendChild(pieceElement);
    }
    
    function getPieceSymbol(type, color) {
        const symbols = {
            'white': {
                'king': '♔',
                'queen': '♕',
                'rook': '♖',
                'bishop': '♗',
                'knight': '♘',
                'pawn': '♙'
            },
            'black': {
                'king': '♚',
                'queen': '♛',
                'rook': '♜',
                'bishop': '♝',
                'knight': '♞',
                'pawn': '♟'
            }
        };
        
        return symbols[color][type];
    }
    
    function getSquare(row, col) {
        return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    }
    
    function handlePieceClick(event) {
        event.stopPropagation();
        
        // Clear any previous selections
        clearHighlights();
        
        // Get the piece and its square
        const piece = event.target;
        const square = piece.parentElement;
        
        // Highlight the selected piece
        square.classList.add('highlight');
        selectedPiece = piece;
    }
    
    function handleSquareClick(event) {
        // If a piece is selected, move it to the clicked square
        if (selectedPiece && event.target.classList.contains('square')) {
            const targetSquare = event.target;
            
            // If the target square already has a piece, check if it's capturable
            const existingPiece = targetSquare.querySelector('.piece');
            if (existingPiece) {
                // If it's the same color, select this piece instead
                if (existingPiece.dataset.color === selectedPiece.dataset.color) {
                    clearHighlights();
                    targetSquare.classList.add('highlight');
                    selectedPiece = existingPiece;
                    return;
                } else {
                    // Capture the piece
                    targetSquare.removeChild(existingPiece);
                }
            }
            
            // Move the selected piece to the target square
            targetSquare.appendChild(selectedPiece);
            clearHighlights();
            selectedPiece = null;
        }
    }
    
    function clearHighlights() {
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
    }
}); 