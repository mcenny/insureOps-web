import "server-only";
import type {
  Activity,
  Claim,
  Customer,
  DocumentRecord,
  ListQuery,
  Paginated,
  Payment,
  Policy,
} from "@/types";
import { buildSeed, type Seed } from "@/lib/seed";
import { PAGE_SIZE_DEFAULT } from "@/lib/constants";

type Store = {
  customers: Customer[];
  policies: Policy[];
  claims: Claim[];
  payments: Payment[];
  documents: DocumentRecord[];
  activities: Activity[];
};

declare global {
  // eslint-disable-next-line no-var
  var __INSUREOPS_STORE__: Store | undefined;
}

function init(): Store {
  const seed: Seed = buildSeed();
  return {
    customers: seed.customers,
    policies: seed.policies,
    claims: seed.claims,
    payments: seed.payments,
    documents: seed.documents,
    activities: seed.activities,
  };
}

function getStore(): Store {
  if (!globalThis.__INSUREOPS_STORE__) {
    globalThis.__INSUREOPS_STORE__ = init();
  }
  return globalThis.__INSUREOPS_STORE__;
}

export const store = {
  customers: () => getStore().customers,
  policies: () => getStore().policies,
  claims: () => getStore().claims,
  payments: () => getStore().payments,
  documents: () => getStore().documents,
  activities: () => getStore().activities,
};

export function reseed() {
  globalThis.__INSUREOPS_STORE__ = init();
}

export type FilterMatcher<T> = (item: T, filters: Record<string, string | string[] | undefined>) => boolean;
export type SearchMatcher<T> = (item: T, term: string) => boolean;
export type SortAccessor<T> = (item: T, field: string) => string | number | undefined;

type QueryOptions<T> = {
  items: T[];
  query: ListQuery;
  search?: SearchMatcher<T>;
  filter?: FilterMatcher<T>;
  sort?: SortAccessor<T>;
  defaultSortBy?: string;
  defaultSortDir?: "asc" | "desc";
};

export function paginate<T>({
  items,
  query,
  search,
  filter,
  sort,
  defaultSortBy,
  defaultSortDir = "desc",
}: QueryOptions<T>): Paginated<T> {
  let working = [...items];

  if (query.search && search) {
    const term = query.search.toLowerCase();
    working = working.filter((item) => search(item, term));
  }

  if (query.filters && filter) {
    const cleaned: Record<string, string | string[] | undefined> = {};
    for (const [k, v] of Object.entries(query.filters)) {
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
      cleaned[k] = v;
    }
    if (Object.keys(cleaned).length > 0) {
      working = working.filter((item) => filter(item, cleaned));
    }
  }

  const sortBy = query.sortBy ?? defaultSortBy;
  const sortDir = query.sortDir ?? defaultSortDir;
  if (sortBy && sort) {
    working.sort((a, b) => {
      const av = sort(a, sortBy);
      const bv = sort(b, sortBy);
      if (av === bv) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      return sortDir === "asc" ? 1 : -1;
    });
  }

  const total = working.length;
  const pageSize = Math.max(1, Math.min(query.pageSize ?? PAGE_SIZE_DEFAULT, 200));
  const page = Math.max(1, query.page ?? 1);
  const start = (page - 1) * pageSize;
  const slice = working.slice(start, start + pageSize);

  return { items: slice, total, page, pageSize };
}

export function parseListQuery(searchParams: URLSearchParams, filterKeys: string[] = []): ListQuery {
  const filters: Record<string, string | string[]> = {};
  for (const key of filterKeys) {
    const values = searchParams.getAll(key).filter(Boolean);
    if (values.length === 1) filters[key] = values[0]!;
    else if (values.length > 1) filters[key] = values;
  }
  return {
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortDir: (searchParams.get("sortDir") as "asc" | "desc" | null) ?? undefined,
    filters: Object.keys(filters).length ? filters : undefined,
  };
}

export function recordActivity(entry: Omit<Activity, "id" | "createdAt"> & { createdAt?: string }) {
  const activities = getStore().activities;
  const next: Activity = {
    id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    ...entry,
  };
  activities.unshift(next);
  if (activities.length > 200) activities.length = 200;
  return next;
}

export function updateClaim(id: string, patch: Partial<Claim>): Claim | undefined {
  const claims = getStore().claims;
  const idx = claims.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const next: Claim = { ...claims[idx]!, ...patch, updatedAt: new Date().toISOString() };
  claims[idx] = next;
  return next;
}

export function updatePayment(id: string, patch: Partial<Payment>): Payment | undefined {
  const payments = getStore().payments;
  const idx = payments.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const next: Payment = { ...payments[idx]!, ...patch, updatedAt: new Date().toISOString() };
  payments[idx] = next;
  return next;
}

export function updateDocument(id: string, patch: Partial<DocumentRecord>): DocumentRecord | undefined {
  const docs = getStore().documents;
  const idx = docs.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  const next: DocumentRecord = { ...docs[idx]!, ...patch };
  docs[idx] = next;
  return next;
}

export function appendClaimNote(claimId: string, note: Claim["notes"][number]): Claim | undefined {
  const claims = getStore().claims;
  const idx = claims.findIndex((c) => c.id === claimId);
  if (idx === -1) return undefined;
  const next: Claim = {
    ...claims[idx]!,
    notes: [...claims[idx]!.notes, note],
    updatedAt: new Date().toISOString(),
  };
  claims[idx] = next;
  return next;
}
