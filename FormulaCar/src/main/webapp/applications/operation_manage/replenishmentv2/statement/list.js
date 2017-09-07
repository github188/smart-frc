define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");

	var SeeDeviceRecordDetail = require("./seeStatementDetail-window");
	
	var columns = [{
		"title":locale.get({lang:"automat_line"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"automat_site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "100"
	}, /*{
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "120px"
	}, */{
		"title":locale.get({lang:"replenish_serial_number"}),//补货流水号
		"dataIndex" : "serialNumber",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"this_time_of_replenishment"}),//本次补货时间
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "120px",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"sales_volume"}),//销售量
		"dataIndex" : "cidSales",
		"cls" : null,
		"width" : "160px",
		render:function(data, type, row){
			  var display = "";
			  var total=0;var cash=0;var nocash=0;

			  for(var i=0;i<data.length;i++){
				  total += data[i].saleCount.cpNumSInit;
				  cash += data[i].saleCount.cpCashNumSInit;
	   		      nocash += data[i].saleCount.cpNcashNumSInit;
			  }
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
		"dataIndex" : "cidSales",
		"cls" : null,
		"width" : "160px",
		render:function(data, type, row){
			  var display = "";
			  var total=0;var cash=0;var nocash=0;

			  for(var i=0;i<data.length;i++){
				  total += data[i].saleCount.cpMoneySInit/100;
				  cash += data[i].saleCount.cpCashMoneySInit/100;
	   		      nocash += data[i].saleCount.cpNcashMoneySInit/100;
			  }
			 
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.wechatM){
				  amount = data.wechatM;
			  }
			  if(data.wechatNum){
				  sum = data.wechatNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.alipayM){
				  amount = data.alipayM; 
			  }
			  if(data.alipayNum){
				  sum = data.alipayNum;
			  }
			  
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
		"title":locale.get({lang:"baifubao"}),//银联
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.unionPayM){
				  amount = data.unionPayM; 
			  }
			  if(data.unionPayNum){
				  sum = data.unionPayNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.baifubaoM){
				  amount = data.baifubaoM; 
			  }
			  if(data.baifubaoNum){
				  sum = data.baifubaoNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.agriculturalBankM){
				  amount = data.agriculturalBankM; 
			  }
			  if(data.agriculturalBankNum){
				  sum = data.agriculturalBankNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.alipayBarcodeM){
				  amount = data.alipayBarcodeM; 
			  }
			  if(data.alipayBarcodeNum){
				  sum = data.alipayBarcodeNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.alipaySoundWaveM){
				  amount = data.alipaySoundWaveM; 
			  }
			  if(data.alipaySoundWaveNum){
				  sum = data.alipaySoundWaveNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.bestPaM){
				  amount = data.bestPaM; 
			  }
			  if(data.bestPayNum){
				  sum = data.bestPayNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.gameM){
				  amount = data.gameM; 
			  }
			  if(data.gameNum){
				  sum = data.gameNum;
			  }

			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.jdpayM){
				  amount = data.jdpayM; 
			  }
			  if(data.jdpayNum){
				  sum = data.jdpayNum;
			  }

			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.oneCardsolutionM){
				  amount = data.oneCardsolutionM; 
			  }
			  if(data.oneCardsolutionNum){
				  sum = data.oneCardsolutionNum;
			  }

			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.posM){
				  amount = data.posM; 
			  }
			  if(data.posNum){
				  sum = data.posNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.swingCardM){
				  amount = data.swingCardM; 
			  }
			  if(data.swingCardNum){
				  sum = data.swingCardNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.vipPayM){
				  amount = data.vipPayM; 
			  }
			  if(data.vipPayNum){
				  sum = data.vipPayNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.wechatBarcodeM){
				  amount = data.wechatBarcodeM; 
			  }
			  if(data.wechatBarcodeNum){
				  sum = data.wechatBarcodeNum;
			  }
			  
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
		"dataIndex" : "payStyleData2",
		"cls" : null,
		"width" : "130px",
		render:function(data, type, row){
			  var display = "";
			  var amount=0;var sum=0;
			  if(data.otherM){
				  amount = data.otherM; 
			  }
			  if(data.otherNum){
				  sum = data.otherNum;
			  }
			  
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
		"dataIndex" : "noteIncome",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"coin_income_expense"}),//硬币收支
		"dataIndex" : "coinInExpense",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"last_time_of_replenishment"}),//上次补货时间
		"dataIndex" : "lastTime",
		"cls" : null,
		"width" : "120px",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"replenish_person_name"}),//补货人
		"dataIndex" : "operatorId",
		"cls" : null,
		"width" : "100px"
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
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			//$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00");
			var height = $("#content-table-content").height()+"px";
	        $("#content-table-content-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			 var self = this;
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
                 
     			
     			Service.getAllDeviceReplenishmentV3(self.searchData,limit,cursor,function(data){
     				 
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
        	 for(var j = 8;j < sl.length-6; j++){
        		 
        		 var tf = false;
        		 
        		 for(var k = 0;k < tableObj.rows.length;k ++){
        			 if(k >= 1){
        				var tdText = $(tableObj.rows[k].cells[j]).find("table td").eq(3).text();
	            			 //console.log(tableObj.rows[k].cells.length);
	            			 if(tdText != 0){
	            				 tf = true;
	            			 }
	            			 
        			 }
        			 //if(k == 1){
        			//	$(tableObj.rows[k].cells[j-4]).css("display","table-cell");
        			// }else{
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
                	 //}else if(i == 1){
                	//	$(tableObj.rows[1].cells[tdc-4]).css("display","none");
                	 }else{
                		$(tableObj.rows[i].cells[tdc]).css("display","none"); 
                	 }
                	 
                	
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
			$("tbody").find("tr").eq(0).before("<tr style='background: #03b8cf;color: white;'><td style='text-align: center;font-size: 14px;' colspan='5'>"+locale.get({lang:"statement_total"})+"</td><td style='font-size: 13px;'>" +
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
					"</td><td style='font-size: 13px;'>"+noteIncome+"</td><td style='font-size: 13px;'>"+coinInExpense+"</td><td colspan='3'></td></tr>");
			
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
        				Service.getAllDeviceReplenishmentV3(self.searchData, options.limit,options.cursor,function(data){
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
        			    }
        			    */
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
					  },
					  see:function(){
						  var selectedResouces = self.getSelectedResources();
						  if (selectedResouces.length === 0) {
		 					   dialog.render({lang:"please_select_at_least_one_config_item"});
		 					   return;
	                 	  }else if(selectedResouces.length >= 2){
		 				       dialog.render({lang:"select_one_gateway"});
		 				      return;
		 				  }else{
		 					  var serialNumber = selectedResouces[0].serialNumber;
		 					  var assetId = selectedResouces[0].assetId;
		 					  if(this.seeReplenishmentDetail){
		                  			this.seeReplenishmentDetail.destroy();
		                  	  }
		 					  
		 					  this.seeReplenishmentDetail = new SeeDeviceRecordDetail({
		                  			selector:"body",
		                  			serialNumber:serialNumber,
		                  			assetId:assetId,
		                  			events : {
		                  				"getRecordList":function(){
		                  					self.loadTableData($(".paging-limit-select").val(),0);
		                  				}
		                  			}
		                  	  });
		 				  }
					  },
	                    exports: function(lineIds) {//导出
	                    	
	                    	var selectedResouces = self.getSelectedResources();
							  if (selectedResouces.length === 0) {
			 					   dialog.render({lang:"please_select_at_least_one_config_item"});
			 					   return;
		                 	  }else if(selectedResouces.length >= 2){
			 				       dialog.render({lang:"select_one_gateway"});
			 				      return;
			 				  }else{
			 					    var serialNumber = selectedResouces[0].serialNumber;
			 					    var assetId = selectedResouces[0].assetId;
			 					    var language = locale._getStorageLang() === "en" ? 1 : 2;
			                        var host = cloud.config.FILE_SERVER_URL;
			                        var reportName = "TradeReport.xlsx";
			                        
			                        var now = Date.parse(new Date())/1000;
			                        var path = "/home/trade/"+now+"/"+reportName;
			                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
			                        
			                        Service.createTradeExcel(lineIds,serialNumber,now,assetId,language,function(data){
			                        	
			                        	if(data.status == "doing" && data.operation == "export"){
			                        		dialog.render({lang: "export_large_task"});
			                        	}else if(data.status == "failure" && data.operation == "export"){
			                        		dialog.render({lang: "export_large_task_exit"});
			                        	}else{
			                        		
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
			                                	
			                                	Service.findTradeExcel(now,"trade.txt",function(data){
			                                	
			                                		if(data.onlyResultDTO.result.res == "ok"){
			                                			
			                                			cloud.util.ensureToken(function() {
								                            window.open(url, "_self");
								                        });
			                                			clearInterval(timer);
			                                			$("#"+id).html("");
			                                			if($("#bexport")){
			                                				$("#bexport").hide();
			                                			}
			                                    		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>"+locale.get({lang:"export_trade_detail"})+"</span>");
			                                    		$("#"+id).show();
			                                		}
			                                	})
			        					               
			        							
			        						},5000);
			                        	}
			                        	
			                        })
			 					  
			 				  }
	                        
	                        
	                        
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