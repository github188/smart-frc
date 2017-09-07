define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	var html = require("text!./statistics.html");
	var Button = require("cloud/components/button");
	var goodsCountChart = require("./goodsCount");
	var goodsAmountChart = require("./goodsAmount");
	var goodsTypeCountChart = require("./goodsTypeCount");
	var goodsTypeAmountChart = require("./goodsTypeAmount");
	var goodsTypeTable = require("./table/type/content");
	var goodsTable = require("./table/goods/content");
	var service = require("../service");
	require("../css/style.css");
	var statistics = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.element.html(html);
			locale.render(this.element);
			this.space = 1;
			this.service = new service();
			this.elements = {
				time : {
					id : "goods_statistics_time"
				},
				trade_bar : {
					id : "goods_statistics_all"
				}
			};
			this.render();
		},
		render:function(){
			this.initTimeDiv();
			cloud.util.mask("#goods_statistics_all");
			$("#day").css("color","#459ae9");
			$("#month").css("color","#222");
			$("#year").css("color","#222");
			this.initStaDayChart();
			this.initTable();
			
			$("#goods_statistics_all").css("height",($("#col_slide_main").height() - $(".main_hd").height() -35));
		},
		initTimeDiv:function(){
			var self = this;
			var html = '<div class="sub_menu1">'+
	         			//'<div style="float:left; width: 60px;"><strong class="time_lable">'+locale.get({lang:"statistic_time"})+'</strong></div>'+
		               	  '<div style="float:left; width: 60px;"></div>'+		       
			                 '<div class="date-section cf" id="short_opt" style="display: block;">'+
				                 '<ul id="toolbar" class="select cf">'+
				                 '<li style="float: left;"><a id="day">'+locale.get({lang:"day"})+'</a></li>'+
				                 '<li style="float: left;"><a id="month">'+locale.get({lang:"month"})+'</a></li>'+
				                 '<li style="float: left;"><a id="year">'+locale.get({lang:"year"})+'</a></li>'+
				                 '</ul>'+
				             '</div>'+
					     '</div>';
			$("#"+self.elements.time.id).append(html);
			$("#goods_statistics_tabs").tabs();
			$("#tabs-type-statistics").click(function(){
				$("#goods_type_statistics_detail_table").css("height",$("#goods_type_sta_list_table-table").height()+$("#goods_type_sta_list_paging").height());
			});
			$("#tabs-goods-statistics").click(function(){
				$("#goods_statistics_detail_table").css("height",$("#goods_sta_list_table-table").height()+$("#goods_sta_list_paging").height());
			});
			$("#day").click(function(){
				$("#day").css("color","#459ae9");
				$("#month").css("color","#222");
				$("#year").css("color","#222");
				cloud.util.mask("#goods_statistics_all");
				self.initStaDayChart();
			});
			$("#month").click(function(){
				$("#day").css("color","#222");
				$("#month").css("color","#459ae9");
				$("#year").css("color","#222");
				cloud.util.mask("#goods_statistics_all");
				self.initStaMonthChart();
			});
			$("#year").click(function(){
				$("#day").css("color","#222");
				$("#month").css("color","#222");
				$("#year").css("color","#459ae9");
				cloud.util.mask("#goods_statistics_all");
				self.initStaYearChart();
			});
			$("#goods_statistics_detail_table").css("height",10+$("#goods_sta_list_table-table").height()+$(".paging-page-box").height());
		},
		initStaDayChart:function(){
			var self = this;
			var xAxis = new Array();
			var top = 10;
			var type = 1;
			self.service.getGoodsStatistic(type,top,function(data1){
				self.service.getGoodsTypeStatistic(type,top,function(data2){
					self.initDataToChartData(data1.result,1);
					self.initDataToChartData(data2.result,2);
					self.initTable();
					cloud.util.unmask("#goods_statistics_all");
				},self);
			},self);
			//self.fillChartData();
		},
		initStaMonthChart:function(){
			var self = this;
			var xAxis = new Array();
			var top = 10;
			var type = 2;
			self.service.getGoodsStatistic(type,top,function(data1){
				self.service.getGoodsTypeStatistic(type,top,function(data2){
					self.initDataToChartData(data1.result,1);
					self.initDataToChartData(data2.result,2);
					self.initTable();
					cloud.util.unmask("#goods_statistics_all");
				},self);
			},self);
		},
		initStaYearChart:function(){
			var self = this;
			var xAxis = new Array();
			var top = 10;
			var type = 3;
			self.service.getGoodsStatistic(type,top,function(data1){
				self.service.getGoodsTypeStatistic(type,top,function(data2){
					self.initDataToChartData(data1.result,1);
					self.initDataToChartData(data2.result,2);
					self.initTable();
					cloud.util.unmask("#goods_statistics_all");
				},self);
			},self);
			
		},
		initDataToChartData:function(data,type){
			this.goodsCountArr = {
					xAxis:["","","","","","","","","",""],
					ydata:[null,null,null,null,null,null,null,null,null,null]
			}
			this.goodsAmountArr = {
					xAxis:["","","","","","","","","",""],
					ydata:[null,null,null,null,null,null,null,null,null,null]
			}
			this.goodsTypeCountArr = {
					xAxis:["","","","","","","","","",""],
					ydata:[null,null,null,null,null,null,null,null,null,null]
			}
			this.goodsTypeAmountArr = {
					xAxis:["","","","","","","","","",""],
					ydata:[null,null,null,null,null,null,null,null,null,null]
			}
			if(data.amount&&data.amount.length>0){
				for(var i = 0;i<data.amount.length;i++){
					if(type == 1){
						this.goodsAmountArr.xAxis[i] = data.amount[i].goodsName;
						this.goodsAmountArr.ydata[i] = data.amount[i].amount/100;
					}
					if(type == 2){
						this.goodsTypeAmountArr.xAxis[i] = data.amount[i].goodsTypeName;
						this.goodsTypeAmountArr.ydata[i] = data.amount[i].amount/100;
					}
					if(type == 1&&i == data.amount.length-1){
						var j = i+1;
						if(j<10){
							for(j = i+1;j<10;j++){
								this.goodsAmountArr.xAxis[j] = "";
								this.goodsAmountArr.ydata[j] = null;
								if(j == 9){
									this.fillGoodsAmountData();
								}
							}
						}else{
							this.fillGoodsAmountData();
						}
					}
					if(type == 2&&i == data.amount.length-1){
						var j = i+1;
						if(j<10){
							for(j = i+1;j<10;j++){
								this.goodsTypeAmountArr.xAxis[j] = "";
								this.goodsTypeAmountArr.ydata[j] = null;
								if(j == 9){
									this.fillGoodsTypeAmountData();
								}
							}
						}else{
							this.fillGoodsTypeAmountData();
						}
						
					}
				}
			}else{
				if(type == 1){
					this.fillGoodsAmountData();
				}
				if(type == 2){
					this.fillGoodsTypeAmountData();
				}
			}
			
			
			if(data.count&&data.count.length>0){
				for(var i = 0;i<data.count.length;i++){
					if(type == 1){
						this.goodsCountArr.xAxis[i] = data.count[i].goodsName;
						this.goodsCountArr.ydata[i] = data.count[i].sum;
					}
					if(type == 2){
						this.goodsTypeCountArr.xAxis[i] = data.count[i].goodsTypeName;
						this.goodsTypeCountArr.ydata[i] = data.count[i].sum;
					}
					if(type == 1&&i == data.count.length-1){
						var j = i+1;
						if(j<10){
							for(j = i+1;j<10;j++){
								this.goodsCountArr.xAxis[j] = "";
								this.goodsCountArr.ydata[j] = null;
								if(j == 9){
									this.fillGoodsCountData();
								}
							}
						}else{
							this.fillGoodsCountData();
						}
					}
					if(type == 2&&i == data.count.length-1){
						var j = i+1;
						if(j<10){
							for(j = i+1;j<10;j++){
								this.goodsTypeCountArr.xAxis[j] = "";
								this.goodsTypeCountArr.ydata[j] = null;
								if(j == 9){
									this.fillGoodsTypeCountData();
								}
							}
						}else{
							this.fillGoodsTypeCountData();
						}
						
					}
				}
			}else{
				if(type == 1){
					this.fillGoodsCountData();
				}
				if(type == 2){
					this.fillGoodsTypeCountData();
				}
			}
			
		},
		fillChartData:function(){
			var self = this;
			self.fillGoodsCountData();
			self.fillGoodsAmountData();
			self.fillGoodsTypeCountData();
			self.fillGoodsTypeAmountData();
		},
		fillGoodsCountData:function(){
			var self = this;
			if(this.goodsCountChart){
				this.goodsCountChart.setData(self.goodsCountArr);
			}else{
				this.goodsCountChart = new goodsCountChart({
					"container":"#goods_statistics_count",
					"data":self.goodsCountArr,
					 events:{
						"refreshDay":function(){
							self.initStaDayChart();
							self.goodsCountChart.setData(self.goodsCountArr);
						},
						"refreshMonth":function(data){
							self.initStaMonthChart();
							self.goodsCountChart.setData(self.goodsCountArr);
						}
						,
						"refreshYear":function(data){
							self.initStaYearChart();
							self.goodsCountChart.setData(self.goodsCountArr);
						}
					}
				});
			}
		},
		fillGoodsAmountData:function(){
			var self = this;
			if(this.goodsAmountChart){
				this.goodsAmountChart.setData(self.goodsAmountArr);
			}else{
				this.goodsAmountChart = new goodsAmountChart({
					"container":"#goods_statistics_money",
					"data":self.goodsAmountArr,
					 events:{
						"refreshDay":function(){
							self.initStaDayChart();
							self.goodsAmountChart.setData(self.goodsAmountArr);
						},
						"refreshMonth":function(data){
							self.initStaMonthChart();
							self.goodsAmountChart.setData(self.goodsAmountArr);
						}
						,
						"refreshYear":function(data){
							self.initStaYearChart();
							self.goodsAmountChart.setData(self.goodsAmountArr);
						}
					}
				});
			}
		},
		fillGoodsTypeCountData:function(){
			var self = this;
			if(this.goodsTypeCountChart){
				this.goodsTypeCountChart.setData(self.goodsTypeCountArr);
			}else{
				this.goodsTypeCountChart = new goodsTypeCountChart({
					"container":"#type_statistics_count",
					"data":self.goodsTypeCountArr,
					 events:{
						"refreshDay":function(){
							self.initStaDayChart();
							self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
						},
						"refreshMonth":function(data){
							self.initStaMonthChart();
							self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
						}
						,
						"refreshYear":function(data){
							self.initStaYearChart();
							self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
						}
					}
				});
			}
		},
		fillGoodsTypeAmountData:function(){
			var self = this;
			if(this.goodsTypeAmountChart){
				this.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
			}else{
				this.goodsTypeAmountChart = new goodsTypeAmountChart({
					"container":"#type_statistics_money",
					"data":self.goodsTypeAmountArr,
					 events:{
						"refreshDay":function(){
							self.initStaDayChart();
							self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
						},
						"refreshMonth":function(data){
							self.initStaMonthChart();
							self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
						}
						,
						"refreshYear":function(data){
							self.initStaYearChart();
							self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
						}
					}
				});
			}
		},
		initTable:function(){
			$("#goods_statistics_detail_table").html("");
			$("#goods_type_statistics_detail_table").html("");
			this.goodsTable = new goodsTable({
				"container":"#goods_statistics_detail_table"
			});
			this.goodsTypeTable = new goodsTypeTable({
				"container":"#goods_type_statistics_detail_table"
			});
			$("#goods_statistics_detail_table").css("height",$("#goods_sta_list_table-table").height()+$("#goods_sta_list_paging").height());
			$("#goods_type_statistics_detail_table").css("height",$("#goods_type_sta_list_table-table").height()+$("#goods_type_sta_list_paging").height());
		}
	});
	return statistics;
});