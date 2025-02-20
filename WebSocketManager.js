// const WebSocket = require('ws');

// class WebSocketManager {
//     constructor() {
//         this.connections = new Map(); // Store WebSocket instances
//     }

//     /**
//      * Connects to a WebSocket URL and sets up event listeners.
//      * @param {string} url - The WebSocket server URL.
//      * @param {object} options - Custom options.
//      * @returns {WebSocket} - The WebSocket instance.
//      */
//     connect(url, options = {}) {
//         if (this.connections.has(url)) {
//             console.log(`Already connected to ${url}`);
//             return this.connections.get(url);
//         }

//         const ws = new WebSocket(url, options.protocols || []);

//         ws.on('open', () => {
//             console.log(`Connected to ${url}`);
//             if (options.onOpen) options.onOpen(ws);
//         });

//         ws.on('message', (message) => {
//             console.log(`Message from ${url}:`, message.toString());
//             if (options.onMessage) options.onMessage(message);
//         });

//         ws.on('close', (code, reason) => {
//             console.log(`Connection to ${url} closed (Code: ${code}, Reason: ${reason})`);
//             this.connections.delete(url);
//             if (options.autoReconnect) {
//                 console.log(`Reconnecting to ${url}...`);
//                 setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
//             }
//         });

//         ws.on('error', (error) => {
//             console.error(`WebSocket error on ${url}:`, error);
//             if (options.onError) options.onError(error);
//         });

//         this.connections.set(url, ws);
//         return ws;
//     }

//     /**
//      * Sends data to a WebSocket connection.
//      * @param {string} url - The WebSocket URL.
//      * @param {string|Buffer} data - Data to send.
//      */
//     send(url, data) {
//         const ws = this.connections.get(url);
//         if (ws && ws.readyState === WebSocket.OPEN) {
//             ws.send(data);
//         } else {
//             console.error(`WebSocket ${url} is not open.`);
//         }
//     }

//     /**
//      * Closes a WebSocket connection.
//      * @param {string} url - The WebSocket URL.
//      */
//     close(url) {
//         const ws = this.connections.get(url);
//         if (ws) {
//             ws.close();
//             this.connections.delete(url);
//         }
//     }

//     /**
//      * Closes all WebSocket connections.
//      */
//     closeAll() {
//         for (const [url, ws] of this.connections.entries()) {
//             ws.close();
//             this.connections.delete(url);
//         }
//     }
// }

// module.exports = WebSocketManager;

const axios = require('axios');
const WebSocket = require('ws');

class WebSocketManager {
    constructor() {
        this.connections = new Map(); // Store WebSocket instances
    }

    /**
     * Fetches authentication token dynamically (if required)
     * @param {object} authConfig - API authentication configuration
     */
    async fetchAuthToken(authConfig) {
        if (!authConfig || !authConfig.url) {
            return null; // No auth required
        }

        try {
            const response = await axios.post(authConfig.url, authConfig.params, {
                headers: authConfig.headers || { 'Content-Type': 'application/json' }
            });

            if (response.data) {
                console.log("✅ Auth Token Received:", response.data);
                return authConfig.tokenPath ? response.data[authConfig.tokenPath] : response.data;
            } else {
                console.error("❌ Failed to get token!");
                return null;
            }
        } catch (error) {
            console.error("❌ Error getting token:", error.response?.data || error.message);
            return null;
        }
    }

    /**
     * Connects to WebSocket with flexible authentication
     * @param {string} url - WebSocket URL
     * @param {object} options - Connection options (headers, API keys, autoReconnect, etc.)
     */
    async connect(url, options = {}) {
        let wsUrl = url;
        let wsOptions = {};

        // If authentication is required, fetch token first
        let authToken = null;
        if (options.auth) {
            authToken = await this.fetchAuthToken(options.auth);
        }

        // Apply authentication dynamically
        if (authToken) {
            if (options.auth.queryParam) {
                // If API needs the token in the URL (query param)
                const separator = url.includes('?') ? '&' : '?';
                wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
            }

            if (options.auth.headerKey) {
                // If API needs the token in headers
                wsOptions.headers = {
                    ...(wsOptions.headers || {}),
                    [options.auth.headerKey]: `Bearer ${authToken}`
                };
            }
        }

        // Prevent duplicate connections
        if (this.connections.has(wsUrl)) {
            console.log(`Already connected to ${wsUrl}`);
            return this.connections.get(wsUrl);
        }

        // Create WebSocket connection
        const ws = new WebSocket(wsUrl, wsOptions);

        ws.on('open', () => {
            console.log(`🔗 Connected to ${wsUrl}`);
            if (options.onOpen) options.onOpen(ws);
        });

        ws.on('message', (message) => {
            console.log(`📩 Message from ${wsUrl}:`, message.toString());
            if (options.onMessage) options.onMessage(message);
        });

        ws.on('close', (code, reason) => {
            console.log(`❌ Connection closed (Code: ${code}, Reason: ${reason})`);
            this.connections.delete(wsUrl);
            if (options.autoReconnect) {
                console.log(`🔄 Reconnecting to ${wsUrl}...`);
                setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
            }
        });

        ws.on('error', (error) => {
            console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
            if (options.onError) options.onError(error);
        });

        this.connections.set(wsUrl, ws);
        return ws;
    }
}

module.exports = WebSocketManager;
