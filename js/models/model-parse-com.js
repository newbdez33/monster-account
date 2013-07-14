Parse.initialize("3lJfd4T87rxDvs34BJcXEjO7tbJLAyQ4cN3XSwCv", "WInG2A7UMnpzeCH51SXB0pecsWWtmOKvjXyolLUm");

app.Employee = Parse.Object.extend({

    className: "employees",

    initialize: function() {
        this.reports = new app.ReportsCollection();
        this.reports.query = new Parse.Query(app.Employee).equalTo("managerId", this.id);
    }

});

app.EmployeeCollection = Parse.Collection.extend(({

    model: app.Employee,

    fetch: function(options) {
        console.log('custom fetch');
        if (options.data && options.data.name) {
            var firstNameQuery = new Parse.Query(app.Employee).contains("firstName", options.data.name);
            var lastNameQuery = new Parse.Query(app.Employee).contains("lastName", options.data.name);
            this.query = Parse.Query.or(firstNameQuery, lastNameQuery);
        }
        Parse.Collection.prototype.fetch.apply(this, arguments);

    }

}));

app.ReportsCollection = Parse.Collection.extend(({

    model: app.Employee

}));
