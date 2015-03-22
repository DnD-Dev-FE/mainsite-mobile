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

        if ( $body.hasClass('homepage') ) {
            DnDMoM.setHeaderView();

            var video = $('#primary-banner__video')
            video.on('click', function() {
                var $parent = $(this).parent();
                if ( this.played.length > 0 && !this.paused ) {
                    this.pause();
                    $parent.addClass('video--paused');
                }
                else {
                    this.play();
                    $parent.removeClass('video--preloading').removeClass('video--paused');
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
        // var url = 'config/config.json?callback=?';
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

        $window.on('orientationchange', function(e) {
            if ( window.orientation == 0 ) { //portrait
            }
            else { //90(right) or -90(left)
            }
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
                        if ( e.coords.start.x <= $window.width()*.25 ) {
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

        initImageSlider: function(selector) {
            var _fn_ = function() {
                if ( DnDMoM.keyFeaturesSwiper instanceof Swiper ) {
                    DnDMoM.keyFeaturesSwiper = DnDMoM.destroySlider(DnDMoM.keyFeaturesSwiper);
                }
                var _disableFancyClick_ = function() { return false; }
                var fancylinks = $( selector + ' a.key-features__fancybox');
                // if ( Modernizr.mq('only screen and (min-width: 667px)' ) ) {
                //     var _fancyOpts = {
                //         helpers : {
                //             overlay : {
                //                 locked : false // try changing to true and scrolling around the page
                //             }
                //         },
                //         padding: 0
                //     }
                //     fancylinks.fancybox(_fancyOpts);
                // }
                // else {
                    //init gallery viewer for mobile
                    DnDMoM.initMobileGalleryViewer('#key-features .swiper-wrapper');
                // }

                //init swiper
                DnDMoM.keyFeaturesSwiper = new Swiper(selector, $.extend(true, {}, _options.swiper, {
                    autoResize: false,
                    resizeReInit: true,
                    slidesPerViewFit: true,
                    grabCursor: true,
                    slidesPerView: 'auto',
                    offsetPxBefore: Modernizr.mq('only screen and (min-width: 667px)' ) ? 0 : 15,
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

                //init control for swiper
                $('.key-features__control').on('click', function(e) {
                    return false;
                });
                $('.key-features__control--prev').on('click', function(e) {
                    DnDMoM.keyFeaturesSwiper.swipePrev();

                });
                $('.key-features__control--next').on('click', function(e) {
                    DnDMoM.keyFeaturesSwiper.swipeNext();
                });
            }
            $window.resize(function(e) { _fn_(); })
             _fn_();
        },

        initHotEventSlider: function(selector) { /* for smartphone */
            var _fn_ = function() {
                if ( DnDMoM.hotEvent instanceof Swiper ) {
                    DnDMoM.hotEvent = DnDMoM.destroySlider(DnDMoM.hotEvent);
                }
                if ( Modernizr.mq('only screen and (max-width: 666px)' ) ) {
                    if ( DnDMoM.hotEvent === undefined ) {
                        DnDMoM.hotEvent = (function() {
                            return new Swiper( '#hot-events__list', $.extend(true, {}, _options.swiper, {
                                slidesPerView: 'auto',
                                slideActiveClass: 'swiper-slide--active',
                                offsetPxBefore: Modernizr.mq('only screen and (min-width: 667px)' ) ? 0 : 15
                            }) );
                        })();
                    }
                }
                else {
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

            topButton.on('click', function(e) {
                $('body, html').stop(true, true).animate({
                    scrollTop: 0
                });
                return false;
            });
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
                    window.location = window.location.href.substr(0, queryLocation) + '#!gallery?' + $.param(query);
                }
                else {
                    hasher.setHash('gallery');
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
                        // var _fancyOpts = {
                        //     helpers : {
                        //         overlay : {
                        //             locked : false // try changing to true and scrolling around the page
                        //         }
                        //     },
                        //     padding: 0
                        // }
                        setTimeout(function () {
                            // if ( Modernizr.mq('only screen and (min-width: 667px)' ) ) {
                            //     $('.gallery__list a.fancybox').fancybox(_fancyOpts);
                            // }
                            // else {
                                DnDMoM.initMobileGalleryViewer('#posts__list.gallery__list');
                            // }
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

        initMobileGalleryViewer: function(selector) {
            var _options = {
                history: false,

                // Adds class pswp__ui--idle to pswp__ui element when mouse isn't moving for 4000ms
                timeToIdle: 0,

                // Same as above, but this timer applies when mouse leaves the window
                timeToIdleOutside: 500,

                // Delay until loading indicator is displayed
                loadingIndicatorDelay: 0,

                hideAnimationDuration: 0,

                showAnimationDuration: 0,

                preloaderEl: false,
            }

            // build items array
            var initPhotoSwipeFromDOM = function(gallerySelector) {

                // parse slide data (url, title, size ...) from DOM elements
                // (children of gallerySelector)
                var parseThumbnailElements = function(el) {
                    var thumbElements = $(el).find('.dndmom__photoswipe').toArray(),
                        numNodes = thumbElements.length,
                        items = [],
                        figureEl,
                        linkEl,
                        size,
                        item;

                    for (var i = 0; i < numNodes; i++) {
                        figureEl = thumbElements[i]; // <figure> element

                        // include only element nodes
                        if(figureEl.nodeType !== 1) {
                            continue;
                        }

                        linkEl = figureEl.children[0]; // <a> element

                        // size = linkEl.getAttribute('data-size').split('x');

                        // create slide object
                        item = {
                            src: linkEl.getAttribute('href'),
                            // w: parseInt(size[0], 10)
                            // h: parseInt(size[1], 10)
                        };

                        if (figureEl.children.length > 1) {
                            // <figcaption> content
                            item.title = figureEl.children[1].innerHTML;
                        }

                        if (linkEl.children.length > 0) {
                            // <img> thumbnail element, retrieving thumbnail url
                            item.msrc = linkEl.children[0].getAttribute('src');
                        }

                        item.el = figureEl; // save link to element for getThumbBoundsFn
                        items.push(item);
                    }

                    return items;
                };

                // find nearest parent element
                var closest = function closest(el, fn) {
                    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
                };

                // parse picture index and gallery index from URL (#&pid=1&gid=2)
                var photoswipeParseHash = function() {
                    var hash = window.location.hash.substring(1),
                    params = {};

                    if(hash.length < 5) {
                        return params;
                    }

                    var vars = hash.split('&');
                    for (var i = 0; i < vars.length; i++) {
                        if(!vars[i]) {
                            continue;
                        }
                        var pair = vars[i].split('=');
                        if(pair.length < 2) {
                            continue;
                        }
                        params[pair[0]] = pair[1];
                    }

                    if(params.gid) {
                        params.gid = parseInt(params.gid, 10);
                    }

                    if(!params.hasOwnProperty('pid')) {
                        return params;
                    }
                    params.pid = parseInt(params.pid, 10);
                    return params;
                };

                var openPhotoSwipe = function(index, galleryElement) {
                    var pswpElement = document.querySelectorAll('.pswp')[0],
                        gallery,
                        options,
                        items;

                    items = parseThumbnailElements(galleryElement);

                    // define options (if needed)
                    options = $.extend(true, _options, {
                        index: index,

                        // define gallery index (for URL)
                        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                        getThumbBoundsFn: function(index) {
                            // See Options -> getThumbBoundsFn section of documentation for more info
                            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();

                            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                        }
                    });

                    // Pass data to PhotoSwipe and initialize it
                    var loaded = 0;
                    $.each(items, function() {
                        var $this = this;
                        var img = new Image();
                        img.onload = function(e) {
                            $this.w = img.width;
                            $this.h = img.height;
                            loaded++;
                        }
                        img.src = $this.src;
                    });
                    var intv = setInterval(function() {
                        if ( loaded == items.length ) {
                            clearInterval(intv);
                            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

                            gallery.listen('imageLoadComplete', function(index, item) {
                                $('.dndmom__photoswipe--loading').removeClass('dndmom__photoswipe--loading');
                            });
                            gallery.listen('close unbindEvents', function(index, item) {
                                $( pswpElement ).removeAttr('class').addClass('pswp');
                            });

                            gallery.init();
                        }
                    }, 500);
                };

                // loop through all gallery elements and bind events
                var galleryElements = document.querySelectorAll( gallerySelector );

                for (var i = 0, l = galleryElements.length; i < l; i++) {
                    galleryElements[i].setAttribute('data-pswp-uid', i+1);
                    $(galleryElements[i]).on( 'click', '.dndmom__photoswipe', function(e) {
                        var $this = $(this).addClass('dndmom__photoswipe--loading');
                        openPhotoSwipe( $this.prevAll('.dndmom__photoswipe').length, $this.parent().get(0) );
                        return false;
                    });
                }

                // Parse URL and open gallery if it contains #&pid=3&gid=1
                var hashData = photoswipeParseHash();
                if ( hashData.pid > 0 && hashData.gid > 0 ) {
                    openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ] );
                }
            };

            // execute above function
            initPhotoSwipeFromDOM(selector);

            //init video viewer
            $('.fancybox').on('click', function(e) {
                var $this = $(this);
                var modal;
                if ( $this.hasClass('fancybox.iframe')
                    && !$this.hasClass('key-features__fancybox--disabled')
                ) {
                    modal = $('<div class="dndmom__modal"><a href="#" title="Close">Close</a></div>');
                    var iframe = $('<iframe src="' + $this.attr('href') + '"></iframe>');
                    $('body').append( modal.append( iframe ) );

                    $('.dndmom__modal > a').on('click', function(e) {
                        e.preventDefault();
                        if ( modal !== undefined ) {
                            modal.fadeOut().remove();
                        }
                    });
                    return false;
                }
            });
        },

        destroySlider:  function(object) {
            if ( object !== undefined ) {
                // destroy and delete swiper object
                var container = $( object.container );
                container.find('*').stop(true, true).removeAttr('style');
                object.destroy();
                return undefined;
            }
        },

        setHeaderView: function() {
            var _fn_ = function() {
                if ( Modernizr.mq( 'only screen and (max-width: 667px)' ) ) {
                    var primaryBanner = $('#primary-banner');
                    primaryBanner.css({
                        height: $(window).height() - $('.app-info').eq(0).height() - primaryBanner.offset().top
                    });
                }
            }
            $(window).on('resize', _fn_);
            _fn_();
        }
    }
})(jQuery);
//pattern
Pattern.Mediator.installTo(DnDMoM);