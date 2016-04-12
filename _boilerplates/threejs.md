---
layout: code
title: threejs boilerplate
image: 
categories: [ threejs ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js' ]
---
<style>
</style>

<div id="render"></div>

<script>
    // documentation <a href="http://threejs.org/docs/index.html">http://threejs.org/docs/index.html</a>
    window.addEventListener('load', function(){
        var width = 1200, height = 400;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        document.getElementById('render').appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        function render() {
            requestAnimationFrame( render );
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.05;

            renderer.render( scene, camera );
        }
        render();
    });
</script>