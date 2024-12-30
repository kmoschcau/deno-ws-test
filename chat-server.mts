import { ChatEvent } from "./types.d.mts";
import { isSendMessageChatEvent } from "./static/type-guards.mjs";

/**
 * An interface for data about a connected client.
 */
interface ConnectedClient {
  /**
   * The web socket connection for the user client.
   */
  socket: WebSocket;

  /**
   * The name of the connected user in the client.
   */
  username: string;
}

/**
 * A server to handle chat messages of multiple users.
 */
export default class ChatServer {
  /**
   * The connected clients of the server.
   */
  private connectedClients = new Map<string, ConnectedClient>();

  /**
   * Handle an incoming web socket connected.
   * @param request the incoming web socket request
   * @returns the response to answer with
   */
  public async handleConnection(request: Request): Promise<Response> {
    const username = new URL(request.url).searchParams.get("username");
    if (!username) {
      console.warn("There was no username in the request.");
      return new Response(null, { status: 400 });
    }

    const { socket, response } = Deno.upgradeWebSocket(request);

    if (this.connectedClients.has(username)) {
      console.log("The username is already taken:", username);
      socket.close(1008, `Username "${username}" is already taken.`);
      return response;
    }

    socket.addEventListener("open", () =>
      this.onClientConnected(username, socket),
    );

    socket.addEventListener("message", (event) =>
      this.onMessage(username, event),
    );

    socket.addEventListener("close", () => this.onClientDisconnected(username));

    socket.addEventListener("error", (error) => console.error("ERROR:", error));

    return response;
  }

  private broadcast(message: ChatEvent) {
    for (const client of this.connectedClients.values()) {
      client.socket.send(JSON.stringify(message));
    }
  }

  private broadcastMessage(username: string, message: string) {
    this.broadcast({ type: "broadcast-message", message, username });
    console.log("Broadcasted from:", username, "Message:", message);
  }

  private broadcastUsernames() {
    const usernames = Array.from(this.connectedClients.keys());
    this.broadcast({ type: "update-users", usernames });
    console.log("Broadcasted usernames:", usernames);
  }

  private onClientConnected(username: string, socket: WebSocket) {
    this.connectedClients.set(username, { socket, username });
    console.log("Client connected:", username);
    this.broadcastUsernames();
  }

  private onClientDisconnected(username: string) {
    this.connectedClients.delete(username);
    console.log("Client disconnected:", username);
    this.broadcastUsernames();
  }

  private onMessage(username: string, event: MessageEvent<string>) {
    const parsed = JSON.parse(event.data);
    if (!isSendMessageChatEvent(parsed)) {
      return;
    }

    this.broadcastMessage(username, parsed.message);
  }
}
