---
layout: default
title: "./João Pedro Dias/"
description: Engineer. Developer. Photography and design enthusiast. Researching on the thin line between hardware and software.
---

## About Me

<img class="profile-picture" src="images/profile.jpg">

- *Engineer. Developer. Photography and design enthusiast.* 

Currently working as a researcher on the thin line between hardware and software. Graduated from the [Integrated Masters in Informatics and Computing Engineering](https://sigarra.up.pt/feup/en/cur_geral.cur_view?pv_ano_lectivo=2018&pv_origem=CUR&pv_tipo_cur_sigla=MI&pv_curso_id=742) by [Faculty of Engineering, University of Porto (FEUP)](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL). Passionate about technology in general, with a special focus on security and privacy, web development & Internet of Things. Furthermore, an amateur photographer, football player, book lover and science addict.

#### Work & Study

- Researcher @ [INESC TEC](https://inesctec.pt/)
- Invited Assistant Lecturer @ [FEUP](https://sigarra.up.pt/feup/en/WEB_PAGE.INICIAL)
- PhD Candidate @ [Doctoral Program in Informatics Engineering (FEUP)](https://sigarra.up.pt/feup/en/cur_geral.cur_view?pv_curso_id=679)

## Research Interests

- Software Engineering
    - Design Patterns, Development Methodologies, Software Development Life-cycle (SDLC), Edge/Fog/Cloud Computing, Live Programming & Liveness
- Internet-of-Things
    - Systems of Systems, Reference Architectures, Development Toolkits and IDEs
- Security & Privacy
    - Electronic Rights, Capture the Flag (CTF), Steneography

---

## Recent Publications

{% assign counter = 0 %}

{% for pub in site.data.publications.confs limit:5 %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}">**{{ pub.title }}**</a>, {{ pub.authors }} <br>
  - {{ pub.conference }}, {{ pub.year }}

{% endfor %}

<a href="/publications"><i class="fas fa-plus-square"></i> **View More**</a>
