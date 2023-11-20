<!-- <base href="http://coinsinvestment.io/"> -->
<?php include('../php/header.php'); ?>

<div id="cpHeader" class="cpHeader ">
	<div class="cpHeaderRow first">
		<h1 class="">Manage My Data</h1>
		<div style="clear:both;"></div>
	</div>
</div>

<div class="cpWrapper cp_form_manual_submission" id="cpWrapper">
	<div id="manageMyDataFormWrapper">
		<h3>Please use the form below to submit a data management request</h3>
		<p>Note - after submitting your request, you must complete the email verification step, or we will be unable to process your request.</p>
		<link href="scripts/fineuploader/fineuploader-3.2.css?m=1687510786" rel="stylesheet" type="text/css">
		<script src="scripts/fineuploader/jquery.fineuploader-3.2.min.js?m=1687510786" data-ot-ignore=""></script>
		<script src="api/google/maps/js/index.htm" data-ot-ignore=""></script>
		<script src="scripts/maps_functions_v3.js?m=1687510786" data-ot-ignore=""></script>
		<script src="lib/clockpicker/jquery-clockpicker.min.js?m=1687510785" data-ot-ignore=""></script>
		<link href="lib/clockpicker/jquery-clockpicker.min.css?m=1687510785" rel="stylesheet" type="text/css">
		<script type="text/javascript">
			$(function() {

				cp_forms_init($('#cpForm-16'), [], {
					"useTitle": false,
					"usePlaceholder": true,
					"usePlaceholderOnTextareas": true,
					"useLabel": true,
					"useTable": true,
					"useComments": true,
					"showDividers": true,
					"showSubmitButton": true,
					"submitButtonText": "Submit",
					"selectDropdownPlaceholderText": "",
					"useOneTableInOutput": false,
					"warnBeforeUnload": true,
					"addFieldButtonType": "text"
				});
			});
		</script>
		<form name="cpForm-16" id="cpForm-16">
			<input type="hidden" name="mode" value="cp_form_submit">
			<input type="hidden" name="form_cpda_id" value="-16">
			<input type="hidden" name="use_table" value="1">
			<div class="cpFormWrapper">
				<!-- start column -->
				<table>
					<tbody>
						<tr>
							<td>
								<p class="cpFormDivider" id="cpFormDivider-1">Manage My Data Form</p>
							</td>
						</tr>
						<!-- start blockWrapper -->
						<tr id="blockWrapper-16001_0_0_-16_0_0">
							<td class="blockWrapper">
								<div class="blockAnimWrapper">
									<table>
										<tbody>
											<!-- start field -16001 -->
											<tr class="cpValueWrapper set_fieldtype_form_text field_-16001 mandatory">
												<td class="rowLabel"><label for="">
														<p>First Name</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<input name="field-16001_0_0_-16_0_0" id="field-16001_0_0_-16_0_0" placeholder="First Name" type="text">
												</td>
											</tr> <!-- end field -16001 -->
											<!-- start field -16002 -->
											<tr class="cpValueWrapper set_fieldtype_form_text field_-16002 mandatory">
												<td class="rowLabel"><label for="">
														<p>Last Name</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<input name="field-16002_0_0_-16_0_0" id="field-16002_0_0_-16_0_0" placeholder="Last Name" type="text">
												</td>
											</tr> <!-- end field -16002 -->
											<!-- start field -16003 -->
											<tr class="cpValueWrapper set_fieldtype_form_email_and_confirm field_-16003 mandatory">
												<td class="rowLabel"><label for="field-16003_0_0_-16_0_0_first">
														<p>Email</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<input spellcheck="false" type="email" autocomplete="email" name="field-16003_0_0_-16_0_0[0]" id="field-16003_0_0_-16_0_0_first" value="" placeholder="Email">
												</td>
											</tr>
											<tr class="cpValueWrapper set_fieldtype_form_email_and_confirm field_-16003 mandatory confirmField">
												<td class="rowLabel"><label for="field-16003_0_0_-16_0_0_confirm">
														<p>Confirm Email</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<input class="fieldtype_email_confirm" spellcheck="false" type="email" autocomplete="email" name="field-16003_0_0_-16_0_0[1]" id="field-16003_0_0_-16_0_0_confirm" value="" placeholder="Confirm Email">
												</td>
											</tr> <!-- end field -16003 -->
											<!-- start field -16004 -->
											<tr class="cpValueWrapper set_fieldtype_form_select_data_request field_-16004 mandatory">
												<td class="rowLabel"><label for="field-16004_0_0_-16_0_0">
														<p>Request Type</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<select class="formDataRequestType" name="field-16004_0_0_-16_0_0" id="field-16004_0_0_-16_0_0" placeholder="Request Type">
														<option value="">Choose...</option>
														<option value="change_consent">Change My Consent</option>
														<option value="right_access">Right of Access</option>
														<option value="right_rectification">Right to Rectification</option>
														<option value="right_erasure">Right to Erasure</option>
														<option value="right_restrict_processing">Right to Restrict Processing</option>
														<option value="right_portability">Right to Data Portability</option>
														<option value="right_object">Right to Object</option>
													</select>
												</td>
											</tr> <!-- end field -16004 -->
											<!-- start field -16005 -->
											<tr class="cpValueWrapper set_fieldtype_form_textarea field_-16005">
												<td class="rowLabel"><label for="field-16005_0_0_-16_0_0">
														<p>Optional Message</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<textarea name="field-16005_0_0_-16_0_0" id="field-16005_0_0_-16_0_0" placeholder="Optional Message"></textarea>
												</td>
											</tr> <!-- end field -16005 -->
											<!-- start field -16006 -->
											<tr class="cpValueWrapper set_fieldtype_form_captcha field_-16006">
												<td class="rowLabel"><label for="field-16006_0_0_-16_0_0">
														<p>Anti-spam Measure</p>
													</label>
												</td>
												<td class="rowFormComponents">
													<script src="recaptcha/api.js"></script>
													<div class="g-recaptcha" data-sitekey="6LfiIE4UAAAAADUSE3V3ucHt2ElvBoy-Ea-BV4bs"></div>
												</td>
											</tr> <!-- end field -16006 -->
										</tbody>
									</table>
									<div style="clear:both;"></div>
								</div>
							</td>
						</tr>
						<!-- end blockWrapper -->
					</tbody>
				</table>
				<!-- end column -->
				<div class="cpFormExtraArea" id="cpFormExtraArea-16"></div>
				<div class="cpValueWrapper cpFormCommentRow privacyHeadsUp">
					<p>To find out about how we process your data, please read our <a href="company/privacy-notice/2857/index.php" target="_blank">privacy policy</a>.</p>
				</div>
				<div class="btn cpFormSubmit" id="cpFormSubmit-16">
					<p>Submit</p>
				</div>
				<div style="clear:both;"></div>
			</div>
		</form>

		<i id="moveThisHelpIcon" class="help">
			<a href="https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/individual-rights/" target="_blank" rel="noopener"></a>
		</i>

		<script>
			$('#moveThisHelpIcon').appendTo($('.field_-16004 .rowFormComponents'));
		</script>
	</div>
</div>

<?php include('../php/footer.php'); ?>