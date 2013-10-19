/**
 * Salmon Account
 * Version 0.1.1
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
var app = {
    views: {},
    models: {},
    spends: {}, //all fetched spends by month

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

    fetchCategories: function () {

        //TODO Cache!!
        
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

    fetchMonthes: function (successHandler) {

        //TODO Cache!!

        app.monthes.fetch({
            success: function(collection) {
                app.checkAndFixThisMonthTab();  //check if this month is existing
                successHandler();
            },
            error: function(collection, err) {
                console.warn("Retrieving tab collection error");
            }
        });
    },

    fetchSpendsByMonth: function (active_month, successHandler) {

        //TODO Cache!!

        app.activeSpendCollection.fetch({
            month:active_month, 
            success: function(collection) {
                successHandler(active_month);
            },
            error: function (collection, error) {
                console.warn("fetch app.activeSpendCollection failed.");
            }
        });
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

        app.fetchCategories();
    },

    home: function () {

        //app.layoutView.delegateEvents();
        console.log("Route: HOME");

        app.fetchMonthes(function (){
            //After fetch monthes data, we route to MAIN view
            app.layoutView.selectMenuItem('home-menu');
            app.tabbedContainer = new app.TabbedContainer();
            app.layoutView.$("#content").html(app.tabbedContainer.render().el);
        });
        
    },

    chart: function(type) {

        console.log("Route: CHART("+type+")");

        var active_month = (new moment()).format("YYYY-MM");
        app.fetchSpendsByMonth(active_month, function(){
            app.layoutView.selectMenuItem('chart-menu');
            app.chartView = new app.ChartView({type: type});
            app.layoutView.$("#content").html(app.chartView.render().el);
            app.chartView.draw();
        });

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