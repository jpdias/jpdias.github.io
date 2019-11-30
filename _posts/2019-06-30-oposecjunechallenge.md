---
layout: post
title:  "ØxＯＰＯＳɆＣ Mɇɇtuᵽ [0x75] Challenge Write-up"
categories: [infosec, iot]
tags: [oposec, infosec, ctf]
thumbnail: /images/oposec/banner.jpg
description: "Write-up for the CTF-like challenge of [0x75] edition of the ØxＯＰＯＳɆＣ Mɇɇtuᵽ"
---

"Based in Porto, the ØxＯＰＯＳɆＣ group was started by g33ks who are passionate about security. The meetup primary mission is to discuss and tackle upsurging security issues by leveraging the expertise and know-how of members of the group." This is the write-up of the challenges of the 0x72 and 0x73 meetup editions, by @aap.
<!--more-->

The meetup happens in a monthly-basis, feel free to [join in](https://www.meetup.com/0xOPOSEC/).

This challenge was solved in collaboration with my friend _<s>(and Ph.D. supervisor)</s>_ [@hugosf](http://hugosereno.eu/).


## Análise.eml


It all started with an URL to a Dropbox stored file. The file, named `Análise.eml` was an E-Mail Message. Opening it in Thunderbird the following text and image appeared:

> Olá,
>
>Preciso de alguém capaz de analisar um PC, será que podes ajudar?
>
>PS: Vamos usar a forma habitual de troca de informações classificadas!
>
>--
>A **volatilidade** é a constante da vida!

![footer](/images/oposec/banner.jpg)

Analyzing the headers of the Email message nothing useful popped out. 

Focusing now in the banner image, what comes to mind is the use of some kind of steganography to hide something (as hinted in the text of the email).

Just using `steghide` with no password would extract the hidden information:

```bash
$ steghide extract -sf oposec/banner.jpg
Enter passphrase: 
wrote extracted data to "info.txt".

$ cat info.txt

0c60fd56872251909cb07a749b03a34a56e1edac  memdmp.zip

https://www.dropbox.com/s/<location>/memdmp.zip?dl=0
```

Going to the given URL, a `memdmp.zip` file was downloaded with around 132 MB. 

```bash
$ unzip memdmp.zip 
Archive:  memdmp.zip
  inflating: memdmp                  

$ file memdmp     
memdmp: data
```

Extracting it would give us a `memdmp` data file. Although the name pointed out to be a memory dump, this was my first challenge of this kind, so that did not help much.

Wasting a little time analyzing the `strings` and toying around with `grep` output, several things started to pop out, such as several references to [WeTransfer](https://wetransfer.com/). In my chaotic mind, things like information exfiltration began to seem the go-to. 

After losing something around this idea, something else started to appear strange, namely the references to this tool:
`C:\Documents and Settings\Forense\My Documents\Downloads\volatility-2.0.standalone\volatility.exew`. Googling a bit, this repository appeared: [Volatility by VolatilityFoundation](https://github.com/volatilityfoundation/volatility).

After reading a little about it, all started to make sense. It is *obvious* that there are several tools built to analyze memory dumps! Duh!

Searching a little for a proper noob guide into this tool, found this one: [First steps to volatile memory analysis](https://medium.com/@zemelusa/first-steps-to-volatile-memory-analysis-dcbd4d2d56a1). 

So, following the tutorial, the first thing run `imageinfo` on the dump.

```bash
$ python volatility/vol.py -f memdmp imageinfo
Volatility Foundation Volatility Framework 2.6.1
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : WinXPSP2x86, WinXPSP3x86 (Instantiated with WinXPSP2x86)
                     AS Layer1 : IA32PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (/home/jpdias/Downloads/memdmp)
                      PAE type : No PAE
                           DTB : 0x39000L
                          KDBG : 0x8054cde0L
          Number of Processors : 1
     Image Type (Service Pack) : 3
                KPCR for CPU 0 : 0xffdff000L
             KUSER_SHARED_DATA : 0xffdf0000L
           Image date and time : 2019-06-09 16:04:21 UTC+0000
     Image local date and time : 2019-06-09 16:04:21 +0000
```

With this, we get a suggested profile to use in the next phases of the analysis. Using the `$ python volatility/vol.py -f memdmp --profile=WinXPSP2x86 pstree` we could get a tree of all processes running on the memdumped machine, but nothing strange appeared once again. 

Moving further, maybe this machine could be talking with something strange and analyzing the connections, once again, nothing useful came up. Most of the calls were coming from Windows internals (`svchost.exe`).

```bash
$ python volatility/vol.py -f memdmp --profile=WinXPSP2x86 connscan
Volatility Foundation Volatility Framework 2.6.1
Offset(P)  Local Address             Remote Address            Pid
---------- ------------------------- ------------------------- ---
0x01fd28d8 10.0.2.15:1032            <ip1>:443                1040
0x02315e68 10.0.2.15:1033            <ip2>:80                 1040
0x0231ce68 10.0.2.15:1031            <ip3>:80                 1040
0x151408d8 10.0.2.15:1032            <ip4>:443                1040
0x152cbe68 10.0.2.15:1033            <ip5>:80                 1040
0x154d2e68 10.0.2.15:1031            <ip6>:80                 1040
```

Even after wasting some time running nmap in some of the most strange ones, nothing.

And after, *@hugosf* had an idea, how about checking out the *clipboard*.

```bash
$ python volatility/vol.py -f memdmp --profile=WinXPSP2x86 clipboard
Volatility Foundation Volatility Framework 2.6.1
Session    WindowStation Format                 Handle Object     Data  
---------- ------------- ------------------ ---------- ---------- --------
         0 WinSta0       CF_UNICODETEXT        0x30115 0xe146f0b8 NOTEPAD
         0 WinSta0       CF_LOCALE            0x5400fb 0xe1b75620       
         0 WinSta0       CF_TEXT                   0x1 ----------
         0 WinSta0       CF_OEMTEXT                0x1 ----------
```

The clipboard pointed out to `notepad`. Checking it out using volatility:

```bash
$ python volatility/vol.py -f memdmp --profile=WinXPSP2x86 notepad  
Volatility Foundation Volatility Framework 2.6.1
Process: 1864
Text:
NOTEPAD

Text:
https://bit.ly/<id>

NOTEPAD
```

Yey! Another URL. Checking this URL would lead us to a dropbox hosted TXT file with the following content: `synt{Z8Z%QHZC%E5PXF!}`.

After checking out that the expected format for the flag was something like flag{.....} it seemed to close to what we had. After checking on [CyberChef](), this came up to be a simple ROT13 cipher: 

>> flag{M8M%DUMP%R5CKS!}

So that's it. Challenge complete! 

It was a fun riddle, and kudos @aap for setting it up! Also, kudos @hugosf for put up with my addiction to security while I should be writing my thesis.


##### *Together we hit harder.*
