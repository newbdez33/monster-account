Parse.initialize("oMA4LcKxl6pHu7753B4F5bPQ4M7nMORtyJerbT4J", "hPfpey5oqDR9A3ef9vi06l7A390tp5nMhDT2pkug");

app.UserController = {

    fetchCurrentUser: function(options) {

        var domainName = app.UserController.domainUserName();
        var u = Parse.User.current();
        if (u==null) { 
            //没有cached user，先尝试登陆
            app.UserController.tryLogin(options, domainName);
        }else {
            if (u.getUsername()==domainName) {
                app.currentUser = u;
                //成功回调
                options.success.call(null);
            }else {
                //这种情况不应该发生
                console.log(domainName+":"+u.get("username"));
                Parse.User.logOut();
                window.location.reload();
            }
        }

    },

    tryLogin: function (options, domainName) {

        Parse.User.logIn(domainName, domainName, {
                success: function(login_user) {
                    app.currentUser = login_user;
                    //成功回调
                    options.success.call(null);
                },
                error: function(login_user, error) {

                    //TODO 已经被设置密码的帐号

                    alert("Error: " + error.code + " " + error.message);

                    var user = new Parse.User();
                    user.set("username", domainName);
                    user.set("password", domainName);
                    user.signUp(null, {
                        success: function(user) {
                            app.currentUser = user;
                            //成功回调
                            options.success.call(null);
                        },
                        error: function(user, error) {
                            //TODO
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
                },
            });
    },

    domainUserName: function () {
        var hostname = location.hostname;
        return hostname.replace("."+appconfig.domain, "");
    },

}

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
        this.query.equalTo("user", app.currentUser);
        Parse.Collection.prototype.fetch.apply(this, arguments);
    },

    updateMonth: function (m /* month date string */) {

        //console.log("TODO: 找到month,更新:"+ m + " spend:"+diffSpend);
        var monthObj = this.find(function(item){
            return item.get("date") === m;
        });

        console.log("GOT:"+monthObj.get("date"));

        //TODO This logic is sucks!! @model cannot call a outer variable, please refine it.
        var total = app.activeSpendCollection.sumSpends();
        console.log("sum:"+total);

        if (monthObj.get('spend')== total) { return; };

        monthObj.set("spend", total);
        monthObj.set("user", app.currentUser);
        monthObj.setACL(new Parse.ACL(app.currentUser));
        monthObj.save(null, {
            success: function(obj) {
                //
            },
            error: function(obj, error) {
                console.log("error occred while saving.");
                $("#error-message").html("Error occred while saving.<br />Code: "+error.code+"<br />Message: "+error.message);
                $("#error-message").show();
                console.log(error);
            }
        });
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
    initialize: function() {
        this.on("change:spend", this.changeSpend, this);
        this.on("add", this.addSpend, this);
        this.on("remove", this.removeSpend, this);
    },
    fetch: function (options) {
        //TODO localstorage cache (lastUpdated)
        console.log("fetch spend collection with month:"+options.month)
        this.query = new Parse.Query(app.Spend).startsWith("date", options.month).ascending("date");
        this.query.equalTo("user", app.currentUser);
        Parse.Collection.prototype.fetch.apply(this, arguments);
    },
    changeSpend: function( model, val, options) {
        console.log("Spend changed");
        //update month data
        var m = moment(model.get("date")).format("YYYY-MM");
        app.monthes.updateMonth(m);
    },
    addSpend: function ( model ) {
        console.log("Spend added");
        //update month data
        var m = moment(model.get("date")).format("YYYY-MM");
        app.monthes.updateMonth(m);
    },
    removeSpend: function ( model ) {
        console.log("Spend removed");
        //update month data
        var m = moment(model.get("date")).format("YYYY-MM");
        app.monthes.updateMonth(m);
    },
    sumSpends: function () {
        var total = 0;
        this.each(function(item){
            total += item.get('spend');
        });

        return total;
    }
});

app.Category = Parse.Object.extend({

    className: "category",

    defaults: function() {
        return {
            name : "",
            count : 0
        }
    }
});

app.CategoryCollection = Parse.Collection.extend({
    model: app.Category,
    fetch: function (options) {
        this.query = new Parse.Query(app.Category).descending("count").limit(10);  //only get first 10 items
        this.query.equalTo("user", app.currentUser);
        Parse.Collection.prototype.fetch.apply(this, arguments);
    },

    countOne: function (name) {
        console.log("count one:"+ name);
        //TODO filter all and count category then save
        var matched = this.find(function(item) { return item.get('name')==name });
        if (matched) {
            matched.set("count", matched.get("count")+1);
        }else {
            matched = new app.Category();
            matched.set("name", name);
            matched.set("count", 1);
            this.add(matched);
        }
        matched.set("user", app.currentUser);
        matched.setACL(new Parse.ACL(app.currentUser));
        matched.save(null, {
                success: function(obj) {
                    console.log(obj);
                },
                error: function(obj, error) {
                    console.warn(error);
                }
        });
    }
});