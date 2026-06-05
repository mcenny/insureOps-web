import type { ApiError } from "@/types";

const BASE_URL =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "" : "";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, unknown>;

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}

type QueryValue = string | number | boolean | undefined | null | Array<string | number | boolean>;

export type ApiRequestInit = Omit<RequestInit, "body"> & {
  query?: Record<string, QueryValue>;
  body?: unknown;
};

function buildUrl(path: string, query?: ApiRequestInit["query"]) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") sp.append(key, String(v));
      });
    } else {
      sp.append(key, String(value));
    }
  }
  const qs = sp.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(method: string, path: string, init: ApiRequestInit = {}): Promise<T> {
  const { query, body, headers, ...rest } = init;
  const url = buildUrl(path, query);
  const finalHeaders = new Headers(headers ?? {});
  let serialized: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      serialized = body;
    } else {
      finalHeaders.set("content-type", "application/json");
      serialized = JSON.stringify(body);
    }
  }
  const response = await fetch(url, {
    ...rest,
    method,
    headers: finalHeaders,
    body: serialized,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload: unknown = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const errorPayload =
      (payload as { error?: ApiError } | null)?.error ?? {
        message: response.statusText || "Request failed",
      };
    throw new ApiClientError(response.status, errorPayload);
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, init?: ApiRequestInit) => request<T>("GET", path, init),
  post: <T>(path: string, init?: ApiRequestInit) => request<T>("POST", path, init),
  patch: <T>(path: string, init?: ApiRequestInit) => request<T>("PATCH", path, init),
  put: <T>(path: string, init?: ApiRequestInit) => request<T>("PUT", path, init),
  delete: <T>(path: string, init?: ApiRequestInit) => request<T>("DELETE", path, init),
};
