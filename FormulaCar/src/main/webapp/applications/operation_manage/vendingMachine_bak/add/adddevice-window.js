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
	require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
	require("./css/default.css");
	require("./js/scrollable");
	var SelfConfigInfo = require("../selfConfig/selfConfig");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._renderWindow();
			locale.render({element:this.element});
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
		_renderMap:function(){
			var self = this;
			var map = new BMap.Map("container");          // 创建地图实例  
			var point = new BMap.Point(116.331398,39.897445);
			map.centerAndZoom(point,7);

			map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
			map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
			
			var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}    
			map.addControl(new BMap.NavigationControl(opts));
			
			//定位到当前城市
			var myCity = new BMap.LocalCity();
		    myCity.get(function(result){
		        var cityName = result.name;
				map.setCenter(cityName);
				
				var myGeo = new BMap.Geocoder();
				myGeo.getPoint(cityName, function(point){
					if (point) {
						map.centerAndZoom(point, 7);
						var marker = new BMap.Marker(point); 
						self.getCenter(map,point,cityName);
						$("#lng").val(point.lng);
					    $("#lat").val(point.lat);
						map.addOverlay(marker);
						marker.enableDragging();  //可拖拽
					    marker.addEventListener("dragend", function (e) {
						    $("#lng").val(e.point.lng);
							$("#lat").val(e.point.lat);
							self.getCenter(map,e.point,'');
					    });
					}
				}, cityName);
		    });
			
			//移动地图 时将定位到当前视野的中心点
			map.addEventListener("dragend", function showInfo(){
				 var cp = map.getCenter();
				 map.clearOverlays();                    //清除
				 var marker = new BMap.Marker(cp);       // 创建标注
				 map.addOverlay(marker);                 // 将标注添加到地图中
				 $("#lng").val(cp.lng);
				 $("#lat").val(cp.lat);
				 
				 self.getCenter(map,cp,'');
				 
				 marker.enableDragging();  //可拖拽
				 //标注拖拽后的位置
				 marker.addEventListener("dragend", function (e) {
				        $("#lng").val(e.point.lng);
					    $("#lat").val(e.point.lat);
					    self.getCenter(map,e.point,'');
				 });
			 });
			
			//右击菜单
			/*var rightclickPoint={};
			var point;
			map.addEventListener("rightclick", function(e){
				rightclickPoint = {lng:e.point.lng,lat:e.point.lat};
				point = e.point;
			});
			var menu = new BMap.ContextMenu();
			var txtMenuItem = [
				{
					text:locale.get({lang:"in_this_position"}),
					callback:function(){
						var geoc = new BMap.Geocoder(); 
						var pt = point;
						geoc.getLocation(pt, function(rs){
							var addComp = rs.addressComponents;
						    $("#suggestId").val(addComp.city + addComp.district  + addComp.street  + addComp.streetNumber);
						});        
						map.clearOverlays(); //清除
						var marker = new BMap.Marker(rightclickPoint);       // 创建标注
						map.addOverlay(marker);                        // 将标注添加到地图中
					    $("#lng").val(rightclickPoint.lng);
						$("#lat").val(rightclickPoint.lat);
						map.panTo(rightclickPoint);  
						marker.enableDragging();  //可拖拽
						//标注拖拽后的位置
					    marker.addEventListener("dragend", function (e) {
					           $("#lng").val(e.point.lng);
							   $("#lat").val(e.point.lat);
					    });
					}
				}
			];
			for(var i=0; i < txtMenuItem.length; i++){
				menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
			}
			map.addContextMenu(menu);*/
			
			//各个按钮事件
			this._renderBtn(map);
		},
		_renderBtn:function(map){
			var self = this;
			//获取点位输入框事件并定位
			$('#suggestId').bind('input propertychange', function() {
				 var inpuValue=$("#suggestId").val();
				 $("#resultDiv").css("display","block");
				 Service.getAllPlace(inpuValue,function(data){
					 $("#results").empty();
					 var newData = eval('(' + data + ')'); 
					 if(newData.result.length > 0){
						 for(var i=0;i<newData.result.length;i++){
							 if(i<10){
								 var name = newData.result[i].name;
								 var location = newData.result[i].location;
								 var lat=""; var lng="";var msg="";
								 if(location){
									 lat = location.lat;
									 lng = location.lng;
								 }
								 if(lat && lng){
									 msg = "<li  style='cursor: pointer;' lat="+lat+" lng="+lng+">" + name + "</li>";
								 }else{
									 msg = "<li  style='cursor: pointer;' lat='' lng=''>" + name + "</li>";
								 }
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
								var lat = $(this).context.attributes[1].value;//纬度
								var lng = $(this).context.attributes[2].value;//经度
								$("#suggestId").val(text);
								if(lng && lat){
									$("#lng").val(lng);
									$("#lat").val(lat);
									map.centerAndZoom(new BMap.Point(lng,lat),16); //设置中心点
									map.clearOverlays(); //清除
									var new_point = new BMap.Point(lng,lat);
									self.getCenter(map,new_point,text);
									var marker = new BMap.Marker(new_point);       // 创建标注
									map.addOverlay(marker);                        // 将标注添加到地图中
									map.panTo(new_point);  
									marker.enableDragging();  //可拖拽
									//标注拖拽后的位置
								    marker.addEventListener("dragend", function (e) {
								           $("#lng").val(e.point.lng);
										   $("#lat").val(e.point.lat);
										   self.getCenter(map,e.point,'');
								    });
								}
						 });
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