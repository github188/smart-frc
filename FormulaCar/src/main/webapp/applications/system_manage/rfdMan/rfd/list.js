define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var _Window = require("cloud/components/window");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("./service");
	
	var columns = [{
		"title":"Rfid",
		"dataIndex": "rfid",
		"width": "30%"
	},
	 {
		"title":"点数",
		"dataIndex": "count",
		"cls": null,
		"width": "30%"
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex": "createTime",
		"cls": null,
		"width": "40%",
		render: dateConvertor
	}];
	var dateConvertor = function(name, type, data) {
		if ("display" == type) {
			return cloud.util.dateFormat(new Date(name), "yyyy-MM-dd hh:mm:ss");
		} else {
			return name;
		}
	};
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "rfd_list_bar",
					"class" : null
				},
				table : {
					id : "rfd_list_table",
					"class" : null
				},
				paging : {
					id : "rfd_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			
			$("#rfd_list").css("width",$(".wrap").width());
			$("#rfd_list_paging").css("width",$(".wrap").width());
			
			$("#rfd_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#rfd_list").height();
		    var barHeight = $("#rfd_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#rfd_list_table").css("height",tableHeight);
			
			this._renderTable();
			this._renderNoticeBar();
			
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#rfd_list_table",
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
			var height = $("#rfd_list_table").height()+"px";
	        $("#rfd_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable:function() {
			//this.loadData();
		},
		loadData:function() {
			cloud.util.mask("#rfd_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			Service.getrfdInfo(0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#rfd_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#rfd_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#rfd_list_table");
	        				Service.getrfdInfo(options.cursor, options.limit,function(data){
   							   callback(data);
   							cloud.util.unmask("#rfd_list_table");
	        				});

	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.result.length;
	        			    self.listTable.clearTableData();
	        			    self.listTable.render(data.result);
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
				selector : "#rfd_list_bar",
				events : {
					  query: function(name){//查询
						  cloud.util.mask("#rfd_list_table");
							var pageDisplay = 30;
							Service.getrfdList(name,0, pageDisplay,function(data) {
								var total = data.total;
								this.totalCount = data.result.length;
						        data.total = total;
						        self.listTable.render(data.result);
						        self._renderpage(data, 1);
						        cloud.util.unmask("#rfd_list_table");
							});
					  },
					  add:function(){
						    
					  },
					  imReport:function(){
						    
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