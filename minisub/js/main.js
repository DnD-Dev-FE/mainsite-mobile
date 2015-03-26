'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {
        var $window = $(window);
        var $body = $('body');

        //init main navigation sub-menu behavior
        DnDMoM.initMainNav();

        //init to top button behavior
        DnDMoM.initTopButton();

        DnDMoM.initMinisubHeaderBar();

    })(jQuery);
});

//functions
DnDMoM = (function($) {
    var $window = $(window);

    return {
        initMainNav: function() {
            //main navigation
            var mainNav = $('#main-nav');
            var mainNavList = $('#main-nav__list');
            var mainNavTriggerEvent = Modernizr.touch ? 'touchend' : 'click';
            mainNavList
                .on(mainNavTriggerEvent, ' > li > a:not(.main-nav__has-sub)', function(e) {
                    if ( Modernizr.mq('only screen and (max-width: 666px)') ) {
                        $('#drawer-toggle').removeAttr('checked');
                    }
                    return true;
                })
                .on(mainNavTriggerEvent, ' > li > ul a', function(e) {
                    e.stopPropagation();
                })
                .on(mainNavTriggerEvent, ' > li > a.main-nav__has-sub', function(e) {
                    $('#main-nav__list > li > a.main-nav__has-sub.focus').not(this).removeClass('focus');
                    $(this).toggleClass('focus');
                    return false;
                });
            $(document).on(mainNavTriggerEvent, function(e) {
                $('#main-nav__list > li > a.main-nav__has-sub.focus').removeClass('focus');
            });

            var drawToggle = $('#drawer-toggle');
            var _fn_ = function() {
                if ( Modernizr.mq('only screen and (max-width: 666px), (min-width: 667px) and (max-width: 1024px)' ) ) {
                    drawToggle.on('change', function() {
                        if ( $(this).is(':checked') ) {
                            mainNav.addClass('shown');
                        }
                        else {
                            setTimeout(function() {
                                mainNav.removeClass('shown');
                            }, 250);
                        }
                    });
                }
            }
            $(window).on('resize', _fn_);
            _fn_();

            //swipe main-nav on/off
            if ( Modernizr.mq('only screen and (max-width: 666px), (min-width: 667px) and (max-width: 1024px)' ) ) {
                $(window).swipeListener({
                    minX: 25,
                    minY: 0,
                    swipeRight: function(e) {
                        if ( e.coords.start.x <= $window.width()*.25
                            && Math.abs( e.coords.start.y - e.coords.stop.y ) <= 10
                        ) {
                            drawToggle.prop('checked', 'checked');
                            $('#main-nav').addClass('shown');
                        }
                    },
                    swipeLeft: function(e) {
                        drawToggle.prop('checked', false);
                        setTimeout(function() {
                            mainNav.removeClass('shown');
                        }, 250);
                    },
                    swipeUp: function(e) { return true; },
                    swipeDown: function(e) { return true; }
                });
            }

            return mainNavList;
        },

        initTopButton: function() {
            var topButton = $('#top-button');
            var _height = $(document).height() * 0.5;
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

            var topBtnTriggerEvent = Modernizr.touch ? 'touchstart' : 'click';
            topButton.on(topBtnTriggerEvent, function(e) {
                $('body, html').stop(true, true).animate({
                    scrollTop: 0
                });
                return false;
            });
        },

        initMinisubHeaderBar: function() {
            var mainNav = $('#main-nav');
            var topSpace = $('#topbar').outerHeight(true) + $('#primary-banner').outerHeight(true);
            var _fn_ = function() {
                var isStick = false;
                if ( $window.scrollTop() >= topSpace ) {
                    isStick = true;
                    var windowHeight = $window.height();
                    if ( Modernizr.mq('only screen and (min-width: 1025px)')
                        && mainNav.height() > windowHeight
                    ) {
                        mainNav.css( 'height', windowHeight - 230 );
                    }
                }
                else {
                    if ( Modernizr.mq('only screen and (min-width: 1025px)') ) {
                        mainNav.css( 'height', 'auto' ); 
                    }  
                }
                $('#outer').toggleClass( 'minisub-header-stick', isStick );
            }
            $window.on( 'scroll', _fn_ );
            _fn_();
        }
    }
})(jQuery);
//pattern
Pattern.Mediator.installTo(DnDMoM);