define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");

	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.datas = options.datas;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var data = this.datas; 
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"order_detail"}) + "(" + data.ssName + ")",
				top: "center",
				left: "center",
				height: 500,
				width: 1000,
				mask: true,
				drag:true,
				content: "<div id='winContent'></div>",
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
			this.renderData(data.id);
		
		},
		_renderForm:function(){				
		
			var htmls1= "<hr>"
					    + "<table width='90%' style='margin-left:5%;' border='1'>"
					    +"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"ssName"})+"</td>"
						+ "<td id='ssName' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
					    + "<td width='20%' height='30px'>"+locale.get({lang:"ssNumber"})+"</td>"
						+ "<td id='ssNumber' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
					    + "<td width='20%' height='30px'>"+locale.get({lang:"number_of_order"})+"</td>"
						+ "<td id='orderId' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
					    + "<td width='20%' height='30px'>"+locale.get({lang:"time_of_order"})+"</td>"
						+ "<td id='orderTime' height='30px'>&nbsp;</td>"
						+"</tr>"
					    +"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"name_of_consignee"})+"</td>"
						+ "<td id='names' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"phone_of_consignee"})+"</td>"
						+ "<td id='phone' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"address_of_consignee"})+"</td>"
					    + "<td id='address' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
					    + "<td width='20%' height='30px'>"+locale.get({lang:"title_of_phone"})+"</td>"
					    + "<td id='titles' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
					    + "<td width='20%' height='30px'>"+locale.get({lang:"purchase_model"})+"</td>"
					    + "<td id='model' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"current_price"})+"</td>"
						+ "<td id='current_price' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"counts_of_phone"})+"</td>"
						+ "<td id='counts' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"color_of_phone"})+"</td>"
						+ "<td id='color' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"guide_of_phone"})+"</td>"
						+ "<td id='guide' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"total_of_phone"})+"</td>"
						+ "<td id='total' height='30px'>&nbsp;</td>"
						+"</tr>"
						+"<tr>"
						+ "<td width='20%' height='30px'>"+locale.get({lang:"purchase_link"})+"</td>"
						+ "<td  id='purchase_link' height='30px'><a  id ='link' href=''>&nbsp;</a></td>"
						+"</tr>"
					    + " </table>";
	        $("#winContent").append(htmls1);
		},
		renderData:function(id){
			$.ajax({
				type:'GET',
				url:'/purchase_rainbow/yt/purchase/order?&id='+id,//purchase_rainbow purchase_yutu
				async:false,
				dataType : "json",
				success : function(data) {	
					$("#ssName").text(data.result[0].ssName==null?"":data.result[0].ssName);
					$("#ssNumber").text(data.result[0].ssNumber==null?"":data.result[0].ssNumber);
					$("#names").text(data.result[0].name == null?"":data.result[0].name);
					$("#phone").text(data.result[0].phone==null?"":data.result[0].phone);
					$("#orderId").text(data.result[0].orderId == null?"":data.result[0].orderId);
					$("#orderTime").text(data.result[0].orderTime==null?"":data.result[0].orderTime);
					$("#address").text(data.result[0].address==null?"":data.result[0].address);
					$("#titles").text(data.result[0].title==null?"":data.result[0].title);
					$("#model").text(data.result[0].model==null?"":data.result[0].model);
					$("#current_price").text(data.result[0].current_price==null?"":data.result[0].current_price);
					$("#counts").text(data.result[0].counts==null?"":data.result[0].counts);
					$("#color").text(data.result[0].color==null?"":data.result[0].color);
					$("#guide").text(data.result[0].guide==null?"":data.result[0].guide);
					$("#total").text(data.result[0].total==null?"":data.result[0].total);
					$("#link").attr("href",data.result[0].link==null?"":data.result[0].link);
					$("#link").text(data.result[0].link==null?"":data.result[0].link);
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
	return Window;
});