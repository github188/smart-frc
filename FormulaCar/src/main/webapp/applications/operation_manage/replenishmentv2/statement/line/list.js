define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../../service");

	var SeeDeviceRecordDetail = require("./seeStatementDetail-window");
	
	var columns = [{
		"title":locale.get({lang:"automat_line"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"site_count"}),//点位数量
		"dataIndex" : "deviceCount",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"sales_volume"}),//销售量
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "180px",
		render:function(data, type, row){
			  var display = "";
			  var total='';var cash='';var nocash='';
   		      total = data.salesNum;
   		      cash = data.cashSalesNum;
   		      nocash = data.nocashSalesNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+total+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+cash+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+nocash+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"sales_amount"})+'('+locale.get({lang:"china_yuan"})+')',//销售额
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "180px",
		render:function(data, type, row){
			  var display = "";
			  var total='';var cash='';var nocash='';
   		      total = data.salesMoney/100;
   		      cash = data.cashSalesMoney/100;
   		      nocash = data.nocashSalesMoney/100;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+total+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+cash+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+nocash+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"we_chat"}),//微信
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.wechatM;
			  sum = data.wechatNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"alipay"}),//支付宝
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.alipayM;
			  sum = data.alipayNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"baifubao"}),//百付宝
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.baifubaoM;
			  sum = data.baifubaoNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_abc"}),//农行掌银
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.agriculturalBankM;
			  sum = data.agriculturalBankNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_reversescan_pay"}),//支付宝反扫
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.alipayBarcodeM;
			  sum = data.alipayBarcodeNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_soundware"}),//声波
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.alipaySoundWaveM;
			  sum = data.alipaySoundWaveNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"automat_best_pay"}),//翼支付
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.bestPaM;
			  sum = data.bestPayNum;
			  
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_game"}),//游戏
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.gameM;
			  sum = data.gameNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"Jingdong_Wallet"}),//京东支付
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.jdpayM;
			  sum = data.jdpayNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"one_card_solution"}),//一卡通
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.oneCardsolutionM;
			  sum = data.oneCardsolutionNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_pos_mach"}),//pos机
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.posM;
			  sum = data.posNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_swing_card"}),//刷卡
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.swingCardM;
			  sum = data.swingCardNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"trade_vip"}),//会员
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.vipPayM;
			  sum = data.vipPayNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"wechat_reversescan_pay"}),//微信反扫
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.wechatBarcodeM;
			  sum = data.wechatBarcodeNum;
			  
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"other"}),//其他
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  amount = data.otherM;
			  sum = data.otherNum;
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+amount/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+sum+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"note_income"}),//纸币收支
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "100px",
		render:function(data, type, row){
			 
	    	 return data.noteIncome;
		}
	},{
		"title":locale.get({lang:"coin_income_expense"}),//硬币收支
		"dataIndex" : "detailData",
		"cls" : null,
		"width" : "100px",
		render:function(data, type, row){
			 
	    	 return data.coinInExpense;
		}
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function priceConvertor(value,type){
		return value/100;
	}

	function machineType(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "drink_machine"});
                    break;
                case 2:
                    display = locale.get({lang: "spring_machine"});
                    break;
                case 3:
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
	function recordType(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"report_of_the_vending_machine"});
					break;
				case "2":
					display = locale.get({lang:"manual_introduction"});
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
					id : "content-table-toolbar",
					"class" : null
				},
				table : {
					id : "content-table-content",
					"class" : null
				},
				paging : {
					id : "content-table-pag",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#devices_list").css("width",$(".wrap").width());
			$("#content-table-pag").css("width",$(".wrap").width());
			
			$("#devices_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#devices_list").height();
		    var barHeight = $("#content-table-toolbar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#content-table-content").css("height",tableHeight);
		    
			$("#content-table-content").css("width",$(".wrap").width());
			
			
			var height = $("#content-table-content").height()+"px";
	        $("#content-table-content-table").freezeHeader({ 'height': height });
			this.setDataTable();
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
				selector : "#content-table-content",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = self.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			//$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00");
			
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			 var self = this;
			 
			 if(self.listTable != null){
				 self.listTable.destroy();
				 $("#content-table-toolbar").after("<div id='content-table-content' style='height:88%;overflow: auto;'></div>");
				 
			 }
			 self._renderTable();
			 cloud.util.mask("#content-table-content");
			 var search=$("#search").val();
             var searchValue=$("#searchValue").val();
             
             var startTime=$("#startTime").val();
             var endTime=$("#endTime").val();
             
             var start ='';
			 if(startTime){
				start = (new Date(startTime)).getTime()/1000; 
			 }else{
				start = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00:00")).getTime()/1000;
			 }
			 var end ='';
			 if(endTime){
				end = (new Date(endTime+":59")).getTime()/1000; 
			 }else{
				end = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59:59")).getTime()/1000;;
			 }
			 if(start!=null&&end!=null&&start>=end){
              	
              	dialog.render({lang:"start_date_cannot_be_greater_than_end_date"});
        		return;
             }
             
             var userline = "";
             if($("#userline").attr("multiple") != undefined){
            	 userline = $("#userline").multiselect("getChecked").map(function(){//线路
 					return this.value;	
 			 }).get();
             }
             
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
                 
                  if(userline.length == 0){
 	                userline = lineIds;
 	             }
                  if(search!=null){
                 	 if(search ==0){
                 		 self.searchData = {
                   				"assetId":searchValue,
                   				"lineId":userline,
                   				"startTime":start,
                   				"endTime":end
                   		 };
                 	 }else if(search ==1){
                 		 self.searchData = {
                    				"siteName":searchValue,
                    				"lineId":userline,
                    				"startTime":start,
                    				"endTime":end
                    		};
                 	 }else if(search == 2){
                 		self.searchData = {
                				"lineId":userline,
                				"startTime":start,
                				"endTime":end,
                				"personName":searchValue
                		};
        		      };
                 	 
                  }else{
                 	 self.searchData = {
                 				"lineId":userline,
                 				"startTime":start,
                 				"endTime":end
                 	 };
                  }
                 
     			
     			Service.getAllLineReplenishmentV3(self.searchData,limit,cursor,function(data){
     				 
     				 var total = data.result.length;
     				 self.pageRecordTotal = total;
     	        	 self.totalCount = data.result.length;
            		 self.listTable.render(data.result);
            		/* if(total > 0){
            			 self.renderTotal(data.extra);
            		 }*/
     	        	 self._renderpage(data, 1);
     	        	 
     	        	 self._operaTable();

     	        	 cloud.util.unmask("#content-table-content");
     			 }, self);
             });
             
		},
		_operaTable:function(){
			
			 var sl = $("#content-table-content-table").find("thead th");

             var tableObj = document.getElementById("content-table-content-table"); 
             
             var cell = [];
        	 for(var j = 5;j < sl.length-4; j++){
        		 
        		 var tf = false;
        		 
        		 for(var k = 0;k < tableObj.rows.length;k ++){
        			 if(k >= 1){
        				var tdText = $(tableObj.rows[k].cells[j]).find("table td").eq(3).text();
	            			 //console.log(tableObj.rows[k].cells.length);
	            			 if(tdText != 0){
	            				 tf = true;
	            			 }
	            			 
        			 }
        			 /*if(k == 1){
        				$(tableObj.rows[k].cells[j-2]).css("display","table-cell");
        			 }else{*/
        				$(tableObj.rows[k].cells[j]).css("display","table-cell"); 
        			// }
        			 
        			 
        		 }
        		
        		 if(!tf){
        			 cell.push(j);
        		 }
        		 
        	 }

             for(var m=0;m<cell.length;m++){
            	 //$("#content-table-content-table").find("thead th").eq(cell[m]).css("display","none");
            	 var tableObj = document.getElementById("content-table-content-table");
            	 var tdc = cell[m];
                 for(var i=0;i<tableObj.rows.length;i++){
                	 if(i == 0){
                		$(tableObj.rows[0].cells[tdc]).css("display","none");  
                	 }/*else if(i == 1){
                		$(tableObj.rows[1].cells[tdc-2]).css("display","none");
                	 }*/else{
                		$(tableObj.rows[i].cells[tdc]).css("display","none"); 
                	 }
                	 
                	
                 }
                
             }
			
			
            var len = sl.length;
         	var pageWidth = parseInt(window.screen.width)*0.98;
         	var relWidth = 0;
         	
             for(var k = 1;k < len-2; k++){
            	 if($(tableObj.rows[0].cells[k]).css("display") != "none"){
            		 relWidth += parseInt($(tableObj.rows[0].cells[k]).width());
            		 
            	 }
            	 
            	 
             }
             console.log(pageWidth+"---"+relWidth);
          	 if(relWidth < pageWidth){
          		for(var h = 1;h < len-2; h++){

          			$(tableObj.rows[0].cells[h]).css("width",pageWidth*parseInt($(tableObj.rows[0].cells[h]).width())/relWidth);

              	}
          	 }
             
		},
		renderTotal:function(data){
			
			var noteIncome = "";
			var coinInExpense = ""
			if(data.noteIncome != null){
				noteIncome = data.noteIncome;
			}
			if(data.coinInExpense != null){
				coinInExpense = data.coinInExpense;
			}
			$("tbody").find("tr").eq(0).before("<tr style='background: #03b8cf;color: white;'><td style='text-align: center;font-size: 14px;' colspan='3'>"+locale.get({lang:"statement_total"})+"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'><tbody><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+data.salesNum+"</td></tr><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+data.cashSalesNum+"</td></tr><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+data.nocashSalesNum+"</td></tr></tbody></table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'><tbody><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+data.salesMoney/100+"</td></tr><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+data.cashSalesMoney/100+"</td></tr><tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+data.nocashSalesMoney/100+"</td></tr></tbody></table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.wechatM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.wechatNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.alipayM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.alipayNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.baifubaoM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.baifubaoNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.agriculturalBankM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.agriculturalBankNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.alipayBarcodeM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.alipayBarcodeNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.alipaySoundWaveM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.alipaySoundWaveNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.bestPaM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.bestPayNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.gameM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.gameNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.jdpayM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.jdpayNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.oneCardsolutionM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.oneCardsolutionNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.posM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.posNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.swingCardM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.swingCardNum+"</td></tr>"+
	    			"</table>" +

					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.vipPayM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.vipPayNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.wechatBarcodeM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.wechatBarcodeNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>" +
					"<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;width:50px;padding-left: 2px;'>"+locale.get({lang:"sales_amount"})+":</td><td>"+data.otherM/100+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: left;padding-left: 2px;'>"+locale.get({lang:"shelf_platformsalenum"})+":</td><td>"+data.otherNum+"</td></tr>"+
	    			"</table>" +
					"</td><td style='font-size: 13px;'>"+noteIncome+"</td><td style='font-size: 13px;'>"+coinInExpense+"</td></tr>");
			
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#content-table-pag"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#content-table-content");
        				Service.getAllLineReplenishmentV3(self.searchData, options.limit,options.cursor,function(data){
         				   self.pageRecordTotal = data.total - data.cursor;
 						   callback(data);
 						  cloud.util.unmask("#content-table-content");
         				});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.listTable.clearTableData();
        			    self.listTable.render(data.result);
        			    /*if(data.result.length > 0){
        			    	self.renderTotal(data.extra);
        			    }*/
        			    
        			    self._operaTable();
        			    
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
				selector : "#content-table-toolbar",
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
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return list;
});