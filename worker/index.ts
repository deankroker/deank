/**
 * Main Worker - serves the React app
 * Static assets are handled by Cloudflare's asset serving
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // All requests fall through to static asset serving via wrangler.jsonc config
    // This handler is here for future API routes if needed
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
