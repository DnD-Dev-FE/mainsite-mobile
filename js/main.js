'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {
        var $window = $(window);

        //init
        DnDMoM.initMainNav();
        DnDMoM.initImageSlider('#key-features');     
        
        $window
            .resize(function(e) {
                if ( Modernizr.mq('only screen and (max-width: 666px)' ) ) {
                    if ( DnDMoM.hotEvent === undefined ) {
                        DnDMoM.hotEvent = DnDMoM.initHotEvent('#hot-events-list');
                    }    
                }
                else {                
                    if ( DnDMoM.hotEvent !== undefined ) {                   
                        DnDMoM.hotEvent = DnDMoM.destroySlider(hotEvent);
                    }    
                }
            })
            .trigger('resize');
    })(jQuery);

   
});

//functions
DnDMoM = (function($) {
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

        initImageSlider: function($selector) {
            return $( $selector ).swiper({
                mode:'horizontal',
                loop: false,
                slidesPerView: 'auto',
                freeMode: true,
                freeModeFluid: true
            });
        },

        initHotEvent: function($selector) {
            return $( $selector ).swiper({
                paginationClickable: true,
                slidesPerView: 'auto',                   
                slideElement:'li',                   
                calculateHeight:true
            });
        },

        destroySlider:  function(object) {
            if (typeof object != 'undefined') {                
                // destroy and delete swiper object
                var container = jQuery(object.container);
                container.find("*").stop(true, true).removeAttr('style');     
                object.destroy();             
                return undefined;
            }
        }
    }
})(jQuery);