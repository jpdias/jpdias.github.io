---
layout: post
title:  "Indoor Sensing Hub powered by Mozilla Things Framework"
categories: [hardware, iot]
tags: [hardware, webofthings, iot, mozilla]
description: Building an indoor sensing hub with several sensors using the Mozilla Things Framework.
---

The *Web of Things* aims to build the Internet of Things in a truly open, flexible, and scalable way, using the Web as its application layer. Empowering this idea, Mozilla has been making efforts towards a Web of Things standards, providing a gateway implementation along with libraries for the most common languages. In this blog post, we will go through the process of *making* a Web of Things device.

<!--more-->


<img src="/images/indoorsensing/mozilla_iot_wordmark.png" style="width:200px; padding-left:8px" align="right">

Before entering into the details of Web of Things [[7]](#wot), one must present its origin, the Internet-of-Things. The Internet-of-Things can be seen as the result of the interconnection via the Internet of computing devices embedded in everyday objects, enabling them to send and receive data. This paradigm-shift provoked a ripple effect transforming everyday objects into *smart* objects, thus being widespread in terms of domains of application.

This paradigm-shift opened a window on new market opportunities that lead to several companies to create new products for these new markets, such as the smart-home. However, *despite utopian visions of seamless home automation, the smart home technology market, like every other, is **fragmented*** [[1]](#defrag)[[2]](#enemy). Several companies, institutions and other entities (including governmental ones) have been working on standards for assuring the interoperability and reducing the technological fragmentation of IoT. 

Web of Things, as part of the Internet-of-Things initiative, proposes the creation a decentralized Internet-of-Things by giving Things URLs on the web to make them linkable and discoverable, and defining a standard data model and APIs to make them interoperable [[4]](#projectthings).

Mozilla, as a defender of the mission of *"keeping the internet open and accessible to all"* and putting efforts on building a better Internet [[3]](#moz) has embraced the Web of Things initiative and created **Project Things** [[4]](#projectthings). This project distinguishes itself from the other standardization initiatives due to the fact that it is built upon existing web standards such as HTTP, REST, JSON, WebSockets and TLS.


**Project Things** [[4]](#projectthings) is an experimental framework of software and services from Mozilla for connecting "things" to the web and will consist of three main components:
- Web Thing API: A common data model and API for the Web of Things.
- Things Gateway: An implementation of a Web of Things gateway that leverages the Web Thing API.
- Things Cloud: A collection of IoT cloud services.
- Things Framework: A collection of reusable software components for building Web Things, which directly expose the Web Thing API.

> **The goal of this project is to build a Web of Things device capable of sensing its surroundings by measuring temperature, humidity and sensing motion. *Plus* be able to show any information in an OLED screen and operating status in a LED.**

## The Hardware

### 3D Printed Sensing Hub Box

After searching on [Thingiverse](https://www.thingiverse.com/) we found out this cool [3D printed modular case for a NodeMCU ESP8266](https://www.thingiverse.com/thing:2627220) microcontroller. Since it fits my goal of having multiple components, and, even, upgrade it with more components if needed, it was a go-go.

Count | 3D Part
------|------
1     | Base_NodeMCU
1     | Dome
1     | Temperature_sensor_module
1     | Small_OLED_screen_module
1     | PIR_module

<div class="imgsdiv">
    <div class="row">
        <div class="column">
            <img src="/images/indoorsensing/3d1-min.jpg">
        </div>
        <div class="column">
            <img src="/images/indoorsensing/3d2-min.jpg">
        </div>
        <div class="column">
            <img src="/images/indoorsensing/3d3-min.jpg">
        </div>
    </div>
</div>

Some modifications were done to this models after printing for fitting a breadboard into the *Base_NodeMCU*. All the printing was done using an Anet A8 printer.

### Parts and Circuits

Count | Part
------|------
1     | NodeMCU ESP8266
1     | LED (red)
1     | PIR Motion Sensor
1     | DHT11 Temperature/Humidity Sensor
1     | 0.96" I2C OLED 128x64 Screen
*     | Jump wires (Male-Female) 
1     | Mini Breadboard

The NodeMCU board was picked up since it is cheap, has a built-in wireless shield and is compatible with almost any Arduino libraries and scripts.

All the parts were brought on *eBay*. You can easily find similar ones on *Aliexpress*, *Amazon* or any other hardware parts seller.

![Circuit](/images/indoorsensing/indoorsensing_circuit.png)

[Fritzing Schematic Download](/images/indoorsensing/indoorsensing_circuit.fzz)

## The Software

Using the Mozilla Things Framework is as easy as adding the ```webthing-arduino``` and ```ArduinoJson``` libraries to the PlatformIO project. Further, for starting a web server in the NodeMCU the ```ESP Async WebServer``` is used.

For the sake of simplicity for reading and writing data from and to the different parts several libs were used, namely:
- ``` DHT sensor library```: Reading data from the DHT sensor.
- ```Adafruit GFX Library```, ```Adafruit_SSD1306``` and ```OneWire```: Writing data on the OLED screen using the I2C connection [[5]](#i2c).
- ```TaskScheduler```: For scheduling recurring tasks (due to limitations of the DHT sensor, we cannot read data all the times, so we need to schedule it in the Arduino *loop*).

After setting up the dependencies, let's focus on the ```main.cpp```.

### Setting up the Internet connection

Using the lib ```ESP8266WiFi``` we can set up the Wireless.

**Defining the connection settings**:

{% highlight C %} 
char *ssid = WLAN_SSID;
char *password = WLAN_PASS;
{% endhighlight %}

**Setting up the connection**:

{% highlight C %} 
void setup()
{
    ...
    WiFi.begin(ssid, password);
    ...
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        digitalWrite(STATUSLED, PIN_STATE_HIGH);
        delay(500);
        digitalWrite(STATUSLED, PIN_STATE_LOW);
        delay(500);
    }

    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    digitalWrite(STATUSLED, PIN_STATE_HIGH);
    ...
}
{% endhighlight %}

And we're now connected to the local network.

### Creating a new WebThingAdapter (our *web thing*)

{% highlight C %} 
WebThingAdapter *adapter;

void setup()
{
    adapter = new WebThingAdapter("indoorsensor", WiFi.localIP());
    ...
    // add all the components here
    ...
    adapter->begin();
}
{% endhighlight %} 

From this point on we already have our thing being announced to the local network using mDNS [[6]](#mdns) and we can access the device on our browser using the address: ```http://indoorsensor.local```. The result page presents a JSON (as defined by the Web Thing API) with information about all the devices (components) connected to our thing.

### Adding components to our Adapter

This is an example of how to add the DHT sensor to the *web thing*. A similar process is needed for all the other parts.

{% highlight C %} 
const char *dht11Types[] = {nullptr};
ThingDevice indoor("dht11", "Temperature & Humidity Sensor", dht11Types);
ThingProperty indoorTempC("temperatureC", "", NUMBER, nullptr);
ThingProperty indoorHum("humidity", "", NUMBER, nullptr);

void readDHT11data()
{
  Serial.println("Updating DHT data.");
  //Serial.println("f-readDHT11data");

  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)

  if (isnan(h) || isnan(t) || isnan(f))
  {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  ThingPropertyValue value;

  value.number = t;
  indoorTempC.setValue(value);
  value.number = h;
  indoorHum.setValue(value);
}

void setup(){

  indoor.addProperty(&indoorTempC);
  indoor.addProperty(&indoorHum);
  adapter->addDevice(&indoor);

}

void loop(){
  readDHT11data();
  adapter->update();
}
{% endhighlight %} 

**Going through the code**:
- Firstly we create a component of the *thing* with the ```ThingDevice```
- Then we add the properties of that specific part with several ```ThingProperty``` calls.
- We define a function to retrieve the sensor data ```void readDHT11data()```:
    - In this function we create a new ```ThingPropertyValue value;```
    - For each value that we want to update or set we create a temporary variable with the value ```value.number = t;``` and then set this value to the respective```ThingProperty```, ```indoorTempC.setValue(value);```.
- In each loop we retrieve the values calling the respective function, in the case, the ```readDHT11data()``` function.
- At last, we update our adapter with the new data from the sensors.

### Parts Detail

Connecting all the different components resulted in some extra effort due to particularities of them. Those particularities are described in the following paragraphs.

#### Reading data from DHT

All the DHT sensors have the need of setting a delay between reads. The documentation mentions a time of approx. 2000 milliseconds between reads. However, the execution period of each *loop* is lower than that, and it is not guaranteed the exact execution time (can depend on the hardware and components). In order to assure that we just try to read data from the DHT with a given periodicity (above 2000 milis in the case of DHT), we need to keep track of time.

Using the lib ```TaskScheduler``` we can easily create tasks that are executed just at a given time. As an example we can see the following code:

{% highlight C %} 
Task t1(5000, TASK_FOREVER, &readDHT11data);//create task for readDHT11data, 
                                            //that execute forever, at 5000 milliseconds intervals
Scheduler runner; //Setup of the task runner

void setup()
{
    ...
    runner.init();
    Serial.println("Initialized scheduler");

    runner.addTask(t1);
    Serial.println("added t1");
    ...
    
    t1.enable();
    Serial.println("Enabled task t1");
}

void loop(){
    runner.execute();
    ...
}

{% endhighlight %} 

#### Connecting the OLED Screen

The OLED screen uses I2C communication (reducing the number of pins used). We have a 4 pin connection, the VCC, GND, Serial Data Line (SDA) and Serial Clock Line (SCL) [[5]](#i2c). Using the ```Adafruit_SSD1306``` for connecting to it, we need to know the hardware address to communicate with it. For finding it out we can use the I2C scanner ([gist available here](https://gist.github.com/tfeldmann/5411375)) to check all the pins.

In NodeMCU boards it is recommended to connect any I2C devices to pins D1 and D2 (as presented in the above circuit schematic).

{% highlight C %} 
#define SCL_PIN 5 //D1
#define SDA_PIN 4 //D2
#define OLED_ADDR 0x3C

String lastText = "moz://a iot";

Adafruit_SSD1306 display(-1); // -1 = no reset pin

void setup(){
  display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
  display.clearDisplay();
  display.display();

  displayString(lastText);
}
{% endhighlight %} 

**Going through the code**:
- Init the ```Adafruit_SSD1306``` lib. In our case the OLED screen doesn't have a reset pin, so we need to pass a -1 to the function.
- Start the display ```display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);````
- Clean any data that could be on the display and display the data. In this case, the screen must remain empty.
- Call the function that writes to the screen ```displayString(lastText);```
- The string *moz://a iot* should appear on the screen.

-> *Bonus Tip* 

In our case, due to the screen used and printing details, we used our screen upside down, so we created a [fork](https://github.com/iotlivinglab/Adafruit_SSD1306) of the original Adafruit lib and added a *void flip()* function that redraws anything on the screen, making it readable in the right direction. 


#### Checking for motion

Since the motion sensor can be triggered at any time, we can't simply check for motion in the *loop*. For that purpose, we can use interrupts [[8]](#8). So, instead of using the common ```pinMode(PIR, INPUT);```, we must use the ```INPUT_PULLUP``` flag. This allows us to hook a function when the value of the pin changes (flag ```CHANGE```). Since we're working with a digital input, this means that the value changes from 0 to 1 when it senses motion and makes a call to the ```motionDetectedInterrupt``` function.

{% highlight C %} 
int state = false; 

void motionDetectedInterrupt()
{
  Serial.println("Motion Detected!");
  state = !state;
}

void setup(){
  pinMode(PIR, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIR), motionDetectedInterrupt, CHANGE);
}
{% endhighlight %} 

Our ```motionDetectedInterrupt``` function toggles the value of the global variable ```state``` when it senses motion, and, then, when it stops sensing it. Then we can easily read this state using the same approach that we used in the case of the DHT sensor, making the boolean data available by calling the respective endpoint. 


> **All the code is available on [GitHub](https://github.com/iotlivinglab/indoorsensinghub).**

## Final Result

<div class="imgsdiv">
    <div class="row">
        <div class="column">
            <img src="/images/indoorsensing/final1-min.jpg">
        </div>
        <div class="column">
            <img src="/images/indoorsensing/final2-min.jpg">
        </div>
        <div class="column">
            <img src="/images/indoorsensing/final3-min.jpg">
        </div>
    </div>
</div>

### Resulting JSON Schema

{% highlight JSON %} 
[
  {
    "name": "Text display",
    "href": "/things/textDisplay",
    "@context": "https://iot.mozilla.org/schemas",
    "@type": [
      "TextDisplay"
    ],
    "properties": {
      "text": {
        "type": "string",
        "href": "/things/textDisplay/properties/text"
      }
    }
  },
  {
    "name": "Temperature & Humidity Sensor",
    "href": "/things/dht11",
    "@context": "https://iot.mozilla.org/schemas",
    "@type": [],
    "properties": {
      "temperatureC": {
        "type": "number",
        "href": "/things/dht11/properties/temperatureC"
      },
      "temperatureF": {
        "type": "number",
        "href": "/things/dht11/properties/temperatureF"
      },
      "humidity": {
        "type": "number",
        "href": "/things/dht11/properties/humidity"
      },
      "heatIndex": {
        "type": "number",
        "href": "/things/dht11/properties/heatIndex"
      },
      "dewPoint": {
        "type": "number",
        "href": "/things/dht11/properties/dewPoint"
      }
    }
  },
  {
    "name": "PIR Motion sensor",
    "href": "/things/motion",
    "@context": "https://iot.mozilla.org/schemas",
    "@type": [],
    "properties": {
      "motion": {
        "type": "boolean",
        "href": "/things/motion/properties/motion"
      }
    }
  }
]
{% endhighlight %} 

All the data is available by checking the respective ```href```, and we know *a priori* the type of data. Further, we can leverage the API to have additional data like descriptions. 

In a future post, we gonna talk about accessing the Indoor Sensing Hub data, storing it and, then, visualizing it. And, also, adding MQTT support to it.

<small>
#### References

1. <a id="defrag" href="https://www.oreilly.com/ideas/the-iot-needs-a-defrag">The IoT needs a defrag</a>
2. <a id="enemy" href="https://www.qualcomm.com/news/onq/2016/02/19/fragmentation-enemy-internet-things">Fragmentation is the enemy of the Internet of Things</a>
3. <a id="moz" href="https://www.mozilla.org/en-US/mission/">Mozilla Mission</a>
4. <a id="projectthings" href="https://iot.mozilla.org/">Web of Things</a>
5. <a id="i2c" href="https://en.wikipedia.org/wiki/I%C2%B2C">I²C</a>
6. <a id="mdns" href="http://www.multicastdns.org/">Multicast DNS</a>
7. <a id="wot" href="https://webofthings.org/">Web of Things</a>
8. <a id="8" href="https://en.wikipedia.org/wiki/Interrupt">Interrupt</a>


</small>