app.LayoutView = Backbone.View.extend({

	el: $("#layoutView"),

	events: {

	},

	initialize: function () {
        //
    },

    selectMenuItem: function(menuItem) {
        $('.navbar .nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});