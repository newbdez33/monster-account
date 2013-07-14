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
        }else {
            console.log("resusing LayoutView");
            app.layoutView.delegateEvents();
        }
        console.log(app.layoutView);
        app.layoutView.selectMenuItem('home-menu');
    },

    chart: function(type) {
        console.log("Route: CHART("+type+")");
        app.layoutView.selectMenuItem('chart-menu');
    },

    settings: function() {
        console.log("Route: SETTINGS");
        app.layoutView.selectMenuItem('settings-menu');
    }

});

$(document).on("ready", function () {
    app.router = new app.Router();
    Backbone.history.start();
});