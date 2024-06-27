const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = new Map();
let chatRooms = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.senderUsername && !parsedMessage.receiverUsername) {
                users.set(parsedMessage.senderUsername, ws);
                console.log(`User ${parsedMessage.senderUsername} connected`);
                return;
            }

            if (parsedMessage.senderUsername && parsedMessage.receiverUsername) {
                const sender = parsedMessage.senderUsername;
                const receiver = parsedMessage.receiverUsername;
                const chatKey = [sender, receiver].sort().join('-');

                if (!chatRooms.has(chatKey)) {
                    chatRooms.set(chatKey, []);
                }

                const chatRoom = chatRooms.get(chatKey);
                if (!chatRoom.some(client => client.ws === ws)) {
                    chatRoom.push({ ws, username: sender });
                }

                const receiverWs = users.get(receiver);
                if (receiverWs && !chatRoom.some(client => client.ws === receiverWs)) {
                    chatRoom.push({ ws: receiverWs, username: receiver });
                }

                const jsonString = JSON.stringify(parsedMessage);
                chatRoom.forEach(client => {
                    if (client.ws.readyState === WebSocket.OPEN && client.ws !== ws) {
                        client.ws.send(jsonString);
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    });

    ws.on('close', () => {
        chatRooms.forEach((clients, chatKey) => {
            chatRooms.set(chatKey, clients.filter(client => client.ws !== ws));
            if (chatRooms.get(chatKey).length === 0) {
                chatRooms.delete(chatKey);
            }
        });
        users.forEach((value, key) => {
            if (value === ws) {
                users.delete(key);
            }
        });
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
