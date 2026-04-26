/**
 * Maps backend errors to safe, user-friendly messages.
 * Raw error details are logged to the console for debugging only.
 */
export function friendlyError(error: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  // Always log the raw error for developers
  // eslint-disable-next-line no-console
  console.error("[app-error]", error);

  const msg = (error as any)?.message?.toString?.() ?? "";

  if (/invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar.";
  if (/user already registered/i.test(msg) || /already registered/i.test(msg))
    return "Este e-mail já está cadastrado.";
  if (/password should be at least/i.test(msg)) return "A senha deve ter no mínimo 6 caracteres.";
  if (/rate limit/i.test(msg)) return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
  if (/network|fetch/i.test(msg)) return "Falha de conexão. Verifique sua internet.";
  if (/row-level security|permission denied|not authorized/i.test(msg))
    return "Você não tem permissão para realizar esta ação.";
  if (/duplicate key|unique constraint/i.test(msg))
    return "Este registro já existe.";
  if (/violates foreign key/i.test(msg))
    return "Não é possível concluir: existem dados relacionados.";
  if (/payload too large|exceeded the maximum/i.test(msg)) return "Arquivo muito grande.";

  return fallback;
}
