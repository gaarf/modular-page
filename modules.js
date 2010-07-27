MODULES = [

  { 
    sKey: 'welcome',
    title: 'Welcome!',
    initBefore: function() {
      this.$content.html('This page is <strong><em>pure</em> JavaScript</strong>. Modules can be dragged around, some can be resized. If your browser supports <a href="http://dev.w3.org/html5/webstorage/">Web Storage</a>, module positioning is memorized for your next visit. It works on iPad. <a href="http://github.com/gaarf/modular-page">The source is on github</a>. Enjoy!');
    }
  },

  { 
    sKey: 'twitter',
    _USERNAME: 'gaarf',
    css: {height:'600px',width:'300px'},
    resizable: true,
    initBefore: function() {
      this.getJSONp('http://twitter.com/status/user_timeline/'+this._USERNAME+'.json?count=10&callback=?');
      this.$node.find('h2').append(' - @'+this._USERNAME);
    },
    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data,function(i){
        html += '<li class="item'+i+'"><div class="text">' + $.grfLinkifyUrls(this.text); 
        html += '</div><div class="meta"><span class="when"><a href="http://twitter.com/'+this.user.screen_name+'/status/'+this.id+'">' + 
                $.grfTimeAgo(this.created_at)+'</a></span>';
        if(this.source) {
          html += ' <span class="source">via '+this.source+'</span>';
        }
        if(this.place) {
          var g = this.geo.coordinates;
          html += ' <span class="geo"><a href="http://maps.google.com/maps?q='+g[0]+','+g[1]+'">from</a>' + 
                  ' <a href="http://twitter.com/search?q=place%3A'+this.place.id+'">'+this.place.full_name+'</a></span>';
        }
        html += '.</div></li>';
      });
      this.$content.html(html+'</ol>');
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
    _MAXITEMS: 18,
    css: {height:'263px',width:'476px'},
    initAfter: function() {
      this.getFeed('http://api.flickr.com/services/feeds/photos_faves.gne?id='+this._ID+'&format=rss_200');
    },
    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
        console.log(this);
        html += '<li class="item'+i+'"><a href="'+this.link+'" title="'+this.title[0]+'">';
        html += '<img src="'+this.thumbnail.url+'" height="'+this.thumbnail.height+'" width="'+this.thumbnail.width+'" alt="" /></a></li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'github',
    title: 'GitHub activity',
    _USERNAME: 'gaarf',
    _MAXITEMS: 5,
    css: {height:'325px',width:'232px'},
    initAfter: function() {
      this.getFeed('http://github.com/'+this._USERNAME+'.atom');
    },
    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data.query.results.entry.splice(0,this._MAXITEMS),function(i){
        console.log(this);
        html += '<li class="item'+i+'"><p class="title">' + this.title + '</p>';
        html += this.content.content + '</li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'lorem',
    title: 'Lorem ipsum',
    resizable:true,
    css: {width:'232px'},
    initBefore: function() {
      this.$content.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    },
    initAfter: function() {
      this.$content.append('<br>Cras purus justo, blandit nec interdum vel, imperdiet eget ante. Donec libero risus, condimentum ut iaculis eu, lacinia et est. Nam hendrerit interdum congue. Phasellus metus eros, sodales quis condimentum facilisis, elementum nec sem. Cras blandit nulla convallis orci euismod tempor laoreet elit mollis. Nullam non sem nec odio sodales aliquam. Phasellus egestas lectus et est tincidunt semper. Nulla facilisi. Fusce pellentesque erat non nunc facilisis sed gravida velit scelerisque. Aenean sed est eros. Ut ut pulvinar massa. Integer ut metus augue, id egestas augue. Phasellus nunc tortor, cursus vitae commodo quis, tempor in erat. Mauris vitae lectus sed lacus lacinia ullamcorper vitae bibendum mauris. Pellentesque ut consectetur lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae...');
      this.doneLoading();
    }
  }

];
