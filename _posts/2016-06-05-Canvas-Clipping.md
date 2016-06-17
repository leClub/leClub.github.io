---
layout: code
title: Playing with Clipping
image: Playing-with-Clipping.PNG
categories: [ big, canvas, simplexnoise ]
deps: [ 'https://cdn.rawgit.com/joshforisha/fast-simplex-noise-js/master/main.js' ]
---
<canvas id="render"></canvas>

<script>
    var cnvs = document.querySelector('#render'),
        ctx = cnvs.getContext('2d'),
        frameCount = 0,
        size = 60,
        width, height, t, nx, margeX, ny, margeY;

    var simplex;

    function setSize() {
        width = cnvs.width = window.innerWidth < 1200 ? window.innerWidth : 1200;
        height = cnvs.height = 600;
        console.log( 'setSize', width, height );
        nx = Math.ceil(width / size);
        margeX = (width - nx * size) / 2;
        ny = Math.ceil(height / size);
        margeY = (height - ny * size) / 2;
        
        simplex = new FastSimplexNoise( {
            min: 0,
            max: 1
        } );
        
        draw();
    }

    function draw() {
        window.requestAnimationFrame(draw);
        ++frameCount;

        ctx.fillStyle = '#1E2630';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#FB3550';
        for (var y = 0; y < ny; y++) {
            for (var x = 0; x < nx; x++) {
                ctx.save();
                ctx.translate(margeX + x * size, margeY + y * size);
                ctx.rect(0, 0, size, size);
                ctx.clip();
                ctx.translate(size / 2, size / 2);
                ctx.lineWidth = 2 + simplex.in3D(x / 30, y / 30, frameCount / 500) * size / 3;
                ctx.rotate(simplex.in3D(x / 30, y / 30, frameCount / 500) * 2 * Math.PI)
                ctx.beginPath();
                ctx.moveTo(-size / 2, -size / 2);
                ctx.lineTo(size / 2, size / 2);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    window.addEventListener('load', setSize);
    window.addEventListener('resize', setSize);
</script>