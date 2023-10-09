/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT

Modified by Ben Beckford and Jonathan Spicer, Chris Curd Design Ltd. to allow for HTML5 video
Video sources should be passed in the images parameter as an array with an
image as the first option for backwards compatability with browsers that
don't support HTML5 video. Also added support for Vimeo Embed links.
*/

;(function ($, window, undefined) {
  'use strict';

  /* PLUGIN DEFINITION
   * ========================= */

  $.fn.backstretch = function (images, options) {
    // We need at least one image
    if (images === undefined || images.length === 0) {
      $.error("No images were supplied for Backstretch");
    }

    /*
     * Scroll the page one pixel to get the right window height on iOS
     * Pretty harmless for everyone else
    */
    if ($(window).scrollTop() === 0 ) {
      window.scrollTo(0, 0);
    }

    return this.each(function () {
      var $this = $(this)
        , obj = $this.data('backstretch');

      // If we've already attached Backstretch to this element, remove the old instance.
      if (obj) {
        // Merge the old options with the new
        options = $.extend(obj.options, options);

        // Remove the old instance
        obj.destroy(true);
      }

      obj = new Backstretch(this, images, options);
      $this.data('backstretch', obj);
    });
  };

  // If no element is supplied, we'll attach to body
  $.backstretch = function (images, options) {
    // Return the instance
    return $('body')
            .backstretch(images, options)
            .data('backstretch');
  };

  // Custom selector
  $.expr[':'].backstretch = function(elem) {
    return $(elem).data('backstretch') !== undefined;
  };

  /* DEFAULTS
   * ========================= */

  $.fn.backstretch.defaults = {
      centeredX: true        // Should we center the image on the X axis?
    , centeredY: true        // Should we center the image on the Y axis?
    , duration: 5000         // Amount of time in between slides (if slideshow)
    , fade: 0                // Speed of fade transition between slides
    , wrapInner: false       // Add backstretchInner wrapper inside backstretch wrapper (useful for parallax)
    , resizeMethod: 'cover'  // Based off of background size property
    , videoMuted: true       // Add muted="true" to videos
    , videoPreload: "auto"   // video preload="" attribute
    , videoOnPlaying: ""     // video onplaying="" attribute
    , videoPoster: ""        // video poster="" attribute
    , videoAutoPlay: "true"  // video autoplay="" attribute
    , videoLoop: "loop"      // video loop="" attribute
    , videoID: ""            // video id="" attribute
    , lazyLoad: false           // video lazyload attribute
    , videoPlaysInline: true    // video playsinline attribute
    , alignRight: false    // Align the image or video to the right hand side
  };

  /* STYLES
   *
   * Baked-in styles that we'll apply to our elements.
   * In an effort to keep the plugin simple, these are not exposed as options.
   * That said, anyone can override these in their own stylesheet.
   * ========================= */
  var styles = {
      wrap: {
          left: 0
        , top: 0
        , overflow: 'hidden'
        , margin: 0
        , padding: 0
        , height: '100%'
        , width: '100%'
        , zIndex: -999999
        , '-webkit-transform': 'translateZ(0)'
        , '-moz-transform'   : 'translateZ(0)'
        , '-ms-transform'    : 'translateZ(0)'
        , '-o-transform'     : 'translateZ(0)'
        , 'transform'        : 'translateZ(0)'
        , '-webkit-backface-visibility': 'hidden'
        , '-moz-backface-visibility'   : 'hidden'
        , '-ms-backface-visibility'    : 'hidden'
        , 'backface-visibility'        : 'hidden'
      }
    ,
      wrapInner: {
          position: 'relative'
      }
    , img: {
          position: 'absolute'
        , display: 'none'
        , margin: 0
        , padding: 0
        , border: 'none'
        , width: 'auto'
        , height: 'auto'
        , maxWidth: 'none'
        , zIndex: -999999
        , '-webkit-transform': 'translateZ(0)'
        , '-moz-transform'   : 'translateZ(0)'
        , '-ms-transform'    : 'translateZ(0)'
        , '-o-transform'     : 'translateZ(0)'
        , 'transform'        : 'translateZ(0)'
        , '-webkit-backface-visibility': 'hidden'
        , '-moz-backface-visibility'   : 'hidden'
        , '-ms-backface-visibility'    : 'hidden'
        , 'backface-visibility'        : 'hidden'
      }
    , video: {
          position: 'absolute'
        , display: 'block'
        , margin: 0
        , padding: 0
        , border: 'none'
        , width: 'auto'
        , height: 'auto'
        , maxWidth: 'none'
        , zIndex: -999999
      }
  };

  /* CLASS DEFINITION
   * ========================= */
  var Backstretch = function (container, images, options) {
    this.options = $.extend({}, $.fn.backstretch.defaults, options || {});

    /* In its simplest form, we allow Backstretch to be called on an image path.
     * e.g. $.backstretch('/path/to/image.jpg')
     * So, we need to turn this back into an array.
     */
    var lazyLoadClass = this.options.lazyLoad ? ' class="lazy"' : '';
    this.images = $.isArray(images) ? images : [images];

    if(this.images.length > 1)
    {
      this.videoMode = isVideo(this.images[1]);
      if (!this.videoMode) {
        this.vimeoMode = isVimeo(this.images[1]);
      }
    }
    else
    {
      this.videoMode = isVideo(this.images[0]);
      if (!this.videoMode) {
        this.vimeoMode = isVimeo(this.images[0]);
      }
    }

    if(this.videoMode || this.vimeoMode)
    {
      if(!document.createElement('video').canPlayType)
      {
        this.videoMode = false;
        this.images = this.images[0];
        this.images = [this.images];
      }
      else
      {
        if(!isVideo(this.images[0]) && !isVimeo(this.images[0]))
        {
          this.images.shift();
        }
      }
    }


    if(!this.videoMode && !this.vimeoMode)
    {
      // Preload images
      $.each(this.images, function () {
        $('<img '+lazyLoadClass+' />')[0].src = this;
      });
    }

    // Convenience reference to know if the container is body.
    this.isBody = container === document.body;

    /* We're keeping track of a few different elements
     *
     * Container: the element that Backstretch was called on.
     * Wrap: a DIV that we place the image into, so we can hide the overflow.
     * Root: Convenience reference to help calculate the correct height.
     */
    this.$container = $(container);

    if(options == null || options.resizeMethod == null)
    {
      if(this.$container.css('background-size') == 'contain')
      {
        this.options.resizeMethod = 'contain';
      }
    }

	this.$wrap = $('<div class="backstretch"></div>').css(styles.wrap).appendTo(this.$container);

	if(this.options.wrapInner || this.vimeoMode)
	{
		if (this.vimeoMode) {
			this.$wrapInner = $('<div class="backstretchInner loading"></div>').css(styles.wrapInner).appendTo(this.$wrap);
		}
		else {
			this.$wrapInner = $('<div class="backstretchInner"></div>').css(styles.wrapInner).appendTo(this.$wrap);
		}
	}
	else
	{
		this.$wrapInner = this.$wrap;
	}
	this.$root = this.isBody ? supportsFixedPosition ? $(window) : $(document) : this.$container;

    // Non-body elements need some style adjustments
    if (!this.isBody) {
      // If the container is statically positioned, we need to make it relative,
      // and if no zIndex is defined, we should set it to zero.
      var position = this.$container.css('position')
        , zIndex = this.$container.css('zIndex');

      this.$container.css({
          position: position === 'static' ? 'relative' : position
        , zIndex: zIndex === 'auto' ? 0 : zIndex
        , background: 'none'
      });

      // Needs a higher z-index
      this.$wrap.css({zIndex: -999998});
    }

    // Fixed or absolute positioning?
    this.$wrap.css({
      position: this.isBody && supportsFixedPosition ? 'fixed' : 'absolute'
    });

    // Set the first image
    this.index = 0;
    this.show(this.index);

    // Listen for resize
    $(window).on('resize.backstretch', $.proxy(this.resize, this))
             .on('orientationchange.backstretch', $.proxy(function () {
                // Need to do this in order to get the right window height
                if (this.isBody && window.pageYOffset === 0) {
                  window.scrollTo(0, 1);
                  this.resize();
                }
             }, this));
  };

  /* PUBLIC METHODS
   * ========================= */
  Backstretch.prototype = {
      resize: function () {
        try {
          var bgCSS = {left: 0, top: 0, right: 'auto'}
            , rootWidth = this.isBody ? this.$root.width() : this.$root.innerWidth()
            , bgWidth = rootWidth
            , rootHeight = this.isBody ? ( window.innerHeight ? window.innerHeight : this.$root.height() ) : this.$root.innerHeight()
            , bgHeight = bgWidth / this.$img.data('ratio')
            , bgOffset;

            if(this.options.resizeMethod == 'contain')
            {
              // Make adjustments based on image ratio
              if (bgHeight >= rootHeight) {
                  bgHeight = rootHeight;
                  bgWidth = bgHeight * this.$img.data('ratio');

                  bgOffset = (rootWidth - bgWidth) / 2;
                  if(this.options.centeredX) {
                    bgCSS.left = bgOffset + 'px';
                  }
                  if(this.options.alignRight)
                  {
                    bgCSS.left = 'auto';
                    bgCSS.right = 0;
                  }
              } else {
                  bgOffset = (rootHeight - bgHeight) / 2;
                  if(this.options.centeredY) {
                    bgCSS.top = bgOffset + 'px';
                  }
              }
            }
            else
            {
              // Make adjustments based on image ratio
              if (bgHeight >= rootHeight) {
                  bgOffset = (bgHeight - rootHeight) / 2;
                  if(this.options.centeredY) {
                    bgCSS.top = '-' + bgOffset + 'px';
                  }
              } else {
                  bgHeight = rootHeight;
                  bgWidth = bgHeight * this.$img.data('ratio');
                  bgOffset = (bgWidth - rootWidth) / 2;
                  if(this.options.centeredX) {
                    bgCSS.left = '-' + bgOffset + 'px';
                  }
                  if(this.options.alignRight)
                  {
                    bgCSS.left = 'auto';
                    bgCSS.right = 0;
                  }
              }
            }
            this.$wrap.css({width: rootWidth, height: rootHeight})
            this.$wrap.find('img:not(.deleteable),video:not(.deleteable),iframe:not(.deleteable)').css({width: bgWidth, height: bgHeight}).css(bgCSS);
        } catch(err) {
            // IE7 seems to trigger resize before the image is loaded.
            // This try/catch block is a hack to let it fail gracefully.
        }

        return this;
      }

      // Show the slide at a certain position
    , show: function (index) {
        // Validate index
        if (Math.abs(index) > this.images.length - 1) {
          return;
        } else {
          this.index = index;
        }

        // Vars
        var self = this
          , oldImage = self.$wrap.find('img').addClass('deleteable')
          , evt = $.Event('backstretch.show', {
              relatedTarget: self.$container[0]
            });
        var lazyLoad = this.options.lazyLoad == true;
        var lazyLoadClass = this.options.lazyLoad ? ' class="lazy"' : '';
        // Pause the slideshow
        clearInterval(self.interval);

        if(this.videoMode)
        {
          var mutevideo = this.options.videoMuted == true;

          // New video
          var onplayingAttr = ' onplaying="'+this.options.videoOnPlaying.toString()+'"';
          var posterAttr = ' poster="'+this.options.videoPoster.toString()+'"';
          var preloadAttr = ' preload="'+this.options.videoPreload.toString()+'"';
          var autoplayAttr = this.options.videoAutoPlay ? ' autoplay="autoplay"' : '';
          var mutedAttr = this.options.videoMuted ? ' muted="muted"' : '';
          var loopAttr = this.options.videoLoop ? ' loop="loop"' : '';
          var inlineAttr = this.options.videoPlaysInline ? ' playsinline' : '';
          var videoSourceHTML = "";
          for(var j in self.images)
          {
            if (lazyLoad) {
              videoSourceHTML += getVideoSourceHTML(self.images[j], true);
            } else {
              videoSourceHTML += getVideoSourceHTML(self.images[j]);
            }
          }
          self.$img = $('<video '+lazyLoadClass+' id="'+this.options.videoID+'" canplay="false" '+loopAttr+autoplayAttr+posterAttr+onplayingAttr+preloadAttr+mutedAttr+inlineAttr+'>'+videoSourceHTML+'</video>')
                        .css(styles.video)
                        .bind('canplay', function (e) {
                          var imgWidth = this.width || $(e.target).width()
                            , imgHeight = this.height || $(e.target).height();

                          // Save the ratio
                          $(this).data('ratio', imgWidth / imgHeight);

                          // Resize
                          self.resize();

                        })
                        .appendTo(self.$wrapInner);

                        // fix for browsers that don't support the muted attribute
                        self.$img[0].muted = mutevideo ? "muted" : "";


        }
        else if(this.vimeoMode)
        {

    		var vimeoSource = "";
    		for(var j in self.images)
    		{
    			vimeoSource += self.images[j];
        }
          var vimeoWidth = 0;
          var vimeoHeight = 0;
          self.$img = $('<iframe style="opacity: 0" canplay="false" src="'+vimeoSource+'?background=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
            .css(styles.video).on('load', function (e) {
              var imgWidth = this.width || $(e.target).width(),
              imgHeight = this.height || $(e.target).height();
            }).appendTo(self.$wrapInner);
            $(window).on('beforeunload', function() {
              self.$img.css('opacity', '0');
          });
          // This is the URL of the video you want to load
          var videourl = vimeoSource;
          // This is the oEmbed endpoint for Vimeo (we're using JSON)
          var endpoint = 'https://vimeo.com/api/oembed.json';
          // Put together the URL
          videourl = endpoint + '?url=' + encodeURIComponent(videourl);
          $.ajax({
            type : 'GET',
            url : videourl,
            format: "json",
            dataType : 'jsonP',
            success : function(data){
              vimeoWidth = data.width - 1;
              vimeoHeight = data.height;
              // Save the ratio
                self.$img.data('ratio', vimeoWidth / vimeoHeight);
              // Resize
                self.resize();
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
              //alert('error');
              }
          });

          $.getScript( "https://player.vimeo.com/api/player.js", function( data, textStatus, jqxhr ) {
            var player = new Vimeo.Player(self.$img[0]);
            player.on('timeupdate', function(data) {
              if (data.seconds > 0) {
                self.$img.stop().animate({'opacity': '1'}, 500);
                self.$img.parent().removeClass('loading');
                player.off('timeupdate');
              }
            });
          });

				}
				else
				{
					// New image
					self.$img = $('<img '+lazyLoadClass+' />')
												.css(styles.img)
												.bind('load', function (e) {
													var imgWidth = this.width || $(e.target).width()
														, imgHeight = this.height || $(e.target).height();

                          // Save the ratio
                          $(this).data('ratio', imgWidth / imgHeight);

                          // Add alt text
                          $(this).attr('alt', self.$container.data('alt'));

                          if(self.options.resizeMethod == 'contain')
                          {
                            oldImage.fadeOut(self.options.speed || self.options.fade);
                          }

                          // Show the image, then delete the old one
                          // "speed" option has been deprecated, but we want backwards compatibilty
                          $(this).fadeIn(self.options.speed || self.options.fade, function () {
                            oldImage.remove();

                            // Resume the slideshow
                            if (!self.paused) {
                              self.cycle();
                            }

                            // Trigger the event
                            self.$container.trigger(evt, self);
                          });

                          // Resize
                          self.resize();
                        })
                        .appendTo(self.$wrapInner);

          // Hack for IE img onload event
          self.$img.attr('src', self.images[index]);
        }
        return self;
      }

    , next: function () {
        // Next slide
        return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
      }

    , prev: function () {
        // Previous slide
        return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1);
      }

    , pause: function () {
        // Pause the slideshow
        this.paused = true;
        return this;
      }

    , resume: function () {
        // Resume the slideshow
        this.paused = false;
        this.next();
        return this;
      }

    , cycle: function () {
        // Start/resume the slideshow
        if(this.images.length > 1) {
          // Clear the interval, just in case
          clearInterval(this.interval);

          this.interval = setInterval($.proxy(function () {
            // Check for paused slideshow
            if (!this.paused) {
              this.next();
            }
          }, this), this.options.duration);
        }
        return this;
      }

    , destroy: function (preserveBackground) {
        // Stop the resize events
        $(window).off('resize.backstretch orientationchange.backstretch');

        // Clear the interval
        clearInterval(this.interval);

        // Remove Backstretch
        if(!preserveBackground) {
          this.$wrap.remove();
        }
        this.$container.removeData('backstretch');
      }
  };

  var isVideo = function(path) {
    var ext = path.split(".");
    ext = ext[ext.length-1];
    ext = ext.split("?").shift();
    if(ext == "mp4" || ext == "m4v" || ext == "ogv" || ext == "flv" || ext == "webm" || ext == "asf" || ext == "avi" || path.indexOf("progressive_redirect") >= 0)
    {
      return(true);
    }
    else
    {
      return(false);
    }
  }

  var isVimeo= function(path) {
    if (path.indexOf("player.vimeo") >= 0)
    {
      return(true);
    }
    else
    {
      return(false);
    }
  }

  var getVideoSourceHTML = function(path, lazy) {
    var ext = path.split(".");
    ext = ext[ext.length-1];
    ext = ext.split("?").shift();
    if (path.indexOf("progressive_redirect") >= 0) // Added to accomodate
    {
      ext = 'mp4';
    }
    if (lazy) {
      return('<source data-src="'+path+'" type="video/'+ext+'">');
    } else {
      return('<source src="'+path+'" type="video/'+ext+'">');
    }
  }

  /* SUPPORTS FIXED POSITION?
   *
   * Based on code from jQuery Mobile 1.1.0
   * http://jquerymobile.com/
   *
   * In a nutshell, we need to figure out if fixed positioning is supported.
   * Unfortunately, this is very difficult to do on iOS, and usually involves
   * injecting content, scrolling the page, etc.. It's ugly.
   * jQuery Mobile uses this workaround. It's not ideal, but works.
   *
   * Modified to detect IE6
   * ========================= */

  var supportsFixedPosition = (function () {
    var ua = navigator.userAgent
      , platform = navigator.platform
        // Rendering engine is Webkit, and capture major version
      , wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ )
      , wkversion = !!wkmatch && wkmatch[ 1 ]
      , ffmatch = ua.match( /Fennec\/([0-9]+)/ )
      , ffversion = !!ffmatch && ffmatch[ 1 ]
      , operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ )
      , omversion = !!operammobilematch && operammobilematch[ 1 ]
      , iematch = ua.match( /MSIE ([0-9]+)/ )
      , ieversion = !!iematch && iematch[ 1 ];

    return !(
      // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
      ((platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534) ||

      // Opera Mini
      (window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]") ||
      (operammobilematch && omversion < 7458) ||

      //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
      (ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533) ||

      // Firefox Mobile before 6.0 -
      (ffversion && ffversion < 6) ||

      // WebOS less than 3
      ("palmGetResource" in window && wkversion && wkversion < 534) ||

      // MeeGo
      (ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1) ||

      // IE6
      (ieversion && ieversion <= 6)
    );
  }());

}(jQuery, window));