const LOCAL_BACKEND_ORIGIN = "http://localhost:3000";

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

function stripApiSuffix(value: string) {
  return value.replace(/\/api$/, "");
}

function resolveServerOrigin() {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  const rawOrigin = configured && configured.length > 0 ? configured : LOCAL_BACKEND_ORIGIN;

  return stripApiSuffix(trimTrailingSlashes(rawOrigin));
}

export const SOCKET_URL = resolveServerOrigin();
export const API_URL = `${SOCKET_URL}/api`;
