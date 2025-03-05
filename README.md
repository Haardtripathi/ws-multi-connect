# WebSocket Manager

A powerful WebSocket manager for handling multiple WebSocket connections dynamically with ease.
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
✅ **Stores connected clients in memory for easy access**\
✅ **Works in both Frontend (Browser) & Backend (Node.js)**\
✅ **Lightweight & easy to integrate**

---

## **🛦 Installation**

```sh
npm install ws-multi-connect
```

---

## **🛠️ Usage**

### **1⃣ Creating a WebSocket Server (Backend)**

With this, you no longer need **ws** separately!

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();
wsManager.startServer(5001); // Starts WebSocket server on port 5001
```

---

### **2⃣ Managing Connected Clients**

The library stores connected clients in `wsManager.clients`, allowing easy retrieval and management.

#### **Example: Checking Active Clients**

```javascript
console.log(
  "👥 Active WebSocket Clients:",
  Array.from(wsManager.clients.keys())
);
```

#### **Example: Broadcasting Messages to All Clients**

```javascript
wsManager.clients.forEach((client, url) => {
  if (client.readyState === 1) {
    client.send(JSON.stringify({ message: "Hello, everyone!" }));
  }
});
```

#### **Example: Storing Authenticated Users**

```javascript
wsManager.registerFunction("auth", (data, ws) => {
  if (!data.token) {
    console.error("❌ No token received!");
    return;
  }
  console.log("🔍 Verifying token...");
  const decoded = jwt.verify(data.token, "YOUR_SECRET");

  ws.userId = decoded.id; // ✅ Store user ID inside WebSocket object
  wsManager.clients.set(ws.userId, ws); // ✅ Store user ID in `clients` Map

  console.log("👥 Active Users:", Array.from(wsManager.clients.keys()));
});
```

---

### **3⃣ Connecting a Backend Client to WebSocket**

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

### **4⃣ Connecting a Frontend (Browser/React) Client**

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

## **📡 Example: Connecting to an External WebSocket API**

Here is an example of connecting to an external WebSocket API (e.g., cryptocurrency market data):

```javascript
import { WebSocketManager } from "ws-multi-connect";

const wsManager = new WebSocketManager();

wsManager.connect("wss://example.com/v1/", {
  // Replace with actual WebSocket URL
  autoReconnect: true,

  onOpen: (ws) => {
    console.log("🔗 Connected to External WebSocket API");

    // ✅ Send API key inside the first message
    const subscribeMessage = {
      type: "hello",
      apikey: "your-api-key", // ✅ Correct way to authenticate
      heartbeat: false,
      subscribe_data_type: ["trade"],
      subscribe_filter_symbol_id: ["EXCHANGE_SPOT_BTC_USD"],
    };

    console.log(
      "📤 Sending subscription message:",
      JSON.stringify(subscribeMessage)
    );
    ws.send(JSON.stringify(subscribeMessage));
  },

  onMessage: (msg) => {
    try {
      console.log("📩 Received trade data:", msg);
    } catch (error) {
      console.error("⚠️ Error parsing message:", msg);
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

---

## **📝 API Documentation**

### **Creating a WebSocket Server**

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

### **Connecting to a WebSocket Server**

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

## **📝 License**

MIT License © 2025 **Haard Tripathi**
