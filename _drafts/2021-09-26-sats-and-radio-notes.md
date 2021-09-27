---
layout: post
title:  "Listening to Satellites and Other Adventures"
categories: [radio, space, sdr]
tags: [radio, satellites, sdr]
thumbnail: /images/sats21/iss.jpg
description: "Notes on listenning to satellites and other space- and earth-craft."
---

Radio communications always had my curiosity, but little to no focus. Recently I brought a Software-defined Radio (SDR) and started doing some experiments... and now I'm building my own antennas for receiving satellite images. These are some field notes on radio waves and others.

<!--more-->

A SDR is a *radio communication system where components that have been traditionally implemented in hardware are instead implemented by means of software*[^1]. Components such as modulators, demodulators, and tuners that are traditionally implemented in analogue hardware components, can be nowadays implemented in software by leveraging technology such as analogue to digital converters (ADC). There are several use-cases for SDR technology since they enable the changing radio protocols in real time while using the same hardware.

## SDR Hardware 101

The one I brought was a [Nooelec NESDR SMArt v4 SDR](https://www.nooelec.com/store/nesdr-smart-sdr.html) (~30€). This model, similarly to other popular ones, including the [RTL-SDR](https://www.rtl-sdr.com/about-rtl-sdr/), share the same [RTL2832U](https://www.realtek.com/en/products/communications-network-ics/item/rtl2832u) chipset, which was originally developed by Realtek as a high-performance DVB-T COFDM demodulator with USB 2.0 support. Palosaari *et al.* found out that it was possible to access the raw I/Q data of these cheap DVB-T dongle, access made simple by the [custom software driver](https://osmocom.org/projects/rtl-sdr/wiki/Rtl-sdr) developed by Steve Markgraf.

There are some characteristics of these low-cost SDRs that are a good insight to their functioning (using the mentioned Nooelec as a reference):
- Approx. Frequency Range: 24MHz - 1750MHz
    - Lower frequencies -- i.e. shortwaves -- can be reach using a cheap [upconverter](https://www.nooelec.com/store/sdr/sdr-addons/ham-it-up.html);
- Rx only:
    - Reduces the capability of creating radio interferences and make other mistakes while experimenting with it;
- SMA Female antenna connector:
    - Another adapter hell (SMA/BNC/UHF/N/F/...);
- Maximum sample rate is 3.2 MS/s (mega samples per second):
    - Too low sample rates can cause problems when demodulating/decoding signals;
- ADC native resolution is 8 bits:
    - This impacts directly the Signal to Noise Ratio (SNR), value that compares the level of a desired signal to the level of background noise;
    - The [theoretical SNR](https://www.analog.com/en/analog-dialogue/articles/adc-input-noise.html) of a perfect **N**-bit ADC is given by 6.02 dB * **N** + 1.76 dB;
    - This results in a ~50 dB Signal to noise ratio, [but most signals do not come closer to that value](https://www.reddit.com/r/RTLSDR/comments/e96308/comment/fagpnui/);
- ~75 Ohm input impedance[^2]:
    - Most common (standard) impedance is 50 Ohm (50 Ohm cabling on a 75 Ohm input will be less than 0.177 dB);
    - Impedance should be close among the components in a given setup (mismatch in impedance leads to voltage and current reflections);
    - For consistency’s sake, all other hardware, antennas, and such will be considered to work at 50 Ohm.

This gives an overview of the key hardware terms of the functioning of an SDR. Other hardware concepts will be introduced as needed (filters, antennas, and others).

## SDR Software 101

Since we reduce the reliance on hardware parts, we require *lots* of software to complete the missing pieces. If you are in a Windows machine, [SDR# from Airspy](https://airspy.com/download/) is a good place to start (and brings together all the drivers and stuff you need to start playing around). 

In a Linux machine start by installing the RTL-SDR drivers from your package manager or [source](https://osmocom.org/projects/rtl-sdr/wiki/Rtl-sdr). After that, it is time to start to navigate in the spectrum. There are several *clients*, the next are a few ones:
- [Gqrx](https://github.com/gqrx-sdr/gqrx), SDR receiver implemented using GNU Radio and the Qt GUI toolkit (will be used as a reference).
- [SDR++](https://github.com/AlexandreRouma/SDRPlusPlus), SDR software with the aim of being bloat free and simple to use.
- [gnuradio](https://github.com/gnuradio/gnuradio), toolkit that provides signal processing blocks to implement software radios.
- [SDRangel](https://github.com/f4exb/sdrangel), SDR and signal analyzer frontend to various hardware.

Similarly, other software will be introduced as needed.

## Listening to 433Mhz Signals

Part of the **industrial, scientific and medical (ISM) radio band** (which includes 433.92 MHz, 915 MHz, and 2400 MHz) it is widely used for common appliances such as garage door openers, wireless alarm or monitoring systems, industrial remote controls, smart sensor applications, and wireless home automation systems. 

Due to its widespread use, this is one of the bands easier to receive, analyze, demodulate and decode. A simple and cheap monopole (e.g., telescopic) or dipole antenna approximately tuned to these frequencies is able to receive signals.

## Airplanes and Stuff

## Receiving Weather Images

## ISS Signals

## Morse, Number Stations, and World Radio

## Above 1.8Ghz

## Other links

- [Where and which SDR to buy?](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/)
- [SDR quick start guide](https://www.rtl-sdr.com/rtl-sdr-quick-start-guide/)


[^1]: [Software-defined radio, Wikipedia](https://en.wikipedia.org/wiki/Software-defined_radio).
[^2]: [Impedance of the electrical load should matche the impedance of the power or driving source](https://www.data-alliance.net/blog/vswr-impedance-matching-in-antennas/).