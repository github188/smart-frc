define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./updateDevice.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
    var gmap = require("../map/map");
	require("async!http://maps.google.cn/maps/api/js?v=3&sensor=false");
	require("../add/css/default.css");
	require("../add/js/scrollable");
	var SelfConfigInfo = require("../selfConfig/selfConfig");
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.deviceId = options.deviceId;
			this._renderWindow();
			this.data = null;
			locale.render({element:this.element});
			
			var boxHtml = "<form class='marker-info-wrapper' id='info-wrapper'>"+
			"<div class='marker-info-header' id='info-sysid-name' align='center'>"+
			"</div>"+
			"<div class='info-tag-panel'>"+locale.get({lang:"my_location"})+"</div>"+
			"<div class='info-form' >"+
			"<div class='marker-info-form-row'>"+
			"<span id='info-serial-deviceType' class='marker-info-form-span'>"+locale.get({lang:"please_wait_a_moment"})+"</span>"+
			"</div>"+
			"</div>"+
			"</form>";
			
			this.bubble = new gmap.Bubble({
				content : $(boxHtml),
				maxWidth : 800
			});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.automatWindow = new _Window({
				container: "body",
				title: locale.get({lang:"update_device"}),
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
			this.infowindow = null;
			this.modelChange = 1;
			this.automatWindow.show();	
			$("#selfConfig").css("display","none");
			$("#saveBase").val(locale.get({lang:"save"}));
			$("#nextBase").val(locale.get({lang:"next_step"}));
			this._renderMap();//加载点位地图
		    this.renderSecondSelfConfig();
		},
		loadDeviceData:function(){
			var self = this;
			cloud.util.mask("#deviceForm");
			Service.getAutomatById(self.deviceId,function(data){
				self.data = data;
				$("#suggestId").attr("value",data.result.siteName==null?"":data.result.siteName);//点位名称
				$("#siteName").attr("value",data.result.siteName==null?"":data.result.siteName);//点位名称
				$("#siteId").attr("value",data.result.siteId==null?"":data.result.siteId);//点位ID
				
    			$("#deviceName").attr("value",data.result.name==null?"":data.result.name);//售货机名称
    			$("#assetId").val(data.result.assetId==null?"":data.result.assetId);//售货机编号
				$("#automat_model option[text='"+data.result.modelName+"']").attr("selected","selected");
				$("#automat_model option:selected").attr("text",data.result.modelName);
				//$("#selectModels").val(data.result.modelId);
				
				if(data.result.goodsConfigs){
					self.goodsConfigs = data.result.goodsConfigs;
					self.SelfConfig.saveGoodsConfig = data.result.goodsConfigs;
				}
				
				self.getModelData(data.result.modelName);
				//从现场列表中获取经纬度
				Service.getSiteByName(data.result.siteName,function(data){
					 if(data.result.location){
						 $("#lng").val(data.result.location.longitude);
						 $("#lat").val(data.result.location.latitude);
						 var icon = "../images/green.png";
						 if(self.marker){
								self.marker.destroy();
						 }
						 var cp={
								  lat:data.result.location.latitude,
								  lon:data.result.location.longitude
						 };
						 self.map.setCenter(cp);
						 self.map.setZoom(15);
						 self.marker = self.map.addMarker({
								position:new gmap.LonLat(data.result.location.longitude,data.result.location.latitude),
								title : "",
								draggable : true,  //控制是否可拖动
								icon : require.toUrl(icon),    //自定义的一个图片
						    	visible:true
						 });
						 self.bubble.open(self.map,self.marker);
						 document.getElementById("info-serial-deviceType").innerHTML= data.result.name ;
					 }
					cloud.util.unmask("#deviceForm");
				});
			},self);
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
		getModelData:function(name){
			var self = this;
			Service.getModelInfo(0,500,function(data){
				if(data.result&&data.result.length>0){
	        		$.each(data.result,function(n,item) {
	        			if(name == item.name){
	        				$("#automat_model").append("<option value='" + item._id + "_"+item.roadNumber+"' selected='selected'>" + item.name + "</option>");
	        				$("#selectModels").val(item._id + "_"+item.roadNumber);
	        			}else{
	        				$("#automat_model").append("<option value='" + item._id + "_"+item.roadNumber+"'>" + item.name + "</option>");
	        			}
	                });
	        	}
	        }, self);
		},
		
		_renderMap:function(){
			var self = this;
			this.map = new gmap.Map({
				selector : this.element.find("#container")
			});
			
			//定位到当前城市
			
			//移动地图 时将定位到当前视野的中心点
			this.map.addListener("dragend", function(event) {
				var cp = self.map.getCenter();
				
				$("#lng").val(cp.lon);
				$("#lat").val(cp.lat);
				var events ={};
				events.lonLat = {
						lat:cp.lat,
						lon:cp.lon
				};
				
				self.map.setCenter(cp);
				var icon = "../images/green.png";
				if(self.marker){
					self.marker.destroy();
				}
				self.marker = self.map.addMarker({
					position:new gmap.LonLat(cp.lon,cp.lat),
					title : "测试",
					draggable : true,  //控制是否可拖动
					icon : require.toUrl(icon),    //自定义的一个图片
					visible:true
				});
				
				self.marker.on("click", function(event) {
					self.getAddressBylonlat(event);
				});
				self.marker.on("dragend", function(event) {
					$("#lng").val(event.lonLat.lon);
					$("#lat").val(event.lonLat.lat);
					self.getAddressBylonlat(event);
			    });
				
				self.getAddressBylonlat(events);
			   

			});
			
			this._renderBtn(this.map);//各个按钮事件
			this.loadDeviceData();//获取该售货机的基本信息
		},
		getAddressBylonlat:function(event){//根据经纬度获取地址信息
			var self = this;
			var geocoder = new google.maps.Geocoder();
		    geocoder.geocode({location: new google.maps.LatLng(event.lonLat.lat, event.lonLat.lon)}, function geoResults(result, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			    	  var pos = "";
			          pos = result[0].formatted_address;
			          $("#suggestId").val(pos);

			          self.bubble.open(self.map,self.marker);
			          
			          document.getElementById("info-serial-deviceType").innerHTML= pos ;
				}else{
					 
			    }
	        });
		},
		_renderBtn:function(map){
			var self = this;
			//获取点位输入框事件并定位
			$('#suggestId').bind('input propertychange', function() {
				 var inpuValue=$("#suggestId").val();
				 $("#resultDiv").css("display","block");
				 Service.getAllPlaceGoogle(inpuValue,function(data){
					 var datas = eval('(' + data + ')'); 
					 $("#results").empty();
					 if(datas && datas.predictions){
						 if(datas.predictions.length > 0){
							 for(var i=0;i<datas.predictions.length;i++){
								 if(i<10){
									 var name = datas.predictions[i].description;
									
	                                 var msg = "<li  style='cursor: pointer;' lat='' lng=''>" + name + "</li>";
									 $("#results").append(msg);
								 }
							 }
								
							 $("#results li").mouseover(function(){ 
								 $("#results li").each(function(i){ 
								    $(this).removeClass("blue"); 
								 }); 
								  $(this).addClass("blue"); 
							 }).mouseout(function(){ 
								  $(this).addClass("blue"); 
							 }); 
							 
							 $("#results li").click(function() {
								 $("#resultDiv").css("display","none");
								 var text = $(this).context.innerText;
								 $("#suggestId").val(text);
								 Service.getlatlonByAddress(text,function(data){
									 var newdata = eval('(' + data + ')');
									 if(newdata && newdata.results[0]){
										  var location = newdata.results[0].geometry.location;
										 
										  var lat=""; var lng="";
										  if(location){
											  lat = location.lat;
											  lng = location.lng;
										  }
										  if(lng && lat){
											  $("#lng").val(lng);
											  $("#lat").val(lat);
											  var icon = "../images/green.png";
											  if(self.marker){
												self.marker.destroy();
											  }
											  var cp={
													  lat:lat,
													  lon:lng
											  };
											  self.map.setCenter(cp);
											  self.map.setZoom(15);
											  self.marker = map.addMarker({
												  position:new gmap.LonLat(lng,lat),
												  title : "",
												  draggable : true,  //控制是否可拖动
												  icon : require.toUrl(icon),    //自定义的一个图片
												  visible:true
											 });	
										  }
										 
									  }
								 });
							 });
							 
						 }
					 }
				 });
			}); 
			//下一步
			$("#nextBase").bind("click",function(){
				
				self.SelfConfig.showAndInitRoads();
				//修改售货机基本信息
				self.renderUpdateMachine(false);
			});
			
            //修改
		    $("#saveBase").bind("click",function(){
		    	//修改售货机基本信息
		    	var flag=true;
		    	self.renderUpdateMachine(flag);
	        });
		    
		    $('#automat_model').change(function(){ 
		    	$("#selectModels").val($("#automat_model option:selected").val());
		    });
		},
		
		renderUpdateMachine:function(flag){
			var self = this;
			
			var assetId = $("#assetId").val();//售货机编号
	    	var deviceName = $("#deviceName").val();//售货机名称
	    	var modelId = $("#automat_model option:selected").val();
			var modelName = $("#automat_model option:selected").text();
			var siteName = $("#suggestId").val();//点位名称
			
			if(deviceName == null||deviceName == ""){
				dialog.render({lang:"automat_name_not_exists"});
				return;
			}
			if(modelId == null||modelId == ""){
				dialog.render({lang:"pleas_add_least_one_model_record"});
				return;
			}
			if(siteName==null||siteName==""){
    			dialog.render({lang:"automat_enter_name"});
    			return;
    		}
			var lng = $("#lng").val();//经度
			var lat = $("#lat").val();//纬度
			//添加点位
			var data = {};
			var location = {};
			location.longitude = lng;
    		location.latitude = lat;
    		location.region = "";
    		data.name = siteName;//点位名称
    		data.location = location;//经纬度
    		
    		var siteName_old = $("#siteName").val();//点位名称(old)
    		var siteId = $("#siteId").val();//点位ID
    		//判断点位名称是否发生变化
            if(siteName == siteName_old){//未发生改变
            	self.renderUpdate(flag,deviceName,modelId,modelName,siteId,siteName,assetId);
    		}else{//发生改变
    			Service.addSite(data,function(retData){
        			if(retData.error_code&&retData.error_code=="21322"){//点位名称已存在
        				Service.getSiteByNameFormDeviceList(siteName,function(data){
        					if(data && data.result != null){//该点位已挂售货机
        						dialog.render({lang:"automat_site_name_exists"});
        						return;
        					}else{//该点位没有挂售货机
        						self.renderUpdate(flag,deviceName,modelId,modelName,siteId,siteName,assetId);
        					}
        				});
        			}else if(!retData.error_code){
        				self.renderUpdate(flag,deviceName,modelId,modelName,siteId,siteName,assetId);
        			}
    			});
    		}
            
            
		},
		renderUpdate:function(flag,deviceName,modelId,modelName,siteId,siteName,assetId){
			var self = this;
			if(flag){//点击“保存"按钮
            	var area = null;
    			var goodsConfigs = self.goodsConfigs;
    			//修改售货机
    			cloud.util.mask("#baseInfo");
    			Service.updateAutomat(self.deviceId,area,deviceName,modelId,modelName,siteId,siteName,assetId,goodsConfigs,false,function(data){
    				if(data.error_code==null){
    					self.automatWindow.destroy();
    					self.fire("getDeviceList");
    					dialog.render({lang:"automat_goods_model_update_success"});
    				}else if(data.error_code == "20007"){
    					dialog.render({lang:"automat_name_exists"});
    					return;
    				}
    				cloud.util.unmask("#baseInfo");
    			});
          }else{
        	  $("#selfConfig").css("display","block");
			  $("#baseInfo").css("display","none");
			  $("#tab1").removeClass("active");
			  $("#tab2").addClass("active");
        	  var data = {};
			  data.area = null; 
			  data.name = deviceName;
			  data.modelId = modelId;
			  data.siteId = siteId;
			  data.siteName = siteName;
			  data.modelName = modelName;
			  data.assetId = assetId;
			  data._id = self.deviceId
			  self.SelfConfig.configData = data;
          }
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