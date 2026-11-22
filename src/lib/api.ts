/**
 * Base URL for the VividSpaces API.
 *
 * `NEXT_PUBLIC_API_URL` is inlined at build time, so Vercel needs a redeploy
 * after changing it. When it isn't set, production uses the deployed backend
 * and local development uses the conventional localhost port.
 */
const DEFAULT_LOCAL_API = "http://localhost:5000";
const DEFAULT_PRODUCTION_API = "https://vividspaces-server.vercel.app";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const fallbackApiUrl =
  process.env.NODE_ENV === "production"
    ? DEFAULT_PRODUCTION_API
    : DEFAULT_LOCAL_API;

const apiUrl = configuredApiUrl || fallbackApiUrl;

if (!configuredApiUrl && typeof window === "undefined") {
  console.warn(
    `[vividspaces] NEXT_PUBLIC_API_URL is not set — using ${apiUrl}. Set it explicitly in your hosting environment.`
  );
}

export const API_URL = apiUrl.replace(/\/+$/, "");
