---
layout: post
title: "Plywood Trojan: When Attackers Go Budget"
categories: [infosec]
tags: [phishing,malware,uphold]
thumbnail: /images/uphold25/upholddesktop.jpeg
description: "Another phishing story: how to straightforwardly bypass most antivirus and achieve remote access control on a victim PC."
---


I'm always amused by the smell of a fresh phishing email in the morning. And this time, a closer to home one, as I know the target company since I have a friend working there, namely, Uphold. So let's dive right in.

<!--more-->

> Disclaimer: Uphold is not in any way affiliated with this research nor its outcomes.

## Target Acquired

As always, the surprise comes in the subject of the email: "Introducing Uphold Desktop Application — Built to Resolve User Issues and Enhance Your Experience" coming from a suspect email address `newsletter@uphold25.blog` in the name of Uphold. To nobody's surprise, I don't have an account on Uphold, so this is not really spear-phishing.

<details>
  <summary>Email contents (click to expand)</summary>
  <p>Dear Uphold User,</p>

<p>Over the past months, we have listened carefully to your feedback concerning account restrictions, withdrawal delays, verification challenges, customer-support response times, 2FA difficulties, device-compatibility problems, and other unexpected disruptions. We recognize the frustration these issues have caused, and we appreciate your patience as we focused on strengthening the Uphold platform.</p>

<p>We are pleased to introduce the Uphold Desktop Application — a major upgrade designed specifically to fix, correct, and fully rectify the recent challenges many users have experienced.</p>

<p>The latest desktop environment delivers:</p>
<ul>
<li>Enhanced reliability and stability, reducing account-usage interruptions and verification failures.</li>
<li>Improved transaction handling, ensuring smoother deposits, withdrawals, and transfers.</li>
<li>Strengthened security infrastructure, including upgraded 2FA and safer wallet-linking protocols.</li>
<li>A modern, refined interface that makes navigation faster and more intuitive.</li>
<li>Maximum efficiency, especially for users who faced limitations on older mobile devices.</li>
<li>Priority support integration, allowing improved issue resolution directly within the app.</li>
</ul>
<p>Uphold services — trading, asset management, transfers, staking, and wallet operations — are more efficient, more secure, and more user-friendly on the desktop platform. The application represents the next stage in our commitment to delivering a seamless, transparent, and dependable experience for every Uphold user.</p>

<p>📥: [https://www.upholddesktop.app/](https://www.upholddesktop.app/)
We encourage all users to download and begin using the Uphold Desktop App, where you'll benefit from these enhancements directly and enjoy a more consistent, stable, and streamlined interface.</p>

<p>Thank you for your continued trust. We remain fully committed to building a platform that meets your expectations and supports your prosperity.</p>

<p>Sincerely,</p>
<p>The Uphold Team.</p>
</details>

So, we finally get our juicy link `https://www.upholddesktop.app/`. This is a simple page, but a really well-made one, hosted on Vercel[^1] (seems to be a trend now).

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 65%;" alt="Uphold Phishing Website" src="/images/uphold25/upholddesktop.jpeg">
  </div>
</div>

## The Analysis

The first thing that I like to do is a quick scan using [urlscan.io](https://urlscan.io/). As expected, the report is matching the expected "Malicious Activity!" (feel free to check the [public report here](https://urlscan.io/result/019a8892-f207-7119-9d6d-c37916942e11/)).

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 65%;" alt="URLScan report" src="/images/uphold25/urlscan.png">
  </div>
</div>

So, we have a download button pointing to Gofile (another random file hosting website), `https://store-na-phx-3.gofile.io/download/direct/42fc8912-xxxx-xxxx-xxxx-fe121eefd839/Uphold-installer.exe`. Let's download it (be careful if you decide to do similar adventures on your own; it is always recommended to use a sandbox machine or virtual machine).

Let's upload the _bug_ to [VirusTotal](https://www.virustotal.com/). Once again, rightfully detected, but strangely enough just by a handful of antivirus tools, more precisely **only 8 out of 72 antivirus programs flag it as malicious** (you can find the [report here](https://www.virustotal.com/gui/file/9211f0e753c0b19e54cc3d715679dc814a37b9368964abbc502edd5cf30fb1ef)). Most of the ones that detect it identify it as either a trojan or remote tool (should we say same face of the same coin?).

Until so far we depended on automated analysis and reports, but should we take a closer look? Although one can have fun [setting up a malware sandbox (e.g., FLARE-VM)](https://github.com/mandiant/flare-vm), nowadays time runs short, so using a free sandbox is more than enough. For me the go-to has always been [ANY.RUN](https://any.run/) as the free usage tier is not bad at all.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width:100%;" alt="AnyRun" src="/images/uphold25/AnyRun.png">
  </div>
</div>

The tool allows you to upload your executable and trigger its execution inside a Windows 10 environment. This allows us to see the malware's movements in a safe, automated, and _lazy_ way. As per the executable behavior, ANY.RUN also flags the executable as malware, and you can find the [execution report here](https://app.any.run/tasks/70cbc321-d7b5-454d-b21c-852cbcdcc07b).

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width:100%;" alt="Execution Graph" src="/images/uphold25/anyrungraph.png">
  </div>
</div>

One of the best views is the execution graph, which gives you an overview of the malware execution path and makes visible some of its inner workings. One of the things that stood out in several aspects was the name of the executable dropped by the main `uphold-installer.exe`, more concretely `syncro.installer.exe`.

[Syncro](https://syncromsp.com/platform/rmm/) is _yet another_ Remote Monitoring and Management (RMM) tool which seems to have changed names at some point from Kabuto (name still used to download the tool from [https://production.kabutoservices.com/](https://production.kabutoservices.com/)). And the tool seems to be owned by RepairTech ([https://www.repairtechsolutions.com/documentation/kabuto/](https://www.repairtechsolutions.com/documentation/kabuto/)), which is still in the tool installation path: `%ProgramFiles%\repairtech\syncro\install.bat`.

Looking at the malware's execution first command, we can also see that it passes by argument both a JWT token and a configuration file in base64:
```text
"C:\Users\admin\AppData\Local\Temp\Syncro.Installer.exe" --jwt-payload "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJpbnN0YWxsIjp7InNob3AiOiJ1Q2xLcVpHU2dkcVR6aldXWHREWHZRIiwiY3VzdG9tZXJfaWQiOjE3NjAzMDEsImZvbGRlcl9pZCI6NDczMDUzNn0sInNlcnZpY2luZyI6eyJjaGFubmVsIjoic3luY3JvLXJ0bSIsInRhcmdldCI6InN5bmNybyJ9fQ.L7Ch7BjgPHpGqlOAnXdQLncIdXzq8xjjb7GDpDdPMypo3_qX6VV_c9sbmxvCkelI0tkyLcSHyEWEYLQ4QijxAw" --config-json "ewogICJBdXRoVXJsIjogImh0dHBzOi8vYWRtaW4uc3luY3JvYXBpLmNvbSIsCiAgIkthYnV0b1VybCI6ICJodHRwczovL3JtbS5zeW5jcm9tc3AuY29tIiwKICAiU3luY3JvVXJscyI6IFsKICAgICJodHRwczovL3tzdWJkb21haW59LnN5bmNyb2FwaS5jb20iLAogICAgImh0dHBzOi8ve3N1YmRvbWFpbn0uc3luY3JvbXNwLmNvbSJdLAogICJMb2dEdW1wZXJVcmwiOiAiaHR0cHM6Ly9sZC5hdXJlbGl1cy5ob3N0IiwKICAiVXBkYXRlVXJsIjogImh0dHBzOi8vcHJvZHVjdGlvbi5rYWJ1dG9zZXJ2aWNlcy5jb20vc3luY3JvL21haW4vdXBkYXRlcy8iLAogICJPdmVybWluZFVwZGF0ZVVybCI6ICJodHRwczovL3Byb2R1Y3Rpb24ua2FidXRvc2VydmljZXMuY29tL3N5bmNyby9vdmVybWluZC91cGRhdGVzLyIsCiAgIkNob2NvbGF0ZXlJbnN0YWxsZXJVcmwiOiAiaHR0cHM6Ly9wcm9kdWN0aW9uLmthYnV0b3NlcnZpY2VzLmNvbS9jaG9jby9rYWJ1dG9fcGF0Y2hfbWFuYWdlciIsCiAgIldlYlNvY2tldFVybCI6ICJ3c3M6Ly9yZWFsdGltZS5rYWJ1dG9zZXJ2aWNlcy5jb20vc29ja2V0IiwKICAiQ2hhdFVybCI6ICJ3c3M6Ly9jaGF0LWNoYXQuc3luY3JvbXNwLmNvbS9zb2NrZXQiLAogICJfIjogIiIKfQo="
```

By decoding the [JWT token](https://www.jwt.io/) we can see the authentication payload passed to Syncro:

```json
{
  "version": 1,
  "install": {
    "shop": "uClKqZGSgdqTzjWWXtDXvQ",
    "customer_id": 1760301,
    "folder_id": 4730536
  },
  "servicing": {
    "channel": "syncro-rtm",
    "target": "syncro"
  }
}
```

And by looking at the configuration, we can also find more details about the installation configuration:

```json
{
  "AuthUrl": "https://admin.syncroapi.com",
  "KabutoUrl": "https://rmm.syncromsp.com",
  "SyncroUrls": [
    "https://{subdomain}.syncroapi.com",
    "https://{subdomain}.syncromsp.com"],
  "LogDumperUrl": "https://ld.aurelius.host",
  "UpdateUrl": "https://production.kabutoservices.com/syncro/main/updates/",
  "OvermindUpdateUrl": "https://production.kabutoservices.com/syncro/overmind/updates/",
  "ChocolateyInstallerUrl": "https://production.kabutoservices.com/choco/kabuto_patch_manager",
  "WebSocketUrl": "wss://realtime.kabutoservices.com/socket",
  "ChatUrl": "wss://chat-chat.syncromsp.com/socket",
  "_": ""
}
```

So, at the end of the day, we can find that the trojan, _if we can call it such_, was nothing more than a bundled version of a, let's say, shady RMM tool, which, if installed, would provide the attacker full access to the victim's computer. And I can almost bet that the attacker's are leveraging the `Free trial` provided by Syncro.

 The last piece of the puzzle was to understand how it bypassed so many antivirus programs, but this is easily explained by the verified signature of the RMM software by `Servably Inc.`, yet another name for the same company. The certificate details can be found in [abuse.ch](https://bazaar.abuse.ch/sample/acc6721dbddad55c6a76b460a8a53bc5d4e97d00990e4cac686b2ab2877e1a91/) where we can see that the same signature was used in at least another 15 samples.



## Timeline

- [15/11/2025] Phishing email received
- [16/11/2025] Domain reported to [Google](https://www.registry.google/). File reported as abuse to [Gofile](https://gofile.io/). Syncro abuse also reported to the company without any reply. 
- [17/11/2025] Domain takedown.

### Footnotes

[^1]: [Threat Insight: Cybercriminals Abusing Vercel to Deliver Remote Access Malware](https://cyberarmor.tech/blog/threat-insight-cybercriminals-abusing-vercel-to-deliver-remote-access-malware).