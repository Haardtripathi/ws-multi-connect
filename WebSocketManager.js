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


















// const axios = require('axios');
// const WebSocket = require('ws');

// class WebSocketManager {
//     constructor() {
//         this.clients = new Map(); // Store multiple WebSocket connections
//         this.authTokens = new Map(); // Store authentication tokens per URL
//     }

//     /**
//      * Fetch authentication token if required, supporting OAuth, JWT, and challenge-response authentication.
//      * @param {object} authConfig - API authentication configuration
//      * @returns {Promise<string|null>} - Authentication token or null
//      */
//     async fetchAuthToken(authConfig) {
//         if (!authConfig || !authConfig.url) return null; // No authentication required
//         try {
//             let response;

//             if (authConfig.method === 'GET') {
//                 response = await axios.get(authConfig.url, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                     params: authConfig.params || {}
//                 });
//             } else {
//                 response = await axios.post(authConfig.url, authConfig.params, {
//                     headers: authConfig.headers || { 'Content-Type': 'application/json' }
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
//      * Handle session-based authentication by storing and reusing cookies
//      * @param {object} authConfig - API authentication configuration
//      * @returns {Promise<object|null>} - Cookie session or null
//      */
//     async fetchSession(authConfig) {
//         if (!authConfig || !authConfig.url) return null;
//         try {
//             const response = await axios.post(authConfig.url, authConfig.params, {
//                 headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                 withCredentials: true
//             });

//             if (response.headers['set-cookie']) {
//                 console.log("✅ Session Cookies Received:", response.headers['set-cookie']);
//                 return { cookies: response.headers['set-cookie'] };
//             }
//         } catch (error) {
//             console.error("❌ Error getting session:", error.response?.data || error.message);
//         }
//         return null;
//     }

//     /**
//      * Establish WebSocket connection with authentication support, including session management and challenge-response.
//      * @param {string} url - WebSocket URL
//      * @param {object} options - Connection options (headers, API keys, autoReconnect, etc.)
//      * @returns {Promise<WebSocket>} - WebSocket instance
//      */
//     async connect(url, options = {}) {
//         let wsUrl = url;
//         let headers = {};
//         let cookies = null;

//         // Fetch authentication token if required
//         let authToken = null;
//         if (options.auth) {
//             authToken = await this.fetchAuthToken(options.auth);
//         }

//         // Fetch session-based authentication if required
//         if (options.sessionAuth) {
//             const session = await this.fetchSession(options.sessionAuth);
//             if (session) cookies = session.cookies;
//         }

//         // Apply authentication dynamically
//         if (authToken) {
//             if (options.auth.queryParam) {
//                 const separator = url.includes('?') ? '&' : '?';
//                 wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
//             }
//             if (options.auth.headerKey) {
//                 headers[options.auth.headerKey] = `Bearer ${authToken}`;
//             }
//         }

//         if (cookies) {
//             headers['Cookie'] = cookies.join('; ');
//         }

//         // Prevent duplicate connections
//         if (this.clients.has(wsUrl)) {
//             console.log(`Already connected to ${wsUrl}`);
//             return this.clients.get(wsUrl);
//         }

//         const ws = new WebSocket(wsUrl, { headers });

//         ws.on('open', () => {
//             console.log(`🔗 Connected to ${wsUrl}`);
//             if (options.onOpen) options.onOpen(ws);
//         });

//         ws.on('message', (message) => {
//             console.log(`📩 Message from ${wsUrl}:`, message.toString());
//             if (options.onMessage) options.onMessage(message);
//         });

//         ws.on('close', (code, reason) => {
//             console.log(`❌ Connection closed (Code: ${code}, Reason: ${reason})`);
//             this.clients.delete(wsUrl);
//             if (options.autoReconnect) {
//                 console.log(`🔄 Reconnecting to ${wsUrl}...`);
//                 setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
//             }
//         });

//         ws.on('error', (error) => {
//             console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
//             if (options.onError) options.onError(error);
//         });

//         this.clients.set(wsUrl, ws);
//         return ws;
//     }

//     /**
//      * Send data to a WebSocket server
//      * @param {string} url - WebSocket URL
//      * @param {string|Buffer} data - Data to send
//      */
//     send(url, data) {
//         const ws = this.clients.get(url);
//         if (ws && ws.readyState === WebSocket.OPEN) {
//             ws.send(data);
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
// }

// module.exports = WebSocketManager;




// const axios = require('axios');
// const WebSocket = require('ws');

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
//      * Fetch session-based authentication (cookies)
//      * @param {object} authConfig - API authentication configuration
//      * @returns {Promise<object|null>} - Cookie session or null
//      */
//     async fetchSession(authConfig) {
//         if (!authConfig || !authConfig.url) return null;
//         try {
//             const response = await axios.post(authConfig.url, authConfig.params, {
//                 headers: authConfig.headers || { 'Content-Type': 'application/json' },
//                 withCredentials: true,
//             });

//             if (response.headers['set-cookie']) {
//                 console.log("✅ Session Cookies Received:", response.headers['set-cookie']);
//                 return { cookies: response.headers['set-cookie'] };
//             }
//         } catch (error) {
//             console.error("❌ Error getting session:", error.response?.data || error.message);
//         }
//         return null;
//     }

//     /**
//      * Establish WebSocket connection with authentication support
//      * @param {string} url - WebSocket URL
//      * @param {object} options - Connection options
//      * @returns {Promise<WebSocket>} - WebSocket instance
//      */
//     async connect(url, options = {}) {
//         let wsUrl = url;
//         let headers = {};
//         let cookies = null;

//         // Fetch authentication token if required
//         let authToken = null;
//         if (options.auth) {
//             authToken = await this.fetchAuthToken(options.auth);
//         }

//         // Fetch session-based authentication if required
//         if (options.sessionAuth) {
//             const session = await this.fetchSession(options.sessionAuth);
//             if (session) cookies = session.cookies;
//         }

//         // Apply authentication dynamically
//         if (authToken) {
//             if (options.auth.queryParam) {
//                 const separator = url.includes('?') ? '&' : '?';
//                 wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
//             }
//             if (options.auth.headerKey) {
//                 headers[options.auth.headerKey] = `Bearer ${authToken}`;
//             }
//         }

//         if (cookies) {
//             headers['Cookie'] = cookies.join('; ');
//         }

//         // Prevent duplicate connections
//         if (this.clients.has(wsUrl)) {
//             console.log(`Already connected to ${wsUrl}`);
//             return this.clients.get(wsUrl);
//         }

//         const ws = new WebSocket(wsUrl, { headers });

//         ws.on('open', () => {
//             console.log(`🔗 Connected to ${wsUrl}`);
//             if (options.onOpen) options.onOpen(ws);
//         });

//         ws.on('message', async (message) => {
//             console.log(`📩 Message from ${wsUrl}:`, message.toString());
//             this.executeDynamicFunction(message.toString(), ws);
//             if (options.onMessage) options.onMessage(message);
//         });

//         ws.on('close', (code, reason) => {
//             console.log(`❌ Connection closed (Code: ${code}, Reason: ${reason})`);
//             this.clients.delete(wsUrl);
//             if (options.autoReconnect) {
//                 console.log(`🔄 Reconnecting to ${wsUrl}...`);
//                 setTimeout(() => this.connect(url, options), options.reconnectInterval || 5000);
//             }
//         });

//         ws.on('error', (error) => {
//             console.error(`🚨 WebSocket error on ${wsUrl}:`, error);
//             if (options.onError) options.onError(error);
//         });

//         this.clients.set(wsUrl, ws);
//         return ws;
//     }

//     /**
//      * Send data to a WebSocket server
//      * @param {string} url - WebSocket URL
//      * @param {string|Buffer} data - Data to send
//      */
//     send(url, data) {
//         const ws = this.clients.get(url);
//         if (ws && ws.readyState === WebSocket.OPEN) {
//             ws.send(data);
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

//     /**
//      * Execute function dynamically from WebSocket message
//      */
//     executeDynamicFunction(message, ws) {
//         try {
//             const parsed = JSON.parse(message); // Expecting { function: "functionName", data: "payload" }
//             if (parsed.function && this.functionRegistry.has(parsed.function)) {
//                 this.functionRegistry.get(parsed.function)(parsed.data, ws);
//             } else {
//                 console.warn(`⚠️ Unknown function: ${parsed.function}`);
//             }
//         } catch (error) {
//             console.error("❌ Invalid message format:", message);
//         }
//     }
// }

// module.exports = WebSocketManager;




const axios = require('axios');
const WebSocket = (typeof window !== 'undefined') ? window.WebSocket : require('ws');

class WebSocketManager {
    constructor() {
        this.clients = new Map(); // Store multiple WebSocket connections
        this.authTokens = new Map(); // Store authentication tokens per URL
        this.functionRegistry = new Map(); // Store dynamic functions
    }

    /**
     * Fetch authentication token (OAuth, JWT, API keys)
     * @param {object} authConfig - API authentication configuration
     * @returns {Promise<string|null>} - Authentication token or null
     */
    async fetchAuthToken(authConfig) {
        if (!authConfig || !authConfig.url) return null;
        try {
            let response;

            if (authConfig.method === 'GET') {
                response = await axios.get(authConfig.url, {
                    headers: authConfig.headers || { 'Content-Type': 'application/json' },
                    params: authConfig.params || {},
                });
            } else {
                response = await axios.post(authConfig.url, authConfig.params, {
                    headers: authConfig.headers || { 'Content-Type': 'application/json' },
                });
            }

            if (response.data) {
                console.log("✅ Auth Token Received:", response.data);
                return authConfig.tokenPath ? response.data[authConfig.tokenPath] : response.data;
            }
        } catch (error) {
            console.error("❌ Error getting token:", error.response?.data || error.message);
        }
        return null;
    }

    /**
     * Fetch session-based authentication (cookies)
     */
    async fetchSession(authConfig) {
        if (!authConfig || !authConfig.url) return null;
        try {
            const response = await axios.post(authConfig.url, authConfig.params, {
                headers: authConfig.headers || { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.headers['set-cookie']) {
                console.log("✅ Session Cookies Received:", response.headers['set-cookie']);
                return { cookies: response.headers['set-cookie'] };
            }
        } catch (error) {
            console.error("❌ Error getting session:", error.response?.data || error.message);
        }
        return null;
    }

    /**
     * Establish WebSocket connection with authentication support
     */
    async connect(url, options = {}) {
        let wsUrl = url;
        let headers = {};
        let cookies = null;

        let authToken = null;
        if (options.auth) {
            authToken = await this.fetchAuthToken(options.auth);
        }

        if (options.sessionAuth) {
            const session = await this.fetchSession(options.sessionAuth);
            if (session) cookies = session.cookies;
        }

        if (authToken) {
            if (options.auth.queryParam) {
                const separator = url.includes('?') ? '&' : '?';
                wsUrl = `${url}${separator}${options.auth.queryParam}=${authToken}`;
            }
            if (options.auth.headerKey) {
                headers[options.auth.headerKey] = `Bearer ${authToken}`;
            }
        }

        if (cookies) {
            headers['Cookie'] = cookies.join('; ');
        }

        if (this.clients.has(wsUrl)) {
            console.log(`Already connected to ${wsUrl}`);
            return this.clients.get(wsUrl);
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log(`🔗 Connected to ${wsUrl}`);
            if (options.onOpen) options.onOpen(ws);
        };

        ws.onmessage = (event) => {
            console.log(`📩 Message from ${wsUrl}:`, event.data);
            this.executeDynamicFunction(event.data, ws);
            if (options.onMessage) options.onMessage(event.data);
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

    /**
     * Send data to a WebSocket server
     * @param {string} url - WebSocket URL
     * @param {object} data - Data to send
     */
    send(url, data) {
        const ws = this.clients.get(url);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.error(`WebSocket ${url} is not open.`);
        }
    }

    /**
     * Close a WebSocket connection
     */
    close(url) {
        const ws = this.clients.get(url);
        if (ws) {
            ws.close();
            this.clients.delete(url);
        }
    }

    /**
     * Close all WebSocket connections
     */
    closeAll() {
        for (const [url, ws] of this.clients.entries()) {
            ws.close();
            this.clients.delete(url);
        }
    }

    /**
     * Register a function dynamically
     * @param {string} name - Function name
     * @param {Function} func - The function to execute when called via WebSocket
     */
    registerFunction(name, func) {
        this.functionRegistry.set(name, func);
    }

    /**
     * Execute function dynamically from WebSocket message
     */
    executeDynamicFunction(message, ws) {
        try {
            const parsed = JSON.parse(message);
            if (parsed.function && this.functionRegistry.has(parsed.function)) {
                this.functionRegistry.get(parsed.function)(parsed.data, ws);
            } else {
                console.warn(`⚠️ Unknown function: ${parsed.function}`);
            }
        } catch (error) {
            console.error("❌ Invalid message format:", message);
        }
    }
}

// Export the module for Node.js and make it usable in the frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebSocketManager;
}
