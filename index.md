---
layout: default
title: "./jpdias/"
description: "Engineer. Developer. Photography enthusiast. Researching on the thin line between hardware and software."
---

## About Me

<img class="profile-picture" src="images/profile.png" alt="Profile picture">

{% highlight bash %}
$ whoami
jpdias: phd. engineer. developer. photography enthusiast.
{% endhighlight %}

Currently working as a researcher on the thin line between hardware and software, João Pedro Dias has a BSc+MSc in [Informatics and Computing Engineering](https://sigarra.up.pt/feup/en/cur_geral.cur_view?pv_ano_lectivo=2018&pv_origem=CUR&pv_tipo_cur_sigla=MI&pv_curso_id=742) by the [Faculty of Engineering, University of Porto (FEUP)](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL). He has a Ph.D. in Informatics Engineering by the same university since 2022 (while holding a FCT grant). He is an Invited Assistant Lecturer at FEUP since 2017, lecturing various courses ranging from Software Engineering to Operating Systems. He has co-supervised 5 MSc dissertations and participated as a Researcher in two projects at LIACC and INESC TEC (Porto, Portugal). He is now Software Engineering Specialist at BUILT CoLAB working in the area of Software Engineering, with a special interest in Design Patterns, Internet-of-Things, Security and Privacy with more than 20 published and indexed papers. In his leisure time, he can be found participating in Capture The Flag competitions, messing around with Software-defined Radio, doing web development, learning how to reverse engineer hardware and photographing while wandering in nature.

## Work & Study

- Software Engineering Specialist @ [BUILT CoLAB](https://builtcolab.pt/)
- Invited Assistant Professor @ [FEUP](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL)

## Research Interests

- Software Engineering
  - Design Patterns, Development Methodologies, Software Development, Edge/Fog/Cloud Computing, Live Programming, Visual Programming and Fault-Tolerance
- Internet-of-Things
  - Systems of Systems, Reference Architectures, Development Toolkits and IDEs
- Security & Privacy
  - Surveillance Self-Defense, Capture the Flag (CTF) and Security Education

## Recent Publications

{% assign counter = 0 %}

{% for pub in site.data.publications.confs limit:3 %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" target="_blank"><b>{{ pub.title }}</b></a><br></div>
<div><i class="ri-group-line"></i> {{ pub.authors }}</div>
<div><i class="ri-book-3-line"></i>  {{ pub.conference }}</div>
</div>

{% endfor %}

{% for pub in site.data.publications.journals limit:2 %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" target="_blank"><b>{{ pub.title }}</b></a><br></div>
<div><i class="ri-group-line"></i> {{ pub.authors }}</div>
<div><i class="ri-book-3-line"></i>  {{ pub.conference }}</div>
</div>

{% endfor %}

<a href="/publications"><i class="ri-add-circle-line"></i> **View More**</a>
