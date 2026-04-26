import { describe, it, expect, vi, beforeEach } from "vitest";

type SignedUrlResponse = { data: { signedUrl: string } | null; error: unknown };
type CreateSignedUrl = (path: string, expiresIn: number) => Promise<SignedUrlResponse>;

const createSignedUrl = vi.fn<CreateSignedUrl>();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({ createSignedUrl: (path: string, expiresIn: number) => createSignedUrl(path, expiresIn) }),
    },
  },
}));

import { getAvatarUrl, invalidateAvatar, clearAvatarCache } from "@/lib/avatarCache";

describe("avatarCache", () => {
  beforeEach(() => {
    clearAvatarCache();
    createSignedUrl.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("passes through absolute URLs unchanged", async () => {
    const u = await getAvatarUrl("https://cdn.example.com/a.png");
    expect(u).toBe("https://cdn.example.com/a.png");
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("returns null for empty input", async () => {
    expect(await getAvatarUrl(null)).toBeNull();
    expect(await getAvatarUrl(undefined)).toBeNull();
  });

  it("caches signed URLs across calls", async () => {
    createSignedUrl.mockResolvedValue({ data: { signedUrl: "https://signed/1" }, error: null });
    const a = await getAvatarUrl("user/avatar.png");
    const b = await getAvatarUrl("user/avatar.png");
    expect(a).toBe("https://signed/1");
    expect(b).toBe("https://signed/1");
    expect(createSignedUrl).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent requests for the same path", async () => {
    let resolve: (v: SignedUrlResponse) => void;
    createSignedUrl.mockImplementation(
      () => new Promise((r) => { resolve = r; }),
    );
    const p1 = getAvatarUrl("user/x.png");
    const p2 = getAvatarUrl("user/x.png");
    resolve!({ data: { signedUrl: "https://signed/x" }, error: null });
    const [a, b] = await Promise.all([p1, p2]);
    expect(a).toBe("https://signed/x");
    expect(b).toBe("https://signed/x");
    expect(createSignedUrl).toHaveBeenCalledTimes(1);
  });

  it("re-signs after invalidation", async () => {
    createSignedUrl
      .mockResolvedValueOnce({ data: { signedUrl: "https://signed/v1" }, error: null })
      .mockResolvedValueOnce({ data: { signedUrl: "https://signed/v2" }, error: null });
    const a = await getAvatarUrl("p");
    invalidateAvatar("p");
    const b = await getAvatarUrl("p");
    expect(a).toBe("https://signed/v1");
    expect(b).toBe("https://signed/v2");
    expect(createSignedUrl).toHaveBeenCalledTimes(2);
  });

  it("returns null on signing failure (does not throw)", async () => {
    createSignedUrl.mockResolvedValue({ data: null, error: { message: "fail" } });
    expect(await getAvatarUrl("nope")).toBeNull();
  });
});
