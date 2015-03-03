'use strict';

var DnDMoM = {};

jQuery(document).ready(function(e) {
    (function($) {
        var $window = $(window);
        var $body = $('body');

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

            var video = $('#primary-banner__video')
            video.on('click', function() {
                var $parent = $(this).parent();
                if ( this.played.length > 0 && !this.paused ) {
                    this.pause();
                    $parent.addClass('video--paused');
                }
                else {
                    this.play();
                    $parent.removeClass('video--paused');
                }
            });
            video.prev('.primary-banner__overlays').on('click', function(e) {
                video.trigger('click');
                return false;
            });
        }

        //init filter posts by category for homepage
        if ( $body.hasClass('homepage') ) {
            DnDMoM.initFilterPosts('#posts__tabs');
        }

        //load config for subpages
        var url = 'http://img.zing.vn/products/devmobile/config/config.json?callback=?';
        //var url = 'config/config.json?callback=?';
        $.ajax({
           type: 'GET',
            url: url,
            jsonpCallback: 'jsonCallback',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(data) {
                DnDMoM.config = data;

                //init Hasher for subpage
                if ( $body.hasClass('subpage') ) {
                    DnDMoM.initRouter();
                    DnDMoM.initSubpageHasher();
                    if($('#posts__list').hasClass('gallery__list')) {
                        DnDMoM.initPopup('.fancybox');
                    }
                }
            },
            error: function(e) {}
        });
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
            str = str.replace( new RegExp('{ ' + key + ' }', 'g'), value );
        });

        return str;
    }

    //get 5 newest posts by cate: all | news | events
    var _doFilterPosts_ = function(url, success, error, completed) {
        var timer = new Date().valueOf();
        var listContent = $('#posts__list');
        var loadingHTML = '<p class="posts__loading"><span>Đang tải dữ liệu...</span></p>';
        var loading = listContent.prev('.posts__loading');
        if ( loading.length == 0 ) {
            loading = $( loadingHTML );
            listContent.before( loading );
        }
        listContent
            .find('> li:not(.posts__loading)').addClass('inactive').end()
            .addClass('posts__list--inactive');
        loading.removeClass('posts__loading--hidden');

        //scroll to top of list posts
        if ( listContent.offset().top < $window.scrollTop() ) {
            $('body, html').animate({
                scrollTop: listContent.offset().top*$window.height()/$(document).height()
            });
        }

        return $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json', //receive
            contentType: 'json', //send
            data: JSON.stringify({}),
            success: function(data, status, jqXHR) {
                setTimeout(function() {
                    listContent
                        .html(data)
                        .removeClass('posts__list--inactive');
                    loading.addClass('posts__loading--hidden');

                    if ( success !== undefined ) { success(data, status, jqXHR); }
                }, new Date().valueOf() - timer >= 1000 ? 0 : 1000);

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
            var liIndexItem = '<li><a href="" class="pagination__index" data-index={ page } data-href="#!{ cate }?p={ page }" title="{ page }">{ page }</a></li>';

            //active tab
            $('#posts__tabs')
                .find('> li.active').removeClass('active').end()
                .find('a[data-cate=' + cate + ']').parent().addClass('active');

            $('.pagination__list').on('click', '.pagination__nav--disabled', function(e) {
                return false;
            });

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
                case 'gallery':
                    url = DnDMoM.config.galleryService;
                    break;
            }

            url = _parseVar_(url, { page: page });

            return _doFilterPosts_(
                url,
                function(data, status, jqXHR) {
                    var itemTotal = $('#itemTotal').val();
                    var itemPerPage = $('#itemPerPage').val();
                    var _defaultPagingDisplay = 5;
                    var pagingTotal = Math.ceil(itemTotal/itemPerPage);
                    var pagingDisplay = pagingTotal < _defaultPagingDisplay ? pagingTotal : _defaultPagingDisplay;

                    //generate indexes
                    var lisHTML = '';
                    $('.pagination__list a.pagination__index').parent().remove();

                    for ( var i= 1 ; i <= pagingDisplay; i++ ) {
                        lisHTML += _parseVar_( liIndexItem, { cate: cate, page: i } );
                    }

                    $('.pagination__list li:first-child').after( lisHTML );

                    lisHTML = '';
                    if ( pagingTotal > _defaultPagingDisplay ) {
                        if ( page >= pagingDisplay ) {
                            for ( var i=page-2; i < page+pagingDisplay-2; i++ ) {
                                lisHTML += _parseVar_( liIndexItem, { cate: cate, page: i } );
                            }
                        }
                        else {
                            for ( var i=0; i < pagingDisplay; i++ ) {
                                lisHTML += _parseVar_( liIndexItem, { cate: cate, page: (i+1) } );
                            }
                        }

                        $('.pagination__list a.pagination__index').parent().remove();
                        $('.pagination__list li:first-child').after( lisHTML );
                    }

                    //active page index
                    $('.pagination__list a.pagination__index')
                        .removeClass('pagination__index--active')
                        .filter('[data-index=' + page + ']').addClass('pagination__index--active');

                    //update pagination index
                    $('.pagination__list a.pagination__index').each(function() {
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
                            $this.toggleClass('pagination__nav--disabled', page == pagingTotal);
                        }
                    });
                }, //success
                function() {}, //error
                function() {} //completed
            );
        }
    }

    return {
        initMainNav: function() {
            //main navigation
            var mainNavList = $('#main-nav__list');
            mainNavList
                .on('click touchend', ' > li > a:not(.main-nav__has-sub)', function(e) {
                    if ( Modernizr.mq('only screen and (max-width: 666px)') ) {
                        $('#drawer-toggle').removeAttr('checked');
                    }
                    return true;
                })
                .on('click touchend', ' > li > ul a', function(e) {
                    e.stopPropagation();
                })
                .on('click touchend', ' > li > a.main-nav__has-sub', function(e) {
                    $('#main-nav__list > li > a.main-nav__has-sub.focus').not(this).removeClass('focus');
                    $(this).toggleClass('focus');
                    return false;
                });
            $(document).on('click', function(e) {
                $('#main-nav__list > li > a.main-nav__has-sub.focus').removeClass('focus');
            });

            //listen main nav change
            DnDMoM.sub('mainNav:changed', function(section, cate) {
                mainNavList.find('a.active').removeClass('active');
                mainNavList.find('a[href$="' + section + '.html#!' + cate + '?p=1"]').addClass('active');
            });

            //init state for reload page
            if ( mainNavList.find('a.active').length == 0 ) {
                var section = window.location.href.split('/').pop();
                var sectionRegExp = new RegExp('.html', 'g');
                if ( sectionRegExp.test(section) ) {
                    mainNavList.find('a[href*="' + section + '"]').addClass('active');
                }
                else {
                    mainNavList.find('a').eq(0).addClass('active');
                }
            }

            if ( Modernizr.mq('only screen and (max-width: 666px)' ) ) {
                $('#drawer-toggle').on('change', function() {
                    if ( $(this).is(':checked') ) {
                        $('#main-nav').show();
                    }
                    else {
                        setTimeout(function() {
                            $('#main-nav').hide();
                        }, 250);
                    }
                });
            }

            return mainNavList;
        },

        initImageSlider: function(selector) {
            var _disableFancyClick_ = function() { return false; }
            var fancylinks = $( selector + ' a.key-features__fancybox');
            if ( Modernizr.mq('only screen and (min-width: 667px)' ) ) {
                var _fancyOpts = {
                    helpers : {
                        overlay : {
                            locked : false // try changing to true and scrolling around the page
                        }
                    }
                }
                fancylinks.fancybox(_fancyOpts);
            }

            return $( selector ).swiper( $.extend(true, _options.swiper, {
                autoResize: false,
                onTouchMove: function(swiper, e, diff) {
                    if ( diff !== 0 ) {
                        if ( fancylinks.hasClass('key-features__fancybox--disabled') ) {
                            return false;
                        }
                        fancylinks.addClass('key-features__fancybox--disabled').on( 'click', _disableFancyClick_ );
                    }
                },
                onTouchEnd: function(swiper) {
                    setTimeout(function() {
                        fancylinks.off( 'click', _disableFancyClick_ );
                        fancylinks.removeClass('key-features__fancybox--disabled')
                    }, 1);
                }
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

                //active tab
                var url = $this.attr('href');
                control
                    .find('> li.active').removeClass('active').end()
                    .find('a[href="' + url + '"]').parent().addClass('active');

                //update view more posts href
                var viewMorePostsBtn = $('#posts__view-all');

                viewMorePostsBtn.attr( 'href', _parseVar_( viewMorePostsBtn.data('href'), { cate: $this.data('cate') } ) );

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
            if ( typeof hasher === 'undefined' ) { return false; }

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
            if ( typeof crossroads === 'undefined' ) { return false; }
            var blogrollAjax;
            //router for 'posts'
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
                    if ( blogrollAjax !== undefined ) { blogrollAjax.abort(); }
                    blogrollAjax = _hasherListener.blogroll( cate, parseInt(query.p) );
                    DnDMoM.pub( 'mainNav:changed', 'posts', cate );
                }
            });
            //=================

            //router for 'media'
            crossroads.addRoute('/media.html:?query:', function(query) {
                if ( query !== undefined ) {
                    var queryLocation = window.location.href.indexOf('?');
                    window.location = window.location.href.substr(0, queryLocation) + '#!all?' + $.param(query);
                }
                else {
                    hasher.setHash('all');
                }
            });
            crossroads.addRoute('/media.html#!{cate}:?query:', function(cate, query) {
                if ( query === undefined || query.p === undefined ) {
                    hasher.setHash(cate + '?p=1');
                }
                else {
                    if ( blogrollAjax !== undefined ) { blogrollAjax.abort(); }
                    blogrollAjax = _hasherListener.blogroll( cate, parseInt(query.p) );
                    blogrollAjax.success( function() {
                        var _fancyOpts = {
                            helpers : {
                                overlay : {
                                    locked : false // try changing to true and scrolling around the page
                                }
                            }
                        }
                        setTimeout(function () {
                            $('.gallery__list a.fancybox').fancybox(_fancyOpts);
                        }, 1000);
                    });

                    DnDMoM.pub( 'mainNav:changed', 'media', cate );
                }
            });
            //=================
        },

        initPopup : function(selector) {
            if ($(selector).length > 0) {
                $(selector).fancybox({
                    openEffect: 'elastic',
                    autoCenter: true,
                    padding: [7, 7, 7, 7],
                    helpers: {
                        title: {
                            type: 'inside'
                        },
                        media: {}
                    },
                    nextEffect: 'elastic',
                    prevEffect: 'elastic'
                });
            }
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
//pattern
Pattern.Mediator.installTo(DnDMoM);