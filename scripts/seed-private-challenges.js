/**
 * Seed Private Challenges for SecLab Nigeria CTF
 * Run: node scripts/seed-private-challenges.js
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars
 * (Get these from Supabase project settings → API)
 *
 * 20 premium challenges across Web, Crypto, Network, Forensics, Binary
 * Difficulty: Mix of Hard and Insane (premium content)
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ossgeecuxijcziazzvfl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set. Get it from Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Service role client bypasses RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

function hashFlag(flag) {
  return crypto.createHash('sha256').update(flag.trim()).digest('hex');
}

const PRIVATE_CHALLENGES = [
  // ── WEB (Hard) ───────────────────────────────────────────
  {
    title: 'JWT Algorithm Confusion',
    description: 'A fintech API uses RS256 for token signing but the frontend expects HS256. Forge a valid token to access /admin/api/vault.',
    category: 'Web',
    difficulty: 'Hard',
    points: 450,
    tags: JSON.stringify(['jwt', 'crypto', 'auth-bypass']),
    hint: 'The public key from the JWKS endpoint uses RS256, but the server accepts HS256 tokens signed with the modulus as the secret.',
    flag: 'seclab{JWT_alg_confusion_is_nasty}',
    is_private: true,
    active: true,
  },
  {
    title: 'Blind SSRF via SVG Parser',
    description: 'The file upload endpoint processes SVG files server-side. Exfiltrate AWS metadata at 169.254.169.254/latest/meta-data/iam/security-credentials/.',
    category: 'Web',
    difficulty: 'Hard',
    points: 500,
    tags: JSON.stringify(['ssrf', 'svg', 'aws', 'cloud']),
    hint: 'SVG can contain external entity references. Use an out-of-band HTTP request to confirm the blind SSRF.',
    flag: 'seclab{svg_ssr_f metadata_exf iltr8}',
    is_private: true,
    active: true,
  },
  {
    title: 'Race Condition in Login',
    description: 'The OTP verification has a 30-second window but allows multiple concurrent verifications. Race 10 requests to drain the OTP pool.',
    category: 'Web',
    difficulty: 'Hard',
    points: 400,
    tags: JSON.stringify(['race-condition', 'otp', 'concurrent']),
    hint: 'Use Burp Suite Intruder with 10 concurrent threads, same OTP, rapid fire.',
    flag: 'seclab{race_cond_otp_dra1n}',
    is_private: true,
    active: true,
  },
  {
    title: 'GraphQL Introspection Abuse',
    description: 'The /graphql endpoint has introspection disabled publicly but enabled in the schema. Query the hidden schema to find a mutation that discloses internal configuration.',
    category: 'Web',
    difficulty: 'Hard',
    points: 380,
    tags: JSON.stringify(['graphql', 'introspection', 'infoleak']),
    hint: 'POST to /graphql with { "query": "{ __schema { types { name fields { name type { name } } } } }" }',
    flag: 'seclab{graphql_introspection_hidden_but_leaked}',
    is_private: true,
    active: true,
  },
  {
    title: 'WebSocket Authentication Bypass',
    description: 'The live-chat service uses a signed token in the query string for WS connection. Capture and replay with an elevated role claim.',
    category: 'Web',
    difficulty: 'Hard',
    points: 420,
    tags: JSON.stringify(['websocket', 'auth-bypass', 'replay']),
    hint: 'JWT is passed as ?token= query param. Modify the role claim from "user" to "admin".',
    flag: 'seclab{websocket_token_replay_admin}',
    is_private: true,
    active: true,
  },

  // ── CRYPTO (Hard/Insane) ───────────────────────────────
  {
    title: 'AES-ECB Oracle Padding',
    description: 'A custom encryption service uses AES-128-ECB. You have access to an oracle that tells you whether your ciphertext decrypts to valid JSON. Construct a ciphertext that decrypts to {"admin": true}.',
    category: 'Crypto',
    difficulty: 'Hard',
    points: 550,
    tags: JSON.stringify(['aes', 'ecb', 'padding-oracle', 'crypto']),
    hint: 'ECB block duplication lets you rearrange ciphertext blocks. Target the second block to become {"admin":.',
    flag: 'seclab{AES_ECB_block_swap_admin_true}',
    is_private: true,
    active: true,
  },
  {
    title: 'ECDSA Nonce Reuse',
    description: 'A blockchain signing service reuses the same k value for two different ECDSA signatures. Recover the private key from the two signatures.',
    category: 'Crypto',
    difficulty: 'Hard',
    points: 600,
    tags: JSON.stringify(['ecdsa', 'nonce-reuse', 'blockchain', 'crypto']),
    hint: 'When k is reused in ECDSA, k = (s1-s2)/(r1-r2) mod n. Then d = (s1*k - z1)/r1 mod n.',
    flag: 'seclab{ECDSA_nonce_reuse_privkey_ez}',
    is_private: true,
    active: true,
  },
  {
    title: 'RSA Common Modulus Attack',
    description: 'Two users encrypted the same message with the same RSA modulus but different public exponents. Recover the plaintext.',
    category: 'Crypto',
    difficulty: 'Hard',
    points: 480,
    tags: JSON.stringify(['rsa', 'common-modulus', 'crypto']),
    hint: 'Use the extended Euclidean algorithm to find coefficients. m = c1 * v mod n where c2*s + c1*t = gcd(e1, e2).',
    flag: 'seclab{RSA_common_modulus_gcd_attack}',
    is_private: true,
    active: true,
  },
  {
    title: 'CBC Padding Oracle (Custom)',
    description: 'The API returns 403 if padding is invalid, 401 if auth fails. Construct a valid admin token from a known user token.',
    category: 'Crypto',
    difficulty: 'Hard',
    points: 520,
    tags: JSON.stringify(['CBC', 'padding-oracle', 'crypto', 'auth']),
    hint: 'For each byte, brute force the intermediate value. Use the oracle to confirm each byte until you recover the full plaintext.',
    flag: 'seclab{CBC_padding_oracle_admin_tkn}',
    is_private: true,
    active: true,
  },

  // ── NETWORK ─────────────────────────────────────────────
  {
    title: 'FTP Bounce Attack Port Scan',
    description: 'The anonymous FTP server allows PORT command injection. Use it to scan the internal network 10.0.0.0/24 for open ports on a target host.',
    category: 'Network',
    difficulty: 'Hard',
    points: 400,
    tags: JSON.stringify(['ftp', 'bounce-scan', 'network', 'recon']),
    hint: 'Use FTP PORT to relay through the vulnerable FTP server: PORT 10,0,0,5,0,80 → then RETR or LIST.',
    flag: 'seclab{ftp_bounce_scan_internal_net}',
    is_private: true,
    active: true,
  },
  {
    title: ' BGP Route Hijack Simulation',
    description: 'Use Scapy to craft a BGP UPDATE message that withdraws a prefix and re-announces it with a shorter AS_PATH. Verify by sniffing the route change.',
    category: 'Network',
    difficulty: 'Hard',
    points: 580,
    tags: JSON.stringify(['bgp', 'route-hijack', 'scapy', 'network']),
    hint: 'Craft UPDATE with Withdrawal MP_REACH NLRI. Use a shorter AS_PATH attribute than the legitimate announcer.',
    flag: 'seclab{BGP_route_hijack_prefix_withdraw}',
    is_private: true,
    active: true,
  },
  {
    title: 'DNS Zone Transfer AXFR',
    description: 'The DNS server at 10.60.40.2 allows AXFR from our IP. Perform a full zone transfer and find the hidden subdomain with the flag in its TXT record.',
    category: 'Network',
    difficulty: 'Hard',
    points: 350,
    tags: JSON.stringify(['dns', 'axfr', 'zone-transfer', 'network']),
    hint: 'dig axfr @10.60.40.2 seclab-ng.internal. Look for a subdomain that is not in the public zone.',
    flag: 'seclab{dns_axfr_zone_transfer_flag}',
    is_private: true,
    active: true,
  },
  {
    title: 'SMB Null Session Enumeration',
    description: 'Connect to the target without credentials via SMB null session. Enumerate shares, list users, and find the flag in the HR share.',
    category: 'Network',
    difficulty: 'Hard',
    points: 320,
    tags: JSON.stringify(['smb', 'null-session', 'enum4linux', 'network']),
    hint: 'enum4linux -s /usr/share/wordlists/smb.txt <target>. Then smbclient //target/HR -N.',
    flag: 'seclab{SMB_null_session_hr_share_flag}',
    is_private: true,
    active: true,
  },

  // ── FORENSICS ───────────────────────────────────────────
  {
    title: 'Memory Dump Analysis (Mimikatz)',
    description: 'A Windows 10 memory dump was captured after a suspicious logon. Run volatility and extract plaintext passwords via mimikatz plugin.',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 500,
    tags: JSON.stringify(['memory', 'volatility', 'mimikatz', 'forensics']),
    hint: 'volatility -f memory.dmp --profile=Win10x64 lsadump or creddump plugins to extract.',
    flag: 'seclab{volatility_mimikatz_plaintext_creds}',
    is_private: true,
    active: true,
  },
  {
    title: 'USB Keystroke Injection (Ducky)',
    description: 'A USB Rubber Ducky pcap was captured on the OT network. Decode the keystroke payload and identify the malicious command executed.',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 450,
    tags: JSON.stringify(['usb', 'rubber-ducky', 'pcap', 'forensics']),
    hint: 'USB pcap: look for URB_INTERRUPT in with endpoint 0x01. The HID report data contains the encoded keystrokes.',
    flag: 'seclab{usb_rubber_ducky_keystroke_decode}',
    is_private: true,
    active: true,
  },
  {
    title: 'Windows Event Log Timeline',
    description: 'An XML-exported Windows Security log from a DC compromise. Reconstruct the attacker\'s lateral movement timeline using timestamps and event IDs.',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 480,
    tags: JSON.stringify(['windows', 'event-logs', 'timeline', 'forensics']),
    hint: 'Event ID 4624 = logon, 4648 = explicit credentials, 4768 = TGT request. Correlate by time to find the hop.',
    flag: 'seclab{windows_event_log_lateral_movement_timeline}',
    is_private: true,
    active: true,
  },
  {
    title: 'Android APK Reverse Engineering',
    description: 'A malicious APK was submitted to a sandbox. Decrypt the encrypted flag string in the native library (libcrypto.so) using Frida.',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 550,
    tags: JSON.stringify(['android', 'frida', 'reverse-engineering', 'native-lib']),
    hint: 'frida-trace -f app.apk -m "*encrypt*" to hook the native function, then dump the decrypted string.',
    flag: 'seclab{frida_hook_native_lib_decrypt_flag}',
    is_private: true,
    active: true,
  },

  // ── BINARY (Insane) ─────────────────────────────────────
  {
    title: 'Kernel Pool Overflow (Win10 x64)',
    description: 'A driver vulnerability in KMDF driver allows kernel pool overflow. Write a PoC that triggers BSOD and corrupts a system token to escalate to SYSTEM.',
    category: 'Binary',
    difficulty: 'Insane',
    points: 700,
    tags: JSON.stringify(['kernel', 'pool-overflow', 'windows', 'exploit-dev']),
    hint: 'Ioctl 0xdeadbeef takes user-controlled buffer size. Overflow adjacent pool header to flip BitMap->BaseVa to attacker-controlled page.',
    flag: 'seclab{kernel_pool_overflow_system_token}',
    is_private: true,
    active: true,
  },
  {
    title: 'ROP Chain to execve("/bin/sh")',
    description: 'A 64-bit ELF binary has NX enabled and ASLR. Build a ROP chain using provided gadgets to call execve and get a shell. Binary provided.',
    category: 'Binary',
    difficulty: 'Insane',
    points: 650,
    tags: JSON.stringify(['rop', 'binary-exploitation', 'elf', 'nx-bypass']),
    hint: 'Use ROPgadget --binary challenge to find: pop rdi; ret (to set /bin/sh), pop rsi; ret, pop rdx; ret, then call execve.',
    flag: 'seclab{rop_chain_execve_binsh_shell}',
    is_private: true,
    active: true,
  },
  {
    title: 'Format String to GOT Overwrite',
    description: 'The server binary uses printf(user_input) without format specifiers. Overwrite the GOT entry of exit() with the winning address of a one-shot gadget.',
    category: 'Binary',
    difficulty: 'Insane',
    points: 680,
    tags: JSON.stringify(['format-string', 'got-overwrite', 'binary', 'pwn']),
    hint: '%0c%7$x to write 4 bytes. Use %%nn%k$x with positional parameter to write 8 bytes in one shot. Overwrite .got.plt exit entry.',
    flag: 'seclab{format_string_got_overwrite_pwn}',
    is_private: true,
    active: true,
  },
  {
    title: 'Heap Unsorted Bin Attack',
    description: 'A glibc 2.31 heap challenge with tcache double-free. Use unsorted bin contamination to overwrite the main_arena->top chunk and hijack control flow.',
    category: 'Binary',
    difficulty: 'Insane',
    points: 720,
    tags: JSON.stringify(['heap', 'glibc', 'pwn', 'tcache']),
    hint: 'Double-free chunk A, allocate B and C, consolidate in unsorted bin. Overflow B\'s size to create a fake chunk at &main_arena+96.',
    flag: 'seclab{heap_unsorted_bin_attack_control_eip}',
    is_private: true,
    active: true,
  },
];

async function seed() {
  console.log('🌱 Seeding SecLab Nigeria Private Challenges...\n');

  // Clear existing private challenges first (optional reset)
  const { error: deleteError } = await supabase
    .from('challenges')
    .delete()
    .eq('is_private', true);
  if (deleteError) {
    console.warn('⚠️ Could not delete existing private challenges:', deleteError.message);
  } else {
    console.log('🗑️  Cleared existing private challenges');
  }

  let seeded = 0;
  for (const ch of PRIVATE_CHALLENGES) {
    // Hash the flag before storing
    const flagHash = hashFlag(ch.flag);

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        title: ch.title,
        description: ch.description,
        category: ch.category,
        difficulty: ch.difficulty,
        points: ch.points,
        hint: ch.hint,
        tags: ch.tags,
        flag_hash: flagHash,
        flag: ch.flag, // Keep plain-text for seeding reference only
        is_private: ch.is_private,
        active: ch.active,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`❌ Failed to insert "${ch.title}":`, error.message);
    } else {
      console.log(`✅ [${ch.difficulty}] ${ch.title} — ${ch.points}pts (id: ${data.id})`);
      seeded++;
    }
  }

  console.log(`\n🎉 Seeded ${seeded}/${PRIVATE_CHALLENGES.length} private challenges`);
  console.log('💡 Go to https://app.lemonsqueezy.com to create products for Pro/Elite tiers,');
  console.log('   then map variant IDs to NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID in .env.local');
}

seed().catch(console.error);