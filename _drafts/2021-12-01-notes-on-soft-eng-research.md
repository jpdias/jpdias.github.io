---
layout: post
title: "Notes on (Software Engineering) Research"
categories: [research, engineering, software]
tags: [research, phd, engineering, software]
thumbnail: /images/satsandradio21/gqrx_433.png
description: "Notes on research from a software engineering perspective."
---

Now that I've finally delivered my PhD thesis (awaiting public defense), and after sharing for more than 3 years my tools, strategies, and tips for surviving in the academic world by word of mouth, I have finally got the time --- and energy --- to put this in a written form.

<!--more-->

While I will try to present these tips and hints in a way they are common to most research fields in computer science, a bias will exist towards software engineering and Internet-of-Things research. This post will be split into 5 parts. [Gather](#gather) will focus on the means to gather knowledge, find relevant research challenges and pending issues, discover trends, and keep up-to-date with the latest publications. [Systematize](#systematize) will describe the means by which one can be more _efficient_ reading and summarizing published works. [Apply](#apply) presents the tools for writing, evolving and maintaining documents, papers, thesis, etc. [Publish](#publish) and [Broadcast](#broadcast) focus on the publishing process and broadcasting _your own work_.

I will try to be as consice as possible, mostly point to external resources.

## Gather

> "As knowledge grows in a specific area, solutions are captured and documented by experts in books, research papers, concrete implementations, web pages, and a myriad of other types of communication media. While we may intuitively think that any growth in the body of knowledge implies better design choices, it seems that the way (and the amount) this knowledge is being captured raises an important issue per-se." --- Hugo Sereno Ferreira

You are new, and you are lost. How can you merely grasp what is going on? Even if you have a research field, and something closer to a _research topic_… how can you sail the vast sea of literature?

### Newsletters and other news feeds / aggregators are a good start, a few examples:

- [ACM SIGSOFT SEWorld](http://sigsoft.org/resources/seworld.html)
- [Blockchain in brief](https://blockchaininbrief.org)
- [The Risks Digest](https://catless.ncl.ac.uk/Risks/)
- [Papers We Love (PWL)](https://github.com/papers-we-love/papers-we-love)

### From a technology viewpoint, knowing current market trends is fundamental:

- Gartner [Hype Cycles](https://www.gartner.com/en/research/methodologies/gartner-hype-cycle) (technology-wise) and [Magic Quadrants](https://www.gartner.com/en/research/magic-quadrant) (enterprise-wise) are a good high-level view on the current market directions.
  - Example for [IoT, 2020](https://wwwprimekeycom.cdn.triggerfish.cloud/uploads/2020/09/iot-hype-cycle.png).
  - These analysis are based on internal studies and market analysis and should not be considered _ground truth_.
- [Statista](https://www.statista.com/) is also another known provider of market and consumer data, being an acceptable source of adoption metrics and other studies.
  - Example for [IoT](https://www.statista.com/topics/2637/internet-of-things/#dossierKeyfigures), including market size, number of connected devices, etc. Includes forecasts and trend analyses.

### From a _practice_ viewpoint:

- [Technology Radar](https://www.thoughtworks.com/radar) by ThoughtWorks is a known source for finding the current adoption stages of different tools and methods.
  - An [alternative radar](https://opensource.zalando.com/tech-radar/) is maintained by Zalando.
- [GitHub Octoverse](https://octoverse.github.com/) contains data about the GitHub community (e.g. most used IDE, languages, etc.)
- [JetBrains Developer Ecosystem](https://www.jetbrains.com/lp/devecosystem-2021/) contains data about the JetBrains developer community (e.g. most used languages, frameworks, etc.)

### From a scientific literature viewpoint:

There are two big blobs of literature: (1) the scientific, published and peer-reviewed literature and (2) the grey literature, consisting of any written resource (e.g. websites, posts, etc.).

For scientific literature the first go-to solution are the _big_ scientific indexers, the most well-known being:

- [Web of Science](https://www.webofscience.com/), which is behind a paywall[^1], but is one of the most used indexers (most university have access to it).
- [Scopus](https://www.scopus.com/), another well-known indexer, also behind a paywall[^1]. Once again, most university have access to it.
- [Google Scholar](https://scholar.google.com/), one of the most widely used indexers but with dubious indexing process (any PDF public stored in a university network is indexed). Use with caution. Most of the time systematic literatures[^2] made using Google Scholar are not considered valid.

Another solution is to search directly within the digital libraries of specific publishers (being limited to the papers published by them): [IEEEXplore](https://ieeexplore.ieee.org/), [ACM Digital Library](https://dl.acm.org/), [Elsevier](https://www.elsevier.com/search-results), and others. Most of the time the access to the full papers is behind a paywall[^1], with a few being open access. Once again, most universities pay for full access.

Searching in pre-print servers also provides good insights on unpublished (or yet to be published) research, [arXiv](https://arxiv.org/).

### From a scientific jobs market (e.g. scholarships) viewpoint:

- [Computeroxy](https://computeroxy.com/)
- [Academic Positions](https://academicpositions.com/)
- [EURAXESS](https://www.euraxess.pt/)

## Systematize

> "We are drowning in information but starved for knowledge." --- John Naisbitt

Too many times I've read full articles just to find out that the paper is poorly done, or that it does not provide any new insight nor raises relevant research questions. While there is no _silver-bullet_ to avoid this, one can make efforts to reduce the number of times it happens. Here goes a list of _steps_:

1. Prioritize surveys over normal papers in the early stages of your research given that someone already have summarized the existent works for you.
2. Read papers from relevant and solid sources first. This includes highly reputed conferences and journals (more about it in [Publish](#publish)).
3. If the paper is badly formatted --- e.g. with missing figures and _really_ badly written --- avoid it (and revisit if you do not find anything else relevant to your search).
4. If a paper does not have an _experiments & results_ section give it low priority. Most of the time these papers only present ideas or early stage research that lacks validation.

Now that you have only 999+ papers to read, a reference / paper manager becomes crucial. I have been using [Mendeley Desktop (old version)](https://www.mendeley.com/autoupdates/installers/1.19.3) for long as it provides reference management, PDF organization and notes with syncronization capabilities. However, some other alternatives exist including [Zotero](https://www.zotero.org/) which appears similar, [Paperpile](https://paperpile.com/), and [Papers by ReadCube](https://app.readcube.com/).

Tools setup done. Now to the read part. A flowchart by [Subramanyam et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3687192/):

```
┌───────────────────────────────────────────────────────┐                   ┌────┐
│Is the Title related to the topic that I'm looking for?├───────────────────► NO │
│Does it have the keywords which I have in mind?        │                   └─┬──┘
└───────────────────────┬───────────────────────────────┘                     │
                        │                                                     │
                     ┌──▼──┐                                        ┌─────────▼──────────┐
                     │ YES │                                        │Skip the article and│
                     └──┬──┘                                        │go to the next one  │
                        │                                           └─────────▲──────────┘
      ┌─────────────────▼──────────────────────┐                              │
      │Read the Abstract / Summary / Conclusion│                              │
      └─────────────────┬──────────────────────┘                              │
                        │                                                     │
           ┌────────────▼─────────────────┐                                   │
           │Clear-cut aims and objectives?│                                   │
           └────────────┬─────────────────┘                                   │
                        │                                                     │
          ┌─────────────▼───────────────────┐                                 │
          │Well-defined research hypothesis?│                                 │
          └─────────────┬───────────────────┘                                 │
                        │                                                     │
          ┌─────────────▼───────────────────┐                                 │
          │Are the conclusions precise?     │                                 │
          └─────────────┬───────────────────┘                                 │
                        │                                                     │
 ┌──────────────────────▼──────────────────────────────────┐                ┌─┴──┐
 │Is the above useful or relevant to what I am looking for?├───────────────►| NO │
 └──────────────────────┬──────────────────────────────────┘                └────┘
                        │
                        │
                     ┌──▼──┐
                     │ YES │
                     └──┬──┘
                        │
            ┌───────────▼────────────┐
            │Read the entire article.│
            └────────────────────────┘
```

Other useful tips and hints on reading articles [How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf).

## Apply

Now that you're up-to-date of the current state-of-the-art, and you have found out that 99.9% of your ideas are already published, you take that 0.1% and put it into action. This is a multi-stage process depending on the work/idea/challenge/issue/whatever, but there are a few common points that can be grasped by analyzing a typical paper structure.

### Abstract

Here goes the summary of the paper. Little context, main challenge, main contribution. Supported by numbers or other evidence in a clear and direct form.

### Introduction

Here goes the bedtime story. What's the context and motivation of your work? Is the motivation supported by other authors? What is the concrete problem to be tackled? What are the methods and mechanisms that will be used? What are the main contributions and observations? And what is the paper structure?

### Related Work

There are, for sure, a good amount of works that are related to your _very specific_ thing. Read them. Cite them. Criticize them. Find your _very specific thing_ that makes your work valuable and differentiates it from the rest. Remember key points, and, if possible, compare results of other works with your own observations. Sometimes _Related Work_ can appear later in the paper, but it's not so common...

### Approach Overview

What did you do? What is the architecture of your thing? If there are any mathematical formulations or algorithms that should be presented, here is the spot. Try to follow some [pseudo-code conventions](https://onlinelibrary.wiley.com/doi/pdf/10.1002/0470029757.app1). If there are any software-related diagrams, try to follow UML if possible. [Draw.io is your friend](https://app.diagrams.net/).

### Implementation Details

### Experiments and Results

### Discussion

### Threats to Validity

### Conclusions

## Publish

## Broadcast

[^1]: [Skirting Around Paywalls: How Scientists Quickly Get the Articles They Need](https://incubator.rockefeller.edu/skirting-around-paywalls-how-scientists-quickly-get-the-articles-they-need/). More info [#ICanHazPDF](https://en.wikipedia.org/wiki/ICanHazPDF), [Sci-Hub](https://en.wikipedia.org/wiki/Sci-Hub), and [The Library Genesis Project](https://en.wikipedia.org/wiki/Library_Genesis).
[^2]: [Conducting a Systematic Review](https://libguides.umn.edu/systematicreviews) and [Preferred Reporting Items for Systematic Reviews and Meta-Analyses](http://prisma-statement.org/).
