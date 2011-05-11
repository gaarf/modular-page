///////////// grf* sort-of-jQuery plugins /////////////////////////////////////////////////////////////

(function($) {
  $.fn.grfModuleSet = function(input,storageVersion, onCompletelyLoaded){

    if(this.length>1 || !this.is('ul') || !(input && input.length)) {
      throw "grfModuleSet: You're doing it wrong.";
    }

    var $container = this.addClass('grf-modcontainer'), 
        _modules = {},
        currentlyLoadingCount = 0,
        domStore = location.protocol.indexOf('http')===0 && window.localStorage;

    function checkSetLoadState() {
      if(currentlyLoadingCount===0 && onCompletelyLoaded) {
        onCompletelyLoaded();
      }
    }

    function Module(o) {
      return $.extend({

        init: function() {
          currentlyLoadingCount++;
          console.time(this.sKey);
          this.$node = $('<li class="loading mod '+(this.className || this.sKey)+'" />').data('sKey',this.sKey);
          this.$node.jqDrag($('<h2><span>'+(this.title || this.sKey)+'</span></h2>').appendTo(this.$node));
          this.$content = $('<div class="content" />').appendTo(this.$node);
          if(this.resizable) { this.$node.jqResize($('<div class="resizer" />').appendTo(this.$node)); }
          if(this.css) { this.$node.css(this.css); }
          if(this.html) { this.$content.html(this.html); }
          if(this.initBefore) { this.initBefore(); }
        },

        initAfter: function() {
          this.doneLoading();
        },

        doneLoading: function() {
          this.$node.removeClass('loading');
          this.savePosition();
          var newHeight = Math.ceil(this.$node.position().top + this.$node.height());
          if(newHeight > $container.height()) {
            $container.css('height',newHeight);
          }
          console.timeEnd(this.sKey);
          currentlyLoadingCount--;
          checkSetLoadState();
        },

        savePosition: function() {
          if(domStore) {
            var $c = this.$node, json = '{';
            $.map('top left width height'.split(' '),function(v){ 
              json += "\""+[v]+"\":\""+$c.css(v)+"\","; 
            });
            json += "\"z\":\""+$c.css('z-index')+"\"}";
            // console.log(this.sKey, 'savePosition', json);
            domStore.removeItem(this.sKey); // workaround QUOTA_EXCEEDED_ERR
            domStore.setItem(this.sKey,json);
            return true;
          }
        },

        restoreSavedPosition: function() {
          if(domStore) {
            try {
              var s = $.parseJSON(domStore.getItem(this.sKey));
              if(s) {
                // console.log(this.sKey,'restorePosition',s);
                var that = this, z = s.z || 1; delete s[z];
                this.$node
                      .css('z-index',z)
                      .animate(s,{
                        // duration: 1000,
                        complete: function() { that.initAfter(); }
                      });
                return true;
              }
            }
            catch(e) {
              console.error('restoreSavedPosition failed',e);
            }
          }
          this.initAfter();
          return false;
        },

        getFeed: function(url,limit) {
          this.getYQL('select * from feed'+(limit?'('+limit+')':'')+' where url="'+url+'"');
        },

        getYQL: function(query) {
          console.log(query);
          this.getJSONp('http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(query)+'&format=json&callback=?');
        },

        getJSONp: function(url) {
          var that = this;
          $.ajax( {
            url: url,
            dataType: 'json',
            success: function(data){
              try {
                // console.debug(that.sKey,data);
                that.JSONpCallback(data);
                that.doneLoading();
              }
              catch(e) {
                console.error(e,that);
              }
            },
            error: function(e) {
              console.error('getJSONp failed',e);
            }
          } );
        },

        JSONpCallback: function(data) {
          this.$content.html(data.toString());
        }

      },o);
    }

    if(domStore) {

      var doReset = domStore.getItem('_ver')!=storageVersion || domStore.getItem('_size')!=input.length;
      if(!doReset) {
        var hasClearer = false;
        $.each(input,function(){
          if(!domStore.getItem(this.sKey)) { doReset = true; }
          if(this.sKey=='localstorage') { hasClearer = true; }
        });
        if(!hasClearer) {
          var w = 100, b = $('body').width()+5; // for positioning to the right of viewport without using right: property
          input.push({
            sKey: 'localstorage',
            title: 'Web Storage',
            css: {width:w+'px',top:-15,left:b-w,position:'absolute'},
            html: '<input type="button" value="clear &amp; reload" />',
            initBefore: function() {
              this.$node.addClass('prepositioned')
                        .find('.content input').click(function(){ domStore.clear(); window.location.reload()})
            }
          });
        }
      }
      if(doReset) {
        console.warn('DOM STORE CLEARANCE! everything must go!');
        domStore.clear();
        domStore.setItem('_ver',storageVersion);
        domStore.setItem('_size',input.length);
      }

    }

    // initialize the modules
    $.each(input, function(){
      var m = new Module(this);
      m.init();
      $container.append(m.$node);
      _modules[m.sKey] = m; 
    });

    // register drag event handlers
    $container
      .bind('jqDnRstart', function(evt){
        console.log(evt);
      })
      .bind('jqDnRend jqDnRtop', function(evt){
        console.log(evt);
        var $m = $(evt.target);
        _modules[$m.data('sKey')].savePosition();
        $m.addClass('positioned');
      });

    // set module positions, in a timeout to let browser context settle
    setTimeout(function(){
      $.each(_modules,function(){
        this.$node.css(this.$node.position());
        this.$node.css('width',this.$node.width());
      });
      $.each(_modules,function(){
        this.$node.css('position','absolute');
        if(this.restoreSavedPosition()) {
          this.$node.addClass('prepositioned');
        }
      });
    },1);

    return this;
  };

  $.extend({
    grfTimeAgo: function(input){
      var then = (input instanceof Date) ? input : new Date(input),
          ss = Math.ceil( (new Date()-then)/1000 );
      if(!ss) { return input.toString(); }
      if(ss<120){ when = "Just now"; } // less than two minutes
      else{ if(ss<7200) { when = Math.floor(ss/60)+" minutes ago"; } // less than 2 hours
      else{ if(ss<86400) { when = Math.floor(ss/3600)+" hours ago"; } // less than 24 hours
      else{ if(ss<172800) { when = "Yesterday"; } // less than 2 days
      else{ if(ss<5184000) { when = Math.floor(ss/86400)+" days ago"; } // less than 2 months
      else{ when = Math.floor(ss/2592000)+" months ago"; } } } } }
      return when;
    },
    grfLinkifyUrls: function(input){
      return input.toString().replace( /https?:\/\/[^\s]+/g, function(a) { return '<a href="'+a+'">'+a+'</a>'; } );
    }
  });

})(jQuery);
