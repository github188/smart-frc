define(function(require){
    var DashBoard = require("../../../components/dashweight/dashboard");
    var COLOR = Highcharts.getOptions().colors[4];
    var Service = require('../service');
    var tradePayStylePie = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.service = new Service();
            this._render();
            this.setContent();
            this._renderLine();
            this.setData(options.data);
        },
        _render:function(){
            var self = this;
            var width = this.element.width;
            this.element.addClass("weightContainer");
            this.element.addClass("count_amount_trade");
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("amount_count_all_line"),
                width : width
            });
            $(".count_amount_trade").css("width",$("#trade_statistics_line").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent:function(){
        	var self = this;
            var html = "<div class='count_amount_line'>" +          
                			"<div class='count_amount_line_content' id='count_amount_line_chart' style='height:280px;'></div>" +
                		"</div>";
            this.dialogContent.html(html);
            $('.weight-toolbar-zoomout').remove();
           /* $(".count_amount_trade .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
            	cloud.util.mask(self.dialogContent);
            	self.getData();
            });*/
            $(".count_amount_trade .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
        },
        getData:function(){
        	var self = this;
        	if($("#day").css("color") == "rgb(69, 154, 233)"){
        		self.fire("refreshDay");
        	}
			if($("#month").css("color") == "rgb(69, 154, 233)"){
				self.fire("refreshMonth"); 		
			}
			if($("#year").css("color") == "rgb(69, 154, 233)"){
				self.fire("refreshYear"); 	
			}
        },
        setData:function(data){
        	this.chart = this.element.find("#count_amount_line_chart").highcharts();
        	this.chart.xAxis[0].setCategories(data.xAxis);
        	this.chart.series[1].setData(data.ydata2);
        	this.chart.series[0].setData(data.ydata1);
        },
        _renderLine:function(){
        	$("#count_amount_line_chart").highcharts({
        		chart: {
                    zoomType: 'xy'
                },
                exporting:{
                    enabled:false
                },
                title: {
                    text: ''
                },
                credits : {
                    enabled : false
                },
                xAxis: [{
                    categories: []
                }],
                yAxis: [{ // Primary yAxis
                	title: {
                        text: '',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    labels: {
                    	format: '{value} '+locale.get({lang:"times_1"}),
                        style: {
                            color: '#89A54E'
                        }
                    },
                    min:0
                }, { // Secondary yAxis
                	title: {
                        text: '',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    labels: {
                    	//format: '{value}'+locale.get({lang:"ren"}),
                    	format: '{value}',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    min:0,
                    opposite: true
                }],
               
                series: [{
                	name: locale.get("volumes"),
                    color: '#4572A7',
                    type: 'spline',
                    yAxis: 1,
                    data: [],
                    tooltip: {
                        valueSuffix: locale.get({lang:"ren"})
                    },
                	min:0

                }, {
                	name: locale.get("automat_transaction_money"),
                    color: '#89A54E',
                    type: 'spline',
                    data: [],
                    tooltip: {
                        valueSuffix: locale.get({lang:"times_1"})
                    }
                }]                               
            });
    	}
    });
    return tradePayStylePie;
});