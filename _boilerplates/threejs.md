---
layout: code
title: threejs boilerplate
image: Three-Boilerplate.PNG
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
            camera.position.z = 200;
            camera.position.y = 40;
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

            // geometries
            var material =  new THREE.MeshPhongMaterial( {
                color: 0xfb3550,
                shading: THREE.FlatShading
            } );

            // plane
            // PlaneGeometry(width, height, widthSegments, heightSegments)
            var geometry = new THREE.PlaneGeometry( 50, 20 );
            var planeMaterial =  new THREE.MeshPhongMaterial( {
                color: 0xfb3550,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide
            } );
            var plane = new THREE.Mesh( geometry, material );
            plane.position.x = -150;
            plane.position.y = 10;
            plane.rotation.y = Math.PI / 4;
            scene.add(plane);

            // box
            // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
            geometry = new THREE.BoxGeometry( 10, 50, 10 );
            var cube = new THREE.Mesh( geometry, material );
            cube.position.set( 100, 25, -30 );
            scene.add( cube );

            //sphere
            //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
            geometry = new THREE.SphereGeometry( 15, 10, 6 );
            var sphere = new THREE.Mesh( geometry, material );
            sphere.position.set( -60, 15, -50 );
            scene.add( sphere );

            //cylinder
            //CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
            geometry = new THREE.CylinderGeometry( 10, 20, 40, 8 );
            var cylinder = new THREE.Mesh( geometry, material );
            cylinder.position.set( -90, 20, 30 );
            scene.add( cylinder );

            //Dodecahedron
            //DodecahedronGeometry(RADIUS,DETAIL)
            geometry = new THREE.DodecahedronGeometry( 20, 0 );
            // geometry = new THREE.DodecahedronGeometry( 5, 0.5 );
            var dodecahedron = new THREE.Mesh( geometry, material );
            dodecahedron.position.set( 10, 20, -30 );
            scene.add( dodecahedron );

            //Icosahedron
            //IcosahedronGeometry(RADIUS, DETAIL)
            // geometry = new THREE.IcosahedronGeometry( 10, 0 );
            geometry = new THREE.IcosahedronGeometry( 15, 1 );
            var icosahedron = new THREE.Mesh( geometry, material );
            icosahedron.position.set( 40, 15, 100 );
            scene.add( icosahedron );

            //dynamic generation
            for ( var i = 0; i < 500; i ++ ) {
                var height = 10 + ~~( Math.random() * 30 );
                var resolution = 3 + ~~( Math.random() * 5 );
                geometry = new THREE.CylinderGeometry( 0, 10, height, resolution, 1 );

                var mesh = new THREE.Mesh( geometry, material );

                var angle = Math.random() * Math.PI * 4;
                var radius = 200 + Math.random() * 250;
                mesh.position.x = ~~( Math.cos( angle ) * radius );
                mesh.position.y = height / 2;
                mesh.position.z = ~~( Math.sin( angle ) * radius );
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = false;
                scene.add( mesh );
            }

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
            controls.update();
            renderer.render( scene, camera );
            stats.update();
        }
    } );
</script>