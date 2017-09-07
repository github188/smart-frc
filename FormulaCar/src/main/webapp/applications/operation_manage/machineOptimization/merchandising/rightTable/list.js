define(function(require) {
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var Util = require("../../util");
	
	var columns = [{
        "title": locale.get({lang: "imageGridTitle"}),
        "dataIndex": "imagepath",
        "cls": null,
        "width": "15%",
        render:function(data, type, row){
			    var productsImage = locale.get({lang:"products"});
			    var  display = "";
			    if(data){
			    	var src = cloud.config.FILE_SERVER_URL + "/api/file/" +data + "?access_token=" + cloud.Ajax.getAccessToken();
	                display += new Template(
	                    "<img src='"+src+"' style='width: 20px;height: 60px;'/>")
	                    .evaluate({
	                        status : productsImage
	                    });
			    }
            return display;
        }
    },{
        "title": locale.get({lang: "shelf_goods_name"}),
        "dataIndex": "goodsName",
        "cls": null,
        "width": "25%"
    },{
        "title": locale.get({lang: "slot"}),
        "dataIndex": "locationId",
        "cls": null,
        "width": "20%"
    },{
		"title":locale.get({lang:"shelf_platformsalenum"}),//销量
		"dataIndex" : "count",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"sales_amount"}),//销售额
		"dataIndex" : "cost",
		"cls" : null,
		"width" : "20%",
        render:function(data, type, row){
        	return data/100;
        }
	},{
		"title":locale.get({lang:"rank"}),//排名
		"dataIndex" : "rank",
		"cls" : null,
		"width" : "25%"
	}];
	
	
	var list = Class.create(cloud.Component,{
		initialize : function($super, options) {
			$super(options);
			this.element.html(html);
			this.elements = {
				bar : {
					id : "opt_list_bar",
					"class" : null
				},
				table : {
					id : "opt_list_table",
					"class" : null
				}
			};
			this._renderNoticeBar();
			this._renderTable();
			this._defaultQuery(options.defaultArgs);
		},
		_defaultQuery: function(options){
			this.assetId = options.assetId;
			options.days = $("#days").val();
			this.getMerchandisingList(options);
		},
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#opt_list_bar",
				events : {
					query : function() {
						var searchData= {};
						searchData.assetId = self.assetId;
						searchData.days = $("#days").val();
						self.getMerchandisingList(searchData);
					},

				}
			});
			$("#days").bind("keydown", Util.numberLimit);
		},
		_renderTable: function() {
        	var self = this;
            this.listTable = new Table({
                selector: "#opt_list_table",
                columns: columns,
                datas: [],
                pageSize: 30,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "none",
                events: {
                    onRowClick: function(data) { 
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                    },
                    onRowRendered: function(tr, data, index) {
                    },
                    scope: this
                }
            });
        },
        getMerchandisingList : function(searchData) {
			cloud.util.mask("#shelf_right");
			var self = this;
			Service.getMerchandisingList(searchData,function(data){
				var result = data.result;
				if(data.result.length > 0){
					//计算rank
					self.rank(data.result);
					//按商品名称排序
					data.result.sort(self.compare('goodsName', true))
				}
				self.listTable.render(result);
				cloud.util.unmask("#shelf_right");
				var pieData = [];
				for(var i = 0; i < result.length; i++){
					var obj = {};
					obj.name = result[i].goodsName;
					obj.y = result[i].count;
					if(i == 0) {
						obj.sliced = true;
						obj.selected = true;
					}
					pieData.push(obj);
				}
				if(pieData.length > 0){
					var series = [{
						type : 'pie',
						name : locale.get({lang: "share_percent"}),
						data : pieData
					}];
					self.drawChart(series, searchData.assetId);
				}
				
			});
		},
		stripscript : function(s) {
			var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
			var rs = "";
			for (var i = 0; i < s.length; i++) {
				rs = rs + s.substr(i, 1).replace(pattern, '');
			}
			return rs;
		},
		compare: function(property, sort){//true 升序， false 降序
		    return function(prev, next){
		        var prevVal = prev[property] + "";
		        var nextVal = next[property] + "";
		        if(!isNaN(prevVal) && !isNaN(prevVal)){
		        	return sort?parseInt(prevVal)-parseInt(nextVal):parseInt(nextVal)-parseInt(prevVal);
		        	
		        }
		        return sort?prevVal.localeCompare(nextVal):nextVal.localeCompare(prevVal);
		    }
		},
		rank: function(data) {
			var self = this;
			data.sort(self.compare('count'), false)
			
			var len = data.length;
			var prev = data[0].count;
			var rank = 1;
			for(var i = 0; i < len; i++){
				if(prev != data[i].count){
					rank += 1;
					prev = data[i].count;
				}
				data[i].rank = rank;
			}
		},
		drawChart: function(series, assetId){
			var title = {
				text : locale.get({lang: "consumption"}) + assetId
			};
			var tooltip = {
				pointFormat : '{series.name}: {point.percentage:.1f}%'
			};
			var plotOptions = {
				pie : {
					allowPointSelect : true,
					cursor : 'pointer',
					dataLabels : {
						enabled : true
					},
					showInLegend : true
				}
			};
			
			var json = {};
			json.title = title;
			json.tooltip = tooltip;
			json.series = series;
			json.plotOptions = plotOptions;
			$('#opt_list_chart').highcharts(json); 
			$(".highcharts-button").hide();
			$("#opt_list_chart").css("margin-top",$("#opt_list_table-table").height() + 50);
		}
	});
	return list;
});