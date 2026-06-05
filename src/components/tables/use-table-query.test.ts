import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableQuery } from "./use-table-query";

let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: (href: string) => {
      const qs = href.includes("?") ? href.split("?")[1]! : "";
      searchParams = new URLSearchParams(qs);
    },
  }),
  usePathname: () => "/claims",
  useSearchParams: () => searchParams,
}));

beforeEach(() => {
  searchParams = new URLSearchParams();
});

describe("useTableQuery", () => {
  it("updates search and resets page to 1", () => {
    const { result, rerender } = renderHook(() => useTableQuery({ filters: [{ key: "status" }] }));
    act(() => result.current.setPage(3));
    rerender();
    expect(result.current.query.page).toBe(3);
    act(() => result.current.setSearch("acme"));
    rerender();
    expect(result.current.query.search).toBe("acme");
    expect(result.current.query.page).toBe(1);
  });

  it("toggles sort direction on repeated column", () => {
    const { result, rerender } = renderHook(() => useTableQuery({ filters: [] }));
    act(() => result.current.toggleSort("claimNumber"));
    rerender();
    expect(result.current.query.sortBy).toBe("claimNumber");
    expect(result.current.query.sortDir).toBe("asc");
    act(() => result.current.toggleSort("claimNumber"));
    rerender();
    expect(result.current.query.sortDir).toBe("desc");
    act(() => result.current.toggleSort("claimNumber"));
    rerender();
    expect(result.current.query.sortBy).toBeUndefined();
  });
});
