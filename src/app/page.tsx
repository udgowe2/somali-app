import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Af Soomaali</h1>
        <p className="text-gray-500 mb-10 text-sm">Somali lernen — Schritt für Schritt</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/lernen"
            className="flex items-center gap-4 p-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-md transition-all active:scale-95"
          >
            <span className="text-4xl">👧</span>
            <div className="text-left">
              <div className="font-bold text-lg">Ich will lernen!</div>
              <div className="text-blue-100 text-sm">Für Kinder</div>
            </div>
          </Link>

          <Link
            href="/lehrer"
            className="flex items-center gap-4 p-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-md transition-all active:scale-95"
          >
            <span className="text-4xl">👩‍🏫</span>
            <div className="text-left">
              <div className="font-bold text-lg">Dashboard</div>
              <div className="text-orange-100 text-sm">Für die Lehrerin</div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Eltern-Zugang per Link von der Lehrerin
        </p>
      </div>
    </main>
  );
}
