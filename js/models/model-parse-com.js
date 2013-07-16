Parse.initialize("oMA4LcKxl6pHu7753B4F5bPQ4M7nMORtyJerbT4J", "hPfpey5oqDR9A3ef9vi06l7A390tp5nMhDT2pkug");

app.Month = Parse.Object.extend({

    className: "month",

    defaults: function() {
        return {
            date : moment().format("YYYY-MM"),
            spend : 0
        }
    }

});

app.MonthCollection = Parse.Collection.extend(({
    model: app.Month,
}));

app.Day = Parse.Object.extend({

    className: "day",

    initialize: function() {
        //
    },

    defaults: function() {
        return {
            date : moment().format("YYYY-MM-DD"),
            items : []
        }
    }
});