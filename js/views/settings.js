app.SettingsView = Backbone.View.extend({
    tagName: "div",

    template: _.template($('#settings-template').html()),

    events: {
        "click #importbutton": "importAction",
    },

    initialize: function (options) {
    	//
    },

    render: function() {

        this.$el.html(this.template({currentUser:app.currentUser}));
        return this;
    },

    importAction: function() {
        var o = JSON.parse($('#importdata').val());
        _.each(o, function(item){
            
            var spend = new app.Spend();
            spend.set("category", item.category);
            spend.set("date", item.spendDatetime);
            spend.set("memo", item.memo);
            spend.set("spend", parseInt(item.number));
            spend.set("user", app.currentUser);
            spend.setACL(new Parse.ACL(app.currentUser));
            
            spend.save(null, {
                success: function(obj) {
                    console.log("")
                },
                error: function(obj, error) {
                    console.log(error)
                }
            });

        });
    },

});