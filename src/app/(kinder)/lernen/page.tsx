"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Situation = {
  id: number;
  slug: string;
  name_de: string;
  name_so: string;
  emoji: string;
  _count: { phrasen: number; dialoge: number; uebungen: number };
};

export default function LernenPage() {
  const [situationen, setSituationen] = useState<Situation[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    fetch("/api/situationen")
      .then((r) => r.json())
      .then((data) => setSituationen(data))
      .finally(() => setLaden(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-2xl">←</Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Was möchtest du lernen?</h1>
            <p className="text-gray-500 text-sm">Wähle eine Situation</p>
          </div>
        </div>

        {laden && (
          <div className="text-center py-12 text-gray-400">Wird geladen...</div>
        )}

        {!laden && situationen.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😴</div>
            <p className="text-gray-500">Noch keine Situationen.</p>
            <p className="text-gray-400 text-sm mt-1">Die Lehrerin fügt bald welche hinzu!</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {situationen.map((s) => (
            <Link
              key={s.id}
              href={`/lernen/${s.slug}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:border-blue-300 transition-all active:scale-95"
            >
              <span className="text-4xl">{s.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{s.name_de}</div>
                <div className="text-gray-400 text-sm">{s.name_so}</div>
              </div>
              <div className="text-blue-400 text-xl">→</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
