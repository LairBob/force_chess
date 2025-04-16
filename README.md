# Chess Game

A simple browser-based chess game that allows you to move chess pieces on a standard chess board.

## Features

- Displays a standard 8x8 chess board
- Shows all chess pieces in the standard starting configuration
- Allows players to move pieces by clicking on them and then clicking on the destination square
- Simple piece capture logic

## How to Run

1. Clone or download this repository
2. Open the `index.html` file in any modern web browser
3. Start playing by clicking on a piece and then clicking where you want to move it

## Implementation Details

This chess game is implemented using:
- HTML for structure
- CSS for styling the board and pieces
- JavaScript for game logic and interactivity

The game uses Unicode chess symbols to display the pieces, so no image files are required.

## Current Limitations

- No enforcement of chess rules (any piece can move anywhere)
- No turn-based play enforcement (both white and black pieces can be moved at any time)
- No check/checkmate detection
- No special moves like castling, en passant, or pawn promotion

## Future Enhancements

Future versions could include:
- Implementation of all chess rules
- Turn-based gameplay
- Check and checkmate detection
- Game history and move notation
- Timer functionality for timed games 