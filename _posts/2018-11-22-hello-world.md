---
layout: post
title:  "Hello, World!"
categories: [generic]
tags: [helloworld]
---

**Hello world**, this is my first blog post. A place for sharing ideas, thoughts, experiments and other tales of a jack-of-all-trades and master of *some*.
<!--more-->

All the lines of text, lines of code (LoC), circuit diagrams and everything else that will be shared here alongside with all of their bugs and typos are my own and under the [*MIT license*](https://opensource.org/licenses/MIT) (otherwise the origin will be cited).

Now in Typescript:

{% highlight typescript %} 
class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return this.greeting
    }
};

var greeter = new Greeter("Hello, World!")
console.log(greeter.greet())

{% endhighlight %}

So, if you're reading this, **welcome to Tales of I/O**. 

For any feedback, ideas, doubts ~~and bugs and typos~~ feel free to [contact me](/contact).