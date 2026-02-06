import { DurableObject } from "cloudflare:workers";

const NAMES = ["Steve", "Dina", "Mike", "Kate", "Rita", "Sunil", "Dan"];
const COLORS = [
  "#ff6b6b", // coral red
  "#4ecdc4", // teal
  "#ffe66d", // yellow
  "#a29bfe", // lavender
  "#fd79a8", // pink
  "#74b9ff", // sky blue
  "#ffeaa7", // pale yellow
];

interface User {
  name: string;
  color: string;
}

interface Segment {
  text: string;
  name: string;
  color: string;
}

/**
 * SharedTerminalDO - A collaborative terminal room
 *
 * Multiple users can connect and see the same content in real-time.
 * Each user's text is shown in their assigned color.
 */
export class SharedTerminalDO extends DurableObject {
  private segments: Segment[] = [];
  private userMap: Map<WebSocket, User> = new Map();
  private usedNames: Set<string> = new Set();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<Segment[]>("segments");
      this.segments = stored ?? [];
    });
  }

  private assignUser(): User {
    let availableNames = NAMES.filter((n) => !this.usedNames.has(n));
    if (availableNames.length === 0) {
      availableNames = NAMES;
    }

    const nameIndex = Math.floor(Math.random() * availableNames.length);
    const name = availableNames[nameIndex];
    const color = COLORS[NAMES.indexOf(name)];

    this.usedNames.add(name);
    return { name, color };
  }

  private getUsers(): User[] {
    return Array.from(this.userMap.values());
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      const user = this.assignUser();
      this.ctx.acceptWebSocket(server);
      this.userMap.set(server, user);

      server.send(
        JSON.stringify({
          type: "init",
          segments: this.segments,
          you: user,
          users: this.getUsers(),
        })
      );

      // Broadcast updated user list to ALL clients (including the new one for consistency)
      this.broadcast({ type: "users", users: this.getUsers() });

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Expected WebSocket", { status: 400 });
  }

  async webSocketMessage(ws: WebSocket, message: string): Promise<void> {
    try {
      const data = JSON.parse(message);
      const user = this.userMap.get(ws);
      if (!user) return;

      if (data.type === "append") {
        // User is adding text
        const lastSegment = this.segments[this.segments.length - 1];
        if (lastSegment && lastSegment.name === user.name) {
          // Extend existing segment
          lastSegment.text += data.text;
        } else {
          // New segment
          this.segments.push({ text: data.text, name: user.name, color: user.color });
        }
        await this.ctx.storage.put("segments", this.segments);
        this.broadcast({ type: "segments", segments: this.segments });
      }

      if (data.type === "backspace") {
        // User is deleting
        if (this.segments.length > 0) {
          const lastSegment = this.segments[this.segments.length - 1];
          if (lastSegment.text.length > 1) {
            lastSegment.text = lastSegment.text.slice(0, -1);
          } else {
            this.segments.pop();
          }
          await this.ctx.storage.put("segments", this.segments);
          this.broadcast({ type: "segments", segments: this.segments });
        }
      }

      if (data.type === "clear") {
        this.segments = [];
        await this.ctx.storage.put("segments", this.segments);
        this.broadcast({ type: "clear" });
      }
    } catch {
      // Ignore malformed messages
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const user = this.userMap.get(ws);
    if (user) {
      this.usedNames.delete(user.name);
      this.userMap.delete(ws);
    }
    this.broadcast({ type: "users", users: this.getUsers() });
  }

  private broadcast(message: object, exclude?: WebSocket): void {
    const json = JSON.stringify(message);
    for (const socket of this.ctx.getWebSockets()) {
      if (socket !== exclude) {
        try {
          socket.send(json);
        } catch {
          // Socket might be closing
        }
      }
    }
  }
}
