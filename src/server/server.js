const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            console.error('Invalid JSON message:', message);
            return;
        }

        const jsonString = JSON.stringify(parsedMessage);

        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(jsonString);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
