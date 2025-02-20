# WebSocket Manager 🔗🔥

A simple WebSocket manager for handling multiple WebSocket connections with ease.\
Built on top of [ws](https://www.npmjs.com/package/ws), this library allows you to connect, manage, and send messages with **minimal boilerplate code**.

## 🚀 Features

✅ Manage **multiple WebSocket connections** effortlessly\
✅ Supports **automatic reconnection** when a connection drops\
✅ Supports **authentication with API keys, tokens, and headers** 🔑\
✅ Supports **session-based authentication & challenge-response flows**\
✅ Lightweight and **dependency-free (except ws)**\
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

// Connect to any WebSocket with authentication (if required)
wsManager.connect("wss://example.com/socket", {
  autoReconnect: true,
  auth: {
    url: "https://example.com/api/getToken", // API endpoint for token retrieval
    params: { apiKey: "your-api-key" }, // Parameters for the API request
    tokenPath: "access_token", // Path in response JSON to extract token
    queryParam: "token", // (Optional) Attach token as a query parameter
    headerKey: "Authorization", // (Optional) Attach token as a header
  },
  onOpen: (ws) => {
    console.log("🔗 Connected to WebSocket");

    // Example: Sending a subscription message
    const subscribeMessage = { action: "subscribe", channel: "updates" };
    console.log(
      "📤 Sending subscription message:",
      JSON.stringify(subscribeMessage)
    );
    ws.send(JSON.stringify(subscribeMessage));
  },
  onMessage: (msg) => {
    console.log("📩 Received data:", msg.toString());
  },
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
