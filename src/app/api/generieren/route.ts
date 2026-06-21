import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt in der .env Datei" }, { status: 500 });
  }

  const { situation_de, situation_so } = await req.json();

  const prompt = `Du bist Experte für Somali-Sprachunterricht für deutschsprachige Kinder (6–12 Jahre).

Erstelle eine komplette Lektion für die Situation: "${situation_de}" (Somali: "${situation_so}").

Antworte NUR mit validem JSON in diesem Format:
{
  "phrasen": [
    { "somali": "...", "deutsch": "..." }
  ],
  "dialog": {
    "titel": "...",
    "zeilen": [
      { "sprecher": "A", "somali": "...", "deutsch": "...", "ist_luecke": false },
      { "sprecher": "B", "somali": "...", "deutsch": "...", "ist_luecke": true }
    ]
  },
  "uebungen": [
    {
      "typ": "LUECKENTEXT",
      "inhalt": {
        "satz_so": "Waa _____ hooyaday.",
        "satz_de": "Das ist meine Mutter.",
        "antwort": "tani",
        "optionen": ["tani", "waa", "ma", "leh"]
      }
    },
    {
      "typ": "RICHTIG_FALSCH",
      "inhalt": {
        "aussage_so": "Hooyo waa aabe.",
        "aussage_de": "Mutter ist Vater.",
        "richtig": false
      }
    }
  ],
  "grammatik": {
    "regel": "...",
    "beispiel_so": "...",
    "beispiel_de": "..."
  },
  "eltern_tipps": ["...", "..."]
}

Regeln:
- 5–7 Phrasen
- Dialog: 6–8 Zeilen, abwechselnd A und B, 2–3 Zeilen als ist_luecke:true (Kind füllt aus)
- 3 Übungen (mindestens 2 verschiedene Typen)
- Grammatik: eine einfache Regel kindgerecht erklärt
- Eltern-Tipps: 2 konkrete Übungsvorschläge für zuhause`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude hat kein gültiges JSON zurückgegeben" }, { status: 500 });
    }
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
