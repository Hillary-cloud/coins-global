<!-- <base href="http://localhost/www.coins-global.com/"> -->
<?php include('../../php/header.php');?>
<!-- End Desktop Header HTML -->

<!-- Begin Mobile Header HTML -->


<!-- End Mobile Header HTML -->

<!-- Begin General Site Housekeeping -->

<link href="lib/qtip/jquery.qtip.min.css?m=1687510785" rel="stylesheet" type="text/css">
<script src="lib/qtip/jquery.qtip.min.js?m=1687510785" defer="" data-ot-ignore=""></script>
<link href="scripts/fineuploader/fineuploader-3.2.css?m=1687510786" rel="stylesheet" type="text/css">
<script src="scripts/fineuploader/jquery.fineuploader-3.2.min.js?m=1687510786" defer=""
  data-ot-ignore=""></script>


<style>
  .contColInner.video .overlay {
    background-color: #f1736a;
  }
</style>
<div class="siteMiddleContainer">
  <div class="siteMiddleInner">

    <div class="landBanner" style="height:px">
      <img src="storage/images-processed/w-2000_h-auto_m-fit_s-any__NEW%20Landing%20Page%20Banner.png">
      <div class="landBannerText" style="
        text-shadow: 0px 2px rgba(33,33,33,0.24);      ">
        <h1 style="color:#faf7fa; font-size:px;"><b></b>1<b></b>6<b></b>/<b></b>2<b></b>5<b></b> <b></b>o<b></b>f<b></b>
          <b></b>t<b></b>h<b></b>e<b></b> <b></b>U<b></b>K<b></b>'<b></b>s<b></b>
          <b></b>l<b></b>e<b></b>a<b></b>d<b></b>i<b></b>n<b></b>g<b></b>
          <b></b>h<b></b>o<b></b>m<b></b>e<b></b>b<b></b>u<b></b>i<b></b>l<b></b>d<b></b>e<b></b>r<b></b>s<b></b>
          <b></b>u<b></b>s<b></b>e<b></b> <b></b>C<b></b>O<b></b>I<b></b>N<b></b>S<b></b>
          <b></b>s<b></b>o<b></b>l<b></b>u<b></b>t<b></b>i<b></b>o<b></b>n<b></b>s<b></b></h1>
        <h2></h2>
      </div>
    </div>

    <div class="mainContWrap">
      <div class="mainLeft">
        <div class="leftTop">
          <h1><strong>One system, complete control.</strong></h1>
          <h2><strong>Discover why most leading UK and Irish homebuilders choose COINS ERP+ Software for
              homebuilders.&nbsp;</strong></h2>
          <p><strong>Acquisition:&nbsp;</strong>make better decisions &amp; improve
            profitability<br><strong>Build:</strong> Control costs, improve productivity and streamline
            processes<br><strong>Home Sales:</strong> Keep opportunities moving forward, from initial enquiry to
            customer care</p>
          <p>Alternatively you can email us: <a href="mailto:info@coins-global.com" target="_blank"
              rel="noopener">info@coins-global.com</a></p>
        </div>
        <div class="leftBottom">
          <ul>
          </ul>
        </div>
      </div>
      <div class="mainRight">


        <div style="clear:both;"></div>
        <div class="rightBottom">
          <h2>Request a demo of COINS ERP+ homebuilder software</h2>
          <div class="formWrap">
            <div id="noThmb">

              <!-- PDF FORM -->

              <script type="text/javascript">
                var landing_form_thankyou_url = "";

                $(document).ready(function (e) {
                  landing_form_thankyou_url = "/form-submitted/2583/?id=203841";
                  landing_form_id = "150181";
                  var first_name_field = "";
                  var last_name_field = "";
                  var email_field = "";
                  var name_field = "";
                  $("#cpForm150181").submit(function (e) {
                    e.preventDefault(); // avoid to execute the actual submit of the form.
                    var form = $(this);
                    var url = form.attr('action');
                    form.find('input').each(function () {
                      if ($(this).attr('placeholder') == "First Name") {
                        first_name_field = $(this).val();
                      }
                      if ($(this).attr('placeholder') == "Last Name") {
                        last_name_field = $(this).val();
                      }
                      if ($(this).attr('placeholder') == "Name") {
                        name_field = $(this).val();
                      }
                      else if ($(this).attr('placeholder') == "Full Name") {
                        name_field = $(this).val();
                      }
                      else if ($(this).attr('placeholder') == "Full name") {
                        name_field = $(this).val();
                      }
                      if ($(this).attr('placeholder') == "Email") {
                        email_field = $(this).val();
                      }
                      else if ($(this).attr('placeholder') == "Email Address") {
                        email_field = $(this).val();
                      }
                      else if ($(this).attr('placeholder') == "Email address") {
                        email_field = $(this).val();
                      }
                    });
                    if (first_name_field != "" && last_name_field != "") {
                      _wow.push(['setName', first_name_field + " " + last_name_field]);
                    }
                    else if (name_field != "") {
                      _wow.push(['setName', name_field]);
                    }
                    if (email_field != "") {
                      _wow.push(['setEmailAddress', email_field]);
                    }
                    _wow.push(['trackPageView']);
                    // $.ajax({
                    //     type: "POST",
                    //     url: url,
                    //     data: form.serialize(), // serializes the form's elements.
                    //     success: function(data)
                    //     {
                    //        window.location.href = '/form-submitted/2583/?id=203841';
                    //     }
                    // });
                  });

                });
                // function cp_forms_callback(data) {
                //   debugger;
                //   if (data["form_cpda_id"] == 150181) {
                //     window.location.href = '/form-submitted/2583/?id=203841'
                //   }
                // }
              </script>

              <!-- STANDARD CONTACT -->
              <script src="api/google/maps/js/index.htm" data-ot-ignore=""></script>
              <script src="scripts/maps_functions_v3.js?m=1687510786" data-ot-ignore=""></script>
              <script src="lib/clockpicker/jquery-clockpicker.min.js?m=1687510785" data-ot-ignore=""></script>
              <link href="lib/clockpicker/jquery-clockpicker.min.css?m=1687510785" rel="stylesheet"
                type="text/css">
              <script type="text/javascript">
                $(function () {

                  cp_forms_init($('#cpForm150181'), [], { "useTitle": true, "usePlaceholder": true, "usePlaceholderOnTextareas": true, "useLabel": false, "useTable": false, "useComments": true, "showDividers": false, "showSubmitButton": true, "submitButtonText": "BOOK A DEMO", "selectDropdownPlaceholderText": "", "useOneTableInOutput": false, "warnBeforeUnload": true, "addFieldButtonType": "text" });
                });
              </script>
              <form name="cpForm150181" id="cpForm150181">
                <input type="hidden" name="mode" value="cp_form_submit">
                <input type="hidden" name="form_cpda_id" value="150181">
                <input type="hidden" name="use_table" value="0">
                <div class="cpFormWrapper">
                  <!-- start column -->
                  <!-- start blockWrapper -->
                  <div class="blockWrapper" id="blockWrapper150186_0_0_150181_0_0">
                    <div class="blockAnimWrapper">
                      <!-- start field 150186 -->
                      <div class="cpValueWrapper set_fieldtype_form_text field_150186 mandatory"><input
                          name="field150186_0_0_150181_0_0" id="field150186_0_0_150181_0_0" title="Name"
                          placeholder="Name" type="text">
                      </div> <!-- end field 150186 -->
                      <!-- start field 150187 -->
                      <div class="cpValueWrapper set_fieldtype_form_text field_150187 mandatory"><input
                          name="field150187_0_0_150181_0_0" id="field150187_0_0_150181_0_0" title="Company"
                          placeholder="Company" type="text">
                      </div> <!-- end field 150187 -->
                      <!-- start field 150188 -->
                      <div class="cpValueWrapper set_fieldtype_form_email field_150188 mandatory"><input
                          spellcheck="false" type="email" name="field150188_0_0_150181_0_0"
                          id="field150188_0_0_150181_0_0" value="" title="Email" placeholder="Email">
                      </div> <!-- end field 150188 -->
                      <!-- start field 218569 -->
                      <div class="cpValueWrapper set_fieldtype_form_telephone field_218569"><input
                          name="field218569_0_0_150181_0_0" id="field218569_0_0_150181_0_0" title="Phone (optional)"
                          placeholder="Phone (optional)" type="tel">
                      </div> <!-- end field 218569 -->
                      <!-- start field 184315 -->
                      <div class="cpValueWrapper set_fieldtype_form_captcha field_184315">
                        <script src="recaptcha/api.js"></script>
                        <div class="g-recaptcha" data-sitekey="6LfiIE4UAAAAADUSE3V3ucHt2ElvBoy-Ea-BV4bs"></div>
                      </div> <!-- end field 184315 -->
                      <div style="clear:both;"></div>
                    </div>
                  </div>
                  <!-- end blockWrapper -->
                  <div class="cpFormExtraArea" id="cpFormExtraArea150181"></div>
                  <div class="cpValueWrapper cpFormCommentRow privacyHeadsUp">
                    <p>To find out about how we process your data, please read our <a
                        href="company/privacy-notice/2857/index.php" target="_blank">privacy policy</a>.</p>
                  </div>
                  <div class="btn cpFormSubmit" id="cpFormSubmit150181">
                    <p>BOOK A DEMO</p>
                  </div>
                  <div style="clear:both;"></div>
                </div>
              </form>

            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <section class="strip Quotes"
      style="background-image:url(storage/images-processed/w-1000_h-333_m-cover_s-any__COINS%20Construction%20Management%20Software%20Testimonial%20Image.jpg);">
      <div class="testimonial_bg">

        <div class="inner centeredContents">
          <div class="QuoteSlider">
            <div class="QuoteWrapper">
              <div class="Quote shown">
                <blockquote>
                  <p>
                  <div>COINS offers our business a central ERP management system which runs through every stage of the
                    development process from land appraisal through to customer care. COINS&rsquo; purpose-built
                    approach was a natural fit for Spitfire Homes, offering an off-the shelf solution which has been
                    designed from the ground-up to meet the management and reporting requirements of the residential
                    development sector.</div>
                </blockquote>

                <div class="cite">
                  <p>
                    <span class="name">
                      Richard Bryan, Finance Director </span>

                    <br>

                    <span class="position">
                      Spitfire Homes </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      .btn.cpFormSubmit {
        width: 170px;
      }
    </style>

    <!-- B a n n e r --> <!-- E n d  o f  B a n n e r -->
    <!-- - - - - - - - - - - - - - - C o n t e n t   A r e a  - - - - - - - - - - - - - -->
    <div class="siteContentContainer">
      <div style="clear:both;"></div>
    </div>
    <!-- - - - - - - - - - - - - - - E n d   C o n t e n t   A r e a  - - - - - - - - - - - - - -->

  </div>
  <div class="push"></div>
</div>
</div>

<?php include('../../php/footer.php');?>