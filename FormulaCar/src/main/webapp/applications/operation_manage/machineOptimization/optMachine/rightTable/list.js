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
	
	var columns = [/*{
        "title": locale.get({lang: "numbers"}),
        "dataIndex": "deviceId",
        "cls": null,
        "width": "28%"
    },*/{
        "title": locale.get({lang: "slot"}),
        "dataIndex": "locationId",
        "cls": null,
        "width": "25%"
    },{
        "title": locale.get({lang: "shelf_goods_name"}),
        "dataIndex": "goodsName",
        "cls": null,
        "width": "25%"
    },{
		"title":locale.get({lang:"shelf_platformsalenum"}),//销量
		"dataIndex" : "count",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"sales_amount"}),//销售额
		"dataIndex" : "cost",
		"cls" : null,
		"width" : "25%",
        render:function(data, type, row){
        	var nums =  (data + "").split("/");
        	if(nums.length == 1)
        	{
        		return data/100;
        	}
        	else {
        		return nums[0]/100 + "/" + nums[1]/100;
        	}
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
			this.getOptimizationByMachine(options);
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
						self.getOptimizationByMachine(searchData);
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
		getOptimizationByMachine : function(searchData) {
			cloud.util.mask("#shelf_right");
			var self = this;
			Service.getOptimizationByMachine(searchData,function(data){
				if(data.result.length > 0){
					//计算rank
					self.rank(data.result);
					//按货道排序
					data.result.sort(self.compare('locationId', true))
				}
				self.listTable.render(data.result);
				cloud.util.unmask("#shelf_right");
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
			for(var i = 0; i < data.length; i++){
				var count = data[i].count;
				if(count.indexOf("/") != -1){
					var arr = count.split("/");
					var sum = 0;
					for(var j = 0; j < arr.length; j++){
						sum += parseInt(arr[j])
					}
					count = sum;
				}
				data[i].newCount = count;
			}
			data.sort(self.compare('newCount'), false)
			
			var len = data.length;
			var prev = data[0].newCount;
			var rank = 1;
			for(var i = 0; i < len; i++){
				if(prev != data[i].newCount){
					rank += 1;
					prev = data[i].newCount;
				}
				data[i].rank = rank;
			}
		}
	});
	return list;
});