---
layout: default
title: "./jpdias/talks"
---

## Talks (dump)

{% assign counter = 0 %}

{% for pub in site.data.publications.journals %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]{{ pub.title }}</b></a><br></div>
<div>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" target="_blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</div>
<div><i class="ri-group-line"></i> {{ pub.speakers }}</div>
<div><i class="ri-book-3-line"></i> {{ pub.venue }}</div>
<div><i class="ri-file-pdf-2-line"></i> Slides (pdf): {{ pub.url }}</div>
</div>

{% endfor %}
