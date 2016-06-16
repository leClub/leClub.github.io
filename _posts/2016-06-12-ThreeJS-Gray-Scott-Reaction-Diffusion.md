---
layout: code
title: Gray Scott Reaction Diffusion Model with ThreeJS and GLSL
image: Gray-Scott-Reaction-Diffusion.png
categories: [ big, threejs, glsl ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r78/three.min.js', 'https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js' ]
---
<link href='https://fonts.googleapis.com/css?family=Raleway:900italic' rel='stylesheet' type='text/css'>

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

<script id="vertexShader" type="x-shader/x-vertex">
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );;
    }
</script>

<script id="colorize" type="x-shader/x-fragment">
    uniform vec2 resolution;
    uniform sampler2D texture;
    uniform vec3 color1;
    uniform vec3 color2;

    void main( void ){
        vec2 uv = gl_FragCoord.xy / resolution;
        gl_FragColor = vec4( mix( color1, color2, min( texture2D( texture, uv ).g * 2.0, 1.0 ) ), 1.0);
    }
</script>

<script id="grayscott" type="x-shader/x-fragment">
    uniform int timer;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform sampler2D start;
    uniform sampler2D texture;

    vec2 pos;
    vec2 texColor;
    vec2 offset;
    
    uniform float dA;
    uniform float dB;
    uniform float kill;
    uniform float feed;
    uniform float dT;

    vec2 getLaplace() {
        vec2 offset = vec2( 1.0 ) / resolution;
        vec2 pos0 = pos + vec2( -offset.x,  -offset.y );
        vec2 pos1 = pos + vec2(       0.0,  -offset.y );
        vec2 pos2 = pos + vec2(  offset.x,  -offset.y );
        vec2 pos3 = pos + vec2( -offset.x,        0.0 );
        vec2 pos4 = pos + vec2(       0.0,        0.0 );
        vec2 pos5 = pos + vec2(  offset.x,        0.0 );
        vec2 pos6 = pos + vec2( -offset.x,   offset.y );
        vec2 pos7 = pos + vec2(       0.0,   offset.y );
        vec2 pos8 = pos + vec2(  offset.x,   offset.y );

        vec2 col0 = texture2D( texture, pos0 ).rg;
        vec2 col1 = texture2D( texture, pos1 ).rg;
        vec2 col2 = texture2D( texture, pos2 ).rg;
        vec2 col3 = texture2D( texture, pos3 ).rg;
        vec2 col4 = texture2D( texture, pos4 ).rg;
        vec2 col5 = texture2D( texture, pos5 ).rg;
        vec2 col6 = texture2D( texture, pos6 ).rg;
        vec2 col7 = texture2D( texture, pos7 ).rg;
        vec2 col8 = texture2D( texture, pos8 ).rg;

        return col0 * 0.05 + col1 * 0.2 + col2 * 0.05 +
               col3 * 0.2  - col4 * 1.0 + col5 * 0.2  +
               col6 * 0.05 + col7 * 0.2 + col8 * 0.05;
    }

    void main( void ){
        pos = gl_FragCoord.xy / resolution;

        vec2 color;

        if( timer == 1 ) {
            color = vec2( 1.0, step( 0.1, texture2D( start, pos ).g ) * 0.3 );
        }
        else {
            vec2 texColor = texture2D( texture, pos ).rg;
            offset = vec2( 1.0 ) / resolution;

            float a = texColor.r;
            float b = texColor.g;

            if( mouse.x > 5.0 && mouse.x < resolution.x - 5.0 
                && mouse.y > 5.0 && mouse.y < resolution.y - 5.0 ) {
                float diff = length( gl_FragCoord.xy - mouse );
                if( diff < 8.0 ) b = ( 1.0 - smoothstep( 1.0, 8.0, diff ) ) * 0.3;
            }

            float reaction = a * b * b;
            vec2 laplace = getLaplace();

            float red = ( dA * laplace.r ) - reaction + ( feed * ( 1.0 - a ) );
            float green = ( dB * laplace.g ) +  reaction - ( ( kill + feed ) * b );

            // Used to observe variations along axis:
            // k varying from 0.045 to 0.07 on horizontal axis, 
            // f varying from 0.01 to 0.05 on vertical axis
            // float k = 0.045 + pos.x * 0.025;
            // float f = 0.01 + pos.y * 0.04;
            // float red = ( dA * laplace.r ) - reaction + ( f * ( 1.0 - a ) );
            // float green = ( dB * laplace.g ) +  reaction - ( ( k + f ) * b );
            
            color = texColor + vec2( red, green ) * dT;
            
        }

        gl_FragColor = vec4( color, 0.0, 1.0 );
    }
</script>

<div id='container'></div>

<script>
    // Based on Daniel Shiffman's Coding Challenge: Reaction Diffusion Algorithm in p5.js
    // https://www.youtube.com/watch?v=BV9ny785UNc
    window.addEventListener( 'load', function(){
        var w = window.innerWidth > 1200 ? 1200 : window.innerWidth, h = 600,
            camera, scene, renderer, uniforms,
            uniforms2, ctx, startText,
            bufferScene, ping, pong,
            timer = 0, mouse = { x : 0, y : 0 };
        
        var params = {
            text : 'Le Club',
            color1 : [ 30, 38, 48 ],
            color2 : [ 251, 53, 80 ],
            resetOnChange: true,
            dA : 1.025,
            dB : 0.302,
            feed : 0.031,
            kill : 0.056,
            dT : 0.988
        };

        var gui, dASlider, dBSlider, feedSlider, killSlider, dTSlider;

        ( function init() {
            var container = document.getElementById( 'container' );
            var color1 = new THREE.Vector3( params.color1[ 0 ] / 255, params.color1[ 1 ] / 255, params.color1[ 2 ] / 255 );
            var color2 = new THREE.Vector3( params.color2[ 0 ] / 255, params.color2[ 1 ] / 255, params.color2[ 2 ] / 255 );

            function setStartTex(){
                ctx.fillStyle = 'black';
                ctx.fillRect( 0, 0, 1024, 512 );
                ctx.font = '800 300px Roboto';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText( params.text, 1024 / 2, 512 / 2 );
            }

            ( function initStartTex(){
                var cnvs = document.createElement( 'canvas' );
                cnvs.width = 1024;
                cnvs.height = 512;
                ctx = cnvs.getContext( '2d' );
                setStartTex();
                startText = new THREE.Texture( cnvs );
            } )();

            ( function setupPingPong(){
                bufferScene = new THREE.Scene();

                var renderTargetParams = {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.FloatType
                };

                ping = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
                pong = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
                ping.texture.wrapS = THREE.ClampToEdgeWrapping;
                ping.texture.wrapT = THREE.ClampToEdgeWrapping;
                pong.texture.wrapS = THREE.ClampToEdgeWrapping;
                pong.texture.wrapT = THREE.ClampToEdgeWrapping;

                uniforms2 = {
                    timer : {
                        type: 'i',
                        value: 0
                    },
                    resolution : {
                        type : 'v2',
                        value : new THREE.Vector2()
                    },
                    mouse : {
                        type : 'v2',
                        value : new THREE.Vector2()
                    },
                    start : {
                        type : 't',
                        value : startText
                    },
                    texture : {
                        type : 't',
                        value : pong.texture
                    },
                    dA : {
                        type: 'f',
                        value : params.dA
                    },
                    dB : {
                        type: 'f',
                        value : params.dB
                    },
                    kill : {
                        type: 'f',
                        value : params.kill
                    },
                    feed : {
                        type: 'f',
                        value : params.feed
                    },
                    dT : {
                        type: 'f',
                        value : params.dT
                    },
                };

                var material2 = new THREE.ShaderMaterial( {
                    uniforms : uniforms2,
                    vertexShader : document.getElementById( 'vertexShader' ).textContent,
                    fragmentShader : document.getElementById( 'grayscott' ).textContent
                } );

                var geometry2 = new THREE.PlaneBufferGeometry( 2, 2 );

                var mesh2 = new THREE.Mesh( geometry2, material2 );
                bufferScene.add( mesh2 );

                startText.needsUpdate = true;
            } )();

            ( function setupScene(){
                renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setClearColor( 0x665544, 1 );
                container.appendChild( renderer.domElement );
                
                camera = new THREE.Camera();
                camera.position.z = 1;
                scene = new THREE.Scene();

                uniforms = {
                    resolution : {
                        type : 'v2',
                        value : new THREE.Vector2( w, h )
                    },
                    texture : {
                        type : 't',
                        value : pong.texture,
                        minFilter : THREE.NearestFilter 
                    },
                    color1 : {
                        type : 'v3',
                        value : color1
                    },
                    color2 : {
                        type : 'v3',
                        value : color2
                    }
                };
                var material = new THREE.ShaderMaterial( {
                    uniforms : uniforms,
                    vertexShader : document.getElementById( 'vertexShader' ).textContent,
                    fragmentShader : document.getElementById( 'colorize' ).textContent
                } );
                var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

                var mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );
            } )();

            ( function initGUI(){
                gui = new dat.GUI( { autoPlace: false } );

                gui.add( params, 'resetOnChange' );

                dASlider = gui.add( params, 'dA' ).step( 0.001 );
                dASlider.onFinishChange( function( value ){
                    uniforms2.dA.value = value;
                    if( params.resetOnChange ) uniforms2.timer.value = 0;
                } );

                dBSlider = gui.add( params, 'dB' ).step( 0.001 );
                dBSlider.onFinishChange( function( value ){
                    uniforms2.dB.value = value;
                    if( params.resetOnChange ) uniforms2.timer.value = 0;
                } );

                feedSlider = gui.add( params, 'feed' ).step( 0.001 );
                feedSlider.onFinishChange( function( value ){
                    uniforms2.feed.value = value;
                    if( params.resetOnChange ) uniforms2.timer.value = 0;
                } );

                killSlider = gui.add( params, 'kill' ).step( 0.001 );
                killSlider.onFinishChange( function( value ){
                    uniforms2.kill.value = value;
                    if( params.resetOnChange ) uniforms2.timer.value = 0;
                } );

                dTSlider = gui.add( params, 'dT' ).step( 0.001 );
                dTSlider.onFinishChange( function( value ){
                    uniforms2.dT.value = value;
                    if( params.resetOnChange ) uniforms2.timer.value = 0;
                } );

                gui.close();
                container.appendChild( gui.domElement );
            } )();
        } )();

        ( function setupEvents(){
            function updateMouse( canvas, evt ) {
                var rect = canvas.getBoundingClientRect();
                mouse.x = evt.clientX - rect.left;
                mouse.y = evt.clientY - rect.top;
            }

            renderer.domElement.addEventListener( 'mousemove', function( evt ) {
                updateMouse( renderer.domElement, evt );
                uniforms2.mouse.value.x = mouse.x;
                uniforms2.mouse.value.y = h - mouse.y;
            } );
    
            function onWindowResize( event ) {
                w = window.innerWidth > 1200 ? 1200 : window.innerWidth;

                renderer.setSize( w, h );
                uniforms.resolution.value.x = w;
                uniforms.resolution.value.y = h;
        
                ping.setSize( w, h );
                pong.setSize( w, h );
                uniforms2.resolution.value.x = w;
                uniforms2.resolution.value.y = h;

                uniforms2.timer.value = 0;
            }
            onWindowResize();
            window.addEventListener( 'resize', onWindowResize, false );
        } )();

        ( function rendering(){
            ( function render() {
                requestAnimationFrame( render );

                for (var i = 0; i < 8; i++) {
                    stepSim();
                    stepSim();
                }

                renderer.render( scene, camera );

                ++ uniforms2.timer.value;
            } )();

            function stepSim() {
                renderer.render( bufferScene, camera, ping, true );
                swapBuffers();
            }

            function swapBuffers() {
                var a = pong;
                pong = ping;
                ping = a;
                uniforms2.texture.value = pong.texture;
            }
        } )();
    } );
</script>
<link href='https://fonts.googleapis.com/css?family=Raleway:900italic' rel='stylesheet' type='text/css'>