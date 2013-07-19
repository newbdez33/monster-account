app.SpendDialogView = Backbone.View.extend({
	el: $("#spendDialog"),

	events: {
		"shown": "dialogShown",
		"click #saveSpendButton": "saveAction",
	},

    initialize: function (options) {

    	this.date = options.date;

    	this.deleteButton = this.$("#deleteSpendButton");
    	this.titleLabel = this.$("#spend-dialog-title");
    	this.spendForm = this.$("#spendForm");

    	//set spend text field number only
    	this.spendForm.find("#spend").numeric({ decimal: false, negative: false});
    },

    presentDailySpendModelDialog: function (mode) {
        
        this.$("#error-message-box").hide();
        if (mode==app.dialogModeEdit) {
        	this.prepareForEditMode();
        }else {
        	this.prepareForAddMode();
        }

        this.$("#error-message").hide();
        $("#spendDialog").modal("show");
    },

    prepareForAddMode: function () {
    	var this_date = this.date.format("YYYY-MM-DD");
    	this.titleLabel.html("Add Spend("+this_date+")");
    	this.deleteButton.hide();

    	//reset form
    	this.spendForm.get(0).reset();

    	this.spendForm.find("#id").remove();
    	this.spendForm.find("#date").val(this_date);
    },

    prepareForEditMode: function () {
    	//this model
    	this.titleLabel.html("Edit Spend");
    	this.deleteButton.show();
    },

    dialogShown: function () {
    	this.spendForm.find("#spend").focus();
    },



    saveAction: function () {

    	this.spendForm.validate({
    		rules: {
    			spend: {
    				required: true,
    				number: true,
    			}
    		}
    	});
    	if(this.spendForm.valid()) {
    		var form_values = this.spendForm.serializeArray();
    		console.log(form_values);
    	}
    },

});