'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {

        //init
        DnDMoM.initMainNav();
        DnDMoM.initImageSlider('#key-features');

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
        }
    }
})(jQuery);