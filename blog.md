---
layout: default
---

## #Tales of I/O

<ul class="fa-ul">
    {% for post in site.posts %}
      <li>
        <h2>
            <span class="fa-li"><i class="fas fa-code-branch"></i></span>
            <a href="{{ post.url }}">{{ post.title }}</a>
        </h2>
        <p><i class="far fa-calendar-alt"></i> {{ post.date | date: '%B %d, %Y' }} | {% for tag in post.tags %} #{{tag}} {% endfor %}</p>
        {{ post.excerpt }}
      </li>
    {% endfor %}
  </ul>