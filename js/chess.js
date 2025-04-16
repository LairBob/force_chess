document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const board = document.getElementById('chessboard');
    let selectedPiece = null;
    let currentTurn = 'white'; // Track whose turn it is
    
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
            '0-0': { type: 'rook', color: 'black', hasMoved: false },
            '0-1': { type: 'knight', color: 'black' },
            '0-2': { type: 'bishop', color: 'black' },
            '0-3': { type: 'queen', color: 'black' },
            '0-4': { type: 'king', color: 'black', hasMoved: false },
            '0-5': { type: 'bishop', color: 'black' },
            '0-6': { type: 'knight', color: 'black' },
            '0-7': { type: 'rook', color: 'black', hasMoved: false },
            
            // Black pawns
            '1-0': { type: 'pawn', color: 'black', hasMoved: false },
            '1-1': { type: 'pawn', color: 'black', hasMoved: false },
            '1-2': { type: 'pawn', color: 'black', hasMoved: false },
            '1-3': { type: 'pawn', color: 'black', hasMoved: false },
            '1-4': { type: 'pawn', color: 'black', hasMoved: false },
            '1-5': { type: 'pawn', color: 'black', hasMoved: false },
            '1-6': { type: 'pawn', color: 'black', hasMoved: false },
            '1-7': { type: 'pawn', color: 'black', hasMoved: false },
            
            // White pawns
            '6-0': { type: 'pawn', color: 'white', hasMoved: false },
            '6-1': { type: 'pawn', color: 'white', hasMoved: false },
            '6-2': { type: 'pawn', color: 'white', hasMoved: false },
            '6-3': { type: 'pawn', color: 'white', hasMoved: false },
            '6-4': { type: 'pawn', color: 'white', hasMoved: false },
            '6-5': { type: 'pawn', color: 'white', hasMoved: false },
            '6-6': { type: 'pawn', color: 'white', hasMoved: false },
            '6-7': { type: 'pawn', color: 'white', hasMoved: false },
            
            // White pieces
            '7-0': { type: 'rook', color: 'white', hasMoved: false },
            '7-1': { type: 'knight', color: 'white' },
            '7-2': { type: 'bishop', color: 'white' },
            '7-3': { type: 'queen', color: 'white' },
            '7-4': { type: 'king', color: 'white', hasMoved: false },
            '7-5': { type: 'bishop', color: 'white' },
            '7-6': { type: 'knight', color: 'white' },
            '7-7': { type: 'rook', color: 'white', hasMoved: false }
        };
        
        // Place pieces on the board
        for (const position in initialSetup) {
            const [row, col] = position.split('-');
            const piece = initialSetup[position];
            createPiece(parseInt(row), parseInt(col), piece.type, piece.color, piece.hasMoved);
        }
    }
    
    function createPiece(row, col, type, color, hasMoved = false) {
        const square = getSquare(row, col);
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.dataset.type = type;
        pieceElement.dataset.color = color;
        
        // Keep track of whether the piece has moved (needed for pawns, castling, etc.)
        pieceElement.dataset.hasMoved = hasMoved;
        
        // Set the piece's appearance based on Unicode chess symbols
        pieceElement.textContent = getPieceSymbol(type, color);
        pieceElement.style.fontSize = '50px';
        
        // Add click event for piece selection
        pieceElement.addEventListener('click', handlePieceClick);
        
        square.appendChild(pieceElement);
        return pieceElement;
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
    
    function getPieceAt(row, col) {
        const square = getSquare(row, col);
        return square ? square.querySelector('.piece') : null;
    }
    
    function handlePieceClick(event) {
        event.stopPropagation();
        
        // Get the piece and its square
        const piece = event.target;
        const square = piece.parentElement;
        
        // Only allow selecting pieces of the current turn's color
        if (piece.dataset.color !== currentTurn) {
            return;
        }
        
        // Clear any previous selections
        clearHighlights();
        
        // Highlight the selected piece
        square.classList.add('highlight');
        selectedPiece = piece;
        
        // Highlight valid moves
        highlightValidMoves(piece);
    }
    
    function handleSquareClick(event) {
        // If a piece is selected, try to move it to the clicked square
        if (selectedPiece) {
            const targetSquare = event.currentTarget;
            
            // Check if this is a valid move square
            if (!targetSquare.classList.contains('valid-move') && 
                !targetSquare.classList.contains('highlight')) {
                // If it's not a valid move square but has a piece of same color, select that piece instead
                const existingPiece = targetSquare.querySelector('.piece');
                if (existingPiece && existingPiece.dataset.color === currentTurn) {
                    clearHighlights();
                    targetSquare.classList.add('highlight');
                    selectedPiece = existingPiece;
                    highlightValidMoves(existingPiece);
                }
                return;
            }
            
            // Get the current and target positions
            const currentSquare = selectedPiece.parentElement;
            const fromRow = parseInt(currentSquare.dataset.row);
            const fromCol = parseInt(currentSquare.dataset.col);
            const toRow = parseInt(targetSquare.dataset.row);
            const toCol = parseInt(targetSquare.dataset.col);
            
            // Handle castling move
            if (selectedPiece.dataset.type === 'king' && Math.abs(toCol - fromCol) === 2) {
                // This is a castling move
                performCastling(fromRow, fromCol, toRow, toCol);
            } else {
                // Capture piece if there is one
                const existingPiece = targetSquare.querySelector('.piece');
                if (existingPiece) {
                    targetSquare.removeChild(existingPiece);
                }
                
                // Move the selected piece to the target square
                targetSquare.appendChild(selectedPiece);
                
                // Mark the piece as having moved
                selectedPiece.dataset.hasMoved = true;
            }
            
            // Switch turns
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
            
            // Clear highlights and selection
            clearHighlights();
            selectedPiece = null;
        }
    }
    
    function clearHighlights() {
        // Remove highlighted squares
        document.querySelectorAll('.highlight, .valid-move').forEach(el => {
            el.classList.remove('highlight', 'valid-move');
        });
        
        // Remove valid move markers
        document.querySelectorAll('.move-marker').forEach(marker => {
            marker.remove();
        });
    }
    
    function highlightValidMoves(piece) {
        const square = piece.parentElement;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const color = piece.dataset.color;
        const type = piece.dataset.type;
        const hasMoved = piece.dataset.hasMoved === 'true';
        
        let validMoves = [];
        
        // Get valid moves based on piece type
        switch(type) {
            case 'pawn':
                validMoves = getValidPawnMoves(row, col, color, hasMoved);
                break;
            case 'rook':
                validMoves = getValidRookMoves(row, col, color);
                break;
            case 'knight':
                validMoves = getValidKnightMoves(row, col, color);
                break;
            case 'bishop':
                validMoves = getValidBishopMoves(row, col, color);
                break;
            case 'queen':
                validMoves = getValidQueenMoves(row, col, color);
                break;
            case 'king':
                validMoves = getValidKingMoves(row, col, color, hasMoved);
                break;
        }
        
        // Highlight each valid move square
        validMoves.forEach(move => {
            const moveSquare = getSquare(move.row, move.col);
            if (moveSquare) {
                moveSquare.classList.add('valid-move');
                
                // Add a visual marker for empty squares
                if (!moveSquare.querySelector('.piece')) {
                    const marker = document.createElement('div');
                    marker.className = 'move-marker';
                    moveSquare.appendChild(marker);
                }
            }
        });
    }
    
    function getValidPawnMoves(row, col, color, hasMoved) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1; // White pawns move up (-1), black pawns move down (+1)
        
        // Forward move (1 square)
        const forwardRow = row + direction;
        if (isValidPosition(forwardRow, col) && !getPieceAt(forwardRow, col)) {
            moves.push({ row: forwardRow, col: col });
            
            // Forward move (2 squares) if pawn hasn't moved yet
            if (!hasMoved) {
                const doubleForwardRow = row + (direction * 2);
                if (isValidPosition(doubleForwardRow, col) && !getPieceAt(doubleForwardRow, col)) {
                    moves.push({ row: doubleForwardRow, col: col });
                }
            }
        }
        
        // Capture moves (diagonally)
        const captureCols = [col - 1, col + 1];
        captureCols.forEach(captureCol => {
            if (isValidPosition(forwardRow, captureCol)) {
                const targetPiece = getPieceAt(forwardRow, captureCol);
                if (targetPiece && targetPiece.dataset.color !== color) {
                    moves.push({ row: forwardRow, col: captureCol });
                }
            }
        });
        
        return moves;
    }
    
    function getValidRookMoves(row, col, color) {
        const moves = [];
        const directions = [
            { row: -1, col: 0 },  // Up
            { row: 1, col: 0 },   // Down
            { row: 0, col: -1 },  // Left
            { row: 0, col: 1 }    // Right
        ];
        
        // Check each direction
        directions.forEach(dir => {
            let currentRow = row + dir.row;
            let currentCol = col + dir.col;
            
            // Continue in this direction until we hit a piece or the edge of the board
            while (isValidPosition(currentRow, currentCol)) {
                const targetPiece = getPieceAt(currentRow, currentCol);
                
                if (!targetPiece) {
                    // Empty square, can move here
                    moves.push({ row: currentRow, col: currentCol });
                } else if (targetPiece.dataset.color !== color) {
                    // Enemy piece, can capture and then stop
                    moves.push({ row: currentRow, col: currentCol });
                    break;
                } else {
                    // Friendly piece, stop here
                    break;
                }
                
                // Move further in this direction
                currentRow += dir.row;
                currentCol += dir.col;
            }
        });
        
        return moves;
    }
    
    function getValidKnightMoves(row, col, color) {
        const moves = [];
        const knightMoves = [
            { row: -2, col: -1 }, { row: -2, col: 1 },
            { row: -1, col: -2 }, { row: -1, col: 2 },
            { row: 1, col: -2 }, { row: 1, col: 2 },
            { row: 2, col: -1 }, { row: 2, col: 1 }
        ];
        
        // Check each potential knight move
        knightMoves.forEach(move => {
            const newRow = row + move.row;
            const newCol = col + move.col;
            
            if (isValidPosition(newRow, newCol)) {
                const targetPiece = getPieceAt(newRow, newCol);
                
                // Can move if square is empty or contains an enemy piece
                if (!targetPiece || targetPiece.dataset.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }
    
    function getValidBishopMoves(row, col, color) {
        const moves = [];
        const directions = [
            { row: -1, col: -1 },  // Up-left
            { row: -1, col: 1 },   // Up-right
            { row: 1, col: -1 },   // Down-left
            { row: 1, col: 1 }     // Down-right
        ];
        
        // Check each direction
        directions.forEach(dir => {
            let currentRow = row + dir.row;
            let currentCol = col + dir.col;
            
            // Continue in this direction until we hit a piece or the edge of the board
            while (isValidPosition(currentRow, currentCol)) {
                const targetPiece = getPieceAt(currentRow, currentCol);
                
                if (!targetPiece) {
                    // Empty square, can move here
                    moves.push({ row: currentRow, col: currentCol });
                } else if (targetPiece.dataset.color !== color) {
                    // Enemy piece, can capture and then stop
                    moves.push({ row: currentRow, col: currentCol });
                    break;
                } else {
                    // Friendly piece, stop here
                    break;
                }
                
                // Move further in this direction
                currentRow += dir.row;
                currentCol += dir.col;
            }
        });
        
        return moves;
    }
    
    function getValidQueenMoves(row, col, color) {
        // Queen combines rook and bishop movement
        const rookMoves = getValidRookMoves(row, col, color);
        const bishopMoves = getValidBishopMoves(row, col, color);
        return [...rookMoves, ...bishopMoves];
    }
    
    function getValidKingMoves(row, col, color, hasMoved) {
        const moves = [];
        const kingMoves = [
            { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
            { row: 0, col: -1 }, { row: 0, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
        ];
        
        // Regular king moves (one square in any direction)
        kingMoves.forEach(move => {
            const newRow = row + move.row;
            const newCol = col + move.col;
            
            if (isValidPosition(newRow, newCol)) {
                const targetPiece = getPieceAt(newRow, newCol);
                
                // Can move if square is empty or contains an enemy piece
                if (!targetPiece || targetPiece.dataset.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        // Castling moves
        if (!hasMoved) {
            // Check kingside castling
            if (canCastle(row, col, 'kingside', color)) {
                moves.push({ row: row, col: col + 2 });
            }
            
            // Check queenside castling
            if (canCastle(row, col, 'queenside', color)) {
                moves.push({ row: row, col: col - 2 });
            }
        }
        
        return moves;
    }
    
    function canCastle(row, col, side, color) {
        // King must not have moved
        const kingPiece = getPieceAt(row, col);
        if (kingPiece.dataset.hasMoved === 'true') {
            return false;
        }
        
        // Determine rook position based on castling side
        const rookCol = side === 'kingside' ? 7 : 0;
        const rookPiece = getPieceAt(row, rookCol);
        
        // Rook must exist and not have moved
        if (!rookPiece || rookPiece.dataset.type !== 'rook' || 
            rookPiece.dataset.color !== color || rookPiece.dataset.hasMoved === 'true') {
            return false;
        }
        
        // Check that all squares between king and rook are empty
        const direction = side === 'kingside' ? 1 : -1;
        const startCol = col + direction;
        const endCol = side === 'kingside' ? rookCol - 1 : rookCol + 1;
        
        for (let c = startCol; side === 'kingside' ? c <= endCol : c >= endCol; c += direction) {
            if (getPieceAt(row, c)) {
                return false;
            }
        }
        
        return true;
    }
    
    function performCastling(fromRow, fromCol, toRow, toCol) {
        const king = selectedPiece;
        const side = toCol > fromCol ? 'kingside' : 'queenside';
        const rookCol = side === 'kingside' ? 7 : 0;
        const newRookCol = side === 'kingside' ? toCol - 1 : toCol + 1;
        
        // Move the king
        const targetSquare = getSquare(toRow, toCol);
        targetSquare.appendChild(king);
        king.dataset.hasMoved = true;
        
        // Move the rook
        const rook = getPieceAt(fromRow, rookCol);
        const newRookSquare = getSquare(fromRow, newRookCol);
        newRookSquare.appendChild(rook);
        rook.dataset.hasMoved = true;
    }
    
    function isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
}); 