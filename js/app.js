/**
 * Salmon Account
 * Version 0.1.1
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
var app = {
    views: {},
    models: {},

    checkAndFixThisMonthTab: function () {

        var current_month = moment().format("YYYY-MM");

        if (app.monthes.length>0) {
            //get last item and check if it is current month
            var idx = app.monthes.length-1;
            var last = app.monthes.at(idx);
            if (current_month==last.get("date")) {
                return;
            }
        }

        //create a new (current)month model instance and add to collection
        app.monthes.create({date:current_month});
        console.log("Current Month Tab created.");

    },
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
                    app.checkAndFixThisMonthTab();  //check if this month is existing
                },
                error: function(collection, err) {
                    console.warn("Retrieving tab collection error");
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