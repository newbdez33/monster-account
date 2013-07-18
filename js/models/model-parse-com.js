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

app.MonthCollection = Parse.Collection.extend({
    model: app.Month,

    fetch: function (options) {
        //TODO localstorage cache (lastUpdated)
        this.query = new Parse.Query(app.Month).ascending("date");
        Parse.Collection.prototype.fetch.apply(this, arguments);
    }
});

app.Spend = Parse.Object.extend({

    className: "spend",

    defaults: function() {
        return {
            date : moment().format("YYYY-MM-DD"),
            category : "",
            memo : "",
            spend : 0
        }
    }
});

app.SpendCollection = Parse.Collection.extend({
    model: app.Spend,
    fetch: function (options) {
        //TODO localstorage cache (lastUpdated)
        console.log("fetch spend collection with month:"+options.month)
        this.query = new Parse.Query(app.Spend).startsWith("date", options.month).ascending("date");
        Parse.Collection.prototype.fetch.apply(this, arguments);
    }
});