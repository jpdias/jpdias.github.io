---
layout: default
title: "./jpdias/talks"
---

## Talks (dump)

{% for talk in site.data.talks.talks %}

<article class="talk-item">
    <div class="talk-title"><span><i class="ri-presentation-fill"></i> </span><b>{{ talk.title }}</b><br></div>
    <div>
        <span><i class="ri-calendar-schedule-fill"></i> {{ talk.year }}</span>
        <span><i class="ri-map-pin-fill"></i> {{ talk.location }}</span>
    </div>
    <div><i class="ri-group-line"></i> {{ talk.speakers }}</div>
    <div><i class="ri-tent-fill"></i> {{ talk.venue }}</div>
    <div><a href="{{ talk.slides }}" target="_blank" rel="noopener noreferrer"><i class="ri-file-download-fill"></i> Slides (pdf)</a></div>
</article>

{% endfor %}