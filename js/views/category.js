app.CategoryView = Backbone.View.extend({

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