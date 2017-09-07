/**
 * table
 */
define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./content.html");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var content = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.service = options.service;
			this.columns = options.columns;
			this.elements = {
				toolbar : {
					id : "automat-site-toolbar"
				},
				table : {
					id : "automat-site-table"
				},
				paging : {
					id : "automat-site-paging"
				}
			};
			this.searchParams = {
				name:null,
				area:null
			};
			this.pageRecordTotal = 0;
			this.render();
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			this._renderNoticeBar();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			var self = this;
			this.table = new Table({
				selector : "#" + this.elements.table.id,
				columns : [self.columns].flatten(),
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox:"single",
				events : {
				   onRowClick: function(data) {
					   self.fire("click",data._id);
                   },
                   onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                   scope: this
				}
			});
			$("#automat-site-table").css("width","100%");
			this.loadTableData(30,0,'');
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		loadTableData:function(limit,cursor,areaVal) {
			var self = this;
			var name = $("#search-input").val();
			if(name){
				name = self.stripscript(name);
				self.searchParams.name = name;
			}
			self.searchParams.area = areaVal;
			var area = areaVal;
			cloud.util.mask("#automat-site-content");
			self.service.getAllSitesByPage(area,name,limit,cursor,function(data){
				var total = data.result.length;
	        	self.totalCount = data.result.length;
	        	self.pageRecordTotal = total;
				this.table.render(data.result);
				this._renderpage(data, 1);
				cloud.util.unmask("#automat-site-content");
				$(".paging-box").css("display","display");
			},self);
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
	    				total:data.result.length,
	    				limit:self.pageDisplay,
	        			requestData:function(options,callback){
	        				 self.service.getAllSitesByPage(self.searchParams.area,self.searchParams.name, options.limit,options.cursor,function(data){
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
    	_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#" + this.elements.toolbar.id,
				events : {
					"query": function(areaVal){
						var pageDisplay = $(".paging-limit-select").val();
						self.loadTableData(pageDisplay,0,areaVal);
						
					},
					"addView":function(){
						self.fire("addView");
					},
					"modifyView":function(){
						var rows = self.getSelectedResources();
						if(rows&&rows.length!=1){
							dialog.render({lang:"automat_select_one_site"});
							return;
						}else{
							self.fire("modifyView",rows[0]._id);
						}
						
					},
					"delete":function(){
						var idsArr = self.getSelectedResources();
						if(idsArr.length == 0){
							dialog.render({lang:"automat_select_least_one_site"});
							return;
						}else{
							var ids = "";
							for(var i = 0;i<idsArr.length;i++){
								if(i == idsArr.length-1){
									ids = ids +idsArr[i]._id;
								}else{
									ids = ids +idsArr[i]._id+",";
								}
							}
							
							dialog.render({
			    				lang:"affirm_delete",
			    				buttons: [{
			    					lang:"affirm",
			    					click:function(){
			    						dialog.close();
			    						self.service.deleteSiteByIds(ids,function(data){
			    							if(data.result&&data.result.error_code!=undefined&&data.result.error_code!=null&&data.result.error_code=="70013"){
		   		 				    			 dialog.render({lang:"exists_relate_automat"});
		   		 				    		 }else{
		   		 				    			 if(self.pageRecordTotal==1){
		   		 				    				var cursor = ($(".paging-page-current").val()-2)*$(".paging-limit-select").val();
		   		 				    				if(cursor<0){
		   		 				    					self.loadTableData($(".paging-limit-select").val(),0,"");
		   		 				    				}else{
		   		 				    					self.loadTableData($(".paging-limit-select").val(),cursor,"");
		   		 				    				}
		   		 				    			 }else{
		   		 				    				self.loadTableData($(".paging-limit-select").val(),($(".paging-page-current").val()-1)*$(".paging-limit-select").val(),"");
		   		 				    			 }
		   		 				    			 self.pageRecordTotal = self.pageRecordTotal - 1;
		   		 				    			 dialog.render({lang:"deletesuccessful"});
		   		 				    		 }
										},self);
			    					}
			    				},
			    				{
			    					lang:"cancel",
			    					click:function(){
			    						dialog.close();
			    					}
			    				}]
			    			});
						}

					}
				}
			});
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
	return content;
});