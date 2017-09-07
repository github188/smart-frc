define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeSite.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
    require("./css/default.css");
    require("./js/scrollable");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id; 
            this.name =  options.name; 
            this._renderWindow();
            this.data = null;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var self = this;
            var title = locale.get({lang: "add_site"});
            if (self.id && self.id != "") {
                title = locale.get({lang: "modify_site"});
            }
            if(this.name ){
            	title = this.name ;
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
            $("#cancelBase").val("关闭");
            $("#line").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            this._renderMap();//加载点位地图

        },
        getLine:function(map){
        	var searchData={
        		name:''	
        	};
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
                 self.lineIds = lineIds;
                 var fg = true;
                 
                 if(roleType != 51 && lineIds.length == 0){
                  	fg = false;
                 }else if(roleType != 51 && lineIds.length > 0){
                	 fg = false;
                	 for(var j=0;j<linedata.result.length;j++){
  						$("#line").append("<option value='" +linedata.result[j]._id + "'>" +linedata.result[j].name+"</option>");
  					}
                 }
                 
                 if(fg){
                	 Service.getAllLine(searchData,function(data) {
                 		if(data.result){
         					for(var i=0;i<data.result.length;i++){
         						$("#line").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");
         					}
         				}
                 		
                 		self.loadSiteData(map);
                 		
                 	});
                 }
            });
        	
        },
        getUserRole: function() {
            Service.getUserMessage(function(data) {
                if (data.result) {
                    var userId = data.result._id;
                    var userName = data.result.roleName;
                    if (userName == "DeviceSense") {//采购员身份
                        $("#line").hide();
                        $("#userline").show();
                        Service.getLineInfoByUserId(userId, function(data) {
                            var lineData = data;
                            if (lineData && lineData.result.length > 0) {
                                for (var i = 0; i < lineData.result.length; i++) {
                                    $("#line").append("<option value='" + lineData.result[i].id + "'>" + lineData.result[i].lineName + "</option>");
                                }
                            }
                        });
                    } else {
                       $("#line").show();
                       $("#userline").hide();
                    }

                }
            });
        },
        loadSiteData: function(map) {
            var self = this;
            if (self.id && self.id != "") {
                cloud.util.mask("#siteForm");
                Service.getSiteById(self.id, function(data) {
                    self.data = data;
                    $("#line").find("option[value='"+data.result.lineId+"']").attr("selected",true);
                    $("#siteName").attr("value", data.result.name == null ? "" : data.result.name);//点位名称
                    $("#siteId").attr("value", data.result.siteId == null ? "" : data.result.siteId);//点位ID
                    $("#cost").attr("value", data.result.cost == null ? "" : data.result.cost);//成本
                    $("#talkTime").val(data.result.talkTime == null ? cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd") : cloud.util.dateFormat(new Date(data.result.talkTime), "yyyy-MM-dd"));//谈成时间
                    $("#lineId_win").attr("value", data.result.lineId == null ? "" : data.result.lineId);//线路ID
                    $("#type").attr("value", data.result.type == null ? "" : data.result.type);//线路
                    $("#industry").attr("value", data.result.industry == null ? "" : data.result.industry);//行业
                    $("#loc").attr("value", data.result.address == null ? "" : data.result.address);//地理位置
                    $("#lng").val(data.result.location.longitude);
                    $("#lat").val(data.result.location.latitude);
                    $("#desc").attr("value", data.result.description == null ? "" : data.result.description);
                    var lineId = data.result.lineId;
                    var lineName = data.result.lineName;
                    var lng = $("#lng").val();
                    var lat = $("#lat").val();
                    var location = data.result.location;
                    var address = data.result.address;
                    if (lng != "" && lat != "") {
                        map.clearOverlays(); //清除
                        var new_point = new BMap.Point(location.longitude, location.latitude);
                        self.getCenter(map, new_point, address);
                        var marker = new BMap.Marker(new_point);       // 创建标注
                        map.addOverlay(marker);                        // 将标注添加到地图中
                        map.panTo(new_point);
                        marker.enableDragging();  //可拖拽
                        //标注拖拽后的位置
                        marker.addEventListener("dragend", function(e) {
                            $("#lng").val(e.point.lng);
                            $("#lat").val(e.point.lat);
                            self.getCenter(map, e.point, '');
                        });
                    }
                    cloud.util.unmask("#siteForm");
                }, self);
            } else {
            	var myDate = new Date();
            	
            	var month = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
            	month = month<10?'0'+month:month;
            	var day = myDate.getDate();        //获取当前日(1-31)
            	day = day<10?'0'+day:day;
            	
            	var time = myDate.getFullYear()+month+day+myDate.getHours()+myDate.getMinutes()+myDate.getSeconds();
            	console.log(time);
            	$("#siteId").attr("value",time);//点位ID
                $("#talkTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));//谈成时间
                //定位到当前城市
                var myCity = new BMap.LocalCity(); 
                myCity.get(function(result) {
                    var cityName = result.name; 
                    map.setCenter(cityName);
                    
                    var myGeo = new BMap.Geocoder();
                    myGeo.getPoint(cityName, function(point) {
                        if (point) {
                            map.centerAndZoom(point, 7);
                            var marker = new BMap.Marker(point);
                            self.getCenter(map, point, cityName);
                            $("#lng").val(point.lng);
                            $("#lat").val(point.lat);
                            map.addOverlay(marker);
                            marker.enableDragging();  //可拖拽
                            marker.addEventListener("dragend", function(e) {
                                $("#lng").val(e.point.lng);
                                $("#lat").val(e.point.lat);
                                self.getCenter(map, e.point, '');
                            });
                        }
                    }, cityName);
                });
            }

        },
        getCenter: function(map, cp, text) {
            var geoc = new BMap.Geocoder();
            var loc = $("#loc").val();
            geoc.getLocation(cp, function(rs) {
                var addComp = rs.addressComponents;

                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (text) {
                    address = text;
                }
                $("#loc").val(address);

                var opts = {
                    width: 200, // 信息窗口宽度
                    height: 30, // 信息窗口高度
                    title: "当前位置", // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                };
                var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象 
                map.openInfoWindow(infoWindow, cp); //开启信息窗口
            });
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


            //移动地图 时将定位到当前视野的中心点
            map.addEventListener("dragend", function showInfo() {
                var cp = map.getCenter();
                map.clearOverlays();                    //清除
                var marker = new BMap.Marker(cp);       // 创建标注
                map.addOverlay(marker);                 // 将标注添加到地图中
                $("#lng").val(cp.lng);
                $("#lat").val(cp.lat);

                self.getCenter(map, cp, '');

                marker.enableDragging();  //可拖拽
                //标注拖拽后的位置
                marker.addEventListener("dragend", function(e) {
                    $("#lng").val(e.point.lng);
                    $("#lat").val(e.point.lat);
                    self.getCenter(map, e.point, '');
                });
            });

            this._renderBtn(map);//各个按钮事件
            this.getLine(map);
        },
        _renderBtn: function(map) {
            var self = this;
            //取消
            $("#cancelBase").bind("click", function() {
                self.automatWindow.destroy();
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