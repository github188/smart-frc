define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var columns = [ {
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "10%"
	},{
		"title":"商品编号",//商品名称
		"dataIndex" : "productCode",
		"cls" : null,
		"width" : "20%"
	},{
		"title":"取货码",
		"dataIndex" : "code",
		"cls" : null,
		"width" : "10%"
	},{
		"title":"取货码类型",
		"dataIndex" : "codeType",
		"cls" : null,
		"width" : "10%",
		render:typeConvertor
	},{
		"title":locale.get({lang:"the_status_of_code"}),//取货码状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "10%",
		render:codeStatusConvertor
	},{                                            
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	},{                                            
		"title":"更新时间",
		"dataIndex" : "updateTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}];
	function typeConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
             case 1:
                 display = "商城";
                 break;
             case 2:
                 display = "关注有奖";
                 break;
             case 3:
                 display ="调查问卷";
                 break;
			
			default:
				 break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	function codeStatusConvertor(value, type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case 0:
					display = "可用";
					break;
				case 1:
					display = "不可用";
					break;
				case 2:
					display = "未启用";
					break;
			
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "codeActivity_list_bar",
					"class" : null
				},
				table : {
					id : "codeActivity_list_table",
					"class" : null
				},
				paging : {
					id : "codeActivity_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
		    
		    $("#codeActivity_list").css("width",$(".wrap").width());
			$("#codeActivity_list_paging").css("width",$(".wrap").width());
			
			$("#codeActivity_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#codeActivity_list").height();
		    var barHeight = $("#codeActivity_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#codeActivity_list_table").css("height",tableHeight);
		    
			this._renderTable();
			this._renderNoticeBar();
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
				selector : "#codeActivity_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "single",
				events : {
					 onRowClick: function(data) {
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			var height = $("#codeActivity_list_table").height()+"px";
	        $("#codeActivity_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#codeActivity_list_table");
        	var self = this;
        	var codeNo=$("#codeNo").val();
        	var type = $("#type").find("option:selected").val();
        	var status = $("#status").find("option:selected").val();
        	if(status == "-1"){
        		status="";
        	}
        	if(type == "-1"){
        		type="";
        	}
    		self.searchData = {
    					"code":codeNo,
    					"status":status,
    					"codeType":type
    		};

            Service.getAllcodeActivity(self.searchData,limit,cursor,function(data){
		        var total = data.result.length;
		       	self.pageRecordTotal = total;
		       	self.totalCount = data.result.length;
		        self.listTable.render(data.result);
		       	self._renderpage(data, 1);
		       	cloud.util.unmask("#codeActivity_list_table");
	        }, self); 

		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#codeActivity_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#codeActivity_list_table");
        				Service.getAllcodeActivity(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#codeActivity_list_table");
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
				selector : "#codeActivity_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
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