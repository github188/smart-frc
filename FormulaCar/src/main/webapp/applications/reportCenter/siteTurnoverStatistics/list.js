define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar-site");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var columns = [ {
		"title":locale.get({lang:"ssid_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"line_man_name"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"user_automat"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "10%"
	},{
		"title":'',//1
		"dataIndex" : "one",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//2
		"dataIndex" : "two",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//3
		"dataIndex" : "three",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//4
		"dataIndex" : "four",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//5
		"dataIndex" : "five",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//6
		"dataIndex" : "six",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":'',//7
		"dataIndex" : "seven",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return data.toFixed(2)+" "+locale.get({lang:"china_yuan"});
			}
			return data;
		}
	},{
		"title":locale.get({lang:"forecast_replenish_total"}),//合计
		"dataIndex" : "total",
		"cls" : null,
		"width" : "7%",
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
					id : "reports_list_bar",
					"class" : null
				},
				table : {
					id : "reports_list_table",
					"class" : null
				},
				paging : {
					id : "reports_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#reports_list").css("width",$(".wrap").width());
			$("#reports_list_paging").css("width",$(".wrap").width());
			
			$("#reports_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
		    var listHeight = $("#reports_list").height();
	        var barHeight = $("#reports_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight - 5;
		    $("#reports_list_table").css("height",tableHeight);
		   
		  
		   
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
				selector : "#reports_list_table",
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
			
			this.renderHeader();
			
		    var height = $("#reports_list_table").height()+"px";
	        $("#reports_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		renderHeader:function(){
			var tag=6;
			$("#reports_list_table-table").find('th').each(function (index, item) {
		    	var headCaption = $(item).text();  
		    	if(index>2 && index <10){
		    		var endTime = $("#endTime").val();
		    		var head = cloud.util.dateFormat(new Date(((new Date(endTime)).getTime() - 1000 * 60 * 60 * 24 * tag)/1000),"yyyy/MM/dd");
		    		
		    		if(new Date(head).getDay() == '6'){
		    			//head = head+"("+locale.get({lang:"saturday"})+")";
		    			$(item).css("color","red");
		    		}else if(new Date(head).getDay() == '0'){
		    			//head = head+"("+locale.get({lang:"sunday"})+")";
		    			$(item).css("color","red");
		    		}
		    		$(item).text(head);
		    		tag =tag -1;
		    	}
		    });
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			var self = this;
			cloud.util.mask("#reports_list_table");

			var startTime=$("#startTime").val();
			var endTime=$("#endTime").val();
	        if(startTime){
	        	startTime = (new Date(startTime + " 00:00:00")).getTime() / 1000;
	        }
	        if(endTime){
	        	endTime = (new Date(endTime + " 23:59:59")).getTime() / 1000;
	        }
	        //var name=$("#siteName").val();
	        var assetIds = $("#assetIds").val();
	        
	        var payStyle ="";
	        require(["cloud/lib/plugin/jquery.multiselect"], function() {
	        	payStyle = $("#payStyle").multiselect("getChecked").map(function() {
	                return this.value;
	            }).get();
	        	self.searchData={
	 	        		startTime:startTime,
	 	        		endTime:endTime,
	 	        		//siteName:name,
	 	        		assetIds:assetIds,
	 	        		payStyle:payStyle
	 	        };
	 	        Service.getReportForSiteTurnover(self.searchData, limit,cursor,function(data){
	 	        	 var total = data.result.length;
	    				 self.pageRecordTotal = total;
	    	        	 self.totalCount = data.result.length;
	            		 self.listTable.render(data.result);
	    	        	 self._renderpage(data, 1);
	 				 cloud.util.unmask("#reports_list_table");
	 		    });
            });
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#reports_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#reports_list_table");
        				Service.getReportForSiteTurnover(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#reports_list_table");
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
				selector : "#reports_list_bar",
				events : {
					  query: function(){
						  self.renderHeader();
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
                      exReport: function(){
                    	var startTime=$("#startTime").val();
              			var endTime=$("#endTime").val();
              	        if(startTime){
              	        	startTime = (new Date(startTime + " 00:00:00")).getTime() / 1000;
              	        }
              	        if(endTime){
              	        	endTime = (new Date(endTime + " 23:59:59")).getTime() / 1000;
              	        }
              	        //var name=$("#siteName").val();
              	        var name='';
              	        var assetIds = $("#assetIds").val();
              	        var payStyle = $("#payStyle").multiselect("getChecked").map(function() {
      	                    return this.value;
      	                }).get();
              	        
              	        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "siteTurnOverReport.xlsx";
                        var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                        var now = Date.parse(new Date())/1000;
                        var path = "/home/siteTurnOver/"+now+"/"+reportName;
                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
                        Service.createReportCenterOfSiteTurnOver(now,startTime,endTime,assetIds,payStyle,language, reportName,oid,function(data){
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
                               	Service.findReportCenterOfSiteTurnOver(now,"siteTurnOver.txt",function(data){
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