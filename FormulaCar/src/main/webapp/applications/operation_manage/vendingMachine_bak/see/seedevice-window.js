define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./seeDevice.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
	require("../add/css/default.css");
	require("../add/js/scrollable");
	var SelfConfigInfo = require("../goodsConfig/selfConfig");
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.deviceId = options.deviceId;
			this._renderWindow();
			this.data = null;
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this; 
			this.automatWindow = new _Window({
				container: "body",
				title: locale.get({lang:"price_see"}),
				top: "center",
				left: "center",
				height:620,
				width: 1000,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.automatWindow.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.modelChange = 1;
			this.automatWindow.show();	
			$("#selfConfig").css("display","none");
			$("#nextBase").val(locale.get({lang:"next_step"}));
			this.renderSecondSelfConfig();
			this._renderMap();//加载点位地图
			
		},
		loadDeviceData:function(map){
			var self = this;
			cloud.util.mask("#deviceForm");
			Service.getAutomatById(self.deviceId,function(data){
				self.data = data;
				$("#suggestId").attr("value",data.result.siteName==null?"":data.result.siteName);//点位名称
				$("#siteName").attr("value",data.result.siteName==null?"":data.result.siteName);//点位名称
				$("#siteId").attr("value",data.result.siteId==null?"":data.result.siteId);//点位ID
    			$("#deviceName").attr("value",data.result.name==null?"":data.result.name);//售货机名称
    			$("#assetId").val(data.result.assetId==null?"":data.result.assetId);//售货机编号
    			$("#line").attr("value",data.result.lineName==null?"":data.result.lineName);//线路
    			$("#lineId").attr("value",data.result.lineId==null?"":data.result.lineId);//线路ID
    			
    			self.SelfConfig.setconfig(data.result.assetId);
				if(data.result.goodsConfigs){
					self.goodsConfigs = data.result.goodsConfigs;
					self.SelfConfig.getTab(data.result.goodsConfigs);
				}
				if(data.result.containers){//货柜
					self.SelfConfig.getOtherTab(data.result.containers);
				}
				//从现场列表中获取经纬度
				Service.getSiteByName(data.result.siteName,function(data){
					 if(data.result && data.result.location){
						 $("#lng").val(data.result.location.longitude);
						 $("#lat").val(data.result.location.latitude);
						 map.clearOverlays(); //清除
						 var new_point = new BMap.Point(data.result.location.longitude,data.result.location.latitude);
						 self.getCenter(map,new_point,data.result.name);
						 var marker = new BMap.Marker(new_point);       // 创建标注
						 map.addOverlay(marker);                        // 将标注添加到地图中
						 map.panTo(new_point);  
					 }
					cloud.util.unmask("#deviceForm");
				});
			},self);
		},
		getCenter:function(map,cp,text){
			 var geoc = new BMap.Geocoder(); 
			 geoc.getLocation(cp, function(rs){
				   var addComp = rs.addressComponents;
				   var address = addComp.city + addComp.district  + addComp.street  + addComp.streetNumber;
				   if(text){
					   address = text;
				   }
				   $("#suggestId").val(address);
				   
				    var opts = {
							  width : 200,     // 信息窗口宽度
							  height: 30,     // 信息窗口高度
							  title : "当前位置" , // 信息窗口标题
							  enableMessage:true,//设置允许信息窗发送短息
							  message:""
				   }
				   var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象 
				   map.openInfoWindow(infoWindow,cp); //开启信息窗口
			 });    
		},
		renderSecondSelfConfig:function(){
			var self = this;
			this.SelfConfig = new SelfConfigInfo({
      			selector:"#selfConfigInfo",
      			automatWindow:self.automatWindow,
      			events : {
      				"rendTableData":function(){
      					self.fire("getDeviceList");
      				}
      			}
      	  });
		},
		_renderMap:function(){
			var self = this;
			var map = new BMap.Map("container");          // 创建地图实例  
			var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
			map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
			var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}    
			map.addControl(new BMap.NavigationControl(opts));
			
			this.loadDeviceData(map);//获取该售货机的基本信息
			
			//下一步
		     $("#nextBase").bind("click",function(){
					 $("#selfConfig").css("display","block");
					  $("#baseInfo").css("display","none");
					  $("#tab1").removeClass("active");
					  $("#tab2").addClass("active");
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