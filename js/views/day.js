app.DayView = Backbone.View.extend({
	tagName: "div",
    className: "span2",

    template: _.template($('#day-template').html()),

    events: {
        "click .addDailySpent" : "addDailySpent",
    },

    initialize: function (options) {
    	this.date = options.date;
    	this.items = options.items;
    },

    render: function () {

    	var total = 0;
    	var spendViews = [];
    	_.each(this.items, function(item) {
    		total += item.get("spend");
    		spendViews.push(new app.SpendView({model: item}));
    	});

    	this.$el.html(this.template({date:this.date, day_spend:total}));
    	var ul_element = this.$("#spend-list");
    	_.each(spendViews, function(view){
    		//console.log(view);
    		ul_element.append(view.render().el);
    	});
    	return this;
    },

    addDailySpent: function () {
        var dialog = new app.SpendDialogView({date:this.date});
        dialog.presentDailySpendModelDialog(app.dialogModeAdd);
    },

});