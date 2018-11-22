---
layout: default
is_contact: true
---

* Email: [jpdias@outlook.com](mailto:jpdias@outlook.com)

---

## Social

{% for x in site.social %}
   <a href="{{ x.url }}" target="_blank"><i class="{{ x.icon }}"></i> &nbsp; {{ x.name }}</a>
{% endfor %}
