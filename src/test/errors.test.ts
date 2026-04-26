import { describe, it, expect, vi, beforeEach } from "vitest";
import { friendlyError } from "@/lib/errors";

describe("friendlyError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("masks invalid credentials", () => {
    expect(friendlyError({ message: "Invalid login credentials" }))
      .toBe("E-mail ou senha incorretos.");
  });

  it("masks duplicate registration", () => {
    expect(friendlyError({ message: "User already registered" }))
      .toBe("Este e-mail já está cadastrado.");
  });

  it("masks RLS / permission errors", () => {
    expect(friendlyError({ message: "new row violates row-level security policy" }))
      .toBe("Você não tem permissão para realizar esta ação.");
    expect(friendlyError({ message: "permission denied for table profiles" }))
      .toBe("Você não tem permissão para realizar esta ação.");
  });

  it("masks rate limits", () => {
    expect(friendlyError({ message: "email rate limit exceeded" }))
      .toBe("Muitas tentativas. Aguarde alguns instantes e tente novamente.");
  });

  it("never leaks raw backend message in fallback path", () => {
    const raw = "psql: FATAL connection refused at 10.0.0.1";
    const out = friendlyError({ message: raw });
    expect(out).not.toContain(raw);
    expect(out).not.toContain("psql");
    expect(out).not.toContain("10.0.0.1");
  });

  it("uses provided fallback for unknown errors", () => {
    expect(friendlyError({ message: "weird internal thing" }, "Falha custom"))
      .toBe("Falha custom");
  });
});
