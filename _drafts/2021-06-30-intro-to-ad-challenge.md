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


## Initial AD Recon

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
> Import-module sharphound.ps1
> Invoke-BloodHound --CollectionMethod All --DomainController 5x.1xx.2xx.4x --OutputDirectory C:\temp\
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

ADExplorer presents a tree-view of the target DC, allowing us to navigate among objects, including `Users` and `Computers`. This allowed us to find some extra clues about the challenge, including:
- There are two computers: `App1` and `App2` (this was crucial, since `App2` does not appear in the Bloodhound scan);
- More than the common default users, there are three users of interest: `User1` (the given account), `writeradmin` and `app1admin`.
- The description of `writeradmin` object gives an hint: `This user has some write permissions... Also, they can read computer accounts' descriptions for flags ;)` 


ADExplorer eases the process of searching for objects and check what is their accessible information, including `description`, `SAMAccountName`, `ObjectSid`, etc. This eases our task of understanding the output of `Get-DomainObjectAcl`, since we can now quickly search by the `user1` `SID` to see what are the ACLs applied over this object for `writeradmin` object.




<img src="/images/adchall21/writeradmin.png">

<img src="/images/adchall21/app2.png">
