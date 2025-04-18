import React from 'react';
import { Square, Piece, PlayerColor } from '../models/types';
import ChessPiece from './ChessPiece';
import ThreatIndicator from './ThreatIndicator';
import './ChessSquare.css';

interface ChessSquareProps {
  square: Square;
  isSelected?: boolean;
  showThreats?: boolean;
  onClick: (square: Square) => void;
  onMouseEnter: (square: Square) => void;
  onMouseLeave?: () => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  isSelected = false,
  showThreats = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Determine the CSS classes to apply to the square
  const getSquareClasses = (): string => {
    const classes = ['chess-square'];
    
    // Add color class based on square color
    classes.push(square.color === PlayerColor.WHITE ? 'white-square' : 'black-square');
    
    // Add selected class if the square is selected
    if (isSelected) {
      classes.push('selected-square');
    }
    
    return classes.join(' ');
  };

  const handleClick = () => {
    onClick(square);
  };

  const handleMouseEnter = () => {
    onMouseEnter(square);
  };

  return (
    <div
      className={getSquareClasses()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      data-square-id={`${square.file}${square.rank}`}
    >
      {square.hasPiece && square.piece && (
        <ChessPiece piece={square.piece} />
      )}
      
      {showThreats && (
        <ThreatIndicator
          whiteThreatCount={square.whiteThreatCount}
          blackThreatCount={square.blackThreatCount}
        />
      )}
    </div>
  );
};

export default ChessSquare; 