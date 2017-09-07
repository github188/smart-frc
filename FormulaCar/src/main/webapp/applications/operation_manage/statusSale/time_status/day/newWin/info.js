/**
 * @author fenghl
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var infoHtml = require("text!./info.html");
	var validator = require("cloud/components/validator");
	
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.taskId = null;
			this.element.html(infoHtml);
			this.type = options.type;
			this._render();
		},
		_render:function(){
			if(this.type == "automat"){
				this._renderAutomatInfoForm();
			}
			if(this.type == "group"){
				this._renderGroupInfoForm();
			}
			
		},
		_renderAutomatInfoForm:function(){
			var htmls1= 
				"<table width='90%' style='margin-left:5%;' border='1'>"
			    +"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_no"})+":</td>"
				+ "<td id='automat_no' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_name"})+":</td>"
				+ "<td id='automat_name' style='text-align:center'  height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_transaction_count_"})+":</td>"
				+ "<td id='automat_transaction_count_' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_transaction_money_"})+":</td>"
				+ "<td id='automat_transaction_money_' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
			    +"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"state"})+":</td>"
				+ "<td id='state' height='30px' style='text-align:center'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_online_time"})+":</td>"
				+ "<td id='automat_online_time' height='30px' style='text-align:center'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right'  height='30px'>"+locale.get({lang:"automat_industrial_con_serialnum"})+":</td>"
			    + "<td id='automat_industrial_con_serialnum' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_system_version"})+":</td>"
			    + "<td id='automat_system_version' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_app_version"})+":</td>"
			    + "<td id='automat_app_version' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_delivery_person"})+":</td>"
				+ "<td id='automat_delivery_person' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_delivery_phone"})+":</td>"
				+ "<td id='automat_delivery_phone' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_type"})+":</td>"
				+ "<td id='automat_type' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
			    + " </table>";
			$("#transaction-info-form").html(htmls1);
			this.setAutomatInfoData(1);
		},
		_renderGroupInfoForm:function(){
			var htmls1= 
				"<table width='90%' style='margin-left:5%;' border='1'>"
			    +"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_group_name"})+":</td>"
				+ "<td id='automat_group_name' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_group_desc"})+":</td>"
				+ "<td id='automat_group_desc' style='text-align:center'  height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_transaction_count_"})+":</td>"
				+ "<td id='automat_transaction_group_count_' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_transaction_money_"})+":</td>"
				+ "<td id='automat_transaction_group_money_' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
			    +"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_group_count"})+":</td>"
				+ "<td id='automat_group_count' height='30px' style='text-align:center'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_group_online"})+":</td>"
				+ "<td id='automat_group_online' height='30px' style='text-align:center'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_online_rate"})+":</td>"
				+ "<td id='automat_group_online_rate' height='30px' style='text-align:center'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
				+ "<td width='30%' style='text-align:right'  height='30px'>"+locale.get({lang:"automat_delivery_person"})+":</td>"
			    + "<td id='automat_group_delivery_person' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
				+"<tr>"
			    + "<td width='30%' style='text-align:right' height='30px'>"+locale.get({lang:"automat_delivery_phone"})+":</td>"
			    + "<td id='automat_group_delivery_phone' style='text-align:center' height='30px'>&nbsp;</td>"
				+"</tr>"
			    + " </table>";
			$("#transaction-info-form").html(htmls1);
			this.setGroupInfoData(1);
		},
		setGroupInfoData:function(data){
			data = {"automat_group_name":"百度上地办公室","automat_group_desc":"xxxxxxxx","automat_transaction_group_count_":"489","automat_transaction_group_money_":"3879",
					"automat_group_count":"10","automat_group_online":"10","automat_group_online_rate":"100%","automat_group_delivery_person":"XXXXXX","automat_group_delivery_phone":"13800000000"};
			/*$.ajax({
				type:'GET',
				url:'/purchase_rainbow/yt/purchase/order?&id='+id,//purchase_rainbow purchase_yutu
				async:false,
				dataType : "json",
				success : function(data) {	*/
					$("#automat_group_name").text(data.automat_group_name==null?"":data.automat_group_name);
					$("#automat_group_desc").text(data.automat_group_desc==null?"":data.automat_group_desc);
					$("#automat_transaction_group_count_").text(data.automat_transaction_group_count_ == null?"":data.automat_transaction_group_count_);
					$("#automat_transaction_group_money_").text(data.automat_transaction_group_money_==null?"":data.automat_transaction_group_money_);
					$("#automat_group_online").text(data.automat_group_online == null?"":data.automat_group_online);
					$("#automat_group_online_rate").text(data.automat_group_online_rate==null?"":data.automat_group_online_rate);
					$("#automat_group_delivery_person").text(data.automat_group_delivery_person==null?"":data.automat_group_delivery_person);
					$("#automat_group_delivery_phone").text(data.automat_group_delivery_phone==null?"":data.automat_group_delivery_phone);
				/*}
			});*/
		},
		setAutomatInfoData:function(data){
			data = {"automat_no":"0001","automat_name":"映翰通望京1","automat_transaction_count_":"89","automat_transaction_money_":"450",
					"state":"在线","automat_online_time":"2014-10-11 12:20:20","automat_industrial_con_serialnum":"IH000001","automat_system_version":"Android 4.2.2",
					"automat_app_version":"V1.0.15","automat_delivery_person":"李特","automat_delivery_phone":"13800000000",
					"automat_type":"三电xxx型号"};
			/*$.ajax({
				type:'GET',
				url:'/purchase_rainbow/yt/purchase/order?&id='+id,//purchase_rainbow purchase_yutu
				async:false,
				dataType : "json",
				success : function(data) {	*/
					$("#automat_no").text(data.automat_no==null?"":data.automat_no);
					$("#automat_name").text(data.automat_name==null?"":data.automat_name);
					$("#automat_transaction_count_").text(data.automat_transaction_count_ == null?"":data.automat_transaction_count_);
					$("#automat_transaction_money_").text(data.automat_transaction_money_==null?"":data.automat_transaction_money_);
					$("#state").text(data.state == null?"":data.state);
					$("#automat_online_time").text(data.automat_online_time==null?"":data.automat_online_time);
					$("#automat_industrial_con_serialnum").text(data.automat_industrial_con_serialnum==null?"":data.automat_industrial_con_serialnum);
					$("#automat_system_version").text(data.automat_system_version==null?"":data.automat_system_version);
					$("#automat_app_version").text(data.automat_app_version==null?"":data.automat_app_version);
					$("#automat_delivery_person").text(data.automat_delivery_person==null?"":data.automat_delivery_person);
					$("#automat_delivery_phone").text(data.automat_delivery_phone==null?"":data.automat_delivery_phone);
					$("#automat_type").text(data.automat_type==null?"":data.automat_type);
				/*}
			});*/
		}
		
	});	
	return InfoModel;
    
});