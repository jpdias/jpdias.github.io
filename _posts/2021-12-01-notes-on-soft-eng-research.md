---
layout: post
title: "Notes on (Software Engineering) Research"
categories: [research, engineering, software]
tags: [research, phd, engineering, software]
thumbnail: /images/code.jpg
description: "Notes on research from a software engineering perspective."
---

Now that I've finally delivered my PhD thesis (awaiting public defense), and after sharing for more than 3 years my tools, strategies, and tips for surviving in the academic world by word of mouth, I have finally got the time --- and energy --- to put this in a written form.

<!--more-->

While I will try to present these tips and hints in a way they are common to most research fields in computer science, a bias will exist towards software engineering and Internet-of-Things research. This post will be split into 5 parts. [Gather](#gather) will focus on the means to gather knowledge, find relevant research challenges and pending issues, discover trends, and keep up-to-date with the latest publications. [Systematize](#systematize) will describe the means by which one can be more _efficient_ reading and summarizing published works. [Apply](#apply) presents the tools for writing, evolving, and maintaining documents, papers, thesis, etc. [Publish](#publish) and [Broadcast](#broadcast) focuses on the publishing process and broadcasting _your own work_.

I will try to be as concise as possible, mostly pointing to external resources.

## Gather

> "As knowledge grows in a specific area, solutions are captured and documented by experts in books, research papers, concrete implementations, web pages, and a myriad of other types of communication media. While we may intuitively think that any growth in the body of knowledge implies better design choices, it seems that the way (and the amount) this knowledge is being captured raises an important issue per-se." --- Hugo Sereno Ferreira

You are new, and you are lost. How can you merely grasp what is going on? Even if you have a research field and something closer to a _research topic_… how can you sail the vast sea of literature?

### Newsletters and other news feeds/aggregators are a good start, a few examples:

- [ACM SIGSOFT SEWorld](http://sigsoft.org/resources/seworld.html)
- [Blockchain in brief](https://blockchaininbrief.org)
- [The Risks Digest](https://catless.ncl.ac.uk/Risks/)
- [Papers We Love (PWL)](https://github.com/papers-we-love/papers-we-love)

### From a technology viewpoint, knowing current market trends is fundamental:

- Gartner [Hype Cycles](https://www.gartner.com/en/research/methodologies/gartner-hype-cycle) (technology-wise) and [Magic Quadrants](https://www.gartner.com/en/research/magic-quadrant) (enterprise-wise) are a good high-level view on the current market directions.
  - Example for [IoT, 2020](https://wwwprimekeycom.cdn.triggerfish.cloud/uploads/2020/09/iot-hype-cycle.png).
  - This analysis is based on internal studies and market analysis and should not be considered _ground truth_.
- [Statista](https://www.statista.com/) is also another known provider of market and consumer data, being an acceptable source of adoption metrics and other studies.
  - Example for [IoT](https://www.statista.com/topics/2637/internet-of-things/#dossierKeyfigures), including market size, number of connected devices, etc. Includes forecasts and trend analyses.

### From a _practice_ viewpoint:

- [Technology Radar](https://www.thoughtworks.com/radar) by ThoughtWorks is a known source for finding the current adoption stages of different tools and methods.
  - An [alternative radar](https://opensource.zalando.com/tech-radar/) is maintained by Zalando.
- [GitHub Octoverse](https://octoverse.github.com/) contains data about the GitHub community (e.g., most used IDE, languages, etc.)
- [JetBrains Developer Ecosystem](https://www.jetbrains.com/lp/devecosystem-2021/) contains data about the JetBrains developer community (e.g., most used languages, frameworks, etc.)

### From a scientific literature viewpoint:

There are two big blobs of literature: (1) the scientific, published, and peer-reviewed literature and (2) the grey literature, consisting of any written resource (e.g., websites, posts, etc.).

For scientific literature, the first go-to solution is the _big_ scientific indexers, the most well-known being:

- [Web of Science](https://www.webofscience.com/), which is behind a paywall[^1], but is one of the most used indexes (most universities have access to it).
- [Scopus](https://www.scopus.com/), another well-known indexer, also behind a paywall[^1]. Once again, most universities have access to it.
- [Google Scholar](https://scholar.google.com/), one of the most widely used indexers but with dubious indexing process (any PDF public stored in a university network is indexed). Use with caution. Most of the time, systematic literature reviews[^2] made using Google Scholar is not considered valid.

Another solution is to search directly within the digital libraries of specific publishers (being limited to the papers published by them): [IEEEXplore](https://ieeexplore.ieee.org/), [ACM Digital Library](https://dl.acm.org/), [Elsevier](https://www.elsevier.com/search-results), and others. Most of the time, the access to the full papers is behind a paywall[^1], with a few being open access. Once again, most universities pay for full access.

Searching in pre-print servers also provides good insights on unpublished (or yet to be published) research, [arXiv](https://arxiv.org/).

### From a scientific jobs market (e.g. scholarships) viewpoint:

- [Computeroxy](https://computeroxy.com/)
- [Academic Positions](https://academicpositions.com/)
- [EURAXESS](https://www.euraxess.pt/)

## Systematize

> "We are drowning in information but starved for knowledge." --- John Naisbitt

Too many times, I've read full articles just to find out that the paper is poorly done or that it does not provide any new insight nor raises relevant research questions. While there is no _silver-bullet_ to avoid this, one can make efforts to reduce the number of times it happens. Here goes a list of _steps_:

1. Prioritize surveys over normal papers in the early stages of your research, given that someone already has summarized the existent works for you.
2. Read papers from relevant and solid sources first. This includes highly reputed conferences and journals (more about it in [Publish](#publish)).
3. If the paper is badly formatted --- e.g., with missing figures and _really_ badly written --- avoid it (and revisit if you do not find anything else relevant to your search).
4. If a paper does not have an _experiments & results_ section, give it a low priority. Most of the time, these papers only present ideas or early-stage research that lacks validation.

Now that you have only 999+ papers to read, a reference/paper manager becomes crucial. I have been using [Mendeley Desktop (old version)](https://www.mendeley.com/autoupdates/installers/1.19.3) for long as it provides reference management, PDF organization, and notes with synchronization capabilities. However, some other alternatives exist including [Zotero](https://www.zotero.org/) which appears similar, [Paperpile](https://paperpile.com/), and [Papers by ReadCube](https://app.readcube.com/).

Tools setup done. Now to the reading part. A flowchart by [Subramanyam et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3687192/):

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

### Take notes!

Use markdown. Make backups. Maintain a logbook.

Suggestions: [Obsidian](https://obsidian.md/), [Notion](https://www.notion.so/), [Typora](https://typora.io/), [Standard Notes](https://standardnotes.com/), [Joplin](https://joplinapp.org/), ...

For collaborative quick notes: [hackmd](https://hackmd.io/).

### Mindmaps

Create mindmaps of ideas, subjects, and lines of research.

Suggestions: [Mindmap](https://www.mindmeister.com/), [Xmind](https://www.xmind.net/),...

## Apply

> "You don’t start out writing good stuff. You start out writing crap and thinking it’s good stuff, and then gradually, you get better at it. That’s why I say one of the most valuable traits is persistence." --- Octavia E. Butler

Now that you're up-to-date on the current state-of-the-art, and you have found out that 99.9% of your ideas are already published, you take that 0.1% and put it into action. This is a multi-stage process depending on the work/idea/challenge/issue/whatever, but there are a few common points that can be grasped by analyzing a typical paper structure.

**Use LaTeX**. For articles and small reports, [Overleaf](https://www.overleaf.com/) is a good option. For large projects, [install LaTeX locally](https://milq.github.io/install-latex-ubuntu-debian/). For most code editors, aiding extensions exist, such as [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop).

When writing, [avoid certain words and expressions](https://www.chem.ucla.edu/dept/Faculty/merchant/pdf/Word_Usage_Scientific_Writing.pdf), and [this](https://sites.psu.edu/pubhub/wp-content/uploads/sites/36309/2016/04/WordsandPhrasestoAvoid.pdf), and [this](https://www.webpages.uidaho.edu/wlf314/lecture_notes/PDF/word%20usage.pdf).

### Abstract

Here goes the summary of the paper. Little context, the main challenge, main contribution. It should be supported by numbers or other evidence in a clear and direct form.

Typically, here goes the keywords too. Optimize those keywords to be concrete and _common_ since they play a crucial role in the indexing services as they can use them to pick or not your paper amongst the sea of literature.

### Introduction

Here goes the bedtime story. What's the context and motivation of your work? Is the motivation supported by other authors? What is the concrete problem to be tackled? What are the methods and mechanisms that will be used? What are the main contributions and observations? And what is the paper structure?

Here is a good place to clearly state your problem, including any existing hypothesis, research questions, and others. Also, point to what metrics/aspects will be used to validate your research.

### Related Work

There are, for sure, a good amount of works that are related to your _very specific_ thing. Read them. Cite them. Criticize them. Compare the different works (use tables, charts, etc.). Find your _very specific thing_ that makes your work valuable and differentiates it from the rest. Remember key points, and, if possible, compare the results of other works with your own observations. Sometimes _Related Work_ can appear later in the paper, but it's not so common...

In some cases, Related Work can be preceded by a _Background_ / _Preliminaries_ section where you present the key concepts that the reader needs to grasp in other to understand the following work.

### Approach Overview

What did you do? What is the architecture of your thing? If there are any mathematical formulations or algorithms that should be presented, here is the spot. Try to follow some [pseudo-code conventions](https://onlinelibrary.wiley.com/doi/pdf/10.1002/0470029757.app1). If you are presenting math, clearly present the meaning of all the uncommon symbols that are used on your equations. If there are any software-related diagrams, try to follow UML if possible. [Draw.io is your friend](https://app.diagrams.net/).

Always have an _anonymous_ replication code package with _some_ documentation and meta-data, including _how to setup?_ and _how to run?_ . If you have used Git, there are some services that automatically anonymize your repository, e.g. [anonymous.4open.science](https://anonymous.4open.science/).

### Implementation Details

This is optional. But, if you faced some esoteric issues when implementing your approach, maybe it's best to document them. Here goes code snippets, technologies, and other detail that were not the focus of the _approach_ but did have an impact on your work. Always use correct code syntax and clear highlight.

### Experiments and Results

Is your solution the _best around_? How will you validate it? What is the methodology/design of the experiments? What is the configuration of the validation testbed (computer details, etc.)? In the case of _human_ participants, do not forget to gather information about their experience/background.

Collect as many metrics/data points as possible, even if you don't know if they are going to be useful in the future. Store all of the information in a way that it's easily handled (e.g., CSV files), and never trust your computer with those valuable files --- always keep a cloud-based backup.

Use and _abuse_ of visualizations. Charts, tables, and other relevant visualizations make the data --- and your results --- easier to understand. Use readily available software to do this analysis, e.g. [Google Colab Python Notebooks](https://colab.research.google.com/notebook), [IBM SPSS](https://www.ibm.com/analytics/spss-statistics-software), or good old Excel or Google Sheets.

Always verify the statistical significance (_p_-value) of your results using the appropriate methods, [more info](https://en.wikipedia.org/wiki/Statistical_significance).

Once again, provide replication packages. For data and experiments use [zenodo](https://zenodo.org/) (it has [direct integration with GitHub](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content)).

### Discussion

Here goes a critical analysis of your results and what they mean. If possible, compare the results with existing literature justifying differences in the results. Use additional visualizations if needed.

### Threats to Validity

There are several factors, especially in software engineering, that might influence your results. Typically, these threats are split into the internal and external validity of the experiment. Clearly present the possible threats (e.g., bias) that exist in your research methodology and discuss the effort carried to mitigate or reduce the impact of these threats. More about threats to validity: [Threats to validity of Research Design](https://web.pdx.edu/~stipakb/download/PA555/ResearchDesign.html), [Internal and External Validity](https://sphweb.bumc.bu.edu/otlt/mph-modules/programevaluation/ProgramEvaluation6.html), and [Threats to Validity of your Design](https://cyfar.org/ilm_3_threats).

### Conclusions

Here goes a highlight of the most important takeaways of your article. Also, point to limitations and future work / open research challenges.

### References

References are hard to manage. Maintain your Mendeley up-to-date (Overleaf as a direct Mendeley integration). If you keep your Bibtex manually, use a linter from time to time, e.g. [Online BibTeX Tidy - Clean up BibTeX files](https://flamingtempura.github.io/bibtex-tidy/) and [BibTeX tools](https://caltechlibrary.github.io/bibtex/webapp/).

## Publish

> Publish or Perish. --- Authors et al.

Now that you have your research done, your paper written, it is time to publish. But where? What is the most suitable venue? Is it relevant? Is it predatory (also known as pay-to-publish in some shady and badly indexed website)?

Search for good venues, take into account well-known rankings. For journals, [Scimago Journal & Country Rank](https://www.scimagojr.com/) (Q1 -> Q2 -> Q3 -> Q4 -> nothing important) is golden rule. For conferences, use [CORE](http://portal.core.edu.au/conf-ranks/) (A\* -> A -> B -> C -> nothing important). Some conferences have good workshops and other side events, but they are not taken into account by rankings (if you care about publishing even in workshops, always check if the workshops are part of the proceedings or any companion of the conference).

Other ranks can be useful, such as [G. Scholar Rankings](https://scholar.google.com/citations?view_op=top_venues&hl=en&vq=eng) and [Research.com](https://research.com/).

As a complement, search in websites such as [EasyChair](https://easychair.org/cfp/), [WikiCFP](http://www.wikicfp.com/), and create an account at [Conference Partner](https://www.myhuiban.com/).

If the conference/journal lets you publish a pre-print, publish it as soon as the paper is accepted in the [arXiv](https://phdcomics.com/).

## Broadcast

> "If a tree falls in a forest and no one is around to hear it, does it make a sound?" --- maybe George Berkeley

You have finished your paper, and it is now published. But will somebody read it? While you can't force anyone to read it, you can increase the probability of it happening. Some key points:

- Publish a tweet with the paper title, authors, and, if possible, some key takeaways;
- Create and maintain a personal website with all your research content, with URLs to the papers and abstracts;
- Create and maintain your personal research accounts:
  - [Google Scholar](https://scholar.google.com/)
  - [Authenticus (in Portugal)](https://www.authenticus.pt/)
  - [ORCiD](https://orcid.org/)
  - [Claim your Scopus](https://www.elsevier.com/solutions/scopus/why-choose-scopus/author-profiles)
  - [Claim your ACM Profile](https://www.acm.org/publications/acm-author-profile-page)
  - [Publons](https://publons.com/about/home/) (It is also useful to keep track of the peer reviews)
  - [ResearchGate](https://www.researchgate.net/) (It works like a social network, follow researchers in your research field)
  - [Microsoft Academic](https://academic.microsoft.com/)

Participate and present your work when possible. Go to [meetups](https://www.meetup.com/home/) and other informal gatherings. Advertise, advertise, advertise...

And that's it. I hope you take some new info from this! If not, go have some fun: [xkcd](https://xkcd.com/) and [PHD Comics](https://phdcomics.com/).

[^1]: [Skirting Around Paywalls: How Scientists Quickly Get the Articles They Need](https://incubator.rockefeller.edu/skirting-around-paywalls-how-scientists-quickly-get-the-articles-they-need/). More info [#ICanHazPDF](https://en.wikipedia.org/wiki/ICanHazPDF), [Sci-Hub](https://en.wikipedia.org/wiki/Sci-Hub), and [The Library Genesis Project](https://en.wikipedia.org/wiki/Library_Genesis).
[^2]: [Conducting a Systematic Review](https://libguides.umn.edu/systematicreviews) and [Preferred Reporting Items for Systematic Reviews and Meta-Analyses](http://prisma-statement.org/)
