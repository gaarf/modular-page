var MODULES = [

  { 
    sKey: 'welcome',
    title: 'Welcome!',
    css: {width:'788px'},
    initBefore: function() {
      var html = '<p>This page is pure Javascript, built using @jQuery and @anywhere. All interface elements are done with lovingly hand-crafted CSS. Data is pulled by your browser, thanks to @YQL\'s JSONP support. Modules can be dragged around, and some can be resized.</p><p>It works on iPad, thanks to <strong>jqDnR-touch</strong>, a little library that you can <a href="http://github.com/gaarf/jqDnR-touch">fork on github</a>.</p>';
      if(window.localStorage) {
          html += '<p class="small">Your browser supports <a href="http://dev.w3.org/html5/webstorage/">Web Storage</a>, so module positioning will be memorized for your next visit. Drag some modules &amp; reload the page to see!</p>'
      }
      this.$content.html(html);
    }
  },

  { 
    sKey: 'twitter',
    title: 'twttr',
    _USERNAME: 'gaarf',
    _MAXITEMS: 10,
    css: {height:'710px',width:'290px'},
    resizable: true,

    initBefore: function() {
      this.getJSONp('http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+this._USERNAME+'&count='+this._MAXITEMS+'&trim_user=1&include_rts=1&callback=?');
      this.$node.find('h2').append(' - @'+this._USERNAME);
    },

    JSONpCallback: function(data) {
      var html = '', u = this._USERNAME;
      $.each(data,function(i){
        var text = this.text;
        if(this.truncated && this.retweeted_status) {
          text = text.match(/^RT[^:]+:\s/i)[0] + this.retweeted_status.text;
        }
        html += '<li class="item item'+i+'"><div class="text">' + $.grfLinkifyUrls(text)
              + '</div><div class="meta"><span class="when"><a href="http://twitter.com/'+u+'/status/'+this.id+'">' 
              + $.grfTimeAgo(this.created_at)+'</a></span>';
        if(this.source) { html += ' <span class="source">via '+this.source+'</span>'; }
        if(this.place) {
          var g = this.geo && this.geo.coordinates;
          html += ' <span class="geo">'
                + (g ? '<a href="http://maps.google.com/maps?q='+g[0]+','+g[1]+'">from</a>' : 'from')
                + ' <a href="http://twitter.com/search?q=place%3A'+this.place.id+'">'+this.place.full_name+'</a></span>';
        }
        if(this.in_reply_to_status_id){
          html += ' <span class="convo">'
                + '<a href="http://twitter.com/'+this.in_reply_to_screen_name+'/statuses/'+this.in_reply_to_status_id+'">'
                + 'in reply to '+this.in_reply_to_screen_name+'</a></span>';
        }
        html += '.</div></li>';
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  { 
    sKey: 'twimages',
    className: 'images',
    title: 'Tweeted Images',
    _USERNAME: 'gaarf',
    _MAXITEMS: 9,
    css: {height:'261px',width:'237px'},

    initAfter: function() {
      var urls = [
        'http://yfrog.com/rss.php?username='+this._USERNAME,
        'http://twitpic.com/photos/'+this._USERNAME+'/feed.rss'
      ];
      this.getYQL("select title,link,pubDate from rss where url in ('"+urls.join("','")+"') | sort(field='pubDate', descending='true')");
    },
    JSONpCallback: function(data) {
      var html = '';
      $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
        var url, m = this.link.match(/(yfrog|twitpic)\.com\/(.+)$/);
        switch(m[1]) {
          case 'yfrog': url = this.link + '.th.jpg'; break;
          case 'twitpic': url = 'http://twitpic.com/show/mini/'+m[2]; break;
        }
        if(url) {
          html += '<li class="item item'+i+'"><a href="'+this.link+'" title="'+this.title+'"><img src="'+url
                + '" height="75" width="75" alt="" /></a></li>';
        }
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  { 
    sKey: 'flickr',
    className: 'images',
    _ID: '94765669@N00',
    _MAXITEMS: 9,
    css: {height:'261px',width:'237px'},

    initAfter: function() {
      this.getFeed('http://api.flickr.com/services/feeds/photos_faves.gne?id='+this._ID+'&format=rss_200');
    },
    JSONpCallback: function(data) {
      var html = '';
      $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
        html += '<li class="item item'+i+'"><a href="'+this.link+'" title="'+this.title[0]+'"><img src="'+this.thumbnail.url
              + '" height="'+this.thumbnail.height+'" width="'+this.thumbnail.width+'" alt="" /></a></li>';
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  { 
    sKey: 'github',
    title: 'GitHub activity',
    className: 'genericfeed',
    _USERNAME: 'gaarf',
    _MAXITEMS: 6,
    resizable:true,
    css: {height:'437px',width:'237px'},

    initAfter: function() {
      this.getFeed('http://github.com/'+this._USERNAME+'.atom',this._MAXITEMS);
    },

    JSONpCallback: function(data) {
      var html = '', tprefix = this._USERNAME+' pushed to ';
      $.each(data.query.results.entry,function(i){
        html += '<li class="item item'+i+'"><p class="when">' + $.grfTimeAgo(this.published) + '</p>'
              + '<p class="title">' + this.title.replace(tprefix,'') + '</p>' 
              + this.content.content + '</li>';
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  { 
    sKey: 'blogposts',
    title: 'Blog Posts',
    className: 'genericfeed',
    _URL: 'http://gaarf.info/feed/',
    _MAXITEMS: 6,
    resizable:true,
    css: {height:'437px',width:'237px'},

    initAfter: function() {
      this.getFeed(this._URL,this._MAXITEMS);
    },

    JSONpCallback: function(data) {
      var html = '';
      $.each(data.query.results.item,function(i){
        html += '<li class="item item'+i+'"><p class="when">' + $.grfTimeAgo(this.pubDate) + '</p>'
              + '<p class="title"><a href="' + this.link + '">' + this.title + '</a></p>' 
              + '<p class="details">' + $.grfShortenString(this.description,100) + '</p></li>';
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  }

  // { 
  //   sKey: 'lorem',
  //   title: 'Justified text!',
  //   resizable:true,
  //   css: {clear:'both',width:'788px'},
  //   initBefore: function() {
  //     this.$content.html('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>');
  //   },
  // 
  //   initAfter: function() {
  //     this.$content.append('<p>Cras purus justo, blandit nec interdum vel, imperdiet eget ante. Donec libero risus, condimentum ut iaculis eu, lacinia et est. Nam hendrerit interdum congue. Phasellus metus eros, sodales quis condimentum facilisis, elementum nec sem. Cras blandit nulla convallis orci euismod tempor laoreet elit mollis. Nullam non sem nec odio sodales aliquam. Phasellus egestas lectus et est tincidunt semper.</p><p>Nulla facilisi. Fusce pellentesque erat non nunc facilisis sed gravida velit scelerisque. Aenean sed est eros. Ut ut pulvinar massa. Integer ut metus augue, id egestas augue. Phasellus nunc tortor, cursus vitae commodo quis, tempor in erat. Mauris vitae lectus sed lacus lacinia ullamcorper vitae bibendum mauris. Pellentesque ut consectetur lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae...</p>');
  //     this.doneLoading();
  //   }
  // }

];
