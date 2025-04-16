/**
 * Chess Model - Handles game logic and state
 * Maintains the state of the chess game including board positions,
 * valid moves, check/checkmate status, and game rules.
 */
class ChessModel {
    constructor() {
        this.board = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.gameStatus = 'active'; // active, check, checkmate, stalemate
        this.gameOver = false;
        this.selectedPiece = null;
    }

    createInitialBoard() {
        // Create 8x8 board with initial chess position
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Set up pawns
        for (let col = 0; col < 8; col++) {
            board[1][col] = { type: 'pawn', color: 'black' };
            board[6][col] = { type: 'pawn', color: 'white' };
        }
        
        // Set up other pieces
        const backRankOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let col = 0; col < 8; col++) {
            board[0][col] = { type: backRankOrder[col], color: 'black' };
            board[7][col] = { type: backRankOrder[col], color: 'white' };
        }
        
        return board;
    }

    getPieceAt(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.board[row][col];
    }

    isSquareEmpty(row, col) {
        return this.getPieceAt(row, col) === null;
    }

    getValidMoves(row, col) {
        const piece = this.getPieceAt(row, col);
        if (!piece || piece.color !== this.currentPlayer) return [];
        
        const moves = [];
        
        switch (piece.type) {
            case 'pawn':
                this.getValidPawnMoves(row, col, piece.color, moves);
                break;
            case 'rook':
                this.getValidRookMoves(row, col, piece.color, moves);
                break;
            case 'knight':
                this.getValidKnightMoves(row, col, piece.color, moves);
                break;
            case 'bishop':
                this.getValidBishopMoves(row, col, piece.color, moves);
                break;
            case 'queen':
                this.getValidQueenMoves(row, col, piece.color, moves);
                break;
            case 'king':
                this.getValidKingMoves(row, col, piece.color, moves);
                break;
        }
        
        // Filter out moves that would put the king in check
        return this.filterMovesForCheck(row, col, moves);
    }

    getValidPawnMoves(row, col, color, moves) {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        // Forward move
        if (this.isSquareEmpty(row + direction, col)) {
            moves.push({ row: row + direction, col });
            
            // Double move from starting position
            if (row === startRow && this.isSquareEmpty(row + 2 * direction, col)) {
                moves.push({ row: row + 2 * direction, col });
            }
        }
        
        // Capture moves
        for (let offset of [-1, 1]) {
            const captureCol = col + offset;
            if (captureCol >= 0 && captureCol <= 7) {
                const targetPiece = this.getPieceAt(row + direction, captureCol);
                if (targetPiece && targetPiece.color !== color) {
                    moves.push({ row: row + direction, col: captureCol });
                }
            }
        }
        
        // TODO: Add en passant and promotion
    }

    getValidRookMoves(row, col, color, moves) {
        // Check horizontal and vertical lines
        const directions = [
            {dr: -1, dc: 0}, // up
            {dr: 1, dc: 0},  // down
            {dr: 0, dc: -1}, // left
            {dr: 0, dc: 1}   // right
        ];
        
        for (let dir of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dir.dr;
                const newCol = col + i * dir.dc;
                
                if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
                
                const targetPiece = this.getPieceAt(newRow, newCol);
                if (!targetPiece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (targetPiece.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
    }

    getValidKnightMoves(row, col, color, moves) {
        const knightMoves = [
            {dr: -2, dc: -1}, {dr: -2, dc: 1},
            {dr: -1, dc: -2}, {dr: -1, dc: 2},
            {dr: 1, dc: -2}, {dr: 1, dc: 2},
            {dr: 2, dc: -1}, {dr: 2, dc: 1}
        ];
        
        for (let move of knightMoves) {
            const newRow = row + move.dr;
            const newCol = col + move.dc;
            
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
            
            const targetPiece = this.getPieceAt(newRow, newCol);
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    getValidBishopMoves(row, col, color, moves) {
        // Check diagonal lines
        const directions = [
            {dr: -1, dc: -1}, // up-left
            {dr: -1, dc: 1},  // up-right
            {dr: 1, dc: -1},  // down-left
            {dr: 1, dc: 1}    // down-right
        ];
        
        for (let dir of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dir.dr;
                const newCol = col + i * dir.dc;
                
                if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
                
                const targetPiece = this.getPieceAt(newRow, newCol);
                if (!targetPiece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (targetPiece.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
    }

    getValidQueenMoves(row, col, color, moves) {
        // Queen combines rook and bishop moves
        this.getValidRookMoves(row, col, color, moves);
        this.getValidBishopMoves(row, col, color, moves);
    }

    getValidKingMoves(row, col, color, moves) {
        const kingMoves = [
            {dr: -1, dc: -1}, {dr: -1, dc: 0}, {dr: -1, dc: 1},
            {dr: 0, dc: -1}, {dr: 0, dc: 1},
            {dr: 1, dc: -1}, {dr: 1, dc: 0}, {dr: 1, dc: 1}
        ];
        
        for (let move of kingMoves) {
            const newRow = row + move.dr;
            const newCol = col + move.dc;
            
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
            
            const targetPiece = this.getPieceAt(newRow, newCol);
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
        
        // TODO: Add castling
    }

    filterMovesForCheck(row, col, moves) {
        // TODO: Implement check filtering logic
        return moves;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPieceAt(fromRow, fromCol);
        if (!piece) return false;
        
        // Check if move is valid
        const validMoves = this.getValidMoves(fromRow, fromCol);
        const isValidMove = validMoves.some(move => move.row === toRow && move.col === toCol);
        if (!isValidMove) return false;
        
        // Handle capture
        const capturedPiece = this.getPieceAt(toRow, toCol);
        if (capturedPiece) {
            this.capturedPieces[piece.color].push(capturedPiece);
        }
        
        // Update board
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Record move history in algebraic notation
        const files = 'abcdefgh';
        const ranks = '87654321';
        const moveNotation = `${piece.type.charAt(0).toUpperCase()}${files[fromCol]}${ranks[fromRow]} → ${files[toCol]}${ranks[toRow]}`;
        this.moveHistory.push(moveNotation);
        
        // Switch current player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Update game status (check/checkmate)
        this.updateGameStatus();
        
        return true;
    }

    updateGameStatus() {
        // TODO: Implement check and checkmate logic
        // For now just return active
        this.gameStatus = 'active';
    }

    isGameOver() {
        return this.gameStatus === 'checkmate' || this.gameStatus === 'stalemate';
    }

    getBoard() {
        return this.board;
    }
    
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        
        if (!piece || piece.color !== this.currentPlayer) {
            return false;
        }
        
        const validMoves = this.getValidMoves(fromRow, fromCol);
        const isValidMove = validMoves.some(move => move.row === toRow && move.col === toCol);
        
        if (!isValidMove) {
            return false;
        }
        
        // Store move for undo functionality
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: this.board[toRow][toCol]
        });
        
        // Execute the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // In a real chess engine, we would check for check, checkmate, etc. here
        
        return true;
    }
    
    undoLastMove() {
        if (this.moveHistory.length === 0) {
            return false;
        }
        
        const lastMove = this.moveHistory.pop();
        
        // Restore the board to the previous state
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
        
        // Switch back to the previous player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        return true;
    }
    
    resetGame() {
        this.board = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.gameOver = false;
        this.selectedPiece = null;
    }
}

// Export the model class
window.ChessModel = ChessModel; 