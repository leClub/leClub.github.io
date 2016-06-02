---
layout: code
title: Glitch Shader with Threejs
image: Glitch-Shader.png
categories: [ big, threejs ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js' ]
---
<script id="vertexShader" type="x-shader/x-vertex">
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
</script>

<script id="glitchFrag" type="x-shader/x-fragment">
    uniform vec2 u_resolution;
    uniform sampler2D u_joconde;

    uniform vec4 u_rect[ MAX_GLITCH ];
    uniform vec4 u_origin[ MAX_GLITCH ];
    uniform int u_glitchType[ MAX_GLITCH ];
    uniform int u_len;


    float isInRect( in vec4 rect, in vec2 st ){
        return step( rect.x, st.x ) 
            * ( 1.0 - step( rect.x + rect.z, st.x ) )
            * step( rect.y, st.y ) 
            * ( 1.0 - step( rect.y + rect.w, st.y ) );
    }

    float map(float x, float in_min, float in_max, float out_min, float out_max){
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    float random(float x){
        return fract(sin(x*x*x-x)*100000.0);
    }

    void main( void ){
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec4 color = texture2D( u_joconde, st );
        vec4 glitchColor = color;

        for( int i = 0; i < MAX_GLITCH; i++){
            if( i >= u_len ) break;
            else{
                if( isInRect( u_rect[ i ], st ) == 1.0 ){
                    if(u_glitchType[ i ] == 0){
                        vec2 pos = vec2( map(st.x, u_rect[ i ].x, u_rect[ i ].x + u_rect[ i ].z, u_origin[ i ].x, u_origin[ i ].x + u_origin[ i ].z ), map(st.y, u_rect[ i ].y, u_rect[ i ].y + u_rect[ i ].w, u_origin[ i ].y, u_origin[ i ].y + u_origin[ i ].w ) );
                        glitchColor = vec4( texture2D( u_joconde, pos + vec2((random(u_rect[i].x) - 0.5)/10.0)).r, texture2D( u_joconde, pos).g, texture2D( u_joconde, pos + vec2((random(u_rect[i].y) - 0.5)/10.0)).b, 1.0);

                        color = mix( color, glitchColor, 1.0 - smoothstep( u_rect[ i ].x + ( u_rect[ i ].z * 2.0 / 10.0 ), u_rect[ i ].x + u_rect[ i ].z, st.x ) );
                    }
                    else if(u_glitchType[ i ] == 1){
                        glitchColor = texture2D( u_joconde, vec2( u_rect[ i ].x, st.y ));
                        color = mix( color, glitchColor, 1.0 - smoothstep( u_rect[ i ].x + ( u_rect[ i ].z * 8.0 / 10.0 ), u_rect[ i ].x + u_rect[ i ].z, st.x ) );
                    }
                    else if(u_glitchType[ i ] == 2){
                        glitchColor = texture2D( u_joconde, vec2( u_rect[ i ].x + u_rect[ i ].z, st.y ));
                        color = mix( color, glitchColor, smoothstep( u_rect[ i ].x, u_rect[ i ].x + ( u_rect[ i ].z * 2.0 / 10.0 ), st.x ) );
                    }
                    else if(u_glitchType[ i ] == 3){
                        glitchColor = texture2D( u_joconde, vec2( st.x, u_rect[ i ].y ));
                        color = mix( color, glitchColor, 1.0 - smoothstep( u_rect[ i ].y + ( u_rect[ i ].w * 8.0 / 10.0 ), u_rect[ i ].y + u_rect[ i ].w, st.y ) );
                    }
                    else if(u_glitchType[ i ] == 4){
                        glitchColor = texture2D( u_joconde, vec2( st.x, u_rect[ i ].y + u_rect[ i ].w ));
                        color = mix( color, glitchColor, smoothstep( u_rect[ i ].y, u_rect[ i ].y + ( u_rect[ i ].w * 2.0 / 10.0 ), st.y ) );
                    }
                }
            }
        }

        gl_FragColor = color;
    }
</script>

<div id='container'></div>

<script>
    window.addEventListener( 'load', function(){
        var w = ( window.innerWidth > 1200 ? 1200 : window.innerWidth ), h = 600,
            camera, scene, renderer, uniforms,
            mouse = {
                x : 0,
                y : 0
            },
            MAX_GLITCH = 64;

        function zeroVec4Array( size ){
            return ( new Array( size ) ).fill( 0 ).map( function(){ return new THREE.Vector4( 0, 0, 0, 0 ); } );
        }

        function zeroIntArray( size ){
            return ( new Array( size ) ).fill( 4 );
        }

        ( function init() {
            var container = document.getElementById( 'container' );
            
            camera = new THREE.Camera();
            camera.position.z = 1;
            scene = new THREE.Scene();

            var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
            
            uniforms = {
                u_resolution : {
                    type : 'v2',
                    value : new THREE.Vector2()
                },
                u_joconde : {
                    type : 't',
                    value : ( new THREE.TextureLoader() ).load( '/data/GlitchShaderTexture.png' ),
                    minFilter : THREE.NearestFilter 
                },
                u_rect : {
                    type : 'v4v',
                    value : zeroVec4Array( MAX_GLITCH )
                },
                u_origin : {
                    type : 'v4v',
                    value : zeroVec4Array( MAX_GLITCH )
                },
                u_glitchType : {
                    type : 'iv1',
                    value : zeroIntArray( MAX_GLITCH )
                },
                u_len : {
                    type : 'i',
                    value: MAX_GLITCH
                }
            };

            var material = new THREE.ShaderMaterial( {
                uniforms : uniforms,
                vertexShader : document.getElementById( 'vertexShader' ).textContent,
                fragmentShader : 
                    '#define MAX_GLITCH ' + MAX_GLITCH + '\n' +
                    document.getElementById( 'glitchFrag' ).textContent
            } );

            var mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );

            renderer = new THREE.WebGLRenderer( { alpha: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setClearColor( 0xffffff, 0 );
            
            container.appendChild( renderer.domElement );

            function updateMouse( canvas, evt ) {
                var rect = canvas.getBoundingClientRect();
                mouse.x = evt.clientX - rect.left;
                mouse.y = evt.clientY - rect.top;
            }
            container.addEventListener( 'mousemove', function( evt ) {
                updateMouse( renderer.domElement, evt );
            } );

            function onWindowResize( event ) {
                w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
                renderer.setSize( w, h );
                uniforms.u_resolution.value.x = renderer.domElement.width;
                uniforms.u_resolution.value.y = renderer.domElement.height;
            }
            window.addEventListener( 'resize', onWindowResize, false );
            onWindowResize();

            render();
        } )();

        var timer = 0;
        var count = 0;
        function render() {
            requestAnimationFrame( render );
            timer ++;

            var tresholdMouse = .1 + ( mouse.x + 1 ) / renderer.domElement.width * .9;
            var tresholdTime = Math.sin( Date.now() / 10000 ) / 2 + 0.5;
            var treshold = Math.max( tresholdMouse, tresholdTime );
            for( var i = 0; i < MAX_GLITCH; i++ ){
                if( Math.random() < treshold ){
                    var mix = ( Math.random() - 0.5 ) * 5;
                    if( Math.abs( mix ) > 2.47 ){
                        timer = 0;
                        var x = Math.random() - 0.05,
                            y = Math.random() - 0.05,
                            hauteur = Math.random();

                        uniforms.u_origin.value[ count ] =  new THREE.Vector4( x, y, Math.random(), hauteur );
                        if( mix > 0 ) uniforms.u_rect.value[ count ] =  new THREE.Vector4( x, y, Math.random(), Math.random() );
                        else{
                            var w = Math.random();
                            uniforms.u_rect.value[ count ] =  new THREE.Vector4( x - w, y, w, Math.random() );
                        }
                        uniforms.u_glitchType.value[ count ] = Math.floor( Math.random() * 3 );

                        count ++;
                        if( count >= MAX_GLITCH ) count == 0;
                    }
                }
            }
            
            if ( timer > 5 ) {
                count = 0;
                timer = 0;
            }

            uniforms.u_len.value = count;

            renderer.render( scene, camera );
        }
    } );
</script>