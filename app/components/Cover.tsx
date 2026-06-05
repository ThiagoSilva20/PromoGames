// Generates a deterministic editorial-style cover from the game title.
// Each title hashes to a fixed palette + composition, so the same game always renders the same.

const PALETTES = [
  { bg: "#1a1410", fg: "#ff6b35", accent: "#f5f4ec" },
  { bg: "#0f1a14", fg: "#c6ff00", accent: "#f5f4ec" },
  { bg: "#191028", fg: "#ff2e6c", accent: "#f5f4ec" },
  { bg: "#0c1620", fg: "#5eead4", accent: "#f5f4ec" },
  { bg: "#1f0f0f", fg: "#fbbf24", accent: "#f5f4ec" },
  { bg: "#0a1228", fg: "#a78bfa", accent: "#f5f4ec" },
  { bg: "#100a0a", fg: "#fb7185", accent: "#f5f4ec" },
  { bg: "#0a1410", fg: "#86efac", accent: "#f5f4ec" },
];

const COMPOSITIONS = ["band", "stack", "diag", "frame"] as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function Cover({ title, className = "" }: { title: string; className?: string }) {
  const h = hash(title);
  const pal = PALETTES[h % PALETTES.length];
  const comp = COMPOSITIONS[(h >> 4) % COMPOSITIONS.length];
  const words = title.toUpperCase().split(" ");
  const w1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const w2 = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={title}
    >
      <rect width="300" height="400" fill={pal.bg} />

      {comp === "band" && (
        <>
          <rect x="0" y="220" width="300" height="50" fill={pal.fg} />
          <text x="20" y="80" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="44" fill={pal.fg} letterSpacing="-2">
            {w1}
          </text>
          <text x="20" y="255" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="32" fill={pal.bg}>
            {w2 || w1}
          </text>
          <text x="20" y="370" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={pal.accent} opacity="0.6">
            EDITION · 2026
          </text>
        </>
      )}

      {comp === "stack" && (
        <>
          <text x="20" y="140" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="56" fill={pal.fg} letterSpacing="-3">
            {w1}
          </text>
          <text x="20" y="210" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="56" fill={pal.accent} letterSpacing="-3">
            {w2 || ""}
          </text>
          <line x1="20" y1="260" x2="280" y2="260" stroke={pal.fg} strokeWidth="1" opacity="0.4" />
          <text x="20" y="285" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={pal.accent} opacity="0.6">
            CHAPTER · 01
          </text>
        </>
      )}

      {comp === "diag" && (
        <>
          <polygon points="0,0 300,0 300,260 0,140" fill={pal.fg} opacity="0.18" />
          <text x="20" y="200" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="48" fill={pal.fg} letterSpacing="-2">
            {w1}
          </text>
          <text x="20" y="240" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="48" fill={pal.accent} letterSpacing="-2">
            {w2 || ""}
          </text>
          <text x="20" y="370" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={pal.accent} opacity="0.5">
            ▲ {(h % 9999).toString().padStart(4, "0")}
          </text>
        </>
      )}

      {comp === "frame" && (
        <>
          <rect x="14" y="14" width="272" height="372" fill="none" stroke={pal.fg} strokeWidth="2" />
          <text x="150" y="190" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="40" fill={pal.fg} letterSpacing="-2">
            {w1}
          </text>
          <text x="150" y="232" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="40" fill={pal.accent} letterSpacing="-2">
            {w2 || ""}
          </text>
          <text x="150" y="370" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="4" fill={pal.accent} opacity="0.5">
            COLLECTOR'S CUT
          </text>
        </>
      )}
    </svg>
  );
}
