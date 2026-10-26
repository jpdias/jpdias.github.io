---
layout: default
is_contact: true
title: "./jpdias/contact"
---

# contact

<i class="ri-mail-line" aria-hidden="true"></i> Email: [jpdias[at]outlook.com](mailto:jpdias@outlook.com)

<i class="ri-mail-line" aria-hidden="true"></i> Email: [jpdias[at]pm.me](mailto:jpdias@pm.me)

## social

{% for entry in site.social %}
<a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}" aria-hidden="true"></i> {{ entry.name }}</a>
{% endfor %}

## academic

{% for entry in site.academic %}
<a href="{{ entry.url }}" target="_blank"><i class="{{ entry.icon }}" aria-hidden="true"></i> {{ entry.name }}</a>
{% endfor %}
