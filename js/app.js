/**
 * Salmon Account
 * Version 0.1.1
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
var app = {
    views: {},
    models: {},
};

app.Router = Backbone.Router.extend({

    routes: {
        ""              : "home",
        "chart/:type"   : "chart",
        "settings"      : "settings"
    },

    initialize: function () {
        //
    },

    home: function () {

        console.log("Route: HOME");
        if (!app.layoutView) {

            app.layoutView = new app.LayoutView();

            app.monthes = new app.MonthCollection();
            app.monthes.fetch({
                success: function(collection) {
                    console.log("Retrieving collection success");
                },
                error: function(collection, err) {
                    console.log("Retrieving collection error");
                }
            });

        }else {
            console.log("resusing LayoutView");
            app.layoutView.delegateEvents();
        }
        
        app.layoutView.selectMenuItem('home-menu');

        app.tabbedContainer = new app.TabbedContainer();
        app.layoutView.$("#content").append(app.tabbedContainer.render().el);
        
    },

    chart: function(type) {
        console.log("Route: CHART("+type+")");
        app.layoutView.selectMenuItem('chart-menu');
        app.layoutView.$("#content").html('');
    },

    settings: function() {
        console.log("Route: SETTINGS");
        app.layoutView.selectMenuItem('settings-menu');
        app.layoutView.$("#content").html('');
    }

});

$(document).on("ready", function () {
    app.router = new app.Router();
    Backbone.history.start();
});