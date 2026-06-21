"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMOJIS = ["👋","🛒","🍲","🏠","🏫","🎂","🏥","⚽","🌳","🎵","🚌","👗","📞","🐄","🌙"];

type GenerierteDaten = {
  phrasen: { somali: string; deutsch: string }[];
  dialog: {
    titel: string;
    zeilen: { sprecher: string; somali: string; deutsch: string; ist_luecke: boolean }[];
  };
  uebungen: { typ: string; inhalt: Record<string, unknown> }[];
  grammatik: { regel: string; beispiel_so: string; beispiel_de: string };
  eltern_tipps: string[];
};

export default function NeuesSituation() {
  const router = useRouter();
  const [schritt, setSchritt] = useState<"form" | "generieren" | "vorschau" | "speichern">("form");
  const [name_de, setNameDe] = useState("");
  const [name_so, setNameSo] = useState("");
  const [emoji, setEmoji] = useState("👋");
  const [daten, setDaten] = useState<GenerierteDaten | null>(null);
  const [fehler, setFehler] = useState("");

  async function generieren() {
    if (!name_de.trim()) { setFehler("Bitte deutschen Namen eingeben."); return; }
    setFehler("");
    setSchritt("generieren");
    try {
      const res = await fetch("/api/generieren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation_de: name_de, situation_so: name_so || name_de }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setDaten(json);
      setSchritt("vorschau");
    } catch (e) {
      setFehler("Fehler beim Generieren: " + (e as Error).message);
      setSchritt("form");
    }
  }

  async function speichern() {
    if (!daten) return;
    setSchritt("speichern");
    try {
      const slug = name_de.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await fetch("/api/situationen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name_de, name_so: name_so || name_de, emoji, reihenfolge: 0 }),
      });
      const situation = await res.json();
      await fetch("/api/situationen/" + situation.id + "/inhalte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(daten),
      });
      router.push("/lehrer");
    } catch (e) {
      setFehler("Fehler beim Speichern: " + (e as Error).message);
      setSchritt("vorschau");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/lehrer" className="text-gray-400 hover:text-gray-600 text-xl">←</Link>
          <h1 className="text-xl font-bold text-gray-800">Neue Situation erstellen</h1>
        </div>

        {/* SCHRITT 1: Formular */}
        {(schritt === "form" || schritt === "generieren") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-xl transition-all ${emoji === e ? "bg-orange-100 ring-2 ring-orange-400" : "bg-gray-50 hover:bg-gray-100"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Situation auf Deutsch <span className="text-red-400">*</span>
              </label>
              <input value={name_de} onChange={e => setNameDe(e.target.value)}
                placeholder="z.B. Begrüßung"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"/>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Situation auf Somali <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input value={name_so} onChange={e => setNameSo(e.target.value)}
                placeholder="z.B. Salaan"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"/>
            </div>

            {fehler && <p className="text-red-500 text-sm mb-4">{fehler}</p>}

            <button onClick={generieren} disabled={schritt === "generieren"}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-colors">
              {schritt === "generieren" ? "✨ Claude generiert..." : "✨ Mit Claude generieren"}
            </button>
          </div>
        )}

        {/* SCHRITT 2: Vorschau */}
        {schritt === "vorschau" && daten && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{emoji}</span>
                <div>
                  <div className="font-bold text-lg">{name_de}</div>
                  <div className="text-gray-400 text-sm">{name_so || name_de}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phrasen ({daten.phrasen.length})</div>
                {daten.phrasen.map((p, i) => (
                  <div key={i} className="flex gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-800 flex-1">{p.somali}</span>
                    <span className="text-sm text-gray-400 flex-1">{p.deutsch}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dialog — {daten.dialog.titel}</div>
                {daten.dialog.zeilen.map((z, i) => (
                  <div key={i} className={`flex gap-2 py-1 ${z.ist_luecke ? "opacity-60" : ""}`}>
                    <span className="text-xs font-bold text-gray-400 w-5">{z.sprecher}</span>
                    <span className="text-sm flex-1">{z.somali} {z.ist_luecke && <span className="text-blue-400 text-xs">(Kind füllt aus)</span>}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grammatik</div>
                <p className="text-sm text-gray-700">{daten.grammatik.regel}</p>
                <p className="text-sm text-blue-600 mt-1">{daten.grammatik.beispiel_so} — {daten.grammatik.beispiel_de}</p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Eltern-Tipps</div>
                {daten.eltern_tipps.map((t, i) => (
                  <p key={i} className="text-sm text-gray-600">• {t}</p>
                ))}
              </div>
            </div>

            {fehler && <p className="text-red-500 text-sm">{fehler}</p>}

            <div className="flex gap-3">
              <button onClick={() => setSchritt("form")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
                Nochmal generieren
              </button>
              <button onClick={speichern} disabled={schritt === "speichern"}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 rounded-xl transition-colors">
                {schritt === "speichern" ? "Wird gespeichert..." : "✓ Speichern"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
