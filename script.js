const ws = new WebSocket('ws://localhost:8080');
let player = 'A';  // Or 'B', based on player selection
let selectedCharacter = null;

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    switch (data.type) {
        case 'init':
            updateBoard(data.grid);
            updateTurnIndicator(data.turn);
            break;
        case 'update':
            updateBoard(data.grid);
            updateTurnIndicator(data.turn);
            break;
        case 'error':
            alert(data.message);
            break;
        // Additional cases for handling game over, etc.
    }
};

function updateBoard(grid) {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell;
            cellDiv.addEventListener('click', () => onCellClick(rowIndex, colIndex));
            board.appendChild(cellDiv);
        });
    });
}

function onCellClick(row, col) {
    if (selectedCharacter) {
        // Send move to server
        const move = calculateMove(row, col);
        ws.send(JSON.stringify({ type: 'move', player, character: selectedCharacter, move }));
        selectedCharacter = null;
    } else {
        // Select character
        const character = getCharacterAt(row, col);
        if (character && character.startsWith(player)) {
            selectedCharacter = character;
            showMoveOptions(character);
        }
    }
}

function showMoveOptions(character) {
    // Display possible moves for the selected character
    const moveOptions = document.getElementById('move-options');
    moveOptions.innerHTML = '';
    const moves = getPossibleMoves(character);
    moves.forEach(move => {
        const btn = document.createElement('button');
        btn.textContent = move;
        btn.addEventListener('click', () => makeMove(character, move));
        moveOptions.appendChild(btn);
    });
}

function makeMove(character, move) {
    ws.send(JSON.stringify({ type: 'move', player, character, move }));
}

function updateTurnIndicator(turn) {
    const indicator = document.getElementById('turn-indicator');
    indicator.textContent = Current turn: Player ${turn};
}

function calculateMove(row, col) {
    // Calculate the move command based on the selected character's position and the clicked cell
    // This will depend on the game rules and character movement logic
}

function getCharacterAt(row, col) {
    // Return the character at the given grid position
}

function getPossibleMoves(character) {
    // Return the list of possible moves for the selected character
}