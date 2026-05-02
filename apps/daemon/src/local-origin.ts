export interface LocalOriginRequest {
  headers: {
    host?: unknown;
    origin?: unknown;
  };
}

export function isLocalSameOrigin(req: LocalOriginRequest, port: number): boolean {
  const allowedHosts = new Set([
    `127.0.0.1:${port}`,
    `localhost:${port}`,
    `[::1]:${port}`,
  ]);
  const allowedOrigins = new Set([
    `http://127.0.0.1:${port}`,
    `http://localhost:${port}`,
    `http://[::1]:${port}`,
  ]);
  const host = String(req.headers.host || '');
  if (!allowedHosts.has(host)) return false;
  const origin = req.headers.origin;
  if (origin == null || origin === '') return true;
  return allowedOrigins.has(String(origin));
}
