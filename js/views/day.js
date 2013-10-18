app.DayView = Backbone.View.extend({
	tagName: "div",
    className: "span2",

    template: _.template($('#day-template').html()),

    events: {
        "click .addDailySpent" : "addDailySpent",
    },

    initialize: function (options) {
    	this.date = options.date;
        this.items = null;
    },

    prepareData: function () {

        var data = null;
        if(app.activeSpendCollection.length>0) {
            var filter_date = this.date.format("YYYY-MM-DD");
            data = app.activeSpendCollection.filter(function(item){
                return item.get("date") == filter_date;
            });
        }
        this.items = data;
    },

    render: function () {

        this.prepareData();

    	var total = 0;
    	var spendViews = [];
        var _this = this;

        //console.log(this.date.format("YYYY-MM-DD"));
    	_.each(this.items, function(item) {
    		total += item.get('spend');
    		spendViews.push(new app.SpendView({model: item, dayView: _this}));
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
        var dialog = new app.SpendDialogView({date:this.date, dayView: this});
        dialog.presentDailySpendModelDialog(app.dialogModeAdd);
    },

});