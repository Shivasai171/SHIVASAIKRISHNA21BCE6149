const WebSocket = require('ws');
const Game = require('./gameLogic');

const wss = new WebSocket.Server({ port: 8080 });
const game = new Game();

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'init':
                game.initPlayer(data.player, data.characters);
                broadcast({ type: 'update', grid: game.grid, turn: game.turn });
                break;
            case 'move':
                const result = game.processMove(data.player, data.character, data.move);
                if (result.error) {
                    ws.send(JSON.stringify({ type: 'error', message: result.error }));
                } else {
                    broadcast({ type: 'update', grid: result.grid, turn: result.turn });
                    checkGameOver();
                }
                break;
            // Additional cases for handling disconnections, game over, etc.
        }
    });

    // Send initial game state
    ws.send(JSON.stringify({ type: 'init', grid: game.grid, turn: game.turn }));
});

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function checkGameOver() {
    // Implement game over logic
    // If game over, broadcast game over message
}