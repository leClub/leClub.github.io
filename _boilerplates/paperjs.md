---
layout: code
title: paperjs boilerplate
image: 
categories: [ paperjs ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.25/paper-full.min.js' ]
---
<style>
</style>

<div id="render"><canvas id="myCanvas"></canvas></div>

<script type="text/paperscript" canvas="myCanvas">
// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
var path = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'black'
});

function onResize(event) {
    // Whenever the window is resized, recenter the path:
    path.position = view.center;
}
</script>