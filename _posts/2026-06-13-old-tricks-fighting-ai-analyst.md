---
layout: post
title: "Beyond Context Windows: When Malware Stops Fitting into Naive Automated Analysis"
categories: [infosec]
tags: [phishing,vbs,malware,trojan]
thumbnail: /images/delphitrojan/endesa-phishing.png
description: "Deobfuscating a Grandoreiro VBS Dropper Hidden Inside a Matroska of ZIPs, Resources, and White Pixels"
---

Another fun ride with a malware sample from out there in the wild. As is often the case, it all starts with yet another fake overdue bill reminder. This one contains a VBS script that uses string-splitting, Chr() arithmetic, and multi-variable Base64 encoding to deliver a 111 MB Delphi PE — which turned out to be Grandoreiro, the well-known Latin American banking trojan, now showing up in Portuguese inboxes disguised as Endesa.

<!--more-->

> **A note on tooling:** This analysis was heavily assisted by AI — specifically [OpenCode](https://opencode.ai/) with the free [Zen models](https://opencode.ai/zen). The sample expands from a 3 MB ZIP into a 116 MB PE, 94% of which is a solid-white bitmap intended to exhaust scanner limits and waste analyst resources. The same characteristic that complicates automated scanning of traditional AV systems also makes direct LLM-based analysis impractical. AI was therefore used primarily to develop the deobfuscation, extraction, and resource-stripping tools used throughout this investigation, with the analysis performed on their output rather than on the original binary.


## The Phishing Email

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 65%;" alt="PDF file" src="/images/delphitrojan/endesa-phishing.png">
  </div>
</div>

I received two emails, six days apart, both impersonating Endesa with fake overdue electrical bill reminders written in _correct_ Portuguese. This lure is not new and was sent from compromised or purpose-registered domains using PHPMailer 6.5.3. SPF, DKIM, and DMARC all passed Outlook's authentication checks, and both messages landed directly in the inbox.

- 2026-04-15: `noreply@notificacionfdh7.ahcomms.net`, Lembrete de pagamento pendente – 92268, Bing redirect to `blueberginternational.com` 
- 2026-04-21: `oficial@server-833l.appmissao.com.br`, Lembrete de pagamento pendente 82841, Wix `filesusr.com` hosted page

The emails follow the same template: a clean HTML message with the Endesa logo loaded directly from `endesaclientes.com`, a fake overdue balance (€137.11 and €146.21 respectively), a fake contract number, and a prominent "Regularizar Pagamento Agora" button.

* **April 15, 2026:** A **Bing click-tracking redirect** (`bing.com/ck/a`) chains through `blueberginternational.com` before reaching the ISO download. This makes the visible URL appear more trustworthy than the final destination. This is also a [common trend on the current phishing campaigns](https://www.levelblue.com/blogs/spiderlabs-blog/trusted-domain-hidden-danger-deceptive-url-redirections-in-email-phishing-attacks).
* **April 21, 2026:** A **Wix `filesusr.com`** hosted landing page abuses Wix's legitimate reputation to present the ISO download prompt and bypass URL reputation checks.

## The ISO Package

ISO files are a favored delivery vector because they frequently bypass email gateway scanners. Since the archive format is treated as a "disk image" rather than executable content, many automated scanners just shrug and let it through.

Mounting the ISO reveals a folder structure with several files, from XMLs to PDFs and a VBS script:

```
0Oficl0779...vbs (4.6 MB)       ← Entry point, sitting at the ISO root
~/
├── mvck2.xml                  ← Delphi PE, registry persistence (112 KB)
├── unkqgs1.xml                ← .NET System.Runtime.CompilerServices.Unsafe (16 KB)
└── ahio/
    └── zrca/
        └── dfro/
            └── lizf/
                ├── eqjxo5.pdf    (31 KB, 2019)
                ├── gfzjsx2.pdf   (25 KB, 2024)
                ├── ... [8 more decoy PDFs]
```

The nested directories (`ahio/zrca/dfro/lizf/`) exist purely to create entropy. But the key detail is the VBS file located at the ISO root. The `~/` directory contains only renamed PE files (the `.xml` files) and the decoy PDFs. The VBS is the entry point while the fake XMLs are used onlyat runtime.

The two `.xml` files are executables in disguise, serving vastly different purposes:

- `mvck2.xml` (Delphi Registry Persistence Module): A native Delphi PE32 GUI EXE. By its import table it uses `FindFirstFileA` to search its own directory, `RegCreateKeyExA` and friends to install registry persistence, and `LoadLibraryExA` for dynamic module loading.

- `unkqgs1.xml` (Legitimate Microsoft .NET Assembly): This actually isn't malware. It's Microsoft's `System.Runtime.CompilerServices.Unsafe` (v5.0.20.51904). It’s included as a dependency for a second-stage .NET component likely downloaded from the C2 later.

Neither the VBS nor the final Grandoreiro loader contains static references to these files as the follow up analysis revealed. Instead, the loader uses `FindFirstFileW` and `FindNextFileW` to enumerate files dynamically at runtime, loading valid PEs as data files or image resources.

## Building the Deobfuscator Scripts

Opening the 4.6 MB raw `.vbs` file revealed a heavily obfuscated wall of text. The core of the threat was a massive Base64 payload fragmented across seven distinct variables (`nhmMkuDu0` through `nhmMkuDu6`), each stretching roughly 640,000 characters.

As far as I could find no readily-available tooling was able to decode this VBS. The malware authors intentionally injected structural poison pills directly into the string values—specifically `<?_]~>` string-split markers and `STRRANDOM_placeholder` variables designed to ruin `Base64` alphabet validity and break naive regular expressions.

To preserve my ~~litle remaining~~ sanity, I used opencode to help spin up a specialized Python static emulator. The goal was to feed it the raw script and spit out a fully reconstructed, triage-ready file. 

```
[ Raw VBScript Input ]
            │
            ▼
  ┌───────────────────────────┐
  │   DEOBFUSCATION ENGINE    │
  ├───────────────────────────┤
  │ 1. Remove Comments        │
  │ 2. Resolve Chr() Math     │
  │ 3. Fold Line Continuations│
  │ 4. Map & Track Variables  │
  │ 5. Substitute References  │
  │ 6. Strip Poison Pills     │
  └───────────────────────────┘
            │
            ▼
  [ Extracted Payload (ZIP/PE) ]
```

### Chr() Resolution

The obfuscator relies heavily on `Chr()` and `ChrW()` calls wrapping inline integer arithmetic—think patterns like `Chr(78-10)` or `Chr(32+65)` scattered everywhere to hide strings from static scanners.

By isolating the evaluation context to an empty builtin environment (ensuring only basic integer math operators can run), the script safely evaluates the expressions statically and forces the characters back into plaintext:

```python
def resolve_chr(code: str) -> str:
    def _chr_replace(m):
        expr = m.group(1).strip()
        try:
            val = int(eval(expr, {"__builtins__": {}}))
            return f'"{chr(val)}"'
        except Exception:
            return m.group(0)
    return re.sub(r'\bChr[Ww]?\s*\(\s*([^)]+)\)', _chr_replace, code, flags=re.IGNORECASE)
```

### Variable Map with Line Continuations

The real headache is tracking the variables across multi-line splits. VBScript uses trailing `" & _` sequences to jump lines, meaning a single continuous string can be shattered across hundreds of lines of code.

The pipeline tackles this with a multi-pass strategy: first, it folds all active line continuations to heal the broken strings, then it parses the assignment structures while explicitly accounting for VBScript's escaped double-quotes:

```python
def build_var_map(code: str) -> dict:
    clean = code.replace('"STRRANDOM_placeholder"', '')
    # Fold continuation lines: "foo" & _\n  "bar" → "foobar"
    cont_re = re.compile(r'"\s*& _\s*$', re.MULTILINE)
    prev = None
    while prev != clean:
        prev = clean
        clean = re.sub(r'"\s*& _\s*\n\s*"', '', clean)
    # Map the resulting contiguous assignments
    ml_re = re.compile(r'^\s*(?:(?:Dim|dim)\s+)?(\w+)\s*=\s*(")', re.MULTILINE)
    for m in ml_re.finditer(clean):
        name = m.group(1)
        val_start = m.end(2) - 1
        rest = clean[val_start:]
        quote_pos = _find_closing_quote(rest, 0)
        if quote_pos == -1:
            continue
        var_map[name] = rest[:quote_pos + 1]
    return var_map
```

### Neutralizing the Poison Pills

With a populated variable map, the script strips out the malicious syntax markers (`<?_]~>`) that the threat actors left behind to pollute the Base64 alphabet. Once clean, the pipeline groups the sequential variables by their shared prefix (`nhmMkuDu`), strings them back together in order, and executes a dynamic padding check to ensure a clean decode even if the original slice alignment was off:

```python
def _try_decode_and_save(raw: str, stem: str, output_dir: Path, seen_hashes: set, results: list) -> None:
    strategies = [(raw, "as-is")]
    mod = len(raw) % 4
    if mod == 1:
        strategies.append((raw[:-1], "chop-1"))
        strategies.append((raw + "===", "pad+3"))
    elif mod:
        strategies.append((raw + "=" * (4 - mod), f"pad+{4-mod}"))
        
    for data, label in strategies:
        try:
            decoded = base64.b64decode(data)
            # Verify, guess extension via magic bytes, and write to disk...

```

Running the finished deobfuscator completely neutered the sample's defensive tricks:

```text
[+] Loaded sample.vbs — 419 lines
[+] Cleaned: 419 → 25 lines  (394 removed)
[!] Decoded 7 base64 payload(s):
      Sample_payload_nhmMkuDu.zip  (3,370,757 bytes, ZIP archive)

[+] Cleaned script written to: sample_clean.vbs

```

The unified payload extracted from the variables decoded into a 3.37 MB ZIP archive containing a single compressed file, `yfgTCavlnQ.ebe`. When fully inflated on disk this becomes a payload of astronomical size, a **116 MB PE executable**.

---

## 116 MB of White Pixels: Stripping the Bloat

Loading a 116 MB binary into a disassembler like Ghidra is an excellent way to watch your RAM evaporate while you wait ten minutes for analysis to finish. Investigating the PE section headers (with `objdump -h extracted_pe.exe`) immediately exposed the culprit behind this absurd footprint:

```text
Sections:
  .text     VA:0x001000  VSize:  6,344,020 ( 5.4%)  CODE EXEC READ
  .itext    VA:0x60e000  VSize:     26,688 ( 0.0%)  CODE EXEC READ
  .data     VA:0x615000  VSize:     93,844 ( 0.1%)
  .reloc    VA:0x640000  VSize:    535,340 ( 0.5%)
  .rsrc     VA:0x6c3000  VSize:109,531,136 (94.0%)  INIT_DATA READ

```

**94% of the entire executable belonged to the `.rsrc` section.**

Digging into the resources revealed that a single asset (`Bitmap ID 1046`) summed up to 107,499,688 bytes. It was a massive 16768×2137 all-white pixel image utilizing a 24-bpp RGB configuration.

This is a classic "unpacking bomb" or bloatware strategy. Threat actors use raw, uncompressed bitmap data because the DEFLATE algorithm inside standard ZIP formats can compress millions of identical white pixels down to a few kilobytes. However, the moment the payload drops and inflates on a target machine, it blows up into a massive file designed to comfortably sail right past maximum file size limits enforced by automated cloud sandboxes and traditional AV scanners. to prove a point, [any.run](https://any.run/) only allows executables up to 16MB.

To make this thing manageable, I had the AI generate a second tool: a resource shrinker (`pe_strip_rsrc.py`). Rather than hacking off the `.rsrc` section entirely (which causes the underlying Delphi application to instantly crash at runtime when its UI initialization routines fail), the script loops through the PE resource directory tree, pinpoints any `RT_BITMAP` entries ballooning past 100 KB, and surgically rewrites them.

It swaps the 107 MB block of filler with a minimal, valid 44-byte Device Independent Bitmap (DIB) header representing a tiny 1×1 black pixel:

```python
MINI_DIB = bytes([
    0x28, 0x00, 0x00, 0x00,  # biSize = 40
    0x01, 0x00, 0x00, 0x00,  # width  = 1
    0x01, 0x00, 0x00, 0x00,  # height = 1
    0x01, 0x00,              # planes = 1
    0x18, 0x00,              # bpp    = 24
    0x00, 0x00, 0x00, 0x00,  # compression = RGB
    0x0c, 0x00, 0x00, 0x00,  # image size
    0x00, 0x00, 0x00, 0x00,  # xppm
    0x00, 0x00, 0x00, 0x00,  # yppm
    0x00, 0x00, 0x00, 0x00,  # clr used
    0x00, 0x00, 0x00, 0x00,  # clr important
    0x00, 0x00, 0x00,        # pixel BGR = black
    0x00,                    # padding
])

```

The script shifts the remaining resource entry Relative Virtual Addresses (RVAs) backward, updates the raw section sizes, and recalibrates the final `SizeOfImage` parameters inside the Optional Header:

```python
# Update the .rsrc section data entries that point to data after the bitmaps
updated_rsrc = bytearray(new_rsrc)
for entry in all_entries:
    if entry['foff'] >= latest_end:
        new_rva = entry['rva'] - rva_shift
        updated_rsrc[entry['entry_off']:entry['entry_off']+4] = struct.pack('<I', new_rva)
    elif entry['foff'] >= earliest and entry['foff'] < latest_end and entry['size'] > 100_000:
        # Swap the monstrous bitmap pointer for our tiny 1x1 asset
        mini_rva = mini_foffs[i][1] - base_foff + base_rva
        updated_rsrc[entry_off_in_rsrc:entry_off_in_rsrc+4] = struct.pack('<I', mini_rva)
        updated_rsrc[entry_off_in_rsrc+4:entry_off_in_rsrc+8] = struct.pack('<I', len(MINI_DIB))

```

```text
[+] Found 1 large bitmap(s), 107,499,688 bytes total
[+] Replacing with 1 1×1 pixel bitmap(s) (44 bytes)
[+] extracted_pe.exe: 116,561,408 -> 9,061,764 bytes (92.2% reduction)
[+] PE structure valid: 11 sections

```

The script did its magic and the result was now manageable as its size dropped from a 116 MB down to a sleek 9 MB while remaining completely stable and runnable. With the artificial bloat stripped away, it was finally time to see what this malware was actually trying to do.


## Enter Grandoreiro: The Banking Trojan

### Identification


Both the full-on ISO and the slimmed binary were executed on [any.run](https://any.run/) against Windows 10 targets. The malware execution is visible via the fake splash screen of a PDF file.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 70%;" alt="PDF file" src="/images/delphitrojan/anyrun.jpeg">
  </div>
</div>

The malware piece was easily identified by any.run as **Grandoreiro**, a Delphi-based banking trojan active since 2016. While historically a regional threat in Latin America, an [IBM X-Force Analysis](https://www.ibm.com/think/x-force/grandoreiro-banking-trojan-unleashed) highlights its recent pivot to an aggressive Malware-as-a-Service (MaaS) model targeting over 1,500 banking applications across 60 countries. A recent threat intelligence report published by [CISO Advisor](https://www.cisoadvisor.com.br/grandoreiro-mira-bancos-de-portugal-e-america-latina/) notes that WatchGuard Threat Lab caught this specific strain actively targeting the Portuguese financial sector, tracking major institutions like Caixa Geral de Depósitos, Millennium BCP, Novobanco, and digital fintech apps like Revolut and Wise.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 50%;" alt="PDF file" src="/images/delphitrojan/grandoreiro.png">
  </div>
</div>


The delivery campaigns rely heavily on high-fidelity utility lures, specifically fake electricity cutoff notices mimicking [Endesa Portugal](https://www.endesa.pt/particulares). These phishing loops are highly effective because threat actors weaponized data from an upstream [Endesa commercial platform breach](https://www.google.com/search?q=https://www.24horas.pt/noticia/portugal-em-perigo-hacker-rouba-20-milhoes-de-clientes-da-endesa), using real customer details and contract PII to make the emails look entirely legitimate. To keep these regional campaigns hidden from global scanning arrays, a [Mimecast Campaign Report](https://www.mimecast.com/threat-intelligence-hub/grandoreiro-infostealer-campaign/) shows that Grandoreiro uses strict server-side geofencing. The distribution servers run intermediate JavaScript browser checks and immediately drop the connection if the request originates outside the target country or flags as a security datacenter. These checks were observed in both emails while trying to donwload the samples, forcing some User-Agent switcheroo.

### Obfuscation, Sandbox Evasion & The Tor Trick

The loader uses **KryvaTech** obfuscator identified directly by strings embedded in the binary. There are no public references, known threat intelligence entries, or code repository matches for “KryvaTechAssembler”, which indicates it is not a documented or widely distributed tool and is likely a custom or private. This was identified directly by strings embedded in the binary, where the `.text` section contains 65 occurrences of `KryvaTechAssembleriOfPYpbUa...`, following a consistent internal naming scheme used for assembly wrappers, event handler bindings, and class reference obfuscation. Patterns such as `KryvaTechAssembleriOfPYpbUaYLXLnwKEqMC02Click` and `KryvaTechAssembleriOfPYpbUaytJeSwrC03` demonstrate systematic mangling of Delphi VCL components (e.g., TPanel, TImage) with randomized suffixes for runtime-dispatched resolution. Strings like `KryvaTechAssembleriOfPYpbUa.exe` further suggest an internal builder or runtime component embedded within the obfuscation pipeline. Although the import table is present, API calls are routed through KryvaTech’s dispatch layer, with functions such as `FindFirstFileW`, `LoadLibraryExW`, and registry APIs resolved indirectly at runtime rather than invoked directly. The `.rsrc` section confirms a Delphi origin through artifacts like `DVCLAL`, `PACKAGEINFO`, and embedded `DFM` forms (`TPARAMEDITOR`, `TLOGINDIALOG`, `TPASSWORDDIALOG`), indicating VCL-level obfuscation rather than PE-level restructuring, while string encryption is consistently applied via layered decoding routines including triple-base64, custom hex transforms, and AES-256-CBC.

The loader uses a tight checklist to fingerprint its environment, checking for attached debuggers, fast-forwarded timing hooks, and low system RAM. It even includes a distinctive printer litmus test via `winspool.drv`, immediately killing execution if a default print device cannot be enumerated.

Standard sandbox analysis fails because the malware queries `ip-api.com` to identify the hosting provider. If it detects a known security datacenter or an IP range outside its target geography, it shuts down instantly. To bypass this, routing the traffic via Tor in Any.run simulates a legitimate residential egress node. This satisfies the localization check, tricks the environmental guards, and forces the malware to drop its defenses.

### Finding the C2

Static analysis found no hardcoded IPs or domains in the binary, but we found some clues to what is going on: (1) **RC4 S-box** in the `.text` section, (2) **Base64 alphabet** table, (3) **zlib deflate/inflate** library, (4) **WinHTTP API** (`WinHttpOpen`, `WinHttpConnect`, `WinHttpOpenRequest`, `WinHttpSendRequest`) and **raw Winsock** (`socket`, `connect`, `send`, `recv`), (5) **`WSAAsyncGetHostByName`** for async DNS resolution, and (6) **`InternetOpenUrlW`** and **`HttpQueryInfoW`** from `wininet.dll`.

The C2 address is not embedded — it's encrypted using a multi-layer scheme described by IBM X-Force: a triple-Base64-encoded key is decoded through a custom hex transform, decrypted with the legacy Grandoreiro algorithm, then AES-256-CBC decrypted to produce the final strings. The domain itself is generated by a **Domain Generation Algorithm (DGA)** that produces up to **14 different C2 domains per day** from 14 separate seeds.

To completely blind-spot corporate logging and sidestep host-level sinkholes, Grandoreiro resolves these domains via DNS-over-HTTPS (DoH) using Google's public resolver ([https://dns.google/resolve](https://dns.google/resolve)). During triage, this routine unmasked the active DGA node `darklove-144889657.ilovecollege.info`, where the prefix shifts sequentially based on the calendar loop.


### Advanced Core Capabilities

Once the loader validates the environment and retrieves the main banking payload, Grandoreiro shifts into its fraud execution phase. IBM X-Force describes two key capabilities in modern variants (these were not analysed as part of this research and are solely based on X-Force descriptions):

1. The malware operates as an Outlook MAPI worm, extracting contact lists from local Outlook installations for use in phishing propagation. To bypass Outlook security prompts (Object Model Guard), it can register a legitimate COM component (`secman.dll`, Outlook Security Manager) to suppress warnings and enable automated mailbox access.

2. The malware monitors browser activity for targeted banking sites. When detected, it alerts an operator who can initiate a live session. The operator then deploys a full-screen overlay over the browser, mimicking banking authentication flows (e.g. 2FA prompts). User input is captured and relayed in real time. Because activity occurs within the victim’s authenticated session and trusted network context, transactions appear legitimate to bank fraud detection systems.

## Summary

This campaign offers an insightful look into how modern malware operations continue to recycle vintage mechanisms while introducing structural roadblocks explicitly designed to counter automation and detection. As threat actors turn to multi-layered extraction loops and bloated visual assets to exhaust sandbox parameters, _payloads easily expand past conventional LLM context boundaries_. Directly feeding a 116 MB executable into an AI model is impractical and costly. Instead, the real utility of AI in modern triage lies in rapid tool engineering—generating targeted, programmatic deobfuscators and PE resource slimmers to safely reduce artifacts back down to a manageable size for human verification.

Grandoreiro underscores the persistent popularity of legacy environments like **Delphi** across the Latin American cybercrime landscape. Delphi's native compilation outputs structurally dense binaries packed with extensive internal form metadata, visual components, and object overhead. This architectural verbosity produces significant noise for automated heuristic rules, while effortlessly serving as an ideal vehicle to hold oversized resources.

The structural core of this threat depends on old tricks like string-split blocks within basic VBS script or executing environment verification routines against default system printers via `winspool.drv`. The usage of dynamic payload creation to add entropy to the binaries and payloads is also a nice old trick to bypass some levels signature-based detection. The focal mechanism here remains the "unpacking bomb"—leveraging thousands of uncompressed white pixels inside an ordinary `.rsrc` bitmap structure to bypass automated ingestion bounds while ballooning into massive footprints on local endpoints.

### Footnotes

The specific artifacts isolated and generated throughout this investigative pipeline have been indexed across the following tracking submissions on VirusTotal:

* **Initial VBS Script Container:** [VirusTotal Submission - Raw VBS Dropper](https://www.virustotal.com/gui/file/630e68571c71dcc830de721f3bbfbe339783eb5e546a78f240989bd8972def91)
* **Underlying Delivery Image:** [VirusTotal Submission - ISO Package Archive](https://www.virustotal.com/gui/file/d7aed0416da73a94dc8e80a040826a4c6f2c46307debb141a1598714a31670b9/detection)
* **Surgically Cleaned Payload:** [VirusTotal Submission - Resource-Stripped Grandoreiro Loader](https://www.virustotal.com/gui/file/b1d94c364d4186906d12325a1833491d872632ea61c15ca652105e8fbed7aa55?nocache=1)