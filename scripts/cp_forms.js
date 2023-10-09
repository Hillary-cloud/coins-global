


function cp_forms_init($form, form_templates, form_options) {

	initFormStyles({$wrapper: $form});

	$form.data('form_templates', form_templates);

	$form.find('.removeBlockBtn').click(cp_forms_remove_block_click);
	$form.find('[id^="addFieldsBtn"]').click(cp_forms_add_field_click);

	$form.submit(cp_forms_submit);

	if(form_options.warnBeforeUnload)
	{
		cp_forms_init_warn_before_unload($form);
	}

	add_client_referrer_data_to_form($form);

	if($form.find('.btn.cpFormSubmit').length > 0)
	{
		var $cpFormSubmit = $form.find('.btn.cpFormSubmit').click(function(){$form.submit();});
		$form.data("cpFormsSubmitButtons", $cpFormSubmit);
	}
}

function add_client_referrer_data_to_form($form) {

	if (cp.config.recruitment.client_referrer_collection_enabled && !cp.in_cp && $form.find('input[name=client_referrer]').length > 0)
	{
		var ccd_client_referrer = ccd_client_referrer_cookie();

		if(ccd_client_referrer != null)
		{
			$form.find('input[name=client_referrer]').val(ccd_client_referrer);
		}
	}
}

function cp_forms_init_warn_before_unload($form) {
	$form.change(cp_forms_on_change);
	var formHash = $form.serialize().toHash();
	$form.data("initial_hash", formHash);
}

function cp_forms_on_change($form) {
	cp_forms_update_before_unload($(this).closest('form'));
}

function cp_forms_update_before_unload($form, turnOff) {
	if(turnOff === true || $form.serialize().toHash() == $form.data("initial_hash"))
	{
		window.onbeforeunload = null;
	}
	else {
		window.onbeforeunload = function(e) {
			var dialogText = 'You have unsaved changes in your form.';
			e.returnValue = dialogText;
			return dialogText;
		};
	}
}

function cp_forms_remove_block_click() {

	var $form = $(this).closest('form');
	var use_table = $form.find('input[name="use_table"]').val() == 1;

	var id_split = $(this).attr('id').replace("removeBlockBtn", "").split("_");
	var block_id = id_split[0];
	var grandparent_form_id = id_split[1];
	var grandparent_form_seq = id_split[2];
	var parent_form_id = id_split[3];
	var parent_form_seq = id_split[4];
	var block_seq = id_split[5];

	var block_suffix = block_id+"_"+grandparent_form_id+"_"+grandparent_form_seq+"_"+parent_form_id+"_"+parent_form_seq;

	var $blockWrapper = $('#blockWrapper'+block_suffix+"_"+block_seq);

	var tr_or_div = use_table ? "tr" : "div";

	numBlocksRemaining = $form.find(tr_or_div+'[id^="blockWrapper'+block_suffix+'_"]').length;

	var animate = numBlocksRemaining > 1;

	var $next = $blockWrapper.next();
	var $prev = $blockWrapper.prev();

	var $closestDivider = $next.is('.blockDivider') ? $blockWrapper.next() : $blockWrapper.prev();

	var removeDivider = numBlocksRemaining > 1 && $closestDivider.length > 0;

	if(animate)
	{
		if(removeDivider)
		{
			var animTo = {
				  height: 0
				, paddingTop: 0
				, paddingBottom: 0
				, marginTop: 0
				, marginBottom: 0
				, opacity: 0
			};

			$closestDivider.animate(animTo, 200, 'easeOutSine', function(){ $(this).remove(); });
		}

		$blockWrapper.addClass("removing").find('.blockAnimWrapper').animate(animTo, 200, 'easeOutSine');

		setTimeout(function(){
			$blockWrapper.remove();
		}, 200);
	}
	else
	{
		if(removeDivider)
		{
			$closestDivider.remove();
		}
		$blockWrapper.remove();
	}

	if(numBlocksRemaining == 1)
	{
		cp_forms_add_field($form.find('#addFieldsBtn'+block_suffix), false);
	}

	cp_forms_update_before_unload($form);
}

function cp_forms_add_field_click() {
	cp_forms_add_field($(this));
}

function cp_forms_add_field($btn, animate) {

	animate = animate == null ? true : animate;

	var $form = $btn.closest('form');

	var id_split = $btn.attr('id').split("_");

	var block_id = id_split[0].replace("addFieldsBtn", "");
	var grandparent_form_id = parseInt(id_split[1]);
	var grandparent_form_seq = parseInt(id_split[2]);
	var parent_form_id = parseInt(id_split[3]);
	var parent_form_seq = parseInt(id_split[4]);

	var use_table = $form.find('input[name="use_table"]').val() == 1;

	var dividerHTML = use_table ? '<tr class=\"blockDivider\"><td colspan=\"999\"></td></tr>' : '<div class="blockDivider"></div>';
	var tr_or_div = use_table ? "tr" : "div";

	var last_block_wrapper_selector = tr_or_div+'[id^="blockWrapper'+block_id+'_'+grandparent_form_id+'_'+grandparent_form_seq+'_'+parent_form_id+'_'+parent_form_seq+'_"]';
	var $last_block_wrapper = $form.find(last_block_wrapper_selector).last();

	var newSeq = 0;

	if($last_block_wrapper.length > 0)
	{
		var last_block_wrapper_id = $last_block_wrapper.attr("id");
		id_split = last_block_wrapper_id.split("_");
		newSeq = parseInt(id_split[5]) + 1;
	}

	var form_html_and_javascript = cp_forms_process_form_templates($form, block_id, grandparent_form_seq, parent_form_seq, newSeq);

	var $block_wrapper = $(form_html_and_javascript.html);

	$block_wrapper.find('.removeBlockBtn').click(cp_forms_remove_block_click);
	$block_wrapper.find('[id^="addFieldsBtn"]').click(cp_forms_add_field_click);

	var $block_divider = animate ? $(dividerHTML) : "";

	if($block_wrapper.first().hasClass('blockDivider'))
	{//block already has a divider - we need this sometimes for subforms
		$block_wrapper = $block_wrapper.last();
	}

	if(use_table)
	{
		$btn.closest('tr').before($block_divider, $block_wrapper);
	}
	else
	{
		$btn.before($block_divider, $block_wrapper);
	}

	eval(form_html_and_javascript.javascript);
	initFormStyles({$wrapper: $block_wrapper});

	if(animate)
	{
		var animFrom = {
			  height: 0
			, paddingTop: 0
			, paddingBottom: 0
			, marginTop: 0
			, marginBottom: 0
			, opacity: 0
		};

		var animTo = {
			  height: $block_divider[0].scrollHeight
			, paddingTop: $block_divider.css("padding-top")
			, paddingBottom: $block_divider.css("padding-bottom")
			, marginTop: $block_divider.css("margin-top")
			, marginBottom: $block_divider.css("margin-bottom")
			, opacity: 1
		};

		$block_divider.animate(animFrom, 0).animate(animTo, 200, 'easeOutSine', function(){ $block_divider.height(""); });

		animTo = {
			  height: $block_wrapper[0].scrollHeight
			, paddingTop: $block_wrapper.css("padding-top")
			, paddingBottom: $block_wrapper.css("padding-bottom")
			, marginTop: $block_wrapper.css("margin-top")
			, marginBottom: $block_wrapper.css("margin-bottom")
			, opacity: 1
		};

		$block_wrapper.find('.blockAnimWrapper').first().animate(animFrom, 0).animate(animTo, 200, 'easeOutSine', function(){ $(this).height("").css('overflow', 'visible'); });
	}

	cp_forms_update_before_unload($form);
}

function cp_forms_process_form_templates($form, template_id, grandparent_form_seq, parent_form_seq, newSeq, html_only, javascript_only) {

	html_only = html_only == null ? false : html_only == true;
	javascript_only = javascript_only == null ? false : javascript_only == true;

	var form_templates = $form.data('form_templates');
	var form_template = form_templates[template_id];

	var keys = ["{{grandparent_form_seq}}", "{{parent_form_seq}}", "{{seq}}"];
	var replacements = [grandparent_form_seq, parent_form_seq, newSeq];

	var newHTML = "";
	var newScripts = "";

	if(!javascript_only) //normally only used on subsequent recursions
	{
		/******************************************/
		/******** replace HTML recursively ********/
		/******************************************/

		newHTML = str_replace(keys, replacements, form_template.html);

		var html_regex = /{{subform_html_(\d+)}}/g;
		var html_result;
		while ((html_result = html_regex.exec(newHTML)) !== null) {

			var subform = cp_forms_process_form_templates($form, parseInt(html_result[1]), parent_form_seq, newSeq, 0, true);

			newHTML = newHTML.slice(0, html_result.index) + subform.html + newHTML.slice(html_result.index+html_result[0].length);

			// regex is stateful, reset its index as we have modified newHTML
			html_regex.lastIndex = 0;
		}
	}

	if(!html_only) //normally only used on subsequent recursions
	{
		/******************************************/
		/***** replace javascript recursively *****/
		/******************************************/

		newScripts = str_replace(keys, replacements, form_template.javascript);

		var javascript_regex = new RegExp(/{{subform_javascript_(\d+)}}/g);
		var javascript_result;
		while ((javascript_result = javascript_regex.exec(newScripts)) !== null) {

			var subform = cp_forms_process_form_templates($form, parseInt(javascript_result[1]), parent_form_seq, newSeq, 0, false, true);

			newScripts = newScripts.slice(0, javascript_result.index) + subform.javascript + newScripts.slice(javascript_result.index+javascript_result[0].length);

			// regex is stateful, reset its index as we have modified newScripts
			javascript_regex.lastIndex = 0;
		}
	}

	return({html: newHTML, javascript: newScripts});
}

function cp_forms_trigger_subform(e) {

	var subforms = $(this).data('subforms');
	var val = $(this).val();
	var subform_cpda_id = subforms[val];

	var id_split = $(this).attr('id').split("_");

	var grandparent_form_id = parseInt(id_split[1]);
	var grandparent_form_seq = parseInt(id_split[2]);
	var parent_form_id = parseInt(id_split[3]);
	var parent_form_seq = parseInt(id_split[4]);
	var seq = parseInt(id_split[5]);

	for(var i in subforms)
	{
		if(subforms.hasOwnProperty(i))
		{
			var subform_id = 'cpForm'+subforms[i]+'_'+grandparent_form_id+'_'+grandparent_form_seq+'_'+parent_form_id+'_'+parent_form_seq+'_'+seq;
			var $subFormWrapper = $('#'+subform_id);

			if($subFormWrapper.length > 0)
			{
				if(typeof $subFormWrapper.data("subformOn") == "undefined")
				{
					$subFormWrapper.data("subformOn", $subFormWrapper.hasClass('on'));
				}

				if(subforms[i] != subform_cpda_id)
				{
					if($subFormWrapper.data("subformOn") == true)
					{
						cp_forms_subform_anim_close($subFormWrapper);
					}
				}
				else
				{
					if($subFormWrapper.data("subformOn") != true)
					{
						cp_forms_subform_anim_open($subFormWrapper);
					}
				}
			}
		}
	}
}

function cp_forms_subform_anim_close($subFormWrapper) {

	$subFormWrapper.data("subformOn", false).stop().removeClass('on');

	var $subFormAnimWrapper = $subFormWrapper.find('.subFormAnimWrapper').first();

	var animTo = {
		  height: 0
		, paddingTop: 0
		, paddingBottom: 0
		, marginTop: 0
		, marginBottom: 0
		, opacity: 0
	};

	$subFormAnimWrapper.stop().animate(animTo, 200, 'easeOutSine', function(){
		$(this).height("");
		$subFormWrapper.addClass('off');
	});
}

function cp_forms_subform_anim_open($subFormWrapper) {

	$subFormWrapper.data("subformOn", true).stop().removeClass('off').addClass('on');

	var $subFormAnimWrapper = $subFormWrapper.find('.subFormAnimWrapper').first();

	var animFrom = {
		  height: 0
		, paddingTop: 0
		, paddingBottom: 0
		, marginTop: 0
		, marginBottom: 0
		, opacity: 0
	};

	var animTo = {
		  height: $subFormAnimWrapper[0].scrollHeight
		, paddingTop: $subFormAnimWrapper.css("padding-top")
		, paddingBottom: $subFormAnimWrapper.css("padding-bottom")
		, marginTop: $subFormAnimWrapper.css("margin-top")
		, marginBottom: $subFormAnimWrapper.css("margin-bottom")
		, opacity: 1
	};

	$subFormAnimWrapper.stop().animate(animFrom, 0).animate(animTo, 200, 'easeOutSine', function(){
		$(this).css({height: "", overflow: "visible"});
	});
}

function cp_forms_sort_code_change(e) {
	if($(this).val().toString().length == 2 && (mobile || this.selectionStart == 2))
	{
		$(this).nextAll("input").first().focus().select();
	}
}

function cp_forms_document_upload_on_complete(id, fileName, responseJSON) {

	var fieldName = this._element.id.replace('_upload_drop_zone', '');

	var qtip_api = $('#'+fieldName+'_upload_button').removeClass("cpFormsInvalid").qtip('api');
	if(typeof qtip_api != "undefined")
	{
		qtip_api.destroy();
	}

	if(responseJSON.error)
	{
		alert(responseJSON.error);
	}
	else
	{
		$(this._element).find('.qq-upload-list').empty();

		if(typeof responseJSON.uploadName != "undefined")
		{
			cp_forms_document_set_file(fieldName, fileName, responseJSON.uploadName);
		}
	}
}

function cp_forms_document_set_file(fieldName, original_filename, filesystem_filename) {

	original_filename = original_filename.replace(',', '');

	$('#'+fieldName+'_upload_filename_new').val(original_filename + ',' + filesystem_filename);
	$('#'+fieldName+'_upload_filename_text').html(original_filename);

	$('#'+fieldName+'_new_file_wrapper').hide();
	$('#'+fieldName+'_existing_file_wrapper').show();

}

function cp_forms_document_remove_click(e) {

	var fieldName = $(this).attr('id').replace('_remove_button', '');
	cp_forms_document_remove_file(fieldName);

}

function cp_forms_document_remove_file(fieldName) {

	$('#'+fieldName+'_upload_filename_new').val('');
	$('#'+fieldName+'_upload_filename_text').html('');

	$('#'+fieldName+'_new_file_wrapper').removeClass('processing').show();
	$('#'+fieldName+'_existing_file_wrapper').hide();

}

function cp_forms_document_upload_on_error(id, fileName, errorReason) {
	alert("Error uploading file, please try again");
	var fieldName = this._element.id.replace('_upload_drop_zone', '');
	cp_forms_document_remove_file(fieldName);
}

function cp_forms_document_upload_on_upload() {
	var fieldName = this._element.id.replace('_upload_drop_zone', '');
	$('#'+fieldName+'_new_file_wrapper').addClass('processing');

	var qtip_api = $('#'+fieldName+'_upload_button').removeClass("cpFormsInvalid").qtip('api');
	if(typeof qtip_api != "undefined")
	{
		qtip_api.destroy();
	}
}

//has some bug where it sometimes picks up hidden but mandatory fields?
function cp_client_side_validation($form){


	var error_count = 0;
	var error_details = {
		  errors : []
		 ,form_cpda_id : $form.find('input[name=form_cpda_id]').val()
		 ,success : false

	};

	$form.find('.mandatory').each(function(){
		$input_field = $(this).find('input, textarea, select');
		$users_input = $input_field.val();
		if($users_input.length < 1){
			error_count++;
			error_item = {
				 error_code : 0
				,field_name : $input_field.attr("name")
				,manditory : true
				,field_title : $input_field.attr("placeholder")
			};
			error_details.errors.push(error_item);
		}
	});


	$form.find('.set_fieldtype_form_consent_email, .set_fieldtype_form_email').each(function(){
		$input_field = $(this).find('input');
		$users_input = $input_field.val();
		//the length check is to avoid empty optional email addresses failing validation
		if($users_input.length > 0 && !validateEmail($users_input)){
			error_count++;
			error_item = {
				 error_code : 2
				,field_name : $input_field.attr("name")
				,manditory : true
				,field_title : $input_field.attr("placeholder")
			};
			error_details.errors.push(error_item);
		}
	});



	if(error_count > 0){
		cp_forms_submission_success(error_details, $form, true, null);
		return false;
	}

	return true;
}

function cp_forms_submit(e) {

	e.preventDefault();

	var $form = $(this);

	if(!navigator.onLine && !cp_client_side_validation($form)){
		return false;
	}

	if(cp_forms_prepare_for_submission($form))
	{

		//check if offline. if offline, check for service worker. cache submission if so.
		//I'm disabling this for now because it should probably be on a flag. we don't have a robust process for handling offline submissions which fail validation. addressible with complete client-side validation. we have partial client side navigation at the moment and it has proven to be buggy, so we can't rely on that yet.
		if(!navigator.onLine && false){

			$form_json = $form.serializeArray();

			let offline_submitted_forms;

			if (localStorage.getItem('offline_submitted_forms')) {
				offline_submitted_forms = JSON.parse(localStorage.getItem('offline_submitted_forms'));
			} else {
				offline_submitted_forms = [];
			}

			offline_submitted_forms.push($form_json);

			localStorage.setItem('offline_submitted_forms', JSON.stringify(offline_submitted_forms));
			console.log("You are offline! We will hold a copy of your form in your local browser storage. We'll check periodically if you are online and then the form will submit.");

			//normally the server responds with some stuff including the form_cpda_id which is then passed to the callbackfunction (if present). in this scenario lets grab it from the hidden form input
			let form_cpda_id;
			for (index = 0; index < $form_json.length; ++index) {
				if($form_json[index]["name"] == "form_cpda_id"){
			    	form_cpda_id = $form_json[index]["value"];
				}
			}

			//and now call the success callback
			if(typeof cp_forms_callback_success != "function" || cp_forms_callback_success($form, form_cpda_id) === false)
			{
				$form.find('.cpFormWrapper').slideUp(300);
				$form.append('<p class="cpFormDefaultSuccessText">You appear to be offline, but we will submit your form as soon as you come back online.</p>');
			}

		}
		else{
			//lets submit
			var submit_action = $form.attr('action') == null ? "cp_forms.php" : $form.attr('action');
			$.ajax({
				type : 'POST',
				url : submit_action,
				dataType : 'json',
				data: $form.serializeArray(),
				success : function(data){
					cp_forms_processFormResponse(data, $form);
				},
				error:  function(XMLHttpRequest, textStatus, errorThrown) {
					cp_forms_submission_error($form, XMLHttpRequest);
				}
			});
		}


	}

	return false;
}

function cp_forms_clear_errors($form) {

	$('.qtip').each(function(){
		cp_forms_destroy_qtip($(this));
	});

	$form.find(".cpFormsInvalid").each(function(){
		cp_forms_destroy_qtip($(this).removeClass("cpFormsInvalid"));
	});

}

function cp_forms_destroy_qtip($elm) {
	var qtip = $elm.qtip('api') ? $elm.qtip('api') : $elm.data('qtip');
	if(qtip)
	{
		qtip.destroy(true);
	}
}

function cp_forms_prepare_for_submission($form) {

	if($form.data("cpFormsSubmitting") != true)
	{
		cp_forms_update_before_unload($form, true);

		cp_forms_clear_errors($form);

		$form.data("cpFormsSubmitting", true);
		$form.data("cpFormsSubmitButtons").addClass('loading');

		return true;
	}

	return false;
}

function cp_forms_submission_error($form, XMLHttpRequest) {
	cp_forms_update_before_unload($form);
	$form.data("cpFormsSubmitButtons").removeClass('loading');
	$form.data("cpFormsSubmitting", false);
	if(cp.in_cp)
	{
		cp.show_error('Form error', 'cp_forms_submission_error', null, XMLHttpRequest);
	}
	else
	{
		console.log("Form error: ", XMLHttpRequest.responseText);
	}
}

//error codes
/*
-1 = this is a custom message from serverside
0 = mandatory field left blank
1 = confirm field left blank
2 = invalid email address
3 = email address confirm field does not match
4 = invalid password
5 = mandatory checkbox not checked
6 = select menu option not selected
7 = year range to is less than from
8 = mandatory value not present
9 = NMC or HPC PIN must be 8 characters long
10 = NMC or HPC PIN must contain only letters and numbers
11 = no data submitted
12 = invalid captcha
13 = mandatory yes/no not checked
14 = multi select menu option not selected
15 = value is not numeric
16 = subform missing
17 = bank account number invalid
18 = sort code invalid
19 = mandatory file not uploaded
20 = date too far in future
21 = salary lower than minimum wage
22 = too many options selected
23 = too many words
24 = vat number invalid
25 = email address already in use
26 = app portal - mandatory data is missing from a subform
27 = manage my data form too many requests
28 = date of birth too far in future
29 = number should be 10 digits
30 = password confirm field does not match
31 = National Insurance Number must be 9 characters long
32 = National Insurance Number must be in the format AA999999A
33 = must have a from and to date
*/
var cpFormResponseMessages = {
	  "0": "This field cannot be left blank"
	, "1": "This field cannot be left blank"
	, "2": "Please type a valid email address"
	, "3": "Email addresses do not match"
	, "4": "Password must be at least 8 characters and include at least one letter and one number"
	, "5": "This field must be checked"
	, "6": "You must select an option"
	, "7": "'From' date must not be more recent than 'To'"
	, "8": "{{field_title}} is missing"
	, "9": "NMC or HPC PIN must be 8 characters long"
	, "10": "NMC or HPC PIN must be in the format 99A9999A"
	, "11": "No data was submitted"
	, "12": "Captcha check failed, please try again"
	, "13": "You must answer yes"
	, "14": "You must select at least one option"
	, "15": "This field must contain only numbers"
	, "16": "Some data is missing"
	, "17": "{{field_title}} must be 8 digits"
	, "18": "{{field_title}} must be 6 digits"
	, "19": "No file was uploaded"
	, "20": "Date too far in future"
	, "21": "The salary you have specified is lower than minimum wage"
	, "22": "You must select no more than {{max_options}} options"
	, "23": "Please enter no more than {{max_words}} words"
	, "24": "VAT number is invalid"
	, "25": "Email address is already in use"
	, "26": "" // app portal - mandatory data is missing from a subform
	, "27": "You have submitted too many requests, please try again later"
	, "28": "Invalid Date of Birth"
	, "29": "{{field_title}} must be {{string_length}} {{string_type}}"
	, "30": "Passwords do not match"
	, "33": "You must choose both a 'from' and 'to' date"
	, "34": "{{field_title}} must be in the format '{{string_format}}'"
};

var cpFormMobileResponseMessages = {
	  "0": "{{field_title}} cannot be left blank"
	, "1": "{{field_title}} cannot be left blank"
	, "2": "Please type a valid email address"
	, "3": "Email addresses do not match"
	, "4": "Password must be at least 8 characters and include at least one letter and one number"
	, "5": "This field must be checked: {{field_title}}"
	, "6": "You must select an option: {{field_title}}"
	, "7": "'From' date must not be more recent than 'To'"
	, "8": "{{field_title}} is missing"
	, "9": "NMC or HPC PIN must be 8 characters long"
	, "10": "NMC or HPC PIN must be in the format 99A9999A"
	, "11": "No data was submitted"
	, "12": "Captcha check failed, please try again"
	, "13": "{{field_title}}: You must answer yes"
	, "14": "{{field_title}}: You must select at least one option"
	, "15": "{{field_title}} must contain only numbers"
	, "16": "Some data is missing"
	, "17": "{{field_title}} must be 8 digits"
	, "18": "{{field_title}} must be 6 digits"
	, "19": "{{field_title}}: No file was uploaded"
	, "20": "{{field_title}}: Date too far in future"
	, "21": "The salary you have specified is lower than minimum wage"
	, "22": "{{field_title}}: You must select no more than {{max_options}} options"
	, "23": "{{field_title}}: Please enter no more than {{max_words}} words"
	, "24": "VAT number is invalid"
	, "25": "{{field_title}}: Email address is already in use"
	, "26": "" // app portal - mandatory data is missing from a subform
	, "27": "You have submitted too many requests, please try again later"
	, "28": "{{field_title}}: Invalid Date of Birth"
	, "29": "{{field_title}} must be {{string_length}} {{string_type}}"
	, "30": "Passwords do not match"
	, "33": "You must choose both a 'from' and 'to' date"
	, "34": "{{field_title}} must be in the format '{{string_format}}'"
};

function cp_forms_processFormResponse(data, $form, divider_cpda_id, skipDefaultFormSubmittedAnimation) {

	var keepLoadingSpinnersOnSuccess = false;
	skipDefaultFormSubmittedAnimation = skipDefaultFormSubmittedAnimation === true;
	var showDefaultFormSubmittedAnimation = !skipDefaultFormSubmittedAnimation;

	if(data.success)
	{
		if (data.form_cpda_id == "-18") {
			cp_googleTagManagerTrack('job_application');
  			cp_facebookPixelTrack('SubmitApplication');
		}
		else
		{
			cp_googleTagManagerTrack('form_submission');
  			cp_facebookPixelTrack('FormSubmission', {form_cpda_id: data.form_cpda_id});
		}

		if(typeof cp_forms_callback == "function")
		{
			cp_forms_callback(data);
		}

		if(typeof cp_forms_callback_success == "function")
		{
			var callback_success_response = cp_forms_callback_success($form, data.form_cpda_id);

			if(callback_success_response === true || callback_success_response === 1) // return true or a 1 to skip the default submitted animation
			{
				showDefaultFormSubmittedAnimation = false;
			}
			else if(callback_success_response === 2) // return 2 to skip the default submitted animation AND keep the loading spinners on
			{
				showDefaultFormSubmittedAnimation = false;
				keepLoadingSpinnersOnSuccess = true;
			}
		}

		if(showDefaultFormSubmittedAnimation)
		{
			$form.find('.cpFormWrapper').slideUp(300);
			$form.append('<p class="cpFormDefaultSuccessText">Form submitted successfully.</p>');
		}
	}

	return cp_forms_submission_success(data, $form, keepLoadingSpinnersOnSuccess, divider_cpda_id);
}

function cp_forms_submission_success(data, $form, keepLoadingSpinnersOnSuccess, divider_cpda_id) {

	if(typeof CPO_DEBUG != "undefined" && CPO_DEBUG == true)
	{
		console.log("data: ", data);
	}

	keepLoadingSpinnersOnSuccess = keepLoadingSpinnersOnSuccess == true;

	if(!data.success || !keepLoadingSpinnersOnSuccess)
	{
		if(typeof $form.data("cpFormsSubmitButtons") !== "undefined")
		{
			$form.data("cpFormsSubmitButtons").removeClass('loading');
		}
	}

	if(data.success)
	{
		return true;
	}

	var responseMessages = mobile ? cpFormMobileResponseMessages : cpFormResponseMessages;

	var $wrapper = $form == null ? $('body') : $form;

	var $container = $('body');
	if($form.parents('.cpMain').length > 0)
	{
		$container = $('#cpMain');
	}

	if($form != null)
	{
		$form.data("cpFormsSubmitting", false);
	}

	if($form.find('.set_fieldtype_form_captcha').length > 0)
	{
		grecaptcha.reset();
	}

	for(var j in data.errors)
	{
		if(data.errors[j].error_code == 26)
		{
			$('#popupFormContent').find('form').submit();
			return false;
		}
	}

	if(typeof window.cpFormsDontFocusOnError == "undefined")
	{
		window.cpFormsDontFocusOnError = [];
	}

	for(var i in data.errors)
	{
		if(data.errors.hasOwnProperty(i) && (divider_cpda_id == null || data.errors[i].divider_id == divider_cpda_id))
		{
			var $input = null;

			if(data.errors[i].field_name != null && data.errors[i].field_name != "")
			{
				var field_name = data.errors[i].field_name;

				var lookup_name = field_name;
				if(data.errors[i].subfield_name_suffix)
				{
					lookup_name += data.errors[i].subfield_name_suffix;
				}

				var tokenArray = ["{{field_title}}", "{{max_words}}", "{{max_options}}", "{{string_length}}", "{{string_type}}", "{{string_format}}"];
				var tokenReplaceArray = [data.errors[i].field_title, data.errors[i].max_words, data.errors[i].max_options, data.errors[i].string_length, data.errors[i].string_type, data.errors[i].string_format];
				var errorMessage =
					data.errors[i].error_code == -1 ? data.errors[i].custom_error_message
					: str_replace(tokenArray, tokenReplaceArray, responseMessages[data.errors[i].error_code]);

				if(data.errors[i].error_code != 12 && data.errors[i].error_code != 19)
				{
					var fieldNameLastChar = field_name.substr(field_name.length - 1);
					if(fieldNameLastChar == "*")
					{
						var fieldNameWithoutLastChar = field_name.substr(0, field_name.length - 1);
						$input = $wrapper.find('input[name^="'+fieldNameWithoutLastChar+'"]').first();
						if($input.length == 0)
						{
							$input = $wrapper.find('textarea[name^="'+fieldNameWithoutLastChar+'"]').first();

							if($input.length == 0)
							{
								if(mobile)
								{
									$input = $wrapper.find('select[name^="'+fieldNameWithoutLastChar+'"]').first();
								}

								if($input.length == 0)
								{
									$input = null;
								}
							}
						}
					}
					else
					{
						$input = $wrapper.find('input[name="'+lookup_name+'"]');
						if($input.length == 0)
						{
							$input = $wrapper.find('textarea[name="'+lookup_name+'"]');

							if($input.length == 0 && mobile)
							{
								$input = $wrapper.find('select[name="'+lookup_name+'"]');
							}
						}
					}

					//if we have found the culprit input
					if($input != null)
					{
						var fieldTypeAndElm = fsGetFieldTypeAndElm($input);
						if(fieldTypeAndElm != false)
						{
							var fieldType = fieldTypeAndElm.fieldType;
							var $field = fieldTypeAndElm.$elm;
							var $tinyMCE = null;

							if($field.is("textarea") && typeof tinyMCE != "undefined" && tinyMCE.get(lookup_name))
							{
								fieldType = "html";
								$tinyMCE = $(tinyMCE.get(lookup_name).getContainer());
							}

							if(!mobile)
							{
								var tooltipOptions = {
									  content: errorMessage
								    , position: {
								          my: 'left center'
								        , at: 'right center'
								        , viewport: $(window)
								        , effect: false
								        , container: $container
								    }
								    , show: {
								          event: 'focus mouseenter'
								        , effect: function(offset) {
								            $(this).fadeIn(50);
								        }
								       	, ready: i == 0 && window.cpFormsDontFocusOnError.indexOf(parseInt(data.form_cpda_id)) !== -1
								    }
								    , hide: {
								          event: 'blur change mouseleave'
								        , effect: function(offset) {
								            $(this).fadeOut(50);
								        }
								          // event: false
								    }
								    , style: {
								          classes: 'cpErrorTooltip qtip-shadow'
								        , tip: {
								            width: 8
								        }
								    }
								};

								$.fn.qtip.zindex = 99999;

								switch(fieldType) {
									case "select":
									case "formStyledSelect":
										break;
									case "checkbox":
									case "formStyledCheckbox":
									case "formStyledPlaceholderCheckbox":
										tooltipOptions.position.my = 'top left';
										tooltipOptions.position.at = 'bottom center';
										tooltipOptions.position.adjust = {y: 2};
										tooltipOptions.show.ready = true;
										tooltipOptions.show.event = false;
										tooltipOptions.hide.event = 'change';
										tooltipOptions.hide.target = $input;
										break;
									case "formStyledRadio":
										tooltipOptions.position.my = 'center right';
										tooltipOptions.position.at = 'center left';
										tooltipOptions.position.adjust = {x: -2};
										$field = $field.first().parent().parent();
										break;
									case "html":
										// tinyMCEObj
										tooltipOptions.position.my = 'bottom right';
										tooltipOptions.position.at = 'top right';
										tooltipOptions.position.target = $tinyMCE;
										tooltipOptions.position.adjust = {x: 2};
										tooltipOptions.show.ready = true;
										tooltipOptions.show.event = false;
										tooltipOptions.hide.event = false;
										break;
								}

								if($field.data("qtipOptions") != undefined)
								{
									$.extend(tooltipOptions, $field.data("qtipOptions"));
								}
								else if($field.hasClass("cpFormsTooltipLeft"))
								{
									tooltipOptions.position.my = 'right center';
									tooltipOptions.position.at = 'left center';
								}
								else if($field.hasClass("cpFormsTooltipBottom"))
								{
									tooltipOptions.position.my = 'top center';
									tooltipOptions.position.at = 'bottom center';
								}
								else if($field.hasClass("cpFormsTooltipTop"))
								{
									tooltipOptions.position.my = 'bottom center';
									tooltipOptions.position.at = 'top center';
								}
								else if($field.hasClass("cpFormsTooltipBottomRight"))
								{
									tooltipOptions.position.my = 'top left';
									tooltipOptions.position.at = 'bottom right';
								}

								if(fieldType == "html")
								{
									$tinyMCE.addClass("cpFormsInvalid");
								}
								else if(fieldType == "cp_form_field_address_lookup")
								{
									CPFormFieldAddressLookup_toggle_manual_mode(true, field_name);
								}

								$field.addClass("cpFormsInvalid").qtip(tooltipOptions);
							}
							else
							{
								alert(errorMessage);
								$field.addClass("cpFormsInvalid");
							}

							$input.one("change", cp_forms_clearInvalidOnChange);

							if(i == 0 && window.cpFormsDontFocusOnError.indexOf(parseInt(data.form_cpda_id)) === -1)
							{
								$field.focus();
							}
						}
						else
						{
							console.error("cp_forms_processFormResponse: couldn't find field '"+lookup_name+"'");
						}
					}
				}
				else if(data.errors[i].error_code == 19)
				{
					var $field = $('#'+lookup_name+'_upload_button');
					var $input = $('#'+lookup_name+'_upload_filename_new');

					if(!mobile)
					{
						var tooltipOptions = {
							  content: errorMessage
						    , position: {
						          my: 'left center'
						        , at: 'right center'
						        , viewport: $(window)
						        , effect: false
						    }
						    , show: {
						          ready: true
						        , event: false
						    }
						    , hide: {
						          event: false
						    }
						    , style: {
						          classes: 'cpErrorTooltip qtip-shadow'
						        , tip: {
						            width: 8
						        }
						    }
						};

						$.fn.qtip.zindex = 99999;
						$field.addClass("cpFormsInvalid").qtip(tooltipOptions);
					}
					else
					{
						alert(errorMessage);
						$field.addClass("cpFormsInvalid").qtip(tooltipOptions);
					}

				}
				else if(data.errors[i].error_code == 12)
				{
					if(!mobile)
					{
						var tooltipOptions = {
							  content: errorMessage
						    , position: {
						          my: 'left center'
						        , at: 'right center'
						        , viewport: $(document)
						        , effect: false
						    }
						    , show: {
						          event: 'focus mouseenter'
						        , effect: function(offset) {
						            $(this).fadeIn(200);
						        }
						    }
						    , hide: {
						          event: 'blur change mouseleave'
						          // event: false
						    }
						    , style: {
						          classes: 'cpErrorTooltip qtip-shadow'
						        , tip: {
						            width: 8
						        }
						    }
						};

						$.fn.qtip.zindex = 99999;
						$form.find('.g-recaptcha > div').addClass("cpFormsInvalid").qtip(tooltipOptions);
					}
					else
					{
						alert(errorMessage);
						$form.find('.g-recaptcha').addClass("cpFormsInvalid");
					}

					$input = true;

				}
			}

			if($input == null)
			{//this is a general error not associated with a field
				//TODO make this prettier

				var tokenArray = ["{{field_title}}"];
				var tokenReplaceArray = [data.errors[i].field_title];
				var errorMessage =
					data.errors[i].error_code == -1 ? data.errors[i].custom_error_message
					: str_replace(tokenArray, tokenReplaceArray, responseMessages[data.errors[i].error_code]);

				if(typeof cp_toasts_add == "function" && data.errors[i].use_alert !== true)
				{
					cp_toasts_add({message: errorMessage, type: 2})
				}
				else
				{
					alert(errorMessage);
				}

				if(data.errors[i].error_code == -1 && typeof CPO_DEBUG != undefined && CPO_DEBUG == true)
				{
					console.log("cp_forms_processFormResponse() debug_error_message: ", data.errors[i].debug_error_message);
				}
			}
		}
	}

	cp_forms_update_before_unload($form);

	if(typeof cp_forms_callback == "function")
	{
		cp_forms_callback(data);
	}
	return false;
}

function cp_forms_datepicker_add_clear_button(input) {
    setTimeout(function() {

    	if(mobile)
    	{
    		$(input).blur();
    	}

    	var $widget = $(input).datepicker("widget");

    	$widget.find('.ui-datepicker-header,.ui-datepicker-calendar').addClass('notranslate');

        var $buttonPane = $widget.find(".ui-datepicker-buttonpane");

        $( "<button>", {
            text: "Clear",
            click: function() {
                $(input).val('').datepicker("hide");
            }
        }).appendTo( $buttonPane ).addClass("ui-datepicker-clear ui-state-default ui-priority-primary ui-corner-all");
    }, 1 );
}

function CPFormFieldSelectMultipleWithSearch_init(field_id) {
	setTimeout(function(){
		var $field_elm = document.getElementById(field_id+'_search_wrapper');
		var $field_elm_select_wrapper = document.getElementById('for'+field_id).querySelectorAll('.selectOptionWrapper');
		var $field_elm_sarch_input = document.getElementById(field_id+'_search_input')
		var field_elm_select_wrapper_orig_height = $field_elm_select_wrapper[0].clientHeight;

		$field_elm_select_wrapper[0].style.maxHeight = field_elm_select_wrapper_orig_height+'px';

		$field_elm_select_wrapper[0].style.height = $field_elm.clientHeight+'px';
		$field_elm_select_wrapper[0].style.overflow = 'hidden';

		$field_elm_sarch_input.addEventListener('keyup', function() {
		 	if (this.value == '')
		 	{
		 		$field_elm_select_wrapper[0].style.height = $field_elm.clientHeight+'px';
		 		$field_elm_select_wrapper[0].style.overflow = 'hidden';
		 	}
		 	else
		 	{
		 		$field_elm_select_wrapper[0].style.height = 'auto';
		 		$field_elm_select_wrapper[0].style.overflowY = 'auto';
		 	}
		});
		$field_elm_select_wrapper[0].querySelectorAll('.clearSearch')[0].addEventListener('click', function() {
	 		$field_elm_select_wrapper[0].style.height = $field_elm.clientHeight+'px';
	 		$field_elm_select_wrapper[0].style.overflow = 'hidden';
		});
	}, 2);
}

function CPFormFieldAddressLookup_init(field_id, restrictCountries) {
	if(cp.config.apis.ideal_postcodes_api_key)
	{
		IdealPostcodes.AddressFinder.setup({
			apiKey: cp.config.apis.ideal_postcodes_api_key,
			inputField: '#'+field_id+'_search',
			onUnhide: function() {
				if(!document.getElementById(field_id+'_manual_fields').classList.contains('manual_mode'))
				{
					CPFormFieldAddressLookup_toggle_manual_mode(true, field_id);
				}
			},
			outputFields: {
				line_1:    '#'+field_id+'_line_1',
				line_2:    '#'+field_id+'_line_2',
				line_3:    '#'+field_id+'_line_3',
				post_town: '#'+field_id+'_post_town',
				postcode:  '#'+field_id+'_postcode',
				latitude:  '#'+field_id+'_latitude',
				longitude: '#'+field_id+'_longitude'
			},
			restrictCountries: restrictCountries,
			onFailedCheck: function (error) {
				CPFormFieldAddressLookup_init_address_only(field_id);
				console.warn('CPFormFieldAddressLookup failed to initiate with supplied API key. This URL might not be whitelisted, or the number of lookups may have exceeded the daily rate. Error returned was: "'+error.message+'"');
			}
		});

		document.getElementById(field_id+'_manual_entry').addEventListener('click', function()
		{
			CPFormFieldAddressLookup_manual_entry_click(field_id);
		});

		// if started in manual mode
		if(document.getElementById(field_id+'_manual_fields').classList.contains('manual_mode'))
		{
			CPFormFieldAddressLookup_toggle_manual_mode(true, field_id, true);
		}
	}
	else
	{
		CPFormFieldAddressLookup_init_address_only(field_id);
	}
}

function CPFormFieldAddressLookup_init_address_only(field_id) {
	document.getElementById(field_id+'_top_wrapper').remove();
	var $manual_field_wrapper = document.getElementById(field_id+'_manual_fields');
	$manual_field_wrapper.classList.add('open','manual_only');
	$manual_field_wrapper.style.height = null;
}

function CPFormFieldAddressLookup_manual_entry_click(field_id) {


	if(document.getElementById(field_id+'_manual_fields').classList.contains('manual_mode'))
	{
		CPFormFieldAddressLookup_toggle_manual_mode(false, field_id);
	}
	else
	{
		CPFormFieldAddressLookup_toggle_manual_mode(true, field_id);
		setTimeout(function(){
			document.getElementById(field_id+'_line_1').focus();
		}, 200);
	}
}

function CPFormFieldAddressLookup_toggle_manual_mode(onOff, field_id, from_init) {

	var $manual_field_wrapper = document.getElementById(field_id+'_manual_fields');

	// if field is in manual only mode we don't need to do anything
	if($manual_field_wrapper.classList.contains('manual_only'))
	{
		return;
	}

	var anim_time = 200;
	var $manual_entry_p = document.getElementById(field_id+'_manual_entry');
	var $search_wrapper = document.getElementById(field_id+'_search_wrapper');

	if(onOff === true)
	{
		$manual_field_wrapper.classList.add('manual_mode');
		$manual_entry_p.innerHTML = '&#8635; Search for address';

		$search_wrapper.style.opacity = 0;
		$manual_field_wrapper.style.opacity = 1;

		if(from_init !== true)
		{
			document.getElementById(field_id+'_search').blur();

			$manual_field_wrapper.style.height = $manual_field_wrapper.scrollHeight+'px';
			$manual_field_wrapper.style.opacity = 1;
			setTimeout(function(){
				$manual_field_wrapper.classList.add('open');
				$manual_field_wrapper.style.height = '';
			}, anim_time+50);

			$search_wrapper.style.height = $search_wrapper.scrollHeight+'px';
			$search_wrapper.classList.remove('open');
			setTimeout(function(){
				$search_wrapper.style.height = '0px';
			}, 2);
		}
	}
	else
	{
		$manual_field_wrapper.classList.remove('manual_mode');
		$manual_entry_p.innerHTML = 'Enter address manually';

		$search_wrapper.style.opacity = 1;
		$manual_field_wrapper.style.opacity = 0;

		$manual_field_wrapper.style.height = $manual_field_wrapper.scrollHeight+'px';
		$manual_field_wrapper.classList.remove('open');
		setTimeout(function(){
			$manual_field_wrapper.style.height = '0px';
		}, 2);

		$search_wrapper.style.height = $search_wrapper.scrollHeight+'px';
		setTimeout(function(){
			$search_wrapper.classList.add('open');
			$search_wrapper.style.height = '';
		}, anim_time+50);

		setTimeout(function(){
			document.getElementById(field_id+'_search').focus();
		}, anim_time+1);
	}


}

function cp_forms_clearInvalidOnChange() {
	var fieldTypeAndElm = fsGetFieldTypeAndElm($(this));
	var $elm = fieldTypeAndElm.$elm;
	if(fieldTypeAndElm.fieldType == "formStyledRadio")
	{
		$elm = $elm.parent().parent();
	}
	$elm.removeClass("cpFormsInvalid").unbind("change");
	if($elm.qtip('api'))
	{
		$elm.qtip('api').destroy();
	}
}

function CPFormFieldDateRange_init(elm_id,  date_format, date_range_divider, preset_ranges) {
	cp_date_range_init(elm_id,  date_format, date_range_divider, preset_ranges, false);
}

function CPFormFieldDateTimeRange_init(elm_id,  date_format, date_range_divider, preset_ranges) {
	cp_date_range_init(elm_id,  date_format, date_range_divider, preset_ranges, true);
}

function cp_date_range_init(elm_id, date_format, date_range_divider, preset_ranges, include_time) {

	var $datepicker_btn     = $('#'+elm_id+'_btn');
	var $datepicker_summary = $('#'+elm_id);
	var $datepicker_from    = $('#'+elm_id+'_from');
	var $datepicker_to      = $('#'+elm_id+'_to');

	var moment_from = $datepicker_from.val();
	var moment_to = $datepicker_to.val();

	var internal_date_format = 'D MMM YYYY HH:mm';

	var moment_today_midnight = moment().utcOffset(cp.default_utc_offset).startOf('day');

	if(moment_from)
	{
		moment_from = moment(new Date(moment_from*1000)).utcOffset(cp.default_utc_offset);
	}
	else
	{
		moment_from = moment_today_midnight;
	}

	if(moment_to)
	{
		moment_to = moment(new Date(moment_to*1000)).utcOffset(cp.default_utc_offset);
	}
	else
	{
		moment_to = moment().utcOffset(cp.default_utc_offset).endOf('day');
	}

	var ranges = [];
	var label_lookup = [];
	for(var key in preset_ranges)
	{
		// convert unix timestampts to moment instances
		ranges[preset_ranges[key]['name']] = [
			moment(new Date(preset_ranges[key]['from']*1000)),
			moment(new Date(preset_ranges[key]['to']*1000)),
		];

		label_lookup[preset_ranges[key]['name']] = key;
	}

	var config = {
		autoApply: true, // does nothing in time picker mode
		alwaysShowCalendars: true,
		startDate: moment_from.format(internal_date_format),
		endDate: moment_to.format(internal_date_format),
		// maxDate: '11/25/2021',
		opens: 'center',
		drops: 'down',
		buttonClasses: 'none',
		applyButtonClasses: 'none',
		cancelClass: 'none',
		ranges: ranges,
		locale: {
			format: internal_date_format,
			separator: date_range_divider,
			applyLabel: 'Ok',
			cancelLabel: 'Cancel',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			weekLabel: 'W',
			firstDay: 1,
			daysOfWeek: ['Su','Mo','Tu','We','Th','Fr','Sa'],
			monthNames: [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			]
		}
	};

	if(include_time === true)
	{
		config.timePicker = true;
		config.showDropdowns = true;
		config.timePicker24Hour = true;
	}

	$datepicker_btn.daterangepicker(config, function(start, end, label) {

		// TODO: Asses if we do actually need utcOffset here, removed for now as it doesn't work correctly during BST

		var moment_from = moment(start, internal_date_format)/*.utcOffset(cp.default_utc_offset)*/;
		if(include_time !== true)
		{
			moment_from.startOf('day');
		}

		var moment_to = moment(end, internal_date_format)/*.utcOffset(cp.default_utc_offset)*/;
		if(include_time !== true)
		{
			moment_to.endOf("day");
		}
		else if(moment_to.format('m') === '59')
		{
			// when the 59th minute selected, also set seconds to 59
			moment_to.endOf("minute");
		}

		if(label == 'Custom')
		{
			label =
				  moment(start, internal_date_format)/*.utcOffset(cp.default_utc_offset)*/.format(date_format)
				+ date_range_divider
				+ moment(end, internal_date_format)/*.utcOffset(cp.default_utc_offset)*/.format(date_format)
			;
		}
		else if(label == 'Last 24 hours')
		{
			// set here so that minutes are dynamic
			moment_from = moment()/*.utcOffset(cp.default_utc_offset)*/.subtract(1, 'days');
			moment_to = moment()/*.utcOffset(cp.default_utc_offset)*/;

			$datepicker_btn.data('daterangepicker').setStartDate(moment_from.format(internal_date_format));
			$datepicker_btn.data('daterangepicker').setEndDate(moment_to.format(internal_date_format));
		}
		else if(label == 'Last hour')
		{
			// set here so that minutes are dynamic
			moment_from = moment()/*.utcOffset(cp.default_utc_offset)*/.subtract(1, 'hours');
			moment_to = moment()/*.utcOffset(cp.default_utc_offset)*/;

			$datepicker_btn.data('daterangepicker').setStartDate(moment_from.format(internal_date_format));
			$datepicker_btn.data('daterangepicker').setEndDate(moment_to.format(internal_date_format));
		}

	  	$datepicker_btn.find('p').html(label);

		var val_from = moment_from.format('X');
	  	$datepicker_from.val(val_from);

		var val_to = moment_to.format('X');
	  	$datepicker_to.val(val_to);

		var val_summary = '';

		if(label != 'Custom' && label_lookup.hasOwnProperty(label))
		{
			val_summary = label_lookup[label];
		}
		else
		{
			val_summary = moment_from.format('DD-MM-YYYY-HH:mm:ss') + ',' + moment_to.format('DD-MM-YYYY-HH:mm:ss');
		}

	  	$datepicker_summary.val(val_summary);
	  	// Do this last as other items will likely bind their events to
	  	// the summary field as it uses the un-suffixed field ID
	  	$datepicker_summary[0].dispatchEvent(new Event('change'));
	})
	.on('show.daterangepicker', function(ev, picker) {
		if(include_time === true)
		{
			picker.container[0].classList.add('CPFormFieldDateTimeRange');
		}
		else
		{
			picker.container[0].classList.add('CPFormFieldDateRange');
		}
		$datepicker_btn.addClass('open');
	})
	.on('hide.daterangepicker', function(ev, picker) {
		$datepicker_btn.removeClass('open');
	})
	;

	var daterangepicker_instance = $datepicker_btn.data('daterangepicker');
	daterangepicker_instance.clear_date_range = function(){ cp_date_range_clear(this, $datepicker_btn); };
}

function cp_date_range_clear(daterangepicker, $datepicker_btn) {

	$datepicker_btn.find('p').html($datepicker_btn.data('default-label'));
	daterangepicker.setStartDate(moment().startOf('day'));
	daterangepicker.setEndDate(moment().endOf('day'));

	var elm_id = $datepicker_btn.data('base-id');

	$('#'+elm_id).changeVal('');
	$('#'+elm_id+'_from').changeVal('');
	$('#'+elm_id+'_to').changeVal('');

}