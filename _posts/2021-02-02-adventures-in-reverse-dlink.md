---
layout: post
title: "Adventures in Reverse: D-Link DVA-G3170i"
categories: [hardware]
tags: [hardware, reverse, iot, router]
thumbnail: /images/dlink21/uart3.jpg
description: "Hardware and Software Reverse Engineering an ADSL modem + router, the D-Link DVA-G3170i/PT (2011)"
---

There are places over Portugal where fibre connections are still a mirage, and all we've got are DSL connections, more specifically Asymmetric DSL (ADSL). The ISP modem + router combo has been updated through the years, and some old ones have been left behind. One of those was a D-Link DVA-G3170i from 2011, which seemed a good practice target for some hardware reversing.

<!--more-->

<center>
<img style="max-width: 50%;" src="/images/dlink21/connections.svg"/>
</center>

The DVA-G3170i ADSL2+ VoIP is an ADSL router with one 10/100BASE-T RJ45 LAN port and wireless access point IEEE 802.11g-2003. It supports wireless security with WEP, WPA, WPA2 or WPA/WPA2. Internet connectivity can be established using Dynamic IP Address, Static IP Address, PPPoE (PPP over Ethernet), PPPoA (PPP over ATM) and Bridge Mode. The device also has VoIP capabilities.

| Default IP   | Mask          |
| ------------ | ------------- |
| 192.168.10.1 | 255.255.255.0 |

The device itself has 7 front-panel LEDs, from top to bottom: Internet status, DSL (Link/Act), VoIP, WLAN, LAN (Link/Act), Init and Power. It also has a RESET button. This information comes from the [User Manual (PT)](http://imgs.sapo.pt/images/AJUDA2009/Manual_DVA-G3170i.pdf) which also states that the credentials to the admin interface are _admin_ / _admin_.

The first step will be a full visual inspection and understanding what the different system's parts do by searching for their documentation. The Web Admin interface is then presented, but without much detail (since it's not the main focus). Moving to _breaking things_ we'll look for different ways to access the device (both by hardware and software means) and getting to **root**. A focus will be given on understanding how the device operates (boot, reset, SSID/Wireless Password generation). Finally, we will inspect some curious binaries and dump some stuff. _Let's Get to It!_

## Visual Inspection and Hardware Overview

![PCB view](/images/dlink21/physical.jpeg)

Opening the router by removing the two screws under the rubber protections lets us take a better look at the PCB:

- **RTL8201CP** is a single-chip/single-port PHYceiver with an MII (Media Independent Interface)/SNI (Serial Network Interface). It implements all 10/100M Ethernet Physical-layer functions including the Physical Coding Sublayer (PCS), Physical Medium Attachment (PMA), Twisted Pair Physical Medium Dependent Sublayer (TP-PMD), with an auto crossover detection function, 10Base-Tx Encoder/Decoder, and Twisted Pair Media Access Unit (TPMAU). [Datasheet.](http://realtek.info/pdf/rtl8201cp.pdf)

- **Infineon PSB 50702E** Infineon® DANUBEADSL2/2+ IAD-on-Chip Solution for CPE Applications is a Single-chip solution for ADSL2/2+ with integrated 2-Channel Analog CODEC for IADs and Home Gateways. It has (1) Protocol Acceleration FW for MPoA, NAT and others for CPU off-load, (2) Dual 32-bit MIPS 24KEc RISC processors @333 MHz, (3) Multi Media Card Interface (SD/MMCI), (4) USB 2.0 host/device, and (5) SPI with DMA support. [More details.](https://www.infineon.com/dgdl/CPE_Brochure.pdf?fileId=db3a3043156fd5730115c6e3248c0fec)

- **NANYA NT5DS16M16CS-6K** is a DRAM Chip DDR SDRAM 256Mbit 16Mx16 2.5V 66-Pin TSOP-II.

- **Eon Silicon Solution EN29LV640B-90TIP** (not visible in the image --- backplane): 8 Megabit (1024K x 8-bit / 512K x 16-bit), electrically erasable, read/write non-volatile flash memory, CMOS 3.0 Volt-only.

- **PEF 4268T** SLIC-DC Subscriber Line Interface Circuit with Integrated DC/DC Converter.

It also has what seems a UART port with already soldered pins, a JTAG-like pinout, and a lot of unpopulated spots. This goes according to the idea that DLink produced a base PCB and then configured features accordingly to agreements with different ISPs. As an example, the SoC supports USB and SD card interfaces, but no socket is present. The SoC also exposes a JTAG interface (that probably corresponds to the pins just by the _WiFi antenna_ label), but this was not explored since UART worked.

## Admin Interface

Regarding the admin interface, running on `192.168.10.1:8080`, the login is made using _basic access authentication_ with the credentials stated in the user manual. From there we can access the available menus which are common to any modem+router: DSL connection, WiFi management, Firewall, Updates, Statues...

<div class="row" style="text-align:center">
  <div class="column">
    <img src="/images/dlink21/interface.png">
  </div>
  <div class="column">
    <img style="width: 70%;" src="/images/dlink21/interface2.png">
  </div>
</div>

A quick look into the interface did not reveal any significant information. A minor detail is that the credentials for everything (WiFi, DSL, and so on) are rendered on the interface, so removing the input type _password_ makes them visible. This would provide an attacker direct access to these credentials once they bypassed the _basic auth_.

## Getting Access

A quick `nmap shows that the router exposes several open ports:

```text
23/tcp    open  telnet         D-Link DVA-G3170i telnetd
80/tcp    open  http           ALPHA-WebServer 1.0
443/tcp   open  ssl/http       ALPHA-WebServer 1.0
7001/tcp  open  afs3-callback?
7002/tcp  open  afs3-prserver?
7004/tcp  open  afs3-kaserver?
50000/TCP open  upnp
```

We also have physical UART and JTAG ports that we can use. Since I wanted to explore UART more than `telnet`, my first approach was to understand the UART port (I know it would be wiser to start by telnet, but why not?). However, it requires to find the right GND/RX/TX pins combination first.

With a multimeter, it was easy to find out the GND pin with a connectivity test, and the VCC with a volt check, which showed that the board ran at 3.3V. However, finding the right RX / TX required some extra work. Connecting a cheap logic analyzer to the GND/RX/TX pins, and using the [Saleae Logic 2 Alpha _software_](https://www.saleae.com/downloads/), allowed to find the right combination. You may have to adjust the capture frequency in the Saleae software for the device's proper functioning.

<div class="row" style="text-align:center">
  <div class="column">
    <img src="/images/dlink21/uart1.jpg">
  </div>
  <div class="column">
    <img src="/images/dlink21/uart2.jpg">
  </div>
  <div class="column">
    <img src="/images/dlink21/uart3.jpg">
  </div>
</div>

![Logic analyzer view](/images/dlink21/logic.png)

The only missing thing was to find the right baud rate to connect to the UART port, which can be achieved by checking the transmission time of one bit, calculate the inverse and multiply by 1 000 000. The transmission time is approximately 8.688uS: (1/8.688)\*1000000 = 115101, which is close to the common baudrate of 115200.

Connecting the USB to UART (FT232 USB UART) to the exposed pins (do not forget, RX of the router to TX of the FT and TX of the router to the FT RX), connecting to the device using `screen`, and connecting the device to power, and we have a UBoot loading!

`$ screen /dev/ttyUSB1 115200`

```text
ROM VER: 1.0.3
CFG 01
Read
ROM VER: 1.0.3
CFG 01
Read EEPROM
 X

1.0.2 (Dec  1 2008 - 13:39:09)

DRAM:  32 MB
 relocate_code start
 relocate code finish.

Manf ID:0000007f
Vendor ID:000000cb
Flash:  8 MB
In:    serial
Out:   serial
Err:   serial
Net:   ethaddr=00:22:B0:F0:15:9B
DO GPIO2 PULL HIGH OK for USB POWER ON
danube SwitchDO GPIO30 SW_RESET OK

Type "run flash_flash" to start Linux kernel

Hit any key to stop autoboot:  3 ... 2 ... 1 ... 0
## Booting image at b0080000 ...
   Image Name:   MIPS Linux-2.4.31
   Created:      2009-10-01   9:55:04 UTC
   Image Type:   MIPS Linux Kernel Image (lzma compressed)
   Data Size:    4902944 Bytes =  4.7 MB
   Load Address: 80002000
   Entry Point:  801ec040
   Verifying Checksum ... OK
   Uncompressing Kernel Image ... OK

Starting kernel ...

Reserving memory for CP1 @0xa1f00000
memsize=32l
flash_start=0xb0000000
flash_size=8388608l
```

We have some new information as a result of this capture:

- 32 MB of DRAM (which checks with the NANYA NT5DS16M16CS-6K chip description)
- 8 MB of flash (which also matches the EN29LV640B-90TIP specification)
- The processor is MIPS and runs Linux (`Image Name: MIPS Linux-2.4.31`)
- The image is `lzma compressed`, [relevant man page](https://linux.die.net/man/1/lzma).
- The flash size is `8388608l` and starts at address `0xb0000000`.

By interrupting the boot by pressing any key (`Hit any key to stop autoboot: 3 ... 2 ... 1 ... 0`) we enter U-boot. The U-boot is the device bootloader, understands the device's memory map, starts the main firmware execution and carries other low-level tasks. For more about the common commands and features [RTFM](https://www.denx.de/wiki/view/DULG/UBootCommandLineInterface).

Two main tasks can be done using the U-boot CLI for reverse engineering purposes: (1) understanding the memory map and, potentially, exfil the firmware and (2) bypass the authentication protection of the Linux image with the `init=/bin/sh` trick. [@cybergibbons](https://twitter.com/cybergibbons) has two very good videos on that: [Rooting via Uboot](https://www.youtube.com/watch?v=fvYpDx9nI78) and [Firmware Recovery](https://www.youtube.com/watch?v=v6ihoqTNuKg).

Although neither of those tasks was carried we can see some interesting U-boot applets present (only a few selected ones are shown):

```text
DANUBE # help
bdinfo  - print Board Infostructure
ping    - Send ICMP ECHO_REQUEST to network host
printenv- print environment variables
setenv  - set environment variables
tftpboot- boot image via network using TFTP protocol
```

And some extra information can be collected using `bdinfo`:

```text
DANUBE # bdinfo
boot_params = 0x81F7BFB0
memstart    = 0x80000000
memsize     = 0x02000000
flashstart  = 0xB0000000
flashsize   = 0x00800000
flashoffset = 0x00000000
ethaddr     = 00:22:B0:F0:15:9B
ip_addr     = 5.26.62.222
baudrate    = 115200 bps
```

And also from the environment variables using `printenv` (only a few selected entries are shown):

```text
DANUBE # printenv
bootcmd=run flash_flash
f_firmware_size=0x00027000
f_firmware_addr=0xb0040000
ipaddr=5.26.62.222
serverip=5.26.62.23
```

We could carry tasks such as boot a firmware over TFTP or change the bootcmd to anything we needed. However, as it will be shown, this was not required since the device has default credentials to **root**.

## I'm Root

Letting the device boot completely while connected over UART we can click any key for the Login prompt to appear. Using the default credentials of most DLink routers, _admin_ / _admin_, we can log in as **root**.

```bash
BusyBox v1.00 (2009.10.01-09:47+0000) Built-in shell (msh)
Enter 'help' for a list of built-in commands.
```

BusyBox provides a set of Linux applets to interact with embedded Linux devices. Dumping some info using the available applets (shortened):

```bash
DVA-G3170i/PT # uname -a
Linux (none) 2.4.31-Danube-3.3.0-G0432V33_BSP #1 Sat Jan 10 09:47:00 CET 2009 mips

DVA-G3170i/PT # cat /proc/cpuinfo
system type : DANUBE
processor : 0
CPU model : unknown V4.1
BogoMIPS : 222.00


DVA-G3170i/PT # cat /proc/meminfo
total: used: free: shared: buffers: cached:
Mem: 27942912 26931200 1011712 0 2961408 8605696

DVA-G3170i/PT # ls
www       tmp       proc      htdocs    etc
var       sbin      mnt       home      dev
usr       root      lib       firmware  bin
```

## Exfil Files

One strategy used was to log all the interactions using `screen` to a file and then recover the files manually:
`$ screen -L /dev/ttyUSB0 -L` creates a `screenlog.0` automatically with a record of all interaction.

Another strategy would be to extract the firmware from the SPI flash chip with a similar process as the one carried in a [previous blog post](/hardware/msi/bios/2020/05/10/back-from-the-dead.html).

The available `telnet` service was used for quickest access: `$ telnet 192.168.10.1` with the same credentials as the Web Admin GUI: _admin_ / _admin_.

With this, and using one of the applets available in the BusyBox, the `tftp` client, it was possible to retrieve/send files from/to a remote host. This allows to quickly transfer files from the device, easing the process of inspecting them. For creating an instant and temporary TFTP server, the [`py3tftp`](https://github.com/sirMackk/py3tftp) was used (after trying several other options without success). As an example, to extract the `firmware.bin` which can be found in the `/firmware` folder one can do:

1. In the local machine: `$ py3tftp --host 0.0.0.0 -p 2121 -v`
2. In the router: `DVA-G3170i/PT # tftp -p -l /firmware/firmware.bin 192.168.10.x 2121`

## What happens at boot?

To better understand what happens when the device boots more cleanly, a factory reset was made by clicking the RESET button. The `HOUSEKEEPER` process detects that the button is pressed for 5 seconds and then reboots the device.

```text
00:06:08 HOUSEKEEPER: factory reset button pressed for 1 secs
...
00:06:12 HOUSEKEEPER: factory reset button pressed for 5 secs
00:06:14 HOUSEKEEPER: trigger FACTORY RESET...
```

Most of the called scripts are either stopping or resetting services. After that, some extra scripts are called to do what seems to be the device's bootstrapping. After that, the device reboots itself and does a standard boot procedure (as shown before).

```text
[/usr/sbin/submit] FRESET ...
[/etc/scripts/misc/freset.sh] ...
[/etc/templates/wan.sh] [stop] [] ...
[/etc/templates/igmpproxy.sh] stop ...
[/etc/scripts/misc/profile.sh] reset ...
[/etc/scripts/misc/profile_action.sh] reset ...
[/etc/scripts/misc/defnodes.sh] ...
[/etc/defnodes/S10syncnodes.sh] ...
[/etc/defnodes/S11setext.sh] ...
PHP [/etc/defnodes/S12setnodes.php] ...
[/etc/defnodes/S13setext.sh] ...
PHP [/etc/defnodes/S14setnodes.php] ...
PHP [/etc/defnodes/S16features.php] ...
PHP [/etc/defnodes/S20setnodes.php] ...
PHP [/etc/defnodes/S40brand.php] ...
PHP [/etc/defnodes/S50showdect.php] ...
[/etc/scripts/misc/defnodes.sh] Done !!
[/etc/scripts/misc/profile.sh] put ...
[/etc/scripts/misc/profile_action.sh] put ...
[/etc/scripts/misc/freset.sh] reset config done !

The system is going down NOW !!

```

The scripts are located in the `/etc` folder in different folders, with some being `sh's and others ` PHP's. This is useful since now we known where to look to understand specific parts of the behaviour of the router, including how it generates the WiFi passkey or how it sets the transmit power of the WiFi (which implies that it stores information about the country of operation).

## Wireless and WPA Key Generation

Since this is a pretty old router, the WPA key generation algorithm is well-known and part of the [Router Keygen](http://routerkeygen.github.io) application. Implementation is open-source and available [here](https://github.com/routerkeygen/routerkeygenAndroid/blob/master/android/routerKeygen/src/main/java/org/exobel/routerkeygen/algorithms/DlinkKeygen.java). First off, the WiFi SSID and passkey should be stored somewhere in the device. After some search in the boot log file, the following lines caught my attention:

```text
Start ALL WLAN ...
[/etc/templates/wlan.sh] start 1 ...
[/var/run/wlan_if_start1.sh] ...
Start setup WLAN interface ath0 ...
```

Looking into the `/etc/templates/wlan.sh` script we can observe several curious things:

```sh
TEMPLATES="/etc/templates/wifi"
WLAN=`rgdb -i -g /runtime/lan/wlan/enable`
OPERATE_MODE=`rgdb -i -g /wireless/ap_mode`
#...
case "$1" in
1|start|restart)
#...
        if [ "$OPERATE_MODE" = "0" -o "$OPERATE_MODE" = "" ]; then
                rgdb -A $TEMPLATES/wlan_if_run.php -V generate_start=1 -V wlanid=$2 > /var/run/wlan_if_start$2.sh
                rgdb -A $TEMPLATES/wlan_if_run.php -V generate_start=0 -V wlanid=$2 > /var/run/wlan_if_stop$2.sh
#...
```

First, there is a utility called `rgdb` that allows one to retrieve configuration values, e.g. the `OPERATE_MODE`. `rgdb` is an alias for the `rgbin` binary, and from [here](https://forum.kitz.co.uk/index.php?topic=10635.90):" `/usr/sbin/bin` appears to be the userspace utility for reading and writing the "NVRAM" area of flash. In the NVRAM area is that gzip'ed XML MIB file which contains the configuration parameters to disable LAN access and lock the device."

### `hostapd` file

Looking into the PHP script `wlan_if_run.php` which is located in the folder `/etc/templates/WiFi`, we can see that it checks for any changes in the system configuration (I supposed that these changes correspond to the ones made using the Web Admin GUI) and updates the system files accordingly, including the `hostapd` config file:
`$hostapd_conf = "/var/run/hostapd".$wlanid.".conf";`. Looking for the config file in the `/var/run/` we can find it:

```text
#/var/run/hostapd1.conf

interface=ath0
bridge=br0
ssid=DLink-F0159B
wpa=1
driver=madwifi
ieee8021x=0
eapol_key_index_workaround=0
logger_syslog=0
logger_syslog_level=0
logger_stdout=0
logger_stdout_level=0
debug=0
wpa_group_rekey=3600
wpa_pairwise=TKIP
wpa_key_mgmt=WPA-PSK
wpa_passphrase=8XYXNqrqX85XX5rN8q8Y
```

Here we can see the SSID of the network, in this case, `DLink-F0159B` and the generated password (remember that we did a RESET): `8XYXNqrqX85XX5rN8q8Y`.

- The generation of **SSID** was evident: the MAC address of the device is `00:22:B0:F0:15:9B` and the SSID is `DLink-` plus the last 3 pairs of hex digits without the separator: `F0159B`.
- The generation of the **password** was a little more _fun_ to discover. While this could be configured manually in the device's firmware, this would imply extra costs for the manufacturer (each device would have to persist a unique token); thus, it is not common. More common is that the _script_ that generates the passwords is stored on the device and _when the device is booted for the first time (or RESETed)_ it uses some `logic` to define a unique password. This password can either be always the same for a specific device or not depending on the _seed_ used, but, once again, the first is more common.

Further looking into the boot logs and the WLAN related scripts something pop-out with the word keygen in it (file `/etc/defnodes/S13setext.sh`):

```sh
#!/bin/sh
echo [$0] ... > /dev/console
LANMAC=`rgdb -i -g /runtime/layout/lanmac`
WLANMAC=`rgdb -i -g /runtime/layout/wlanmac`
DSL_WANIF_MAX=`rgdb -i -g /runtime/layout/dsl_wanif_max`
WLANIF_MAX=`rgdb -i -g /runtime/layout/wlanif_max`
bootcodeversion=`rgdb -i -g /runtime/sys/info/bootcodeversion`

#ADSL WANMAC
i=1
while [ "$i" -ge 1 -a "$i" -le "$DSL_WANIF_MAX" ]; do
        xmldbc -x /runtime/wanmac/wanmac$i "get:alpha_macaddr $LANMAC 0 $i"
        i=`expr $i + 1`
done

#WLAN MAC
i=1
j=0
while [ "$i" -ge 0 -a "$i" -le "$WLANIF_MAX" ]; do
    xmldbc -x /runtime/wlanmac/wlanmac$i "get:alpha_macaddr $WLANMAC 1 $j"
    i=`expr $i + 1`
        j=`expr $j + 1`
done

#bootcodeversion
bootcodeversion=`echo $bootcodeversion | tr -d  \"`
rgdb -i -s /runtime/sys/info/bootcodeversion "$bootcodeversion"

#wpa-psk keygen
xmldbc -x /runtime/wpakey "get:wpakeygen $LANMAC"
```

A new curious binary appears, the `xmldbc`, which is located in `/usr/sbin/xmldbc`. From [here](): "the `xmldbc` tool has all the commands needed to set the elements (nodes) in the XML MIB", MIB standing for management information base, which is a database used for managing the entities in a communication network. It can also run commands and set variables in the MIB with the result. So this appears to be where the `wpa-psk` is generated and, then, stored. The command executed is `wpakeygen $LANMAC` where the `$LANMAC` is equal to the `$WLANMAC` one.

### Reversing the `wpakeygen`

Looking for the `wpakeygen` binary, we can find it in the same folder: `/usr/sbin/wpakeygen`. Transfering the binary to my machine using the configured TFTP allows one to debug it and understand what it does to generate the key. Firing up Ghidra with it we can confirm that it is indeed a MIPS binary:

```text
ELF 32-bit MSB executable
    MIPS
    MIPS32 version 1 (SYSV)
    dynamically linked
    interpreter /lib/ld-uClibc.so.0
    stripped
```

Looking for the main function in the function tree we can find the `wpakeygen_main` which seems a rather good candidate, so lets look at the p-code:

<center>
<img style="max-width: 65%;" src="/images/dlink21/ghidra-pcode.png"/>
</center>

The first part of the code, which is not shown, defines the variables and reads the `MAC` as the argument. Then the function `Alpha_MACString_Remove_Separator` is called, and, by its name, we can conclude that it removes the MAC address separator between the pairs of hex digits. In the following lines, this function's return is stored (including repetitions), in a mostly-random way, in a _string_ with 20 chars of size.

Lastly, an iteration over those 20 chars is carried, and in the last lines of the loop, a resulting `index` value is used to get something (a char) from a memory position. Searching for that position in the memory, we find the scalar `XrqaHNpdSYw86215U`. So the password is made of chars taken from random positions of that scalar string (of 17 chars), giving a final password of 20 chars, which meaning that bruteforcing would result in 17^20 possibilities, which equals: `4 064 231 406 647 572 522 401 601`. So, bruteforcing would take some time...

So, let us reverse the remaining p-code:

- `uVar1 = (int)local_60[i] - 0x30;` : Takes the char at pos `i` and subtracts `0x30`;
- The following `if` does a lot of things, breaking it into parts by the `&&`:
  - `(9 < (uVar1 & 0xff)` verifies that `uVar1 & 0xff` is greater than `9`;
  - `(iVar2 = (int)*(char *)(local_60[i] * 2 + __ctype_toupper + 1), uVar1 = iVar2 - 0x37, 5 < ())` also does lots of stuff using the `comma operator`. In a condition, the comma operator runs all the instructions but only evaluates the value of the rightmost one, which is `iVar2 - 0x41U & 0xff > 5`. The remaning ones:
    - `iVar2 = (int)*(char *)(local_60[i] * 2 + __ctype_toupper + 1)` converts the `local_60[i]` to uppercase;
    - `uVar1 = iVar2 - 0x37` just updates the value of `uVar1` by subtracting `0x37` to `iVar2`.

At last, the resulting `wpa-psk` is printed with `printf`.

Converting all of this logic to Python gives something similar to the following:

{% highlight python linenos %}
magic_key = "XrqaHNpdSYw86215U"
mac = list("0022B0F0159B".replace(':', ''))
str1 = [""]\*20

str1[1] = mac[0]
str1[7] = mac[3]
str1[8] = mac[7];
str1[19] = mac[10];
str1[2] = mac[10];
str1[11] = mac[5];
str1[12] = mac[1];
str1[13] = mac[6];
str1[14] = mac[8];
str1[15] = mac[9];
str1[16] = mac[11];
str1[17] = mac[2];
str1[18] = mac[4];
str1[0] = mac[11];
str1[3] = mac[1];
str1[4] = mac[9];
str1[5] = mac[2];
str1[6] = mac[8];
str1[9] = mac[4];
str1[10] = mac[6];

i=0
result=[""]\*20
index = ""
tempvar1 = 0
tempvar2 = 0
while(True):
t = ord(str1[i]);

    tempvar1 = t - 0x30

    if (tempvar1 & 0xff) > 9:
        tempvar2 = ord(str1[i].upper())
        tempvar1 = tempvar2 - 0x37
        if (tempvar2 - 0x41 & 0xff) > 5:
            print("error")
            break

    result[i] = magic_key[tempvar1]
    i=i+1
    if i >= 20:
        print("".join(result))
        break

{% endhighlight %}

## Exploring the `xmldbc` and `rgbd` binaries

Both the `xmldbc` and `rgbd` are used to interact with stored values in the system. These binaries have been used in the DLink routers for years, and one funny trick with `xmldbc` is that the binary can be used to dump all the persistent configurations of the router:

```text
DVA-G3170i/PT # xmldbc -d /tmp/dump.xml
DVA-G3170i/PT # cat /tmp/dump.xml

<dlink_dvag3170i_pt_A1LWFg_8f32r_1S>
;remaining 2659 lines
</dlink_dvag3170i_pt_A1LWFg_8f32r_1S>

DVA-G3170i/PT # tftp -p -l /tmp/dump.xml 192.168.x.x 2121
```

And we now have all the router configs which include:

- the username and password of the DSL line if configured (defaults shown):

```xml
<user>as0000000@sapo</user>
<password>master_ph!</password>
```

- all of the valid user credentials for accessing the router (defaults shown):

```xml
<user id="1">
    <name>admin</name>
    <password>admin</password>
    <group>0</group>
</user>
<user id="2">
    <name>user</name>
    <password>user</password>
    <group>1</group>
</user>
```

- the crendentials and endpoint of the ISP-configured TR-069[^1] ACS server (Auto Configuration Server (ACS) enables Telcos and ISPs to manage their devices remotely):

```xml
<managementserver>
    <username>██████████████</username>
    <password>██████████████</password>
    <url>http://███████████.███.sapo.pt:█████/cwmpWeb/CPEMgt</url>
</managementserver>
```

We can now use the same utility to change some configuration values, e.g.:

- Remove the PPPoE ISP block: `xmldbc -i -s /runtime/web/pppoelock 0`
- Remove the VoIP lock: `xmldbc -i -s /runtime/web/voiplock 0`
- Show the TR-069 menu on the Web Admin GUI: `xmldbc -i -s /runtime/web/tr069hide 0`
- Change the Firmware Description: `xmldbc -i -s /runtime/sys/info/firmwareVersion AmazingFirmware`

All of this modifications can also be carried using the Web Admin GUI, e.g.: [192.168.10.1/auth.xgi?set/runtime/web/tr069hide=0]().

<center>
<img style="max-width: 50%;" src="/images/dlink21/hacked.png"/>
</center>

## Wrap Up

The D-Link DVA-G3170i/PT proved to be a good practice target for hardware reverse engineering, by (1) the diversity of components used and (2) the various ways to use to get access to it. Main take-aways:

- The device has a lot of unpopulated sockets which indicates that D-Link produced several products using the same base PCB;
- The Web Admin GUI loads all the credentials from the configurations; if one gains access to the device, can extract all the credentials;
- Telnet is available, and login is made using default credentials (_admin_ / _admin_); UART and the Web Admin interface also uses the same credentials;
- Exfil files is an easy task if `tftp` or any other file transfer binary is present; alternatively, things such as `screen -L` can be used;
- Looking at the boot logs (especially when a `RESET` happens) is crucial to understand how the device bootstraps, and let us find the used scripts; it can also be useful to look at the running processes (`top`) and open ports `netstat -tulpn`;
- To find how the `wpa_passphrase` is generated (or configured) look for standard WiFi-related configurations such as `hostapd` and follow the _crumbs_ (boot logs, etc.);
- Look for _uncommon_ binaries since they're typically device (or brand) -specific and may have access to essential system parts. In this case, `xmldbc` and `rgbd` provide access to configuration files, and allows to retrieve and change them;
  ISPs typically limit what you can do with _your_ router, but this is accomplished most of the time by using manufacturer-tools, and one can use them to _unlock_ those features.

While this is by now a mostly-unused router, an advanced search using the [WiGLE](https://wigle.net/) shows that 138 unique APs are broadcasting an SSID with a similar format (`DLink-______`) and that share the same first three pairs of hex digits of the MAC address (manufacturer code), `00:22:B0`, in Portugal last seen of Jan of 2019. Given the history of people not changing default passwords, this can still be a problem today.

Query (must have an account on WiGLE): [https://wigle.net/search?lastupdt=20190101000000&netid=00%3A22%3AB0&ssidlike=DLink-\_\_\_\_\_\_&country=PT#fullSearch](https://wigle.net/search?lastupdt=20190101000000&netid=00%3A22%3AB0&ssidlike=DLink-______&country=PT#fullSearch)

Another _fun_ binary to do reverse would be the `led_gpio_ctl` which seems to be controlling the status LEDs. Maybe adventures for another time.

This post would not be possible without the help and contributions of [@Pedro_SEC_R](https://twitter.com/Pedro_SEC_R), [@0xz3z4d45](https://twitter.com/0xz3z4d45) and [@mluis](https://twitter.com/mluis). Kudos!

---

[^1]: [TR-069](https://en.wikipedia.org/wiki/TR-069) "is a technical specification of the Broadband Forum that defines an application layer protocol for remote management of customer-premises equipment (CPE) connected to an Internet Protocol (IP) network."
