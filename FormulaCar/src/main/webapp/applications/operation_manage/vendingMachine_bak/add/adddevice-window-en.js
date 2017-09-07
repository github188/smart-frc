define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./addDevice.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	require("./css/default.css");
	require("./js/scrollable");
    var gmap = require("../map/map");
    require("async!http://maps.google.cn/maps/api/js?v=3&sensor=false");
	var SelfConfigInfo = require("../selfConfig/selfConfig");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._renderWindow();
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
				title: locale.get({lang:"add_device"}),
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
			$("#finishBase").val(locale.get({lang:"complete"}));
			$("#nextBase").val(locale.get({lang:"next_step"}));
			this.getModelData();//获取机型
			this._renderMap();//加载点位地图
		    this.renderSecondSelfConfig();
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
		getModelData:function(){
			var self = this;
			cloud.util.mask("#deviceForm");
			$("#automat_model").append("<option value=''>" + locale.get({lang:"pleast_select_model_at_least_one"}) + "</option>");
			Service.getModelInfo(0,500,function(data){
				if(data.result&&data.result.length>0){
					for(var i=0;i<data.result.length;i++){
						$("#automat_model").append("<option value='" + data.result[i]._id + "_"+data.result[i].roadNumber+"'>" + data.result[i].name + "</option>");
					}
	        	}
				cloud.util.unmask("#deviceForm");
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
					title : "",
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
					
					self.bubble.open(self.map,self.marker);
					
					self.getAddressBylonlat(event);
			    });
				
				self.getAddressBylonlat(events);
			   

			});
			//各个按钮事件
			this._renderBtn(this.map);
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
				//添加售货机基本信息
				var flag=false;
				self.renderAddMachine(flag);
				self.SelfConfig.showAndInitRoads();
			});
			
            //完成
		    $("#finishBase").bind("click",function(){
		    	//添加售货机基本信息
		    	var flag=true;
		    	self.renderAddMachine(flag);
	        });
		    
		    $('#automat_model').change(function(){ 
		    	$("#selectModels").val($("#automat_model option:selected").val());
		    });
		},
		renderAddMachine:function(flag){
			var self = this;
			var assetId = $("#assetId").val();//售货机编号
	    	var deviceName = $("#deviceName").val();//售货机名称
	    	var modelId = $("#automat_model option:selected").val();
			var modelName = $("#automat_model option:selected").text();
			var siteName = $("#suggestId").val();//点位名称
			
			var modelInfo = modelId.split("_");
			var configNums = modelInfo[1];
			var configs = new Array();
			for(var index=0;index<configNums;index++){
				configs [index] = null;
			}
			
			if(assetId == null||assetId == ""){
				dialog.render({lang:"automat_no_not_exists"});
				return;
			}
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
    		
    		cloud.util.mask("#baseInfo");
			Service.addSite(data,function(retData){
    			if(retData.error_code&&retData.error_code=="21322"){//点位名称已存在
    				//判断该点位下是否挂有售货机
    				Service.getSiteByNameFormDeviceList(siteName,function(data){
    					if(data.result){//该点位已挂售货机
    						dialog.render({lang:"automat_site_name_exists"});
            				return;
    					}else{//该点位没有挂售货机
    						var site_name = $("#suggestId").val();//点位名称
    						Service.getSiteByName(site_name,function(data){
    							
    							var siteId = data.result._id;
    							var area = null;
    	            			var assetId = $("#assetId").val();//售货机编号
    	        		    	var deviceName = $("#deviceName").val();//售货机名称
    	        		    	var modelId = $("#automat_model option:selected").val();
    	        				var modelName = $("#automat_model option:selected").text();
    	        				var siteName = $("#suggestId").val();//点位名称
    	        				var goodsConfigs = configs;
    	        				
    	        				if(flag){//点击“完成”
    	        					//添加售货机
    	                			Service.addAutomat(area,deviceName,modelId,modelName,siteId,siteName,assetId,goodsConfigs,function(data){
    	                				if(data.error_code==null){
    	                					$("#deviceId").val(data.result._id);
    	                					cloud.util.unmask("#baseInfo");
    	                					self.automatWindow.destroy();
    	                    				self.fire("getDeviceList");
    	                				}else if(data.error_code == "21322"){//售货机名称已存在
    	        							dialog.render({lang:"automat_name_exists"});
    	        							return;2
    	        						}else if(data.error_code == "70002"){//售货机编号已存在
    	        							dialog.render({lang:"automat_goods_model_assertid_exists"});
    	        							return;
    	        						}
    	                			});
    	        				}else{//点击“下一步”
    	        					$("#selectModels").val($("#automat_model option:selected").val());
    	        					$("#selfConfig").css("display","block");
    	        					$("#baseInfo").css("display","none");
    	        					$("#tab1").removeClass("active");
    	        					$("#tab2").addClass("active");
    	        					
    	        					var data = {};
        	        				data.area = area;
        	        				data.name = deviceName;
        	        				data.modelId = modelId;
        	        				data.siteId = siteId;
        	        				data.siteName = siteName;
        	        				data.modelName = modelName;
        	        				data.assetId = assetId;
        	        				
        	        				self.SelfConfig.configData = data;
        	        				
        	        				cloud.util.unmask("#baseInfo");
    	        				}
    						});
    					}
    				});
    				
    			}else if(!retData.error_code){
        			var area = null;
        			var siteId = retData.result._id;//点位ID
        			var siteName = retData.result.name;//点位名称
        			var goodsConfigs = configs;
        			
    				if(flag){//点击“完成”
    					//添加售货机
            			Service.addAutomat(area,deviceName,modelId,modelName,siteId,siteName,assetId,goodsConfigs,function(data){
            				if(data.error_code==null){
            					$("#deviceId").val(data.result._id);
            					cloud.util.unmask("#baseInfo");
            					self.automatWindow.destroy();
                				self.fire("getDeviceList");
            				}else if(data.error_code == "21322"){//售货机名称已存在
    							dialog.render({lang:"automat_name_exists"});
    							return;2
    						}else if(data.error_code == "70002"){//售货机编号已存在
    							dialog.render({lang:"automat_goods_model_assertid_exists"});
    							return;
    						}
            			});
    				}else{ //点击“下一步”
    					cloud.util.unmask("#baseInfo");
    					$("#selectModels").val($("#automat_model option:selected").val());
    					$("#selfConfig").css("display","block");
    					$("#baseInfo").css("display","none");
    					$("#tab1").removeClass("active");
    					$("#tab2").addClass("active");
    					
    					var data = {};
        				data.area = area;
        				data.name = deviceName;
        				data.modelId = modelId;
        				data.siteId = siteId;
        				data.siteName = siteName;
        				data.modelName = modelName;
        				data.assetId = assetId;
        				self.SelfConfig.configData = data;
    				}
    			}
    		},self);
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