import { supabase } from "@/integrations/supabase/client";
import { type Json, type TablesInsert } from "@/integrations/supabase/types";

export type AccessEvent =
  | "rls_denied"
  | "permission_denied"
  | "login"
  | "logout"
  | "role_change"
  | "profile_update"
  | "member_approve"
  | "member_reject"
  | "export";

interface LogParams {
  event: AccessEvent;
  resource?: string;
  action?: string;
  details?: Json;
}

type ErrorLike = {
  code?: string | null;
  message?: string | null;
  error?: {
    code?: string | null;
    message?: string | null;
  } | null;
};

function errorLike(err: unknown): ErrorLike | null {
  return typeof err === "object" && err ? err as ErrorLike : null;
}

/**
 * Log a sensitive access event to the audit table.
 * - Captures the calling user automatically (RLS-enforced).
 * - Never throws; failures are silent so they cannot break UX.
 * - Does NOT include raw error.message in details — only generic codes — to avoid leaking
 *   technical info to the user. Admins read full context from the audit table.
 */
export async function logAccess({ event, resource, action, details }: LogParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const role = await fetchPrimaryRole(user?.id);
    const payload: TablesInsert<"access_logs"> = {
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      event,
      resource: resource ?? null,
      action: action ?? null,
      role_at_event: role,
      details: details ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 256) : null,
    };
    await supabase.from("access_logs").insert([payload]);
  } catch {
    // never break the UI on audit failures
  }
}

/**
 * Detect Postgres/PostgREST RLS denials and log them.
 * Returns true when an RLS denial was detected and logged.
 */
export function isRlsDenial(err: unknown): boolean {
  const data = errorLike(err);
  if (!data) return false;
  const code = data.code ?? data.error?.code;
  const msg = (data.message ?? data.error?.message ?? "").toLowerCase();
  return (
    code === "42501" ||
    code === "PGRST301" ||
    msg.includes("row-level security") ||
    msg.includes("permission denied") ||
    msg.includes("violates row-level")
  );
}

export async function logIfDenied(err: unknown, ctx: { resource?: string; action?: string; details?: Record<string, Json | undefined> }) {
  if (isRlsDenial(err)) {
    const data = errorLike(err);
    await logAccess({
      event: "rls_denied",
      resource: ctx.resource,
      action: ctx.action,
      details: { code: data?.code ?? null, ...(ctx.details ?? {}) },
    });
  }
}

async function fetchPrimaryRole(uid?: string | null): Promise<string | null> {
  if (!uid) return null;
  try {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).limit(1).maybeSingle();
    return data?.role ?? null;
  } catch {
    return null;
  }
}
