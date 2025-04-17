import { ChessModel } from '../models/ChessModel';
import { Position } from '../models/types';

export class GameController {
  private model: ChessModel;
  private viewUpdateCallbacks: Array<() => void> = [];

  constructor(model: ChessModel) {
    this.model = model;
    
    // Subscribe to model changes to propagate them to the view
    this.model.subscribe(() => this.notifyViewUpdate());
  }

  // Register a view to receive updates
  registerView(callback: () => void): () => void {
    this.viewUpdateCallbacks.push(callback);
    return () => {
      this.viewUpdateCallbacks = this.viewUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all registered views about updates
  private notifyViewUpdate(): void {
    this.viewUpdateCallbacks.forEach(callback => callback());
  }

  // Handle click on a square
  handleSquareClick(position: Position): void {
    const gameState = this.model.getGameState();
    const interactionState = this.model.getInteractionState();
    const { row, col } = position;
    const clickedPiece = gameState.board[row][col].piece;
    
    // If there's already a selected piece
    if (gameState.selectedPiece) {
      // If clicking on the same piece, deselect it
      if (gameState.selectedPiece.position.row === row && 
          gameState.selectedPiece.position.col === col) {
        this.model.deselectPiece();
      } 
      // If clicking on another piece of the same color, select that piece instead
      else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
        this.model.selectPiece(position);
      } 
      // Otherwise, try to move the selected piece to this position
      else {
        this.model.movePiece(position);
      }
    } 
    // No piece selected yet, try to select a piece
    else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
      this.model.selectPiece(position);
    }
  }

  // Handle hovering over a square
  handleSquareHover(position: Position): void {
    this.model.hoverSquare(position);
  }

  // Handle mouse leaving a square
  handleSquareLeave(): void {
    this.model.hoverSquare(null);
  }

  // Get the current game state from the model
  getGameState() {
    return this.model.getGameState();
  }

  // Get the current interaction state from the model
  getInteractionState() {
    return this.model.getInteractionState();
  }

  // Reset the game
  resetGame(): void {
    this.model.resetGame();
  }

  // Toggle threat indicators
  toggleThreatIndicators(): void {
    const interactionState = this.model.getInteractionState();
    interactionState.showThreats = !interactionState.showThreats;
    this.model.notifyChange();
  }
} 