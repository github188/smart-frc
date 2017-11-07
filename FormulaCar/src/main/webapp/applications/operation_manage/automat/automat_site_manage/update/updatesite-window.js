define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateSite.html");
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
            $("#cancelBase").val(locale.get({lang: "cancel"}));
            $("#line").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            this._renderMap();//加载点位地图

        },
        loadModule:function(){
        	var self = this;
        	Service.getAllModel(-1,0,'',function(data) {
         		if(data.result){
         			require(["cloud/lib/plugin/jquery.multiselect"], function() {
                        $("#modules").multiselect({
                            header: true,
                            checkAllText: locale.get({lang: "check_all"}),
                            uncheckAllText: locale.get({lang: "uncheck_all"}),
                            noneSelectedText: "机型",
                            selectedText: "# " + locale.get({lang: "is_selected"}),
                            minWidth: 170,
                            height: 120
                        });
                    });
 					for(var i=0;i<data.result.length;i++){
 						$("#modules").append("<option value='" +data.result[i]._id + "'>" +data.result[i].moduleNum+"</option>");
 					}
 				}
         	});
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
                    $("#line").find("option[value='"+data.result.dealerId+"']").attr("selected",true);
                    $("#name").attr("value", data.result.name == null ? "" : data.result.name);//点位名称
                    $("#siteNum").attr("value", data.result.siteNum == null ? "" : data.result.siteNum);//点位ID
                    $("#cost").attr("value", data.result.price == null ? "" : data.result.price);//成本
                    $("#talkTime").val(data.result.startTime == null ? cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd") : cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd"));//谈成时间
                    $("#industry").attr("value", data.result.siteType == null ? "" : data.result.siteType);//行业
                    $("#loc").attr("value", data.result.location == null ? "" : data.result.location.region);//地理位置
                    $("#lng").val(data.result.location.longitude);
                    $("#lat").val(data.result.location.latitude);
                    $("#desc").attr("value", data.result.desc == null ? "" : data.result.desc);
                    
                    var modules = data.result.modules;
                    
                    Service.getAllModel(-1,0,'',function(datas) {
                 		if(datas.result){
                 			require(["cloud/lib/plugin/jquery.multiselect"], function() {
                                $("#modules").multiselect({
                                    header: true,
                                    checkAllText: locale.get({lang: "check_all"}),
                                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                                    noneSelectedText: "机型",
                                    selectedText: "# " + locale.get({lang: "is_selected"}),
                                    minWidth: 170,
                                    height: 120
                                });
                            });
         					for(var i=0;i<datas.result.length;i++){
         						$("#modules").append("<option value='" +datas.result[i]._id + "'>" +datas.result[i].moduleNum+"</option>");
         					}
         					if (modules && modules.length > 0) {
                                for (var i = 0; i < modules.length; i++) {
                                    $('#modules option').each(function() {
                                        if (modules[i].moduleId == this.value) {
                                            this.selected = true;
                                        }
                                    });
                                }
                            }
         				}
                 	});
                    
                    var lng = $("#lng").val();
                    var lat = $("#lat").val();
                    var location = data.result.location;
                    var address = data.result.location.region
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
            	$("#siteNum").attr("value",time);//点位ID
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
                
                $("#resultDiv").css("display", "none");

                self.getCenter(map, cp, '');

                marker.enableDragging();  //可拖拽
                //标注拖拽后的位置
                marker.addEventListener("dragend", function(e) {
                    $("#lng").val(e.point.lng);
                    $("#lat").val(e.point.lat);
                    self.getCenter(map, e.point, '');
                    $("#resultDiv").css("display", "none");
                });
            });
            if(this.id){
            }else{
            	this.loadModule();
            }
            
            this._renderBtn(map);//各个按钮事件
            this.getLine(map);
        },
        _renderBtn: function(map) {
            var self = this;
            $('#loc').bind('input propertychange', function() {
            	map.clearOverlays(); //清除
                var inpuValue = $("#loc").val();
                $("#resultDiv").css("display", "block");
                Service.getAllPlace(inpuValue, function(data) {
                    $("#results").empty();
                    var newData = eval('(' + data + ')');
                    if (newData.result.length > 0) {
                        for (var i = 0; i < newData.result.length; i++) {
                            if (i < 10) {
                                var name = newData.result[i].name;
                                var location = newData.result[i].location;
                                var lat = "";
                                var lng = "";
                                var msg = "";
                                if (location) {
                                    lat = location.lat;
                                    lng = location.lng;
                                }
                                if (lat && lng) {
                                    msg = "<li  style='cursor: pointer;' lat=" + lat + " lng=" + lng + ">" + name + "</li>";
                                } else {
                                    msg = "<li  style='cursor: pointer;' lat='' lng=''>" + name + "</li>";
                                }
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
                            var lat = $(this).context.attributes[1].value;//纬度
                            var lng = $(this).context.attributes[2].value;//经度
                            $("#loc").val(text);
                            if (lng && lat) {
                                $("#lng").val(lng);
                                $("#lat").val(lat);
                                map.centerAndZoom(new BMap.Point(lng, lat), 16); //设置中心点
                                map.clearOverlays(); //清除
                                var new_point = new BMap.Point(lng, lat);
                                self.getCenter(map, new_point, text);
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
                        });
                    } else {
                        var msg = "<li  style='cursor: pointer;' lat='' lng=''>" + locale.get({lang: "no_points"}) + "</li>";
                        $("#results").append(msg);
                        $("#lng").val("");
                        $("#lat").val("");
                    }
                });

            });
            //取消
            $("#cancelBase").bind("click", function() {
                self.automatWindow.destroy();
            });

            //修改
            $("#saveBase").bind("click", function() {
                //修改点位信息
                var flag = true;
                self.renderUpdateSite(flag);
            });
            $("#talkTime").datetimepicker({
                format: 'Y-m-d',
                step: 1,
                lang: locale.current() === 1 ? "en" : "ch"
            });
        },
        renderUpdateSite: function(flag) {
            var self = this;

            Service.getUserMessage(function(data) {
                var siteNum = $("#siteNum").val();//点位编号
                var name = $("#name").val();//点位名称
                var loc = $("#loc").val();//地理位置 
                var price = $("#cost").val();//成本
                var startTime = $("#talkTime").val();//谈成时间  
                
                var dealerName = $("#line").find("option:selected").text();
                var dealerId = $("#line").find("option:selected").val();
                
                var siteType = $("#industry").val();//行业
                
                var lng = $("#lng").val();//经度
                var lat = $("#lat").val();//纬度
                var desc = $("#desc").val();
                
                var modules = $("#modules").multiselect("getChecked").map(function() {
                    var pay = {
                    		moduleId: this.value,
                    		moduleName: this.title
                    };
                    return pay;
                }).get();
                
                if (siteNum == null || siteNum.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "automat_enter_the_point_number"});
                    return;
                }
                if (name == null || name.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "automat_enter_name"});
                    return;
                }
                if (name == null || name.replace(/(^\s*)|(\s*$)/g,"")=="" || name == locale.get({lang: "please_select"})) {
                    dialog.render({lang: "automat_enter_lineName"});
                    return;
                }
                if (loc == null || loc.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "automat_enter_address"});
                    return;
                }
                if (lng == null || lng.replace(/(^\s*)|(\s*$)/g,"")=="" || lat == null || lat.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "points_not_null"});
                    return;
                } 
                var strP=/^\d+(\.\d+)?$/; 
                if(price){
                	if(!strP.test(price)){
          	    	    dialog.render({text:"成本必须是数字"});
          	    	    return; 
          	        }
                }
      	        
                //添加点位
 
                var location = {};
                location.longitude = lng;
                location.latitude = lat;
                location.region = loc;
                
                var data = {
                	siteNum: siteNum, //点位编号
                    name: name, //点位名称
                    location: location, //坐标
                    dealerId: dealerId, //线路ID
                    dealerName: dealerName, //线路名称
                    price: price, //成本
                    modules: modules, //类型
                    siteType: siteType, //行业
                    startTime: new Date(startTime).getTime() / 1000, //谈成时间
                    desc:desc
                };

                //判断点位是否存在
                if (self.id && self.id != "") {//存在点位编号 更新
                    self.renderUpdate(flag, self.id, data);
                } else {//不存在点位  新增
                    Service.addSite(data, function(retData) { 
                        if (retData.error_code && retData.error_code == 70002) {//点位编号已存在
                            dialog.render({lang: "automat_point_number_exists"});
                        } else if (retData.error_code && retData.error_code == 70045) {//点位名称已存在
                            dialog.render({lang: "automat_site_name_exists"});
                        } 
                        else if (!retData.error_code) {
                            self.automatWindow.destroy();
                            self.fire("getsiteList");
                            dialog.render({lang: "save_success"});
                        }
                    });
                }
            });

        },
        renderUpdate: function(flag, id, contentData) {
            var self = this;
            if (flag) {//点击“保存"按钮
                cloud.util.mask("#baseInfo");
                Service.updateSite(contentData, id, function(data) {
                    if (data.error_code == null) {
                        self.automatWindow.destroy();
                        self.fire("getsiteList");
                        dialog.render({lang: "automat_goods_model_update_success"});
                    }else if (data.error_code && data.error_code == 70001) {//点位编号已存在
                        dialog.render({lang: "automat_point_number_exists"});
                    }  
                    else if (data.error_code == 70045) {
                        dialog.render({lang: "automat_site_name_exists"});
                        return;
                    }
                    cloud.util.unmask("#baseInfo");
                });
            } else {
                self.automatWindow.destroy();
            }
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