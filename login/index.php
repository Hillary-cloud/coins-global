<!-- <base href="http://localhost/www.coins-global.com/"> -->
<?php include('../php/header.php');?>
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
    <!-- B a n n e r --> <!-- E n d  o f  B a n n e r -->
    <!--------------------------------- M e n u -------------------------------->
    <div class="sidebarWrapper">
    </div>
    <!-- - - - - - - - - - - - - - - C o n t e n t   A r e a  - - - - - - - - - - - - - -->
    <div class="siteContentContainer">
      <script type="text/javascript">
        $(document).ready(function () {
          init_new_ca();
        });
      </script>
      <div class="loginFormContainer">
        <div class="loginFormWrapper">


          <div class="PageClientLogin" id="cpContent">
            <section class="contentTop parallax">

              <div class="inner">
                <h1>
                  Client Area
                </h1>

                <h2>
                  Designed Exclusively for COINS Global Clients
                </h2>

                <form id="clientAreaLoginWrapper" class="clientLogin styled" action="ca_login.php" method="post">
                  <div id="loginError"></div>
                  <div class="username-wrapper" id="username-wrapper"> <input type="text" class="styled Username"
                      id="syu_username" name="syu_username" title="Email / Username" placeholder="Email / Username">
                    <input type="password" class="styled Password" id="syu_passwd" name="syu_passwd" title="Password"
                      placeholder="Password"> <input type="hidden" name="mode" value="ajax_login"> <input type="hidden"
                      name="responseType" value="json"> <input type="hidden" name="vww" value="h"> <input type="hidden"
                      name="skipto_cpi_id" value=""> <input type="hidden" name="skipto" value="/client-area/8/"> </div>
                  <input type="hidden" name="reset_syu_id" id="reset_syu_id" value=""> <input type="hidden"
                    name="reset_token" id="reset_token" value="">
                  <div class="login-btn-wrapper" id="login-btn-wrapper">
                    <div class="btn" id="clientLoginBtn">
                      <p>Login</p>
                    </div>
                    <div class="btn toggle-forms" id="toggleForms">
                      <p>Forgot Password?</p>
                    </div>
                  </div>
                </form>
              </div>

              <footer class="sectionBottom">

                <div class="inner normalText">
                  <p>
                    From the Client Area, you can get access to a wide
                    <br>
                    variety of resources to improve your use of COINS:
                  </p>

                  <article class="right box">

                    <p class="first">
                      If you do not have a login
                      <br>
                      for the Client Area, you
                      <br>
                      can request one here
                    </p>

                    <p class="last">
                      <button class="RequestAccess fullWidth" type="button">
                        Request Access
                      </button>
                    </p>

                    <p>
                      Are you a supplier or subcontractor
                      <br>
                      in the UK seeking to register
                      <br>
                      for COINS Supply Chain Manager?
                    </p>

                    <p class="last">
                      <a href="https://www.coinsiportal.com" target="_blank">
                        <button class="fullWidth" type="button" style="text-transform: none;">
                          Supply Chain Manager
                        </button>
                      </a>
                    </p>
                  </article>

                  <ul class="squareBullets">

                    <li>
                      Obtain support information and request assistance with a self-service client portal
                    </li>

                    <li>
                      Receive important notices, including statutory announcements
                    </li>

                    <li>
                      Check the release schedule for upcoming COINS versions
                    </li>

                    <li>
                      Download service packs and fixes
                    </li>

                    <li>
                      Learn how to use COINS with instructional videos and how-to guides
                    </li>

                    <li>
                      Access other COINS documentation
                    </li>

                    <li>
                      Sign up for events and view recorded webinars
                    </li>

                  </ul>
                </div>

              </footer>

            </section>
          </div>

          <script type="text/javascript">
            var requestFormHtml = { "html": "<script type=\"text\/javascript\">\n$(function(){\n\n\tcp_forms_init($('#cpForm80794'), [], {\"useTitle\":true,\"usePlaceholder\":true,\"usePlaceholderOnTextareas\":true,\"useLabel\":false,\"useTable\":false,\"useComments\":true,\"showDividers\":false,\"showSubmitButton\":true,\"submitButtonText\":\"Send\",\"selectDropdownPlaceholderText\":\"\",\"useOneTableInOutput\":false,\"warnBeforeUnload\":true,\"addFieldButtonType\":\"text\"});\n});\n<\/script>\n<form name=\"cpForm80794\" id=\"cpForm80794\">\n\t<input type=\"hidden\" name=\"mode\" value=\"cp_form_submit\">\n\t<input type=\"hidden\" name=\"form_cpda_id\" value=\"80794\">\n\t<input type=\"hidden\" name=\"use_table\" value=\"0\">\n\t<div class=\"cpFormWrapper\">\n\t\t<!-- start column -->\n\t\t\t\t<!-- start blockWrapper -->\n\t\t\t\t<div class=\"blockWrapper\" id=\"blockWrapper80799_0_0_80794_0_0\"><div class=\"blockAnimWrapper\">\n\t\t\t\t<!-- start field 80799 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80799 mandatory\"><input name=\"field80799_0_0_80794_0_0\" id=\"field80799_0_0_80794_0_0\"   title=\"First name\" placeholder=\"First name\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80799 -->\n\t\t\t\t<!-- start field 80800 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80800 mandatory\"><input name=\"field80800_0_0_80794_0_0\" id=\"field80800_0_0_80794_0_0\"   title=\"Last name\" placeholder=\"Last name\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80800 -->\n\t\t\t\t<!-- start field 80804 -->\n<div class=\"cpValueWrapper set_fieldtype_form_consent_email field_80804 mandatory\"><input spellcheck=\"false\" type=\"email\" name=\"field80804_0_0_80794_0_0\" id=\"field80804_0_0_80794_0_0\" value=\"\" title=\"Email\" placeholder=\"Email\" \/>\n<\/div>\t\t\t\t<!-- end field 80804 -->\n\t\t\t\t<!-- start field 80801 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80801\"><input name=\"field80801_0_0_80794_0_0\" id=\"field80801_0_0_80794_0_0\"   title=\"Job Title\" placeholder=\"Job Title\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80801 -->\n\t\t\t\t<!-- start field 80802 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80802\"><input name=\"field80802_0_0_80794_0_0\" id=\"field80802_0_0_80794_0_0\"   title=\"Company\" placeholder=\"Company\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80802 -->\n\t\t\t\t<!-- start field 80803 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80803\"><input name=\"field80803_0_0_80794_0_0\" id=\"field80803_0_0_80794_0_0\"   title=\"Telephone\" placeholder=\"Telephone\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80803 -->\n\t\t\t\t<!-- start field 80805 -->\n<div class=\"cpValueWrapper set_fieldtype_form_textarea field_80805\"><textarea name=\"field80805_0_0_80794_0_0\" id=\"field80805_0_0_80794_0_0\" title=\"Address\" placeholder=\"Address\"><\/textarea>\n<\/div>\t\t\t\t<!-- end field 80805 -->\n\t\t\t\t<!-- start field 80806 -->\n<div class=\"cpValueWrapper set_fieldtype_form_text field_80806\"><input name=\"field80806_0_0_80794_0_0\" id=\"field80806_0_0_80794_0_0\"   title=\"Postcode\" placeholder=\"Postcode\" type=\"text\" \/>\n<\/div>\t\t\t\t<!-- end field 80806 -->\n\t\t\t\t\t<div style=\"clear:both;\"><\/div>\n\t\t\t\t<\/div><\/div>\n\t\t\t\t<!-- end blockWrapper -->\n<div class=\"cpFormExtraArea\" id=\"cpFormExtraArea80794\"><\/div>\n<div class=\"cpValueWrapper cpFormCommentRow privacyHeadsUp\"><p>To find out about how we process your data, please read our <a href=\"company\/privacy-notice\/2857\/\" target=\"_blank\">privacy policy<\/a>.<\/p><\/div><div class=\"btn cpFormSubmit\" id=\"cpFormSubmit80794\"><p>Send<\/p><\/div>\t<div style=\"clear:both;\"><\/div>\n\t<\/div>\n<\/form>\n "};
          </script>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <!-- - - - - - - - - - - - - - - E n d   C o n t e n t   A r e a  - - - - - - - - - - - - - -->

    <div style="clear:both;"></div>
  </div>
  <div class="push"></div>
</div>
</div>

<?php include('../php/footer.php');?>