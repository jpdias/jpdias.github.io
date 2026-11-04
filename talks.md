---
layout: page-with-toc
title: "./jpdias/talks"
---

# talks

{% assign current_year = nil %}
{% for talk in site.data.talks.talks %}
  {% if current_year != talk.year %}
    {% assign current_year = talk.year %}
    <h2 id="year-{{ talk.year }}">{{ talk.year }}</h2>
  {% endif %}

<article class="talk-item" id="{{ talk.title | downcase | replace: " ", "-" }}">
    <div class="talk-title"><span><i class="ri-presentation-fill" aria-hidden="true"></i> </span><b>{{ talk.title }}</b><br></div>
    <div>
        <span><i class="ri-calendar-schedule-fill" aria-hidden="true"></i> {{ talk.year }}</span>
        <span><i class="ri-map-pin-fill" aria-hidden="true"></i> {{ talk.location }}</span>
        <span><i class="ri-group-line" aria-hidden="true"></i> {{ talk.speakers }}</span>
    </div>
    <div><i class="ri-tent-fill" aria-hidden="true"></i> {{ talk.venue }}</div>
    {% if talk.slides and talk.slides != "" %}<div><a href="{{ talk.slides }}" target="_blank" rel="noopener noreferrer"><i class="ri-file-download-fill" aria-hidden="true"></i> Slides (pdf)</a></div>{% endif %}
</article>

{% endfor %}
