import { supabase } from "@/integrations/supabase/client";

/**
 * In-memory cache for signed avatar URLs.
 *
 * - Avoids re-creating signed URLs on every render / page load.
 * - Renews automatically a few minutes before the URL expires.
 * - Deduplicates concurrent requests for the same path.
 */

type Entry = { url: string; expiresAt: number };

const TTL_SECONDS = 60 * 60;          // 1h signed URL
const RENEW_MARGIN_MS = 5 * 60 * 1000; // renew when < 5 min left

const cache = new Map<string, Entry>();
const inflight = new Map<string, Promise<string | null>>();

/**
 * Returns a usable signed URL for the given storage path.
 * Pass already-absolute http(s) URLs through unchanged.
 */
export async function getAvatarUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const cached = cache.get(pathOrUrl);
  const now = Date.now();
  if (cached && cached.expiresAt - now > RENEW_MARGIN_MS) {
    return cached.url;
  }

  const pending = inflight.get(pathOrUrl);
  if (pending) return pending;

  const promise = (async () => {
    const { data, error } = await supabase
      .storage
      .from("avatars")
      .createSignedUrl(pathOrUrl, TTL_SECONDS);
    if (error || !data?.signedUrl) {
      // eslint-disable-next-line no-console
      console.warn("[avatarCache] failed to sign", pathOrUrl, error);
      return null;
    }
    cache.set(pathOrUrl, {
      url: data.signedUrl,
      expiresAt: now + TTL_SECONDS * 1000,
    });
    return data.signedUrl;
  })();

  inflight.set(pathOrUrl, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(pathOrUrl);
  }
}

/** Resolve many avatars in parallel, reusing cached entries. */
export async function getAvatarUrls(paths: (string | null | undefined)[]): Promise<(string | null)[]> {
  return Promise.all(paths.map((p) => getAvatarUrl(p)));
}

/** Invalidate a path (e.g. after upload). */
export function invalidateAvatar(path?: string | null) {
  if (!path) return;
  cache.delete(path);
}

/** Clear everything (e.g. on sign out). */
export function clearAvatarCache() {
  cache.clear();
  inflight.clear();
}
