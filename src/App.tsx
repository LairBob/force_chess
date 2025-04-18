import React, { useEffect, useState } from 'react';
import ChessGame from './views/ChessGame';
import InfoPanel from './views/InfoPanel';
import { GameController } from './controllers/GameController';
import { ChessModel } from './models/ChessModel';
import './styles/Layout.css';

// Placeholder components for the new layout structure
const GameTranscription: React.FC = () => (
  <div className="panel-content">
    <h2>Game Transcription</h2>
    <p>Will eventually display a log of the current game's moves, using standard notation.</p>
  </div>
);

const DisplayOptions: React.FC = () => (
  <div className="panel-content">
    <h2>Display Options</h2>
    <p>Will eventually be an interactive tabbed panel, offering gesture flags and config options for visual display.</p>
  </div>
);

function App() {
  // Initialize our model
  const chessModel = new ChessModel();
  
  // Initialize our controller with the model
  const gameController = new GameController(chessModel);
  
  // Initialize state for game and interaction
  const [gameState, setGameState] = useState(gameController.getGameState());
  const [interactionState, setInteractionState] = useState(gameController.getInteractionState());
  
  useEffect(() => {
    // Register for updates from the controller
    const unsubscribe = gameController.registerView(() => {
      setGameState(gameController.getGameState());
      setInteractionState(gameController.getInteractionState());
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [gameController]);
  
  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Force Chess</h1>
      </div>
      
      <div className="game-transcription">
        <GameTranscription />
      </div>
      
      <div className="chess-board-wrapper">
        <ChessGame controller={gameController} />
      </div>
      
      <div className="game-control-panel">
        <div className="panel-content">
          <h2>Game Control Panel</h2>
          <button className="game-button" disabled>Undo Last Move</button>
          <button className="game-button" onClick={() => gameController.resetGame()}>Reset Game</button>
        </div>
      </div>
      
      <div className="display-options">
        <DisplayOptions />
      </div>
      
      <div className="info-panel-wrapper">
        <InfoPanel 
          board={gameState.board}
          hoveredSquare={interactionState.hoveredSquare}
          selectedSquare={interactionState.selectedSquare}
          currentPlayer={gameState.currentPlayer}
          showThreats={interactionState.showThreats}
          onToggleThreats={() => gameController.toggleThreatIndicators()}
          onResetGame={() => gameController.resetGame()}
        />
      </div>
    </div>
  );
}

export default App; 