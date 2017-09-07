define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./tradeContent.html");
    require("cloud/lib/plugin/jquery-ui");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Table = require("cloud/components/table");
    var service = require('../service');
    
    var columns = [
                   {
                       "title": locale.get({lang: "trade_order_time"}),
                       "dataIndex": "createTime",
                       "cls": null,
                       "width": "12%",
                       render: dateConvertor
                   }, {
                       "title": locale.get({lang: "user_name"}),
                       "dataIndex": "siteName",
                       "cls": null,
                       "width": "10%"
                   }, {
                       "title": locale.get({lang: "mobile_number"}),
                       "dataIndex": "assetId",
                       "cls": null,
                       "width": "11%"
                   }, {
                       "title": locale.get({lang: "wechat"}),
                       "dataIndex": "cid",
                       "cls": null,
                       "width": "10%"
                   }, {
                       "title": locale.get({lang: "register_location"}),
                       "dataIndex": "machineType",
                       "cls": null,
                       "width": "9%",
                       render: machineTypeConvertor
                   }, {
                       "title": locale.get({lang: "cars_all_number"}),
                       "dataIndex": "locationId",
                       "cls": null,
                       "width": "5%"
                   }, {
                       "title": locale.get({lang: "best_result"}),
                       "dataIndex": "goodsName",
                       "cls": null,
                       "width": "9%"
                   }];
       var columns2 = [
                   {
                       "title": locale.get({lang: "trade_order_time"}),
                       "dataIndex": "createTime",
                       "cls": null,
                       "width": "12%",
                       render: dateConvertor
                   }, {
                       "title": locale.get({lang: "site_name"}),
                       "dataIndex": "siteName",
                       "cls": null,
                       "width": "10%"
                   }, {
                       "title": locale.get({lang: "automat_no1"}),
                       "dataIndex": "assetId",
                       "cls": null,
                       "width": "11%"
                   }, {
                       "title": locale.get({lang: "device_shelf_number"}),
                       "dataIndex": "cid",
                       "cls": null,
                       "width": "10%"
                   }, {
                       "title": locale.get({lang: "device_shelf_type"}),
                       "dataIndex": "machineType",
                       "cls": null,
                       "width": "9%",
                       render: machineTypeConvertor
                   }, {
                       "title": locale.get({lang: "automat_cargo_road_id"}),
                       "dataIndex": "locationId",
                       "cls": null,
                       "width": "5%"
                   }, {
                       "title": locale.get({lang: "trade_product_name"}),
                       "dataIndex": "goodsName",
                       "cls": null,
                       "width": "9%"
                   }, {
                       "title": locale.get({lang: "trade_price"}),
                       "dataIndex": "price",
                       "cls": null,
                       "width": "10%",
                       render: priceConvertor
                   },  {
                       "title": locale.get({lang: "trade_pay_style"}),
                       "dataIndex": "payStyle",
                       "cls": null,
                       "width": "9%",
                       render: typeConvertor
                   }, {
                       "title": locale.get({lang: "trade_secondpayprice"}),
                        "dataIndex": "secondPayAmount",
                        "cls": null,
                        "width": "80px",
                        render: priceConvertor
                   },{
                      "title": locale.get({lang: "trade_secondPay_style"}),
                      "dataIndex": "secondPayStyle",
                      "cls": null,
                      "width": "90px",
                      render: typeConvertor
                    },{
                       "title": locale.get({lang: "trade_pay_status"}),
                       "dataIndex": "payStatus",
                       "cls": null,
                       "width": "10%",
                       render: payStatusConvertor
                   }, {
                       "title": locale.get({lang: "deliver_status"}),
                       "dataIndex": "deliverStatus",
                       "cls": null,
                       "width": "9%",
                       render: deliverConvertor
                   },  {
                       "title": locale.get({lang: "refund_status"}),
                       "dataIndex": "refundStatus",
                       "cls": null,
                       "width": "9%",
                       render: refundStatus
                   }, {
                       "title": "",
                       "dataIndex": "id",
                       "cls": "_id" + " " + "hide"
                   }];
    function priceConvertor(value, type) {
    	if(value==null){
    		return value
    	}
        return value / 100;
    }
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
    function deliverConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 2:
                    display = locale.get({lang: "deliver_status_1"});//出货失败 售空 
                    break;
                case 0:
                    display = locale.get({lang: "deliver_status_0"});//出货成功
                    break;
                case 3:
                    display = locale.get({lang: "deliver_status_1"});//出货失败
                    break;
                case 4:
                    display = locale.get({lang: "deliver_status_1"});//出货失败 出货通知发送失败
                    break;
                case -1:
                    display = locale.get({lang: "deliver_status_11"});//待出货
                    break;

                default:
                    break;
            }
            return display;
        } else {
            return value;
        }

    }

    function dateConvertor(value, type) {
        if (type === "display") {
            return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
        } else {
            return value;
        }
    }
    function payStatusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({lang: "trade_pay_status_0"});
                    break;
                case 1:
                    display = locale.get({lang: "trade_pay_status_1"});
                    break;
                case 2:
                    display = locale.get({lang: "trade_pay_status_2"});
                    break;

                default:
                    break;
            }
            return display;
        } else {
            return value;
        }

    }
    function machineTypeConvertor(value, type){
    	 var display = "";
         if ("display" == type) {
             switch (value) {
                 case "1":
                     display = locale.get({lang: "drink_machine"});
                     break;
                 case "2":
                     display = locale.get({lang: "spring_machine"});
                     break;
                 case "3":
                     display = locale.get({lang: "grid_machine"});
                     break;
                 default:
                     break;
             }
             return display;
         } else {
             return value;
         }
    }
    function typeConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case "1":
                    display = locale.get({lang: "trade_baifubao"});//百付宝
                    break;
                case "2":
                    display = locale.get({lang: "trade_wx_pay"});//微信公众号支付
                    break;
                case "3":
                    display = locale.get({lang: "trade_alipay"});//支付宝
                    break;
                case "4":
                    display = locale.get({lang: "trade_cash_payment"});//现金支付
                    break;
                case "5":
                    display = locale.get({lang: "trade_swing_card"});//刷卡
                    break;
                //case "6":
                  //  display = locale.get({lang: "trade_scanner_card"});/* 扫胸牌 */
                    //break;
                case "7":
                    display = locale.get({lang: "trade_claim_number"});/* 取货码 */
                    break;
                case "8":
                    display = locale.get({lang: "trade_game"});/* 游戏 */
                    break;
                case "9":
                    display = locale.get({lang: "trade_soundwave_pay"});/* 声波支付 */
                    break;
                case "10":
                    display = locale.get({lang: "trade_pos_mach"});/* POS机 */
                    break;
                case "11":
                    display = locale.get({lang: "one_card_solution"});/* 一卡通 */
                    break;
                case "12":
                    display = locale.get({lang: "trade_abc_palm_bank"});/* 农行掌银支付 */
                    break;
                case "13":
                    display = locale.get({lang: "wechat_reversescan_pay"});/* 微信反扫 */
                    break;
                case "14":
                    display = locale.get({lang: "trade_vip"});/* 会员支付 */
                    break;
                case "15":
                    display = locale.get({lang: "trade_best_pay"});/* 翼支付 */
                    break;
                case "16":
                    display = locale.get({lang: "trade_jd_pay"});/* 京东支付 */
                    break;
                case "19":
                    display = locale.get({lang: "trade_reversescan_pay"});/* 支付宝反扫 */
                    break;
                case "20":
                    display = locale.get({lang: "integral_exchange"});/* 积分兑换 */
                    break;
                case "21":
                    display = locale.get({lang: "UnionPay_payment"});/* 银联支付 */
                    break;
                case "23":
                    display = locale.get({lang: "QrcodePay_payment"});/* 扫码支付 */
                    break;
                case "24":
                    display = locale.get({lang: "IcbcPay_payment"});/* 融e联 */
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
    var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.assetId = options.assetId;
            this.data = options.data;
	//		this.service = new Service();
			this.elements = {
				table : {
					id : "trade_list_table",
					"class" : null
				},
				paging : {
					id : "trade_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			
			$("#trade_list").parent().css("height","100%");
			this._renderTable();
			this.setDataTable();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			var self = this;
      var language = locale._getStorageLang();
      if (language=="en") {
                  columns = columns2;
       }
			this.listTable = new Table({
				selector : "#trade_list_table",
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
			});
			
		},
		setDataTable : function() {
			cloud.util.mask("#trade_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			var areaId = $("#userarea").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineId = $("#userline").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			service.getAreaByUserId(userId,function(areadata){
				
					var areaIds=[];
	                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
	                	areaIds = areadata.result.area;
	                }
	                if(roleType == 51){
	                	areaIds = [];
                     }
	                if(areaId.length != 0){
	                	areaIds = areaId;
	                }
	                
	                if(roleType != 51 && areaIds.length == 0){
	                	areaIds = ["000000000000000000000000"];
	                }
	                
	                cloud.Ajax.request({
		   	    	      url:"api/automatline/list",
				    	  type : "GET",
				    	  parameters : {
				    		  areaId: areaIds,
				    		  cursor:0,
				    		  limit:-1
		                  },
				    	  success : function(linedata) {
				    		    var lineIds=[];
				                if(linedata && linedata.result && linedata.result.length>0){
					    			  for(var i=0;i<linedata.result.length;i++){
					    				  lineIds.push(linedata.result[i]._id);
					    			  }
				                }
				                if(roleType == 51 && areaId.length == 0){
      			    			     lineIds = [];
          			              }
          			    		  if(lineId.length != 0){
          			    			  lineIds = lineId;
          			    		  }else{
          			    			  if(lineFlag == 0){
          			    				  lineIds = ["000000000000000000000000"];
          			    			  }
          			    		  }
          			    		  
          			    		if(roleType != 51 && lineIds.length == 0){
          			    			   lineIds = ["000000000000000000000000"];
          			    		}
				                self.lineIds = lineIds;
			                    service.getTradeList(0,pageDisplay,self.startTime, self.endTime, self.assetId,self.lineIds, function(data) {
				    				var total = data.total;
				    				self.totalCount = data.result.length;
				    		        //data.total = total;
				    		        self.pageRecordTotal = total;
				    		        self.listTable.render(data.result);
				    		        self._renderpage(data, 1);
				    		        cloud.util.unmask("#trade_list_table");
				    			 });
				    	  }
	                });
	            	
	         });
		},
		 _renderpage:function(data, start){
        	var self = this;
        	var pageDisplay = this.pageDisplay;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#trade_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#trade_list_table");
        				 service.getTradeList(options.cursor, options.limit,self.startTime, self.endTime, self.assetId,self.lineIds, function(data) {
        					self.pageRecordTotal = data.total - data.cursor;
        					callback(data);
        					cloud.util.unmask("#trade_list_table");
        				});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.listTable.clearTableData();
        			    self.listTable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        				$("#trade_detail_table").css("height",10+$("#trade_list_table-table").height()+$(".paging-page-box").height());
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        }
	});
	return list;
});