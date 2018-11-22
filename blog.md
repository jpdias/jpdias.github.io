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
        {{ post.excerpt }}
      </li>
    {% endfor %}
  </ul>