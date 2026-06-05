import { describe, expect, it } from "vitest";
import { hasPermission, permissionsFor } from "./permissions";

describe("permissions", () => {
  it("grants finance_admin payment retry but not claim approve", () => {
    expect(hasPermission("finance_admin", "payment:retry")).toBe(true);
    expect(hasPermission("finance_admin", "claim:approve")).toBe(false);
  });

  it("grants claims_reviewer claim approve but not payment retry", () => {
    expect(hasPermission("claims_reviewer", "claim:approve")).toBe(true);
    expect(hasPermission("claims_reviewer", "payment:retry")).toBe(false);
  });

  it("grants super_admin all listed actions", () => {
    const perms = permissionsFor("super_admin");
    expect(perms).toContain("claim:approve");
    expect(perms).toContain("payment:reconcile");
    expect(perms).toContain("settings:manage_roles");
  });

  it("denies unknown role", () => {
    expect(hasPermission(undefined, "claim:view")).toBe(false);
  });

  it("restricts support_agent to view-only workflows", () => {
    expect(hasPermission("support_agent", "customer:view")).toBe(true);
    expect(hasPermission("support_agent", "claim:approve")).toBe(false);
    expect(hasPermission("support_agent", "document:review")).toBe(false);
  });
});
