import React from 'react';
import ChessGame from './views/ChessGame';
import { GameController } from './controllers/GameController';
import { ChessModel } from './models/ChessModel';

function App() {
  // Initialize our model
  const chessModel = new ChessModel();
  
  // Initialize our controller with the model
  const gameController = new GameController(chessModel);
  
  return (
    <div className="app-container">
      <h1>Force Chess</h1>
      <ChessGame controller={gameController} />
    </div>
  );
}

export default App; 