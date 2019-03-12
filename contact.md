---
layout: default
is_contact: true
---

## Contact

<i class="far fa-envelope"></i> Email: [jpdias[at]outlook.com](mailto:jpdias@outlook.com)

---

## Address

> João Pedro Dias
>
> Department of Informatics Engineering
>
> University of Porto – Faculty of Engineering
>
> Rua Dr. Roberto Frias, s/n
>
> 4200-465 Porto
>
> Portugal

---

## Social

{% for x in site.social %}
   <a href="{{ x.url }}" target="_blank"><i class="{{ x.icon }}"></i> &nbsp; {{ x.name }}</a>
{% endfor %}
