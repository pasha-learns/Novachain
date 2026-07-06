export interface AuthErrorMap {
  codes?: Record<string, string>;
  statuses?: Record<number, string>;
}

export interface AuthErrorResponse {
  status: number;
  error?: { code?: string; message?: string };
}

export function resolveAuthError(err: AuthErrorResponse, map: AuthErrorMap, fallback: string): string {
  const code = err.error?.code;
  if (code && map.codes?.[code]) return map.codes[code];
  if (map.statuses?.[err.status]) return map.statuses[err.status];
  return err.error?.message ?? fallback;
}
