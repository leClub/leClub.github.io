---
layout: code
title: IFTTT Maker Channel
image: IFTTTMakerChannel.png
categories: [ js, IFTTT ]
deps: []
---
<style>
    #send{
        height: 100px;
        width: 100%;
        background: red;
    }
</style>
<div id="send"></div>

<script>
    window.addEventListener('load', function(){
        var div = document.querySelector( '#send' );
        div.addEventListener( 'click', send );

        function send(){
          var xhr = new XMLHttpRequest();
          var url = 'https://maker.ifttt.com/trigger/sendMail/with/key/dau0arAyhXHT9qrHmqdAXS';
          
          //params
          var dest = 'makio135@gmail.com';
          var msg = 'Yo Spam!';
          var signature = 'Yo!';
          var params = 'value1=' + dest + '&value2=' + msg + '&value3=' + signature;
          
          xhr.open( 'POST', url, true );
          xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );

          xhr.onreadystatechange = function() {
              if( xhr.readyState == 4 && xhr.status == 200 ) {
                  div.style.background = 'yellow';
              }
          };
          
          xhr.send( params );
        }
    });
</script>