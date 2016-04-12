---
layout: code
title: p5js boilerplate
image:
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js' ]
---
<style>
    canvas{
        background: #fff;
    }
</style>

<div id="render"></div>

<script>
    //documentation: <a href="http://p5js.org/reference/">http://p5js.org/reference/</a>

    window.addEventListener('load', function(){
        var sketch = function (p) {
            var gray = 0; 

            p.setup = function () {
                p.createCanvas(1200, 400);
            };

            p.draw = function () {
                p.background(gray);
                p.rect(p.width/2, p.height/2, 200, 200);
            };

            p.mousePressed = function () {
                gray = (gray + 16) % 256;
            };
        };

        new p5(sketch, document.getElementById('render') );
    });
</script>