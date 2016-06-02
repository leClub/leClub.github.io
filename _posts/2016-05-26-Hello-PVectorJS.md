---
layout: code
title: Hello PVectorjs
image: Hello-PVectorjs.png
categories: [ js, canvas, pvectorjs, tweenmax ]
deps: [ 'https://cdn.rawgit.com/MAKIO135/pvectorjs/master/build/pvector.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js' ]
---
<canvas id="cnvs"></canvas>

<script>
    window.addEventListener('load', function(){
        var canvas = document.getElementById('cnvs'),
            context = canvas.getContext('2d'),
            width = window.innerWidth < 1200 ? window.innerWidth : 1200,
            height = 400;

        canvas.width = width;
        canvas.height = height;

        window.addEventListener('resize', function(){
            width = window.innerWidth < 1200 ? window.innerWidth : 1200;
            height = 400;
            canvas.width = width;
            canvas.height = height;
        });

        ///////////////////////////////////////////////
        var mouse, gridSize = 20,
            nx, ny, marginX, marginY;

        function setup(){
            mouse = {x:0, y:0};
            nx = ~~(width/gridSize) + 1;
            ny = ~~(height/gridSize) + 1;
            marginX = width - gridSize * nx;
            marginY = height - gridSize * ny;

            context.strokeStyle = '#FB3550';
            moveMouse();
            animate();
        }

        function moveMouse(){
            TweenMax.to(mouse, 1, {
                x:~~(Math.random()*width),
                y:~~(Math.random()*height),
                onComplete:moveMouse,
                ease:Power1.easeInOut
            });
        };

        function animate(){
            window.requestAnimationFrame(animate);

            context.fillStyle = '#1E2630';
            context.fillRect(0,0,width,height);

            context.fillStyle = '#FB3550';
            var vMouse = new PVector(mouse.x, mouse.y);
            for (var y = 0; y <= ny; y++) {
                for (var x = 0; x <= nx; x++) {
                    var pos = new PVector(marginX + x * gridSize, marginY + y * gridSize);
                    var dir = vMouse.clone()
                        .sub(pos)
                        .norm()
                        .mult(new PVector(gridSize/2,gridSize/2));
                    var perp = dir.clone().norm().rotateBy(-Math.PI/2).mult(2);
                    context.beginPath();
                    context.moveTo(pos.x + perp.x, pos.y + perp.y);
                    context.lineTo(pos.x + dir.x, pos.y + dir.y);
                    context.lineTo(pos.x - perp.x, pos.y - perp.y);
                    context.closePath();
                    context.fill();
                }
            }

            context.fillStyle = '#FB3550';
            context.beginPath();
            context.arc(mouse.x, mouse.y, 5, 0, 2 * Math.PI);
            context.fill();
        }

        setup();
        window.addEventListener( 'resize', setup );

        /*function updateMouse(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = evt.clientX - rect.left;
            mouse.y = evt.clientY - rect.top;
        }
        canvas.addEventListener('mousemove', function(evt) {
            updateMouse(canvas, evt);
            animate();
        }, false);*/
    });
</script>