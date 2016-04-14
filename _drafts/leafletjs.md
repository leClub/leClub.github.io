---
layout: code
title: leaflet.js
image: logo.svg
categories: [ leafletjs ]
deps: [ 'http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js' ]
---
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />

<style>
    #render{
        height: 400px;
    }
</style>

<div id="render"></div>

<script>
    // Documentation: http://leafletjs.com/reference.html
    // Map providers: https://leaflet-extras.github.io/leaflet-providers/preview/

    window.addEventListener('load', function(){
        var mymap = L.map('render').setView( [51.505, -0.09], 13 );

        var CartoDB_DarkMatterNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mymap);

        // var marker = L.marker([51.5, -0.09]).addTo(mymap);

        var circle = L.circle([51.508, -0.11], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(mymap);

        var polygon = L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(mymap);

        // marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
        circle.bindPopup("I am a circle.");
        polygon.bindPopup("I am a polygon.").openPopup();

        /*var popup = L.popup()
            .setLatLng([51.5, -0.09])
            .setContent("I am a standalone popup.")
            .openOn(mymap);*/
    });
</script>