import React from 'react';
import { Piece, PieceType, PlayerColor } from '../models/types';
import './ChessPiece.css';

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  // Get the Unicode character for the piece
  const getPieceChar = (type: PieceType, color: PlayerColor): string => {
    if (color === PlayerColor.WHITE) {
      switch (type) {
        case PieceType.PAWN: return '♙';
        case PieceType.KNIGHT: return '♘';
        case PieceType.BISHOP: return '♗';
        case PieceType.ROOK: return '♖';
        case PieceType.QUEEN: return '♕';
        case PieceType.KING: return '♔';
        default: return '';
      }
    } else {
      switch (type) {
        case PieceType.PAWN: return '♟';
        case PieceType.KNIGHT: return '♞';
        case PieceType.BISHOP: return '♝';
        case PieceType.ROOK: return '♜';
        case PieceType.QUEEN: return '♛';
        case PieceType.KING: return '♚';
        default: return '';
      }
    }
  };

  const pieceChar = getPieceChar(piece.type, piece.color);
  
  // Add the 'threatened-piece' class if the piece is threatened
  const pieceClass = `chess-piece ${piece.color.toLowerCase()}-piece ${piece.isThreatened ? 'threatened-piece' : ''}`;

  return (
    <div className={pieceClass}>
      {pieceChar}
    </div>
  );
};

export default ChessPiece; 