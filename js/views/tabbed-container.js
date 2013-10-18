app.TabbedContainer = Backbone.View.extend({

	tagName: "div",
    className: "tabbable",

    template: _.template($('#tabbed-container-template').html()),

	events: {
        "click li.tab":"changeTab"
	},

	initialize: function () {
        
        //this.listenTo(app.monthes, 'all', this.render);
        //this.listenTo(app.monthes, 'add', this.monthSpendUpdated);
        this.listenTo(app.monthes, 'change', this.monthSpendUpdated);

    },

    render: function () {

        //console.log("monthes:"+app.monthes.length);

        if (app.monthes.length<=0) {
            return this;
        }

        if(this.$('li.active').length<=0) {
            this.$el.html(this.template({tabs: app.monthes.toJSON()}));
            this.$('li').last().addClass("active");
        }

        this.tab_content = this.$('#tab-content');

        //clean old tab content
        this.tab_content.html('');

        //fetch days collection for active month
        var active_month = this.$('li.active').last().attr("date");

        //fetch spend data
        var thisView = this;
        app.activeSpendCollection.fetch({
            month:active_month, 
            success: function(collection) {
                thisView.renderDays(active_month);
                app.monthes.updateMonth(active_month);
            },
            error: function (collection, error) {
                console.warn("fetch app.activeSpendCollection failed.");
            }
        });

        return this;
    },

    renderDays: function (active_month) {

        //console.log("fetched:"+app.activeSpendCollection.length+" rows");

        //fill content of days
        var month_start_date = moment(active_month + "-01", "YYYY-MM-DD");
        var month_end_date = null;
        if(active_month == moment().format("YYYY-MM")) {    //判断是否当前月
            month_end_date = moment(active_month + "-"+moment().format("DD"), "YYYY-MM-DD");
        }else {
            month_end_date = month_start_date.clone();;
            month_end_date.endOf("month");
        }
        
        //console.log("start:"+month_start_date.format("YYYY-MM-DD")+", end:"+month_end_date.format("YYYY-MM-DD"));
        //GET ALL THIS MONTH DAY DATA
        for (var i = 0; i <= 31; i++) {
            var next_day = month_start_date.clone();
            next_day.add("days", i);
            if (next_day.isAfter(month_end_date)) { break; }
            
            var dayView = new app.DayView({date:next_day});
            this.tab_content.append(dayView.render().el);
        };
    },

    /* event handlers */
    changeTab: function (event) {

        this.$('li').removeClass("active");

        var target = $(event.currentTarget);
        target.addClass("active");

        this.render();
    },

    monthSpendUpdated: function(model) {
        var month_total = model.get('spend');
        this.$('li.active span').html(month_total);
    }

});