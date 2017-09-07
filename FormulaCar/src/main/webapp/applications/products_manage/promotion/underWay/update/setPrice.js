define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Service = require("../../../service");
	require("../css/tab.css");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.datas = options.datas;
			this.activityId = options.activityId;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"set_preferences"}),
				top: "center",
				left: "center",
				height: 260,
				width: 450,
				mask: true,
				drag:true,
				content: "<div id='priceContent' style='border-top: 1px solid #f2f2f2;'></div>",
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
		
		},
		_renderForm:function(){
			var self = this;
			var id = this.datas.goodsIds;
			var datas = this.datas;
			Service.getGoodsById(id,function(data){
				var price ="";
				if(data.result){
					 price = data.result.price==null?"":data.result.price;
				}
				
				var alipay_price=" ";
				var baiduPay_price=" ";
				var micropay_price=" ";
				var preferential_price=" ";
				
				if(datas.alipay_price!=null){
					alipay_price=datas.alipay_price;
				}else{
					alipay_price=price;
				}
				if(datas.baiduPay_price!=null){
					baiduPay_price=datas.baiduPay_price;
				}else{
					baiduPay_price=price;
				}
				if(datas.micropay_price!=null){
					micropay_price=datas.micropay_price;
				}else{
					micropay_price=price;
				}
				if(datas.preferential_price!=null){
					preferential_price=datas.preferential_price;
				}else{
					preferential_price=price;
				}
				
				var htmls1= "<table width='90%' style='margin-left:5%;' border='1'>"
				    +"<tr style='height:30px;'>"
					+ "<td width='35%' height='35px' style='font-size: 14px;'>"+locale.get({lang:"automat_name_of_commodity"})+"</td>"
					+ "<td  height='30px'><p>"+datas.name+"</p><input style='width:270px;display: none;border-radius: 4px;height: 20px;' type='text' id='name_val' name='name_val' value='"+datas.name+"' /><input style='width:250px;display: none;' type='text' id='goodsIds' name='goodsIds' value='"+datas.goodsIds+"' /></td>"
					+"</tr>"
				    +"<tr style='height:30px;'>"
					+ "<td width='35%' height='35px' style='font-size: 14px;'>"+locale.get({lang:"preferential_price"})+"</td>"
					+ "<td  height='30px'><input style='width:270px;border-radius: 4px;height: 20px;' type='text' id='preferential_price'  name='preferential_price' value="+preferential_price+"></td>"
					+"</tr>"
					+"<tr style='height:30px;'>"
				    + "<td width='35%' height='35px' style='font-size: 14px;'>"+locale.get({lang:"automat_wx_pay"})+"</td>"
					+ "<td  height='30px'><input style='width:270px;border-radius: 4px;height: 20px;' type='text' id='micropay_price'  name='micropay_price' value="+micropay_price+"></td>"
					+"</tr>"
					+"<tr style='height:30px;'>"
				    + "<td width='35%' height='35px' style='font-size: 14px;'>"+locale.get({lang:"automat_alipay"})+"</td>"
					+ "<td  height='30px'><input style='width:270px;border-radius: 4px;height: 20px;' type='text' id='alipay_price'  name='alipay_price' value="+alipay_price+"></td>"
					+"</tr>"
					+"<tr style='height:30px;'>"
				    + "<td width='35%' height='35px' style='font-size: 14px;'>"+locale.get({lang:"automat_baifubao"})+"</td>"
					+ "<td  height='30px'><input style='width:270px;border-radius: 4px;height: 20px;' type='text' id='baiduPay_price'  name='baiduPay_price' value="+baiduPay_price+"></td>"
					+"</tr>"
				    + " </table>"
				    + "<div style='text-align: right;width: 94%;margin-top: 5px;border-top: 1px solid #f2f2f2;'><a id='product-config-save' style='margin-top: 8px;' class='btn btn-primary submit' >"+locale.get({lang:"save"})+"</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancell_text"})+"</a></div>";
	                $("#priceContent").append(htmls1);
	                
	                self._renderBtn();
			});
		},
		_renderBtn:function(){
			var self = this;
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-config-save").bind("click",function(){
		    	var goodsIds=$("#goodsIds").val();
            	var name_val=$("#name_val").val();
            	 var preferential_price=$("#preferential_price").val();
                 var micropay_price=$("#micropay_price").val();
                 var alipay_price=$("#alipay_price").val();
                 var baiduPay_price=$("#baiduPay_price").val();
                 
                 var checkstr=/^(\d+\.\d{1,2}|\d+)$/;
                 if(preferential_price!=""||micropay_price!=""||alipay_price!=""||baiduPay_price!=""){
                	 if(preferential_price!=""){
                	 if(!checkstr.test(preferential_price)){
            	    	  dialog.render({lang:"preferential_price_number"});
            	    	  return; 
            	      }
	                 }
	                 if(micropay_price!=""){
	                	 if(!checkstr.test(micropay_price)){
	            	    	  dialog.render({lang:"automat_wx_pay_number"});
	            	    	  return; 
	            	      }
	                 }
	                 if(alipay_price!=""){
	                	 if(!checkstr.test(alipay_price)){
	            	    	  dialog.render({lang:"alipay_price_number"});
	            	    	  return; 
	            	      }
	                 }
	                 if(baiduPay_price!=""){
	                	 if(!checkstr.test(baiduPay_price)){
	            	    	  dialog.render({lang:"baidu_price_number"});
	            	    	  return; 
	            	      }
	                 }
                 }else{
                	 dialog.render({lang:"at_least_one_price"});
                	 return;
                 }
                var obj1={
                	"goodsIds":goodsIds,
                	"name":name_val,
            		"preferential_price":preferential_price,
            		"micropay_price":micropay_price,
            		"alipay_price":alipay_price,
            		"baiduPay_price":baiduPay_price,
                };
                var activityData;
                Service.getActivite(self.activityId,function(data){
					 	var goods=data.result.goodsInfo;
					 	for(var i=0;i<goods.length;i++){
							if(goods[i].goodsIds==goodsIds){
								goods[i]=obj1;
							}
					 	}	
					 	activityData=data;

					Service.updateActivityInfo(self.activityId,activityData.result,function(data) {
                    	self.window.destroy();
				        self.fire("getGoodsList");
					});
                });
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
	return Window;
});