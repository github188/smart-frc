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
	require("../../../css/table.css");
	var Content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.columns = options.columns;
			this.service = options.service;
			this.businessType = options.businessType;
			this.elements = {
	           toolbar: "content-table-toolbar",
	           table: "content-table-content"
	        };
			
			this.columns = options.columns;
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
			this.element.css({"min-height":($("#automat_group_group_info").height()-45)});
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
                }
            });
			$("#content-table-toolbar").css({"padding-top":"10px","padding-left":"5px;"});
		},
		_renderTable:function(){
			var self = this;
			this.table = new Table({
				selector:"#"+this.elements.table,
				columns:self.columns,
				datas:[],
				pageSize:100,
				autoWidth:false,
				pageToolBar:false,
				//checkbox:"full",
				events:{
					onRowClick: function(data,callback) {
						/*callback = function(width){
							var chartWidth = width;
							var chartHeight = $("#"+self.elements.chart).height();
							self.chart.setSize(chartWidth, chartHeight);
						};*/
						self.selectRowId = data._id;
						self.fire("click",data._id);
                    },
                    onRowCheck : function(){
                    },
                    onCheckAll : function(selectedRows){
                    },
                    scope: this
				}
			});
			
			//$("#this.elements.table tr").find("td:eq(1)").hide();
			this.loadTableData();
			//$(".dataTable tbody tr").each(function (colIndex) {
			$(".dataTable").css("overflow","visible");
		    //$(".dataTable thead tr").find("th").css({"text-align":"center","border":"1px solid","background-color":"white"});
		    //$(".dataTable tbody tr").find("td").css({"text-align":"center","border":"1px solid"});
		    $(".dataTable tbody tr").removeClass("even");
		    $("#"+this.elements.toolbar).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.table).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.paging).css({"padding-left":"5%","width":"90%"});
			//    console.log($(this).find("td:eq("+colIndex+")"));
			//});
			$("#" + this.elements.table).css({"padding-left":"5%"});
			$("#" + this.elements.table).css({"width":"90%"});
			$("#" + this.elements.table).append(html);
		},
		addTableCss:function(){
			//$("#"+this.elements.table).css("overflow","visible");
		    //$("#"+this.elements.table).find("th").css({"text-align":"center","border":"1px solid","background-color":"white"});
		    $("#"+this.elements.table).find("th").css({"text-align":"center","border":"1px solid"});
		    //$("#"+this.elements.table).find("td").css({"text-align":"center","border":"1px solid"});
		    $("#"+this.elements.table).find("td").css({"text-align":"center","border":"1px solid"});
		    $("#"+this.elements.table+" tbody tr").removeClass("even");
		    $("#"+this.elements.toolbar).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.table).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.paging).css({"padding-left":"5%","width":"90%"});
		},
		loadTableData:function(){
			var self = this;
			var verbose = 10;
			var pagenew='';
			this.addTableCss();
			self.service.getAllGroups($("#group_name_search").val(), function(data) {
				self.table.render(data.result);
				this.addTableCss();
			}, self);
		},
		_renderToolbar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#"+this.elements.toolbar,
				events : {
				  query: function(){//添加
					  self.fire("clearSelectRowId");
					  self.loadTableData();
				  }
				}
			});
		},
		add:function(data){
			this.table.add(data.result);
			this.addTableCss();
		},
		del:function(){
			var self = this;
			if(self.selectRowId == null || self.selectRowId == ""){
				dialog.render({lang:"automat_please_select_group_row"});
				return;
			}
			dialog.render({
        		lang:"confirm_to_delete_group",
        		buttons:[{
        			lang:"affirm",
        			click:function(){
        				self.service.deleteGroup(self.selectRowId, function(data){
        					if(data.status == "OK"){
        						self.table.delete(self.table.getRowById(self.selectRowId),function(){
        							self.selectRowId = null;
        							dialog.close();
                        			dialog.render({lang:"delete_group_success"});
        						});
        					}else{
        						//self.selectRowId = null;
        					}
        				},self);
        			}
        		},{
        			lang:"cancel",
        			click:function(){
        				dialog.close();
        			}
        		}]
        	});
			self.addTableCss();
		},
		update:function(_id,name){
			var self = this;
			if(_id == null || _id == ""){
				dialog.render({lang:"automat_please_select_group_row"});
				return;
			}
			self.service.updateGroup(_id,name,function(data){
				if(data.error!=null&&data.error!=""){
					dialog.render({lang:"automat_group_name_exist_error"});
        		}else{
        			$(self.table.getRowById(_id)).find(".cloud-unsortable").text(data.result.name);
	    			dialog.render({lang:"update_group_success"});
        			
        		}
			},self);
		}
	});
	return Content;
});