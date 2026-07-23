# jpdias.me — personal site

Source for my personal website and blog, live at **[jpdias.me](https://jpdias.me)**.

Built with [Jekyll](https://jekyllrb.com/) 4.x and served via GitHub Pages. Posts are written in Markdown, the look is driven by a small custom layout set under `_layouts/` and styled from `css/`. Icons come from [Remix Icon](https://remixicon.com/) (and a few from [Academicons](https://jpswalsh.github.io/Academicons/) for academic profiles).

## What's here

- `index.md` — landing page (about + recent talks/publications)
- `notes/` — the blog, paginated at `/notes/`, sourced from `_posts/`
- `publications.md` — full publications list (journals + conferences)
- `talks.md` — talks
- `contact.md` — email and social/academic links
- `_posts/` — Markdown blog posts (`YYYY-MM-DD-title.md`)
- `_drafts/` — unpublished posts
- `_data/` — `publications.yml` and `talks.yml` data files
- `_layouts/`, `_includes/` — Liquid templates
- `css/`, `js/`, `fonts/`, `images/` — assets
- `CNAME` — custom domain (`jpdias.me`)
- `.well-known/` — domain verification files
- `feed.xml` — RSS feed

## Local development

Requirements: Ruby + Bundler (match what GitHub Pages uses — see `Gemfile`).

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>. A build output is written to `_site/`.

## Writing a new post

Create a file under `_posts/` named `YYYY-MM-DD-slug.md`:

```markdown
---
layout: post
title: "Short, descriptive title"
date: 2026-07-23 10:00:00 +0000
categories: [notes]
---

Body in Markdown.

<!--more-->
```

The `<!--more-->` marker sets the excerpt shown on the index/notes page. Drafts go in `_drafts/` (filename without a date) and are only rendered if you run `jekyll serve --drafts`.

## Configuration

Site-wide settings live in `_config.yml`:
- `title`, `url`, `baseurl`, `username`
- `nav` — top navigation entries
- `social` / `academic` — icon-link lists rendered on `contact.md`
- `paginate` — posts per page on `/notes/`

## Deployment

Push to `main` and GitHub Pages publishes it. The `CNAME` file pins the custom domain `jpdias.me`.

## License

Source code (templates, layouts, scripts) is released under the [MIT License](LICENSE). Post content and images are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1).