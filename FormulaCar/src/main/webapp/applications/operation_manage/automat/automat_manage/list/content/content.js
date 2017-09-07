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
	var ImportProduct = require("./importdevice-window");
	
	var Content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.columns = options.columns;
			this.businessType = options.businessType;
			this.service = options.service;
			this.searchData = new Object();
			this.elements = {
	           toolbar: this.id + "-toolbar",
	           table: this.id + "-content",
	           paging: this.id + "-paging"
	        };
			this.table = "";
			this.display = null;
			this.pageDisplay = 10;
			this.pageRecordTotal = 0;
			this._render();
		},
		_render:function(){
			this._renderHtml();
			//this._renderLayout();
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
			this.layout = this.element.layout({
                defaults: {
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
			self.element.find("#" + self.elements.toolbar).css({"min-height":"48px"});
			self.element.find("#" + self.elements.table).css({"top":$("#"+self.elements.toolbar).height()});
			self.element.find("#" + self.elements.paging).css("height","auto");
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
				checkbox:"single",
				events:{
					onRowClick: function(data,callback) {
						if(data!=null){
							self.fire("click",data._id);
						}
                    },
                    onRowCheck : function(){
                    },
                    onCheckAll : function(selectedRows){
                    },
                    scope: this
				}
			});
			$("#content-table-content").css("width","100%");
			this.loadTableData(30,0,"");
			$("#content-table-paging").removeClass("ui-layout-pane");
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
        loadTableData : function(limit,cursor,areaVal) {
        	cloud.util.mask("#content-table");
        	var self = this;
			var pagenew='';
			var start = $("#startTime").val();
			var end = $("#endTime").val();
			var name = $("#search_input_name").val();
			var select1 = $("#automat-toolbar-package1 option:selected").val();
			var select2 = $("#automat-toolbar-package2 option:selected").val();
			
			if(name){
				name = self.stripscript(name);
			}
			
			if(end){
				if(start > end ){
					dialog.render({lang:"endtime_greater_starttime"});
					return;
				}
			}
			
			if(start&&start!=null){
				start = new Date(start).getTime()/1000;
			}
			if(end&&end!=null){
				end = new Date(end).getTime()/1000;
			}
			
			var createStart = null;var createEnd = null;
			var online = null;
			var activateStart = null;var activateEnd = null;
			var siteName = null; var automatName = null; var groupName = null;
			if(select1 == "0"){
				 createStart = start;createEnd = end;
			}else if(select1=="1"){
				activateStart = start;activateEnd = end;
			}else if(select1 == "2"){
				online = "0";
			}else if(select1 == "3"){
				online = "1";
			}
			if(select2 == "0"){
				 siteName = name;
			}else if(select2=="1"){
				automatName = name;
			}else if(select2 == "2"){
				groupName = name;
			}
			
		
			
			self.searchData = {
				"createStart":createStart,
				"createEnd":createEnd,
				"online":online,
				"activateStart":activateStart,
				"activateEnd":activateEnd,
				"siteName":siteName,
				"name":automatName,
				"groupName":groupName,
				"area":areaVal
				
			};
			self.service.getAllAutomatsByPage(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.table.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#content-table");
			 }, self);
			
			
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
        				self.service.getAllAutomatsByPage(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
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
			$("#"+self.elements.toolbar).html("");
			this.noticeBar = new NoticeBar({
				selector : "#"+self.elements.toolbar,
				events : {
					  query: function(areaVal){//添加
						  self.loadTableData($(".paging-limit-select").val(),0,areaVal);
					  },
					  add:function(){
						  self.fire("add");
					  },
					  del:function(){
						  cloud.util.mask("#content-table");
						  var idsArr = self.getSelectedResources();
						  if(idsArr.length == 0){
							 cloud.util.unmask("#content-table");
							 dialog.render({lang:"automat_select_least_one_site"});
							 return;
						  }else{
							 cloud.util.unmask("#content-table");
							 var ids = "";
							 for(var i = 0;i<idsArr.length;i++){
								if(i == idsArr.length-1){
									ids = ids+idsArr[i]._id;
								}else{
									ids = ids+idsArr[i]._id+",";
								}
							  }
							 dialog.render({
				    				lang:"affirm_delete",
				    				buttons: [{
				    					lang:"affirm",
				    					click:function(){
				    						cloud.util.mask("#content-table");
				    						self.service.deleteAutomatsByIds(ids,function(data){
				    							if(self.pageRecordTotal == 1){
				    								var cursor = ($(".paging-page-current").val()-2)*$(".paging-limit-select").val();
				    								if(cursor < 0){
				    									cursor = 0;
				    								}
				    								self.loadTableData($(".paging-limit-select  option:selected").val(),cursor,"");
				    							}else{
				    								self.loadTableData($(".paging-limit-select  option:selected").val(),cursor,"");
				    							}
												self.pageRecordTotal = self.pageRecordTotal - 1;
												dialog.render({lang:"deletesuccessful"});
				    						},self);
				    						dialog.close();
				    					}
				    				},
				    				{
				    					lang:"cancel",
				    					click:function(){
				    						cloud.util.unmask("#content-table");
				    						dialog.close();
				    					}
				    				}]
				    			});
						  }
					  },
					  imReport:function(){
						  if(this.imPro){
	                  			this.imPro.destroy();
	                  		  }
	                  	  this.imPro = new ImportProduct({
	                  			selector:"body",
	                  			events : {
	                  				"getDeviceList":function(){
	                  					self.loadTableData($(".paging-limit-select  option:selected").val(),($(".paging-page-current").val()-1)*$(".paging-limit-select").val(),"");
	                  				}
	                  			}
	                  	  });
					  }
				}
			});
		},
		/*_turnPage:function(page){
			this.mask();
			this.fire("close");//点击翻页 关闭右侧Info模块 ---杨通
			this.service.getTasksList(this.opt,(page-1)*(this.display),this.display,function(data){
				this.totalCount = data.length;
                this.table.clearTableData();
                this.unmask();
			},this);
		},*/
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.table.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.table.getData(row));
        	});
        	return selectedRes;
        },destroy:function(){
        	this.noticeBar.destroy();
        }
	});
	return Content;
});