import React, { useEffect, useState } from 'react';
import ChessBoard from './ChessBoard';
import { GameController } from '../controllers/GameController';
import { GameState, InteractionState } from '../models/types';
import './ChessGame.css';

interface ChessGameProps {
  controller: GameController;
}

const ChessGame: React.FC<ChessGameProps> = ({ controller }) => {
  const [gameState, setGameState] = useState<GameState>(controller.getGameState());
  const [interactionState, setInteractionState] = useState<InteractionState>(
    controller.getInteractionState()
  );

  useEffect(() => {
    // Register for updates from the controller
    const unsubscribe = controller.registerView(() => {
      setGameState(controller.getGameState());
      setInteractionState(controller.getInteractionState());
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [controller]);

  return (
    <div className="chess-game">
      <ChessBoard 
        board={gameState.board}
        interactionState={interactionState}
        onSquareClick={(position) => controller.handleSquareClick(position)}
        onSquareHover={(position) => controller.handleSquareHover(position)}
        onSquareLeave={() => controller.handleSquareLeave()}
      />
    </div>
  );
};

export default ChessGame; 