/**
 * API çağırışları üçün nazik örtük.
 *
 * Server `{ data }` və ya `{ error: { code, message, details } }`
 * qaytarır (PRD §136); burada həmin format tipləşdirilir.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export class ApiRequestError extends Error {
  constructor(readonly error: ApiError, readonly status: number) {
    super(error.message);
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};

  const response = await fetch(path, {
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  const body = (await response.json().catch(() => null)) as
    | { data: T }
    | { error: ApiError }
    | null;

  if (!response.ok || !body || "error" in body) {
    const error: ApiError = body && "error" in body
      ? body.error
      : { code: "NETWORK_ERROR", message: "Serverlə əlaqə qurulmadı" };
    throw new ApiRequestError(error, response.status);
  }

  return body.data;
}
