export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = `/backend${path}`;
  let res = await fetch(url, { ...init, credentials: "same-origin" });

  if (res.status === 401) {
    const refreshed = await fetch("/api/token", { method: "POST" });
    if (refreshed.ok) {
      res = await fetch(url, { ...init, credentials: "same-origin" });
    }
  }
  return res;
}