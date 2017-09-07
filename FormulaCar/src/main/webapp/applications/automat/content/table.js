/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./table.html");
	var Table = require("cloud/components/table");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	var NoticeBar = require("./notice-bar");
	var Paging = require("cloud/components/paging");
	require("../css/table.css");
	var Content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.columns = options.columns;
			this.gismap = options.gismap;
			this.businessType = options.businessType;
			this.service = options.service;
			this.elements = {
	           toolbar: "content-table-toolbar",
	           table: "content-table-content",
	           paging: "content-table-paging"
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
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderLayout:function(){
			var self = this;
			this.layout = this.element.layout({
                defaults: {
                    //paneClass: "pane",
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
                    paneSelector: "#" + this.elements.toolbar
                },
                center: {
                    paneSelector: "#" + this.elements.table
                },
				south: {
					paneSelector: "#" + this.elements.paging
				}
            });
			this.element.find("#" + this.elements.toolbar).css("height","38px");
			this.element.find("#" + this.elements.table).css("top","50px");
			this.element.find("#" + this.elements.table).css("height","auto");
			this.element.find("#" + this.elements.table).css("bottom","38px");
			this.element.find("#" + this.elements.paging).css("height","auto");
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
				checkbox : "none",
				events:{
					onRowClick: function(data,callback) {
                    	self.fire("openPop",data)
                    },
                    onRowCheck : function(data){
                    	
                    },
                    onLoad : function(data){
                    	self.fire("onLoad",data);
                    },
                    onCheckAll : function(selectedRows){
                    },
                    "afterSelect" : function(reses, row, isSelected){
//                      console.log(arguments, "afterSelect")
                    },
                    "checkAll" : function(res){
//                      console.log(res, "checkAll")
                    },
                    "onTurnPage" : function(page, data){
                      self.gisMap.deleteMarkers();
//                       self.gisMap.addMarkers(data.result ? data.result : data);
                    },
                  "afterRendered" : function(data){
                	  self.gisMap.deleteMarkers();
                	  self.gisMap.addMarkers(data);
//                      this.gisMap.openPopup();
                  },
                  "click" : function(id){
                	  self.gisMap.jumpToSite(id);
                  },
                  "afterUpdate": function(data,row){
                	  self.gisMap.updateMarkers(data);
                  },
                  scope : self
				}
			});
			this.loadTableData(30,0);
		},
        loadTableData : function(limit,cursor) {
        	cloud.util.mask("#content-table-content");
        	var self = this;
			var pagenew='';
			var name = $("#search_input_name").val();
			if(name){
				name = self.stripscript(name);
			}
			//cloud.util.mask("#automat_manager_list");
			self.service.getSiteByPageAndParams(name,limit,cursor,function(data){
				self.gismap.addMarkers(data.result);
				
				var total = data.result.length;
	        	self.totalCount = data.result.length;
	        	self.table.render(data.result);
	        	self._renderpage(data, 1);
	        	cloud.util.unmask("#content-table-content");
			},self);
			
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#" + self.elements.paging),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var name = $("#search_input_name").val();
        				if(name){
        					name = self.stripscript(name);
        				}
        				self.service.getSiteByPageAndParams(name,options.limit,options.cursor,function(data){
						   callback(data);
        				});

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
				  query: function(){
					  self.loadTableData($(".paging-limit-select option:selected").val(),0);
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
		},
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.table.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.table.getData(row));
        	});
        	return selectedRes;
        }
	});
	return Content;
});