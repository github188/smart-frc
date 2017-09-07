/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./content.html");
	var Table = require("cloud/components/table");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	var NoticeBar = require("./notice-bar");
	var Paging = require("cloud/components/paging");
	require("../../../css/table.css");
	var Content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.columns = options.columns;
			this.businessType = options.businessType;
			this.elements = {
	           toolbar:"automat-group-automat-table-toolbar",
	           table: "automat-group-automat-table-content",
	           paging: "automat-group-automat-table-paging"
	        };
			this.table = "";
			this.display = null;
			this.pageDisplay = 10;
			this._render();
		},
		_render:function(){
			this._renderHtml();
			this._renderLayout();
			this._renderContent();
		},
		_renderContent:function(){
			this._renderTable();
			this._renderToolbar();
		},
		_renderHtml:function(){
			this.element.append(html);
		},
		_renderLayout:function(){
			var self = this;
			this.element.css({"position":"relative"});
			this.element.css({"height":($("#automat_group_automat_info").height()-45)+"px"});
			this.layout = this.element.layout({
                defaults: {
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
                north: {
                    paneSelector: "#" + this.elements.toolbar,
                    size: 50
                    
                },
                center: {
                    paneSelector: "#" + this.elements.table
                },
				south: {
					paneSelector: "#" + this.elements.paging,
					size: 38
				}
            });
			$("#automat-group-automat-table-toolbar").css({"line-height":$("#automat-group-automat-table-toolbar").height()+"px"});
		},
		_renderTable:function(){
			var self = this;
			this.table = new Table({
				selector:"#"+this.elements.table,
				columns:[this.columns].flatten(),
				datas:[],
				pageSize:100,
				autoWidth:false,
				pageToolBar:false,
				checkbox:"full",
				events:{
					onRowClick: function(data,callback) {
						/*callback = function(width){
							var chartWidth = width;
							var chartHeight = $("#"+self.elements.chart).height();
							self.chart.setSize(chartWidth, chartHeight);
						};*/
						self.fire("click");
                    },
                    onRowCheck : function(){
                    },
                    onCheckAll : function(selectedRows){
                    },
                    scope: this
				}
			});
			$("#"+this.elements.toolbar).css({"padding-left":"2%","width":"96%"});
			$("#"+this.elements.table).css({"padding-left":"2%","width":"96%"});
			$("#"+this.elements.paging).css({"padding-left":"2%","width":"96%"});
			this.loadTableData();
		},
        loadTableData : function() {
        	var self = this;
			var pagenew=''; 
			var data = {"total":4,"result":[
			                                {"automatIndex":"55","automatCreateTime":"2014-11-24 12:10:12","automatSiteNo":"0001","automatSiteName":"映翰通望京11层西区","automatSiteGroup":"映翰通办公室","automatSiteStatus":"未激活","automatSiteAddress":"望京科技园启明国际大厦"},
			                                {"automatIndex":"54","automatCreateTime":"2014-11-24 12:10:12","automatSiteNo":"0002","automatSiteName":"百度上地办公室3层西区","automatSiteGroup":"百度上地办公室","automatSiteStatus":"在线","automatSiteAddress":"上地七街blabla"},
			                                {"automatIndex":"53","automatCreateTime":"2014-11-24 12:10:12","automatSiteNo":"0003","automatSiteName":"朝阳大悦城11层西区","automatSiteGroup":"朝阳大悦城","automatSiteStatus":"离线","automatSiteAddress":"朝阳区"},
			                                {"automatIndex":"52","automatCreateTime":"2014-11-24 12:10:12","automatSiteNo":"0004","automatSiteName":"顺义后沙峪映翰通工厂","automatSiteGroup":"映翰通","automatSiteStatus":"在线","automatSiteAddress":"顺义"}
			                                ],"limit":4,"cursor":0};
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
        			selector : $("#" + this.elements.paging),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var data = {"total":4,"result":[
        				                                {"automatIndex":"55","automatCreateTime":"2014-11-24 12:10:12","automatNo":"0001","automatName":"映翰通望京11层西区","automatGroupName":"映翰通办公室","automatStatus":"未激活","automatAddress":"望京科技园启明国际大厦"},
        				                                {"automatIndex":"54","automatCreateTime":"2014-11-24 12:10:12","automatNo":"0002","automatName":"百度上帝办公室3层西区","automatGroupName":"百度上地办公室","automatStatus":"在线","automatAddress":"上地七街"},
        				                                {"automatIndex":"53","automatCreateTime":"2014-11-24 12:10:12","automatNo":"0003","automatName":"朝阳大悦城11层西区","automatGroupName":"朝阳大悦城","automatStatus":"离线","automatAddress":"朝阳区"},
        				                                {"automatIndex":"52","automatCreateTime":"2014-11-24 12:10:12","automatNo":"0004","automatName":"顺义后沙峪映翰通工厂","automatGroupName":"映翰通","automatStatus":"在线","automatAddress":"顺义"}
        				                                ],"limit":4,"cursor":0};
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
		_renderToolbar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#"+this.elements.toolbar,
				events : {
					  query: function(){//添加
						  self.fire("query");
					  },
					  drop:function(){//删除
						  
					  },
					  add:function(){
						  self.fire("add");
					  },
					  modify:function(){
						  self.fire("modify");
					  },
					  "delete":function(){
						  self.fire("delete");
					  }
					}
			});
		},
		_turnPage:function(page){
			this.mask();
			this.fire("close");//点击翻页 关闭右侧Info模块 ---杨通
			this.service.getTasksList(this.opt,(page-1)*(this.display),this.display,function(data){
				this.totalCount = data.length;
                this.table.clearTableData();
                this.unmask();
			},this);
		}
	});
	return Content;
});