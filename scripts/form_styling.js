var $currentOpenSelect = null;
var $currentOpenSelectJspDrag = null;
var $currentOpenSelectJspTrack = null;
var maxSelectOptions = 8;
var selectKeyboardLast = false;
var selectKeyboardFilteredLast = false;
var selectKeyboardScrollAnimTime = 200;
var selectCurrentFilter = "";
var selectKeyboardTimer;
var selectKeyboardTimeoutTime = 5000;
var selectIsAnimating = false;
var selectJScrollPane = false;
var fsUniqueID = 0;
var form_styling_data = [];

if(typeof $.fn.rVal == "function")
{
	console.error("Error, form_styling.js included twice");
}
else
{
	$.fn.rVal=$.fn.val;
	$.fn.val=function(value) {
	    if(value!=undefined) {

		    if(this[0] && !fsIsMobile()) {
		        var $ele=$(this[0]);
		        var inputName = $ele.attr("name");
		        var fsID = $ele.data("fsID");
		        var $selectWrapper = $('.select.fsID'+fsID+'#for'+inputName);
		        if($selectWrapper.length > 0)
		        {
		        	if($selectWrapper.hasClass("multiple"))
		        	{
						$selectWrapper.find('.option').removeClass('selected').find('.checkbox').removeClass("on");
						$('input[name="'+inputName+'[]"].fsID'+fsID).remove();
						if(value.length > 0)
						{
							for(i in value)
							{
								if(typeof value[i] != "undefined")
								{
									$ele.after('<input type="hidden" name="'+inputName+'[]" value="'+value[i]+'" class="fsID'+fsID+'">');
									var id = "val" + value[i].replace(/\s+/g, "--space--");

									$selectWrapper.find('.option#'+id).addClass('selected').find('.checkbox').addClass("on");
								}
							}
						}

						//somewhere here for adding better values in the box of multiselects


						return this;
					}
					else
					{
						$selectWrapper.find('.option').removeClass('selected');

						setSelectValue($selectWrapper, value, true);

						return this.rVal(value);
					}
		        }
		        return this.rVal(value);
		    }
	        return this.rVal(value);
	    }
	    if(this[0] && !fsIsMobile()) {
	        var $ele=$(this[0]);
	        var fsID = $ele.data("fsID");
	        var elementName = $ele.attr("name");
	        if(elementName !== undefined && elementName.indexOf("[]") === -1 && $('.select.multiple.fsID'+fsID+'#for'+elementName).length > 0)
	        {
	        	var name = $ele.attr("id").split("for").join("");
	        	var valArray = new Array();
	        	$('input[name="'+name+'[]"].fsID'+fsID).each(function(){
	        		valArray.push( $(this).rVal() );
	        	});
	        	return valArray.length > 0 ? valArray : undefined;
	        }
	        return $ele.rVal();
	    }
	    return this.rVal();
	};

	var disabledHookSettings = {
		set: function (el, value) {
			if($(el).data("fsType") == "formStyledSelectMultiple")
			{
				if(typeof $(el).data("fsMultipleDisabled") == "undefined")
				{
					el.disabled = true;
					$(el).data("fsMultipleDisabled", false);
				}
				else
				{
					if ($(el).data("fsMultipleDisabled") !== value) {
						$(el).data("fsMultipleDisabled", value);
					}

					if(value)
					{
						$(el).trigger('fsDisabledTrue');
					}
					else
					{
						$(el).trigger('fsDisabledFalse');
					}
				}
			}
			else
			{
				if (el.disabled !== value) {
					el.disabled = value;
				}

				if(value)
				{
					$(el).trigger('fsDisabledTrue');
				}
				else
				{
					$(el).trigger('fsDisabledFalse');
				}
			}

		}
	};

	$.propHooks.disabled = disabledHookSettings;
	$.attrHooks.disabled = disabledHookSettings;
}

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

var fsRenderInputNameForSelector = function(name)
{
	return(name.replace('[', '\\[').replace(']','\\]'));
}

var initFormStyles = function(params)
{
	window.fs_options = {
		  $wrapper: $('body')
		, checkboxesCanUncheck: true
		, selectMenuTitleAttr: true
		, parentLabelsOnly: false
	};

	$.extend(window.fs_options, params);

	var $wrapper = window.fs_options.$wrapper;

	$wrapper.find(':radio').not('.fsIgnore').each( function() {

		var name = $(this).attr('name');
		var id = $(this).attr('id');
		var value = $(this).attr('value');

		var $radioDiv = $('<div class="radio" id="'+id+'"><div class="radioInner"></div></div>').insertAfter($(this));
		$radioDiv.data('val', value);
		$radioDiv.data('for', name);

		var checked = $(this).is(':checked');

		var $parent = $(this).parent();
		if($parent.is("label"))
		{
			var extraLabelClasses = checked ? " on" : "";
			$parent.removeAttr('for').addClass('labelRadio'+extraLabelClasses).click(toggleRadio);
			$radioDiv.prependTo($parent);
			$parent.append('<div style="clear:both;"></div>');
		}
		else
		{
			$radioDiv.click(toggleRadio);
			if(!window.fs_options.parentLabelsOnly)
			{
				var $label = $('label[for="'+id+'"]');
				if($label.length > 0)
				{
					$label.addClass('labelRadioSeparate').click(toggleRadio);
					if(checked)
					{
						$label.addClass('on');
					}
				}
			}
		}

		if($wrapper.find('input[name="radio-'+name+'"]').length < 1)
		{
			var $newInput = $('<input name="radio-'+name+'" type="hidden" value="" class="form_styling_radio_temp_zzz">').insertBefore($radioDiv).change(radioValueChange);
		}

		if(checked)
		{
			$wrapper.find('input[name="radio-'+name+'"]').val($(this).val());
			$radioDiv.addClass('on');
		}

		$(this).remove();

	});

	$wrapper.find('.form_styling_radio_temp_zzz').each(function() {

		var name = $(this).attr('name');
		name = name.split('radio-').join('');
		$(this).attr('name', name).attr('id', name).removeClass('form_styling_radio_temp_zzz');

	});

	$wrapper.find(':checkbox').not('.fsIgnore, .osano-cm-input').each(function() {

		var name = $(this).attr('name');
		var isChecked = $(this).is(':checked');

		var onClass = "";
		if(isChecked)
		{
			onClass = ' on';
		}

		var extraClasses = " default";

		if($.trim($(this).attr('class')) != "")
		{
			extraClasses = " " + $(this).attr('class');
		}

		var startValue = "false";
		if(isChecked)
		{
			startValue = "true";
		}

		var $checkboxDiv = $('<div class="checkbox'+onClass+extraClasses+'" id="for'+name+'"><div class="checkboxInner"></div></div>').insertAfter($(this));

		var $parent = $(this).parent();
		if($parent.is("label"))
		{
			$parent.removeAttr('for').addClass('labelCheckbox').click(toggleCheckbox);
			if(isChecked)
			{
				$parent.addClass('on');
			}
			$checkboxDiv.prependTo($parent);
		}
		else
		{
			$checkboxDiv.click(toggleCheckbox);
			if(!window.fs_options.parentLabelsOnly)
			{
				var $label = $('label[for="'+name+'"]');
				if($label.length > 0)
				{
					$label.addClass('labelCheckboxSeparate').click(toggleCheckbox);
					if(isChecked)
					{
						$label.addClass('on');
					}
				}
			}
		}

		var $newInput = $('<input name="'+name+'" type="hidden" value="'+startValue+'">').insertBefore($checkboxDiv).change(checkboxOnChange);

		$(this).remove();

	});

	$wrapper.find('select').not('.selectGhost,.fsIgnore').each(function() {

		var multiple = $(this).is('[multiple]');
		var fs_searchable = !fsIsMobile() && $(this).data('fs_searchable') == "fs_searchable";
		var always_open = !fsIsMobile() && (fs_searchable || $(this).data('fs_always_open') == "fs_always_open");

		var fsID = fsUniqueID++;

		var name = $(this).attr('name');
		var ele_class = $(this).attr('class');
		var skip = false;
		if(typeof ele_class !== "undefined" && ele_class.indexOf("ui-datepicker") === 0)
		{
			skip = true;
		}
		if(typeof name !== "undefined" && !skip)
		{
			if(name.indexOf("[]") !== -1)
			{
				if(!multiple)
				{
					name = name.substring(0,name.length-2);
					$(this).attr('name', name);
				}
			}
			else if(multiple)
			{
				$(this).attr('name', name+'[]');
			}

			var id = "";
			if($(this).attr('id') !== undefined)
			{
				id = $(this).attr('id');
			}
			var classes = "select";
			classes += multiple ? " multiple" : "";
			classes += always_open ? " always_open" : " collapsable";
			classes += fs_searchable ? " fs_searchable" : "";
			classes += this.disabled ? " disabled" : " enabled";

			if($(this).attr('class') !== undefined)
			{
				classes += " " + $(this).attr('class');
			}

			var $parent = $(this).parent();

			var tabindex = 0;

			if($(this).attr('tabindex') !== undefined)
			{
				tabindex = $(this).attr('tabindex');
			}

			var tabIndexAttr = this.disabled ? '' : ' tabindex="'+tabindex+'"';

			classes += " fsID"+fsID;

			var title = $(this).attr('title');
			title = typeof title == "undefined" ? "" : title;

			var select_placeholder_text = $(this).attr('data-placeholder-text');
			select_placeholder_text = typeof select_placeholder_text == "undefined" ? "" : select_placeholder_text;

			var titleAttr = window.fs_options.selectMenuTitleAttr ? ' title="'+title+'"' : '';

			var $selectWrapper = $('<div class="'+classes+'" id="for'+name+'"'+tabIndexAttr+titleAttr+'></div>').data("fsID", fsID).insertAfter(this);

			var $selectButton = false;
			var $selected = false;

			if(!always_open || !multiple)
			{
				$selectButton = $('<div class="selectButton"></div>');

				$selected = $('<div class="selectedOption"></div>').append($selectButton).append('<p></p>').append('<div style="clear:both;"></div>').appendTo($selectWrapper);
			}

			var maxWidth = 0;
			var selected_found = false;
			var $optgroups = [];
			var $options = [];
			var $optionWrapper = null;
			var multipleValues = [];

			if(!fsIsMobile() || !multiple)
			{
				var $newInput = $(this);
				if(!fsIsMobile())
				{
					$newInput = $('<input name="'+name+'" type="hidden" id="'+id+'" class="fsID'+fsID+'">').data($(this).data()).data("fsID", fsID).insertBefore(this).copyEvents($(this)).bind('fsDisabledTrue', fsOnDisable).bind('fsDisabledFalse', fsOnEnable);

					var fsType = multiple ? "formStyledSelectMultiple" : "formStyledSelect";
					$newInput.data("fsType", fsType);

					if(multiple)
					{
						$newInput.attr("disabled", "true");
					}

				}

				$optionWrapper = $('<div class="selectOptionWrapper" id="selectOptionWrapper"></div>').appendTo($selectWrapper);

				if(!always_open)
				{
					$optionWrapper.height(0);
				}

				var options_html = fs_get_select_options_html($(this), multiple);
				$optionWrapper.html(options_html);

				// nest optgroups
				var optgroup_parents = [];
				$optgroups = $optionWrapper.find('.optgroup');
				$optgroups.each(function(){
					var fs_optgroup_parent = $(this).data('fs_optgroup_parent');
					if(typeof fs_optgroup_parent !== "undefined")
					{
						var $optgroup_parent = optgroup_parents[fs_optgroup_parent];
						if($optgroup_parent == null)
						{
							$optgroup_parent = $('<div class="optgroup optgroup_parent"><div class="optgroupLabel"><p>'+fs_optgroup_parent+'</p><div style="clear:both;"></div></div>\n').insertBefore($(this));
							optgroup_parents[fs_optgroup_parent] = $optgroup_parent;
						}

						$(this).appendTo($optgroup_parent);
					}
				});

				$options = $optionWrapper.find('.option');
				var $firstOption = $options.first().addClass('first');
				var firstOptionID = $firstOption.attr('id')
				var firstValue = typeof firstOptionID == "undefined" ? "" : firstOptionID.substring(3).replace(new RegExp("--space--", 'g'), " ");
				var firstHTML = $.trim($firstOption.find('p').html());
				$options.last().addClass('last');

				if(!fsIsMobile())
				{
					var option_click_method = multiple ? selectMultipleMakeSelectionClick : selectMakeSelectionClick;

					$options.click(option_click_method);

					if(!always_open)
					{
						$options.mouseover(selectOptionMouseOver).mouseenter(selectOptionMouseEnter).mouseleave(selectOptionMouseLeave);
					}
				}
				else if(fsIsIos()) {
					$options.on('touchstart',function(e) {
					    e.preventDefault();
					});
				}

				$options.filter('.selected').each(function(){

					var newValue = $(this).attr('id').substring(3);
					newValue = newValue.replace(new RegExp("--space--", 'g'), " ");

					if(multiple)
					{
						multipleValues.push(newValue);
					}
					else
					{
						if(selected_found)
						{
							$(this).removeClass('selected');
						}
						else
						{
							selected_found = true;
							$newInput.val(newValue);
							if($selected !== false)
							{
								var html = $.trim($(this).find('p').html());
								$selected.addClass('selected_val_'+newValue);
								$selected.find('p').html(html).removeClass('placeholder_option');
							}
						}
					}
				});

				if(multiple)
				{
					$newInput.val(multipleValues);
				}

				var optionWrapperWidth = $optionWrapper[0].scrollWidth;

				if(optionWrapperWidth > maxWidth)
				{
					maxWidth = optionWrapperWidth;
				}

				if(fs_searchable)
				{
					var $searchInput = $('<input type="text" id="'+id+'_search_input" class="fs_select_search_input" placeholder="Search..." />').change(fs_select_search_on_change).keyup(fs_select_search_on_change);
					var $searchClearBtn = $('<div class="clearSearch"><p>&#10006;</p></div>').click(fs_select_search_clear);
					var $searchWrapper = $('<div class="fs_select_search_wrapper" id="'+id+'_search_wrapper"></div>').append($searchInput).append($searchClearBtn).append('<div style="clear:both;"></div>').prependTo($optionWrapper);
					$optionWrapper.append('<p class="fs_no_results_text">No matches found</p>');

					var fs_items = [];
					var fs_data_id = 0;
					$options.each(function(){
						var $elm = $(this);
						fs_items.push({fs_data_id: fs_data_id++, $elm: $elm, id: $elm.attr('id'), name: $.trim($elm.find('p').html())});
					});
					form_styling_data[fsID] = {fs_items: fs_items};
				}
			}
			else
			{
				if(fsIsMobile() && multiple)
				{
					multipleValues = fs_get_native_select_multiple_values($(this)[0]);
				}

				$(this).find('optgroup').each(function(){
					var optionGroupLabel = $(this).attr("label");
					// 2 level nested optgroup hack
					if(optionGroupLabel.indexOf('___') != -1)
					{
						var optionGroupLabelSplit = optionGroupLabel.split('___');
						optionGroupLabel = optionGroupLabelSplit.join(' / ');
						$(this).attr("label", optionGroupLabel);
					}
				});
			}

			var total_options = $optgroups.length + $options.length;

			if($optionWrapper != null && (total_options > maxSelectOptions || fs_searchable))
			{
				var num_rows = Math.min(maxSelectOptions, total_options);

				if(fs_searchable)
				{
					num_rows++;
				}

				var heightLimit = ($optionWrapper.find('.option').first().outerHeight() * num_rows) + 2;

				var optionWrapperCSS = {'overflow-y': 'auto'};
				if(fs_searchable)
				{
					optionWrapperCSS['height'] = heightLimit+'px';
				}
				else
				{
					optionWrapperCSS['max-height'] = heightLimit+'px';
				}
				$optionWrapper.css(optionWrapperCSS);
			}

			var extraTopItem = false;

			if(!selected_found || multiple)
			{
				if (select_placeholder_text != "" && select_placeholder_text != null) {
					if(!multiple)
					{
						$newInput.val("");
					}

					if($selected !== false)
					{
						$selected.find('p').html(select_placeholder_text).addClass("placeholder_option");
						extraTopItem = true;
					}
				}
				else if(title != "" && title != null)
				{
					if(!multiple)
					{
						$newInput.val("");
					}

					if($selected !== false)
					{
						$selected.find('p').html(title).addClass("placeholder_option");
						extraTopItem = true;
					}
				}
				else
				{
					if(multiple)
					{
						if($selected !== false)
						{
							var selected_p_html = fs_get_multiple_selected_string(multipleValues.length);
							$selected.find('p').html(selected_p_html);
						}
					}
					else
					{
						$newInput.val(firstValue);
						if($selected !== false)
						{
							$selected.find('p').html(firstHTML);
						}
					}
				}
			}

			if((!fsIsMobile() || !multiple) && !always_open)
			{
				/*
				var extraWidth = maxWidth - origPWidth;
				$selectWrapperClone = $selectWrapper.clone().appendTo('body');
				var newWidth = $selectWrapperClone.width();
				$selectWrapperClone.remove();

				if(extraWidth > 0)
				{
					// newWidth += extraWidth;
				}
				*/
				// var newWidth = $selectWrapper[0].scrollWidth;

				if($selected !== false)
				{
					var origPWidth = parseInt($selected.find('p').width()) + parseInt($selected.find('p').css('padding-left')) + parseInt($selected.find('p').css('padding-right'));
					if(origPWidth > maxWidth)
					{
						maxWidth = origPWidth;
					}
				}

				if($selectButton !== false)
				{
					if($selectButton.is(":visible"))
					{
						maxWidth += $selectButton.width();
					}
				}

				$optionWrapper.width(maxWidth);
				$selectWrapper.width(maxWidth);
			}

			$selectWrapper.append('<div style="clear:both;"></div>');
			if(!fsIsMobile() && !always_open)
			{
				$selectWrapper.click(selectClickOpen).keyup(selectKeyUp).keydown(selectKeyDown);
			}

			if(!always_open && total_options > maxSelectOptions && !fsIsMobile())
			{
				var heightLimit = $optionWrapper.find('.option').first().outerHeight() * maxSelectOptions;

				$optionWrapper.css({'max-height': heightLimit+'px', 'overflow-y': 'auto'});

				if(!fsIsMobile() && selectJScrollPane)
				{
					$optionWrapper.height(heightLimit);
					$optionWrapper.jScrollPane({enableKeyboardNavigation: false});
					$optionWrapper.height(0);
				}
			}

			if($parent.is("label"))
			{
				$parent.removeAttr('for').addClass('labelSelect');
				$parent.append('<div style="clear:both;"></div>');
			}

			if(fsIsMobile())
			{
				var ghostWidth = $selectWrapper.outerWidth();
				var ghostHeight = $selectWrapper.outerHeight() + 2;

				$(this).attr('class', 'selectGhost').css({'width': ghostWidth+'px', 'height': ghostHeight+'px'}).prependTo($selectWrapper).change(selectGhostOnChange);

				if(extraTopItem && !multiple)
				{
					// Added value="" here, it was breaking application portal validation without
					$(this).prepend('<option selected value="">'+title+'</option>');
				}

			}
			else
			{
				$(this).remove();
			}
		}
		else if(!skip)
		{
			console.log("form_styling.js: Select element must have a name attribute to use form_styling");
		}

	});

	$(window).mousemove(function(e) {

		selectKeyboardLast = false;
		selectKeyboardFilteredLast = false;

	});
}

function fs_get_native_select_multiple_values(select) {
	var result = [];
	var options = select && select.options;
	var opt;

	for (var i=0, iLen=options.length; i<iLen; i++) {
		opt = options[i];

		if (opt.selected) {
			result.push(opt.value || opt.text);
		}
	}
	return result;
}

function fs_get_multiple_selected_string(num_selected) {
	var s = num_selected == 1 ? "" : "s";
	return(num_selected+' option'+s+' selected');
}

function fs_get_select_options_html($wrapper, multiple) {
	var options_html = "";
	var first_option = true;

	$wrapper.find('> optgroup, > option').each(function(){
		if($(this).is('optgroup'))
		{
			var optionGroupLabel = $(this).attr("label");
			// 2 level nested optgroup hack
			var optgroup_parent = "";
			if(optionGroupLabel.indexOf('___') != -1)
			{
				var optionGroupLabelSplit = optionGroupLabel.split('___');
				if(fsIsMobile())
				{
					optionGroupLabel = optionGroupLabelSplit.join(' / ');
				}
				else
				{
					optgroup_parent = ' data-fs_optgroup_parent="'+optionGroupLabelSplit[0]+'"';
					optionGroupLabel = optionGroupLabelSplit[1];
				}
			}
			var extraClasses = $(this).attr("class");
			extraClasses = typeof extraClasses === "undefined" ? "" : " " + extraClasses;
			options_html += '<div class="optgroup'+extraClasses+'"'+optgroup_parent+'><div class="optgroupLabel"><p>'+optionGroupLabel+'</p><div style="clear:both;"></div></div>\n';
			options_html += fs_get_select_options_html($(this), multiple);
			options_html += '</div>\n';
		}
		else
		{
			var $this_option = $(this);
			var value = $this_option.val();
			var html = $.trim($this_option.html());
			var dataAttr = $this_option.attr("data");
			dataAttr = typeof dataAttr === "undefined" ? "" : " data-attr=\""+dataAttr+"\"";
			var extraClasses = $this_option.attr("class");
			extraClasses = typeof extraClasses === "undefined" ? "" : " " + extraClasses;

			if($this_option.is(":selected") || $this_option.is(":checked"))
			{
				var isActuallySelected = true;

				if(first_option)
				{
					var outerHTML = $(this).outerHTML().split('>');
					isActuallySelected = outerHTML[0].indexOf("selected") !== -1 || outerHTML[0].indexOf("checked") !== -1;
					first_option = false;
				}

				if(isActuallySelected)
				{
					extraClasses += " selected";
				}
			}

			options_html +=
				  '<div class="option'+extraClasses+'"'+dataAttr+' title="'+html+'" id="val'+value.replace(/\s+/g, '--space--')+'">\n'
				+ (multiple ? '	<div class="checkbox"><div class="checkboxInner"></div></div>\n' : '')
				+ '	<p>'+html+'</p>\n'
				+ '	<div style="clear:both;"></div>\n'
				+ '</div>\n'
			;
		}
	});

	return(options_html);
}

function fs_select_search_clear(e) {
	$(this).parent().find('input[type="text"]').changeVal('').focus();
}

function fs_select_search_on_change(e) {
	// if(e.keyCode == 13) // enter

	var search_term =  $.trim($(this).val());
	fsUpdateSelectSearch(search_term, $(this).closest('.select'));
}

function fsGetDataForSelect($select) {
	return(form_styling_data[$select.data("fsID")]);
}

function fsUpdateSelectSearch(search_term, $select) {

	var select_data = fsGetDataForSelect($select);

	if(search_term == select_data.search_term)
	{
		return;
	}

	select_data.search_term = search_term;
	fsFuzzyMatch.prep(search_term, true);
	$select.find('.fs_select_search_wrapper').find('input[type="text"]').val(search_term);

	var fs_items = select_data.fs_items;
	var $options = $select.find('.option');

	var numResults = 0;

	for(i = 0; i < fs_items.length; i++)
	{
		var item = fs_items[i];

		item.fuzzyMatchIndex = item.matchIndex = 9999999;
		item.filtersMatched = item.searchMatched = false;

		var e = item.name;
		var pos = fsFuzzyMatch.match(e);

		item.searchMatched = pos != null;

		if (item.searchMatched){
			item.filtersMatched = true;
			numResults++;
			item.fuzzyMatchIndex = pos.index === -1 ? 9999999 : pos.index;
			item.matchIndex = e.toLowerCase().indexOf(search_term.toLowerCase());
			if(item.matchIndex === -1) { item.matchIndex = 9999999; }
			// $('#file'+i).html(fsFuzzyMatch.hiblock(e));
		}

		fs_items[i] = item;
	}

	//sort in reverse order worst match to best
	fs_items.sort(function(a, b) {
		if(a.matchIndex < b.matchIndex)
		{
			return 1;
		}
		else if(a.matchIndex == b.matchIndex && a.fuzzyMatchIndex < b.fuzzyMatchIndex)
		{
			return 1;
		}
		else if(a.matchIndex == b.matchIndex && a.fuzzyMatchIndex == b.fuzzyMatchIndex)
		{
			// if(a.name.toLowerCase() < b.name.toLowerCase())
			// {
			// 	return 1;
			// }
			// else if(a.name.toLowerCase() < b.name.toLowerCase())
			// {
			// 	return 0;
			// }

			if(a.pt_id < b.pt_id)
			{
				return 1;
			}
			else if(a.pt_id == b.pt_id)
			{
				return 0;
			}
		}
		return -1;
	});

	$options.removeClass("inSearch");

	for(i = 0; i < fs_items.length; i++) {

		var item = fs_items[i];

		item.$elm.removeClass("inSearch");
		if(item.filtersMatched)
		{
			item.$elm.removeClass('hide').addClass('show').find('p').html(fsFuzzyMatch.hi(item.name));
		}
		else
		{
			item.$elm.addClass('hide').removeClass('show').find('p').html(item.name);
		}
	}

	var $optgroups = $select.find('.optgroup').addClass('hide');

	if(numResults > 0)
	{
		var showChildrenClasses = search_term == "" ? "" : "inSearch";
		$select.find('.optgroup').find('.option.show').parentsUntil('.selectOptionWrapper').removeClass('hide');
		$select.find('p.fs_no_results_text').removeClass('show');
	}
	else
	{
		$select.find('p.fs_no_results_text').addClass('show');
	}

}

var fsOnDisable = function() {
	var fieldTypeAndElm = fsGetFieldTypeAndElm($(this));
	fieldTypeAndElm.$elm.addClass('disabled').removeClass('enabled').attr('tabindex', '');
}

var fsOnEnable = function() {
	var fieldTypeAndElm = fsGetFieldTypeAndElm($(this));
	fieldTypeAndElm.$elm.removeClass('disabled').addClass('enabled').attr('tabindex', '0');
}

var selectKeyDown = function(e)
{
	selectKeyboardLast = true;

	switch(e.keyCode)
	{
		case 40:
			selectKeyboardScroll($(this), 1);
			e.preventDefault();
			return false;
			break;
		case 38:
			selectKeyboardScroll($(this), -1);
			e.preventDefault();
			return false;
			break;
		case 32://prevent space from scrolling page
			e.preventDefault();
			return false;
			break;
		case 8:
			e.preventDefault();
			selectKeyboardFilter($(this), "backspace");
			return false;
			break;
		case 9:
			selectTabbedAway();//select current hovered and close on tab away
			break;
		case 27:
			selectClose($currentOpenSelect);//close escape
			break;
		default:
			break;
	}
}

var selectKeyUp = function(e)
{
	selectKeyboardLast = true;
	selectKeyboardFilteredLast = false;

	switch(e.keyCode)
	{
		case 40:
			break;
		case 38:
			break;
		case 13:
			selectKeyboardEnter($(this));
			break;
		case 32:
			selectKeyboardFilterKeypress($(this), e.keyCode);
			e.preventDefault();
			return false;
			break;
		default:
			selectKeyboardFilterKeypress($(this), e.keyCode);
			break;
	}
}

var selectTabbedAway = function() {
	if(selectKeyboardFilteredLast)
	{
		selectHoveredOption($currentOpenSelect);
	}
	selectClose($currentOpenSelect);
}

var selectKeyboardScroll = function($select, direction) {

	selectCurrentFilter = "";

	if($currentOpenSelect == null || $currentOpenSelect[0] !== $select[0])
	{
		selectOpen($select);
	}
	else
	{
		var currentIndex = -1;
		$select.find('.option').each(function(i){
			if(currentIndex == -1 && $(this).hasClass("hovered"))
			{
				currentIndex = i;
			}
		});

		currentIndex += direction;
		if(currentIndex > $select.find('.option').length - 1)
		{
			currentIndex = 0;
		}
		else if(currentIndex < 0)
		{
			currentIndex = $select.find('.option').length - 1;
		}

		var $newOption = null;
		$select.find('.option').each(function(i){
			if($newOption == null && i == currentIndex)
			{
				$newOption = $(this);
			}
		});

		selectHighlightOption($newOption);
	}

}

var selectKeyboardEnter = function($select)
{
	if($currentOpenSelect == null || $currentOpenSelect[0] !== $select[0])
	{
		selectOpen($select);
	}
	else
	{
		selectHoveredOption($select);
		if(!$select.hasClass("multiple"))
		{
			selectClose($select);
		}
	}
}

var selectHoveredOption = function($select) {
	if($select != null)
	{
		var $hoveredOption = $select.find('.option.hovered');
		if($hoveredOption.length > 0)
		{
			selectMakeSelection($hoveredOption);
		}
	}
}


var selectKeyboardFilterKeypress = function($select, keyCode) {

		if( (keyCode > 64 && keyCode < 91) || (keyCode > 47 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 32 )
		{
			if($currentOpenSelect == null || $currentOpenSelect[0] !== $select[0] || selectIsAnimating)
			{
				selectKeyboardFilter($select, String.fromCharCode(keyCode), false);
				if(!selectIsAnimating)
				{
					selectOpen($select);
				}
			}
			else
			{
				selectKeyboardFilter($select, String.fromCharCode(keyCode));
			}

		}
}

var selectKeyboardFilter = function($select, newCharacter, scrollTo) {

		if(scrollTo == null)
		{
			scrollTo = true;
		}

		selectResetKeyboardTimer();
		selectRemoveFilterSpans($select);

		if(newCharacter == "backspace")
		{
			newCharacter = "";
			selectCurrentFilter = selectCurrentFilter.slice(0, -1);
		}
		else
		{
			selectCurrentFilter += newCharacter;
		}

		var textArray = new Array();

		var $optionToFocus = null;
		var bestMatch = 0;

		$select.find('.option').each(function(){

			var thisString = $(this).find('p').html();
			var matchingCharCount = 0;

			for (var i in selectCurrentFilter) {

				if(i < thisString.length)
				{
					if(thisString[i].toLowerCase() == selectCurrentFilter[i].toLowerCase())
					{
						matchingCharCount++;
					}
					else
					{
						break;
					}
				}
				else
				{
					break;
				}

			}

			if(matchingCharCount > 0)
			{
				var stringStart = thisString.substring(0, matchingCharCount);
				var stringEnd = thisString.substring(matchingCharCount);
				thisString = '<span class="selectFiltered">'+stringStart+'</span>'+stringEnd;

				$(this).find('p').html(thisString);

				if(matchingCharCount > bestMatch)
				{
					bestMatch = matchingCharCount;
					$optionToFocus = $(this);
				}
			}

		});

		if(bestMatch > 0 && bestMatch >= selectCurrentFilter.length)
		{
			selectKeyboardFilteredLast = true;
			selectHighlightOption($optionToFocus, scrollTo);
		}
		else
		{
			selectCurrentFilter = selectCurrentFilter.slice(0, - 1);
		}
}

var insertIntoString = function( str, idx, rem, s ) {
    return (str.slice(0,idx) + s + str.slice(idx + Math.abs(rem)));
};

var selectRemoveFilterSpans = function($select) {
	$select.find("span.selectFiltered").each(function(){
		var insideSpan = $(this).html();
		$(this).parent().prepend(insideSpan);
		$(this).remove();
	});
}

var selectResetKeyboardTimer = function() {
	clearTimeout(selectKeyboardTimer);
	selectKeyboardTimer = setTimeout(selectKeyboardTimerEnd, selectKeyboardTimeoutTime);
}

var selectKeyboardTimerEnd = function() {
	clearTimeout(selectKeyboardTimer);
	selectCurrentFilter = "";
	selectRemoveFilterSpans($currentOpenSelect);
}

var selectOptionMouseOver = function() {
	if(!selectKeyboardLast)
	{
		selectHighlightOption($(this), false);
	}
}

var selectOptionMouseEnter = function() {
	if(!fsIsMobile())
	{
		var $option = $(this);
		var $selectOptionWrapper = $option.closest('.selectOptionWrapper');

		if($selectOptionWrapper.find(".option:not(.selected)").length == 0 && $selectOptionWrapper.find(".option").length > 2)
		{

			$selectOptionWrapper.find(".option.selected:not(#"+$option.attr("id")+")").removeClass("selected").addClass("tempOff").find(".checkbox.on").removeClass("on").addClass("tempOff");
		}
	}
}

var selectOptionMouseLeave = function() {

	if(!fsIsMobile())
	{
		var $option = $(this);
		var $selectOptionWrapper = $option.closest('.selectOptionWrapper');

		if($selectOptionWrapper.find(".option.tempOff").length > 0)
		{
			$selectOptionWrapper.find(".option.tempOff").removeClass("tempOff").addClass("selected").find(".checkbox.tempOff").removeClass("tempOff").addClass("on");
		}
	}
}

var selectHighlightOption = function($option, scrollToOption, animate) {
	if(scrollToOption == null) { scrollToOption = true; }
	if(animate == null) { animate = true; }

	var $select = $option.closest('.select');

	if(scrollToOption)
	{
		if($option.siblings().length+1 > maxSelectOptions)
		{
			var $selectOptionWrapper = $select.find('.selectOptionWrapper');
			var optionHeight = $option.outerHeight();
			var centerOffset = (Math.ceil((maxSelectOptions) / 2) - 1) * optionHeight;

			var currentIndex = -1;
			$select.find('.optgroupLabel, .option').each(function(i){

				if(currentIndex == -1 && this === $option.get(0))
				{
					currentIndex = i;
				}
			});

			var newScrollTop = (currentIndex * optionHeight) - centerOffset;

			var animTime = selectKeyboardScrollAnimTime;
			if(!animate)
			{
				animTime = 0;
			}

			if(selectJScrollPane)
			{
				var api = $selectOptionWrapper.data('jsp');
				api.animateDuration = animTime;
				api.animateEase = 'easeOutExpo';

				api.animate =  function(ele, prop, value, stepCallback)
					{
						var params = {};
						params[prop] = value;
						ele.animate(
							params,
							{
								'duration'	: animTime,
								'easing'	: 'easeOutExpo',
								'queue'		: false,
								'step'		: stepCallback
							}
						);
					}
				api.scrollTo(0, newScrollTop);
			}
			else
			{
				$selectOptionWrapper.stop().animate({scrollTop: newScrollTop}, animTime, 'easeOutExpo');
			}

		}
	}

	$select.find(".option.hovered").removeClass("hovered");
	$option.addClass("hovered");
}

var selectClickOpen = function($select) {
	selectOpen($(this));
}

var selectOpen = function($select) {

	if($select.hasClass('enabled'))
	{
		if($currentOpenSelect != null)
		{
			selectClose($currentOpenSelect);
		}

		if(!fsIsMobile())
		{
			var $options = $select.find('.option');
			var numOptions = $options.length + $select.find('.optgroup').length;

			$select.addClass('open');

			var optionHeight = $options.outerHeight();

			if(numOptions > maxSelectOptions)
			{
				numOptions = maxSelectOptions;
			}

			selectIsAnimating = true;

			var selectOptionWrapperHeight = numOptions * optionHeight;

			var animateTo = { height: selectOptionWrapperHeight };

			var $selectOptionWrapper = $select.find('.selectOptionWrapper');

			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();

			if(!$select.hasClass('fs_force_bottom') && ($select.hasClass('fs_force_top') || $select.offset().top + optionHeight + selectOptionWrapperHeight > scrollTop + windowHeight && (optionHeight + selectOptionWrapperHeight) < windowHeight))
			{
				$select.addClass('topMode').removeClass('bottomMode');
				$selectOptionWrapper.css('margin-top', -optionHeight);
				animateTo.marginTop = -(selectOptionWrapperHeight+optionHeight);
			}
			else
			{
				$selectOptionWrapper.css('margin-top', 0);
				$select.removeClass('topMode').addClass('bottomMode');
			}

			$selectOptionWrapper.stop().animate(animateTo, 150, 'swing', function(){

				selectIsAnimating = false;

				var $startOption;

				if($select.hasClass("multiple"))
				{
					$startOption = $(this).find('.option').first();
				}
				else if($(this).find('.option.hovered').length > 0)
				{
					$startOption = $(this).find('.option.hovered');
				}
				else
				{
					$startOption = $(this).find('.option.selected');
				}

				selectHighlightOption($startOption, true, false);

				var numOptions = $(this).find('.option,.optgroup').length;
				if(numOptions > maxSelectOptions)
				{
					var heightLimit = $(this).find('.option').first().outerHeight() * maxSelectOptions;
					$(this).css({'max-height': heightLimit+'px', 'overflow-y': 'auto'});
				}

			});

			$select.unbind('click');

			setTimeout(function() {$(document).click(selectCloseWindowClick)}, 1);

			$currentOpenSelect = $select;
			$currentOpenSelectJspDrag = $select.find(".jspDrag");
			$currentOpenSelectJspTrack = $select.find(".jspTrack");
		}
	}

}

function closeCurrentOpenSelect() {
	selectClose($currentOpenSelect);
}

var selectCloseWindowClick = function(e) {
	var $target = $(e.target);
	var close = true;
	if(e.target === $currentOpenSelectJspDrag[0] || e.target === $currentOpenSelectJspTrack[0])
	{
		close = false;
		return false;
	}
	else if($target.hasClass('optgroupLabel') || $target.parent().hasClass('optgroupLabel'))
	{
		close = false;
	}
	else if($target.hasClass('option') || $target.parent().hasClass('option') || $target.parent().parent().hasClass('option'))
	{
		var $select = $target.closest('.select');
		if($select[0] === $currentOpenSelect[0] && $select.hasClass("multiple"))
		{
			close = false;
		}
	}

	if(close)
	{
		selectClose($currentOpenSelect);
	}
}

var selectClose = function($select) {

	if($select != null)
	{
		selectHighlightOption($select.find('.option.selected'), true, false);

		$select.removeClass('open');

		var $options = $select.find('.option');
		var optionHeight = $options.outerHeight();

		var animateTo = {height: 0};

		if($select.hasClass('topMode'))
		{
			animateTo.marginTop = -optionHeight;
		}

		$select.find('.selectOptionWrapper').stop().animate(animateTo, 150, 'swing');
		$select.find('.option').removeClass("hovered");

		$(document).unbind('click');

		selectKeyboardTimerEnd();

		setTimeout(function() {$select.click(selectClickOpen)}, 1);

		$currentOpenSelect = null;
	}
}

var selectMultipleMakeSelectionClick = function() {

	var $select = null;
	var $fs_element = $(this).closest('.select');
	var always_open = $fs_element.is('.always_open');
	if(always_open)
	{
		$select = $fs_element;
	}
	else
	{
		$select = $currentOpenSelect;
	}

	if(!fsIsMobile() && $select.find(".option.tempOff").length > 0)
	{
		$select.find(".option.tempOff").removeClass("tempOff").addClass("selected").find(".checkbox.tempOff").removeClass("tempOff").addClass("on");

		var inputName = $select.attr('id').substring(3);
		var fsID = $select.data("fsID");

		var valueArray = new Array();
		var newValue = $(this).attr('id').substring(3);
		newValue = newValue.replace(new RegExp("--space--", 'g'), " ");
		valueArray.push(newValue);

		$('input[name$="'+inputName+'"].fsID'+fsID).changeVal(valueArray);
	}
	else
	{
		selectMakeSelection($(this), $select);
	}
}

var selectMakeSelectionClick = function() {

	selectMakeSelection($(this));
}

var selectMakeSelection = function($option, $parent_select_override) {

	$parent_select = $parent_select_override == null ? $currentOpenSelect : $parent_select_override;

	if($parent_select != null)
	{
		var newValue = $option.attr('id').substring(3);
		newValue = newValue.replace(new RegExp("--space--", 'g'), " ");
		var newHTML = $option.find('p').html();
		setSelectValueInternal($parent_select, newValue, newHTML);
	}
}

var selectGhostOnChange = function(e) {

	var name = "for" + $(this).attr('name').split('SelectGhost').join('');
	var native_select_menu = this;

	if(this.multiple)
	{
		name = name.replace(/\[\]$/,'');

		$('.select').each(function() {
			if(name == $(this).attr('id'))
			{
				valueArray = fs_get_native_select_multiple_values(native_select_menu);
				setSelectValueInternal($(this), valueArray);
			}
		});
	}
	else
	{
		var value = $(this).val();
		var html = "";

		$('option', this).each(function() {
			if($(this).val() == value)
			{
				html = $(this).html();
			}
		});

		$('.select').each(function() {
			if(name == $(this).attr('id'))
			{
				setSelectValueInternal($(this), value, html);
			}
		});
	}
}

var setSelectValueInternal = function($selectWrapper, newValue, newHTML, skipActualVal) {

	skipActualVal = skipActualVal == null ? false : skipActualVal == true;

	var fsID = $selectWrapper.data("fsID");

	if(newHTML == null)
	{
		newHTML = newValue;
	}

	var inputName = $selectWrapper.attr('id').substring(3);
	var $selected = $selectWrapper.find('.selectedOption');
	var multiple = $selectWrapper.hasClass("multiple");
	var valueArray = [];

	if(multiple)
	{
		if(!fsIsMobile())
		{
			var $checkbox = $selectWrapper.find('.option#val'+newValue.replace(/\s+/g, "--space--")+' .checkbox');
			if($checkbox.hasClass("on"))
			{
				$checkbox.removeClass("on");
				$selectWrapper.find('.option#val'+newValue.replace(/\s+/g, "--space--")).removeClass('selected');
			}
			else
			{
				$checkbox.addClass("on");
				$selectWrapper.find('.option#val'+newValue.replace(/\s+/g, "--space--")).addClass('selected');
			}

			$selectWrapper.find('.option.selected').each(function(){
				var newValue = $(this).attr('id').substring(3);
				newValue = newValue.replace(new RegExp("--space--", 'g'), " ");
				valueArray.push(newValue);
			});
		}
		else
		{
			valueArray = newValue;
		}

		if(!skipActualVal)
		{
			$('input[name$="'+inputName+'"].fsID'+fsID).changeVal(valueArray);
		}

		if($selected.length > 0)
		{
			$selected_p = $selected.find('p');
			if(!$selected_p.hasClass('placeholder_option'))
			{
				var selected_p_html = fs_get_multiple_selected_string(valueArray.length);
				$selected_p.html(selected_p_html);
			}
		}
	}
	else
	{
		if(!skipActualVal)
		{
			$('input[name$="'+inputName+'"].fsID'+fsID).changeVal(newValue);
		}

		if($selected.length > 0)
		{
			$selected.removeClass().addClass('selectedOption selected_val_'+newValue).find('p').html(newHTML).removeClass("placeholder_option");
		}

		if(!fsIsMobile())
		{
			$selectWrapper.find('.option').removeClass('selected').removeClass('hovered');
			$selectWrapper.find('.option#val'+newValue).addClass('selected');
		}
	}


}

var setSelectValue = function($selectWrapper, newValue, skipActualVal) {

	skipActualVal = skipActualVal == null ? false : skipActualVal == true;

	$selectWrapper.find('.option').each(function(){

		var id = $(this).attr('id').substring(3);
		id = id.replace(new RegExp("--space--", 'g'), " ");
		if(id == newValue)
		{
			setSelectValueInternal($selectWrapper, id, $(this).find('p').html(), skipActualVal);
		}

	});
}

var toggleCheckbox = function(e) {
	if (!$(e.target).is('a')) {
		e.preventDefault();
	}
	var $checkbox = $(this);

	if($(this).is("label"))
	{
		$checkbox = $('.checkbox', this);
		if($checkbox.length == 0)
		{
			var forAttr = $(this).attr('for');
			if(forAttr != "")
			{
				$checkbox = $('.checkbox#for'+forAttr);
			}
		}
	}

	var inputName = $checkbox.attr('id').substring(3);

	// Removed $ sign as it was selecting more inputs by mistake
	// var $inputElement = $('input[name$="'+inputName+'"]');
	var $inputElement = $('input[name="'+inputName+'"]');

	if($checkbox.hasClass('on') && window.fs_options.checkboxesCanUncheck)
	{
		$inputElement.changeVal('false');
	}
	else
	{
		$inputElement.changeVal('true');
	}
}

var checkboxOnChange = function() {

	var value = $(this).val();
	var name = $(this).attr('name');
	updateCheckboxDiv('for'+name, value);

}

var updateCheckboxDiv = function(id, value) {

	var $checkboxDiv = $('#'+id.replace("[", "\\[").replace("]", "\\]"));

	var $parent = $checkboxDiv.parent();
	var $label = null;

	if($parent.is("label"))
	{
		$label = $parent;
	}
	else if(!window.fs_options.parentLabelsOnly)
	{
		$label = $('label[for="'+$checkboxDiv.attr('id').substring(3)+'"]');
		if($label.length == 0)
		{
			$label = null;
		}
	}

	var onOff = value == "true";

	$checkboxDiv.toggleClass('on', onOff);
	if($label != null)
	{
		$label.toggleClass('on', onOff);
	}

}

var toggleRadio = function(e) {
	e.preventDefault();
	var $radio = $(this);

	if($(this).is("label"))
	{
		$radio = $('.radio', this);
		if($radio.length == 0)
		{
			var forAttr = $(this).attr('for');
			if(forAttr != "")
			{
				$radio = $('.radio#'+forAttr);
			}
		}
	}

	var inputName = $radio.data('for');

	var $inputElement = $('input[name="'+inputName+'"]');
	$inputElement.changeVal($radio.data('val'));

	if(!$radio.hasClass('on'))
	{
		$('.radio').each(function(){

			if($(this).data('for') == inputName)
			{
				var $parent = $(this).parent();
				var $label = null;

				if($parent.is("label"))
				{
					$label = $parent;
				}
				else if(!window.fs_options.parentLabelsOnly)
				{
					$label = $('label[for="'+$(this).attr('id')+'"]');
					if($label.length == 0)
					{
						$label = null;
					}
				}

				if($label != null)
				{
					$label.removeClass('on');
				}
				$(this).removeClass('on');
			}

		});

		var $parent = $radio.parent();
		var $label = null;

		if($parent.is("label"))
		{
			$label = $parent;
		}
		else if(!window.fs_options.parentLabelsOnly)
		{
			$label = $('label[for="'+$radio.attr('id')+'"]');
			if($label.length == 0)
			{
				$label = null;
			}
		}

		if($label != null)
		{
			$label.addClass('on');
		}
		$radio.addClass('on');
	}

}

var radioValueChange = function() {

	var radioName = $(this).attr('name');
	var radioValue = $(this).val();

	$('.radio').each(function(){

		if($(this).data('for') == radioName)
		{
			var $parent = $(this).parent();
			var $label = null;

			if($parent.is("label"))
			{
				$label = $parent;
			}
			else if(!window.fs_options.parentLabelsOnly)
			{
				$label = $('label[for="'+$(this).attr('id')+'"]');
				if($label.length == 0)
				{
					$label = null;
				}
			}

			if($(this).attr('id') == radioValue)
			{
				if($label != null)
				{
					$label.addClass('on');
				}
				$(this).addClass('on');
			}
			else
			{
				if($label != null)
				{
					$label.removeClass('on');
				}
				$(this).removeClass('on');
			}
		}

	});
}

$.fn.changeVal = function (v) {
    return $(this).val(v).trigger("change");
}

///////////////////////
// copy events start //
///////////////////////
$.fn.extend({

	copyEvents: function(from) {
		$.event.copy(from, this);
		return this;
	},

	copyEventsTo: function(to) {
		$.event.copy(this, to);
		return this;
	},

	cloneWithEvents: function(deep) {
		return this.clone( deep ).copyEvents( this );
	}
});

$.event.copy = function(from, to) {
	from = (from.$) ? from : $(from);
	to   = (to.$)   ? to   : $(to);

	if (!from.size() || !from.data( "events" ) || !to.size()) return;

	var events = from.data( "events" );
	to.each(function() {
		for (var type in events)
			for (var handler in events[type])
				$.event.add(this, type, events[type][handler], events[type][handler].data);
	});
};
/////////////////////
// copy events end //
/////////////////////

function fsIsMobile() {
	return(typeof mobile != "undefined" && mobile == true);
}

function fsIsIos() {
	return(typeof Detectizr.os.name != "undefined" && Detectizr.os.name == "ios");
}

function fsGetFieldTypeAndElm($input, $formWrapper) {

	var $prev = $input.prev();
	if($prev.is('ul.tagit'))
	{
		return {fieldType: 'tagit', $elm: $prev};
	}

	$formWrapper = $formWrapper == null ? $(document) : $formWrapper;

	if($input.attr('name') == null)
	{
		return false;
	}

	var fieldName = fsRenderInputNameForSelector($input.attr('name'));
	var fieldType = $input.is('textarea') ? "textarea" : $input.attr('type');
	var $elm = $input;

	if(fieldType == "hidden")
	{
		if($formWrapper.find('div.checkbox#for'+fieldName).length > 0)
		{
			$elm = $formWrapper.find('div.checkbox#for'+fieldName);
			fieldType = "formStyledCheckbox";
		}
		else if($formWrapper.find('div.checkbox#forplaceholder_checkbox_'+fieldName).length > 0)
		{
			$elm = $formWrapper.find('div.checkbox#forplaceholder_checkbox_'+fieldName);
			fieldType = "formStyledPlaceholderCheckbox";
		}
		else if($formWrapper.find('div.select#for'+fieldName).length > 0)
		{
			$elm = $formWrapper.find('div.select#for'+fieldName);
			fieldType = "formStyledSelect";
		}
		else if($formWrapper.find('div.radio[id^="'+fieldName+'"]').length > 0)
		{
			$elm = $formWrapper.find('div.radio[id^="'+fieldName+'"]');
			fieldType = "formStyledRadio";
		}
		else if($formWrapper.find('#'+fieldName+'_picker_anchor_1').length > 0)
		{
			$elm = $formWrapper.find('#'+fieldName+'_picker_anchor_1').find('input');
			fieldType = "image";
		}
	}
	else if($input.get(0).tagName == "SELECT" && $input.hasClass('selectGhost'))
	{
		$elm = $formWrapper.find('div.select#for'+fieldName);
		fieldType = "formStyledSelect";
	}
	else if(fieldType == "text" && $elm.parent().is('.cp_form_field_address_lookup_manual_fields'))
	{
		fieldType = 'cp_form_field_address_lookup';
	}

	return {fieldType: fieldType, $elm: $elm};

}

var fsFuzzyMatch = {
	pattern: '',
	prep: function(s, matchWholeWord){
		this.pattern = matchWholeWord === true ? new RegExp('('+s+')', 'i') : new RegExp('('+s.split('').join(').*?(')+').*?', 'i');
		return this;
	},
	match: function (s){
		return s.match(this.pattern);
	},
	hiblock:function(s){
		return s.replace(
			this.pattern,
			'<span class="selectFiltered">$&</span>'
		);
	},
	hi:function(s){
		return s.replace(
			this.pattern,
			this._hi
		);
	},
	_hi:function(){
		var match = arguments[0];
		var max = arguments.length - 2;
		for (; max > 0; max--){
			var r = new RegExp('(^|[^÷])('+arguments[max]+')');
			match = match.replace(r, '$1÷$2þ');
		}
		return match.replace(/þ/g, '</span>').replace(/÷/g, '<span class="selectFiltered">').replace(/<\/span><span class="selectFiltered">/g, '');
	}
}