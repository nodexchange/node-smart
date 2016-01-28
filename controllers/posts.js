var IQEvent = require('../event/IQEvent.js');

var PostsController = function() {
  this.addEventListeners();
};

PostsController.prototype = {
  init: function() {
    var self = this;
    //    self.events.dispatchEvent(event);
  },

  addEventListeners: function() {
    var self = this;
    self.events.addEventListener(IQEvent.MONGOOSE_READY, function(event) {
      self.posts = event.posts;
    });

    self.events.addEventListener(IQEvent.EXPRESS_RENDER, function(event) {

    });
    self.events.addEventListener(IQEvent.SERVER, function(event) {
      if (event.header == IQEvent.HEADERS.debug) {
        switch (event.route) {
          case 'posts':
            if (event.action == 'add') {
              self.dummyPosts();
            } else if (event.action == 'log') {
              self.log();
            } else if (event.action == 'flush') {
              self.flush();
            }
            break;
        }
      }
    });
  },

  log: function() {
    this.posts.find({}, function(err, response) {
      console.log(response);
    });
  },

  dummyPosts: function() {
    var self = this;
    var dummyData = [
      {title:'Martin Buchannon', text:'created new page', smallImage:'http://www.keenthemes.com/preview/conquer/assets/plugins/jcrop/demos/demo_files/image1.jpg', largeImage:'Wireframes Taiga Tribe', companyName:"AOL Inc", index:"AOL", clicks:"20", section:"business", subsection:"digital", tags:"merger, won", author:"CNN", originalUrl:"cnn.com/test", highlighted:"false", published:"true"},
      {title:'Random Titile 1', text:'created new page', smallImage:'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image2.jpg', largeImage:'Wireframes Taiga Tribe', companyName:"AOL Inc", index:"AOL", clicks:"20", section:"business", subsection:"digital", tags:"merger, won", author:"CNN", originalUrl:"cnn.com/test", highlighted:"false", published:"true"},
      {title:'My Title 2', text:'created new page', smallImage:'http://www.online-image-editor.com//styles/2014/images/example_image.png', largeImage:'Wireframes Taiga Tribe', companyName:"AOL Inc", index:"AOL", clicks:"20", section:"business", subsection:"digital", tags:"merger, won", author:"CNN", originalUrl:"cnn.com/test", highlighted:"false", published:"true"},
      {title:'Heading 3 test', text:'created new page', smallImage:'http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg', largeImage:'Wireframes Taiga Tribe', companyName:"AOL Inc", index:"AOL", clicks:"20", section:"business", subsection:"digital", tags:"merger, won", author:"CNN", originalUrl:"cnn.com/test", highlighted:"false", published:"true"}
    ];
    // TODO(martin): check if that works.
    var saveFnc = function(err, response) {
      if (err) {
        console.log('[Error]' + ' SAVE ERROR: ITEM : ' + ' Error message: '+err);
        self.events.dispatchEvent(new SmartEvent(SmartEvent.TRANSACTION_ERROR));
        return console.error(err);
      }
      console.log('saved');
    };
    for (var i=0; i<dummyData.length; i++) {
      var post = new self.posts(dummyData[i]);
      post.save(saveFnc);
    }
  },
  flush: function() {
    this.posts.remove({}, function(err) {
      console.log('collection removed');
    });
  },
};

module.exports = function(settings, eventManager) {
  PostsController.prototype.events = eventManager;
  PostsController.prototype.settings = settings;
  return PostsController;
};
