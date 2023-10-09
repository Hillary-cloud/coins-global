
var joblistMoverHeight = 0;
var joblistScrollStep = 0;
var joblistProcessNum = 0;
var nextJoblistReturnID = -1;
var nextJoblistRCFID = 1;
var currentJoblistRCFID = 1;
var nextJoblistResultArray = null;
var joblistNoResultsHTML = null;
var joblistMarginTop = 0;
var joblistNavigationOn = true;
var joblistLoadingHeight = 0;
var jobBasketTokenExists = false;
var joblistInnerAuto = false;

var initJoblistScroller = function(rcf_id, rcf_id_list, rcl_navbuts) {

	joblistInnerAuto = ($('#joblistInner').css('height') == 'auto' || $('#joblistInner').css('height') == '0px');

	if(rcf_id_list == "" && rcf_id != "")
	{
		rcf_id_list = rcf_id;
	}

	jobBasketTokenExists = (tem_joblist_item.indexOf("$$STOK|jobBasketBtn|ETOK$$") !== -1);

	if(typeof initFormStyles == "function")
	{
		initFormStyles();
	}

	joblistNavigationOn = (rcl_navbuts == "on");
	joblistScrollStep = $('#joblistInner').height();
	joblistMoverHeight = $('#joblistMover').height();
	joblistLoadingHeight = $('#joblistLoading').height();

	if(joblistNavigationOn)
	{
		$('.joblistArrow.down').click(function(){ joblistScroll(1); });
		$('.joblistArrow.up').click(function(){ joblistScroll(-1); });
	}

	$('input[name="joblist_rcf_id"]').change(joblistSectorChange);

	//$('#joblistLoading').stop().css('display', 'none').animate({opacity: 0, height: 0}, 0, 'linear');

	loadJoblist(rcf_id, rcf_id_list, true);

}

var joblistSectorChange = function() {
	var val = $(this).val().split('$');
	loadJoblist(val[0], val[1]);
}

var loadJoblist = function(rcf_id, rcf_id_list, first) {

	if(first == null) { first = false; }

	setJoblistViewAllBtn(rcf_id);

	joblistProcessNum = 0;

	nextJoblistRCFID = rcf_id_list;

	if(first)
	{
		joblistLoadAndAnimComplete(true);
	}
	else
	{
		nextJoblistReturnID++;

		if(nextJoblistRCFID != currentJoblistRCFID)
		{
			loadJoblistAnimIn();

			$.ajax({
				type: 'POST',
				url: 'rc_ajaxjoblist.php',
				dataType: "json",
				data: {
					rcf_id_list: rcf_id_list,
					sya_id: $('#sya_id').val(),
					syr_id: $('#syr_id').val(),
					syu_id: $('#syu_id').val(),
					locationLat: $('#rcl_loc_lat').val(),
					locationLong: $('#rcl_loc_long').val(),
					region_cpda_id: region_cpda_id,
					distance: $('#rcl_distance').val(),
					search_term: $('#rcl_search_term').val(),
					job_limit: $('#job_limit').val(),
					rcl_random: $('#rcl_random').val(),
					sort: $('#rcl_sort_default').val(),
					promo_rcv_id_list: $('#promo_rcv_id_list').val(),
					exclude_rcv_id_array: $('#exclude_rcv_id_array').val(),
					rcv_id_array: $('#rcv_id_array').val(),
					cpi_id: CPI_ID,
					returnID: nextJoblistReturnID
		        },
				success: loadJoblistComplete,
		        error:function (xhr, ajaxOptions, thrownError){
					//
		        }

			});
		}
		else
		{
			loadJoblistAnimOut();
		}
	}

}

var setJoblistViewAllBtn = function(rcf_id) {

	if(rcf_id != "")
	{
		$('.joblistButton.viewAll a').attr('href', 'home/job-search-results/28/?rcf_id='+rcf_id);
	}
}

var loadJoblistComplete = function(data) {

	if(data.returnID == nextJoblistReturnID)
	{
		nextJoblistResultArray = data.resultArray;

		joblistNoResultsHTML = data.noResultsHTML;

		joblistProcessNum++;

		if(joblistProcessNum > 1)
		{
			joblistLoadAndAnimComplete();
		}
	}


}

var loadJoblistAnimIn = function() {
	if (joblistInnerAuto){
		$('#joblistInner').height("auto");
		loadJoblistAnimInComplete();
	}
	else {
		$('#joblistInner').stop().animate({height: 0}, 500, 'easeInOutExpo', loadJoblistAnimInComplete);
	}

	$('#joblistLoading').stop().css('display', 'block').animate({opacity: 1, height: joblistLoadingHeight}, 500, 'linear');
}

var loadJoblistAnimInComplete = function() {

	joblistProcessNum++;

	if(joblistProcessNum > 1)
	{
		joblistLoadAndAnimComplete();
	}
}

var loadJoblistAnimOut = function() {
	if (joblistInnerAuto)
	{
		$('#joblistInner').height("auto");
	}
	else
	{
		$('#joblistInner').animate({height: joblistScrollStep}, 500, 'easeInOutExpo');
	}

	$('#joblistLoading').stop().animate({opacity: 0, height: 0}, 500, 'linear', function() { $(this).css('display', 'none'); });
}

var joblistLoadAndAnimComplete = function(first) {

	if(first == null) { first = false; }

	if(first)
	{

		var totalRows = $('.joblistRow').length;

		$('.joblistRow').each(function(i){

			var classes = "";

        	if(i == 0)
        	{
        		classes += " " + "first";
        	}
        	else if(i == totalRows.length-1)
        	{
        		classes += " " + "last";
        	}

        	classes += " " + (i % 2 == 0 ? "odd" : "even");
        	classes += " third" + ((i % 3) + 1);
        	classes += " quart" + ((i % 4) + 1);

        	$(this).addClass(classes);

		});

	}
	else
	{
		var newJoblistHTML = "";

		if(nextJoblistResultArray != "none")
		{
			for(var i in nextJoblistResultArray)
			{
				if(nextJoblistResultArray.hasOwnProperty(i))
				{
					var newJob = nextJoblistResultArray[i];
					// newJob.url = 'Home/Job_Details/29/?rcf_id='+newJob.rcf_id+'&rcv_id='+newJob.rcv_id;

			        newJob.location = newJob.rcv_loc_name;

			        var salary = RCO_COMP_WORDING == "Competitive" ? "Competitive salary" : RCO_COMP_WORDING;

			        if(newJob.rcv_salary_show == "on")
			        {
				        salary = newJob.rcv_currency2 + Number(newJob.rcv_salary2).formatMoney();
				        if(newJob.rcv_salary2_max != "" && newJob.rcv_salary2_max > 0)
				        {
				        	salary += ' - ' + newJob.rcv_currency2 + Number(newJob.rcv_salary2_max).formatMoney();
				        }
				    }
				    else if(newJob.rcv_salary_show == "comp_rates")
			        {
			        	salary = "Competitive rates";
			        }
				    else
			        {
			        	newJob.rcv_per = newJob.rcv_per_short = "";
			        	if(newJob.rcv_salary_show == "vol")
			        	{
			        		salary = "Voluntary";
			        	}
			        }

			        var newJobHTML = tem_joblist_item;

			        if(jobBasketTokenExists)
					{
						if(RCO_JOBBASKET)
						{
							newJobHTML = newJobHTML.replace('$$STOK|jobBasketBtn|ETOK$$', '<div class="jobBasketBtn" id="jobBasketBtn'+newJob.rcv_id+'"></div>');
						}
						else
						{
							newJobHTML = newJobHTML.split('$$STOK|jobBasketBtn|ETOK$$').join('');
						}
					}

					var jobPersonalities = "";
			        if(RCO_PERSONALITY && newJob.rcv_personalities != "")
			        {
				        newJob.rcv_personalities = newJob.rcv_personalities.split(",");
				        if(newJob.rcv_personalities.length > 0)
					    {
					      jobPersonalities = "<ul class=\"jobPersonalities\">";

					      for(j in newJob.rcv_personalities)
					      {
					      	var rcp_id = newJob.rcv_personalities[j];
					      	var rcp_name = rc_personalities[rcp_id];
					      	jobPersonalities += "<li class=\"personality"+rcp_id+"\" title=\""+rcp_name+"\"><p>"+rcp_name+"</p></li>\n";
					      }

					      jobPersonalities += "</ul>\n";
					    }
					}

					var now = Math.round((new Date()).getTime() / 1000);

					newJobHTML = temIfReplace(newJobHTML, ((now - newJob.rcv_created_date) < 18000), '$$STOK|ifJustAddedStart|ETOK$$', '$$STOK|ifJustAddedEnd|ETOK$$');
					newJobHTML = temIfReplace(newJobHTML, ((now - newJob.rcv_created_date) < 18000), '$$STOK|ifNotJustAddedStart|ETOK$$', '$$STOK|ifNotJustAddedEnd|ETOK$$');

					newJobHTML = temIfReplace(newJobHTML, ((now - newJob.rcv_lastupdated) < 18000), '$$STOK|ifJustModifiedStart|ETOK$$', '$$STOK|ifJustModifiedEnd|ETOK$$');
					newJobHTML = temIfReplace(newJobHTML, ((now - newJob.rcv_lastupdated) < 18000), '$$STOK|ifNotJustModifiedStart|ETOK$$', '$$STOK|ifNotJustModifiedEnd|ETOK$$');

					newJobHTML = temIfReplace(newJobHTML, CPO_DEBUG, '$$STOK|ifDebugStart|ETOK$$', '$$STOK|ifDebugEnd|ETOK$$');
					newJobHTML = temIfReplace(newJobHTML, !CPO_DEBUG, '$$STOK|ifNotDebugStart|ETOK$$', '$$STOK|ifNotDebugEnd|ETOK$$');
					newJobHTML = temIfReplace(newJobHTML, (newJob.rcv_pinned == "on"), "$$STOK|ifJobPinnedStart|ETOK$$", "$$STOK|ifJobPinnedEnd|ETOK$$");
					newJobHTML = temIfReplace(newJobHTML, (newJob.rcv_pinned != "on"), "$$STOK|ifJobNotPinnedStart|ETOK$$", "$$STOK|ifJobNotPinnedEnd|ETOK$$");
					newJobHTML = parameterFunctionReplace(newJobHTML, '$$STOK|jobDesc(200,)|ETOK$$', 'truncate_item_excerpt', null, [newJob.rcv_desc_notags]);

					newJobHTML = temDateTimeReplace(newJobHTML, newJob.rcv_created_date, '$$STOK|jobCreatedDate()|ETOK$$');
					newJobHTML = temDateTimeReplace(newJobHTML, newJob.rcv_lastupdated, '$$STOK|jobModifiedDate()|ETOK$$');

					var tokenArray = new Array("$$STOK|jobID|ETOK$$", "$$STOK|jobURL|ETOK$$", "$$STOK|jobTitle|ETOK$$", "$$STOK|jobLocation|ETOK$$", "$$STOK|jobSalary|ETOK$$", "$$STOK|jobSalaryPeriod|ETOK$$", "$$STOK|jobSalaryPeriodShort|ETOK$$", "$$STOK|jobDesc|ETOK$$", "$$STOK|jobPersonalities|ETOK$$", "$$STOK|jobFolderTitle|ETOK$$", "$$STOK|jobContactFirstName|ETOK$$", "$$STOK|jobContactSurname|ETOK$$", "$$STOK|jobContactPhoto|ETOK$$", "$$STOK|jobContactPhotoSmall|ETOK$$", "$$STOK|jobContactPhotoMedium|ETOK$$", "$$STOK|jobContactEmail|ETOK$$", "$$STOK|jobContactPhone|ETOK$$", "$$STOK|jobContactMobile|ETOK$$", "$$STOK|jobContactSkype|ETOK$$", "$$STOK|jobContactWebsite|ETOK$$", "$$STOK|jobContactRole|ETOK$$", "$$STOK|jobContactLinkedIn|ETOK$$", "$$STOK|jobContactFacebook|ETOK$$", "$$STOK|jobContactTwitter|ETOK$$", "$$STOK|jobContactPinterest|ETOK$$", "$$STOK|jobContactInstagram|ETOK$$", "$$STOK|jobContactBio|ETOK$$","$$STOK|jobContactID|ETOK$$");

					var replaceArray = new Array(newJob.rcv_id, newJob.url, newJob.rcv_title, newJob.location, salary, newJob.rcv_per, newJob.rcv_per_short, newJob.rcv_desc_notags, jobPersonalities, newJob.rcv_folder_title, newJob.syu_firstname, newJob.syu_surname, newJob.syu_bl_avatar, newJob.syu_bl_avatar_small, newJob.syu_bl_avatar_medium, newJob.syu_email, newJob.syu_phone, newJob.syu_mobile, newJob.syu_skype, newJob.syu_website, newJob.syu_role, newJob.syu_linkedin_url, newJob.syu_facebook_url, newJob.syu_twitter_url, newJob.syu_pinterest_url, newJob.syu_instagram_url, newJob.syu_bl_bio, newJob.syu_id);


					newJobHTML = str_replace(tokenArray, replaceArray, newJobHTML);

					var classes = " rcf_id"+newJob.rcf_id;

		        	if(i == 0)
		        	{
		        		classes += " " + "first";
		        	}
		        	else if(i == nextJoblistResultArray.length-1)
		        	{
		        		classes += " " + "last";
		        	}

		        	if(newJob.rcv_pinned == 'on')
			        {
			        	classes += " pinned";
			        }

		        	classes += " " + (i % 2 == 0 ? "odd" : "even");
		        	classes += " third" + ((i % 3) + 1);
		        	classes += " quart" + ((i % 4) + 1);

					newJoblistHTML += '<div class="joblistRow'+classes+'" id="joblistRow'+newJob.rcv_id+'">' + newJobHTML + '</div>';
				}
			}
		}
		else
		{
			newJoblistHTML = joblistNoResultsHTML;
		}

		$('#joblistMoverInner').html(newJoblistHTML);
	}

	if(RCO_JOBBASKET)
	{
		$('#joblistMoverInner').find('.jobBasketBtn').click(toggleThisInJobBasket);
	}

	joblistMoverHeight = $('#joblistMover').height();

	if(RCO_JOBBASKET)
	{
		updateJobBasketOnOffStates();
	}

	if(joblistNavigationOn)
	{
		joblistScroll();
	}
	loadJoblistAnimOut();
	currentJoblistRCFID = nextJoblistRCFID;

	if(typeof cp_jobListCompleteCallback == "function")
        {
        	cp_jobListCompleteCallback();
        }
}

var joblistScroll = function(direction) {

	var animTime = 0;
	var newMarginTop = 0;

	if(direction != null && joblistMoverHeight > joblistScrollStep)
	{
		animTime = 300;
		newMarginTop = joblistMarginTop - (joblistScrollStep * direction);

		if(newMarginTop > 0)
		{
			newMarginTop = 0;
		}
		else if (newMarginTop < -joblistMoverHeight + joblistScrollStep)
		{
			newMarginTop = -joblistMoverHeight + joblistScrollStep;
		}
	}

	$('#joblistMover').stop().animate({marginTop: newMarginTop}, animTime, 'easeOutExpo');
	joblistMarginTop = newMarginTop;

	if(joblistMoverHeight > joblistScrollStep)
	{
		if(joblistMarginTop >= 0)
		{
			$('.joblistArrow.up').removeClass('on');
		}
		else
		{
			$('.joblistArrow.up').addClass('on');
		}

		if(joblistMarginTop <= -joblistMoverHeight + joblistScrollStep)
		{
			$('.joblistArrow.down').removeClass('on');
		}
		else
		{
			$('.joblistArrow.down').addClass('on');
		}
	}
	else
	{
		$('.joblistArrow.up').removeClass('on');
		$('.joblistArrow.down').removeClass('on');
	}

}