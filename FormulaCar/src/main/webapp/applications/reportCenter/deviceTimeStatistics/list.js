define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var columns = [ {
		"title":locale.get({lang:"trade_automat_number"}),//售货机编号
		"dataIndex" : "number",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "name",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"sales_of_the_previous_day"}),//前一天销量
		"dataIndex" : "previous_day_sum",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"sales_amount_of_the_previous_day"}),//前一天销售额
		"dataIndex" : "previous_day_amount",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":locale.get({lang:"sales_last_week"}),//上周销量
		"dataIndex" : "last_week_sum",
		"cls" : null,
		"width" : "6%"
	},{
		"title":locale.get({lang:"average_sales_last_Sunday"}),//上周日均销量
		"dataIndex" : "last_week_average_sum",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"sales_amount_last_week"}),//上周销售额
		"dataIndex" : "last_week_amount",
		"cls" : null,
		"width" : "8%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":locale.get({lang:"average_sales_amount_last_Sunday"}),//上周日均销售额
		"dataIndex" : "last_week_average_amount",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":locale.get({lang:"sales_last_month"}),//上月销量
		"dataIndex" : "last_month_sum",
		"cls" : null,
		"width" : "6%"
	},{
		"title":locale.get({lang:"average_sales_last_month"}),//上月日均销量
		"dataIndex" : "last_month_average_sum",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"sales_amount_last_month"}),//上月销售额
		"dataIndex" : "last_month_amount",
		"cls" : null,
		"width" : "8%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":locale.get({lang:"average_sales_amount_last_month"}),//上月日均销售额
		"dataIndex" : "last_month_average_amount",
		"cls" : null,
		"width" : "11%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	}];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "report_list_bar",
					"class" : null
				},
				table : {
					id : "report_list_table",
					"class" : null
				},
				paging : {
					id : "report_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#report_list").css("width",$(".wrap").width());
			$("#report_list_paging").css("width",$(".wrap").width());
			
			$("#report_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
		    var listHeight = $("#report_list").height();
	        var barHeight = $("#report_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight - 5;
		    $("#report_list_table").css("height",tableHeight);
		   
			this._renderNoticeBar();
			this._renderTable();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#report_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				//checkbox : "full",
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
		    var height = $("#report_list_table").height()+"px";
	        $("#report_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			var self = this;
			cloud.util.mask("#report_list_table");

			var time=$("#timequery").val();
	        if(time){
	        	time = (new Date(time + " 00:00:00")).getTime() / 1000;
	        }
	        var name=$("#name").val();
	        var number=$("#number").val();
	        self.searchData={
	        		time:time,
	        		name:name,
	        		number:number
	        };
	        Service.getReportForDeviceTime(self.searchData, limit,cursor,function(data){
	        	 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
				 cloud.util.unmask("#report_list_table");
		    });
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#report_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#report_list_table");
        				Service.getReportForDeviceTime(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#report_list_table");
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
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#report_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
                      exReport: function(){
	          			    //query criteria
	                    	var time=$("#timequery").val();
	              	        if(time){
	              	        	time = (new Date(time + " 00:00:00")).getTime() / 1000;
	              	        }
	              	        var name=$("#name").val();
	              	        var number=$("#number").val();
						        
						    var language = locale._getStorageLang() === "en" ? 1 : 2;
		                    var host = cloud.config.FILE_SERVER_URL;
	                        var reportName = "deviceTimeReport.xlsx";
	                        var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	                        var now = Date.parse(new Date())/1000;
	                        var path = "/home/deviceTime/"+now+"/"+reportName;
	                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
	                        Service.createReportCenterOfDeviceTime(now,time,number,name,language, reportName,oid,function(data){
	                        	if(data){
	                        		var len = $("#search-bar").find("a").length;
	                        		var id = $("#search-bar").find("a").eq(len-1).attr("id");
	                        		$("#"+id).html("");
	                        		if(document.getElementById("bexport")!=undefined){
	                        			$("#bexport").show();
	                        		}else{
	                        			$("#"+id).after("<span style='margin-left:6px;' id='bexport'>"+locale.get({lang:"being_export"})+"</span>");
	                        		}
	                        		$("#"+id).hide();
	                        		
	                        		var timer = setInterval(function(){
	                                	Service.findReportCenterOfDeviceTime(now,"deviceTime.txt",function(data){
	                                		if(data.onlyResultDTO.result.res == "ok"){
	                                			cloud.util.ensureToken(function() {
						                            window.open(url, "_self");
						                        });
	                                			clearInterval(timer);
	                                			$("#"+id).html("");
	                                			if($("#bexport")){
	                                				$("#bexport").hide();
	                                			}
	                                    		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>"+locale.get({lang: "export"})+"</span>");
	                                    		$("#"+id).show();
	                                		}
	                                	})
	        						},5000);
	                        	}
	                        });
					  }
				}
			});
		},
		getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }  
	});
	return list;
});