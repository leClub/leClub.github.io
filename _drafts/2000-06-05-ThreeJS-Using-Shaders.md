---
layout: code
title: threejs boilerplate
image: Three-Boilerplate.PNG
categories: [ threejs ]
deps: [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js',
    'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/Detector.js',
    'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/libs/stats.min.js',
    'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/TrackballControls.js'
]
---
<style>
    #container{
        position: relative;
    }
</style>
<div id="container"></div>

<script type="x-shader/x-vertex" id="vertexshader">
    uniform float amplitude;

    attribute float displacement;

    varying vec3 vNormal;
    varying float disp;

    void main() {
        vNormal = normal;
        disp = displacement;

        vec3 newPosition = position + amplitude * normal * vec3( displacement );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }
</script>

<script type="x-shader/x-fragment" id="fragmentshader">
    varying vec3 vNormal;
    varying float disp;

    uniform vec3 color;

    void main() {
        vec3 light = vec3( 0.5, 0.2, 1.0 );
        light = normalize( light );

        float dProd = dot( vNormal, light ) * 0.5 + 0.5;

        // gl_FragColor = vec4( vec3( dProd ) * vec3( color ) * disp, 1.0 );
        gl_FragColor = vec4( vec3( color ) * disp, 1.0 );
    }
</script>


<script>
    // documentation <a href="http://threejs.org/docs/index.html">http://threejs.org/docs/index.html</a>
    window.addEventListener( 'load', function(){
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        var w = window.innerWidth > 1200 ? 1200 : window.innerWidth, h = 600;
        var container, stats;
        var camera, controls, scene, renderer;
        var sphere, uniforms, displacement, noise;
        var radius = 50, segments = 12, rings = 12;

        init();
        animate();

        function init() {
            // renderer
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( w, h );
            container = document.getElementById( 'container' );
            container.appendChild( renderer.domElement );
            stats = new Stats();
            container.appendChild( stats.dom );
            stats.dom.style.position = 'absolute';

            // camera
            camera = new THREE.PerspectiveCamera( 60, w / h, 1, 1000 );
            camera.position.x = 140;
            camera.position.y = 25;
            camera.position.z = 140;
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
            scene.add( gridXZ );

            // lights
            light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 );
            scene.add( light );
            light = new THREE.DirectionalLight( 0x002288 );
            light.position.set( -1, -1, -1 );
            scene.add( light );
            light = new THREE.AmbientLight( 0x222222 );
            scene.add( light );


            uniforms = {
                amplitude: { type: "f", value: 1.0 },
                color:     { type: "c", value: new THREE.Color( 0xff2200 ) }
            };

            var shaderMaterial = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent
            } );


            var geometry = new THREE.SphereBufferGeometry( radius, segments, rings );

            displacement = new Float32Array( geometry.attributes.position.count );

            geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

            sphere = new THREE.Mesh( geometry, shaderMaterial );
            scene.add( sphere );

            window.addEventListener( 'resize', onWindowResize, false );
        }

        function onWindowResize() {
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize( w, h );
            controls.handleResize();
        }

        function animate() {
            requestAnimationFrame( animate );

            var time = Date.now() * 0.01;
            uniforms.amplitude.value = 25.5;

            for ( var i = 0; i < segments; i ++ ) {
                for ( var j = 0; j < rings; j ++ ) {
                    displacement[ i + j * rings ] = j/rings;
                }
            }

            sphere.geometry.attributes.displacement.needsUpdate = true;

            controls.update();
            renderer.render( scene, camera );
            stats.update();
        }
    } );
</script>