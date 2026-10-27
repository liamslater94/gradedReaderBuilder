// Rule-based Saigon pronunciation tips. Given a Vietnamese word, returns the
// Southern sound changes that apply to it (compared with Hà Nội speech).

const TONE_MARKS = /[̣̀́̃̉]/g;
const INITIALS = ["ngh", "ng", "nh", "ch", "gh", "gi", "kh", "ph", "qu", "th", "tr", "b", "c", "d", "đ", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "x"];

export function stripTone(s) {
  return s.normalize("NFD").replace(TONE_MARKS, "").normalize("NFC");
}

function hasNga(s) {
  return /̃/.test(s.normalize("NFD"));
}

export function parseSyllable(syl) {
  const base = stripTone(syl.toLowerCase());
  let initial = "";
  for (const i of INITIALS) {
    if (base.startsWith(i) && base.length > i.length) { initial = i; break; }
  }
  // “gi” before a consonant-final rime with no other vowel (gìn, gì) is g + i.
  if (initial === "gi" && !/[aăâeêioôơuưy]/.test(base.slice(2))) initial = "g";
  const rime = base.slice(initial.length);
  return { base, initial, rime, nga: hasNga(syl) };
}

// Each rule: id, test(parsed) → bool, label, tip, example [north, saigon-ish].
export const RULES = [
  { id: "v", test: (p) => p.initial === "v", label: "v → y", tip: "Initial v sounds like English “y” (Hà Nội: v).", example: ["vui", "“yui”"] },
  { id: "d", test: (p) => p.initial === "d", label: "d → y", tip: "Initial d sounds like English “y” (Hà Nội: z).", example: ["dạ", "“yạ”"] },
  { id: "gi", test: (p) => p.initial === "gi" || (p.initial === "g" && p.rime.startsWith("i")), label: "gi → y", tip: "Initial gi sounds like English “y” (Hà Nội: z).", example: ["gì", "“yì”"] },
  { id: "r", test: (p) => p.initial === "r", label: "r → r", tip: "Initial r is a real “r” (often close to English r; casually even “g”). Hà Nội says z.", example: ["rồi", "“rồi” not “zồi”"] },
  { id: "qu", test: (p) => p.initial === "qu", label: "qu → w", tip: "qu sounds like “w”.", example: ["quẹo", "“wẹo”"] },
  { id: "hw", test: (p) => p.initial === "h" && /^(oa|oă|oe|uy|uê|uâ)/.test(p.rime), label: "hoa → wa", tip: "h before o/u + vowel drops to a “w” sound.", example: ["hoa", "“wa”"] },
  { id: "tr", test: (p) => p.initial === "tr", label: "tr ≠ ch", tip: "Saigon keeps tr distinct: tongue curled back, like “tr” in “tree”.", example: ["trà", "“trà” (not “chà”)"] },
  { id: "s", test: (p) => p.initial === "s", label: "s = sh", tip: "Saigon s is often “sh”, distinct from x.", example: ["sáng", "“sháng”"] },
  { id: "anh", test: (p) => /anh$/.test(p.rime), label: "-anh → -ăn", tip: "Final -anh sounds like “ăn”.", example: ["nhanh", "“nhăn”"] },
  { id: "ach", test: (p) => /ach$/.test(p.rime), label: "-ach → -ăt", tip: "Final -ach sounds like “ăt”.", example: ["sách", "“sắt”"] },
  { id: "inh", test: (p) => /inh$/.test(p.rime) && !/uynh$/.test(p.rime), label: "-inh → -ưn", tip: "Final -inh sounds like “ưn”.", example: ["bình", "“bừn”"] },
  { id: "ich", test: (p) => /ich$/.test(p.rime), label: "-ich → -ưt", tip: "Final -ich sounds like “ưt”.", example: ["thích", "“thứt”"] },
  { id: "enh", test: (p) => /ênh$|êch$/.test(p.rime), label: "-ênh → -ơn", tip: "Final -ênh/-êch sound like “ơn”/“ơt”.", example: ["bệnh", "“bợn”"] },
  { id: "in", test: (p) => /^(in|it|uyn|uyt)$/.test(p.rime), label: "-in → -ưn", tip: "Final -in/-it sound like “ưn”/“ưt”.", example: ["xin", "“xưn”"] },
  { id: "en", test: (p) => /^ên$|^êt$/.test(p.rime), label: "-ên → -ơn", tip: "Final -ên/-êt sound like “ơn”/“ơt”.", example: ["lên", "“lơn”"] },
  { id: "ie", test: (p) => /(iê|yê)(n|ng|m|p|t|c)$/.test(p.rime), label: "iê → i", tip: "The diphthong iê often flattens toward “i” before a final consonant.", example: ["tiền", "“tìn(g)”"] },
  { id: "uo", test: (p) => /ươ(n|ng|c|t|m|p)$/.test(p.rime), label: "ươ → ư", tip: "ươ often flattens toward “ư” before a final consonant.", example: ["đường", "“đừng”"] },
  { id: "uoo", test: (p) => /uô(n|ng|c|t|m|p)$/.test(p.rime), label: "uô → u", tip: "uô often flattens toward “u” before a final consonant.", example: ["muốn", "“múng”"] },
  { id: "ong", test: (p) => /(o|ô)(ng|c)$/.test(p.rime) && !/(uô|oo)/.test(p.rime), label: "-ong/-oc: lips close", tip: "After o/ô, final -ng/-c end with closed lips (≈ -m/-p).", example: ["không", "“khôm”"] },
  { id: "n", test: (p) => /[aăâoôơuưe]n$/.test(p.rime) && !/(iê|yê|ươ|uô)n$/.test(p.rime), label: "-n → -ng", tip: "Final -n merges with -ng.", example: ["bạn", "“bạng”"] },
  { id: "t", test: (p) => /[aăâoôơuưe]t$/.test(p.rime) && !/(iê|yê|ươ|uô)t$/.test(p.rime), label: "-t → -c", tip: "Final -t merges with -c (a “k” sound).", example: ["mặt", "“mặc”"] },
  { id: "nga", test: (p) => p.nga, label: "ngã → hỏi", tip: "The ngã tone (~) is pronounced like hỏi (?): a low dip, no glottal break.", example: ["mãng cầu", "“mảng cầu”"] },
];

const SYLLABLE = /[\p{L}]+/gu;

export function southernTips(word) {
  const seen = new Set();
  const tips = [];
  for (const m of String(word).matchAll(SYLLABLE)) {
    const p = parseSyllable(m[0]);
    for (const rule of RULES) {
      if (!seen.has(rule.id) && rule.test(p)) {
        seen.add(rule.id);
        tips.push({ ...rule, syllable: m[0] });
      }
    }
  }
  return tips;
}
