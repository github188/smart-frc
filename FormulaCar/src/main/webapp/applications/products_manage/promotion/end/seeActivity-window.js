define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./seeActivity.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../service");
	var columns=[
	 {
	     "title": locale.get("automat_name_of_commodity"),
	     "dataIndex" : "name",
	     "width": "20%"
	 },
	 {
	     "title": locale.get("preferential_price"),
	     "dataIndex" : "preferential_price",
	     "field": "preferential_price",
	     "width": "20%"						     
	 },
	 {
	     "title": locale.get("automat_wx_pay"),
	     "field": "micropay_price",
	     "dataIndex" : "micropay_price",
	     "width": "20%"						     
	 },
	 {
	     "title": locale.get("automat_alipay"),
	     "field": "alipay_price",
	     "dataIndex" : "alipay_price",
	     "width": "20%"						     
	 },
	 {
	     "title": locale.get("automat_baifubao"),
	     "field": "baiduPay_price",
	     "dataIndex" : "baiduPay_price",
	     "width": "20%"						     
	 }];
	var columns_automat=[
     	 {
     	     "title": locale.get("trade_automat_number"),
     	     "dataIndex" : "vmId",
     	     "width": "50%"
     	 },
     	 {
     	     "title": locale.get("automat_name"),
     	     "dataIndex" : "name",
     	     "field": "name",
     	     "width": "50%"						     
     	 }];
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.activityId = options.activityId;//活动Id
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			var ids=null;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"check_promotions"}),
				top: "center",
				left: "center",
				height:620,
				width: 1000,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			$("#nextBase1").val(locale.get({lang:"next_step"}));
			$("#nextBase2").val(locale.get({lang:"next_step"}));
			$("#beforeBase1").val(locale.get({lang:"price_step"}));
			$("#beforeBase2").val(locale.get({lang:"price_step"}));
			$("#finish").val(locale.get({lang:"price_finished"}));
			this.window.show();	
			this._renderSelect();
			this._rendergoodstable();
			this._renderdevicetable();
			this.renderData();
		},
        renderData:function(){
        	var activityId =  this.activityId;
        	var self = this;
        	cloud.util.mask("#baseInfo");
			Service.getActivite(this.activityId,function(data){
					$("#activity_name").val(data.result.name);
					$("#descript").val(data.result.descript);
					var startTime = cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd hh:mm:ss");
					var endTime = cloud.util.dateFormat(new Date(data.result.endTime), "yyyy-MM-dd hh:mm:ss");
					$("#startTime3").val(startTime);
					$("#endTime3").val(endTime);
					var pageDisplay = 30;
					var total = data.total;
					this.totalCount = data.result.length;
			        data.total = total;
			        
			        self._goodstable.render(data.result.goodsInfo);
			        
			        self._automattable.render(data.result.automatInfo);
			        cloud.util.unmask("#baseInfo");
			});
		},
		_rendergoodstable:function(){
			var self = this;
			self._goodstable = new Table({
				selector:"#con3_content",
				limit:100,
				checkbox:false,
				count:false,
				mask:true,
				page:false,
				columns:columns,
				events : {
					 onRowClick: function(data) {
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
		},
		_renderdevicetable:function(){
			var self = this;
			self._automattable = new Table({
				selector:"#con2_content",
				limit:100,
				checkbox:false,
				count:false,
				mask:true,
				page:false,
				columns:columns_automat
			});
		},
		_renderSelect:function(){
			var self = this;
			$("#nextBase1").click(function(){
				$("#deviceConfig").css("display","block");
				$("#baseInfo").css("display","none");
				$("#tab1").removeClass("active");
				$("#tab2").addClass("active");
			});
			$("#beforeBase1").click(function(){
				$("#deviceConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab1").addClass("active");
			});
			$("#nextBase2").click(function(){
				$("#deviceConfig").css("display","none");
				$("#goodsConfig").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab3").addClass("active");
			});
			$("#beforeBase2").click(function(){
				$("#deviceConfig").css("display","block");
				$("#goodsConfig").css("display","none");
				$("#tab3").removeClass("active");
				$("#tab2").addClass("active");
			});
			$("#finish").click(function(){
				self.window.destroy();
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