define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./deviceMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}

    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.onlineType = options.onlineType;
            this.deviceId = options.deviceId;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            var title = "添加赛台";
            if(this.deviceId){
            	title = "修改赛台";
            }

            this.automatWindow = new _Window({
                container: "body",
                title: title,
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
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

            $("#saveBase").val(locale.get({lang: "save"}));
            
            this._renderMap();//加载点位地图
            this.init();
        },
        init:function(){
        	$("#automat_vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#automat_vender").append("<option value='vender1'>厂家1</option>");
        	$("#automat_vender").append("<option value='vender2'>厂家2</option>");
        	$("#automat_vender").append("<option value='vender3'>厂家3</option>");
        },
        _renderMap: function() {
            var self = this;
            var map = new BMap.Map("container");          // 创建地图实例  
            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}
            map.addControl(new BMap.NavigationControl(opts));

           
            this._renderBtn(map);//各个按钮事件
            if(this.deviceId){
            	 this.getData(map);
            }else{
            	 this.loadModel();//机型
                 this.loadSite(map,'');
            }
        },
        getData:function(map){
        	  var self = this;
        	  cloud.util.mask("#deviceForm");
              Service.getAutomatById(self.deviceId, function(data) {
            	  $("#assetId").val(data.result.assetId == null ? "" : data.result.assetId);
            	  $("#deviceName").val(data.result.name == null ? "" : data.result.name);
            	  $("#automat_vender option[value='"+data.result.vender+"']").attr("selected","selected");
            	  self.loadModel(data.result.moduleId);
            	  self.loadSite(map,data.result.siteId);
            	  cloud.util.unmask("#deviceForm");
              });
        },
        loadModel : function(moduleId) {
        	var self = this;
        	var moduleNum = "";
        	$("#models").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getAllModel(-1,0,moduleNum,function(data){
				if(data.result && data.result.length>0){
					for(var i=0;i<data.result.length;i++){
						if(moduleId){
							if(moduleId == data.result[i]._id){
								$("#models").append("<option value='" +data.result[i]._id + "' selected='selected'>" +data.result[i].moduleNum+"</option>");
							}else{
								$("#models").append("<option value='" +data.result[i]._id + "'>" +data.result[i].moduleNum+"</option>");
							}
						}else{
							$("#models").append("<option value='" +data.result[i]._id + "'>" +data.result[i].moduleNum+"</option>");
						}
						
					}
				}
			 }, self);
		},
		loadSite: function(map,siteId) {
        	var self = this;
        	var name = "";
        	$("#siteId").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getAllSites(-1,0,function(data){
				if(data.result && data.result.length>0){
					for(var i=0;i<data.result.length;i++){
						if(siteId){
							if(siteId == data.result[i]._id){
								$("#siteId").append("<option value='" +data.result[i]._id + "' selected='selected' lineId='" + data.result[i].dealerId + "' lineName='" + data.result[i].dealerName + "' loc='" + data.result[i].location.region + "' lat='" + data.result[i].location.latitude + "' lng='" + data.result[i].location.longitude + "'>" +data.result[i].name+"</option>");
							}else{
								$("#siteId").append("<option value='" +data.result[i]._id + "' lineId='" + data.result[i].dealerId + "' lineName='" + data.result[i].dealerName + "' loc='" + data.result[i].location.region + "' lat='" + data.result[i].location.latitude + "' lng='" + data.result[i].location.longitude + "'>" +data.result[i].name+"</option>");
							}
							//获取店面的地理位置信息
							Service.getSiteById(siteId,function(siteData){
								var loc = siteData.result.location.region;
			                    var lng = siteData.result.location.longitude;
			                    var lat = siteData.result.location.latitude;
			                    if (lng != "" && lat != "") {
			                        map.clearOverlays(); //清除
			                        var new_point = new BMap.Point(lng, lat);
			                        self.getCenter(map, new_point, loc);
			                        var marker = new BMap.Marker(new_point);       // 创建标注
			                        map.addOverlay(marker);                        // 将标注添加到地图中
			                        map.panTo(new_point);
			                    }
							});
							
						}else{
							$("#siteId").append("<option value='" +data.result[i]._id + "' lineId='" + data.result[i].dealerId + "' lineName='" + data.result[i].dealerName + "' loc='" + data.result[i].location.region + "' lat='" + data.result[i].location.latitude + "' lng='" + data.result[i].location.longitude + "'>" +data.result[i].name+"</option>");
						}
					}
				}
			 }, self);
		},
        getCenter: function(map, cp, text) {
            var geoc = new BMap.Geocoder();
            var suggestId = $("#loc").val();
            geoc.getLocation(cp, function(rs) {
                var addComp = rs.addressComponents;

                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (text) {
                    address = text;
                }
                if (suggestId == null || suggestId == "") {
                    $("#loc").val(address);
                }

                var opts = {
                    width: 200, // 信息窗口宽度
                    height: 30, // 信息窗口高度
                    title: "当前位置", // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                }
                var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象 
                map.openInfoWindow(infoWindow, cp); //开启信息窗口
            });
        },
        _renderBtn: function(map) {
            var self = this;
            //保存
            $("#saveBase").bind("click", function() {
            	var assetId = $("#assetId").val();
            	var name = $("#deviceName").val();
            	var vender = $("#automat_vender").val();
            	var moduleName = $("#models").find("option:selected").text();
            	var moduleId = $("#models").find("option:selected").val();
            	
            	var siteName = $("#siteId").find("option:selected").text();
            	var siteId = $("#siteId").find("option:selected").val();
            	
            	var finalData={
            			assetId:assetId,
            			name:name,
            			vender:vender,
            			moduleName:moduleName,
            			moduleId:moduleId,
            			siteName:siteName,
            			siteId:siteId
            	};
                if(self.deviceId){
                	Service.updateDeviceFm(self.deviceId,finalData,function(data){
                		    if(data.error!=null){
    	                	   if(data.error_code == "70002"){
    							   dialog.render({text:"赛台编号已存在"});
    							   return;
    						   }
    	                	 }else{
    	                		self.automatWindow.destroy();
    	                		dialog.render({text: "修改成功"});
    		 	             	self.fire("getDeviceList");
    						 }
                 	});
            	}else{
            		Service.addDeviceFm(finalData,function(data){
            			 if(data.error!=null){
  	                	   if(data.error_code == "70002"){
  							   dialog.render({text:"赛台编号已存在"});
  							   return;
  						   }
  	                	 }else{
  	                		self.automatWindow.destroy();
  	                		dialog.render({text: "添加成功"});
  		 	             	self.fire("getDeviceList");
  						 }
                		 
                	});
            	}
            	
            });
            $("#siteId").bind('change', function() {
            	$("#siteId").css("border-color", "");
            	
                var siteId = $("#siteId").find("option:selected").val();
                var inpuValue = $("#siteId").find("option:selected").attr("loc");
                var lng = $("#siteId").find("option:selected").attr("lng");
                var lat = $("#siteId").find("option:selected").attr("lat");
                if (lng && lat) {
                    map.centerAndZoom(new BMap.Point(lng, lat), 16); //设置中心点
                    map.clearOverlays(); //清除
                    var new_point = new BMap.Point(lng, lat);
                    self.getCenter(map, new_point, inpuValue);
                    var marker = new BMap.Marker(new_point);       // 创建标注
                    map.addOverlay(marker);                        // 将标注添加到地图中
                    map.panTo(new_point);
                }
            });
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});