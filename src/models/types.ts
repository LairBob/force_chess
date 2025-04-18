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
  isThreatened?: boolean; // Whether this piece is threatened by an opponent's piece
  isProtected?: boolean; // Whether this piece is protected by a piece of the same color
  isThreatener?: boolean; // Whether this piece is threatening the hovered square
  isProtector?: boolean; // Whether this piece is protecting the hovered square
}

// Square state on the board
export interface Square {
  position: Position;
  file: string; // Chess file (a-h)
  rank: number; // Chess rank (1-8)
  color: PlayerColor; // Color of the square (white or black)
  piece: Piece | null;
  hasPiece: boolean; // Whether this square has a piece on it
  isLegalMove: boolean;
  isSelected: boolean;
  isCheck: boolean;
  isHovered: boolean;
  isPossibleMove: boolean; // Indicates if this is a possible move for the hovered piece
  // States for color-coding possible move destinations
  isThreatenedDestination: boolean;
  isProtectedDestination: boolean;
  isContestedDestination: boolean;
  isNeutralDestination: boolean;
  whiteThreatCount: number; // Number of white pieces threatening this square
  blackThreatCount: number; // Number of black pieces threatening this square
  contentionVolume: number; // Total number of threats from both sides (white + black)
  contentionRatio: number; // Ratio of control balance: (white - black) / (white + black), range [-1, 1]
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