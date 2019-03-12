---
layout: default
title: "./jpdias/publications"
---

## Conference Publications
#### Peer-Reviewed

{% assign counter = 0 %}

{% for pub in site.data.publications.confs %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a><br>
  - <i class="fas fa-users"></i> {{ pub.authors }}
  - <i class="fas fa-caret-right"></i> {{ pub.conference }}
  - <span class="shield shield-grey"><span><i class="fas fa-paperclip"></i></span>{{ pub.status }}</span><span class="shield shield-blue"><span><i class="fas fa-calendar-alt"></i></span>{{ pub.year }}</span>{% if pub.pub %}<span class="shield shield-green"><span><i class="fas fa-book"></i></span>{{ pub.pub }}</span>{% endif %}{% if pub.doi %}<span class="shield shield-yellow"><span><i class="fas fa-fingerprint"></i></span>{{ pub.doi }}</span>{% endif %}{% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="fas fa-file-pdf"></i></span>PDF</a>{% endif %}<br>    
{% endfor %}

---

## Pre-Prints
#### Non-Peer-Reviewed (arxiv)

{% assign counter = 0 %}

{% for pub in site.data.publications.informal %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a> <br>
  - <i class="fas fa-users"></i> {{ pub.authors }}
  - <span class="shield shield-blue"><span><i class="fas fa-calendar-alt"></i></span>{{ pub.year }}</span>
        {% if pub.doi %}<span class="shield shield-yellow"><span><i class="fas fa-fingerprint"></i></span>{{ pub.doi }}</span>{% endif %}{% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="fas fa-file-pdf"></i></span>PDF</a>{% endif %}<br>    

{% endfor %}

---

## Thesis

{% assign counter = 0 %}

{% for pub in site.data.publications.thesis %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a> <br>
  - <i class="fas fa-caret-right"></i> {{ pub.supervision }}
  - <span class="shield shield-blue"><span><i class="fas fa-calendar-alt"></i></span>{{ pub.year }}</span>
        {% if pub.doi %}<span class="shield shield-yellow"><span><i class="fas fa-fingerprint"></i></span>{{ pub.doi }}</span>{% endif %}{% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="fas fa-file-pdf"></i></span>PDF</a>{% endif %}<br>    

{% endfor %}

---

## Abstracts

{% assign counter = 0 %}

{% for pub in site.data.publications.abstracts %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a><br>
  - <i class="fas fa-users"></i> {{ pub.authors }}
  - <i class="fas fa-caret-right"></i> {{ pub.conference }}
  - <span class="shield shield-blue"><span><i class="fas fa-calendar-alt"></i></span>{{ pub.year }}</span>
        {% if pub.doi %}<span class="shield shield-yellow"><span><i class="fas fa-fingerprint"></i></span>{{ pub.doi }}</span>{% endif %}{% if pub.pdf %}<a href="{{ pub.pdf }}" _target="blank" class="shield shield-red"><span><i class="fas fa-file-pdf"></i></span>PDF</a>{% endif %}<br>    

{% endfor %}
