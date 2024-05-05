---
layout: post
title: "Hardware hacking and research toolbox inventory"
categories: [security]
tags: [security,inventory,hacking,toolbox]
thumbnail: /images/hwinventory/wardriver.jpg
description: "My inventory of my hardware hacking and research toolbox"
---

Inspired by the blogpost [*My Red Team assessment hardware*](https://www.davidsopas.com/my-red-team-assessment-hardware-list/) by [David Sopas](https://www.davidsopas.com/) this post describes hardware tools that I have in my inventory, their purpose as well as the features/firmwares/tricks that motivated me to buy them. This is not intended to be an exhaustively detailed list, but I will try to give some rational and usecases for each of the tools, as well as categorize them.

<!--more-->

Do it yourself projects (partially or completely) will be marked as such with the tag [DIY]. URLs provided are either to the repositories, official websites or online sellers. If you find any URL broken please contact me, otherwise you can still find the tools by searching the name of them with any search engine. 

> **None of the links to online stores are sponsored in any way and should only be used as a reference.**

## Wi-Fi, Bluetooth and other radios

1. [DIY] [Wardriver.uk by Joseph Hewitt](https://github.com/JosephHewitt/wardriver_rev3)

    <center><img src="/images/hwinventory/wardriver.jpg" alt="wardriver" style="max-width:55%;text-align:center;"/></center>

    For wardriving[^1] purposes (2.4Ghz WiFi networks and Bluetooth devices) I have built a wardriver.uk based on the very detailed and nicely explained project by Joseph Hewitt, which outputs [Wigle compatible files](https://wigle.net/). You will need two ESP32 modules (ESP32-DevKitC V4 with ESP32-WROOM-32U is recommended), a GPS module, a SIM800L GSM module, an i2c LCD, a DS18B20 temperature sensor, and an SPI micro SD card reader/writer. I did wire it with some protoboards in the first version, then I ordered the PCB designed by the author. You can [order the PCBs from the author](https://www.tindie.com/products/jhewitt_net/portable-esp32-wardriver-pcb-only/) if you want to support the project. 

2. [DIY] [io433 by kripthor](https://github.com/kripthor/io433)

    <center><img src="/images/hwinventory/io433.jpg" alt="io433" style="max-width:55%;text-align:center;"/></center>
    
    IO433 is a ESP32 (TTGO T-Display) & CC1101 based 433Mhz sniffer and replayer for ASK-OOK signals. Building instructions are available in the repository of the project as well as the firmware and gerber files for the PCBs (altough I built one on top of a generic protoboard). It is a nice tool for playing around with 433Mhz based devices such as cheap weather monitors, door rings, and the like.

1. [Zsun wifi card reader](https://openwrt.org/toh/zsun/wifi-card-reader)

    Zsun is an Atheros AR9331 based wireless card reader with 64 MiB RAM and 16 MiB SPI flash. The specs are enough to run OpenWrt, which can make the device a tinny wireless AP / client / repeater.

1. [GL-MT300N-V2 Mini Smart Router](https://www.gl-inet.com/products/gl-mt300n-v2/)

    A small and cheap travel router that runs OpenWRT (128MB RAM, 16MB Flash ROM), with two RJ45 Ethernet ports, (micro)USB charging with UART and some GPIOs available. It also has a nice physical VPN switch button and a easily clickable reset button (ideal to start over when you fail to configure OpenWrt properly).

1. [DIY] [Throwing Star LAN Tap](https://greatscottgadgets.com/throwingstar/)

    Throwing Star LAN Tap is a passive Ethernet tap (read-only access via J3 and J4 ports), able to monitor 10BASET and 100BASETX networks. You cna build one by [printing the PCBs and soldering some capacitors and RJ45 ports (instructions available)](https://github.com/greatscottgadgets/throwing-star-lan-tap). Otherwise you can also [buy it in a ready to use package](https://greatscottgadgets.com/throwingstar/).

1. TP-Link

1. Alfa-like

1. [Nooelec NESDR SMArTee v2](https://www.nooelec.com/store/sdr/sdr-receivers/nesdr-smartee.html)

    A cheap and reliable SDR with RTL2832U Demodulator/USB interface IC and a R820T2 tuner IC. I advise to buy a bundler with some antennas which allows you to do some [nice experiments out of the box](/radio/space/sdr/2021/09/28/sats-and-radio-notes).


## Device inspection (debug tools and programmers)

1. [FT232 USB for TTL Serial Adapter for 3.3V and 5V](https://www.az-delivery.de/en/products/ftdi-adapter-ft232rl)

    FT232 USB UART Board is the go-to solution for USB-to-UART serial conversions. Different models have similar features. I carry two, one older model with miniUSB connection and another with USB A connection, and always together with a bunch of jumpers.

1. [USBASP 2.0 based on ATmega8A](https://www.fischl.de/usbasp/)

    <center><img src="/images/hwinventory/usbasp.jpg" alt="screw heads" style="max-width:35%;text-align:center;"/></center>


    USBasp is a USB in-circuit programmer for Atmel AVR controllers which are commonly used in smart devices and other controllers. Firmware is provided by [Thomas Fischl](https://www.fischl.de/) which has other cool projects.

1.  [Dongle ST-LINK V2 STM8 STM32](https://www.adafruit.com/product/2548)

    A ST-Link-Compatible Programmer & Emulator / Debugging dongle supporting both STM8 and STM32 bit processors series, that, similar to Arduino, are widely used in smart appliances.
    
1. [YS-IRTM 5V NEC Infrared UART transceiver](https://www.aliexpress.com/i/3256805645604603.html?gatewayAdapt=4itemAdapt)

    It consists of a dual 38KHz 940nm infrared (IR) TX/RX LEDs and a micro controller which provides a UART interface. Can not be used directly via USB, thus it is recommended to connect it via a generic microcontroller. You can use the following as a [reference](https://github.com/mcauser/micropython-ys-irtm).

1. [ELM327 V1.5 OBD2 Bluetooth Scanner and Diagnostic Tool](https://www.amazon.com/Advanced-Bluetooth-Scanner-Diagnostic-Android/dp/B09B2RNJH5)

    A generic OBD-II protocol reader that works with a lot of car models and brands. Mostly unused in my case as I did not delve into car hacking, but I do recommend a workshop for beginners like me just to understand the "world": [Remoticon 2020 // Learn How to Hack a Car Workshop](https://www.youtube.com/watch?v=NzgvRictI9o)

1. [CH341A USB Programmer with Adapters](https://www.amazon.com/KeeYees-SOIC8-EEPROM-CH341A-Programmer/dp/B07SHSL9X9)

    <center><img src="/images/hwinventory/ch341a.jpg" alt="ch341a" style="max-width:55%;text-align:center;"/></center>

    The CH341A USB Programmer supports most of the 24/25 series SOP8 chips (commonly used for BIOS), and can be used to back up, erase and program such chips. I have successfully used it in the past to [recover laptops from corrupted BIOS issues](/hardware/msi/bios/2020/05/10/back-from-the-dead.html). I also [3D printed a yellow case for it](https://www.thingiverse.com/thing:2192211).

1. [USB Logic Analyzer 24MHz 8 Channels](https://www.amazon.com/Ferwooh-Analyzer-Channel-Colourful-Debugging/dp/B0CYZG4WN4)

    A generic low-budget logical analyser that features 8 Channels and, theoretically, can go up to 24 MHz (but not really in practice). It is good enough for most low-baudrate analysis, but can struggler with higher baudrates (that are becomming common). Nonetheless a good tool to keep around, specially if you don't want to invest into a [Saleae](https://www.saleae.com/). Also, it is compatible with [Saleae Logic 2 software](https://www.saleae.com/), and, theoretically, with [sigrok](https://sigrok.org/wiki/Main_Page) but I didn't manage to put my version working correctly with it.

1. [DIY] [Logic probe](https://mitchelectronics.co.uk/resources/logic-probe-kit-instructions/)

    A simple and quick to use probe that you can build (several kits available) that can be useful to probe circuits when you do not have a multimeter/logic analyser at hand. You just connect it to a REF voltage source and GND, and then the 3 LEDs will tell the rest, if you have a Red Only it is a Logic 0, a Yellow Only is Floating, a Green Only is a Logic 1 and All LEDs means an oscillating signal.

1. [UNI-T UT139C Multimeter](https://meters.uni-trend.com/product/ut139-series/)

    A good multimeter is always a good investment (but, still, you don't need to go to the most expensive ones). Some of the most useful features beyond the trivial ones, from my perspective, are the frequency and temparature (℃/℉) readings.

## Smart cards 

1. [SIM card converter to Smartcard IC](https://www.aliexpress.com/i/2251832622613576.html)

    A SIM card to Smartcard IC converter and extension, supporting standard, micro and nano SIM cards. 
    
2. [PN532 NFC RFID IC Card Reader Module 13.56MHz with USB Port](https://www.aliexpress.com/item/1005006742238113.html)

    A [libNFC](https://github.com/nfc-tools/libnfc) compatible board that can be used to read/write to NFC cards, including Mifare classic cards. You can also keep some empty (UID-writable) cards around. There is a good [blogpost by Christian Mehlmauer on how to use the libNFC to crack Mifare classic cards](https://firefart.at/post/how-to-crack-mifare-classic-cards/), and [How to hack Mifare Classic NFC cards by lp1](https://medium.com/@lp1/how-to-hack-mifare-classic-nfc-cards-69c8edcbe1e7). 
    
## Generic boards

1. [Raspberry Pi Zero W with USB A add-on](https://geekworm.com/products/raspberry-pi-zero-w-badusb-usb-a-addon-board-usb-connector-case-kit)

    A [Raspberry Pi Zero W](https://www.raspberrypi.com/products/raspberry-pi-zero-w/) is a full computer on a stick, capable of running several Linux distros (no more intro needed). The USB A addon board allows it to be plugged to any USB port, and, more than that, to act as a U disk or even as a BadUSB[^2] with [P4wnP1 A.L.O.A.](https://github.com/RoganDawes/P4wnP1_aloa). P4wnP1 A.L.O.A. allows the Pi to have Plug&Play USB device emulation, HIDScript and Bluetooth and WiFi offensive analysis. Other usecases inclue the known [Pwnagotchi](https://pwnagotchi.ai/) for cracking Wi-Fis either through passive sniffing or by performing deauthentication and association attacks.

1. [nRF52840 Dongle](https://www.nordicsemi.com/Products/Development-hardware/nRF52840-Dongle)

    nRF52840 Dongle is a small USB dongle that supports Bluetooth 5.4, Bluetooth mesh, Thread, Zigbee, 802.15.4, ANT and 2.4 GHz proprietary protocols. It is useful to probe into this protocols, being knowned for the ability to [easily eavesdrop Bluetooth Low Energy communications and perform multiple active attacks based on InjectaBLE strategy](https://github.com/RCayre/injectable-firmware). It can also work as a security key using [Google OpenSK](https://github.com/google/OpenSK).

1. [M5Stack Core](https://shop.m5stack.com/products/esp32-basic-core-lot-development-kit-v2-7)

    An ESP32-based (Bluetooth + Wi-Fi) developer board in a really nice packaging, with built-in battery, 3 physical buttons and 20*240 IPS screen. One cool usecase is the [ESP32 WiFi Hash Monster](https://github.com/G4lile0/ESP32-WiFi-Hash-Monster) which can be used to capture all the EAPOL / PMKID packets on a SD Card for further analysis. Other usecase is the [MarauderCentauri](https://github.com/justcallmekoko/MarauderCentauri) for WiFi/Bluetooth offensive and defensive tools; you can also buy the full-fledge custom hardware at [justcallmekoko store](https://www.justcallmekokollc.com/product/esp32-marauder-v6/).

1. [DigiSpark Attiny85](https://www.amazon.com/Digispark-Kickstarter-ATTINY85-Arduino-Development/dp/B01MQOPY5C)

    A *tiny tiny* microcontroller with an USB A port that can be used as a BadUSB[^2]. It is so cheap that it is good for *plug it and leave* situations. A good tutorial for it done by [Baud on 0x00sec](https://0x00sec.org/t/a-complete-beginner-friendly-guide-to-the-digispark-badusb/8002/2).

1. [Micro:bit](http://microbit.org/)

    With 3 units you can sniff on all Bluetooth LE advertising channel, and with [BtleJack](https://github.com/virtualabs/btlejack) you can sniff, jam and hijack connections.

1. [Wemos D1 mini / ESP8266](https://www.wemos.cc/en/latest/d1/index.html), [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/), [Arduino Nano](https://store.arduino.cc/products/arduino-nano)

    Some of the boards that I typically carry around, some with Pin Headers soldered, others not. 

## Screwdrivers, Lockpick and others

1. [Mi x Wiha Precision Screwdriver (manual)](https://www.mi.com/global/support/article/KA-05106)

    <center><img src="/images/hwinventory/screwdriver.png" alt="screw heads" style="max-width:65%;text-align:center;"/></center>

    A generic precision screwdriver kit supporting most models of screw heads. Compact in size which is ideal for carry in a backpack.

1. [4-Way Multi-Functional Utilities Key](https://www.amazon.com/WILLBOND-Multi-Functional-Utilities-Electric-Cupboard/dp/B072LPLKP6)

1. [Generic Lockpick set with Practice locks](https://www.amazon.com/Professional-Security-Padlock-Practice-Stainless/dp/B0CSYFB7LZ)
   

## Random

1. [1Life usb:hub 3 with RTL8153 Gigabit Ethernet Adapter](https://1-life.eu/?product=1life-usbhub-3)

    A generic USB extension hub with a Gigabit Ethernet Adapter (based on the RTL8153) is a must have for when you have few USB ports or no RJ45 port. It is also useful if you want to connect to more than one physical network at the same time.

1. [Rii Wireless Mini X1 with Touchpad - 2.4GHz - QWERTY](https://www.kiwi-electronics.com/en/rii-wireless-mini-x1-with-touchpad-2-4ghz-qwerty-2565)

    An all-around wireless keyboard which is useful for a range of scenarios, e.g., configuring Raspberry Pi's.


1. [DIY] [Small IC Test Clips](https://www.aliexpress.com/item/1005006235506418.html), [Pogo pin clamps](https://www.aliexpress.com/item/1005005832969596.html) and [PCB Workstation with Needle-Probes](https://www.thingiverse.com/thing:2318886)

    <center><img src="/images/hwinventory/probe.jpg" alt="3d probe" style="max-width:65%;text-align:center;"/></center>

    Useful when probing PCBs and connecting to debug ports / test points. I totally recommend the 3D printed PCB workstation as it works for most PCBs and smallish traces and connections.

1. [Generic USB Multimeter](https://joy-it.net/en/products/JT-TC66C)

    Useful to troubleshoot USB connections (voltage and amperage). [More recent models (e.g., UM25C)](https://joy-it.net/en/products/JT-UM25C) also allow monitoring via Bluetooth connection.

1. Large assortment of cables and adapters

    There is no such thing as too many cables, as there is no such thing as too many adapters. A few that I recommend to have always around:
     - USB: A->C, C->A, C<->C, A->micro, A->nano, USB OTG, A<->Lightning
     - Video: HDMI<->HDMI, HDMI<->mini HDMI, VGA<->HDMI 
     - RJ45 
     - Assortment of jumpers (male->female, male<->male, female<->female)
     - MicroSD to SD adapter and SD card reader

1. Generic USB LED lamp (useful for low-light situation)

1. Assortment of USB Pens

    This keeps to be one of the things that I use the most (from live boots to install new OSes). You do not need to go to the fancy ones with USB-C and such if you keep some adapters at hand. [Ventoy](https://ventoy.net/en/index.html) is a nice tool to have several ISOs in the same drive and boot from them when needed. I also keep some Linux live USBs (with something such as Debian Stable), and [Clonezilla](https://clonezilla.org/).

### References

[^1]: *Wardriving is the act of searching for Wi-Fi wireless networks as well as cell towers, usually from a moving vehicle, using a laptop or smartphone.*, [Wikipedia](https://en.wikipedia.org/wiki/Wardriving)
[^2]: USB device has an in-built firmware feature that allows itself to be disguised as a human interface device (USB HID), such as a keyboard, and thus inject payloads via keystrokes.