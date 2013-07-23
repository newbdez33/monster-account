app.CategoryView = Backbone.View.extend({
    el: $("#selectCategory"),

    template: _.template($('#category-item-template').html()),

    events: {
        "click li": "selected",
    },

    initialize: function(options) {
        this.collection = options.collection;
    },

    render: function() {
        this.$el.html(this.template({categories:this.collection.toJSON()}));
        return this;
    },

    selected: function(e) {
        this.trigger("onSelected", $(e.target).html());
    }
});

app.SpendDialogView = Backbone.View.extend({
	el: $("#spendDialog"),

	events: {
		"shown": "dialogShown",
		"click #saveSpendButton": "saveAction",
	},

    initialize: function (options) {

    	this.date = options.date;
    	this.dayView = options.dayView;

    	this.deleteButton = this.$("#deleteSpendButton");
    	this.titleLabel = this.$("#spend-dialog-title");
    	this.spendForm = this.$("#spendForm");
        this.categoryField = this.$("#category");

    	//set spend text field number only
    	this.spendForm.find("#spend").numeric({ decimal: false, negative: false});

        this.categoryView = new app.CategoryView({collection:app.categories});
        this.listenTo(this.categoryView, 'onSelected', this.onSelectedCategory);
    },

    onSelectedCategory: function (e) {
        this.categoryField.val(e);
    }, 

    presentDailySpendModelDialog: function (mode) {

        this.categoryView.render();
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

    		var spend = new app.Spend();
    		_.each(this.spendForm.serializeArray(), function(item){
    			if(item.name=="spend") item.value = parseFloat(item.value);
    			spend.set(item.name, item.value);
    		});
    		
    		thisView = this;
    		spend.save(null, {
    			success: function(obj) {
    				console.log(spend);
    				thisView.dayView.collection.add(spend);
                    app.categories.countOne(spend.get("category"));
    				$("#spendDialog").modal('hide');
    			},
    			error: function(obj, error) {
    				console.log("error occred while saving.");
    				$("#error-message").html("Error occred while saving.<br />Code: "+error.code+"<br />Message: "+error.message);
    				$("#error-message").show();
    				console.log(error);
    			}
    		});
    	}
    },

});