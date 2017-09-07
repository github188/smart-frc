define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./gis.html");
    var winhtml = require("text!./old_monitorInfo.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var monitorInfo = require("./old_monitorInfo");
    require("./css/default.css");
    var gmap = require("../map/map");
   // require("async!http://maps.google.cn/maps/api/js?v=3&libraries=geometry&sensor=false");
    var gis = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            markers = this.markers = $H();
            this.element.html(html);
            this.render();
            locale.render({element: this.element});
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
            this.search = {};
            this.mapMark = {};
            this.plan = [];//所有符合条件的补货计划，包括未完成的和今天完成的
            this.planMap = {};  //补货计划map  计划id:售货机数组
            this.lineMap = {};  //线路map   线路id:
            this.line=[];
            this.pathline={};
            this.polyline={};
            this.markFlag = 0;
            this.startLocation={};
            this.warehousemap={};
            this.devMarkers = {};
            this.infowindow={};
            this.hostMap = {};
            this.vm=null;
			this.bubble = new gmap.Bubble({
				content : $(boxHtml),
				maxWidth : 800
			});
        },
        render:function(){
        	var self = this;
        	self.languge = localStorage.getItem("language");
        	if(self.languge == "en"){
        		this.renderLayout();
        		this._renderMapEn();
        		
        	}else{
        		this._renderMap();
        	}
        	
        },
        renderLayout:function(){
			if(this.layout){
				this.layout.destroy();
			}
			var self = this;
			this.layout = $("#container").layout({
				defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 1,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
					togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),  
                    resizable: false,
                    slidable: false
                },
                west: {
                    paneSelector: "#edge-content",
                    size: 255
                },
                center: {
                    paneSelector: "#center-content",
                    size: 900
                },
                south:{
                	initClosed: true
                }
			});
		},

        _renderMapEn:function(){
        	var self = this;
           	var position_option = {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 80000
                };
         	//var latlng = new google.maps.LatLng(41.85, -87.65);
        	var mapOptions = {  
        	          //设置经纬度  
        			//center: {lat: 41.85, lng: -87.65},
        			center:new google.maps.LatLng(41.85, -87.65),
        	         // center: new google.maps.LatLng(-34.397, 150.644),  
        	          zoom: 10,//地图的缩放度  
        	          mapTypeId: google.maps.MapTypeId.ROADMAP  
        	        }; 
        	
        	this.map = new google.maps.Map(document.getElementById("center-content"),  
                    mapOptions);
             var  map=this.map;  
     
        	if (navigator.geolocation) { 
        	
        		//获取当前地理位置信息 
        		navigator.geolocation.getCurrentPosition(function (position) { 
        			var coords = position.coords; 
        			//console.log(position); 
        			//指定一个google地图上的坐标点，同时指定该坐标点的横坐标和纵坐标 
        		//	console.log(coords.latitude);
        			var latlng = new google.maps.LatLng(coords.latitude, coords.longitude); 
        			map.setCenter(latlng);
        	/*		 var yourmarker = new google.maps.Marker({ 
        	            	 position: latlng, //将前面设定的坐标标注出来 
        	            	 map: map //将该标注设置在刚才创建的map中 
        	           }); */
        	            	 //标注提示窗口 
        	  /*        var infoWindow = new google.maps.InfoWindow({ 
        	             content: "当前位置：<br/>经度：" + latlng.lat() + "<br/>维度：" + latlng.lng() //提示窗体内的提示信息 
        	           }); 
        	            	 //打开提示窗口 
        	           infoWindow.open(map, yourmarker); */
        		},function(error){
        			alert("Error:The Geolocation service failed.。");
        			//console.log(error);
        		},position_option);
        	} else { 
        		alert("Your browser doesn\'t support to get the geographic location information。"); 
        	}
        	
            	 
           //添加查询输入框
          //  $("#container").append("<div style='z-index: 3; width: 250px; height: 45px; position: absolute; left: 10px; top: 45px;'><input type='text' placeholder='"+locale.get('enter_the_site_name')+"' style='width:300px;height:30px;-webkit-border-radius: 5px;font-size: 18px;' id='siteName'/></div>");
            $("#container").append("<div id='resultDiv' style='display:none;z-index: 3;height: auto;width: 205px; margin-left: 60px; margin-top: 16px;'>"+
                                      "<ul class='on_changes' id='results' style='position: absolute;font-size: 16px;width: 300px;top:55px; height: auto; overflow: auto; background-color: aliceblue;border:1px solid #CFD8CE;'>"+
                                      "</ul>"+
                                    "</div>");
            var slidHtml = "<div class='edgediv'>" +
			"<div id='search-bar' style='height: 40px;'><span style='line-height: 40px;'><input  id='search-assetId' placeholder='Please Enter Machine ID' style='width: 160px;height: 25px;margin-left: 5px;'type='text' /></span></div>"+
			"<div style='height:93%;overflow: auto;'>" +
			"<div>" +
			"<ul class='edgeul'>" +
			"<li id='tab_line' ><span>Route</span></li>" +
			"<li id='tab_replen'><span>Refill</span></li>" +
			"</ul>" +
			"</div>" +
			"<div class='linelist' style='height: 92%;overflow: auto;'>"+
			
			"</div>" +
			
			"<div class='replenlist' style='display:none;height: 92%;overflow: auto;'>"+
			
			"</div>" +
			
			"</div>" +
			
			"</div>";

            
            $("#edge-content").append(slidHtml);//添加边缘面板
         //   self._renderGetAllSite(this.map);//获取所有的点位信息
         //   self.renderEvent(this.map);
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	var assetId = $("#search-assetId").val();
                    	if(assetId==null||assetId.replace(/(^\s*)|(\s*$)/g,"")==""){
                    		dialog.render({lang:"enter_assetId"});
                  			return;
                  		};
                  		
                  		if(self.lineMap != null){
                  			var mapObject = self.lineMap;
                  			$.each(mapObject,function(name,value) {
                  				if(value != null && value.length >0){
                  					var patt = new RegExp(assetId);
                  					for(var i=0;i<value.length;i++){
                  						var m = value[i].assetId.match(patt);
                  						
                  						if(m){
                  							self.getMarker( value[i].siteId,assetId,"",value[i].location.latitude,value[i].location.longitude,value[i].online,map,1,1);
                  							
                  							break;
                  						}
                  				     }
                  					
                  					
                  				}
                  				
                  		    });
                  			
                  		}
                        
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            queryBtn.show();
            $("#search-bar a").css({
                margin: "auto 5px auto 5px"
            });
            
            
            $("#tab_line").bind("click",function(){//线路
            	
            	$("#tab_replen").removeClass("addbottom");
            	$("#tab_line").addClass("addbottom");
            	
            	self.renderEdgeContent(map);//线路
                
              //  self.renderReplenContent(map);//补货计划
            	
            	$(".linelist").show();
            	$(".replenlist").hide();
            	//map.clearOverlays(); //清除
            	self.devMarkers = {};
            	if (self.line) {
            	for (var int = 0; int <self.line.length; int++) {
            			if (self.mapMark[self.line[int]]) {
            				var marks =  self.mapMark[self.line[int]];
							for (var i = 0; i <marks.length; i++) {
								marks[i].setMap(null);
							}
							self.mapMark[self.line[int]]=null;
						}
            			if(self.pathline[self.line[int]]){
         					self.pathline[self.line[int]].setMap(null);
         					self.pathline[self.line[int]]=null;
         				}
         				if(self.warehousemap[self.line[int]]){
         					self.warehousemap[self.line[int]].setMap(null);
         					self.warehousemap[self.line[int]]=null;
         				}
				}
                }
            	
            	
            });
            $("#tab_replen").bind("click",function(){//补货
            	
            	$("#tab_line").removeClass("addbottom");
            	$("#tab_replen").addClass("addbottom");
            	
           // 	self.renderEdgeContent(map);
                
                self.renderReplenContent(map);
                
            	$(".linelist").hide();
            	$(".replenlist").show();
            	//map.clearOverlays(); //清除
            	self.devMarkers = {};
             	if (self.line) {
             			for (var int = 0; int <self.line.length; int++) {
             				if (self.mapMark[self.line[int]]) {
             					var marks =  self.mapMark[self.line[int]];
             					for (var i = 0; i <marks.length; i++) {
             						marks[i].setMap(null);
             					}
             					self.mapMark[self.line[int]]=null;
    						}
             				if(self.pathline[self.line[int]]){
             					self.pathline[self.line[int]].setMap(null);
             					self.pathline[self.line[int]]=null;
             				}
             				if(self.warehousemap[self.line[int]]){
             					self.warehousemap[self.line[int]].setMap(null);
             					self.warehousemap[self.line[int]]=null;
             				}
             			
    					}
                	}
           
            });
            
            $("#tab_line").click();
            
        },
        _renderMap:function(){
        	var self = this;
            var map = new BMap.Map("container");          // 创建地图实例  
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}
            map.addControl(new BMap.NavigationControl(opts));
            
          //定位到当前城市
            var myCity = new BMap.LocalCity(); 
            myCity.get(function(result) {
                var cityName = result.name; 
                map.setCenter(cityName);
                
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(cityName, function(point) {
                    if (point) {
                        map.centerAndZoom(point, 12);
                    }
                }, cityName);
            });
            
           //添加查询输入框
            $("#container").append("<div style='z-index: 3; width: 250px; height: 45px; position: absolute; left: 60px; top: 15px;'><input type='text' placeholder='"+locale.get('enter_the_site_name')+"' style='width:300px;height:30px;-webkit-border-radius: 5px;font-size: 18px;' id='siteName'/></div>");
            $("#container").append("<div id='resultDiv' style='display:none;z-index: 3;height: auto;width: 205px; margin-left: 60px; margin-top: 16px;'>"+
                                      "<ul class='on_changes' id='results' style='position: absolute;font-size: 16px;width: 300px;top:55px; height: auto; overflow: auto; background-color: aliceblue;border:1px solid #CFD8CE;'>"+
                                      "</ul>"+
                                    "</div>");
            
            self._renderGetAllSite(map);//获取所有的点位信息
            self.renderEvent(map);
        },
        renderEvent:function(map){
        	var self = this;
        	$('#siteName').bind('input propertychange', function() {
        		var inputValue = $("#siteName").val();
                $("#resultDiv").css("display", "block");
                var searchData={};
            	searchData.limit = -1;
            	searchData.cursor = 0;
            	searchData.name = inputValue;
            	
            	Service.getAllSitesByPage(searchData,function(data){
            		
            		$("#results").empty();
            		if (data.result.length > 0) {
                        for (var i = 0; i < data.result.length; i++) {
                        	var name = data.result[i].name;
                        	var _id = data.result[i]._id;
             			    var address = data.result[i].address;
             				var location = data.result[i].location;
             				var latitude = location.latitude;
             				var longitude = location.longitude;
             				var online = data.result[i].online;
                        	var msg = "";
                            msg = "<li  style='cursor: pointer;' id=" + data.result[i]._id + " latitude=" + latitude + " longitude=" + longitude + " name=" + name + " address=" + address + " online="+online+">" + name + "</li>";
                            $("#results").append(msg);
                        }
            		}
            	     $("#results li").mouseover(function() {
                         $("#results li").each(function(i) {
                             $(this).removeClass("blue");
                         });
                         $(this).addClass("blue");
                     }).mouseout(function() {
                         $(this).addClass("blue");
                     });
            		
            	     $("#results li").click(function() {
                         $("#resultDiv").css("display", "none");
                         var text = $(this).context.innerText;
                         $("#siteName").val(text);
                         
                         var id = $(this).context.attributes[1].value;
                         var latitude = $(this).context.attributes[2].value;
                         var longitude = $(this).context.attributes[3].value;
                         var name = $(this).context.attributes[4].value;
                         var address = $(this).context.attributes[5].value;
                         var online = $(this).context.attributes[6].value;
                         //console.log($(this).context);
                         var datas={
                        		 _id : id,          //点位标识
                        		 name : name,        //点位名称
                                 address : address,   //地址
                                 online: online       //online state
                         };
                         var marker = self.markers.get(id);
                         var opts = {
                         		width : 230,    // 信息窗口宽度
                         		height: 250,     // 信息窗口高度
                         		title : "", // 信息窗口标题
                         		enableAutoPan : true //自动平移
                         	}
                         if(self.languge == "en"){
                        	 var new_point = new google.maps.LatLng(latitude, longitude);
                        	 var infowindow = new google.maps.InfoWindow({  
                                 content: winhtml
                                 
                             }); 
                        	 infowindow.open(self.map, new_point);  
                         }else{
                        	 var new_point = new BMap.Point(longitude, latitude);
                             var infoWindow = new BMap.InfoWindow(winhtml, opts);  // 创建信息窗口对象
                         	 map.openInfoWindow(infoWindow,new_point); //开启信息窗口
                         }
                         
                     	 self.renderWinContentData(datas);
                     	 self.bindEvent(datas);
            	     });
            	});
        	});
        },
        renderEdgeContent:function(map){
        	cloud.util.mask(".linelist");
        	var self = this;
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
            	var lineIds=[];
                if(linedata && linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                }
                if(roleType == 51){
	    			 lineIds = [];
                }
                if(roleType != 51 && lineIds.length == 0){
	                    lineIds = ["000000000000000000000000"];
	            }
                self.search.lineId = lineIds;
                Service.getLineListData(self.search,function(data) {
                    
                    self.renderLineInfo(data,map);
                    
                    
                }, self);        
            });
        	
        	
        	
        },
        
        //线路信息
        renderLineInfo:function(data,map){
        	var self = this;
        	self.line=[];
        	self.lineMap = {};
        	var lineHtml = "";
        	var len = data.result.lineDatas.length;
        	for(var i=0;i<len;i++){
        		
        		var lineName = data.result.lineDatas[i].lineName;
        		var lineId = data.result.lineDatas[i].lineId;
        		var onlineDev = data.result.lineDatas[i].onlineDev;
        		var outlineDev = data.result.lineDatas[i].outlineDev;
        		var allSum = data.result.lineDatas[i].allSum;
        		var allAmount = data.result.lineDatas[i].allAmount/100;
        		
        		var deviceinfos = data.result.lineDatas[i].deviceinfos;
        		self.line.push(lineId);
        		self.lineMap[lineId] = deviceinfos;
        		
        		lineHtml += "<div class='edgecontent'>" +
    			"<div class='edgetitle'><span title='"+lineName+"' class='titlespan'>"+lineName+"</span><span><span id='"+lineId+"' value='0' class='titleinput'></span></span></div>" +
    			"<div><span class='content1'><span class='cspan1'><span class='online' title='"+locale.get({lang:"online_automat_num"})+"'></span><span class='margleft'>"+onlineDev+"</span></span><span class='cspan2'><span class='outline' title='"+locale.get({lang:"outline_automat_num"})+"'></span><span class='margleft'>"+outlineDev+"</span></span></span>" +
    			"<span class='content2'><span class='cspan1'><span class='salenum' title='"+locale.get({lang:"sales_volume_today"})+"'></span><span class='margleft'>"+allSum+"</span></span><span class='cspan2'><span class='salemon' title='"+locale.get({lang:"sales_today"})+"'></span><span class='margleft'>"+allAmount+"</span></span></span></div></div>";
        		
        		
        		$("#"+lineId).die('click');
        		$("#"+lineId).live('click',{lineId:lineId},function(e){
        			var temp = $(this).val();
        			if(temp == 1 || temp == "1"){
        				console.log(this.mapMark);
        				$("#"+e.data.lineId).val(0);
        				$("#"+e.data.lineId).addClass('titleinput');
        				$("#"+e.data.lineId).removeClass('titleinputed');
        				var marks = self.mapMark[e.data.lineId];
        				if(marks != null && marks.length >0){
        					
        					for(var n=0;n<marks.length;n++){
        						
        						//var mark = marks[n];
        						 marks[n].setMap(null);
        						
        						//map.closeInfoWindow();
        					}
        					
        				}
        				marks=[];
        				self.mapMark[e.data.lineId]=null;
        				
        			}else{
        				self.markFlag = 0;
        				
        				$("#"+e.data.lineId).val(1);
        				$("#"+e.data.lineId).addClass('titleinputed');
        				$("#"+e.data.lineId).removeClass('titleinput');
        				var deviceArr = self.lineMap[e.data.lineId];

        				//self.points = [];
        				//self.mapMark={};
        				for(var j=0;j<deviceArr.length;j++){
        					var lng = deviceArr[j].location.longitude;
                            var lat = deviceArr[j].location.latitude;
                            var address = deviceArr[j].location.region;
                            var online = deviceArr[j].online;
                            var name = deviceArr[j].assetId;
                            var host = deviceArr[j].host;
                            var siteId=deviceArr[j].siteId;
                            self.hostMap[name] = host;
                            self.getMarker(siteId,name,address,lat,lng,online,map,1,0,e.data.lineId);
                           
        					
        				}
                        

        				//var points = self.points;

        				//var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
        				//map.addOverlay(curve); //添加到地图中
        				//curve.enableEditing(); //开启编辑功能
        				
        			}

        			
        			
        		})
        		
        	}
        	
        	$(".linelist").html(lineHtml);
        	cloud.util.unmask(".linelist");
        	
        	
        	
        },
        renderReplenContent:function(map){
        	cloud.util.mask(".replenlist");
        	var self = this;
        	self.plan = [];
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
            var personId = "";
        	
            if(roleType != 51){
            	personId = userId;
            }
        	
			self.searchData = {
				"personId":personId,
				"completeRate":"100%"
			};

        	Service.getAllReplenishPlan(self.searchData,-1,0,function(data){
        		
			 
			 if(data.result){
				 var total = data.result.length;
				 if(total > 0){
					 for(var i=0;i<total;i++){
						 var _id = data.result[i]._id;
						 Service.getReplenishPlanById(_id,function(datainfo){
								
								self.plan.push(datainfo);
								
								if(self.plan.length == total){
									self.renderPlanInfo(map);
									
								}
								
								
								
							});
						 
						 
						 
					 }
				 }else{
					 cloud.util.unmask(".replenlist");
				 }
				 
			 }else{
				 cloud.util.unmask(".replenlist");
			 }
			 
		    }, self);
        	
        	
        },
        //补货线路信息
        renderPlanInfo:function(map){
        	var self = this;
        	self.polyline={};
        	self.planMap = {};
        	self.line=[];
        	var planHtml = "";
        	for(var i=0;i<self.plan.length;i++){
        		
        		var data = self.plan[i];
        		
        		var id = data.result._id;
        		var planNumber = data.result.number;
        		var completeRate = data.result.completeRate;
        		var devNum = 0;
        		var comdevNum = 0;
        		
        		if(data.result.routes&& data.result.routes.overviewPolyline){
        			self.polyline[id] = data.result.routes.overviewPolyline.points;
        			self.startLocation[id]=data.result.routes.legs[0].startLocation;
        		}
        		var cashAmount = 0;
        		var comcashAmount = 0;
        		self.line.push(id);
        		var saleData = data.saleData;
        		for(var j = 0;j < saleData.length;j ++){
    				
        			devNum += saleData[j].num;
        			comdevNum += saleData[j].numShu;
        			
        			cashAmount += saleData[j].moneys;
        			comcashAmount += saleData[j].moneyShu;
        			
    				var deviceList = saleData[j].deviceList;
    				var list = [];
    				if(deviceList.length > 0){
    					for(var h=0;h<deviceList.length;h++){
    						var device = {};
    						device.assetId = deviceList[h].assetId;
    						device.state = deviceList[h].state;
    						list.push(device);
    						
    						
    					}
    				}
    				
    				self.planMap[id] = list;
    				
    		    }
        		
        		planHtml += "<div class='edgecontent'>" +
    			"<div class='edgetitle'><span title='"+planNumber+"' class='titlespan'>"+planNumber+"</span><span><span id='"+id+"' value='0' class='titleinput'></span></div>" +
    			"<div style='height: 70px;margin-top: 3px;'>" +
    			"<span style='display: inline-block;width: 100%;line-height: 30px;'><span style='float: right;margin-right: 30px;color: blue;'>"+completeRate+"</span></span><span style='width: 100%;display: inline-block;line-height: 20px;'><span style='margin-left: 20px;'>"+comdevNum+"</span><span > / "+devNum+"</span><span style='    margin-left: 60px;'>"+comcashAmount+"</span><span > / "+cashAmount+"</span></span>" +
    			"</div></div>";
        		$("#"+id).die('click');
        		$("#"+id).live('click',{id:id},function(e){
        			var temp = $(this).val();
        			
        			if(temp == 1 || temp == "1"){
        				$("#"+e.data.id).val(0);
        				$("#"+e.data.id).addClass('titleinput');
        				$("#"+e.data.id).removeClass('titleinputed');
        				var marks = self.mapMark[e.data.id];
        				if(marks != null && marks.length >0){
        					
        					for(var n=0;n<marks.length;n++){
        						
        						var mark = marks[n];
        						mark.setMap(null);
        						//map.closeInfoWindow();
        					}
        					
        				}
        				self.mapMark[e.data.id]=null;
        				if(self.pathline[e.data.id]){
        					self.pathline[e.data.id].setMap(null);
        					self.pathline[e.data.id]=null;
        				}
        				if(self.warehousemap[e.data.id]){
        					self.warehousemap[e.data.id].setMap(null);
        					self.warehousemap[e.data.id]=null;
        				}
        				
        			}else{
        				
        				self.markFlag = 0;
        				$("#"+e.data.id).val(1);
        				
        				$("#"+e.data.id).addClass('titleinputed');
        				$("#"+e.data.id).removeClass('titleinput');
        				var assetIds = [];
        				var devices = self.planMap[e.data.id];
        				if(devices != null && devices.length>0){
        					for(var m=0;m<devices.length;m++){
        						assetIds.push(devices[m].assetId);
        					}
        					
        				}
        				var _id = e.data.id;
        				Service.getAutomatLocation(assetIds,function(data){
        					
        					
        					var deviceArr = data.result;

            				for(var k=0;k<deviceArr.length;k++){
            					var lng = deviceArr[k].location.longitude;
                                var lat = deviceArr[k].location.latitude;
                                var address = deviceArr[k].location.region;
                                var online = deviceArr[k].online;
                                var name = deviceArr[k].assetId;
                                
                                for(var x=0;x<devices.length;x++){//判断补货状态
            						if(devices[x].assetId == name){
            							online = devices[x].state;
            							break;
            						}
            					}
                                
                                self.getMarker(_id,name,address,lat,lng,online,map,2,0);
                               
            					
            				}
            				 if(self.polyline[_id]){
                                 self.createPolyline(_id,map,self.startLocation[_id], self.polyline[_id]);
                               }
        					
        				});

        				
        			}
        			
        			
        		});
        		
        	}
        	
        	$(".replenlist").html(planHtml);
        	cloud.util.unmask(".replenlist");
        	
        },
        createPolyline:function(_id,map,startLocation,polyline){
        	var self = this;
        	var decodedPath = google.maps.geometry.encoding.decodePath(polyline);
       	 	var path = new google.maps.MVCArray();
       	 	var  line= new google.maps.Polyline({
       	 		path:decodedPath,
       	 		strokeColor: '#FF0000',
       	    	strokeOpacity: 0.5,
       	    	strokeWeight: 4
       	 	});
       	 	line.setMap(map);
       	 	self.pathline[_id]=line;
       	 	var icon = "monitor/images/ui-gis-normal5.png";
       	  	var marker = new google.maps.Marker({  
		        position:new google.maps.LatLng(startLocation.lat, startLocation.lng),  
		        map: map,//要添加标记的地图  
		        title: '',
		        icon:icon
		        }); 
       	  	marker.setMap(map);
       	  	self.warehousemap[_id]=marker;
        },
        _renderGetAllSite:function(map){
        	var self = this;
        	var searchData={};
        	var siteName = "";
        	searchData.limit = -1;
        	searchData.cursor = 0;
        	searchData.name = siteName;
        	//map.clearOverlays(); //清除
        	Service.getAllSitesByPage(searchData,function(data){
        		
        		if(data.result && data.result.length > 0){
        			for(var i=0;i<data.result.length;i++){
        			    var _id = data.result[i]._id;
        			    var name = data.result[i].name;
        			    var address = data.result[i].address;
        				var location = data.result[i].location;
        				var latitude = location.latitude;
        				var longitude = location.longitude;
        				var online = data.result[i].online;
        		        self.getMarker(_id,name,address,latitude,longitude,online,map);
        			}
        			
        		}
        		//map.panTo(new BMap.Point(self.longitude, self.latitude));
        	});
        },
        getMarker:function(_id,name,address,latitude,longitude,online,map,type,state,lineId){
        	var self = this;
        	if(self.languge == "en"){
        		if(latitude && longitude){
        			 var icon = "";
        			 if(online == 0){//在线
        				 icon = "monitor/images/ui-gis-normal2.png";
        			 }else if(online == 1){
        				 icon = "monitor/images/ui-gis-normal4.png";
        			 }

					 var marker = new google.maps.Marker({  
					        position:new google.maps.LatLng(latitude, longitude),  
					        map: self.map,//要添加标记的地图  
					        title: '',
					        icon:icon
					        }); 
					 self.map.setCenter(marker.getPosition());
					 self.map.setZoom(10);

                    var datas={
                    		_id : _id,          //点位标识
                    		 name : name,        //点位名称
                             address : address,   //地址
                             online:online
                    };
         /*         if(!(name in self.devMarkers)){
                        // 将标注添加到地图中
                    	self.devMarkers[name] = marker;
                    }else{
                    	marker = self.devMarkers[name];
                    }*/
                   // map.addOverlay(marker);
                    marker.setMap(map);
                    
                    if(self.mapMark[lineId]){
                    	self.mapMark[lineId].push(marker);
                    }else{
                    	var marks = [];
                    	marks.push(marker);
                    	self.mapMark[lineId] = marks;
                    }
                    if(self.markFlag == 0){

                    //	map.panTo(new_point);
                    	self.markFlag = 1;
                    }
                    var new_point = new google.maps.LatLng(latitude, longitude);
                    self.longitude = longitude;
                    self.latitude = latitude;
                    self.procMarker(marker, datas,map,new_point);
    			}
        	}else{
        		if(latitude && longitude){
                    var new_point = new BMap.Point(longitude, latitude);
                    var myIcon=null;
                    if(online == 0){//在线
                    	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal2.png', new BMap.Size(20, 32), {
                    	    anchor: new BMap.Size(10, 30)
                    	});
                    }else if(online == 1){//离线
                    	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal4.png', new BMap.Size(20, 32), {
                    	    anchor: new BMap.Size(10, 30)
                    	});
                    }
                    var marker = new BMap.Marker(new_point,{icon:myIcon});  // 创建标注
                    map.addOverlay(marker);                        // 将标注添加到地图中
                    //map.panTo(new_point);
                    self.longitude = longitude;
                    self.latitude = latitude;
                    var datas={
                    		 _id : _id,          //点位标识
                    		 name : name,        //点位名称
                             address : address,   //地址
                             online: online
                    };
                   
                    self.procMarker(marker, datas,map,new_point);
    			}
        	}
    		
        },
        procMarker : function(marker, data,map,new_point){
        	var self = this;
            var opts = {
            		width : 230,    // 信息窗口宽度
            		height: 250,     // 信息窗口高度
            		title : "", // 信息窗口标题
            		enableAutoPan : true //自动平移
            	}
            
            if(self.languge == "en"){
                google.maps.event.addListener(marker, 'click', function() {  
                    //map.setZoom(12);  
                    //map.setCenter(marker.getPosition());  
                	if(self.vm){
                		self.vm.close();
                	   
                	}
                	
                	var infowindow = new google.maps.InfoWindow({  
            			content: winhtml
                 
            		});
                    infowindow.open(self.map, marker);  
                    self.vm=infowindow;
                    self.renderWinContentData(data);
            		self.bindEvent(data);
            		$(".monitor-info").parent().css("overflow","hidden");
                	$(".monitor-info").parent().parent().css("overflow","hidden");
                });
             
            //	self.markers.set(data._id, marker);
            }else{
            	var infoWindow = new BMap.InfoWindow(winhtml, opts);  // 创建信息窗口对象
            	marker.addEventListener("click", function(){          
            		map.openInfoWindow(infoWindow,new_point); //开启信息窗口
            		self.renderWinContentData(data);
            		self.bindEvent(data);
            	});
            	self.markers.set(data._id, marker);
            }
            
        	
        },
        renderWinContentData:function(data){
        	cloud.util.mask(".monitor-info-content");
        	
        	$("#monitor-info-name").text(data.name);
        	$("#monitor-info-location").text(data.address);
        	
        	var siteId = data._id;
        	var myDate=new Date();
        	var full = myDate.getFullYear(); 
        	var month = myDate.getMonth() +1;
        	var day = myDate.getDate();
        	var date =  full+"/"+month+"/"+day;
        	var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
        	var endTime = (new Date(date+" 23:59:59")).getTime()/1000; 
        
        		
        	Service.getDayAllStatistic(startTime, endTime, data.name,function(data) {
        	//Service.getDayAllStatisticBySiteId(siteId,startTime,endTime,function(data){
        		
        		cloud.util.unmask(".monitor-info-content");
        	    var amountOnLine = data.result[0].amountOnLine;
   			    var sumOnLine = data.result[0].sumOnLine;
   			    var amountOutLine = data.result[0].amountOutLine;
   			    var sumOutLine = data.result[0].sumOutLine;
   			    
        		if(data.result && data.result[0].amountOnLine){
        			$("#monitor-info-number_of_transactions").text(amountOnLine);//线上金额
        		}else{
        			$("#monitor-info-number_of_transactions").text("0");
        		}
        		if(data.result && data.result[0].amountOutLine){
        			$("#monitor-info-amount").text(amountOutLine);//线下金额
        		}else{
        			$("#monitor-info-amount").text("0");
        		}
        		if(data.result &&  data.result[0].sumOnLine){
        			$("#monitor-info-alarm").text(sumOnLine);//线上交易数
        		}else{
        			$("#monitor-info-alarm").text("0");
        		}
        		if(data.result &&  data.result[0].sumOutLine){
        			$("#monitor-info-online-rate").text(sumOutLine);//线下交易数
        		}else{
        			$("#monitor-info-online-rate").text("0");
        		}
        	});
        },
        bindEvent:function(data){
            var self = this;
            
            $("#monitor-info-name").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+data._id+'&tag=1&online='+data.online,'','');
            });
            //线上金额
            $("#monitor-info-number_of_transactions").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+data._id+'&tag=1&online='+data.online,'','');

            });
           //线下金额
            $("#monitor-info-amount").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+data._id+'&tag=1&online='+data.online,'','');
            });
        
            $("#monitor-info-alarm").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+data._id+'&tag=1&online='+data.online,'','');

            });
            $("#monitor-info-online-rate").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+data._id+'&tag=1&online='+data.online,'','');

            });
        }
        
    });
    return gis;
});