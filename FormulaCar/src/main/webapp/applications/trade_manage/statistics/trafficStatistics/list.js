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
	var columns = [
{
	"title":locale.get({lang:"traffic_site_name"}),//线路名称
	"dataIndex" : "siteName",
	"cls" : null,
	"width" : "20%"
},
	{
		"title":locale.get({lang:"traffic_line_name"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "20%"
	},
	{
		"title":locale.get({lang:"traffic_automat_name"}),//售货机编号
		"dataIndex" : "name",
		"cls" : null,
		"width" : "20%"
	},
	{
		"title":locale.get({lang:"traffic_automat_number"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "15%"
	},{
		"title":"总流量",
		"dataIndex" : "updata",
		"cls" : null,
		"width" : "15%",
		render:function(data,type,row){
			if(data){
				
				var value = parseInt(data);
				value=(value/1024/1024).toFixed(2)*100;
				
				var value2 = parseInt(row.downdata);
				value2=(value2/1024/1024).toFixed(2)*100;
				
				var total =parseInt(value) + parseInt(value2);
				
				return (total/100).toFixed(2)+"M";
			}
		}
	},{
		"title":locale.get({lang:"traffic_update"}),//上行流量
		"dataIndex" : "updata",
		"cls" : null,
		"width" : "15%",
		render:function(data,type){
			if(data){
				var value = parseInt(data);
				value=value/1024/1024;
				return value.toFixed(2)+"M";
			}
		}
	},{
		"title":locale.get({lang:"traffic_downdata"}),//下行流量
		"dataIndex" : "downdata",
		"cls" : null,
		"width" : "15%",
		render:function(data,type){
			if(data){
				var value = parseInt(data);
				value=value/1024/1024;
				return value.toFixed(2)+"M";
			}
		}
	},{                                             //创建时间
		"title":locale.get({lang:"statistic_time"}),
		"dataIndex" : "statisticTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
			
		}
	}];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.Service = new Service();
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "traffic_list_bar",
					"class" : null
				},
				table : {
					id : "traffic_list_table",
					"class" : null
				},
				paging : {
					id : "traffic_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
		    $("#traffic_list").css("width",$(".wrap").width());
			$("#traffic_list_paging").css("width",$(".wrap").width());
			
			$("#traffic_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
		    var listHeight = $("#traffic_list").height();
	        var barHeight = $("#traffic_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight;
		    $("#traffic_list_table").css("height",tableHeight);
		    $("#traffic_list_table").css("width",$(".wrap").width());
		    
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
				selector : "#traffic_list_table",
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
/*          drawCallback: function ( oSettings ) {
                 Need to redo the counters if filtered or sorted 
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                    {
                        $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                    }
                }
            }*/
			});
			var height = $("#traffic_list_table").height()+"px";
	        $("#traffic_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#traffic_list_table");
        	var self = this;
        	var byDate = "";
            var byMonth = "";
            var byYear = "";
            var startTime = '';  
            var endTime = ''; 
            var type="";
            
        	var selectedId = $("#reportType").find("option:selected").val();
        	if(typeof(selectedId)=="undefined"){
        		/*var myDate=new Date();
				var full = myDate.getFullYear(); 
				var month = myDate.getMonth() +1;
				var day = myDate.getDate();
				var date =  full+"/"+month+"/"+day;
				var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
				var endTime =(new Date(date+" 23:59:59")).getTime()/1000;
				var type=1;*/
        		var byMonth = $("#summary_month").val();//月
				var type=2;
        	}
			if(selectedId == "1"){
				var byDate = $("#summary_date").val();//日
				var type=1;
			}else if(selectedId == "2"){
				var byMonth = $("#summary_month").val();//月
				var type=2;
			}else if(selectedId == "3"){
				var byYear = $("#summary_year").val();//年
				var type=3;
			}
			
            var userline = "";
            
            if($("#userline").attr("multiple") != undefined){
            	userline = $("#userline").multiselect("getChecked").map(function() {//线路 
                    
                    return this.value;
                }).get();
            }

            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }

            var siteName = null;
            var assetId = null;
            var name = null;
            if (search) {
                if (search == 0) {
                    assetId = $("#searchValue").val();
                } else if (search == 1) {
                    siteName = searchValue;//点位名称
                }else if (search == 2) {
                    name = searchValue;//售货机名称
                }
            }
			
            //日报表
            if(byDate){
            	startTime = (new Date(byDate + " 00:00:00")).getTime()/1000;  
            	endTime = (new Date(byDate + " 23:59:59")).getTime()/1000; 
            }
            //月报表
            if(byMonth){
            	var year = byMonth.split('/')[0];
            	
                var months = byMonth.split('/')[1];
            	var  maxday = new Date(year,months,0).getDate();
         	   if(months == 1 || months ==3 || months == 5 || months == 7 || months ==8 || months == 10 || months == 12){
         		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
         		  endTime = (new Date(byMonth +"/31"+ " 23:59:59")).getTime()/1000; 
         	   }else if(months == 2){
         		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
         		  endTime = (new Date(byMonth +"/"+maxday+ " 23:59:59")).getTime()/1000;
         	   }else{
         		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;    
         		  endTime = (new Date(byMonth +"/30"+ " 23:59:59")).getTime()/1000;
         	   }
           }
           //年报表
            if(byYear){
            	startTime = (new Date(byYear +"/01/01"+ " 00:00:00")).getTime()/1000; 
        		endTime = (new Date(byYear +"/12/31"+ " 23:59:59")).getTime()/1000;
            }

        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
        	self.Service.getLinesByUserId(userId,function(linedata){
            	var lineIds=[];
            	if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                }
            	if(roleType == 51){
	    			 lineIds = [];
                }
            	if(roleType != 51 && lineIds.length == 0){
	                    lineIds = ["000000000000000000000000"];
	            }
            	self.lineIds = lineIds;
            	self.searchData = {
                        "siteName": siteName,
                        "assetId": assetId,
                        "lineId": userline,
                        "name":name,
                        "startTime":startTime,
                         "endTime":endTime,
                         "type":type
                    };

                self.Service.getTrafficStatistic(self.searchData,limit,cursor,function(data){
   				 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 cloud.util.unmask("#traffic_list_table");
  			    }, self);

            	
            });
		},
		
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#traffic_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#traffic_list_table");
        				Service.getTrafficStatistic(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#traffic_list_table");
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
				selector : "#traffic_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);

					  }
		                    
					}
					  
				});
        },
		
		
	});
	return list;
});