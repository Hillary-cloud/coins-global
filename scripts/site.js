// site.js
// Dean Bailes, 10th December 2013
var jqueryPopupRemoveScrollbars = false;
var removeScrollbars = false;
var n_windowHeight = $(window).height();
var n_windowWidth = $(window).width();
cp_popupFormsHintyOn = true;
cp_popupRcApplyTitle = '<h3>Apply</h3>';
cp_popupRcApplyConfirm = "Send";
cp_RcApplyCvfileTitle = "Attach CV";
var iScrollTo = null;
var $frame;
var landing_form_id = null;

frameMax = $('body.hs-content-id-5022846044.hs-landing-page.hs-page').height();

$(function() {
  var loc = window.location.href; // returns the full URL
    if (/services/.test(loc)) {
        $('.pagetopMenuItemCpiId1997').addClass('on');
    } else if (/videos/.test(loc)) {
        $('.pagetopMenuItemCpiId2469').addClass('on');
    } else if (/software/.test(loc)) {
        $('.pagetopMenuItemCpiId47').addClass('on');
    } else if (/company/.test(loc) || /team-members/.test(loc)) {
        $('.pagetopMenuItemCpiId1940').addClass('on');
    } else if ($("ul.pageTopDivMenu li.on").length === 0 ) {
        $('.pagetopMenuItemCpiId21').addClass('on');
    }

    $('[data-reveal-content-id]').hide(0);
    $('[data-reveal-click-id]').addClass('revealClick').click(function(){

        var reveal_id = $(this).data("reveal-click-id");
        $(this).toggleClass('open');
        $('[data-reveal-content-id="'+reveal_id+'"]').toggle(0);

    });
});

$(document).ready(function(e) {
    // New ca login variables
    new_ca_login_forgot_password_title = "Password Reset";
    new_ca_login_forgot_password_submit_btn_text = "Submit";
    new_ca_login_forgot_password_toggle_btn_text = "Back to login";
    new_ca_login_login_title = "Client Area";
    new_ca_login_login_submit_btn_text = "Login";
    new_ca_login_login_toggle_btn_text = "Forgot Password?";

    accordion_menu();
     $('.policyItem a').addClass('lineEx');
        if(CPI_ID == 2857) {

    }

    // if($(".features_box").length > 0) {
    //     solutions_features();
    // }

    $("<span></span>").prependTo(".btn.cpFormSubmit");
    $(".btn.cpFormSubmit").addClass("bub");
        $('.GlobalLocationsMap').appendTo('.mainGraphic');

    if(CPI_ID == 1938 || CPI_ID == 1939) {
        $('.OfficeDetails .Office .mapPin').appendTo('.officeLocations');
        if (mobile || tablet) {
            $("svg#mapOutline ").css('opacity', '1');
            mapPinFade();
        } else {
            $("svg#mapOutline ").css('opacity', '1');
            new Vivus('mapOutline', {type: 'async', duration: 30, start: 'autostart'}, mapPinFade);
        }
    }

    $('.btnNew.bub').each(function() {
        var $this = $(this);
        if ($(".btnNew.bub:not(:has(span))")) {
            $("<span></span>").appendTo($this);
        }
    });

    function mapPinFade() {
        $('.officeLocations').find('.mapPin').each(function(i) {
            var $this = $(this);
                setTimeout(function(){ $this.css('opacity', '1'); }, 120 + (i * 170) - (30 * i));
        });
    }

    // $('input').hinty();
    quoteHeight();
    $('.teamBio p').addClass('fd');
    if(mobile || tablet) {
        // mobileVideoPlay();
        $('.footLogo.fd, .socialIcons.fd, .credit li a, .teamPortrait .fd').addClass('vis');
    }

    $('.latestVideo').each(function(){
        doBackstretch($(this));
    });

    // IFRAME RESIZE
    if (CPI_ID == 2001) {
        if ($("#iframeHeight").length > 0) {
            $('#iframeHeight').iFrameResize({checkOrigin: false});
        }
    }

    initialiseDocument();
    if (mobile || tablet) {
        initiateSlideMenu();
            FastClick.attach(document.body);
    }

    if (CPI_ID == 50) {
        initFormStyles();
    }
    else if (CPI_ID == 2227) {
        $('#productListing').appendTo('#productListingWrapper');
    }

    if (!mobile) {
        setTimeout(fixSiteFooter, 300);
        $(window).resize(fixSiteFooter);
    }
    if (CPI_ID == 2470) {

        if ($('.hooperContentBg').width < 0) {
            spotlightBGCalc();
            $(window).resize(spotlightBGCalc);
        }
    }
    if (CPI_ID == 2626) {
        // LANDING PAGE
        $("#CaseStudies").click(function() {
            $('html, body').animate({
                scrollTop: $("#caseAn").offset().top - 150
            }, 2000);
        });

        $("#Contact").click(function() {
            $('html, body').animate({
                scrollTop: $("#contAn").offset().top - 150
            }, 2000);
        });

        $("#Overview").click(function() {
            $('html, body').animate({
                scrollTop: $("div#scroller-anchor").offset().top
            }, 1800);
        });

        moveScroller();
    }

    // APRIL 17 HOMEPAGE STUFF
        positionAware();
        $(".scrollMe").click(function() {
            if ($('.blackStrip')[0]) {
                $('html,body').animate({
                    scrollTop: $(".blackStrip").offset().top
                },2000, "easeOutExpo");
            }  else {
                $('html,body').stop(true,false).animate({scrollTop : $(window).height()}, 'slow');
            }
        });

        if (!mobile && !tablet) {
            corePointHeight();
            if (!checkBelowIE(9)) {
                $(window).scroll(fixMenu);
            }
            if ($("ul.pageTopDivMenu li.on").length > 0 ) {
                menuNavMove();
            }
            funkySearch();
        }
        if (mobile) {
            $('.contCol.left.mainHead.fd, .contCol .btnWrap.fd').addClass('vis');
        }
        SVGDraw();
        // ANIMATE BOXES UP
        animateOnScroll(40);
        // Animate the elements in in scroll
        $(document).scroll(function(){
            if(!firstScroll) {
                firstScroll = true;
            }
            animateOnScroll(40);
        });

        $(".discover").click(function() {
            $('html,body').animate({
                scrollTop: $(".NewsFeedWrap").offset().top
            },2000, "easeOutExpo");
        });


        // PARRALAX
        if (!mobile && !checkBelowIE(9) || screen.width > 1024) {
          // cp_addScrollParallax($('.Background'), {"margin-top": "10px"}, {"margin-top": "80px"});
        }
        if ($(".generalSlider").length > 0) {
            $('.generalSlider').slick({
              centerMode: true,
              infinite: true,
              centerPadding: '100px',
              slidesToShow: 1,
              speed:2000,
              swipe:false,
              pause: 5000,
              autoplay: true,
              easing: 'easeInOutExpo',
              arrows: false,
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    centerMode: false,
                    arrows: false,
                    slidesToShow: 1
                  }
                }
              ]
            });
        }
        // TESTIMONIAL

        if(CPI_ID == 21){
            $("#testimonialSlider").flickity({
                cellAlign: 'left',
                contain: false,
                pageDots: false,
                wrapAround: true,
                fade: true,
                autoPlay: 15000,
                selectedAttraction: 0.01,
                friction: 0.4,
                draggable: false,
                prevNextButtons: false,
                // arrowShape: {
                //     x0: 30,
                //     x1: 60, y1: 35,
                //     x2: 65, y2: 30,
                //     x3: 40
                // },
                groupCells: false,
                imagesLoaded: true
            });
        } else {
            $("#testimonialSlider").lightSlider({
                item:1,
                thumbItem:9,
                slideMargin: 200,
                mode: "fade",
                speed:2000,
                auto:true,
                pause: 5000,
                loop:true,
                enableDrag:false,
                enableTouch: true,
                pager: true,
                gallery:false,
                pauseOnHover: false,
            });
        }
        // CUSTOMERS
        $("#customersSlider").lightSlider({
            item:4,
            thumbItem:9,
            slideMargin: 20,
            mode: "slide",
            speed:2000,
            auto:true,
            pause: 5000,
            loop:true,
            enableDrag:false,
            enableTouch: true,
            pager: true,
            gallery:false,
            pauseOnHover: false,
            responsive : [
                {
                    breakpoint:1000,
                    settings: {
                        item:3,
                        slideMove:1
                      }
                },
                {
                    breakpoint:790,
                    settings: {
                        item:2,
                        slideMargin:20,
                        slideMove:1
                      }
                },
                {
                    breakpoint:660,
                    settings: {
                        item:1,
                        slideMargin:25,
                        slideMove:1
                      }
                }
            ]
        });
        // PARTNERS/AWARDS
        $("#partnersSlider").lightSlider({
            item:4,
            thumbItem:9,
            slideMargin: 20,
            mode: "slide",
            speed:2000,
            auto:true,
            pause: 5000,
            loop:true,
            enableDrag:false,
            enableTouch: true,
            pager: true,
            gallery:false,
            pauseOnHover: false,
            responsive : [
            {
                breakpoint:1000,
                settings: {
                    item:3,
                    slideMove:1
                  }
            },
            {
                breakpoint:790,
                settings: {
                    item:2,
                    slideMargin:20,
                    slideMove:1
                  }
            },
            {
                breakpoint:660,
                settings: {
                    item:1,
                    slideMargin:25,
                    slideMove:1
                  }
            }
        ]
        });

        // Client Area November 2017
        if(CPI_ID == 1969 || CPI_ID == 3742) {
            $('#categoryDropdown').change(function() {
                if($(this).val() != "")
                {
                    window.location = $(this).val();
                }
            });
        }

        init_form_links();
        init_floating_form();
        init_blog_functions();
        init_horizontal_galleries();
        init_drag_sliders();
        init_equal_heights();
        init_equal_heights_once();
        $(window).resize(init_equal_heights);
        init_galleries();
        init_mobile_menu();
        init_edit_content_videos();
        init_case_study_slider();
        setTimeout(function(){
            init_follow_on_scroll();
        }, 500);

});

function mobileVideoPlay() {
    $('[href^="javascript:launchVideo"], [href^="javascript:newLaunchVideo"]').each(function(){

        var href = $(this).attr("href");
        var regex = new RegExp(/((http|https):)?\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
        var vimeoURL = regex.exec(href)[0];

        vimeoURL = vimeoURL.replace("http:", "https:");
        vimeoURL = addParameter(vimeoURL, "autoplay", "");

        var $thisParent = $(this).parent();

        if ($thisParent.is('.playVid') && !$thisParent.is('.latestVideo')) {
            $thisParent.remove();
        }
        else if(!$thisParent.is('.latestVideo'))
        {

            if($thisParent.is('.contColInner.video') || $thisParent.is('.latestVideo'))
            {
                $thisParent.css('background-image', 'none').css('background', '');
                $thisParent.find('.overlay').remove();
            }

            var $videoWrapper = $(this);
            if($thisParent.is('.video-re-size'))
            {
                $videoWrapper = $thisParent;
            }

            var $newVimeoIframe = $('<div class="inlineMobileVimeoWrapper"><iframe style="vertical-align:top;" src="' + vimeoURL + '" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>').insertAfter($videoWrapper);

            $videoWrapper.remove();
        }

    });
}

function corePointHeight() {
    var highest = null;
    var hi = 0;
    $("ul.corePoints li").each(function(){
        var h = $(this).height();
        if(h > hi) {
            hi = h;
            highest = $(this).height();
        }
      $(this).css( "height",  highest + 15);
    });
}

function quoteHeight() {
    var quoteInnerheight = $('.QuoteSlider').height();
    $('.spotlightWrapper .strip .inner').css('height', quoteInnerheight);
}

function fixMenu(e) {
    if ($(window).scrollTop() > 103) {
        $('.menuWrap').addClass('fixHead');
        $('.menuInnerGhost').addClass('fakeIt');
    }
    else{
        $('.menuWrap').removeClass('fixHead');
        $('.menuInnerGhost').removeClass('fakeIt');
    }
}

function newLaunchVideo(pcVideoURL, pcVideoTitle) {
    var timeTag;
    // console.log("currentTime: " , currentTime);
    // if (currentTime != null) {
    //  var timeTag = '#t='+currentTime;
    // }
    console.log("pcVideoURL: ", pcVideoURL);
    console.log("pcVideoTitle: ", pcVideoTitle);
    var cPopupHTML =
        '<div class="popupWindow videoPlayer" id="popupWindow">' +
        '   <div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3 class="popupTitle">' + decodeURIComponent(pcVideoTitle) + '</h3><div style="clear:both;"></div></div>' +
        '   <div class="popupWindowBody video" id="popupWindowBody">' +
        '       <iframe style="vertical-align:top;" src="' + pcVideoURL + '?autoplay=1" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe>' +
        '   <div style="clear:both;"></div>' +
        '   </div>' +
        '   <div class="popupWindowFooter"></div>' +
        '</div>';
    createJQueryPopup( cPopupHTML, null, true, true);
    $('#popupCloseBtn').click(hidePopup);
}

    // SVG HOVER
    function SVGDraw() {
    // if ($("div.sectorLinks").length > 0) {
        window.secListObj = [];
        $(".benefitIcon").each(function(){
            if (Modernizr.Detectizr.browser.engine == "webkit" || (Modernizr.Detectizr.browser.name != "edge" && Modernizr.Detectizr.browser.name != "ie")) {
                $(".eachBenefit .benefitIcon svg").each(function(i){

                    $(this).css({opacity: 1});
                    window.secListObj[i] = new Vivus($(this)[0], {type: 'oneByOne', duration: 100});

                    $(this).closest(".eachBenefit").on("mouseenter", function() {
                        $(this).addClass('strokeOrange');
                        window.secListObj[i - 1].reset().play(2);
                    })
                    .on("mouseleave", function() {
                        $(this).removeClass('strokeOrange');
                        window.secListObj[i - 1].reset().play(2);
                    });
                    i++;
                });
            }
        });
    }

    var $animateOnScrollArray = $('.fd');
    var $window = $(window);
    var windowHeight = $window.height();
    var removeArray = new Array();
    var firstScroll = false;

    $window.resize(function(){
        windowHeight = $window.height();
    });

    function animateOnScroll(testOffset) {
        $animateOnScrollArray = $('.fd');
        if($animateOnScrollArray.length > 0) {
            $animateOnScrollArray.each(function(index){
                var $tempElement = $(this);
                if($tempElement.offset().top + testOffset < parseInt($window.scrollTop() + windowHeight))
                {
                    $tempElement.addClass('vis');
                }
            });
        }
    }

    function positionAware() {
        $('.bub').on('mouseenter', function(e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX})
          })
          .on('mouseout', function(e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX})
          });
        $('[href=#]').click(function(){return false});
    }


    function funkySearch() {
        var searchField = $('.search');
        var searchInput = $("input[type='text']");

        var checkSearch = function(){
            var contents = searchInput.val();
            if(contents.length !== 0){
               searchField.addClass('full');
            } else {
               searchField.removeClass('full');
            }
        };

        $(".searchWrap input[type='text']").focus(function(){
            searchField.addClass('isActive');
          }).blur(function(){
            searchField.removeClass('isActive');
            checkSearch();
        });
    }

    function menuNavMove() {
        var $el, leftPos, newWidth, resetMagicLine,
            $mainNav = $("ul.pageTopDivMenu");


        $mainNav.append("<div id='magic-line'></div>");
        var $magicLine = $("#magic-line");

        $magicLine
            .width($mainNav.find("li.on").width() - 18)
            .css("left", $mainNav.find("li.on a").position().left + 9)
            .data("origLeft", $magicLine.position().left)
            .data("origWidth", $magicLine.width());

        $(document).scroll(function(){
            $magicLine
                .width($mainNav.find("li.on").width() - 18)
                .css("left", $mainNav.find("li.on a").position().left + 9)
                .data("origLeft", $magicLine.position().left)
                .data("origWidth", $magicLine.width());
        });

        $mainNav.find("li a").hover(function() {
            clearTimeout(resetMagicLine);
            $el = $(this);
            leftPos = $el.position().left + 9;
            newWidth = $el.parent().width() - 18;
            $magicLine.stop().animate({
                left: leftPos,
                width: newWidth
            });

        }, function() {
            resetMagicLine = setTimeout(function(){
                $magicLine.stop().animate({
                    left: $magicLine.data("origLeft"),
                    width: $magicLine.data("origWidth")
                });
            }, 300);
        });

        $(".submenu").hover(function() {
            clearTimeout(resetMagicLine);
            var submenu_id = this.id.split("submenu")[1];
            $el = $mainNav.find('.pagetopMenuItemCpiId'+submenu_id).find('a');
            leftPos = $el.position().left + 9;
            newWidth = $el.parent().width() - 18;
            $magicLine.stop().animate({
                left: leftPos,
                width: newWidth
            });

        }, function() {
            resetMagicLine = setTimeout(function(){
                $magicLine.stop().animate({
                    left: $magicLine.data("origLeft"),
                    width: $magicLine.data("origWidth")
                });
            }, 300);
        });
    }

// STICKY MENU
function moveScroller() {
    var $anchor = $("#scroller-anchor");
    var $scroller = $('#scroller');

    var move = function() {
        var st = $(window).scrollTop();
        var ot = $anchor.offset().top;
        if(st > ot) {
            $scroller.addClass('sticky');
        } else {
            if(st <= ot) {
                $scroller.removeClass('sticky');
            }
        }
    };
    $(window).scroll(move);
    move();
}
function cp_applyFormSuccessCallback() {
    cp_popupShowOkPopup("Apply", "<p>Your information has been submitted successfully.</p><p>Thank you for your interest in employment possibilities with COINS.</p><p>We are currently evaluating our needs and reviewing queries like yours. Should we decide there is a match between our hiring needs and your experience and qualifications, you will be contacted.</p><p>Thanks again for your interest in COINS.</p><p>COINS Human Resources</p>", true, null, "Close");
}

function spotlightBGCalc() {

    var offsetTop = $(".hooperContentBg").offset().top;

    var headerHeight = $(".header").outerHeight() + $(".languagePicker").outerHeight();
    var footerHeight = $(".siteFooterWrapper").outerHeight();
    var siteMiddle = $(".siteMiddleInner").outerHeight();
    var siteContainer = $(".siteContainer").outerHeight();
    $(".hooperContentBg").height(siteContainer - 815 - footerHeight - headerHeight);
}

// --- Initialisation Scripts ---
    function initialiseDocument() {
        initialiseMiniMenu();
        submenuInit("10", "0", "200");

        // if ($('#syu_username').length > 0) {
        //     $('#syu_username, #syu_passwd').keypress(function(e) {
        //     if(e.which == 13) { $('#cp_siteSearchform').submit(); }
        //     });
        // }

        // $('.hinty').hinty();

        if ($('body.clientArea')[0]) {
        //     $('.sidebarWrapper').addClass('parallax').data('parallaxMethod','follow');
            initialiseClientArea();
        }

        if ($('.parallax').length != 0 && !(mobile))  {
            parallaxEffects();
            $(window).scroll(parallaxEffects);
            // $('html').on('mousewheel', function(event) {
            //         event.preventDefault();
            //         if (iScrollTo == null)
            //             iScrollTo = $(window).scrollTop() + (event.deltaY * event.deltaFactor * -1);
            //         else
            //             iScrollTo = iScrollTo + (event.deltaY * event.deltaFactor * -1);
            //         $('html,body').stop(true,false).animate({scrollTop : iScrollTo}, 'fast', function() {iScrollTo = null;});
            //     }
            // );
        }

        initialiseSliders();

        $('.contentTop button.More, button.CurrentVacancies, .bub.more').click(function() {
            if ($('.blackStrip')[0]) {
            $('html,body').animate({
                scrollTop: $(".blackStrip").offset().top
            },2000, "easeOutExpo");
             }
            else {
                $('html,body').stop(true,false).animate({scrollTop : $(window).height()}, 'slow');
            }
        });

        initialiseVideoLinks();

        $('button.RequestAccess').click(function() {
            requestClientAreaAccess();
            $('html,body').animate({
                scrollTop: $("div#popupWindow").offset().top - 40
            },800, "easeOutExpo");

        });

        if (CPI_ID != 2470) {
            // $('.customTooltip').hover(tooltipHoverOn,tooltipHoverOff);
        }
    }

    function initialiseClientArea() {
        $('ul.sidebarContentList li.open.hasChildren').prepend('<a class="expander" style="float:right; cursor:pointer;">-</a>');
        $('a.expander').click(expandClientMenu);
        $('ul.sidebarContentList li.open:not(.on):not(:first) a.expander').click();
    }

    function expandClientMenu() {
        $(this).text(($(this).text() == "+") ? "-" : "+");
        var $parent = $(this).parent();
        $parent.next().stop().slideToggle();
    }

    var fixSiteFooter = function()  {
        n_windowHeight = $(window).height();
        n_windowWidth = $(window).width();
        // $('.siteFooterWrapper').insertAfter(".siteContainer");
        $('.siteFooterWrapper').removeClass('fixed');

        if ($(window).height() > $('body').height())
            $('.siteFooterWrapper').addClass('fixed');
    }

    var initiateSlideMenu = function(){
        $('body').prepend('<div class="fullSizeMenuWrapper"></div>');
        $('.pagetopSlideMenuWrapper').prependTo('body');
        $('.menuSlideBtn').click(showSideMenu);
        $('.expandArrowWrapper.show').click(showSecondLevelMenu);
        $('.expandArrow.back').click(hideSecondLevelMenu);

        // $( "body" ).wrapInner( "<div class='bodyInner'></div>");
    }

    var showSideMenu = function(){
        $('.fullSizeMenuWrapper, .pagetopSlideMenuWrapper').addClass('open');
        $('.menuSlideBtn').addClass('open').unbind('click');
        $('.menuSlideBtn, .fullSizeMenuWrapper').click(hideSideMenu);
        $('body, html, .bodyInner').css({overflow: 'hidden', height: n_windowHeight});
    }

    var showSecondLevelMenu = function() {
        if ($(this).closest('div.pagetopSlideMenuCol').hasClass('top')) {
            var menuNum = parseInt($(this).parent().attr('class').split('pagetopSlideItem row').join(''));
            // console.log("menuNum: " + menuNum);
            $('.pagetopSlideMenuRow, ul.secondLevel').removeClass('open');
            $('.second, .second .row'+menuNum).addClass('open');
        }
        else if ($(this).closest('div.pagetopSlideMenuCol').hasClass('second')) {
            var menuNum = parseInt($(this).parent().attr('class').split('pagetopSlideItem row').join(''));
            var parentNum = parseInt($(this).parent().parent().parent().attr('class').split('pagetopSlideMenuRow row').join(''));
            // console.log("menuNum: " + menuNum);
            // console.log("parentNum: " + parentNum);
            $('.third .pagetopSlideMenuRow, ul.thirdLevel').removeClass('open');
            $('.third, .third .row'+menuNum+', .row'+parentNum).addClass('open');
        }
    }


    var hideSecondLevelMenu = function(){

        if ($(this).closest('div.pagetopSlideMenuCol').hasClass('second')) {
            $('.second').removeClass('open');
        }
        else if ($(this).closest('div.pagetopSlideMenuCol').hasClass('third')) {
            $('.third').removeClass('open');
        }
    }

    var hideSideMenu = function(){
        $('.fullSizeMenuWrapper, .pagetopSlideMenuWrapper').removeClass('open');
        $('.menuSlideBtn').removeClass('open').unbind('click');
        $('.menuSlideBtn').click(showSideMenu);
        $('body, html, .bodyInner').css({overflow: 'visible', height: 'auto'});
    }

    function initialiseMegaMenus() {
        $('ul.pageTopDivMenu li a').mouseenter(showMegaMenu);
        $('ul.pageTopDivMenu li a').mouseleave(cancelShowMegaMenu);
        $('.siteContentContainer, .header .headerRight, .workWrapper, .pageTeamDetail').mouseenter(hideMegaMenu);
    }

    function showMegaMenu(e) {
        $('.megaMenuContents').stop(true,true).fadeOut(0);
        var megaMenuName = $(this).text();
        var $megaMenuContents = $('.megaMenuContents[data-linked-menu="' + megaMenuName + '"]');
        if ($megaMenuContents[0]) {
            $('.megaMenu').stop(true,true).fadeIn('fast');
            $megaMenuContents.stop(true,true).fadeIn('fast');
        }
        else {
            hideMegaMenu(e);
        }
    }

    function cancelShowMegaMenu(e) {

    }

    function hideMegaMenu(e) {
        $('.megaMenuContents, .megaMenu').stop(true,true).fadeOut('fast');
    }

    function initialiseMiniMenu() {
        if (CPI_ID != 2626 ) $(window).scroll(scrollMiniMenu);
    }

    function scrollMiniMenu(e) {
        if ($(window).scrollTop() > 25)
            $('.header, body').addClass('sticky');
        else
            $('.header, body').removeClass('sticky');

        // if ($(window).scrollTop() > 525)
        //     $('.landingSubMen.stick, body').addClass('sticky');
        // else
        //     $('.landingSubMen.stick, body').removeClass('sticky');
    }

    var currentQuote = 0;
    var totalQuotes = 0;
    var toNextQuote = null;
    var iQuoteJump = 1;
    function initialiseSliders() {
        $('.FeaturedCustomers button.next').click(function() {sliderNext('.CustomersSlider','.CustomersWrapper .Customer');});
        $('.FeaturedCustomers button.prev').click(function() {sliderPrev('.CustomersSlider','.CustomersWrapper .Customer');});
        $('.Partners button.next').click(function() {sliderNext('.PartnersSlider','.PartnersWrapper .Partner');});
        $('.Partners button.prev').click(function() {sliderPrev('.PartnersSlider','.PartnersWrapper .Partner');});
        $('.strip.Quotes button.next').click(sliderNextQuote);
        $('.strip.Quotes button.prev').click(sliderPrevQuote);
        $('.strip.Quotes').each(function(index, element) {
            var iBgLeftOffset = 0; //($('.strip.Quotes .Quote').length - 1) * 20 * -1;
            $(this)
                .css('backgroundPosition', iBgLeftOffset + 'px top')
                .animate({bgLeftOffset : iBgLeftOffset }, 0)
                .data('bgLeftOffset', iBgLeftOffset);

            schedNextQuote();
        });
        totalQuotes = $('.strip.Quotes .Quote').length;
    }

    function sliderNext(pjSlider, pjObjects) {
        var $Slider = $(pjSlider);
        var scrollLeft = (typeof $Slider.data('slideTo') != 'undefined') ? parseInt($Slider.data('slideTo')) : $Slider.scrollLeft();
        var nextPos = scrollLeft + $Slider.width();

        if (nextPos > $Slider[0].scrollWidth) return false;
        if (nextPos > $Slider[0].scrollWidth) nextPos = $Slider[0].scrollWidth;

        $(pjObjects).each(function(index, element) {
            if ($(this).position().left < nextPos && $(this).position().left + $(this).width() > nextPos) {
                nextPos = $(this).position().left;
                return;
            }
        });

        $Slider.data('slideTo', nextPos);
        $Slider.stop(true).animate({ scrollLeft : nextPos }, 'slow' );

        return true;
    }

    function sliderPrev(pjSlider, pjObjects) {
        var $Slider = $(pjSlider);
        var scrollLeft = (typeof $Slider.data('slideTo') != 'undefined') ? parseInt($Slider.data('slideTo')) : $Slider.scrollLeft();
        var nextPos = scrollLeft - $Slider.width();

        if (nextPos < 0) nextPos = 0;

        $(pjObjects).each(function(index, element) {
            if ($(this).position().left < $Slider.scrollLeft() && $(this).position().left + $(this).width() > $Slider.scrollLeft()) {
                nextPos = $(this).position().left + $(this).width() - $Slider.width();
            }
        });

        $Slider.data('slideTo', nextPos);
        $Slider.stop(true).animate({ scrollLeft : nextPos }, 'slow' );

        return true;
    }

    function autoNextQuote() {
        toNextQuote = null;

        if (iQuoteJump == 1 && currentQuote == totalQuotes - 1)
            iQuoteJump = -1;
        else
            if (iQuoteJump == -1 && currentQuote == 0)
                iQuoteJump = 1;

        if (iQuoteJump ==  1) $('.strip.Quotes button.next').click();
        else
        if (iQuoteJump == -1) $('.strip.Quotes button.prev').click();

        schedNextQuote();
    }

    function schedNextQuote() {
        if (toNextQuote != null) clearTimeout(toNextQuote);
        toNextQuote = setTimeout(autoNextQuote, 10000);
    }

    function sliderNextQuote(e) {
        if ($('.QuoteWrapper .Quote.shown + .Quote').length == 0) return false;

        schedNextQuote();

        $ShownQuote = $('.QuoteWrapper .Quote.shown');

        if (typeof $ShownQuote.css('marginLeft') == 'undefined') $ShownQuote.css({marginLeft: "0%"});
        $ShownQuote.stop().animate({marginLeft: "-101%"}, 900, 'easeInCubic', function() {
            $NextQuote = $('.QuoteWrapper .Quote.shown + .Quote').first();
            $ShownQuote.removeClass('shown');
            $NextQuote.css({marginLeft: "101%"});
            $NextQuote.addClass('shown');
            $NextQuote.stop().animate({marginLeft: "0%"}, 900, 'easeOutExpo');
        });

        var curBgLeftOffset = parseInt($('.strip.Quotes').data('bgLeftOffset'));
        var newBgLeftOffset = curBgLeftOffset - 80;

        $('.strip.Quotes')
            .stop()
            .animate( { bgLeftOffset : newBgLeftOffset }, { duration: 1800 , easing: 'easeInOutCubic' , step: function(now, fx) { $(this).css({backgroundPosition : now + 'px top'}); } } )
            .data('bgLeftOffset', newBgLeftOffset);

        currentQuote = currentQuote + 1;

        return true;
    }

    function sliderPrevQuote(e) {
        if ($('.QuoteWrapper .Quote:not(.shown) + .Quote.shown').length == 0) return false;

        schedNextQuote();

        $ShownQuote = $('.QuoteWrapper .Quote.shown');

        if (typeof $ShownQuote.css('marginLeft') == 'undefined') $ShownQuote.css({marginLeft: "0%"});
        $ShownQuote.stop().animate({marginLeft: "101%"}, 900, 'easeInCubic', function() {
            $NextQuote = $('.QuoteWrapper .Quote.shown').prev();
            $ShownQuote.removeClass('shown');
            $NextQuote.css({marginLeft: "-101%"});
            $NextQuote.addClass('shown');
            $NextQuote.stop().animate({marginLeft: "0%"}, 900, 'easeOutExpo');
        });

        var curBgLeftOffset = parseInt($('.strip.Quotes').data('bgLeftOffset'));
        var newBgLeftOffset = curBgLeftOffset + 80;

        $('.strip.Quotes')
            .stop()
            .animate( { bgLeftOffset : newBgLeftOffset }, { duration: 1800 , easing: 'easeInOutCubic' , step: function(now, fx) { $(this).css({backgroundPosition : now + 'px top'}); } } )
            .data('bgLeftOffset', newBgLeftOffset);

        currentQuote = currentQuote - 1;

        return true;
    }
// ---

// --- Common functions ---
    function panelBackgroundStretch() {
        $('.panel').each(function() {
            doBackstretch($(this));
        });
    }

    function scrollToTop() {
         $('html,body').animate({scrollTop: 0}, 500, 'swing');
    }

    function reformatCPPage() {
        // Modifies control panel page formats/layouts in a consistent manner

        // Remove un-necessary anchors from the header
        $('.siteContentContainer > a').hide();
    }

    function parallaxEffects() {
        $('.parallax').each(function(index, element) {
            cp_addScrollParallax($(this),{"background-position-y": "-80px"},{"background-position-y": "250px"});
            // var iObjectTop   = $(this).offset().top;
            // var iPageTop     = $(window).scrollTop();
            // var iWinHeight   = $(window).height();
            // var iObjHeight   = $(this).height();
            // var iScrollDiff = iObjectTop - iPageTop;
            // var cParallaxMethod = (typeof $(this).data('parallaxMethod') == 'undefined') ? "background" : $(this).data('parallaxMethod');

            // if (cParallaxMethod == "background") {
            //     // Standard background image parallaxing
            //     var iEffect      = 0 - (iScrollDiff * 0.5);

            //     if (typeof $(this).data('parallaxOffset') != 'undefined')
            //         iEffect += parseInt($(this).data('parallaxOffset'));

            //     var backgroundPosition = $(this).css('background-position').split(" ");
            //     if (typeof backgroundPosition[0] == 'undefined' || backgroundPosition[0] == "" || backgroundPosition.length == 1) backgroundPosition[0] = "center";
            //     $(this).css('background-position',backgroundPosition[0] + ' ' + iEffect + 'px');
            // }
            // else {
            //     if (cParallaxMethod == 'margin' || cParallaxMethod == 'follow') {
            //         if (typeof $(this).data('originalTopOffset') == 'undefined') {
            //             $(this).data('originalTopOffset',$(this).offset().top);
            //         }

            //         var iOrigTopOffset = parseInt($(this).data('originalTopOffset'));

            //         // Adjust for items lower down the screen
            //         var iOffsetAdjust  = 0;
            //         while (iOffsetAdjust + $(window).height()< iOrigTopOffset) {
            //             iOffsetAdjust  = iOffsetAdjust + $(window).height();
            //         }
            //         iOrigTopOffset = iOrigTopOffset - iOffsetAdjust;

            //         iScrollDiff = ($(this).offset().top - iPageTop) - iOrigTopOffset;

            //         if (cParallaxMethod == "follow") {
            //             if (typeof $(this).data('originalMarginTop') == 'undefined') $(this).data('originalMarginTop',$(this).css('margin-top'));
            //             var iEffect = $(window).scrollTop();
            //             if ($(window).scrollTop() < iOrigTopOffset)
            //                 iEffect = parseInt($(this).data('originalMarginTop'));
            //             else
            //                 iEffect -= parseInt($(this).data('originalMarginTop'));
            //         }
            //         else
            //             var iEffect = 0 - (iScrollDiff * 0.5);

            //         if (typeof $(this).data('parallaxOffset') != 'undefined') {
            //             iEffect += parseInt($(this).data('parallaxOffset'));
            //         }

            //         $(this).css('margin-top', iEffect + 'px');
            //     }
            // }
        });
    }

    function initialiseVideoLinks() {
        $('a[href^="javascript:launchVideo"] img').each(initialiseVideoLinkImage);
    }

    function initialiseVideoLinkImage(index, element) {
        if ($(element).width() == 0 || $(element).height() == 0) $(element).load(function(e) {initialiseVideoLinkImage(index,element);});

        var $parent = $(element).parent();
        var $imgHeight = $('a[href^="javascript:launchVideo"] img').height();
        $parent.addClass('videoPlayerLinkImage').attr('title','Click to play video').hover(tooltipHoverOn,tooltipHoverOff);
        if ($parent.find('.overlay').length == 0) {
            $parent.append('<div class="overlay"></div>');
        }

        if (CPI_ID != 2470) {
            $parent.find('.overlay').css({ top : $(element).position().top + "px" , left : $(element).position().left + "px", width : $(element).width() + "px" , height : $imgHeight });
        }

    }
// ---

// function showOffice(pcOfficeName) {
//     $('.officePopup').fadeOut(300, function() { $(this).remove(); });
//     $('.officeLocations a.mapPin').removeClass('selected');
//     //$('<div class="officePopup" data-office-name="' + pcOfficeName + '"><h5>' + pcOfficeName + ' Office <button type="button" class="icon Close" onClick="hideOffice(\'' + pcOfficeName + '\');"></button></h5><div class="inner"></div></div>')
//     $('<div class="officePopup" data-office-name="' + pcOfficeName + '" onClick="hideOffice(\'' + pcOfficeName + '\');"><div class="inner"></div></div>')
//         .appendTo('.GlobalLocationsMap').fadeOut(0).fadeIn(300);
//     $('.OfficeDetails .Office[data-office-name="' + pcOfficeName + '"]').clone().appendTo('.officePopup[data-office-name="' + pcOfficeName + '"] .inner');
//     $('.officeLocations a.mapPin[data-office-name="' + pcOfficeName + '"]').addClass('selected');
// }

// function hideOffice(pcOfficeName) {
//     $('.officePopup[data-office-name="' + pcOfficeName + '"]').fadeOut(300, function() { $(this).remove(); });
//     $('.officeLocations a.mapPin[data-office-name="' + pcOfficeName + '"]').removeClass('selected');
// }

function cp_showRCApplyPopupCallback() {
    setTimeout(updateRCApplyPopup, 300);
}

function updateRCApplyPopup() {
        // $('<p class="intro">Please fill in your details &amp; attach your CV or resume</p>').prependTo('#popupWindowBody');
        // $('.chooseCV .title').text('Attach CV').prepend('<button type="button" class="Attach">+</button>');
        // $('.popupWindowBody .rcApplyConfirm').wrap('<div class="centeredContents" style="margin-top: 20px;"></div>');

        // if ($('#popupWindowBody p.intro').length == 0 || $('.popupWindowBody .rcApplyConfirm').length == 0)
        //     cp_showRCApplyPopupCallback();
        $('#popupWindowBody').html(apply_html.html);

}

function cp_showPopupPostCVFormCallback() {
    $('.popupWindowBody input[type="text"], .popupWindowBody input[type="password"]').hinty();
    $('.popupWindowBody .postCVSubmitBtn').wrap('<div class="centeredContents" style="margin-top: 20px;"></div>');
}

function launchVideo(pcVideoURL, pcVideoTitle) {

    var iMaxHeight = $(window).height() * 0.6;
    var iMaxWidth  = (iMaxHeight / 9) * 16;

    var cPopupHTML =
        '<div class="centeredContents"> ' +
        '   <div class="popupWindow videoPlayer" id="popupWindow">' +
        '       <div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3>' + pcVideoTitle + '</h3><div style="clear:both;"></div></div>' +
        '       <div class="popupWindowBody video" id="popupWindowBody">' +
        '           <iframe style="vertical-align:top;" src="' + pcVideoURL + '" width="' + iMaxWidth + '" height="' + iMaxHeight + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +  /* width="960" height="540" */
        '       </div>' +
        '       <div class="popupWindowFooter"></div>' +
        '   </div>' +
        '</div>';
    createJQueryPopup( cPopupHTML, null, false, false);
    $('#popupCloseBtn').click(hidePopup);
    $("html, body").stop().animate({scrollTop: 0} , 600, "easeOutExpo");
    if (mobile) {
        $('.jqueryPopup').css('position','fixed');
    }
}

function popupDetail(jqDetailContentId, pcPopupTitle) {
    var cPopupHTML =
        '<div class="popupWindow popupDetail" id="popupWindow">' +
        '   <a id="popupWindowTop"></a>' +
        '   <div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3>' + pcPopupTitle + '</h3><div style="clear:both;"></div></div>' +
        '   <div class="popupWindowBody" id="popupWindowBody">' +
        '       ' + $(jqDetailContentId).html() +
        '   </div>' +
        '   <div class="popupWindowFooter"></div>' +
        '</div>';
    createJQueryPopup( cPopupHTML );
    setTimeout(function() {
        $('#popupCloseBtn').click(hidePopup);
        if (mobile) {
            $('body').css('overflow','auto');
            document.location.hash="#popupWindowTop";
            $('#popupCloseBtn').click(function() {document.location.hash = "";});
        }
        }, 500);
}

function tooltipHoverOn(e) {
    //console.log("$(this).outerWidth(): " ,$(this).outerWidth());
    if (typeof $(this).attr('title') != 'undefined') { $(this).data('tooltip',$(this).attr('title')); $(this).removeAttr('title'); }
    if (typeof $(this).data('tooltip') == 'undefined') return false;

    if ($('.tooltip', this).length == 0) {
        $('<div class="tooltip">' + $(this).data('tooltip') + '<div class="arrow bottom"></div></div>').appendTo(this);
        $('.tooltip', this).css('opacity', '1');
        $('.tooltip', this)
            .css('margin-left', ($(this).outerWidth() / 2 - $('.tooltip', this).outerWidth() / 2) + "px")
            .stop().animate({top: -5, opacity: 1}, 200, "linear");

        return true;
    }
    else {
        return false;
    }

}

function tooltipHoverOff(e) {
    // console.log("$(this).outerWidth(): " ,$(this).outerWidth());
    $('.tooltip', this)
        .css('margin-left', ($(this).outerWidth() / 2 - $('.tooltip', this).outerWidth() / 2) + "px")
        .stop().animate({top: 15, opacity: 0}, 300, "linear", function() {
            $(this).remove();
        });

}

simpleformLoaded = false;
function requestClientAreaAccess() {
    var cPopupHTML =
        '<div class="popupWindow popupDetail" id="popupWindow">' +
        '   <a id="popupWindowTop"></a>' +
        '   <div class="popupWindowHeader"><h3>Request Client Area Access</h3><div class="btn right close" id="popupCloseBtn"></div><div style="clear:both;"></div></div>' +
        '   <div class="popupWindowBody" id="popupWindowBody">' +
        '       ' + requestFormHtml.html +
        '   </div>' +
        '   <div class="popupWindowFooter"></div>' +
        '</div>';

    createJQueryPopup( cPopupHTML, function(){
        $("#request_access_form").appendTo("#popupWindowBody");
        $('.popupWindow form input, .popupWindow form textarea').hinty();
        $('#popupCloseBtn').click(function() {
            hidePopup();
            // $("#request_access_form").appendTo("body");
        });

        // $('html,body').stop().animate({scrollTop :161}, 'fast');
/*        if ($('script[src="simplecontactform/simpleformsubmit.js"]').length == 0 && !simpleformLoaded) {
            var simpleScript = "simplecontactform/simpleformsubmit.js";
            $.getScript( simpleScript, function( data, textStatus, jqxhr ) {
              initiateSimpleFormValidation();
            });
            simpleformLoaded = true;
        }
        else {
            initiateSimpleFormValidation();
        }*/
    });

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var clientSubmitFunctions = function() {
    initCustomClientArea();
}

var initCustomClientArea = function() {
    $('#clientLoginBtn').click(clientLoginSubmit);
    $('#syu_username, #syu_passwd').keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  clientLoginSubmit(); }});

    if(window.location.hash)
    {
        $('input[name="skipto"]').val($('input[name="skipto"]').val() + window.location.hash);
    }
}


var clientLoginSubmit = function($form) {

    var $wrapper = ($form != null && !$form.target) ? $form : $('.PageClientLogin');

    if(cp_popupFormsHintyOn)
    {
        $wrapper.find('input[type="text"], input[type="password"]').unbindHinty();
    }

    var email = $wrapper.find('#syu_username').val();
    var password = $wrapper.find('#syu_passwd').val();

    if(email == "")
    {
        clientShowPopupError('Please type your username');
        $wrapper.find('#syu_username').focus();
    }
    else if(password == "")
    {
        clientShowPopupError('Please type your password');
        $wrapper.find('#syu_passwd').focus();
    }
    else
    {
        clientShowPopupError("");
        $wrapper.find('#loginSubmitBtn p').html('Checking login...');
        $wrapper.find('#loginSubmitBtn').addClass('loading').unbind('click');
        $wrapper.find('#popupCloseBtn')
        clientCheckLogin(email, password);
    }

}

var clientCheckLogin = function(email, password) {

    var dataObj = $('#customClientAreaLogin').serialize();
    $('#syu_username, #syu_passwd').attr('disabled','disabled');
    $('.popupWindow label').addClass('disabled');

    $.ajax({
        type : 'POST',
        url : 'ajax_check_login.php',
        dataType : 'html',
        data: dataObj,
        success : function(data){
            clientLoginCallback(data);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            //alert('error');
        }
    });

}

var clientLoginCallback = function(data) {

    $('#syu_username, #syu_passwd').removeAttr('disabled');

    if(data == "response=ok")
    {
        $('#customClientAreaLogin').submit();
    }
    else
    {
        // $('#popupCloseBtn, #jqueryPopupBG').click(hidePopup);
        // $('.popupWindow label').removeClass('disabled');
        // $('#loginSubmitBtn p').html('Login');
        // $('#loginSubmitBtn').removeClass('loading').click(cp_popupLoginSubmit);

        if(data == "wrongpassword")
        {
            clientShowPopupError("Incorrect password");
            $('#syu_passwd').focus();
        }
        else if(data == "wrongemail")
        {
            clientShowPopupError("Incorrect login, please check your username");
            $('#syu_username').focus();
        }
        else
        {
            clientShowPopupError("We encountered an error, please try again");
        }
    }
}

var clientShowPopupError = function(errorText, $wrapper) {

    if($wrapper == null)
    {
        $wrapper = $('.PageClientLogin');
    }

    if(errorText != "")
    {
        if($wrapper.find('#signUpError').html() == "&nbsp;")
        {

            $wrapper.find('#signUpError').stop().html(errorText).animate({opacity: 1, height: 32}, 300, 'linear');
        }
        else
        {
            $wrapper.find('#signUpError').stop().animate({opacity: 0}, 200, 'linear', function()
                {
                    $wrapper.find(this).html(errorText).animate({opacity: 1}, 300, 'linear');
                });
        }

        if(cp_popupFormsHintyOn)
        {
            $wrapper.find('input[type="text"], input[type="password"]').hinty();
        }

    }
    else
    {
        $wrapper.find('#signUpError').stop().animate({opacity: 0}, 200, 'linear', function()
            {
                $(this).html("&nbsp;");
            });
    }


}

/* global $ */
$('.camera-shutter--animation1').hover(function() {
  $(this).toggleClass('camera-shutter--open camera-shutter--f32');
});

$('.camera-shutter--animation2').hover(function() {
  $(this).toggleClass('camera-shutter--open camera-shutter--f8');
});

$('.camera-shutter--animation3').hover(function() {
  $(this).toggleClass('camera-shutter--open camera-shutter--f64');
});

$('.camera-shutter--animation4').hover(function() {
  $(this).toggleClass('camera-shutter--open camera-shutter--f16');
});

// PRIVACY ACCORDIAN MENU
var accordion_menu = function() {
    var Accordion = function(el, multiple) {
        this.el = el || {};
        // more then one submenu open?
        this.multiple = multiple || false;

        var dropdownlink = this.el.find('.dropdownlink');
        dropdownlink.on('click',
        { el: this.el, multiple: this.multiple },
        this.dropdown);
    };

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el,
        $this = $(this),
        //this is the ul.submenuItems
        $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if(!e.data.multiple) {
        //show only one menu at the same time
            $el.find('.submenuItems').not($next).slideUp().parent().removeClass('open');
        }
    }

    var accordion = new Accordion($('.accordion-menu'), false);


        $('.accordion-menu a.anchor').each(function(i) {
            $(this).on('click', function(e)  {
                var $currentAttrValue = $(this).attr('href');
                var $currentAttrValue_ID = $currentAttrValue.split("/");

                var $currentAttrValue_final_id = $currentAttrValue_ID[$currentAttrValue_ID.length - 2];
                console.log("$currentAttrValue_final_id: ", $currentAttrValue_final_id);
                // Show/Hide Tabs
                var $current_heading = $('.accordian_item' + $currentAttrValue_final_id);

                $current_heading.addClass('open');
                $current_heading.find('.submenuItems').slideToggle();

                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $current_heading.offset().top - 100
                }, 1200);
            });
        });
        var $header_height = $(".header").height();

        $("a.anchor").click(function(event){
            event.preventDefault();
            $('html,body').stop().animate({scrollTop:$('[name="'+this.hash.substring(1)+'"]').offset().top - $header_height}, 500, "easeOutExpo");
        });


            // $(this).removeAttr('href');
            // $(this).click(function(e) {
            //     e.preventDefault();
            //     $anchor_id = $(this).attr('title');
            //     $anchorTo_id = $('ul.accordion-menu').find('#'+$anchor_id);
            //     if (!($anchorTo_id.hasClass("open"))) {
            //         $anchorTo_id.addClass('open');
            //         $anchorTo_id.find('.submenuItems').slideToggle();
            //     }
}


function init_form_links()
{

    $('a.has-form').click(function(){
        launch_form_popup($(this).data().formId, $(this).data().formTitle);
    });

    $('.launch-subscribe-popup').click(function(){
        launch_subscribe_popup($(this).data().formId);
    });

}

function launch_form_popup(form_id, form_title)
{

    var popupHTML =
       '<div class="popupWindow postCVPopup jobApply scaled-down quick-register" id="popupWindow"> ' +
       '       <div class="popupWindowHeader"> ' +
       '           <div class="btn right close" id="popupCloseBtn"></div> ' +
       '           <h3>' + form_title + '</h3> ' +
       '           <div style="clear:both;"></div> ' +
       '       </div> ' +
       '       <div class="popupWindowBody" id="popupWindowBody"> ' + form_html_array[form_id].html + '</div>' +
       '       <div class="popupWindowFooter"></div> ' +
       '</div>'
    ;


    createJQueryPopup(popupHTML, function() {
        $('#popupCloseBtn').click(hidePopup);
        initFormStyles();
        cp_check_generalPopupCallback();
        $('#popupWindow').removeClass('scaled-down');
    }, false , false);

    $('html,body').animate({scrollTop: 0}, 500, 'easeOutExpo');

}

function launch_subscribe_popup($form_id)
{

    var popupHTML =
       '<div class="popupWindow scaled-down" id="popupWindow"> ' +
       '       <div class="popupWindowBody" id="popupWindowBody"> ' +
       '            ' + form_html_array[$form_id].html +
       '            <div class="btnUnderline" id="popupCloseBtn">Close</div> ' +
       '        </div>' +
       '</div>'
    ;

    createJQueryPopup(popupHTML, function() {
        $('#popupCloseBtn').click(hidePopup);
        initFormStyles();
        cp_check_generalPopupCallback();
        $('#popupWindow').removeClass('scaled-down');
    }, false , false);

    $('html,body').animate({scrollTop: 0}, 500, 'easeOutExpo');

}

function cp_hidePopupCallback() {

    $('.qtip').remove();

};

function init_floating_form() {

    var $floating_form_button = $('#floating-form-button');
    var $site_footer_wrapper = $('.siteFooterWrapper');
    var $document = $(document);
    var $window = $(window);

    $floating_form_button.click(function(){
        var $body = $('body');
        var $floating_form = $('#floating-form-wrapper');

        $floating_form.addClass('on');

        setTimeout(function(){
            if($floating_form.hasClass('on'))
            {
                $body.click(function(e){
                    if(!$(e.target).parents('#floating-form-wrapper').length)
                    {
                        $floating_form.removeClass('on');
                        $body.off('click');
                        $floating_form.off('click');
                        init_floating_form();
                    }
                });
                $('.floating-form-close').click(function(){
                    $floating_form.removeClass('on');
                    $body.off('click');
                    $floating_form.off('click');
                    init_floating_form();
                });
            }
        }, 20);
    });

    $document.scroll(function(){
        if($document.scrollTop() > $document.height() - $window.height() - $site_footer_wrapper.height())
        {
            $floating_form_button.addClass('hidden');
        }
        else {
            $floating_form_button.removeClass('hidden');
        }
    });

}

function init_blog_functions() {

    var $blog_page = $('.blogPageWrapper');
    var $blog_post = $('.blog-post-detail-page');
    if($blog_page.length > 0)
    {
        $blog_page.find('.blog-post-excerpt').each(function(){
            doBackstretch($(this));
        });

        initFormStyles('#blog-category-input');

        var $post_9 = $('.blogPostWrapper.postSeq9');
        var $blog_videos = $('#blog-videos-wrapper');
        var $original_blog_grid = $(".blog-grid");
        if($post_9.length > 0)
        {
            $("<div class='blog-grid'></div>").insertAfter($original_blog_grid).append($post_9.nextAll());
            $blog_videos.insertAfter($original_blog_grid);
        }

        $('#blog-category-input, #case_study-region, #case_study-industry-type').on("change", function(){
            location.href = $(this).val();
        });
    }
    if($blog_post.length > 0)
    {
        $blog_post.find('.blog-post-body').find('p').first().insertAfter($blog_post.find('.blog-post-body').find('h1'));
        $blog_post.find('iframe').parent().addClass('iframe-wrapper');

        var $img_html = "";
        var img_count = 0;
        var $insert_after_el;
        $blog_post.find('.blog-post-body > *').each(function(){

            var $img = $(this).find('img');

            if($img.length > 0 && !$(this).hasClass('blog-logo'))
            {
                img_count++;
                $img_html += "<span class=\"image-container\">"+$(this).html()+$img.attr("alt")+"</span>";
                $insert_after_el = $(this).prev();
                $(this).remove();
            }
            else
            {
                if($img_html != "")
                {
                    $insert_after_el.after("<p class=\"image-count-"+img_count+"\">"+$img_html+"</p>")
                }
                img_count = 0;
                $img_html = "";
            }
        });
    }

    $blogSubscribeBtn = $('.cpFormSubmit.blogSubscribe a');
    $blogSubscribeBtn.click(function(e){
        e.preventDefault();
        window.open($(this).attr('href') + '&MERGE0=' + $('#subscribe-email-address').val());
    });

}

function init_horizontal_galleries(){

    $('.horizontal-gallery').each(function(){
        if($(this).find('.item').length > 3)
        {
            var horizontal_gallery = $(this).flickity({
                cellAlign: 'left',
                contain: false,
                pageDots: false,
                wrapAround: true,
                autoPlay: false,
                arrowShape: {
                    x0: 30,
                    x1: 60, y1: 35,
                    x2: 65, y2: 30,
                    x3: 40
                },
                groupCells: false,
                imagesLoaded: true
            });
        }
    });

}

function init_drag_sliders(){

    $('.drag-slider').each(function(){
        var drag_slider = $(this).flickity({
            cellAlign: 'center',
            contain: true,
            pageDots: false,
            wrapAround: false,
            autoPlay: 4000,
            prevNextButtons: false,
            groupCells: false,
            imagesLoaded: true,
            draggable: true
        });
    });

}

function init_equal_heights() {

  $('.equal-heights').each(function(){
    var height = 0;
    var $children = $(this).children();
    $children.css({"height": "auto"});
    $children.each(function(){
      height = $(this).outerHeight() > height ? $(this).outerHeight() : height;
    });
    $children.height(height);

  });

}

function init_equal_heights_once() {

  $('.equal-heights-once').each(function(){
    var height = 0;
    var $children = $(this).children();
    $children.css({"height": "auto"});
    $children.each(function(){
      height = $(this).outerHeight() > height ? $(this).outerHeight() : height;
    });
    $children.height(height);

  });

}

function init_galleries() {

    $('.gallery').each(function(){

        // $(this).find('.slide:not(.floating_image)').each(function(i) {
        //     var current_element = $(this);
        //     var current_set_height_element = current_element.find('.slide-content-inner');
        //     var current_get_height_element = current_element.find('.column');
        //     current_set_height_element.height($(current_get_height_element).outerHeight());
        //     $(window).resize(function(){
        //         current_set_height_element.height($(current_get_height_element).outerHeight());
        //     });

        // });
        if(mobile){
            var adaptive_height = true;
        } else {
            var adaptive_height = false;
        }
        var $gallery = $(this);
        if($gallery.find('.slide').length > 1)
        {

            $gallery.flickity({
                wrapAround: false,
                pageDots: true,
                autoPlay: 5000,
                contain: true,
                prevNextButtons: false,
                adaptiveHeight: adaptive_height,
                wrapAround: true,
                imagesLoaded: true,
                bgLazyLoad: 1,
                cellAlign: 'left'
            });
            $gallery.flickity('resize');

            var $page_dot_mover = $('<div class="page-dot-mover"></div>');
            var $page_dots = $(this).find('.flickity-page-dots');
            var dot_width = 5;
            var dots_wrapper_offset = $page_dots.offset().left


            $page_dots.prepend($page_dot_mover);

            var original_left = $page_dots.find('.is-selected').offset().left - dots_wrapper_offset;

            $page_dot_mover.css({
                "left": original_left
            });

            var $selected_slide = $gallery.find('.slide.is-selected');
            if($selected_slide.hasClass('light-elements'))
            {
                $page_dots.addClass('light');
            }
            else
            {
                $page_dots.removeClass('light');
            }

          $(this).on('select.flickity', function() {
            // var previous_offset_left = $page_dot_mover.offset().left - dots_wrapper_offset;
            // var new_offset_left = $page_dots.find('.is-selected').offset().left - dots_wrapper_offset;
            // var offset_difference = new_offset_left - previous_offset_left;
            // var animate_width = Math.abs(offset_difference);
            // var left_val = previous_offset_left + offset_difference;
            // var right_val = "auto;"

            // $page_dot_mover.css({"left": previous_offset_left, "right": "auto"});

            // if(new_offset_left < previous_offset_left)
            // {
            //   var previous_offset_right = $page_dots.width() - previous_offset_left - dot_width;
            //   $page_dot_mover.css({"left": "auto", "right": previous_offset_right});
            //   left_val = "auto";
            //   right_val = previous_offset_right - offset_difference;
            // }

            var $selected_slide = $gallery.find('.slide.is-selected');
            if($selected_slide.hasClass('light-elements'))
            {
                $page_dots.addClass('light');
            }
            else
            {
                $page_dots.removeClass('light');
            }


            // $page_dot_mover.stop().animate({
            //   "width": animate_width
            // }, 300, function(){
            //   $page_dot_mover.stop().animate({
            //     "width": dot_width,
            //     "left": left_val,
            //     "right": right_val
            //   }, 300);
            // });
          });
        }
    });

    $image_gallery = $('#image-gallery');
    $image_gallery_wrapper = $image_gallery.parent();
    if($image_gallery.length > 0)
    {
        var image_gallery = $image_gallery.flickity({
            cellAlign: 'center',
            contain: false,
            pageDots: false,
            wrapAround: true,
            autoPlay: false,
            arrowShape: {
              x0: 25,
              x1: 65, y1: 30,
              x2: 65, y2: 15,
              x3: 65
            },
            groupCells: false,
            imagesLoaded: true
        });

        $('.full-screen-gallery-thumb').click(function(){
            image_gallery.flickity( 'select', $(this).index() - 1, true, true);
            $image_gallery_wrapper.addClass('on');
        });
        $('#image-gallery-close').click(function(){
            $image_gallery_wrapper.removeClass('on');
        });
    }

}

function init_mobile_menu() {

    if(mobile)
    {
        var $mobile_menu = $('#mobile-menu');
        var $mobile_menu_footer = $('#mobile-menu-footer');
        $('.menu-icon').on("touchstart", function(){
            $('body').toggleClass('mobile-menu-open');

            var $mobile_accordians = $mobile_menu.find('.accordian-outer.on');
            var $mobile_menu_footer_accordians = $mobile_menu_footer.find('.accordian-outer.on');
            $mobile_accordians.removeClass('on');
            $mobile_accordians.removeClass('on');
            $mobile_accordians.find('.accordian').animate({"height": 0}, 200, function(){
                $(this).css({"display":"none"});
            });
            $mobile_menu_footer_accordians.find('.accordian').animate({"height": 0}, 200, function(){
                $(this).css({"display":"none"});
            });
        });

        $('.accordian-trigger').on("touchend", function(){

            var $accordian_outer = $(this).parents('.accordian-outer');
            var $accordian = $accordian_outer.find('.accordian');
            $accordian_outer.toggleClass('on');

            var accordian_open = $accordian_outer.hasClass('on');
            if(accordian_open)
            {
                $accordian.css({"display":"block"});
                $accordian.animate({"height":$accordian[0].scrollHeight}, 200);
            }
            else
            {
                $accordian.animate({"height": 0}, 200, function(){
                    $accordian.css({"display":"none"});
                });
            }
        });

        $('#mobile-menu-footer-push').height($('#mobile-menu-footer').outerHeight());
    }

}

function init_edit_content_videos() {

    $('.latestVideo, .vimeo-trigger').each(function(){
        var $latestVideoWrapper = $(this);
        if($latestVideoWrapper.data().vimeoUrl != "" && typeof($latestVideoWrapper.data().vimeoUrl) != "undefined")
        {
            $latestVideoWrapper.click(function(e){
                e.preventDefault();
                newLaunchVideo($latestVideoWrapper.data().vimeoUrl, $latestVideoWrapper.find('h2').text());
            });
        }
    });

}

function init_follow_on_scroll() {

    $('.follow-wrapper').each(function(){
        var $follow_wrapper = $(this);
        var $follow_item = $follow_wrapper.find('.follow-on-scroll');
        var $header = $('.header');
        var item_and_wrapper_offset = $follow_item.offset().top - $follow_wrapper.offset().top;

        var fixed_start = $follow_item.offset().top - $header.height() - item_and_wrapper_offset;
        var fixed_end = $follow_wrapper.offset().top + $follow_wrapper.outerHeight() - $follow_item.outerHeight() - item_and_wrapper_offset - $header.height();

        $(document).scroll(function(){
            if($(document).scrollTop() >= fixed_end)
            {
                $follow_item.css({
                      "position": "absolute"
                    , "left": ""
                    , "bottom": "0px"
                    , "top": "auto"
                    , "right": "0px"
                });
            }
            else if($(document).scrollTop() >= fixed_start)
            {
                $follow_item.css({
                      "position": "fixed"
                    , "left": $follow_item.offset().left
                    , "top": $header.height() + item_and_wrapper_offset
                    , "bottom": "auto"
                    , "right": "auto"
                });
            }
            else
            {
                $follow_item.css({
                      "position": ""
                    , "left": ""
                    , "top": ""
                    , "bottom": ""
                    , "right": ""
                });
            }
        });
    });

}

function cp_forms_callback_success($form, form_cpda_id) {
    // console.log("form: ", $($form));
    var first_name_field = "";
    var last_name_field = "";
    var email_field = "";
    var name_field = "";
    $form.find('input').each(function(){
        if($(this).attr('title') == "First Name"){
            first_name_field = $(this).val();
        }
        if($(this).attr('title') == "Last Name"){
            last_name_field = $(this).val();
        }
        if($(this).attr('title') == "Name"){
            name_field = $(this).val();
        }
        if($(this).attr('title') == "Email"){
            email_field = $(this).val();
        }
        else if($(this).attr('title') == "Email Address") {
            email_field = $(this).val();
        }
    });

    // showDefaultFormSubmittedAnimation = false;
    if(form_cpda_id == 127227)
    {
        $form.find('.cpFormWrapper').slideUp(300);
        $form.append('<div class="formSuccess"><p>Thank you for subscribing to our Important Notices.</p><p>Please check your inbox for a confirmation email.</p></div>');
    }
    else if(form_cpda_id == 62629)
    {
        if (typeof landing_form_thankyou_url != 'undefined') {

            gtag_report_conversion_contact(landing_form_thankyou_url);
            if (region_cpda_id == 140) {
                gtag_aus_report_conversion(landing_form_thankyou_url);
            }
        }
        else
        {

            gtag_aus_report_conversion(window.location);
            if (region_cpda_id == 140) {
                gtag_aus_report_conversion(window.location);
            }
        }
        $form.find('.cpFormWrapper').slideUp(300);
        $form.append('<p class="cpFormDefaultSuccessText">Form submitted successfully.</p>');
    }
    else if(form_cpda_id == 150181)
    {
        if (typeof landing_form_thankyou_url != 'undefined') {
            gtag_report_conversion_book_a_demo(landing_form_thankyou_url);
        }
        else
        {
            gtag_report_conversion_book_a_demo(window.location);
        }
        $form.find('.cpFormWrapper').slideUp(300);
        $form.append('<p class="cpFormDefaultSuccessText">Form submitted successfully.</p>');
    }
    else
    {
        $form.find('.cpFormWrapper').slideUp(300);
        $form.append('<p class="cpFormDefaultSuccessText">Form submitted successfully.</p>');
    }
    if(first_name_field != "" && last_name_field != "") {
        _wow.push(['setName', first_name_field+" "+last_name_field]);
    }
    else if (name_field != "") {
        _wow.push(['setName', name_field]);
    }
    if(email_field != "") {
        _wow.push(['setEmailAddress', email_field]);
    }
    _wow.push(['trackPageView']);

    if (landing_form_id != null) {
        if (form_cpda_id == landing_form_id) {
            window.location.href = landing_form_thankyou_url;
        }
    }

    return(true);
}


function init_case_study_slider(){
    // $('.case-study-slider').each(function(){
    //     var height = 0;
    //     var $children = $(this).children();
    //     $children.css({"height": "auto"});
    //     $children.each(function(){
    //       height = $(this).outerHeight() > height ? $(this).outerHeight() : height;
    //     });
    //     $children.height(height);

    // });

    $('.case-study-slider').each(function(){


        $(this).find('.case-study').each(function(){
            // doBackstretch($(this), {wrapInner: true});
        });
        var study_study_slider = $(this).flickity({
            cellAlign: 'center',
            contain: false,
            pageDots: false,
            wrapAround: true,
            autoPlay: false,
            arrowShape: {
                x0: 30,
                x1: 60, y1: 35,
                x2: 65, y2: 30,
                x3: 40
            },
            groupCells: false,
            imagesLoaded: true,
            bgLazyLoad: 1
        });

        study_study_slider.on( 'ready.flickity', function() {
            // console.log('Flickity ready');
            $('.case-study-slider').each(function(){
                var height = 0;
                var $children = $(this).children();
                $children.css({"height": "auto"});
                $children.each(function(){
                  height = $(this).outerHeight() > height ? $(this).outerHeight() : height;
                });
            });
        });
    });



}

function solutions_features() {
    var $features_container = $(".features_box");
    var $features_wrapper   = $(".features_wrapper");
    var $features_height    = $(".features_inner").height();
    var $features_button    = $("#key_features_btn");
        $features_button.find('p').html("View Key Features");
        $features_wrapper.height(0);

    $features_button.click(function(e){
        $features_container.toggleClass('feature_open feature_closed');
        if ($features_container.hasClass('feature_open')) {
            $features_button.find('p').html("Hide Key Features");
            $features_wrapper.height($features_height);
            $(window).resize(function(){
                $features_wrapper.height($features_height);
            });
            $features_container.find('.feature_item').removeClass('animateStart').each(function(i) {
                var $this = $(this);
                setTimeout(function(){ $this.addClass('animateStart'); }, 200 + (i * 100) - (30 * i));
            });

        } else {
            $features_wrapper.height(0);
            $features_button.find('p').html("View Key Features");
            $('.feature_item').removeClass('animateStart');
        }
        e.stopPropagation();
    });
}

function cp_showPopupNewApplyForm() {
    var popupHTML =
        '<div class="popupWindow rcApplyPopup" id="popupWindow"> ' +
        '       <div class="popupWindowHeader"> ' +
        '           <div class="btn right close" id="popupCloseBtn"></div> ' +
        '           ' + cp_popupRcApplyTitle + ' ' +
        '           <div style="clear:both;"></div> ' +
        '       </div> ' +
        '       <div class="popupWindowBody" id="popupWindowBody"> ' + apply_html.html + '</div>' +
        '</div>';

    createJQueryPopup(popupHTML, function() {

    $('#popupWindow').addClass('postCVPopup jobApply');
    $('#popupCloseBtn').click(hidePopup);

    initFormStyles();
    $('#popupWindow input').hinty();
    cp_check_generalPopupCallback();
    cp_check_showPopupPostCVFormCallback();


    }, false , false);

    $('html,body').animate({scrollTop: 0}, 500, 'swing');
}

function new_ca_login_success_custom_callback(loginCallbackData) {
    _wow.push(['setEmailAddress', loginCallbackData["syu_username"]]);
    _wow.push(['setName', loginCallbackData["syu_fullname"]]);
    _wow.push(['trackPageView']);
}