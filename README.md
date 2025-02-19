# WebSocket Manager 🔗🔥

A simple WebSocket manager for handling multiple WebSocket connections with ease.  
Built on top of [ws](https://www.npmjs.com/package/ws), this library allows you to connect, manage, and send messages with **minimal boilerplate code**.

## 🚀 Features

✅ Manage **multiple WebSocket connections** effortlessly  
✅ Supports **automatic reconnection** when a connection drops  
✅ Lightweight and **dependency-free (except ws)**  
✅ Simple API: **connect, send, close**

---

## 📦 Installation

```sh
npm install ws-multi-connect
```

---

## 🛠️ Usage

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();

// Connect to multiple WebSockets
wsManager.connect("wss://example.com/socket1", {
  onMessage: (msg) => console.log(`Data from socket1:`, msg),
  autoReconnect: true,
});

wsManager.connect("wss://example.com/socket2", {
  onMessage: (msg) => console.log(`Data from socket2:`, msg),
  autoReconnect: true,
  reconnectInterval: 5000,
});

// Send data
setTimeout(() => {
  wsManager.send(
    "wss://example.com/socket1",
    JSON.stringify({ action: "ping" })
  );
}, 2000);

// Close a connection after 5 seconds
setTimeout(() => {
  wsManager.close("wss://example.com/socket1");
}, 5000);
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

---

### `send(url, data)`

Sends a message to an active WebSocket.

| Parameter | Type               | Description         |
| --------- | ------------------ | ------------------- |
| `url`     | `string`           | The WebSocket URL   |
| `data`    | `string \| Buffer` | The message to send |

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

MIT License © 2025 **Haard Tripathi**
