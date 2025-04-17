// Chess piece types
export enum PieceType {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king'
}

// Player colors
export enum PlayerColor {
  WHITE = 'white',
  BLACK = 'black'
}

// Board position represented as row and column
export interface Position {
  row: number;
  col: number;
}

// Chess piece representation
export interface Piece {
  id: string;
  type: PieceType;
  color: PlayerColor;
  position: Position;
  hasMoved: boolean;
}

// Square state on the board
export interface Square {
  position: Position;
  piece: Piece | null;
  isLegalMove: boolean;
  isSelected: boolean;
  isCheck: boolean;
  isHovered: boolean;
  whiteThreatCount: number; // Number of white pieces threatening this square
  blackThreatCount: number; // Number of black pieces threatening this square
}

// Game state
export interface GameState {
  board: Square[][];
  currentPlayer: PlayerColor;
  selectedPiece: Piece | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moveHistory: Move[];
  capturedPieces: Piece[];
}

// Move representation
export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isPromotion?: boolean;
  promotedTo?: PieceType;
  isCastle?: boolean;
  isEnPassant?: boolean;
}

// UI Interaction state
export interface InteractionState {
  hoveredSquare: Position | null;
  selectedSquare: Position | null;
  legalMoves: Position[];
  showThreats: boolean; // Toggle for showing threat indicators
} 