import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Home page form", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          shortCode: "abc123",
          shortUrl: "http://localhost:3000/abc123",
        }),
      })
    );
  });

  it("renders the form", () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText(/paste your long url|https:\/\/example/i)
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /shorten url/i })
    ).toBeTruthy();
  });

  it("shows a validation error for invalid input", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText(/https:\/\/example/i);
    await user.type(input, "not a url");
    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    expect(
      await screen.findByText(/valid url/i)
    ).toBeTruthy();
  });

  it("shows the short URL after successful submission", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText(/https:\/\/example/i);
    await user.type(input, "https://example.com");
    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(
        screen.getByText("http://localhost:3000/abc123")
      ).toBeTruthy();
    });
  });
});