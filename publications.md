---
layout: default
---

## Conference Publications
#### Peer-Reviewed

{% assign counter = 0 %}

{% for pub in site.data.publications.confs %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a>, {{ pub.authors }} <br>
  - {{ pub.conference }}, {{ pub.year }} {% if pub.pdf %}
        <a href="{{ pub.pdf }}" _target="blank"><i class="far fa-file-pdf"></i>&nbsp;PDF Download</a>
    {% endif %}

{% endfor %}

## Pre-Prints
#### Non-Peer-Reviewed (arxiv)

{% assign counter = 0 %}

{% for pub in site.data.publications.informal %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a>, {{ pub.authors }} <br>
  - {% if pub.pdf %}
        <a href="{{ pub.pdf }}" _target="blank"><i class="far fa-file-pdf"></i>&nbsp;PDF Download</a>
    {% endif %}

{% endfor %}

## Thesis

{% assign counter = 0 %}

{% for pub in site.data.publications.thesis %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a>, {{ pub.supervision }} <br>
  - {{ pub.degree }}, {{ pub.year }} {% if pub.pdf %}
        <a href="{{ pub.pdf }}" _target="blank"><i class="far fa-file-pdf"></i>&nbsp;PDF Download</a>
    {% endif %}

{% endfor %}

## Abstracts

{% assign counter = 0 %}

{% for pub in site.data.publications.abstracts %}

 {% assign counter = counter | plus:1 %}

  {{ counter }}. <a href="{{ pub.url }}" _target="blank">**{{ pub.title }}**</a>, {{ pub.authors }} <br>
  - {{ pub.conference }}, {{ pub.year }} {% if pub.pdf %}
        <a href="{{ pub.pdf }}" _target="blank"><i class="far fa-file-pdf"></i>&nbsp;PDF Download</a>
    {% endif %}

{% endfor %}