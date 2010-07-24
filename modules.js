MODULES = [
  { 
    sKey: 'welcome',
    title: 'Welcome!',
    css: {width:'300px'},
    initBefore: function() {
      this.$content.html('This page is <strong><em>pure</em> JavaScript</strong>. Modules can be dragged around, some can be resized. If your browser supports <a href="http://dev.w3.org/html5/webstorage/" target="_blank">Web Storage</a>, module positioning is memorized for your next visit. It works on iPad. <a href="http://github.com/gaarf/modular-page" target="_blank">The source is on github</a>. Enjoy!');
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
  // { 
  //   sKey: 'twitter',
  //   _USERNAME: 'gaarf',
  //   css: {height:'200px',width:'300px',clear:'left'},
  //   resizable: true,
  //   initBefore: function() {
  //     this.getJSONp('http://twitter.com/status/user_timeline/'+this._USERNAME+'.json?count=10&callback=?');
  //   },
  //   JSONpCallback: function(data) {
  //     this.$content.html((data.length+1)+' Tweets received!');
  //   }
  // },
  // { 
  //   sKey: 'flickr',
  //   _ID: '94765669@N00',
  //   _TAGS: 'flickrrss',
  //   css: {height:'200px',width:'300px', clear:'left'},
  //   initAfter: function() {
  //     this.getJSONp('http://api.flickr.com/services/feeds/photos_public.gne?id='+this._ID+'&tags='+this._TAGS+'&format=json&jsoncallback=?');
  //   }
  // }
];
