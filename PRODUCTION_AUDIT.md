# PRODUCTION CYBERSECURITY AUDIT

**Scope**: Web application, API, infrastructure, data, and operations
**Standard Level**: Enterprise / Zero-Trust / OWASP ASVS L2–L3
**Passing Rule**: 100% compliance required

---

## 1. GOVERNANCE & SECURITY BASELINE
*If any item fails → STOP*

### 1.1 Security Ownership
- [ ] Named security owner
- [ ] Incident response plan documented
- [ ] Vulnerability disclosure process exists
- [ ] Change management process enforced

❌ **FAIL CONDITION**: No documented ownership or incident response plan

---

## 2. AUTHENTICATION & IDENTITY (CRITICAL)
**Target Standard**: OWASP ASVS 2.x, NIST 800-63

### 2.1 Authentication
- [ ] Passwords hashed with Argon2 or bcrypt (cost ≥12)
- [ ] Password length ≥ 12 characters
- [ ] No password reuse allowed
- [ ] Account lockout after ≤5 failed attempts
- [ ] Login rate-limited (IP + account)

❌ **FAIL if any**:
- SHA-1 / MD5 / plain hashes exist
- No rate limiting

### 2.2 Session Management
- [ ] HTTPOnly cookies
- [ ] Secure flag enabled
- [ ] SameSite=Strict or Lax
- [ ] Session rotation on login
- [ ] Session invalidated on logout

❌ **FAIL if JWT stored in localStorage**

### 2.3 Multi-Factor Authentication
- [ ] MFA enforced for admins
- [ ] MFA supported for users
- [ ] Backup codes exist

❌ **FAIL if admin login is single-factor**

---

## 3. AUTHORIZATION & ACCESS CONTROL
**Target**: OWASP ASVS 4.x

- [ ] Role-Based Access Control enforced server-side
- [ ] No frontend-only authorization
- [ ] Object-level permission checks (IDOR protection)
- [ ] Admin routes inaccessible to normal users
- [ ] API denies by default

❌ **FAIL if**:
- User can access another user’s order by ID
- Permissions enforced only in React

---

## 4. API SECURITY (DJANGO BACKEND)
**Target**: OWASP API Top 10

### 4.1 API Hardening
- [ ] CSRF protection enabled
- [ ] CORS restricted (no *)
- [ ] Strict HTTP methods enforced
- [ ] API versioning enabled

❌ **FAIL if**:
- `Access-Control-Allow-Origin: *`
- Unsafe methods enabled

### 4.2 Rate Limiting
- [ ] Per-IP limits
- [ ] Per-user limits
- [ ] Burst protection
- [ ] Throttling enforced at reverse proxy

❌ **FAIL if brute force is possible**

### 4.3 Input Validation
- [ ] Server-side validation only trusted
- [ ] No mass assignment vulnerabilities
- [ ] Strong serializers
- [ ] All inputs sanitized

❌ **FAIL if unvalidated JSON reaches database**

---

## 5. DATA PROTECTION & PRIVACY
**Target**: GDPR-level discipline

### 5.1 Data at Rest
- [ ] Database encrypted
- [ ] Backups encrypted
- [ ] Secrets NOT stored in code
- [ ] Environment variables secured

❌ **FAIL if .env exposed or committed**

### 5.2 Data in Transit
- [ ] HTTPS enforced everywhere
- [ ] TLS 1.2+ only
- [ ] HSTS enabled
- [ ] No mixed content

❌ **FAIL if HTTP accessible**

---

## 6. FRONTEND SECURITY (REACT)
**Target**: OWASP Frontend Security Cheat Sheet

- [ ] No secrets in frontend
- [ ] No API keys exposed
- [ ] CSP headers enabled
- [ ] XSS protection enforced
- [ ] No inline scripts

❌ **FAIL if**:
- JWT stored in localStorage
- `dangerouslySetInnerHTML` used unsafely

---

## 7. HEADERS & BROWSER HARDENING
**MANDATORY HEADERS**

- [ ] Content-Security-Policy (strict)
- [ ] X-Frame-Options = DENY
- [ ] X-Content-Type-Options = nosniff
- [ ] Referrer-Policy = strict-origin
- [ ] Permissions-Policy locked down

❌ **FAIL if any header missing**

---

## 8. FILE UPLOAD & STORAGE SECURITY

- [ ] MIME type validated server-side
- [ ] File extension whitelisted
- [ ] Files renamed on upload
- [ ] Stored outside web root
- [ ] Virus scanning enabled

❌ **FAIL if user can upload executable files**

---

## 9. LOGGING, MONITORING & ALERTING
**Target**: SOC-ready visibility

- [ ] Authentication attempts logged
- [ ] Admin actions logged
- [ ] Logs immutable
- [ ] Alerts on anomalies
- [ ] No sensitive data in logs

❌ **FAIL if breaches cannot be traced**

---

## 10. INFRASTRUCTURE & DEPLOYMENT
**Target**: Zero-Trust Cloud Model

- [ ] Firewall rules minimal
- [ ] SSH locked to key-only
- [ ] Root login disabled
- [ ] Containers run as non-root
- [ ] Secrets manager used

❌ **FAIL if**:
- Database publicly accessible
- SSH open to world

---

## 11. DEPENDENCY & SUPPLY-CHAIN SECURITY

- [ ] Dependencies scanned
- [ ] No critical CVEs
- [ ] Lockfiles enforced
- [ ] Auto-updates monitored

❌ **FAIL if known vulnerabilities exist**

---

## 12. PENETRATION TEST CHECKLIST
**Must withstand**:

- [ ] SQL Injection
- [ ] XSS (stored, reflected, DOM)
- [ ] CSRF
- [ ] IDOR
- [ ] SSRF
- [ ] RCE
- [ ] Brute force
- [ ] Business logic abuse

❌ **FAIL if any exploit succeeds**

---

## 13. BUSINESS LOGIC SECURITY (HIGH RISK)

- [ ] Order manipulation prevented
- [ ] Price tampering blocked
- [ ] Payment verified server-side
- [ ] Replay attacks prevented

❌ **FAIL if client can modify price or quantity**

---

## 14. BACKUP, RECOVERY & INCIDENT RESPONSE

- [ ] Automated backups
- [ ] Restore tested
- [ ] Breach response rehearsed
- [ ] Downtime procedures defined

❌ **FAIL if recovery untested**

---

# ✅ FINAL VERDICT RULE
Your website is **PRODUCTION-READY ONLY IF**:
- ✔ ALL sections pass
- ✔ ZERO critical findings
- ✔ ZERO high-risk findings
- ✔ Pen-testing shows no exploit path

**Anything less = NOT robust, NOT safe, NOT deployable**
