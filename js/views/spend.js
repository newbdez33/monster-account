app.SpendView = Backbone.View.extend({
	tagName: "li",
    className: "spend-memo-list-item",

    template: _.template($('#spend-template').html()),

    events: {
        "click span":"clicked"
    },


    initialize: function (options) {
    	this.dayView = options.dayView;
        this.model = options.model;

        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
    	this.$el.html(this.template(this.model.toJSON()));
    	return this;
    },

    clicked: function() {
        var dialog = new app.SpendDialogView({date:moment(this.model.get("date")), dayView:this.dayView, model:this.model});
        dialog.presentDailySpendModelDialog(app.dialogModeEdit);
    }

});