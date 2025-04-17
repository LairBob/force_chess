import React from 'react';
import { Square, Position, InteractionState } from '../models/types';
import ChessSquare from './ChessSquare';
import './ChessBoardNew.css';
import ThreatIndicator from './ThreatIndicator';

interface ChessBoardProps {
  board: Square[][];
  interactionState: InteractionState;
  onSquareClick: (position: Position) => void;
  onSquareHover: (position: Position) => void;
  onSquareLeave: () => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  interactionState,
  onSquareClick,
  onSquareHover,
  onSquareLeave
}) => {
  // File labels for the board (a-h)
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  // Rank labels for the board (1-8)
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Get showThreats from interactionState
  const { showThreats } = interactionState;

  return (
    <div className="chess-board-container">
      <div className="file-labels">
        {files.map((file) => (
          <div key={file} className="label">{file}</div>
        ))}
      </div>
      
      <div className="board-with-ranks">
        <div className="rank-labels">
          {ranks.map((rank) => (
            <div key={rank} className="label">{rank}</div>
          ))}
        </div>
        
        <div className="chess-board">
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="board-row">
              {row.map((square, colIndex) => (
                <ChessSquare 
                  key={`square-${rowIndex}-${colIndex}`} 
                  square={square}
                  onClick={() => onSquareClick(square.position)}
                  onMouseEnter={() => onSquareHover(square.position)}
                  onMouseLeave={onSquareLeave}
                  showThreats={showThreats}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard; 