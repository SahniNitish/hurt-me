import { useCallback, useEffect, useState } from "react";

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await loader());
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, reload };
}

export function confirmDelete(label: string): boolean {
  return window.confirm(`Delete ${label}? This cannot be undone.`);
}

export function youtubeWatchUrl(url?: string): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return url.trim();
    if (u.hostname.includes("youtube.com")) return url.trim();
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbedUrl(url?: string): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v")!;
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}