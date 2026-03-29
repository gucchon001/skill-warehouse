---
name: vibesec
description: "Helps write secure web applications. Use when working on any web application or when a user requests a scan or audit to ensure security best practices are followed."
metadata:
  last_verified: "2026-03-17"
---

# Secure Coding Guide for Web Applications

## Overview

Approach code from a **bug hunter's perspective** and make applications **as secure as possible** without breaking functionality.

**Key Principles:**
- Defense in depth: Never rely on a single security control
- Fail securely: When something fails, fail closed (deny access)
- Least privilege: Grant minimum permissions necessary
- Input validation: Never trust user input, validate everything server-side
- Output encoding: Encode data appropriately for the context it's rendered in

---

## Access Control

- Each user must only access/modify their own data. Verify ownership at the data layer.
- Prefer **UUIDs** instead of sequential IDs for resources.
- On user/org removal: revoke tokens and sessions immediately.
- **Checklist:** Verify user owns resource on every request; check org membership for multi-tenant; validate role permissions; re-validate after privilege change.
- **Avoid:** IDOR, privilege escalation, mass assignment. Return 404 (not 403) when unauthorized to prevent enumeration.

---

## Client-Side: XSS

- Sanitize every user-controllable input (forms, search, URL params, headers, third-party API data, WebSocket, postMessage, storage).
- **Output encoding** by context: HTML entity encode in HTML; JS escape in JS; URL encode in URL; use framework escaping (React JSX, etc.).
- Use **Content-Security-Policy**; avoid `'unsafe-inline'` / `'unsafe-eval'` for scripts.
- Use DOMPurify or whitelist for rich text. Set `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP frame-ancestors).

---

## Client-Side: CSRF

- Protect every state-changing endpoint (POST, PUT, PATCH, DELETE; also login, signup, password reset, OAuth callback).
- **CSRF tokens:** Cryptographically random, tied to session, validated on every state-changing request, regenerate after login.
- **SameSite cookies:** `SameSite=Strict` or `Lax`; `Secure`; `HttpOnly` for session.
- Always require token; missing token = rejected. Don't put token in URLs.

---

## Secrets & Sensitive Data

- Never expose in client: API keys, DB strings, JWT secrets, OAuth client secrets, full PII, stack traces.
- Check: JS bundles/source maps, HTML comments, hidden fields, data attributes, storage, SSR hydration, `NEXT_PUBLIC_*` / `REACT_APP_*`.
- Store secrets in env; call secret-using APIs from backend only.

---

## Open Redirect

- Validate redirect URLs: allowlist domains, or accept only relative paths (e.g. `/dashboard`), or use indirect refs (`?redirect=dashboard` → lookup).
- Block: `@` tricks, subdomain abuse, `javascript:`, double encoding, backslash, null byte, IDN homograph. Use Punycode for validation.

---

## Password & Auth

- Min 8 chars (12+ recommended), no max or very high; allow all characters. Store with Argon2id, bcrypt, or scrypt (never MD5/SHA1/plain SHA256).

---

## Server-Side: SSRF

- Any server-fetches-URL-from-user feature (webhooks, previews, import from URL) must be protected.
- Prefer **allowlist** of domains. Resolve DNS, validate IP is not private/metadata; block cloud metadata IPs (e.g. 169.254.169.254). Limit redirects and response size.

---

## Server-Side: File Upload

- Validate: extension allowlist + **magic bytes**; validate content (e.g. process images with image lib); size limits server-side.
- Prevent: extension bypass, null byte, double extension, MIME spoofing, polyglot files, SVG with JS, XXE in DOCX/XLSX, ZIP slip. Store with random UUID names; serve with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`.

---

## SQL Injection

- **Parameterized queries / prepared statements** only; never concatenate user input. Use ORM parameterization; be careful with raw queries.
- Whitelist for ORDER BY, LIMIT/OFFSET, table/column names, IN lists, LIKE patterns (escape `%`, `_`). Least privilege for DB user; don't expose SQL errors to users.

---

## Path Traversal

- Never use user input directly in file paths. Use indirect refs (e.g. id → path mapping). Canonicalize path and ensure result is under base directory (e.g. `os.path.commonpath([base, target]) == base`). Reject `..`, absolute paths.

---

## Security Headers

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy` (see XSS section)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store` for sensitive pages

---

## JWT

- Verify algorithm server-side; reject `alg: none`; use 256+ bit secret; set and validate `exp`; store in httpOnly, Secure, SameSite cookie (not localStorage). Prefer short-lived access + refresh token rotation.

---

## API

- **Mass assignment:** Whitelist updatable fields; never `User.update(req.body)`.
- **GraphQL:** Disable introspection in production; depth limit; query cost limit; limit operations per request.

---

## General

When generating code: validate all input server-side; use parameterized queries; encode output contextually; apply authz on every endpoint; verify resource access; use secure defaults; don't leak stack traces; keep dependencies updated. When unsure, choose the more restrictive option and document in comments.

---
*Source: [awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills) → [VibeSec-Skill](https://github.com/BehiSecc/VibeSec-Skill). Condensed for Cursor; see repo for full checklists and examples.*

## Troubleshooting

### エラー: 手順に沿っても再現しない

**原因**: 環境・バージョン・データ依存。

**対処**: 再現手順・期待値・実際のログを 1 セットにしてから、本文の次ステップへ進む。

### エラー: テストや検証が不安定

**原因**: テスト間の共有状態、非決定的な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。

