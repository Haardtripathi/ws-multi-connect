<!--
# WebSocket Manager 🔗🔥

A powerful WebSocket manager for handling multiple WebSocket connections dynamically with ease.
Built on top of [ws](https://www.npmjs.com/package/ws), this library enables **dynamic function execution** and **event-driven WebSocket communication** with **minimal boilerplate code**.

## 🚀 Features

✅ Manage **multiple WebSocket connections** effortlessly\
✅ Supports **automatic reconnection** when a connection drops\
✅ Supports **authentication with API keys, tokens, OAuth, and headers** 🔑\
✅ Supports **session-based authentication & challenge-response flows**\
✅ Supports **dynamic message function execution** (pass function names dynamically!)\
✅ Middleware support for **message preprocessing**\
✅ Lightweight and **works in both Frontend (Browser) & Backend (Node.js)**\
✅ Simple API: **connect, send, close, registerFunction**

---

## 📦 Installation

```sh
npm install ws-multi-connect
```

---

## 🛠️ Usage

### Backend (Node.js)

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();

// Register dynamic functions
wsManager.registerFunction("sayHello", (data, ws) => {
  console.log("🟢 sayHello executed:", data);
  ws.send(JSON.stringify({ response: `Hello, ${data.name}!` }));
});

// Connect to WebSocket with API Key Authentication
wsManager.connect("wss://your-websocket-url.com", {
  autoReconnect: true,
  auth: {
    headerKey: "X-Your-API-Key", // Required API key header
    tokenPath: "", // Replace with your actual API Key
  },
  onOpen: (ws) => {
    console.log("🔗 Connected to WebSocket");

    // Subscription message required for the WebSocket API
    const subscribeMessage = {
      type: "subscribe",
      apikey: "your-api-key-here",
      channels: ["your_channel_name"],
    };

    console.log(
      "📤 Sending subscription message:",
      JSON.stringify(subscribeMessage)
    );
    ws.send(JSON.stringify(subscribeMessage));
  },
  onMessage: (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      console.log("📩 Received data:", data);
    } catch (error) {
      console.error("⚠️ Error parsing message:", msg.toString());
    }
  },
  onError: (error) => {
    console.error("🚨 WebSocket error:", error);
  },
  onClose: () => {
    console.log("❌ WebSocket connection closed");
  },
});
```

### Frontend (Browser/React)

```javascript
import WebSocketManager from "ws-multi-connect";

const wsManager = new WebSocketManager();

wsManager.registerFunction("showAlert", (data) => {
  alert(`🚀 Received message: ${data.text}`);
});

wsManager.connect("wss://your-websocket-url.com", {
  autoReconnect: true,
  onOpen: () => console.log("🔗 Connected"),
  onMessage: (msg) => console.log("📩 Received:", msg),
});

// Sending message from frontend
wsManager.send("wss://your-websocket-url.com", {
  function: "showAlert",
  data: { text: "Hello from frontend!" },
});
```

---

## 📜 API Documentation

### `connect(url, options)`

Connects to a WebSocket URL.

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `url`     | `string` | The WebSocket server URL               |
| `options` | `object` | (Optional) Settings for the connection |

#### **Options:**

- `onOpen(ws)`: Callback when the WebSocket is opened.
- `onMessage(message)`: Callback when a message is received.
- `onError(error)`: Callback for WebSocket errors.
- `autoReconnect` (default: `false`): Whether to reconnect automatically.
- `reconnectInterval` (default: `5000ms`): Time before trying to reconnect.
- `auth`: (Optional) Authentication details:
  - `url`: API URL to fetch the token.
  - `method`: HTTP method (`GET` or `POST`) for authentication.
  - `headers`: (Optional) HTTP headers to include in the auth request.
  - `params`: Object containing authentication parameters.
  - `tokenPath`: Path to extract the token from API response.
  - `queryParam`: (Optional) Attach token as a query parameter.
  - `headerKey`: (Optional) Attach token as a request header.

---

### `send(url, data)`

Sends a message to an active WebSocket.

| Parameter | Type               | Description         |
| --------- | ------------------ | ------------------- |
| `url`     | `string`           | The WebSocket URL   |
| `data`    | `string \| Buffer` | The message to send |

---

### `registerFunction(name, func)`

Registers a function that can be executed dynamically via WebSocket messages.

| Parameter | Type       | Description                                       |
| --------- | ---------- | ------------------------------------------------- |
| `name`    | `string`   | Function name that can be called dynamically      |
| `func`    | `Function` | The function to execute when called via WebSocket |

#### **Example Usage:**

```javascript
wsManager.registerFunction("uppercase", (data, ws) => {
  ws.send(JSON.stringify({ response: data.text.toUpperCase() }));
});
```

---

### `close(url)`

Closes a specific WebSocket connection.

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| `url`     | `string` | The WebSocket URL to close |

---

### `closeAll()`

Closes **all active WebSocket connections**.

---

## 🤝 Contributing

Feel free to submit issues or PRs on [GitHub](https://github.com/Haardtripathi/ws-multi-connect).

---

## 📄 License

MIT License © 2025 **Haard Tripathi** -->

# WebSocket Manager 🔗🔥

A powerful WebSocket manager for handling multiple WebSocket connections dynamically with ease.\
**Now includes WebSocket Server Support!** 🎉

Built on top of **ws**, this library enables **event-driven WebSocket communication** with **minimal boilerplate code**.

---

## **🚀 Features**

✅ **Create a WebSocket Server** \
✅ **Manage multiple WebSocket connections** dynamically\
✅ **Auto-reconnect when disconnected**\
✅ **Supports authentication (API keys, OAuth, JWT, headers)** 🔑\
✅ **Dynamic message function execution** (run functions from messages!)\
✅ **Broadcast messages to all connected clients**\
✅ **Works in both Frontend (Browser) & Backend (Node.js)**\
✅ **Lightweight & easy to integrate**

---

## **🛆 Installation**

```sh
npm install ws-multi-connect
```

---

## **🛠️ Usage**

### **1️⃣ Creating a WebSocket Server (Backend)**

With this, you no longer need **ws** separately!

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();
wsManager.startServer(5001); // Starts WebSocket server on port 5001
```

---

### **2️⃣ Connecting a Backend Client to WebSocket**

If you want your backend to **connect as a WebSocket client**:

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();
const wsUrl = "ws://localhost:5001";

wsManager.connect(wsUrl, {
  onOpen: () => console.log("✅ Backend Connected to WebSocket Server"),
  onMessage: (msg) => console.log("📩 Backend Received:", msg),
  autoReconnect: true,
});
```

---

### **3️⃣ Connecting a Frontend (Browser/React) Client**

This allows the **client (browser)** to connect and send/receive messages.

```javascript
import { WebSocketManager } from "ws-multi-connect";

const wsManager = new WebSocketManager();
const wsUrl = "ws://localhost:5001";

wsManager.connect(wsUrl, {
  onOpen: () => console.log("🔗 Frontend Connected"),
  onMessage: (msg) => console.log("📩 Received:", msg),
  autoReconnect: true,
});

// Sending message from frontend
wsManager.send(wsUrl, { text: "Hello from frontend!" });
```

---

### **4️⃣ Registering & Executing Functions via WebSocket**

You can now **register dynamic functions** that can be executed remotely via WebSocket messages.

```javascript
wsManager.registerFunction("uppercase", (data, ws) => {
  ws.send(JSON.stringify({ response: data.text.toUpperCase() }));
});
```

Now, any WebSocket client can send:

```json
{
  "function": "uppercase",
  "data": { "text": "hello world" }
}
```

And it will return:

```json
{
  "response": "HELLO WORLD"
}
```

---

## **📜 API Documentation**

Creates a WebSocket server.

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `port`    | `number` | Port to start the WebSocket server |

#### **Example**

```javascript
const wsManager = new WebSocketManager();
wsManager.startServer(5001);
```

---

Connects to a WebSocket URL.

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `url`     | `string` | The WebSocket server URL               |
| `options` | `object` | (Optional) Settings for the connection |

#### **Options**

- `onOpen(ws)`: Callback when the WebSocket is opened.
- `onMessage(message)`: Callback when a message is received.
- `onError(error)`: Callback for WebSocket errors.
- `autoReconnect` (default: `false`): Whether to reconnect automatically.
- `reconnectInterval` (default: `5000ms`): Time before trying to reconnect.
- `auth`: (Optional) Authentication details.

#### **Example**

```javascript
wsManager.connect("ws://localhost:5001", {
  onOpen: () => console.log("✅ Connected"),
  onMessage: (msg) => console.log("📩 Received:", msg),
});
```

---

## **🤝 Contributing**

Feel free to submit issues or PRs on [GitHub](https://github.com/Haardtripathi/ws-multi-connect).

---

## **📄 License**

MIT License © 2025 **Haard Tripathi**
