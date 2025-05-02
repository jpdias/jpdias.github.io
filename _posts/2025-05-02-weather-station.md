---
layout: post
title: "How to Run Your Own Weather Station"
categories: [iot]
tags: [weather,weatherstation,smarthome,iot]
thumbnail: /images/weatherstation/ttgo.jpeg
description: "How Bresser messed up my Weather Station shipment and WiFi connectivity was forgotten along the way, thus hacks were needed."
---

Some months ago I decided to finally acquire a weather station. Nothing fancy, just a cheap enough, no frills, weather station. As I wanted to have the least amount of trouble setting it up, I bought a WiFi-enabled unit, in a way I could stream the data, somehow, via Internet. However, things going smoothly is a rare sight, and there is always more to it. So let's dive into how to stream data to the Internet with a not-so-WiFi-enabled station.

<!--more-->

## The Acquisition

After looking at some deals here and there, I finally found a station with a price tag of ~100€, which seemed like a good deal, the [Bresser WIFI ClearView 7-in-1 (ref. 7002586)](https://www.bresser.com/p/bresser-wi-fi-clearview-weather-station-with-7-in-1-sensor-7002586). The description stated that it came with sensors for measuring wind, humidity, temperature, rainfall, UV level, and light intensity, which would be more than enough for my purpose.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 50%;" alt="Weather station monitor" src="/images/weatherstation/bresser8in1.jpg">
  </div>
</div>


It took only a few days and the package arrived. However, the package stated _8 in 1_ — a fact that I simply ignored. So I proceeded to just install and configure the station. Which boils down to connecting the base station to a power source, adding 4 AA batteries to the sensor station, and installing it on the balcony.

Later that day, I decided to configure the WiFi settings — and that’s when the problems began. The station is supposed to create an access point that can be used to do the first configuration, but no access point was found.After fiddling with it for a while, I decided to give the manual a shot ~~RTFM~~, just to find out that there was nothing about WiFi in there. So, after all, it hit me: I had been shipped the wrong model, the [Bresser 8-in-1 ClearViewTB Weather Station (ref. 7003150)](https://www.bresser.com/p/bresser-8-in-1-clearviewtb-weather-station-7003150).

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 70%;" alt="Weather station monitor" src="/images/weatherstation/bresser.jpeg">
  </div>
</div>


Of course I didn't want all the trouble of shipping it back (especially because it was already mounted), so I went the _hard way_. After just confirming that the transmission protocol of the weather sensor station back to the main station was non-encrypted at 868Mhz, it seemed the perfect project to give some use to some of the hardware that I have laying around.

## The BresserWeatherSensorReceive Project

Of course, I'm not the first one to want to decode the data from the Bresser weather stations. And the work done by [mathias-bs on the project BresserWeatherSensorReceiver](https://github.com/matthias-bs/BresserWeatherSensorReceiver) is the keystone here. Capable of decoding data from most Bresser station models, this piece of magic code can be deployed on any Arduino-compatible platform and just read the data, if you have a compatible radio, namely the CC1101, SX1276/RFM95W, SX1262 or LR1121. If you look carefully to this radio chip list, the SX1276 is a known chip used for LoRa protocol, that also uses 868Mhz in Europe, which is bundle together in a nice packaging in the [TTGO LoRa32 V2.1 (1.6.1)](https://lilygo.cc/products/lora3?variant=42272562282677).

So, having one of those lying around I just created a new PlatformIO project with the example from mathias-bs hoping that everything worked out of the box ~~(famous last words)~~. Of course, nothing is ever so easy, and the library didn't support decoding of the specific model that I got, and the data was empty, so the decoding was failing completely.

```txt
Id: [    6241] Typ: [D] Ch: [0] St: [0] Bat: [Low] RSSI: [-107.5dBm] 
Temp: [---.-C] Hum: [---%] Wmax: [--.-m/s] Wavg: [--.-m/s] Wdir: [---.-deg] Rain: [-----.-mm] UVidx: [--.-] Light: [--.-klx] 
[334842][V][WeatherSensor.cpp:392] getMessage(): [SX1276] Data: D4 6E A7 C8 EB 88 2A D8 AD AA FD AA A8 98 AA BF FC 3E AA 82 22 AA AA BE 3A AA 00 
[334854][D][WeatherSensor.cpp:394] getMessage(): [SX1276] R [D4] RSSI: -70.5
[334861][D][WeatherSensor.h:647] log_message():           Byte #: 00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 
[334874][D][WeatherSensor.h:657] log_message(): De-whitened Data: C4 0D 62 41 22 80 72 07 00 57 00 02 32 00 15 56 94 00 28 88 00 00 14 90 00 AA 
[334887][V][WeatherSensorDecoders.cpp:67] findSlot(): find_slot(): ID=00006241
[334894][D][WeatherSensorDecoders.cpp:105] findSlot(): sensor[0]: v=0 id=0x00006241 t=13 c=0
[334902][V][WeatherSensorDecoders.cpp:130] findSlot(): find_slot(): Storing into slot #0
```

As, unfortunately, time does not grow on trees, I didn't have the time to dedicate myself to understand the protocol and decode the station data as needed. Thus I went the lazy way and opened an issue on the mathias-bs repository [Request for support for 7003150 8 in 1 station #220](https://github.com/matthias-bs/BresserWeatherSensorReceiver/issues/220#issuecomment-2715162555). The answer to the request was swift and in the space of a day I had a working solution. The station features a not-so-common sensor known as a "globe thermometer", which is used to calculate the Wet Bulb Globe Temperature (WBGT)[^1].

At last, we had correct data for the weather station being streamed and matching the values displayed on the display unit.

```txt
Id: [    6241] Typ: [D] Ch: [0] St: [0] Bat: [Low] RSSI: [-104.5dBm]
Temp: [  9.6C] Hum: [ 83%] Wmax: [ 3.9m/s] Wavg: [ 3.8m/s] Wdir: [287.0deg] Rain: [   67.6mm] UVidx: [0.0] Light: [0.5klx] 
[332685][V][WeatherSensor.cpp:392] getMessage(): [SX1276] Data: D4 C3 49 C8 EB 8D CA D8 AF BA E2 AA AC DC AA A3 CC 28 AA AF 9D AA AA AA 4A AA 00 
[332697][D][WeatherSensor.cpp:394] getMessage(): [SX1276] R [D4] RSSI: -106.0
[332705][D][WeatherSensor.h:648] log_message():           Byte #: 00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 
[332717][D][WeatherSensor.h:658] log_message(): De-whitened Data: 69 E3 62 41 27 60 72 05 10 48 00 06 76 00 09 66 82 00 05 37 00 00 00 E0 00 AA 
[332730][V][WeatherSensorDecoders.cpp:67] findSlot(): find_slot(): ID=00006241
[332737][D][WeatherSensorDecoders.cpp:105] findSlot(): sensor[0]: v=0 id=0x00006241 t=13 c=0
[332745][V][WeatherSensorDecoders.cpp:130] findSlot(): find_slot(): Storing into slot #0
```

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 70%;" alt="Weather station monitor" src="/images/weatherstation/wmonitor.jpeg">
  </div>
</div>


## Making the Station Data Accessible

With correct data being collected from the station now it was the time to make the data public. The first option that came to mind was [OpenWeatherMap](https://openweathermap.org/) which was, without a doubt, the best (and the only mentally sane) API that I've found to [register the station and post data](https://openweathermap.org/stations). The problem was that OpenWeatherMap provides nothing other than an API to access the data, nor you can access the data specific for your weather station via any out of the box application.

So looking for other options started. The most common one is [Weather Underground](https://www.wunderground.com/), but they are ongoing some controversy due to changes on the pricing to access their APIs (although it seems not to impact access to your own station data). Anyway, another alternative that came to mind is my favorite (by far) weather application, (Windy)[https://www.windy.com/]. I didn't even know if they supported Personal Weather Stations (PWS, yes, that's a thing), but I quickly found out they rolled out [support for PWS's recently](https://stations.windy.com/)[^2]. 

Ok, so now let's try to stream out some readings. I was expecting half-decent documented API and a simple POST would do the trick (like in OpenWeatherMap). But reality is... weird. 

So first off, depending on the platform, you need to either do a request to register your station (e.g., OpenWeatherMap) or you need to fill out some form to register your station (Windy and PWSweather). Either way you end up obtaining the API key to be used with that specific station, which makes sense.

Then documentation gets harder and harder to find. I believe this is mostly caused by most PWS stations that are WiFi connected out of the box support sending data to several services, with not being so common having integrations done from scratch like this one adventure. 

So, focusing on the not so bad one, Windy has some documentation... [on a forum post from 2019 lost in their forums](https://community.windy.com/topic/8168/report-your-weather-station-data-to-windy), but it’s complete information — better than most. So you basically have a JSON object, which can contain both updates to the station information as well as weather observations. Taking from their own example, you can `POST` to `https://stations.windy.com/pws/update/<API-KEY>`: 

```json
{
 "stations":[
  {"station":0, "name":"My Home Station", "lat":48.2, "lon":28.6, "elevation":80, "tempheight":2, "windheight":10},
  {"station":1, "name":"My Other Station", "lat":47.1, "lon":31.2, "elevation":122, "tempheight":2, "windheight":8}
 ],
 "observations":[
  {"station":0, "dateutc":"2019-03-15T06:15:34", "temp":1.2, "wind":2.8, "winddir":189, "gust":3.7, "rh":76},
  {"station":1, "dateutc":"2019-03-15T06:15:34", "temp":2.6, "wind":1.1, "winddir":135, "gust":2.5, "rh":65}
 ]
}
```

You can even update several stations at the same time. Once again, not bad at all, however it would be nice to have some official documentation on a dedicated page. The problem was that after a few requests, I started to have 401 errors. I did later find out that you can only send a request each 5 minutes (their documentation mentions that _So, it's not necessary send us data every minute, 5 minutes will be fine._, but that goes a long way to be a hard limit). But with some caching of the values and sending them in the array as observations, everything worked out.

However, when trying to streaming data to PWSweather things got _weirder and weirder_. First off, there is not documentation at all, with the references to custom data upload pointing to open support tickets. After looking across old forums and reddit posts I found out that they use the same API as wunderground. And [some random user on one of the random forums](https://www.wxforum.net/index.php?topic=39535.0) tested a lot of endpoints and found out that several? endpoints worked to send data:

- pwsweather.com /pwsupdate/pwsupdate.php?
- pwsweather.com /weatherstation/updateweatherstation.php? 

but... why the query parameter to send data? _wut?_ (at this point I was expecting that it was some kind of typo). Let's look into the Weather Underground API now that we have endpoints to test against. So I quickly found a [StackOverflow post](https://stackoverflow.com/questions/56393298/how-to-upload-data-from-my-personal-weather-station) that make it as clear as possible:

> To upload data, send a GET request to `https://weatherstation.wunderground.com/weatherstation/updateweatherstation.php`
>
> A full example: `/updateweatherstation.php?ID=KCASANFR5&PASSWORD=XXXXXX &dateutc=2000-01-01+10%3A32%3A35&winddir=230&windspeedmph=12&windgustmph=12&tempf=70&rainin=0&baromin=29.1&dewptf=68.2&humidity=90&weather=&clouds=&softwaretype=vws%20versionxx&action=updateraw`
> 
> The minimum required query parameters are:
> 
>     ID: the station id
>     PASSWORD: the station key
>     dateutc: the time in format YYYY-MM-DD HH:MM:SS, or "now"

I don't even know what to say. But summarizing the problems:

- Using a GET and query parameters to send data
- Only supports US units of measurement and not supporting metric
- Only supports specific units for certain measurements that are not the most common ones (e.g. barometric pressure is commonly measured in milibar/hPa, but somehow the API accepts inches Hg[^3])

But this seems somehow a standard across several weather services, which [The Weather Company]()[^4] defines as the [PWS Upload Protocol](https://support.weather.com/s/article/PWS-Upload-Protocol?language=en_US).

Anyhow, using this hell-raised API I was finally able to post data to the PWS weather website.

## How It Looks Like

So, after all the struggling, from the wrong weather station model to mess around with nonsense APIs, I was able to have a nice running solution. 

The receptor unit based on the TTGO with the decoder up and running and streaming data to both PWS Weather and Windy, using the small screen to showcase some real time data and the last HTTP request status code can be seen bellow.

<div class="row" style="text-align:center">
  <div class="column">
    <img style="width: 70%;" alt="TTGO" src="/images/weatherstation/ttgo.jpeg">
  </div>
</div>


The following screenshot is from the Windy website, which you can [visit here](https://www.windy.com/station/pws-f0a5fd68?40.230,-8.440,8).

![Windy Terronhas PWS](/images/weatherstation/windy.png)

And on [PWS Weather we can see data with more detail](https://www.pwsweather.com/station/pws/terronhas).

![PWS weather Terronhas PWS](/images/weatherstation/pws.png)



## Footnotes

[^1]: The WetBulb Globe Temperature (WBGT) is a measure of the heat stress in direct sunlight, which takes into account: temperature, humidity, wind speed, sun angle and cloud cover (solar radiation). [weather.gov](https://www.weather.gov/tsa/wbgt)
[^2]: Windy on its free tier only allows you to check the data for the last week, but that's fine because we will also stream the data to [PWS Weather platform by  Vaisala Xweather](https://www.pwsweather.com/) which keeps historical data with pretty charts and exports (and uses the exact same API as Windy).
[^3]: 1 inHg = 33.86389 hPa
[^4]: The Weather Company owns both [weather.com](https://weather.com/?Goto=Redirected) and [Weather Underground](https://www.wunderground.com/).

