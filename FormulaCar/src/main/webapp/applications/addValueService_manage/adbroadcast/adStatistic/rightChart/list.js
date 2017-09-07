define(function(require) {
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var list = Class.create(cloud.Component,{
		initialize : function($super, options) {
			$super(options);
			this.element.html(html);
			this.elements = {
				bar : {
					id : "statistic_list_bar",
					"class" : null
				},
				chart : {
					id : "line-chart",
					"class" : null
				}
			};
			this._render();
			this._defaultQuery(options.defaultArgs);
		},
		_defaultQuery: function(options){
			this.assetId = options.assetId;
			this._getStatisticDataByAssetId(options);
		},
		_render : function() {
			this._renderNoticeBar();
		},
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#statistic_list_bar",
				events : {
					query : function() {
						var searchData= {};
						var byDate = "";
			            var byMonth = "";
			            var byYear = "";
			            var startTime = '';
			            var endTime = '';
			            var type = $("#reportType").find("option:selected").val();
			            if (type == "1") {
			                byDate = $("#summary_date").val();//日
			            } else if (type == "2") {
			                byMonth = $("#summary_month").val();//月
			            } else if (type == "3") {
			                byYear = $("#summary_year").val();//年
			            } else if (type == "4") { //自定义
			            	var define_startTime = $("#summary_startTime").val();
			            	var define_endTime = $("#summary_endTime").val();
			                startTime = (new Date(define_startTime)).getTime() / 1000;
			                endTime = (new Date(define_endTime+" 23:59:59")).getTime() / 1000;  
			            }
			            
			            //日报表
			            if (byDate) {
			                startTime = (new Date(byDate + " 00:00:00")).getTime() / 1000;
			                endTime = (new Date(byDate + " 23:59:59")).getTime() / 1000;
			            }
			            //月报表
			            if (byMonth) {
			            	var year = byMonth.split('/')[0];
			            	
			                var months = byMonth.split('/')[1];
			            	var maxday = new Date(year,months,0).getDate();
			            	
			                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
			                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
			                    endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
			                } else if (months == 2) {
			                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
			                    endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime() / 1000;
			                } else {
			                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
			                    endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
			                }
			            }
			            //年报表
			            if (byYear) {
			                startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
			                endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
			            }
						
						searchData.assetId = self.assetId;
						searchData.type = type;
						searchData.startTime = startTime;
						searchData.endTime = endTime;
						var date = new Date();
						searchData.offset = 0 - (date.getTimezoneOffset()*60*1000);
						self._getStatisticDataByAssetId(searchData);
					},

				}
			});
		},
		_getStatisticDataByAssetId : function(searchData) {
			var self = this;
			var type = searchData.type;
			var newTimes = [];
			var map = {};
			if (type == "1") {//日
				newTimes = [ "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", 
							 "6:00", "7:00", "8:00", "9:00", "10:00", "11:00",
							 "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
							 "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
            } else if (type == "2") {//月
            	var date = cloud.util.dateFormat(new Date(searchData.startTime), "yyyy/MM/dd", false);
            	var year = date.split('/')[0];
                var months = date.split('/')[1];
            	var maxday = new Date(year,months,0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
                } else if (months == 2) {
                    newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
                    if(maxday > 28){
                    	newTimes[28] = "29";
                    }
                } else {
                    newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
                }
            } else if (type == "3") {//年
            	newTimes = ["1", "2","3","4","5","6","7", "8","9","10","11","12"];
            } else if (type == "4") { //自定义
                //开始时间
                var datas = new Date(searchData.startTime*1000);
                var years = datas.getFullYear();
                var months = datas.getMonth();
                var days = datas.getDate();
                
                //结束时间
                var datae = new Date(searchData.endTime*1000);
                var yeare = datae.getFullYear();
                var monthe = datae.getMonth();
                var daye = datae.getDate();
                
                if(years == yeare){//相同年
                	if(months == monthe){//相同月份
                		for(var i=days;i<=daye;i++){
                			newTimes.push(i+"");
                		}
                	}else{
                		for(var j=months;j<=monthe;j++){//不同月份
                    		var st;
                    		var et
                    		if(j == months){
                    			st = days;
                    			et = new Date(years,j+1,0).getDate();
                    		}else if(j == monthe){
                    			st = 1;
                    			et = daye;
                    		}else{
                    			st = 1;
                    			et = new Date(years,j+1,0).getDate();
                    		}
                    		
                    		map[newTimes.length+""] = years+"/"+(j+1);
                    		//var  maxd = new Date(years,j,0).getDate();
                    		for(var k=st;k<=et;k++){
                    			newTimes.push(k+"");
                    		}
                    	}
                	}
                }else{
                	for(var m=months;m<=11;m++){
                		var st;
                		var et;
                		if(m == months){
                			st = days;
                			et = new Date(years,m+1,0).getDate();
                			
                		}else{
                			st = 1;
                			et = new Date(years,m+1,0).getDate();
                		}
                		map[newTimes.length+""] = years+"/"+(m+1);
                		
                		for(var h=st;h<=et;h++){
                			newTimes.push(h+"");
                		}
                	}
                	for(var n=0;n<=monthe;n++){
                		var st;
                		var et;
                		if(n == monthe){
                			st = 1;
                			et = daye;
                		}else{
                			st = 1;
                			et = new Date(yeare,n+1,0).getDate();
                		}
                		map[newTimes.length+""] = yeare+"/"+(n+1);
                		for(var r=st;r<=et;r++){
                			newTimes.push(r+"");
                		}
                	}
                }
            }

			Service.getAssetStatisticDataByType(searchData, function(data) {
				if (data.result) {
					var totalDurations = data.result.totalDurations;
					var totalNums = data.result.totalNums;
					var title1;
					var title2;
					if(totalDurations.length>0){
						 title1=locale.get({lang:"play_time_curve"});
	                	 title2=locale.get({lang:"play_times_curve"});
					}else{
						 title1 = "";
						 title2 = "";
					}
				
					if(newTimes.length>31){//超出范围显示滚动条
                    	self.renderCustomLineChart(totalDurations,title1, newTimes, map, true);
                    	self.renderCustomLineChart(totalNums,title2, newTimes, map, false);
                    }else{
                    	self.renderLineChart(totalDurations,title1, newTimes, map, true);
                    	self.renderLineChart(totalNums,title2, newTimes, map, false);
                    }
				}
			});
		},
		stripscript : function(s) {
			var pattern = new RegExp(
					"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
			var rs = "";
			for (var i = 0; i < s.length; i++) {
				rs = rs + s.substr(i, 1).replace(pattern, '');
			}
			return rs;
		},
		renderLineChart : function(result,title1, newTimes, map, type) {
			var self = this;
			var valueSuffix = "";
			var $container;
			if(type){
				valueSuffix = locale.get({lang:"second"});//
				$container = $('#line-content');
			}else{
				valueSuffix = locale.get({lang:"adNumsUnit"});
				$container = $('#line-content-num');
			}
			var show = [];
        	for(var i = 0; i< result.length; i++){
        		var line = {
                    	name: result[i].name,
                        type: 'spline',
                        data: result[i].data,
                        tooltip: {
                            valueSuffix: valueSuffix
                        }
                    };
        		show.push(line);
        	}
        	
        	$container.highcharts({
				chart : {
					type : 'line',
					height : 350,
					width : $container.width()
				},
				colors: ['#058DC7', '#50B432', '#ED561B',
                         '#24CBE5', '#64E572', '#FF9655', 
        	             '#FFF263', '#6AF9C4', '#DDDF00'
        	    ],
				// colors: ['#24CBE5', '#458B00'],
				title : {
					text : title1,
				},
				xAxis : {
					categories : newTimes
				},
				yAxis : {
					title : {
						text : ''
					},
					min : 0
				},
				tooltip : {
					/*formatter:function(){
						var value= this.y;
						//self.tipFormat(v);
						return this.series.name+":"+value/60;
					}*/
					shared : true
				},
				series : show
			});

			if (map) {
				var charts = $container.highcharts();
				for (var i in map) {
					charts.xAxis[0].addPlotLine({
						color : 'red', //线的颜色，定义为红色
						dashStyle : 'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
						value : parseInt(i), //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
						width : 2, //标示线的宽度，2px
						label : {
							text : map[i], //标签的内容
							align : 'left', //标签的水平位置
							x : 10, //标签相对于被定位的位置水平偏移的像素，水平居左10px
							style : {
								fontSize : '13px',
								fontFamily : 'Verdana, sans-serif'

							}
						}
					});
				}//添加标示线
			}
		},
		renderCustomLineChart: function(result,title1, newTimes,map, type) {
			var valueSuffix = "";
			var $container;
			if(type){
				valueSuffix = locale.get({lang:"second"});//locale.get({lang:"china_yuan"})
				$container = $('#line-content');
			}else{
				valueSuffix = locale.get({lang:"adNumsUnit"});
				$container = $('#line-content-num');
			}
        	var show = [];
        	for(var i = 0; i< result.length; i++){
        		var line = {
                    	name: result[i].name,
                        type: 'spline',
                        data: result[i].data,
                        tooltip: {
                            valueSuffix: valueSuffix
                        }
                    };
        		show.push(line);
        	}
        	var wid = $container.width();
        	$container.highcharts({
                chart: {
                    type: 'line',
                    height: 350,
                    width: wid
                },
                colors: ['#058DC7', '#50B432', '#ED561B',
                         '#24CBE5', '#64E572', '#FF9655', 
        	             '#FFF263', '#6AF9C4', '#DDDF00'
        	    ],
                title: {
                    text: title1,
                },
                xAxis: {
                    categories: newTimes,
                    max: 31
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                tooltip: {
                    shared: true
                },
                scrollbar: {
                    enabled: true
                },
                series: show
            });
            
            var charts = $container.highcharts();
            for(var i in map) {
            	charts.xAxis[0].addPlotLine(
                		{
                            color:'red',            //线的颜色，定义为红色
                            dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                            value:parseInt(i),                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                            width:2,                //标示线的宽度，2px
                            label:{
                                text:map[i],        //标签的内容
                                align:'left',                //标签的水平位置，水平居左,默认是水平居中center
                                x:10,                        //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                    
                                }
                            }
                        }	
                
                );
            }//添加标示线
            
        },
        tipFormat: function(dataArray){
        	var result = [];
        	for(var i = 0; i< dataArray.length; i++){
        		var data = dataArray[i];
        		if (data > 0) {
        			var display = "";
        			var hour = Math.floor((data / 3600));  
        			var minute = Math.floor((data - hour*3600) / 60);  
        			var second = (data - hour*3600 - minute * 60);
        			var arry = [hour, minute, second];
        			var unit = ["hour", "minute", "second"];
        			//去除高位0，直到不是0为止
        			var flag = false;
        			for(var i =0; i< 3; i++){
        				if (arry[i] > 0 || flag) {
        					display += arry[i] + locale.get({lang:unit[i]});
        					flag = true;
        				}else{
        					flag = false;
        				}
        			}
        			result.push(display);
				}else{
					result.push(0 + locale.get({lang:"second"}));
				}
        	}
    		return result;
        }
	});
	return list;
});