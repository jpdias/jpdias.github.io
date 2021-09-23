---
layout: default
title: "./jpdias/publications"
---

## Journal Articles

#### Peer-Reviewed

{% assign counter = 0 %}

{% for pub in site.data.publications.journals %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" _target="blank"><b>{{ pub.title }}</b></a><br></div>
<li><span class="shield shield-grey"><span><i class="ri-refresh-line"></i> </span>{{ pub.status }}</span>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</li>
<li><i class="ri-group-line"></i> {{ pub.authors }}</li>
<li><i class="ri-map-pin-time-line"></i> {{ pub.conference }}</li>
<li>
  <details class="description-item is-expandable">
    <summary class="description-item-title"> <i class="ri-add-circle-line"></i>  Abstract</summary>
    <div class="description-item">{{ pub.abstract }}</div>
  </details>
</li>
</div>

{% endfor %}

## Conference Publications

#### Peer-Reviewed

{% assign counter = 0 %}

{% for pub in site.data.publications.confs %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" _target="blank"><b>{{ pub.title }}</b></a><br></div>
<li><span class="shield shield-grey"><span><i class="ri-refresh-line"></i> </span>{{ pub.status }}</span>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</li>
<li><i class="ri-group-line"></i> {{ pub.authors }}</li>
<li><i class="ri-map-pin-time-line"></i> {{ pub.conference }}</li>
<li>
  <details class="description-item is-expandable">
    <summary class="description-item-title"> <i class="ri-add-circle-line"></i>  Abstract</summary>
    <div class="description-item">{{ pub.abstract }}</div>
  </details>
</li>
</div>
{% endfor %}

## Pre-Prints

#### Non-Peer-Reviewed (arxiv)

{% assign counter = 0 %}

{% for pub in site.data.publications.informal %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" _target="blank"><b>{{ pub.title }}</b></a><br></div>
<li>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</li>
<li><i class="ri-group-line"></i> {{ pub.authors }}</li>
<li>
  <details class="description-item is-expandable">
    <summary class="description-item-title"> <i class="ri-add-circle-line"></i>  Abstract</summary>
    <div class="description-item">{{ pub.abstract }}</div>
  </details>
</li>
</div>

{% endfor %}

## Thesis

{% assign counter = 0 %}

{% for pub in site.data.publications.thesis %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" _target="blank"><b>{{ pub.title }}</b></a><br></div>
<li>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</li>
<li><i class="ri-group-line"></i> {{ pub.supervision }}</li>
<li>
  <details class="description-item is-expandable">
    <summary class="description-item-title"> <i class="ri-add-circle-line"></i>  Abstract</summary>
    <div class="description-item">{{ pub.abstract }}</div>
  </details>
</li>
</div>

{% endfor %}

## Abstracts

{% assign counter = 0 %}

{% for pub in site.data.publications.abstracts %}

{% assign counter = counter | plus:1 %}

<div class="pub-item">
<div class="pub-title"><span>[{{ counter }}]</span><a href="{{ pub.url }}" _target="blank"><b>{{ pub.title }}</b></a><br></div>
<li>
    <span class="shield shield-blue"><span><i class="ri-calendar-event-line"></i></span>{{ pub.year }}</span>
    {% if pub.pub %}<span class="shield shield-green"><span><i class="ri-book-3-line"></i></span>{{ pub.pub }}</span>{% endif %}
    {% if pub.doi %}<span class="shield shield-yellow"><span><i class="ri-fingerprint-line"></i></span>{{ pub.doi }}</span>{% endif %}
    {% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="ri-file-pdf-line"></i></span>PDF</a>{% endif %}
    <br>
</li>
<li><i class="ri-group-line"></i> {{ pub.authors }}</li>
<li><i class="ri-map-pin-time-line"></i> {{ pub.conference }}</li>
<li>
  <details class="description-item is-expandable">
    <summary class="description-item-title"> <i class="ri-add-circle-line"></i>  Abstract</summary>
    <div class="description-item">{{ pub.abstract }}</div>
  </details>
</li>
</div>

{% endfor %}
