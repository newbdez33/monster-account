app.SettingsView = Backbone.View.extend({
    tagName: "div",

    template: _.template($('#settings-template').html()),

    initialize: function (options) {
    	//
    },

    render: function() {

        this.$el.html(this.template({currentUser:app.currentUser}));
        return this;
    },

});