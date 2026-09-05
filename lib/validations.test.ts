import { describe, it, expect } from "vitest";
import { createUrlSchema } from "./validations";

describe("createUrlSchema", () => {
  it("accepts a valid URL", () => {
    const result = createUrlSchema.safeParse({ url: "https://example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty URL", () => {
    const result = createUrlSchema.safeParse({ url: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL string", () => {
    const result = createUrlSchema.safeParse({ url: "hello world" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid custom alias", () => {
    const result = createUrlSchema.safeParse({
      url: "https://example.com",
      customAlias: "my-portfolio",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a reserved alias", () => {
    const result = createUrlSchema.safeParse({
      url: "https://example.com",
      customAlias: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an alias shorter than 3 characters", () => {
    const result = createUrlSchema.safeParse({
      url: "https://example.com",
      customAlias: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an alias with invalid characters", () => {
    const result = createUrlSchema.safeParse({
      url: "https://example.com",
      customAlias: "my alias!",
    });
    expect(result.success).toBe(false);
  });
});