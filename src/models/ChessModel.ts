import { 
  GameState, 
  Piece, 
  PieceType, 
  PlayerColor, 
  Position, 
  Square, 
  Move,
  InteractionState
} from './types';

export class ChessModel {
  private gameState: GameState;
  private interactionState: InteractionState;
  private listeners: Array<() => void> = [];

  constructor() {
    // Initialize with a standard chess board setup
    this.gameState = this.setupNewGame();
    this.interactionState = {
      hoveredSquare: null,
      selectedSquare: null,
      legalMoves: [],
      showThreats: true // Enable threat indicators by default
    };
    
    // Calculate initial threats
    this.calculateAllThreats();
  }

  // Subscribe to model changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all subscribers of state changes
  notifyChange(): void {
    this.listeners.forEach(listener => listener());
  }

  // Get current game state
  getGameState(): GameState {
    return { ...this.gameState };
  }

  // Get interaction state
  getInteractionState(): InteractionState {
    return { ...this.interactionState };
  }

  // Set up a new game
  private setupNewGame(): GameState {
    const board: Square[][] = Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({
        position: { row, col },
        piece: null,
        isLegalMove: false,
        isSelected: false,
        isCheck: false,
        isHovered: false,
        whiteThreatCount: 0,
        blackThreatCount: 0
      }))
    );

    // Place the pieces on the board
    this.setupPieces(board);

    return {
      board,
      currentPlayer: PlayerColor.WHITE,
      selectedPiece: null,
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      moveHistory: [],
      capturedPieces: []
    };
  }

  // Set up the initial pieces on the board
  private setupPieces(board: Square[][]): void {
    // Set up pawns
    for (let col = 0; col < 8; col++) {
      // White pawns (row 6)
      board[6][col].piece = {
        id: `white-pawn-${col}`,
        type: PieceType.PAWN,
        color: PlayerColor.WHITE,
        position: { row: 6, col },
        hasMoved: false
      };

      // Black pawns (row 1)
      board[1][col].piece = {
        id: `black-pawn-${col}`,
        type: PieceType.PAWN,
        color: PlayerColor.BLACK,
        position: { row: 1, col },
        hasMoved: false
      };
    }

    // Set up rooks
    board[7][0].piece = {
      id: 'white-rook-0',
      type: PieceType.ROOK,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 0 },
      hasMoved: false
    };
    board[7][7].piece = {
      id: 'white-rook-1',
      type: PieceType.ROOK,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 7 },
      hasMoved: false
    };
    board[0][0].piece = {
      id: 'black-rook-0',
      type: PieceType.ROOK,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 0 },
      hasMoved: false
    };
    board[0][7].piece = {
      id: 'black-rook-1',
      type: PieceType.ROOK,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 7 },
      hasMoved: false
    };

    // Set up knights
    board[7][1].piece = {
      id: 'white-knight-0',
      type: PieceType.KNIGHT,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 1 },
      hasMoved: false
    };
    board[7][6].piece = {
      id: 'white-knight-1',
      type: PieceType.KNIGHT,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 6 },
      hasMoved: false
    };
    board[0][1].piece = {
      id: 'black-knight-0',
      type: PieceType.KNIGHT,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 1 },
      hasMoved: false
    };
    board[0][6].piece = {
      id: 'black-knight-1',
      type: PieceType.KNIGHT,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 6 },
      hasMoved: false
    };

    // Set up bishops
    board[7][2].piece = {
      id: 'white-bishop-0',
      type: PieceType.BISHOP,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 2 },
      hasMoved: false
    };
    board[7][5].piece = {
      id: 'white-bishop-1',
      type: PieceType.BISHOP,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 5 },
      hasMoved: false
    };
    board[0][2].piece = {
      id: 'black-bishop-0',
      type: PieceType.BISHOP,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 2 },
      hasMoved: false
    };
    board[0][5].piece = {
      id: 'black-bishop-1',
      type: PieceType.BISHOP,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 5 },
      hasMoved: false
    };

    // Set up queens
    board[7][3].piece = {
      id: 'white-queen',
      type: PieceType.QUEEN,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 3 },
      hasMoved: false
    };
    board[0][3].piece = {
      id: 'black-queen',
      type: PieceType.QUEEN,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 3 },
      hasMoved: false
    };

    // Set up kings
    board[7][4].piece = {
      id: 'white-king',
      type: PieceType.KING,
      color: PlayerColor.WHITE,
      position: { row: 7, col: 4 },
      hasMoved: false
    };
    board[0][4].piece = {
      id: 'black-king',
      type: PieceType.KING,
      color: PlayerColor.BLACK,
      position: { row: 0, col: 4 },
      hasMoved: false
    };
  }

  // Select a piece
  selectPiece(position: Position): void {
    const { row, col } = position;
    const piece = this.gameState.board[row][col].piece;
    
    // Can only select pieces of the current player
    if (piece && piece.color === this.gameState.currentPlayer) {
      // Update the game state
      this.gameState.selectedPiece = piece;
      
      // Update the interaction state
      this.interactionState.selectedSquare = position;
      this.interactionState.legalMoves = this.calculateLegalMoves(piece);
      
      // Mark legal moves on the board
      this.updateBoardVisuals();
      
      this.notifyChange();
    }
  }

  // Deselect the currently selected piece
  deselectPiece(): void {
    this.gameState.selectedPiece = null;
    this.interactionState.selectedSquare = null;
    this.interactionState.legalMoves = [];
    
    // Clear all visual indicators on the board
    this.updateBoardVisuals();
    
    this.notifyChange();
  }

  // Hover over a square
  hoverSquare(position: Position | null): void {
    this.interactionState.hoveredSquare = position;
    this.updateBoardVisuals();
    this.notifyChange();
  }

  // Move a piece
  movePiece(to: Position): boolean {
    const selectedPiece = this.gameState.selectedPiece;
    
    if (!selectedPiece) return false;
    
    const isLegalMove = this.interactionState.legalMoves.some(
      move => move.row === to.row && move.col === to.col
    );
    
    if (!isLegalMove) return false;
    
    const from = selectedPiece.position;
    const capturedPiece = this.gameState.board[to.row][to.col].piece;
    
    // Create a move object for the history
    const move: Move = {
      piece: { ...selectedPiece },
      from: { ...from },
      to: { ...to }
    };
    
    if (capturedPiece) {
      move.capturedPiece = { ...capturedPiece };
      this.gameState.capturedPieces.push({ ...capturedPiece });
    }
    
    // Handle castling
    if (selectedPiece.type === PieceType.KING && Math.abs(from.col - to.col) === 2) {
      // This is a castling move
      move.isCastle = true;
      
      // Move the rook as well
      const isKingsideCastle = to.col > from.col;
      const rookCol = isKingsideCastle ? 7 : 0;
      const rookToCol = isKingsideCastle ? from.col + 1 : from.col - 1;
      
      const rook = this.gameState.board[from.row][rookCol].piece;
      if (rook) {
        rook.position = { row: from.row, col: rookToCol };
        rook.hasMoved = true;
        this.gameState.board[from.row][rookCol].piece = null;
        this.gameState.board[from.row][rookToCol].piece = rook;
      }
    }
    
    // Handle en passant
    if (selectedPiece.type === PieceType.PAWN && from.col !== to.col && !capturedPiece) {
      // This is a diagonal pawn move without a capture - must be en passant
      move.isEnPassant = true;
      
      // Capture the pawn that moved two squares
      const captureRow = from.row;
      const captureCol = to.col;
      const enPassantPiece = this.gameState.board[captureRow][captureCol].piece;
      
      if (enPassantPiece && enPassantPiece.type === PieceType.PAWN) {
        move.capturedPiece = { ...enPassantPiece };
        this.gameState.capturedPieces.push({ ...enPassantPiece });
        this.gameState.board[captureRow][captureCol].piece = null;
      }
    }
    
    // Handle pawn promotion at the end ranks
    if (selectedPiece.type === PieceType.PAWN && (to.row === 0 || to.row === 7)) {
      move.isPromotion = true;
      move.promotedTo = PieceType.QUEEN; // Default promotion to queen
      
      // Update the piece to a queen
      selectedPiece.type = PieceType.QUEEN;
    }
    
    // Update the board
    this.gameState.board[from.row][from.col].piece = null;
    selectedPiece.position = { ...to };
    selectedPiece.hasMoved = true;
    this.gameState.board[to.row][to.col].piece = selectedPiece;
    
    // Add the move to history
    this.gameState.moveHistory.push(move);
    
    // Switch the current player
    this.gameState.currentPlayer = 
      this.gameState.currentPlayer === PlayerColor.WHITE 
        ? PlayerColor.BLACK 
        : PlayerColor.WHITE;
    
    // Clear selection and update visuals
    this.deselectPiece();
    
    // Check for check, checkmate, or stalemate
    this.updateGameStatus();
    
    // Calculate threats after the move
    this.calculateAllThreats();
    
    return true;
  }

  // Calculate legal moves for a piece (simplified implementation)
  private calculateLegalMoves(piece: Piece): Position[] {
    const legalMoves: Position[] = [];
    const { row, col } = piece.position;
    
    switch (piece.type) {
      case PieceType.PAWN:
        // Pawns move differently based on color
        if (piece.color === PlayerColor.WHITE) {
          // White pawns move up (decreasing row)
          // Regular move
          if (row > 0 && !this.gameState.board[row - 1][col].piece) {
            legalMoves.push({ row: row - 1, col });
            
            // Double move from starting position
            if (row === 6 && !this.gameState.board[row - 2][col].piece) {
              legalMoves.push({ row: row - 2, col });
            }
          }
          
          // Captures
          if (row > 0 && col > 0) {
            const targetPiece = this.gameState.board[row - 1][col - 1].piece;
            if (targetPiece && targetPiece.color !== piece.color) {
              legalMoves.push({ row: row - 1, col: col - 1 });
            }
          }
          
          if (row > 0 && col < 7) {
            const targetPiece = this.gameState.board[row - 1][col + 1].piece;
            if (targetPiece && targetPiece.color !== piece.color) {
              legalMoves.push({ row: row - 1, col: col + 1 });
            }
          }
          
          // En passant
          if (row === 3) { // White pawns can en passant on row 3
            // Check last move in history
            const lastMove = this.gameState.moveHistory[this.gameState.moveHistory.length - 1];
            if (lastMove && 
                lastMove.piece.type === PieceType.PAWN && 
                lastMove.piece.color === PlayerColor.BLACK &&
                lastMove.from.row === 1 && 
                lastMove.to.row === 3 &&
                Math.abs(lastMove.to.col - col) === 1) {
              // This is an en passant opportunity
              legalMoves.push({ row: row - 1, col: lastMove.to.col });
            }
          }
        } else {
          // Black pawns move down (increasing row)
          // Regular move
          if (row < 7 && !this.gameState.board[row + 1][col].piece) {
            legalMoves.push({ row: row + 1, col });
            
            // Double move from starting position
            if (row === 1 && !this.gameState.board[row + 2][col].piece) {
              legalMoves.push({ row: row + 2, col });
            }
          }
          
          // Captures
          if (row < 7 && col > 0) {
            const targetPiece = this.gameState.board[row + 1][col - 1].piece;
            if (targetPiece && targetPiece.color !== piece.color) {
              legalMoves.push({ row: row + 1, col: col - 1 });
            }
          }
          
          if (row < 7 && col < 7) {
            const targetPiece = this.gameState.board[row + 1][col + 1].piece;
            if (targetPiece && targetPiece.color !== piece.color) {
              legalMoves.push({ row: row + 1, col: col + 1 });
            }
          }
          
          // En passant
          if (row === 4) { // Black pawns can en passant on row 4
            // Check last move in history
            const lastMove = this.gameState.moveHistory[this.gameState.moveHistory.length - 1];
            if (lastMove && 
                lastMove.piece.type === PieceType.PAWN && 
                lastMove.piece.color === PlayerColor.WHITE &&
                lastMove.from.row === 6 && 
                lastMove.to.row === 4 &&
                Math.abs(lastMove.to.col - col) === 1) {
              // This is an en passant opportunity
              legalMoves.push({ row: row + 1, col: lastMove.to.col });
            }
          }
        }
        break;
        
      case PieceType.KNIGHT:
        // Knights move in an L-shape
        const knightMoves = [
          { row: row - 2, col: col - 1 }, { row: row - 2, col: col + 1 },
          { row: row - 1, col: col - 2 }, { row: row - 1, col: col + 2 },
          { row: row + 1, col: col - 2 }, { row: row + 1, col: col + 2 },
          { row: row + 2, col: col - 1 }, { row: row + 2, col: col + 1 }
        ];
        
        for (const move of knightMoves) {
          if (this.isValidPosition(move) && 
             (!this.gameState.board[move.row][move.col].piece || 
               this.gameState.board[move.row][move.col].piece?.color !== piece.color)) {
            legalMoves.push(move);
          }
        }
        break;
        
      case PieceType.BISHOP:
        // Bishops move diagonally
        this.addDiagonalMoves(piece, legalMoves);
        break;
        
      case PieceType.ROOK:
        // Rooks move horizontally and vertically
        this.addStraightMoves(piece, legalMoves);
        break;
        
      case PieceType.QUEEN:
        // Queens move both diagonally and straight
        this.addDiagonalMoves(piece, legalMoves);
        this.addStraightMoves(piece, legalMoves);
        break;
        
      case PieceType.KING:
        // Kings move one square in any direction
        for (let r = Math.max(0, row - 1); r <= Math.min(7, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
            // Skip the king's own position
            if (r === row && c === col) continue;
            
            // Check if the square is empty or has an enemy piece
            if (!this.gameState.board[r][c].piece || 
                this.gameState.board[r][c].piece?.color !== piece.color) {
              legalMoves.push({ row: r, col: c });
            }
          }
        }
        
        // Castling
        if (!piece.hasMoved && !this.gameState.isCheck) {
          // Kingside castling
          if (this.canCastle(piece, true)) {
            legalMoves.push({ row: row, col: col + 2 });
          }
          
          // Queenside castling
          if (this.canCastle(piece, false)) {
            legalMoves.push({ row: row, col: col - 2 });
          }
        }
        break;
    }
    
    return legalMoves;
  }
  
  // Helper method to add diagonal moves (for bishop and queen)
  private addDiagonalMoves(piece: Piece, legalMoves: Position[]): void {
    const { row, col } = piece.position;
    
    // Four diagonal directions
    const directions = [
      { rowDir: -1, colDir: -1 }, // top left
      { rowDir: -1, colDir: 1 },  // top right
      { rowDir: 1, colDir: -1 },  // bottom left
      { rowDir: 1, colDir: 1 }    // bottom right
    ];
    
    for (const dir of directions) {
      let r = row + dir.rowDir;
      let c = col + dir.colDir;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const targetPiece = this.gameState.board[r][c].piece;
        
        if (!targetPiece) {
          // Empty square
          legalMoves.push({ row: r, col: c });
        } else {
          // Square has a piece
          if (targetPiece.color !== piece.color) {
            // Enemy piece - can capture
            legalMoves.push({ row: r, col: c });
          }
          // Stop at any piece (friendly or enemy)
          break;
        }
        
        r += dir.rowDir;
        c += dir.colDir;
      }
    }
  }
  
  // Helper method to add straight moves (for rook and queen)
  private addStraightMoves(piece: Piece, legalMoves: Position[]): void {
    const { row, col } = piece.position;
    
    // Four straight directions
    const directions = [
      { rowDir: -1, colDir: 0 }, // up
      { rowDir: 1, colDir: 0 },  // down
      { rowDir: 0, colDir: -1 }, // left
      { rowDir: 0, colDir: 1 }   // right
    ];
    
    for (const dir of directions) {
      let r = row + dir.rowDir;
      let c = col + dir.colDir;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const targetPiece = this.gameState.board[r][c].piece;
        
        if (!targetPiece) {
          // Empty square
          legalMoves.push({ row: r, col: c });
        } else {
          // Square has a piece
          if (targetPiece.color !== piece.color) {
            // Enemy piece - can capture
            legalMoves.push({ row: r, col: c });
          }
          // Stop at any piece (friendly or enemy)
          break;
        }
        
        r += dir.rowDir;
        c += dir.colDir;
      }
    }
  }
  
  // Helper method to check if castling is allowed
  private canCastle(king: Piece, isKingside: boolean): boolean {
    if (king.hasMoved) return false;
    
    const row = king.position.row;
    const col = king.position.col;
    
    // Check if rook has moved
    const rookCol = isKingside ? 7 : 0;
    const rook = this.gameState.board[row][rookCol].piece;
    
    if (!rook || rook.type !== PieceType.ROOK || rook.hasMoved) {
      return false;
    }
    
    // Check if squares between king and rook are empty
    const start = isKingside ? col + 1 : 1;
    const end = isKingside ? rookCol - 1 : col - 1;
    
    for (let c = start; c <= end; c++) {
      if (this.gameState.board[row][c].piece) {
        return false;
      }
    }
    
    // Check if king would move through or into check
    const kingMoveCol = isKingside ? col + 1 : col - 1;
    const kingDestCol = isKingside ? col + 2 : col - 2;
    
    // Check if squares king moves through or to are under attack
    for (let c = kingMoveCol; c <= kingDestCol; c++) {
      if (this.isSquareUnderAttack({ row, col: c }, king.color)) {
        return false;
      }
    }
    
    return true;
  }
  
  // Helper method to check if a square is under attack by the opponent
  private isSquareUnderAttack(position: Position, playerColor: PlayerColor): boolean {
    const { row, col } = position;
    
    if (playerColor === PlayerColor.WHITE) {
      return this.gameState.board[row][col].blackThreatCount > 0;
    } else {
      return this.gameState.board[row][col].whiteThreatCount > 0;
    }
  }

  // Check if a position is valid (within the board)
  private isValidPosition(position: Position): boolean {
    const { row, col } = position;
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // Update the visual state of the board
  private updateBoardVisuals(): void {
    // Reset all visual states
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.gameState.board[row][col];
        square.isSelected = false;
        square.isLegalMove = false;
        square.isHovered = false;
      }
    }
    
    // Mark selected square
    if (this.interactionState.selectedSquare) {
      const { row, col } = this.interactionState.selectedSquare;
      this.gameState.board[row][col].isSelected = true;
    }
    
    // Mark legal moves
    for (const move of this.interactionState.legalMoves) {
      this.gameState.board[move.row][move.col].isLegalMove = true;
    }
    
    // Mark hovered square
    if (this.interactionState.hoveredSquare) {
      const { row, col } = this.interactionState.hoveredSquare;
      this.gameState.board[row][col].isHovered = true;
    }
  }

  // Update game status (check, checkmate, stalemate)
  private updateGameStatus(): void {
    const currentPlayerColor = this.gameState.currentPlayer;
    
    // Find the current player's king
    let kingPosition: Position | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.gameState.board[row][col].piece;
        if (piece && piece.type === PieceType.KING && piece.color === currentPlayerColor) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) break;
    }
    
    if (!kingPosition) return; // Should never happen in a valid game
    
    // Determine if the king is in check
    const isInCheck = this.isSquareUnderAttack(kingPosition, currentPlayerColor);
    this.gameState.isCheck = isInCheck;
    
    // Mark the king's square as being in check
    this.gameState.board[kingPosition.row][kingPosition.col].isCheck = isInCheck;
    
    // Check if the current player has any legal moves
    let hasLegalMoves = false;
    
    // Check each of the current player's pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.gameState.board[row][col].piece;
        if (piece && piece.color === currentPlayerColor) {
          // Calculate legal moves for this piece
          const moves = this.calculateLegalMoves(piece);
          if (moves.length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }
      if (hasLegalMoves) break;
    }
    
    // Update checkmate and stalemate status
    this.gameState.isCheckmate = isInCheck && !hasLegalMoves;
    this.gameState.isStalemate = !isInCheck && !hasLegalMoves;
    
    // Update the last move in history with check and checkmate flags
    const lastMoveIndex = this.gameState.moveHistory.length - 1;
    if (lastMoveIndex >= 0) {
      const lastMove = this.gameState.moveHistory[lastMoveIndex];
      lastMove.isCheck = isInCheck;
      lastMove.isCheckmate = this.gameState.isCheckmate;
    }
  }

  // Reset the game
  resetGame(): void {
    this.gameState = this.setupNewGame();
    this.interactionState = {
      hoveredSquare: null,
      selectedSquare: null,
      legalMoves: [],
      showThreats: true
    };
    
    // Calculate threats for the new game
    this.calculateAllThreats();
    
    this.notifyChange();
  }

  // Replace the existing calculation methods with these improved ones
  /**
   * Calculate threats for all squares on the board
   */
  private calculateAllThreats(): void {
    const board = this.gameState.board;
    
    // Reset all threat counts and threatened status
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        board[row][col].whiteThreatCount = 0;
        board[row][col].blackThreatCount = 0;
        // Reset threatened status for pieces
        if (board[row][col].piece) {
          board[row][col].piece.isThreatened = false;
        }
      }
    }
    
    // Calculate threats from each piece
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col].piece;
        if (piece) {
          // Get threatened squares for this piece
          const threatSquares = this.getThreatSquares(piece);
          
          // Update threat counts
          for (const pos of threatSquares) {
            // Don't count as threat if the square has a piece of the same color
            const targetPiece = board[pos.row][pos.col].piece;
            if (targetPiece && targetPiece.color === piece.color) {
              continue; // Skip counting threats to pieces of same color
            }
            
            if (piece.color === PlayerColor.WHITE) {
              board[pos.row][pos.col].whiteThreatCount++;
              // Mark black pieces as threatened
              if (targetPiece && targetPiece.color === PlayerColor.BLACK) {
                targetPiece.isThreatened = true;
              }
            } else {
              board[pos.row][pos.col].blackThreatCount++;
              // Mark white pieces as threatened
              if (targetPiece && targetPiece.color === PlayerColor.WHITE) {
                targetPiece.isThreatened = true;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Get all squares threatened by a piece
   */
  private getThreatSquares(piece: Piece): Position[] {
    const threatSquares: Position[] = [];
    const { row, col } = piece.position;
    
    switch (piece.type) {
      case PieceType.PAWN:
        // Pawns only threaten diagonally
        this.addPawnThreats(piece, threatSquares);
        break;
        
      case PieceType.KNIGHT:
        // Knights can jump over pieces
        this.addKnightThreats(piece, threatSquares);
        break;
        
      case PieceType.BISHOP:
        // Bishops move diagonally
        this.addBishopThreats(piece, threatSquares);
        break;
        
      case PieceType.ROOK:
        // Rooks move horizontally and vertically
        this.addRookThreats(piece, threatSquares);
        break;
        
      case PieceType.QUEEN:
        // Queens move both like bishops and rooks
        this.addBishopThreats(piece, threatSquares);
        this.addRookThreats(piece, threatSquares);
        break;
        
      case PieceType.KING:
        // Kings threaten adjacent squares
        this.addKingThreats(piece, threatSquares);
        break;
    }
    
    return threatSquares;
  }

  /**
   * Add squares threatened by a pawn
   */
  private addPawnThreats(piece: Piece, threatSquares: Position[]): void {
    const { row, col } = piece.position;
    
    if (piece.color === PlayerColor.WHITE) {
      // White pawns threaten diagonally upward
      if (row > 0) {
        if (col > 0) {
          threatSquares.push({ row: row - 1, col: col - 1 });
        }
        if (col < 7) {
          threatSquares.push({ row: row - 1, col: col + 1 });
        }
      }
    } else {
      // Black pawns threaten diagonally downward
      if (row < 7) {
        if (col > 0) {
          threatSquares.push({ row: row + 1, col: col - 1 });
        }
        if (col < 7) {
          threatSquares.push({ row: row + 1, col: col + 1 });
        }
      }
    }
  }

  /**
   * Add squares threatened by a knight
   */
  private addKnightThreats(piece: Piece, threatSquares: Position[]): void {
    const { row, col } = piece.position;
    
    // All possible knight moves
    const moves = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 }
    ];
    
    // Add valid moves to threat squares
    for (const move of moves) {
      if (this.isValidPosition(move)) {
        threatSquares.push(move);
      }
    }
  }

  /**
   * Add squares threatened by a bishop
   */
  private addBishopThreats(piece: Piece, threatSquares: Position[]): void {
    const { row, col } = piece.position;
    
    // Four diagonal directions
    const directions = [
      { rowDir: -1, colDir: -1 }, // top left
      { rowDir: -1, colDir: 1 },  // top right
      { rowDir: 1, colDir: -1 },  // bottom left
      { rowDir: 1, colDir: 1 }    // bottom right
    ];
    
    for (const dir of directions) {
      let r = row + dir.rowDir;
      let c = col + dir.colDir;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        threatSquares.push({ row: r, col: c });
        
        // Stop at first piece encountered (but that square is still threatened)
        if (this.gameState.board[r][c].piece) {
          break;
        }
        
        r += dir.rowDir;
        c += dir.colDir;
      }
    }
  }

  /**
   * Add squares threatened by a rook
   */
  private addRookThreats(piece: Piece, threatSquares: Position[]): void {
    const { row, col } = piece.position;
    
    // Four orthogonal directions
    const directions = [
      { rowDir: -1, colDir: 0 }, // up
      { rowDir: 1, colDir: 0 },  // down
      { rowDir: 0, colDir: -1 }, // left
      { rowDir: 0, colDir: 1 }   // right
    ];
    
    for (const dir of directions) {
      let r = row + dir.rowDir;
      let c = col + dir.colDir;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        threatSquares.push({ row: r, col: c });
        
        // Stop at first piece encountered (but that square is still threatened)
        if (this.gameState.board[r][c].piece) {
          break;
        }
        
        r += dir.rowDir;
        c += dir.colDir;
      }
    }
  }

  /**
   * Add squares threatened by a king
   */
  private addKingThreats(piece: Piece, threatSquares: Position[]): void {
    const { row, col } = piece.position;
    
    // Check all 8 adjacent squares
    for (let r = Math.max(0, row - 1); r <= Math.min(7, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
        // Skip the king's own position
        if (r !== row || c !== col) {
          threatSquares.push({ row: r, col: c });
        }
      }
    }
  }
} 