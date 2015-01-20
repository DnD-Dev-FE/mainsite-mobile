'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {
        var $window = $(window);
        var $body = $('body');

        //load config
        $.get('config/config.json', {/* post data */}, function(data) {
            DnDMoM.config = data;

            //init main navigation sub-menu behavior
            DnDMoM.initMainNav();

            //init key feature + hot events slider on homepage
            if ( $body.hasClass('homepage') ) {
                DnDMoM.initImageSlider('#key-features');
                DnDMoM.initHotEventSlider();
            }

            //init to top button behavior
            DnDMoM.initTopButton();

            //init rating box only on bp(desktop) on homepage
            if ( $body.hasClass('homepage') ) {
                var _fn_ = function() {
                    if ( Modernizr.mq('only screen and (min-width: 667px)' ) ) {
                        DnDMoM.initRatingBox();
                    }
                }
                $window.on('resize', function(e) {
                    _fn_();
                });
                _fn_();
            }

            //init filter posts by category for homepage
            if ( $body.hasClass('homepage') ) {
                DnDMoM.initFilterPosts('#posts__tabs');
            }

            //init Hasher for subpage
            if ( $body.hasClass('subpage') ) {
                DnDMoM.initRouter();
                DnDMoM.initSubpageHasher();
            }
        }, 'json'/* receiving data type */);
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

    var _parseVar_ = function(str, valueObj) {
        $.each(valueObj, function(key, value) {
            str = str.replace( new RegExp('{{ ' + key + ' }}'), value );
        });
        return str;
    }

    //get 5 newest posts by cate: all | news | events
    var _doFilterPosts_ = function(url, success, error, completed) {
        var loading = '<li class="posts__loading">Đang tải dữ liệu...</li>';
        var listContent = $('#posts__list');

        listContent.find('.posts__loading').remove();
        listContent
            .find('> li').addClass('inactive').end()
            .prepend(loading);

        return $.ajax({
            type: 'POST',
            url: url,
            dataType: 'html', //receive
            contentType: 'json', //send
            data: JSON.stringify({}),
            success: function(data, status, jqXHR) {
                listContent.html(data);
                if ( success !== undefined ) { success(data, status, jqXHR); }
            },
            error: function() {
                if ( error !== undefined ) { error(); }
            },
            completed: function() {
                if ( completed !== undefined ) { completed(); }
            }
        });
    }

    var _hasherListener = {
        //get posts with pagination by cate: all | news | events
        blogroll: function(cate, page) {
            //active tab
            $('#posts__tabs')
                .find('> li.active').removeClass('active').end()
                .find('a[href="#!' + cate + '?p=1"]').parent().addClass('active');

            //active page index
            $('.pagination__list a.pagination__index')
                .removeClass('pagination__index--active')
                .eq(page-1).addClass('pagination__index--active');

            var totalPage = 0;
            //update pagination index
            $('.pagination__list a.pagination__index').each(function() {
                totalPage++;
                var $this = $(this);
                var href = $this.data('href');
                $this.attr( 'href', _parseVar_(href, {cate: cate}) );
            });
            //update prev/next navigation
            $('.pagination__list a.pagination__nav').each(function() {
                var $this = $(this);
                var href = $this.data('href');
                $this.attr( 'href', _parseVar_(href, {
                    cate: cate,
                    page: $this.hasClass('pagination__nav-prev')
                        ? page-1
                        : page+1
                }) );

                if ( $this.hasClass('pagination__nav-prev') ) {
                    $this.toggleClass('pagination__nav--disabled', page == 1);
                }

                if ( $this.hasClass('pagination__nav-next') ) {
                    $this.toggleClass('pagination__nav--disabled', page == totalPage);
                }
            });
            $('.pagination__list').on('click', '.pagination__nav--disabled', function(e) {
                return false;
            })

            var url = DnDMoM.config.allPostsService;;
            switch ( cate ) {
                case 'all':
                    url = DnDMoM.config.allPostsService;
                    break;
                case 'news':
                    url = DnDMoM.config.newsService;
                    break;
                case 'events':
                    url = DnDMoM.config.eventsService;
                    break;
            }
            url = _parseVar_(url, { page: page });
            _doFilterPosts_(
                url,
                function(data, status, jqXHR) {}, //success
                function() {}, //error
                function() {} //completed
            );
        }
    }

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
                freeModeFluid: true,
                slidesPerViewFit: false,
                autoResize: false
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
                $('body, html').stop(true, true).animate({
                    scrollTop: 0
                });
                return false;
            });
        },

        initRatingBox: function() {
            //rating
            $('#rating-box--choices').on('click', ' > li > a', function(e) {
                var value = $(this).attr('href');
                $.ajax({
                    type: 'post',
                    url: DnDMoM.config.ratingService,
                    contentType: 'json', //sending
                    dataType: 'json', //return back
                    data: JSON.stringify({
                        rating: value
                    }),
                    success: function(data, status, jqXHR) {
                        //TODO...
                        //expected response: data: { totalRating, average, statistic[i]}
                        $('#rating-box__average-points').text( data.average );
                        $('#rating-box__total-rating-number').text( data.totalRating );
                        ratingStatisticList.find('> li:eq(' + (5 - value) + ') > div > span')
                            .text( data.statistic[value] )
                            .attr( 'data-value', data.statistic[value] )
                    },
                    error: function() {
                    },
                    completed: function() {
                    }
                });

                return false;
            });

            //statistic
            var ratingStatisticList = $('#rating-box__statistic-list');
            var ratingStatisticListData = ratingStatisticList.data();
            var maxVote = ratingStatisticListData.maxVote;
            $('#rating-box__statistic-list > li > .rating-box__statistic-bar > span').each(function(e) {
                var $this = $(this);
                $this.width( ( $this.data('value')*100/maxVote - 5 ) + '%' );
            })
        },

        initFilterPosts: function(controlSelector) {
            var control = $( controlSelector );
            var filterPostsAjax;

            if ( control.length == 0 ) { return false; }
            control.on('click', 'a', function(e) {
                var $this = $(this);
                control.find('> li.active').removeClass('active');
                $this.parent().addClass('active');

                if ( filterPostsAjax !== undefined ) {
                    filterPostsAjax.abort();
                }
                var url = $this.attr('href');
                control
                    .find('> li.active').removeClass('active').end()
                    .find('a[href="' + url + '"]').parent().addClass('active');

                filterPostsAjax = _doFilterPosts_(
                    url,
                    function(data, status, jqXHR) {}, //success
                    function() {}, //error
                    function() {} //completed
                );

                return false;
            });
            control.find('a:eq(0)').trigger('click');
        },

        initSubpageHasher: function() {
            //setup #Hasher
            function parseHash (newHash, oldHash) { //callback when 'setHash'
                setTimeout(function() { //fix delay
                    if ( newHash !== oldHash ) {
                        crossroads.parse( window.location.href.split('/').pop() );
                    }
                }, 1);
            }
            hasher.prependHash = '!';
            hasher.changed.add(parseHash); //parse hash changes
            hasher.initialized.add(parseHash); //parse initial hash
            hasher.init(); //start listening for history change
        },

        initRouter: function() {
            crossroads.addRoute('/posts.html:?query:', function(query) {
                if ( query !== undefined ) {
                    var queryLocation = window.location.href.indexOf('?');
                    window.location = window.location.href.substr(0, queryLocation) + '#!all?' + $.param(query);
                }
                else {
                    hasher.setHash('all');
                }
            });
            crossroads.addRoute('/posts.html#!{cate}:?query:', function(cate, query) {
                if ( query === undefined || query.p === undefined ) {
                    hasher.setHash(cate + '?p=1');
                }
                else {
                    _hasherListener.blogroll( cate, parseInt(query.p) );
                }
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