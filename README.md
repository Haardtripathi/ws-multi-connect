<!-- # WebSocket Manager 🔗🔥

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

MIT License © 2025 **Haard Tripathi** -->

# WebSocket Manager 🔗🔥

A powerful WebSocket manager for handling multiple WebSocket connections dynamically with ease.
Built on top of [ws](https://www.npmjs.com/package/ws), this library enables **dynamic function execution** and **event-driven WebSocket communication** with **minimal boilerplate code**.

## 🚀 Features

✅ Manage **multiple WebSocket connections** effortlessly
✅ Supports **automatic reconnection** when a connection drops
✅ Supports **authentication with API keys, tokens, OAuth, and headers** 🔑
✅ Supports **session-based authentication & challenge-response flows**
✅ Supports **dynamic message function execution** (pass function names dynamically!)
✅ Middleware support for **message preprocessing**
✅ Lightweight and **dependency-free (except ws & axios)**
✅ Simple API: **connect, send, close, registerFunction**

---

## 📦 Installation

```sh
npm install ws-multi-connect axios
```

---

## 🛠️ Usage

```javascript
const WebSocketManager = require("ws-multi-connect");

const wsManager = new WebSocketManager();

// Register dynamic functions that can be executed via WebSocket messages
wsManager.registerFunction("sayHello", (data, ws) => {
  console.log("🟢 sayHello function executed:", data);
  ws.send(JSON.stringify({ response: `Hello, ${data.name}!` }));
});

wsManager.registerFunction("reverseText", (data, ws) => {
  console.log("🔁 Reversing text:", data);
  const reversed = data.text.split("").reverse().join("");
  ws.send(JSON.stringify({ response: reversed }));
});

// Connect to any WebSocket with authentication (if required)
wsManager.connect("wss://example.com/socket", {
  autoReconnect: true,
  auth: {
    url: "https://example.com/api/getToken", // API endpoint for token retrieval
    method: "POST", // HTTP method for auth request
    headers: { "Content-Type": "application/json" },
    params: { apiKey: "your-api-key" }, // Parameters for the API request
    tokenPath: "access_token", // Path in response JSON to extract token
    queryParam: "token", // (Optional) Attach token as a query parameter
    headerKey: "Authorization", // (Optional) Attach token as a header
  },
  onOpen: (ws) => {
    console.log("🔗 Connected to WebSocket");
    ws.send(JSON.stringify({ action: "subscribe", channel: "updates" }));
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

MIT License © 2025 **Haard Tripathi**
