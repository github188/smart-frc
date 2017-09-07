define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./gis.html");
    var winhtml = require("text!./monitorInfo.html");
    var winhtml_more = require("text!./deviceSameLocation.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var Service = require("./service");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var monitorInfo = require("./monitorInfo");
    require("./css/default.css");
    require("./css/table.css");
    require("./css/style.css");
    require("./css/common.css");
    //require("http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js");
    //https://api.map.baidu.com/api?v=2.0&ak=5rCA4tslqZE5Ip5ew5pudaSb&s=1 在index.html中引入的
    
    var columns = [
       {
           "title": locale.get({lang: "trade_order_time"}),
           "dataIndex": "createTime",
           "cls": null,
           "width": "20%",
           render: dateConvertor
       }, {
           "title": locale.get({lang: "automat_no1"}),
           "dataIndex": "assetId",
           "cls": null,
           "width": "20%"
       }, {
           "title": locale.get({lang: "trade_product_name"}),
           "dataIndex": "goodsName",
           "cls": null,
           "width": "15%"
       }, {
           "title": locale.get({lang: "trade_pay_style"}),
           "dataIndex": "payStyle",
           "cls": null,
           "width": "15%",
           render: typeConvertor
       }, {
           "title": locale.get({lang: "deliver_status"}),
           "dataIndex": "deliverStatus",
           "cls": null,
           "width": "15%",
           render: deliverConvertor
       }, {
           "title": locale.get({lang: "refund_status"}),
           "dataIndex": "refundStatus",
           "cls": null,
           "width": "15%",
           render: refundStatus
    }];

   function refundStatus(value, type) {
       var display = "";
       if ("display" == type) {
           switch (value) {
               case 0:
                   display = locale.get({lang: "none"});//无
                   break;
               case 1:
                   display = locale.get({lang: "refunding"});//正在退款
                   break;
               case 2:
                   display = locale.get({lang: "refunded"});//退款成功
                   break;
               case 3:
                   display = locale.get({lang: "refunding_error"});//退款失败
                   break;
               case 4:
                   display = locale.get({lang: "need_to_re_aunch_the_refund"});//退款需要重新发起
                   break;
               case 5:
                   display = locale.get({lang: "to_send"});//转入代发
                   break;
               default:
                   break;
           }
           return display;
       } else {
           return value;
       }
   }
   function deliverConvertor(value, type) {
       var display = "";
       if ("display" == type) {
           switch (value) {
               case 2:
                   display = locale.get({lang: "deliver_status_1"});//出货失败 售空 
                   break;
               case 0:
                   display = locale.get({lang: "deliver_status_0"});//出货成功
                   break;
               case 3:
                   display = locale.get({lang: "deliver_status_1"});//出货失败
                   break;
               case 4:
                   display = locale.get({lang: "deliver_status_1"});//出货失败 出货通知发送失败
                   break;
               case -1:
                   display = locale.get({lang: "deliver_status_11"});//待出货
                   break;

               default:
                   break;
           }
           return display;
       } else {
           return value;
       }

   }

   function dateConvertor(value, type) {
       if (type === "display") {
           return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
       } else {
           return value;
       }
   }

   function typeConvertor(value, type) {
       var display = "";
       if ("display" == type) {
           switch (value) {
               case "1":
                   display = locale.get({lang: "trade_baifubao"});//百付宝
                   break;
               case "2":
                   display = locale.get({lang: "trade_wx_pay"});//微信公众号支付
                   break;
               case "3":
                   display = locale.get({lang: "trade_alipay"});//支付宝
                   break;
               case "4":
                   display = locale.get({lang: "trade_cash_payment"});//现金支付
                   break;
               case "5":
                   display = locale.get({lang: "trade_swing_card"});//刷卡
                   break;
               //case "6":
                 //  display = locale.get({lang: "trade_scanner_card"});/* 扫胸牌 */
                   //break;
               case "7":
                   display = locale.get({lang: "trade_claim_number"});/* 取货码 */
                   break;
               case "8":
                   display = locale.get({lang: "trade_game"});/* 游戏 */
                   break;
               case "9":
                   display = locale.get({lang: "trade_soundwave_pay"});/* 声波支付 */
                   break;
               case "10":
                   display = locale.get({lang: "trade_pos_mach"});/* POS机 */
                   break;
               case "11":
                   display = locale.get({lang: "one_card_solution"});/* 一卡通 */
                   break;
               case "12":
                   display = locale.get({lang: "trade_abc_palm_bank"});/* 农行掌银支付 */
                   break;
               case "13":
                   display = locale.get({lang: "wechat_reversescan_pay"});/* 微信反扫 */
                   break;
               case "14":
                   display = locale.get({lang: "trade_vip"});/* 会员支付 */
                   break;
               case "15":
                   display = locale.get({lang: "trade_best_pay"});/* 翼支付 */
                   break;
               case "16":
                   display = locale.get({lang: "trade_jd_pay"});/* 京东支付 */
                   break;
               case "19":
                   display = locale.get({lang: "trade_reversescan_pay"});/* 支付宝反扫 */
                   break;
               case "20":
                   display = locale.get({lang: "integral_exchange"});/* 积分兑换 */
                   break;
               default:
                   break;
           }
           return display;
       } else {
           return value;
       }
   }
    var gis = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.assetId = null;
            markers = this.markers = $H();
            this.element.html(html);
            this.search = {};
            this.plan = [];//所有符合条件的补货计划，包括未完成的和今天完成的
            this.planMap = {};  //补货计划map  计划id:售货机数组
            this.lineMap = {};  //线路map   线路id:
            
            this.markFlag = 0;
            
            this.devMarkers = {};
            
            this.hostMap = {};
            
            this.mapMark = {};   //标注map  线路id或计划id : marker
            
            this.points = [];
            this.lineIds=[];
            
            //this.shelvesState_main = [];
            this.shelvesState_container = [];
            this.cid = null;
            this.data = {};
            this.address = null;    //地址
            this.render();
           
            $("#container").height($("#user-content").height());
            $("#edge-content").height($("#user-content").height());
            $("#center-content").height($("#user-content").height());
            locale.render({element: this.element});

        },
        render:function(){
        	var self = this;
        	self.renderLayout();
        },
        //重新规划布局
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
                    paneSelector: "#center-content"
                },
                south:{
                	initClosed: true
                }
			});
			self._renderMap();
		},
        _renderMapEn:function(){//英文地图
        	var self = this;
        	var mapOptions = {  
        	          //设置经纬度  
        	          center: new google.maps.LatLng(-34.397, 150.644),  
        	          zoom: 8,//地图的缩放度  
        	          mapTypeId: google.maps.MapTypeId.ROADMAP  
        	        }; 
        	
        	this.map = new google.maps.Map(document.getElementById("container"),  
                    mapOptions);
        	
           //添加查询输入框
            $("#container").append("<div style='z-index: 3; width: 250px; height: 45px; position: absolute; left: 10px; top: 45px;'><input type='text' placeholder='"+locale.get('enter_the_site_name')+"' style='width:300px;height:30px;-webkit-border-radius: 5px;font-size: 18px;' id='siteName'/></div>");
            $("#container").append("<div id='resultDiv' style='display:none;z-index: 3;height: auto;width: 205px; margin-left: 60px; margin-top: 16px;'>"+
                                      "<ul class='on_changes' id='results' style='position: absolute;font-size: 16px;width: 300px;top:55px; height: auto; overflow: auto; background-color: aliceblue;border:1px solid #CFD8CE;'>"+
                                      "</ul>"+
                                    "</div>");
            
            self._renderGetAllSite(this.map);//获取所有的点位信息
            self.renderEvent(this.map);
        },
        _renderMap:function(){//创建地图
        	var self = this;
            var map = new BMap.Map("center-content");          // 创建地图实例  
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}
            map.addControl(new BMap.NavigationControl(opts));
            
          //定位到当前城市
            /*var myCity = new BMap.LocalCity(); 
            myCity.get(function(result) {
                var cityName = result.name; 
                map.setCenter(cityName);
                
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(cityName, function(point) {
                    if (point) {
                        map.centerAndZoom(point, 12);
                    }
                }, cityName);
            });*/
            $("#edge-content").html("");

            var slidHtml = "<div class='edgediv'>" +
			"<div id='search-bar' style='height: 40px;'><span style='line-height: 40px;'><input  id='search-assetId' placeholder='输入售货机编号' style='width: 160px;height: 25px;margin-left: 5px;'type='text' /></span></div>"+
			"<div style='height:93%;overflow: auto;'>" +
			"<div>" +
			"<ul class='edgeul'>" +
			"<li id='tab_line' ><span>线路</span></li>" +
			"<li id='tab_replen' style='display:none;'><span>补货</span></li>" +
			"</ul>" +
			"</div>" +
			"<div class='linelist' style='height: 92%;overflow: auto;'>"+
			   
			"</div>" +
			
			"<div class='replenlist' style='display:none;height: 92%;overflow: auto;'>"+
			
			"</div>" +
			
			"</div>" +
			
			"</div>";

            
            $("#edge-content").append(slidHtml);//添加边缘面板
            
            
            
            $("#tab_line").bind("click",function(){//线路
            	
            	$("#tab_replen").removeClass("addbottom");
            	$("#tab_line").addClass("addbottom");
            	
            	self.renderEdgeContent(map);//线路
                
                self.renderReplenContent(map);//补货计划
            	
            	$(".linelist").show();
            	$(".replenlist").hide();
            	map.clearOverlays(); //清除
            	self.devMarkers = {};
            	
            });
            $("#tab_replen").bind("click",function(){//补货
            	
            	$("#tab_line").removeClass("addbottom");
            	$("#tab_replen").addClass("addbottom");
            	
            	self.renderEdgeContent(map);
                
                self.renderReplenContent(map);
                
            	$(".linelist").hide();
            	$(".replenlist").show();
            	map.clearOverlays(); //清除
            	self.devMarkers = {};
            });
            
            $("#tab_line").click();

            //self.renderEdgeContent(map);
            
            //self.renderReplenContent(map);
            //self._renderGetAllSite(map);//获取所有的点位信息
            //self.renderEvent(map);
        },
        //休眠几秒
        sleep:function(n) {
            var start = new Date().getTime();
            while(true)  if(new Date().getTime()-start > n) break;
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
        	
        	self.planMap = {};
        	
        	var planHtml = "";
        	for(var i=0;i<self.plan.length;i++){
        		
        		var data = self.plan[i];
        		
        		var id = data.result._id;
        		var planNumber = data.result.number;
        		var completeRate = data.result.completeRate;
        		var devNum = 0;
        		var comdevNum = 0;
        		
        		var cashAmount = 0;
        		var comcashAmount = 0;
        		
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
        						map.removeOverlay(mark);
        						map.closeInfoWindow();
        					}
        					
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
                                
                                var regionStatus = "";
                   				
                   				if(deviceArr[k].regionStatus && deviceArr[k].regionStatus == 0){
                   					regionStatus = deviceArr[k].regionStatus;
                   					
                   					lat = deviceArr[k].rellocation.latitude;
                   					lng = deviceArr[k].rellocation.longitude;
                   				}
                                
                                for(var x=0;x<devices.length;x++){//判断补货状态
            						if(devices[x].assetId == name){
            							online = devices[x].state;
            							break;
            						}
            					}
                                if(lat && lng){
                                	self.getMarker(_id,name,address,lat,lng,online,map,2,0,regionStatus);
                                }
                                
            				}
        				});
        			}
        		});
        	}
        	
        	$(".replenlist").html(planHtml);
        	cloud.util.unmask(".replenlist");
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
                    
                    $("#selectAll").die('click');
                    $("#selectAll").live('click',function(){
                		if($(this)[0].className == "titleinputed"){
                			$(this).addClass('titleinput');
                			$(this).removeClass('titleinputed');
                			self.unselectAll(data,map);//取消全选
                		}else{ 
                			$(this).addClass('titleinputed');
                			$(this).removeClass('titleinput');
                			self.selectAll(data,map);//全选
                		}
                	});
                  self.selectAll(data,map);//全选
                    
                }, self);        
            });
        },
        unselectAll:function(data,map){
        	var self = this;
        	self.lineIdsMap = {};
        	var len = data.result.lineDatas.length;
        	if(len>0){
        		for(var i=0;i<len;i++){
        			var lineId = data.result.lineDatas[i].lineId;
        			var deviceinfos = data.result.lineDatas[i].deviceinfos;
        			self.lineIdsMap[lineId] = deviceinfos;
        			$("#"+lineId).attr("value",0);
    				$("#"+lineId).addClass('titleinput');
    				$("#"+lineId).removeClass('titleinputed');
    				var marks = self.mapMark[lineId];
    				if(marks != null && marks.length >0){
    					for(var n=0;n<marks.length;n++){
    						var mark = marks[n];
    						map.removeOverlay(mark);
    						map.closeInfoWindow();
    					}
    				}
        		}
        		/*var myCity = new BMap.LocalCity(); 
                myCity.get(function(result) {
                    var cityName = result.name; 
                    map.setCenter(cityName);
                    
                    var myGeo = new BMap.Geocoder();
                    myGeo.getPoint(cityName, function(point) {
                        if (point) {
                            map.centerAndZoom(point, 6);
                        }
                    }, cityName);
                });*/
        		self.lineIds=[];
        	}
        },
        getMapzoom:function(lineIdsMap,lineIds,map){
        	var self = this;
        	var ps=[];
        	var len = lineIds.length;
        	if(len>0){
        		for(var i=0;i<len;i++){
        			var lineId = lineIds[i];
        			var deviceArr = lineIdsMap[lineId];
        			for(var j=0;j<deviceArr.length;j++){
        				var lng = "";
                        var lat = "";
        				if(deviceArr[j].location && deviceArr[j].location.longitude && deviceArr[j].location.latitude){
        					lng = deviceArr[j].location.longitude;
                            lat = deviceArr[j].location.latitude;
        				}
        				if(lng && lat){
        					var locObj={
         							lng:lng,
         							lat:lat
         					};
         					ps.push(locObj);
        				}
        			}
        		}
        	}
        	if(ps.length>0){  
        		var maxLng = ps[0].lng;  
                var minLng = ps[0].lng;  
                var maxLat = ps[0].lat;  
                var minLat = ps[0].lat;  
                var res;  
                for (var i = ps.length - 1; i >= 0; i--) {  
                    res = ps[i];  
                    if(res.lng > maxLng) maxLng =res.lng;  
                    if(res.lng < minLng) minLng =res.lng;  
                    if(res.lat > maxLat) maxLat =res.lat;  
                    if(res.lat < minLat) minLat =res.lat;  
                };  
                self.getZoom(maxLng, minLng, maxLat, minLat,map);  
  	        }
        },
        getZoom:function(maxLng, minLng, maxLat, minLat,map) {  
        	var zoom_="";
            var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000","2500000","3000000","3500000","4000000","4500000","5000000","6000000"]//级别25到3。  
            var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A  
            var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B  
            var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位  
            for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
                if(zoom[i] - distance > 0){  
                	zoom_ =  25-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
                }  
            }
            var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;  
            var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
            map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom_); 
        },  
        setMark:function(lineIdsMap,lineIds,map){
        	var self = this;
        	var len = lineIds.length;
        	for(var i=0;i<len;i++){
        		var lineId = lineIds[i];
    			var deviceArr = lineIdsMap[lineId];
    			for(var j=0;j<deviceArr.length;j++){
					var lng = "";
                    var lat = "";
                    var address = "";
                    if(deviceArr[j].location && deviceArr[j].location.region){
                    	address = deviceArr[j].location.region;
                    }
                    var online = deviceArr[j].online;
                    var name = deviceArr[j].assetId;
                    var host = deviceArr[j].host;
                    
                    var regionStatus="";
                    if(deviceArr[j].regionStatus && deviceArr[j].regionStatus == 0){
                    	regionStatus = deviceArr[j].regionStatus;
                    	
                    	if( deviceArr[j].rellocation && deviceArr[j].rellocation.longitude && deviceArr[j].rellocation.latitude){
                            lng = deviceArr[j].rellocation.longitude;
                            lat = deviceArr[j].rellocation.latitude;
                            self.getMarker(lineId,name,address,lat,lng,online,map,1,0,regionStatus);
                        }
                    }else{
                    	 if( deviceArr[j].location && deviceArr[j].location.longitude && deviceArr[j].location.latitude){
                             lng = deviceArr[j].location.longitude;
                             lat = deviceArr[j].location.latitude;
                             self.getMarker(lineId,name,address,lat,lng,online,map,1,0,regionStatus);
                         }
                    }
                    self.hostMap[name] = host;
                   
				}
    		}
        },
        selectAll:function(data,map){
        	var self = this;
        	var lineIdsMap = {};
        	var len = data.result.lineDatas.length;
        	var lineIds=[];
        	if(len>0){
        		for(var i=0;i<len;i++){
        			var lineId = data.result.lineDatas[i].lineId;
        			lineIdsMap[lineId] =  data.result.lineDatas[i].deviceinfos;
        			lineIds.push(lineId);
        			$("#"+lineId).attr("value",1);
    				$("#"+lineId).addClass('titleinputed');
    				$("#"+lineId).removeClass('titleinput');
        		}
        	}
        	self.getMapzoom(lineIdsMap,lineIds,map);
        	self.setMark(lineIdsMap,lineIds,map);
        },
        setMapZoom:function(lineMap,lineIds,map){
        	var self = this;
        	self.getMapzoom(lineMap,lineIds,map);
        	self.setMark(lineMap,lineIds,map);
        },
        renderSearch:function(map){
        	var self = this;
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
                  							var regionStatus = "";
                  							if(value[i].regionStatus && value[i].regionStatus == 0){
                               					regionStatus = value[i].regionStatus;
                               					
                               					self.getMarker(name,assetId,"",value[i].rellocation.latitude,value[i].rellocation.longitude,value[i].online,map,1,1,regionStatus);
                               				}else{
                               					self.getMarker(name,assetId,"",value[i].location.latitude,value[i].location.longitude,value[i].online,map,1,1,regionStatus);
                               				}
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
                margin: "auto 10px auto 10px"
            });
        },
        //线路信息
        renderLineInfo:function(data,map){
        	var self = this;
        	self.allLine = data;
        	self.lineIds=[];
            var lineMap=[];
            self.lineMap={};
        	var len = data.result.lineDatas.length;
        	for(var i=0;i<len;i++){
        		self.lineIds.push(data.result.lineDatas[i].lineId);
        	}
        	
        	var lineHtml = "<div style='height:25px;'><div style='width: 50%;float:left;'><span style='line-height: 30px;margin-left: 5px;'>全选</span><span  value='0' class='titleinputed' style='margin-left: 5px;' id='selectAll'></span></div><div style='float:left;text-align: right;width: 45%;' title='线路总数'><span>总数:</span><span id='lineCount' style='line-height: 30px;margin-left: 5px;'>"+len+"</span></div></div>";
        	for(var i=0;i<len;i++){
        		var lineName = data.result.lineDatas[i].lineName;
        		var lineId = data.result.lineDatas[i].lineId;
        		var onlineDev = data.result.lineDatas[i].onlineDev;
        		var outlineDev = data.result.lineDatas[i].outlineDev;
        		var allSum = data.result.lineDatas[i].allSum;
        		var allAmount = data.result.lineDatas[i].allAmount/100;
        		
        		var deviceinfos = data.result.lineDatas[i].deviceinfos;
        		self.lineMap[lineId] =  deviceinfos
        		
        		lineMap[lineId] = deviceinfos;
        		
        		
        		lineHtml += "<div class='edgecontent'>" +
    			"<div class='edgetitle'><span title='"+lineName+"' class='titlespan'>"+lineName+"</span><span><span id='"+lineId+"' value='0' class='titleinput'></span></span></div>" +
    			"<div><span class='content1'><span class='cspan1'><span class='online' title='在线售货机数量'></span><span class='margleft'>"+onlineDev+"</span></span><span class='cspan2'><span class='outline' title='离线售货机数量'></span><span class='margleft'>"+outlineDev+"</span></span></span>" +
    			"<span class='content2'><span class='cspan1'><span class='salenum' title='今日销量'></span><span class='margleft'>"+allSum+"</span></span><span class='cspan2'><span class='salemon' title='今日销售额'></span><span class='margleft'>"+allAmount+"</span></span></span></div></div>";
        		
        		
        		$("#"+lineId).die('click');
        		$("#"+lineId).live('click',{lineId:lineId},function(e){
        			var temp = $(this)[0].attributes[1].value;
        			if(temp == 1 || temp == "1"){ //取消选择
        				$("#"+e.data.lineId).attr("value",0);
        				$("#"+e.data.lineId).addClass('titleinput');
        				$("#"+e.data.lineId).removeClass('titleinputed');
        				
        				$("#selectAll").addClass('titleinput');
        				$("#selectAll").removeClass('titleinputed');
        				
        				var marks = self.mapMark[e.data.lineId];
        				if(marks != null && marks.length >0){
        					for(var n=0;n<marks.length;n++){
        						var mark = marks[n];
        						map.removeOverlay(mark);
        						map.closeInfoWindow();
        					}
        				}
        				//计算缩放级别
        				for(var k=0;k<self.lineIds.length;k++){
        					if(self.lineIds[k] == e.data.lineId){
        						self.lineIds.splice(k,1);
        					}
        				}
        				self.setMapZoom(lineMap,self.lineIds,map);
        			
        			}else{  //选中
        				self.markFlag = 0;
        				$("#"+e.data.lineId).attr("value",1);
        				$("#"+e.data.lineId).addClass('titleinputed');
        				$("#"+e.data.lineId).removeClass('titleinput');
        				
        				if($(".titleinputed").length == len){//全选
                        	$("#selectAll").addClass('titleinputed');
            				$("#selectAll").removeClass('titleinput');
                        }
        				//计算缩放级别
        				if(self.lineIds.length>0){
        					if(self.lineIds.indexOf(e.data.lineId)>-1){
            				}else{
            					self.lineIds.push(e.data.lineId);
            				}
        				}else{
        					self.lineIds.push(e.data.lineId);
        				}
        				
        				self.setMapZoom(lineMap,self.lineIds,map);
        			}
        		});
        	}
        	$(".linelist").html(lineHtml);
        	self.renderSearch(map);
        	cloud.util.unmask(".linelist");
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
   	                searchData.lineId = lineIds;

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
                          		width : 350,    // 信息窗口宽度
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
                        	  if(longitude && latitude){
                        		  var new_point = new BMap.Point(longitude, latitude);
                                  var infoWindow = new BMap.InfoWindow(winhtml, opts);  // 创建信息窗口对象
                              	  map.openInfoWindow(infoWindow,new_point); //开启信息窗口
                        	  }
                          }
                          
                      	 self.renderWinContentData(datas);
                      	 //self.bindEvent(datas);
             	     });
             	   });
   	            });
        	});
        },
        _renderGetAllSite:function(map){
        	var self = this;
        	var searchData={};
        	var siteName = "";
        	searchData.limit = -1;
        	searchData.cursor = 0;
        	searchData.name = siteName;
        	//map.clearOverlays(); //清除
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
 	              searchData.lineId = lineIds;
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
               				
               				var regionStatus = "";
               				if(data.result[i].regionStatus && data.result[i].regionStatus == 0){
               					regionStatus = data.result[i].regionStatus;
               					
               					latitude = data.result[i].rellocation.latitude;
               					longitude = data.result[i].rellocation.longitude;
               				}
               				
               				if(latitude && longitude){
               					self.getMarker(_id,name,address,latitude,longitude,online,map,1,0,regionStatus);
               				}
               			}
               			
               		}
               		//map.panTo(new BMap.Point(self.longitude, self.latitude));
               	});
                  
             });
        	
        },
        getSite: function(siteName) {
            var self = this;
            Service.getSiteByName(siteName, function(siteData) {
                if (siteData.result) {
                    var loc = siteData.result.address;
                    var lng = siteData.result.location.longitude;
                    var lat = siteData.result.location.latitude;
                    
                    var address = siteData.result.address;
                    self.address = address;
                    $("#location").text(address);
                }
            }, self);
        },
        getMarker:function(_id,name,address,latitude,longitude,online,map,type,state,regionStatus){
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
					 
					 if(self.markFlag == 0){
						 self.map.setCenter(marker.getPosition());
						 self.map.setZoom(12);
						 self.markFlag = 1;
					 }
					 

                    var datas={
                    		 _id : _id,          //点位标识
                    		 name : name,        //点位名称
                             address : address   //地址
                    };
                   
                    self.procMarker(marker, datas,map,new_point,state);
    			}
        	}else{
        		if(latitude && longitude){
                    var new_point = new BMap.Point(longitude, latitude);
                    //self.points.push(new_point);
                    var myIcon=null;
                    if(type == 1){
                    	if(regionStatus && regionStatus == 0){
                    		myIcon = new BMap.Icon('../../cloud/resources/images/py.png', new BMap.Size(20, 32), {
                        	    anchor: new BMap.Size(10, 30)
                        	});
                    	}else{
                    		if(online == 0){//在线
                            	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal2.png', new BMap.Size(20, 32), {
                            	    anchor: new BMap.Size(10, 30)
                            	});
                            }else if(online == 1){//离线
                            	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal4.png', new BMap.Size(20, 32), {
                            	    anchor: new BMap.Size(10, 30)
                            	});
                            }
                    	}
                    }else{
                    	if(regionStatus && regionStatus == 0){
                    		myIcon = new BMap.Icon('../../cloud/resources/images/py.png', new BMap.Size(20, 32), {
                        	    anchor: new BMap.Size(10, 30)
                        	});
                    	}else{
                    		if(online == 0){//未补货
                            	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal4.png', new BMap.Size(20, 32), {
                            	    anchor: new BMap.Size(15, 15)
                            	});
                            }else if(online == 1){//已经补货
                            	myIcon = new BMap.Icon('../../cloud/resources/images/ui-gis-normal2.png', new BMap.Size(20, 32), {
                            	    anchor: new BMap.Size(20, 20)
                            	});
                            }
                    	}
                    	
                    }
                    
                    var marker = new BMap.Marker(new_point,{icon:myIcon});  // 创建标注
                    if(!(name in self.devMarkers)){
                    	                        // 将标注添加到地图中
                        self.devMarkers[name] = marker;
                    }else{
                    	marker = self.devMarkers[name];
                    }
                    map.addOverlay(marker);
                    
                    if(self.mapMark[_id]){
                    	self.mapMark[_id].push(marker);
                    }else{
                    	var marks = [];
                    	marks.push(marker);
                    	self.mapMark[_id] = marks;
                    }
                    if(self.markFlag == 0){
                    	
                    	map.panTo(new_point);
                    	self.markFlag = 1;
                    }
                    
                    self.longitude = longitude;
                    self.latitude = latitude;
                    var datas={
                    		 _id : _id,          //点位标识
                    		 name : name,        //点位名称
                             address : address,   //地址
                             online: online
                    };
                   
                    self.procMarker(marker, datas,map,new_point,state);
                    
                   
    			}
        	}
    		
        },
        procMarker : function(marker, data,map,new_point,state){
        	var self = this;
            var opts = {
            		width : 500,    // 信息窗口宽度
            		height: 400,     // 信息窗口高度
            		title : "", // 信息窗口标题
            		enableAutoPan : true //自动平移
            	}
            
            if(self.languge == "en"){
                
                var infowindow = new google.maps.InfoWindow({  
                    content: winhtml
                    
                });  
                google.maps.event.addListener(marker, 'click', function() {  
                    //map.setZoom(12);  
                    //map.setCenter(marker.getPosition());  
                    infowindow.open(self.map, marker);  
                    self.renderWinContentData(data);
            		//self.bindEvent(data);
            		$(".monitor-info").parent().css("overflow","hidden");
                	$(".monitor-info").parent().parent().css("overflow","hidden");
                }); 
            	self.markers.set(data._id, marker);
            }else{
            	var infoWindow = new BMap.InfoWindow(winhtml, opts);  // 创建信息窗口对象
            	var fourOpts = { 
            			width:600,
            			height:1000
            	};
            	var infoWindow_more = new BMap.InfoWindow(winhtml_more, fourOpts);  // 创建信息窗口对象
            	marker.addEventListener("click", function(){ 
            		var lineId = data._id;
            		console.log(self.lineMap[lineId]);
            		var deviceIdArray=[];
            		if(self.lineMap[data._id] && self.lineMap[data._id].length>0){
            			for(var i=0;i<self.lineMap[data._id].length;i++){
            				if((new_point.lng == self.lineMap[data._id][i].location.longitude) && (new_point.lat == self.lineMap[data._id][i].location.latitude)){
            					deviceIdArray.push(self.lineMap[data._id][i].deviceId+";"+self.lineMap[data._id][i].assetId);
            				}
            			}
            		}
            		console.log(deviceIdArray);
            		if(deviceIdArray.length == 1){
            			map.openInfoWindow(infoWindow,new_point); 
            			self.renderWinContentData(data);
            		}else if(deviceIdArray.length>1){
            			map.openInfoWindow(infoWindow_more,new_point); 
            			self.renderWinMoreContentData(self.allLine,data,deviceIdArray);
            		}
            		
            		marker.setAnimation();
            		//self.bindEvent(data);
            	});
            	self.markers.set(data._id, marker);
            	if(state == 1){
            		map.setCenter(new_point); 
            		marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            		//map.openInfoWindow(infoWindow,new_point); //开启信息窗口
            		//console.log($(".monitor-info").length);
            		//self.renderWinContentData(data);

            	}
            	
            	
            }
            
        	
        },
        renderWinMoreContentData:function(allLine,data,deviceIdArray){
        	var self = this;
        	$("#sum").text(deviceIdArray.length);
        	if(allLine.result.lineDatas.length>0){
        		for(var i=0;i<allLine.result.lineDatas.length;i++){
        			if(allLine.result.lineDatas[i].lineId == data._id){
        				$("#lineName").text(allLine.result.lineDatas[i].lineName);
        				$("#allAmount").text("销售额: "+allLine.result.lineDatas[i].allAmount/100+"元");
        				$("#allSum").text("销售量: "+allLine.result.lineDatas[i].allSum+"笔");
        				
        			}
        		}
        	}
        	
        	var deviceList=[];
        	if(deviceIdArray.length>0){
	    		for(var i=0;i<deviceIdArray.length;i++){
	    			var obj={
	    					deviceId:deviceIdArray[i].split(";")[0],
	    					assetId:deviceIdArray[i].split(";")[1]
	    			};
	    			if(i%2==0){
	    			   $("#deviceTable").append(
	    				  "<tr style='height:25px;line-height:25px;width:100%;'><td style='text-align: center;width:100px;cursor: pointer;' id='"+deviceIdArray[i].split(";")[1]+"' class='tdclass'><span>"+deviceIdArray[i].split(";")[1]+"</span></td></tr>"
	    			   );
	    			}else{
	    			   $("#deviceTable").append(
						  "<tr style='height:25px;line-height:25px;background-color: #ddd;width:100%;'><td style='text-align: center;width:100px;cursor: pointer;' id='"+deviceIdArray[i].split(";")[1]+"' class='tdclass'><span>"+deviceIdArray[i].split(";")[1]+"</span></td></tr>"
	    			   );
	    			}
	    			
	    			$("#"+deviceIdArray[i].split(";")[1]).click(function() {
		    			$('.tdclass').removeClass("cloud-table-shadow");
		    			$(".tdclass").css("border-bottom", "0px");
		    			$(this).addClass("cloud-table-shadow");
		    			$(this).css("border-bottom", "2px solid rgb(65, 146, 119)");
		    			var assetId = $(this)[0].id;
		    			self.rendermoreContentData(assetId);
		    		});
	    		}
    			$("#"+deviceIdArray[0].split(";")[1]).click();
	    		
    	   }
        },
        rendermoreContentData:function(assetId){
        	var self = this;
        	var myDate=new Date();
        	var full = myDate.getFullYear(); 
        	var month = myDate.getMonth() +1;
        	var day = myDate.getDate();
        	var date =  full+"/"+month+"/"+day;
        	var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
        	var endTime = (new Date(date+" 23:59:59")).getTime()/1000;
        	
        	Service.getAutomatByAssetId(assetId,function(data){       
        		console.log(data);
        		
        		if(data.result){
        			self.renderAutomatInfo(data);
        		}           		           		
        	});
        },
        sleep:function(n) {
            var start = new Date().getTime();
            while(true)  if(new Date().getTime()-start > n) break;
        },
        renderAutomatInfo:function(datas){
        	var self = this;
        	self.data = datas;
        	self.assetId = self.data.result.assetId;
        	
        	//tab添加事件
        	//货道信息
        	$("#shelfinfo").bind('click',function(){
        		
        		$("#detailinfo").removeClass("addbottom");
        		$("#faultinfo").removeClass("addbottom");
        		$("#tradeinfo").removeClass("addbottom");
            	$("#shelfinfo").addClass("addbottom");
            	$(".detail-content").empty();
            	$(".detail-content").css("overflow","auto");
            	
            	self.renderShelfContent(self.data);
        		
        	});
        	//详细信息
        	$("#detailinfo").bind('click',function(){
        		$("#shelfinfo").removeClass("addbottom");
        		$("#faultinfo").removeClass("addbottom");
        		$("#tradeinfo").removeClass("addbottom");
            	$("#detailinfo").addClass("addbottom");
            	$(".detail-content").empty();
            	$(".detail-content").css("overflow","auto");
            	
            	
            	
            	if(self.data != null){
            		var data = self.data;
            		var detailHtml = "";
            		var online = data.result.online;
            		if(online == 0){
            			online = "在线";
            		}else if (online == 1){
            			online = "离线";
            		}
            		var assetId = data.result.assetId;
            		self.assetId = assetId;
            		var name = data.result.name;
            		var line = data.result.lineName;
            		var site = data.result.siteName;
            		var vender = data.result.config.vender;
            		if(vender == "aucma"){
            			vender = "澳柯玛";
            		}
            		var pay = "";
            		var payStyle = data.result.payConfig;
            		if(payStyle && payStyle.length > 0){
            			for(var i=0;i<payStyle.length;i++){
            				var payname = payStyle[i].payName;
            				if(payname == "WECHAT"){
            					if(i == payStyle.length -1){
            						pay += "微信";
            					}else{
            						pay += "微信,";
            					}
            					
            				}else if(payname == "ALIPAY"){
            					if(i == payStyle.length -1){
            						pay += "支付宝";
            					}else{
            						pay += "支付宝,";
            					}
            					
            				}else if(payname == "BAIDU"){
            					if(i == payStyle.length -1){
            						pay += "百付宝";
            					}else{
            						pay += "百付宝,";
            					}
            					
            				}else if(payname == "BESTPAY"){
            					if(i == payStyle.length -1){
            						pay += "翼支付";
            					}else{
            						pay += "翼支付,";
            					}
            					
            				}else if(payname == "JDPAY"){
            					if(i == payStyle.length -1){
            						pay += "京东支付";
            					}else{
            						pay += "京东支付,";
            					}
            					
            				}
            				
            			}
            		}
            		
            		var address = self.address;
            		
            		var reladdress = "";
            		var lat = "";
            		var lon = "";
            		//if(data.result.address){
            		//	reladdress = data.result.address;
            		//}
            		if(data.result.rellocation){
            			reladdress = data.result.rellocation.address;
            			lat = data.result.rellocation.latitude;
            			lon = data.result.rellocation.longitude;
            		}
            		detailHtml += "<div class='detail-div'><span style='line-height: 30px; background-color: #ddd;'>基本信息</span><span>网络  ："+online+"</span><span>售货机编号 ："+assetId+"</span>" +
            				"<span>售货机名称 ："+name+"</span><span>支付方式 ："+pay+"</span>" +
            				"<span>线路 ："+line+"</span><span>点位 ："+site+"</span>" +
            				"<span>地理位置 ："+address+"</span><span id='address'>实际位置 ："+reladdress+"</span>" +
            				"<span>经度："+lon+"</span>"+"<span>纬度："+lat+"</span>"
            				"<span>厂家 ："+vender+"</span></div>";
            		
            		
            		var fireware = "";
            		if(data.result.inboxConfig && data.result.inboxConfig.fireware){
            			fireware = data.result.inboxConfig.fireware;
            		}
            		var doorstate = "";
            		//门开关情况
            		if(data.result.vendingState && data.result.vendingState.doorState && data.result.vendingState.doorState == 1){
            			doorstate = locale.get({lang: "automat_open_the_door"});
            		}else if(data.result.vendingState && data.result.vendingState.doorState == 0){
            			doorstate = locale.get({lang: "automat_close_the_door"});
            		}else if(data.result.vendingState && data.result.vendingState.doorState == -1){
            			doorstate = locale.get({lang: "automat_unknown"});
            		}else{
            			doorstate = locale.get({lang: "automat_unknown"});
            		}
            		
            		//vmc情况
            		var vmcstate = "";
            		if(data.result.vendingState && data.result.vendingState.vmcOnline && data.result.vendingState.vmcOnline == 1){
            			vmcstate = locale.get({lang:"automat_vmcconnection_state_conn"});
            		}else if(data.result.vendingState && data.result.vendingState.vmcOnline == 0){
            			vmcstate = locale.get({lang:"automat_vmcconnection_state_off"});
            		}else if(data.result.vendingState && data.result.vendingState.vmcOnline == -1){
            			vmcstate = locale.get({lang: "automat_unknown"});
            		}else{
            			vmcstate = locale.get({lang: "automat_unknown"});
            		}
            		
            		//售卖情况
            		var issale = "";
            		if(data.result.vendingState && data.result.vendingState.isSale && data.result.vendingState.isSale == 1){
            			issale = locale.get({lang: "automat_can_be_sold"});
            		}else if(data.result.vendingState && data.result.vendingState.isSale == 0){
            			issale = locale.get({lang: "automat_can_not_be_sold"});
            		}else if(data.result.vendingState && data.result.vendingState.isSale == -1){
            			issale = locale.get({lang: "automat_unknown"});
            		}else{
            			issale = locale.get({lang: "automat_unknown"});
            		}
            		
            		var vcsver = "";
            		if(data.result.inboxConfig && data.result.inboxConfig && data.result.inboxConfig.apps && data.result.inboxConfig.apps.length > 0){
            			var apps = data.result.inboxConfig.apps;
            			for(var h=0;h<apps.length;h++){
            				if(apps[h].name == "VendingCloudService"){
            					vcsver = apps[h].version;
            					break;
            				}
            				
            			}
            			
            		}
            		
            		
            		detailHtml += "<div class='detail-div'><span style='line-height: 30px; background-color: #ddd;'>参数信息</span>" +
            				        "<span>固件版本 ："+fireware+"</span>" +
            						"<span>VMC连接状态 ："+vmcstate+"</span>" +
            						"<span>VCS版本 ："+vcsver+"</span>" +
            						"<span>售卖状态 ："+issale+"</span>" +
            						"<span>门 ："+doorstate+"</span>" +
            						"</div>";
            		
            		var ip = self.hostMap[self.assetId];
            		$(".detail-content").append(detailHtml); 
            		

            		
            		
            	}
            	
        		
        	});
        	$("#faultinfo").bind('click',function(){
        		$("#detailinfo").removeClass("addbottom");
        		$("#shelfinfo").removeClass("addbottom");
        		$("#tradeinfo").removeClass("addbottom");
            	$("#faultinfo").addClass("addbottom");
            	$(".detail-content").empty();
            	$(".detail-content").css("overflow","auto");
            	if(self.data != null){
            		var data = self.data;
            		var faultHtml = "";
            		
            		var faults = "";
            		if(data.result.vendingState.vendingFault && data.result.vendingState.vendingFault.length>0){
            			
            			var len = data.result.vendingState.vendingFault.length;
            			
            			for(var m=0;m<len;m++){
            				var fault = self.getFaultDetail(data.result.vendingState.vendingFault[m].ccode);
            				
            				faults += "<span>"+fault+"</span>";
            			}
            			$(".faults").text(len);
            			$(".faults").css("display","inline-table");
            		}else{
            			$(".faults").css("display","none");
            			faults += "<span>暂无数据</span>"
            		}
            		
            		faultHtml += "<div class='detail-div'><span style='line-height: 30px; background-color: #ddd;'>故障信息</span>" +
    				
            		faults+"</div>";
            		
            		
            		$(".detail-content").append(faultHtml);
            		
            	}
        		
        	});
        	$("#tradeinfo").bind('click',function(){
        		$("#detailinfo").removeClass("addbottom");
        		$("#faultinfo").removeClass("addbottom");
        		$("#shelfinfo").removeClass("addbottom");
            	$("#tradeinfo").addClass("addbottom");
            	$(".detail-content").empty();
            	$(".detail-content").css("overflow","hidden");
            	$(".detail-content").append("<div style='height: 50px;'><span class='tradetitle'><span>销量 ：<span id='allsum' style='color: #66cc99;font-weight: bold;'></span></span><span >线上销量 ：<span id='onlinesum' style='color: #66cc99;font-weight: bold;'></span></span><span >线下销量 ：<span id='outlinesum' style='color: #66cc99;font-weight: bold;'></span></span></span>" +
            			"<span class='tradetitle'><span >销售额 ：<span id='allamount' style='color: #66cc99;font-weight: bold;'></span></span><span >线上金额 ：<span id='onlineamount' style='color: #66cc99;font-weight: bold;'></span></span><span >线下金额 ：<span id='outlineamount' style='color: #66cc99;font-weight: bold;'></span></span></span>" +
            			"</div><div id='trade_list_table' style='height:280px;overflow:auto;width:100%'></div><div id='trade_list_paging' style='width: 85%;'></div>");
            	
            	self.renderStatistic();
            	
            	
            	self._renderTable();
        	});
        	
        	
        	$("#shelfinfo").click();
        	
        	//显示故障数量
        	if(self.data != null){
        		var data = self.data;
        		
        		var faults = "";
        		
        		if(data.result.vendingState && data.result.vendingState.vendingFault && data.result.vendingState.vendingFault.length>0){
        			
        			var len = data.result.vendingState.vendingFault.length;
        			
        			$(".faults").text(len);
        			$(".faults").css("display","inline-table");
        		}else{
        			$(".faults").css("display","none");
        		}
        		
        		
        	}
        	
        	
        },
        renderWinContentData:function(data){
        	cloud.util.mask(".monitor-info-content");
        	var self = this;
        	var myDate=new Date();
        	var full = myDate.getFullYear(); 
        	var month = myDate.getMonth() +1;
        	var day = myDate.getDate();
        	var date =  full+"/"+month+"/"+day;
        	var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
        	var endTime = (new Date(date+" 23:59:59")).getTime()/1000;
        	
        	var assetId = data.name;
        	
        	Service.getAutomatByAssetId(assetId,function(data){           		
        		
        		if(data.result){
        			//self.data = data;
        			
        			self.renderAutomatInfo(data);
        			
        		}           		           		
        		
        	});
        	
        	
        	
        },
        renderStatistic:function(){
        	var self = this;
        	var nowDate = new Date();
            var start = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 00:00:00")).getTime() / 1000;
            var end = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 23:59:59")).getTime() / 1000;
        	
        	Service.getDayAllStatistic(start, end, self.assetId,function(data) {
                if (data.result.length) {
                	
                	var res = data.result[0];
                	var onlineSum = res.sumOnLine;
                	var outlineSum = res.sumOutLine;
                	var allSum = onlineSum+outlineSum;
                	
                	var onlineAmount = res.amountOnLine;
                	var outlineAmount = res.amountOutLine;
                	var allAmount = onlineAmount+outlineAmount;
                	
                	$("#allsum").text(allSum);
                	$("#onlinesum").text(onlineSum);
                	$("#outlinesum").text(outlineSum);
                	
                	$("#allamount").text(allAmount);
                	$("#onlineamount").text(onlineAmount);
                	$("#outlineamount").text(outlineAmount);
                	
                	
                }   
            });
        	
        },
        _renderpage: function(data, start) {
            var self = this;

                this.page = new Paging({
                    selector: $("#trade_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#trade_list_table");
                       
                        var nowDate = new Date();
                        var start = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 00:00:00")).getTime() / 1000;
                        var end = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 23:59:59")).getTime() / 1000;
                                              
                        var assetId = self.assetId;
                        Service.getTradeList(options.cursor, options.limit, assetId, start, end,1,function(data) {
                            callback(data);
                            cloud.util.unmask("#trade_list_table");
                        });

                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;

        },
        _renderTable: function() {
            var self = this;
            this.listTable = new Table({
                selector: "#trade_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "none",
                events: {
                    onRowClick: function(data) {

                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
        },
        loadData:function(){
        	var self = this;
            var pageDisplay = self.display;
            var nowDate = new Date();
            var start = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 00:00:00")).getTime() / 1000;
            var end = (new Date(nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate() + " 23:59:59")).getTime() / 1000;
            
            var assetId = self.assetId;
        	cloud.util.mask("#trade_list_table");
            Service.getTradeList(0, pageDisplay, assetId, start, end, 1,function(data) {
                var total = data.total;
                this.totalCount = data.result.length;
                data.total = total;
                self.listTable.render(data.result);
                
                self._renderpage(data, 1);
                cloud.util.unmask("#trade_list_table");
            });
        	
        	
        },
        getFaultDetail:function(data){
        	
        	var display = "";
            if (data) {
               if(data == "90011"){
              	   display = "驱动板故障";
               }else if(data == "90012"){
              	   display = "系统时钟故障";
               }else if(data == "90013"){
              	   display = "左室传感器故障";
               }else if(data == "90014"){
              	   display = "右室传感器故障";
               }else if(data == "90015"){
              	   display = "红外模块故障";
               }else if(data == "90016"){
              	   display = "读卡器故障";
               }else if(data == "90021"){
              	   display = "连接故障";
               }else if(data == "90022"){
              	   display = "纸币器驱动马达故障";
               }else if(data == "90023"){
              	   display = "纸币器钱箱被移除";
               }else if(data == "90024"){
              	   display = "纸币器钱箱已满";
               }else if(data == "90025"){
              	   display = "纸币器rom校验错误";
               }else if(data == "90026"){
              	   display = "纸币器传感器故障";
               }else if(data == "90027"){
              	   display = "纸币器堵塞";
               }else if(data == "90028"){
            	   display = "纸币器停用";
               }else if(data == "90031"){
              	   display = "硬币器连接故障";
               }else if(data == "90032"){
              	   display = "硬币器工作电压低";
               }else if(data == "90033"){
              	   display = "硬币器传感器故障";
               }else if(data == "90034"){
              	   display = "硬币器ROM校验错误";
               }else if(data == "90035"){
              	   display = "硬币器接收堵塞";
               }else if(data == "90036"){
              	   display = "硬币器支出堵塞";
               }else if(data == "90037"){
              	   display = "5角缺币";
               }else if(data == "90038"){
              	   display = "1元缺币";
               }else if(data == "90039"){
              	   display = "硬币器异常移除";
               }else if(data == "900311"){
              	   display = "硬币器停用";
               }else if(data == "90041"){
              	   display = "扩展柜1通讯故障";
               }else if(data == "90042"){
              	   display = "扩展柜2通讯故障";
               }else if(data == "90043"){
              	   display = "扩展柜3通讯故障";
               }else if(data == "90044"){
              	   display = "扩展柜4通讯故障";
               }else if(data == "90045"){
              	   display = "扩展柜5通讯故障";
               }else if(data == "90046"){
              	   display = "扩展柜6通讯故障";
               }else if(data == "90047"){
              	   display = "扩展柜7通讯故障";
               }else if(data == "90048"){
              	   display = "扩展柜8通讯故障";
               }
            } else {
                display = '';
            }
            return display;
        	
        	
        },
        renderShelfContent:function(data){
        	var self = this;
        	var assetId = data.result.assetId;
        	var siteName = data.result.siteName;
        	var shelvesState_main = [];
        	self.getSite(siteName);
        	$(".detail-content").empty();
        	$(".detail-content").append("<div style='width:94.5%;height: 20px;margin-top: 5px;background-color: #ddd;'><span style='    display: inline-block;line-height: 20px;margin-left: 10px;'>"+assetId+"</span></div>");
        	
        	$(".detail-content").append("<div id='shelfcontent' style='width:94.5%;'></div>");
        	
        	if (data.result.goodsConfigs) {
                self.cid = assetId;
                if(data.result.vendingState){
                	if(data.result.vendingState.shelvesState){//售货机货道状态
                		var shelvesState = data.result.vendingState.shelvesState;
                		if(shelvesState && shelvesState.length>0){
            				for(var i=0;i<shelvesState.length;i++){
            					if(shelvesState[i].cid == assetId){//主柜
            						var soldoutTime = "";
            						if(shelvesState[i].state == 1){
            							soldoutTime = shelvesState[i].soldoutTime;
            						}
            						var config={
            								shelvesId:shelvesState[i].shelvesId,
            								state:shelvesState[i].state,
            								soldoutTime:soldoutTime
            						};
            						shelvesState_main.push(config);
            					}
            				}
            			}
                		self.showAndInitRoads(data.result.goodsConfigs,shelvesState_main);
                	}else{
                		self.showAndInitRoads(data.result.goodsConfigs,null);
                	}
                }else{
                	self.showAndInitRoads(data.result.goodsConfigs,null);
                }
                
            }
        	
        	if (data.result.containers) {//货柜
        		
        		var containerGoodsConfig = data.result.containers;
        		if(containerGoodsConfig && containerGoodsConfig.length > 0){
        			for(var j =0;j<containerGoodsConfig.length;j++){
        				var shelves = containerGoodsConfig[j].shelves;//货柜货道配置
        				var cid = containerGoodsConfig[j].cid;
        				self.cid = cid;
        				$("#shelfcontent").append("<div style='height: 20px;margin-top: 5px;background-color: #ddd;'><span style='    display: inline-block;line-height: 20px;margin-left: 10px;'>"+cid+"</span></div>");
        				
        				if(data.result.vendingState){
        					if(data.result.vendingState.shelvesState){//售货机货道状态
        						var shelvesState = data.result.vendingState.shelvesState;
                				if(shelvesState && shelvesState.length>0){
        							for(var k=0;k<shelvesState.length;k++){
        								if(shelvesState[k].cid == cid){//辅柜
        									var soldoutTime = "";
                    						if(shelvesState[k].state == 1){
                    							soldoutTime = shelvesState[k].soldoutTime;
                    						}
                    						var config={
                    								shelvesId:shelvesState[k].shelvesId,
                    								state:shelvesState[k].state,
                    								soldoutTime:soldoutTime
                    						};
        									
        									self.shelvesState_container.push(config);
        								}
        							}
        						}
                				
                				self.showAndInitRoads(shelves,self.shelvesState_container);
        					}else{
        						self.showAndInitRoads(shelves,null);
        					}
        					
        				}else{
        					self.showAndInitRoads(shelves,null);
        				}
        				
        			}
        			
        		}

            }
        	
        	
        	
        },
     // 初始化货道个数
        showAndInitRoads: function(saveGoodsConfig,shelvesState_main) {
            var self = this;

            self.showRoads(saveGoodsConfig);
            if (saveGoodsConfig && saveGoodsConfig != null) {
                self.initRoadWindowImage(saveGoodsConfig,shelvesState_main);
            }
            cloud.util.unmask(".detail-content");
        },
        //根据机型信息绘制货道个数
        showRoads: function(data) {
            var self = this;
            var cid = self.cid;
            cloud.util.mask(".detail-content");
            var row = 0;
            var roadInfoHtml = "<table id='"+cid+"_road_table' style='width:100%;margin-top: 5px; border-collapse: inherit;'>";
            for (var i = 0; i < data.length; i++) {
                if(data[i]!=null){
                    if (i % 6 == 0) {
                        row = row + 1;
                        roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:80px'>";
                    }
                    
                    var height = "60px;";
                    if(!data[i].img){
                    	height = "80px;";
                    }
                    roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;padding-right: 5px;padding-top:5px'>" +
                            "<table style='width:100%;border-collapse: inherit;'>" +
                            "<tr style='height:"+height+";width:100%'><td id='" + cid+"_"+data[i].location_id + "' class='edge_road_td_image' style='font-size:20px;'></td></tr>" +
                            "<tr style='height:12px;width:100%;text-align:left;font-size:8px;background-color: #666666;color: white;'  id='" + cid+"_"+data[i].location_id + "_capacity'><td><span  style='font-size:8px;' id='" + cid+"_"+data[i].location_id + "_capacity_content'>&nbsp;" + "</span></td></tr>" +
                            "<tr style='width:100%;text-align:right;font-size:8px;background-color: #666666;color: white;' id='" + cid+"_"+data[i].location_id + "_goods_price'><td><span style='font-size:8px;' id='" + cid+"_"+data[i].location_id + "_price_content'>&nbsp;" + "</span></td></tr>" +
                            "</table>" +
                            "</td>";
                    
                    if (i % 6 == 6) {
                        roadInfoHtml = roadInfoHtml + "</tr>";
                    }
                    
                } 
            }
            $("#shelfcontent").append(roadInfoHtml);

            $("#"+cid+"_road_table").css({"height":"auto"});
        },
        fotmatDate:function(time){
        	var date = new Date(time);
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
			var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours()) + ':';
			var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
			var s = (date.getSeconds() < 10 ? '0' +date.getSeconds():date.getSeconds()) ; 
			var stime = Y+M+D+h+m+s;
			return stime;
        	
        },
        //根据货道配置填充货道
        initRoadWindowImage: function(data,shelvesState_main) {
            var self = this;
            var cid = self.cid;
            if (data == null || data.length == 0) {
                cloud.util.unmask(".detail-content");
            } else {
                $.each(data, function(n, item) {
                    if (item != null) {
                        var imagepath = item.img;
                        var imageMd5 = item.imagemd5;

                        var goodsConfig = {
                            "location_id": item.location_id,
                            "button_id": item.location_id,
                            "goods_id": item.goods_id,
                            "goods_name": item.goods_name,
                            "goods_type": item.goods_type,
                            "goods_typeName": item.goods_typeName,
                            "price": item.price,
                            "img": item.img,
                            "payment_url": item.payment_url,
                            "alipay_url": item.alipay_url,
                            "imagemd5": item.imagemd5
                        };

                        if (imagepath) {
                            var src = cloud.config.FILE_SERVER_URL + "/api/file/" + imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
                            $("#" + cid+"_"+item.location_id).html("<div style='width: 20px;height: 12px;font-size: 12px;margin-left: 5px;'>" + item.location_id + "</div><img src='" + src + "' style='height:60px;'/>");
                            var $span = '<span id='+cid+'_'+item.location_id+'_span class="mask-wrapper">'+
							                '<span class="img-mask">'+
							                  '<span class="mask-bg"></span>'+
							                  '<span class="mask-monitor-img"></span>'+
							                '</span>'+
							              '</span>'	
                            $("#" + cid+"_"+item.location_id).append($span);
                            $("#" + cid+"_"+item.location_id).append("<input type='hidden' id='imagemd5'/>");
                            $("#imagemd5").val(imageMd5);
                            //添加点击标记
                            var correct = '<span id="'+cid+'_'+item.location_id+'_qrcode" class="mask-qrimg" style="display:none;"></span>';
                            $("#" + cid+"_"+item.location_id).append(correct);
                        } else {
                            $("#" + cid+"_"+item.location_id).html("<div style='width: 20px;height: 10px;font-size: 12px;margin-left: 5px;margin-top: -51%;'>" + item.location_id + "</div>");
                        }
                        
                        if (item.capacity) {
                            $("#" + cid+"_"+item.location_id + "_capacity_content").html(item.capacity);
                        }

                        if (item.price) {
                            $("#" + cid+"_"+item.location_id + "_price_content").html(item.price/100 + locale.get({lang: "china_yuan"}));
                        }
                        if(shelvesState_main && shelvesState_main.length>0){
                        	for(var j = 0; j < shelvesState_main.length; j++){
                        		if(shelvesState_main[j].shelvesId == item.location_id && shelvesState_main[j].state == 1){
                        			$("#" + cid+"_"+item.location_id + "_span").show();
                        			
                        			var soldouttime = shelvesState_main[j].soldoutTime;
                        			
                        			if(soldouttime != "" && soldouttime != undefined && soldouttime != null){
                        				var time = self.fotmatDate(soldouttime*1000);
                            			$("#" + cid+"_"+item.location_id + "_goods_price").remove();
                            			$("#" + cid+"_"+item.location_id + "_capacity").find("td").addClass("soldouttd");
                            			$("#" + cid+"_"+item.location_id + "_capacity_content").html(time);
                        			}
                        			
                        		
                        		}else if(shelvesState_main[j].shelvesId == item.location_id && shelvesState_main[j].state != 1){
                        			$("#" + cid+"_"+item.location_id + "_span").hide();
                        		}
                        	}
                        }
                        
                        
                        $("#" + cid+"_"+item.location_id).bind('click',{location_id:item.location_id},function(e){
                        	var dis = $("#"+e.data.location_id+"_qrcode").css("display");
                        	if(dis == "none"){
                        		$("#"+cid+"_"+e.data.location_id+"_qrcode").css("display","block");
                        	}else{
                        		$("#"+cid+"_"+e.data.location_id+"_qrcode").css("display","none");
                        	}
                        	
                        	
                        });
                        
                    }
                    if (n == data.length - 1) {
                        cloud.util.unmask(".detail-content");
                    }
                });
            }
        }
        
    });
    return gis;
});