---
layout: default
title: "./jpdias/talks"
---

## Talks (dump)

{% assign counter = 0 %}

{% for pub in site.data.talks.talks %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]{{ pub.title }}</b></a><br></div>
<div>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
</div>
<div><i class="ri-group-line"></i> {{ pub.speakers }}</div>
<div><i class="ri-book-3-line"></i> {{ pub.venue }}</div>
<div><i class="ri-file-pdf-2-line"></i> Slides (pdf): {{ pub.url }}</div>
</div>

{% endfor %}
