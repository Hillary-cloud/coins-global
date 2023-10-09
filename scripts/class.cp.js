
cp.track_event = function(ga_category, ga_action_or_obj, ga_label, ga_value) {
	if(cp.using_ga4)
	{
		if(typeof gtag != 'undefined')
		{
			var parameters = {};

			if(ga_action_or_obj != null && typeof ga_action_or_obj == 'object')
			{
				parameters = ga_action_or_obj;
			}
			else
			{
				if(ga_action_or_obj)
				{
					parameters.eventAction = ga_action_or_obj;
				}
			}

			if(ga_label)
			{
				parameters.eventLabel = ga_label;
			}

			if(ga_value)
			{
				parameters.eventValue = ga_value;
			}

			gtag('event', ga_category, parameters);
		}
	}
	else
	{
		var ga_action = ga_action_or_obj;
		if(typeof _gaq != 'undefined')
		{
			_gaq.push(['_trackEvent', ga_category, ga_action, ga_label, ga_value]);
			_gaq.push(['b._trackEvent', ga_category, ga_action, ga_label, ga_value]);
		}
	}
}

cp.set_cookie = function(name, value, days, path) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*86400000));
        expires = "; expires=" + date.toUTCString();
    }
    if (!path) {
    	path = CP_ROOT;
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path="+path;
}

cp.get_cookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

cp.remove_cookie = function(name, path) {
	if( cp.get_cookie( name ) ) {
		if (!path) {
	    	path = CP_ROOT;
	    }
	    document.cookie = name + "= ; expires=Thu, 01 Jan 1970 00:00:01 GMT; path="+path;
	}
}

cp.show_not_logged_in_error_popup = function() {
	cpShowPopup('Login Session Expired', '<p></p>It looks like you\'re no longer logged in.</p><p>Please click <i>Reload</i> below or <a href="cp/login/" target="_blank">click here</a> to log in in a new tab.</p><p>&nbsp;</p>', null, function(){location.reload();}, null, 'Reload');
}

cp.show_error = function(error_message, method_name, responseCode, XMLHttpRequest, textStatus, errorThrown) {

	if(error_message)
	{
		cp_toasts_add({message: error_message, type: 2});
	}

	if(method_name && CPO_DEBUG)
	{
		var error_string = method_name+"() error";
		if(typeof responseCode !== 'undefined')
		{
			error_string += ", responseCode: "+responseCode;
		}
		console.error(error_string);

		if(textStatus)
		{
			console.error("textStatus:", textStatus);
		}

		if(errorThrown)
		{
			console.error("errorThrown:", errorThrown);
		}

		if(XMLHttpRequest)
		{
			console.error("XMLHttpRequest.responseText:", XMLHttpRequest.responseText);
		}
	}
}

if(cp.using_ga4)
{
	if(typeof _gaq == 'undefined')
	{
		var _gaq = {};
		_gaq.push = function(arr) {
			if(arr[0].match(/^.*_trackEvent$/))
			{
				cp.track_event(arr[2], arr[1], arr[3], arr[4]);
			}
		}
	}
}