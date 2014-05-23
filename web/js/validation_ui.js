var VALIDATION_UI_PAGE = (function() {	
	"use strict";
	
	var counterTableRow = 0;
	var MIN_CONFIDENCE_LEVEL = 70;
	
	function initializePage() {
		loadPdfViewerIframe();
		loadStoresSet();
		readInvoiceJsonFile();
	}
	
	function loadPdfViewerIframe(){
		$('#pdf-viewer').html('<iframe src="viewer.html" width="360" height="850"></iframe>');	
	}
	
	function loadStoresSet(){
		$('#storesSet').append('<option value="1">North shore store</option>');
		$('#storesSet').append('<option value="2">South market store</option>');
		$('#storesSet').append('<option value="3">Central Avenue store</option>');
	}
		
	function readInvoiceJsonFile(){
		//start ajax request
		$.ajax({
			url: 'json/data.json',
			//force to handle it as text
			dataType: 'text',
			success: function(data) {
				var json = $.parseJSON(data);
				if (json != null && json.code == 0){
					displayFieldsExtracted(json);
				}else{
					alert('Invalid JSON');
				}
			}
		});
	}
	
	function displayFieldsExtracted(json){
		// load table headers
		// set vendor name
		$('#vendor-name').val(json.extractedInvoices[0].vendor.text);
		
		//set date
		$('#date').val(json.extractedInvoices[0].invoiceDate.text);
		var confidenceClass = getConfidenceLevelClass(json.extractedInvoices[0].invoiceDate.confidence);
		$('#date').addClass(confidenceClass);
		
		// set invoice number
		$('#invoice-number').val(json.extractedInvoices[0].invoiceId.text);

		// create table body 
		var tableHtml = generateExtractedFieldsRow(json);
		
		// load table body
    	$('#tableExtractedFields tbody').html(tableHtml);		
	} 

	function generateExtractedFieldsRow(json){
		var tableRowsHtml  = '';
		for (var i = 0; i < json.extractedInvoices.length; i++){
			for (var j = 0; j < json.extractedInvoices[i].lineItems.length; j++){
				tableRowsHtml	+= 	'<tr id="row_'+ j +'">'
								+ '<td></td>'
							+  '<td align="center"><input type="text" value="' + json.extractedInvoices[i].lineItems[j].SKU.text  + '" class="field-sku '+ getConfidenceLevelClass(json.extractedInvoices[i].lineItems[j].SKU.confidence) + '"></td>'
							+  '<td align="center"><input type="text" value="' + json.extractedInvoices[i].lineItems[j].Description.text + '" class="field-description"></td>'
							+  '<td align="center"><input type="text" value="' + json.extractedInvoices[i].lineItems[j].quantity.text  + '" class="field-qty '+ getConfidenceLevelClass(json.extractedInvoices[i].lineItems[j].quantity.confidence)+ '"></td>'
							+  '<td align="center"><a href="javascript:VALIDATION_UI_PAGE.displayConfirmActionDeleteRow(\'row_'+ j +'\');" class="link-delete-btn"><img src="images/delete-x.png" class="x-delete"></a></td>'
							+  '</tr>';

				counterTableRow ++;
			} 
		}
		
		tableRowsHtml += addEmptyRowToTable();
		return tableRowsHtml;
	}
	
	function addEmptyRowToTable(){
		var emptyRowHtml = '<tr id="row_'+ counterTableRow +'">'
						 + '<td></td><td align="center"><input name="sku-col" type="text" class="field-sku"></td>'
						 + '<td align="center"><input type="text" class="field-description"></td>'
						 + '<td align="center"><input type="text" class="field-qty"></td>'
						 + '<td align="center"><a href="javascript:VALIDATION_UI_PAGE.displayConfirmActionDeleteRow(\'row_' + counterTableRow + '\')" class="link-delete-btn"></a></td></tr>';
		
		counterTableRow ++;
		return emptyRowHtml;
	}

	function getConfidenceLevelClass(confidenceLevel){
		var confidence  = parseInt(confidenceLevel);
		var newClass = '';
		if (confidence < MIN_CONFIDENCE_LEVEL){
			newClass = 'low-confidence-level';
		}
		return newClass;
	}
	
	function displayConfirmActionDeleteRow(rowId){
		var confirmDeleteRowHtml = '<div><a onclick="javascript:VALIDATION_UI_PAGE.hideConfirmActionDeleteRowModal();" title="Close" class="close"><img src="images/close.png"/></a>'
								+	'<p>Are you sure you want to delete this row?</p><br><br>'
								+	'<a onclick="javascript:VALIDATION_UI_PAGE.deleteFieldRow(\''+  rowId + '\');" class="btn btn-success">Yes</a>&nbsp;&nbsp;'
								+	'<a onclick="javascript:VALIDATION_UI_PAGE.hideConfirmActionDeleteRowModal();" class="btn btn-danger">Cancel</a>'
								+ 	'</div>';
		
		$('#confirm-action-delete-row').html(confirmDeleteRowHtml);
		$('#confirm-action-delete-row').addClass('visible');
	}
	
	function hideConfirmActionDeleteRowModal(){
		$('#confirm-action-delete-row').removeClass('visible');
	}
	
	function deleteFieldRow(rowId){
		$('table#tableExtractedFields tr#' + rowId + '').remove();
		hideConfirmActionDeleteRowModal();
	}
	
	function getLastFieldRowId(){
		var rowId = $('#tableExtractedFields tr:last')[0].id;
		return rowId;	
	}
	
	function addDeleteButtonToPreviousRow(){
		var lastRowId = getLastFieldRowId();
		var deleteImageBtnHtml = '<img src="images/delete-x.png" class="x-delete">';
		$('#' + lastRowId + ' .field-sku').removeAttr("name");
		$('#' + lastRowId + ' .link-delete-btn').append(deleteImageBtnHtml);
	}

	function displayValidationUI(){
		$('#validation-ui-main-box').addClass('visible');
	}
	
	function hideValidationUI(){
		$('#validation-ui-main-box').removeClass('visible');
	}

	return {
	 	initializePage: initializePage,
	 	displayValidationUI: displayValidationUI,
	 	hideValidationUI: hideValidationUI,
	 	displayConfirmActionDeleteRow: displayConfirmActionDeleteRow,
	 	hideConfirmActionDeleteRowModal: hideConfirmActionDeleteRowModal,
	 	getLastFieldRowId: getLastFieldRowId,
	 	addEmptyRowToTable: addEmptyRowToTable,
	 	deleteFieldRow: deleteFieldRow,
	 	addDeleteButtonToPreviousRow: addDeleteButtonToPreviousRow
    };
}());
 