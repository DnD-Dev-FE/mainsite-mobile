'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {
        var $window = $(window);
        var $body = $('body');

        //init
        DnDMoM.initMainNav();
        DnDMoM.initImageSlider('#key-features');
        DnDMoM.initHotEventSlider();
        DnDMoM.initTopButton();


    })(jQuery);


});

//functions
DnDMoM = (function($) {
    var _options = {
        swiper: {
            mode:'horizontal',
            loop: false,
            slidesPerView: 'auto',
            slideElement: 'li'
        }
    }
    var $window = $(window);
    var $body = $('body');

    return {
        initMainNav: function() {
            //main navigation
            $('#main-nav__list')
                .on('click touchstart', ' > li > ul a', function(e) {
                    e.stopPropagation();
                })
                .on('click touchstart', ' > li > a.main-nav__has-sub', function(e) {
                    $('#main-nav__list > li > a.main-nav__has-sub.focus').not(this).removeClass('focus');
                    $(this).toggleClass('focus');
                    return false;
                });
            $(document).on('click', function(e) {
                $('#main-nav__list > li > a.main-nav__has-sub.focus').removeClass('focus');
            });
        },

        initImageSlider: function(selector) {
            return $( selector ).swiper( $.extend(true, _options.swiper, {
                freeMode: true,
                freeModeFluid: true
            }) );
        },

        initHotEventSlider: function(selector) { /* for smartphone */
            var _fn_ = function() {
                if ( Modernizr.mq('only screen and (max-width: 666px)' ) ) {
                    if ( DnDMoM.hotEvent === undefined ) {
                        DnDMoM.hotEvent = (function() {
                            return $('#hot-events__list').swiper( $.extend(true, _options.swiper, {
                                slidesPerView: 1.5,
                                slideActiveClass: 'swiper-slide--active'
                            }) );
                        })();
                    }
                }
                else {
                    if ( DnDMoM.hotEvent instanceof Swiper ) {
                        DnDMoM.hotEvent = DnDMoM.destroySlider(DnDMoM.hotEvent);
                    }
                    if ( DnDMoM.hotEvent === undefined ) {
                        DnDMoM.hotEvent = (function() {
                            var wrapper = $('#hot-events__list > ul');
                            var wrapperHeight = wrapper.height();
                            var items = $('.swiper-slide > a > div');
                            items.css({ height: wrapperHeight/items.length });
                            wrapper.on('mouseenter', '.swiper-slide', function(e) {
                                wrapper.find('.swiper-slide--active').removeClass('swiper-slide--active');
                                $(this).addClass('swiper-slide--active');
                                return false;
                            });
                        })();
                    }
                }
            }
            $window.resize(function(e) { _fn_(); })
             _fn_();
        },

        initTopButton: function() {
            var topButton = $('#top-button');
            var _height = $(document).height() * 0.2;
            var _fn_ = function() {
                if ( $window.scrollTop() >= _height ) {
                    if ( !topButton.hasClass('flyout-content__top-button--shown') ) {
                        topButton.addClass('flyout-content__top-button--shown');
                    }
                }
                else {
                    topButton.removeClass('flyout-content__top-button--shown');
                }
            }
            $window.on('scroll', function(e) { _fn_(); });
            _fn_();

            topButton.on('click', function(e) {
                $body.animate({
                    scrollTop: 0
                });
                return false;
            });
        },

        distributeHeight: function(wrapperSelector, itemSelector) {
        },

        destroySlider:  function(object) {
            if ( object !== undefined ) {
                // destroy and delete swiper object
                var container = $( object.container );
                container.find('*').stop(true, true).removeAttr('style');
                object.destroy();
                return undefined;
            }
        }
    }
})(jQuery);