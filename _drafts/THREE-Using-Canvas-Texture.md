---
layout: code
title: Using Canvas Texture with ThreeJS
image: Canvas-Texture.PNG
categories: [ threejs ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js', 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/Detector.js', 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/libs/stats.min.js', 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/TrackballControls.js' ]
---
<style>
    #container{
        position: relative;
    }
</style>
<div id="container"></div>

<script>
    // documentation <a href="http://threejs.org/docs/index.html">http://threejs.org/docs/index.html</a>
    window.addEventListener( 'load', function(){
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        var w = window.innerWidth > 1200 ? 1200 : window.innerWidth, h = 600;
        var container, stats;
        var camera, controls, scene, renderer;
        var canvas, ctx, size = 256, texture;

        init();
        animate();

        function init() {
            // renderer
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( w, h );
            container = document.getElementById( 'container' );
            container.style.width = w + 'px';
            container.appendChild( renderer.domElement );
            stats = new Stats();
            container.appendChild( stats.dom );
            stats.dom.style.position = 'absolute';

            // camera
            camera = new THREE.PerspectiveCamera( 60, w / h, 1, 1000 );
            camera.position.z = 200;
            camera.position.y = 80;
            camera.position.x = 80;
            controls = new THREE.TrackballControls( camera, container );
            controls.rotateSpeed = 2.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = false; // eased move
            controls.dynamicDampingFactor = 0.2;
            controls.keys = [ 65, 83, 68 ];

            // world
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0x1E2630, 0.002 );
            renderer.setClearColor( scene.fog.color );

            // helpers
            var axes = new THREE.AxisHelper( 50 );
            scene.add( axes );
            var gridXZ = new THREE.GridHelper( 500, 10 );
            // scene.add( gridXZ );

            // lights
            light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 );
            scene.add( light );
            light = new THREE.DirectionalLight( 0x002288 );
            light.position.set( -1, -1, -1 );
            scene.add( light );
            light = new THREE.AmbientLight( 0x222222 );
            scene.add( light );

            canvas = document.createElement( 'canvas' );
            canvas.width = canvas.height = size;
            container.appendChild( canvas );
            ctx = canvas.getContext('2d');
            canvas.style.position = 'absolute';
            canvas.style.right = 0;
            texture = new THREE.Texture( canvas );


            var material =  new THREE.MeshPhongMaterial( {
                transparent: true, 
                opacity: 0.9,
                // color: 0xFF0000,
                map: texture,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide
            } );

            // box
            // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
            geometry = new THREE.BoxGeometry( 80, 80, 80 );
            var cube = new THREE.Mesh( geometry, material );
            scene.add( cube );


            window.addEventListener( 'resize', onWindowResize, false );
        }

        function onWindowResize() {
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize( w, h );
        }

        function changeCanvas() {
            var t = new Date().getTime();
            var h = ( 1 + Math.sin( t / 500 ) ) * size / 2;
            ctx.fillStyle = '#FB3550';
            ctx.fillRect( 0, 0, canvas.width, canvas.height );
            ctx.fillStyle = '#1E2630';
            ctx.clearRect( 0, canvas.width / 2 - h / 2, canvas.width, h );
        }

        function animate() {
            requestAnimationFrame( animate );
            
            changeCanvas();
            texture.needsUpdate = true;

            controls.update();
            renderer.render( scene, camera );
            stats.update();
        }
    } );
</script>