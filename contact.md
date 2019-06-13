---
layout: default
is_contact: true
title: "./jpdias/contact"
---

## Contact

<i class="far fa-envelope"></i> Email: [jpdias[at]outlook.com](mailto:jpdias@outlook.com)

---

## Address

> João Pedro Dias
>
> Department of Informatics Engineering; 
> University of Porto – Faculty of Engineering; 
> Rua Dr. Roberto Frias, s/n; 
> 4200-465 Porto, Portugal

---

## Social

{% for entry in site.social %}
   <a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}"></i> &nbsp; {{ entry.name }}</a>
{% endfor %}

## Academic

{% for entry in site.academic %}
   <a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}"></i> &nbsp; {{ entry.name }}</a>
{% endfor %}
