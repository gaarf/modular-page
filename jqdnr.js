  /*
   * jqDnR - Minimalistic Drag'n'Resize for jQuery.
   *
   * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
   * Licensed under the MIT License:
   * http://www.opensource.org/licenses/mit-license.php
   * 
   * $Version: 2007.08.19 +r2 / heavily modified by @gaarf for touch support
   */

function prettyLog(obj) {
  var out = obj.toString();
  for(var i in obj) {
    out += " "+i+": "+obj[i];
  }
  return out;
}

(function($){

  var DOWN = 'mousedown touchstart', MOVE = 'mousemove touchmove', STOP = 'mouseup touchend',
      jqDnR = { dnr:{}, e:0 }, M = jqDnR.dnr, E = jqDnR.e,
      f = function(k) { return parseInt(E.css(k))||false; },
      xy = function(v) {
        var y = v.pageY, 
            x = v.pageX, 
            t = v.originalEvent.targetTouches;
        if(t) {
          x = t[0]['pageX'];
          y = t[0]['pageY'];
        }
        return {x:x,y:y};
      },
      g = function(v) {
        var p = xy(v);
        E = v.data.e;
        M = {
         X:f('left')||0, Y:f('top')||0, 
         W:f('width')||E[0].scrollWidth||0, H:f('height')||E[0].scrollHeight||0,
         pX:p.x, pY:p.y, k:v.data.k, o:E.css('opacity')
        };
        E.css({opacity:0.7});
        $(document).bind(MOVE,jqDnR.drag).bind(STOP,jqDnR.stop);
        return false;
      },
      i = function(e,h,k){ return e.each( function(){
        h = (h) ? $(h,e) : e;
        h.bind(DOWN, {e:e,k:k}, g);
      });};

  jqDnR.drag = function(v) {
    var p = xy(v);
    if(M.k == 'd') { 
      if(E.css('position')!='absolute') {
        E.css({position:'relative'});
      }
      E.css({ left:M.X+p.x-M.pX, top:M.Y+p.y-M.pY } );
    }
    else { // resize
      E.css({ width:Math.max(p.x-M.pX+M.W,0), height:Math.max(p.y-M.pY+M.H,0) });
    }
    return false;
  };

  jqDnR.stop = function() {
    $(document).unbind(MOVE,jqDnR.drag).unbind(STOP,jqDnR.stop);
    E.css({opacity:M.o}).trigger('jqDnRstop');
  };

  $.fn.jqDrag = function(h) { return i(this, h, 'd'); };
  $.fn.jqResize = function(h) { return i(this, h, 'r'); };

})(jQuery);