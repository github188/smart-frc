define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./seeReplenishment.html");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");

	require("cloud/components/print");
	var Service = require("../../service");
	var columns = [{
		"title":locale.get({lang:"device_shelf_number"}),//货柜编号
		"dataIndex" : "cid",
		"cls" : null,
		"width" : "60px"
	},{
		"title":locale.get({lang:"shelf_location_id"}),//货道编号
		"dataIndex" : "locationId",
		"cls" : null,
		"width" : "80px"
	}, {
		"title":locale.get({lang:"shelf_goods_name"}),//商品名称
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "110px"
	},{
		"title":locale.get({lang:"record_replenishment_quantity"}),//补货数量
		"dataIndex" : "replenCount",
		"cls" : null,
		"width" : "80px"
	},{
		"title":locale.get({lang:"shelf_last_sum"}),//上次合计销量
		"dataIndex" : "lastSaleNum",
		"cls" : null,
		"width" : "90px"
	},{
		"title":locale.get({lang:"shelf_this_sum"}),//本次合计销量
		"dataIndex" : "platSaleNum",
		"cls" : null,
		"width" : "90px"
	},{
		"title":locale.get({lang:"shelf_platformsale_sum"}),//本期销量
		"dataIndex" : "platformSaleNum",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"shelf_last_amount"}),//上次合计销售额
		"dataIndex" : "lastSaleM",
		"cls" : null,
		"width" : "100px",
		render:priceConvertor
	},{
		"title":locale.get({lang:"shelf_this_amount"}),//本次合计销售额
		"dataIndex" : "platSaleM",
		"cls" : null,
		"width" : "100px",
		render:priceConvertor
	},{
		"title":locale.get({lang:"shelf_platformsale_amount"}),//本期销售额
		"dataIndex" : "platformSaleM",
		"cls" : null,
		"width" : "100px",
		render:priceConvertor
	}/*,{
        "title": locale.get({lang: "wechat_amount"}),
        "dataIndex": "wechatM",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "wechat_sum"}),
        "dataIndex": "wechatNum",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "alipay_amount"}),
        "dataIndex": "alipayM",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "alipay_sum"}),
        "dataIndex": "alipayNum",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "cash_amount"}),
        "dataIndex": "cashM",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "cash_sum"}),
        "dataIndex": "cashNum",
        "cls": null,
        "width": "110px"
    }, {
        "title": locale.get({lang: "baifubao_amount"}),
        "dataIndex": "baifubaoM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "baifubao_sum"}),
        "dataIndex": "baifubaoNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "swingcard_amount"}),
        "dataIndex": "swingCardM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "swingcard_sum"}),
        "dataIndex": "swingCardNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "onecard_amount"}),
        "dataIndex": "oneCardsolutionM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "onecard_sum"}),
        "dataIndex": "oneCardsolutionNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "soundwave_amount"}),
        "dataIndex": "alipaySoundWaveM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "soundwave_sum"}),
        "dataIndex": "alipaySoundWaveNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "abc_amount"}),
        "dataIndex": "agriculturalBankM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "abc_sum"}),
        "dataIndex": "agriculturalBankNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "pos_amount"}),
        "dataIndex": "posM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "pos_sum"}),
        "dataIndex": "posNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "game_amount"}),
        "dataIndex": "gameM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "game_sum"}),
        "dataIndex": "gameNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "vippay_amount"}),
        "dataIndex": "vipPayM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "vippay_sum"}),
        "dataIndex": "vipPayNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "bestpay_amount"}),
        "dataIndex": "bestPayM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "bestpay_sum"}),
        "dataIndex": "bestPayNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "jdpay_amount"}),
        "dataIndex": "jdpayM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "jdpay_sum"}),
        "dataIndex": "jdpayNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "wechat_barcode_amount"}),
        "dataIndex": "wechatBarcodeM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "wechat_barcode_sum"}),
        "dataIndex": "wechatBarcodeNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "alipay_barcode_amount"}),
        "dataIndex": "alipayBarcodeM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "alipay_barcode_sum"}),
        "dataIndex": "alipayBarcodeNum",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "otherpay_amount"}),
        "dataIndex": "otherM",
        "cls": null,
        "width": "110px"
    },{
        "title": locale.get({lang: "otherpay_sum"}),
        "dataIndex": "otherNum",
        "cls": null,
        "width": "110px"
        
    }*/];
	function priceConvertor(value,type){
		return value/100;
	}
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.recordId = options.id;
			
			this._renderWindow();
			this.elements = {
	                table: {
	                    id: "replenishment_shelf_list_table",
	                    "class": null
	                }
	            };
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this; 
			this.window = new _Window({
				container: "body",
				title: locale.get({lang: "replenishment_detail"}),
				top: "center",
				left: "center",
				height:520,
				width: 1100,
				mask: true,
				drag:true,
				content:html,
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();
			
			//this._renderHtml(); 
			this.renderTable();
			this.loadData();
		},
		_renderHtml: function() {
            this.element.html(html);
        },
		_renderBtn:function(){		
			var self = this;
			
		    //添加打印
	        /*$("#ui-window-title").append("<span class='printer' ></span>");
		    $(".printer").mouseover(function (){
				$('.printer').css("opacity","1");
			}).mouseout(function (){
				$('.printer').css("opacity","0.7");
			});
		    
		    $(".printer").bind("click",function(){
		    	
		    	$('.ui-window-content').printArea();
		    	
		    	
		    });*/
		    
		    $("#ui-window-title").css("height","45px");
		},
		renderTable : function() {
			this.listTable = new Table({
				selector : "#replenishment_shelf_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "none",
				events : {
					 onRowClick: function(data) {
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        if(data.range != null){
	                        	$(tr).find("td").eq(0).css("border-bottom","1px solid #ddd");
	                        }else{
	                        	$(tr).find("td").eq(0).css("border","1px solid white");
	                        }
	                        $(tr).find("td").eq(0).css("background","white");
	                    },
	                   scope: this
				}
			});
			 
			
		},
		loadData:function(){
			var self = this;
			
			var height = $("#ui-window-content").height()+"px";
	        $("#replenishment_shelf_list_table-table").freezeHeader({ 'height': height });
			Service.getRecordDetailV3ById(self.recordId,function(data){
				
				if(data && data.result && data.result.cidRecord){
					
					var shelves = [];
					for(var i=0;i<data.result.cidRecord.length;i++){
						var cid = data.result.cidRecord[i].cid;
						var machineType = data.result.cidRecord[i].machineType;
						var shelvesRecord = data.result.cidRecord[i].shelvesRecord;
						//按货道号排序
						var locationIdOrderA = shelvesRecord.sort(  
				                function(a, b)  
				                {  
				                    return (parseInt(a.locationId) - parseInt(b.locationId));  
				                }  
				         );
						//在合适位置显示货柜编号
						var len = locationIdOrderA.length;
						var index = 0;
						if(len%2 == 0){
							index = len/2;
						}else if(len%2 == 1){
							index = (len-1)/2;
						}
						locationIdOrderA[index].cid = cid;
						for(var j=0;j<len;j++){
							if(j == len-1){
								locationIdOrderA[j].range = 1;
		    				}
							shelves.push(locationIdOrderA[j]);
						}
						
						
					}
					
					console.log(shelves);
					
					self.datas = data.result.cidRecord;

					self.listTable.render(shelves);
					self._renderBtn();
					
					/*var sl = $("#replenishment_shelf_list_table-table").find("thead th");

		            var tableObj = document.getElementById("replenishment_shelf_list_table-table"); 
		            var cell = [];
					
					for(var j = 10;j < sl.length-1; j++){
		       		 
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
		       		 
		       	     }*/
					
					/*for(var m=0;m<cell.length;m++){
		           	 $("#replenishment_shelf_list_table-table").find("thead th").eq(cell[m]).css("display","none");
		                var ll = $("#replenishment_shelf_list_table-table").find("tbody tr");
		                
		                for(var i=0;i<ll.length;i++){
		               	 $(ll).eq(i).find("td").eq(cell[m]).css("display","none");
		                }
		            }*/
					
				}
				
			});			

		},
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return updateWindow;
});