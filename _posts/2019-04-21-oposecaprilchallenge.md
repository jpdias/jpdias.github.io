---
layout: post
title:  "ØxＯＰＯＳɆＣ Mɇɇtuᵽ [0x72] and [0x73] Challenges Write-up"
categories: [infosec, iot]
tags: [oposec, infosec, ctf]
description: "Write-up for the CTF-like challenges of [0x72] and [0x73] edition of the ØxＯＰＯＳɆＣ Mɇɇtuᵽ"
---

"Based in Porto, the ØxＯＰＯＳɆＣ group was started by g33ks who are passionate about security. The meetup primary mission is to discuss and tackle upsurging security issues by leveraging the expertise and know-how of members of the group." This is the write-up of the challenges of the 0x72 and 0x73 meetup editions, by @ArmySick and @Simps0n.
<!--more-->

The meetup happens in a monthly-basis, feel free to [join in](https://www.meetup.com/0xOPOSEC/).

## [0x72] The loudest voice in the room is rarely the most right.

> The loudest voice in the room is rarely the most right.

```$ wget <ip_address>/omegalul.bmp```

![omegalul](/images/oposec/omegalul.png)

> [Download Image](/images/oposec/omegalul.png)

### How to solve it?

This seems like a stegneography challenge. The first attempt was trying to run several stegneography tools, including [zsteg](https://github.com/zed-0xff/zsteg). However none of them worked throwing a variety of errors, but ```steghide``` throwed a curious one:

```steghide: the bmp file "omegalul.bmp" has a format that is not supported (biSize: 124).``` 

After some searching found out this relevant [StackOverflow Question](https://stackoverflow.com/questions/25713117/what-is-the-difference-between-bisizeimage-bisize-and-bfsize): 

> biSize is the size of the BITMAPINFOHEADER only. It is 40 bytes.

![Header BMP](/images/oposec/headerBMP.png)

And, by just changing the value from 124 to 40 in the file header (OFFSET 14 / DWORD) with HxD Editor, we could run zsteg without any trouble: 

```b1,msb,bY .. text: "flag{Least_Significant_is_Most_Significant}\n"```

>> flag{Least_Significant_is_Most_Significant}


## [0x73] This is a military grade challenge!

>  Check the link \<url> (+) 

![omegalul](/images/oposec/challenge.jpg)

> [Download Image](/images/oposec/challenge.jpg)

Another stegneography challenge. After a little of manual analysis of the file using [010 editor](https://www.sweetscape.com/010editor/), an unknown padding at the end of the file appeared. Among the gibberish, an odd string appeared: ```dd02c7c2232759874e1c205587017bed```.

After some searching and trial and error, it looked like an md5 hash of the string ```secret```. But that was not a flag.

Moving on, a check for embedded files comes to mind. So, using ```$ binwalk -e challenge.jpg``` a ZIP file appeared: ```46D41.zip``` with a file named ```dd02c7c2232759874e1c205587017bed``` inside.

Using [fcrackzip](https://github.com/hyc/fcrackzip) did not properly worked on the zip (with both wordlist and brute-force).

Going traditional, I found several Python scripts on GitHub capable of bruteforcing ZIP password-protected files. Using *military grade challenge* as hint, I guess it must be an "easy" password. 

Using the following script, and the **dictonary** [```
SecLists/Passwords/Common-Credentials/best1050.txt```](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/best1050.txt).

<script src="https://gist.github.com/jpdias/569562c7c5ab57492ceec15e20345c25.js"></script>

The password was quickly found: *admin123*. 

>> flag{ThisIsaOldTrickInTheBook} 