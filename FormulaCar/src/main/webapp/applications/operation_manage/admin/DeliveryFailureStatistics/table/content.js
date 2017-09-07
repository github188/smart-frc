define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./content.html");
    require("cloud/lib/plugin/jquery-ui");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Table = require("cloud/components/table");
    var Service = require('../service');
    
    var columns = [
        {
            "title": locale.get({lang:"organization_name"}),//机构名称
            "dataIndex": "orgname",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang:"total_shipments_failed"}),//出货失败总数
            "dataIndex": "allCount",
            "cls": null,
            "width": "10%",
            render:function(data, type, row){
            	var display = "";
            	if(data){
            		if(data.length>0){
            			for(var i=0;i<data.length;i++){
            			   var array=data[i].split("||");
            			   var s = array[0];
                      	   if(s == row.orgname){
                      		   var count =array[1];
                      		   var total = array[2];
                      		   var result = toDecimal(count/total);
                          	  
                      		   display =count+" ("+result+"%)";
                      	   }
            			}
            		}
            	   
            	}
            	return display;
            }
        },{
            "title": locale.get({lang:"total_loss_amount"}),//损失总金额
            "dataIndex": "amount",
            "cls": null,
            "width": "10%"
        },{
            "title": locale.get({lang:"trade_baifubao"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "baifubao",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	       if(row.baifubaoS!=null &&row.baifubao!=null){
	 	    	    	display = row.baifubaoS+"/"+row.baifubao;
	 	    	    }else if(row.baifubaoS ==null &&row.baifubao==null){
	 	    	    }else if(row.baifubaoS!=null &&row.baifubao==null){
	 	    	    	display = row.baifubaoS+"/0";
	 	    	    }else if(row.baifubaoS==null &&row.baifubao!=null){
	 	    	    	display = "0/"+row.baifubao;
	 	    	    }
	    	    }
	    	   
	    	    return display;
	       }
        },{
            "title":locale.get({lang:"trade_wx_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "weixin",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.weixinS!=null &&row.weixin!=null){
	  	    	    	display = row.weixinS+"/"+row.weixin;
	  	    	    }else if(row.weixinS ==null &&row.weixin==null){
	  	    	    }else if(row.weixinS!=null &&row.weixin==null){
	  	    	    	display = row.weixinS+"/0";
	  	    	    }else if(row.weixinS==null &&row.weixin!=null){
	  	    	    	display = "0/"+row.weixin;
	  	    	    }
	    	    }
	    	  
	    	    return display;
	       }
        },{
            "title":locale.get({lang:"trade_alipay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "alipay",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.alipayS!=null &&row.alipay!=null){
	 	    	    	display = row.alipayS+"/"+row.alipay;
	 	    	    }else if(row.alipayS ==null &&row.alipay==null){
	 	    	    }else if(row.alipayS!=null &&row.alipay==null){
	 	    	    	display = row.alipayS+"/0";
	 	    	    }else if(row.alipayS==null &&row.alipay!=null){
	 	    	    	display = "0/"+row.alipay;
	 	    	    }
	    	    }
	    	   
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"trade_cash_payment"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "cash",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.cashS!=null &&row.cash!=null){
	 	    	    	display = row.cashS+"/"+row.cash;
	 	    	    }else if(row.cashS ==null &&row.cash==null){
	 	    	    }else if(row.cashS!=null &&row.cash==null){
	 	    	    	display = row.cashS+"/0";
	 	    	    }else if(row.cashS==null &&row.cash!=null){
	 	    	    	display = "0/"+row.cash;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title":locale.get({lang:"trade_swingcard_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "swingcard",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.swingcardS!=null &&row.swingcard!=null){
	 	    	    	display = row.swingcardS+"/"+row.swingcard;
	 	    	    }else if(row.swingcardS ==null &&row.swingcard==null){
	 	    	    }else if(row.swingcardS!=null &&row.swingcard==null){
	 	    	    	display = row.swingcardS+"/0";
	 	    	    }else if(row.swingcardS==null &&row.swingcard!=null){
	 	    	    	display = "0/"+row.swingcard;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"trade_scanner_card"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "scannercard",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.scannercardS!=null &&row.scannercard!=null){
	 	    	    	display = row.scannercardS+"/"+row.scannercard;
	 	    	    }else if(row.scannercardS ==null &&row.scannercard==null){
	 	    	    }else if(row.scannercardS!=null &&row.scannercard==null){
	 	    	    	display = row.scannercardS+"/0";
	 	    	    }else if(row.swingcardS==null &&row.scannercard!=null){
	 	    	    	display = "0/"+row.scannercard;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title":locale.get({lang:"trade_claim_number"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "claimnumber",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.claimnumberS!=null &&row.claimnumber!=null){
	 	    	    	display = row.claimnumberS+"/"+row.claimnumber;
	 	    	    }else if(row.claimnumberS ==null &&row.claimnumber==null){
	 	    	    }else if(row.claimnumberS!=null &&row.claimnumber==null){
	 	    	    	display = row.claimnumberS+"/0";
	 	    	    }else if(row.claimnumberS==null &&row.claimnumber!=null){
	 	    	    	display = "0/"+row.claimnumber;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"trade_game"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "game",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.gameS!=null &&row.game!=null){
	 	    	    	display = row.gameS+"/"+row.game;
	 	    	    }else if(row.gameS ==null &&row.game==null){
	 	    	    }else if(row.gameS!=null &&row.game==null){
	 	    	    	display = row.gameS+"/0";
	 	    	    }else if(row.gameS==null &&row.game!=null){
	 	    	    	display = "0/"+row.game;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"trade_soundwave_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "soundwave",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.soundwaveS!=null &&row.soundwave!=null){
	 	    	    	display = row.soundwaveS+"/"+row.soundwave;
	 	    	    }else if(row.soundwaveS ==null &&row.soundwave==null){
	 	    	    }else if(row.soundwaveS!=null &&row.soundwave==null){
	 	    	    	display = row.soundwaveS+"/0";
	 	    	    }else if(row.soundwaveS==null &&row.soundwave!=null){
	 	    	    	display = "0/"+row.soundwave;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title": locale.get({lang:"trade_pos_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "posmach",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.posmachS!=null &&row.posmach!=null){
	 	    	    	display = row.posmachS+"/"+row.posmach;
	 	    	    }else if(row.posmachS ==null &&row.posmach==null){
	 	    	    }else if(row.posmachS!=null &&row.posmach==null){
	 	    	    	display = row.posmachS+"/0";
	 	    	    }else if(row.posmachS==null &&row.posmach!=null){
	 	    	    	display = "0/"+row.posmach;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title": locale.get({lang:"trade_onecard_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "onecardsolution",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.onecardsolutionS!=null &&row.onecardsolution!=null){
	 	    	    	display = row.onecardsolutionS+"/"+row.onecardsolution;
	 	    	    }else if(row.onecardsolutionS ==null &&row.onecardsolution==null){
	 	    	    }else if(row.onecardsolutionS!=null &&row.onecardsolution==null){
	 	    	    	display = row.onecardsolutionS+"/0";
	 	    	    }else if(row.onecardsolutionS==null &&row.onecardsolution!=null){
	 	    	    	display = "0/"+row.onecardsolution;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title": locale.get({lang:"trade_abc_palm_bank"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "abc",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.abcS!=null &&row.abc!=null){
	 	    	    	display = row.abcS+"/"+row.abc;
	 	    	    }else if(row.abcS ==null &&row.abc==null){
	 	    	    }else if(row.abcS!=null &&row.abc==null){
	 	    	    	display = row.abcS+"/0";
	 	    	    }else if(row.abcS==null &&row.abc!=null){
	 	    	    	display = "0/"+row.abc;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title": locale.get({lang:"wechat_reversescan_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "wechatreversescan",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.wechatreversescanS!=null &&row.wechatreversescan!=null){
	 	    	    	display = row.wechatreversescanS+"/"+row.wechatreversescan;
	 	    	    }else if(row.wechatreversescanS ==null &&row.wechatreversescan==null){
	 	    	    }else if(row.wechatreversescanS!=null &&row.wechatreversescan==null){
	 	    	    	display = row.wechatreversescanS+"/0";
	 	    	    }else if(row.wechatreversescanS==null &&row.wechatreversescan!=null){
	 	    	    	display = "0/"+row.wechatreversescan;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title": locale.get({lang:"trade_vip"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "vip",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.vipS!=null &&row.vip!=null){
	 	    	    	display = row.vipS+"/"+row.vip;
	 	    	    }else if(row.vipS ==null &&row.vip==null){
	 	    	    }else if(row.vipS!=null &&row.vip==null){
	 	    	    	display = row.vipS+"/0";
	 	    	    }else if(row.vipS==null &&row.vip!=null){
	 	    	    	display = "0/"+row.vip;
	 	    	    }
	    	    }
	    	    return display;
	       }
        },{
            "title":locale.get({lang:"trade_best_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "bestpay",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.bestpayS!=null &&row.bestpay!=null){
	 	    	    	display = row.bestpayS+"/"+row.bestpay;
	 	    	    }else if(row.bestpayS ==null &&row.bestpay==null){
	 	    	    }else if(row.bestpayS!=null &&row.bestpay==null){
	 	    	    	display = row.bestpayS+"/0";
	 	    	    }else if(row.bestpayS==null &&row.bestpay!=null){
	 	    	    	display = "0/"+row.bestpay;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"automat_jd_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "jd",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.jdS!=null &&row.jd!=null){
	 	    	    	display = row.jdS+"/"+row.jd;
	 	    	    }else if(row.jdS ==null &&row.jd==null){
	 	    	    }else if(row.jdS!=null &&row.jd==null){
	 	    	    	display = row.jdS+"/0";
	 	    	    }else if(row.jdS==null &&row.jd!=null){
	 	    	    	display = "0/"+row.jd;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"trade_reversescan_pay"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "reversescan",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.reversescanS!=null &&row.reversescan!=null){
	 	    	    	display = row.reversescanS+"/"+row.reversescan;
	 	    	    }else if(row.reversescanS ==null &&row.reversescan==null){
	 	    	    }else if(row.reversescanS!=null &&row.reversescan==null){
	 	    	    	display = row.reversescanS+"/0";
	 	    	    }else if(row.reversescanS==null &&row.reversescan!=null){
	 	    	    	display = "0/"+row.reversescan;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"integral_exchange"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "integralexchange",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.integralexchangeS!=null &&row.integralexchange!=null){
	 	    	    	display = row.integralexchangeS+"/"+row.integralexchange;
	 	    	    }else if(row.integralexchangeS ==null &&row.integralexchange==null){
	 	    	    }else if(row.integralexchangeS!=null &&row.integralexchange==null){
	 	    	    	display = row.integralexchangeS+"/0";
	 	    	    }else if(row.integralexchangeS==null &&row.integralexchange!=null){
	 	    	    	display = "0/"+row.integralexchange;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": locale.get({lang:"UnionPay_payment"})+locale.get({lang:"sum_yuan"}),
            "dataIndex": "unionpay",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.unionpayS!=null &&row.unionpay!=null){
	 	    	    	display = row.unionpayS+"/"+row.unionpay;
	 	    	    }else if(row.unionpayS ==null &&row.unionpay==null){
	 	    	    }else if(row.unionpayS!=null &&row.unionpay==null){
	 	    	    	display = row.unionpayS+"/0";
	 	    	    }else if(row.unionpayeS==null &&row.unionpay!=null){
	 	    	    	display = "0/"+row.unionpay;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": "扫码支付"+locale.get({lang:"sum_yuan"}),
            "dataIndex": "qrcodepay",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.qrcodepayS!=null &&row.qrcodepay!=null){
	 	    	    	display = row.qrcodepayS+"/"+row.qrcodepay;
	 	    	    }else if(row.qrcodepayS ==null &&row.qrcodepay==null){
	 	    	    }else if(row.qrcodepayS!=null &&row.qrcodepay==null){
	 	    	    	display = row.qrcodepayS+"/0";
	 	    	    }else if(row.qrcodepayS==null &&row.qrcodepay!=null){
	 	    	    	display = "0/"+row.qrcodepay;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }, {
            "title": "融e联"+locale.get({lang:"sum_yuan"}),
            "dataIndex": "icbcpay",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
	    	    var display = "";
	    	    if(row){
	    	        if(row.icbcpayS!=null &&row.icbcpay!=null){
	 	    	    	display = row.qrcodepayS+"/"+row.icbcpay;
	 	    	    }else if(row.icbcpayS ==null &&row.icbcpay==null){
	 	    	    }else if(row.icbcpayS!=null &&row.icbcpay==null){
	 	    	    	display = row.icbcpayS+"/0";
	 	    	    }else if(row.icbcpayS==null &&row.icbcpay!=null){
	 	    	    	display = "0/"+row.icbcpay;
	 	    	    }
	    	    }
	    	    return display;
	       }
        }];
    function toDecimal(x) { 
    	   var f = parseFloat(x); 
    	   if (isNaN(f)) { 
    	    return; 
    	   } 
    	   f = Math.round(x*100); 
    	   return f; 
   } 
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.data = options.data;
            this.count = options.count;
            this.elements = {
                table: {
                    id: "trade_sta_list_table",
                    "class": null
                },
                paging: {
                    id: "trade_sta_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml(); 
            this.setDataTable();

            $("#paging-limit-text1").text(locale.get({lang:"per_page"}));
            $("#page_total").text(locale.get({lang:"page_total"}));
            $("#nooldle").text(locale.get({lang:"nooldle"}));
        },
        _renderHtml: function() {
            this.element.html(html);
            $("#paging-page-current").bind('keyup',function(){
	        	this.value=this.value.replace(/[^\.\d]/g,"");
	        	this.value=this.value.replace(".","");
	        });
            this._renderTable();
        }, 
        _renderTable: function() {
            var self = this;
            this.listTable = new Table({
                selector: "#trade_sta_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    scope: this
                }
            }); 
            $("#trade_sta_list_table-table").css("margin-bottom","80px");
        },
        
        setDataTable: function() {
             cloud.util.mask("#trade_sta_list_table");
             var self = this;
             $("#paging-page-current").val(1);
             $("#paging-limit-select").val(self.pageDisplay);
             var arr=[];
             
             arr=self.data;
             self.dataA = arr;
             var temp = [];
      		 
             
     		 for(var k=0;k<arr.length;k++){
     			temp[k] = arr[k];
     			temp[k].allCount =self.count; 
     			if(k == self.pageDisplay-1){
     				break;
     			}
     		 }
     		console.log(temp);
     		 self.listTable.render(temp);
     		                     
             self.total = arr.length;                         
             
             self.pageCount = Math.ceil(self.total/self.pageDisplay);
             
             $("#paging-page-total").text(self.pageCount);
             
             $(".totals").text(self.total);
             //跳转
             $("#paging-page-jump").bind('click',function(){
            	 
            	var page = $("#paging-page-current").val();
            	
            	$("#paging-page-nextpage").show();
            	$("#paging-page-previouspage").show();
            	
            	if(page >= self.pageCount){
            	 page = self.pageCount;
           		 $("#paging-page-current").val(self.pageCount);
           		 $("#paging-page-nextpage").hide();
           	    }
            	if(page <= 1){
            	 page = 1;
           		 $("#paging-page-current").val(1);
           		 $("#paging-page-previouspage").hide();
           	    }
            	self._openPage(page);
            	
            	 
             });
             
             //每页显示数据量选择
             $("#paging-limit-select").bind('change',function(){
            	 self.pageDisplay = $(this).children('option:selected').val();
            	 self.render();
             });
             //下一页
             $("#paging-page-nextpage").bind('click',function(){
            	 
            	 $("#paging-page-previouspage").show();
            	 
            	 var nowpage = $("#paging-page-current").val();
            	 
            	 var nextpage = nowpage+1;
            	 if(nextpage >= self.pageCount){
            		 nextpage = self.pageCount;
            		 $("#paging-page-current").val(self.pageCount);
            		 $("#paging-page-nextpage").hide();
            	 }else if(nextpage <= 1){
            		 nextpage = 1;
               		 $("#paging-page-current").val(1);
               		 $("#paging-page-previouspage").hide();
               	 }
            	 self._openPage(nextpage);
            	 
            	 
            	 
             });
             //上一页
             $("#paging-page-previouspage").bind('click',function(){
            	 
            	 $("#paging-page-nextpage").show();
            	 
            	 var nowpage = $("#paging-page-current").val();
            	 
            	 var prepage = nowpage-1;
            	 
            	 if(prepage <= 1){
            		 prepage = 1;
            		 $("#paging-page-current").val(1);
            		 $("#paging-page-previouspage").hide();
            	 }else if(prepage >= self.pageCount){
            		 prepage = self.pageCount;
            		 $("#paging-page-current").val(self.pageCount);
            		 $("#paging-page-nextpage").hide();
            	 }
            	 self._openPage(prepage);
            	 
            	 
            	 
             });
            //跳转鼠标滑过样式
            $("#paging-page-jump").mouseover(function (){
   		    	$("#paging-page-jump").css("background","url('../../cloud/components/resources/images/shuaxin2.png') 1px 1px no-repeat");
   			}).mouseout(function (){
   				$("#paging-page-jump").css("background","url('../../cloud/components/resources/images/shuaxin1.png') 1px 1px no-repeat");
   			});
            //上一页鼠标滑过样式
            $("#paging-page-previouspage").mouseover(function (){
  		    	$("#paging-page-previouspage").css("background","url('../../cloud/components/resources/images/left2.png')");
  			}).mouseout(function (){
  				$("#paging-page-previouspage").css("background","url('../../cloud/components/resources/images/left1.png')");
  			});
            //下一页鼠标滑过样式
            $("#paging-page-nextpage").mouseover(function (){
            	 $("#paging-page-nextpage").css("background","url('../../cloud/components/resources/images/right2.png')");
  			}).mouseout(function (){
  				$("#paging-page-nextpage").css("background","url('../../cloud/components/resources/images/right1.png')");
  			});
             
             
             if(self.pageCount == 1){
            	 $("#paging-page-previouspage").hide();
            	 $("#paging-page-nextpage").hide();
             }
             
             if(self.data.length == 0){
            	 $("#trade_sta_list_paging").hide();
             }
            // self.listTable.render(arr);
             
             var sl = $("#trade_sta_list_table-table").find("thead th");

             var tableObj = document.getElementById("trade_sta_list_table-table"); 
             var cell = [];

         if(self.data.length > 0){
        	//将支付方式数据为空的列隐掉	     
        	 for(var j = 2;j < sl.length-1; j++){
        		 
        		 var tf = false;
        		 
    			 for(var k = 1;k < tableObj.rows.length;k ++){
        			 
        			 var td = tableObj.rows[k].cells[j].innerHTML;
        			 if(td != 0){
        				 tf = true;
        			 }
        		 }
        		 
        		 if(!tf){
        			 cell.push(j);
        		 }
        		 
        	 }
             
             if(cell.length >= 40){
            	 $("#trade_sta_list_table-table").find("thead th").eq(0).css("display","none");
            	 $("#trade_sta_list_table-table").find("thead th").eq(1).css("display","none");
             }
             for(var m=0;m<cell.length;m++){
            	 $("#trade_sta_list_table-table").find("thead th").eq(cell[m]).css("display","none");
                 var ll = $("#trade_sta_list_table-table").find("tbody tr");
                 
                 for(var i=0;i<ll.length;i++){
                	 $(ll).eq(i).find("td").eq(cell[m]).css("display","none");
                 }
             }
         }else{
        	 $("#trade_sta_list_table-table").find("thead").css("display","none");
        	 
         }
             cloud.util.unmask("#trade_sta_list_table");
           
        },
      //根据页码判断加载数据
        _openPage:function(page){
        	var self = this;
        	
        	var arr = self.dataA;
        	if(page >= self.pageCount){
        		
    			var tempA = [];
        		var start = (self.pageCount-1)*self.pageDisplay;
        		
        		for(var m=start;m<arr.length;m++){
        			tempA[m-start] = arr[m];
        		}
        		$("#paging-page-current").val(self.pageCount);
        		self._renderRefresh(tempA);
    			
    			
    		}else{
    			var tempA = [];
        		var start = (page-1)*self.pageDisplay;
        		var end = (page)*self.pageDisplay;
        		for(var m=start;m<end;m++){
        			tempA[m] = arr[m];
        		}
        		
        		self._renderRefresh(tempA);
    		}
        	
        	
        },
        _renderRefresh: function(arr){
        	var self = this;
        	cloud.util.mask("#trade_sta_list_table");
        	
        	self.listTable.render(arr);
            
        	var sl = $("#trade_sta_list_table-table").find("thead th");

            var tableObj = document.getElementById("trade_sta_list_table-table"); 
            var cell = [];

        if(arr.length > 0){
       	//将支付方式数据为空的列隐掉	     
       	 for(var j = 2;j < sl.length-1; j++){
       		 
       		 var tf = false;
       		 
   			 for(var k = 1;k < tableObj.rows.length;k ++){
       			 
       			 var td = tableObj.rows[k].cells[j].innerHTML;
       			 if(td != 0){
       				 tf = true;
       			 }
       		 }
       		 
       		 if(!tf){
       			 cell.push(j);
       		 }
       		 
       	 }
            
            if(cell.length >= 40){
           	 $("#trade_sta_list_table-table").find("thead th").eq(0).css("display","none");
           	 $("#trade_sta_list_table-table").find("thead th").eq(1).css("display","none");
            }
            for(var m=0;m<cell.length;m++){
           	 $("#trade_sta_list_table-table").find("thead th").eq(cell[m]).css("display","none");
                var ll = $("#trade_sta_list_table-table").find("tbody tr");
                
                for(var i=0;i<ll.length;i++){
               	 $(ll).eq(i).find("td").eq(cell[m]).css("display","none");
                }
            }
        }else{
       	 $("#trade_sta_list_table-table").find("thead").css("display","none");
       	 
        }
            cloud.util.unmask("#trade_sta_list_table");
        }
        
    });
    return list;
});