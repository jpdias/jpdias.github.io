---
layout: default
title: "./jpdias/tipsntricks"
---

## Tips'n'tricks (dump)

{% for tip in site.data.tipsntricks %}
{% assign tags = tip[1].tags %}
{% for tag in tags %}
{{ tag }}
{% endfor %}
{% endfor %}




<div class="blog-content">
{% for tip in site.data.tipsntricks %}
{% assign entry = tip[1] %}

<h2> {{ entry.title }} </h2>


{% for tag in entry.tags %}
<span class="shield shield-blue">{{ tag }}</span>
{% endfor %}

<br>

{{ entry.content | markdownify | newline_to_br }}

{% endfor %}
</div>
