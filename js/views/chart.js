app.ChartView = Backbone.View.extend({
    tagName: "div",

    template: _.template($('#chart-template').html()),

    initialize: function (options) {
    	this.type = options.type;
    },

    render: function() {

        this.$el.html(this.template({type: this.type}));
        return this;
    },

});