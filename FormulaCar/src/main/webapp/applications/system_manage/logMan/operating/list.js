define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var dateConvertor = function(name, type, data) {
		if ("display" == type) {
			return cloud.util.dateFormat(new Date(parseInt(name)), "yyyy-MM-dd hh:mm:ss");
		} else {
			return name;
		}
	};
	var opLevel = function(name, type, data){
		if ("display" === type) {
			var reInfo;
			switch (name) {
			case 2:
				reInfo = locale.get({lang:"debug"});
				reInfo="<img src='system_manage/logMan/operating/imgs/log-level-3.png' />"+"\t\t"+reInfo;
				break;
			case 3:
				reInfo = locale.get({lang:"info"});
				reInfo="<img src='system_manage/logMan/operating/imgs/log-level-2.png' />"+"\t\t"+reInfo;
				break;
			case 4:
				reInfo = locale.get({lang:"alert"});
				reInfo="<img src='system_manage/logMan/operating/imgs/log-level-4.png' />"+"\t\t"+reInfo;
				break;
			case 5:
				reInfo = locale.get({lang:"error"});
				reInfo="<img src='system_manage/logMan/operating/imgs/log-level-5.png' />"+"\t\t"+reInfo;
				break;
			case 6:
				reInfo = locale.get({lang:"serious_error"});
				reInfo="<img src='system_manage/logMan/operating/imgs/log-level-6.png' />"+"\t\t"+reInfo;
				break;
			}
			return reInfo;
		}else{
			name="<img src='system_manage/logMan/operating/imgs/log-level-1.png' />"+"\t\t"+name;
			return name;
		}
	};
	var columns = [
 {
     "title":locale.get({lang:"level"}),
     "dataIndex": "level",
     "cls": "oplevel",
     "width": "10%",
     render:opLevel
 },
 {
	 "title":locale.get({lang:"content"}),
     "dataIndex": "content",
     "cls": "content",
     "width": "40%"
 },
	{
	    "title":locale.get({lang:"ip_address"}),
		"dataIndex": "ip",
		"cls": "ipAddr",
		"width": "15%"
	},
	{
		"title":locale.get({lang:"operator"}),
		"dataIndex": "username",
		"cls": "username",
		"width": "20%"
	},
	{
		"title":locale.get({lang:"time"}),
		"dataIndex": "timestamp",
		"cls": "time",
		"width": "15%",
		render:dateConvertor
	},
	{
		"title": "Id",
		"dataIndex": "_id",
		"cls": "_id" + " "+"hide"
	}
 ];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "content-bar",
					"class" : null
				},
				table : {
					id : "content-table",
					"class" : null
				},
				paging : {
					id : "content-paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			
			$("#content").css("width",$(".wrap").width());
			$("#content-paging").css("width",$(".wrap").width());
			$("#content").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#content").height();
		    var barHeight = $("#content-bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#content-table").css("height",tableHeight);
			
			this._renderNoticeBar();
			this._renderTable();
			
		    
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#content-table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			var height = $("#content-table").height()+"px";
	        $("#content-table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			cloud.util.mask("#content-table");
			var self = this;
			var pageDisplay = this.display;
			var start = new Date($( "#startTime" ).val()).getTime() / 1000;
			var end = new Date($( "#endTime" ).val()).getTime() / 1000;
			this.opt = {arr:[1,2,3,4,5,6],startTime:start,endTime:end};
			Service.getBehaveLogs(this.opt,0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.length;
		        data.total = total;
		        self.listTable.render(data);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#content-table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#content-paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#content-table");
	        				var start = new Date($( "#startTime" ).val()).getTime() / 1000;
	        				var end = new Date($( "#endTime" ).val()).getTime() / 1000;
	        				var opt = {arr:[1,2,3,4,5,6],startTime:start,endTime:end};
	        				Service.getBehaveLogs(opt, options.cursor, options.limit, function(data){
	    						callback(data);
	    						cloud.util.unmask("#content-table");
	    					});

	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.length;
	        			    self.listTable.clearTableData();
	        			    self.listTable.render(data);
	        				self.nowPage = parseInt(nowPage);
	        			},
	        			events : {
	        			    "displayChanged" : function(display){
	        			        self.display = parseInt(display);
	        			    }
	        			}
	        		});
	        		this.nowPage = start;
	        	}
	        },    
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#content-bar",
				events : {
					  query: function(obj){//查询
						    var pageDisplay = self.display;
							var start = obj.startTime;
							var end = obj.endTime;
							cloud.util.mask("#content-table");
							this.opt1 = {arr:[1,2,3,4,5,6],startTime:start,endTime:end};
							Service.getBehaveLogs(this.opt1,0, pageDisplay,function(data) {
								var total = data.total;
								this.totalCount = data.length;
						        data.total = total;
						        self.listTable.render(data);
						        self._renderpage(data, 1);
						        cloud.util.unmask("#content-table");
							});
					  }
					}
			});
		},
		getSelectedResources:function(){
        	var self = this;
        	var selectedRes = $A();
        	self.listTable && self.listTable.getSelectedRows().each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return list;
});