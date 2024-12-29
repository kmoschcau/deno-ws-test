/** @import { WsMessage } from "../types.d.mts"; */

const demoButton = document.getElementById("demo-button");
const output = document.getElementById("output");

const websocket = new WebSocket("ws://127.0.0.1:8000");

/** @type {WsMessage} */
const PING = { type: "ping" };

/**
 * @type {number | undefined}
 */
let pingInterval;

/**
 * @param {string} message
 */
function writeToScreen(message) {
  output?.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
}

/**
 * @param {WsMessage} message
 */
function sendMessage(message) {
  const payload = JSON.stringify(message);
  writeToScreen(`SENT: ${payload}`);
  websocket.send(payload);
}

demoButton?.addEventListener("click", () =>
  sendMessage({ type: "message", text: "Hello World" }),
);

websocket.addEventListener("open", () => {
  writeToScreen("CONNECTED");
  sendMessage(PING);
  pingInterval = setInterval(() => {
    sendMessage(PING);
  }, 5000);
});

websocket.addEventListener("close", () => {
  writeToScreen("DISCONNECTED");
  clearInterval(pingInterval);
});

websocket.addEventListener("message", (event) => {
  writeToScreen(`RECEIVED: ${event.data}`);
});

websocket.addEventListener("error", (event) => {
  writeToScreen(`ERROR: ${event}`);
  console.error("ERROR", event);
});
