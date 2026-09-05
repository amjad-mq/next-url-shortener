import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const urls = await prisma.url.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-50">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total URLs</p>
            <p className="text-3xl font-bold">{totalUrls}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Clicks</p>
            <p className="text-3xl font-bold">{totalClicks}</p>
          </div>
        </div>

        {urls.length === 0 ? (
          <p className="text-center text-slate-400">
            No URLs created yet. Go create one!
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Original URL</th>
                  <th className="px-4 py-3">Short Code</th>
                  <th className="px-4 py-3">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800">
                    <td className="max-w-xs truncate px-4 py-3">
                      {u.originalUrl}
                    </td>
                    <td className="px-4 py-3 text-blue-400">{u.shortCode}</td>
                    <td className="px-4 py-3">{u.clickCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}