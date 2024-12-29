export type WsMessage =
  | { type: "ping" }
  | { type: "pong" }
  | { type: "message"; text: string };
