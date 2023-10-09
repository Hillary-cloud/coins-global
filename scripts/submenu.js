var $currentSubmenuDiv = null;
var currentSubmenuNum = -1;
var iconLastFirstTime = false;
var iconLastFirstTime = false;
var notBelowIE9 = true;
var mouseOutTimer;
var mouseOnTimer;
var mouseOutTimerNum = -1;
var mouseOutTimeLimit = 200;
var mouseOutTimerEndTime = 0;
var submenuValueFrom = 0;
var submenuValueTo = 0;
var submenuAnimSpeed = 0;

// Extend third parameter functionality on setTimeout to ie < 9
(function(f) {
        window.setTimeout = f(window.setTimeout);   // overwrites the global function!
        window.setInterval = f(window.setInterval); // overwrites the global function!
    })(function(f) {
        return function(c, t) {
            var a = [].slice.call(arguments, 2);    // gathers the extra args
            return f(function() {
                c.apply(this, a);                   // passes them to your function
            }, t);
        };
    });

function submenuInit(valueFrom, valueTo, animSpeed) {
	if (submenuValueFrom == 0) {
		submenuValueFrom = valueFrom;
	}
	else {
		submenuValueFrom = -50;
	}
	if (submenuValueTo == 0) {
		submenuValueTo = valueTo;
	}
	else {
		submenuValueTo = 50;
	}
	if (submenuAnimSpeed == 0) {
		submenuAnimSpeed = animSpeed;
	}
	else {
		submenuAnimSpeed = 400;
	}
	$('.submenu').mouseleave(submenuHoverOff).mouseenter(submenuHoverOn);
	if ($('.submenuBlackout').length > 0) {
		$('.submenuBlackout').css({'opacity': 0, 'display': 'none'});
	}

	$('.pageTopDivMenu li').each(function(){

		var num = parseInt($(this).attr('class').split('pagetopMenuItemCpiId').join(''));

		if($('#submenu'+num).length > 0)
		{

			$(this).mouseenter(menuHoverOn).addClass('hasSubmenu');
			$(this).mouseleave(menuHoverOff);
		}
	});

	$('.submenu').each(function() {
		if($(this).css('width') == 'auto')
		{
			var num = parseInt($(this).attr('id').split('submenu').join(''));
			//alert(num);
			var newWidth = $('.pagetopMenuItemCpiId'+ num).outerWidth() - 1;
			$(this).width(newWidth);
		}
	});
}

var menuHoverOn = function() {
	var num = parseInt($(this).attr('class').split('pagetopMenuItemCpiId').join(''));
	if(num == mouseOutTimerNum)
	{
		clearTimeout(mouseOutTimer);
		mouseOutTimer = null;

	}
	else if(mouseOutTimerNum != -1){
		clearTimeout(mouseOnTimer);
		mouseOnTimer = null;
		var d = new Date();
		if (mouseOnTimer) {
			clearTimeout(mouseOnTimer);
			mouseOnTimer = null;
		}
		mouseOnTimer = setTimeout(showSubmenu, mouseOutTimerEndTime - d.getTime() + 1, num);

	}
	else {

		showSubmenu(num);
	}
}

var menuHoverOff = function(e) {
	var menuItemOffset = $(this).offset();
	var x = e.pageX - menuItemOffset.left;
	var y = e.pageY - menuItemOffset.top;

	if(x < 0 || y < 0 || Math.ceil(x) >= $(this).width())
	{
		mouseOutTimerNum = parseInt($(this).attr('class').split('pagetopMenuItemCpiId').join(''));
		// console.log("menuHoverOff");
		if (mouseOutTimer) {
			clearTimeout(mouseOutTimer);
			mouseOutTimer = null;
		}
		mouseOutTimer = setTimeout(hideSubmenu, mouseOutTimeLimit, mouseOutTimerNum);

		var d = new Date();
		mouseOutTimerEndTime = d.getTime() + mouseOutTimeLimit;
	}
}

var submenuHoverOn = function() {
	// console.log("submenuOn");
	if (mouseOutTimer) {
		clearTimeout(mouseOutTimer);
		mouseOutTimer = null;
	}
	if (mouseOnTimer) {
		clearTimeout(mouseOnTimer);
		mouseOnTimer = null;
	}
}

var submenuHoverOff = function(e) {

	var num = parseInt($(this).attr('id').split('submenu').join('')) ;
	var $menuItem = $('.pagetopMenuItemCpiId'+ num);
	// console.log("num: ", num);
	var $submenu = $('#submenu'+num);
	var menuItemOffset = $submenu.offset();

	var x = e.pageX - menuItemOffset.left;
	var y = e.pageY - menuItemOffset.top;

	if((x < 0 && y + submenuValueTo > $menuItem.height()) || y < 0 || x >= $submenu.width() || y > $submenu.height())
	{
		hideSubmenu(num);
	}
}

var showSubmenu = function(num) {
	if(num != currentSubmenuNum) {
		if(currentSubmenuNum != -1)
		{
			// console.log("showSubmenu");
			hideSubmenu(currentSubmenuNum);
		}
		if ($('.submenuBlackout').length > 0) {
			showBlackout();
		}
		currentSubmenuNum = num;
		$currentSubmenuDiv = $('#submenu'+num);

		$menuItem = $('.pagetopMenuItemCpiId'+ num);
		$menuItem.addClass('submenuOn');
		$siteContainerOffset = $('.siteContainer').offset();
		var menuItemOffset = $menuItem.offset();
		var menuItemLeft = menuItemOffset.left - $siteContainerOffset.left;

		var menuItemsOffset = $('.headerWrapper').offset();

		var newSubmenuLeft = parseInt(menuItemLeft) + ($menuItem.width() / 2) - ($currentSubmenuDiv.width() / 2);

		if (!Modernizr.csstransforms) {
			$('#submenu'+num).addClass('on').stop().css({'visibility': 'visible', 'left': newSubmenuLeft+'px'}).animate({opacity: 1, marginTop: submenuValueTo}, submenuAnimSpeed, 'easeOutExpo');
		}
		else {
			$('#submenu'+num).addClass('on').css({
				"visibility": "visible", "left": newSubmenuLeft+"px",
				"opacity" : "1",
				"-webkit-transform" : "translateY("+submenuValueTo+"px)",
				"-ms-transform" : "translateY("+submenuValueTo+"px)",
				"transform" : "translateY("+submenuValueTo+"px)"});
		}
	}
}

var hideSubmenu = function(num) {
	mouseOutTimerNum = -1;
	// console.log("hideSubmenu");
	if(currentSubmenuNum == num)
	{
		currentSubmenuNum = -1;
	}

	$('.pagetopMenuItemCpiId'+ num).removeClass('submenuOn');

	if ($('.submenuBlackout').length > 0) {
		hideBlackout();
	}

	if (!Modernizr.csstransforms) {
			$('#submenu'+num).stop().removeClass('on').css('z-index', '').animate({opacity: 0, marginTop: submenuValueFrom}, submenuAnimSpeed, 'swing', completeHandlerfunction);
		}
		else {
			$('#submenu'+num).removeClass('on').css({
				"opacity" : "0",
				"-webkit-transform" : "translateY("+submenuValueFrom+"px)",
				"-ms-transform" : "translateY("+submenuValueFrom+"px)",
				"transform" : "translateY("+submenuValueFrom+"px)"})
			.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
				function() {
					if (!$(this).hasClass('on')) {
						$('#submenu'+num).css('visibility', 'hidden');
					}
				});
		}



}

var completeHandlerfunction = function() {
	$(this).css('visibility', 'hidden');
}

var showBlackout = function() {
	$('.submenuBlackout').stop().css('display', 'block').animate({opacity: 0.5}, 200, 'swing');
}

var hideBlackout = function() {
	$('.submenuBlackout').stop().animate({opacity: 0}, 400, 'swing', function(){$(this).css('display', 'none');});
}
