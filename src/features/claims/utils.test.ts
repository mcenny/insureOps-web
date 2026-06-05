import { describe, expect, it } from "vitest";
import { canTransition, nextStatesFor } from "./utils";

describe("claim state machine", () => {
  it("lists valid next states from submitted", () => {
    expect(nextStatesFor("submitted")).toEqual(["under_review"]);
  });

  it("allows claims_reviewer to move submitted to under_review", () => {
    expect(canTransition("submitted", "under_review", "claims_reviewer")).toBe(true);
  });

  it("allows claims_reviewer to approve from under_review", () => {
    expect(canTransition("under_review", "approved", "claims_reviewer")).toBe(true);
  });

  it("blocks finance_admin from approving under_review claims", () => {
    expect(canTransition("under_review", "approved", "finance_admin")).toBe(false);
  });

  it("allows finance_admin to mark approved as paid_out", () => {
    expect(canTransition("approved", "paid_out", "finance_admin")).toBe(true);
  });

  it("blocks transitions from terminal states", () => {
    expect(nextStatesFor("rejected")).toEqual([]);
    expect(canTransition("rejected", "approved", "super_admin")).toBe(false);
  });
});
