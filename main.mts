import { serveDir } from "@std/http/file-server";
import { WsMessage } from "./types.d.mts";

Deno.serve((request) => {
  if (request.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(request);

    socket.addEventListener("open", () => {
      console.log("CONNECTED");
    });

    socket.addEventListener("message", (event) => {
      console.log("RECEIVED", event.data);

      const parsed: WsMessage = JSON.parse(event.data);
      let responseMessage: WsMessage = {
        type: "message",
        text: "Could not parse message.",
      };
      switch (parsed.type) {
        case "ping":
          responseMessage = { type: "pong" };
          break;
        case "message":
          responseMessage = {
            type: "message",
            text: `Got message text: ${parsed.text}`,
          };
      }

      socket.send(JSON.stringify(responseMessage));
    });

    socket.addEventListener("close", () => console.log("DISCONNECTED"));

    socket.addEventListener("error", (error) => console.error("ERROR:", error));

    return response;
  } else {
    return serveDir(request, { fsRoot: "static" });
  }
});
