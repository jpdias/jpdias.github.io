---
layout: default
is_contact: true
title: "./jpdias/contact"
---

# contact

<i class="far fa-envelope"></i> Email: [jpdias[at]outlook.com](mailto:jpdias@outlook.com)

<i class="far fa-envelope"></i> Email: [jpdias[at]pm.me](mailto:jpdias@pm.me)

## social

{% for entry in site.social %}
<a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}"></i> {{ entry.name }}</a>
{% endfor %}

## academic

{% for entry in site.academic %}
<a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}"></i> {{ entry.name }}</a>
{% endfor %}
