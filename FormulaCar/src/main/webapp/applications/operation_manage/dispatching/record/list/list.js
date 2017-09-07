define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	require("./css/table.css");
	var columns = [ {
		"title":locale.get({lang:"automat_index"}),
		"dataIndex" : "index",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"type"}),
		"dataIndex" : "type",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"time"}),
		"dataIndex" : "time",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"automat_no1"}),
		"dataIndex" : "automatNo",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_site_name"}),
		"dataIndex" : "automatSiteName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_site_group"}),
		"dataIndex" : "automatSiteGroup",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_staff_name"}),
		"dataIndex" : "automatStaffName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_staff_phone"}),
		"dataIndex" : "automatStaffPhone",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_site_address"}),
		"dataIndex" : "automatSiteAddress",
		"cls" : null,
		"width" : "10%"
	}];
	
	var recordList = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				toolbar : {
					id : "dispatching-record-toolbar"
				},
				table : {
					id : "dispatching-record-table"
				},
				paging : {
					id : "dispatching-record-paging"
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			this.renderLayout();
			this._renderTable();
			this._renderNoticeBar();
		
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		renderLayout : function() {
			if (this.layout) {
				this.layout.destory();
			}
			$("#dispatching-record").css({"position":"relative",
									"height":$(".col-slide-menu").height()+"px"});
			this.layout = $("#dispatching-record").layout({
				defaults : {
					paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
				},
				north : {
					paneSelector : "#" + this.elements.toolbar.id,
					size : "50"
				},
				center : {
					paneSelector : "#" + this.elements.table.id
				},
				south : {
					paneSelector : "#" + this.elements.paging.id,
					size : "38"
				}
			});
			$("#"+this.elements.table.id).removeClass("pane");
			$("#"+this.elements.toolbar.id).removeClass("pane");
			$("#"+this.elements.toolbar.id).css({"line-height":"40px","padding-left":"10px;"});
			$("#"+this.elements.paging.id).removeClass("pane");
		},
		_renderTable : function() {
			this.table = new Table({
				selector : "#" + this.elements.table.id,
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				events : {
				   onRowClick: function(data) {
                   },
                   onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                   scope: this
				}
			});

			this.loadTableData();
		},
		loadTableData : function() {
			var self = this;
			var data = 
				{"total":2,"result":[
                    {"index":"55","type":"补货","time":"2014-12-14 15:23:45","automatNo":"00001","automatSiteName":"映翰通望京11层西区","automatStaffName":"李特","automatStaffPhone":"13800000000","automatSiteAddress":"望京科技园启明国际大厦11层"},
                    {"index":"54","type":"收现","time":"2014-12-14 15:23:45","automatNo":"00002","automatSiteName":"百度上地办公室","automatStaffName":"王明","automatStaffPhone":"13800000000","automatSiteAddress":"上地七街blabla"},
                    {"index":"53","type":"维护","time":"2014-12-14 15:23:45","automatNo":"00003","automatSiteName":"朝阳大悦城11层","automatStaffName":"张科","automatStaffPhone":"13800000000","automatSiteAddress":"朝阳区"},
                    {"index":"52","type":"补币","time":"2014-12-14 15:23:45","automatNo":"00004","automatSiteName":"映翰通","automatStaffName":"李文","automatStaffPhone":"13800000000","automatSiteAddress":"顺义区"}
                    ],"limit":2,"cursor":0};
			var total = data.result.length;
        	self.totalCount = data.result.length;
			this.table.render(data.result);
			this._renderpage(data, 1);
		},
        _renderpage:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#" + this.elements.paging.id),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				callback(data);
        				/*service.getUserMessage(function(data) {
        					 if(data.result){
        						 var oid = data.result.oid;//机构ID
        				         $.ajax({
        						   type : 'GET',
        						   url : '/purchase_rainbow/yt/purchase/order?cursor='+options.cursor+'&limit='+options.limit+"&oid="+oid,
        						   async : false,
        						   dataType : "json",
        						   success : function(data) {
        							   callback(data);
        						   }
        					    });
        					 }
        				});*/

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.table.clearTableData();
        			    self.table.render(data.result);
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
				selector : "#" + this.elements.toolbar.id,
				events : {
					query: function(){
						//console.log("query");
					}
				}
			});
		},
		
		destroy : function() {
		}
	});
	return recordList;
});