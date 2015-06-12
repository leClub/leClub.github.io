---
template: posts/single.html
title: "Trying MeteorJS"
author: Clément Renaud
date : Fri 12 June 2015
---


After years working with AngularJS, node and Python Flask, I thought it may be time for a fresh start in the moving world a the JS framework. I am in deep love with d3js already and a quick look at React convince me that I should keep exploring the fierce world of JS libs. 

The new cool kid on the block is without doubt Meteor, which offer promises like real-time collaboration, mobile compliant design, and flowless client/server integration in JS. Looking around the web, you can read things like "I am so jealous of people working daily with MeteorJS" and "MeteorJS is the new Rails for Javascript".  A first grasp of the framework seems to confirm those statements. I have catched myself thinking "they even solved this" at least 5 times in the first 15 min of discovery - literally saving hundreds of hard-to-debug hard-to-write lines of server and client code.  I could have written a post called "the 100 reasons why I am so happy to finally find something worth leaving Angular JS" but instead I figured out it will more interesting to drive in-depth in the making of a simple app with MeteorJS.

<div class="container">
    <div class="three columns">&nbsp;</div>
    <div class="six columns">
        <blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">switching to <a href="https://twitter.com/meteorjs">@meteorjs</a> will finally relieve me from the endless pain of using <a href="https://twitter.com/hashtag/angularjs?src=hash">#angularjs</a> . I may miss Python though</p>&mdash; clemsos (@clemsos) <a href="https://twitter.com/clemsos/status/604576726237118464">May 30, 2015</a></blockquote>
        <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
    <div class="three columns">&nbsp;</div>
</div>

I will cover here the few things that are required to create solid app, and my experience doing them with MeteorJS : 

1. Looking for information, libs and tutos online (the meteor community)
1. Package management and working with other JS libs (d3js, processingjs)
1. Testing and test-driven development (using Moccha)
1. Deployment toolkit (Ansible, meteor-up)


### Seeking info : the Meteor community

Despite is young age, the framework is already surpported by numerous resources to learn, develop and exchange on updates. Like Rails, there is a whole set of people thta have positionned themselves as Meteor consultants and offer paid courses and online trainings. Meteor looks like a very well-funded project and part of its success relies on the creation of an ecosystem of full-time developers commited to create and maintain packages and learning materials. 

Despite being an open-source project, the information about Meteor looks sort of centralized. The platform [Crater.io](https://crater.io/) drives the dicussions by gathering most of the news around MeteorJS. The community of MeteorJS developers are quite proactive in creating learning resources (check [this rep](https://github.com/ericdouglas/Meteor-Learning) or this Facebook group [Learn MeteorJS Properly](https://www.facebook.com/groups/1498505377066142/)). Most of the packages are on Github and lots of discussions are on Twitter or within the reps' issues tracker itself. 

### Package management 

Meteor has its own package management and packages are available through  called [AtmosphereJS](https://atmospherejs.com). You can easily add other JS libs by command-line ```meteor add d3js:d3``` or ```meteor add bgrayburn:processingjs```, working for both node and JS frontend libs. Think about bower+npm together. One big issue is that AthmosphereJS is NOT open-source so far but has an open [bug tracker](https://github.com/percolatestudio/atmosphere/issues). This looks like an ethically discutable practice to keep code private while asking users for free feedbacks. Atmosphere may bring tensions inside the community by not releasing its code, especially if ranking and/or commercial services are introduced - like NPM and its [private modules](https://www.npmjs.com/private-modules).

### Testing and test-driven development (Moccha and Velocity)

The preffred test frawmework for MeteorJS is [Velocity](http://velocity.meteor.com). The most interesting part of it is that is integrated flawlessly in the interstices of MeteorJS design. It provides a specific test window in the navigator to monitor your tests (including some performance reports). You can chose to use it with most of the actual JS test frameworks (Mocha, Javascripts, Cucumber...)

Velocity will create sample tests with two folders and files to get you started : ```tests/mocha/client/sampleClientTest.js``` and ```tests/mocha/server/sampleServerTest.js```. One great thing is that testing of client-side and server-side code follow a common logic. I didn't experiment much with the workflow but you could imagine a "feature-based" test-driven development, where all frontend and backend tests will be stored in a single folder - ex. ```tests/mocha/featureX/clientTest.js``` and ```tests/mocha/featureX/serverTest.js```. It may not be very relevant but it shows how a framework like MeteorJS can brings innovative ideas for development - and of course applications and services.

<script src="http://gist-it.appspot.com/github/meteor-velocity/velocity-examples/blob/master/leaderboard-mocha/tests/mocha/client/clientTest.js?slice=40:52"></script>

### Deployment of a Meteor app

Meteor is shipped with the ability to deploy directly a basic app using ```meteor deploy my_app_name.meteor.com```,  bringing the app live at the address  ```http://my_app_name.meteor.com ```.  To deploy to your own server, you will need to install node and mongo and the rest is just about doing an ```npm install```. There is lots of scripts that will help you, like [Meteoric.sh](https://github.com/julien-c/meteoric.sh) for Amazon EC2. The best solution seem to be [Meteor Up](https://github.com/arunoda/meteor-up) that allows to tweak the configuration of your server directly with a single json file. Of course, you can use something like [Ansible](http://ansible.org) to provision your machine (see [this example](https://github.com/westonplatter/example_meteor_deploy)). There is also a clean [Docker image](https://github.com/meteorhacks/meteord) available. 

With all the embed package management and configuration, Meteor looks really portable and quite easy to deploy. Of course, the complexity often comes from having different component but the idea of having just to run a single ```meteor``` command to run tests, install missing packages and start the app sounds already very convenient. Now still to see how it works in practice and what are the downsides of having that much automation embed in the framework. 



