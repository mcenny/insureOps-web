import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders label and status dot", () => {
    render(
      <StatusBadge tone="success" data-testid="status-badge">
        Active
      </StatusBadge>,
    );
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Active");
    expect(badge.querySelector("[aria-hidden]")).toBeTruthy();
  });
});
