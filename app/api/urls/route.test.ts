import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma";
import { POST } from "./route";

vi.mock("nanoid", () => ({
  nanoid: () => "abc1234",
}));

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/urls", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/urls", () => {
  it("returns 400 for an invalid URL", async () => {
    const res = await POST(makeRequest({ url: "not-a-url" }));
    expect(res.status).toBe(400);
  });

  it("creates a short URL for a valid request", async () => {
    prismaMock.url.findUnique.mockResolvedValue(null);
    prismaMock.url.create.mockResolvedValue({
      id: "1",
      originalUrl: "https://example.com",
      shortCode: "abc1234",
      clickCount: 0,
      lastClickedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(makeRequest({ url: "https://example.com" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.shortCode).toBe("abc1234");
  });

  it("returns 409 when custom alias already exists", async () => {
    prismaMock.url.findUnique.mockResolvedValue({
      id: "1",
      originalUrl: "https://taken.com",
      shortCode: "taken",
      clickCount: 0,
      lastClickedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({ url: "https://example.com", customAlias: "taken" })
    );

    expect(res.status).toBe(409);
  });
});