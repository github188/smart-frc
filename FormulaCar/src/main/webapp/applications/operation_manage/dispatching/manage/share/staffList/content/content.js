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
			this.businessType = options.businessType;
			this.elements = {
	           toolbar: "staff-content-table-toolbar",
	           table: "staff-content-table-content"
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
			this.element.css({"height":($("#manage_share_staff_info").height()-31)+"px"});
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
			$("#"+this.elements.toolbar).css({"padding-top":"10px","padding-left":"5px;","line-height":$("#"+this.elements.toolbar)+"px"});
		},
		_renderTable:function(){
			/*var html = "<table style='width:90%;padding-left:5%;' id='automat_group_group_table'>"+
							"<tr style='border: 1px solid;height:30px;text-align:center;'>"+
								"<td>分组名称</td>"+
							"</tr>"+
							"<tr  style='border: 1px solid;height:30px;text-align:center;'>"+
								"<td>启明国际大厦</td>"+
							"</tr>"+
							"<tr style='border: 1px solid;height:30px;text-align:center;'>"+
								"<td>望京科技园</td>"+
							"</tr>"+
					   "</table>";*/
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
						self.fire("click");
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
		    $(".dataTable thead tr").find("th").css({"text-align":"center","border":"1px solid","background-color":"white"});
		    $(".dataTable tbody tr").find("td").css({"text-align":"center","border":"1px solid"});
		    $(".dataTable tbody tr").removeClass("even");
		    $("#"+this.elements.toolbar).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.table).css({"padding-left":"5%","width":"90%"});
			$("#"+this.elements.paging).css({"padding-left":"5%","width":"90%"});
			//    console.log($(this).find("td:eq("+colIndex+")"));
			//});
			
			/*$("#" + this.elements.table).css({"padding-left":"5%"});
			$("#" + this.elements.table).css({"width":"90%"});*/
			$("#" + this.elements.table).append(html);
		},
		loadTableData:function(){
			var self = this;
			var pagenew='';
			var data = {"total":2,"result":[
			                                {"staffName":"王明"},
			                                {"staffName":"张三"}
			                                ],"limit":2,"cursor":0};
			var total = data.result.length;
        	self.totalCount = data.result.length;
			this.table.render(data.result);
			//this._renderpage(data, 1);
		},
		_renderToolbar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#"+this.elements.toolbar,
				events : {
					  query: function(){//添加
						  self.fire("query");
					  }
				}
			});
		},
		destroy:function(){
			if(this.noticeBar){
				this.noticeBar.destroy();
			}
			if(this.table){
				this.table.destroy();
			}
			if(this.layout){
				this.layout.destroy();
			}
		}
	});
	return Content;
});