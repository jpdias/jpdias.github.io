---
layout: post
title:  "Bsides Lisbon 2018 - Checkmarx (mini) CTF Write-Up"
categories: [infosec]
tags: [bsideslisbon, infosec, ctf]
---

During the past two days, I went to the [Bsides Lisbon](http://bsideslisbon.org/) conference. Among all the talks/workshops (that will be available [online](https://www.youtube.com/channel/UC_M0dk4dvcBr_rFgi710D4Q)), a CTF competition and two badge-based challenges (RFID-card and a hardware soldering badge) there were some sponsor mini-challenges for some random prizes (among them a fluffy ~~scary~~ teddy unicorn). This is the write-up of the *mini* CTF made by [Checkmarx](https://www.checkmarx.com/).
<!--more-->

The location (URL) of the challenges was spread among QR-codes in the conference venue (including repeated QR-codes), thus we didn't know if there was any sequence in doing the challenges. From the beginning a hint was given, there was a total of **4 challenges** and there should be delivered only **one flag** at the end. Most of the challenges were made with the collaboration of [td00k](http://twitter.com/tiaggodias).

## Crypto

> jlpny! fhv cnhk kc 'o1rf'. ecci c xucv acf!

There was an HTML page only with this phrase written on it. If you inspected the HTML, a hint was given:

``` <!-- Vigenere would probably start every conversation with 'Salut!' --> ```

So this is a [Vigenère cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher). From Wikipedia, one can learn that this is a method of encrypting alphabetic text by using a series of interwoven *Caesar ciphers*, based on the letters of a keyword (a form of polyalphabetic substitution). So with a little digging, you would find several websites for cracking the cipher, but you always need the key. 

However there was the hint that every conversation started with *Salut!*, so we assumed that the *jlpny!* should be the corresponding ciphertext for *salut!*. With this, we tried to gain the key using a known plaintext attack, with this [website](https://f00l.de/hacking/vigenere.php). However, no luck. After some experiments, we tried the company name as a key (*checkmarx*), and it worked!

>> **hello! the flag is 'c1ro'. have a nice day!**

So, our mistake was in assuming that the first word would be *salut*, but it was *hello*. So using the above website, we could find right away the first part of the key **check**, and it would be an easier process. After all, we found it anyway.

We now had the first flag: c1ro

## Whats The Vuln

> this piece of code represents a vulnerability in GO, what is it?

So we were once again given an HTML page with the following PHP code in it:

{% highlight php %} 
<?php
include ("flag.php");

highlight_file(__FILE__);

// this piece of code represents a vulnerability in GO, what is it?
// what is it?

// ans := url.Parse(r.URL.Query().Get("input")).RequestURI()

$ans = @$_GET["answer"];
echo check($ans);

?>
{% endhighlight %} 

So, the flag is *echo*'ed when we submit the right vulnerability name by the *answer* query param. After suspecting this was a web-related vulnerability (probably one of the [OWASP Top 10](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf)) and after digging we found out this Github issue on the Go language repository that mentions SSRF exploiting in the ```url.Parse```, so we tried it and it worked!

>> Nice one! The flag is ZUJl

We now had the second flag: ZUJl

## ReverseIt

> Complete all the challenges to get a prize @checkmarx

Once again, an HTML page was given, but this time with an ```input```. So, after checking the page source code, we could see some JS dark magic going on. The source is too long to be embedded, so [here it is](/assets/bsidesctf18/flag.html).

So we got some char comparisons going on in the function ```function check(str)```. We started by converting the unicode variables for their true name:
- ```\u0073\u0074\u0072``` -> str
- ```\u0065\u0076\u0061\u006c``` -> eval

We could see now that the ```code``` variable was being evaluated/executed, so that giant hex string was some JS code. If you converted the hex string to ASCII you would get two distinct parts.

The first part consinsting of a new value to the code variable with an recognizable aspect, a *base64*. Using the [CyberChef tool](https://gchq.github.io/CyberChef/cyberchef.htm) to convert it to ASCII would give us also two parts: 

- ```code = [][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+``` ..., we know that this is [JSF\*ck](http://www.jsfuck.com/). There is an online tool called [JSUnF\*ck](http://codertab.com/JsUnFuck) that will decode it into regular JS.  The result would be: ```\u0073\u0074\u0072[3]=='\u004A'```, that converted from unicode would be: ```str[3]=='J'```. 

- ```str[2]=='h'?eval(code):!1``` in the last line.

The second part consists of regular JS: ```str[- -true]=='3'?eval(atob(code)):!1;```, where the ```str[- -true]``` corresponds to ```str[1]```.

Taking the last JS line converted from unicode: ```return str[~~!1]=='Q'?eval(code):!1```, where the ```str[~~!1]``` corresponds to ```str[0]```.

So now we see 4 char comparisons going on, organized bellow:

| str[0] | str[1] | str[2] | str[3] | 
-----|-------|--------|--------
| Q      | 3      | h      | J      |


Submitting Q3hJ in the ```input``` field would give us the message:
>> that's right!

We now had the third flag: Q3hJ


## MrRobots

This challenge URL, ```example.com/MrRobots```, when entering would redirect us to a known Youtube [link](https://www.youtube.com/watch?v=dQw4w9WgXcQ). 

So the first thing was turning on the Burp suite intercept, setting the corresponding proxy on Firefox, and entering the URL. We could see in the header a ```Location= https://www.youtube.com/watch?v=dQw4w9WgXcQ``` along with a 302 status code. However, when looking to the response tab we would get the following message: 

> wrong way, pal... Look carefully at the URL.

So after a little digging and asking around to some friends, I got a hint about the ```robots.txt``` file. When entering in the URL ```example.com/MrRobots/robots.txt``` we would get the following file:

{% highlight text %} 
User-agent: *
Disallow: /980j45grn/
{% endhighlight %} 

Entering the ```example.com/980j45grn``` would give us 404, but entering ```example.com/MrRobots/980j45grn``` would redirect us to the same Youtube link. Turning on the Burp suite again we would get the following text in the response tab:

>> Well done, the flag is c3Q=

We now had the fourth flag: c3Q=

## Getting the Prize

With the four flags, we now have to give only one in order to get the prize. In the fourth flag, there is an equal sign, so it must be the end of a **base64** string. Going to the CyberChef again, and after testing different combinations of the flags we would get something like *CxIsZeBest*. This was almost there, so looking again to the Crypto challenge we noticed that we would always get a small-case string even if it wasn't. So after playing a little bit, we get it:

**Q3hJc1RoZUJlc3Q=** that corresponds to **CxIsTheBest**. 

*The final prize was a small portable Bluetooth speaker.*