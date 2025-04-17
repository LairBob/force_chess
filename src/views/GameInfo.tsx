import React from 'react';
import { PlayerColor, Move, Piece } from '../models/types';
import './GameInfo.css';

interface GameInfoProps {
  currentPlayer: PlayerColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moveHistory: Move[];
  capturedPieces: Piece[];
  onResetGame: () => void;
  showThreats: boolean;
  onToggleThreats: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  isCheck,
  isCheckmate,
  isStalemate,
  moveHistory,
  capturedPieces,
  onResetGame,
  showThreats,
  onToggleThreats
}) => {
  // Format a move for display in the move history
  const formatMove = (move: Move, index: number): string => {
    const pieceSymbol = move.piece.type.charAt(0).toUpperCase();
    const from = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`;
    const to = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;
    
    let notation = `${pieceSymbol}${from}-${to}`;
    
    if (move.capturedPiece) {
      notation += 'x';
    }
    
    if (move.isCheck) {
      notation += '+';
    }
    
    if (move.isCheckmate) {
      notation += '#';
    }
    
    return `${Math.floor(index / 2) + 1}${index % 2 === 0 ? '.' : '...'} ${notation}`;
  };

  // Get game status message
  const getStatusMessage = (): string => {
    if (isCheckmate) {
      const winner = currentPlayer === PlayerColor.WHITE ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    } else if (isStalemate) {
      return 'Stalemate! The game is a draw.';
    } else if (isCheck) {
      return `${currentPlayer} is in check!`;
    } else {
      return `${currentPlayer}'s turn`;
    }
  };

  return (
    <div className="game-info">
      <div className="game-status">
        <h2>{getStatusMessage()}</h2>
      </div>
      
      <div className="button-row">
        <button className="game-button" onClick={onResetGame}>
          New Game
        </button>
        <button className="game-button" onClick={onToggleThreats}>
          {showThreats ? 'Hide Threats' : 'Show Threats'}
        </button>
      </div>
      
      <div className="captured-pieces">
        <h3>Captured Pieces</h3>
        <div className="captured-pieces-list">
          <div className="white-captured">
            {capturedPieces
              .filter(piece => piece.color === PlayerColor.WHITE)
              .map((piece, i) => (
                <span key={`white-captured-${i}`} className="captured-piece">
                  {piece.type.charAt(0).toUpperCase()}
                </span>
              ))}
          </div>
          <div className="black-captured">
            {capturedPieces
              .filter(piece => piece.color === PlayerColor.BLACK)
              .map((piece, i) => (
                <span key={`black-captured-${i}`} className="captured-piece">
                  {piece.type.charAt(0).toUpperCase()}
                </span>
              ))}
          </div>
        </div>
      </div>
      
      <div className="move-history">
        <h3>Move History</h3>
        <div className="move-list">
          {moveHistory.map((move, index) => (
            <div key={`move-${index}`} className="move-item">
              {formatMove(move, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameInfo; 