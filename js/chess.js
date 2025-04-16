document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const board = document.getElementById('chessboard');
    let selectedPiece = null;
    let currentTurn = 'white'; // Track whose turn it is
    let threatMap = initializeThreatMap(); // Initialize threat map
    let moveHistory = []; // Track move history
    let moveNumber = 1; // Current move number
    
    // Initialize the board
    initializeBoard();
    addBoardNotations();
    loadReadmeToLeftPanel();
    highlightEligiblePieces(); // Highlight eligible pieces initially
    
    function initializeBoard() {
        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add click event for square (for moving pieces)
                square.addEventListener('click', handleSquareClick);
                
                // Add threat indicators
                addThreatIndicators(square);
                
                board.appendChild(square);
            }
        }
        
        // Set up initial pieces
        setupInitialPosition();
        
        // Calculate initial threat indices
        calculateAllThreats();
    }
    
    function loadReadmeToLeftPanel() {
        // Instead of fetching the README, embed the content directly
        const readmeContent = `# Chess Game

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
- Save/load game capability`;

        const leftPanel = document.getElementById('left-panel-content');
        
        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHtml(readmeContent);
        leftPanel.innerHTML = htmlContent;
    }
    
    function convertMarkdownToHtml(markdown) {
        // Simple markdown conversion - handles headers, lists, and paragraphs
        return markdown
            // Headers (## Heading -> <h2>Heading</h2>)
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            // Lists (- item -> <li>item</li>)
            .replace(/^\s*- (.*$)/gm, '<li>$1</li>')
            .replace(/<\/li>\n<li>/g, '</li><li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            // Emphasis
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Paragraphs (blank line to new paragraph)
            .replace(/\n\n/g, '</p><p>')
            // Wrap everything in paragraphs if not already
            .replace(/^(.+)(?!\<h|\<p|\<ul)$/gm, '<p>$1</p>');
    }
    
    function addMoveToHistory(fromSquare, toSquare, piece, capture = false, special = null) {
        // Convert row/col to chess notation
        const fromRow = 8 - parseInt(fromSquare.dataset.row);
        const fromCol = String.fromCharCode(97 + parseInt(fromSquare.dataset.col));
        const toRow = 8 - parseInt(toSquare.dataset.row);
        const toCol = String.fromCharCode(97 + parseInt(toSquare.dataset.col));
        
        // Get piece symbol
        let pieceSymbol = '';
        switch (piece.dataset.type) {
            case 'king':
                pieceSymbol = 'K';
                break;
            case 'queen':
                pieceSymbol = 'Q';
                break;
            case 'rook':
                pieceSymbol = 'R';
                break;
            case 'bishop':
                pieceSymbol = 'B';
                break;
            case 'knight':
                pieceSymbol = 'N';
                break;
            // Pawn has no symbol in notation
        }
        
        // Build the move notation
        let notation = '';
        
        // Special moves
        if (special === 'castle-kingside') {
            notation = 'O-O';
        } else if (special === 'castle-queenside') {
            notation = 'O-O-O';
        } else {
            // Standard move notation
            notation = pieceSymbol;
            
            // For pawn captures, we include the from column
            if (piece.dataset.type === 'pawn' && capture) {
                notation += fromCol;
            }
            
            // Add capture symbol if needed
            if (capture) {
                notation += 'x';
            }
            
            // Add destination square
            notation += toCol + toRow;
        }
        
        // Add the move to history
        if (piece.dataset.color === 'white') {
            moveHistory.push({ number: moveNumber, white: notation, black: null });
        } else {
            // If the last move doesn't have a black move yet, add to it
            if (moveHistory.length > 0 && moveHistory[moveHistory.length - 1].black === null) {
                moveHistory[moveHistory.length - 1].black = notation;
            } else {
                // This shouldn't happen in a proper turn sequence, but just in case
                moveHistory.push({ number: moveNumber, white: '', black: notation });
            }
            // Increment move number after black's move
            moveNumber++;
        }
        
        // Update the display
        updateMoveHistoryDisplay();
    }
    
    function updateMoveHistoryDisplay() {
        const historyPanel = document.getElementById('right-panel-content');
        historyPanel.innerHTML = '';
        
        // Create a header for the move history
        const historyHeader = document.createElement('div');
        historyHeader.className = 'history-header';
        historyHeader.innerHTML = '<span class="move-number">#</span><span class="white-move">White</span><span class="black-move">Black</span>';
        historyPanel.appendChild(historyHeader);
        
        // Create the list for moves
        const historyList = document.createElement('div');
        historyList.className = 'move-history-list';
        
        // Add each move to the list
        moveHistory.forEach(move => {
            const moveRow = document.createElement('div');
            moveRow.className = 'move-row';
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 'move-number';
            numberSpan.textContent = move.number + '.';
            
            const whiteSpan = document.createElement('span');
            whiteSpan.className = 'white-move';
            whiteSpan.textContent = move.white || '';
            
            const blackSpan = document.createElement('span');
            blackSpan.className = 'black-move';
            blackSpan.textContent = move.black || '';
            
            moveRow.appendChild(numberSpan);
            moveRow.appendChild(whiteSpan);
            moveRow.appendChild(blackSpan);
            historyList.appendChild(moveRow);
        });
        
        historyPanel.appendChild(historyList);
    }
    
    function addBoardNotations() {
        const rowNotation = document.getElementById('row-notation');
        const colNotation = document.getElementById('col-notation');
        
        // Add row numbers (8 to 1 from top to bottom)
        for (let row = 0; row < 8; row++) {
            const rowLabel = document.createElement('div');
            rowLabel.className = 'notation-label';
            rowLabel.textContent = 8 - row; // Standard chess notation starts with 8 at the top
            rowNotation.appendChild(rowLabel);
        }
        
        // Add column letters (a to h from left to right)
        for (let col = 0; col < 8; col++) {
            const colLabel = document.createElement('div');
            colLabel.className = 'notation-label';
            colLabel.textContent = String.fromCharCode(97 + col); // ASCII 'a' starts at 97
            colNotation.appendChild(colLabel);
        }
    }
    
    function initializeThreatMap() {
        // Create a 2D array to store threat counts for each square
        const map = Array(8).fill().map(() => Array(8).fill().map(() => ({
            white: 0,
            black: 0
        })));
        return map;
    }
    
    function addThreatIndicators(square) {
        // Add unified threat indicator
        const threatIndicator = document.createElement('div');
        threatIndicator.className = 'threat-indicator';
        threatIndicator.dataset.white = '0';
        threatIndicator.dataset.black = '0';
        
        // Set initial opacity custom properties
        threatIndicator.style.setProperty('--white-opacity', '0');
        threatIndicator.style.setProperty('--black-opacity', '0');
        
        square.appendChild(threatIndicator);
    }
    
    function setupInitialPosition() {
        // Define piece positions
        const initialSetup = {
            // Black pieces
            '0-0': { type: 'rook', color: 'black', hasMoved: false },
            '0-1': { type: 'knight', color: 'black' },
            '0-2': { type: 'bishop', color: 'black' },
            '0-3': { type: 'queen', color: 'black' },
            '0-4': { type: 'king', color: 'black', hasMoved: false },
            '0-5': { type: 'bishop', color: 'black' },
            '0-6': { type: 'knight', color: 'black' },
            '0-7': { type: 'rook', color: 'black', hasMoved: false },
            
            // Black pawns
            '1-0': { type: 'pawn', color: 'black', hasMoved: false },
            '1-1': { type: 'pawn', color: 'black', hasMoved: false },
            '1-2': { type: 'pawn', color: 'black', hasMoved: false },
            '1-3': { type: 'pawn', color: 'black', hasMoved: false },
            '1-4': { type: 'pawn', color: 'black', hasMoved: false },
            '1-5': { type: 'pawn', color: 'black', hasMoved: false },
            '1-6': { type: 'pawn', color: 'black', hasMoved: false },
            '1-7': { type: 'pawn', color: 'black', hasMoved: false },
            
            // White pawns
            '6-0': { type: 'pawn', color: 'white', hasMoved: false },
            '6-1': { type: 'pawn', color: 'white', hasMoved: false },
            '6-2': { type: 'pawn', color: 'white', hasMoved: false },
            '6-3': { type: 'pawn', color: 'white', hasMoved: false },
            '6-4': { type: 'pawn', color: 'white', hasMoved: false },
            '6-5': { type: 'pawn', color: 'white', hasMoved: false },
            '6-6': { type: 'pawn', color: 'white', hasMoved: false },
            '6-7': { type: 'pawn', color: 'white', hasMoved: false },
            
            // White pieces
            '7-0': { type: 'rook', color: 'white', hasMoved: false },
            '7-1': { type: 'knight', color: 'white' },
            '7-2': { type: 'bishop', color: 'white' },
            '7-3': { type: 'queen', color: 'white' },
            '7-4': { type: 'king', color: 'white', hasMoved: false },
            '7-5': { type: 'bishop', color: 'white' },
            '7-6': { type: 'knight', color: 'white' },
            '7-7': { type: 'rook', color: 'white', hasMoved: false }
        };
        
        // Place pieces on the board
        for (const position in initialSetup) {
            const [row, col] = position.split('-');
            const piece = initialSetup[position];
            createPiece(parseInt(row), parseInt(col), piece.type, piece.color, piece.hasMoved);
        }
    }
    
    function createPiece(row, col, type, color, hasMoved = false) {
        const square = getSquare(row, col);
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.dataset.type = type;
        pieceElement.dataset.color = color;
        
        // Keep track of whether the piece has moved (needed for pawns, castling, etc.)
        pieceElement.dataset.hasMoved = hasMoved;
        
        // Set the piece's appearance based on Unicode chess symbols
        pieceElement.textContent = getPieceSymbol(type, color);
        pieceElement.style.fontSize = '50px';
        
        // Add click event for piece selection
        pieceElement.addEventListener('click', handlePieceClick);
        
        square.appendChild(pieceElement);
        return pieceElement;
    }
    
    function getPieceSymbol(type, color) {
        const symbols = {
            'white': {
                'king': '♔',
                'queen': '♕',
                'rook': '♖',
                'bishop': '♗',
                'knight': '♘',
                'pawn': '♙'
            },
            'black': {
                'king': '♚',
                'queen': '♛',
                'rook': '♜',
                'bishop': '♝',
                'knight': '♞',
                'pawn': '♟'
            }
        };
        
        return symbols[color][type];
    }
    
    function getSquare(row, col) {
        return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    }
    
    function getPieceAt(row, col) {
        const square = getSquare(row, col);
        return square ? square.querySelector('.piece') : null;
    }
    
    function handlePieceClick(event) {
        event.stopPropagation();
        
        // Get the piece and its square
        const piece = event.target;
        const square = piece.parentElement;
        
        // Only allow selecting pieces of the current turn's color
        if (piece.dataset.color !== currentTurn) {
            return;
        }
        
        // Clear any previous selections
        clearHighlights();
        
        // Highlight the selected piece
        square.classList.add('highlight');
        selectedPiece = piece;
        
        // Highlight valid moves
        highlightValidMoves(piece);
    }
    
    function handleSquareClick(event) {
        // If a piece is selected, try to move it to the clicked square
        if (selectedPiece) {
            const targetSquare = event.currentTarget;
            
            // Check if this is a valid move square
            if (!targetSquare.classList.contains('valid-move') && 
                !targetSquare.classList.contains('highlight')) {
                // If it's not a valid move square but has a piece of same color, select that piece instead
                const existingPiece = targetSquare.querySelector('.piece');
                if (existingPiece && existingPiece.dataset.color === currentTurn) {
                    clearHighlights();
                    targetSquare.classList.add('highlight');
                    selectedPiece = existingPiece;
                    highlightValidMoves(existingPiece);
                }
                return;
            }
            
            // Get the current and target positions
            const currentSquare = selectedPiece.parentElement;
            const fromRow = parseInt(currentSquare.dataset.row);
            const fromCol = parseInt(currentSquare.dataset.col);
            const toRow = parseInt(targetSquare.dataset.row);
            const toCol = parseInt(targetSquare.dataset.col);
            
            // Check for a capture
            const isCapture = targetSquare.querySelector('.piece') !== null;
            
            // Handle castling move
            if (selectedPiece.dataset.type === 'king' && Math.abs(toCol - fromCol) === 2) {
                // This is a castling move
                const castlingSide = toCol > fromCol ? 'castle-kingside' : 'castle-queenside';
                performCastling(fromRow, fromCol, toRow, toCol);
                
                // Add to move history
                addMoveToHistory(currentSquare, targetSquare, selectedPiece, false, castlingSide);
            } else {
                // Capture piece if there is one
                const existingPiece = targetSquare.querySelector('.piece');
                if (existingPiece) {
                    targetSquare.removeChild(existingPiece);
                }
                
                // Move the selected piece to the target square
                targetSquare.appendChild(selectedPiece);
                
                // Mark the piece as having moved
                selectedPiece.dataset.hasMoved = true;
                
                // Add to move history
                addMoveToHistory(currentSquare, targetSquare, selectedPiece, isCapture);
            }
            
            // Switch turns
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
            
            // Recalculate threats after move
            calculateAllThreats();
            
            // Update eligible pieces highlight for new turn
            highlightEligiblePieces();
            
            // Clear highlights and selection
            clearHighlights();
            selectedPiece = null;
        }
    }
    
    function clearHighlights() {
        // Remove highlighted squares
        document.querySelectorAll('.highlight, .valid-move').forEach(el => {
            el.classList.remove('highlight', 'valid-move');
        });
        
        // Remove valid move markers
        document.querySelectorAll('.move-marker').forEach(marker => {
            marker.remove();
        });
    }
    
    function highlightValidMoves(piece) {
        const square = piece.parentElement;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const color = piece.dataset.color;
        const type = piece.dataset.type;
        const hasMoved = piece.dataset.hasMoved === 'true';
        
        let validMoves = [];
        
        // Get valid moves based on piece type
        switch(type) {
            case 'pawn':
                validMoves = getValidPawnMoves(row, col, color, hasMoved);
                break;
            case 'rook':
                validMoves = getValidRookMoves(row, col, color);
                break;
            case 'knight':
                validMoves = getValidKnightMoves(row, col, color);
                break;
            case 'bishop':
                validMoves = getValidBishopMoves(row, col, color);
                break;
            case 'queen':
                validMoves = getValidQueenMoves(row, col, color);
                break;
            case 'king':
                validMoves = getValidKingMoves(row, col, color, hasMoved);
                break;
        }
        
        // Highlight each valid move square
        validMoves.forEach(move => {
            const moveSquare = getSquare(move.row, move.col);
            if (moveSquare) {
                moveSquare.classList.add('valid-move');
                
                // Add a visual marker for empty squares
                if (!moveSquare.querySelector('.piece')) {
                    const marker = document.createElement('div');
                    marker.className = 'move-marker';
                    moveSquare.appendChild(marker);
                }
            }
        });
    }
    
    function calculateAllThreats() {
        // Reset threat map
        threatMap = initializeThreatMap();
        
        // Find all pieces on the board
        const pieces = document.querySelectorAll('.piece');
        
        // Calculate threats for each piece
        pieces.forEach(piece => {
            const square = piece.parentElement;
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const color = piece.dataset.color;
            const type = piece.dataset.type;
            const hasMoved = piece.dataset.hasMoved === 'true';
            
            // Get all squares this piece threatens
            let threatSquares = [];
            
            switch(type) {
                case 'pawn':
                    threatSquares = getPawnThreats(row, col, color);
                    break;
                case 'rook':
                    threatSquares = getValidRookMoves(row, col, color);
                    break;
                case 'knight':
                    threatSquares = getValidKnightMoves(row, col, color);
                    break;
                case 'bishop':
                    threatSquares = getValidBishopMoves(row, col, color);
                    break;
                case 'queen':
                    threatSquares = getValidQueenMoves(row, col, color);
                    break;
                case 'king':
                    threatSquares = getBasicKingMoves(row, col, color);
                    break;
            }
            
            // Update threat count for each threatened square
            threatSquares.forEach(threat => {
                if (color === 'white') {
                    threatMap[threat.row][threat.col].white++;
                } else {
                    threatMap[threat.row][threat.col].black++;
                }
            });
        });
        
        // Update the display
        updateThreatDisplay();
    }
    
    function getPawnThreats(row, col, color) {
        // For pawns, threats are just the diagonal captures
        const threats = [];
        const direction = color === 'white' ? -1 : 1;
        
        // Capture moves (diagonally)
        const captureCols = [col - 1, col + 1];
        captureCols.forEach(captureCol => {
            const captureRow = row + direction;
            if (isValidPosition(captureRow, captureCol)) {
                threats.push({ row: captureRow, col: captureCol });
            }
        });
        
        return threats;
    }
    
    function getBasicKingMoves(row, col, color) {
        // Just the 8 surrounding squares, without castling
        const moves = [];
        const kingMoves = [
            { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
            { row: 0, col: -1 }, { row: 0, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
        ];
        
        // Regular king moves (one square in any direction)
        kingMoves.forEach(move => {
            const newRow = row + move.row;
            const newCol = col + move.col;
            
            if (isValidPosition(newRow, newCol)) {
                const targetPiece = getPieceAt(newRow, newCol);
                
                // Can move if square is empty or contains an enemy piece
                if (!targetPiece || targetPiece.dataset.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }
    
    function updateThreatDisplay() {
        // Determine the maximum threat value to normalize intensities
        let maxWhiteThreat = 0;
        let maxBlackThreat = 0;
        
        // Find maximum threat values
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                maxWhiteThreat = Math.max(maxWhiteThreat, threatMap[row][col].white);
                maxBlackThreat = Math.max(maxBlackThreat, threatMap[row][col].black);
            }
        }
        
        // Cap the max values to prevent too much scaling
        maxWhiteThreat = Math.min(maxWhiteThreat, 5);
        maxBlackThreat = Math.min(maxBlackThreat, 5);
        
        // Update each square's threat indicator
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = getSquare(row, col);
                const threatIndicator = square.querySelector('.threat-indicator');
                
                const whiteThreat = threatMap[row][col].white;
                const blackThreat = threatMap[row][col].black;
                
                // Set the threat count as data attributes
                threatIndicator.dataset.white = whiteThreat > 0 ? whiteThreat : '';
                threatIndicator.dataset.black = blackThreat > 0 ? blackThreat : '';
                
                // Set boolean attributes to indicate if threats exist
                threatIndicator.dataset.whiteHasThreat = whiteThreat > 0 ? "true" : "false";
                threatIndicator.dataset.blackHasThreat = blackThreat > 0 ? "true" : "false";
                
                // Calculate opacity based on threat level (from 0.2 to 0.9)
                const whiteOpacity = whiteThreat > 0 
                    ? 0.2 + (0.7 * (whiteThreat / maxWhiteThreat))
                    : 0;
                    
                const blackOpacity = blackThreat > 0 
                    ? 0.2 + (0.7 * (blackThreat / maxBlackThreat))
                    : 0;
                
                // Set custom properties for opacity
                threatIndicator.style.setProperty('--white-opacity', whiteOpacity.toFixed(2));
                threatIndicator.style.setProperty('--black-opacity', blackOpacity.toFixed(2));
                
                // Show/hide the indicator based on if there are any threats
                threatIndicator.style.display = (whiteThreat > 0 || blackThreat > 0) ? 'block' : 'none';
            }
        }
    }
    
    function getValidPawnMoves(row, col, color, hasMoved) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1; // White pawns move up (-1), black pawns move down (+1)
        
        // Forward move (1 square)
        const forwardRow = row + direction;
        if (isValidPosition(forwardRow, col) && !getPieceAt(forwardRow, col)) {
            moves.push({ row: forwardRow, col: col });
            
            // Forward move (2 squares) if pawn hasn't moved yet
            if (!hasMoved) {
                const doubleForwardRow = row + (direction * 2);
                if (isValidPosition(doubleForwardRow, col) && !getPieceAt(doubleForwardRow, col)) {
                    moves.push({ row: doubleForwardRow, col: col });
                }
            }
        }
        
        // Capture moves (diagonally)
        const captureCols = [col - 1, col + 1];
        captureCols.forEach(captureCol => {
            if (isValidPosition(forwardRow, captureCol)) {
                const targetPiece = getPieceAt(forwardRow, captureCol);
                if (targetPiece && targetPiece.dataset.color !== color) {
                    moves.push({ row: forwardRow, col: captureCol });
                }
            }
        });
        
        return moves;
    }
    
    function getValidRookMoves(row, col, color) {
        const moves = [];
        const directions = [
            { row: -1, col: 0 },  // Up
            { row: 1, col: 0 },   // Down
            { row: 0, col: -1 },  // Left
            { row: 0, col: 1 }    // Right
        ];
        
        // Check each direction
        directions.forEach(dir => {
            let currentRow = row + dir.row;
            let currentCol = col + dir.col;
            
            // Continue in this direction until we hit a piece or the edge of the board
            while (isValidPosition(currentRow, currentCol)) {
                const targetPiece = getPieceAt(currentRow, currentCol);
                
                if (!targetPiece) {
                    // Empty square, can move here
                    moves.push({ row: currentRow, col: currentCol });
                } else if (targetPiece.dataset.color !== color) {
                    // Enemy piece, can capture and then stop
                    moves.push({ row: currentRow, col: currentCol });
                    break;
                } else {
                    // Friendly piece, stop here
                    break;
                }
                
                // Move further in this direction
                currentRow += dir.row;
                currentCol += dir.col;
            }
        });
        
        return moves;
    }
    
    function getValidKnightMoves(row, col, color) {
        const moves = [];
        const knightMoves = [
            { row: -2, col: -1 }, { row: -2, col: 1 },
            { row: -1, col: -2 }, { row: -1, col: 2 },
            { row: 1, col: -2 }, { row: 1, col: 2 },
            { row: 2, col: -1 }, { row: 2, col: 1 }
        ];
        
        // Check each potential knight move
        knightMoves.forEach(move => {
            const newRow = row + move.row;
            const newCol = col + move.col;
            
            if (isValidPosition(newRow, newCol)) {
                const targetPiece = getPieceAt(newRow, newCol);
                
                // Can move if square is empty or contains an enemy piece
                if (!targetPiece || targetPiece.dataset.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }
    
    function getValidBishopMoves(row, col, color) {
        const moves = [];
        const directions = [
            { row: -1, col: -1 },  // Up-left
            { row: -1, col: 1 },   // Up-right
            { row: 1, col: -1 },   // Down-left
            { row: 1, col: 1 }     // Down-right
        ];
        
        // Check each direction
        directions.forEach(dir => {
            let currentRow = row + dir.row;
            let currentCol = col + dir.col;
            
            // Continue in this direction until we hit a piece or the edge of the board
            while (isValidPosition(currentRow, currentCol)) {
                const targetPiece = getPieceAt(currentRow, currentCol);
                
                if (!targetPiece) {
                    // Empty square, can move here
                    moves.push({ row: currentRow, col: currentCol });
                } else if (targetPiece.dataset.color !== color) {
                    // Enemy piece, can capture and then stop
                    moves.push({ row: currentRow, col: currentCol });
                    break;
                } else {
                    // Friendly piece, stop here
                    break;
                }
                
                // Move further in this direction
                currentRow += dir.row;
                currentCol += dir.col;
            }
        });
        
        return moves;
    }
    
    function getValidQueenMoves(row, col, color) {
        // Queen combines rook and bishop movement
        const rookMoves = getValidRookMoves(row, col, color);
        const bishopMoves = getValidBishopMoves(row, col, color);
        return [...rookMoves, ...bishopMoves];
    }
    
    function getValidKingMoves(row, col, color, hasMoved) {
        const moves = [];
        const kingMoves = [
            { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
            { row: 0, col: -1 }, { row: 0, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
        ];
        
        // Regular king moves (one square in any direction)
        kingMoves.forEach(move => {
            const newRow = row + move.row;
            const newCol = col + move.col;
            
            if (isValidPosition(newRow, newCol)) {
                const targetPiece = getPieceAt(newRow, newCol);
                
                // Can move if square is empty or contains an enemy piece
                if (!targetPiece || targetPiece.dataset.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        // Castling moves
        if (!hasMoved) {
            // Check kingside castling
            if (canCastle(row, col, 'kingside', color)) {
                moves.push({ row: row, col: col + 2 });
            }
            
            // Check queenside castling
            if (canCastle(row, col, 'queenside', color)) {
                moves.push({ row: row, col: col - 2 });
            }
        }
        
        return moves;
    }
    
    function canCastle(row, col, side, color) {
        // King must not have moved
        const kingPiece = getPieceAt(row, col);
        if (kingPiece.dataset.hasMoved === 'true') {
            return false;
        }
        
        // Determine rook position based on castling side
        const rookCol = side === 'kingside' ? 7 : 0;
        const rookPiece = getPieceAt(row, rookCol);
        
        // Rook must exist and not have moved
        if (!rookPiece || rookPiece.dataset.type !== 'rook' || 
            rookPiece.dataset.color !== color || rookPiece.dataset.hasMoved === 'true') {
            return false;
        }
        
        // Check that all squares between king and rook are empty
        const direction = side === 'kingside' ? 1 : -1;
        const startCol = col + direction;
        const endCol = side === 'kingside' ? rookCol - 1 : rookCol + 1;
        
        for (let c = startCol; side === 'kingside' ? c <= endCol : c >= endCol; c += direction) {
            if (getPieceAt(row, c)) {
                return false;
            }
        }
        
        return true;
    }
    
    function performCastling(fromRow, fromCol, toRow, toCol) {
        const king = selectedPiece;
        const side = toCol > fromCol ? 'kingside' : 'queenside';
        const rookCol = side === 'kingside' ? 7 : 0;
        const newRookCol = side === 'kingside' ? toCol - 1 : toCol + 1;
        
        // Move the king
        const targetSquare = getSquare(toRow, toCol);
        targetSquare.appendChild(king);
        king.dataset.hasMoved = true;
        
        // Move the rook
        const rook = getPieceAt(fromRow, rookCol);
        const newRookSquare = getSquare(fromRow, newRookCol);
        newRookSquare.appendChild(rook);
        rook.dataset.hasMoved = true;
    }
    
    function isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    function highlightEligiblePieces() {
        // First, remove all existing eligible-piece highlights
        document.querySelectorAll('.eligible-piece-square').forEach(square => {
            square.classList.remove('eligible-piece-square');
        });
        
        // Find all pieces of the current turn's color and highlight their squares
        document.querySelectorAll(`.piece[data-color="${currentTurn}"]`).forEach(piece => {
            // Check if this piece has at least one legal move
            const square = piece.parentElement;
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const type = piece.dataset.type;
            const color = piece.dataset.color;
            const hasMoved = piece.dataset.hasMoved === 'true';
            
            let validMoves = [];
            
            // Get valid moves based on piece type
            switch(type) {
                case 'pawn':
                    validMoves = getValidPawnMoves(row, col, color, hasMoved);
                    break;
                case 'rook':
                    validMoves = getValidRookMoves(row, col, color);
                    break;
                case 'knight':
                    validMoves = getValidKnightMoves(row, col, color);
                    break;
                case 'bishop':
                    validMoves = getValidBishopMoves(row, col, color);
                    break;
                case 'queen':
                    validMoves = getValidQueenMoves(row, col, color);
                    break;
                case 'king':
                    validMoves = getValidKingMoves(row, col, color, hasMoved);
                    break;
            }
            
            // Only highlight squares of pieces that have at least one legal move
            if (validMoves.length > 0) {
                square.classList.add('eligible-piece-square');
            }
        });
    }
}); 