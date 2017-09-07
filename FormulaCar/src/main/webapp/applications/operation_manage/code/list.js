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
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_name_of_commodity"}),//商品名称
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"order_no"}),//订单号
		"dataIndex" : "orderNo",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"trade_pay_status"}),//支付状态
		"dataIndex" : "payStatus",
		"cls" : null,
		"width" : "10%",
		render:payStatusConvertor
	},{
		"title":locale.get({lang:"deliver_status"}),//出货状态
		"dataIndex" : "deliverStatus",
		"cls" : null,
		"width" : "10%",
		render:deliverConvertor
	},{ 
		"title":locale.get({lang:"trade_claim_number"}),//取货码
		"dataIndex" : "code",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"the_status_of_code"}),//取货码状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "10%",
		render:statusConvertor
	},{
		"title":locale.get({lang:"the_style_of_code"}),//取货码来源类型
		"dataIndex" : "sourceType",
		"cls" : null,
		"width" : "10%",
		 render:codeConvertor
	}, {                                             //取货码产生时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}, {
        "title": locale.get({lang: "refund_status"}),
        "dataIndex": "refundStatus",
        "cls": null,
        "width": "10%",
        render: refundStatus
    }];
	function refundStatus(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({lang: "none"});//无
                    break;
                case 1:
                    display = locale.get({lang: "refunding"});//正在退款
                    break;
                case 2:
                    display = locale.get({lang: "refunded"});//退款成功
                    break;
                case 3:
                    display = locale.get({lang: "refunding_error"});//退款失败
                    break;
                case 4:
                    display = locale.get({lang: "need_to_re_aunch_the_refund"});//退款需要重新发起
                    break;
                case 5:
                    display = locale.get({lang: "to_send"});//转入代发
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	function deliverConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
			 case "2":
                 display = locale.get({lang: "deliver_status_1"});//出货失败 售空 
                 break;
             case "0":
                 display = locale.get({lang: "deliver_status_0"});//出货成功
                 break;
             case "3":
                 display = locale.get({lang: "deliver_status_1"});//出货失败
                 break;
             case "4":
                 display = locale.get({lang: "deliver_status_1"});//出货失败 出货通知发送失败
                 break;
             case "-1":
                 display = locale.get({lang: "deliver_status_11"});//待出货
                 break;
			
			default:
				 break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	function payStatusConvertor(value, type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "0":
					display = locale.get({lang:"trade_pay_status_0"});
					break;
				case "1":
					display = locale.get({lang:"trade_pay_status_1"});
					break;
				case "2":
					display = locale.get({lang:"trade_pay_status_2"});
				//case "8":
				//	display = locale.get({lang:"trade_pay_status_8"});
					break;
			
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	function codeConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"code_of_baifubao"});//百付宝取货码
					break;
				case "2":
					display = locale.get({lang:"code_of_wechat"});//微信取货码
					break;
				case "3":
					display = locale.get({lang:"code_of_alipay"});//支付宝取货码
					break;
				case "15":
					display = locale.get({lang:"code_of_bestpay"});//翼支付取货码
					break;
				case "16":
					display = locale.get({lang:"code_of_jdpay"});//京东支付取货码
					break;
				case "7":
					display = locale.get({lang:"trade_claim_number"});//取货码
					break;
				case "21":
					display = locale.get({lang:"code_of_UnionPay_payment"});//银联支付
					break;
				case "23":
					display = "扫码支付取货码";
					break;
				case "24":
					display = "融e联取货码";
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	function statusConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "0":
					display = locale.get({lang:"can_use"});//可用状态
					break;
				case "1":
					display = locale.get({lang:"not_geted"});//不可用状态
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
					id : "code_list_bar",
					"class" : null
				},
				table : {
					id : "code_list_table",
					"class" : null
				},
				paging : {
					id : "code_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
		    
		    $("#codes_list").css("width",$(".wrap").width());
			$("#code_list_paging").css("width",$(".wrap").width());
			
			$("#codes_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#codes_list").height();
		    var barHeight = $("#code_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#code_list_table").css("height",tableHeight);
		    
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
				selector : "#code_list_table",
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
			var height = $("#code_list_table").height()+"px";
	        $("#code_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#code_list_table");
        	var self = this;
        	
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
            Service.getAutomatByUserId(userId, function(data) {
           	 
           		    var assetIds=[];
                    if(data.result && data.result.length>0){
   	    			  for(var i=0;i<data.result.length;i++){
   	    				  assetIds.push(data.result[i].assetId);
   	    			  }
                    }
                    
                    //self.assetIds = assetIds;
                    var arr = [];

                    var assetId = $("#assetId").val();
                    var sourceType=$("#sourceType").val();
                    if(roleType == 51){
                    	arr.push(assetId);
                    }else if(assetIds.length == 0){
                    	arr = ["000000000000000000000000"];
                    }else if(assetId == null || assetId.replace(/(^\s*)|(\s*$)/g,"")==""){
                    	arr = assetIds;
                    }else if($.inArray(assetId,assetIds) > -1){
                    	arr.push(assetId);
                    }

    	        	var code = $("#codeNo").val();
    				self.searchData = {
    					"assetId":arr,
    					"sourceType":sourceType,
    					"code":code
    				};

                   	Service.getAllCode(self.searchData,limit,cursor,function(data){
		       				 var total = data.result.length;
		       				 self.pageRecordTotal = total;
		       	        	 self.totalCount = data.result.length;
		               		 self.listTable.render(data.result);
		       	        	 self._renderpage(data, 1);
		       	        	 cloud.util.unmask("#code_list_table");
	       			}, self); 

                
            }, self);

		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#code_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#code_list_table");
        				Service.getAllCode(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#code_list_table");
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
				selector : "#code_list_bar",
				events : {
					  query: function(areaVal){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  }
				}
			});
		}
	});
	return list;
});