/*!
 * scrollMomentum.js
 * @author Jean-Christophe Suzanne <jc.suzanne@gmail.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>

 Usage
 -----
 var gScroll = new scrollMomentum({
    body : $('#master'),
    receptor : $('#seReceptor'),
    fx : {
        duration : 1,
        easing : Power2.easeOut
    }
});
 */
(function(window, document, undefined) {
'use strict';

    // Singleton
    var
        _instance
    ,   $html
    ,   $body
    ,   $receptor
    ,   $window         =   $(window)
    ,   tween
    ,   defaults        =   {
            pointerEvents : true,
            resizeReceptor : true,
            fx : {
                duration : .5,
                easing : Power3.easeOut
            }
        }
    ,   settings        =   {}
    ,   timer
    ;


    var scrollMomentum = function(options) {
        _instance       =   this;
        settings        =   $.extend({},defaults,options);
        $html           =   $('body');
        $body           =   settings.body;
        $receptor       =   settings.receptor;
        _instance.construct();
        return _instance;
    };

    scrollMomentum.prototype.construct = function()
    {
        if(settings.resizeReceptor) _instance.setDimensions();
        _instance.scroll();

    }

    scrollMomentum.prototype.setDimensions = function() {
        $body.css({
            'height':$receptor.height()
        });
    }

    scrollMomentum.prototype.scrollEnd = function() {
        $html.css({
            'pointer-events':'auto'
        })
    }

    scrollMomentum.prototype.scroll = function() {
        var scope = this;
        var $listener = (typeof settings.listener != 'undefined')?settings.listener:$window;
        $listener.on('scroll.momentum',function(e) {
            var
                getY    =   $(this).scrollTop()
            ;
            if(typeof tween != 'undefined') TweenLite.killTweensOf($receptor);
            tween = TweenLite.to(
                $receptor,
                settings.fx.duration,
                {
                    y:-(getY),
                    force3D : true,
                    ease:settings.fx.easing,
                    onStart : function() {
                        if(settings.pointerEvents) {
                            $html.css({
                                'pointer-events':'none'
                            });
                        }
                        if(typeof settings.onStart != 'undefined' && typeof settings.onStart == 'function') settings.onStart();
                    },
                    onUpdate : function() {
                        if(typeof $receptor[0]._gsTransform != 'undefined') {
                            var
                                getY    =   $receptor[0]._gsTransform.y
                            ;
                            if(typeof settings.onChange != 'undefined' && typeof settings.onChange == 'function') settings.onChange(getY);
                        }
                    },
                    onComplete: function()
                    {
                        if(settings.pointerEvents) {
                            clearTimeout(timer);
                            timer = setTimeout( scope.scrollEnd , 150 );
                        }
                        if(typeof settings.onComplete != 'undefined' && typeof settings.onComplete == 'function') settings.onComplete();
                    }
                }
            );
        });
    }


    // Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
    // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // define as an anonymous module
    define(function() {
      return scrollMomentum;
    });
    // check for `exports` after `define` in case a build optimizer adds an `exports` object
    }
    else if(typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = scrollMomentum;
    }
    else {
    window.scrollMomentum = scrollMomentum;
    }


}(window, document));