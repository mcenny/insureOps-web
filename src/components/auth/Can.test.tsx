import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Can } from "./Can";
import { useUserStore } from "@/store/user-store";
import { DEMO_USERS } from "@/features/auth/demo-users";

describe("Can", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, hasHydrated: true });
  });

  it("renders children when role has permission", () => {
    useUserStore.setState({ user: DEMO_USERS.find((u) => u.role === "claims_reviewer")! });
    render(
      <Can action="claim:approve">
        <button type="button">Approve</button>
      </Can>,
    );
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("renders fallback when role lacks permission", () => {
    useUserStore.setState({ user: DEMO_USERS.find((u) => u.role === "support_agent")! });
    render(
      <Can action="claim:approve" fallback={<span>Hidden</span>}>
        <button type="button">Approve</button>
      </Can>,
    );
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });
});
