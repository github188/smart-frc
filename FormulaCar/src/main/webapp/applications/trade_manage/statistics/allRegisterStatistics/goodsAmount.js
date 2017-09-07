define(function(require) {
    var DashBoard = require("../../../components/dashweight/dashboard");
    var COLOR = Highcharts.getOptions().colors[4];
    var Service = require('../service');
    require("cloud/lib/plugin/highcharts-3d");
    var goodsAmountBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = new Service();
            this._render();
            this.setContent();
            this.renderChart();
            this.setData(options.data);
        },
        _render: function() {
            var self = this;
            var width = this.element.width;
            this.element.addClass("weightContainer");
            this.element.addClass("goods_amount_sta");
            this.dialog = new DashBoard({
                selector: this.element,
                title: locale.get("racing_times"),
                width: width
            });
            $(".goods_amount_sta").css("width", $("#goods_statistics_money").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent: function() {
            var self = this;
            var html = "<div class='goods_amount'>" +
                "<div class='goods_amount_content' id='goods_amount_bar_sta' style='height:300px;'></div>" +
                "</div>";
            this.dialogContent.html(html);
            $('.weight-toolbar-zoomout').remove();
            /*$(".goods_amount_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
                cloud.util.mask(self.dialogContent);
                self.getData();
            });*/
            $(".goods_amount_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
        },
        getData: function() {
            var self = this;
            if ($("#day").css("color") == "rgb(69, 154, 233)") {
                self.fire("refreshDay");
            }
            if ($("#month").css("color") == "rgb(69, 154, 233)") {
                self.fire("refreshMonth");
            }
            if ($("#year").css("color") == "rgb(69, 154, 233)") {
                self.fire("refreshYear");
            }
        },
        //刷新
        setData: function(data) {
            cloud.util.mask(this.dialogContent);
            var self = this;
            this.chart = this.element.find("#goods_amount_bar_sta").highcharts();
            self.chart.xAxis[0].setCategories(data.xAxis);
            if (data.xAxis.length == 0) {
                self.chart.xAxis[0].setCategories(null);
            }
            if (data.ydata.length) {
                var result = data.ydata;
                var volumesChart = self.chart.get("goods_amount_bar_sta");
                if (volumesChart) {
                    volumesChart.setData(result);
                    if (result.length == 0) {
                        volumesChart.setData(null);
                    }
                } else {
                    self.chart.addSeries({
                        id: "goods_amount_bar_sta",
                        name: locale.get("volumes"),
                        color: COLOR,
                        type: 'column', //柱状图（column）
                        data: result,
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.y;
                            }
                        },
                        tooltip: {
                            valueSuffix: locale.get("times_1")
                        }
                    });
                }
            }
            //cloud.util.unmask(this.dialogContent);
        },

        renderChart: function() {
            this.element.find("#goods_amount_bar_sta").highcharts({
                chart: {
                    renderTo: 'container',
                    type: 'bar',
                    options3d: {
                        enabled: false,
                        alpha: 0,
                        beta: 20,
                        depth: 50,
                        viewDistance: 0
                    }
                },
                title: {
                    text: ''
                },
                navigator: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: [],
                    gridLineWidth: 0
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    bar: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    name: 'Tokyo',
                    data: []

                }]
            });

        },
        destroy: function($super) {
            $super();
        }
    });

    return goodsAmountBar;
});