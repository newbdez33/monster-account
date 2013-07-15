app.TabbedContainer = Backbone.View.extend({

	tagName: "div",
    className: "tabbable",

    template: _.template($('#tabbed-container-template').html()),

	events: {
        "click li a":"changeTab"
	},

	initialize: function () {
        
        this.listenTo(app.monthes, 'all', this.render);
        this.listenTo(app.monthes, 'add', this.addOne);

    },

    render: function () {

        console.log("monthes:"+app.monthes.length);

        if (app.monthes.length>0) {
            this.$el.html(this.template({tabs: app.monthes.toJSON()}));
            this.$('li').last().addClass("active");
        }else {

        }
        
        return this;
    },

    /* event handlers */
    changeTab: function () {
        console.log("changeTab");
    },

    addOne: function () {
        console.log("add One");
    }

});