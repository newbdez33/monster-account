app.SpendView = Backbone.View.extend({
	tagName: "li",
    className: "spend-memo-list-item",

    template: _.template($('#spend-template').html()),

    initialize: function () {
    	//
    },

    render: function () {
    	this.$el.html(this.template(this.model.toJSON()));
    	return this;
    },

});