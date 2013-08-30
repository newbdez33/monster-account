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
    tagName: "div",
    className: "modal hide fade",
    tabindex: "-1",
    role: "dialog",

    template: _.template($('#spend-dialog-template').html()),

	events: {
		"shown": "dialogShown",
		"click #saveSpendButton": "saveAction",
        "click #deleteSpendButton": "deleteAction",
        "click #cancelSpendButton": "cancelAction",
	},

    initialize: function (options) {

    	this.date = options.date;
    	this.dayView = options.dayView;

        this.categoryView = new app.CategoryView({collection:app.categories});
        this.listenTo(this.categoryView, 'onSelected', this.onSelectedCategory);
    },

    onSelectedCategory: function (e) {
        this.categoryField.val(e);
    }, 

    render: function() {

        this.$el.html(this.template());

        this.$el.attr('role', this.role);
        this.$el.attr('tabindex', this.tabindex);

        this.deleteButton = this.$("#deleteSpendButton");
        this.titleLabel = this.$("#spend-dialog-title");
        this.spendForm = this.$("#spendForm");
        this.categoryField = this.$("#category");
        this.spendField = this.$("#spend");
        this.memoField = this.$("#memo");

        //set spend text field number only
        this.spendForm.find("#spend").numeric({ decimal: false, negative: false});

        return this;
    },


    presentDailySpendModelDialog: function (mode) {

        this.render();
        $('body').append(this.el);

        this.categoryView.render();
        if (mode==app.dialogModeEdit) {
        	this.prepareForEditMode();
        }else {
        	this.prepareForAddMode();
        }

        this.$("#error-message").hide();
        this.$el.modal("show");
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
        var this_date = this.date.format("YYYY-MM-DD");
        this.titleLabel.html("Edit Spend("+this_date+")");
        this.categoryField.val(this.model.get("category"));
        this.spendField.val(this.model.get("spend"));
        this.memoField.val(this.model.get("memo"));
    	this.deleteButton.show();
    },

    dialogShown: function () {
    	this.spendForm.find("#spend").focus();
    },

    cancelAction: function () {
        this.$el.remove();
    },

    deleteAction: function () {

        thisView = this;
        console.log(this.dayView);
        this.model.destroy({
            success: function(obj) {
                thisView.dayView.collection.remove(obj);
                console.log("spend is deleted.");
                thisView.$el.modal('hide');
                thisView.$el.remove();
            },
            error: function(obj, error) {
                console.warn(error);
            }
        });
    },

    saveAction: function () {
        console.log("saveAction!");
    	this.spendForm.validate({
    		rules: {
    			spend: {
    				required: true,
    				number: true,
    			}
    		}
    	});
    	if(this.spendForm.valid()) {

    		var spend = null;
            if (this.model) {
                spend = this.model;
            }else {
                spend = new app.Spend();
            }
    		_.each(this.spendForm.serializeArray(), function(item){
    			if(item.name=="spend") item.value = parseFloat(item.value);
    			spend.set(item.name, item.value);
    		});
    		
    		thisView = this;
    		spend.save(null, {
    			success: function(obj) {
    				console.log(spend);
                    if (!thisView.dayView.collection.get(spend.id)) {
                        thisView.dayView.collection.add(spend);
                    }
                    app.categories.countOne(spend.get("category"));
    				thisView.$el.modal('hide');
                    thisView.$el.remove();
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