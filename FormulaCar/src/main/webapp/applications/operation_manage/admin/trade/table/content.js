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
            "title": locale.get({lang: "trade_organ_name"}),
            "dataIndex": "orgname",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "total_online_number"}),
            "dataIndex": "onlineSum",
            "cls": null,
            "width": "9%"
        },{
            "title": locale.get({lang: "total_volume1"}),
            "dataIndex": "lineTotal",
            "cls": null,
            "width": "9%"
        },{
            "title": locale.get({lang: "total_turnover1"}),
            "dataIndex": "lineAmount",
            "cls": null,
            "width": "9%",
        },{
            "title": locale.get({lang: "wechat_amount"}),
            "dataIndex": "wechat",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "wechat_sum"}),
            "dataIndex": "wechatS",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "alipay_amount"}),
            "dataIndex": "alipay",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "alipay_sum"}),
            "dataIndex": "alipayS",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "cash_amount"}),
            "dataIndex": "other",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "cash_sum"}),
            "dataIndex": "otherS",
            "cls": null,
            "width": "9%",
            render:FormatMon
        }, {
            "title": locale.get({lang: "baifubao_amount"}),
            "dataIndex": "baifubao",
            "cls": null,
            "width": "9%",
            render:FormatMon
        },{
            "title": locale.get({lang: "baifubao_sum"}),
            "dataIndex": "baifubaoS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "swingcard_amount"}),
            "dataIndex": "swingCard",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "swingcard_sum"}),
            "dataIndex": "swingCardS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "onecard_amount"}),
            "dataIndex": "oneCardsolution",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "onecard_sum"}),
            "dataIndex": "oneCardsolutionS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "soundwave_amount"}),
            "dataIndex": "alipaySoundWave",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "soundwave_sum"}),
            "dataIndex": "alipaySoundWaveS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "abc_amount"}),
            "dataIndex": "agriculturalBank",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "abc_sum"}),
            "dataIndex": "agriculturalBankS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "pos_amount"}),
            "dataIndex": "posMachine",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "pos_sum"}),
            "dataIndex": "posMachineS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "game_amount"}),
            "dataIndex": "game",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "game_sum"}),
            "dataIndex": "gameS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "vippay_amount"}),
            "dataIndex": "vipPay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "vippay_sum"}),
            "dataIndex": "vipPayS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "bestpay_amount"}),
            "dataIndex": "bestPay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "bestpay_sum"}),
            "dataIndex": "bestPayS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "jdpay_amount"}),
            "dataIndex": "jdpay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "jdpay_sum"}),
            "dataIndex": "jdpayS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "wechat_barcode_amount"}),
            "dataIndex": "wechatBarcode",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "wechat_barcode_sum"}),
            "dataIndex": "wechatBarcodeS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "alipay_barcode_amount"}),
            "dataIndex": "alipayBarcode",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "alipay_barcode_sum"}),
            "dataIndex": "alipayBarcodeS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "unionpay_amount"}),
            "dataIndex": "unionpay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "unionpay_sum"}),
            "dataIndex": "unionpayStyleS",
            "cls": null,
            "width": "10%",
            render:FormatMon
            
        },{
            "title": "扫码支付(元)",
            "dataIndex": "qrcodepay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": "扫码支付(单)",
            "dataIndex": "qrcodepayS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": "融e联(元)",
            "dataIndex": "icbcpay",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": "融e联(单)",
            "dataIndex": "icbcpayS",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "otherpay_amount"}),
            "dataIndex": "otherPayStyle",
            "cls": null,
            "width": "10%",
            render:FormatMon
        },{
            "title": locale.get({lang: "otherpay_sum"}),
            "dataIndex": "otherPayStyleS",
            "cls": null,
            "width": "10%",
            render:FormatMon
            
        }];
    function FormatMon(value,type){
   	 var display = "";
   	 var num = value;
        if ("display" == type) {
       	    num = num+"";
       	    if(num.indexOf(".") != -1){
       	    	if(isNaN(num))
       	    	    num = "0";
       	    	    sign = (num == (num = Math.abs(num)));
       	    	    num = Math.floor(num*100+0.50000000001);
       	    	    cents = num%100;
       	    	    num = Math.floor(num/100).toString();
       	    	    if(cents<10)
       	    	    cents = "0" + cents;
       	    	    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
       	    	    num = num.substring(0,num.length-(4*i+3))+','+
       	    	    num.substring(num.length-(4*i+3));
       	    	    return (((sign)?'':'-') + num + '.' + cents); 
       	    }else{
       	    	    if(isNaN(num))
       	    	    num = "0";
       	    	    
       	    	    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
       	    	    num = num.substring(0,num.length-(4*i+3))+','+
       	    	    num.substring(num.length-(4*i+3));
       	    	    return num; 
       	    }
       	     
        } else {
            return value;
        }
   	
   	
   }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.data = options.data;
//			this.service = new Service();
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
             var organPay =self.data.result[0].organPay;
             for ( var i = 0; i < organPay.length; i++) {
            	var a=organPay[i];
            	var agriculturalBank = a.agriculturalBank;
            	var alipay = a.alipay;
            	var alipaySoundWave = a.alipaySoundWave;
            	var baifubao = a.baifubao;
            	var game = a.game;
            	var oneCardsolution = a.oneCardsolution;
            	var other = a.other;
            	var otherPayStyle = a.otherPayStyle;
            	var posMachine = a.posMachine;
            	var swingCard = a.swingCard;
            	var vipPay = a.vipPay;
            	var wechat = a.wechat;
            	var bestPay = a.bestPay;
            	var jdpay = a.jdpay;
            	var wechatBarcode = a.wechatBarcode;
            	var alipayBarcode = a.alipayBarcode;
            	var unionpay = a.unionpay;
            	var qrcodepay =  a.qrcodepay;
            	var icbcpay = a.icbcpay;
            	var sum=unionpay+qrcodepay+icbcpay+agriculturalBank+alipay+alipaySoundWave+baifubao+game+oneCardsolution+other+otherPayStyle+posMachine+swingCard+vipPay+wechat+bestPay+jdpay+wechatBarcode+alipayBarcode;
            	sum=parseFloat(sum).toFixed(2);
            	
            	var agriculturalBankS = a.agriculturalBankS;
            	var alipayS = a.alipayS;
            	var alipaySoundWaveS = a.alipaySoundWaveS;
            	var baifubaoS = a.baifubaoS;
            	var gameS = a.gameS;
            	var oneCardsolutionS = a.oneCardsolutionS;
            	var otherS = a.otherS;
            	var otherPayStyleS = a.otherPayStyleS;
            	var posMachineS = a.posMachineS;
            	var swingCardS = a.swingCardS;
            	var vipPayS = a.vipPayS;
            	var wechatS = a.wechatS;
            	var bestPayS = a.bestPayS;
            	var jdpayS = a.jdpayS;
            	var wechatBarcodeS = a.wechatBarcodeS;
            	var alipayBarcodeS = a.alipayBarcodeS;
            	var unionpayS = a.unionpayS;
            	var qrcodepayS =  a.qrcodepayS;
            	var icbcpayS = a.icbcpayS;
            	var sumS=unionpayS+qrcodepayS+icbcpayS+agriculturalBankS+alipayS+alipaySoundWaveS+baifubaoS+gameS+oneCardsolutionS+otherS+otherPayStyleS+posMachineS+swingCardS+vipPayS+wechatS+bestPayS+jdpayS+wechatBarcodeS+alipayBarcodeS;
            	a.lineAmount=sum;
            	a.lineTotal=sumS;
			}
             arr=self.data.result[0].organPay;
             self.dataA = arr;
             var temp = [];
      		
     		 for(var k=0;k<arr.length;k++){
     			temp[k] = arr[k];
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
             
             if(self.data.result[0].organPay.length == 0){
            	 $("#trade_sta_list_paging").hide();
             }
            // self.listTable.render(arr);
             
             var sl = $("#trade_sta_list_table-table").find("thead th");

             var tableObj = document.getElementById("trade_sta_list_table-table"); 
             var cell = [];

         if(self.data.result[0].organPay.length > 0){
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
             
             if(cell.length >= 38){
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
             
             
             //self._renderpage(data, 1);
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
            var blocktd=[];
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
	       		 }else{
	       			 blocktd.push(j);
	       		 }
	       	 }
            
	         if(cell.length >= 38){
	           	 $("#trade_sta_list_table-table").find("thead th").eq(0).css("display","none");
	           	 $("#trade_sta_list_table-table").find("thead th").eq(1).css("display","none");
	         }
	         
	         for(var m=0;m<blocktd.length;m++){
	           	 $("#trade_sta_list_table-table").find("thead th").eq(blocktd[m]).removeAttr("style");
	           	 $("#trade_sta_list_table-table").find("thead th").eq(blocktd[m]).css("width","10%");
	                var ll = $("#trade_sta_list_table-table").find("tbody tr");
	                
	                for(var i=0;i<ll.length;i++){
	               	   $(ll).eq(i).find("td").eq(blocktd[m]).removeAttr("style"); 
	               	   $(ll).eq(i).find("td").eq(blocktd[m]).css("width","10%");
	                }
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
            
            
            //self._renderpage(data, 1);
            cloud.util.unmask("#trade_sta_list_table");
        },
        _renderpage: function(data, start) {
            var self = this;

            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#trade_sta_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        Service.getTradeList(options.cursor, options.limit, self.startTime, self.endTime, self.assetId, function(data) {
                            callback(data);
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
        }
    });
    return list;
});