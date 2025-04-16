# Chess Game

A feature-rich browser-based chess game with standard rules and visual aids.

## Key Features

### Core Gameplay
- Complete chess rules implementation with proper move validation
- Standard 8×8 board with algebraic notation (a-h, 1-8)
- Turn-based gameplay alternating between white and black
- All standard chess piece movements and captures

### Visual Enhancements
- Piece selection with highlighted legal moves
- Threat index indicators showing how many pieces threaten each square
  - Blue indicators (bottom-left) show white piece threats
  - Red indicators (top-right) show black piece threats
- Visual distinction between source and destination squares
- Clear board layout with traditional coloring

### Special Moves
- Castling (both kingside and queenside)
- Pawn double-move from starting position
- Capture moves

### User Interface
- Three-pane layout design:
  - Left panel: Game information and rules
  - Center panel: Chess board with notations
  - Right panel: Move history in standard notation
- Responsive design adapting to different screen sizes

### Move History
- Maintains complete game record in standard algebraic notation
- Includes move numbers, piece symbols, and capture notation
- Special notation for castling moves (O-O and O-O-O)

### Technical Implementation
- Pure JavaScript with no external dependencies
- Standard web technologies (HTML, CSS, JavaScript)
- Efficient board representation and move calculation
- Runs locally in any modern browser

## How to Play
1. White moves first
2. Click on a piece to see all valid moves (highlighted in green)
3. Click on a highlighted square to move the selected piece
4. Captured pieces are automatically removed
5. The move is recorded in the history panel
6. Play alternates between white and black

## Future Enhancements
- Check and checkmate detection
- Stalemate and draw conditions
- En passant captures
- Pawn promotion
- Game timer functionality
- Save/load game capability 