import { NextResponse } from "next/server";
import type { ApiError } from "@/types";

export function jsonError(status: number, error: ApiError) {
  return NextResponse.json({ error }, { status });
}

export function notFound(resource: string) {
  return jsonError(404, { message: `${resource} not found`, code: "not_found" });
}

export function badRequest(message: string, details?: Record<string, unknown>) {
  return jsonError(400, { message, code: "bad_request", details });
}

export function methodNotAllowed(allowed: string[]) {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: allowed.join(", ") },
  });
}
