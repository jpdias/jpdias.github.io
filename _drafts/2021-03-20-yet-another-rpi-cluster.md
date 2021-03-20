---
layout: post
title: "Yet Another Raspberry Pi Cluster"
categories: [hardware, devops]
tags: [raspberrypi, hardware, devops, iot, network]
thumbnail: /images/picluster/all.jpeg
description: "Yet another Raspberry Pi cluster build with some network, monitoring and automation perks"
---

Those who are hardware tinkers and hackers know how easy is to accumulate hardware thingies: single-board computers, microcontrollers, sensors and so on. Back in 2012 a new thingy appear that reshapped the meaning of low-cost and small single-board computers: [Raspberry Pi](https://www.raspberrypi.org/). It ability to run Linux and its exposed GPIO pins allowed it to become one of the most common pieces of hardware in every electronic enthusisast storage[^1]. As of today there are 5 different hardware families and more than 12 different models available. As a result, I had a few of these spread among storage shelfs but I always felt bad for having computing power just lying around and accumulating dust. The idea of using them as a computing cluster keept appearing on the usual places: [Hackaday](https://hackaday.com/2020/04/24/raspberry-pi-cluster-shows-you-the-ropes/)[^2], [OctaPi](https://www.raspberrypi.org/blog/octapi/), [hackster.io](https://www.hackster.io/aallan/a-4-node-raspberry-pi-cluster-e19273), ... so it appears that the time has come to do my own version. This would be a pretty good playground to carry experiments with networking, distributed computing, devops, etc.

<!--more-->

<center>
<img style="max-width: 70%;" src="/images/picluster/all.jpeg"/>
</center>

## Bill of Material

One of the objectives of this was to reduce the new purchases to a minimum (but, as always, this is more easily said than done). 

| Qty. | Part Name                                                                                                                  | New? |
|------|----------------------------------------------------------------------------------------------------------------------------|------|
| 1    | [ewent 4-port USB Charger 5.4A](https://www.ewent.com/en-us/4-port-smart-usb-charger-5-4a-ew1304)                          | Yes  |
| 1    | [Raspberry Pi Cluster Case 6-Layers](https://www.amazon.com/GeeekPi-Raspberry-Heatsinks-Stackable-Enclosure/dp/B085XT8W9S) | Yes  |
| 2    | Raspberry Pi 2 Model B Rev 1.1                                                                                             | 0,1  |
| 1    | Raspberry Pi 3 Model B Rev 1.2                                                                                             | 2    |
| 1    | Raspberry Pi Model B Rev 2                                                                                                 | 3    |
| 1    | TP-Link TL-WR841N v.9 (factory firmware)                                                                                   |      |
| 4    | Ethernet Cat. 5 (short, homemade from old cables)                                                                          |      |
| 4    | USB to Micro USB cable                                                                                                     | Yes  |
| 1    | microSD Card 8GB                                                                                                           |      |
| 2    | microSD Card 32GB                                                                                                          |      |
| 1    | SD Card 8GB                                                                                                                |      |


The 4-port USB Charger 5.4A is not the best option since each RPi can take around 2A, however, it was availble in a neaby store and since some of the Raspberry are older versions, it will likely suffice for the intended purpose. I, however, intend to upgrade all the system to use a common power supply unit (including the router).

## Operating System

First things first, there is the need to format all the SD cards with a Raspberry-compatible OS. Since this is for headless usage and wanted for things to quite work out of the box I picked the latest [Raspberry Pi OS Lite](https://www.raspberrypi.org/software/operating-systems/) from the official website, which is Debian-based and compatible with all hardware revisions. 

I flashed the SD cards using the [balenaEtcher](https://www.balena.io/etcher/). After the flashing is complete, one manual step is need to automatically enable SSH on first boot: just `touch` a file named `ssh` on the boot partition of the SD card (more [here](https://www.raspberrypi.org/documentation/remote-access/ssh/)). This allows full headless configuration of the Rasps.

## Network: A side-quest

So, my end-goal was to  be able to carry the cluster around when needd and be able to quickly:

1. Connect to a WiFi network to enable Internet-connectivity on the Rasps;
2. Have a totally segregated network with NAT for not depending on the upstream network;
3. Minimize the number of static configurations (i.e. no static IP addresses);
4. Make it easy to replace (or re-flash) or add new units to the cluster.

As a reference, the network diagram must be something like this:

```
┌────────────────┐
│raspberrypi0.lan├──┐
└────────────────┘  │
                    │
┌────────────────┐  │             ┌┐      ┌┐             ┌────────┐
│raspberrypi1.lan├──┤   ┌─────────┴┤ xxxx ├┴─────────┐   │        │
└────────────────┘  │   │ TP-Link  │      │ 3rd-Party├───┤Internet│
                    ├───┤ TL-WR841N│      │ Router/AP│   │        │
┌────────────────┐  │   └──────────┘      └──────────┘   └────────┘
│raspberrypi2.lan├──┤
└────────────────┘  │
                    │
┌────────────────┐  │
│raspberrypi3.lan├──┘
└────────────────┘
```

Typically in these kind of builds, swithces are used. However, for using no-static configurations (and even a `.lan` local name) will require a router and most home-grade routers have no functionalities that would favor this build, namely, using WiFi as client-mode to provide Internet, and, in consequence, the ability to bridge the WAN-port to the switch which adds an extra useful port to the router (since the Internet connection is provided by WiFi). Other perks such as VLAN management and others could be useful for latter experiments, so have such _advanced_ router management capabilities would be a plus.

### Finding a Working Firmware

I had 3 routers lying around, so the journey began of finding a proper alternative firmware that would provide such features. The best candidate among those was the [Linksys WRT54G](https://en.wikipedia.org/wiki/Linksys_WRT54G_series) ([more info]()) series, since it was one of the most well-supported series. However, the specific version that I have ([WRT54GS v7](http://en.techinfodepot.shoutwiki.com/wiki/Linksys_WRT54GS_v7.0)) is only supported by an old version of [DD-WRT](https://wiki.dd-wrt.com/wiki/index.php/How_To_Flash_the_WRT54GS_v7) mostly due to hardware limitations. After several hours messing around configurations several issues with local domain resolution and DHCP which led me to abandon it. 

The next one was an [ASUS RT-N12E_B](http://en.techinfodepot.shoutwiki.com/wiki/ASUS_RT-N12E_B1), which, suppousely, is supported by [OpenWRT](https://git.openwrt.org/?p=openwrt/openwrt.git;a=commit;h=58e0673900ea585b03d3cc2f8917667faa3f977f). However, after flashing I couldn't get the router to work in WiFi client mode (the signal was so weak that even with the 3rd-party router really close to it, it would not connect). After searching around I found out that there's an alternative firmware for it called [Padavan](https://bitbucket.org/padavan/rt-n56u/src/master/). This happens to be a pretty good all-around firmware, but had a down-side: I could not bridge the WAN port to the switch.

The last alternative was the [TP-Link TL-WR841N v.9](http://en.techinfodepot.shoutwiki.com/wiki/TP-LINK_TL-WR841N_v9.x). This router is compatible with [DD-WRT](https://wiki.dd-wrt.com/wiki/index.php/TP-Link_TL-WR841nd_v9), and after dealing with some region lock features (that made me flash the router with an older versioon of DD-WRT and then update it), it was ready to use.

### Configuring DD-WRT

First off, I wanted to be able to manage the 4 Raspberrys using my laptop, thus the need for 5 switch-connected ports. The first configuration required was to go to `Setup` and check the box `Assign WAN Port to Switch`.


[^1]: [_As of December 2019, more than thirty million boards have been sold._](https://twitter.com/EbenUpton/status/1205646606504275968)

[^2]: While writing this post, I found out that [this one](https://www.dinofizzotti.com/blog/2020-04-10-raspberry-pi-cluster-part-1-provisioning-with-ansible-and-temperature-monitoring-using-prometheus-and-grafana/) is pretty close (almost equal) to what I have built with a pretty similar motiviation.