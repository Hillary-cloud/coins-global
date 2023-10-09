var jobSearchTiled = false;
var countResultText = true;
var jqueryPopupOpen = false;
var jqueryPopupOpacity = 0.4;
var jqueryPopupAnimInTime = 200;
var jqueryPopupRemoveScrollbars = true;
var jqueryPopupFixPopup = true;
var cp_applyFormClicked = false;
var cp_applyFormNewClicked = false;
var cp_cvManagerPopupClicked = false;
var cp_postCVNewFormClicked = false;
var cp_passwordResetFormClicked = false;
var cp_newPasswordResetFormClicked = false;
var cp_loginSignUpFromNewApply = 0;
var cp_loginSignUpSendToHome = 0;
var cp_fineUploader;
var cp_tooltipArray = [];
var cp_tooltipMouseOutFix = checkBelowIE(9);
var cp_tooltipFadeOutTime = 300;
var cp_tooltipFadeInTime = 300;
var cp_tooltipFadeInTransition = 'linear';
var cp_tooltipFadeOutTransition = 'linear';
var cp_popupShowCreateAccountFormTitle = '<h3>Sign up</h3><p class="createAccountSubtitle">for advanced jobseeker features</p>';
var cp_popupShowLoginFormTitle = '<h3>Login</h3>';
var cp_popupShowPasswordResetTitle = '<h3>Password Reset</h3>';
var cp_facebookSignUpTitle = '<p>Sign up with Facebook</p>';
var cp_linkedInSignUpTitle = '<p>Sign up with Linkedin</p>';
var cp_popupShowLoginFormBtn = '<p>Login</p>';
var cp_popupCreateAccountFormBtn = '<p>Sign up</p>';
var cp_popupShowLoginFormForgot = '<p>Forgot Password</p>';
var cp_popupRcApplyConfirm = '<p>Confirm</p>';
var cp_RcApplyCvfileTitle = 'New';
var cp_popupRcApplyTitle = '<h3>Apply to this job</h3>';
var cp_popupCVManagerTitle = '<h3>Manage CVs</h3>';
var cp_parallaxMinimumWidth = 0;
var cp_parallaxOn = false;
var emailAlertsPopupTitleHTML = '<h3>Email Alerts</h3>';
var cp_popupPostCVTitle = '<h3>Post CV</h3>';
var jobBasketApplyPopupTitleHTML = '<h3>Apply to shortlisted jobs</h3>';
var cp_popupApplyNeedsLoginHTML = '<p>You must login or sign up for an account to apply for jobs</p><div class="btn right applySignUpBtn" id="applySignUpBtn"><p>Sign up</p></div><div class="btn left applyLoginBtn" id="applyLoginBtn"><p>Login</p></div><div style="clear:both;"></div>';
var cp_postCVNewFormSuccessMsg = "Thank you, your form has been sent.";
var loginWrongEmailError = "Incorrect login, please check your email address or<br><span id='loginSignUp'>click here</span> to sign up";
var applyFormFlow = 0;
var newApplyLoadNum = 0;
var salaryToggle1Height = 0;
var salaryToggle2Height = 0;
var useNewFormStyles = true;
var rc_erac_fineUploader;
var cp_parallaxArray = [];
var previewMode = false;
var newUserApplyFlag = false;
var new_ca_login_forgot_password_mode = false;
var new_ca_login_forgot_password_title = "Password Reset";
var new_ca_login_forgot_password_submit_btn_text = "Submit";
var new_ca_login_forgot_password_toggle_btn_text = "Back to login";
var new_ca_login_login_title = "Please log in";
var new_ca_login_login_submit_btn_text = "Login";
var new_ca_login_login_toggle_btn_text = "Forgot Password?";

const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ccd_client_referrer_cookie() {
	if(!cp.get_cookie('ccd_client_referrer'))
	{
		var query_params = [
			  "utm_source"
			, "utm_medium"
			, "utm_campaign"
			, "utm_term"
			, "utm_content"
			, "gclid"
			, "fclid"
		];

		var referrer = document.referrer != "" ? document.referrer : "direct";
		var i = 1;
		var query_values = [referrer];
		for(var key in query_params)
		{
			var param = query_params[key];
			var val = getURLParameter(param);
			if(val != null && val != "null" && val != "")
			{
				switch(param) {
					case "gclid":
						val = true; // don't need to store the full gclid
						break;
					case "fclid":
						val = true; // don't need to store the full fclid
						break;
				}

				query_values[i] = val;
			}

			i++;
		}
		cp.set_cookie('ccd_client_referrer', JSON.stringify(query_values), 1);
	    return(query_values);
	}
	else
	{
	    return(cp.get_cookie('ccd_client_referrer'));
	}
}

$(document).ready(function() {
	//This sets the cookies
	if(cp.config.recruitment.client_referrer_collection_enabled && !cp.in_cp)
	{
		ccd_client_referrer_cookie();
	}

	if ($('#jqueryPopup').length > 0 && $('#jqueryPopup').is(':empty')) {
	    $('#jqueryPopup, #jqueryPopupBG').animate({
	        opacity: 0
	    }, 0, 'linear');
	}
	$('#jqueryPopupBG').click(hidePopup);

	$(document).keydown(function(e) {

		if(
			e.ctrlKey
			&& e.altKey
		)
		{
			if (
				document.activeElement == document.body
				&& typeof CP_SHORTCUT != "undefined"
				&& CP_SHORTCUT == true
				&& typeof CP_EDITING != "undefined"
				&& !CP_EDITING
			) {
				if(e.keyCode == 32 /* spacebar */)
				{
					e.preventDefault();
					var vlink = "";

					if(typeof CP_SHORTCUT_DESTINATION != "undefined")
					{
						switch(CP_SHORTCUT_DESTINATION)
						{
							case 'application_queue':
								vlink = CP_ROOT + 'cp/recruitment/application-portal/applications/';
								break;
						}
					}

					if(vlink === "")
					{
						if(typeof RCV_ID != "undefined")
						{
							vlink = CP_ROOT + "cp/recruitment/edit-vacancy/?rcv_id="+RCV_ID;
						}
						else if(ELEMENT_CPDA_ID != "")
						{
							vlink = CP_ROOT + "cp_sets.php?mode=showElementEdit&set_id="+ELEMENT_SET_ID+"&element_id="+ELEMENT_CPDA_ID;
						}
						else if(CPI_ID == CPI_ID_HOME)
						{
							vlink = "v/-/"+CPI_ID_HOME+"/";
						}
						else
						{
							var end_of_path = window.location.pathname.substr(CP_ROOT.length);
							if(end_of_path != "")
							{
								vlink = CP_ROOT+"v/"+end_of_path;
							}
							else
							{
								vlink = CP_BASE_URL+"v/"+CPI_ID;
							}
						}
					}

					if(e.shiftKey)
					{
						var win = window.open(vlink, '_blank');
						win.focus();
					}
					else
					{
						window.location = vlink;
					}
					return false;
				}
				else if(e.keyCode == 76) /* L */
				{
					e.preventDefault();
					var loginLink = CP_ROOT+"cp/login/";
					if(e.shiftKey)
					{
						var win = window.open(loginLink, '_blank');
						win.focus();
					}
					else
					{
						window.location = loginLink;
					}
					return false;
				}
				else if(e.keyCode == 80) /* P */
				{
					e.preventDefault();
					var loginLink = CP_ROOT+"cp/config/";
					if(e.shiftKey)
					{
						var win = window.open(loginLink, '_blank');
						win.focus();
					}
					else
					{
						window.location = loginLink;
					}
					return false;
				}
			}
			else if(
				location.pathname == '/cp/login/'
				&& e.keyCode == 67 /* c key */
			)
			{
				cpLoginGoToCCDSSOLogin();
			}
		}
	});

	$('#sidebarSiteSearchSubmit').click(function(){$('#cp_sidebarSiteSearchForm').submit()});

	$('.ccdSubmitOnEnter').keydown(function(event) {
        if (event.keyCode == 13) {
            this.form.submit();
            return false;
         }
    });

	$('input.blogSearchInput').focus(blogSearchInputFocus).blur(blogSearchInputBlur);
	$('.blogSearchBtn').click(doBlogSearch);
	$('input.blogSearchInput').keypress(function(e) {
	    if(e.which == 13) { doBlogSearch(); }
	});

	$('#bl-category-select, #bl-tag-select, #bl-order_by-select').change(function(){
		window.location.href=$(this).val();
	});

	$('#cp_siteSearchBtn').click(function(){ $('#cp_siteSearchform').submit(); });

	location_autocomplete_init($('#homepageJobSearch #cLocation'));
	location_autocomplete_init($('#footerJobSearch #cLocation'));

	$('#signUpBtn').click(cp_popupShowCreateAccountForm);
	$('#loginBtn').click(cp_popupShowLoginForm);

	if(typeof RCO_APPLY_NEW != "undefined" && RCO_APPLY_NEW == true)
	{
		$('.btn.rcApplyBtn').click(cp_rcApplyBtnClick);

		if(typeof launchApply != 'undefined')
		{
			if(launchApply == 1)
			{
				if($('.btn.rcApplyBtn').length > 0)
				{
					var id = $('.btn.rcApplyBtn').first().attr('id').split("applyBtn").join("");
					cp_showRCApply(id);
				}
			}
			else if (launchApply == 2)
			{
				if(jobBasketRCVIDArray.length > 0)
				{
					applyToAllJobBasketClick();
				}
			}
		}
	}

	if(typeof launchApply == 'undefined' || launchApply == 0)
	{
		if((typeof cp_logged_in == "undefined" || cp_logged_in == false) && getURLParameter("show_signin_popup") == 1)
		{
			cp_popupShowLoginForm();
		}
	}

	if(useNewFormStyles)
	{
		useNewFormStyles = (typeof initFormStyles == "function") && $('#blockFormStyling').length == 0 && $('.bigtitle').length == 0;
		if(useNewFormStyles)
		{
			initFormStyles();
		}
	}

	if($('#pageTopMobileMenu').length > 0)
	{
		$('#pageTopMobileMenu').change(function() {
			if($(this).val() != "")
			{
				var temp = $(this).val();
				var link = $(this).val().split(" ");
				target = link.shift().substring(7);
				link = link.join(" ").substring(5);


				if(target == "_blank")
				{
					window.open(link);
				}
				else
				{
					window.location = link;
				}
			}
		});
	}

	$('a.cpLaunchPopup').each(function(){

		$(this).click(function(e){

			cp_popupShowImagePopup($(this).attr('title'), $(this).attr('href'), $(this).attr('id'));
			e.preventDefault();
			return(false);

		});

	});

	init_accordions();

	initParallaxScroll();
	$(window).resize(parallaxScrollOnResize);

	ccd_preview(); //preview
	cp_mailto_tel_tracking();
});

function init_accordions() {
	var accordion_id = 0;
	var accordions = document.getElementsByClassName('ccd-accordion');
	for (var i = 0; i < accordions.length; i++) {
		var $accordion_wrapper = accordions[i];

		// find trs in accordion_wrapper
		var $trs = $accordion_wrapper.getElementsByTagName('tr');

		for(var j =0; j < $trs.length; j+= 2) {
			var $tr_title = $trs[j];
			var $tr_content = $trs[j+1];
			$tr_title.classList.add('ccd-accordion-title');
			$tr_content.classList.add('ccd-accordion-content');
			// add data to $tr_title containing accordion_id
			$tr_title.setAttribute('data-accordion-id', accordion_id);
			$tr_content.setAttribute('data-accordion-id', accordion_id);
			$tr_title.addEventListener('click', function() {
				var accordion_id = this.getAttribute('data-accordion-id');
				var $accordion_title = document.querySelector('.ccd-accordion-title[data-accordion-id="' + accordion_id + '"]');
				var $accordion_content = document.querySelector('.ccd-accordion-content[data-accordion-id="' + accordion_id + '"]');
				$accordion_title.classList.toggle('on');
				$accordion_content.classList.toggle('on');
				if (!$accordion_title.classList.contains('on')) {
					$accordion_content.style.height = null;
				} else {
					$accordion_content.style.height = $accordion_content.scrollHeight + 'px';
				}
			});

			accordion_id++;
		}
	}
}


var blogSearchInputFocus = function() {
	$('.blogSearchBtn').addClass("focus");
}

var blogSearchInputBlur = function() {
	$('.blogSearchBtn').removeClass("focus");
}

var doBlogSearch = function() {
	$('form[name="blogSearch"]').submit();
}

var createJQueryPopup = function(html, callback, removeScrollbars, fixPopup, scrollToChildSelector, scrollToOffset)
{
	jqueryPopupFixPopup = fixPopup || fixPopup == null ? true : false;

	if(removeScrollbars == null)
	{
		removeScrollbars = true;
	}

	jqueryPopupRemoveScrollbars = removeScrollbars;

	if($('#jqueryPopup').length == 0)
	{
		$('body').append('<div class="jqueryPopupBG" id="jqueryPopupBG" style="opacity: 0;"></div><div class="jqueryPopup" id="jqueryPopup"></div>');
	}

	$('#jqueryPopup').attr('class', 'jqueryPopup');

	if(jqueryPopupOpen)
	{

		cp_check_hidePopupCallback();

		$('#jqueryPopup').stop().animate({opacity: 0}, 300, 'linear', function()
			{
				cp_check_hidePopupCompleteCallback();
				$(this).css('display', 'none').empty();

				$('#jqueryPopup').append(html);

				$('#jqueryPopupBG').unbind("click").click(hidePopup);

				if(callback !== null && typeof callback == 'function') {
					callback();
				}

				showPopup(scrollToChildSelector, scrollToOffset);
			});
	}
	else
	{
		$('#jqueryPopup').append(html);

		$('#jqueryPopupBG').unbind("click").click(hidePopup);

		if(callback !== null && typeof callback == 'function') {
			callback();
		}

		showPopup(scrollToChildSelector, scrollToOffset);
	}

};

var bl_tag_cloud_callback = function() {
	if(cp_bl_tag_cloud_callback !== null && typeof cp_bl_tag_cloud_callback == 'function') {
		cp_bl_tag_cloud_callback();
	}
}

var showPopup = function(scrollToChildSelector, scrollToOffset) {
	jqueryPopupOpen = true;
	if(jqueryPopupRemoveScrollbars)
	{
		$('body').css({overflow: 'hidden', paddingRight: '17px'});
	}
	var positionStyle = 'fixed';
	if(!jqueryPopupFixPopup)
	{
		positionStyle = 'absolute';
	}
	$('#jqueryPopup').css('display', 'block').css('position', positionStyle).animate({opacity: 1}, jqueryPopupAnimInTime, 'swing');
	showPopupBG();

	if(scrollToChildSelector != null)
	{
		setTimeout(function(){
			var newScrollTop = $('#jqueryPopup').find(scrollToChildSelector).offset().top;
			if(scrollToOffset != null)
			{
				newScrollTop += parseInt(scrollToOffset);
			}

			$("html,body").animate({ scrollTop: newScrollTop }, 300);
		},1);
	}
};

var hidePopup = function() {

	cp_check_hidePopupCallback();

	$('#jqueryPopup').stop().animate({opacity: 0}, 300, 'linear', function() {
		cp_check_hidePopupCompleteCallback();
		$(this).css('display', 'none').empty();
		$('body').css({overflow: ''});
		if(jqueryPopupRemoveScrollbars)
		{
			$('body').css({paddingRight: '0px'});
		}
		jqueryPopupOpen = false;
	} );

	hidePopupBG();

	if(typeof(sp_enableMousewheel) !== undefined && typeof(sp_enableMousewheel) == 'function')
	{
		sp_enableMousewheel();
		sp_enableKeyboardControl();
	}
}

var showPopupBG = function() {
	if(typeof jqueryPopupOpacityOverride != "undefined")
	{
		jqueryPopupOpacity = jqueryPopupOpacityOverride;
	}
	$('#jqueryPopupBG').stop().css('display', 'block').animate({opacity: jqueryPopupOpacity}, jqueryPopupAnimInTime, 'swing');
}

var hidePopupBG = function() {
	$('#jqueryPopupBG').stop().animate({opacity: 0}, 300, 'linear', function() { $(this).css('display', 'none'); } );
}

var cp_popupShowImagePopup = function(title, imagePath, id) {

	if(title == null)
	{
		title = "";
	}

	if(id == null)
	{
		id = "";
	}

	var messageHTML = "";

	if(imagePath == null)
	{
		messageHTML = "";
	}
	else
	{
		messageHTML = '<img src="'+imagePath+'" />';
	}

	var popupHTML = '<div class="popupWindow cpImagePopup" id="'+id+'"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3>'+title+'</h3><div style="clear:both;"></div></div><div class="popupWindowBody">'+messageHTML+'<div style="clear:both;"></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('html,body').animate({scrollTop: 0}, 500, 'swing');

		$('.popupWindow #popupCloseBtn').click(hidePopup);

		cp_check_generalPopupCallback();

	}, false , false);

}

var cp_check_showPopupPostCVFormCallback = function() {
	if(typeof cp_showPopupPostCVFormCallback == "function")
	{
		cp_showPopupPostCVFormCallback();
	}
}

var cp_check_generalPopupCallback = function() {
	if(typeof cp_generalPopupCallback == "function")
	{
		cp_generalPopupCallback();
	}
}

var cp_check_hidePopupCallback = function() {
	if(typeof cp_hidePopupCallback == "function")
	{
		cp_hidePopupCallback();
	}
}

var cp_check_hidePopupCompleteCallback = function() {
	if(typeof cp_hidePopupCompleteCallback == "function")
	{
		cp_hidePopupCompleteCallback();
	}
}

var cp_check_showRCApplyPopupCallback = function() {
	if(typeof cp_showRCApplyPopupCallback == "function")
	{
		cp_showRCApplyPopupCallback();
	}
}

var cp_check_showCVManagerPopupCallback = function(welcomePopup) {
	if(typeof cp_showCVManagerPopupCallback == "function")
	{
		cp_showCVManagerPopupCallback(welcomePopup);
	}
}

var cp_check_showCVManagerPopupLoadedCallback = function() {
	if(typeof cp_showCVManagerPopupLoadedCallback == "function")
	{
		cp_showCVManagerPopupLoadedCallback();
	}
}

var cp_check_showLoginPopupCallback = function() {
	if(typeof cp_showLoginPopupCallback == "function")
	{
		cp_showLoginPopupCallback();
	}
}

var cp_check_showCreateAccountPopupCallback = function() {
	if(typeof cp_createAccountPopupCallback == "function")
	{
		cp_createAccountPopupCallback();
	}
}

var cp_check_passwordResetPopupCallback = function() {
	if(typeof cp_passwordResetPopupCallback == "function")
	{
		cp_passwordResetPopupCallback();
	}
}


var cp_popupShowOkPopup = function(title, messageHTML, scrollToTop, okCallback, okText) {

	if(messageHTML === undefined)
	{
		messageHTML = "";
	}

	if(scrollToTop === undefined)
	{
		scrollToTop = true;
	}

	okText = okText === undefined ? "OK" : okText;

	var popupHTML = '<div class="popupWindow okPopup"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3>'+title+'</h3><div style="clear:both;"></div></div><div class="popupWindowBody">'+messageHTML+'<div style="clear:both;"></div><div class="btn center ok" id="okBtn"><p>'+okText+'</p></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		if(scrollToTop) { $('html,body').animate({scrollTop: 0}, 500, 'swing'); }

		$('.popupWindow #popupCloseBtn, .popupWindow #okBtn').click(hidePopup);

		cp_check_generalPopupCallback();

		if(okCallback !== null && typeof okCallback == 'function') {
			okCallback();
		}

	}, !scrollToTop, !scrollToTop);

}

// var cp_popupShowOkCancelPopup = function(title, messageHTML, scrollToTop, OkCancelCallback, okText, cancelText) {

// 	if(messageHTML === undefined)
// 	{
// 		messageHTML = "";
// 	}

// 	if(scrollToTop === undefined)
// 	{
// 		scrollToTop = true;
// 	}

// 	okText = okText === undefined ? "OK" : okText;
// 	cancelText = cancelText === undefined ? "Cancel" : cancelText;

// 	var popupHTML = '<div class="popupWindow okPopup"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div><h3>'+title+'</h3><div style="clear:both;"></div></div><div class="popupWindowBody">'+messageHTML+'<div style="clear:both;"></div><div class="btn center cancel" id="cancelBtn"><p>'+cancelText+'</p></div><div class="btn center ok" id="okBtn"><p>'+okText+'</p></div></div><div class="popupWindowFooter"></div></div>';

// 	createJQueryPopup(popupHTML, function() {

// 		if(scrollToTop) { $('html,body').animate({scrollTop: 0}, 500, 'swing'); }

// 		$('.popupWindow #popupCloseBtn, .popupWindow #okBtn').click(hidePopup);

// 		cp_check_generalPopupCallback();

// 		if(OkCancelCallback !== null && typeof OkCancelCallback == 'function') {
// 			OkCancelCallback();
// 		}

// 	}, !scrollToTop, !scrollToTop);

// }


var cp_popupShowCreateAccountForm = function(e, fromJobBasketApply, fromNewApply) {

	linkedInSignupClicked = facebookSignupClicked = false;

	if(e) {	e.preventDefault(); }

	var fromJobBasketApplyVal = "0";

	cp_loginSignUpFromNewApply = 0;

	if(fromJobBasketApply == true)
	{
		fromJobBasketApply = "1";
		cp_loginSignUpFromNewApply = 2;
	}

	if(fromNewApply == true)
	{
		cp_loginSignUpFromNewApply = 1;
	}

	var popupHTML = '<div class="popupWindow createAccountPopupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupShowCreateAccountFormTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody"><form method="post" action="ca_login.php" name="frmLogin" id="frmLogin"><input type="hidden" name="mode" value="VALIDATE"><input type="hidden" name="from_rcv_id" value="'+getURLParameter('rcv_id')+'">';

	if(RCO_SOCIAL_SIGNUP)
	{
		popupHTML += '<div class="socialSignUpWrapper" id="socialSignUpWrapper"><div class="socialSignUpBtnContainer" id="socialSignUpBtnContainer">';

		if(typeof CPO_FACEBOOK_APP_ID !== 'undefined')
		{
			popupHTML += '<div class="btn left socialSignUpBtn facebook" id="socialSignUpBtnFacebook"><div class="inner">'+cp_facebookSignUpTitle+'</div></div><input type=\"hidden\" name=\"signup_facebook_id\" id=\"signup_facebook_id\" value=\"\" /><input type=\"hidden\" name=\"signup_facebook_url\" id=\"signup_facebook_url\" value=\"\" />';
		}

		if(typeof CPO_LINKEDIN_API_KEY !== 'undefined')
		{
			popupHTML += '<div class="btn left socialSignUpBtn linkedin loading" id="socialSignUpBtnLinkedin"><div class="inner">'+cp_linkedInSignUpTitle+'</div></div><input type=\"hidden\" name=\"signup_linkedin_id\" id=\"signup_linkedin_id\" value=\"\" /><input type=\"hidden\" name=\"signup_linkedin_url\" id=\"signup_linkedin_url\" value=\"\" />';
		}

		popupHTML += '<div style="clear:both;"></div></div><p class="socialSignInSuccess" id="socialSignInSuccess"></p></div>';
	}

	var usernameConfirm = '';

	var passwordConfirm = '';

	if(CPO_SIGNUP_EMAIL_PWORD_CONFIRM)
	{
		usernameConfirm = '<label class="loginLabel username usernameConfirm" name="for=syu_username_confirm"><input type="text" class="styled" name="syu_username_confirm" id="syu_username_confirm" title="Confirm Email Address" placeholder="Confirm Email Address" /><p>Confirm Email</p><div style="clear:both;"></div></label>';

		passwordConfirm = '<label class="loginLabel password passwordConfirm" name="for=syu_passwd_confirm"><input type="password" class="styled" name="syu_passwd_confirm" title="Confirm Password" id="syu_passwd_confirm" /><p>Confirm Password</p><div style="clear:both;"></div></label>';
	}

	var nameFields = RCO_SIGNUP_NAME ? '<label class="loginLabel firstname" name="for=syu_firstname"><input type="text" class="styled" name="syu_firstname" id="syu_firstname" title="First Name" placeholder="First Name" /><p>First Name</p><div style="clear:both;"></div></label><label class="loginLabel surname" name="for=syu_surname"><input type="text" class="styled" name="syu_surname" id="syu_surname" title="Surname" placeholder="Surname" /><p>Surname</p><div style="clear:both;"></div></label>' : '';

	popupHTML += '<p class="signUpError" id="signUpError">&nbsp;</p><input type="hidden" name="rcv_id" value=""><input type="hidden" name="fromemail" value=""><input type="hidden" name="vww" value="h"><input type="hidden" name="form_type" value="popup_create_account"><input type="hidden" name="from_job_basket_apply" value="'+fromJobBasketApply+'">'+nameFields+'<label class="loginLabel username" name="for=syu_username"><input type="text" class="styled" name="syu_username" id="syu_username" title="Email Address" placeholder="Email Address" /><p>Email</p><div style="clear:both;"></div></label>'+usernameConfirm+'<label class="loginLabel password" name="for=syu_passwd"><input type="password" class="styled" name="syu_passwd" title="Password" placeholder="Password" id="syu_passwd" /><p>Password</p><div style="clear:both;"></div></label>'+passwordConfirm+'<div class="btn center signUp" id="signUpSubmitBtn">'+cp_popupCreateAccountFormBtn+'</div></form></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('html,body').animate({scrollTop: 0}, 500, 'swing');

		$('#popupCloseBtn').click(hidePopup);
		$('#signUpSubmitBtn').click(cp_popupSignUpSubmit);

		$('#syu_username, #syu_passwd').focus(cp_popupParentLabelFocus).blur(cp_popupParentLabelBlur).keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  cp_popupSignUpSubmit(); }});
		initFormStyles();
		$('#signUpError').animate({opacity: 0}, 0, 'linear');

		if(linkedInSignupLoaded)
		{
			cp_initLinkedInSignUp();
		}

		if(cp_facebookSignupLoaded)
		{
			cp_initFacebookSignUp();
		}

		cp_check_generalPopupCallback();
		cp_check_showCreateAccountPopupCallback();

		var focusFieldID = RCO_SIGNUP_NAME ? 'syu_firstname' : 'syu_username';

		setTimeout(function() { $('#'+focusFieldID).focus(); }, 100);

	}, false , false);

}

var cp_initInlineCreateAccountForm = function($form) {

	$form.find('#signUpSubmitBtn').click(function(){ cp_popupSignUpSubmit($form); });
	$form.find('#signUpSubmitBtn2').click(function(){ cp_popupSignUpSubmit($form); });

	$form.find('#syu_username, #syu_passwd').focus(cp_popupParentLabelFocus).blur(cp_popupParentLabelBlur).keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  cp_popupSignUpSubmit($form); }});
	$form.find('#cp_inlineSignUpError').animate({opacity: 0}, 0, 'linear');

	if(linkedInSignupLoaded)
	{
		cp_initInlineLinkedInSignUp($form);
	}

	if(cp_facebookSignupLoaded)
	{
		cp_initInlineFacebookSignUp($form);
	}

}

var linkedInSignupClicked = false;
var linkedInSignupLoaded = false;

var cp_linkedInSignUpLoaded = function() {
	linkedInSignupLoaded = true;
	cp_initLinkedInSignUp();

	if(typeof cp_initRCApplyLinkedIn == 'function')
	{
		cp_initRCApplyLinkedIn();
	}
}

var cp_initLinkedInSignUp = function() {
	$('#socialSignUpBtnLinkedin').removeClass('loading').click(cp_signupWithLinkedInClick);
}

var cp_initInlineLinkedInSignUp = function($form) {
	// $form.find('#socialInlineSignUpBtnLinkedin').removeClass('loading').click(cp_inlineSignupWithLinkedInClick);
}

var cp_signupWithLinkedInClick = function() {

  if(!linkedInSignupClicked)
  {
    linkedInSignupClicked = true;
    $('#socialSignUpBtnLinkedin').addClass('loading');

    if(IN.User.isAuthorized())
    {

      IN.API.Profile("me").fields("id,firstName,lastName,emailAddress,phoneNumbers,publicProfileUrl").result(function (me) {

		var profile = me.values[0];
		var id = profile.id;
		var firstName = profile.firstName;
		var lastName = profile.lastName;
		var email = profile.emailAddress;
		var publicProfileUrl = profile.publicProfileUrl;

		$('#jqueryPopup input[name=signup_linkedin_url]').val(publicProfileUrl);
		$('#jqueryPopup input[name=signup_linkedin_id]').val(id);
		$('#jqueryPopup input[name=syu_firstname]').val(firstName);
		$('#jqueryPopup input[name=syu_surname]').val(lastName);
		$('#jqueryPopup input[name=syu_username]').val(email);
		$('#jqueryPopup input[name=syu_username_confirm]').val(email);

		//linkedInSignupClicked = false;
		cp_socialSignInComplete("linkedin");

      });
    }
    else
    {
      $('#applyWithLinkedInBtn').removeClass('loading');
      linkedInSignupClicked = false;
      IN.User.authorize(cp_signupWithLinkedInClick);
    }

  }

}

var facebookSignupClicked = false;
var cp_facebookSignupLoaded = false;

var cp_facebookLoginStatusCallback = function(response) {
	cp_facebookSignupLoaded = true;
	cp_facebookSignUpLoadedFunc();
	if(typeof facebookLoginStatusCallback == "function")
	{
		facebookLoginStatusCallback();
	}
	/*
	if (response.status === 'connected') {
		// connected
	} else if (response.status === 'not_authorized') {
		// not_authorized
	} else {
		// not_logged_in
	}
	*/
}

var cp_facebookSignUpLoadedFunc = function() {
	linkedInSignupLoaded = true;
	cp_initFacebookSignUp();

	if(typeof cp_initRCApplyFacebook == 'function')
	{
		cp_initRCApplyFacebook();
	}
}

var cp_initFacebookSignUp = function() {
	$('#socialSignUpBtnFacebook').removeClass('loading').click(cp_signupWithFacebookClick);
}

var cp_initInlineFacebookSignUp = function($form) {
	// $form.find('#socialInlineSignUpBtnFacebook').removeClass('loading').click(cp_inlineSignupWithFacebookClick);
}

var cp_signupWithFacebookClick = function() {

  if(!facebookSignupClicked)
  {
    facebookSignupClicked = true;
    $('#socialSignUpBtnFacebook').addClass('loading');

    FB.login(function(response){
        if(response.status == 'connected'){
            FB.api('/me', function(response) {

				var id = response.id;
				var firstName = response.first_name;
				var lastName = response.last_name;
				var email = response.email;
				var publicProfileUrl = response.link;

		        $('#jqueryPopup input[name=signup_facebook_url]').val(publicProfileUrl);
				$('#jqueryPopup input[name=signup_facebook_id]').val(id);
				$('#jqueryPopup input[name=syu_firstname]').val(firstName);
				$('#jqueryPopup input[name=syu_surname]').val(lastName);
				$('#jqueryPopup input[name=syu_username]').val(email);
				$('#jqueryPopup input[name=syu_username_confirm]').val(email);

				if(typeof signupWithFacebookCallback == "function")
				{
					signupWithFacebookCallback(response);
				}

			    //facebookSignupClicked = false;
			    cp_socialSignInComplete("facebook");
		    });
        }
        else
        {
	      $('#socialSignUpBtnFacebook').removeClass('loading');
	      facebookSignupClicked = false;
        }
    },{scope: 'email'});

  }

}

var cp_socialSignInComplete = function(socialNetwork) {

	linkedInSignupClicked = facebookSignupClicked = true;
	$('#socialSignUpBtnFacebook, #socialSignUpBtnLinkedin').removeClass('loading');

	var signUpMessage = ", please choose a password to finish sign up.";

	switch(socialNetwork)
	{
		case "facebook":
			signUpMessage = "Thank you for signing in with Facebook" + signUpMessage;
			break;
		case "linkedin":
			signUpMessage = "Thank you for signing in with Linkedin" + signUpMessage;
			break;
	}

	$('#socialSignInSuccess').html(signUpMessage);

	$('#jqueryPopup #syu_password').focus();

	$('#socialSignUpBtnContainer').animate({opacity: 0}, 300, 'linear', function() {

		$(this).css('display', 'none');

		$('#socialSignInSuccess').animate({opacity: 0}, 0, 'linear').css('display', 'block').animate({opacity: 1}, 500, 'linear');

	});

}

var cp_popupSignUpSubmit = function($form) {

	var isInline = $form != null && !$form.target;

	var $wrapper = isInline ? $form : $('#jqueryPopup');

	var firstname = RCO_SIGNUP_NAME ? $wrapper.find('#syu_firstname').val() : '';
	var surname = RCO_SIGNUP_NAME ? $wrapper.find('#syu_surname').val() : '';
	var email = $.trim($wrapper.find('#syu_username').val());
	var emailConfirm = $.trim($wrapper.find('#syu_username_confirm').val());
	var password = $wrapper.find('#syu_passwd').val();
	var passwordConfirm = $wrapper.find('#syu_passwd_confirm').val();
	var linkedin_id = $wrapper.find('#signup_linkedin_id').val();
	var linkedin_url = $wrapper.find('#signup_linkedin_url').val();
	var facebook_id = $wrapper.find('#signup_facebook_id').val();
	var facebook_url = $wrapper.find('#signup_facebook_url').val();
	var form_type = $wrapper.find('#form_type').val();

	if(linkedin_id == undefined) { linkedin_id = ""; }
	if(linkedin_url == undefined) { linkedin_url = ""; }
	if(facebook_id == undefined) { facebook_id = ""; }
	if(facebook_url == undefined) { facebook_url = ""; }
	if(form_type == undefined) { form_type = "syu_ca"; }

	if((!isInline && RCO_SIGNUP_NAME && firstname == "") || (isInline && $wrapper.find('#syu_firstname').length > 0 && firstname == ""))
	{
		cp_popupShowPopupError('Please type first name', $wrapper);
		$wrapper.find('#syu_firstname').focus();
	}
	else if((!isInline && RCO_SIGNUP_NAME && surname == "") || (isInline && $wrapper.find('#syu_surname').length > 0  && surname == ""))
	{
		cp_popupShowPopupError('Please type surname', $wrapper);
		$wrapper.find('#syu_surname').focus();
	}
	else if(email == "")
	{
		cp_popupShowPopupError('Please type your email address', $wrapper);
		$wrapper.find('#syu_username').focus();
	}
	else if(!validateEmail(email))
	{
		cp_popupShowPopupError('Please type a valid email address', $wrapper);
		$wrapper.find('#syu_username').focus();
	}
	else if(CPO_SIGNUP_EMAIL_PWORD_CONFIRM && emailConfirm == "")
	{
		cp_popupShowPopupError('Please confirm your email address', $wrapper);
		$wrapper.find('#syu_username_confirm').focus();
	}
	else if(CPO_SIGNUP_EMAIL_PWORD_CONFIRM && email != emailConfirm)
	{
		cp_popupShowPopupError('Your email addresses do not match', $wrapper);
		$wrapper.find('#syu_username_confirm').focus();
	}
	else if(password == "")
	{
		cp_popupShowPopupError('Please type a password', $wrapper);
		$wrapper.find('#syu_passwd').focus();
	}
	else if(!validatePassword(password))
	{
		cp_popupShowPopupError('Your password must be at least 6 characters', $wrapper);
		$wrapper.find('#syu_passwd').focus();
	}
	else if(CPO_SIGNUP_EMAIL_PWORD_CONFIRM && passwordConfirm == "")
	{
		cp_popupShowPopupError('Please confirm your password', $wrapper);
		$wrapper.find('#syu_password_confirm').focus();
	}
	else if(CPO_SIGNUP_EMAIL_PWORD_CONFIRM && password != passwordConfirm)
	{
		cp_popupShowPopupError('Your passwords do not match', $wrapper);
		$wrapper.find('#syu_password_confirm').focus();
	}
	else
	{
		cp_popupShowPopupError("", $wrapper);
		$wrapper.find('#syu_firstname, #syu_surname, #syu_username, #syu_passwd, #syu_username_confirm, #syu_passwd_confirm').attr('disabled','disabled');
		$wrapper.find('#signUpSubmitBtn p').html('Please wait...');
		$wrapper.find('#signUpSubmitBtn').addClass('loading').unbind('click');
		if(!isInline)
		{
			$('.popupWindow label').addClass('disabled');
			$('#popupCloseBtn, #jqueryPopupBG').unbind('click');
		}
		cp_popupDoSignUp(firstname, surname, email, password, linkedin_id, linkedin_url, facebook_id, facebook_url, form_type, $form);
	}

}

var cp_popupDoSignUp = function(firstname, surname, email, password, linkedin_id, linkedin_url, facebook_id, facebook_url, form_type, $form) {

	var dataObj = {
		syu_firstname : firstname,
		syu_surname : surname,
		syu_username : email,
		syu_passwd : password,
		syu_linkedin_id : linkedin_id,
		syu_linkedin_url : linkedin_url,
		syu_facebook_id : facebook_id,
		syu_facebook_url : facebook_url,
		form_type : form_type
	};

	$.ajax({
		type : 'POST',
		url : 'ajax_sign_up.php',
		dataType : 'html',
		data: dataObj,
		success : function(data){
			data = JSON.parse(data);
			cp_popupSignUpCallback(data, $form);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//alert('error');
		}
	});
}

var cp_popupSignUpCallback = function(data, $form) {

	var isInline = $form != null && !$form.target;

	var $wrapper = isInline ? $form : $('#jqueryPopup');

	$wrapper.find('#syu_firstname, #syu_surname, #syu_username, #syu_passwd, #syu_username_confirm, #syu_passwd_confirm').removeAttr('disabled');

	if(data.success)
	{
		if(data.requires_verification)
		{
			if(typeof cp_user_signup_verification_required_callback != "function")
			{
				// $wrapper.innerHTML = "<p>"+data.msg+"</p>";
				$wrapper.html("<p>"+data.msg+"</p>");
			}
			else {
				cp_user_signup_verification_required_callback(data,$form);
			}
		}
		else if(isInline)
		{
			cp_googleTagManagerTrack('user_registration_jobseeker_start'); //review this. is it really the right place, and are all entrances covered?
			$wrapper.submit();
		}
		else
		{
			cp_googleTagManagerTrack('user_registration_jobseeker_start');
			$('#frmLogin').submit();
		}
	}
	else
	{
		if(!isInline)
		{
			$('.popupWindow label').removeClass('disabled');
			$('#popupCloseBtn, #jqueryPopupBG').click(hidePopup);
		}

		$wrapper.find('#signUpSubmitBtn p').html('Sign up');
		$wrapper.find('#signUpSubmitBtn').removeClass('loading').click(function(){ cp_popupSignUpSubmit($form); });

		if (data.error_message == "emailused")
		{
			cp_popupShowPopupError("That email address is already in use, to login <span id='signUpLogin'>click here</span>", $wrapper);
			$wrapper.find('#syu_username').focus();
		}
		else
		{
			cp_popupShowPopupError("We encountered an error, please try again", $wrapper);
		}
	}
}

var cp_popupShowLoginForm = function(e, fromJobBasketApply, fromNewApply, sendToHome) {

	if(e) {	e.preventDefault(); }

	var fromJobBasketApplyVal = "0";

	cp_loginSignUpFromNewApply = 0;
	cp_loginSignUpSendToHome = 0;

	if(fromJobBasketApply == true)
	{
		fromJobBasketApply = "1";
		cp_loginSignUpFromNewApply = 2;
	}

	if(fromNewApply == true)
	{
		cp_loginSignUpFromNewApply = 1;
	}

	if(sendToHome == true)
	{
		cp_loginSignUpSendToHome = 1;
	}

	var popupHTML = '<div class="popupWindow loginPopupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupShowLoginFormTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody"><p class="signUpError" id="signUpError">&nbsp;</p><form method="post" action="ca_login.php" name="frmLogin" id="frmLogin"><input type="hidden" name="mode" value="VALIDATE"><input type="hidden" name="rcv_id" value=""><input type="hidden" name="fromemail" value=""><input type="hidden" name="vww" value="h"><input type="hidden" name="from_job_basket_apply" value="'+fromJobBasketApply+'"><label class="loginLabel username" name="for=syu_username"><input type="text" class="styled" name="syu_username" id="syu_username" title="Email Address" placeholder="Email Address" /><p>Email Address</p><div style="clear:both;"></div></label><label class="loginLabel password" name="for=syu_passwd"><input type="password" class="styled" name="syu_passwd" title="Password" placeholder="Password" id="syu_passwd" /><p>Password</p><div style="clear:both;"></div></label></form><div class="btn right login" id="loginSubmitBtn">'+cp_popupShowLoginFormBtn+'</div><div class="btn left forgotPassword" id="loginForgotPasswordBtn">'+cp_popupShowLoginFormForgot+'</div><div style="clear:both;"></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('html,body').animate({scrollTop: 0}, 500, 'swing');

		$('#popupCloseBtn').click(hidePopup);
		$('#loginSubmitBtn').click(cp_popupLoginSubmit);
		$('#loginForgotPasswordBtn').click(cp_popupShowPasswordReset);
		initFormStyles();
		$('#syu_username, #syu_passwd').focus(cp_popupParentLabelFocus).blur(cp_popupParentLabelBlur).keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  cp_popupLoginSubmit(); }});

		$('#signUpError').animate({opacity: 0}, 0, 'linear');

		cp_check_generalPopupCallback();
		cp_check_showLoginPopupCallback();

		setTimeout(function() { $('#syu_username').focus(); }, 100);
	}, false , false);
}

var cp_popupLoginSubmit = function($form) {

	var $wrapper = ($form != null && !$form.target) ? $form : $('#jqueryPopup');

	var email = $.trim($wrapper.find('#syu_username').val());
	var password = $wrapper.find('#syu_passwd').val();

	if(email == "")
	{
		cp_popupShowPopupError('Please type your email address');
		$wrapper.find('#syu_username').focus();
	}
	else if(!validateEmail(email))
	{
		cp_popupShowPopupError('Please type a valid email address');
		$wrapper.find('#syu_username').focus();
	}
	else if(password == "")
	{
		cp_popupShowPopupError('Please type your password');
		$wrapper.find('#syu_passwd').focus();
	}
	else
	{
		cp_popupShowPopupError("");
		$wrapper.find('#loginSubmitBtn p').html('Checking login...');
		$wrapper.find('#loginSubmitBtn').addClass('loading').unbind('click');
		$wrapper.find('#popupCloseBtn')
		$('#jqueryPopupBG').unbind('click');
		cp_popupPopupCheckLogin(email, password);
	}

}

var cp_popupPopupCheckLogin = function(email, password) {

	var dataObj = $('#frmLogin').serialize();
	$('#syu_username, #syu_passwd').attr('disabled','disabled');
	$('.popupWindow label').addClass('disabled');

	$.ajax({
		type : 'POST',
		url : 'ajax_check_login.php',
		dataType : 'html',
		data: dataObj,
		success : function(data){
			cp_popupLoginCallback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//alert('error');
		}
	});

}

var cp_popupLoginCallback = function(data) {

	$('#syu_username, #syu_passwd').removeAttr('disabled');

	if(data == "response=ok")
	{
		cp_googleTagManagerTrack('user_login');
		console.log("Log-in successful");
		//$('#frmLogin').submit();
		if(cp_loginSignUpFromNewApply == 1)
		{
			window.location.replace( addParameter(document.URL, 'launch_apply', '1') );
		}
		else if(cp_loginSignUpFromNewApply == 2)
		{
			window.location.replace( addParameter(document.URL, 'launch_apply', '2') );
		}
		else if(cp_loginSignUpSendToHome == 1 || PAGEID == CPI_ID_CALOGGEDOUT)
		{
			window.location.href = CP_ROOT;
		}
		else if(getURLParameter("skipto_cpi_id") != "null" && getURLParameter("skipto_cpi_id") != "")
		{
			window.location.href = "page.php?cpi_id="+getURLParameter("skipto_cpi_id");
		}
		else if(typeof cp_loginRedirectOverrideCPI_ID != "undefined")
		{
			window.location.href = CP_ROOT+cp_loginRedirectOverrideCPI_ID;
		}
		else
		{
			location.reload();
		}
	}
	else
	{
		$('#popupCloseBtn, #jqueryPopupBG').click(hidePopup);
		$('.popupWindow label').removeClass('disabled');
		$('#loginSubmitBtn p').html('Login');
		$('#loginSubmitBtn').removeClass('loading').click(cp_popupLoginSubmit);

		if(data == "wrongpassword")
		{
			cp_popupShowPopupError("Incorrect password, <span id='forgottenPassword'>click here</span> if you have forgotten it");
			$('#syu_passwd').focus();
		}
		else if(data == "wrongemail")
		{
			cp_popupShowPopupError(loginWrongEmailError);
			$('#syu_username').focus();
		}
		else if(data == "unverifiedemail")
		{
			cp_popupShowPopupError("Please verify your email before logging in");
		}
		else
		{
			cp_popupShowPopupError("We encountered an error, please try again");
		}
	}
}

var cp_popupShowPasswordReset = function(e, fromJobBasketApply, ap_mode) {

	if(e) {	e.preventDefault(); }

	var fromJobBasketApplyVal = "0";

	if(fromJobBasketApply == true)
	{
		fromJobBasketApply = "1";
	}

	var ap_mode = ap_mode === true ? "1" : "0";

	var popupHTML = '<div class="popupWindow passwordResetPopupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupShowPasswordResetTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody"><p class="passwordResetInstructions">Please type your email address below and we will send you instructions on how to reset your password and regain access to your account.</p><p class="signUpError" id="signUpError">&nbsp;</p><form method="post" name="frmPasswordReset" id="frmPasswordReset"><input type="hidden" name="ap_mode" value="'+ap_mode+'" ><label class="loginLabel username" name="for=syu_username"><input type="text" class="styled" name="syu_username" id="syu_username" title="Email Address" placeholder="Email Address" /><p>Email Address</p><div style="clear:both;"></div></label></form><div class="btn right passwordResetSubmit" id="passwordResetSubmitBtn"><p>Submit</p></div><div style="clear:both;"></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('html,body').animate({scrollTop: 0}, 500, 'swing');

		$('#popupCloseBtn').click(hidePopup);
		$('#passwordResetSubmitBtn').click(cp_popupPasswordResetSubmit);
		initFormStyles();
		$('#syu_username').focus(cp_popupParentLabelFocus).blur(cp_popupParentLabelBlur).keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  cp_popupPasswordResetSubmit(); }});

		$('#signUpError').animate({opacity: 0}, 0, 'linear');

		cp_check_generalPopupCallback();
		cp_check_passwordResetPopupCallback();


		setTimeout(function() { $('#syu_username').focus(); }, 100);
	}, false , false);
}

var cp_popupPasswordResetSubmit = function() {

	if(!cp_passwordResetFormClicked)
	{
		cp_passwordResetFormClicked = true;
		$('#passwordResetSubmitBtn').addClass('loading');

		var email = $.trim($('#frmPasswordReset #syu_username').val());

		if(email == "")
		{
			cp_popupShowPopupError('Please type your email address');
			$('#syu_username').focus();

			cp_passwordResetFormClicked = false;
			$('#passwordResetSubmitBtn').removeClass('loading');
		}
		else if(!validateEmail(email))
		{
			cp_popupShowPopupError('Please type a valid email address');
			$('#syu_username').focus();

			cp_passwordResetFormClicked = false;
			$('#passwordResetSubmitBtn').removeClass('loading');
		}
		else
		{

			$.ajax({
				type : 'POST',
				url : 'ajax_reset_password_send.php',
				dataType : 'html',
				data: {syu_username: email, ap_mode: $('#frmPasswordReset').find('input[name="ap_mode"]').val()},
				success : function(data){
					cp_popupPasswordResetCallback(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					cp_popupShowPopupError('An error occurred');
					cp_passwordResetFormClicked = false;
					$('#passwordResetSubmitBtn').removeClass('loading');
				}
			});
		}

	}
}

var cp_popupPasswordResetCallback = function(data) {
	if(data == "success")
	{
		$('.popupWindowBody p, .popupWindowBody form').animate({opacity: 0}, 300, 'linear', function() {

			$('.popupWindowBody').html("");

			$successElm = $('<p class="passwordResetSuccess success1">Thank you, you should receive an email with instructions on how to reset your password shortly.</p><p class="passwordResetSuccess success2">If you don\'t receive it within 5 minutes please check your spam folder.</p>').appendTo('.popupWindowBody').animate({opacity: 0}, 0, 'linear').animate({opacity: 1}, 300, 'linear');

		});
	}
	else
	{
		cp_popupShowPopupError('Incorrect email address, please check it is typed correctly');
		cp_passwordResetFormClicked = false;
		$('#passwordResetSubmitBtn').removeClass('loading');
	}
}

var cp_initNewPasswordResetForm = function() {
	$('#passwordResetFormWrapper #syu_passwd').focus();
	$('#passwordResetFormWrapper #syu_passwd, #passwordResetFormWrapper #syu_passwd_confirm').keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  cp_newPasswordResetFormSubmit(); }});
	$('#passwordResetFormWrapper #passwordResetNewPasswordSubmit').click(cp_newPasswordResetFormSubmit);

}

var cp_newPasswordResetFormSubmit = function() {

	if(!cp_newPasswordResetFormClicked)
	{
		cp_newPasswordResetFormClicked = true;
		$('#passwordResetFormWrapper #passwordResetNewPasswordSubmit').addClass('loading');

		var new_password_mode = $('#new_password_mode').val();

		var callback_function = new_password_mode == 'client_area' ? cp_clientAreaPasswordResetCallback : cp_newPasswordResetCallback;

		$.ajax({
			type : 'POST',
			url : 'syu_ajax_new_password.php',
			dataType : new_password_mode == 'client_area' ? 'json' : 'html',
			data: {
				  pwdresetcode: $('#passwordResetFormWrapper #pwdresetcode').val()
				, syu_id: $('#passwordResetFormWrapper #syu_id').val()
				, syu_passwd: $('#passwordResetFormWrapper #syu_passwd').val()
				, syu_passwd_confirm: $('#passwordResetFormWrapper #syu_passwd_confirm').val()
				, new_password_mode: new_password_mode
			},
			success : callback_function,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert('An error occurred');
				cp_newPasswordResetFormClicked = false;
				$('#passwordResetFormWrapper #passwordResetNewPasswordSubmit').removeClass('loading');
			}
		});

	}
}

var cp_newPasswordResetCallback = function(data) {

	if(data == "success")
	{
		alert("Password changed successfully.");
		if(cp.config.recruitment.job_board_mode_enabled)
		{
			location.href = CP_BASE_URL+"sign-in/740/";
		}
		else
		{
			//cp_popupShowLoginForm(null,null,null,true);
			var default_behaviour = true;
			if(typeof cp_newPasswordResetSuccessCallback == "function")
			{
				default_behaviour = cp_newPasswordResetSuccessCallback() !== true;
			}

			if(default_behaviour)
			{
				$('#passwordResetFormWrapper').html('<p>Password changed successfully. You can login as normal.</p>');
			}
		}
	}
	else if(data == "invalid")
	{
		alert("Passwords must be at least 8 characters in length and include at least 1 letter and 1 number");
		cp_newPasswordResetFormClicked = false;
		$('#passwordResetNewPasswordSubmit').removeClass('loading');
	}
	else if(data == "nomatch")
	{
		alert("Your passwords do not match");
		cp_newPasswordResetFormClicked = false;
		$('#passwordResetNewPasswordSubmit').removeClass('loading');
	}
	else if(data == "wrongcode" || data == "expired")
	{
		alert("Your reset link has expired, please reset your password again");
		cp_newPasswordResetFormClicked = false;
		$('#passwordResetNewPasswordSubmit').removeClass('loading');
		cp_popupShowPasswordReset();
	}
	else
	{
		alert("An error occurred, please try again");
		cp_newPasswordResetFormClicked = false;
		$('#passwordResetNewPasswordSubmit').removeClass('loading');
	}

}

var cp_clientAreaPasswordResetCallback = function(data) {

	if(data.success)
	{
		if(data.destination)
		{
			new_ca_show_login_error("Password saved, logging you in now...");
			setTimeout(function(){
				location.href = data.destination;
			}, 2000); // give the user 2 seconds to read the message
		}
		else
		{
			new_ca_show_login_error("Password saved, please log in.");
			$('#passwordResetNewPasswordSubmit').remove();
		}
	}
	else
	{
		if(data.error == "invalid")
		{
			new_ca_show_login_error("Passwords must be at least 8 characters in length and include at least 1 letter and 1 number");
		}
		else if(data.error == "nomatch")
		{
			new_ca_show_login_error("Your passwords do not match");
		}
		else if(data.error == "wrongcode" || data.error == "expired")
		{
			var link_string = getURLParameter("reset_mode") == "invitation" ? "invitation" : "new password link";
			var again_string = getURLParameter("reset_mode") == "invitation" ? "" : " again";

			new_ca_show_login_error("Your "+link_string+" has expired, <a href=\"login/forgot-password/\">please click here to reset your password"+again_string+".</a>");
		}
		else
		{
			new_ca_show_login_error("An error occurred, please try again");
		}

		cp_newPasswordResetFormClicked = false;
		$('#passwordResetNewPasswordSubmit').removeClass('loading');
	}
}

var cp_popupParentLabelFocus = function() {
	var $parent = $(this).parent();
	if($parent.is("label"))
	{
		$parent.addClass('focus');
	}
}

var cp_popupParentLabelBlur = function() {
	var $parent = $(this).parent();
	if($parent.is("label"))
	{
		$parent.removeClass('focus');
	}
}

var cp_popupShowPopupError = function(errorText, $wrapper) {

	if($wrapper == null)
	{
		$wrapper = $('#jqueryPopup');
	}

	if(errorText != "")
	{
		if($wrapper.find('#signUpError').html() == "&nbsp;")
		{
			$wrapper.find('#signUpError').stop().html(errorText).animate({opacity: 1}, 300, 'linear');
			$wrapper.find('#forgottenPassword').click(cp_popupShowPasswordReset);
			$wrapper.find('#loginSignUp').click(cp_popupShowCreateAccountForm);
			$wrapper.find('#signUpLogin').click(cp_popupShowLoginForm);
		}
		else
		{
			$wrapper.find('#signUpError').stop().animate({opacity: 0}, 200, 'linear', function()
				{
					$wrapper.find(this).html(errorText).animate({opacity: 1}, 300, 'linear');
					$wrapper.find('#forgottenPassword').click(cp_popupShowPasswordReset);
					$wrapper.find('#loginSignUp').click(cp_popupShowCreateAccountForm);
					$wrapper.find('#signUpLogin').click(cp_popupShowLoginForm);
				});
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

var cp_initApplyForm = function() {

	cp_fineUploader = new qq.FineUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: document.getElementById('cvUploadWrapper'),

	    button: document.getElementById('cvUploadBtn'),

	    maxConnections: 1,

	    request: {
	        // path to server-side upload script
	        endpoint: 'rc_ajax_cv_uploader.php',
	        params: {"lastFile": $('#apply_file').val()}
	        //params: {"companyID": $('#company_id').val(), "companyName": $('#company_name').val()}
	    },

	    callbacks: {
	        onComplete: cp_applyCVUploadComplete,
	        onSubmit: cp_applyCVUploadStart
	    }
	});

	$('#rcApplySubmitBtn').click(cp_applyFormSubmit);

}

var cp_showPopupPostCVForm = function() {
	applyFormFlow = 1;
	//Whilst we cannot have two version of the same form on a page it will now scroll to the Form on the page instead of doing the popup
	if (!$("#cpForm-17").length > 0) {
		var popupHTML = '<div class="popupWindow" id="popupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupPostCVTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody" id="popupWindowBody"><div class="popupLoadingAnim"></div></div><div class="popupWindowFooter"></div></div>';

		createJQueryPopup(popupHTML, function() {

			$('#popupWindow').addClass('postCVPopup');
			$('#popupCloseBtn').click(hidePopup);

			$.ajax({
				type : 'POST',
				url : 'rc_ajax_get_post_cv_html.php',
				dataType : 'json',
				// data: {rcv_id: rcv_id},
				success: function(data){

					$('#popupWindowBody').html(data.html);
					initFormStyles();
					cp_check_generalPopupCallback();
					cp_check_showPopupPostCVFormCallback();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//alert('error');
				}
			});


		}, false, false);

		$('html,body').animate({scrollTop: 0}, 500, 'swing');

	} else {
		$('html,body').animate({scrollTop: $("#cpForm-17").offset().top}, 500, 'swing');
	}

}

var cp_initPostCVForm = function() {

	$('#cvChoice').find('.cvItem').click(cp_CVItemClick);
	$('#removeUploadBtn').click(cp_removeUploadClick);
	$('#postCVSubmitBtn').click(cp_submitPostCV);

	if(RCO_APPLY_NEW_CV != "off")
	{
		cp_selectCV($('#cvChoice .cvItem').first());

		cp_fineUploader = new qq.FineUploader({
		    // pass the dom node (ex. $(selector)[0] for jQuery users)
		    element: document.getElementById('cvUploadWrapper'),

		    button: document.getElementById('rcApplyNewFile'),

		    maxConnections: 1,

		    request: {
		        // path to server-side upload script
		        endpoint: 'rc_ajax_cv_uploader.php',
		        params: {"lastFile": $('#newUploadFilename').val()}
		        //params: {"companyID": $('#company_id').val(), "companyName": $('#company_name').val()}
		    },

		    callbacks: {
		        onComplete: cp_newApplyCVUploadComplete,
		        onSubmit: cp_newApplyCVUploadStart
		    }
		});
	}

}

var cp_submitPostCV = function() {

	var valid = true;

	if(valid && $.trim($('#frmPostCVNew #apply_firstname').val()) == "")
	{
		valid = false;
		alert("Please enter your first name");
		$('#frmPostCVNew #apply_firstname').focus();
	}

	if(valid && $.trim($('#frmPostCVNew #apply_surname').val()) == "")
	{
		valid = false;
		alert("Please enter your surname");
		$('#frmPostCVNew #apply_surname').focus();
	}

	if(valid && $.trim($('#frmPostCVNew #apply_email').val()) == "")
	{
		valid = false;
		alert("Please enter your email address");
		$('#frmPostCVNew #apply_email').focus();
	}

	if(valid && !validateEmail($.trim($('#frmPostCVNew #apply_email').val())))
	{
		valid = false;
		alert("Please enter a valid email address");
		$('#frmPostCVNew #apply_email').focus();
	}

	if(valid && $('#frmPostCVNew #apply_speciality').length > 0 && $.trim($('#frmPostCVNew #apply_speciality').val()) == "")
	{
		valid = false;
		alert("Please enter your speciality");
		$('#frmPostCVNew #apply_speciality').focus();
	}

	if(valid && $('#frmPostCVNew #apply_pin').length > 0 && $.trim($('#frmPostCVNew #apply_pin').val()) == "")
	{
		valid = false;
		alert("Please enter your NMC or HPC equivalent PIN No");
		$('#frmPostCVNew #apply_pin').focus();
	}

	if(valid && RCO_APPLY_NEW_CV == "on")
	{
		var rcc_id = $('#rcc_id').val();
		var newUploadFilename = $('#newUploadFilename').val();

		if(rcc_id == "" && newUploadFilename == "")
		{
			valid = false;
			alert("You must upload a CV");
		}
		else if(rcc_id == "" && !$('#rcApplyNewFile').hasClass("uploaded"))
		{
			valid = false;
			alert("You must upload a CV");
		}
	}

	if(valid)
	{
		cp_postCVNewFormSubmit();
	}
}

var cp_postCVNewFormSubmit = function() {

	if(!cp_postCVNewFormClicked)
	{
		cp_postCVNewFormClicked = true;

		var dataObj = $('#frmPostCVNew').serialize();

		$('#postCVSubmitBtn').addClass('loading');

		$.ajax({
			type : 'POST',
			url : 'rc_apply.php',
			dataType : 'json',
			data: dataObj,
			success : function(data){
				cp_postCVNewFormCallback(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert(errorThrown);
				cp_postCVNewFormClicked = false;
				$('#postCVSubmitBtn').removeClass('loading');
			}
		});

	}

}

var cp_postCVNewFormCallback = function(data) {

	if(data.result == "success")
	{
		cp_postCVNewFormSuccess();
	}
	else
	{
		alert(data.errorText);
		cp_postCVNewFormClicked = false;
		$('#postCVSubmitBtn').removeClass('loading');
	}
}

var cp_postCVNewFormSuccess = function() {

	if(typeof cp_postCVNewFormSuccessCallback != "function")
	{
		$('#postCVFormWrapper').stop().animate({height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}, 500, 'easeOutExpo', function() { $(this).remove(); } );
		var $applySuccess = $('#postCVSuccess').html(cp_postCVNewFormSuccessMsg);
		var $clone = $applySuccess.clone().appendTo('body');
		$clone.css("width", $applySuccess.outerWidth());
		var applySuccessHeight = $clone.height();
		$clone.remove();
		$applySuccess.stop().animate({opacity: 0, height: 0}, 0, 'linear').animate({height: applySuccessHeight}, 500, 'easeOutExpo').animate({opacity: 1}, 400, 'linear');
	}
	else {
		cp_postCVNewFormSuccessCallback();
	}
}

var cp_initMemberApplyForm = function() {

	$('#rcApplySubmitBtn').click(cp_memberApplyFormSubmit);

}

var cp_applyCVUploadStart = function(id, fileName) {

	cp_fineUploader._options.request.params.lastFile = $('#apply_file').val();
	$('#apply_file').val("");
	$('.qq-upload-list').empty();

}

var cp_applyCVUploadComplete = function(id, fileName, responseJSON) {

	if(responseJSON.error)
	{
		alert(responseJSON.error);
	}
	else
	{
		$('#apply_file').val(responseJSON.uploadName);
	}
}

var cp_applyFormSubmit = function() {

	if(!cp_applyFormClicked)
	{
		cp_applyFormClicked = true;

		var dataObj = $('#frmJobApply').serialize();

		$('#rcApplySubmitBtn').addClass('loading');

		$.ajax({
			type : 'POST',
			url : 'rc_apply.php',
			dataType : 'json',
			data: dataObj,
			success : function(data){
				cp_applyFormCallback(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				//alert('error');
				cp_applyFormClicked = false;
				$('#rcApplySubmitBtn').removeClass('loading');
			}
		});

	}

}

var cp_memberApplyFormSubmit = function() {

	if(!cp_applyFormClicked)
	{
		cp_applyFormClicked = true;

		var dataObj = $('#frmJobApply').serialize();

		$.ajax({
			type : 'POST',
			url : 'rc_apply.php',
			dataType : 'json',
			data: dataObj,
			success : function(data){
				cp_applyFormCallback(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				//alert('error');
				cp_applyFormClicked = false;
			}
		});

	}

}

var cp_applyFormCallback = function(data) {

	if(data.result == "success")
	{
		cp_applyFormSuccess();
	}
	else
	{
		cp_showAjaxFormError(data.errorObj.errorMessage, data.errorObj.fieldName);
		cp_applyFormClicked = false;
		$('#rcApplySubmitBtn').removeClass('loading');
	}
}

var cp_applyFormSuccess = function() {
	cp_googleTagManagerTrack('job_application');
	cp_showAjaxFormError("");
	if(typeof cp_applyFormSuccessOldCallback != "function")
	{
		$('#applyFormWrapper').stop().animate({height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}, 500, 'easeOutExpo', function() { $(this).remove(); } );

		var $applySuccess = $('#applySuccess').html("Thank you, your application has been sent.");

		var $clone = $applySuccess.clone().appendTo('body');
		var applySuccessHeight = $clone.height();
		$clone.remove();
		$applySuccess.stop().animate({opacity: 0, height: 0}, 0, 'linear').animate({height: applySuccessHeight}, 500, 'easeOutExpo').animate({opacity: 1}, 400, 'linear');
	}
	else {
		cp_applyFormSuccessOldCallback();
	}
}

var cp_showAjaxFormError = function(errorMessage, fieldName) {

	if(errorMessage != "")
	{
		if($('#ajaxFormError').html() == "&nbsp;")
		{
			$('#ajaxFormError').stop().animate({opacity: 0}, 0, 'linear').html(errorMessage).animate({opacity: 1}, 300, 'linear');
		}
		else
		{
			$('#ajaxFormError').stop().animate({opacity: 0}, 200, 'linear', function() {

				$(this).html(errorMessage).animate({opacity: 1}, 300, 'linear');

			});
		}

		if(fieldName != "")
		{
			$('input[name="'+fieldName+'"]').focus();
		}
	}
	else
	{
		$('#ajaxFormError').stop().animate({opacity: 0}, 200, 'linear', function() {

			$(this).html("&nbsp;");

		});
	}
}

// ref this stackoverflow solution https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {

	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);

}

function validatePassword(password) {

	return(password.length >= 6);

}

var doBackstretch = function($elm, options) {
/*
Video sources should be specified in the background-image css property in comma separated css3 multiple background syntax
For backwards compatability with browsers that don't support HTML5 video, use an image as the first image in the list, for eg:
background-image: url("images/fallback_image.jpg"), url("videos/the_video.mp4"), url("videos/the_video.webm"), url("videos/the_video.ogg");
*/
	var bgImage = $elm.css("background-image");
	if(bgImage != "none" && bgImage != "" && $elm.css("background-attachment") != "fixed")
	{
		$elm.css("background-image", "none");

		bgImageArr = [];
		var regexp = /\(["'](.*?)["']\)|\(([^(]*?)\)/igm;
		while (match = regexp.exec(bgImage))
		{
			var path = typeof match[1] == "undefined" ? match[2] : match[1];
			if(typeof path != "undefined" && path != "")
			{
				bgImageArr.push(path);
			}
			else
			{
				console.warn("doBackstretch: background-image contains some invalid properties", $elm);
			}
		}
		$elm.backstretch(bgImageArr, options);
	}
}

function CurrencyFormatted(amount, showPennies)
{
	if(showPennies == null)
	{
		showPennies = true;
	}

	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(showPennies)
	{
		if(s.indexOf('.') < 0) { s += '.00'; }
		if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	}
	else
	{
		s = s.split('.');
		s = s[0];
	}
	s = minus + s;
	return s;
}

function checkBelowIE(verNum) {

	if(verNum == null)
	{
		verNum = 9;
	}

	var ver = getInternetExplorerVersion();
	if (ver > -1) {
		if (ver >= verNum)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

function getInternetExplorerVersion() {
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

// condense hides floating points where the number is an integer >= 100
Number.prototype.formatMoney = function(precision, decimalChar, thousandChar, condense) {
	var n = this;
    precision = isNaN(precision = Math.abs(precision)) ? 2 : precision;
    condense = condense == undefined ? true : condense == true;
    if(condense && n >= 100 && n % 1 == 0)
    {
    	precision = 0;
    }
    decimalChar = decimalChar == undefined ? "." : decimalChar,
    thousandChar = thousandChar == undefined ? "," : thousandChar,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(precision)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + thousandChar : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandChar) + (precision ? decimalChar + Math.abs(n - i).toFixed(precision).slice(2) : "");
 };

function pad(num, size) {
	if(num.toString().length >= size)
	{
		return(num.toString());
	}

	var s = "000000000" + num;
	return s.substr(s.length-size);
}

var loop = function(num, min, max) {

	if(num < min)
	{
		num = max;
	}
	else if(max != null && num > max)
	{
		num = min;
	}

	return(num);
}

var clamp = function(num, min, max) {

	if(num < min)
	{
		num = min;
	}
	else if(max != null && num > max)
	{
		num = max;
	}

	return(num);
}

function getRelativeURL(url) {
	return(str_replace(SITE_ROOT, "", url == null ? location.href : url));
}

function getURLParameter(name, url) {
	if(url == null) { url = location.search; }
    return decodeURI(
        (RegExp('(&|\\?)' + name + '=' + '(.+?)(&|$)').exec(url)||[,null,null])[2]
    );
}

function getAllURLParameters(regex) {
	var search = location.search.substring(1);
	var obj = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {};

	if(regex)
	{
		obj = filter_object(obj, regex);
	}
	return(obj);
}

var filter_object = function(obj, regex) {
	var key, objs = [];
	for (key in obj) {
		if (obj.hasOwnProperty(key) && regex.test(key)) {
			objs[key] = obj[key];
		}
	}
	return objs;
}

function addParameter(url, param, value) {
	return(addURLParameter(url, param, value));
}

function addURLParameter(url, param, value) {
    // Using a positive lookahead (?=\=) to find the
    // given parameter, preceded by a ? or &, and followed
    // by a = with a value after than (using a non-greedy selector)
    // and then followed by a & or the end of the string
    var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
    	valAmper = new RegExp('(\\&)' + param + '=.*?(?=(&|$))'),
    	valEndAmper = new RegExp(param + '=.*?(?=(&|$))'+'(\\&)'),
    	valNoSym = new RegExp(param + '=.*?(?=(&|$))'+'(\\&)'),
        qstring = /\?.+$/;

    // Check if the parameter exists
    if (val.test(url))
    {
        // if it does, replace it, using the captured group
        // to determine & or ? at the beginning
        if(value == "")
        {
        	if(valAmper.test(url))
        	{
        		return url.replace(valAmper, '');
        	}
        	else
        	{
        		url = url.replace(valEndAmper, '');
        		url = url.replace(val, '');
        		return url.replace(valNoSym, '');
        	}
        }
        else
        {
        	return url.replace(val, '$1' + param + '=' + value);
        }
    }
    else if(value == "")
    {
    	return url;
    }
    else if (qstring.test(url))
    {
        // otherwise, if there is a query string at all
        // add the param to the end of it
        return url + '&' + param + '=' + value;
    }
    else
    {
        // if there's no query string, add one

        // is there a hash fragment?
        var hashFragmentMatches = url.match(/([^#]+)(#[\w-]+$)?/);
        var newURL = hashFragmentMatches[1] + '?' + param + '=' + value;
        if(typeof hashFragmentMatches[2] != "undefined")
        {
        	newURL += hashFragmentMatches[2];
        }
        return newURL;
    }
}

var timeBlock = function(desc, amount) {
	this.desc = desc;
	this.amount = amount;
}

var ago = function(date1, levels, futureLevels) {

	if(levels == null)
	{
		levels = 1;
	}

	if(futureLevels == null)
	{
		futureLevels = levels;
	}

	var date2 = new Date();
	date2 = date2.getTime();

	var blocks = Array(
		new timeBlock('year',    31536000000),
		new timeBlock('month',   2678400000),
		new timeBlock('week',    604800000),
		new timeBlock('day',     86400000),
		new timeBlock('hour',    3600000),
		new timeBlock('minute',  60000),
		new timeBlock('second',  1000)
	);

	var plural = "";
	var futurePlural = '\'s';
	var future = (date1 > date2);

	if(future)
	{
		levels = futureLevels;
	}

	var diff = Math.abs(date1 - date2);

	var current_level = 1;
	var result = Array();
	var i = 0;
	for(i = 0; i < blocks.length; i++)
	{
		var block = blocks[i];

		if (current_level > levels) {break;}
		if (diff/block.amount >= 1)
			{
			var amount = Math.floor(diff/block.amount);
			if (amount>1) {plural='s';} else {plural='';}
			result.push(amount + ' ' + block.desc + plural);
			diff -= amount * block.amount;
			current_level++;
			}
	}

	if(plural == 's')
	{
		futurePlural = '\'';
	}

	result = result.join(" ");

	if($.trim(result) == "")
	{
		result = "just now";
	}
	else if (future)
	{
		result = "in " + result + futurePlural + " time";
	}
	else
	{
		result = result + " ago";
	}

	return(result);
}

var cp_addTooltip = function($elm, text, xOffset, yOffset, direction, alwaysOn, className) {

	cp_setupTooltip("hover", $elm, text, xOffset, yOffset, direction, alwaysOn, className);

}

var cp_addTooltipOnFocus = function($elm, text, xOffset, yOffset, direction, alwaysOn, className) {

	cp_setupTooltip("focus", $elm, text, xOffset, yOffset, direction, alwaysOn, className);

}

var cp_setupTooltip = function(eventType, $elm, text, xOffset, yOffset, direction, alwaysOn, className) {

	$elm.each(function()
	{
		if(className == null)
		{
			className = "";
		}

		if(alwaysOn == null)
		{
			alwaysOn = false;
		}

		if(direction == null)
		{
			direction = "right";
		}

		if(xOffset == null)
		{
			xOffset = 0;
		}
		else if(typeof(xOffset) == 'string' && xOffset.indexOf("%") != -1)
		{
			xOffset = parseInt($(this).width() * (parseInt(xOffset) / 100));
		}

		if(yOffset == null)
		{
			yOffset = 0;
		}
		else if(typeof(yOffset) == 'string' && yOffset.indexOf("%") != -1)
		{
			yOffset = parseInt($(this).height() * (parseInt(yOffset) / 100));
		}

		$(this).data('xOffset', xOffset);
		$(this).data('yOffset', yOffset);
		$(this).data('direction', direction);

		var $wrapper = $('.siteContentContainer');
		$wrapper = $wrapper.length == 0 ? $('body') : $wrapper;

		var elmOffset = $(this).offset();
		var tableOffset = $wrapper.offset();
		xOffset += elmOffset.left - tableOffset.left - 29;
		yOffset += elmOffset.top - tableOffset.top - 76;

		$(this).data('toolipNum', cp_tooltipArray.length);

		var $tooltip = $('<div class="tooltip '+className+' transitioned" id="tooltip'+cp_tooltipArray.length+'" style="margin: '+yOffset+'px 0 0 '+xOffset+'px;"><div class="tooltipInner"><p>'+text+'</p></div><div class="tooltipArrow"></div></div>').prependTo($wrapper);

		if(direction == "left")
		{
			var tooltipWidth = $tooltip.width();
			var newBackgroundPosition = tooltipWidth - 23 - 10;
			xOffset -= tooltipWidth - (29 * 2);
			$tooltip.css({marginLeft: xOffset, backgroundPosition: newBackgroundPosition+"px 66px"});
		}

		if(!alwaysOn)
		{
			$tooltip.animate({opacity: 0}, 0, 'linear', function() { $(this).css('display', 'none'); });

			if(eventType == "hover")
			{
				$(this).hover(cp_tooltipOver, cp_tooltipOut);
			}
			else if(eventType == "focus")
			{
				$(this).focus(cp_tooltipOver).blur(cp_tooltipOut);
			}
		}

		cp_tooltipArray.push($tooltip);

		cp_check_tooltipCallback();

	});

}


var cp_check_tooltipCallback = function() {
	if(typeof cp_tooltipCallback == "function")
	{
		cp_tooltipCallback();
	}
}


var cp_tooltipOver = function() {
	var $popupContent = $('#tooltip' + $(this).data('toolipNum'));

	var delayAdd = 70;
	var runningDelay = 0;
	var i = 0;
	$('#tooltip' + $(this).data('toolipNum')).each(function(){

		var $this = $(this);

		setTimeout(function() { $this.removeClass("transitioned"); } , runningDelay);

		runningDelay += delayAdd;

		if(i % 3 == 2)
		{
			runningDelay = 50;
		}

		i++;

	});

	if(cp_tooltipMouseOutFix)
	{
		var i = 0;
		for(i = 0; i < cp_tooltipArray.length; i++)
		{
			if(i != $(this).data('toolipNum'))
			{
				cp_hideTooltop(i);
			}
		}
	}

	var $tooltip = $('#tooltip' + $(this).data('toolipNum'));

	var xOffset = $(this).data('xOffset');
	var yOffset = $(this).data('yOffset');

	if($(this).data('direction') == "left")
	{
		var tooltipWidth = $tooltip.width();
		var newBackgroundPosition = tooltipWidth - 23 - 10;
		xOffset -= tooltipWidth - (29 * 2);
		$tooltip.css({marginLeft: xOffset, backgroundPosition: newBackgroundPosition+"px 66px"});
	}

	var $wrapper = $('.siteContentContainer');
	$wrapper = $wrapper.length == 0 ? $('body') : $wrapper;

	var elmOffset = $(this).offset();
	var tableOffset = $wrapper.offset();
	xOffset += elmOffset.left - tableOffset.left - 29;
	yOffset += elmOffset.top - tableOffset.top - 76;

	$tooltip.stop().css({'display': 'block', 'margin': yOffset+'px 0 0 '+xOffset+'px'}).animate({opacity: 1}, cp_tooltipFadeInTime, cp_tooltipFadeInTransition);
}

var cp_tooltipOut = function() {
	cp_hideTooltop($(this).data('toolipNum'));
}

var cp_hideTooltop = function(num) {
	$('#tooltip' + num).stop().addClass("transitioned").animate({opacity: 0}, cp_tooltipFadeOutTime, cp_tooltipFadeOutTransition, function() { $(this).css('display', 'none'); });
}

var makeInputNumbersOnly = function($elm) {

	$elm.keydown(function(event){
		if (event.keyCode == 190 || event.keyCode == 110 || event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 89 && event.ctrlKey === true) || (event.keyCode == 86 && event.ctrlKey === true) || (event.keyCode == 67 && event.ctrlKey === true) || (event.keyCode == 88 && event.ctrlKey === true) || (event.keyCode == 90 && event.ctrlKey === true) || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

			if(event.keyCode == 190 || event.keyCode == 110)
	        {
	        	if($(this).val().indexOf(".") !== -1)
	        	{
	        		event.preventDefault();
	        	}
	        	else
	        	{
	        		return;
	        	}
	        }

        }
        else if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
	}).keyup(function(event){

		var oldValue = $(this).val();

		var newValue = oldValue.replace(/[^0-9\.]/g, '').toString();

		if(newValue.length > $elm[0].maxLength)
		{
			newValue = newValue.substr(0, $elm[0].maxLength);
		}

		newValue = parseFloat(newValue);

		if(!isNaN(newValue) && newValue != oldValue)
		{
			$(this).val(newValue);
		}

	});
}

//////////////////////

function location_autocomplete_init($inputElm) {

  if($inputElm.length > 0)
  {

	  $inputElm.autocomplete({

	  	appendTo: $inputElm.parent(),

	    // source is the list of input options shown in the autocomplete dropdown.
	    // see documentation: http://jqueryui.com/demos/autocomplete/
	    source: function(request,response) {

    		var region_filter = [];
    		if(typeof ljs_regions != "undefined")
    		{
    			region_filter = ljs_regions.split(',');
    		}
    		else
    		{
		    	$inputElm.parents('form').first().find('input[name^="regions"][value="true"]').each(function(){
	    			var matches = $(this).attr('name').match(/\[(\w\w)\]/);
					if(matches != null && matches[1] != null)
					{
						region_filter.push(matches[1]);
					}
	    		});
		    }

			$.ajax({
				type : 'POST',
				url : 'sy_loc_towns_autocomplete.php',
				dataType : 'json',
				data: {keywords: request.term, region_filter: region_filter},
				success : function(results){

					response($.map(results, function(item) {

			        	return {
							label: item,
							value: item
						}

			        }));

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//alert('error');
				}
			});

	    },

	    // event triggered when drop-down option selected
	    select: function(event,ui){
	      $inputElm.autocomplete("close");
		  $inputElm.val(ui.item.value).trigger("change");
	      // update_map( ui.item.geocode.geometry )
	    }
	  });

	  // triggered when user presses a key in the address box
	  $inputElm.bind('keydown', function(event) {
	    if(event.keyCode == 13) {
	      //geocode_lookup( 'address', $('#cLocation').val(), true );

	      // ensures dropdown disappears when enter is pressed
	      $inputElm.autocomplete("close").autocomplete("disable");
	    } else {
	      // re-enable if previously disabled above
	      $inputElm.autocomplete("enable");
	    }
	  });
	}
}

function keyword_autocomplete_init($inputElm) {

  if($inputElm.length > 0)
  {

	  $inputElm.autocomplete({

	  	appendTo: $inputElm.parent(),

	    // source is the list of input options shown in the autocomplete dropdown.
	    // see documentation: http://jqueryui.com/demos/autocomplete/
	    source: function(request,response) {

			$.ajax({
				type : 'POST',
				url : 'rc_keywords_autocomplete.php',
				dataType : 'json',
				data: request,
				success : function(results){

					response($.map(results, function(item) {

			        	return {
							label: item,
							value: item
						}

			        }));

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//alert('error');
				}
			});

	    },

	    // event triggered when drop-down option selected
	    select: function(event,ui){
	      $inputElm.autocomplete("close");
		  $inputElm.val(ui.item.value).trigger("change");
	    }
	  });

	  // triggered when user presses a key in the address box
	  $inputElm.bind('keydown', function(event) {
	    if(event.keyCode == 13) {
	      // ensures dropdown disappears when enter is pressed
	      $inputElm.autocomplete("close").autocomplete("disable");
	    } else {
	      // re-enable if previously disabled above
	      $inputElm.autocomplete("enable");
	    }
	  });
	}
}

var rcl_distance;

var initRCLDistance = function() {

	//email alert distance slider
	rcl_distance = $('#rcl_distance').val();
	if(rcl_distance == "")
	{
		rcl_distance = 5;
	}

	rcl_distance = (rcl_distance - 1) * (10000 / 50);

	$( '#jobListDistanceSlider' ).slider({
		value:rcl_distance,
		min: 0,
		max: 10000,
		slide: jobListDistanceOnSlide,
		change: jobListDistanceOnSlide,
		stop: jobListDistanceOnStop
	});

	$('#jobListDistanceTooltop').appendTo('#jobListDistanceSlider .ui-slider-handle');

	jobListDistanceOnSlide();
	//end email alert distance slider
}

var jobListDistanceOnStop = function(event, ui) {
  jobListDistanceOnSlide();
}

var jobListDistanceOnSlide = function(event, ui) {

  var newValue = 1 + Math.round(($( '#jobListDistanceSlider' ).slider('value') / 10000) * 50);

  $('#rcl_distance').val(newValue);

  var dataTypeHTML = "";

  if(newValue < 2)
  {
    dataTypeHTML = distance_unit_singular;
  }
  else
  {
    dataTypeHTML = distance_unit_plural;

    if(newValue >= 51)
    {
      newValue = "50+";
    }
  }

  var jobListWithinString = newValue + " " + dataTypeHTML;

  $('.rclDistanceSpan').html(jobListWithinString);
}

var cp_rcApplyBtnClick = function() {

	if(!$(this).hasClass("applied"))
	{
		var id = $(this).attr('id').split("applyBtn").join("");
		cp_showRCApply(id);
	}

}

var cp_showWelcomeCVManagerPopup = function() {
	cp_popupCVManagerTitle = '<h3>Welcome!</h3>';
	cp_showCVManagerPopup(true);
}

var cp_showCVManagerInline = function(inlineCallback) {
	cp_populateRCApplyPopup(cp_logged_in, false, true, inlineCallback);
}

var cp_showCVManagerPopup = function(welcomePopup) {

	welcomePopup = welcomePopup == null ? false : welcomePopup;
	var welcomePopupClass = welcomePopup ? " welcome" : "";

	applyFormFlow = 1;

	var popupHTML = '<div class="popupWindow'+welcomePopupClass+'" id="popupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupCVManagerTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody" id="popupWindowBody"><div class="popupLoadingAnim"></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('#popupWindow').addClass('rcApplyPopup');
		$('#popupCloseBtn').click(hidePopup);

		cp_populateRCApplyPopup(true, true);

		cp_check_generalPopupCallback();
		cp_check_showCVManagerPopupCallback(welcomePopup);


	}, false, false);

	$('html,body').animate({scrollTop: 0}, 500, 'swing');
}

var cp_showRCApply = function(rcv_id) {

	applyFormFlow = 1;

	var popupHTML = '<div class="popupWindow" id="popupWindow"><div class="popupWindowHeader"><div class="btn right close" id="popupCloseBtn"></div>'+cp_popupRcApplyTitle+'<div style="clear:both;"></div></div><div class="popupWindowBody" id="popupWindowBody"><div class="popupLoadingAnim"></div></div><div class="popupWindowFooter"></div></div>';

	createJQueryPopup(popupHTML, function() {

		$('#popupWindow').addClass('rcApplyPopup');
		$('#popupCloseBtn').click(hidePopup);

		cp_getLoginStatus(function(loginStatus){

			switch(loginStatus)
			{
				case 1://not logged in
					if(cp.config.recruitment.job_board_mode_enabled){
					//if(CPO_DEBUG && cp.config.recruitment.job_board_mode_enabled){
						RCO_APPLY_NEW_SIGNUP_REQUIRED = false;
						cp_populateRCApplyPopup(false);
					}
					else{
						cp_applyPopupNeedsLogin();
					}
					break;
				case 6://not logged in and rco_apply_new_signup_required is off
					cp_populateRCApplyPopup(false);
					break;
				case 2://logged in but no first/surname saved
					cp_applyPopupNameCollection();
					break;
				case 4://logged in but syu_setup_complete == "off"
					cp_applyPopupSignUpIncomplete();
					break;
				case 5://already applied
					cp_applyPopupAlreadyApplied();
					break;
				case 3://logged in
					cp_populateRCApplyPopup();
					break;
			}

		}, rcv_id);

		cp_check_generalPopupCallback();
		cp_check_showRCApplyPopupCallback();


	}, false, false);

	$('html,body').animate({scrollTop: 0}, 500, 'swing');

}

var cp_populateRCApplyPopup = function(loggedIn, cvManager, inline, inlineCallback) {

	loggedIn = loggedIn == null ? true : loggedIn;
	cvManager = cvManager == null ? false : cvManager;
	inline = inline == null ? false : inline;

	$('#popupWindowBody').addClass('grey');

	var newPopupHTML = '';

	if(!inline)
	{
		newPopupHTML += '<div class="newApplyFormWrapper" id="newApplyFormWrapper"><form id="frmJobApplyNew" name="frmJobApplyNew">';

		if(!cvManager && !loggedIn && !RCO_APPLY_NEW_SIGNUP_REQUIRED)
		{
			if(cp.config.recruitment.job_board_mode_enabled){

				newPopupHTML += '<div class="jobApplyBox signedOut"><label class="applyLabel apply_firstname" for="apply_firstname"><p>First Name</p><input type="text" class="styled" name="apply_firstname" id="apply_firstname" title="First Name" placeholder="First Name"><div style="clear:both;"></div></label><label class="applyLabel apply_surname" for="apply_surname"><p>Surname</p><input type="text" class="styled" name="apply_surname" id="apply_surname" title="Surname" placeholder="Surname"><div style="clear:both;"></div></label><label class="applyLabel apply_email" for="apply_email"><p>Email</p><input type="text" class="styled" name="apply_email" id="apply_email" title="Email Address" placeholder="Email Address"><div style="clear:both;"></div></label><input type="hidden" name="new_user_apply" id="new_user_apply" value="1"></div>';

				newUserApplyFlag = true;

				if($('.jobDetailInner').hasClass("apply_offsite")){
					//don't need a cover letter in this case
					RCO_APPLY_NEW_CL = "off";
				}
			}
			else{
				newPopupHTML += '<div class="jobApplyBox signedOut"><label class="applyLabel apply_firstname" for="apply_firstname"><p>First Name</p><input type="text" class="styled" name="apply_firstname" id="apply_firstname" title="First Name" placeholder="First Name"><div style="clear:both;"></div></label><label class="applyLabel apply_surname" for="apply_surname"><p>Surname</p><input type="text" class="styled" name="apply_surname" id="apply_surname" title="Surname" placeholder="Surname"><div style="clear:both;"></div></label><label class="applyLabel apply_phone" for="apply_phone"><p>Telephone</p><input type="text" class="styled" name="apply_phone" id="apply_phone" title="Telephone" placeholder="Telephone"><div style="clear:both;"></div></label><label class="applyLabel apply_email" for="apply_email"><p>Email</p><input type="text" class="styled" name="apply_email" id="apply_email" title="Email Address" placeholder="Email Address"><div style="clear:both;"></div></label></div>';
			}

		}
	}

	if(RCO_APPLY_NEW_CV != "off" || RCO_APPLY_NEW_CL != "off")
	{

		if(RCO_APPLY_NEW_CV != "off")
		{
			newPopupHTML += '<div class="jobApplyBox chooseCV"><p class="title">';

			if(!inline)
			{
				newPopupHTML += 'Choose a CV';

				if(RCO_APPLY_NEW_CV == "optional")
				{
					newPopupHTML += ' (optional)';
				}
			}

			newPopupHTML += '</p><div class="cvChoice loading" id="cvChoice"></div><input type="hidden" name="rcc_id" id="rcc_id" /><input type="hidden" name="newUploadFilename" id="newUploadFilename" /><div style="clear:both;"></div></div>';
		}

		if(!cvManager && !inline && RCO_APPLY_NEW_CL != "off")
		{
			newPopupHTML += '<div class="jobApplyBox chooseCoverLetter" id="chooseCoverLetter"><p class="title">Choose a Cover Letter';

			if(RCO_APPLY_NEW_CL == "optional")
			{
				newPopupHTML += ' (optional)';
			}

			newPopupHTML += '</p></div>';
		}
	}

	if(!inline)
	{
		var formMode = cvManager ? "CVMANAGERPOPUP" : "PROCESSAPPLYNEWAJAX";

		if(!cvManager && !loggedIn && !RCO_APPLY_NEW_SIGNUP_REQUIRED && cp.config.recruitment.job_board_mode_enabled){

			newPopupHTML += '<p class="popupFootnote">By applying with City Calling you agree to our <a href="/about/terms-and-conditions/603/" target="_blank">Terms & Conditions.</a></p>';
		}

		newPopupHTML += '<div class="btn right rcApplyConfirm" id="rcApplyConfirm"><div class="btnInner">'+cp_popupRcApplyConfirm+'</div></div><div style="clear:both;"></div><input type="hidden" name="mode" value="'+formMode+'"><input type="hidden" name="vww" value="h">';

		if(!cvManager)
		{
			var target_rcv = RCV_ID;

			newPopupHTML += '<input type="hidden" name="rcv_id" value="' + target_rcv + '">';
		}

		newPopupHTML += '</form></div><div class="newApplySuccess" id="newApplySuccess"></div>';

		$('#popupWindowBody').html(newPopupHTML);

		if(RCO_APPLY_NEW_CV != "off" || RCO_APPLY_NEW_CL != "off")
		{
			newApplyLoadNum = 0;

			if(!RCO_APPLY_NEW_CL != "off")
			{
				if(!cvManager)
				{
					cp_loadCoverLetterOptions(loggedIn, cp_newApplyLoadOptionsComplete);
				}
				else
				{
					newApplyLoadNum++;
				}
			}

			if(RCO_APPLY_NEW_CV != "off")
			{
				cp_loadCVOptions(loggedIn, function(){cp_newApplyLoadOptionsComplete(cvManager);});
			}

		}
		else
		{
			$('#rcApplyConfirm').click(cp_applyFormNewSubmit);
		}

		if(cvManager)
		{
			cp_check_showCVManagerPopupLoadedCallback();
		}
	}
	else
	{
		$('#cp_inline_cv_manager').html(newPopupHTML);

		if(RCO_APPLY_NEW_CV != "off")
		{
			cp_loadCVOptions(loggedIn, inlineCallback);
		}
	}

}

var cp_loadCVOptions = function(loggedIn, callback) {

	if(loggedIn == null)
	{
		loggedIn = true;
	}

	if(loggedIn)
	{
		$.get("rc_ajax_load_cv_options.php", function(data) {
			data = JSON.parse(data);
			cp_loadCVOptionsComplete(callback, data);
		});
	}
	else
	{
		cp_loadCVOptionsComplete(callback);
	}
}

var cp_loadCVOptionsComplete = function(callback, data) {

	if(data == null)
	{
		data = {responseCode: 1, cvArray: new Array()};
	}

	if(data.responseCode == 1)
	{
		var cvOptionHTML = "";

		var i = 0;

		for(i = 0; i < data.cvArray.length; i++)
		{
			var filename = data.cvArray[i].filename;

			var fileTypeClass = cp_getFileTypeClass(filename);

			if(i == 0)
			{
				fileTypeClass += ' on';
			}

			cvOptionHTML += '<div class="cvItem '+fileTypeClass+'" id="fileRCCID'+data.cvArray[i].rcc_id+'" title="'+filename+'"><p class="fileTitle">'+filename+'</p></div>';
		}

		cvOptionHTML += '<div class="cvItem new" id="rcApplyNewFile"><div class="removeUploadBtn" id="removeUploadBtn"></div><p class="fileTitle">'+cp_RcApplyCvfileTitle+'</p><div class="cvUploadWrapper" id="cvUploadWrapper"></div></div>';

		$('#cvChoice').removeClass('loading').html(cvOptionHTML).find('.cvItem').click(cp_CVItemClick);
		cp_selectCV($('#cvChoice .cvItem').first());
		$('#removeUploadBtn').click(cp_removeUploadClick);

		cp_fineUploader = new qq.FineUploader({
		    // pass the dom node (ex. $(selector)[0] for jQuery users)
		    element: document.getElementById('cvUploadWrapper'),

		    button: document.getElementById('rcApplyNewFile'),

		    maxConnections: 1,

		    request: {
		        // path to server-side upload script
		        endpoint: 'rc_ajax_cv_uploader.php',
		        params: {"lastFile": $('#newUploadFilename').val()}
		        //params: {"companyID": $('#company_id').val(), "companyName": $('#company_name').val()}
		    },

		    callbacks: {
		        onComplete: cp_newApplyCVUploadComplete,
		        onSubmit: cp_newApplyCVUploadStart
		    }
		});

	}

	if(callback != null && typeof callback == 'function') {
		callback();
	}

	if(typeof chooseCVCallback == 'function') {
		chooseCVCallback();
	}

}

var cp_getFileTypeClass = function(filename) {

	var fileTypeClass = "word";

	var extensionSplit = filename.split(".");
	if(extensionSplit[extensionSplit.length-1] == "pdf")
	{
		fileTypeClass = "pdf";
	}

	return(fileTypeClass);
}

var cp_newApplyCVUploadStart = function(id, fileName) {

	cp_setCVOn( $('#rcApplyNewFile') );
	cp_fineUploader._options.request.params.lastFile = $('#newUploadFilename').val();
	$('#newUploadFilename').changeVal("");
	$('#rcApplyNewFile p.fileTitle').html("Uploading...");
	$('.qq-upload-list').empty();

}

var cp_newApplyCVUploadComplete = function(id, fileName, responseJSON) {

	if(responseJSON.error)
	{
		alert(responseJSON.error);
		cp_removeUploadClick();
	}
	else
	{
		$('#newUploadFilename').changeVal(responseJSON.uploadName);
		$('#rcc_id').changeVal("");

		responseJSON.uploadName = responseJSON.uploadName.split("_");
		responseJSON.uploadName.splice(0,1);
		responseJSON.uploadName = responseJSON.uploadName.join("_");

		responseJSON.uploadName = responseJSON.uploadName.split(".");
		responseJSON.uploadName.splice( responseJSON.uploadName.length - 1, 1);
		responseJSON.uploadName = responseJSON.uploadName.join(".");

		$('#rcApplyNewFile').addClass( cp_getFileTypeClass(responseJSON.uploadName) ).addClass("uploaded").removeClass("new");

		$('#rcApplyNewFile p.fileTitle').html(responseJSON.uploadName);
	}
}

var cp_removeUploadClick = function() {

	$('#rcApplyNewFile').attr("class", "cvItem new").find("p.fileTitle").html(cp_RcApplyCvfileTitle);
	cp_selectCV( $('.cvChoice .cvItem').first() );
	$('.qq-upload-list').empty();

}

var cp_loadCoverLetterOptions = function(loggedIn, callback) {

	if(loggedIn == null)
	{
		loggedIn = true;
	}

	if(loggedIn)
	{
		$.get("rc_ajax_load_cover_letter_options.php", function(data) {

			data = JSON.parse(data);

			cp_loadCoverLetterOptionsComplete(callback, data);

		});
	}
	else
	{
		cp_loadCoverLetterOptionsComplete(callback);
	}

}

var cp_loadCoverLetterOptionsComplete = function(callback, data) {

	var rccl_content = "";
	var rccl_id = "";

	if(data == null)
	{
		data = {responseCode: 0};
	}

	if(data.responseCode == 1)
	{

		var i = 0;

		for(i = 0; i < data.clArray.length; i++)
		{
			rccl_content = data.clArray[i].rccl_content;
			rccl_id = data.clArray[i].rccl_id;
		}

	}

	var newHTML = '<input type="hidden" name="rccl_id" id="rccl_id" value="'+rccl_id+'"><textarea name="rccl_content" class="rccl_content" id="rccl_content">'+rccl_content+'</textarea>';
	$('#chooseCoverLetter').append(newHTML);

	var theme_advanced_buttons1 = "formatselect,|,bold,italic,underline,|,link,unlink,|,bullist,numlist,|,outdent,indent,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,hr,removeformat,charmap,iespell";
	var theme_advanced_buttons2 = "";
	var theme_advanced_buttons3 = "";

	if(mobile)
	{
		theme_advanced_buttons1 = "bold,italic,underline,|,undo,redo,hr";
	}

	var tinyMCEOptions = {
	    // General options
	    mode : "exact",
	    elements : "rccl_content",
	    theme : "advanced",

	    theme_advanced_blockformats : "p,h1,h2,h3,h4,h5,h6",
	    theme_advanced_buttons1 : theme_advanced_buttons1,
	    theme_advanced_buttons2 : theme_advanced_buttons2,
	    theme_advanced_buttons3 : theme_advanced_buttons3,
	    theme_advanced_toolbar_location : "top",
	    theme_advanced_toolbar_align : "left",
	    theme_advanced_statusbar_location : "bottom",
	    theme_advanced_resizing : !mobile,
	    valid_elements : ''
	        +'a[accesskey|charset|class|dir<ltr?rtl|href|hreflang|id|lang|name'
	          +'|style|title|type],'
	        +'br[class|clear<all?left?none?right|id|style|title],'
	        +'div[align<center?justify?left?right|class|title],'
	        +'em/i[class|dir<ltr?rtl|id|lang|style|title],'
	        +'font[class|color|dir<ltr?rtl|face|id|lang|size|style|title],'
	        +'h1[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'h2[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'h3[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'h4[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'h5[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'h6[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'hr[align<center?left?right|class|dir<ltr?rtl|id|lang|noshade<noshade|size|style|title|width],'
	        +'li[class|dir<ltr?rtl|id|lang|style|title|type|value],'
	        +'link[charset|class|dir<ltr?rtl|href|hreflang|id|lang|media|style|title|target|type],'
	        +'ol[class|compact<compact|dir<ltr?rtl|id|lang|start|style|title|type],'
	        +'p[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'small[class|dir<ltr?rtl|id|lang|style|title],'
	        +'span[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|style|title],'
	        +'strike[class|class|dir<ltr?rtl|id|lang|style|title],'
	        +'strong/b[class|dir<ltr?rtl|id|lang|style|title],'
	        +'style[dir<ltr?rtl|lang|media|title|type],'
	        +'sub[class|dir<ltr?rtl|id|lang|style|title],'
	        +'sup[class|dir<ltr?rtl|id|lang|style|title],'
	        +'table[align<center?left?right|bgcolor|border|cellpadding|cellspacing|class'
	          +'|dir<ltr?rtl|frame|height|id|lang|rules|style|summary|title|width],'
	        +'tbody[align<center?char?justify?left?right|char|class|charoff|dir<ltr?rtl|id'
	          +'|lang|style|title'
	          +'|valign<baseline?bottom?middle?top],'
	        +'td[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class'
	          +'|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|rowspan|scope<col?colgroup?row?rowgroup'
	          +'|style|title|valign<baseline?bottom?middle?top|width],'
	        +'tfoot[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl|id'
	          +'|lang|style|title'
	          +'|valign<baseline?bottom?middle?top],'
	        +'th[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class'
	          +'|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|rowspan|scope<col?colgroup?row?rowgroup'
	          +'|style|title|valign<baseline?bottom?middle?top|width],'
	        +'thead[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl|id'
	          +'|lang|style|title'
	          +'|valign<baseline?bottom?middle?top],'
	        +'tr[abbr|align<center?char?justify?left?right|bgcolor|char|charoff|class'
	          +'|rowspan|dir<ltr?rtl|id|lang|style'
	          +'|title|valign<baseline?bottom?middle?top],'
	        +'tt[class|dir<ltr?rtl|id|lang|onclick|ondblclick|style|title],'
	        +'u[class|dir<ltr?rtl|id|lang|style|title],'
	        +'ul[class|compact<compact|dir<ltr?rtl|id|lang|style|title|type]',
	            plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,"
	}

	if(mobile)
	{
	    tinyMCEOptions.width = "100%";
	}
	else
	{
		var textareaWidth = $('#rccl_content').width();

	    tinyMCEOptions.theme_advanced_resizing_max_width = textareaWidth;
	    tinyMCEOptions.theme_advanced_resizing_min_width = textareaWidth;
	}

	if(typeof tinyMCE != "undefined")
	{
		tinyMCE.init(tinyMCEOptions);
	}

	if(callback != null && typeof callback == 'function') {
		callback();
	}

	if(typeof chooseCoverLetterCallback == 'function') {
		chooseCoverLetterCallback();
	}

}

var cp_newApplyLoadOptionsComplete = function(cvManager) {

	cvManager = cvManager == null ? false : cvManager;

	newApplyLoadNum++;

	var totalLoadsRequired = 0;

	if(RCO_APPLY_NEW_CL != "off")
	{
		totalLoadsRequired++;
	}

	if(RCO_APPLY_NEW_CV != "off")
	{
		totalLoadsRequired++;
	}

	if(cvManager)
	{
		$('#rcApplyConfirm').click(cp_cvManagerPopupSubmit);
	}
	else if(newApplyLoadNum == totalLoadsRequired)
	{
		$('#rcApplyConfirm').click(cp_applyFormNewSubmit);
	}

}

var cp_applyFormNewSubmit = function($form) {

	if(!cp_applyFormNewClicked)
	{
		var valid = true;

		if($('#frmJobApplyNew #apply_firstname').length > 0)
		{
			if(valid && $.trim($('#frmJobApplyNew #apply_firstname').val()) == "")
			{
				valid = false;
				alert("Please type your first name");
				$('#frmJobApplyNew #apply_firstname').focus();
			}
			if(valid && $.trim($('#frmJobApplyNew #apply_surname').val()) == "")
			{
				valid = false;
				alert("Please type your surname");
				$('#frmJobApplyNew #apply_surname').focus();
			}

			if(valid && $.trim($('#frmJobApplyNew #apply_email').val()) == "")
			{
				valid = false;
				alert("Please type your email address");
				$('#frmJobApplyNew #apply_email').focus();
			}

			if(valid && !validateEmail($('#frmJobApplyNew #apply_email').val()))
			{
				valid = false;
				alert("Please type a valid email address");
				$('#frmJobApplyNew #apply_email').focus();
			}
		}

		var isInline = $form != null && !$form.target;
		var $wrapper = isInline ? $form : $('#jqueryPopup');

		if(RCO_APPLY_NEW_CV == "on")
		{
			if(cp.config.recruitment.job_board_mode_enabled && $('.jobDetailInner').hasClass("apply_offsite")){

			}
			else{
				var rcc_id = $('#rcc_id').val();
				var newUploadFilename = $('#newUploadFilename').val();

				if(rcc_id == "" && newUploadFilename == "")
				{
					valid = false;
					alert("You must upload a CV");
				}
				else if(rcc_id == "" && !$('#rcApplyNewFile').hasClass("uploaded"))
				{
					valid = false;
					alert("You must upload a CV");
				}
			}
		}

		var rccl_content = "";

		if(RCO_APPLY_NEW_CL != "off")
		{
			rccl_content = $.trim(tinyMCE.get('rccl_content').getContent());

			if(RCO_APPLY_NEW_CL == "on")
			{
				if(rccl_content.length == 0)
				{
					valid = false;
					alert("You must include a cover letter.");
				}
			}

			if(rccl_content.length > 8000)
			{
				valid = false;
				alert("Your cover letter is too long, please shorten it.");
			}
		}

		if(valid)
		{
			cp_applyFormNewClicked = true;

			if(RCO_APPLY_NEW_CL != "off")
			{
				$('#rccl_content').val(rccl_content);
			}

			var dataObj = $('#frmJobApplyNew').serialize();

			$('#rcApplyConfirm').addClass('loading');

			$.ajax({
				type : 'POST',
				url : 'rc_apply.php',
				dataType : 'json',
				data: dataObj,
				success : function(data){
					cp_applyFormNewCallback(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//alert('error');
					cp_applyFormNewClicked = false;
					$('#rcApplyConfirm').removeClass('loading');
				}
			});
		}

	}

}

var cp_cvManagerPopupSubmit = function() {

	if(!cp_cvManagerPopupClicked)
	{
		var cvAdded = true;

		var newUploadFilename = $('#newUploadFilename').val();

		if(newUploadFilename == "")
		{
			cvAdded = false;
		}

		if(cvAdded)
		{
			cp_cvManagerPopupClicked = true;

			var dataObj = $('#frmJobApplyNew').serialize();

			$('#rcApplyConfirm').addClass('loading');

			$.ajax({
				type : 'POST',
				url : 'rc_apply.php',
				dataType : 'json',
				data: dataObj,
				success : function(data){
					cp_cvManagerPopupCallback(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//alert('error');
					cp_cvManagerPopupClicked = false;
					$('#rcApplyConfirm').removeClass('loading');
				}
			});
		}
		else
		{
			hidePopup();
		}

	}

}

var cp_cvManagerPopupCallback = function(data) {

	cp_cvManagerPopupClicked = false;

	if(data.responseCode == 1 || data.responseCode == 2)
	{
		cp_cvManagerPopupSuccess(data.responseCode);
	}
	else
	{
		alert("There was an error processing your CV.");
		$('#rcApplyConfirm').removeClass('loading');
	}
}

var cp_cvManagerPopupSuccess = function(responseCode) {

	$('.jobApplyBox.chooseCV').stop().animate({height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}, 500, 'easeOutExpo', function() { $(this).remove(); } );
	$('#popupWindowBody').removeClass("grey");
	$('html,body').animate({scrollTop: 0}, 500, 'easeOutExpo');

	var applySuccessText = "Thank you, your CV has been uploaded.";

	$('#popupWindowBody #rcApplyConfirm p').html("Close");
	$('#popupWindowBody #rcApplyConfirm').unbind("click").click(hidePopup);

	var $applySuccess = $('#newApplySuccess').html(applySuccessText);
	var $clone = $applySuccess.clone().appendTo('body');
	var applySuccessHeight = $clone.height();
	$clone.remove();
	$applySuccess.stop().insertBefore('#popupWindowBody #rcApplyConfirm').animate({opacity: 0, height: 0}, 0, 'linear').animate({height: applySuccessHeight}, 500, 'easeOutExpo').animate({opacity: 1}, 400, 'linear');

}

var cp_applyFormNewCallback = function(data) {

	cp_applyFormNewClicked = false;

	if(data.responseCode == 1 || data.responseCode == 2)
	{
		cp_applyFormNewSuccess(data.responseCode);
	}
	else if(data.responseCode == 9){
		//alert("It appears that email address is already registered to an account. If you are the account owner, please login first and then submit your application again.");
		$('#rcApplyConfirm').removeClass('loading');

		var entered_email = $('#apply_email').val();

		var alreadyExistsHtml = '<p class="title">It appears you already have an account with us! Please enter your password to complete this application.</p><label class="applyLabel apply_email" for="apply_email"><p>Email</p><input type="text" class="styled" name="apply_email" id="apply_email" title="Email Address" value="'+entered_email+'"><div style="clear:both;"></div><label class="applyLabel apply_password" for="apply_password"><p>Password</p><input type="password" class="styled" name="apply_password" id="apply_password" title="Password"><div style="clear:both;"></div></label><input type="hidden" name="existing_user_apply" id="existing_user_apply" value="1">';

		var fromHeight = $('.jobApplyBox.signedOut').innerHeight();

		$('.jobApplyBox.signedOut').html(alreadyExistsHtml);

		var toHeight = $('.jobApplyBox.signedOut').innerHeight();

		$('.jobApplyBox.signedOut').stop().animate({height: fromHeight}, 0, 'linear').animate({height: toHeight}, 500, 'easeOutExpo');

		return;
	}
	else
	{
		alert("There was an error processing your application.");
		$('#rcApplyConfirm').removeClass('loading');
	}

	cp_check_applyFormSuccessCallback();
}

var cp_check_applyFormSuccessCallback = function() {
	if(typeof cp_applyFormSuccessCallback == "function")
	{
		cp_applyFormSuccessCallback();
	}
}

var cp_applyFormNewSuccess = function(responseCode) {

	//cp_showAjaxFormError("");

	cp_googleTagManagerTrack('job_application');

	if(RCO_JOB_APPLY_TRACKING_CODE != "")
	{
		$('body').prepend(RCO_JOB_APPLY_TRACKING_CODE);
	}

	if(CPI_ID == 513){
		$('#job'+RCV_ID).addClass("applied");
	}
	else{
		$('.rcApplyAppliedBtn').addClass("applied");
	}

	if(cp.config.recruitment.job_board_mode_enabled && newUserApplyFlag){
		var user_firstname = $('#apply_firstname').val();
	}

	$('#newApplyFormWrapper').stop().animate({height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}, 500, 'easeOutExpo', function() { $(this).remove(); } );
	$('#popupWindowBody').removeClass("grey");
	$('html,body').animate({scrollTop: 0}, 500, 'easeOutExpo');

	var applySuccessText = "Thank you, your application has been sent.";

	if(cp.config.recruitment.job_board_mode_enabled){
		applySuccessText = "<p class=\"applyMsg first\">Thank you. Your application has now been sent to the recruiter. If successful, the recruiter will contact you directly to explain the next steps.</p><p class=\"applyMsg\">Good luck with your job search!</p><p class=\"tip\">TIP: Be sure to carry out research on the Employer, Hiring Manager and Job Opportunity.</p>";
		if(newUserApplyFlag){
			trackEvent('Sign Up - Form Completed','Jobseeker');
			applySuccessText = "<p class=\"applyMsg first\">Thank you, "+user_firstname+". You are now being redirected...</p><div style=\"clear:both;\"></div>";
			if($('.jobDetailInner').hasClass("apply_offsite")){
				window.location = "/rc_erac.php?mode=jobApplyRedirectClick&new_user=1&rcv_id="+RCV_ID;
			}
			else{
				window.location = "/account-management/738/?instant_apply=1";
			}
		}
	}

	if(responseCode == 2)
	{
		applySuccessText = "You have already applied to this job.";
	}

	$('#newApplySuccess').html(applySuccessText);

	if(cp.config.recruitment.job_board_mode_enabled){
		$('.jobPushWrapper').clone().appendTo('#newApplySuccess');
	}

	var $applySuccess = $('#newApplySuccess');

	var $clone = $applySuccess.clone().appendTo('body');
	var applySuccessHeight = $clone.height();
	$clone.remove();
	$applySuccess.stop().animate({opacity: 0, height: 0}, 0, 'linear').animate({height: applySuccessHeight}, 500, 'easeOutExpo').animate({opacity: 1}, 400, 'linear');

}

var cp_CVItemClick = function() {

	cp_selectCV($(this));

}

var cp_selectCV = function($elm) {

	if(!$elm.hasClass("new"))
	{
		var id = $elm.attr("id");
		if(id == "rcApplyNewFile")
		{
			id = "";
		}
		else
		{
			id = id.split("fileRCCID").join("");
		}

		$('#rcc_id').changeVal(id);
		cp_setCVOn($elm);
	}

}

var cp_setCVOn = function($elm) {

	$('#cvChoice .cvItem').removeClass('on');
	$elm.addClass('on');

}

var cp_getLoginStatus = function(callback, rcv_id) {

	if(rcv_id == null)
	{
		rcv_id = "";
	}

	$.ajax({
		type : 'POST',
		url : 'login_apply_check.php',
		dataType : 'json',
		data: {rcv_id: rcv_id},
		success: function(data){

			if(callback != null && typeof callback == 'function') {
				callback(data.responseCode);
			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//alert('error');
		}
	});

}

var cp_applyPopupNeedsLogin = function() {

	var newPopupHTML = cp_popupApplyNeedsLoginHTML;
	$('#popupWindow').addClass('cp_applyPopupNeedsLogin');

	$('#popupWindowBody').html(newPopupHTML).find('#applyLoginBtn').click( function() { cp_popupShowLoginForm(null, true, true); } );
	$('#popupWindowBody').find('#applySignUpBtn').click( function() { cp_popupShowCreateAccountForm(null, true, true); } );

}

var cp_applyPopupAlreadyApplied = function() {

	var newPopupHTML = '<p>You have already applied to this job</p>';
	$('#popupWindowBody').html(newPopupHTML);

}

var cp_applyPopupSignUpIncomplete = function() {

	var newPopupHTML = '<p>You must complete your candidate profile to apply for jobs.</p><div class="btn center applyCompleteProfile" id="applyCompleteProfileBtn"><a href="'+rc_profileSetupURL+'?from_rcv_id='+getURLParameter('rcv_id')+'"><p>Continue</p></a></div><div style="clear:both;"></div>';

	$('#popupWindowBody').html(newPopupHTML);

}

var cp_applyPopupNameCollection = function() {

	var newPopupHTML = '<p class="signUpError" id="signUpError">&nbsp;</p><p>Please enter your name to continue:</p><label class="loginLabel firstname" name="for=syu_firstname"><input type="text" class="styled" name="syu_firstname" id="syu_firstname" title="First Name" /><p>First Name</p><div style="clear:both;"></div></label><label class="loginLabel surname" name="for=syu_surname"><input type="text" class="styled" name="syu_surname" id="syu_surname" title="Surname" /><p>Surname</p><div style="clear:both;"></div></label><div class="btn center nameSubmit" id="nameSubmitBtn"><p>Submit</p></div><div style="clear:both;"></div>';

	$('#popupWindowBody').html(newPopupHTML).find('#nameSubmitBtn').click(nameCollectionSubmit);

	$('#syu_firstname, #syu_surname').focus(cp_popupParentLabelFocus).blur(cp_popupParentLabelBlur).keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  nameCollectionSubmit(); }});

}

var nameCollectionSubmit = function() {

	var firstname = $('#syu_firstname').val();
	var surname = $('#syu_surname').val();

	if($.trim(firstname) == "")
	{
		cp_popupShowPopupError('Please type your first name');
		$('#syu_firstname').focus();
	}
	else if($.trim(surname) == "")
	{
		cp_popupShowPopupError('Please type your surname');
		$('#syu_surname').focus();
	}
	else
	{
		cp_popupShowPopupError("");
		$('#syu_firstname, #syu_surname').attr('disabled','disabled');
		$('.popupWindow label').addClass('disabled');
		$('#nameSubmitBtn p').html('Please wait...');
		$('#nameSubmitBtn').addClass('loading').unbind('click');
		$('#popupCloseBtn, #jqueryPopupBG').unbind('click');
		doNameCollectionSubmit(firstname, surname);
	}

}

var doNameCollectionSubmit = function(firstname, surname) {

	var dataObj = {
		syu_firstname : firstname,
		syu_surname : surname
	};

	$.ajax({
		type : 'POST',
		url : 'ajax_user_name_submit.php',
		dataType : 'html',
		data: dataObj,
		success : function(data){
			nameCollectionCallback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//alert('error');
		}
	});


}

var nameCollectionCallback = function(data) {

	$('#popupCloseBtn, #jqueryPopupBG').click(hidePopup);

	if(data == "success")
	{
		if(applyFormFlow == 1)
		{
			cp_populateRCApplyPopup();
		}
		else
		{
			applyToAllJobBasket();
		}
	}
	else
	{
		var newPopupHTML = '<p>An error occurred</p>';

		$('#popupWindowBody').html(newPopupHTML);
	}

}

var rc_erac_initUploader = function() {

	if($('#logoUploaderContainer').length > 0)
	{
		rc_erac_fineUploader = new qq.FineUploader({
	        // pass the dom node (ex. $(selector)[0] for jQuery users)
	        element: document.getElementById('logoUploaderContainer'),

	        button: document.getElementById('logoUploadWrapper'),

	        maxConnections: 1,

	        request: {
	            // path to server-side upload script
	            endpoint: 'cp_file_uploader.php',
	            params: {"lastFile": $('#syu_logo_new').val(), "mode": "rc_erac_logo"}
	            //params: {"companyID": $('#company_id').val(), "companyName": $('#company_name').val()}
	        },

	        callbacks: {
	            onComplete: rc_erac_EmpLogoUploadComplete,
	            onSubmit: rc_erac_EmpLogoUploadStart
	        }
	    });
	}

}

var rc_erac_EmpLogoUploadStart = function(id, fileName) {

  rc_erac_fineUploader._options.request.params.lastFile = $('#syu_logo_new').val();
  $('#syu_logo_new').val("");
  $('#logoUploadWrapper').removeClass("noFile");
  $('#logoUploadWrapper p.fileTitle').html("Uploading...");
  $('#logoUploadWrapper .qq-upload-list').empty();
  $('#logoUploadWrapper .logoUploadTitle').css("display", "none");
  $('#logoUploaderPreview img').remove();

}

var rc_erac_EmpLogoUploadComplete = function(id, fileName, responseJSON) {

  if(responseJSON.error)
  {
    alert(responseJSON.error);
  }
  else
  {
    $('#syu_logo_new').val(responseJSON.uploadName);
    $('#logoUploaderPreview img').remove();
    $('#logoUploaderPreview').append('<img src="' + responseJSON.uploadDirectory + "/" + responseJSON.uploadName + '">');
    $('#logoUploadWrapper p.fileTitle').html(responseJSON.uploadName);
    $('#logoUploadWrapper .logoUploadTitle').css("display", "block").html($('#logoUploadWrapper .qq-upload-success .qq-upload-file').html());
    $('#logoUploadWrapper .qq-upload-list').empty();
  }
}

var updateSalaryLock = function(e){

  var animTime = e ? 300 : 0;

  if($('input[name="rcv_salary_show_lock"]').val() == "true" || $('input[name="rcv_salary_show_lock"]').is(":checked"))
  {
    $('#salaryToggle1').stop().animate({height: 0}, animTime, 'swing');
    $('#salaryToggle2').stop().animate({height: salaryToggle2Height}, animTime, 'swing');
  }
  else
  {
    $('#salaryToggle2').stop().animate({height: 0}, animTime, 'swing');
    $('#salaryToggle1').stop().animate({height: salaryToggle1Height}, animTime, 'swing');
  }
}

var cp_googleTagManagerTrack = function(eventName)
{
	if(typeof dataLayer != "undefined")
	{
		dataLayer.push({'event': eventName})
	}
}

var cp_facebookPixelTrack = function(eventName, properties)
{
	if(typeof fbq != "undefined")
	{
		fbq('track', eventName, properties);
	}
}

function cp_mailto_tel_tracking() {
  	$("[href*='tel:'], [href*='mailto:']").click(function(e) {

  		if(cp.using_ga4)
  		{
  			e.preventDefault();

		    var href = $(this).attr('href');
		    // tel:
		    if(href.match(/^\s*tel:/i))
		    {
				cp.track_event('tel_link', {telephone_number: href.replace(/^\s*tel:\s*/i, '')});
		    }
		    else if(href.match(/^\s*mailto:/i))
		    {
				var matches = href.match(/mailto:([^?]+)/);
				if(matches !== null && matches.length > 1)
				{
					cp.track_event('mailto_link', {email_address: matches[1], mailto: href});
				}
		    }

			window.location = href;
  		}
  		else
  		{
		    e.preventDefault();
		    var href = $(this).attr('href');
		    // tel:
		    if (href.toLowerCase().indexOf("tel:") >= 0) {
		      eventCategory = 'Tel Link';
		      eventLabel = href.replace('tel:', '');
		    }

		    // mailto:
		    if (href.toLowerCase().indexOf("mailto:") >= 0) {
		      eventCategory = 'Email Link';
		      eventLabel = href.replace('mailto:', '');
		    }

		    cp.track_event(eventCategory, 'Click ' + window.location.pathname, eventLabel);

		    setTimeout(function() {
				window.location = href;
		    }, 500);
		}
  	});
}

var openLeanbackMode = function() {
	cp.set_cookie('ccd_leanback', 'true', 1);
	location.reload();
}

var closeLeanbackMode = function() {
	cp.remove_cookie('ccd_leanback');
	location.reload();
}

var stripHTML = function(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

var countWords = function(str)
{
	str = str.replace(/(^\s*)|(\s*$)/gi,"");
	str = str.replace(/[ ]{2,}/gi," ");
	str = str.replace(/\n /,"\n");
	return(str.split(' ').length);
}

function truncate_item_excerpt(vars) {
  if(vars[0] == "")
  {
    return "";
  }
  return(truncateStringToWord(vars[2], parseInt(vars[0]), false) + vars[1]);
}

function truncateStringToWord(str, length, addEllipsis)
{
    if(str.length <= length)
    {
        return(str);
    }

    str = str.substr(0, length+1);

    // cut any non-whitespace characters off the end of the string
    if (/[^\s]+$/.test(str))
    {
        str = str.replace(/[^\s]+$/, "");
    }

    // cut any remaining non-word characters
    str = str.replace(/[^\w]+$/, "");

    var ellipsis = addEllipsis && str.length > 0 ? '&hellip;' : '';

    return(str + ellipsis);
}

function temIfReplace(string, ifBool, ifStart, ifEnd) {

  if(string.indexOf(ifStart) !== -1)
  {
    var returnString = "";

    var split = string.split(ifStart);

    var i = 1;

    for (i = 1; i < split.length; i++) {
      var splitEnd = split[i].split(ifEnd);
      var splitStart = split[i-1];
      var splitMid = splitEnd[0];
      splitEnd = splitEnd[1];
      if(!ifBool)
      {
        returnString += splitStart + splitEnd;
      }
      else
      {
        returnString += splitStart + splitMid + splitEnd;
      }

      split[i] = split[i-1] = "";
    }

    return(returnString);
  }
  else
  {
    return(string);
  }

}

function getFormattedDate(dateFormat, date, inputDateFormat) {

    var phpMomentDateConversions = {"d":"DD","D":"ddd","j":"D","l":"dddd","N":"E","S":"o","w":"d","z":"DDD","W":"W","F":"MMMM","m":"MM","M":"MMM","n":"M","t":"","L":"","o":"GGGG","Y":"YYYY","y":"YY","a":"a","A":"A","B":"","g":"h","G":"H","h":"hh","H":"HH","i":"mm","s":"ss","u":"SSS","e":"z","I":"","O":"ZZ","P":"Z","T":"z","Z":"","c":"","r":"","U":"X"};

    dateFormat = dateFormat.split("");
    for(var j in dateFormat)
    {
           if(phpMomentDateConversions[dateFormat[j]] != null)
           {
                   dateFormat[j] = phpMomentDateConversions[dateFormat[j]];
           }
    }
    dateFormat = dateFormat.join("");

    inputDateFormat = inputDateFormat == null ? "X" : inputDateFormat;

    return(moment(parseInt(date),inputDateFormat).format(dateFormat));
}

function temDateTimeReplace(string, date, token) {

	var tokenStart = token.split("(");
	var tokenEnd = tokenStart[1];
	var tokenStart = tokenStart[0] + "(";

	var newString = "";

	if(string.indexOf(tokenStart) != -1)
	{
		var stringSplit = string.split(tokenStart);

		newString += stringSplit[0];

		var i = 1;
		for (i = 1; i < stringSplit.length; i++) {

			var newSplit = stringSplit[i].split(tokenEnd);
			var dateformat = newSplit.shift();

			newString += getFormattedDate(dateformat, date);
			newString += newSplit.join(tokenEnd);

		}

		return(newString);
	}
	else
	{
		return(string);
	}

}

function parameterReplace(theString, token, data) {
  var tokenStart = token.split("(");
  var tokenEnd = tokenStart[1];
  tokenStart = tokenStart[0] + "(";
  tokenEnd = tokenEnd.split(")");
  var paramDefaults = tokenEnd[0].split(",");
  tokenEnd = ")" + tokenEnd[1];

  var newString = "";

  if(theString.indexOf(tokenStart) !== -1)
  {
    var stringSplit = theString.split(tokenStart);

    newString += stringSplit[0];

    var i = 1;
    for (i = 1; i < stringSplit.length; i++) {

      var newSplit = stringSplit[i].split(tokenEnd);
      var params = newSplit[0].split(",");
      var paramReplaceString = new Array();

      var j = 0;
      for (j=0; j < paramDefaults.length; j++) {
        paramReplaceString.push('$$STOK|param'+(j+1)+'|ETOK$$');
        if(params[j] != null && params[j] != "")
        {
          paramDefaults[j] = params[j];
        }
      }

      var newDataString = str_replace(paramReplaceString, paramDefaults, data);

      newString += newDataString;
      newString += newSplit[1];

    }

    return(newString);
  }
  else
  {
    return(theString);
  }

}


function parameterFunctionReplace(string, token, function_name, THIS, addOnVarsArray, mapArrayToParams) {

	var tokenStart = token.split("(");
	var tokenEnd = tokenStart[1];
	tokenStart = tokenStart[0] + "(";
	tokenEnd = tokenEnd.split(")");

	var paramDefaults = tokenEnd[0].split(",");
	tokenEnd = ")" + tokenEnd[1];

	var newString = "";

	if(string.indexOf(tokenStart) != -1)
	{
		var stringSplit = string.split(tokenStart);

		newString += stringSplit[0];

		for (i=1; i < stringSplit.length; i++) {

			var newSplit = stringSplit[i].split(tokenEnd);
			var params = newSplit.shift().split(",");
			newSplit = newSplit.join(tokenEnd);

			var normalised_params = paramDefaults;

			for (j=0; j < normalised_params.length || j < params.length; j++) {
				if(typeof params[j] != 'undefined' && params[j] != ""){
					normalised_params[j] = params[j];
				}
			}
			normalised_params = normalised_params.concat(addOnVarsArray);

			var end_params = [];

			if(mapArrayToParams){
				//TODO
				//var newDataString = call_user_func_array(function_name, normalised_params);
		  		for(var j in normalised_params)
	  			{
	  				end_params.push("normalised_params["+j+"]");
	  			}

	  			end_params.join(",");
			}
			else
			{
				end_params = "normalised_params";
			}

	  		// var end_params = normalised_params.join();
	  		// console.log(end_params);
	  		var func_string = function_name + '('+end_params+');';
	  		var newDataString = eval(func_string);

			newString += newDataString;
			newString += newSplit;
		}

	  return(newString);
	}
	else
	{
	  return(string);
	}

}

function str_replace(search, replace, subject, count) {
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}

function initSimilarSelections() {

	$('.simSectSubmitBtn').click(function(){

		$('#simSect').submit();
	});

	$('#sectorMatrix td').mouseover(function(){
		var column = $(this).index() + 1;
		$('#sectorMatrix td:nth-child('+column+')').addClass("hovered");
	}).mouseout(function(){
		$('#sectorMatrix td.hovered').removeClass("hovered");
	});
}

function initSiteSearch() {

	$('input[name="site_search_ca_only"]').change(function(){
		$('#cp_sidebarSiteSearchForm').submit();
	});
}


/****************************************/
/************ Hamburger Menu ************/
/****************************************/

function cp_hamburger_menu_init(_options) {

	var defaults = {
		position: 'right'
	}

	var options = $.extend({}, defaults, _options);

	var positionClass = 'cp_hamburger_menu_' + options.position;

	window.$cp_hamburger_menu_wrapper = $('#cp_hamburger_menu_wrapper');

	var css_transition = window.$cp_hamburger_menu_wrapper.css('transition-duration');

	if(css_transition == "")
	{
		window.cp_hamburger_menu_transition_time = 0;
	}
	else
	{
		window.cp_hamburger_menu_transition_time = css_transition.match(/[ms]+/)[0] == "s" ? parseInt(parseFloat(css_transition) * 1000) : parseInt(css_transition);
	}

	var lineWidth = parseInt(window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_btn_inner span').css('width'));
	var rotatedAdjacent = Math.cos(45 * Math.PI/180) * lineWidth;
	var crossRotateVertMargin = parseFloat((rotatedAdjacent / 2) * -1).toFixed(1);
	var crossRotateHorzMargin = ((lineWidth - rotatedAdjacent) / 2);

	var bodyPrependHTML = ''
		+ "<style type=\"text/css\">\n"
		+ "body.cp_hamburger_menu_open .cp_hamburger_menu_btn_inner span:before {\n"
		+ "  margin-top: "+crossRotateVertMargin+"px;\n"
		+ "  margin-left: "+crossRotateHorzMargin+"px;\n"
		+ "}\n"
		+ "body.cp_hamburger_menu_open .cp_hamburger_menu_btn_inner span:after {\n"
		+ "  margin-bottom: "+crossRotateVertMargin+"px;\n"
		+ "  margin-left: "+crossRotateHorzMargin+"px;\n"
		+ "}\n"
		+ "</style>\n"
		+ "<div class=\"cp_hamburger_menu_backdrop\" id=\"cp_hamburger_menu_backdrop\"></div>\n"
	;

	var numCols = window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_col').length;
	window.cp_hamburger_menu_col_width = 100/numCols;
	window.$cp_hamburger_menu_mover = $('#cp_hamburger_menu_mover').width((numCols*100)+'%');
	window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_col').width(window.cp_hamburger_menu_col_width+'%');
	$('body').addClass('cp_hamburger_menu_on '+positionClass).prepend(bodyPrependHTML);
	window.$cp_hamburger_menu_wrapper.prependTo('body');
	$('.cp_hamburger_menu_btn').not('#cp_hamburger_menu_btn_back').click(cp_hamburger_menu_toggle);
	window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_sub_btn, .no_link_in_menu.item_has_children').not('.back').click(cp_hamburger_menu_show_submenu);
	window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_sub_btn.back').click(cp_hamburger_menu_close_submenu);
	$('#cp_hamburger_menu_btn_back, #cp_hamburger_menu_backdrop').click(cp_hamburger_menu_toggle);

	$('ul.cp_hamburger_menu_items li p a').each(function(){
		var hrefAttr = $(this).attr('href');
		if (hrefAttr == undefined || hrefAttr.indexOf('#') != -1) {
        	$(this).click(function(){
        		cp_hamburger_menu_close();
        	});
    	}
	});

	if(typeof cp_hamburger_menu_init_complete == 'function')
	{
		cp_hamburger_menu_init_complete();
	}

}

function cp_hamburger_menu_toggle() {
	if($('body').hasClass('cp_hamburger_menu_open'))
	{
		cp_hamburger_menu_close();
	}
	else
	{
		cp_hamburger_menu_open();
	}
}

function cp_hamburger_menu_open() {
	$(window).resize(cp_hamburger_menu_on_resize).resize();
	$('body').addClass('cp_hamburger_menu_open');
	$('body').css({overflow: 'hidden'});
	if(typeof cp_hamburger_menu_open_callback == 'function')
	{
		cp_hamburger_menu_open_callback();
	}
}

function cp_hamburger_menu_close() {
	$(window).unbind('resize', cp_hamburger_menu_on_resize);
	$('body').removeClass('cp_hamburger_menu_open').height('');

	$('body').addClass('cp_hamburger_menu_closing');
	if(typeof cp_hamburger_menu_on_close_callback == 'function')
	{
		cp_hamburger_menu_on_close_callback();
	}
	setTimeout(function(){
		cp_hamburger_menu_set_col(0);
		$('body').removeClass('cp_hamburger_menu_closing').css({overflow: ''});
		if(typeof cp_hamburger_menu_on_closed_callback == 'function')
		{
			cp_hamburger_menu_on_closed_callback();
		}
		// legacy
		else if(typeof cp_hamburger_menu_close_callback == 'function')
		{
			cp_hamburger_menu_close_callback();
		}
	}, window.cp_hamburger_menu_transition_time);
}

function cp_hamburger_menu_show_submenu() {

	var section_cpi_id = $(this).data('section-cpi-id');
	var col_num = $(this).data('col-num');

	$('#cp_hamburger_menu_col_'+col_num).find('.cp_hamburger_menu_items_section').hide();
	$('#section_cpi_id_'+section_cpi_id).show();

	cp_hamburger_menu_set_col(col_num);
}

function cp_hamburger_menu_close_submenu(){
	cp_hamburger_menu_set_col(window.cp_hamburger_menu_col_num-1);
}

function cp_hamburger_menu_set_col(col_num){

	var newX = col_num * -window.cp_hamburger_menu_col_width;

	var css = {
		  '-webkit-transform': 'translate3d('+newX+'%,0,0)'
		, '-moz-transform'   : 'translate3d('+newX+'%,0,0)'
		, '-ms-transform'    : 'translate3d('+newX+'%,0,0)'
		, '-o-transform'     : 'translate3d('+newX+'%,0,0)'
		, 'transform'        : 'translate3d('+newX+'%,0,0)'
	};

	window.$cp_hamburger_menu_mover.css(css);

	window.cp_hamburger_menu_col_num = col_num;
}

function cp_hamburger_menu_on_resize() {
	var windowHeight = $(window).height();
	$('body').height(windowHeight);
	window.$cp_hamburger_menu_wrapper.find('.cp_hamburger_menu_items_section').height(windowHeight);
}

/****************************************/
/********** Hamburger Menu End **********/
/****************************************/

function cp_addSmoothScroll(forceOn) {

	forceOn = forceOn === true;

	if(forceOn || (!mobile && !checkBelowIE(9) && Modernizr.Detectizr.device.os != "mac" && Modernizr.Detectizr.browser.name != "firefox" && (Modernizr.Detectizr.browser.name != "chrome" || parseInt(Modernizr.Detectizr.browser.major) < 49)))
	{
		//
		// SmoothScroll for websites v1.4.0 (Balazs Galambosi)
		// http://www.smoothscroll.net/
		// https://github.com/galambalazs/smoothscroll-for-websites/blob/master/SmoothScroll.js
		//
		// Licensed under the terms of the MIT license.
		//
		// You may use it in your theme if you credit me.
		// It is also free to use on any individual website.
		//
		// Exception:
		// The only restriction is to not publish any
		// extension for browsers or native application
		// without getting a written permission first.
		//

		!function(){function e(){z.keyboardSupport&&m("keydown",a)}function t(){if(!A&&document.body){A=!0;var t=document.body,o=document.documentElement,n=window.innerHeight,r=t.scrollHeight;if(B=document.compatMode.indexOf("CSS")>=0?o:t,D=t,e(),top!=self)X=!0;else if(r>n&&(t.offsetHeight<=n||o.offsetHeight<=n)){var a=document.createElement("div");a.style.cssText="position:absolute; z-index:-10000; top:0; left:0; right:0; height:"+B.scrollHeight+"px",document.body.appendChild(a);var i;T=function(){i||(i=setTimeout(function(){L||(a.style.height="0",a.style.height=B.scrollHeight+"px",i=null)},500))},setTimeout(T,10),m("resize",T);var l={attributes:!0,childList:!0,characterData:!1};if(M=new V(T),M.observe(t,l),B.offsetHeight<=n){var c=document.createElement("div");c.style.clear="both",t.appendChild(c)}}z.fixedBackground||L||(t.style.backgroundAttachment="scroll",o.style.backgroundAttachment="scroll")}}function o(){M&&M.disconnect(),h(I,r),h("mousedown",i),h("keydown",a),h("resize",T),h("load",t)}function n(e,t,o){if(p(t,o),1!=z.accelerationMax){var n=Date.now(),r=n-R;if(r<z.accelerationDelta){var a=(1+50/r)/2;a>1&&(a=Math.min(a,z.accelerationMax),t*=a,o*=a)}R=Date.now()}if(q.push({x:t,y:o,lastX:0>t?.99:-.99,lastY:0>o?.99:-.99,start:Date.now()}),!P){var i=e===document.body,l=function(n){for(var r=Date.now(),a=0,c=0,u=0;u<q.length;u++){var d=q[u],s=r-d.start,f=s>=z.animationTime,m=f?1:s/z.animationTime;z.pulseAlgorithm&&(m=x(m));var h=d.x*m-d.lastX>>0,w=d.y*m-d.lastY>>0;a+=h,c+=w,d.lastX+=h,d.lastY+=w,f&&(q.splice(u,1),u--)}i?window.scrollBy(a,c):(a&&(e.scrollLeft+=a),c&&(e.scrollTop+=c)),t||o||(q=[]),q.length?_(l,e,1e3/z.frameRate+1):P=!1};_(l,e,0),P=!0}}function r(e){A||t();var o=e.target,r=u(o);if(!r||e.defaultPrevented||e.ctrlKey)return!0;if(w(D,"embed")||w(o,"embed")&&/\.pdf/i.test(o.src)||w(D,"object"))return!0;var a=-e.wheelDeltaX||e.deltaX||0,i=-e.wheelDeltaY||e.deltaY||0;return K&&(e.wheelDeltaX&&b(e.wheelDeltaX,120)&&(a=-120*(e.wheelDeltaX/Math.abs(e.wheelDeltaX))),e.wheelDeltaY&&b(e.wheelDeltaY,120)&&(i=-120*(e.wheelDeltaY/Math.abs(e.wheelDeltaY)))),a||i||(i=-e.wheelDelta||0),1===e.deltaMode&&(a*=40,i*=40),!z.touchpadSupport&&v(i)?!0:(Math.abs(a)>1.2&&(a*=z.stepSize/120),Math.abs(i)>1.2&&(i*=z.stepSize/120),n(r,a,i),e.preventDefault(),void l())}function a(e){var t=e.target,o=e.ctrlKey||e.altKey||e.metaKey||e.shiftKey&&e.keyCode!==N.spacebar;document.contains(D)||(D=document.activeElement);var r=/^(textarea|select|embed|object)$/i,a=/^(button|submit|radio|checkbox|file|color|image)$/i;if(r.test(t.nodeName)||w(t,"input")&&!a.test(t.type)||w(D,"video")||y(e)||t.isContentEditable||e.defaultPrevented||o)return!0;if((w(t,"button")||w(t,"input")&&a.test(t.type))&&e.keyCode===N.spacebar)return!0;var i,c=0,d=0,s=u(D),f=s.clientHeight;switch(s==document.body&&(f=window.innerHeight),e.keyCode){case N.up:d=-z.arrowScroll;break;case N.down:d=z.arrowScroll;break;case N.spacebar:i=e.shiftKey?1:-1,d=-i*f*.9;break;case N.pageup:d=.9*-f;break;case N.pagedown:d=.9*f;break;case N.home:d=-s.scrollTop;break;case N.end:var m=s.scrollHeight-s.scrollTop-f;d=m>0?m+10:0;break;case N.left:c=-z.arrowScroll;break;case N.right:c=z.arrowScroll;break;default:return!0}n(s,c,d),e.preventDefault(),l()}function i(e){D=e.target}function l(){clearTimeout(E),E=setInterval(function(){F={}},1e3)}function c(e,t){for(var o=e.length;o--;)F[j(e[o])]=t;return t}function u(e){var t=[],o=document.body,n=B.scrollHeight;do{var r=F[j(e)];if(r)return c(t,r);if(t.push(e),n===e.scrollHeight){var a=s(B)&&s(o),i=a||f(B);if(X&&d(B)||!X&&i)return c(t,$())}else if(d(e)&&f(e))return c(t,e)}while(e=e.parentElement)}function d(e){return e.clientHeight+10<e.scrollHeight}function s(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"hidden"!==t}function f(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"scroll"===t||"auto"===t}function m(e,t){window.addEventListener(e,t,!1)}function h(e,t){window.removeEventListener(e,t,!1)}function w(e,t){return(e.nodeName||"").toLowerCase()===t.toLowerCase()}function p(e,t){e=e>0?1:-1,t=t>0?1:-1,(Y.x!==e||Y.y!==t)&&(Y.x=e,Y.y=t,q=[],R=0)}function v(e){return e?(O.length||(O=[e,e,e]),e=Math.abs(e),O.push(e),O.shift(),clearTimeout(H),H=setTimeout(function(){window.localStorage&&(localStorage.SS_deltaBuffer=O.join(","))},1e3),!g(120)&&!g(100)):void 0}function b(e,t){return Math.floor(e/t)==e/t}function g(e){return b(O[0],e)&&b(O[1],e)&&b(O[2],e)}function y(e){var t=e.target,o=!1;if(-1!=document.URL.indexOf("www.youtube.com/watch"))do if(o=t.classList&&t.classList.contains("html5-video-controls"))break;while(t=t.parentNode);return o}function S(e){var t,o,n;return e*=z.pulseScale,1>e?t=e-(1-Math.exp(-e)):(o=Math.exp(-1),e-=1,n=1-Math.exp(-e),t=o+n*(1-o)),t*z.pulseNormalize}function x(e){return e>=1?1:0>=e?0:(1==z.pulseNormalize&&(z.pulseNormalize/=S(1)),S(e))}function k(e){for(var t in e)C.hasOwnProperty(t)&&(z[t]=e[t])}var D,M,T,E,H,C={frameRate:150,animationTime:500,stepSize:150,pulseAlgorithm:!0,pulseScale:6,pulseNormalize:1,accelerationDelta:50,accelerationMax:3,keyboardSupport:!0,arrowScroll:50,touchpadSupport:!1,fixedBackground:!0,excluded:""},z=C,L=!1,X=!1,Y={x:0,y:0},A=!1,B=document.documentElement,O=[],K=/^Mac/.test(navigator.platform),N={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},q=[],P=!1,R=Date.now(),j=function(){var e=0;return function(t){return t.uniqueID||(t.uniqueID=e++)}}(),F={};window.localStorage&&localStorage.SS_deltaBuffer&&(O=localStorage.SS_deltaBuffer.split(","));var I,_=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e,t,o){window.setTimeout(e,o||1e3/60)}}(),V=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,$=function(){var e;return function(){if(!e){var t=document.createElement("div");t.style.cssText="height:10000px;width:1px;",document.body.appendChild(t);var o=document.body.scrollTop;document.documentElement.scrollTop;window.scrollBy(0,3),e=document.body.scrollTop!=o?document.body:document.documentElement,window.scrollBy(0,-3),document.body.removeChild(t)}return e}}(),U=window.navigator.userAgent,W=/Edge/.test(U),G=/chrome/i.test(U)&&!W,J=/safari/i.test(U)&&!W,Q=/mobile/i.test(U),Z=(G||J)&&!Q;"onwheel"in document.createElement("div")?I="wheel":"onmousewheel"in document.createElement("div")&&(I="mousewheel"),I&&Z&&(m(I,r),m("mousedown",i),m("load",t)),k.destroy=o,window.SmoothScrollOptions&&k(window.SmoothScrollOptions),"function"==typeof define&&define.amd?define(function(){return k}):"object"==typeof exports?module.exports=k:window.SmoothScroll=k}();
	}
}

function initParallaxScroll() {

	var windowWidth = $(window).width();

	if(windowWidth > cp_parallaxMinimumWidth)
	{
		cp_parallaxOn = true;
		$(window).scroll(cp_updateParallaxOnScroll);
		setTimeout(cp_updateParallaxOnScroll, 1);
	}
}

function parallaxScrollOnResize(resetCSS) {
	var windowWidth = $(window).width();

	var doUpdate = cp_parallaxOn;

	if(windowWidth < cp_parallaxMinimumWidth)
	{
		if(cp_parallaxOn)
		{
			removeParallaxScroll(true);
		}
	}
	else
	{
		if(!cp_parallaxOn)
		{
			initParallaxScroll();
		}
	}

	if(doUpdate && cp_parallaxOn)
	{
		cp_updateParallaxOnScroll();
	}
}

function removeParallaxScroll(resetCSS) {
	cp_parallaxOn = false;
	$(window).unbind("scroll", cp_updateParallaxOnScroll);
	if(resetCSS === true)
	{
		for(var i in cp_parallaxArray)
	    {
	    	if(cp_parallaxArray.hasOwnProperty(i))
	    	{
		        var $elm = cp_parallaxArray[i].$elm, fromCSS = cp_parallaxArray[i].fromCSS;

		        var newCSS = {};

		        for(var css in fromCSS)
		        {
		            newCSS[css] = "";
		        }

		        $elm.css(newCSS);
		    }
	    }
	}
}

function cp_addScrollParallax($elm, fromCSS, toCSS, $positionElm) {

    cp_parallaxArray.push({$elm: $elm, fromCSS: fromCSS, toCSS: toCSS, $positionElm: $positionElm == null ? $elm : $positionElm});

}

function cp_updateParallaxOnScroll() {

	if(cp_parallaxArray.length > 0 && !reducedMotionMediaQuery.matches)
	{
	    var scrollTop = $(window).scrollTop(), windowHeight = $(window).height();

	    for(var i in cp_parallaxArray)
	    {
	    	if(cp_parallaxArray.hasOwnProperty(i))
	    	{
		        var $elm = cp_parallaxArray[i].$elm, fromCSS = cp_parallaxArray[i].fromCSS, toCSS = cp_parallaxArray[i].toCSS, $positionElm = cp_parallaxArray[i].$positionElm;

		        $elm.each(function() {

			        var perc, elmOffsetTop = $positionElm.offset().top, elmHeight = $positionElm.outerHeight();

			        var y1 = clamp(elmOffsetTop - windowHeight, 0);
			        var y2 = elmOffsetTop + elmHeight;
			        perc = (scrollTop - y1) / (y2 - y1);

			        if(perc >= 0 && perc <= 1)
			        {
				        var newCSS = {};

				        for(var css in fromCSS)
				        {
							var regex = /([-.\d]+(?!d(?![eg]))[%pxdegmvhwtciran]*)/gi;
				        	var fromVals = fromCSS[css].toString().getMatches(regex,1);
				        	var toVals = toCSS[css].toString().getMatches(regex,1);

				        	var newVals = [];

				        	for(var j in fromVals)
				        	{
				        		newVals.push(cp_parallaxCalculateBetween_inv(perc, fromVals[j], toVals[j]));
				        	}

				        	// var regex = /([-\d]+(?![Dd])(?=[%pxemvhwtciran]*))/g;
				        	var occurrance = 0;
				        	newCSS[css] = fromCSS[css].toString().replace(regex, function(){
								return newVals[occurrance++];
							});
				        }

				        $(this).css(newCSS);
				    }

		        });
		    }
	    }
	}
}

function cp_parallaxCalculateBetween(perc, fromVals, toVals) {

    var newVals = [];

    for(var i = 0; i < fromVals.length; i++)
    {
    	newVals.push(cp_parallaxCalculateBetween_inv(perc, fromVals[i], toVals[i]));
    }

    return(newVals.join(", "));

}

function cp_parallaxCalculateBetween_inv(perc, fromVal, toVal) {

    var regex = /([.\-0-9]+)(px|%|deg|em|vh|vw|vmin|vmax|rem|pt|ex|cm|mm|in|pc|ch)?/gi;
    var fromMatch = regex.exec(fromVal);
    var regex2 = /([.\-0-9]+)(px|%|deg|em|vh|vw|vmin|vmax|rem|pt|ex|cm|mm|in|pc|ch)?/gi;
    var toMatch = regex2.exec(toVal);

    if(fromMatch != null && toMatch != null)
    {
        if(fromMatch[2] == null || toMatch[2] == null || fromMatch[2] == toMatch[2])
        {
        	var unit = fromMatch[2] == null ? toMatch[2] : fromMatch[2];
        	unit = unit == null ? "" : unit;
            var fromVal = parseFloat(fromMatch[1]);
            var toVal = parseFloat(toMatch[1]);
            var newVal = (fromVal + ((toVal - fromVal) * perc));
            return(newVal + unit);
        }
    }
    else
    {
        return(fromVal);
    }

}

function init_new_ca() {
	$('#clientLoginBtn').click(new_ca_login_submit);
	$('#syu_username, #syu_passwd').keydown(function(event) { if (event.keyCode == '13') { event.preventDefault();  new_ca_login_submit(); }});

	if(window.location.hash)
	{
		$('input[name="skipto"]').val($('input[name="skipto"]').val() + window.location.hash);
	}
	$('#toggleForms').click(new_ca_toggle_login_password_reset_click);

	// update URL
	if(Modernizr.history)
	{
		history.replaceState({}, null, addURLParameter(window.location.href, "msg", ""));
	}
}

function new_ca_toggle_login_password_reset(onOff, fromClick) {
	var $form = $('#clientAreaLoginWrapper');
	onOff = onOff == null ? !new_ca_login_forgot_password_mode : onOff;
	fromClick = fromClick === true;

	// var passwordFieldWrapperHeight = $('#passwordFieldWrapper')[0].scrollHeight;

	var newURL = window.location.href;
	var querySplit = newURL.split('?');
	var query = "";
	if(querySplit.length > 1)
	{
		query = "?"+querySplit[1];
	}

	if(fromClick)
	{
		new_ca_show_login_error("");
	}

	if(onOff)
	{
		$form.find('#syu_passwd').hide();
		$form.find('input[name="mode"]').val("ajax_password_reset");
		$form.find('#clientLoginBtn p').html(new_ca_login_forgot_password_submit_btn_text);
		$form.find('#toggleForms p').html(new_ca_login_forgot_password_toggle_btn_text);
		$('.loginFormWrapper h1').html(new_ca_login_forgot_password_title);
		newURL = "login/forgot-password/";
	}
	else
	{
		$form.find('#syu_passwd').show();
		$form.find('input[name="mode"]').val("ajax_login");
		$form.find('#clientLoginBtn p').html(new_ca_login_login_submit_btn_text);
		$form.find('#toggleForms p').html(new_ca_login_login_toggle_btn_text);
		$('.loginFormWrapper h1').html(new_ca_login_login_title);
		newURL = "login/";
	}

	newURL += query;

	// update URL
	if(Modernizr.history)
	{
		history.replaceState({}, null, newURL);
	}

	new_ca_login_forgot_password_mode = onOff;
}

function new_ca_toggle_login_password_reset_click(e) {
	new_ca_toggle_login_password_reset(null, true);
}


function new_ca_login_submit() {

	var $form = $('#clientAreaLoginWrapper');
	var mode = $form.find('input[name="mode"]').val();

	var email = $form.find('#syu_username').val();
	var password = $form.find('#syu_passwd').val();
	if(email == "")
	{
		new_ca_show_login_error('Please type your email address');
		$form.find('#syu_username').focus();
	}
	else if(password == "" && mode != "ajax_password_reset")
	{
		new_ca_show_login_error('Please type your password');
		$form.find('#syu_passwd').focus();
	}
	else
	{
		new_ca_show_login_error("");
		$form.find('#loginSubmitBtn p').html('Checking login...');
		$form.find('#loginSubmitBtn').addClass('loading').unbind('click');
		$form.find('#popupCloseBtn')
		new_ca_check_login(email, password);
	}

}

function new_ca_send_password_reset_success() {
	var $form = $('#clientAreaLoginWrapper');
	$('.loginFormWrapper h1').animate({opacity: 0}, 100, 'linear', function(){ $(this).html("Password Reset Sent").animate({opacity: 1}, 200, 'linear'); });
	$('#toggleForms').animate({opacity: 0}, 100, 'linear');
	$('#clientLoginBtn').animate({opacity: 0}, 300, 'linear');
	$('#login-btn-wrapper').animate({height: 0, paddingTop: 0, paddingBottom: 0}, 500, 'easeOutExpo');

	$('#username-wrapper')
		.height($('#username-wrapper').height())
		.animate({opacity: 0}, 100, 'linear'
			, function(){
				$(this).html("<p>Please check your email for further instructions.<br/>If you do not receive an email within 5 minutes, please check your spam folder.</p>").animate({opacity: 1}, 200, 'linear');
		});
}

function new_ca_check_login(email, password) {

	var dataObj = $('#clientAreaLoginWrapper').serialize();
	$('#syu_username, #syu_passwd').attr('disabled','disabled');
	$('.popupWindow label').addClass('disabled');

	$('#clientLoginBtn').addClass("loading");

	$.ajax({
		type : 'POST',
		url : 'ajax_check_login.php',
		dataType : 'json',
		data: dataObj,
		success : function(data){
			new_ca_login_callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$('#clientLoginBtn').removeClass("loading");
			//alert('error');
		}
	});

}

function new_ca_login_callback(loginCallbackData) {
	var $form = $('#clientAreaLoginWrapper');
	var mode = $form.find('input[name="mode"]').val();
	$('#syu_username, #syu_passwd').removeAttr('disabled');

	if(loginCallbackData.success)
	{
		if(mode == "ajax_password_reset")
		{
			new_ca_send_password_reset_success();
		}
		else
		{
			//add optional callback function
			if(typeof new_ca_login_success_custom_callback == 'function') {
				new_ca_login_success_custom_callback(loginCallbackData);
			}
			// go to destination
			location.href = loginCallbackData.destination;
		}
	}
	else
	{
		$('#clientLoginBtn').removeClass("loading");

		if(loginCallbackData.errorCode == "wrongpassword")
		{
			new_ca_show_login_error("Incorrect password");
			$('#syu_passwd').focus();
		}
		else if(loginCallbackData.errorCode == "wrongemail")
		{
			new_ca_show_login_error("Incorrect login, please check your email address");
			$('#syu_username').focus();
		}
		else if(loginCallbackData.errorCode == "unverifiedemail")
		{
			new_ca_show_login_error("There is a problem with your account, please contact us");
			$('#syu_username').focus();
		}
		else
		{
			new_ca_show_login_error("We encountered an error, please try again");
		}
	}
}

function new_ca_show_login_error(errorText) {

	var $form = $('#clientAreaLoginWrapper');

	if(errorText != "")
	{
		if($form.find('#loginError').html() == "")
		{
			$form.find('#loginError').stop().html(errorText).animate({opacity: 1, height: 33}, 300, 'linear');
		}
		else
		{
			$form.find('#loginError').stop().animate({opacity: 0}, 200, 'linear', function() {
				$form.find(this).html(errorText).animate({opacity: 1}, 300, 'linear');
			});
		}
	}
	else
	{
		$form.find('#loginError').stop().animate({opacity: 0, height: 0}, 200, 'linear', function() {
			$(this).html("");
		});
	}
}

function auto_grow(elm) {
	// debugger;
	var $elm = $(elm);
    elm.style.height = "5px";
    elm.style.height = (elm.scrollHeight + parseInt($elm.css('padding-top')) + parseInt($elm.css('padding-bottom')))+"px";
}

function cloneObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

String.prototype.toHash = function() {
	var hash = 0, i, chr, len;
	if (this.length === 0) return hash;
	for (i = 0, len = this.length; i < len; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

String.prototype.getMatches = function(regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(this)) {
    matches.push(match[index]);
  }
  return matches;
};

function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

jQuery.fn.extend({
    ensureLoad: function(handler) {
        return this.each(function() {
            if(this.complete) {
                handler.call(this);
            } else {
                $(this).load(handler);
            }
        });
    }
});

/**
 * $.unserialize
 *
 * Takes a string in format "param1=value1&param2=value2" and returns an object { param1: 'value1', param2: 'value2' }. If the "param1" ends with "[]" the param is treated as an array.
 *
 * Example:
 *
 * Input:  param1=value1&param2=value2
 * Return: { param1 : value1, param2: value2 }
 *
 * Input:  param1[]=value1&param1[]=value2
 * Return: { param1: [ value1, value2 ] }
 *
 * @todo Support params like "param1[name]=value1" (should return { param1: { name: value1 } })
 */
(function($){
	$.unserialize = function(serializedString){
		var str = decodeURI(serializedString);
		var pairs = str.split('&');
		var obj = {}, p, idx, val;
		for (var i=0, n=pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];

			if (idx.indexOf("[]") == (idx.length - 2)) {
				// Eh um vetor
				var ind = idx.substring(0, idx.length-2)
				if (obj[ind] === undefined) {
					obj[ind] = [];
				}
				obj[ind].push(p[1]);
			}
			else {
				obj[idx] = p[1];
			}
		}
		return obj;
	};
})(jQuery);

//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,function(){"use strict";var e,i;function f(){return e.apply(null,arguments)}function o(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function u(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function m(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function l(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;for(var t in e)if(m(e,t))return;return 1}function r(e){return void 0===e}function h(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function a(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function d(e,t){for(var n=[],s=0;s<e.length;++s)n.push(t(e[s],s));return n}function c(e,t){for(var n in t)m(t,n)&&(e[n]=t[n]);return m(t,"toString")&&(e.toString=t.toString),m(t,"valueOf")&&(e.valueOf=t.valueOf),e}function _(e,t,n,s){return xt(e,t,n,s,!0).utc()}function y(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidEra:null,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],era:null,meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function g(e){if(null==e._isValid){var t=y(e),n=i.call(t.parsedDateParts,function(e){return null!=e}),s=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidEra&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(s=s&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return s;e._isValid=s}return e._isValid}function w(e){var t=_(NaN);return null!=e?c(y(t),e):y(t).userInvalidated=!0,t}i=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),n=t.length>>>0,s=0;s<n;s++)if(s in t&&e.call(this,t[s],s,t))return!0;return!1};var p=f.momentProperties=[],t=!1;function v(e,t){var n,s,i;if(r(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),r(t._i)||(e._i=t._i),r(t._f)||(e._f=t._f),r(t._l)||(e._l=t._l),r(t._strict)||(e._strict=t._strict),r(t._tzm)||(e._tzm=t._tzm),r(t._isUTC)||(e._isUTC=t._isUTC),r(t._offset)||(e._offset=t._offset),r(t._pf)||(e._pf=y(t)),r(t._locale)||(e._locale=t._locale),0<p.length)for(n=0;n<p.length;n++)r(i=t[s=p[n]])||(e[s]=i);return e}function k(e){v(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===t&&(t=!0,f.updateOffset(this),t=!1)}function M(e){return e instanceof k||null!=e&&null!=e._isAMomentObject}function D(e){!1===f.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function n(i,r){var a=!0;return c(function(){if(null!=f.deprecationHandler&&f.deprecationHandler(null,i),a){for(var e,t,n=[],s=0;s<arguments.length;s++){if(e="","object"==typeof arguments[s]){for(t in e+="\n["+s+"] ",arguments[0])m(arguments[0],t)&&(e+=t+": "+arguments[0][t]+", ");e=e.slice(0,-2)}else e=arguments[s];n.push(e)}D(i+"\nArguments: "+Array.prototype.slice.call(n).join("")+"\n"+(new Error).stack),a=!1}return r.apply(this,arguments)},r)}var s,S={};function Y(e,t){null!=f.deprecationHandler&&f.deprecationHandler(e,t),S[e]||(D(t),S[e]=!0)}function O(e){return"undefined"!=typeof Function&&e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function b(e,t){var n,s=c({},e);for(n in t)m(t,n)&&(u(e[n])&&u(t[n])?(s[n]={},c(s[n],e[n]),c(s[n],t[n])):null!=t[n]?s[n]=t[n]:delete s[n]);for(n in e)m(e,n)&&!m(t,n)&&u(e[n])&&(s[n]=c({},s[n]));return s}function x(e){null!=e&&this.set(e)}f.suppressDeprecationWarnings=!1,f.deprecationHandler=null,s=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)m(e,t)&&n.push(t);return n};function T(e,t,n){var s=""+Math.abs(e),i=t-s.length;return(0<=e?n?"+":"":"-")+Math.pow(10,Math.max(0,i)).toString().substr(1)+s}var N=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,P=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,R={},W={};function C(e,t,n,s){var i="string"==typeof s?function(){return this[s]()}:s;e&&(W[e]=i),t&&(W[t[0]]=function(){return T(i.apply(this,arguments),t[1],t[2])}),n&&(W[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function U(e,t){return e.isValid()?(t=H(t,e.localeData()),R[t]=R[t]||function(s){for(var e,i=s.match(N),t=0,r=i.length;t<r;t++)W[i[t]]?i[t]=W[i[t]]:i[t]=(e=i[t]).match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"");return function(e){for(var t="",n=0;n<r;n++)t+=O(i[n])?i[n].call(e,s):i[n];return t}}(t),R[t](e)):e.localeData().invalidDate()}function H(e,t){var n=5;function s(e){return t.longDateFormat(e)||e}for(P.lastIndex=0;0<=n&&P.test(e);)e=e.replace(P,s),P.lastIndex=0,--n;return e}var F={};function L(e,t){var n=e.toLowerCase();F[n]=F[n+"s"]=F[t]=e}function V(e){return"string"==typeof e?F[e]||F[e.toLowerCase()]:void 0}function G(e){var t,n,s={};for(n in e)m(e,n)&&(t=V(n))&&(s[t]=e[n]);return s}var E={};function A(e,t){E[e]=t}function j(e){return e%4==0&&e%100!=0||e%400==0}function I(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function Z(e){var t=+e,n=0;return 0!=t&&isFinite(t)&&(n=I(t)),n}function z(t,n){return function(e){return null!=e?(q(this,t,e),f.updateOffset(this,n),this):$(this,t)}}function $(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function q(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&j(e.year())&&1===e.month()&&29===e.date()?(n=Z(n),e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),xe(n,e.month()))):e._d["set"+(e._isUTC?"UTC":"")+t](n))}var B,J=/\d/,Q=/\d\d/,X=/\d{3}/,K=/\d{4}/,ee=/[+-]?\d{6}/,te=/\d\d?/,ne=/\d\d\d\d?/,se=/\d\d\d\d\d\d?/,ie=/\d{1,3}/,re=/\d{1,4}/,ae=/[+-]?\d{1,6}/,oe=/\d+/,ue=/[+-]?\d+/,le=/Z|[+-]\d\d:?\d\d/gi,he=/Z|[+-]\d\d(?::?\d\d)?/gi,de=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;function ce(e,n,s){B[e]=O(n)?n:function(e,t){return e&&s?s:n}}function fe(e,t){return m(B,e)?B[e](t._strict,t._locale):new RegExp(me(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,s,i){return t||n||s||i})))}function me(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}B={};var _e={};function ye(e,n){var t,s=n;for("string"==typeof e&&(e=[e]),h(n)&&(s=function(e,t){t[n]=Z(e)}),t=0;t<e.length;t++)_e[e[t]]=s}function ge(e,i){ye(e,function(e,t,n,s){n._w=n._w||{},i(e,n._w,n,s)})}var we,pe=0,ve=1,ke=2,Me=3,De=4,Se=5,Ye=6,Oe=7,be=8;function xe(e,t){if(isNaN(e)||isNaN(t))return NaN;var n,s=(t%(n=12)+n)%n;return e+=(t-s)/12,1==s?j(e)?29:28:31-s%7%2}we=Array.prototype.indexOf?Array.prototype.indexOf:function(e){for(var t=0;t<this.length;++t)if(this[t]===e)return t;return-1},C("M",["MM",2],"Mo",function(){return this.month()+1}),C("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),C("MMMM",0,0,function(e){return this.localeData().months(this,e)}),L("month","M"),A("month",8),ce("M",te),ce("MM",te,Q),ce("MMM",function(e,t){return t.monthsShortRegex(e)}),ce("MMMM",function(e,t){return t.monthsRegex(e)}),ye(["M","MM"],function(e,t){t[ve]=Z(e)-1}),ye(["MMM","MMMM"],function(e,t,n,s){var i=n._locale.monthsParse(e,s,n._strict);null!=i?t[ve]=i:y(n).invalidMonth=e});var Te="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Ne="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Pe=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Re=de,We=de;function Ce(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=Z(t);else if(!h(t=e.localeData().monthsParse(t)))return e;return n=Math.min(e.date(),xe(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function Ue(e){return null!=e?(Ce(this,e),f.updateOffset(this,!0),this):$(this,"Month")}function He(){function e(e,t){return t.length-e.length}for(var t,n=[],s=[],i=[],r=0;r<12;r++)t=_([2e3,r]),n.push(this.monthsShort(t,"")),s.push(this.months(t,"")),i.push(this.months(t,"")),i.push(this.monthsShort(t,""));for(n.sort(e),s.sort(e),i.sort(e),r=0;r<12;r++)n[r]=me(n[r]),s[r]=me(s[r]);for(r=0;r<24;r++)i[r]=me(i[r]);this._monthsRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+s.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+n.join("|")+")","i")}function Fe(e){return j(e)?366:365}C("Y",0,0,function(){var e=this.year();return e<=9999?T(e,4):"+"+e}),C(0,["YY",2],0,function(){return this.year()%100}),C(0,["YYYY",4],0,"year"),C(0,["YYYYY",5],0,"year"),C(0,["YYYYYY",6,!0],0,"year"),L("year","y"),A("year",1),ce("Y",ue),ce("YY",te,Q),ce("YYYY",re,K),ce("YYYYY",ae,ee),ce("YYYYYY",ae,ee),ye(["YYYYY","YYYYYY"],pe),ye("YYYY",function(e,t){t[pe]=2===e.length?f.parseTwoDigitYear(e):Z(e)}),ye("YY",function(e,t){t[pe]=f.parseTwoDigitYear(e)}),ye("Y",function(e,t){t[pe]=parseInt(e,10)}),f.parseTwoDigitYear=function(e){return Z(e)+(68<Z(e)?1900:2e3)};var Le=z("FullYear",!0);function Ve(e){var t,n;return e<100&&0<=e?((n=Array.prototype.slice.call(arguments))[0]=e+400,t=new Date(Date.UTC.apply(null,n)),isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e)):t=new Date(Date.UTC.apply(null,arguments)),t}function Ge(e,t,n){var s=7+t-n;return s-(7+Ve(e,0,s).getUTCDay()-t)%7-1}function Ee(e,t,n,s,i){var r,a=1+7*(t-1)+(7+n-s)%7+Ge(e,s,i),o=a<=0?Fe(r=e-1)+a:a>Fe(e)?(r=e+1,a-Fe(e)):(r=e,a);return{year:r,dayOfYear:o}}function Ae(e,t,n){var s,i,r=Ge(e.year(),t,n),a=Math.floor((e.dayOfYear()-r-1)/7)+1;return a<1?s=a+je(i=e.year()-1,t,n):a>je(e.year(),t,n)?(s=a-je(e.year(),t,n),i=e.year()+1):(i=e.year(),s=a),{week:s,year:i}}function je(e,t,n){var s=Ge(e,t,n),i=Ge(e+1,t,n);return(Fe(e)-s+i)/7}C("w",["ww",2],"wo","week"),C("W",["WW",2],"Wo","isoWeek"),L("week","w"),L("isoWeek","W"),A("week",5),A("isoWeek",5),ce("w",te),ce("ww",te,Q),ce("W",te),ce("WW",te,Q),ge(["w","ww","W","WW"],function(e,t,n,s){t[s.substr(0,1)]=Z(e)});function Ie(e,t){return e.slice(t,7).concat(e.slice(0,t))}C("d",0,"do","day"),C("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),C("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),C("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),C("e",0,0,"weekday"),C("E",0,0,"isoWeekday"),L("day","d"),L("weekday","e"),L("isoWeekday","E"),A("day",11),A("weekday",11),A("isoWeekday",11),ce("d",te),ce("e",te),ce("E",te),ce("dd",function(e,t){return t.weekdaysMinRegex(e)}),ce("ddd",function(e,t){return t.weekdaysShortRegex(e)}),ce("dddd",function(e,t){return t.weekdaysRegex(e)}),ge(["dd","ddd","dddd"],function(e,t,n,s){var i=n._locale.weekdaysParse(e,s,n._strict);null!=i?t.d=i:y(n).invalidWeekday=e}),ge(["d","e","E"],function(e,t,n,s){t[s]=Z(e)});var Ze="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),ze="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),$e="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),qe=de,Be=de,Je=de;function Qe(){function e(e,t){return t.length-e.length}for(var t,n,s,i,r=[],a=[],o=[],u=[],l=0;l<7;l++)t=_([2e3,1]).day(l),n=me(this.weekdaysMin(t,"")),s=me(this.weekdaysShort(t,"")),i=me(this.weekdays(t,"")),r.push(n),a.push(s),o.push(i),u.push(n),u.push(s),u.push(i);r.sort(e),a.sort(e),o.sort(e),u.sort(e),this._weekdaysRegex=new RegExp("^("+u.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+a.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+r.join("|")+")","i")}function Xe(){return this.hours()%12||12}function Ke(e,t){C(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function et(e,t){return t._meridiemParse}C("H",["HH",2],0,"hour"),C("h",["hh",2],0,Xe),C("k",["kk",2],0,function(){return this.hours()||24}),C("hmm",0,0,function(){return""+Xe.apply(this)+T(this.minutes(),2)}),C("hmmss",0,0,function(){return""+Xe.apply(this)+T(this.minutes(),2)+T(this.seconds(),2)}),C("Hmm",0,0,function(){return""+this.hours()+T(this.minutes(),2)}),C("Hmmss",0,0,function(){return""+this.hours()+T(this.minutes(),2)+T(this.seconds(),2)}),Ke("a",!0),Ke("A",!1),L("hour","h"),A("hour",13),ce("a",et),ce("A",et),ce("H",te),ce("h",te),ce("k",te),ce("HH",te,Q),ce("hh",te,Q),ce("kk",te,Q),ce("hmm",ne),ce("hmmss",se),ce("Hmm",ne),ce("Hmmss",se),ye(["H","HH"],Me),ye(["k","kk"],function(e,t,n){var s=Z(e);t[Me]=24===s?0:s}),ye(["a","A"],function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e}),ye(["h","hh"],function(e,t,n){t[Me]=Z(e),y(n).bigHour=!0}),ye("hmm",function(e,t,n){var s=e.length-2;t[Me]=Z(e.substr(0,s)),t[De]=Z(e.substr(s)),y(n).bigHour=!0}),ye("hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Me]=Z(e.substr(0,s)),t[De]=Z(e.substr(s,2)),t[Se]=Z(e.substr(i)),y(n).bigHour=!0}),ye("Hmm",function(e,t,n){var s=e.length-2;t[Me]=Z(e.substr(0,s)),t[De]=Z(e.substr(s))}),ye("Hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Me]=Z(e.substr(0,s)),t[De]=Z(e.substr(s,2)),t[Se]=Z(e.substr(i))});var tt=z("Hours",!0);var nt,st={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",w:"a week",ww:"%d weeks",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:Te,monthsShort:Ne,week:{dow:0,doy:6},weekdays:Ze,weekdaysMin:$e,weekdaysShort:ze,meridiemParse:/[ap]\.?m?\.?/i},it={},rt={};function at(e){return e?e.toLowerCase().replace("_","-"):e}function ot(e){for(var t,n,s,i,r=0;r<e.length;){for(t=(i=at(e[r]).split("-")).length,n=(n=at(e[r+1]))?n.split("-"):null;0<t;){if(s=ut(i.slice(0,t).join("-")))return s;if(n&&n.length>=t&&function(e,t){for(var n=Math.min(e.length,t.length),s=0;s<n;s+=1)if(e[s]!==t[s])return s;return n}(i,n)>=t-1)break;t--}r++}return nt}function ut(t){var e;if(void 0===it[t]&&"undefined"!=typeof module&&module&&module.exports)try{e=nt._abbr,require("./locale/"+t),lt(e)}catch(e){it[t]=null}return it[t]}function lt(e,t){var n;return e&&((n=r(t)?dt(e):ht(e,t))?nt=n:"undefined"!=typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),nt._abbr}function ht(e,t){if(null===t)return delete it[e],null;var n,s=st;if(t.abbr=e,null!=it[e])Y("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),s=it[e]._config;else if(null!=t.parentLocale)if(null!=it[t.parentLocale])s=it[t.parentLocale]._config;else{if(null==(n=ut(t.parentLocale)))return rt[t.parentLocale]||(rt[t.parentLocale]=[]),rt[t.parentLocale].push({name:e,config:t}),null;s=n._config}return it[e]=new x(b(s,t)),rt[e]&&rt[e].forEach(function(e){ht(e.name,e.config)}),lt(e),it[e]}function dt(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return nt;if(!o(e)){if(t=ut(e))return t;e=[e]}return ot(e)}function ct(e){var t,n=e._a;return n&&-2===y(e).overflow&&(t=n[ve]<0||11<n[ve]?ve:n[ke]<1||n[ke]>xe(n[pe],n[ve])?ke:n[Me]<0||24<n[Me]||24===n[Me]&&(0!==n[De]||0!==n[Se]||0!==n[Ye])?Me:n[De]<0||59<n[De]?De:n[Se]<0||59<n[Se]?Se:n[Ye]<0||999<n[Ye]?Ye:-1,y(e)._overflowDayOfYear&&(t<pe||ke<t)&&(t=ke),y(e)._overflowWeeks&&-1===t&&(t=Oe),y(e)._overflowWeekday&&-1===t&&(t=be),y(e).overflow=t),e}var ft=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,mt=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,_t=/Z|[+-]\d\d(?::?\d\d)?/,yt=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/],["YYYYMM",/\d{6}/,!1],["YYYY",/\d{4}/,!1]],gt=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],wt=/^\/?Date\((-?\d+)/i,pt=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,vt={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function kt(e){var t,n,s,i,r,a,o=e._i,u=ft.exec(o)||mt.exec(o);if(u){for(y(e).iso=!0,t=0,n=yt.length;t<n;t++)if(yt[t][1].exec(u[1])){i=yt[t][0],s=!1!==yt[t][2];break}if(null==i)return void(e._isValid=!1);if(u[3]){for(t=0,n=gt.length;t<n;t++)if(gt[t][1].exec(u[3])){r=(u[2]||" ")+gt[t][0];break}if(null==r)return void(e._isValid=!1)}if(!s&&null!=r)return void(e._isValid=!1);if(u[4]){if(!_t.exec(u[4]))return void(e._isValid=!1);a="Z"}e._f=i+(r||"")+(a||""),Ot(e)}else e._isValid=!1}function Mt(e,t,n,s,i,r){var a=[function(e){var t=parseInt(e,10);{if(t<=49)return 2e3+t;if(t<=999)return 1900+t}return t}(e),Ne.indexOf(t),parseInt(n,10),parseInt(s,10),parseInt(i,10)];return r&&a.push(parseInt(r,10)),a}function Dt(e){var t,n,s,i,r=pt.exec(e._i.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,""));if(r){if(t=Mt(r[4],r[3],r[2],r[5],r[6],r[7]),n=r[1],s=t,i=e,n&&ze.indexOf(n)!==new Date(s[0],s[1],s[2]).getDay()&&(y(i).weekdayMismatch=!0,!void(i._isValid=!1)))return;e._a=t,e._tzm=function(e,t,n){if(e)return vt[e];if(t)return 0;var s=parseInt(n,10),i=s%100;return 60*((s-i)/100)+i}(r[8],r[9],r[10]),e._d=Ve.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),y(e).rfc2822=!0}else e._isValid=!1}function St(e,t,n){return null!=e?e:null!=t?t:n}function Yt(e){var t,n,s,i,r,a,o,u=[];if(!e._d){for(a=e,o=new Date(f.now()),s=a._useUTC?[o.getUTCFullYear(),o.getUTCMonth(),o.getUTCDate()]:[o.getFullYear(),o.getMonth(),o.getDate()],e._w&&null==e._a[ke]&&null==e._a[ve]&&function(e){var t,n,s,i,r,a,o,u,l;null!=(t=e._w).GG||null!=t.W||null!=t.E?(r=1,a=4,n=St(t.GG,e._a[pe],Ae(Tt(),1,4).year),s=St(t.W,1),((i=St(t.E,1))<1||7<i)&&(u=!0)):(r=e._locale._week.dow,a=e._locale._week.doy,l=Ae(Tt(),r,a),n=St(t.gg,e._a[pe],l.year),s=St(t.w,l.week),null!=t.d?((i=t.d)<0||6<i)&&(u=!0):null!=t.e?(i=t.e+r,(t.e<0||6<t.e)&&(u=!0)):i=r);s<1||s>je(n,r,a)?y(e)._overflowWeeks=!0:null!=u?y(e)._overflowWeekday=!0:(o=Ee(n,s,i,r,a),e._a[pe]=o.year,e._dayOfYear=o.dayOfYear)}(e),null!=e._dayOfYear&&(r=St(e._a[pe],s[pe]),(e._dayOfYear>Fe(r)||0===e._dayOfYear)&&(y(e)._overflowDayOfYear=!0),n=Ve(r,0,e._dayOfYear),e._a[ve]=n.getUTCMonth(),e._a[ke]=n.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=u[t]=s[t];for(;t<7;t++)e._a[t]=u[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[Me]&&0===e._a[De]&&0===e._a[Se]&&0===e._a[Ye]&&(e._nextDay=!0,e._a[Me]=0),e._d=(e._useUTC?Ve:function(e,t,n,s,i,r,a){var o;return e<100&&0<=e?(o=new Date(e+400,t,n,s,i,r,a),isFinite(o.getFullYear())&&o.setFullYear(e)):o=new Date(e,t,n,s,i,r,a),o}).apply(null,u),i=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[Me]=24),e._w&&void 0!==e._w.d&&e._w.d!==i&&(y(e).weekdayMismatch=!0)}}function Ot(e){if(e._f!==f.ISO_8601)if(e._f!==f.RFC_2822){e._a=[],y(e).empty=!0;for(var t,n,s,i,r,a,o,u=""+e._i,l=u.length,h=0,d=H(e._f,e._locale).match(N)||[],c=0;c<d.length;c++)n=d[c],(t=(u.match(fe(n,e))||[])[0])&&(0<(s=u.substr(0,u.indexOf(t))).length&&y(e).unusedInput.push(s),u=u.slice(u.indexOf(t)+t.length),h+=t.length),W[n]?(t?y(e).empty=!1:y(e).unusedTokens.push(n),r=n,o=e,null!=(a=t)&&m(_e,r)&&_e[r](a,o._a,o,r)):e._strict&&!t&&y(e).unusedTokens.push(n);y(e).charsLeftOver=l-h,0<u.length&&y(e).unusedInput.push(u),e._a[Me]<=12&&!0===y(e).bigHour&&0<e._a[Me]&&(y(e).bigHour=void 0),y(e).parsedDateParts=e._a.slice(0),y(e).meridiem=e._meridiem,e._a[Me]=function(e,t,n){var s;if(null==n)return t;return null!=e.meridiemHour?e.meridiemHour(t,n):(null!=e.isPM&&((s=e.isPM(n))&&t<12&&(t+=12),s||12!==t||(t=0)),t)}(e._locale,e._a[Me],e._meridiem),null!==(i=y(e).era)&&(e._a[pe]=e._locale.erasConvertYear(i,e._a[pe])),Yt(e),ct(e)}else Dt(e);else kt(e)}function bt(e){var t,n,s=e._i,i=e._f;return e._locale=e._locale||dt(e._l),null===s||void 0===i&&""===s?w({nullInput:!0}):("string"==typeof s&&(e._i=s=e._locale.preparse(s)),M(s)?new k(ct(s)):(a(s)?e._d=s:o(i)?function(e){var t,n,s,i,r,a,o=!1;if(0===e._f.length)return y(e).invalidFormat=!0,e._d=new Date(NaN);for(i=0;i<e._f.length;i++)r=0,a=!1,t=v({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],Ot(t),g(t)&&(a=!0),r+=y(t).charsLeftOver,r+=10*y(t).unusedTokens.length,y(t).score=r,o?r<s&&(s=r,n=t):(null==s||r<s||a)&&(s=r,n=t,a&&(o=!0));c(e,n||t)}(e):i?Ot(e):r(n=(t=e)._i)?t._d=new Date(f.now()):a(n)?t._d=new Date(n.valueOf()):"string"==typeof n?function(e){var t=wt.exec(e._i);null===t?(kt(e),!1===e._isValid&&(delete e._isValid,Dt(e),!1===e._isValid&&(delete e._isValid,e._strict?e._isValid=!1:f.createFromInputFallback(e)))):e._d=new Date(+t[1])}(t):o(n)?(t._a=d(n.slice(0),function(e){return parseInt(e,10)}),Yt(t)):u(n)?function(e){var t,n;e._d||(n=void 0===(t=G(e._i)).day?t.date:t.day,e._a=d([t.year,t.month,n,t.hour,t.minute,t.second,t.millisecond],function(e){return e&&parseInt(e,10)}),Yt(e))}(t):h(n)?t._d=new Date(n):f.createFromInputFallback(t),g(e)||(e._d=null),e))}function xt(e,t,n,s,i){var r,a={};return!0!==t&&!1!==t||(s=t,t=void 0),!0!==n&&!1!==n||(s=n,n=void 0),(u(e)&&l(e)||o(e)&&0===e.length)&&(e=void 0),a._isAMomentObject=!0,a._useUTC=a._isUTC=i,a._l=n,a._i=e,a._f=t,a._strict=s,(r=new k(ct(bt(a))))._nextDay&&(r.add(1,"d"),r._nextDay=void 0),r}function Tt(e,t,n,s){return xt(e,t,n,s,!1)}f.createFromInputFallback=n("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),f.ISO_8601=function(){},f.RFC_2822=function(){};var Nt=n("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=Tt.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:w()}),Pt=n("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=Tt.apply(null,arguments);return this.isValid()&&e.isValid()?this<e?this:e:w()});function Rt(e,t){var n,s;if(1===t.length&&o(t[0])&&(t=t[0]),!t.length)return Tt();for(n=t[0],s=1;s<t.length;++s)t[s].isValid()&&!t[s][e](n)||(n=t[s]);return n}var Wt=["year","quarter","month","week","day","hour","minute","second","millisecond"];function Ct(e){var t=G(e),n=t.year||0,s=t.quarter||0,i=t.month||0,r=t.week||t.isoWeek||0,a=t.day||0,o=t.hour||0,u=t.minute||0,l=t.second||0,h=t.millisecond||0;this._isValid=function(e){var t,n,s=!1;for(t in e)if(m(e,t)&&(-1===we.call(Wt,t)||null!=e[t]&&isNaN(e[t])))return!1;for(n=0;n<Wt.length;++n)if(e[Wt[n]]){if(s)return!1;parseFloat(e[Wt[n]])!==Z(e[Wt[n]])&&(s=!0)}return!0}(t),this._milliseconds=+h+1e3*l+6e4*u+1e3*o*60*60,this._days=+a+7*r,this._months=+i+3*s+12*n,this._data={},this._locale=dt(),this._bubble()}function Ut(e){return e instanceof Ct}function Ht(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function Ft(e,n){C(e,0,0,function(){var e=this.utcOffset(),t="+";return e<0&&(e=-e,t="-"),t+T(~~(e/60),2)+n+T(~~e%60,2)})}Ft("Z",":"),Ft("ZZ",""),ce("Z",he),ce("ZZ",he),ye(["Z","ZZ"],function(e,t,n){n._useUTC=!0,n._tzm=Vt(he,e)});var Lt=/([\+\-]|\d\d)/gi;function Vt(e,t){var n,s,i=(t||"").match(e);return null===i?null:0===(s=60*(n=((i[i.length-1]||[])+"").match(Lt)||["-",0,0])[1]+Z(n[2]))?0:"+"===n[0]?s:-s}function Gt(e,t){var n,s;return t._isUTC?(n=t.clone(),s=(M(e)||a(e)?e.valueOf():Tt(e).valueOf())-n.valueOf(),n._d.setTime(n._d.valueOf()+s),f.updateOffset(n,!1),n):Tt(e).local()}function Et(e){return-Math.round(e._d.getTimezoneOffset())}function At(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}f.updateOffset=function(){};var jt=/^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,It=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function Zt(e,t){var n,s,i,r=e,a=null;return Ut(e)?r={ms:e._milliseconds,d:e._days,M:e._months}:h(e)||!isNaN(+e)?(r={},t?r[t]=+e:r.milliseconds=+e):(a=jt.exec(e))?(n="-"===a[1]?-1:1,r={y:0,d:Z(a[ke])*n,h:Z(a[Me])*n,m:Z(a[De])*n,s:Z(a[Se])*n,ms:Z(Ht(1e3*a[Ye]))*n}):(a=It.exec(e))?(n="-"===a[1]?-1:1,r={y:zt(a[2],n),M:zt(a[3],n),w:zt(a[4],n),d:zt(a[5],n),h:zt(a[6],n),m:zt(a[7],n),s:zt(a[8],n)}):null==r?r={}:"object"==typeof r&&("from"in r||"to"in r)&&(i=function(e,t){var n;if(!e.isValid()||!t.isValid())return{milliseconds:0,months:0};t=Gt(t,e),e.isBefore(t)?n=$t(e,t):((n=$t(t,e)).milliseconds=-n.milliseconds,n.months=-n.months);return n}(Tt(r.from),Tt(r.to)),(r={}).ms=i.milliseconds,r.M=i.months),s=new Ct(r),Ut(e)&&m(e,"_locale")&&(s._locale=e._locale),Ut(e)&&m(e,"_isValid")&&(s._isValid=e._isValid),s}function zt(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function $t(e,t){var n={};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=t-e.clone().add(n.months,"M"),n}function qt(s,i){return function(e,t){var n;return null===t||isNaN(+t)||(Y(i,"moment()."+i+"(period, number) is deprecated. Please use moment()."+i+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),n=e,e=t,t=n),Bt(this,Zt(e,t),s),this}}function Bt(e,t,n,s){var i=t._milliseconds,r=Ht(t._days),a=Ht(t._months);e.isValid()&&(s=null==s||s,a&&Ce(e,$(e,"Month")+a*n),r&&q(e,"Date",$(e,"Date")+r*n),i&&e._d.setTime(e._d.valueOf()+i*n),s&&f.updateOffset(e,r||a))}Zt.fn=Ct.prototype,Zt.invalid=function(){return Zt(NaN)};var Jt=qt(1,"add"),Qt=qt(-1,"subtract");function Xt(e){return"string"==typeof e||e instanceof String}function Kt(e){return M(e)||a(e)||Xt(e)||h(e)||function(t){var e=o(t),n=!1;e&&(n=0===t.filter(function(e){return!h(e)&&Xt(t)}).length);return e&&n}(e)||function(e){var t,n,s=u(e)&&!l(e),i=!1,r=["years","year","y","months","month","M","days","day","d","dates","date","D","hours","hour","h","minutes","minute","m","seconds","second","s","milliseconds","millisecond","ms"];for(t=0;t<r.length;t+=1)n=r[t],i=i||m(e,n);return s&&i}(e)||null==e}function en(e,t){if(e.date()<t.date())return-en(t,e);var n=12*(t.year()-e.year())+(t.month()-e.month()),s=e.clone().add(n,"months"),i=t-s<0?(t-s)/(s-e.clone().add(n-1,"months")):(t-s)/(e.clone().add(1+n,"months")-s);return-(n+i)||0}function tn(e){var t;return void 0===e?this._locale._abbr:(null!=(t=dt(e))&&(this._locale=t),this)}f.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",f.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var nn=n("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});function sn(){return this._locale}var rn=126227808e5;function an(e,t){return(e%t+t)%t}function on(e,t,n){return e<100&&0<=e?new Date(e+400,t,n)-rn:new Date(e,t,n).valueOf()}function un(e,t,n){return e<100&&0<=e?Date.UTC(e+400,t,n)-rn:Date.UTC(e,t,n)}function ln(e,t){return t.erasAbbrRegex(e)}function hn(){for(var e=[],t=[],n=[],s=[],i=this.eras(),r=0,a=i.length;r<a;++r)t.push(me(i[r].name)),e.push(me(i[r].abbr)),n.push(me(i[r].narrow)),s.push(me(i[r].name)),s.push(me(i[r].abbr)),s.push(me(i[r].narrow));this._erasRegex=new RegExp("^("+s.join("|")+")","i"),this._erasNameRegex=new RegExp("^("+t.join("|")+")","i"),this._erasAbbrRegex=new RegExp("^("+e.join("|")+")","i"),this._erasNarrowRegex=new RegExp("^("+n.join("|")+")","i")}function dn(e,t){C(0,[e,e.length],0,t)}function cn(e,t,n,s,i){var r;return null==e?Ae(this,s,i).year:((r=je(e,s,i))<t&&(t=r),function(e,t,n,s,i){var r=Ee(e,t,n,s,i),a=Ve(r.year,0,r.dayOfYear);return this.year(a.getUTCFullYear()),this.month(a.getUTCMonth()),this.date(a.getUTCDate()),this}.call(this,e,t,n,s,i))}C("N",0,0,"eraAbbr"),C("NN",0,0,"eraAbbr"),C("NNN",0,0,"eraAbbr"),C("NNNN",0,0,"eraName"),C("NNNNN",0,0,"eraNarrow"),C("y",["y",1],"yo","eraYear"),C("y",["yy",2],0,"eraYear"),C("y",["yyy",3],0,"eraYear"),C("y",["yyyy",4],0,"eraYear"),ce("N",ln),ce("NN",ln),ce("NNN",ln),ce("NNNN",function(e,t){return t.erasNameRegex(e)}),ce("NNNNN",function(e,t){return t.erasNarrowRegex(e)}),ye(["N","NN","NNN","NNNN","NNNNN"],function(e,t,n,s){var i=n._locale.erasParse(e,s,n._strict);i?y(n).era=i:y(n).invalidEra=e}),ce("y",oe),ce("yy",oe),ce("yyy",oe),ce("yyyy",oe),ce("yo",function(e,t){return t._eraYearOrdinalRegex||oe}),ye(["y","yy","yyy","yyyy"],pe),ye(["yo"],function(e,t,n,s){var i;n._locale._eraYearOrdinalRegex&&(i=e.match(n._locale._eraYearOrdinalRegex)),n._locale.eraYearOrdinalParse?t[pe]=n._locale.eraYearOrdinalParse(e,i):t[pe]=parseInt(e,10)}),C(0,["gg",2],0,function(){return this.weekYear()%100}),C(0,["GG",2],0,function(){return this.isoWeekYear()%100}),dn("gggg","weekYear"),dn("ggggg","weekYear"),dn("GGGG","isoWeekYear"),dn("GGGGG","isoWeekYear"),L("weekYear","gg"),L("isoWeekYear","GG"),A("weekYear",1),A("isoWeekYear",1),ce("G",ue),ce("g",ue),ce("GG",te,Q),ce("gg",te,Q),ce("GGGG",re,K),ce("gggg",re,K),ce("GGGGG",ae,ee),ce("ggggg",ae,ee),ge(["gggg","ggggg","GGGG","GGGGG"],function(e,t,n,s){t[s.substr(0,2)]=Z(e)}),ge(["gg","GG"],function(e,t,n,s){t[s]=f.parseTwoDigitYear(e)}),C("Q",0,"Qo","quarter"),L("quarter","Q"),A("quarter",7),ce("Q",J),ye("Q",function(e,t){t[ve]=3*(Z(e)-1)}),C("D",["DD",2],"Do","date"),L("date","D"),A("date",9),ce("D",te),ce("DD",te,Q),ce("Do",function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient}),ye(["D","DD"],ke),ye("Do",function(e,t){t[ke]=Z(e.match(te)[0])});var fn=z("Date",!0);C("DDD",["DDDD",3],"DDDo","dayOfYear"),L("dayOfYear","DDD"),A("dayOfYear",4),ce("DDD",ie),ce("DDDD",X),ye(["DDD","DDDD"],function(e,t,n){n._dayOfYear=Z(e)}),C("m",["mm",2],0,"minute"),L("minute","m"),A("minute",14),ce("m",te),ce("mm",te,Q),ye(["m","mm"],De);var mn=z("Minutes",!1);C("s",["ss",2],0,"second"),L("second","s"),A("second",15),ce("s",te),ce("ss",te,Q),ye(["s","ss"],Se);var _n,yn,gn=z("Seconds",!1);for(C("S",0,0,function(){return~~(this.millisecond()/100)}),C(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),C(0,["SSS",3],0,"millisecond"),C(0,["SSSS",4],0,function(){return 10*this.millisecond()}),C(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),C(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),C(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),C(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),C(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),L("millisecond","ms"),A("millisecond",16),ce("S",ie,J),ce("SS",ie,Q),ce("SSS",ie,X),_n="SSSS";_n.length<=9;_n+="S")ce(_n,oe);function wn(e,t){t[Ye]=Z(1e3*("0."+e))}for(_n="S";_n.length<=9;_n+="S")ye(_n,wn);yn=z("Milliseconds",!1),C("z",0,0,"zoneAbbr"),C("zz",0,0,"zoneName");var pn=k.prototype;function vn(e){return e}pn.add=Jt,pn.calendar=function(e,t){1===arguments.length&&(arguments[0]?Kt(arguments[0])?(e=arguments[0],t=void 0):function(e){for(var t=u(e)&&!l(e),n=!1,s=["sameDay","nextDay","lastDay","nextWeek","lastWeek","sameElse"],i=0;i<s.length;i+=1)n=n||m(e,s[i]);return t&&n}(arguments[0])&&(t=arguments[0],e=void 0):t=e=void 0);var n=e||Tt(),s=Gt(n,this).startOf("day"),i=f.calendarFormat(this,s)||"sameElse",r=t&&(O(t[i])?t[i].call(this,n):t[i]);return this.format(r||this.localeData().calendar(i,this,Tt(n)))},pn.clone=function(){return new k(this)},pn.diff=function(e,t,n){var s,i,r;if(!this.isValid())return NaN;if(!(s=Gt(e,this)).isValid())return NaN;switch(i=6e4*(s.utcOffset()-this.utcOffset()),t=V(t)){case"year":r=en(this,s)/12;break;case"month":r=en(this,s);break;case"quarter":r=en(this,s)/3;break;case"second":r=(this-s)/1e3;break;case"minute":r=(this-s)/6e4;break;case"hour":r=(this-s)/36e5;break;case"day":r=(this-s-i)/864e5;break;case"week":r=(this-s-i)/6048e5;break;default:r=this-s}return n?r:I(r)},pn.endOf=function(e){var t,n;if(void 0===(e=V(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?un:on,e){case"year":t=n(this.year()+1,0,1)-1;break;case"quarter":t=n(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":t=n(this.year(),this.month()+1,1)-1;break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":t=n(this.year(),this.month(),this.date()+1)-1;break;case"hour":t=this._d.valueOf(),t+=36e5-an(t+(this._isUTC?0:6e4*this.utcOffset()),36e5)-1;break;case"minute":t=this._d.valueOf(),t+=6e4-an(t,6e4)-1;break;case"second":t=this._d.valueOf(),t+=1e3-an(t,1e3)-1;break}return this._d.setTime(t),f.updateOffset(this,!0),this},pn.format=function(e){e=e||(this.isUtc()?f.defaultFormatUtc:f.defaultFormat);var t=U(this,e);return this.localeData().postformat(t)},pn.from=function(e,t){return this.isValid()&&(M(e)&&e.isValid()||Tt(e).isValid())?Zt({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},pn.fromNow=function(e){return this.from(Tt(),e)},pn.to=function(e,t){return this.isValid()&&(M(e)&&e.isValid()||Tt(e).isValid())?Zt({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},pn.toNow=function(e){return this.to(Tt(),e)},pn.get=function(e){return O(this[e=V(e)])?this[e]():this},pn.invalidAt=function(){return y(this).overflow},pn.isAfter=function(e,t){var n=M(e)?e:Tt(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())},pn.isBefore=function(e,t){var n=M(e)?e:Tt(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())},pn.isBetween=function(e,t,n,s){var i=M(e)?e:Tt(e),r=M(t)?t:Tt(t);return!!(this.isValid()&&i.isValid()&&r.isValid())&&(("("===(s=s||"()")[0]?this.isAfter(i,n):!this.isBefore(i,n))&&(")"===s[1]?this.isBefore(r,n):!this.isAfter(r,n)))},pn.isSame=function(e,t){var n,s=M(e)?e:Tt(e);return!(!this.isValid()||!s.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()===s.valueOf():(n=s.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))},pn.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},pn.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},pn.isValid=function(){return g(this)},pn.lang=nn,pn.locale=tn,pn.localeData=sn,pn.max=Pt,pn.min=Nt,pn.parsingFlags=function(){return c({},y(this))},pn.set=function(e,t){if("object"==typeof e)for(var n=function(e){var t,n=[];for(t in e)m(e,t)&&n.push({unit:t,priority:E[t]});return n.sort(function(e,t){return e.priority-t.priority}),n}(e=G(e)),s=0;s<n.length;s++)this[n[s].unit](e[n[s].unit]);else if(O(this[e=V(e)]))return this[e](t);return this},pn.startOf=function(e){var t,n;if(void 0===(e=V(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?un:on,e){case"year":t=n(this.year(),0,1);break;case"quarter":t=n(this.year(),this.month()-this.month()%3,1);break;case"month":t=n(this.year(),this.month(),1);break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":t=n(this.year(),this.month(),this.date());break;case"hour":t=this._d.valueOf(),t-=an(t+(this._isUTC?0:6e4*this.utcOffset()),36e5);break;case"minute":t=this._d.valueOf(),t-=an(t,6e4);break;case"second":t=this._d.valueOf(),t-=an(t,1e3);break}return this._d.setTime(t),f.updateOffset(this,!0),this},pn.subtract=Qt,pn.toArray=function(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]},pn.toObject=function(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}},pn.toDate=function(){return new Date(this.valueOf())},pn.toISOString=function(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||9999<n.year()?U(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):O(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",U(n,"Z")):U(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},pn.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e,t,n,s="moment",i="";return this.isLocal()||(s=0===this.utcOffset()?"moment.utc":"moment.parseZone",i="Z"),e="["+s+'("]',t=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",n=i+'[")]',this.format(e+t+"-MM-DD[T]HH:mm:ss.SSS"+n)},"undefined"!=typeof Symbol&&null!=Symbol.for&&(pn[Symbol.for("nodejs.util.inspect.custom")]=function(){return"Moment<"+this.format()+">"}),pn.toJSON=function(){return this.isValid()?this.toISOString():null},pn.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},pn.unix=function(){return Math.floor(this.valueOf()/1e3)},pn.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},pn.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},pn.eraName=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].name;if(t[n].until<=e&&e<=t[n].since)return t[n].name}return""},pn.eraNarrow=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].narrow;if(t[n].until<=e&&e<=t[n].since)return t[n].narrow}return""},pn.eraAbbr=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].abbr;if(t[n].until<=e&&e<=t[n].since)return t[n].abbr}return""},pn.eraYear=function(){for(var e,t,n=this.localeData().eras(),s=0,i=n.length;s<i;++s)if(e=n[s].since<=n[s].until?1:-1,t=this.clone().startOf("day").valueOf(),n[s].since<=t&&t<=n[s].until||n[s].until<=t&&t<=n[s].since)return(this.year()-f(n[s].since).year())*e+n[s].offset;return this.year()},pn.year=Le,pn.isLeapYear=function(){return j(this.year())},pn.weekYear=function(e){return cn.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},pn.isoWeekYear=function(e){return cn.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},pn.quarter=pn.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},pn.month=Ue,pn.daysInMonth=function(){return xe(this.year(),this.month())},pn.week=pn.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},pn.isoWeek=pn.isoWeeks=function(e){var t=Ae(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},pn.weeksInYear=function(){var e=this.localeData()._week;return je(this.year(),e.dow,e.doy)},pn.weeksInWeekYear=function(){var e=this.localeData()._week;return je(this.weekYear(),e.dow,e.doy)},pn.isoWeeksInYear=function(){return je(this.year(),1,4)},pn.isoWeeksInISOWeekYear=function(){return je(this.isoWeekYear(),1,4)},pn.date=fn,pn.day=pn.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t,n,s=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(t=e,n=this.localeData(),e="string"!=typeof t?t:isNaN(t)?"number"==typeof(t=n.weekdaysParse(t))?t:null:parseInt(t,10),this.add(e-s,"d")):s},pn.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},pn.isoWeekday=function(e){if(!this.isValid())return null!=e?this:NaN;if(null==e)return this.day()||7;var t,n,s=(t=e,n=this.localeData(),"string"==typeof t?n.weekdaysParse(t)%7||7:isNaN(t)?null:t);return this.day(this.day()%7?s:s-7)},pn.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},pn.hour=pn.hours=tt,pn.minute=pn.minutes=mn,pn.second=pn.seconds=gn,pn.millisecond=pn.milliseconds=yn,pn.utcOffset=function(e,t,n){var s,i=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null==e)return this._isUTC?i:Et(this);if("string"==typeof e){if(null===(e=Vt(he,e)))return this}else Math.abs(e)<16&&!n&&(e*=60);return!this._isUTC&&t&&(s=Et(this)),this._offset=e,this._isUTC=!0,null!=s&&this.add(s,"m"),i!==e&&(!t||this._changeInProgress?Bt(this,Zt(e-i,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,f.updateOffset(this,!0),this._changeInProgress=null)),this},pn.utc=function(e){return this.utcOffset(0,e)},pn.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Et(this),"m")),this},pn.parseZone=function(){var e;return null!=this._tzm?this.utcOffset(this._tzm,!1,!0):"string"==typeof this._i&&(null!=(e=Vt(le,this._i))?this.utcOffset(e):this.utcOffset(0,!0)),this},pn.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?Tt(e).utcOffset():0,(this.utcOffset()-e)%60==0)},pn.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},pn.isLocal=function(){return!!this.isValid()&&!this._isUTC},pn.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},pn.isUtc=At,pn.isUTC=At,pn.zoneAbbr=function(){return this._isUTC?"UTC":""},pn.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},pn.dates=n("dates accessor is deprecated. Use date instead.",fn),pn.months=n("months accessor is deprecated. Use month instead",Ue),pn.years=n("years accessor is deprecated. Use year instead",Le),pn.zone=n("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}),pn.isDSTShifted=n("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",function(){if(!r(this._isDSTShifted))return this._isDSTShifted;var e,t={};return v(t,this),(t=bt(t))._a?(e=(t._isUTC?_:Tt)(t._a),this._isDSTShifted=this.isValid()&&0<function(e,t,n){for(var s=Math.min(e.length,t.length),i=Math.abs(e.length-t.length),r=0,a=0;a<s;a++)(n&&e[a]!==t[a]||!n&&Z(e[a])!==Z(t[a]))&&r++;return r+i}(t._a,e.toArray())):this._isDSTShifted=!1,this._isDSTShifted});var kn=x.prototype;function Mn(e,t,n,s){var i=dt(),r=_().set(s,t);return i[n](r,e)}function Dn(e,t,n){if(h(e)&&(t=e,e=void 0),e=e||"",null!=t)return Mn(e,t,n,"month");for(var s=[],i=0;i<12;i++)s[i]=Mn(e,i,n,"month");return s}function Sn(e,t,n,s){t=("boolean"==typeof e?h(t)&&(n=t,t=void 0):(t=e,e=!1,h(n=t)&&(n=t,t=void 0)),t||"");var i,r=dt(),a=e?r._week.dow:0,o=[];if(null!=n)return Mn(t,(n+a)%7,s,"day");for(i=0;i<7;i++)o[i]=Mn(t,(i+a)%7,s,"day");return o}kn.calendar=function(e,t,n){var s=this._calendar[e]||this._calendar.sameElse;return O(s)?s.call(t,n):s},kn.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.match(N).map(function(e){return"MMMM"===e||"MM"===e||"DD"===e||"dddd"===e?e.slice(1):e}).join(""),this._longDateFormat[e])},kn.invalidDate=function(){return this._invalidDate},kn.ordinal=function(e){return this._ordinal.replace("%d",e)},kn.preparse=vn,kn.postformat=vn,kn.relativeTime=function(e,t,n,s){var i=this._relativeTime[n];return O(i)?i(e,t,n,s):i.replace(/%d/i,e)},kn.pastFuture=function(e,t){var n=this._relativeTime[0<e?"future":"past"];return O(n)?n(t):n.replace(/%s/i,t)},kn.set=function(e){var t,n;for(n in e)m(e,n)&&(O(t=e[n])?this[n]=t:this["_"+n]=t);this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},kn.eras=function(e,t){for(var n,s=this._eras||dt("en")._eras,i=0,r=s.length;i<r;++i){switch(typeof s[i].since){case"string":n=f(s[i].since).startOf("day"),s[i].since=n.valueOf();break}switch(typeof s[i].until){case"undefined":s[i].until=1/0;break;case"string":n=f(s[i].until).startOf("day").valueOf(),s[i].until=n.valueOf();break}}return s},kn.erasParse=function(e,t,n){var s,i,r,a,o,u=this.eras();for(e=e.toUpperCase(),s=0,i=u.length;s<i;++s)if(r=u[s].name.toUpperCase(),a=u[s].abbr.toUpperCase(),o=u[s].narrow.toUpperCase(),n)switch(t){case"N":case"NN":case"NNN":if(a===e)return u[s];break;case"NNNN":if(r===e)return u[s];break;case"NNNNN":if(o===e)return u[s];break}else if(0<=[r,a,o].indexOf(e))return u[s]},kn.erasConvertYear=function(e,t){var n=e.since<=e.until?1:-1;return void 0===t?f(e.since).year():f(e.since).year()+(t-e.offset)*n},kn.erasAbbrRegex=function(e){return m(this,"_erasAbbrRegex")||hn.call(this),e?this._erasAbbrRegex:this._erasRegex},kn.erasNameRegex=function(e){return m(this,"_erasNameRegex")||hn.call(this),e?this._erasNameRegex:this._erasRegex},kn.erasNarrowRegex=function(e){return m(this,"_erasNarrowRegex")||hn.call(this),e?this._erasNarrowRegex:this._erasRegex},kn.months=function(e,t){return e?o(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||Pe).test(t)?"format":"standalone"][e.month()]:o(this._months)?this._months:this._months.standalone},kn.monthsShort=function(e,t){return e?o(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[Pe.test(t)?"format":"standalone"][e.month()]:o(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},kn.monthsParse=function(e,t,n){var s,i,r;if(this._monthsParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=_([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(i=we.call(this._shortMonthsParse,a))?i:null:-1!==(i=we.call(this._longMonthsParse,a))?i:null:"MMM"===t?-1!==(i=we.call(this._shortMonthsParse,a))||-1!==(i=we.call(this._longMonthsParse,a))?i:null:-1!==(i=we.call(this._longMonthsParse,a))||-1!==(i=we.call(this._shortMonthsParse,a))?i:null}.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(i=_([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(r="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[s]=new RegExp(r.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},kn.monthsRegex=function(e){return this._monthsParseExact?(m(this,"_monthsRegex")||He.call(this),e?this._monthsStrictRegex:this._monthsRegex):(m(this,"_monthsRegex")||(this._monthsRegex=We),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},kn.monthsShortRegex=function(e){return this._monthsParseExact?(m(this,"_monthsRegex")||He.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(m(this,"_monthsShortRegex")||(this._monthsShortRegex=Re),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},kn.week=function(e){return Ae(e,this._week.dow,this._week.doy).week},kn.firstDayOfYear=function(){return this._week.doy},kn.firstDayOfWeek=function(){return this._week.dow},kn.weekdays=function(e,t){var n=o(this._weekdays)?this._weekdays:this._weekdays[e&&!0!==e&&this._weekdays.isFormat.test(t)?"format":"standalone"];return!0===e?Ie(n,this._week.dow):e?n[e.day()]:n},kn.weekdaysMin=function(e){return!0===e?Ie(this._weekdaysMin,this._week.dow):e?this._weekdaysMin[e.day()]:this._weekdaysMin},kn.weekdaysShort=function(e){return!0===e?Ie(this._weekdaysShort,this._week.dow):e?this._weekdaysShort[e.day()]:this._weekdaysShort},kn.weekdaysParse=function(e,t,n){var s,i,r;if(this._weekdaysParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=_([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(i=we.call(this._weekdaysParse,a))?i:null:"ddd"===t?-1!==(i=we.call(this._shortWeekdaysParse,a))?i:null:-1!==(i=we.call(this._minWeekdaysParse,a))?i:null:"dddd"===t?-1!==(i=we.call(this._weekdaysParse,a))||-1!==(i=we.call(this._shortWeekdaysParse,a))||-1!==(i=we.call(this._minWeekdaysParse,a))?i:null:"ddd"===t?-1!==(i=we.call(this._shortWeekdaysParse,a))||-1!==(i=we.call(this._weekdaysParse,a))||-1!==(i=we.call(this._minWeekdaysParse,a))?i:null:-1!==(i=we.call(this._minWeekdaysParse,a))||-1!==(i=we.call(this._weekdaysParse,a))||-1!==(i=we.call(this._shortWeekdaysParse,a))?i:null}.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(i=_([2e3,1]).day(s),n&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(i,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(i,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(i,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[s]||(r="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[s]=new RegExp(r.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[s].test(e))return s;if(n&&"ddd"===t&&this._shortWeekdaysParse[s].test(e))return s;if(n&&"dd"===t&&this._minWeekdaysParse[s].test(e))return s;if(!n&&this._weekdaysParse[s].test(e))return s}},kn.weekdaysRegex=function(e){return this._weekdaysParseExact?(m(this,"_weekdaysRegex")||Qe.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(m(this,"_weekdaysRegex")||(this._weekdaysRegex=qe),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},kn.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(m(this,"_weekdaysRegex")||Qe.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(m(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=Be),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},kn.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(m(this,"_weekdaysRegex")||Qe.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(m(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=Je),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},kn.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},kn.meridiem=function(e,t,n){return 11<e?n?"pm":"PM":n?"am":"AM"},lt("en",{eras:[{since:"0001-01-01",until:1/0,offset:1,name:"Anno Domini",narrow:"AD",abbr:"AD"},{since:"0000-12-31",until:-1/0,offset:1,name:"Before Christ",narrow:"BC",abbr:"BC"}],dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===Z(e%100/10)?"th":1==t?"st":2==t?"nd":3==t?"rd":"th")}}),f.lang=n("moment.lang is deprecated. Use moment.locale instead.",lt),f.langData=n("moment.langData is deprecated. Use moment.localeData instead.",dt);var Yn=Math.abs;function On(e,t,n,s){var i=Zt(t,n);return e._milliseconds+=s*i._milliseconds,e._days+=s*i._days,e._months+=s*i._months,e._bubble()}function bn(e){return e<0?Math.floor(e):Math.ceil(e)}function xn(e){return 4800*e/146097}function Tn(e){return 146097*e/4800}function Nn(e){return function(){return this.as(e)}}var Pn=Nn("ms"),Rn=Nn("s"),Wn=Nn("m"),Cn=Nn("h"),Un=Nn("d"),Hn=Nn("w"),Fn=Nn("M"),Ln=Nn("Q"),Vn=Nn("y");function Gn(e){return function(){return this.isValid()?this._data[e]:NaN}}var En=Gn("milliseconds"),An=Gn("seconds"),jn=Gn("minutes"),In=Gn("hours"),Zn=Gn("days"),zn=Gn("months"),$n=Gn("years");var qn=Math.round,Bn={ss:44,s:45,m:45,h:22,d:26,w:null,M:11};function Jn(e,t,n,s){var i=Zt(e).abs(),r=qn(i.as("s")),a=qn(i.as("m")),o=qn(i.as("h")),u=qn(i.as("d")),l=qn(i.as("M")),h=qn(i.as("w")),d=qn(i.as("y")),c=(r<=n.ss?["s",r]:r<n.s&&["ss",r])||a<=1&&["m"]||a<n.m&&["mm",a]||o<=1&&["h"]||o<n.h&&["hh",o]||u<=1&&["d"]||u<n.d&&["dd",u];return null!=n.w&&(c=c||h<=1&&["w"]||h<n.w&&["ww",h]),(c=c||l<=1&&["M"]||l<n.M&&["MM",l]||d<=1&&["y"]||["yy",d])[2]=t,c[3]=0<+e,c[4]=s,function(e,t,n,s,i){return i.relativeTime(t||1,!!n,e,s)}.apply(null,c)}var Qn=Math.abs;function Xn(e){return(0<e)-(e<0)||+e}function Kn(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n,s,i,r,a,o,u=Qn(this._milliseconds)/1e3,l=Qn(this._days),h=Qn(this._months),d=this.asSeconds();return d?(e=I(u/60),t=I(e/60),u%=60,e%=60,n=I(h/12),h%=12,s=u?u.toFixed(3).replace(/\.?0+$/,""):"",i=d<0?"-":"",r=Xn(this._months)!==Xn(d)?"-":"",a=Xn(this._days)!==Xn(d)?"-":"",o=Xn(this._milliseconds)!==Xn(d)?"-":"",i+"P"+(n?r+n+"Y":"")+(h?r+h+"M":"")+(l?a+l+"D":"")+(t||e||u?"T":"")+(t?o+t+"H":"")+(e?o+e+"M":"")+(u?o+s+"S":"")):"P0D"}var es=Ct.prototype;return es.isValid=function(){return this._isValid},es.abs=function(){var e=this._data;return this._milliseconds=Yn(this._milliseconds),this._days=Yn(this._days),this._months=Yn(this._months),e.milliseconds=Yn(e.milliseconds),e.seconds=Yn(e.seconds),e.minutes=Yn(e.minutes),e.hours=Yn(e.hours),e.months=Yn(e.months),e.years=Yn(e.years),this},es.add=function(e,t){return On(this,e,t,1)},es.subtract=function(e,t){return On(this,e,t,-1)},es.as=function(e){if(!this.isValid())return NaN;var t,n,s=this._milliseconds;if("month"===(e=V(e))||"quarter"===e||"year"===e)switch(t=this._days+s/864e5,n=this._months+xn(t),e){case"month":return n;case"quarter":return n/3;case"year":return n/12}else switch(t=this._days+Math.round(Tn(this._months)),e){case"week":return t/7+s/6048e5;case"day":return t+s/864e5;case"hour":return 24*t+s/36e5;case"minute":return 1440*t+s/6e4;case"second":return 86400*t+s/1e3;case"millisecond":return Math.floor(864e5*t)+s;default:throw new Error("Unknown unit "+e)}},es.asMilliseconds=Pn,es.asSeconds=Rn,es.asMinutes=Wn,es.asHours=Cn,es.asDays=Un,es.asWeeks=Hn,es.asMonths=Fn,es.asQuarters=Ln,es.asYears=Vn,es.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*Z(this._months/12):NaN},es._bubble=function(){var e,t,n,s,i,r=this._milliseconds,a=this._days,o=this._months,u=this._data;return 0<=r&&0<=a&&0<=o||r<=0&&a<=0&&o<=0||(r+=864e5*bn(Tn(o)+a),o=a=0),u.milliseconds=r%1e3,e=I(r/1e3),u.seconds=e%60,t=I(e/60),u.minutes=t%60,n=I(t/60),u.hours=n%24,a+=I(n/24),o+=i=I(xn(a)),a-=bn(Tn(i)),s=I(o/12),o%=12,u.days=a,u.months=o,u.years=s,this},es.clone=function(){return Zt(this)},es.get=function(e){return e=V(e),this.isValid()?this[e+"s"]():NaN},es.milliseconds=En,es.seconds=An,es.minutes=jn,es.hours=In,es.days=Zn,es.weeks=function(){return I(this.days()/7)},es.months=zn,es.years=$n,es.humanize=function(e,t){if(!this.isValid())return this.localeData().invalidDate();var n,s,i=!1,r=Bn;return"object"==typeof e&&(t=e,e=!1),"boolean"==typeof e&&(i=e),"object"==typeof t&&(r=Object.assign({},Bn,t),null!=t.s&&null==t.ss&&(r.ss=t.s-1)),n=this.localeData(),s=Jn(this,!i,r,n),i&&(s=n.pastFuture(+this,s)),n.postformat(s)},es.toISOString=Kn,es.toString=Kn,es.toJSON=Kn,es.locale=tn,es.localeData=sn,es.toIsoString=n("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Kn),es.lang=nn,C("X",0,0,"unix"),C("x",0,0,"valueOf"),ce("x",ue),ce("X",/[+-]?\d+(\.\d{1,3})?/),ye("X",function(e,t,n){n._d=new Date(1e3*parseFloat(e))}),ye("x",function(e,t,n){n._d=new Date(Z(e))}),f.version="2.29.1",e=Tt,f.fn=pn,f.min=function(){return Rt("isBefore",[].slice.call(arguments,0))},f.max=function(){return Rt("isAfter",[].slice.call(arguments,0))},f.now=function(){return Date.now?Date.now():+new Date},f.utc=_,f.unix=function(e){return Tt(1e3*e)},f.months=function(e,t){return Dn(e,t,"months")},f.isDate=a,f.locale=lt,f.invalid=w,f.duration=Zt,f.isMoment=M,f.weekdays=function(e,t,n){return Sn(e,t,n,"weekdays")},f.parseZone=function(){return Tt.apply(null,arguments).parseZone()},f.localeData=dt,f.isDuration=Ut,f.monthsShort=function(e,t){return Dn(e,t,"monthsShort")},f.weekdaysMin=function(e,t,n){return Sn(e,t,n,"weekdaysMin")},f.defineLocale=ht,f.updateLocale=function(e,t){var n,s,i;return null!=t?(i=st,null!=it[e]&&null!=it[e].parentLocale?it[e].set(b(it[e]._config,t)):(null!=(s=ut(e))&&(i=s._config),t=b(i,t),null==s&&(t.abbr=e),(n=new x(t)).parentLocale=it[e],it[e]=n),lt(e)):null!=it[e]&&(null!=it[e].parentLocale?(it[e]=it[e].parentLocale,e===lt()&&lt(e)):null!=it[e]&&delete it[e]),it[e]},f.locales=function(){return s(it)},f.weekdaysShort=function(e,t,n){return Sn(e,t,n,"weekdaysShort")},f.normalizeUnits=V,f.relativeTimeRounding=function(e){return void 0===e?qn:"function"==typeof e&&(qn=e,!0)},f.relativeTimeThreshold=function(e,t){return void 0!==Bn[e]&&(void 0===t?Bn[e]:(Bn[e]=t,"s"===e&&(Bn.ss=t-1),!0))},f.calendarFormat=function(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"},f.prototype=pn,f.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},f});

//log replacement function
var lrf = function(){ /*alert(arguments);*/ };
"undefined"==typeof console?this.console={assert:lrf,clear:lrf,constructor:lrf,count:lrf,debug:lrf,dir:lrf,dirxml:lrf,error:lrf,exception:lrf,group:lrf,groupCollapsed:lrf,groupEnd:lrf,hasOwnProperty:lrf,info:lrf,isPrototypeOf:lrf,keys:lrf,log:lrf,memory:lrf,profile:lrf,profileEnd:lrf,profiles:lrf,propertyIsEnumerable:lrf,table:lrf,time:lrf,timeEnd:lrf,timeStamp:lrf,toLocaleString:lrf,toString:lrf,trace:lrf,values:lrf,warn:lrf,valueOf:lrf}:("undefined"==typeof this.console.assert&&(this.console.assert=lrf),"undefined"==typeof this.console.clear&&(this.console.clear=lrf),"undefined"==typeof this.console.constructor&&(this.console.constructor=lrf),"undefined"==typeof this.console.count&&(this.console.count=lrf),"undefined"==typeof this.console.debug&&(this.console.debug=lrf),"undefined"==typeof this.console.dir&&(this.console.dir=lrf),"undefined"==typeof this.console.dirxml&&(this.console.dirxml=lrf),"undefined"==typeof this.console.error&&(this.console.error=lrf),"undefined"==typeof this.console.exception&&(this.console.exception=lrf),"undefined"==typeof this.console.group&&(this.console.group=lrf),"undefined"==typeof this.console.groupCollapsed&&(this.console.groupCollapsed=lrf),"undefined"==typeof this.console.groupEnd&&(this.console.groupEnd=lrf),"undefined"==typeof this.console.hasOwnProperty&&(this.console.hasOwnProperty=lrf),"undefined"==typeof this.console.info&&(this.console.info=lrf),"undefined"==typeof this.console.isPrototypeOf&&(this.console.isPrototypeOf=lrf),"undefined"==typeof this.console.keys&&(this.console.keys=lrf),"undefined"==typeof this.console.log&&(this.console.log=lrf),"undefined"==typeof this.console.memory&&(this.console.memory=lrf),"undefined"==typeof this.console.profile&&(this.console.profile=lrf),"undefined"==typeof this.console.profileEnd&&(this.console.profileEnd=lrf),"undefined"==typeof this.console.profiles&&(this.console.profiles=lrf),"undefined"==typeof this.console.propertyIsEnumerable&&(this.console.propertyIsEnumerable=lrf),"undefined"==typeof this.console.table&&(this.console.table=lrf),"undefined"==typeof this.console.time&&(this.console.time=lrf),"undefined"==typeof this.console.timeEnd&&(this.console.timeEnd=lrf),"undefined"==typeof this.console.timeStamp&&(this.console.timeStamp=lrf),"undefined"==typeof this.console.toLocaleString&&(this.console.toLocaleString=lrf),"undefined"==typeof this.console.toString&&(this.console.toString=lrf),"undefined"==typeof this.console.trace&&(this.console.trace=lrf),"undefined"==typeof this.console.values&&(this.console.values=lrf),"undefined"==typeof this.console.warn&&(this.console.warn=lrf),"undefined"==typeof this.console.valueOf&&(this.console.valueOf=lrf));

function ccd_preview() {
	// if (typeof $.cookie === "function") {
		// Preview Mode code to allow clients to navigate through a website based on a preview cookie.
		if(getURLParameter("preview") != "null"){
			cp.set_cookie("preview", 1, 2);
		}

		//If in preview mode, adds a button to the right side of the header to close preview mode.
		if (cp.get_cookie('preview') || cp.get_cookie('preview') == 1) {
			$('body').prepend('<div class="btn preview" id="exit-preview"><p>Exit Preview</p></div>');

			//Function to exit preview mode.
			$('#exit-preview').click(function() {
				cp.remove_cookie('preview');
				window.location.replace(location.pathname);
				var cleanUri = location.protocol + '//' + location.host + location.pathname + location.hash;
				window.history.replaceState({}, document.title, cleanUri);
			});
		}
	// }
}

function cp_lazyload(images, video) {
	// Need to include lozad.min.js in global dependencies for this to work.
	// Every img tag needs to have a width and height for this to work in Edge, can use min-width and min-height in CSS if required.
	if(typeof lozad != "undefined")
	{
		const observer = lozad('.lazy', {
	        rootMargin: '100px 150px', // syntax similar to that of CSS Margin
	        threshold: 0.1
	    }); // lazy loads elements with default selector as '.lozad'
	    observer.observe();
	}
}


function getUrlVars(str){
  var vars = [], hash;
  var hashes = str.slice(str.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++){
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// legacy hinty support
var cp_popupFormsHintyOn = false;
var cp_popupFormsHintyOnOverride = false;
if(jQuery)
{
	jQuery.fn.hinty = function() {
		console.warn('hinty.js (input.hinty()) called but no longer supported');
	};

	jQuery.fn.unbindHinty = function() {
		console.warn('hinty.js (input.unbindHinty()) called but no longer supported');
	};
}