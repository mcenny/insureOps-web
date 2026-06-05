import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, titleCase } from "./format";

describe("formatters", () => {
  it("formats currency without cents", () => {
    expect(formatCurrency(1250)).toBe("$1,250");
  });

  it("formats valid ISO dates", () => {
    expect(formatDate("2024-06-15T12:00:00.000Z")).toMatch(/Jun 15, 2024/);
  });

  it("returns dash for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("-");
  });

  it("title-cases snake_case", () => {
    expect(titleCase("proof_of_address")).toBe("Proof Of Address");
  });
});
