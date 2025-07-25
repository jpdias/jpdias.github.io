---
layout: post
title: "Hardware Hacking 101 Village - Post-Mortem"
categories: [infosec]
tags: [hardware,hacking,router,iot]
thumbnail: /images/hackday25/oxehack-day.jpeg
description: "On June 14, 2025, I organized a hardware hacking focused village as part of the ØxＯＰＯＳɆＣ Hack Day, and this is a post-mortem analysis of the village."
---


On June 14, 2025, I organized a hardware hacking focused village as part of the ØxＯＰＯＳɆＣ Hack Day, and this is a post-mortem analysis of the village, focusing on some of the observations and common mishaps, and how to improve your journey in the hardware hacking world, especially from a beginner's standpoint.

<!--more-->

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 50%;" alt="Weather station monitor" src="/images/hackday25/oxehack-day.jpeg">
  </div>
</div>

## Get the Basics Right: Learn Electronics and Hardware Programming

Before diving into the world of hardware hacking, learn the basics of hardware programming and electronics. Using the craziest fault injection technique will seem like magic if you don't understand why bit flips happen and what that implies, e.g., in jumping instructions. So get your hands on a cheap Arduino Nano, or ESP32, some protoboard and some sensors, and get your hands dirty building something. You have plenty of places to find beginner projects, e.g., [Arduino ProjectHub](https://projecthub.arduino.cc/) and [Hackaday.io](https://hackaday.io/discover).

## Collect Target Devices

You know that old router you're going to throw away? Keep it! Ask your friends if they have old IoT devices that they no longer use. Buy cheap IP cameras from AliExpress. The goal is variety, not quality. Different manufacturers create things differently, so there are more tricks and quirks to learn and experiment with. Just collect hardware. They are fun to play with -- and also easy to ruin -- and [once you free the magic smoke, there is no going back](https://en.wikipedia.org/wiki/Magic_smoke). 

## Don't Be Afraid of Soldering

If you are playing in the world of hardware, you will unavoidably need to solder at some point. Get a regulatable temperature soldering iron (like these fancy [Pinecil $30 USB-C powered ones](https://pine64.com/product/pinecil-smart-mini-portable-soldering-iron/)) and you are good to go. But only solder when you need to -- most of the time you can get away with [pogo pins](https://www.tindie.com/products/johnnywu/254mm-pcb-probe-clip/), [Micro IC Hook Clips](https://www.amazon.com/flexman-Multimeter-Adapter-Electronic-Testing/dp/B0CRD9X58B) or [fancy needle-probes](https://www.thingiverse.com/thing:2318886).

If you want to build a fancy version, I recommend [this 3D-printed PCB probing jig](https://hackaday.com/2019/11/15/needling-your-projects-3d-printed-pcb-probing-jig-uses-accupuncture-needles/).

## Serial Interfaces Everywhere

[FT232RL USB-to-serial converters](https://www.amazon.es/TECNOIOT-FT232RL-Serial-Converter-Adapter/dp/B083M61T3J) are essential. Get USB-C versions if possible. UART interfaces are your gateway to most devices.

## Logic Analyzers: Cheap Works

Get a [cheap 8-channel logic analyzer](https://www.amazon.es/Analizador-segundos-analizador-Depurador-herramienta/dp/B0FGP46Y9Z). €20 gets you something that is fiddly to work with, but it should work for most scenarios, even if it needs some trial and error. Don't expect high accuracy or the ability to record high baudrate signals, but those are not that common on consumer-level devices.

Also, use simple UI software. [Saleae Logic software](https://www.saleae.com/downloads/) and [sigrok/PulseView](https://sigrok.org/wiki/PulseView) are both free and work with these cheap analyzers. You get professional-grade protocol decoding without the professional price tag.

## Multimeters: Get One, and Then Another One

Start cheap; anything will mostly work. But a proper UNI-T or equivalent brand multimeter around €80 is worth it. You get accurate readings and something you can trust for both electronics and home repairs involving high voltage (be careful anyway). 

## Most Things Are Obvious

Debug pins are labeled on PCBs. Test points have silk screen text. UART interfaces sit there waiting. Manufacturers assume no one will look (or they don't care enough).

## Fault Injection on a Budget

Need fault injection? A mosquito net works. [David Buchanan's DRAM EMFI technique](https://www.da.vidbuchanan.co.uk/blog/dram-emfi.html) shows how simple solutions are sometimes all you need. Before trying fault injection on real-world devices, start with things you have programmed yourself -- that way you can easily understand what is going on.

## Software That Works

Don't be hard on yourself by forcing yourself to learn crazy terminal interfaces with too many flags for any human being to know by heart unless you work with them constantly. UIs were created for a reason -- use them!

- [CuteCom](https://gitlab.com/cutecom/cutecom) for serial communications.
- [IMSProg](https://github.com/bigbigmdm/IMSProg) for EEPROM work.
- [Ghidra](https://github.com/NationalSecurityAgency/ghidra) for reverse engineering.

UIs save time. Your brain should focus on the problem, not command flags and syntax.

## Firmware Is Right There

Most firmware is accessible through the bootloader. Connect to UART, interrupt the boot process, dump flash contents. No need for complex extraction.

Once you have firmware, [binwalk](https://github.com/ReFirmLabs/binwalk) does the heavy lifting. Extract filesystems, find interesting files, analyze without reverse engineering. Sometimes you don't even need Ghidra -- `grep` will take you a long way. Search for certificates, endpoints, passwords... they will be there.

Check out my [previous adventure with a D-Link router](https://jpdias.me/hardware/2021/02/02/adventures-in-reverse-dlink.html) for a practical example of this workflow - bootloader access, firmware extraction, and finding vulnerabilities in plain text configuration files.

## Radio Waves: The Invisible Attack Surface

IoT devices love wireless communication, and most of it happens on unlicensed bands that you can legally intercept. For the other bands, you can at least *hear them*. Get a [NooElec RTL-SDR dongle](https://www.nooelec.com/store/sdr.html) for around $30 and suddenly you can see the radio spectrum. 433MHz, 868MHz, 915MHz -- these frequencies are where garage doors, weather stations, car key fobs, and cheap IoT sensors live.

Start with [SDR#](https://airspy.com/download/) or [GQRX](https://gqrx.dk/) to visualize signals. Most protocols are simple -- no encryption, predictable patterns, and easily susceptible to replay attacks. That smart doorbell? Probably sending data in plain text -- and a good prank to make your neighbor's bell ring. Your car's tire pressure sensors? Definitely no authentication.

Don't forget about 2.4GHz either. WiFi and Bluetooth are everywhere, with a lot of WEP access points still in the wild, as well as hardcoded authentication on Bluetooth low energy -- that you can play with using some cheap [micro:bits](https://microbit.org/) and [btlejack](https://github.com/virtualabs/btlejack).


## 3, 2, 1, *GO!*

Hardware hacking isn't about expensive gear or obscure exploits. It's about learning the concepts, trying things out, letting some magic smoke escape, and finding that juicy UART port that already has the debug pins soldered from the factory. Start with simple tools, find targets, and explore. The hardware world is full of secrets hiding in plain sight, sometimes even labeled.

If you participated in the village, thank you for attending. And, as always, kudos to ØxＯＰＯＳɆＣ, to the event organizers and to the community that keeps these events alive.

*P.S.* If you want to get some inspiration on what hardware to buy, check my [previous post about my go-to toolkit](https://jpdias.me/security/2024/05/05/hardware-hacking-inventory.html).