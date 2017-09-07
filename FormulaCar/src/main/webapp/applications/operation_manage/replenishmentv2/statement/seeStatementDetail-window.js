define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var winHtml = require("text!./seeStatementDetail.html");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Service = require("../../service");
	//require("../config/css/common.css");
	//var NoticeBar = require("./see/notice-bar");
    var columns = [
                   {
                       "title": locale.get({lang: "automat_no1"}),
                       "dataIndex": "assetId",
                       "cls": null,
                       "width": "100px"
                   }, {
                       "title": locale.get({lang: "device_shelf_number"}),
                       "dataIndex": "cid",
                       "cls": null,
                       "width": "100px"
                   }, {
                       "title": locale.get({lang: "device_shelf_type"}),
                       "dataIndex": "machineType",
                       "cls": null,
                       "width": "90px",
                       render: machineTypeConvertor
                   }, {
                       "title": locale.get({lang: "automat_cargo_road_id"}),
                       "dataIndex": "locationId",
                       "cls": null,
                       "width": "50px"
                   }, {
                       "title": locale.get({lang: "trade_product_name"}),
                       "dataIndex": "goodsName",
                       "cls": null,
                       "width": "120px"
                   }, {
                       "title": locale.get({lang: "trade_price"}),
                       "dataIndex": "price",
                       "cls": null,
                       "width": "80px",
                       render: priceConvertor
                   }, {
                       "title": locale.get({lang: "trade_pay_style"}),
                       "dataIndex": "payStyle",
                       "cls": null,
                       "width": "90px",
                       render: typeConvertor
                   },{
                       "title": locale.get({lang: "special_offer_price"}),//优惠价格
                       "dataIndex": "price_2",
                       "cls": null,
                       "width": "90px",
                       render: specialPriceConvertor
                   },{
                       "title": locale.get({lang: "special_offer_type"}),//优惠方式
                       "dataIndex": "specialType",
                       "cls": null,
                       "width": "90px",
                       render: specialTypeConvertor
                   }, {
                       "title": locale.get({lang: "trade_pay_status"}),
                       "dataIndex": "payStatus",
                       "cls": null,
                       "width": "90px",
                       render: payStatusConvertor
                   }, {
                       "title": locale.get({lang: "deliver_status"}),
                       "dataIndex": "deliverStatus",
                       "cls": null,
                       "width": "70px",
                       render: deliverConvertor
                   }, {
                       "title": locale.get({lang: "automat_line"}),
                       "dataIndex": "lineName",
                       "cls": null,
                       "width": "100px"
                   }, {
                       "title": locale.get({lang: "refund_status"}),
                       "dataIndex": "refundStatus",
                       "cls": null,
                       "width": "90px",
                       render: refundStatus
                   }, {
                       "title": locale.get({lang: "trade_order_time"}),
                       "dataIndex": "createTime",
                       "cls": null,
                       "width": "150px",
                       render: dateConvertor
                   }, {
                       "title": "",
                       "dataIndex": "id",
                       "cls": "_id" + " " + "hide"
                   }];
    function priceConvertor(value, type) {
        return value / 100;
    }
    function specialPriceConvertor(value, type) {
    	if(value){
    		return value / 100;
    	}
        
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
    function specialTypeConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "focus_deliver_water"});
                    break;
                case 2:
                    display = locale.get({lang: "buy_deliver_one"});
                    break;
                case 3:
                    display = locale.get({lang: "buy_discount"});
                    break;
                case 4:
                    display = locale.get({lang: "buy_discount_perference"});
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
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.lineId = options.lineId;
			this.serialNumber = options.serialNumber;
			this.assetId = options.assetId;
			this.display = 30;
			this.pageDisplay = 30;
			
			this.recordId = null;
			this.elements = {
/*					bar: {
	                    id: "trade_list_bar",
	                    "class": null
	                },*/
	                table: {
	                    id: "trade_list_table",
	                    "class": null
	                },
	                paging: {
	                    id: "trade_list_paging",
	                    "class": null
	                }
	            };
			this._renderWindow();
			//locale.render({element:this.element});
			//$("#device_list_paging").css("width",$("#device_list_table").width());
		},
		_renderWindow:function(){
			
			var self = this; 
			var title = self.serialNumber;
			var str = locale.get({lang: "replenish_serial_number"})+":"+title;

			this.window = new _Window({
				container: "body",
				title: str,
				top: "center",
				left: "center",
				height:550,
				width: 1000,
				mask: true,
				drag:true,
				content:winHtml,
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			//this._renderNoticeBar();
			this.window.show();	
			this.renderTable();
			
			locale.render({element: this.element});
		},
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#trade_list_bar",
                events: {
                    query: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0);
                    }
                }
            });
        },
		renderTable:function() {
			var self = this;
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
						 
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        
	                        
	                    },
	                   scope: this
				}
			});
			var height = $("#trade_list_table").height()+"px";
	        $("#trade_list_table-table").freezeHeader({ 'height': height });
	        
	        this.loadData();
		},
        loadData: function() {
            var self = this;
            var pageDisplay = self.display;
            
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
            	 var lineIds=[];
                 if(linedata && linedata.result && linedata.result.length>0){
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

            	 cloud.util.mask("#trade_list_table");
            	 
                 Service.getTradeList(0, pageDisplay,lineIds,self.serialNumber,self.assetId,function(data) {
                     var total = data.total;
                     this.totalCount = data.result.length;
                     data.total = total;
                     self.listTable.render(data.result);
                     self._renderpage(data, 1);
                     cloud.util.unmask("#trade_list_table");
                 });
                 
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#trade_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#trade_list_table");
                        
                        
                        Service.getTradeList(options.cursor, options.limit, self.lineIds,self.serialNumber,self.assetId, function(data) {
                            callback(data);
                            cloud.util.unmask("#trade_list_table");
                        });

                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		},
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.listTable.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return updateWindow;
});
