/**
 * SKILL.md frontmatter: ensure metadata.last_verified: "YYYY-MM-DD".
 * Strips root-level last_verified into metadata. Keeps other metadata keys.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_DATE = "2026-03-31";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.name === "scripts" && e.isDirectory()) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
}

/** Closing delimiter must be a line that is exactly --- (not markdown HR in body). */
function splitFrontmatter(raw) {
  const noBom = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  if (!noBom.startsWith("---")) return null;
  const lines = noBom.split(/\r?\n/);
  if (lines[0].trim() !== "---") return null;
  let i = 1;
  const yamlLines = [];
  while (i < lines.length) {
    if (lines[i].trim() === "---") break;
    yamlLines.push(lines[i]);
    i++;
  }
  if (i >= lines.length) return null;
  const yaml = yamlLines.join("\n");
  const body = lines.slice(i + 1).join("\n");
  return { yaml, body };
}

function parseDate(val) {
  if (val == null) return DEFAULT_DATE;
  let s = String(val).trim().replace(/^["']|["']$/g, "");
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : DEFAULT_DATE;
}

/** Parse top-level keys and metadata subkeys (single level only). */
function parseYamlSimple(yaml) {
  const lines = yaml.split(/\r?\n/);
  const top = {};
  const meta = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (t === "" || t.startsWith("#")) {
      i++;
      continue;
    }
    const indent = line.length - line.trimStart().length;
    if (indent === 0 && t.startsWith("metadata:")) {
      i++;
      while (i < lines.length) {
        const L = lines[i];
        const ind = L.length - L.trimStart().length;
        if (ind < 2) break;
        const mt = L.trim();
        const mm = mt.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
        if (mm) meta[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, "") || "";
        i++;
      }
      continue;
    }
    if (indent === 0) {
      const m = t.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (m) {
        const key = m[1];
        let val = m[2];
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        top[key] = val;
      }
      i++;
      continue;
    }
    i++;
  }
  return { top, meta };
}

/** YAML plain scalar for kebab-case skill names (no quotes). */
function formatName(name) {
  const n = String(name);
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(n)) return `name: ${n}`;
  return `name: ${JSON.stringify(n)}`;
}

/** Double-quoted YAML string; avoids JSON.stringify so inner " stays readable. */
function formatDescription(desc) {
  const s = String(desc);
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `description: "${escaped}"`;
}

function rebuild(top, meta) {
  const out = [];
  if (top.name != null) out.push(formatName(top.name));
  if (top.description != null) out.push(formatDescription(top.description));
  for (const k of Object.keys(top)) {
    if (k === "name" || k === "description" || k === "last_verified") continue;
    out.push(`${k}: ${JSON.stringify(top[k])}`);
  }
  const m = { ...meta };
  const lv = parseDate(m.last_verified ?? top.last_verified);
  m.last_verified = lv;
  out.push("metadata:");
  out.push(`  last_verified: "${m.last_verified}"`);
  for (const k of Object.keys(m)) {
    if (k === "last_verified") continue;
    out.push(`  ${k}: ${JSON.stringify(m[k])}`);
  }
  return out.join("\n");
}

function normalizeFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const sp = splitFrontmatter(raw);
  if (!sp) return false;
  const { top, meta } = parseYamlSimple(sp.yaml);
  if (!top.name) return false;
  const newYaml = rebuild(
    { ...top },
    { ...meta }
  );
  if (newYaml === sp.yaml.trim()) return false;
  const newRaw = `---\n${newYaml}\n---\n${sp.body}`;
  fs.writeFileSync(file, newRaw, "utf8");
  return true;
}

const files = walk(ROOT);
let changed = 0;
for (const f of files) {
  try {
    if (normalizeFile(f)) {
      changed++;
      console.log(path.relative(ROOT, f));
    }
  } catch (e) {
    console.error("FAIL", f, e.message);
  }
}
console.log("changed", changed, "/", files.length);
