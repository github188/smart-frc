define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.layout");
    var Button = require("cloud/components/button");
    var Chart = require("cloud/components/chart");
    require("./content-chart.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    
    var ContentChart = Class.create(cloud.Component, {
        
        initialize: function($super, options) {
            this.moduleName = "content-chart";
            cloud.util.defaults(options, {
            	fixedAxis : false,
            	chart : {
            		type : "spline",//"line", "spline", "column"
            		title : "title",
            		tooltips : {
            			formatter : null,
            			prefix : "",
            			subfix : ""
            		},
            		xAxis : {
            			title : "xAxis",
            			formatter : null
            		},
            		yAxis : {
            			"title" : "yAxis",
            			formatter : null,
            			unit : ""
            		}
            	}
			});
            $super(options);
            this.elements = {
            	content : this.id + "-content", 
                toolbar: this.id + "-toolbar",
                chart: this.id + "-chart",
                startTime:this.id + "-starttime",
                endTime:this.id + "-endtime"
            };
            this.seriesArr = $A();
            
            this.draw();
            
            this._initParams();
        },
        draw : function(){
        	this._drawHtml();
        	this._drawToolbar();
        	this._drawContent();
        },
        _initParams : function(){
        },
        
        _drawHtml: function() {
            var html = "<div id=" + this.elements.content + " class='content-chart-content' style='height : 100%; width:100%'>" +
            	"<div id=" + this.elements.toolbar + " class='content-chart-toolbar'></div>" +
                "<div id=" + this.elements.chart + " class='content-chart-chartplugin'></div>" +
                "</div>";
            this.element.css({
            	width : "100%",
            	height : "100%",
            	overflow : "hidden"
            })
            this.element.append(html);
        },
        _drawToolbar : function(){
        	var self = this;
        	this.toolbar = $("#" + this.elements.toolbar);
        	var panel = $("<span>").addClass("content-chart-toolbar-panel").appendTo(this.toolbar);
        	var panelLeft = $("<span>").attr("id", this.id + "-tbpannel-left").addClass("content-chart-toolbar-panel-left").appendTo(panel);
        	var panelCenter = $("<span>").attr("id", this.id + "-tbpannel-center").addClass("content-chart-toolbar-panel-center").appendTo(panel);
        	var panelRight = $("<span>").attr("id", this.id + "-tbpannel-right").addClass("content-chart-toolbar-panel-right").appendTo(panel);
        	this.drawDatePicker(panelLeft);
        	this.intervalButtons = $A(this.options.intervalButtons);
        },
        
        drawDatePicker : function(container){
            var self = this;
            var inputHtml = "<p style='float:left;line-height: 25px;margin: 0 5px 0 10px;'>"+locale.get({lang:"from"})+"</p>"
            				+"<input style='float:left;width:125px' class='content-chart-toolbar-datepicker datepicker' type='text' readonly='readonly' id="+this.elements.startTime+" />"
            				+"<p style='float:left;line-height: 25px;margin: 0px 5px;'>"+locale.get({lang:"to"})+"</p>"
            				+"<input style='float:left;width:125px' class='content-chart-toolbar-datepicker datepicker' type='text' readonly='readonly' id="+this.elements.endTime+" />";
            container.append(inputHtml);
            var queryButton = new Button({
                container: container,
                id: "queryBtn",
                text: locale.get({lang:"query"}),
                events: {
                    click: function(){
                    	if((new Date($("#"+self.elements.startTime).val())).getTime() > (new Date($("#"+self.elements.endTime).val())).getTime()){
                    		dialog.render({lang:"time_range_error"});
                    		return;
                    	}
                    	var seriesArr = self.seriesArr;
                    	self.removeSeries(seriesArr);
                    	self.addSeries(seriesArr);
                    }
                }
            });
            $("#"+queryButton.id).addClass("readClass");
            $("#"+self.elements.startTime).val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
				format:'Y/m/d H:i',
				step:1,
				startDate:'-1970/01/08',
				lang:locale.current() === 1 ? "en" : "ch"
			})
			
			$("#"+self.elements.endTime).val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
				format:'Y/m/d H:i',
				step:1,
				lang:locale.current() === 1 ? "en" : "ch"
			})
        },
        resizeChart : function(width, height){
        	this.content.resize(width, height);
        },
        _drawContent : function(){
        	var options = this.options;
        	var unit = (options.chart.yAxis && options.chart.yAxis.unit) ? options.chart.yAxis.unit : "";
        	var yAxisFormatter = (options.chart.yAxis && options.chart.yAxis.formatter) ? options.chart.yAxis.formatter : null;
        	var xAxisFormatter = (options.chart.xAxis && options.chart.xAxis.formatter) ? options.chart.xAxis.formatter : null;
        	var tipsFormatter = (options.chart.tooltips && options.chart.tooltips.formatter) ? options.chart.tooltips.formatter : null;
        	
        	this.content = new Chart({
        		container : "#" + this.elements.chart,
        		pluginOpts : {
        			title : {
        				text: options.chart.title
        			},
        			chart: {
		                type: "spline"
		            },
		            tooltip: {
		            	formatter : tipsFormatter,
		                xDateFormat: '%Y-%m-%d %H:%M:%S',
		                valuePrefix : options.chart.tooltips ? options.chart.tooltips.prefix : "",
		                valueSuffix : options.chart.tooltips ? options.chart.tooltips.subfix : ""
		            },
		            plotOptions: {
	                    series: {
	                        marker: {
	                            radius: 3,  //曲线点半径，默认是4
	                            symbol: 'diamond' //曲线点类型："circle", "square", "diamond", "triangle","triangle-down"，默认是"circle"
	                        }
	                    }
	                },
		            xAxis: {
		            	title :{
		            		text : options.chart.xAxis ? options.chart.xAxis.title : null
		            	},
		            	dateTimeLabelFormats: {
		                    second: '%H:%M:%S',
		                	minute: '%H:%M',
		                	hour: '%H:%M',
		                	day: '%m-%d',
		                	week: '%m-%d',
		                	month: '%Y-%m',
		                	year: '%Y'
		                },
	                    labels: {
	                    	formatter : xAxisFormatter
	                    },
		            	type : "datetime"
		            },
		            yAxis: {  
		            	max : options.chart.yAxis ? options.chart.yAxis.max : null,
		            	min : options.chart.yAxis ? options.chart.yAxis.min : null,
		            	title :{
		            		text : options.chart.yAxis ? options.chart.yAxis.title : null
		            	},
	                    labels: {
	                        format: '{value}' + unit,
	                        formatter : yAxisFormatter,
	                        step:4
	                    }
	                }
        		}
        	});
        },
        addSeries : function(series){
        	var self = this;
        	var series = cloud.util.makeArray(series);
        	if (series.length > 0){
        		var chartObj = this.content.getChartObject();
            	series.each(function(one){
            		if (!self.seriesArr.pluck("resourceId").include(one.resourceId)){
                		chartObj.addSeries({
                			id : one.resourceId,
                			name : one.name,
                			step : one.step
                		});
                		self.seriesArr.push(one);
                	}
            	});
            	this.render();
        	}
        },
        removeSeries : function(seriesId){
        	var self = this;
        	var seriesIds = $A();
        	if (seriesId){
        		seriesIds = cloud.util.makeArray(seriesId);
        	}else{
        		seriesIds = this.seriesArr.pluck("resourceId");
        	}
        	
        	var chartObj = this.content.getChartObject();
        	seriesIds.each(function(one){
        		var serieObj = chartObj.get(one);
        		serieObj && serieObj.remove();
        		var serie = self.seriesArr.find(function(serOne){
        			if (serOne.resourceId == one){
        				return true;
        			}else{
        				return false;
        			}
        		});
        		self.seriesArr = self.seriesArr.without(serie);
        	});
        }, 
        render : function(){
        	var self = this;
        	var chartObj = this.content.getChartObject();
        	var service = this.options.service;
        	var type = this.options.type;
        	var startTime = (new Date($("#"+self.elements.startTime).val())).getTime();
        	var endTime = (new Date($("#"+self.elements.endTime).val())).getTime();
        	if ((this.options.fixedAxis) && chartObj){
        		chartObj.xAxis[0].setExtremes(startTime, endTime);
        	}
        	service.loadChartByResIds(this.seriesArr.pluck("resourceId"), startTime/1000, endTime/1000, function(result){
        		
        		$A(result).each(function(one){
            			var serie = chartObj.get(one.resourceId);
            			serie && serie.setData(one.data);
            		});
            }, this)
        	
        },
		destroy: function($super){
			this.content && this.content.destroy();
			this.content = null;
			this.elements = null;
			this.seriesArr = null;
			$super();
		}
    });

    return ContentChart;

});