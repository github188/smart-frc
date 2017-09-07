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
            this.setData(options.data);
        },
        _render:function(){
            var self = this;
            var width = this.element.width;
            var height = $("#trade_statistics_trade").height();
            this.element.addClass("weightContainer");
            this.element.addClass("pay_style_pie");
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("pay_style_money_proportion"),
                width : width,
                height:200
            });
            $(".pay_style_pie").css("width",$("#trade_statistics_pay_status").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent:function(){
        	var self = this;
            var html = "<div class='pay_style_pie'>" +          
                			"<div class='pay_style_pie_content' id='pay_style_pie' style='height:270px;'></div>" +
                		"</div>";
            this.dialogContent.html(html);     
            $('.weight-toolbar-zoomout').remove();
            /*$(".pay_style_pie .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
            	cloud.util.mask(self.dialogContent);
            	self.getData();
            });*/
            $(".pay_style_pie .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
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
        	this.pie = this.element.find("#pay_style_pie").highcharts();
        	this.pie.series[0].setData(data);
        },
        _renderPie:function(){
    		$("#pay_style_pie").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                credits : {
                    enabled : false
                },
                exporting:{
                    enabled:false
                },
                colors: ['#50B432', '#DDDF00', '#ED561B','#058DC7'],
                title: {
                    text: "",
                    verticalAlign:'bottom',
                    y:12
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
                    name:locale.get({lang:"transaction_amount"})+locale.get({lang:"automat_percent"}),
                    data:[]
                }]
            });
    	}
    });
    return tradePayStylePie;
});