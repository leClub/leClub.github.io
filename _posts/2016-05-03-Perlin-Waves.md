---
layout: code
title: Perlin Waves
image: Perlin-Waves.png
categories: [ big, js, canvas, simplexnoise ]
deps: [ 'https://cdn.rawgit.com/jwagner/simplex-noise.js/master/simplex-noise.min.js', 'https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js' ]
---
<style>
    #container{
        position: relative;
    }
    .dg{
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
<div id="container">
    <canvas id="cnvs"></canvas>
</div>

<script>
    window.addEventListener('load', function(){
        var canvas = document.getElementById('cnvs'),
            context = canvas.getContext('2d'),
            width = window.innerWidth < 1200 ? window.innerWidth : 1200,
            height = 600;

        canvas.width = width;
        canvas.height = height;

        window.addEventListener('resize', function(){
            width = window.innerWidth < 1200 ? window.innerWidth : 1200;
            height = 600;
            canvas.width = width;
            canvas.height = height;
        });

        ///////////////////////////////////////////////
        // simplex-noise: https://www.npmjs.com/package/simplex-noise
        var simplex = new SimplexNoise(),
            t = 0;

        var params = {
            xOffset: 120,
            yOffset: 10,
            scaleX: 200,
            scaleY: 150,
            scaleT: 400
        };
        var gui = new dat.GUI({ autoPlace: false });

        document.getElementById('container').appendChild(gui.domElement);

        gui.add(params, 'xOffset', 10, 300);
        gui.add(params, 'yOffset', 2, 30);
        gui.add(params, 'scaleX', 50, 500);
        gui.add(params, 'scaleY', 50, 500);
        gui.add(params, 'scaleT', 50, 500);

        function setup(){
            animate();
            context.strokeStyle = '#FB3550';
            context.fillStyle = 'rgba(32,43,56,0.5)';
            context.lineWidth = 1;
        }

        function animate(){
            window.requestAnimationFrame(animate);
            context.fillRect(0,0,width,height);

            for (var y = -300; y <= height+300; y+=params.yOffset) {
                context.beginPath();
                context.moveTo(0, y);
                var py = y;
                for (var x = -100; x <= width+100; x+=params.xOffset) {
                    var ny = y + simplex.noise3D(x / params.scaleX, y / params.scaleY, t/params.scaleT) * 40;
                    context.bezierCurveTo(x, py, x+params.xOffset/3, ny, x+2*params.xOffset/3, ny);
                    py = ny;
                }
                context.stroke();
            }
            t++;
        }

        setup();
        window.addEventListener( 'resize', setup );
    });
</script>