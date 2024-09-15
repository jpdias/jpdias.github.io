---
layout: default
title: "./jpdias/"
description: "Engineer. Developer. Photography enthusiast. Researching on the thin line between hardware and software."
---

## About Me

<img class="profile-picture" src="images/profile.png" alt="Profile picture">

<a href="https://github.com/sponsors/jpdias" target="blank" class="sponsor sponsor-button"><i class="ri-heart-2-line"></i> Sponsor<a/>

{% highlight bash %}
$ whoami
jpdias: phd. engineer. developer. photography enthusiast.
{% endhighlight %}

João Pedro Dias is part researcher on the thin line between hardware and software, and part Software Engineer. He has a BSc+MSc in [Informatics and Computing Engineering](https://sigarra.up.pt/feup/en/cur_geral.cur_view?pv_ano_lectivo=2018&pv_origem=CUR&pv_tipo_cur_sigla=MI&pv_curso_id=742) by the [Faculty of Engineering, University of Porto (FEUP)](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL). He earned his Ph.D. in Informatics Engineering from FEUP in 2022 (with FCT research grant). He maintains a Software Engineer position as a day-to-day job at [Kuehne+Nagel](https://kuehne-nagel.com/). Since 2017, he has been an Invited Assistant Professor at FEUP, where he teaches courses in Software Engineering, Operating Systems, among others. He has (co-)supervised  +5 MSc dissertations and contributed to two projects at LIACC and INESC TEC. His research focuses on Internet-of-Things systems, software engineering, security and privacy, and his work has been published in several top-tier conferences and journals ([h-index 19, i10-index 24](https://scholar.google.com/citations?user=sQ2vKI0AAAAJ)). In his free time, he enjoys participating in Capture The Flag competitions, experimenting with Software-defined Radio, building web applications, reverse-engineering hardware, and photographing while wandering in nature.

## Current Positions

- [2023--] Senior Software Engineer @ [Kuehne+Nagel](https://kuehne-nagel.com)


## Previous Positions

- [2018-24] Invited Assistant Professor @ [FEUP](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL)
- [2021-23] Software Engineering Specialist @ [BUILT CoLAB](https://builtcolab.pt/)
- [2017-21] Researcher @ [INESC Technology and Science - Associate Laboratory](https://www.inesctec.pt/en)
- [2016-17] Researcher @ [LIACC - Artificial Intelligence and Computer Science Laboratory](https://liacc.fe.up.pt/)

## Research & Work Interests

- Software Engineering
  - Design Patterns, Event-driven Architectures, Software Development, Edge/Fog/Cloud Computing, Visual Programming and Fault-Tolerance
- Internet-of-Things
  - Systems of Systems, Reference Architectures, Development Toolkits and IDEs
- Security & Privacy
  - Surveillance Self-Defense, Capture the Flag (CTF) and Security Education

## Recent Talks

{% assign counter = 0 %}
{% for talk in site.data.talks.talks limit:3 %}

<article class="talk-item">
    <div class="talk-title"><span><i class="ri-presentation-fill"></i> </span><b>{{ talk.title }}</b><br></div>
    <div>
        <span><i class="ri-calendar-schedule-fill"></i> {{ talk.year }}</span>
        <span><i class="ri-map-pin-fill"></i> {{ talk.location }}</span>
        <span><i class="ri-group-line"></i> {{ talk.speakers }}</span>
    </div>
    <div><i class="ri-tent-fill"></i> {{ talk.venue }}</div>
</article>

{% endfor %}

## Recent Publications

{% assign counter = 0 %}

{% for pub in site.data.publications.journals limit:2 %}
{% assign counter = counter | plus:1 %}
<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" target="_blank"><b>{{ pub.title }}</b></a><br></div>
<div><i class="ri-group-line"></i> {{ pub.authors }}</div>
<div><i class="ri-book-3-line"></i>  {{ pub.conference }}</div>
</div>
{% endfor %}

{% for pub in site.data.publications.confs limit:2 %}
{% assign counter = counter | plus:1 %}
<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" target="_blank"><b>{{ pub.title }}</b></a><br></div>
<div><i class="ri-group-line"></i> {{ pub.authors }}</div>
<div><i class="ri-book-3-line"></i>  {{ pub.conference }}</div>
</div>
{% endfor %}
