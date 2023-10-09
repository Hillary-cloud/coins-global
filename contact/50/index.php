<!-- <base href="http://localhost/www.coins-global.com/"> -->
<?php include('../../php/header.php'); ?>
<!-- End Desktop Header HTML -->

<!-- Begin Mobile Header HTML -->


<!-- End Mobile Header HTML -->

<!-- Begin General Site Housekeeping -->

<link href="lib/qtip/jquery.qtip.min.css?m=1687510785" rel="stylesheet" type="text/css">
<script src="lib/qtip/jquery.qtip.min.js?m=1687510785" defer="" data-ot-ignore=""></script>
<link href="scripts/fineuploader/fineuploader-3.2.css?m=1687510786" rel="stylesheet" type="text/css">
<script src="scripts/fineuploader/jquery.fineuploader-3.2.min.js?m=1687510786" defer="" data-ot-ignore=""></script>


<style>
  .contColInner.video .overlay {
    background-color: #f1736a;
  }
</style>
<div class="siteMiddleContainer">
  <div class="siteMiddleInner">
    <style>
      body.page50 input {
        display: block;
        width: 100%;
        height: 46px;
        line-height: 46px;
        background-image: none;
        background-position: 0;
        margin: 0 10px 10px 0;
        border: 1px solid #d4d4d4;
        font-family: 'Lato', sans-serif;
        font-size: 15px;
      }

      body.page50 textarea {
        display: block;
        width: 96%;
        height: 100px;
        line-height: 46px;
        background-image: none;
        background-position: 0;
        margin: 0 10px 10px 0;
        border: 1px solid #d4d4d4;
        font-family: 'Lato', sans-serif;
        font-size: 15px;
      }

      .cpFormWrapper {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        min-width: 300px;
      }

      #cpFormSubmit62629 {
        display: block;
        margin: 0 auto;
      }
    </style>

    <div class="fullSizeBar">
      <div class="fullSizeBarInner">
        <h1>Contact</h1>
        <p><a href="company/global-locations/1938/index.php">Click here to find your nearest office</a></p>
        <hr>

      </div>
    </div>
    <div class="contactFormWrapper simpleContactForm styled">
      <!--MAXMIND SCRIPT START-->
      <script src="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2f%2f%2fgeoip-js.com%2fjs%2fapis%2fgeoip2%2fv2.1%2fgeoip2.js&c=E,1,ZcO1xw2GpgNDfqF9iOc-LfHIhNqooyUBM_XUXyRFmAMQGhxz5F_08pEJq_M-SIVPRU1frOnSA054wfbAes4ytGU0rMX-VX8JGBog88_1-hg,&typo=1" type="text/javascript"></script>

      <script>
        var country = "";
        var onSuccess = function(geoipResponse) {
          country = geoipResponse.country.names.en;
          var input = document.getElementById('maxmindcountry');
          if (input != undefined)
            input.value = country;
        };
        var onError = function(error) {
          country = "error";
          var input = document.getElementById('maxmindcountry');
          if (input != undefined)
            input.value = country;
          console.error(error);
        };
        var maxmind = geoip2.country(onSuccess, onError);
      </script>
      <!--MAXMIND SCRIPT END-->


      <!--MARKETO SCRIPT START-->
      <script src="js/forms2/js/forms2.min.js"></script>
      <script src="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fpages.theaccessgroup.com%2frs%2f302-WOS-863%2fimages%2fdisclaimer-move-v2.js&c=E,1,KDQJAUi6yZmpYzVJ0TbVZv3eyz9xH8Pnq91NLokF0YC8lzWenOoizLd_iKkFAooMjffyU6k_7UOMfYOdkHb64aJjvxVtOJ65yOQhc_koVBrmm4U,&typo=1"></script>
      <script src="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fpages.theaccessgroup.com%2frs%2f302-WOS-863%2fimages%2fEmbedSendEvent.js&c=E,1,pFkP1xix5rShnVpLcKuMUgiAe4BafvmPcoNY2t4qm_Im5E5Nh6viK1hWyv4rTCtae1x2JwpizyEOG_c1HoMJTWbQypIIf54LeX7uSTWrKic3dLx6cSE,&typo=1"></script>
      <script src="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fpages.theaccessgroup.com%2frs%2f302-WOS-863%2fimages%2fFullNameCode.js&c=E,1,5yeMq0TfLxyUPevitXXtEE2iaM_xx9-Wxa1DYJquxJz2q2mlvjlY254rUzp3LgbaGT70FVXNkCW_v94wFPwD5MbCBqW6hyf4-RcgN7qJbCg,&typo=1"></script>
      <div class="cpFormWrapper contact-form">
        <p class="cpFormDivider" id="cpFormDivider-1">Contact Us</p>
        <p>If you are an existing customer of COINS please visit our <a href="login/index.php">Client Area</a> to talk to our team of experts.</p>
        <form id="mktoForm_10717"></form>
        <div class="cpValueWrapper cpFormCommentRow privacyHeadsUp">
          <p>To find out about how we process your data, please read our <a href="company/privacy-notice/2857/index.php" target="_blank">privacy policy</a>.</p>
        </div>
      </div>
      <div id="ProgramName" style="display:none">FY23-P12-SCS-WEB-BOF-Contact-CONS-NB-COINS-UK</div>
      <script>
        MktoForms2.loadForm("//app-lon05.marketo.com", "302-WOS-863", 10717);
        MktoForms2.whenReady(function(form) {
          vr = gaconnector.getCookieValues();
          form.addHiddenFields({
            "gaconnector_Browser__c": String(vr['browser']),
            "gaconnector_City__c": String(vr['city']),
            "gaconnector_Country__c": String(vr['country']),
            "gaconnector_First_Click_Campaign__c": String(vr['fc_campaign']),
            "gaconnector_First_Click_Channel__c": String(vr['fc_channel']),
            "gaconnector_First_Click_Content__c": String(vr['fc_content']),
            "gaconnector_First_Click_Landing_Page__c": String(vr['fc_landing']),
            "gaconnector_First_Click_Medium__c": String(vr['fc_medium']),
            "gaconnector_First_Click_Referrer__c": String(vr['fc_referrer']),
            "gaconnector_First_Click_Source__c": String(vr['fc_source']),
            "gaconnector_First_Click_Term__c": String(vr['fc_term']),
            "gaconnector_Google_Analytics_client_ID__c": String(vr['GA_Client_ID']),
            "gaconnector_region__c": String(vr['region']),
            "gaconnector_Last_Click_Campaign__c": String(vr['lc_campaign']),
            "gaconnector_Last_Click_Channel__c": String(vr['lc_channel']),
            "gaconnector_Last_Click_Content__c": String(vr['lc_content']),
            "gaconnector_Last_Click_Landing_Page__c": String(vr['lc_landing']),
            "gaconnector_Last_Click_Medium__c": String(vr['lc_medium']),
            "gaconnector_Last_Click_Referrer__c": String(vr['lc_referrer']),
            "gaconnector_Last_Click_Source__c": String(vr['lc_source']),
            "gaconnector_Last_Click_Term__c": String(vr['lc_term']),
            "gaconnector_latitude__c": String(vr['latitude']),
            "gaconnector_longitude__c": String(vr['longitude']),
            "gaconnector_page_visits__c": String(vr['page_visits']),
            "gaconnector_OS__c": String(vr['OS']),
            "gaconnector_pages_visited_list__c": String(vr['pages_visited_list']),
            "gaconnector_time_passed__c": String(vr['time_passed']),
            "gaconnector_time_zone__c": String(vr['time_zone']),
            "gaconnector_device__c": String(vr['device']),
            "maxmindcountry": String(country),
          });
          // form.addHiddenFields({"candleID":candleId});
          form.addHiddenFields({
            "programName": "FY23-P12-SCS-WEB-BOF-Contact-CONS-NB-COINS-UK"
          });

          form.onSuccess(function(vals, tyURL) {
            GetDetails("FY23-P12-SCS-WEB-BOF-Contact-CONS-NB-COINS-UK");
            location.href = "https://www.coins-global.com/form-submitted/2583/";
            return false;
          });
        });
      </script>

      <!--MARKETO SCRIPT END-->

    </div>
    <!-- <div class="contactFormWrapper">
	<form class="simpleContactForm styled" action="simplecontactform/simplecontactform.php" method="post" name="contactForm" id="contactForm">

	    <div class="columnWrapper">
	        <div class="formColumn first">

	        	<input class="styled" title="First Name" name="First_Name" id="First_Name" type="text" />

	            <input class="styled" title="Last Name" name="Last_Name" id="Last_Name" type="text" />

	            <input class="styled" title="Email" name="Email" id="Email" type="text" />

	            <input class="styled" title="Phone" name="Phone" id="Phone" type="text" />

	            <input class="styled" title="ccdIDNO" name="ccdIDNO" id="ccdIDNO" type="text" />

	            <input class="styled" title="Company Name" name="Company_Name" id="Company_Name" type="text" />

	            <input class="styled" title="Position" name="Position" id="Position" type="text" />

	        </div>

	        <div class="formColumn second">
	        	<select title="Question Type" class="styled office" name="Enquiry_Type" id="Enquiry_Type">
	        		<option>General</option>
	        		<option>Literature Request</option>
	        		<option>Meeting Request</option>
	        		<option>Call Back Request</option>
	        		<option>Register for an event</option>
				</select>
	        	 <select title="Select COINS Office" class="styled office" name="Office" id="Office"> -->
    <!-- </select>


	            <textarea class="styled" title="Message" name="message" id="message"></textarea>
	        </div>

	        <div class="clear">
	        </div>
	        <p>
	        <button class="Send coinsBlue bub" type="submit">
	        <span></span>
	            <p>Send</p>
	        </button>
	    </p>
	    </div>


	</form>
</div> -->

    <!-- CONTACT PAGE START  -->
    <!-- <div class="fullSizeBar">
	<div class="fullSizeBarInner">
		<h1>Contact</h1>
		<p><a href="company/global-locations/1938/">Click here to find your nearest office</a></p>
		<hr/>

	</div>
</div> -->

    <!-- B a n n e r --> <!-- E n d  o f  B a n n e r -->
    <!-- - - - - - - - - - - - - - - C o n t e n t   A r e a  - - - - - - - - - - - - - -->
    <div class="siteContentContainer">
      <div class="bodytextMainCopyWrapper unnamedDiv12">
        <div class="bodytextMainCopy" id="bodytextMainCopy">
          <p class="contactUsTxt">You can call our Slough office on &nbsp;</p>
          <div class="btnNew coinsBlue bub"><img style="vertical-align: middle;" src="style/images/icon_phone.png" alt="Phone Icon" width="17" height="17"> &nbsp; <a href="tel:+44 1753 501000"> +44 1753 501000 </a></div>
          <p class="contactUsTxt">&nbsp;</p>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <!-- - - - - - - - - - - - - - - E n d   C o n t e n t   A r e a  - - - - - - - - - - - - - -->

  </div>
  <div class="push"></div>
</div>
</div>

<?php include('../../php/footer.php'); ?>