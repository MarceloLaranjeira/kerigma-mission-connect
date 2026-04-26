import { supabase } from "@/integrations/supabase/client";

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
  details?: Record<string, unknown>;
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
    await supabase.from("access_logs").insert([{
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      event,
      resource: resource ?? null,
      action: action ?? null,
      role_at_event: role,
      details: details ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 256) : null,
    } as any]);
  } catch {
    // never break the UI on audit failures
  }
}

/**
 * Detect Postgres/PostgREST RLS denials and log them.
 * Returns true when an RLS denial was detected and logged.
 */
export function isRlsDenial(err: any): boolean {
  if (!err) return false;
  const code = err.code ?? err?.error?.code;
  const msg = (err.message ?? err?.error?.message ?? "").toLowerCase();
  return (
    code === "42501" ||
    code === "PGRST301" ||
    msg.includes("row-level security") ||
    msg.includes("permission denied") ||
    msg.includes("violates row-level")
  );
}

export async function logIfDenied(err: any, ctx: { resource?: string; action?: string; details?: Record<string, unknown> }) {
  if (isRlsDenial(err)) {
    await logAccess({
      event: "rls_denied",
      resource: ctx.resource,
      action: ctx.action,
      details: { code: err?.code ?? null, ...(ctx.details ?? {}) },
    });
  }
}

async function fetchPrimaryRole(uid?: string | null): Promise<string | null> {
  if (!uid) return null;
  try {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).limit(1).maybeSingle();
    return (data as any)?.role ?? null;
  } catch {
    return null;
  }
}