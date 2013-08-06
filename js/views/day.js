app.DayView = Backbone.View.extend({
	tagName: "div",
    className: "span2",

    template: _.template($('#day-template').html()),

    events: {
        "click .addDailySpent" : "addDailySpent",
    },

    initialize: function (options) {

    	this.date = options.date;
        this.collection = new app.SpendCollection(options.items);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
    },

    render: function () {
    	var total = 0;
    	var spendViews = [];
        var items = this.collection.toJSON();
        var _this = this;
    	_.each(items, function(item) {
    		total += item.spend;
            var spendModel = new app.Spend(item);
    		spendViews.push(new app.SpendView({model: spendModel, dayView:_this}));
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
        var dialog = new app.SpendDialogView({date:this.date, dayView:this});
        dialog.presentDailySpendModelDialog(app.dialogModeAdd);
    },

});