MODULES = [

  { 
    sKey: 'welcome',
    title: 'Welcome!',
    css: {width:'300px'},
    initBefore: function() {
      this.$content.html('This page is <strong><em>pure</em> JavaScript</strong>. Modules can be dragged around, some can be resized. If your browser supports <a href="http://dev.w3.org/html5/webstorage/">Web Storage</a>, module positioning is memorized for your next visit. It works on iPad. <a href="http://github.com/gaarf/modular-page">The source is on github</a>. Enjoy!');
    }
  },

  { 
    sKey: 'lorem',
    title: 'Lorem ipsum',
    resizable:true,
    css: {width:'470px'},
    initBefore: function() {
      this.$content.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    },
    initAfter: function() {
      this.$content.append(' Cras purus justo, blandit nec interdum vel, imperdiet eget ante. Donec libero risus, condimentum ut iaculis eu, lacinia et est. Nam hendrerit interdum congue. Phasellus metus eros, sodales quis condimentum facilisis, elementum nec sem. Cras blandit nulla convallis orci euismod tempor laoreet elit mollis. Nullam non sem nec odio sodales aliquam. Phasellus egestas lectus et est tincidunt semper. Nulla facilisi. Fusce pellentesque erat non nunc facilisis sed gravida velit scelerisque. Aenean sed est eros. Ut ut pulvinar massa. Integer ut metus augue, id egestas augue. Phasellus nunc tortor, cursus vitae commodo quis, tempor in erat. Mauris vitae lectus sed lacus lacinia ullamcorper vitae bibendum mauris. Pellentesque ut consectetur lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae...');
      this.doneLoading();
    }
  },

  { 
    sKey: 'twitter',
    _USERNAME: 'gaarf',
    css: {height:'600px',width:'300px',clear:'left'},
    resizable: true,
    title: 'Twitter',
    initBefore: function() {
      this.getJSONp('http://twitter.com/status/user_timeline/'+this._USERNAME+'.json?count=10&callback=?');
      this.$node.find('h2').append(' - @'+this._USERNAME);
    },
    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data,function(i){
        console.log(i,this);
        var when = new Date(this.created_at);
        html += '<li class="item'+i+'"><div class="text">';
        html += this.text.replace( /https?:\/\/[^\s]+/g, function($0) { return '<a href="'+$0+'">'+$0+'</a>'; } );
        html += '</div> <div class="meta"><span class="when">'+when+'</span>';
        if(this.place) {
          var g = this.geo.coordinates;
          html += ' <span class="geo">From <a href="http://twitter.com/search?q=place%3A'+this.place.id+'">'+this.place.full_name+'</a>';
          html += ' [<a href="http://maps.google.com/maps?q='+g[0]+','+g[1]+'">map</a>]</span>';
        }
        html += '</div></li>';
      });
      this.$content.html(html+'</ol>');

      var s = 'li.twitter .follow-me';
      if(twttr) {
        var that = this;
        twttr.anywhere(function(T) {
          T('li.twitter').hovercards();
        });
      }

    }
  },

  { 
    sKey: 'flickr',
    _ID: '94765669@N00',
    _TAGS: 'flickrrss',
    css: {height:'200px',width:'300px'},
    initAfter: function() {
      this.getJSONp('http://api.flickr.com/services/feeds/photos_public.gne?id='+this._ID+'&tags='+this._TAGS+'&format=json&jsoncallback=?');
    }
  }

];
