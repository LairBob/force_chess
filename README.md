# Force Chess

A browser-based chess application with sophisticated visual overlays that display the underlying game logic.

## Project Architecture

This project follows a Model-View-Controller (MVC) architecture to separate concerns:

### Model

- `ChessModel`: Core model that manages the game state, including the board, pieces, and game rules.
- The model layer is responsible for maintaining:
  - Board and piece positions
  - Valid moves calculation
  - Game state (check, checkmate, etc.)
  - Move history

### Controller

- `GameController`: Mediates between the model and view, handling user interactions.
- The controller layer is responsible for:
  - Processing user input (clicks, hovers)
  - Updating the model based on user actions
  - Notifying the view of changes in the model

### View

- React components to visualize the chess game:
  - `ChessGame`: Main container component
  - `ChessBoard`: Displays the board grid
  - `ChessSquare`: Individual squares with visual state indicators
  - `ChessPiece`: Renders each chess piece
  - `GameInfo`: Displays game status, move history, and captured pieces

## Key Features

- Clear separation between game logic and presentation
- Visual indicators for:
  - Selected pieces
  - Legal moves
  - Check and checkmate states
  - Hover effects
- Move history and captured pieces tracking
- Responsive design

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

```
npm start
```

The application will open in your default browser at http://localhost:1234.

## Future Enhancements

- Complete implementation of all chess rules (castle, en passant, promotion)
- Advanced visual overlays for attack patterns and piece influence
- AI opponent with difficulty levels
- Online multiplayer
- Game analysis tools

## Project Structure

```
src/
├── models/          # Data and game logic
├── controllers/     # Interaction management
├── views/           # UI components
└── utils/           # Helper functions
``` 