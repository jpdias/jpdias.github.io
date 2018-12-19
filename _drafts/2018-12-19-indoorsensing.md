---
layout: post
title:  "Indoor Sensing Hub powered by Mozilla *Things Framework*"
categories: [hardware, iot]
tags: [hardware, webofthings, iot, mozilla]
description: Building a indoor sensing hub with several sensors using the Mozilla Things Framework.
---

The *Web of Things* aims to build the Internet of Things in a truly open, flexible, and scalable way, using the Web as its application layer. Empowering this idea, Mozilla has been making efforts towards a Web of Things standards, providing a gateway implementation along with libraries for the most common languages. In this blog post we gonna go through the process of *making* a Web of Things device.

<!--more-->

Before entering into the details of Web of Things, one must present its origin, the Internet-of-Things. The Internet-of-Things can be seen as the result of the interconnection via the Internet of computing devices embedded in everyday objects, enabling them to send and receive data. This paradigm-shift provoked a ripple effect transformating everyday objects into *smart* objects, thus being widespread in terms of domains of application.

This paradigm-shift opened a window on new market opportunities that lead to several companies to create new products to this new markets, such as the smart-home. However, *despite utopian visions of seamless home automation, the smart home technology market, like every other, is **fragmented*** [[1]](#defrag)[[2]](#enemy). Several companies, institutions and other entities (including governmental ones) have been working on standards for asssuring the interoperability and reducing the technological fragmentation of IoT. 

Web of Things, as a subset of the Internet-of-Things proposes the creation a decentralized Internet-of-Things by giving Things URLs on the web to make them linkable and discoverable, and defining a standard data model and APIs to make them interoperable[[4]](#projectthings).

Mozilla, as a defender of the mission of *"keeping the internet open and accessible to all"* and putting efforts on building a better Internet [[3]](#moz) has embraced the Web of Things innitiative and created **Project Things**[[4]](#projectthings). This project distinguish itself from the other standardization innitatives due to the fact that it is built upon existing web standards such as HTTP, REST, JSON, WebSockets and TLS.


**Project Things**[4]](#projectthings) is an experimental framework of software and services from Mozilla for connecting "things" to the web and will consist of three main components:
- Web Thing API: A common data model and API for the Web of Things.
- Things Gateway: An implementation of a Web of Things gateway that leverages the Web Thing API.
- Things Cloud: A collection of IoT cloud services.
- Things Framework: A collection of re-useable software components for building Web Things, which directly expose the Web Thing API.

> The goal of this project is to built a Web of Things device capable of sensing its surrondings by measuring temperature, humidity and motion. *Plus* be able to show any information in a OLED screen.

## The Hardware

## The Software

## Final Result


<small>

1. <a id="defrag" href="https://www.oreilly.com/ideas/the-iot-needs-a-defrag">The IoT needs a defrag</a>
2. <a id="enemy" href="https://www.qualcomm.com/news/onq/2016/02/19/fragmentation-enemy-internet-things">Fragmentation is the enemy of the Internet of Things</a>
3. <a id="moz" href="https://www.mozilla.org/en-US/mission/">Mozilla Mission</a>
4. <a id="projectthings" href="https://iot.mozilla.org/">Web of Things</a>
4. <a id="wot" href="https://webofthings.org/">Web of Things</a>

</small>