import React from 'react';
import { Square } from '../models/types';
import ChessPiece from './ChessPiece';
import ThreatIndicator from './ThreatIndicator';
import './ChessSquare.css';

interface ChessSquareProps {
  square: Square;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  showThreats?: boolean;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  onClick,
  onMouseEnter,
  onMouseLeave,
  showThreats = true
}) => {
  const { row, col } = square.position;
  
  // Determine if this is a light or dark square
  const isLightSquare = (row + col) % 2 === 0;
  
  // Get the destination state for possible moves
  let destinationState = '';
  if (square.isPossibleMove) {
    if (square.isContestedDestination) {
      destinationState = 'contested';
    } else if (square.isThreatenedDestination) {
      destinationState = 'threatened';
    } else if (square.isProtectedDestination) {
      destinationState = 'protected';
    } else if (square.isNeutralDestination) {
      destinationState = 'neutral';
    }
  }
  
  // Build CSS classes for square states
  const squareClasses = [
    'chess-square',
    isLightSquare ? 'light-square' : 'dark-square',
    square.isSelected ? 'selected' : '',
    square.isLegalMove ? 'legal-move' : '',
    square.isPossibleMove ? 'possible-move' : '',
    destinationState, // Add the specific state class
    square.isCheck ? 'check' : '',
    square.isHovered ? 'hovered' : ''
  ].filter(Boolean).join(' ');

  // Determine if this square has any threats
  const hasThreat = square.whiteThreatCount > 0 || square.blackThreatCount > 0;

  return (
    <div 
      className={squareClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {square.piece && <ChessPiece piece={square.piece} />}
      
      {/* Visual indicators for different states */}
      {square.isLegalMove && !square.piece && <div className="legal-move-indicator" />}
      {square.isCheck && <div className="check-indicator" />}
      
      {/* Threat indicator */}
      {showThreats && hasThreat && 
        <ThreatIndicator 
          whiteThreatCount={square.whiteThreatCount}
          blackThreatCount={square.blackThreatCount}
        />
      }
    </div>
  );
};

export default ChessSquare; 