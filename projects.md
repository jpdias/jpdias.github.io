---
layout: default
title: "./jpdias/projects"
---

## GitHub Repositories

<div class="projects">
{% for project in site.data.projects.projects %}
<div class="gh-card">
<a href="https://github.com/{{project}}">
    <img src="https://gh-card.dev/repos/{{project}}.svg">
</a>
</div>
{% endfor %}
</div>