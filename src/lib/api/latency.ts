import { SIMULATED_LATENCY_MS } from "@/lib/constants";

export function simulatedLatency(min = SIMULATED_LATENCY_MS.min, max = SIMULATED_LATENCY_MS.max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
}
