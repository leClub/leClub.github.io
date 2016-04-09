(function(){
    var grid = document.querySelector('#grid');
    
    function isOnScreen(elem) {
        var viewport_top = document.body.scrollTop;
        var viewport_height = window.innerHeight;
        var viewport_bottom = viewport_top + viewport_height;
        var top = elem.offsetTop;
        var height = parseInt(elem.parentNode.style.height);
        var bottom = top + height;
        return top < viewport_bottom;
            /*(top >= viewport_top && top < viewport_bottom)
            || (bottom > viewport_top && bottom <= viewport_bottom) 
            || (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);*/
    }

    function onScreen() {
        [].map.call(grid.querySelectorAll('.content'), function(d){
            d.style.height = '0%';
            return d;
        }).filter(function(d){
            return isOnScreen(d); 
        }).forEach(function(d,i){
            d.style.height = '100%';
        });
    }

    window.addEventListener('load', onScreen);
    window.addEventListener('scroll', onScreen);
    window.addEventListener('resize', onScreen);
})();