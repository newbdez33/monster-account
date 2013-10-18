/**
 * Salmon Account
 * Version 0.1.1
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
var app = {
    views: {},
    models: {},

    /* static variables */
    dialogModeAdd: "dialogModeAdd",
    dialogModeEdit: "dialogModeEdit",

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
        app.layoutView = new app.LayoutView();
        app.activeSpendCollection = new app.SpendCollection();
        app.monthes = new app.MonthCollection();
    },

    home: function () {

        //app.layoutView.delegateEvents();

        console.log("Route: HOME");
        
        app.monthes.fetch({
            success: function(collection) {
                app.checkAndFixThisMonthTab();  //check if this month is existing

                //After fetch monthes data, we route to MAIN view
                app.layoutView.selectMenuItem('home-menu');

                app.tabbedContainer = new app.TabbedContainer();
                app.layoutView.$("#content").html(app.tabbedContainer.render().el);
            },
            error: function(collection, err) {
                console.warn("Retrieving tab collection error");
            }
        });

        app.categories = new app.CategoryCollection();
        app.categories.fetch({
            success: function(collection) {
                //console.log("categories retrieved."+collection.length);
            },
            error: function(collection, err) {
                console.warn("Retrieving tab collection error");
            }
        });

        
    },

    chart: function(type) {

        console.log("Route: CHART("+type+")");

        app.layoutView.selectMenuItem('chart-menu');
        app.chartView = new app.ChartView({type: type});
        app.layoutView.$("#content").html(app.chartView.render().el);

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