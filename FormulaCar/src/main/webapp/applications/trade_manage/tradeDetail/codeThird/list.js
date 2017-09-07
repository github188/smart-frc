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
	var Writeoff = require("./writeOff-window");
	var columns = [ {
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"automat_name_of_commodity"}),//商品名称
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"order_no"}),//订单号
		"dataIndex" : "orderNo",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"trade_claim_number"}),//取货码
		"dataIndex" : "code",
		"cls" : null,
		"width" : "9%"
	},{
		"title":locale.get({lang:"deliver_status"}),//出货状态
		"dataIndex" : "deliverStatus",
		"cls" : null,
		"width" : "9%",
		render:deliverConvertor
	},{
		"title":locale.get({lang:"the_status_of_code"}),//取货码状态
		"dataIndex" : "codeStatus",
		"cls" : null,
		"width" : "9%",
		render:codeStatusConvertor
	},{                                             //验证时间
		"title":locale.get({lang:"verification_time"}),
		"dataIndex" : "checkTime",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	},{                                             //核销时间
		"title":locale.get({lang:"write_off_time"}),
		"dataIndex" : "cancelTime",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			var time = "";
			if(data != null){
				time = cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			return time;
		}
	},{                                             //申请人
		"title":locale.get({lang:"applicant_person"}),
		"dataIndex" : "applyOne",
		"cls" : null,
		"width" : "9%",
	}, {
        "title": locale.get({lang: "remark1"}),//备注
        "dataIndex": "desc",
        "cls": null,
        "width": "10%"
    },{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}];
	function deliverConvertor(value,type){
		var display = "";
		if("display"==	type){// -1:出货中 0:已出货 1：没有存货，无法出货;2：无此货物，无法出货 3:出货失败
			switch (value) {
			 case -1:
                 display = locale.get({lang: "deliver_status_11"});//出货中 
                 break;
             case 0:
                 display = locale.get({lang: "deliver_status_0"});//已出货
                 break;
             case 1:
                 display = locale.get({lang: "no_stock_no_shipment"});//没有存货，无法出货
                 break;
             case 2:
                 display = locale.get({lang: "no_goods_no_shipment"});//无此货物，无法出货
                 break;
             case 3:
                 display = locale.get({lang: "deliver_status_1"});//出货失败
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
				case 1:
					display = locale.get({lang:"verify_success"});
					break;
				case 4:
					display = locale.get({lang:"write_off_success"});
					break;
				case 2:
					display = locale.get({lang:"validation_failure"});
					break;
				case 3:
					display = locale.get({lang:"validation_failure_time"});
					break;
				case 5:
					display = "请求核销失败";
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
					id : "codeThird_list_bar",
					"class" : null
				},
				table : {
					id : "codeThird_list_table",
					"class" : null
				},
				paging : {
					id : "codeThird_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
		    
		    $("#codeThird_list").css("width",$(".wrap").width());
			$("#codeThird_list_paging").css("width",$(".wrap").width());
			
			$("#codeThird_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#codeThird_list").height();
		    var barHeight = $("#codeThird_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#codeThird_list_table").css("height",tableHeight);
		    
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
				selector : "#codeThird_list_table",
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
			var height = $("#codeThird_list_table").height()+"px";
	        $("#codeThird_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#codeThird_list_table");
        	var self = this;
        	var codeNo=$("#codeNo").val();
        	var assetId = $("#assetId").val();
        	
    		self.searchData = {
    					"code":codeNo,
    					"assetId":assetId
    		};

            Service.getAllcodeThird(self.searchData,limit,cursor,function(data){
		        var total = data.result.length;
		       	self.pageRecordTotal = total;
		       	self.totalCount = data.result.length;
		        self.listTable.render(data.result);
		       	self._renderpage(data, 1);
		       	cloud.util.unmask("#codeThird_list_table");
	        }, self); 

		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#codeThird_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#codeThird_list_table");
        				Service.getAllcodeThird(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#codeThird_list_table");
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
				selector : "#codeThird_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  writeoff:function(){
						  var selectedResouces = self.getSelectedResources();
	                      if (selectedResouces.length == 0) {
	                          dialog.render({lang: "please_select_at_least_one_config_item"});
	                      } else if (selectedResouces.length >= 2) {
	                          dialog.render({lang: "select_one_gateway"});
	                      } else {
	                    	  var _id = selectedResouces[0]._id;
	                    	  var code = selectedResouces[0].code;
	                    	  var assetId = selectedResouces[0].assetId;
	                    	  var codeStatus = selectedResouces[0].codeStatus;
	                    	  if(codeStatus == 4){
	                    		  dialog.render({lang: "the_code_have_been_written_off"});
	                    	  }else{
	                    		  if (this.modifyPro) {
		                                this.modifyPro.destroy();
		                          }
		                          this.modifyPro = new Writeoff({
		                                selector: "body",
		                                id: _id,
		                                code:code,
		                                assetId:assetId,
		                                events: {
		                                    "getcodeList": function() {
		                                    	self.loadTableData($(".paging-limit-select").val(),0);
		                                    }
		                                }
		                           });
	                    	  }
	                    	  
	                      }
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