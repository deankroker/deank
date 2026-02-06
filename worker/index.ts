export { SharedTerminalDO } from "./shared-terminal";

/**
 * Main Worker - handles API routes and WebSocket upgrades
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket: Connect to shared terminal
    if (url.pathname === "/ws/shared-terminal") {
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      // Use a single room for now (could be parameterized later)
      const roomId = "default";
      const doId = env.SHARED_TERMINAL.idFromName(roomId);
      const stub = env.SHARED_TERMINAL.get(doId);

      return stub.fetch(request);
    }

    // All other requests fall through to static asset serving
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
