import { serveDir } from "@std/http/file-server";
import ChatServer from "./chat-server.mts";

const chatServer = new ChatServer();

Deno.serve((request) => {
  if (request.headers.get("upgrade") === "websocket") {
    return chatServer.handleConnection(request);
  } else {
    return serveDir(request, { fsRoot: "static" });
  }
});
