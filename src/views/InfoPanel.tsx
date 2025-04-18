import React from 'react';
import { Square, Position, PlayerColor, Piece } from '../models/types';
import './InfoPanel.css';

interface InfoPanelProps {
  board: Square[][];
  hoveredSquare: Position | null;
  selectedSquare: Position | null;
  currentPlayer: PlayerColor;
  showThreats: boolean;
  onToggleThreats: () => void;
  onResetGame: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  board,
  hoveredSquare,
  selectedSquare,
  currentPlayer,
  showThreats,
  onToggleThreats,
  onResetGame
}) => {
  // Helper function to get the chess notation for a position
  const getPositionNotation = (position: Position): string => {
    const file = String.fromCharCode(97 + position.col); // a-h
    const rank = 8 - position.row; // 1-8
    return `${file}${rank}`;
  };

  // Format a number to 2 decimal places for display
  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  // Helper function to get square state classes
  const getSquareStateClass = (square: Square): string => {
    if (square.isCheck) return 'state-check';
    if (square.isThreatenedDestination) return 'state-threatened';
    if (square.isProtectedDestination) return 'state-protected';
    if (square.isContestedDestination) return 'state-contested';
    if (square.isNeutralDestination) return 'state-neutral';
    return '';
  };

  // Helper function to get piece state classes
  const getPieceStateClass = (piece: Piece): string => {
    if (piece.isThreatened && piece.isProtected) return 'state-contested';
    if (piece.isThreatened) return 'state-threatened';
    if (piece.isProtected) return 'state-protected';
    if (piece.isThreatener) return 'state-threatener';
    if (piece.isProtector) return 'state-protector';
    return '';
  };

  // Determine content for hovered piece panel
  const hoveredPiecePanel = () => {
    if (!hoveredSquare || !board[hoveredSquare.row][hoveredSquare.col].piece) {
      return (
        <div className="panel-content empty">
          <p>No piece hovered</p>
        </div>
      );
    }

    const piece = board[hoveredSquare.row][hoveredSquare.col].piece!;
    const stateClass = getPieceStateClass(piece);
    const notation = getPositionNotation(piece.position);

    // Create an array of piece states
    const states = [];
    if (piece.isThreatened) states.push("Threatened");
    if (piece.isProtected) states.push("Protected");
    if (piece.isThreatener) states.push("Threatening");
    if (piece.isProtector) states.push("Protecting");

    return (
      <div className="panel-content">
        <div className="panel-row">
          <div className={`piece-indicator ${piece.color} ${piece.type} ${stateClass}`}>
            {piece.type.charAt(0).toUpperCase()}
          </div>
          <div className="piece-details">
            <p className="detail-heading"><strong>{piece.color} {piece.type}</strong></p>
            <p>Position: {notation}</p>
            <p>Status: {states.length > 0 ? states.join(", ") : "Normal"}</p>
            <p>Moved: {piece.hasMoved ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    );
  };

  // Determine content for selected piece panel
  const selectedPiecePanel = () => {
    if (!selectedSquare || !board[selectedSquare.row][selectedSquare.col].piece) {
      return (
        <div className="panel-content empty">
          <p>No piece selected</p>
        </div>
      );
    }

    const piece = board[selectedSquare.row][selectedSquare.col].piece!;
    const stateClass = getPieceStateClass(piece);
    const notation = getPositionNotation(piece.position);

    // Create an array of piece states
    const states = [];
    if (piece.isThreatened) states.push("Threatened");
    if (piece.isProtected) states.push("Protected");
    if (piece.isThreatener) states.push("Threatening");
    if (piece.isProtector) states.push("Protecting");

    return (
      <div className="panel-content">
        <div className="panel-row">
          <div className={`piece-indicator ${piece.color} ${piece.type} ${stateClass} selected`}>
            {piece.type.charAt(0).toUpperCase()}
          </div>
          <div className="piece-details">
            <p className="detail-heading"><strong>{piece.color} {piece.type}</strong></p>
            <p>Position: {notation}</p>
            <p>Status: {states.length > 0 ? states.join(", ") : "Normal"}</p>
            <p>Moved: {piece.hasMoved ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    );
  };

  // Determine content for hovered square panel
  const hoveredSquarePanel = () => {
    if (!hoveredSquare) {
      return (
        <div className="square-details-container empty">
          <p>No square hovered</p>
        </div>
      );
    }

    const square = board[hoveredSquare.row][hoveredSquare.col];
    const notation = getPositionNotation(hoveredSquare);
    const stateClass = getSquareStateClass(square);

    return (
      <div className="square-details-container">
        <div className="square-info">
          <div className="panel-row">
            <div className={`square-indicator ${stateClass}`}>{notation}</div>
            <div className="square-details">
              <p className="detail-heading">Position: <strong>{notation}</strong> ({hoveredSquare.row},{hoveredSquare.col})</p>
              <p>
                <span className="label">Threats:</span> 
                <span className="white-count">W: {square.whiteThreatCount}</span> | 
                <span className="black-count">B: {square.blackThreatCount}</span>
              </p>
              <p>
                <span className="label">Contention:</span> 
                <span className="value">Volume: {square.contentionVolume}</span> | 
                <span className="value">Ratio: {formatNumber(square.contentionRatio)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="piece-info">
          <h4>STATE DETAILS: CURRENT HOVERED PIECE</h4>
          {hoveredPiecePanel()}
        </div>
      </div>
    );
  };

  // Determine content for selected square panel
  const selectedSquarePanel = () => {
    if (!selectedSquare) {
      return (
        <div className="square-details-container empty">
          <p>No square selected</p>
        </div>
      );
    }

    const square = board[selectedSquare.row][selectedSquare.col];
    const notation = getPositionNotation(selectedSquare);
    const stateClass = getSquareStateClass(square);

    return (
      <div className="square-details-container">
        <div className="square-info">
          <div className="panel-row">
            <div className={`square-indicator ${stateClass} selected`}>{notation}</div>
            <div className="square-details">
              <p className="detail-heading">Position: <strong>{notation}</strong> ({selectedSquare.row},{selectedSquare.col})</p>
              <p>
                <span className="label">Threats:</span> 
                <span className="white-count">W: {square.whiteThreatCount}</span> | 
                <span className="black-count">B: {square.blackThreatCount}</span>
              </p>
              <p>
                <span className="label">Contention:</span> 
                <span className="value">Volume: {square.contentionVolume}</span> | 
                <span className="value">Ratio: {formatNumber(square.contentionRatio)}</span>
              </p>
              <p>
                <span className="label">Color:</span> 
                <span className="value">{square.color}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="piece-info">
          <h4>STATE DETAILS: CURRENT SELECTED PIECE</h4>
          {selectedPiecePanel()}
        </div>
      </div>
    );
  };

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <h2>Board Analysis</h2>
        <div className="control-buttons">
          <button className="control-button reset-button" onClick={onResetGame}>
            New Game
          </button>
          <label className="toggle-container">
            <span>Show Threats</span>
            <input
              type="checkbox"
              checked={showThreats}
              onChange={onToggleThreats}
            />
            <span className="toggle-switch"></span>
          </label>
        </div>
      </div>
      
      <div className="info-panel-grid">
        <div className="info-subpanel">
          <h3>STATE DETAILS: CURRENT HOVERED SQUARE</h3>
          {hoveredSquarePanel()}
        </div>
        
        <div className="info-subpanel">
          <h3>STATE DETAILS: CURRENT SELECTED SQUARE</h3>
          {selectedSquarePanel()}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel; 