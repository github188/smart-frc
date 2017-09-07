define(function(require) {
    var DashBoard = require("../../../components/dashweight/dashboard");
    var COLOR = Highcharts.getOptions().colors[4];
    var Service = require('../service');

    var goodsCountBar = Class.create(cloud.Component, {
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
            this.element.addClass("goods_count_sta");
            this.dialog = new DashBoard({
                selector: this.element,
                title: locale.get("racing_number"),
                width: width
            });
            $(".goods_count_sta").css("width", $("#goods_statistics_count").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent: function() {
            var self = this;
            var html = "<div class='goods_count'>" +
                "<div class='goods_count_content' id='goods_count_bar_sta' style='height:300px;'></div>" +
                "</div>";
            this.dialogContent.html(html);
            $('.weight-toolbar-zoomout').remove();
            /*$(".goods_count_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
                cloud.util.mask(self.dialogContent);
                self.getData();
            });*/
            $(".goods_count_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
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
            this.chart = this.element.find("#goods_count_bar_sta").highcharts();
            self.chart.xAxis[0].setCategories(data.xAxis);
            if (data.ydata.length) {
                var result = data.ydata;
                var volumesChart = self.chart.get("goods_count_bar_sta");
                if (volumesChart) {
                    volumesChart.setData(result);
                } else {
                    self.chart.addSeries({
                        id: "goods_count_bar_sta",
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
                            valueSuffix: locale.get("ren")
                        }
                    });
                }
            }
        },

        renderChart: function() {
            this.element.find("#goods_count_bar_sta").highcharts({
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
                rangeSelector: {
                    enabled: false
                },
                scrollbar: {
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
                    gridLineWidth: 0,
                    plotOptions: {
                        bar: {
                            stacking: 'normal'
                        }
                    },
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    data: []
                }]
            });

        },
        destroy: function($super) {
            $super();
        }
    });

    return goodsCountBar;
});