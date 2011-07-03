var MODULES = [

  { 
    sKey: 'twitter',
    title: 'Twitter',
    _USERNAME: 'gaarf',
    _MAXITEMS: 10,
    css: {height:'610px',width:'290px'},
    resizable: true,

    initBefore: function() {
      this.getJSONp('http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+this._USERNAME+'&count='+this._MAXITEMS+'&trim_user=1&include_rts=1&callback=?');
      this.$node.find('h2').append(' / @'+this._USERNAME+'<span class="btn"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none" data-via="'+this._USERNAME+'">T</a></span>');
      
    },

    JSONpCallback: function(data) {
      var u = this._USERNAME, html = '';
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
      this.getYQL('select * from json where url="http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + this._USERNAME + '&trim_user=1&count=100&include_entities=1" and itemPath = "json.json.entities.urls"');
    },

    JSONpCallback: function(data) {
      var html = '', count = 0, max = this._MAXITEMS;
      $.each(data.query.results.urls, function(){
        if(count >= max) {
          return false;
        }
        if(this) {
          var src,
              url = this.expanded_url || this.url,
              m = url.match(/(yfrog|twitpic)\.com\/(.+)$/);
          if(m) {
            switch(m[1]) {
              case 'yfrog': src = url + '.th.jpg'; break;
              case 'twitpic': src = 'http://twitpic.com/show/mini/'+m[2]; break;
            }
            if(src) {
              html += '<li class="item item'+count+'"><a href="'+url+'"><img src="'+src
                    + '" height="75" width="75" alt="" /></a></li>';
              count++;
            }
          }
        }
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  // { 
  //   sKey: 'flickr',
  //   className: 'images',
  //   _ID: '94765669@N00',
  //   _MAXITEMS: 9,
  //   css: {height:'261px',width:'237px'},
  // 
  //   initAfter: function() {
  //     this.getFeed('http://api.flickr.com/services/feeds/photos_faves.gne?id='+this._ID+'&format=rss_200');
  //   },
  //   JSONpCallback: function(data) {
  //     var html = '';
  //     $.each(data.query.results.item.splice(0,this._MAXITEMS),function(i){
  //       html += '<li class="item item'+i+'"><a href="'+this.link+'" title="'+this.title[0]+'"><img src="'+this.thumbnail.url
  //             + '" height="'+this.thumbnail.height+'" width="'+this.thumbnail.width+'" alt="" /></a></li>';
  //     });
  //     this.$content.html('<ol>'+html+'</ol>');
  //   }
  // },

  { 
    sKey: 'github',
    title: 'GitHub activity',
    className: 'genericfeed',
    _USERNAME: 'gaarf',
    _MAXITEMS: 6,
    resizable:true,
    css: {height:'261px',width:'237px'},
  
    initAfter: function() {
      this.getFeed('https://github.com/'+this._USERNAME+'.atom',this._MAXITEMS);
    },

    JSONpCallback: function(data) {
      var html = '', tprefix = this._USERNAME+' pushed to ';
      $.each(data.query.results.entry,function(i){
        html += '<li class="item item'+i+'"><p class="when">' + $.grfTimeAgo(this.published) + '</p>'
              + '<p class="title">' + this.title.replace(tprefix,'') + '</p>' 
              + this.content.content + '</li>';
      });
      var re = new RegExp("href=\"/"+this._USERNAME, 'gi');
      this.$content.html('<ol>'+html.replace(re, "href=\"https://github.com/"+this._USERNAME)+'</ol>');
    }
  },

  { 
    sKey: 'blogposts',
    title: 'Blog Posts',
    className: 'genericfeed',
    _URL: 'http://gaarf.info/feed/',
    _MAXITEMS: 4,
    resizable:true,
    css: {height:'337px',width:'486px'},

    initAfter: function() {
      this.getFeed(this._URL,this._MAXITEMS);
    },

    JSONpCallback: function(data) {
      var html = '';
      $.each(data.query.results.item,function(i){
        html += '<li class="item item'+i+'"><p class="when">' + $.grfTimeAgo(this.pubDate) + '</p>'
              + '<p class="title"><a href="' + this.link + '">' + this.title + '</a></p>' 
              + '<p class="details">' + this.description + '</p></li>';
      });
      this.$content.html('<ol>'+html+'</ol>');
    }
  },

  { 
    sKey: 'welcome',
    title: 'About',
    css: {width:'788px'},
    resizable:true,
    initBefore: function() {
      var html = '<p>This page is just <acronym title="ECMAScript">JavaScript</acronym> and <acronym title="Cascading Style Sheets">CSS</acronym>, built with @jQuery, @YQL, @anywhere, and no server-side processing.</p><p>All data is pulled by your browser via <acronym title="JavaScript Object Notation with Padding">JSONP</acronym>. Modules can be dragged around, and some can be resized. It works on all major browsers including <acronym title="Internet Exploder">IE6</acronym> and <acronym title="iPhone/iPad/iPod touch">iOS</acronym>, thanks to <strong>jqDnR-touch</strong>, a little library that you can <a href="http://github.com/gaarf/jqDnR-touch">fork on github</a>.</p>';
      if(window.localStorage) {
          html += '<p class="small">Your browser supports <a href="http://dev.w3.org/html5/webstorage/">Web Storage</a>, so module positioning will be memorized for your next visit. <strong>Reposition some modules &amp; reload the page to see</strong>!</p>'
      }
      this.$content.html(html);
    }
  }

];
