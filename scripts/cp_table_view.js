window.i = 0;
(function( $ ) {

	$.cp_table = function(element, options) {

		////////////////////
		//default settings//
		////////////////////

		var defaults = {
			  cptv_id: ""
			, cp_table_interface: null
			, cp_table_interface_context: null
			, reordered: false
			, multiSelect: false
			, searchable: false
			, refreshEnabled: true
			, autoRefreshEnabled: false
			, autoRefreshOn: false
			, autoReloadInterval: null
			, sorting: false
			, sortable: false
			, startSortable: false
			, ajaxMode: true
			, sectionMode: false
			, scrollableMode: false
			, qtip_enabled: false
			, allow_string_ids: false
			, resizingPaused: false
			, columnSettings: []
			, colWidths: []
			, filters: []
			, active_filters: {}
			, lastSelectedTRIndex: -1
			, totalSelections: 0
			, loading: false
			, search_keywords: ""
			, page: 0
			, perPage: 0
			, pageFrom: 0
			, pageTo: 0
			, totalRows: 0
			, noRowsText: ""
			, contextMenuHTML: ""
			, blankRowHTML: "<tr></tr>"
			, delete_method: null
			, mass_delete_method: null
			, active_toggle_method: null
			, mass_active_toggle_method: null
			, mass_move_method: null
			, save_reorder_method: null
			, rename_method: null
			, export_method: null
			, row_ids_to_highlight_on_reload: null
			, save_column_options_url: null
			, save_column_options_extra_data: null
			, qtip_settings: {
				  position: {
					target: 'mouse'
		        	, adjust: {
		        		  y: 22
		        		, mouse: false // Don't continuously follow the mouse, just use initial position
		        	}
				}
				, style: {
					    classes: 'cpTableViewTooltip qtip-shadow'
					  , tip: false
				}
				, show: {
					  event: 'mouseenter'
					, delay: 500
					, effect: function(offset) {
						$(this).fadeIn(100);
					}
				}
				, hide: {
					  event: 'mouseleave'
				}
			}
		};

		// to avoid confusions, use "plugin" to reference the
		// current instance of the object
		var plugin = this;

		// this will hold the merged default, and user-provided options
		// plugin's properties will be available through this object like:
		// plugin.settings.propertyName from inside the plugin or
		// element.data('pluginName').settings.propertyName from outside the plugin,
		// where "element" is the element the plugin is attached to;
		plugin.settings = {};

		///////////////////
		//private methods//
		///////////////////

		plugin.init = function() {

			plugin.settings = $.extend({}, defaults, options);

			plugin.settings.$table = $(element);

			plugin.settings.table_id = plugin.settings.$table.attr("id").replace("cp_table_", "");

			plugin.settings.$tbody = plugin.settings.$table.find("#cp_table_"+plugin.settings.table_id+"_body");
			plugin.settings.$thead = plugin.settings.$table.find("thead");
			plugin.settings.$headerColRow = plugin.settings.$thead.find("tr.headerCols");
			plugin.settings.$headerColCells = plugin.settings.$headerColRow.find('.cpTableCellDiv');
			plugin.settings.$thead_sortable_cells = plugin.settings.$thead.find('.cpTableCellDiv.sortable');

			plugin.settings.$select_controls = $('#cp_table_select_controls_'+plugin.settings.table_id);

			plugin.settings.$select_tools = plugin.settings.$select_controls.find('.selectTools');
			plugin.settings.$select_tools.find('.tools').find('li').click(selectToolsClick);

			plugin.settings.$mass_tools = plugin.settings.$select_controls.find('.massTools').stop().animate({opacity: 0}, 0, "linear", function(){
				$(this).css("display", "none");
			});

			if(plugin.settings.scrollableMode)
			{
				if(!Modernizr.cssscrollbar)
				{
					plugin.settings.$table.find('.cpTableViewScrollableWrapper').mCustomScrollbar({
						  scrollEasing: "easeOutExpo"
						, scrollInertia: 300
						// , mouseWheel:{ deltaFactor: 80 }
						, theme: "ccd_light"
					});
				}
			}

			if(plugin.settings.refreshEnabled)
			{
				plugin.settings.$refreshBtn = $('#cp_table_refresh_btn_'+plugin.settings.table_id).click(refreshBtnClick);
			}

			if(plugin.settings.autoRefreshEnabled)
			{
				plugin.settings.$autoRefreshInput = $('input[name="cp_table_autorefresh_checkbox_'+plugin.settings.table_id+'"]').change(autoRefreshOnChange);
			}

			if(plugin.settings.searchable)
			{
				plugin.settings.$tableSearchWrapper = $('#cp_table_search_wrapper_'+plugin.settings.table_id);
				plugin.settings.$searchInput = plugin.settings.$tableSearchWrapper.find('#cp_table_search_'+plugin.settings.table_id).keydown(searchInputKeydown);
				plugin.settings.$searchBtn = plugin.settings.$tableSearchWrapper.find('.btn.search').click(searchBtnClick);
				plugin.settings.$clearSearchBtn = plugin.settings.$tableSearchWrapper.find('.clearSearch').click(clearSearchBtnClick);
			}

			if(plugin.settings.export_enabled)
			{
				plugin.settings.$cpTableExportBtn = $('#cp_table_export_button_'+plugin.settings.table_id);
				plugin.settings.$cpTableExportBtn.click(exportBtnClick);
			}

			if(plugin.settings.filterable)
			{
				plugin.settings.$cpTableFilterDropdown = $('#cp_table_filter_dropdown_'+plugin.settings.table_id);
				plugin.settings.$cpTableFilterDropdown.appendTo('body').css({opacity: 0, display: 'none'});
				if(typeof initFormStyles == 'function')
				{
					initFormStyles({$wrapper: plugin.settings.$cpTableFilterDropdown});
				}

				plugin.settings.$cpTableFilterDropdown.find('.tableFilterSearchWrapper .clearSearch').click(filterClearSearchBtnClick);

				plugin.settings.$cpTableFilterBtn = $('#cp_table_filter_button_'+plugin.settings.table_id);
				plugin.settings.$cpTableFilterBtn.click(filterBtnClick);

				for(var i in plugin.settings.filters)
				{
					var filter = plugin.settings.filters[i];
					var $elm = plugin.settings.filters[i].$elm = plugin.settings.$cpTableFilterDropdown.find('#'+filter.id);
					$elm.change(onFilterChange);

					if(filter.type == "search")
					{
						$elm.keyup(onFilterChange);
					}

					plugin.settings.$cpTableFilterDropdown.find('#filter_heading_'+plugin.settings.table_id+'_'+i).find('span.clearFilter').click(clearFilterClick);
				}

				// plugin.settings.$cpTableFilterDropdown.find()

			}

			if(plugin.settings.perPage > 0)
			{
				var $paginationTop = $('#cp_table_pagination_top_'+plugin.settings.table_id);
				var $paginationBottom = $('#cp_table_pagination_bottom_'+plugin.settings.table_id);

				if(funcExists(initFormStyles))
				{
					initFormStyles({$wrapper: $paginationTop});
					initFormStyles({$wrapper: $paginationBottom});
				}

				plugin.settings.pagination = {
					  top: {
						  $from: $paginationTop.find('span.from')
						, $to: $paginationTop.find('span.to')
						, $total: $paginationTop.find('span.total')
						, $arrowLeft: $paginationTop.find('.arrow.left').click(arrowClick)
						, $arrowRight: $paginationTop.find('.arrow.right').click(arrowClick)
						, $dropdown: $paginationTop.find('#paginationDropdownTop_'+plugin.settings.table_id).change(paginationDropdownChange)
					  }
					, bottom: {
						  $from: $paginationBottom.find('span.from')
						, $to: $paginationBottom.find('span.to')
						, $total: $paginationBottom.find('span.total')
						, $arrowLeft: $paginationBottom.find('.arrow.left').click(arrowClick)
						, $arrowRight: $paginationBottom.find('.arrow.right').click(arrowClick)
						, $dropdown: $paginationBottom.find('#paginationDropdownBottom_'+plugin.settings.table_id).change(paginationDropdownChange)
					}
				}
			}

			plugin.settings.$makeActiveBtn = plugin.settings.$mass_tools.find('.btn.makeActive').click(massMakeActiveBtnClick);
			plugin.settings.$makeInactiveBtn = plugin.settings.$mass_tools.find('.btn.makeInactive').click(massMakeInactiveBtnClick);
			plugin.settings.$massEditBtn = plugin.settings.$mass_tools.find('.btn.editBtn').click(massEditBtnClick);
			plugin.settings.$massDeleteBtn = plugin.settings.$mass_tools.find('.btn.deleteBtn').click(massDeleteBtnClick);
			plugin.settings.$massMoveBtn = plugin.settings.$mass_tools.find('.btn.moveBtn').click(massMoveBtnClick);

			if(plugin.settings.sortable)
			{
				$('#reorderBtnTop,#reorderBtnBtm').click(reorderBtnClick);
				$('#reorderCancelBtnTop,#reorderCancelBtnBtm').click(reorderCancelBtnClick);
				$('#reorderSaveBtnTop,#reorderSaveBtnBtm').click(saveReorder);
			}

			// plugin.settings.$table.find('.btn.reorderBtn.save,.btn.reorderBtn.cancel').css("display", "none");
			plugin.toggleReorderMode(plugin.settings.sortable && plugin.settings.startSortable, false, true);

			if(plugin.settings.ajaxMode)
			{
				plugin.settings.$thead.find('th').find('.cpTableCellDiv.sortable').click(headerCellClick);
			}

			if(funcExists(initFormStyles))
			{
				initFormStyles({$wrapper: plugin.settings.$tbody});
			}

			if(
				   plugin.settings.contextMenuHTML != ""
				&& typeof cm_addContextMenu == "function"
				&& plugin.settings.save_column_options_url != null
			)
			{
				cm_addContextMenu(
					  plugin.settings.$thead.find('tr.headerCols').find('th')
					, plugin.settings.contextMenuHTML
					, function(target_element, clicked_element) {
						$('#cm_column_save_btn').click(saveColumnOptions);
					}
					, plugin.settings.$thead.find('.cpTableColumnSettingsBtn')
				);
			}

			updateDeepLink();
			updatePagination();
			if(plugin.settings.filterable)
			{
				updateFilters(false);
			}
			initRows(true);

			setTimeout(function(){
				plugin.settings.$tbody.find('tr.cp_table_row_highlight').removeClass("cp_table_row_highlight");
			}, 500);
		}

		function refreshBtnClick() {

			plugin.settings.$refreshBtn.addClass("loading");

			if(plugin.settings.ajaxMode)
			{
				loadRows();
			}
			else
			{
				location.reload();
			}
		}

		function autoRefreshOnChange() {
			toggleAutoRefresh($(this).val() === "true");
		}

		function toggleAutoRefresh(onOff) {
			plugin.settings.autoReloadOn = onOff;

			if(plugin.settings.autoReloadOn)
			{
				plugin.settings.autoReloadInterval = setInterval(refreshBtnClick, 5000);
				refreshBtnClick();
			}
			else
			{
				clearInterval(plugin.settings.autoReloadInterval);
				plugin.settings.autoReloadInterval = null;
			}
		}

		function filterBtnClick() {
			toggleFilterDropdown();
		}

		function toggleFilterDropdown(onOff) {
			plugin.settings.filterDropdownOpen = onOff == null ? !plugin.settings.filterDropdownOpen : onOff === true;

			if(plugin.settings.filterDropdownOpen)
			{
				addFilterDocumentClickListener();
				var newOffset = plugin.settings.$cpTableFilterBtn.offset();

				newOffset.top += 26 + 10;
				plugin.settings.$cpTableFilterDropdown.stop().css({display: 'block', top: newOffset.top-20}).animate({top: newOffset.top, opacity: 1}, 200, 'easeOutExpo');
			}
			else
			{
				removeFilterDocumentClickListener();

				updateFilters();

				var newOffset = plugin.settings.$cpTableFilterDropdown.offset();
				plugin.settings.$cpTableFilterDropdown.stop().animate({top: newOffset.top-20, opacity: 0}, 200, 'easeOutExpo', function(){ $(this).css('display', 'none'); });
			}

			plugin.settings.$cpTableFilterBtn.toggleClass('held', plugin.settings.filterDropdownOpen);
		}

		function addFilterDocumentClickListener() {
			window.cp_table_filter_current_id = plugin.settings.table_id;
			document.addEventListener("click", documentClickListener);
		}

		function removeFilterDocumentClickListener() {
			window.cp_table_filter_current_id = null;
			document.removeEventListener( "click", documentClickListener);
		}

		function documentClickListener(e) {
			var found = false;

			if(clickInsideElement( e, '#cp_table_filter_dropdown_'+window.cp_table_filter_current_id ) !== false)
			{
				found = true;
			}
			else if(clickInsideElement( e, '#cp_table_filter_button_'+window.cp_table_filter_current_id ) !== false)
			{
				found = true;
			}
			else if(clickInsideElement( e, '.CPFormFieldDateTimeRange' ) !== false)
			{
				found = true;
			}

			if(!found)
			{
				var button = e.which || e.button;
				if ( button === 1 ) {
					toggleFilterDropdown(false);
				}
			}
		}

		/**
		* Function to check if we clicked inside an element with a particular class
		* name.
		*
		* @param {Object} e The event
		* @param {String} className The class name to check against
		* @return {Boolean}
		*/
		function clickInsideElement( e, selector ) {
			var el = e.srcElement || e.target;

			if ( $(el).is(selector) ) {
				return el;
			} else {
				while ( el = el.parentNode ) {
					if ( $(el).is(selector) ) {
						return el;
					}
				}
			}

			return false;
		}

		function getPostData(mode, include_pagination) {

			// if mode not specified, throw error
			if(mode == null)
			{
				throw "Mode not specified";
			}

			var postData = {
				  mode: mode
				, cptv_id: plugin.settings.cptv_id
				, rowIDFieldName: plugin.settings.rowIDFieldName
				, sortable: plugin.settings.sortable
				, multiSelect: plugin.settings.multiSelect
				, searchable: plugin.settings.searchable
				, active_filters: plugin.settings.active_filters
				, search_keywords: plugin.settings.search_keywords
				, ajaxMode: plugin.settings.ajaxMode
				, sortByField: plugin.settings.sortByField
				, sortByDesc: plugin.settings.sortByDesc
				, startSortable: plugin.settings.startSortable
				, columnSettings: plugin.settings.columnSettings
				, cpb_url: getRelativeURL()
		  };

		  if(include_pagination === true)
		  {
			  postData.page      = plugin.settings.page;
			  postData.perPage   = plugin.settings.perPage;
			  postData.pageFrom  = plugin.settings.pageFrom;
			  postData.pageTo    = plugin.settings.pageTo;
			  postData.totalRows = plugin.settings.totalRows;
		  }

		  return postData;
		}

		function exportBtnClick() {
			showExportPopup();
		}

		function showExportPopup()
		{
			cpShowPopup(
				  'Export'
				, plugin.settings.export_popup_html
				, ""
				, exportPopupSubmit
				, null
				, "Submit"
			);

			return;
		}

		function exportPopupSubmit()
		{
			if(!plugin.settings.loading)
			{
				plugin.settings.loading = true;

				cpSetPopupLoadingAndLock();

				var postData = getPostData('queue_export');

				postData.cptv_export_email = cptv_export_email.value;

				$.ajax({
					type: 'POST',
					url: 'class.cp_table_view.php',
					dataType : 'json',
					data: postData,
					success : function(data){

						if(data.responseCode == 1)
						{
							cpShowPopup("Export", "<p>Your export is being assembled and will be emailed to you when it is ready.</p>");
						}
						else if(data.responseCode == 3)
						{
							alert("Please enter a valid email address");
							showExportPopup();
						}
						else if(data.responseCode == 2)
						{
							// not logged in
							location.reload();
						}
						else
						{
							alert("Oops, something went wrong.\n\nresponseCode: "+data.responseCode);
							hidePopup();
						}

						plugin.settings.loading = false;
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						plugin.settings.loading = false;
						console.error("exportPopupSubmit() error\n\n"+textStatus+": "+errorThrown);
						if(CPO_DEBUG)
						{
							console.error("XMLHttpRequest responseText:", XMLHttpRequest.responseText);
						}
						hidePopup();
					}
				});

			}
		}

		function searchInputKeydown(e) {

			if (e.keyCode == 13) {
				doSearch();
				return false;
			}

		}

		function searchBtnClick(e) {
			doSearch();
		}

		function doSearch() {

			if(!plugin.settings.loading && !plugin.settings.search_filters_active)
			{
				var newKeywords = plugin.settings.$searchInput.val();

				if(newKeywords != plugin.settings.search_keywords)
				{
					plugin.settings.$searchBtn.addClass("loading");

					plugin.settings.search_keywords = newKeywords;

					resetSortByAndPageNum(newKeywords != "");

					loadRows();
				}
			}
		}

		function onFilterChange(e) {
			var newVal = $(this).val();
			var hasValue = false;

			if(typeof newVal == "object")
			{
				hasValue = newVal.length > 0;
			}
			else if(newVal != null)
			{
				newVal = $.trim(newVal);
				hasValue = newVal !== "";
			}

			var column_tail = this.id.replace(/.*(_\w+_\w+)$/,'$1');

			$('#filter_heading'+column_tail).toggleClass('hasValue', hasValue);

			// close filter dropdown (and apply filters) on enter
			if (typeof e.keyCode != 'undefined' && e.keyCode == 13) {
				toggleFilterDropdown(false);
			}
		}

		function get_filter_by_id(filter_id)
		{
			for(var i in plugin.settings.filters)
			{
				var filter = plugin.settings.filters[i];
				if(filter.id == filter_id)
				{
					return(filter);
				}
			}

			return(false);
		}

		function clearFilterClick(e) {
			var filter_id = $(this).data('filter-id');
			var filter = get_filter_by_id(filter_id);
			if(filter && filter.type === 'date')
			{
				$('#'+filter_id+'_btn').data('daterangepicker').clear_date_range();
			}
			else
			{
				$('#'+filter_id).changeVal('');
			}
		}

		function updateFilters(reloadOnChange) {

			if(!plugin.settings.filterable)
			{
				return(false);
			}

			var filters_have_changed = false;
			var search_filters_active = false;
			var total_active_filters = 0;
			var prev_active_filters = plugin.settings.active_filters;
			plugin.settings.active_filters = {};

			for(var i in plugin.settings.filters)
			{
				var filter = plugin.settings.filters[i];

				var filter_val = filter.$elm.val();

				var hasValue = false;

				if(typeof filter_val == "object")
				{
					hasValue = filter_val.length > 0;
				}
				else if(filter_val != null)
				{
					filter_val = $.trim(filter_val);
					hasValue = filter_val !== "";
				}

				var field = plugin.settings.columnSettings[filter.colNum].field;

				if(hasValue)
				{
					plugin.settings.active_filters[field] = filter_val;
					total_active_filters++;
					// plugin.settings.active_filters = $.extend(plugin.settings.active_filters, {field: filter_val});

					if(filter.type == "search")
					{
						search_filters_active = true;
					}

					if(!prev_active_filters.hasOwnProperty(field))
					{
						filters_have_changed = true;
					}
					else if(typeof filter_val != "object" && prev_active_filters[field] !== filter_val)
					{
						filters_have_changed = true;
					}
					else if(!arraysEqual(prev_active_filters[field], filter_val))
					{
						filters_have_changed = true;
					}
				}
				else if(prev_active_filters.hasOwnProperty(field))
				{
					filters_have_changed = true;
				}
			}

			if(plugin.settings.searchable && plugin.settings.$tableSearchWrapper.hasClass('disabled') != search_filters_active)
			{
				plugin.settings.$tableSearchWrapper.toggleClass('disabled', search_filters_active);
				plugin.settings.$searchBtn.toggleClass('disabled', search_filters_active);

				if(search_filters_active)
				{
					plugin.settings.$searchInput.val('').attr('placeholder', "(search filters active)").prop('disabled', true);
				}
				else
				{
					plugin.settings.$searchInput.attr('placeholder', "Search...").prop('disabled', false);
				}
			}

			var filterBtnText = total_active_filters > 0
				? "Filters ("+total_active_filters+")"
				: "Filter"
			;

			plugin.settings.$cpTableFilterBtn.find('span').html(filterBtnText);

			if(search_filters_active)
			{
				plugin.settings.search_keywords = "";
			}

			plugin.settings.total_active_filters = total_active_filters;
			plugin.settings.search_filters_active = search_filters_active;

			if(filters_have_changed & reloadOnChange !== false)
			{
				plugin.settings.$cpTableFilterBtn.addClass("loading");

				resetSortByAndPageNum(search_filters_active);

				loadRows();
			}
		}

		function arraysEqual(a, b) {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length !== b.length) return false;

			// If you don't care about the order of the elements inside
			// the array, you should sort both arrays here.
			// Please note that calling sort on an array will modify that array.
			// you might want to clone your array first.

			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		}

		function resetSortByAndPageNum(using_search_sort) {

			resetSortBy(using_search_sort === true);
			plugin.settings.page = 0;
		}

		function resetSortBy(using_search_sort) {

			if(using_search_sort === true)
			{
				plugin.settings.sortByField = "";
			}
			else if(plugin.settings.sortByField == "")
			{
				plugin.settings.sortByField = plugin.settings.sortByFieldDefault;
			}

			plugin.settings.sortByDesc = plugin.settings.sortByDescDefault;
		}

		function clearSearchBtnClick(e) {
			if(!plugin.settings.loading)
			{
				clearSearchText();
				doSearch();
			}
		}

		function filterClearSearchBtnClick(e) {
			$(this).parent().find('input[type=text]').changeVal("");
		}

		function clearSearchText() {
			if(plugin.settings.$searchInput != null)
			{
				plugin.settings.$searchInput.val("");
			}
			plugin.settings.page = 0;
		}

		function iconCellClick(e) {

			var $tr = $(this).closest("tr");

			$tr.toggleClass("selected");

			var selected = $tr.hasClass("selected");
			var thisIndex = $tr.index();

			if (e.shiftKey && plugin.settings.lastSelectedTRIndex != -1) {
				var startIndex = thisIndex < plugin.settings.lastSelectedTRIndex ? thisIndex : plugin.settings.lastSelectedTRIndex;
				var endIndex = thisIndex > plugin.settings.lastSelectedTRIndex ? thisIndex : plugin.settings.lastSelectedTRIndex;

				var $range = $tr.siblings().slice(startIndex, endIndex);

				if(selected)
				{
					$range.addClass('selected');
				}
				else
				{
					$range.removeClass('selected');
				}
			}

			plugin.settings.lastSelectedTRIndex = thisIndex;

			updateRowSelections();
		}

		function selectToolsClick(e) {

			selectTableRowsMode($(this).data('selection-mode'));
		}

		function massMakeActiveBtnClick()
		{
			if(plugin.settings.cp_table_interface || funcExists(plugin.settings.mass_active_toggle_method))
			{
				$(this).addClass("loading");
				var item_ids = [];
				plugin.settings.$table.find('tr.selected').find('input[name^="activation"]').each(function(){
					var rowID = $(this).attr('name').replace("activation", "");
					if(!plugin.settings.allow_string_ids)
					{
						rowID = parseInt(rowID);
					}
					plugin.settings.$table.find('#foractivation'+rowID).addClass("loading");
					item_ids.push(rowID);
				});

				if(plugin.settings.cp_table_interface)
				{
					interface_set_multiple_items_live(item_ids, true, plugin);
				}
				else if(funcExists(plugin.settings.mass_active_toggle_method))
				{
					plugin.settings.mass_active_toggle_method(item_ids, true, plugin);
				}
			}
		}

		function massMakeInactiveBtnClick()
		{

			if(plugin.settings.cp_table_interface || funcExists(plugin.settings.mass_active_toggle_method))
			{
				$(this).addClass("loading");
				var item_ids = [];
				plugin.settings.$table.find('tr.selected').find('input[name^="activation"]').each(function(){
					var rowID = $(this).attr('name').replace("activation", "");
					if(!plugin.settings.allow_string_ids)
					{
						rowID = parseInt(rowID);
					}
					plugin.settings.$table.find('#foractivation'+rowID).addClass("loading");
					item_ids.push(rowID);
				});

				if(plugin.settings.cp_table_interface)
				{
					interface_set_multiple_items_live(item_ids, false, plugin);
				}
				else if(funcExists(plugin.settings.mass_active_toggle_method))
				{
					plugin.settings.mass_active_toggle_method(item_ids, false, plugin);
				}

			}
		}

		function massEditBtnClick() {
			// TODO implement this
		}

		function massDeleteBtnClick() {

			if(plugin.settings.cp_table_interface || funcExists(plugin.settings.mass_delete_method))
			{
				$(this).addClass("loading");
				var item_ids = [];

				plugin.settings.$table.find('tr.selected').find('.deleteBtn').each(function(){
					var item_id = $(this).attr('id').replace("deleteBtn", "");
					if(!plugin.settings.allow_string_ids)
					{
						item_id = parseInt(item_id);
					}
					plugin.settings.$table.find('#deleteBtn'+item_id).addClass("loading");
					item_ids.push(item_id);
				});

				if(item_ids.length > 0)
				{
					if(plugin.settings.cp_table_interface)
					{
						interface_delete_multiple_items(item_ids, plugin);
					}
					else if(funcExists(plugin.settings.mass_delete_method))
					{
						plugin.settings.mass_delete_method(item_ids, plugin);
					}
				}
			}
		}

		function massMoveBtnClick() {

			if(funcExists(plugin.settings.mass_move_method))
			{
				var row_id_array = [];
				plugin.settings.$table.find('tr.selected').each(function(){
					var rowID = $(this).data('row-id');
					row_id_array.push(rowID);
				});

				plugin.settings.mass_move_method(row_id_array, plugin);
			}
		}

		function reorderBtnClick() {
			plugin.toggleReorderMode(true);
		}

		function reorderCancelBtnClick() {
			reorderCancel();
		}

		function reorderCancel(show_success_message) {
			if(show_success_message === true)
			{
				cp_toasts_add({message: "Reorder saved", type: 1});
			}
			plugin.toggleReorderMode(false);
		}

		function saveReorder() {

			var item_ids = [];

			plugin.settings.$tbody.find('tr').each(function(){
				var trID = $(this).attr("class");
				if(trID != "noRows")
				{
					var new_tr_id = trID.replace("row", "");

					if(!plugin.settings.allow_string_ids)
					{
						new_tr_id = parseInt(new_tr_id);
					}

					item_ids.push(new_tr_id);
				}
			});

			if(item_ids.length > 0)
			{
				if(plugin.settings.cp_table_interface || funcExists(plugin.settings.save_reorder_method))
				{
					$('.btn.reorderBtn').addClass("loading");

					if(plugin.settings.cp_table_interface)
					{
						interface_save_item_reorder(item_ids, plugin);
					}
					else
					{
						plugin.settings.save_reorder_method(plugin, item_ids, reorderCancel);
					}
				}
				else
				{
					plugin.toggleReorderMode(false);
				}
			}

		}

		function interface_delete_item(item_id) {
			if(confirm("Are you sure you want to delete this item?"))
			{
				$.ajax({
					type: 'POST',
					url: plugin.settings.cp_table_interface,
					dataType : 'json',
					data: {
						  cpti_mode: 'cp_table_interface_delete_item'
						, cpti_context: plugin.settings.cp_table_interface_context
						, item_id: item_id
					},
					success : function(data){
						if(data.responseCode == 1)
						{
							$('.cpTableView').cp_table().removeRowWithAnimation( $('#deleteBtn'+data.item_id).closest("tr") );
						}
						else
						{
							$('#deleteBtn'+item_id).removeClass("loading");
							if(data.responseCode == 2)
							{
								// not logged in
								cp.show_not_logged_in_error_popup();
							}
							else
							{
								cp.show_error('Could not delete item, please reload the page and try again', 'interface_delete_item', data.responseCode);
							}
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						cp.show_error('Could not delete item, please reload the page and try again', 'interface_delete_item', null, XMLHttpRequest, textStatus, errorThrown);
						var data = $.unserialize(this.data);
						$('#deleteBtn'+data.item_id).removeClass("loading");
					}
				});
			}
			else
			{
				$('#deleteBtn'+item_id).removeClass("loading");
			}
		}

		function interface_delete_multiple_items(item_ids, cp_table)
		{
			var s = item_ids.length == 1 ? "" : "s";
			if(confirm('Are you sure you want to delete '+item_ids.length+' item'+s+'?'))
			{
				$.ajax({
					type: 'POST',
					url: plugin.settings.cp_table_interface,
					dataType : 'json',
					data: {
						  cpti_mode: 'cp_table_interface_delete_multiple_items'
						, cpti_context: plugin.settings.cp_table_interface_context
						, item_ids: item_ids
					},
					success : function(data){
						if(data.responseCode == 1)
						{
							for(i in data.item_ids)
							{
								$('.cpTableView').cp_table().removeRowWithAnimation( $('#deleteBtn'+data.item_ids[i]).closest("tr") );
							}
						}
						else
						{
							for(i in item_ids)
							{
								$('#deleteBtn'+item_ids[i]).removeClass("loading");
							}

							if(data.responseCode == 2)
							{
								// not logged in
								cp.show_not_logged_in_error_popup();
							}
							else
							{
								cp.show_error('Could not delete items, please reload the page and try again', 'interface_delete_multiple_items', data.responseCode);
							}
						}
						cp_table.massDeleteComplete();
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						cp.show_error('Could not delete items, please reload the page and try again', 'interface_delete_multiple_items', null, XMLHttpRequest, textStatus, errorThrown);

						cp_table.massDeleteComplete();
						var data = $.unserialize(this.data);
						for(i in data.item_ids)
						{
							$('#deleteBtn'+data.item_ids[i]).removeClass("loading");
						}
					}
				});
			}
			else
			{
				cp_table.massDeleteComplete();
				for(i in item_ids)
				{
					$('#deleteBtn'+item_ids[i]).removeClass("loading");
				}
			}
		}

		function interface_set_item_live(item_id, live)
		{
			$.ajax({
				type: 'POST',
				url: plugin.settings.cp_table_interface,
				dataType : 'json',
				data: {
					  cpti_mode: 'cp_table_interface_set_item_live'
					, cpti_context: plugin.settings.cp_table_interface_context
					, item_id: item_id
					, live: live
				},
				success : function(data){
					$('#foractivation'+item_id).removeClass("loading");
					if(data.responseCode == 1)
					{
						$('input[name="activation'+data.item_id+'"]').changeVal(data.live);
					}
					else
					{
						$('input[name="activation'+item_id+'"]').changeVal(!live);

						if(data.responseCode == 2)
						{
							// not logged in
							cp.show_not_logged_in_error_popup();
						}
						else
						{
							cp.show_error('Could not complete request, please reload the page and try again', 'interface_set_item_live', data.responseCode);
						}
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					cp.show_error('Could not complete request, please reload the page and try again', 'interface_set_item_live', null, XMLHttpRequest, textStatus, errorThrown);
					var data = $.unserialize(this.data);
					$('input[name="activation'+data.item_id+'"]').changeVal(!data.live);
					$('#foractivation'+data.item_id).removeClass("loading");
				}
			});
		}

		function interface_set_multiple_items_live(item_ids, live, cp_table)
		{
			$.ajax({
				type: 'POST',
				url: plugin.settings.cp_table_interface,
				dataType : 'json',
				data: {
					  cpti_mode: 'cp_table_interface_set_multiple_items_live'
					, cpti_context: plugin.settings.cp_table_interface_context
					, item_ids: item_ids
					, live: live
				},
				success : function(data){

					var local_live = data.responseCode == 1 ? data.live : live;

					if(local_live)
					{
						cp_table.massMakeActiveComplete();
					}
					else
					{
						cp_table.massMakeInactiveComplete();
					}

					if(data.responseCode == 1)
					{
						for(i in data.item_ids)
						{
							$('#foractivation'+data.item_ids[i]).removeClass("loading");
							$('input[name="activation'+data.item_ids[i]+'"]').changeVal(local_live);
						}
					}
					else
					{
						for(i in item_ids)
						{
							$('#foractivation'+item_ids[i]).removeClass("loading");
							$('input[name="activation'+item_ids[i]+'"]').changeVal(!local_live);
						}

						if(data.responseCode == 2)
						{
							// not logged in
							cp.show_not_logged_in_error_popup();
						}
						else
						{
							cp.show_error('Could not complete request, please reload the page and try again', 'interface_set_multiple_items_live', data.responseCode);
						}
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {

					cp.show_error('Could not complete request, please reload the page and try again', 'interface_set_multiple_items_live', null, XMLHttpRequest, textStatus, errorThrown);

					var data = $.unserialize(this.data);

					if(data.live)
					{
						cp_table.massMakeActiveComplete();
					}
					else
					{
						cp_table.massMakeInactiveComplete();
					}

					for(i in data.item_ids)
					{
						$('#foractivation'+data.item_ids[i]).removeClass("loading");
						$('input[name="activation'+data.item_ids[i]+'"]').changeVal(!data.live);
					}
				}
			});
		}

		function interface_save_item_reorder(item_ids, cp_table)
		{
			$.ajax({
				type: 'POST',
				url: plugin.settings.cp_table_interface,
				dataType : 'json',
				data: {
					  cpti_mode: 'cp_table_interface_item_reorder'
					, cpti_context: plugin.settings.cp_table_interface_context
					, item_ids: item_ids
				},
				success : function(data)
				{
					$('.btn.reorderBtn').removeClass("loading");

					if(data.responseCode == 1)
					{
						reorderCancel(true);
					}
					else
					{
						reorderCancel(false);
						cp_table.toggleReorderMode(true);

						if(data.responseCode == 2)
						{
							// not logged in
							cp.show_not_logged_in_error_popup();
						}
						else
						{
							cp.show_error('Could not reorder items, please reload the page and try again', 'interface_save_item_reorder', data.responseCode);
						}
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					cp.show_error('Could not reorder items, please reload the page and try again', 'interface_save_item_reorder', null, XMLHttpRequest, textStatus, errorThrown);

					$('.btn.reorderBtn').removeClass("loading");
					reorderCancel();
					cp_table.toggleReorderMode(true);
				}
			});
		}

		function saveColumnOptions() {

			if(
				plugin.settings.save_column_options_url != null
				&& !$('#cm_column_save_btn').hasClass('loading')
			)
			{
				$('#cm_column_save_btn').addClass('loading');

				var set_id = $('#cp_context_menu').find('#set_id').val();
				var columns = [];

				$('#cp_context_menu').find('input[name^="cm_column"]').each(function(){
					if(this.value == "true")
					{
						var val = this.name.substr(10,this.name.length - 11);
						columns.push(val);
					}
				});

				var data = {columns: columns};

				if(plugin.settings.save_column_options_extra_data != null)
				{
					data = Object.assign(plugin.settings.save_column_options_extra_data, data);
				}

				$.ajax({
					type: 'POST',
					url: plugin.settings.save_column_options_url,
					dataType : 'json',
					data: data,
					success : function(data){
						if(data.responseCode == 1)
						{
							location.href = addToastToURL(location.href, "Column preferences saved", 1);
						}
						else if(data.responseCode == 2)
						{
							// not logged in
							location.reload();
						}
						else
						{
							cp_toasts_add({message: "Error saving columns, please try again", type: 2});
							console.error("Error saving columns, responseCode: "+data.responseCode);
							$('#cm_column_save_btn').removeClass('loading');
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						cp_toasts_add({message: "Error saving columns, please try again", type: 2});
						console.error("Error saving columns, "+textStatus+": "+errorThrown);
						$('#cm_column_save_btn').removeClass('loading');
					}
				});
			}
		}

		function deleteBtnClick() {

			if(plugin.settings.cp_table_interface || funcExists(plugin.settings.delete_method))
			{
				if(!$(this).hasClass("loading"))
				{
					var item_id = $(this).attr('id').replace('deleteBtn', '');
					if(!plugin.settings.allow_string_ids)
					{
						item_id = parseInt(item_id);
					}

					if(item_id)
					{
						$(this).addClass("loading");
						if(plugin.settings.cp_table_interface)
						{
							interface_delete_item(item_id);
						}
						else if(funcExists(plugin.settings.delete_method))
						{
							plugin.settings.delete_method(item_id);
						}
					}
				}
			}
		}

		function expiryBtnClick() {
			if(funcExists(plugin.settings.increase_expiry_method))
			{
				if(!$(this).hasClass("loading"))
				{
					var rowID = $.trim( $(this).attr('id').replace('expiryAddTimeBtn', '') );
					if(rowID != null && rowID != "")
					{
						$(this).addClass("loading");
						plugin.settings.increase_expiry_method(rowID);
					}
				}
			}
		}

		function renameBtnClick() {
			if(funcExists(plugin.settings.rename_method))
			{
				if(!$(this).hasClass("loading"))
				{
					var rowID = $.trim( $(this).attr('id').replace('renameBtn', '') );
					if(rowID != null && rowID != "")
					{
						plugin.settings.rename_method(rowID);
					}
				}
			}
		}

		function activeToggleClick() {

			if(plugin.settings.cp_table_interface || funcExists(plugin.settings.active_toggle_method))
			{
				var item_id = $(this).attr('id').replace("foractivation", "");
				if(!plugin.settings.allow_string_ids)
				{
					item_id = parseInt(item_id);
				}

				if(item_id)
				{
					if(!$(this).hasClass("loading"))
					{
						$(this).addClass("loading");
						var live = $(this).hasClass("on");

						if(plugin.settings.cp_table_interface)
						{
							interface_set_item_live(item_id, live);
						}
						else if(funcExists(plugin.settings.active_toggle_method))
						{
							plugin.settings.active_toggle_method(item_id, live);
						}
					}
					else
					{
						plugin.settings.$table.find('input[name="activation'+item_id+'"]').changeVal(!$(this).hasClass("on"));
					}
				}
			}
		}

		function selectTableRowsMode(selectionMode) {

			var $selectableRows = plugin.settings.$tbody.find('tr.selectable');

			switch(selectionMode)
			{
				case "all":
					$selectableRows.addClass("selected");
					break;
				case "none":
					$selectableRows.removeClass("selected");
					break;
				case "invert":
					$selectableRows.toggleClass("selected");
					break;
				case "active":
					$selectableRows.find('input[name^="activation"][value="true"]').closest("tr").addClass("selected");
					$selectableRows.find('input[name^="activation"][value="false"]').closest("tr").removeClass("selected");
					break;
				case "inactive":
					$selectableRows.find('input[name^="activation"][value="true"]').closest("tr").removeClass("selected");
					$selectableRows.find('input[name^="activation"][value="false"]').closest("tr").addClass("selected");
					break;
			}

			updateRowSelections();
		}

		function updateRowSelections()
		{
			plugin.settings.totalSelections = plugin.settings.$table.find('tr.selected').length;

			plugin.settings.$select_controls.show().find('p.selectTotal span').html(plugin.settings.totalSelections);

			var selectionText = plugin.settings.totalSelections == 1 ? "1 row selected" : plugin.settings.totalSelections + " rows selected";
			plugin.settings.$mass_tools.find('.title').find('p').html("With "+plugin.settings.totalSelections+" selected:");
			// setTimeout(function(){
			// 	$('#totalSelected .selectedOption p').html(selectionText);
			// 	$('#totalSelected .select').blur();
			// }, 1);

			if(plugin.settings.totalSelections > 0)
			{
				plugin.settings.$table.addClass("selecting");
				plugin.settings.$mass_tools.stop().css("display", "block").animate({opacity: 1}, 200, "linear");
			}
			else
			{
				plugin.settings.$table.removeClass("selecting");
				plugin.settings.$mass_tools.stop().animate({opacity: 0}, 200, "linear", function(){
					$(this).css("display", "none");
				});
			}
		}

		function headerCellClick(e) {

			if(!plugin.settings.loading)
			{
				var regEx = /col(\d*)/g;
				var capture = regEx.exec($(this).parent().attr("class"));
				var colNum = capture[1];

				var columnSettings = plugin.settings.columnSettings[colNum];

				plugin.settings.sortByField = columnSettings.field;
				plugin.settings.sortByDesc  = $(this).hasClass("sortedAsc");

				$(this).addClass("loading clicked").one("mouseout", function(){ $(this).removeClass('clicked'); });

				plugin.settings.page = 0;

				loadRows();
			}
		}

		function arrowClick(e) {

			if(!plugin.settings.loading)
			{
				if(!$(this).hasClass("disabled"))
				{
					$(this).addClass("loading");
					var incDec = $(this).hasClass("left") ? -1 : 1;
					loadPage(plugin.settings.page + incDec);
				}
			}
		}

		function paginationDropdownChange(e) {

			if(!plugin.settings.loading)
			{
				var fieldTypeAndElm = fsGetFieldTypeAndElm($(this));
				fieldTypeAndElm.$elm.addClass("loading");
				loadPage($(this).val()-1);
			}
		}

		function loadPage(pageNum) {

			if(!plugin.settings.loading)
			{
				if(plugin.settings.ajaxMode)
				{
					plugin.settings.page = pageNum;
					loadRows();
				}
				else
				{
					location.href = addURLParameter(location.href, "cpt_page", pageNum);
				}

				// $(this).addClass("loading clicked").one("mouseout", function(){ $(this).removeClass('clicked'); });

			}
		}

		function updateDeepLink() {

			// update URL
			if(Modernizr.history)
			{
				var sort_settings_are_default =
					plugin.settings.sortByField === plugin.settings.sortByFieldDefault
					&& plugin.settings.sortByDesc === plugin.settings.sortByDescDefault
				;

				var linkParams = {
					  cpt_page:          plugin.settings.page === 0 ? "" : plugin.settings.page
					, cpt_sort_by_field: sort_settings_are_default ? "" : plugin.settings.sortByField
					, cpt_sort_by_desc:  sort_settings_are_default || plugin.settings.sortByField == "" ? "" : plugin.settings.sortByDesc == true ? "1" : "0"
					, cpt_search:        encodeURIComponent(plugin.settings.search_keywords)
				}

				if(plugin.settings.filterable)
				{
					for(var field in plugin.settings.active_filters)
					{
						var filter_val = plugin.settings.active_filters[field];

						if(typeof filter_val === "object")
						{
							filter_val = filter_val.join(',');
						}

						linkParams["cpt_filter_"+field] = filter_val;
					}
				}

				var new_url = location.href;

				// remove all cpt_filter_* paramaters from the url
				var prev_length = null;
				do {
					prev_length = new_url.length;
					new_url = addURLParameter(new_url, 'cpt_filter_[\\w.]+', '');
				} while(prev_length != new_url.length);

				for(var key in linkParams)
				{
					new_url = addURLParameter(new_url, key, linkParams[key]);
				}

				history.replaceState({}, null, new_url);
			}
		}

		function loadRows(callback) {

			if(!plugin.settings.loading)
			{
				updateDeepLink();

				plugin.settings.loading = true;

				selectTableRowsMode("none");

				var postData = getPostData('load_rows', true);

				if(plugin.settings.sorting)
				{
					// postData.sortByField = "";
					// postData.sortByDesc = "";
					postData.page = 0;
					postData.perPage =  0;
				}

				$.ajax({
					type: 'POST',
					url: 'class.cp_table_view.php',
					dataType : 'json',
					data: postData,
					success : function(data){

						plugin.settings.$thead_sortable_cells.removeClass("sortedBy sortedAsc sortedDesc loading");

						plugin.settings.sortByDesc = data.tableSettings.sortByDesc;
						plugin.settings.sortByField = data.tableSettings.sortByField;

						if(typeof in_cp != 'undefined' && in_cp === true)
						{
							cp_set_cpb(data.tableSettings.cpb);
						}

						if(plugin.settings.sortByField != "")
						{
							var colNum = getColNumFromFieldName(plugin.settings.sortByField);

							if(colNum !== false)
							{
								var ascDescClass = plugin.settings.sortByDesc ? "sortedDesc" : "sortedAsc";
								plugin.settings.$thead.find('th.col'+colNum).find('.cpTableCellDiv').addClass("sortedBy "+ascDescClass);
							}
						}

						plugin.settings.page = data.tableSettings.page;
						// plugin.settings.perPage = data.tableSettings.perPage;
						plugin.settings.pageFrom = data.tableSettings.pageFrom;
						plugin.settings.pageTo = data.tableSettings.pageTo;
						plugin.settings.totalRows = data.tableSettings.totalRows;

						if(plugin.settings.refreshEnabled)
						{
							plugin.settings.$refreshBtn.removeClass("loading");
						}

						if(plugin.settings.searchable)
						{
							plugin.settings.$searchBtn.removeClass("loading");
						}

						if(plugin.settings.filterable)
						{
							plugin.settings.$cpTableFilterBtn.removeClass("loading");
						}

						updatePagination();

						plugin.replaceRows(data.rows, true);

						plugin.highlight_rows(plugin.row_ids_to_highlight_on_reload);
						plugin.row_ids_to_highlight_on_reload = null;

						plugin.settings.loading = false;

						callFuncIfExists(callback);

						callFuncIfExists(plugin.settings.load_rows_callback);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						plugin.settings.loading = false;
						console.error("loadRows() error\n\n"+textStatus+": "+errorThrown);
						if(CPO_DEBUG)
						{
							console.error("XMLHttpRequest responseText:", XMLHttpRequest.responseText);
						}
						callFuncIfExists(callback);
					}
				});

			}

		}

		function updatePagination() {
			if(plugin.settings.perPage > 0)
			{
				plugin.settings.zeroPaddingLength

				var pageFromOutput = plugin.settings.totalRows > 0 ? plugin.settings.pageFrom + 1 : 0;
				plugin.settings.pagination.top.$from.html(pad(pageFromOutput, plugin.settings.zeroPaddingLength));
				plugin.settings.pagination.bottom.$from.html(pad(pageFromOutput, plugin.settings.zeroPaddingLength));

				plugin.settings.pagination.top.$to.html(pad(plugin.settings.pageTo, plugin.settings.zeroPaddingLength));
				plugin.settings.pagination.bottom.$to.html(pad(plugin.settings.pageTo, plugin.settings.zeroPaddingLength));

				plugin.settings.pagination.top.$total.html(pad(plugin.settings.totalRows, plugin.settings.zeroPaddingLength));
				plugin.settings.pagination.bottom.$total.html(pad(plugin.settings.totalRows, plugin.settings.zeroPaddingLength));

				plugin.settings.pagination.top.$arrowLeft.removeClass('loading').toggleClass("disabled", (plugin.settings.pageFrom == 0));
				plugin.settings.pagination.bottom.$arrowLeft.removeClass('loading').toggleClass("disabled", (plugin.settings.pageFrom == 0));

				plugin.settings.pagination.top.$arrowRight.removeClass('loading').toggleClass("disabled", (plugin.settings.pageTo >= plugin.settings.totalRows));
				plugin.settings.pagination.bottom.$arrowRight.removeClass('loading').toggleClass("disabled", (plugin.settings.pageTo >= plugin.settings.totalRows));


				if(plugin.settings.pagination.top.$dropdown.length > 0)
				{
					var fieldTypeAndElmTop = fsGetFieldTypeAndElm(plugin.settings.pagination.top.$dropdown);
					fieldTypeAndElmTop.$elm.removeClass("loading");
					var fieldTypeAndElmBottom = fsGetFieldTypeAndElm(plugin.settings.pagination.bottom.$dropdown);
					fieldTypeAndElmBottom.$elm.removeClass("loading");
					var paginationDropdownDisabled = (plugin.settings.totalRows <= plugin.settings.perPage);

					if(!paginationDropdownDisabled)
					{
						var numPages = Math.ceil(plugin.settings.totalRows / plugin.settings.perPage);

						var maxPagesAllowed = 20; // must be even number
						var startPage = 1;
						var lastPage = numPages;

						if(maxPagesAllowed < numPages)
						{
							startPage =
								Math.max(
									  1 // must be at least 1
									, Math.max(
										  (plugin.settings.page) - (maxPagesAllowed / 2)
										, ((plugin.settings.page+1) + (maxPagesAllowed / 2)) - numPages
									)
								)
							;

							lastPage = Math.min(numPages, (startPage) + maxPagesAllowed);
						}

						var zeroPaddingLength = lastPage.toString().length;
						var dropdownOptionsHTML = "";

						if(numPages > 2)
						{
							if(startPage > 1)
							{
								dropdownOptionsHTML += '<div class="option" id="val1"><p>Page '+pad(1, zeroPaddingLength)+'</p><div style="clear:both;"></div></div>';

								if(startPage > 2)
								{
									dropdownOptionsHTML += '<div class="optgroup"><p>...</p><div style="clear:both;"></div></div>';
								}
							}

							var i = startPage;
							while(i < lastPage+1)
							{
								dropdownOptionsHTML += '<div class="option" id="val'+i+'"><p>Page '+pad(i, zeroPaddingLength)+'</p><div style="clear:both;"></div></div>';

								i++;
							}

							if(lastPage < numPages)
							{
								if(numPages - lastPage > 1)
								{
									dropdownOptionsHTML += '<div class="optgroup"><p>...</p><div style="clear:both;"></div></div>';
								}

								dropdownOptionsHTML += '<div class="option" id="val'+numPages+'"><p>Page '+pad(numPages, zeroPaddingLength)+'</p><div style="clear:both;"></div></div>';
							}

							fieldTypeAndElmTop.$elm.find('.selectOptionWrapper').html(dropdownOptionsHTML).find('.option').mouseover(selectOptionMouseOver).mouseenter(selectOptionMouseEnter).mouseleave(selectOptionMouseLeave).click(selectMakeSelectionClick);
							fieldTypeAndElmBottom.$elm.find('.selectOptionWrapper').html(dropdownOptionsHTML).find('.option').mouseover(selectOptionMouseOver).mouseenter(selectOptionMouseEnter).mouseleave(selectOptionMouseLeave).click(selectMakeSelectionClick);
						}

					}

					var pageNum = plugin.settings.totalRows == 0 ? 0 : Math.floor(plugin.settings.pageFrom / plugin.settings.perPage);
					plugin.settings.pagination.top.$dropdown.val(pageNum+1).attr('disabled', paginationDropdownDisabled);
					plugin.settings.pagination.bottom.$dropdown.val(pageNum+1).attr('disabled', paginationDropdownDisabled);

				}
			}
		}

		function getColNumFromFieldName(fieldName) {

			var columnSettings = plugin.settings.columnSettings;
			for(var i in columnSettings)
			{
				if(columnSettings.hasOwnProperty(i) && columnSettings[i].field == fieldName)
				{
					return(i);
				}
			}

			return(false);
		}

		function getRowFromRowID(rowID) {

			var $tr = plugin.settings.$tbody.find('tr.row'+rowID);

			if($tr.length > 0)
			{
				return($tr);
			}

			return(false);
		}

		function getTDFromRowIDAndFieldName(rowID, fieldName) {

			var colNum = getColNumFromFieldName(fieldName);
			var $td = plugin.settings.$tbody.find('tr.row'+rowID).find('td.col'+colNum);

			if($td.length > 0)
			{
				return($td);
			}

			return(false);

		}

		function initRows(firstTime) {

			firstTime = firstTime == null ? false : firstTime;

			plugin.settings.$tbody.find('.cpTableCellDiv > .deleteBtn').not('.initiated').click(deleteBtnClick).addClass('initiated');
			plugin.settings.$tbody.find('.cpTableCellDiv > .expiryAddTimeBtn').not('.initiated').click(expiryBtnClick).addClass('initiated');
			plugin.settings.$tbody.find('.cpTableCellDiv > .renameBtn').not('.initiated').click(renameBtnClick).addClass('initiated');
			plugin.settings.$tbody.find('.cpTableCellDiv > .onOffToggle').not('.initiated').click(activeToggleClick).addClass('initiated');
			plugin.settings.$tbody.find('tr.selectable').find('.iconCell').not('.initiated').click(iconCellClick).addClass('initiated');

			for(var i in plugin.settings.customMethods)
			{
				if(plugin.settings.customMethods.hasOwnProperty(i))
				{
					var selector = plugin.settings.customMethods[i].selector;
					var method = plugin.settings.customMethods[i].method;

					// find object
					var fn = window[method];

					// is object a function?
					if (typeof fn === "function")
					{
						plugin.settings.$tbody.find(selector).not('.initiated').click(function(e){colBtnClick(e, $(this), fn);}).addClass('initiated');
					}
				}

			}

			if(plugin.settings.scrollableMode)
			{
				plugin.settings.$tbody.find('tr').first().find('.cpTableCellDiv').each(function(i){
					var $this = $(this);
					$this.data("cp_table_view_col_num", i);
				});
			}
			else
			{
				// var numCols = plugin.settings.$thead.find('th').length;
				// var cache = [];
				// var totalWidth = 0;

				// for(var i = 0; i < numCols; i++)
				// {
				// 	var colIndex = i+1;
				// 	// var $columnCells = plugin.settings.$thead.find('th:nth-child('+colIndex+'n)').find('.cpTableCellDiv');
				// 	// $columnCells.add(plugin.settings.$tbody.find('td:nth-child('+colIndex+'n)').find('.cpTableCellDiv'));
				// 	var $columnCells = plugin.settings.$thead.find('th:nth-child('+colIndex+')').width("");
				// 	$columnCells.add(plugin.settings.$tbody.find('td:nth-child('+colIndex+')').width(""));

				// 	var newWidth = 0;

				// 	$columnCells.stop()

				// 	// console.log("$columnCells: ", $columnCells);

				// 	$columnCells.each(function()
				// 	{
				// 		var cellWidth = $(this).width();
				// 		if(cellWidth > newWidth)
				// 		{
				// 			newWidth = cellWidth;
				// 		}

				// 	});

				// 	totalWidth += newWidth;
				// 	cache.push({$columnCells: $columnCells, newWidth: newWidth});

				// }

				// for(var i = 0; i < numCols; i++)
				// {
				// 	var $columnCells = cache[i].$columnCells;
				// 	var newWidth = cache[i].newWidth;
				// 	newWidth = newWidth / totalWidth * 100;
				// 	newWidth += "%";

				// 	if(!firstTime)
				// 	{
				// 		var oldWidth = plugin.settings.colWidths[i];
				// 		$columnCells.width(oldWidth).animate({width: newWidth}, 150, function(){ $(this).width("").css('overflow', ""); });
				// 	}

				// 	plugin.settings.colWidths[i] = newWidth;
				// }
			}

			if(plugin.settings.qtip_enabled)
			{
				init_qtip();
			}
		}

		function callFuncIfExists(func)
		{
			if(funcExists(func))
			{
				func();
			}
		}

		function funcExists(func)
		{
			return(typeof(func) !== undefined && typeof(func) == 'function');
		}

		function colBtnClick(e, $this, callbackFunc)
		{
			var rowID = $this.closest("tr").data('row-id');
			callbackFunc(e, $this, rowID, plugin);
		}

		function reorderModeOnCallback() {

			plugin.settings.$table.addClass("sorting");

			plugin.settings.$tbody.find('td.dragHandleCell, td.dragHandleCell .cpTableCellDiv').animate({width: 16}, {duration: 200, easing: 'linear'});

			$('#reorderBtnTop,#reorderBtnBtm').css('display', 'none').removeClass('loading');
			$('#reorderSaveBtnTop,#reorderSaveBtnBtm,#reorderCancelBtnTop,#reorderCancelBtnBtm').css('display', 'inline-block');

			var items = plugin.settings.sectionMode ? "> tr:not(:first-child,.staticRow)" : "> tr:not(.staticRow)";

			plugin.settings.$tbody.sortable({
				axis: "y",
				revert: 200,
				items: items,
				cursor: "-webkit-grabbing",
				handle: "td.dragHandleCell",
				placeholder: {
					element: function(clone, ui) {
						if(plugin.settings.totalSelections == 0) { plugin.settings.totalSelections = 1; }
						var text = plugin.settings.totalSelections == 1 ? plugin.settings.totalSelections + " Row" : plugin.settings.totalSelections + " Rows";
						var html = '<div class="dragHelperRow"><p>'+text+'</p></div>';
						var i = 0;
						for(i = 0; i < (plugin.settings.totalSelections - 1) && i < 4; i++)
						{
							html += '<div class="dragHelperRow under num'+i+'"></div>';
						}
						// setTimeout(function(){debugger;},1000);

						return $('<tr class="ui-sortable-placeholder"><td class="placeholderBorder" colspan="99999"><div class="cpTableCellDiv"><div class="dragHelperWrapper">'+html+'</div></div></td></tr>');
					},
					update: function() {
						return;
					}
				},
				helper: function(e, item)
				{
					plugin.settings.totalSelections = plugin.settings.$table.find('tr.selected').length;
					/*
					//Basically, if you grab an unhighlighted item to drag, it will deselect (unhighlight) everything else
					if (!item.hasClass('selected')) {
						item.addClass('selected').siblings().removeClass('selected');
					}

					//////////////////////////////////////////////////////////////////////
					//HERE'S HOW TO PASS THE SELECTED ITEMS TO THE 'stop()' FUNCTION:

					//Clone the selected items into an array
					var $elements = item.parent().children('.selected').clone(true,true);

					var $originals = item.parent().children('.selected').children();
					$elements.children().each(function(index)
					{
						// Set helper cell sizes to match the original sizes
						$(this).width($originals.eq(index).width());
					});

					//Add a property to 'item' called 'multidrag' that contains the
					//  selected items, then remove the selected items from the source list
					item.data('multidrag', $elements).siblings('.selected').remove();

					//Now the selected items exist in memory, attached to the 'item',
					//  so we can access them later when we get to the 'stop()' callback

					//Create the helper
					var $helper = $('<tr><td class="dragHelper" colspan="99999"><table class="cpTableView"><tbody></tbody></table></td></tr>');
					$helper.find('tbody').append($elements.clone());
					$helper.find('table').animate({opacity:0.5}, 300, "linear");
					// setTimeout(function(){debugger;},1000);
					*/

					//Basically, if you grab an unhighlighted item to drag, it will deselect (unhighlight) everything else
					if (!item.hasClass('selected')) {
						item.addClass('selected').siblings().removeClass('selected');
					}

					var $elements = item.parent().children('.selected').clone(true,true);
					item.data('multidrag', $elements).siblings('.selected').remove();

					updateRowSelections();

					// var $helper = $('<tr><td class="dragHelper" colspan="99999"><div class="dragHelperWrapper"><div class="dragHelperRow"><p>3 rows</p></div></div></td></tr>');
					return $('<tr/>');
				},
				start: function (e, ui) {
					plugin.settings.$table.addClass('dragging');
					plugin.hideRowWithAnimation(plugin.settings.$table.find('.noRows'));
					reorderModeRemoveTooltip();
				},
				stop: function (e, ui) {
					plugin.settings.$table.removeClass('dragging');
					plugin.settings.reordered = true;
					//Now we access those items that we stored in 'item's data!
					var elements = ui.item.data('multidrag');

					//'elements' now contains the originally selected items from the source list (the dragged items)!!

					//Finally I insert the selected items after the 'item', then remove the 'item', since
					//  item is a duplicate of one of the selected items.
					ui.item.after(elements).remove();

					if(!plugin.settings.multiSelect)
					{
						plugin.settings.$table.find('tr').removeClass("selected");
					}

					plugin.updateNoRowsText();
					plugin.showRowWithAnimation(plugin.settings.$table.find('.noRows'));
				}
			});

			reorderModeAddTooltip();
		}

		function reorderModeOffCallback(animate) {
			animate = animate !== false;
			if(animate)
			{
				plugin.settings.$tbody.find('td.dragHandleCell, td.dragHandleCell .cpTableCellDiv').width(16).animate({width: 0}, {duration: 200, easing: 'linear'});
			}
			plugin.settings.$table.removeClass("sorting");

			reorderModeRemoveTooltip();

			$('#reorderBtnTop,#reorderBtnBtm').css('display', 'inline-block');
			$('#reorderSaveBtnTop,#reorderSaveBtnBtm,#reorderCancelBtnTop,#reorderCancelBtnBtm').css('display', 'none').removeClass("loading");
		}

		function reorderModeAddTooltip() {
			if(typeof $.qtip != "undefined" && !plugin.settings.startSortable)
			{
				plugin.settings.$table.qtip({
					  content: "Drag to reorder"
				    , position: {
				          my: 'bottom left'
				        , at: 'top left'
				        , adjust: {x: 7, y: 93}
				    }
				    , show: {
				          event: false
				        , ready: true
				        , effect: function(offset) {
				            $(this).fadeIn(200);
				        }
				    }
				    , hide: {
				          // event: 'mouseleave'
				          event: false
				    }
				    , style: {
				          classes: 'cpReorderTooltip'
				    }
				});
			}
		}

		function reorderModeRemoveTooltip() {
			if(typeof $.qtip != "undefined" && !plugin.settings.startSortable)
			{
				var table_qtip = plugin.settings.$table.qtip('api');
				if(typeof table_qtip != "undefined")
				{
					table_qtip.destroy();
				}
			}
		}

		function init_qtip() {
			if(typeof $.qtip != "undefined")
			{
				plugin.settings.$tbody.find('td[title!=""]').qtip(plugin.settings.qtip_settings);
			}
		}

		//////////////////
		//public methods//
		//////////////////

		plugin.toggleReorderMode = function(onOff, refreshRows, firstTime) {

			if(!plugin.settings.loading)
			{
				plugin.settings.sorting = onOff == null ? !plugin.settings.sorting : onOff == true;
				refreshRows = refreshRows == null ? true : refreshRows;

				if(plugin.settings.sorting)
				{
					plugin.settings.sortByField = plugin.settings.sortByFieldDefault;
					plugin.settings.sortByDesc = plugin.settings.sortByDescDefault;
					clearSearchText();
					plugin.settings.search_keywords = "";

					if(refreshRows)
					{
						$('#reorderBtnTop,#reorderBtnBtm').addClass('loading');
						loadRows(reorderModeOnCallback);
					}
					else
					{
						reorderModeOnCallback(true);
					}
				}
				else
				{
					if(refreshRows)
					{
						plugin.settings.sortByField = plugin.settings.sortByFieldDefault;
						plugin.settings.sortByDesc = plugin.settings.sortByDescDefault;

						$('#reorderSaveBtnTop,#reorderSaveBtnBtm,#reorderCancelBtnTop,#reorderCancelBtnBtm').addClass("loading");
						loadRows(reorderModeOffCallback);
					}
					else
					{
						reorderModeOffCallback(!firstTime);
					}
				}
			}
		}

		plugin.massMakeInactiveComplete = function() {

			plugin.settings.$mass_tools.find('.btn.makeInactive').removeClass("loading");
		}

		plugin.massMakeActiveComplete = function() {

			plugin.settings.$mass_tools.find('.btn.makeActive').removeClass("loading");
		}

		plugin.massDeleteComplete = function() {

			plugin.settings.$mass_tools.find('.btn.deleteBtn').removeClass("loading");
		}

		plugin.massMoveComplete = function() {

			plugin.settings.$mass_tools.find('.btn.moveBtn').removeClass("loading");
		}

		plugin.massMoveStart = function() {

			plugin.settings.$mass_tools.find('.btn.moveBtn').addClass("loading");
		}

		plugin.customMassBtnClick = function($btn, callbackFunc) {
			if(funcExists(window[callbackFunc]))
			{
				$btn.addClass("loading");
				var row_id_array = [];
				var regExp = /row([-\d]+)/;
				plugin.settings.$table.find('tr.selected').each(function(){

					var rowID = regExp.exec($(this).attr('class'));
					row_id_array.push(rowID[1]);
				});

				window[callbackFunc](row_id_array, plugin);
			}
		}

		plugin.customMassBtnStopLoading = function() {
			plugin.settings.$mass_tools.find('li').find('.btn').removeClass('loading');
		}

		plugin.replaceRows = function(rowArrayOrHTML, internal) {

			if((typeof rowArrayOrHTML === 'string' && rowArrayOrHTML != "") || rowArrayOrHTML.length > 0)
			{
				var rowHTML = "";

				if(typeof rowArrayOrHTML === 'string')
				{
					rowHTML = rowArrayOrHTML;
				}
				else
				{
					rowHTML = rowArrayOrHTML.join("");
				}

				plugin.settings.$tbody.html(rowHTML);

				if(funcExists(initFormStyles))
				{
					initFormStyles({$wrapper: plugin.settings.$tbody});
				}

				initRows();
			}
			else
			{
				plugin.settings.$tbody.html('');
				if(internal === true)
				{
					plugin.settings.noRowsText = "No data found that matches your criteria";
				}
			}

			plugin.updateNoRowsText();

		}

		plugin.addRow = function($tr, skipNoRows, $insertNoRowsAfter) {

			if($insertNoRowsAfter == null)
			{
				plugin.settings.$tbody.append($tr);
			}
			else
			{
				$insertNoRowsAfter.after($tr);
			}

			if(skipNoRows !== true)
			{
				plugin.updateNoRowsText();
			}

			initRows();
		}

		plugin.removeRow = function($tr, skipNoRows) {

			$tr.remove();

			if(skipNoRows !== true)
			{
				plugin.updateNoRowsText();
			}
		}

		plugin.addRowWithAnimation = function($tr, skipNoRows, $insertNoRowsAfter) {

			plugin.addRow($tr, skipNoRows, $insertNoRowsAfter);

			$tr.find('.cpTableCellDiv').each(function(){
				var toHeight = $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
				var paddingTop = parseInt($(this).css("padding-top"));
				var paddingBtm = parseInt($(this).css("padding-bottom"));
				$(this).animate({height: 0, paddingTop: 0, paddingBottom: 0}, 0, "linear").animate({height: toHeight, paddingTop: paddingTop, paddingBottom: paddingBtm}, 300, "easeOutExpo",function(){
					$(this).css({height: "", paddingTop: "", paddingBottom: ""});
				});
			});
		}

		plugin.highlight_rows = function(row_ids) {

			if(typeof row_ids == "number")
			{
				row_ids = [row_ids];
			}
			else if(typeof row_ids != "object")
			{
				return false;
			}

			for(var i in row_ids){
				var $tr = getRowFromRowID(row_ids[i]);
				if($tr != false)
				{
					$tr.addClass("cp_table_row_highlight");
				}
			}

			setTimeout(function(){
				plugin.settings.$tbody.find('tr.cp_table_row_highlight').removeClass("cp_table_row_highlight");
			}, 750);
		}

		plugin.removeRowWithAnimation = function(tr_element_or_row_id, skipNoRows) {

			var $tr = tr_element_or_row_id;

			if(typeof tr_element_or_row_id == "number")
			{
				$tr = getRowFromRowID(tr_element_or_row_id);
			}

			$tr.addClass('removing');

			if(skipNoRows !== true)
			{
				plugin.updateNoRowsText();
			}

			if($tr.hasClass('selected'))
			{
				$tr.removeClass('selected')
				updateRowSelections();
			}

			if($tr.hasClass('hiding'))
			{
				plugin.removeRow($tr, true);
			}
			else
			{
				//smooths the overall look of the animation
				$tr.find('td').css('border', 0);

				$tr.find('.cpTableCellDiv').each(function(){
					$(this).animate({height: 0, paddingTop: 0, paddingBottom: 0}, 200, "easeOutExpo", function(){
						if($.contains(document, $tr[0]))
						{
							plugin.removeRow($tr, true);
						}
					});
				});
			}
		}

		plugin.updateNoRowsText = function() {

			if(plugin.settings.sectionMode)
			{
				var $sectionTitleTrs = plugin.settings.$tbody.find('tr.cpTableSectionTitle');
				var $trs = plugin.settings.$tbody.find('tr');

				var titleIndexes = [];
				$sectionTitleTrs.each(function(){ titleIndexes.push($(this).index()); });

				var trGroups = [];

				if(titleIndexes.length > 0)
				{//has section titles
					for(var i = 0; i < titleIndexes.length; i++)
					{
						var from = i == 0 ? 0 : titleIndexes[i];
						var to = i+1 == titleIndexes.length ? null : titleIndexes[i+1];
						var $sliced = to != null ? $trs.slice(from,to) : $trs.slice(from);

						var totalRows = $sliced.not('.noRows,.cpTableSectionTitle,.removing').length;
						var $insertNoRowsAfter = $sectionTitleTrs.eq(i);
						var $noRowsTr = $sliced.find('div.noRows').parent().parent();

						trGroups.push({totalRows: totalRows, $insertNoRowsAfter: $insertNoRowsAfter, $noRowsTr: $noRowsTr});
					}
				}
				else
				{//no sections
					var totalRows = $trs.not('.noRows,.cpTableSectionTitle,.removing').length;
					var $noRowsTr = $trs.find('tr.noRows');

					trGroups.push({totalRows: totalRows, $noRowsTr: $noRowsTr});
				}

				for(var i in trGroups)
				{
					if(trGroups.hasOwnProperty(i))
					{
						var group = trGroups[i];

						if(group.totalRows == 0 && group.$noRowsTr.length == 0)
						{
							console.log("group "+i+" adding tr.noRows after ", group.$insertNoRowsAfter);
							var $noRows = $('<tr class="noRows"><td colspan="9999"><div class="cpTableCellDiv noRows"><p>'+plugin.settings.noRowsText+'</p></div></td></tr>');
							plugin.addRowWithAnimation($noRows, true, group.$insertNoRowsAfter);
						}
						else if(group.totalRows > 0 && group.$noRowsTr.length > 0)
						{
							plugin.removeRowWithAnimation(group.$noRowsTr, true);
						}
					}
				}
			}
			else
			{
				var $trs = plugin.settings.$tbody.find('tr:not(.noRows,.cpTableSectionTitle,.removing)');

				/* This used to be done this way but I really don't know why, it would cause the $no_rows_tr to never appear :|
				var $no_rows_tr = plugin.settings.$tbody.find('tr.noRows');

				if($trs.length == 0 && $no_rows_tr.length == 0)
				{
					var $noRows = $('<tr class="noRows"><td colspan="9999"><div class="cpTableCellDiv noRows"><p>'+plugin.settings.noRowsText+'</p></div></td></tr>');
					plugin.addRowWithAnimation($noRows, true);
				}
				else if($no_rows_tr.length > 0)
				{
					if(!plugin.settings.sectionMode)
					{
						plugin.removeRowWithAnimation($no_rows_tr, true);
					}
				}
				*/

				plugin.settings.$tbody.find('tr.noRows').remove();

				if($trs.length == 0)
				{
					var $noRows = $('<tr class="noRows"><td colspan="9999"><div class="cpTableCellDiv noRows"><p>'+plugin.settings.noRowsText+'</p></div></td></tr>');
					plugin.addRowWithAnimation($noRows, true);
				}
			}
		}

		plugin.hideRowWithAnimation = function($tr, animTime) {

			var animTime = animTime == null ? 200 : animTime;

			$tr.addClass('hiding');

			//smooths the overall look of the animation
			$tr.find('td').css('border', 0);

			$tr.find('.cpTableCellDiv').each(function(){
				$(this).animate({height: 0, paddingTop: 0, paddingBottom: 0}, animTime, "easeOutExpo");
			});
		}

		plugin.showRowWithAnimation = function($tr, animTime) {

			var animTime = animTime == null ? 300 : animTime;

			$tr.removeClass('hiding').find('td').css('border', "");

			$tr.find('.cpTableCellDiv').each(function(){

				$(this).css({height: "", paddingTop: "", paddingBottom: ""});

				var paddingTop = parseInt($(this).css("padding-top"));
				var paddingBtm = parseInt($(this).css("padding-bottom"));
				var toHeight = $(this).height() + paddingTop + paddingBtm;
				$(this).stop().animate({height: 0, paddingTop: 0, paddingBottom: 0}, 0, "linear").animate({height: toHeight, paddingTop: paddingTop, paddingBottom: paddingBtm}, animTime, "easeOutExpo",function(){
					$(this).css({height: "", paddingTop: "", paddingBottom: ""});
				});
			});
		}

		plugin.reloadRows = function(row_ids_to_highlight_on_reload) {
			if(row_ids_to_highlight_on_reload != null && typeof row_ids_to_highlight_on_reload == "object")
			{
				plugin.row_ids_to_highlight_on_reload = row_ids_to_highlight_on_reload;
			}
			refreshBtnClick();
		}

		plugin.getFieldText = function(rowID, fieldName) {

			var $td = getTDFromRowIDAndFieldName(rowID, fieldName);

			return($td.find('p').html());
		}

		plugin.setFieldText = function(rowID, fieldName, newName) {

			var $td = getTDFromRowIDAndFieldName(rowID, fieldName);

			var $p = $td.find('p').html(newName);

			return($p);
		}

		plugin.hideColumnWithAnimation = function(colNum, animTime) {

			var animTime = animTime == null ? 200 : animTime;
			var cssHideProperties = {width: 0, paddingLeft: 0, paddingRight: 0, overflow: "hidden"};

			var $cells = plugin.settings.$table.find('th.col'+colNum+',td.col'+colNum);

			$cells.addClass('hiding');

			$cells.find('.cpTableCellDiv').each(function(){
				$(this).animate(cssHideProperties, animTime, "easeOutExpo");
			});

			var $blankRow = $(plugin.settings.blankRowHTML);
			var $blankCells = $blankRow.find('td.col'+colNum).addClass('hiding').find('.cpTableCellDiv').css(cssHideProperties);
			plugin.settings.blankRowHTML = $blankRow[0].outerHTML;
		}

		plugin.showColumnWithAnimation = function(colNum, animTime) {

			var animTime = animTime == null ? 300 : animTime;
			var cssResetProperties = {width: "", paddingLeft: "", paddingRight: "", overflow: ""};

			var $cells = plugin.settings.$table.find('th.col'+colNum+',td.col'+colNum);

			$cells.removeClass('hiding');

			$cells.find('.cpTableCellDiv').each(function(){

				$(this).css({width: "", paddingLeft: "", paddingRight: ""});

				var paddingLeft = parseInt($(this).css("padding-left"));
				var paddingRight = parseInt($(this).css("padding-right"));
				var toWidth = $(this).width() + paddingLeft + paddingRight;
				$(this).stop().animate({width: 0, paddingLeft: 0, paddingRight: 0}, 0, "linear").animate({width: toWidth, paddingLeft: paddingLeft, paddingRight: paddingRight}, animTime, "easeOutExpo", function(){
					$(this).css(cssResetProperties);
				});
			});

			var $blankRow = $(plugin.settings.blankRowHTML);
			var $blankCells = $blankRow.find('td.col'+colNum).removeClass('hiding').find('.cpTableCellDiv').css(cssResetProperties);
			plugin.settings.blankRowHTML = $blankRow[0].outerHTML;
		}

		plugin.enable_qtip = function() {
			plugin.settings.qtip_enabled = true;
			init_qtip();
		}

		// fire up the plugin!
		// call the "constructor" method
		plugin.init();
	};

	// add the plugin to the jQuery.fn object
	$.fn.cp_table = function(options, argument) {

		if(typeof options == "undefined")
		{
			var plugin = $(this).data('cp_table');
			if (undefined != plugin)
			{
				return(plugin);
			}
		}

		// iterate through the DOM elements we are attaching the plugin to
		return this.each(function() {

			var plugin = $(this).data('cp_table');

			// if plugin has not already been attached to the element
			if (undefined == plugin) {

				// create a new instance of the plugin
				// pass the DOM element and the user-provided options as arguments
				var plugin = new $.cp_table(this, options);

				// in the jQuery version of the element
				// store a reference to the plugin object
				// you can later access the plugin and its methods and properties like
				// element.data('cp_table').publicMethod(arg1, arg2, ... argn) or
				// element.data('cp_table').settings.propertyName
				$(this).data('cp_table', plugin);

			}
			else
			{
				switch(options)
				{
					case "settings":
						plugin.settings = $.extend(plugin.settings, argument);
						break;
				}
			}

		});

	}


	////////////////////
	//external methods//
	////////////////////

	// $.cp_table.animateAddedRowIn = function($tr) {

	// 	$tr.find('.cpTableCellDiv').each(function(){
	// 		var toHeight = $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
	// 		var paddingTop = parseInt($(this).css("padding-top"));
	// 		var paddingBtm = parseInt($(this).css("padding-bottom"));
	// 		$(this).animate({height: 0, paddingTop: 0, paddingBottom: 0}, 0, "linear").animate({height: toHeight, paddingTop: paddingTop, paddingBottom: paddingBtm}, 300, "easeOutExpo",function(){
	// 			$(this).css({height: "", paddingTop: "", paddingBottom: ""});
	// 		});
	// 	});
	// }

}( jQuery ));