const WebSocket = require('ws');

class WebSocketManager {
    constructor() {
        this.connections = new Map(); // Store WebSocket instances
    }

    /**
     * Connects to a WebSocket URL and sets up event listeners.
     * @param {string} url - The WebSocket server URL.
     * @param {object} options - Custom options.
     * @returns {WebSocket} - The WebSocket instance.
     */
    connect(url, options = {}) {
        if (this.connections.has(url)) {
            console.log(`Already connected to ${url}`);
            return this.connections.get(url);
        }

        const ws = new WebSocket(url, options.protocols || []);

        ws.on('open', () => {
            console.log(`Connected to ${url}`);
            if (options.onOpen) options.onOpen(ws);
        });

        ws.on('message', (message) => {
            console.log(`Message from ${url}:`, message.toString());
            if (options.onMessage) options.onMessage(message);
        });

        ws.on('close', (code, reason) => {
            console.log(`Connection to ${url} closed (Code: ${code}, Reason: ${reason})`);
            this.connections.delete(url);
            if (options.autoReconnect) {
                console.log(`Reconnecting to ${url}...`);
                setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
            }
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error on ${url}:`, error);
            if (options.onError) options.onError(error);
        });

        this.connections.set(url, ws);
        return ws;
    }

    /**
     * Sends data to a WebSocket connection.
     * @param {string} url - The WebSocket URL.
     * @param {string|Buffer} data - Data to send.
     */
    send(url, data) {
        const ws = this.connections.get(url);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        } else {
            console.error(`WebSocket ${url} is not open.`);
        }
    }

    /**
     * Closes a WebSocket connection.
     * @param {string} url - The WebSocket URL.
     */
    close(url) {
        const ws = this.connections.get(url);
        if (ws) {
            ws.close();
            this.connections.delete(url);
        }
    }

    /**
     * Closes all WebSocket connections.
     */
    closeAll() {
        for (const [url, ws] of this.connections.entries()) {
            ws.close();
            this.connections.delete(url);
        }
    }
}

module.exports = WebSocketManager;
