# Security Hardening Plan

Branch: `feature/security-hardening` | Skill: `semgrep`

## Overall Assessment

The codebase has strong security fundamentals: no XSS vulnerabilities, excellent MongoDB injection prevention (all queries via Payload typed API), comprehensive CSP headers, and proper access control. Focus areas are input validation and rate limiting.

## High Priority (Implement Soon)

### 1. Add URL validation to Artist fields
- **File**: `src/collections/Artists/index.ts` (lines 77-84, 103-106)
- **Fields**: `website`, `socialLinks[].url`
- **Change**: Add `validate` function to enforce valid URL format
- **Risk**: Medium - user-provided URLs rendered in frontend without validation
- **Example**:
  ```ts
  validate: (value) => !value || /^https?:\/\/.+/.test(value) || 'Must be a valid URL'
  ```

### 2. Enforce PREVIEW_SECRET as required
- **File**: `src/payload.config.ts` or startup validation
- **Change**: Fail deployment if `PREVIEW_SECRET` env var is not set
- **Risk**: Medium - without it, preview secret check passes trivially

### 3. Add rate limiting to form submissions
- **File**: `src/blocks/Form/Component.tsx` or create server-side form handler
- **Change**: Apply similar rate limiting as newsletter endpoint (5 req/IP/15min)
- **Risk**: Medium - form submissions currently have no IP-based rate limits

## Medium Priority (Next Sprint)

### 4. Tighten email validation
- **File**: `src/app/(frontend)/api/newsletter/route.ts`
- **Change**: Replace basic `email.includes('@')` check with proper RFC 5322 regex
- **Risk**: Low - current regex allows trivially invalid emails like `a@b`

### 5. Add maxLength constraints to text fields
- **Files**: `src/collections/Happenings/index.ts`, `src/collections/Artists/index.ts`
- **Change**: Add `maxLength` to `title` (255), `bio` (5000), text fields
- **Risk**: Low - prevents potential DoS via extremely long strings

### 6. Set maximum file size on Media uploads
- **File**: `src/collections/Media.ts`
- **Change**: Add `upload.maxFileSize` (e.g., 50MB) to collection config
- **Risk**: Low - good practice to prevent abuse

### 7. Verify SVG upload handling
- **File**: `src/collections/Media.ts`
- **Change**: Check if SVG uploads are allowed; if so, ensure sanitization (SVGs can contain XSS)
- **Risk**: Medium - SVG files can carry embedded scripts

## Low Priority (Nice to Have)

### 8. Replace Math.random() with crypto UUID
- **File**: `src/utilities/generateCalendarEvent.ts:54`
- **Change**: Use `crypto.randomUUID()` instead of `Math.random().toString(36)`
- **Risk**: Low - ICS UIDs don't need cryptographic randomness, but better uniqueness

### 9. Log user ID instead of email in revalidation
- **File**: `src/app/(frontend)/api/revalidate/route.ts:37`
- **Change**: Log user ID rather than email for privacy
- **Risk**: Low - server logs only, not client-facing

### 10. Add CSP nonce for inline scripts
- **File**: `src/middleware.ts`
- **Change**: Generate nonce per request for stricter CSP (replace `'unsafe-inline'` for scripts)
- **Risk**: Low - `unsafe-inline` is standard for Next.js, but nonce is better

### 11. Remove deprecated fields from Happenings
- **File**: `src/collections/Happenings/index.ts` (lines 106-131)
- **Fields**: `category`, `featuredPerson`, `featuredPersonName` (all marked deprecated)
- **Change**: Remove deprecated fields after confirming no data depends on them
- **Risk**: Low - cleanup reduces attack surface

## Running a Full Semgrep Scan

To run a comprehensive security scan with the semgrep skill:
1. Ensure Semgrep is installed: `semgrep --version`
2. Run scan targeting JS/TS: `semgrep --config p/javascript --config p/react --config p/nodejs --metrics=off src/`
3. For secrets: `semgrep --config p/secrets --metrics=off .`

## Validation

After implementing changes:
1. Run `pnpm test:pre-deploy` to verify nothing breaks
2. Run `pnpm build` to verify TypeScript compilation
3. Test form submissions with edge cases (long strings, special characters)
4. Test newsletter signup with invalid emails to verify new validation
5. Verify file uploads still work with size limits
