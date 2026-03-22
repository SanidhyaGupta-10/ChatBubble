const LOCAL_BACKEND_ORIGIN = "http://localhost:3000";

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

function stripApiSuffix(value: string) {
  return value.replace(/\/api$/, "");
}

function getBrowserOrigin() {
  if (typeof window === "undefined" || !window.location.origin) {
    return LOCAL_BACKEND_ORIGIN;
  }

  return window.location.origin;
}

function resolveServerOrigin() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  const rawOrigin = configured && configured.length > 0 ? configured : getBrowserOrigin();

  return stripApiSuffix(trimTrailingSlashes(rawOrigin));
}

export const SOCKET_URL = resolveServerOrigin();
export const API_URL = `${SOCKET_URL}/api`;
