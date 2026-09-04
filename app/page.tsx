"use client";

import { useState } from "react";
import { createUrlSchema } from "@/lib/validation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);

    const result = createUrlSchema.safeParse({ url });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.data.url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setShortUrl(data.shortUrl);
      setUrl("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">
          URL Shortener
        </h1>
        <p className="mb-8 text-center text-slate-400">
          Paste your long URL and get a short one instantly
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg sm:flex-row"
        >
          <input
            type="text"
            placeholder="https://example.com/very/long/link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-sm text-red-400">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-400 hover:underline"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-600"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </main>
  );
}