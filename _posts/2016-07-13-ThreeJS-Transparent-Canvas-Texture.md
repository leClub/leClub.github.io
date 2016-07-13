---
layout: code
title: Using transparent canvas texture with ThreeJS
image: Three-Transparent-Canvas-Texture.PNG
categories: [ big, threejs ]
deps: [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r78/three.min.js',
    'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/Detector.js',
    'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js'
]
---
<div id="container"></div>

<script>
    window.addEventListener( 'load', function(){
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        function shuffleArray( arr ) {
            var j, x, i;
            for ( i = arr.length; i; i-- ) {
                j = Math.floor( Math.random() * i );
                x = arr[ i - 1 ];
                arr[ i - 1 ] = arr[ j ];
                arr[ j ] = x;
            }
        }

        function lerp( a, b, pct ) {
            return ( 1 - pct ) * a + b * pct;
        }

        var w = window.innerWidth > 1200 ? 1200 : window.innerWidth, h = 600;
        var camera, scene, renderer, canvas, ctx, tex, mesh;

        ( function initTexture() {
            canvas = document.createElement( 'canvas' );
            canvas.width = canvas.height = 128;
            ctx = canvas.getContext( '2d' );
            tex = new THREE.Texture( canvas );
        } )();

        ( function animTexture( t ) {
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.fillStyle = '#FB3550';

            ctx.beginPath();
            ctx.moveTo( canvas.width / 2, -2 );
            ctx.lineTo( -2, canvas.height + 2 );
            ctx.lineTo( lerp( canvas.width / 4 - 2, canvas.width / 2, Math.sin( t / 323 + 2 * Math.PI / 3 ) / 2 + 0.5 ), canvas.height / 2 );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( canvas.width / 2, -2 );
            ctx.lineTo( canvas.width + 2, canvas.height + 2 );
            ctx.lineTo( lerp( 3 * canvas.width / 4 - 2, canvas.width / 2, Math.sin( t / 343 + 4 * Math.PI / 3 ) / 2 + 0.5 ), canvas.height / 2 );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( canvas.width / 2, lerp( canvas.height + 2, canvas.height / 2, Math.sin( t / 333 ) / 2 + 0.5 ) );
            ctx.lineTo( -2, canvas.height + 2 );
            ctx.lineTo( canvas.width + 2, canvas.height + 2 );
            ctx.fill();

            tex.needsUpdate = true;

            requestAnimationFrame( animTexture );
        } )( 0 );

        ( function init() {
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor( 0x1E2630 );
            renderer.setSize( w, h );
            renderer.sortObjects = false;

            ( document.getElementById( 'container' ) ).appendChild( renderer.domElement );

            camera = new THREE.PerspectiveCamera( 75, w / h, 1, 100 );
            camera.position.z = 13;
            var controls = new THREE.OrbitControls( camera );

            scene = new THREE.Scene();

            var material = new THREE.MeshPhongMaterial( {
                map: tex,
                transparent: true,
                opacity: 0.99,
                side: THREE.DoubleSide,
                alphaTest: 0.1
            } );

            var geometry = new THREE.IcosahedronGeometry( 10, 4 );

            for ( var i = 0; i < geometry.faceVertexUvs[ 0 ].length; i ++ ) {
                var arr = [
                    new THREE.Vector2( 0.5, 1 ),
                    new THREE.Vector2( 0, 0 ),
                    new THREE.Vector2( 1, 0 )
                ];
                shuffleArray( arr );
                geometry.faceVertexUvs[ 0 ][ i ] = arr;
            }
            geometry.uvsNeedUpdate = true;

            mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );

            var light = new THREE.HemisphereLight( 0xffffff, 0x666666, 1 );
            scene.add( light );

            function onWindowResize() {
                w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize( w, h );
            }
            window.addEventListener( 'resize', onWindowResize, false );
        } )();

        ( function animate() {
            requestAnimationFrame( animate );

            mesh.rotation.x += 0.001;
            mesh.rotation.y += 0.001;

            renderer.render( scene, camera );
        } )();
    }, false );
</script>