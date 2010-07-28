MODULES = [

  { 
    sKey: 'welcome',
    title: 'Welcome!',
    css: {width:'788px'},
    initBefore: function() {
      var html = '<p>This page was made using @anywhere, @jQuery, and @YQL. No images are used, all gradients are done with CSS.<br> Modules pull live data via JSONP. They can be dragged around, and some can be resized.</p><p>It works on your iPad, thanks to <strong>jqDnR-touch</strong>, a little library I wrote that you can <a href="http://github.com/gaarf/jqDnR-touch">fork on github</a>.</p>';
      if(window.localStorage) {
          html += '<p class="small">Your browser supports <a href="http://dev.w3.org/html5/webstorage/">Web Storage</a>, so module positioning will be memorized for your next visit. Reload the page to see!</p>'
      }
      this.$content.html(html);
    }
  },

  { 
    sKey: 'twitter',
    _USERNAME: 'gaarf',
    css: {height:'630px',width:'300px'},
    resizable: true,

    initBefore: function() {
      this.getJSONp('http://twitter.com/status/user_timeline/'+this._USERNAME+'.json?count=10&callback=?');
      this.$node.find('h2').append(' - @'+this._USERNAME);
    },

    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data,function(i){
        html += '<li class="item'+i+'"><div class="text">' + $.grfLinkifyUrls(this.text)
              + '</div><div class="meta"><span class="when"><a href="http://twitter.com/'+this.user.screen_name+'/status/'+this.id+'">' 
              + $.grfTimeAgo(this.created_at)+'</a></span>';
        if(this.source) { html += ' <span class="source">via '+this.source+'</span>'; }
        if(this.place) {
          var g = this.geo && this.geo.coordinates;
          html += ' <span class="geo">'
                + (g ? '<a href="http://maps.google.com/maps?q='+g[0]+','+g[1]+'">from</a>' : 'from')
                + ' <a href="http://twitter.com/search?q=place%3A'+this.place.id+'">'+this.place.full_name+'</a></span>';
        }
        html += '.</div></li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'flickr',
    _ID: '94765669@N00',
    _MAXITEMS: 18,
    css: {height:'268px',width:'476px'},

    initAfter: function() {
      this.getFeed('http://api.flickr.com/services/feeds/photos_faves.gne?id='+this._ID+'&format=rss_200');
    },
    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
        html += '<li class="item'+i+'"><a href="'+this.link+'" title="'+this.title[0]+'"><img src="'+this.thumbnail.url
              + '" height="'+this.thumbnail.height+'" width="'+this.thumbnail.width+'" alt="" /></a></li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'github',
    title: 'GitHub activity',
    className: 'genericfeed',
    _USERNAME: 'gaarf',
    _MAXITEMS: 5,
    resizable:true,
    css: {height:'350px',width:'232px'},

    initAfter: function() {
      this.getFeed('http://github.com/'+this._USERNAME+'.atom');
    },

    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data.query.results.entry.splice(0,this._MAXITEMS),function(i){
        // console.log(this);
        html += '<li class="item'+i+'"><p class="when">' + $.grfTimeAgo(this.published) + '</p>'
              + '<p class="title">' + this.title + '</p>' 
              + this.content.content + '</li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'blogposts',
    title: 'Blog Posts',
    className: 'genericfeed',
    _URL: 'http://gaarf.info/feed/',
    _MAXITEMS: 5,
    resizable:true,
    css: {height:'350px',width:'232px'},

    initAfter: function() {
      this.getFeed(this._URL);
    },

    JSONpCallback: function(data) {
      var html = '<ol>';
      $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
        // console.log(this);
        html += '<li class="item'+i+'"><p class="when">' + $.grfTimeAgo(this.pubDate) + '</p>'
              + '<p class="title"><a href="' + this.link + '">' + this.title + '</a></p>' 
              + '<p class="details">' + $.grfShortenString(this.description,100) + '</p></li>';
      });
      this.$content.html(html+'</ol>');
    }
  },

  { 
    sKey: 'lorem',
    title: 'Justified text!',
    resizable:true,
    css: {clear:'both',width:'788px'},
    initBefore: function() {
      this.$content.html('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>');
    },

    initAfter: function() {
      this.$content.append('<p>Cras purus justo, blandit nec interdum vel, imperdiet eget ante. Donec libero risus, condimentum ut iaculis eu, lacinia et est. Nam hendrerit interdum congue. Phasellus metus eros, sodales quis condimentum facilisis, elementum nec sem. Cras blandit nulla convallis orci euismod tempor laoreet elit mollis. Nullam non sem nec odio sodales aliquam. Phasellus egestas lectus et est tincidunt semper.</p><p>Nulla facilisi. Fusce pellentesque erat non nunc facilisis sed gravida velit scelerisque. Aenean sed est eros. Ut ut pulvinar massa. Integer ut metus augue, id egestas augue. Phasellus nunc tortor, cursus vitae commodo quis, tempor in erat. Mauris vitae lectus sed lacus lacinia ullamcorper vitae bibendum mauris. Pellentesque ut consectetur lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae...</p>');
      this.doneLoading();
    }
  }

];
