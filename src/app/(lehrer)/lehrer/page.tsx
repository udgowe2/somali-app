"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Situation = {
  id: number;
  slug: string;
  name_de: string;
  name_so: string;
  emoji: string;
  aktiv: boolean;
  _count: { phrasen: number; dialoge: number; uebungen: number };
};

export default function LehrerDashboard() {
  const [situationen, setSituationen] = useState<Situation[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    fetch("/api/situationen")
      .then((r) => r.json())
      .then(setSituationen)
      .finally(() => setLaden(false));
  }, []);

  const gesamt = situationen.length;
  const aktiv = situationen.filter((s) => s.aktiv).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👩‍🏫 Lehrerin-Dashboard</h1>
            <p className="text-gray-500 text-sm">Af Soomaali — Übersicht</p>
          </div>
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Start</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-500">{gesamt}</div>
            <div className="text-gray-500 text-sm mt-1">Situationen total</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-500">{aktiv}</div>
            <div className="text-gray-500 text-sm mt-1">Aktiv / sichtbar</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">Situationen</h2>
          <Link
            href="/lehrer/neu"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-xl transition-colors"
          >
            + Neue Situation
          </Link>
        </div>

        {laden && <div className="text-center py-8 text-gray-400">Wird geladen...</div>}

        <div className="flex flex-col gap-3">
          {situationen.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <span className="text-3xl">{s.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{s.name_de}</div>
                <div className="text-gray-400 text-xs mt-0.5">
                  {s._count.phrasen} Phrasen · {s._count.dialoge} Dialog(e) · {s._count.uebungen} Übungen
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${s.aktiv ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {s.aktiv ? "Aktiv" : "Entwurf"}
              </span>
            </div>
          ))}

          {!laden && situationen.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>Noch keine Situationen.</p>
              <p className="text-sm mt-1">Erstelle die erste mit dem Button oben.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
