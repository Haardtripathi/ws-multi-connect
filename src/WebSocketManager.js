

// const axios = require('axios');
// const WebSocket = (typeof window !== 'undefined') ? window.WebSocket : require('ws');

// class WebSocketManager {
//     constructor() {
//         this.clients = new Map(); // Store multiple WebSocket connections
//         this.authTokens = new Map(); // Store authentication tokens per URL
//         this.functionRegistry = new Map(); // Store dynamic functions
//     }

//     /**
//      * Fetch authentication token (OAuth, JWT, API keys)
//      * @param {object} authConfig - API authentication configuration
//      * @returns {Promise<string|null>} - Authentication token or null
//      */
//     async fetchAuthToken(authConfig) {
//         if (!authConfig || !authConfig.url) return null;
//         try {
//             let response;
//             if (authConfig.method === 'GET') {
//                 response = await axios.get(authConfig.url, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                     params: authConfig.params || {},
//                 });
//             } else {
//                 response = await axios.post(authConfig.url, authConfig.params, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                 });
//             }

//             if (response.data) {
//                 console.log("✅ Auth Token Received:", response.data);
//                 return authConfig.tokenPath ? response.data[authConfig.tokenPath] : response.data;
//             }
//         } catch (error) {
//             console.error("❌ Error getting token:", error.response?.data || error.message);
//         }
//         return null;
//     }

//     /**
//      * Establish WebSocket connection with authentication support
//      * @param {string} url - WebSocket URL
//      * @param {object} options - Connection options (headers, API keys, autoReconnect, etc.)
//      * @returns {Promise<WebSocket>} - WebSocket instance
//      */
//     async connect(url, options = {}) {
//         let wsUrl = url;
//         let headers = {};
//         let cookies = null;

//         Fetch authentication token if required
//         let authToken = null;
//         if (options.auth) {
//             authToken = await this.fetchAuthToken(options.auth);
//         }

//         Apply authentication dynamically
//         if (authToken) {
//             if (options.auth.queryParam) {
//                 const separator = url.includes('?') ? '&' : '?';
//                 wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
//             }
//             if (options.auth.headerKey) {
//                 headers[options.auth.headerKey] = `Bearer ${authToken}`;
//             }
//         }

//         Prevent duplicate connections
//         if (this.clients.has(wsUrl)) {
//             console.log(`Already connected to ${wsUrl}`);
//             return this.clients.get(wsUrl);
//         }

//         Create WebSocket connection
//         const ws = new WebSocket(wsUrl, { headers });

//         ws.onopen = () => {
//             console.log(`🔗 Connected to ${wsUrl}`);

//             If an authentication message is needed, send it
//             if (options.authMessage) {
//                 ws.send(JSON.stringify(options.authMessage));
//             }

//             if (options.onOpen) options.onOpen(ws);
//         };

//         ws.onmessage = (event) => {
//             const msg = event.data;
//             this.processIncomingMessage(msg, ws, options);
//         };

//         ws.onclose = (event) => {
//             console.log(`❌ Connection closed (Code: ${event.code}, Reason: ${event.reason})`);
//             this.clients.delete(wsUrl);

//             if (options.autoReconnect) {
//                 console.log(`🔄 Reconnecting to ${wsUrl}...`);
//                 setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
//             }
//         };

//         ws.onerror = (error) => {
//             console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
//             if (options.onError) options.onError(error);
//         };

//         this.clients.set(wsUrl, ws);
//         return ws;
//     }

//     /**
//      * Process incoming WebSocket messages
//      * @param {string} message - The received WebSocket message
//      * @param {WebSocket} ws - WebSocket instance
//      * @param {object} options - User-defined handlers
//      */
//     processIncomingMessage(message, ws, options) {
//         try {
//             const parsed = JSON.parse(message);

//             Ignore heartbeat messages
//             if (parsed.type === "ping" || parsed.type === "heartbeat") {
//                 return;
//             }

//             If the API uses function-based messages, process them
//             if (parsed.function && this.functionRegistry.has(parsed.function)) {
//                 this.functionRegistry.get(parsed.function)(parsed.data, ws);
//             }
//             Handle API-specific message formats
//             else if (parsed.event) {
//                 console.log(`📩 Event: ${parsed.event}`, parsed.data);
//             }
//             Handle raw array responses (some APIs return messages as arrays)
//             else if (Array.isArray(parsed)) {
//                 console.log("📩 Array message received:", parsed);
//             }
//             Default case for unknown formats
//             else {
//                 console.log("📩 WebSocket message received:", parsed);
//             }

//             Call user-defined message handler if provided
//             if (options.onMessage) options.onMessage(parsed, ws);

//         } catch (error) {
//             console.error("❌ Invalid WebSocket message format:", message);
//         }
//     }

//     /**
//      * Send data to a WebSocket server
//      * @param {string} url - WebSocket URL
//      * @param {object} data - Data to send
//      */
//     send(url, data) {
//         const ws = this.clients.get(url);
//         if (ws && ws.readyState === WebSocket.OPEN) {
//             ws.send(JSON.stringify(data));
//         } else {
//             console.error(`WebSocket ${url} is not open.`);
//         }
//     }

//     /**
//      * Close a WebSocket connection
//      * @param {string} url - WebSocket URL
//      */
//     close(url) {
//         const ws = this.clients.get(url);
//         if (ws) {
//             ws.close();
//             this.clients.delete(url);
//         }
//     }

//     /**
//      * Close all WebSocket connections
//      */
//     closeAll() {
//         for (const [url, ws] of this.clients.entries()) {
//             ws.close();
//             this.clients.delete(url);
//         }
//     }

//     /**
//      * Register a function dynamically
//      * @param {string} name - Function name
//      * @param {Function} func - The function to execute when called via WebSocket
//      */
//     registerFunction(name, func) {
//         this.functionRegistry.set(name, func);
//     }
// }

// Export the module for Node.js and browser compatibility
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = WebSocketManager;
// }
























// Import dependencies
import ws from "ws";
import http from "http";
import axios from "axios";
const WebSocket = typeof window !== "undefined" ? window.WebSocket : ws;

class WebSocketManager {
    constructor() {
        this.clients = new Map();
        this.authTokens = new Map();
        this.functionRegistry = new Map();
        this.server = null;
        this.lastMessage = "";
    }

    async fetchAuthToken(authConfig) {
        if (!authConfig || !authConfig.url) return null;
        try {
            let response;
            if (authConfig.method === 'GET') {
                response = await axios.get(authConfig.url, { headers: authConfig.headers || {} });
            } else {
                response = await axios.post(authConfig.url, authConfig.params, { headers: authConfig.headers || {} });
            }
            return authConfig.tokenPath ? response.data[authConfig.tokenPath] : response.data;
        } catch (error) {
            console.error("❌ Error getting token:", error.response?.data || error.message);
        }
        return null;
    }

    startServer(port = 5001) {
        const server = http.createServer();
        this.server = new WebSocket.Server({ server });

        this.server.on('connection', (ws) => {
            console.log("🔗 New WebSocket client connected");
            ws.send(JSON.stringify({ lastMessage: this.lastMessage }));

            ws.on('message', (message) => {
                this.lastMessage = message.toString();
                console.log(`💬 New Message: ${this.lastMessage}`);
                this.server.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ lastMessage: this.lastMessage }));
                    }
                });
            });

            ws.on('close', () => console.log("❌ Client Disconnected"));
        });

        server.listen(port, () => console.log(`✅ WebSocket Server running on port ${port}`));
        return this.server;
    }

    async connect(url, options = {}) {
        let wsUrl = url;

        // Step 1: Handle authentication via HTTP request (if required)
        if (options.auth) {
            const authToken = await this.fetchAuthToken(options.auth);
            if (authToken) {
                if (options.auth.queryParam) {
                    const separator = url.includes('?') ? '&' : '?';
                    wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
                }
            }
        }

        if (this.clients.has(wsUrl)) {
            console.log(`Already connected to ${wsUrl}`);
            return this.clients.get(wsUrl);
        }
        const ws = new WebSocket(wsUrl, Array.isArray(options.subprotocols) ? options.subprotocols : undefined);




        ws.onopen = () => {
            console.log(`🔗 Connected to ${wsUrl}`);

            // Step 3: Send authentication headers as a message
            if (options.auth && options.auth.headerKey) {
                ws.send(JSON.stringify({
                    function: "auth",
                    token: options.auth.headerKey, // ✅ Send headers manually after connecting
                }));
            }

            if (options.onOpen) options.onOpen(ws);
        };

        ws.onmessage = (event) => {
            const msg = event.data;
            this.processIncomingMessage(msg, ws, options);
        };

        ws.onclose = (event) => {
            console.log(`❌ Connection closed (Code: ${event.code}, Reason: ${event.reason})`);
            this.clients.delete(wsUrl);
            if (options.autoReconnect) {
                console.log(`🔄 Reconnecting to ${wsUrl}...`);
                setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
            }
        };

        ws.onerror = (error) => {
            console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
            if (options.onError) options.onError(error);
        };

        this.clients.set(wsUrl, ws);
        return ws;
    }


    // processIncomingMessage(message, ws, options) {
    //     try {
    //         const parsed = JSON.parse(message);
    //         if (parsed.type === "ping" || parsed.type === "heartbeat") return;
    //         if (parsed.function && this.functionRegistry.has(parsed.function)) {
    //             this.functionRegistry.get(parsed.function)(parsed.data, ws);
    //         } else {
    //             console.log("📩 WebSocket message received:", parsed);
    //         }
    //         if (options.onMessage) options.onMessage(parsed, ws);
    //     } catch (error) {
    //         console.error("❌ Invalid WebSocket message format:", message);
    //     }
    // }
    processIncomingMessage(message, ws, options) {
        try {
            const parsed = JSON.parse(message);
            console.log(`📩 Received WebSocket message: ${JSON.stringify(parsed)}`);

            if (parsed.type === "ping" || parsed.type === "heartbeat") return;

            if (parsed.function && this.functionRegistry.has(parsed.function)) {
                console.log(`⚡ Looking up function: ${parsed.function}`);

                const fn = this.functionRegistry.get(parsed.function);
                if (!fn) {
                    console.error(`❌ Function ${parsed.function} not found!`);
                    return;
                }

                console.log(`🚀 Running function: ${parsed.function} with data:`, parsed);

                try {
                    fn(parsed.data, ws);  // Extract only data
                    // ✅ Fix: Pass `parsed` directly, not `parsed.data`
                    console.log(`✅ Successfully executed: ${parsed.function}`);
                } catch (error) {
                    console.error(`❌ Error executing function ${parsed.function}:`, error);
                }
            } else {
                console.log("📩 WebSocket message received, but function not found:", parsed.function);
                console.log("🛠 Available functions:", Array.from(this.functionRegistry.keys()));
            }

            if (options.onMessage) options.onMessage(parsed, ws);
        } catch (error) {
            console.error("❌ Invalid WebSocket message format:", message);
        }
    }



    send(url, data) {
        const ws = this.clients.get(url);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.error(`WebSocket ${url} is not open.`);
        }
    }

    close(url) {
        const ws = this.clients.get(url);
        if (ws) {
            ws.close();
            this.clients.delete(url);
        }
    }

    closeAll() {
        for (const [url, ws] of this.clients.entries()) {
            ws.close();
            this.clients.delete(url);
        }
    }

    registerFunction(name, func) {
        this.functionRegistry.set(name, func);
    }
}

// ✅ Export only for ESM
export { WebSocketManager };

























// const axios = require('axios');
// const WebSocket = (typeof window !== 'undefined') ? window.WebSocket : require('ws');
// const http = require('http');

// class WebSocketManager {
//     constructor() {
//         this.clients = new Map(); // Store multiple WebSocket connections
//         this.authTokens = new Map(); // Store authentication tokens per URL
//         this.functionRegistry = new Map(); // Store dynamic functions
//         this.server = null; // Store WebSocket server instance
//         this.lastMessage = ""; // Store last message (not permanently)
//         this.groups = new Map(); // Store groups and their members
//     }

//     /**
//      * Start a WebSocket Server
//      * @param {number} port - Port to run the WebSocket server
//      */
//     startServer(port = 5001) {
//         const server = http.createServer();
//         this.server = new WebSocket.Server({ server });

//         this.server.on('connection', (ws) => {
//             console.log("🔗 New WebSocket client connected");
//             ws.send(JSON.stringify({ lastMessage: this.lastMessage }));

//             ws.on('message', (message) => {
//                 try {
//                     const msg = JSON.parse(message.toString());

//                     if (msg.type === "joinGroup") {
//                         this.joinGroup(ws, msg.group);
//                     } else if (msg.type === "leaveGroup") {
//                         this.leaveGroup(ws, msg.group);
//                     } else if (msg.type === "groupMessage") {
//                         this.sendToGroup(msg.group, msg.text, ws);
//                     } else {
//                         this.lastMessage = msg.text; // Save last message
//                         console.log(`💬 New Message: ${this.lastMessage}`);

//                         this.server.clients.forEach(client => {
//                             if (client.readyState === WebSocket.OPEN) {
//                                 client.send(JSON.stringify({ lastMessage: this.lastMessage }));
//                             }
//                         });
//                     }
//                 } catch (error) {
//                     console.error("❌ Error processing message:", error);
//                 }
//             });

//             ws.on('close', () => {
//                 console.log("❌ Client Disconnected");
//                 this.removeFromGroups(ws);
//             });
//         });

//         server.listen(port, () => {
//             console.log(`✅ WebSocket Server running on port ${port}`);
//         });

//         return this.server;
//     }

//     async fetchAuthToken(authConfig) {
//         if (!authConfig || !authConfig.url) return null;
//         try {
//             let response;
//             if (authConfig.method === 'GET') {
//                 response = await axios.get(authConfig.url, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                     params: authConfig.params || {},
//                 });
//             } else {
//                 response = await axios.post(authConfig.url, authConfig.params, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                 });
//             }

//             if (response.data) {
//                 console.log("✅ Auth Token Received:", response.data);
//                 return authConfig.tokenPath ? response.data[authConfig.tokenPath] : response.data;
//             }
//         } catch (error) {
//             console.error("❌ Error getting token:", error.response?.data || error.message);
//         }
//         return null;
//     }

//     async connect(url, options = {}) {
//         let wsUrl = url;
//         let headers = {};

//         if (options.auth) {
//             const authToken = await this.fetchAuthToken(options.auth);
//             if (authToken) {
//                 if (options.auth.queryParam) {
//                     const separator = url.includes('?') ? '&' : '?';
//                     wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
//                 }
//                 if (options.auth.headerKey) {
//                     headers[options.auth.headerKey] = `Bearer ${authToken}`;
//                 }
//             }
//         }

//         if (this.clients.has(wsUrl)) {
//             console.log(`Already connected to ${wsUrl}`);
//             return this.clients.get(wsUrl);
//         }

//         const ws = new WebSocket(wsUrl, { headers });

//         ws.onopen = () => {
//             console.log(`🔗 Connected to ${wsUrl}`);
//             if (options.authMessage) ws.send(JSON.stringify(options.authMessage));
//             if (options.onOpen) options.onOpen(ws);
//         };

//         ws.onmessage = (event) => {
//             const msg = event.data;
//             this.processIncomingMessage(msg, ws, options);
//         };

//         ws.onclose = (event) => {
//             console.log(`❌ Connection closed (Code: ${event.code}, Reason: ${event.reason})`);
//             this.clients.delete(wsUrl);
//             if (options.autoReconnect) {
//                 console.log(`🔄 Reconnecting to ${wsUrl}...`);
//                 setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
//             }
//         };

//         ws.onerror = (error) => {
//             console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
//             if (options.onError) options.onError(error);
//         };

//         this.clients.set(wsUrl, ws);
//         return ws;
//     }

//     registerFunction(name, func) {
//         this.functionRegistry.set(name, func);
//     }

//     send(url, data) {
//         const ws = this.clients.get(url);
//         if (ws && ws.readyState === WebSocket.OPEN) {
//             ws.send(JSON.stringify(data));
//         } else {
//             console.error(`WebSocket ${url} is not open.`);
//         }
//     }

//     close(url) {
//         const ws = this.clients.get(url);
//         if (ws) {
//             ws.close();
//             this.clients.delete(url);
//         }
//     }

//     closeAll() {
//         for (const [url, ws] of this.clients.entries()) {
//             ws.close();
//             this.clients.delete(url);
//         }
//     }

//     removeFromGroups(ws) {
//         this.groups.forEach((clients, group) => {
//             if (clients.has(ws)) {
//                 clients.delete(ws);
//                 console.log(`👋 Client removed from group: ${group}`);
//             }
//         });
//     }
// }

// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = WebSocketManager;
// }

