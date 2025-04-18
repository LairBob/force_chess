# Chess Game Logic Documentation

## Overview

This document provides a comprehensive explanation of the chess game mechanics and implementation details. It serves as the definitive reference for the logical structure, interactions, and architecture of the chess application.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Board Representation](#board-representation)
3. [Piece Mechanics](#piece-mechanics)
4. [Game State Management](#game-state-management)
5. [Move Validation](#move-validation)
6. [Special Rules](#special-rules)
7. [State Tracking and Visualization](#state-tracking-and-visualization)
8. [Implementation Architecture](#implementation-architecture)

## Core Concepts

Chess is represented through a model-view-controller architecture with distinct logical layers:

- **Model**: The underlying data structures that define the chess board, pieces, and game state
- **Controller**: Logic that enforces rules, validates moves, and updates state
- **View**: Components that visualize the board and provide interaction points

### Key Components

- **Square**: The fundamental unit of the chess board, containing position data and potentially a piece
- **Piece**: Chess pieces with specific movement patterns and attributes
- **Board**: An 8×8 grid of squares representing the playing area
- **Game State**: The collection of all relevant information about the current state of play

## Board Representation

### Coordinate System

The chess board uses two coordinate systems:

1. **Chess Notation**: The standard algebraic notation used in chess (a1 to h8)
   - Files: a-h (horizontal, left to right)
   - Ranks: 1-8 (vertical, bottom to top)

2. **Internal Array Coordinates**: Zero-based indices for programmatic access
   - Rows: 0-7 (top to bottom)
   - Columns: 0-7 (left to right)

```
Conversion between notations:
- File 'a' to 'h' corresponds to column 0 to 7
- Rank '8' to '1' corresponds to row 0 to 7
```

### Square Properties

Each square on the board contains:

- **Position**: Both algebraic (e.g., "e4") and internal coordinates (row, col)
- **Color**: White or black, based on the standard alternating pattern
- **Occupancy**: Whether a piece occupies this square
- **Piece Reference**: A link to the piece on this square (if any)
- **Threat Information**: Data about which pieces threaten or protect this square

## Piece Mechanics

### Piece Attributes

Each piece maintains:

- **Type**: Pawn, Knight, Bishop, Rook, Queen, or King
- **Color**: White or Black
- **Position**: Current location on the board
- **Movement History**: Whether the piece has moved (relevant for castling and pawn first moves)
- **State Information**: Whether the piece is threatened, protected, etc.

### Movement Patterns

Each piece type follows distinct movement rules:

- **Pawn**: Forward one square (or two from starting position), captures diagonally
- **Knight**: L-shape movement (2 in one direction, 1 in perpendicular direction)
- **Bishop**: Diagonal movement, any number of squares
- **Rook**: Horizontal and vertical movement, any number of squares
- **Queen**: Combines bishop and rook movements
- **King**: One square in any direction

## Game State Management

### Game State Properties

The game state tracks:

- **Board Configuration**: The current arrangement of pieces
- **Current Player**: Whose turn it is (White or Black)
- **Selected Piece**: The currently selected piece, if any
- **Move History**: Record of all previous moves
- **Captured Pieces**: Pieces that have been captured
- **Game Status**: Whether the game is in check, checkmate, stalemate, etc.

### State Transitions

State changes occur through:

- **Piece Selection**: Choosing a piece to move
- **Move Execution**: Moving a piece to a new square
- **Special Moves**: Castling, en passant, promotion
- **Game Conclusion**: Checkmate, stalemate, draw, resignation

## Move Validation

### Legal Move Determination

Move legality depends on:

- **Piece Movement Rules**: The standard pattern for the piece type
- **Path Obstruction**: Whether other pieces block the movement path
- **Check Constraints**: Moves cannot leave or place own king in check
- **Special Rules**: Castling conditions, en passant, etc.

### Move Execution Process

1. **Validation**: Ensure the move follows all relevant rules
2. **State Update**: Update the board state and piece positions
3. **Special Rule Processing**: Handle castling, en passant, promotion
4. **Game Status Update**: Check for check, checkmate, stalemate
5. **History Recording**: Add the move to the game history

## Special Rules

### Castling

Conditions for castling:
- Neither king nor involved rook has moved
- No pieces between king and rook
- King not in check
- King does not move through or into check

### En Passant

Conditions for en passant:
- Enemy pawn moves two squares forward from starting position
- Own pawn is on fifth rank (for white) or fourth rank (for black)
- Capture occurs on the square the enemy pawn passed over
- Must be executed immediately after the enemy pawn's move

### Pawn Promotion

When a pawn reaches the opposite end of the board, it is promoted to:
- Queen (default)
- Rook
- Bishop
- Knight

## State Tracking and Visualization

### Interactive States

The application tracks:

- **Hover State**: The square currently being hovered over
- **Selection State**: The currently selected square or piece
- **Threat Visualization**: Which squares are threatened or protected
- **Legal Move Indicators**: Valid moves for the selected piece

### Contention Metrics

For each square, the following metrics are tracked:

- **White Threat Count**: Number of white pieces threatening this square
- **Black Threat Count**: Number of black pieces threatening this square
- **Contention Volume**: Total number of threats (white + black)
- **Contention Ratio**: Balance of control (-1 to 1, with negative values indicating black control and positive values indicating white control)

## Implementation Architecture

### Model Layer

- **ChessModel**: Core class managing game state and rules
- **Types**: TypeScript interfaces defining the data structures
- **Movement Logic**: Functions for calculating legal moves and threats

### Controller Layer

- **GameController**: Mediates between model and view
- **Event Handlers**: Process user interactions (clicks, hovers)
- **State Transitions**: Manage game state changes

### View Layer

- **ChessBoard**: Visual representation of the 8×8 grid
- **ChessSquare**: Individual square component
- **ChessPiece**: Visual representation of pieces
- **InfoPanel**: Display of game state information
- **MoveHistory**: Record of moves played

---

*This documentation will be continuously updated as the implementation evolves.* 