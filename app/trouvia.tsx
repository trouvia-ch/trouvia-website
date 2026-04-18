import { useState, useRef, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ANNONCES_INIT = [
  { id: 1, titre: "VTT Scott Scale 970", desc: "29 pouces · Shimano Deore · quasi neuf · casque inclus", prix: 650, prixNeuf: 1299, annee: 2022, cat: "Sport", lieu: "Genève", canton: "GE", emoji: "🚵", vendeur: "Marc D.", photos: 3, top: false, verifie: true, signalements: 0, collector: false },
  { id: 2, titre: "iPhone 15 Pro 256GB", desc: "Titanium · garantie Apple · facture disponible", prix: 890, prixNeuf: 1299, annee: 2023, cat: "Électronique", lieu: "Zurich", canton: "ZH", emoji: "📱", vendeur: "Nico B.", photos: 4, top: true, verifie: true, signalements: 0, collector: false },
  { id: 3, titre: "Charizard Pokémon PSA 9", desc: "1ère édition · holographique · certifié collector", prix: 2800, prixNeuf: 4, annee: 1999, cat: "Collector", lieu: "Lausanne", canton: "VD", emoji: "🎴", vendeur: "Claire M.", photos: 5, top: true, verifie: true, signalements: 0, collector: true, collecteurRaison: "Carte 1ère édition PSA 9. Cote actuelle 2500–4000 CHF sur le marché mondial." },
  { id: 4, titre: "MacBook Pro M3 14\"", desc: "16GB RAM · encore sous garantie · pochette incluse", prix: 1750, prixNeuf: 2299, annee: 2023, cat: "Électronique", lieu: "Bâle", canton: "BS", emoji: "💻", vendeur: "Tom K.", photos: 5, top: false, verifie: false, signalements: 0, collector: false },
  { id: 5, titre: "VW Touran 2.0 TDI 7 places", desc: "Diesel · 85 000 km · carnet entretien VW · Isofix", prix: 18900, prixNeuf: 38000, annee: 2019, cat: "Véhicules", lieu: "Lausanne", canton: "VD", emoji: "🚗", vendeur: "Jean-Luc F.", photos: 8, top: true, verifie: true, signalements: 0, collector: false },
  { id: 6, titre: "Canapé angle cuir brun", desc: "280cm · 3 ans · très bon état · démontable", prix: 450, prixNeuf: 1800, annee: 2021, cat: "Mobilier", lieu: "Genève", canton: "GE", emoji: "🛋️", vendeur: "Paul R.", photos: 6, top: false, verifie: true, signalements: 0, collector: false },
  { id: 7, titre: "Vélo électrique Bosch 500Wh", desc: "E-bike trekking · autonomie ~100km · comme neuf", prix: 1400, prixNeuf: 2800, annee: 2022, cat: "Sport", lieu: "Fribourg", canton: "FR", emoji: "⚡", vendeur: "Reto W.", photos: 3, top: false, verifie: false, signalements: 0, collector: false },
  { id: 8, titre: "Rolex Datejust 1972 Vintage", desc: "Bracelet jubilé d'origine · excellent état · boîte", prix: 8900, prixNeuf: 2200, annee: 1972, cat: "Montres", lieu: "Genève", canton: "GE", emoji: "⌚", vendeur: "Jean P.", photos: 7, top: false, verifie: true, signalements: 0, collector: true, collecteurRaison: "Montre vintage dont la cote dépasse le prix neuf. Très recherchée par les collectionneurs suisses." },
  { id: 9, titre: "AirPods Pro 2 — boîte ouverte", desc: "Juste testés · comme neuf · boîte d'origine", prix: 289, prixNeuf: 279, annee: 2024, cat: "Électronique", lieu: "Genève", canton: "GE", emoji: "🎧", vendeur: "???", photos: 1, top: false, verifie: false, signalements: 4, collector: false },
  { id: 10, titre: "Cours de français tous niveaux", desc: "15 ans d'expérience · Skype possible · certifiée", prix: 60, prixNeuf: null, annee: 2024, cat: "Services", lieu: "Bern", canton: "BE", emoji: "📚", vendeur: "Sophie L.", photos: 2, top: false, verifie: true, signalements: 0, collector: false },
];

const CATEGORIES = [
  { label: "Tout", icon: "🏪" }, { label: "Véhicules", icon: "🚗" }, { label: "Électronique", icon: "📱" },
  { label: "Sport", icon: "🏃" }, { label: "Immobilier", icon: "🏠" }, { label: "Mobilier", icon: "🛋️" },
  { label: "Collector", icon: "💎" }, { label: "Services", icon: "🔧" }, { label: "Montres", icon: "⌚" },
];

const CANTONS = ["Tous", "GE", "VD", "BE", "VS", "FR", "NE", "JU", "AG", "SG"];

const PALETTE = [
  { bg: "#F59E0B", light: "#FFFBEB", text: "#92400E" },
  { bg: "#3B82F6", light: "#EFF6FF", text: "#1E40AF" },
  { bg: "#10B981", light: "#ECFDF5", text: "#065F46" },
  { bg: "#8B5CF6", light: "#F5F3FF", text: "#4C1D95" },
  { bg: "#EF4444", light: "#FEF2F2", text: "#7F1D1D" },
];

const BOOST_OPTIONS = [
  { id: "top7", nom: "Top Listing 7 jours", desc: "En tête de liste 7 jours + badge TOP", credits: 80, icon: "🏆", hot: true },
  { id: "top3", nom: "Top Listing 3 jours", desc: "En tête de liste 3 jours", credits: 40, icon: "⚡", hot: false },
  { id: "weekly", nom: "Réapparition hebdo 4 sem.", desc: "Remonte en tête chaque semaine pendant 1 mois", credits: 60, icon: "🔄", hot: false },
  { id: "premium", nom: "Premium 30 jours", desc: "Badge Premium + top + statistiques", credits: 150, icon: "👑", hot: false },
];

const USER_INIT = {
  nom: "Jean M.", credits: 175, referralCode: "TROUVIA-JEAN42",
  historique: [
    { type: "parrainage", label: "Sophie T. s'est inscrite", credits: "+50", date: "12.03.2026" },
    { type: "photo", label: "5 photos ajoutées", credits: "+25", date: "10.03.2026" },
    { type: "annonce", label: "Annonce publiée : VTT", credits: "+10", date: "10.03.2026" },
    { type: "bienvenue", label: "Bonus d'inscription", credits: "+50", date: "01.03.2026" },
  ]
};

const CONVS_INIT = {
  5: [
    { id: 1, from: "buyer", name: "Vous", text: "Bonjour, la voiture est-elle équipée de l'Isofix ?", ts: "10:14" },
    { id: 2, from: "seller", name: "Jean-Luc F.", text: "Oui, 2 Isofix sur les sièges latéraux de la 2e rangée.", ts: "10:22",
      aiSugg: { text: "💡 Ajouter à l'annonce : « Isofix sur sièges latéraux 2e rangée (pas central) »", addedInfo: "Isofix disponible sur les 2 sièges latéraux de la 2e rangée (pas sur le siège central).", accepted: false, dismissed: false } },
  ]
};

function makeProfile(id, colorIdx) {
  return { id, name: `Recherche ${id}`, query: "", canton: "Tous", cat: "Tout", aiResult: null, aiMsg: "", displayed: ANNONCES_INIT, loading: false, colorIdx, notify: false };
}

function dealScore(a) {
  if (!a.prixNeuf || a.prixNeuf < 10) return null;
  if (a.collector) return { label: "Cote collector", emoji: "💎", color: "#8B5CF6", bg: "#F5F3FF", stars: 5, score: 3 };
  const age = 2026 - (a.annee || 2020);
  const ratio = a.prix / a.prixNeuf;
  const exp = Math.max(0.08, 1 - age * 0.11);
  const s = (exp - ratio) / exp;
  if (ratio > 1.05) return { label: "Prix abusif", emoji: "🚨", color: "#DC2626", bg: "#FEF2F2", stars: 0, score: -2, warn: true, timer: true };
  if (ratio > 0.97) return { label: "Surévalué", emoji: "⚠️", color: "#EA580C", bg: "#FFF7ED", stars: 1, score: -1, warn: true };
  if (s < 0.05) return { label: "Prix correct", emoji: "😐", color: "#64748B", bg: "#F8FAFC", stars: 2, score: 0 };
  if (s < 0.2) return { label: "Bon prix", emoji: "👍", color: "#0284C7", bg: "#F0F9FF", stars: 3, score: 1 };
  if (s < 0.35) return { label: "Bonne affaire !", emoji: "✨", color: "#059669", bg: "#ECFDF5", stars: 4, score: 2 };
  return { label: "Excellente affaire !", emoji: "🔥", color: "#D97706", bg: "#FFFBEB", stars: 5, score: 3 };
}

async function callClaude(prompt: string, maxTokens = 400) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, maxTokens }),
  });
  const data = await res.json();
  return data.content.map((i: any) => i.text || "").join("").replace(/```json|```/g, "").trim();
}

// ─── DIAMOND ──────────────────────────────────────────────────────────────────
function Diamond({ label, icon, active, color, onClick, size = 68 }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: size, height: size, position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: active ? color : hov ? "#F8FAFC" : "#fff", border: `2px solid ${active ? color : hov ? color + "66" : "#E2E8F0"}`, transform: "rotate(45deg)", borderRadius: 10, transition: "all 0.15s", boxShadow: active ? `0 4px 16px ${color}44` : "none" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <span style={{ fontSize: size > 60 ? 16 : 12 }}>{icon}</span>
        <span style={{ fontSize: size > 60 ? 8 : 7, fontWeight: 700, color: active ? "#fff" : "#64748B", fontFamily: "'Outfit',sans-serif", textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>{label}</span>
      </div>
    </div>
  );
}

// ─── ANNONCE CARD ─────────────────────────────────────────────────────────────
function Card({ a, highlight, color, onMsg, onInfo, onReport }) {
  const [hov, setHov] = useState(false);
  const deal = dealScore(a);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: `1.5px solid ${highlight ? color.bg + "66" : hov ? "#CBD5E1" : "#E2E8F0"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.18s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 36px rgba(0,0,0,0.08)" : highlight ? `0 4px 16px ${color.bg}22` : "0 2px 6px rgba(0,0,0,0.04)", position: "relative" }}>

      {/* Color top strip */}
      <div style={{ height: 3, background: highlight ? color.bg : deal?.color || "#E2E8F0" }} />

      {/* Image zone */}
      <div style={{ height: 100, background: deal?.bg || "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 44 }}>{a.emoji}</span>

        {/* Left badges */}
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {a.top && <span style={{ background: "#F59E0B", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 20 }}>🏆 TOP</span>}
          {a.collector && <span style={{ background: "#8B5CF6", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 20 }}>💎 COLLECTOR</span>}
          {a.verifie && <span style={{ background: "#059669", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 20 }}>✓ VÉRIFIÉ</span>}
          {highlight && <span style={{ background: color.bg, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 20 }}>IA</span>}
        </div>

        {/* Deal badge */}
        {deal && (
          <div style={{ position: "absolute", top: 8, right: 8, background: "#fff", border: `1px solid ${deal.color}22`, borderRadius: 20, padding: "3px 7px", display: "flex", gap: 3, alignItems: "center" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: deal.color }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: deal.color }}>{deal.label}</span>
          </div>
        )}

        {/* Report */}
        <button onClick={e => { e.stopPropagation(); onReport(); }}
          style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 8, color: "#94A3B8", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
          🚨
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F0F0F", marginBottom: 2, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{a.titre}</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.desc}</div>

        {/* Stars bars */}
        {deal && (
          <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
            {[1,2,3,4,5].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= deal.stars ? deal.color : "#F1F5F9" }} />)}
          </div>
        )}

        {/* Photos */}
        {a.photos > 0 && (
          <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
            {[...Array(Math.min(a.photos, 4))].map((_, i) => (
              <div key={i} style={{ width: 20, height: 14, background: "#F1F5F9", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7 }}>📷</div>
            ))}
            {a.photos > 4 && <span style={{ fontSize: 9, color: "#94A3B8", alignSelf: "center" }}>+{a.photos - 4}</span>}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: deal?.timer ? "#DC2626" : "#0F0F0F", letterSpacing: "-0.03em" }}>
              CHF {a.prix.toLocaleString("fr-CH")}
            </div>
            {a.prixNeuf && a.prixNeuf > 10 && <div style={{ fontSize: 9, color: "#CBD5E1" }}>Neuf : CHF {a.prixNeuf.toLocaleString("fr-CH")}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#CBD5E1" }}>📍 {a.lieu}</div>
            <div style={{ fontSize: 9, color: "#E2E8F0" }}>📅 {a.annee}</div>
          </div>
        </div>

        {/* Abusive warning */}
        {deal?.timer && <div style={{ marginTop: 6, background: "#FEF2F2", borderRadius: 6, padding: "5px 8px", fontSize: 9, color: "#DC2626", fontWeight: 600 }}>🚫 Supprimée dans 48h si prix non corrigé</div>}
        {deal?.score >= 2 && !a.collector && <div style={{ marginTop: 6, background: "#ECFDF5", borderRadius: 6, padding: "5px 8px", fontSize: 9, color: "#059669", fontWeight: 600 }}>✨ Vendeur récompensé +{deal.score >= 3 ? 30 : 15} crédits</div>}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 14px 12px", display: "flex", gap: 6 }}>
        <button onClick={e => { e.stopPropagation(); onMsg(); }}
          style={{ flex: 1, background: "#0F0F0F", border: "none", borderRadius: 9, padding: "9px 0", fontSize: 11.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
          💬 Contacter
        </button>
        <button onClick={e => { e.stopPropagation(); onInfo(); }}
          style={{ width: 36, background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 9, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ℹ
        </button>
      </div>
    </div>
  );
}

// ─── MESSAGING PANEL ──────────────────────────────────────────────────────────
function MsgPanel({ annonce, convs, setConvs, annonces, setAnnonces, onClose, onEarn }) {
  const [input, setInput] = useState(""); const [view, setView] = useState("buyer");
  const [aiLoading, setAiLoading] = useState(false); const [suggestions, setSuggestions] = useState(null); const [sugLoading, setSugLoading] = useState(false);
  const bottomRef = useRef(null); const msgs = convs[annonce.id] || [];
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const genSuggestions = async (q, allMsgs) => {
    setSugLoading(true); setSuggestions(null);
    try {
      const raw = await callClaude(`Assistant trouvia.ch. Question acheteur: "${q}". Annonce: "${annonce.titre}" — ${annonce.desc}. JSON: {"suggestions":[{"texte":"...","ton":"Précis"},{"texte":"...","ton":"Détaillé"},{"texte":"...","ton":"Court"}],"info_utile":null}`, 400);
      setSuggestions(JSON.parse(raw));
    } catch { setSuggestions({ suggestions: [{ texte: "Merci pour votre question, je reviens rapidement.", ton: "Court" }], info_utile: null }); }
    setSugLoading(false);
  };

  const send = async (role, override = null) => {
    const text = override || input.trim(); if (!text) return;
    const msg = { id: Date.now(), from: role, name: role === "buyer" ? "Vous" : annonce.vendeur, text, ts: new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }) };
    setInput(""); setSuggestions(null);
    if (role === "seller") {
      setAiLoading(true);
      const updated = [...msgs, msg];
      try {
        const raw = await callClaude(`Fil: ${updated.map(m => `${m.from === "buyer" ? "A" : "V"}: ${m.text}`).join(" | ")}. Info utile pour l'annonce dans dernière réponse vendeur ? JSON: {"suggest":true/false,"addedInfo":"phrase ou vide","reason":"raison"}`, 200);
        const p = JSON.parse(raw);
        if (p.suggest && p.addedInfo) {
          setConvs(c => ({ ...c, [annonce.id]: [...msgs, { ...msg, aiSugg: { text: `💡 Ajouter : « ${p.addedInfo} »`, addedInfo: p.addedInfo, accepted: false, dismissed: false } }] }));
        } else { setConvs(c => ({ ...c, [annonce.id]: updated })); }
      } catch { setConvs(c => ({ ...c, [annonce.id]: updated })); }
      setAiLoading(false);
      onEarn("reponse", 3);
    } else {
      setConvs(c => ({ ...c, [annonce.id]: [...msgs, msg] }));
      genSuggestions(text, [...msgs, msg]);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 400, height: "88vh", background: "#fff", borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", boxShadow: "0 -8px 48px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        <div style={{ background: "#0F0F0F", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{annonce.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{annonce.titre}</div><div style={{ fontSize: 9, color: "#64748B" }}>{annonce.vendeur}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 18 }}>×</button>
        </div>
        <div style={{ background: "#F8FAFC", padding: "6px 14px", display: "flex", gap: 5, borderBottom: "1px solid #F1F5F9" }}>
          {["buyer", "seller"].map(r => (
            <button key={r} onClick={() => { setView(r); setSuggestions(null); }} style={{ border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", background: view === r ? "#0F0F0F" : "#E2E8F0", color: view === r ? "#fff" : "#64748B" }}>
              {r === "buyer" ? "🛒 Acheteur" : "🏷️ Vendeur"}
            </button>
          ))}
          {view === "seller" && <span style={{ marginLeft: "auto", fontSize: 9, color: "#F59E0B", fontWeight: 600 }}>🤖 IA active · +3pts/réponse</span>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.map(msg => {
            const mine = (view === "buyer" && msg.from === "buyer") || (view === "seller" && msg.from === "seller");
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", gap: 2 }}>
                <div style={{ fontSize: 9, color: "#CBD5E1" }}>{msg.name} · {msg.ts}</div>
                <div style={{ background: mine ? "#0F0F0F" : "#F8FAFC", color: mine ? "#fff" : "#0F0F0F", borderRadius: mine ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "8px 11px", fontSize: 12, maxWidth: "85%", lineHeight: 1.5 }}>{msg.text}</div>
                {msg.aiSugg && !msg.aiSugg.dismissed && (
                  <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "9px 11px", maxWidth: "90%", marginTop: 2 }}>
                    <div style={{ fontSize: 10, color: "#D97706", fontWeight: 700, marginBottom: 5 }}>🤖 Suggestion IA</div>
                    <div style={{ fontSize: 11, color: "#92400E", marginBottom: 7 }}>{msg.aiSugg.text}</div>
                    {msg.aiSugg.accepted ? <div style={{ fontSize: 10, color: "#059669", fontWeight: 700 }}>✅ Annonce mise à jour !</div> : (
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => { setAnnonces(prev => prev.map(a => a.id === annonce.id ? { ...a, desc: a.desc + " " + msg.aiSugg.addedInfo } : a)); setConvs(c => ({ ...c, [annonce.id]: msgs.map(m => m.id === msg.id ? { ...m, aiSugg: { ...m.aiSugg, accepted: true, dismissed: true } } : m) })); }}
                          style={{ flex: 1, background: "#F59E0B", color: "#fff", border: "none", borderRadius: 7, padding: "5px 0", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>✓ Mettre à jour</button>
                        <button onClick={() => setConvs(c => ({ ...c, [annonce.id]: msgs.map(m => m.id === msg.id ? { ...m, aiSugg: { ...m.aiSugg, dismissed: true } } : m) }))}
                          style={{ background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: 7, padding: "5px 9px", fontSize: 10, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Ignorer</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {aiLoading && <div style={{ color: "#94A3B8", fontSize: 10, fontStyle: "italic" }}>🤖 L'IA analyse…</div>}
          {view === "seller" && (sugLoading || suggestions) && (
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 11px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#1D4ED8", marginBottom: 6 }}>🤖 Suggestions de réponse {sugLoading && "· en cours…"}</div>
              {suggestions?.suggestions?.map((s, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: 8, color: "#3B82F6", fontWeight: 700, marginBottom: 2 }}>{s.ton}</div>
                  <div onClick={() => setInput(s.texte)} style={{ background: "#fff", border: "1px solid #BFDBFE", borderRadius: 7, padding: "7px 9px", fontSize: 11, color: "#0F0F0F", cursor: "pointer", lineHeight: 1.4 }}>{s.texte}</div>
                </div>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "8px 12px", borderTop: "1px solid #F1F5F9", background: "#FAFAF9", display: "flex", gap: 6 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(view)} placeholder={view === "buyer" ? "Votre question…" : "Répondre…"} style={{ flex: 1, border: "1.5px solid #E2E8F0", borderRadius: 9, padding: "8px 12px", fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none", background: "#fff" }} />
          <button onClick={() => send(view)} style={{ background: "#0F0F0F", color: "#fff", border: "none", borderRadius: 9, padding: "8px 13px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── INFO MODAL ───────────────────────────────────────────────────────────────
function InfoModal({ annonce, onClose }) {
  const [loading, setLoading] = useState(true); const [info, setInfo] = useState(null);
  useEffect(() => {
    callClaude(`Expert trouvia.ch. Annonce: "${annonce.titre}" — ${annonce.desc} — CHF ${annonce.prix}. JSON: {"resume":"2-3 phrases","points_forts":["...","...","..."],"points_attention":["...","..."],"prix_marche":"fourchette CHF","conseil":"1 conseil"}`, 500)
      .then(r => { setInfo(JSON.parse(r)); setLoading(false); })
      .catch(() => { setInfo({ resume: "Informations disponibles.", points_forts: ["Annonce vérifiée"], points_attention: ["Vérifiez l'état"], prix_marche: `~CHF ${annonce.prix.toLocaleString("fr-CH")}`, conseil: "Posez vos questions via le chat." }); setLoading(false); });
  }, []);
  const deal = dealScore(annonce);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "88vh", background: "#fff", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ background: "#0F0F0F", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: deal?.bg || "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{annonce.emoji}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 9, color: "#F59E0B", fontWeight: 700, letterSpacing: "0.08em" }}>IA · INFO WEB</div><div style={{ fontSize: 12, color: "#fff", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{annonce.titre}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 18 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "40px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #F1F5F9", borderTopColor: "#F59E0B", animation: "spin 0.8s linear infinite" }} />
              <div style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>🌐 Recherche sur Internet…</div>
            </div>
          ) : info && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "11px 13px" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", marginBottom: 4 }}>RÉSUMÉ</div><div style={{ fontSize: 12, color: "#0F0F0F", lineHeight: 1.6 }}>{info.resume}</div></div>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "11px 13px", display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", marginBottom: 2 }}>PRIX MARCHÉ</div><div style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F" }}>{info.prix_marche}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: "#94A3B8" }}>Prix annonce</div><div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>CHF {annonce.prix.toLocaleString("fr-CH")}</div></div>
              </div>
              <div><div style={{ fontSize: 9, fontWeight: 700, color: "#059669", marginBottom: 6 }}>✅ POINTS FORTS</div>{info.points_forts?.map((p, i) => <div key={i} style={{ display: "flex", gap: 6, padding: "6px 10px", background: "#ECFDF5", borderRadius: 7, marginBottom: 4 }}><span style={{ color: "#059669" }}>✓</span><span style={{ fontSize: 11, color: "#0F0F0F" }}>{p}</span></div>)}</div>
              <div><div style={{ fontSize: 9, fontWeight: 700, color: "#EA580C", marginBottom: 6 }}>⚠️ À VÉRIFIER</div>{info.points_attention?.map((p, i) => <div key={i} style={{ display: "flex", gap: 6, padding: "6px 10px", background: "#FFF7ED", borderRadius: 7, marginBottom: 4 }}><span style={{ color: "#EA580C" }}>!</span><span style={{ fontSize: 11, color: "#0F0F0F" }}>{p}</span></div>)}</div>
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "11px 13px" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#1D4ED8", marginBottom: 4 }}>💡 CONSEIL</div><div style={{ fontSize: 11, color: "#0F0F0F" }}>{info.conseil}</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WALLET MODAL ─────────────────────────────────────────────────────────────
function WalletModal({ user, setUser, onClose }) {
  const [tab, setTab] = useState("gagner");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, maxHeight: "90vh", background: "#fff", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ background: "#0F0F0F", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💰</div>
            <div><div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Mon Portefeuille</div><div style={{ fontSize: 10, color: "#64748B" }}>{user.nom}</div></div>
          </div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 26, fontWeight: 900, color: "#F59E0B" }}>{user.credits}</div><div style={{ fontSize: 9, color: "#64748B" }}>crédits</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 18, marginLeft: 10 }}>×</button>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9" }}>
          {[["gagner", "🎁 Gagner"], ["booster", "⚡ Booster"], ["acheter", "🛒 Acheter"], ["historique", "📋 Historique"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: tab === k ? 700 : 500, color: tab === k ? "#F59E0B" : "#64748B", borderBottom: `2px solid ${tab === k ? "#F59E0B" : "transparent"}` }}>{l}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          {tab === "gagner" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>Soyez actif sur trouvia.ch et gagnez des crédits gratuitement !</div>
              {[["📝 Publier une annonce", "+10 pts"], ["📸 Ajouter une photo", "+5 pts / photo"], ["💬 Répondre à un message", "+3 pts / réponse"], ["🤝 Parrainer un ami", "+50 pts"], ["💡 Proposer une idée", "+10 à 200 pts"], ["🌟 Bonus inscription", "+50 pts (1x)"]].map(([l, p]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", border: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: 12, color: "#0F0F0F" }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>{p}</span>
                </div>
              ))}
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "12px", marginTop: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 4 }}>💡 Utilisateur actif = ~210 pts/mois</div>
                <div style={{ fontSize: 11, color: "#065F46", lineHeight: 1.6 }}>2 annonces + 10 photos + 30 réponses + 1 parrainage = <strong>~210 pts</strong> → 2 boosts Top Listing 3j !</div>
              </div>
            </div>
          )}
          {tab === "booster" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {BOOST_OPTIONS.map(opt => {
                const can = user.credits >= opt.credits;
                return (
                  <div key={opt.id} style={{ background: "#fff", border: `1.5px solid ${opt.hot ? "#FDE68A" : "#F1F5F9"}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, opacity: can ? 1 : 0.6, position: "relative" }}>
                    {opt.hot && <div style={{ position: "absolute", top: -8, right: 12, background: "#F59E0B", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>POPULAIRE</div>}
                    <span style={{ fontSize: 22 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#0F0F0F" }}>{opt.nom}</div><div style={{ fontSize: 10, color: "#94A3B8" }}>{opt.desc}</div></div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#F59E0B" }}>{opt.credits} pts</div>
                      <button onClick={() => { if (!can) return; setUser(u => ({ ...u, credits: u.credits - opt.credits, historique: [{ type: "boost", label: opt.nom, credits: `-${opt.credits}`, date: new Date().toLocaleDateString("fr-CH") }, ...u.historique] })); }}
                        style={{ background: can ? "#0F0F0F" : "#E2E8F0", color: "#fff", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 10, fontWeight: 700, cursor: can ? "pointer" : "not-allowed", fontFamily: "'Outfit',sans-serif", marginTop: 4 }}>
                        {can ? "Activer" : "Insuffisant"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {tab === "acheter" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ c: 100, p: 4.9, l: "Starter", b: 0 }, { c: 300, p: 11.9, l: "Popular", b: 30, hot: true }, { c: 600, p: 19.9, l: "Pro", b: 100 }].map(pack => (
                <div key={pack.l} style={{ background: pack.hot ? "#FFFBEB" : "#fff", border: `2px solid ${pack.hot ? "#FDE68A" : "#F1F5F9"}`, borderRadius: 14, padding: "14px 16px", position: "relative" }}>
                  {pack.hot && <div style={{ position: "absolute", top: -9, right: 14, background: "#F59E0B", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>MEILLEURE OFFRE</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F" }}>{pack.l} — {pack.c} crédits{pack.b > 0 ? <span style={{ color: "#059669" }}> +{pack.b} offerts</span> : ""}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{pack.c + pack.b} crédits au total</div></div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#0F0F0F" }}>CHF {pack.p}</div>
                      <button onClick={() => setUser(u => ({ ...u, credits: u.credits + pack.c + pack.b, historique: [{ type: "achat", label: `Pack ${pack.l}`, credits: `+${pack.c + pack.b}`, date: new Date().toLocaleDateString("fr-CH") }, ...u.historique] }))}
                        style={{ background: "#F59E0B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", marginTop: 5 }}>Acheter</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", fontSize: 10, color: "#94A3B8", lineHeight: 1.6 }}>⚖️ Crédits utilisables uniquement sur trouvia.ch · Non remboursables · Non revendables</div>
            </div>
          )}
          {tab === "historique" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {user.historique.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: 9, padding: "9px 12px", border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>{h.type === "parrainage" ? "🤝" : h.type === "bienvenue" ? "🌟" : h.type === "boost" ? "⚡" : h.type === "achat" ? "🛒" : h.type === "photo" ? "📸" : h.type === "annonce" ? "📝" : "💬"}</span>
                    <div><div style={{ fontSize: 11, fontWeight: 600, color: "#0F0F0F" }}>{h.label}</div><div style={{ fontSize: 9, color: "#94A3B8" }}>{h.date}</div></div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: h.credits.startsWith("+") ? "#059669" : "#EF4444" }}>{h.credits}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SHARE MODAL ──────────────────────────────────────────────────────────────
function ShareModal({ user, onSimulate, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = `https://trouvia.ch?ref=${user.referralCode}`;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ background: "#F59E0B", padding: "20px 22px", textAlign: "center" }}>
          <button onClick={onClose} style={{ position: "absolute", marginLeft: 160, marginTop: -10, background: "rgba(0,0,0,0.1)", border: "none", cursor: "pointer", color: "#fff", fontSize: 14, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🎁</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Partagez & Gagnez</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>+50 crédits pour vous et votre ami à chaque inscription</div>
        </div>
        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>VOS CRÉDITS</div><div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{user.credits}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: "#94A3B8" }}>Par parrainage</div><div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>+50 pts 🎉</div></div>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ flex: 1, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 9, padding: "8px 11px", fontSize: 10, color: "#64748B", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</div>
            <button onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: copied ? "#059669" : "#0F0F0F", color: "#fff", border: "none", borderRadius: 9, padding: "8px 12px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
              {copied ? "✓ Copié" : "📋 Copier"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {[{ l: "WhatsApp", i: "💬", c: "#25D366" }, { l: "SMS", i: "📱", c: "#0284C7" }, { l: "Email", i: "✉️", c: "#F59E0B" }, { l: "Lien", i: "🔗", c: "#8B5CF6" }].map(b => (
              <button key={b.l} style={{ background: "#F8FAFC", border: `1px solid ${b.c}22`, borderRadius: 10, padding: "10px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                <span style={{ fontSize: 16 }}>{b.i}</span><span style={{ fontSize: 11, fontWeight: 600, color: b.c }}>{b.l}</span>
              </button>
            ))}
          </div>
          <button onClick={() => { onSimulate(); onClose(); }} style={{ width: "100%", background: "#059669", color: "#fff", border: "none", borderRadius: 11, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            🎮 Simuler un ami inscrit (+50 pts démo)
          </button>
          <div style={{ fontSize: 9, color: "#CBD5E1", textAlign: "center" }}>Crédits non remboursables · Non revendables · Utilisables uniquement sur trouvia.ch</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [annonces, setAnnonces] = useState(ANNONCES_INIT);
  const [convs, setConvs] = useState(CONVS_INIT);
  const [profiles, setProfiles] = useState([makeProfile(1, 0)]);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const renameRef = useRef(null);
  const [activeCat, setActiveCat] = useState("Tout");
  const [msgAnnonce, setMsgAnnonce] = useState(null);
  const [infoAnnonce, setInfoAnnonce] = useState(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [user, setUser] = useState(USER_INIT);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const showToast = (msg, color = "#059669") => { setToast({ msg, color }); setTimeout(() => setToast(null), 3500); };

  const earnCredits = (type, pts) => {
    setUser(u => ({ ...u, credits: u.credits + pts, historique: [{ type, label: type === "reponse" ? "Réponse à un message" : type, credits: `+${pts}`, date: new Date().toLocaleDateString("fr-CH") }, ...u.historique] }));
    showToast(`+${pts} crédits gagnés ! 🎉`);
  };

  const simulateReferral = () => {
    const names = ["Pierre V.", "Laura C.", "Ahmed B.", "Nathalie R."];
    const name = names[Math.floor(Math.random() * names.length)];
    setUser(u => ({ ...u, credits: u.credits + 50, historique: [{ type: "parrainage", label: `${name} s'est inscrit(e)`, credits: "+50", date: new Date().toLocaleDateString("fr-CH") }, ...u.historique] }));
    showToast(`🎉 +50 crédits ! ${name} vient de s'inscrire !`);
  };

  const active = profiles.find(p => p.id === activeId) || profiles[0];
  const color = PALETTE[active.colorIdx % PALETTE.length];

  const upd = (id, patch) => setProfiles(ps => ps.map(p => p.id === id ? { ...p, ...patch } : p));
  const addProfile = () => { const p = makeProfile(nextId, (nextId - 1) % PALETTE.length); setProfiles(ps => [...ps, p]); setActiveId(nextId); setNextId(n => n + 1); };
  const delProfile = (id, e) => { e.stopPropagation(); if (profiles.length === 1) return; const rest = profiles.filter(p => p.id !== id); setProfiles(rest); if (activeId === id) setActiveId(rest[0].id); };
  const startRename = (p, e) => { e && e.stopPropagation(); setRenamingId(p.id); setRenameVal(p.name); setTimeout(() => renameRef.current?.focus(), 40); };
  const confirmRename = () => { if (renameVal.trim()) upd(renamingId, { name: renameVal.trim() }); setRenamingId(null); };

  const clearSearch = () => {
    const base = annonces.filter(a => (active.canton === "Tous" || a.canton === active.canton) && (activeCat === "Tout" || a.cat === activeCat));
    upd(active.id, { query: "", aiResult: null, aiMsg: "", displayed: base });
  };

  const handleSearch = async () => {
    if (!active.query.trim()) { clearSearch(); return; }
    upd(active.id, { loading: true, aiMsg: "" });
    const filtered = annonces.filter(a => (active.canton === "Tous" || a.canton === active.canton) && (activeCat === "Tout" || a.cat === activeCat));
    try {
      const raw = await callClaude(`Recherche trouvia.ch: "${active.query}". Annonces:\n${JSON.stringify(filtered.map(a => ({ id: a.id, titre: a.titre, desc: a.desc, prix: a.prix, cat: a.cat, lieu: a.lieu })))}\nJSON: {"ids":[...],"message":"phrase courte max 12 mots"}`, 200);
      const parsed = JSON.parse(raw);
      const sorted = parsed.ids.map(id => filtered.find(a => a.id === id)).filter(Boolean);
const tops = sorted.filter(a => a.top);
const normal = sorted.filter(a => !a.top);
      upd(active.id, { displayed: [...tops, ...normal], aiResult: { ids: parsed.ids }, aiMsg: parsed.message || "", loading: false });
    } catch { upd(active.id, { displayed: filtered, aiMsg: "Recherche effectuée.", loading: false }); }
  };

  useEffect(() => {
    const base = annonces.filter(a => (active.canton === "Tous" || a.canton === active.canton) && (activeCat === "Tout" || a.cat === activeCat));
    const tops = base.filter(a => a.top); const normal = base.filter(a => !a.top);
    upd(active.id, { displayed: [...tops, ...normal], aiResult: null, aiMsg: "" });
  }, [activeCat, active.canton]);

  const tops = active.displayed.filter(a => a.top);
  const normal = active.displayed.filter(a => !a.top);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'Outfit', sans-serif", color: "#0F0F0F" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes slideDown { from { transform:translateX(-50%) translateY(-12px); opacity:0; } to { transform:translateX(-50%) translateY(0); opacity:1; } }
        .tab { cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; padding:10px 14px 9px; flex-shrink:0; min-width:90px; }
        .tab:hover .del { opacity:1 !important; }
        .del { opacity:0; transition:opacity 0.15s; background:none; border:none; cursor:pointer; color:#94A3B8; font-size:13px; }
        .btn { transition:all 0.15s; cursor:pointer; }
        .btn:hover { opacity:0.82; transform:translateY(-1px); }
        input:focus, textarea:focus { outline:none; }
      `}</style>

      {/* TOAST */}
      {toast && <div style={{ position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", background: toast.color, color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 9999, animation: "slideDown 0.25s ease", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>{toast.msg}</div>}

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #F1F5F9", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, background: "#0F0F0F", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#F59E0B", fontSize: 15, fontWeight: 900 }}>t</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.04em" }}>trouvia<span style={{ color: "#F59E0B" }}>.ch</span></span>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 440, background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 38 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={active.query} onChange={e => upd(active.id, { query: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Recherche IA en langage naturel…" style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: "#0F0F0F", fontFamily: "'Outfit',sans-serif" }} />
            {active.query && <button onClick={clearSearch} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 15 }}>×</button>}
            <button onClick={handleSearch} disabled={active.loading} className="btn" style={{ background: active.loading ? "#E2E8F0" : "#F59E0B", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
              {active.loading ? "…" : "Chercher"}
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 7, marginLeft: "auto", alignItems: "center" }}>
            <button onClick={() => setShowWallet(true)} className="btn" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "0 12px", height: 34, fontSize: 11.5, fontWeight: 700, color: "#D97706", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
              💰 {user.credits} pts
            </button>
            <button onClick={() => setShowShare(true)} className="btn" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "0 12px", height: 34, fontSize: 11.5, fontWeight: 600, color: "#64748B", fontFamily: "'Outfit',sans-serif" }}>
              🔗 Partager
            </button>
            <button className="btn" style={{ background: "#0F0F0F", border: "none", borderRadius: 8, padding: "0 14px", height: 34, fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>
              + Déposer
            </button>
          </div>
        </div>
      </header>

      {/* ── PROFILE TABS ───────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "stretch", overflowX: "auto" }}>
          {profiles.map(p => {
            const c = PALETTE[p.colorIdx % PALETTE.length]; const isActive = p.id === activeId;
            return (
              <div key={p.id} className="tab" onClick={() => setActiveId(p.id)}
                style={{ background: isActive ? "#FAFAF9" : "transparent", borderBottom: `2.5px solid ${isActive ? c.bg : "transparent"}` }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.bg, flexShrink: 0 }} />
                {renamingId === p.id
                  ? <input ref={renameRef} value={renameVal} onChange={e => setRenameVal(e.target.value)} onBlur={confirmRename} onKeyDown={e => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenamingId(null); }} onClick={e => e.stopPropagation()} style={{ border: "none", outline: "none", background: "transparent", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#0F0F0F", width: 80 }} />
                  : <span onDoubleClick={e => startRename(p, e)} style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "#0F0F0F" : "#94A3B8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>}
                {p.aiResult && <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.bg }} />}
                {profiles.length > 1 && <button className="del" onClick={e => delProfile(p.id, e)}>×</button>}
              </div>
            );
          })}
          {profiles.length < 5 && (
            <button onClick={addProfile} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 11, fontFamily: "'Outfit',sans-serif", padding: "10px 14px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>+</span> Nouveau profil
            </button>
          )}
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────── */}
      <div style={{ background: "#0F0F0F", padding: "32px 20px 28px", textAlign: "center", animation: loaded ? "fadeUp 0.5s ease both" : "none" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 30, padding: "3px 12px", marginBottom: 14 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F59E0B" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B", letterSpacing: "0.08em" }}>MARKETPLACE IA · SUISSE 🇨🇭</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 10 }}>
            Trouvez ce que vous cherchez,<br /><span style={{ color: "#F59E0B" }}>vraiment.</span>
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748B", marginBottom: 0, lineHeight: 1.6 }}>Décrivez en langage naturel · Chaque profil garde ses résultats séparés</p>
        </div>
      </div>

      {/* ── DIAMOND CATEGORIES ─────────────────────────── */}
      <div style={{ background: "#111827", padding: "16px 20px 20px", borderBottom: "1px solid #1E2939" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "#374151", letterSpacing: "0.12em", marginBottom: 12, textAlign: "center" }}>RUBRIQUES</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <Diamond key={cat.label} label={cat.label} icon={cat.icon} active={activeCat === cat.label} color={color.bg} onClick={() => setActiveCat(cat.label)} size={66} />
            ))}
          </div>
        </div>
      </div>

      {/* ── DIAMOND CANTONS ────────────────────────────── */}
      <div style={{ background: "#0F0F0F", padding: "12px 20px 16px", borderBottom: "2px solid #1E2939" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "#374151", letterSpacing: "0.12em", marginBottom: 10, textAlign: "center" }}>CANTONS</div>
          <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
            {CANTONS.map(c => (
              <Diamond key={c} label={c === "Tous" ? "🇨🇭" : c} icon="" active={active.canton === c} color={color.bg} onClick={() => upd(active.id, { canton: c })} size={48} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS ────────────────────────────────────── */}
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Profile pills + AI message */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
          {profiles.map(p => { const c = PALETTE[p.colorIdx % PALETTE.length]; const isActive = p.id === activeId;
            return (
              <button key={p.id} onClick={() => setActiveId(p.id)} style={{ border: `1.5px solid ${isActive ? c.bg : "#E2E8F0"}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: isActive ? 700 : 500, background: isActive ? c.bg : "#fff", color: isActive ? "#fff" : "#64748B", cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.7)" : c.bg, display: "inline-block" }} />
                {p.name}
                {p.aiResult && <span style={{ background: isActive ? "rgba(255,255,255,0.2)" : c.light, color: isActive ? "#fff" : c.bg, borderRadius: 20, padding: "0 5px", fontSize: 9, fontWeight: 700 }}>{p.aiResult.ids.length} IA</span>}
              </button>
            );
          })}
          {active.aiMsg && <span style={{ fontSize: 11, color: color.bg, fontStyle: "italic", marginLeft: 4 }}>🤖 {active.aiMsg}</span>}
          {active.aiResult && <button onClick={clearSearch} style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 20, padding: "4px 10px", fontSize: 10, color: "#94A3B8", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>✕ Effacer</button>}
        </div>

        {/* TOP LISTING */}
        {tops.length > 0 && (
          <section style={{ marginBottom: 28, animation: "fadeUp 0.4s ease 0.05s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ height: 2, flex: 1, background: "linear-gradient(90deg,#F59E0B,transparent)" }} />
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 20, padding: "4px 12px", display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ fontSize: 11 }}>🏆</span><span style={{ fontSize: 10, fontWeight: 800, color: "#D97706" }}>TOP LISTING</span>
              </div>
              <div style={{ height: 2, flex: 1, background: "linear-gradient(90deg,transparent,#F59E0B)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
              {tops.map((a, i) => <Card key={a.id} a={a} highlight={active.aiResult?.ids.includes(a.id)} color={color} onMsg={() => setMsgAnnonce(a)} onInfo={() => setInfoAnnonce(a)} onReport={() => showToast("🚨 Signalement envoyé !", "#EF4444")} />)}
            </div>
          </section>
        )}

        {/* Share banner */}
        <div onClick={() => setShowShare(true)} style={{ background: "#0F0F0F", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: "1px solid #1E2939" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#F59E0B44"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1E2939"}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>🎁</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Partagez trouvia.ch · +50 crédits par ami inscrit</div><div style={{ fontSize: 10, color: "#64748B" }}>Utilisables pour booster vos annonces · Un utilisateur actif gagne ~210 pts/mois gratuitement</div></div>
          </div>
          <div style={{ background: "#F59E0B", borderRadius: 7, padding: "6px 12px", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Partager →</div>
        </div>

        {/* Results header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F" }}>
            {active.aiResult ? <><span style={{ color: color.bg }}>{active.aiResult.ids.length}</span> résultats IA</> : <>{normal.length} annonce{normal.length > 1 ? "s" : ""}</>}
            {activeCat !== "Tout" && <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}> · {activeCat}</span>}
            {active.canton !== "Tous" && <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}> · {active.canton}</span>}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {normal.map((a, i) => <Card key={a.id} a={a} highlight={active.aiResult?.ids.includes(a.id)} color={color} onMsg={() => setMsgAnnonce(a)} onInfo={() => setInfoAnnonce(a)} onReport={() => showToast("🚨 Signalement envoyé !", "#EF4444")} />)}
        </div>

        {active.displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F0F0F", marginBottom: 5 }}>Aucune annonce trouvée</div>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>Essayez d'autres mots-clés ou explorez toutes les catégories</div>
          </div>
        )}
      </main>

      <footer style={{ background: "#0F0F0F", padding: "16px 20px", textAlign: "center", color: "#374151", fontSize: 10 }}>
        trouvia.ch · Marketplace IA Suisse 🇨🇭 · Crédits non remboursables · Non revendables
      </footer>

      {/* MODALS */}
      {msgAnnonce && <MsgPanel annonce={msgAnnonce} convs={convs} setConvs={setConvs} annonces={annonces} setAnnonces={setAnnonces} onClose={() => setMsgAnnonce(null)} onEarn={earnCredits} />}
      {infoAnnonce && <InfoModal annonce={infoAnnonce} onClose={() => setInfoAnnonce(null)} />}
      {showWallet && <WalletModal user={user} setUser={setUser} onClose={() => setShowWallet(false)} />}
      {showShare && <ShareModal user={user} onSimulate={simulateReferral} onClose={() => setShowShare(false)} />}
    </div>
  );
}
