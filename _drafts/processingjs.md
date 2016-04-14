---
layout: code
title: processingjs boilerplate
image:
categories: [ processingjs ]
deps: [ 'https://rawgit.com/processing-js/processing-js/v1.4.8/processing.min.js' ]
---
<style>
    canvas{
        background: #fff;
    }
</style>

<canvas id="render"></canvas>

<script type="text/processing" data-processing-target="render">
    //documentation: <a href="http://processingjs.org/reference/">http://processingjs.org/reference/</a>

    void setup() {
        size(1200, 200);
        background(100);
    }

    void draw(){
        ellipse(mouseX, mouseY, 25, 25);
    }
</script>