define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var columns = [{
		"title":locale.get({lang:"card_code"}),
		"dataIndex": "code",
		"cls": null,
		"width": "30%"
	},
	{
		"title":locale.get({lang:"remark"}),
		"dataIndex":"desc",
		"cls": null,
		"width": "40%"
	},
	/*{
		"title":locale.get({lang:"card_name"}),
		"dataIndex":"name",
		"cls": null,
		"width": "10%"
	},{
		"title":locale.get({lang:"card_job"}),
		"dataIndex":"job",
		"cls": null,
		"width": "10%"
	},{
		"title":locale.get({lang:"card_company"}),
		"dataIndex":"company",
		"cls": null,
		"width": "15%"
	},{
		"title":locale.get({lang:"card_telephone"}),
		"dataIndex":"telephone",
		"cls": null,
		"width": "10%"
	},{
		"title":locale.get({lang:"card_email"}),
		"dataIndex":"email",
		"cls": null,
		"width": "25%"
	},*/{
		"title":locale.get({lang:"card_createTime"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "30%",
		 render: function (value, type) {
			if(type === "display"){
				return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
			}else{
				return value;
			}
		 }
	}];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "card_list_bar",
					"class" : null
			    },
				table : {
					id : "card_list_table",
					"class" : null
				},
				paging : {
					id : "card_list_paging",
					"class" : null
				}
			};
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
			this.listTable = new Table({
				selector : "#card_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
	                    	
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			cloud.util.mask("#card_list_table");
			var self = this;
			var pageDisplay = self.display;
			
			var startTime=$("#startTime").val();
            var endTime=$("#endTime").val();
            var start ='';
            var end ='';
		    if(startTime){
				 start = (new Date(startTime)).getTime()/1000; 
			}else{
				 start =null;
			}
		    if(endTime){
				 end = (new Date(endTime)).getTime()/1000; 
			}else{
				 end =null;
			}
			  
			Service.getCardInfo(start,end,0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#card_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#card_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				var startTime=$("#startTime").val();
	        	            var endTime=$("#endTime").val();
	        	            var start ='';
	        	            var end ='';
	        			    if(startTime){
	        					 start = (new Date(startTime)).getTime()/1000; 
	        				}else{
	        					 start =null;
	        				}
	        			    if(endTime){
	        					 end = (new Date(endTime)).getTime()/1000; 
	        				}else{
	        					 end =null;
	        				}
	        				Service.getCardInfo(start,end,options.cursor, options.limit,function(data) {
   							   callback(data);
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
	        _renderNoticeBar : function() {
				var self = this;
				this.noticeBar = new NoticeBar({
					selector : "#card_list_bar",
					events : {
						  query: function(startTime,endTime){//查询
							  cloud.util.mask("#card_list_table");
							    var pageDisplay = self.display;
							    var start ='';
		        	            var end ='';
							    if(startTime){
		        					 start = (new Date(startTime)).getTime()/1000; 
		        				}else{
		        					 start =null;
		        				}
		        			    if(endTime){
		        					 end = (new Date(endTime)).getTime()/1000; 
		        				}else{
		        					 end =null;
		        				}
							    Service.getCardInfo(start,end,0, pageDisplay,function(data) {
									var total = data.total;
									this.totalCount = data.result.length;
							        data.total = total;
							        self.listTable.render(data.result);
							        self._renderpage(data, 1);
							        cloud.util.unmask("#card_list_table");
								});
						  },
						  exReport:function(){
							    var language = locale._getStorageLang()==="en"? 1 : 2;
		                    	var host = cloud.config.FILE_SERVER_URL;
		                    	var reportName = "cardsReport.xls";
		                    	
		                    	var startTime=$("#startTime").val();
		        	            var endTime=$("#endTime").val();
		        	            var start ='';
		        	            var end ='';
		        	            
		        	            var url = host + "/api/vmreports/card?report_name="+reportName+"&language="+language + "&access_token="+cloud.Ajax.getAccessToken();
		        			    if(startTime){
		        					 start = (new Date(startTime)).getTime()/1000; 
		        					 url = url +"&startTime="+start;
		        				}else{
		        					 start =null;
		        				}
		        			    if(endTime){
		        					 end = (new Date(endTime)).getTime()/1000; 
		        					 url = url +"&endTime="+end;
		        				}else{
		        					 end =null;
		        				}
		                    	
	                			
	                			cloud.util.ensureToken(function(){
	                				window.open(url, "_self");
	                			});
						  }
						}
				});
			}
	});
	return list;
});