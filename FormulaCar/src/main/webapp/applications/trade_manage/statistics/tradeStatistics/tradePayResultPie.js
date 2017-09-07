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
            this._renderPie();
            this.setData();
        },
        _render:function(){
            var self = this;
            var width = this.element.width;
            this.element.addClass("weightContainer");
            this.element.addClass("pay_result_pie");
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("pay_result_money_proportion"),
                width : width
            });
            $(".pay_result_pie").css("width",$("#trade_statistics_pay_style").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent:function(){
        	var self = this;
            var html = "<div class='pay_result_pie'>" +          
                			"<div class='pay_result_pie_content' id='pay_result_pie' style='height:270px;'></div>" +
                		"</div>";
            this.dialogContent.html(html);     
            $('.weight-toolbar-zoomout').remove();
           /* $(".pay_result_pie .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
            	cloud.util.mask(self.dialogContent);
            	self.getData();
            });*/
            $(".pay_result_pie .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
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
        setData:function(){
        	 var data = [
					{
					    name: 'Firefox',
					    y: 45.0,
					    sliced: false,
					    selected: false
					},{
					    name: 'IE',
					    y:  26.8,
					    sliced: false,
					    selected: false
					},{
					    name: 'Safari',
					    y: 8.5,
					    sliced: false,
					    selected: false
					},{
					    name: 'Chrome',
					    y: 12.8,
					    sliced: true,
					    selected: true
					},{
					    name: 'Opera',
					    y: 6.2,
					    sliced: true,
					    selected: true
					},{
					    name: 'Others',
					    y: 0.7,
					    sliced: false,
					    selected: false
					}
            ];
        	this.pie = this.element.find("#pay_result_pie").highcharts();
        	this.pie.series[0].setData(data);
        },
        _renderPie:function(){
    		$("#pay_result_pie").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                credits : {
                    enabled : false
                },
                title: {
                    text: "",
                    verticalAlign:'bottom',
                    y:12
                },
                exporting:{
                    enabled:false
                },
                tooltip: {
            	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                	pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        showInLegend: true,
                        size:155
                    }
                },
                legend:{
                    y:-10
                },
                series: [{
                    type: 'pie',
                    data:[]
                }]
            });
    	}
    });
    return tradePayStylePie;
});