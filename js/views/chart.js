app.ChartView = Backbone.View.extend({
    tagName: "div",

    template: _.template($('#chart-template').html()),

    initialize: function (options) {
    	this.type = options.type;
    },

    render: function() {

        this.$el.html(this.template({type: this.type}));
        return this;
    },

    draw: function() {
        if (this.type=='pie') {
            this.pieChartWithMonth();
        }
    },

    pieChartWithMonth: function() {

        var options = {
            chart: {
                renderTo: 'chartContainer',
                type: 'pie',
            },
            colors: [
                   '#4572A7', 
                   '#AA4643', 
                   '#89A54E', 
                   '#80699B', 
                   '#3D96AE', 
                   '#DB843D', 
                   '#92A8CD', 
                   '#A47D7C', 
                   '#B5CA92'
            ],
            title: {
                text: ''
            },
            subtitle: {
                text: ' '
            },

            tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} RMB</b>',
                    percentageDecimals: 1
            },

            plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*100)/100 +' %';
                            }
                        }
                    }
            },
            credits: {
                enabled: false
            },
        };

        options.series = [];
        var categories = {};
        var total = 0;
        app.activeSpendCollection.each(function (item) {
            var c = item.get('category');
            if ( typeof categories[c] === 'undefined') {
                categories[c] = 0;
            }
            categories[c] += parseInt(item.get('spend'));
            total += parseInt(item.get('spend'));
        });

        var series = [];
        $.each(categories, function(cat, val){
            series.push([cat, val]);
        });

        options.series.push({ type:'pie', name:'spends', data: series });
        chart = new Highcharts.Chart(options);
        chart.redraw();


    },

});