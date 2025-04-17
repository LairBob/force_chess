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
  
  // Determine piece state
  const isContested = piece.isThreatened && piece.isProtected;
  const isRoving = !piece.isThreatened && !piece.isProtected;
  
  // Build piece classes
  const pieceClasses = [
    'chess-piece',
    `${piece.color.toLowerCase()}-piece`,
    isContested ? 'contested-piece' : 
      piece.isThreatened ? 'threatened-piece' : 
      piece.isProtected ? 'protected-piece' : 
      isRoving ? 'roving-piece' : '',
    piece.isThreatener ? 'threatener-piece' : '',
    piece.isProtector ? 'protector-piece' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={pieceClasses}>
      {pieceChar}
    </div>
  );
};

export default ChessPiece; 