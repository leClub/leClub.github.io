---
layout: code
title: runejs boilerplate
image:
categories: [ runejs ]
deps: [ 'http://runemadsen.github.io/rune.js/js/rune.min.js' ]
---
<style>
    svg{
        background: #ff0;
    }
</style>

<div id="render"></div>

<script>
    // documentation <a href="http://runemadsen.github.io/rune.js">http://runemadsen.github.io/rune.js</a>

    window.addEventListener('load',function(){
        var r = new Rune({
            container: "#render",
            width: 1200,
            height: 600
        });

        var p = r.polygon(200, 100)
            .stroke(false)
            .fill(30, 30, 30);

        for(var i = 0; i < 40; i++) {
            p.lineTo(Math.random() * 400, Math.random() * 400);
        }

        r.draw();
    });
</script>