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
    var gmap = require("../../../vendingMachine/map/map");
    require("async!http://maps.google.cn/maps/api/js?v=3&sensor=false");
    require("./css/default.css");
    require("./js/scrollable");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            this.data = null;
            locale.render({element: this.element});
            var boxHtml = "<form class='marker-info-wrapper' id='info-wrapper'>" +
                    "<div class='marker-info-header' id='info-sysid-name' align='center'>" +
                    "</div>" +
                    "<div class='info-tag-panel'>" + locale.get({lang: "my_location"}) + "</div>" +
                    "<div class='info-form' >" +
                    "<div class='marker-info-form-row'>" +
                    "<span id='info-serial-deviceType' class='marker-info-form-span'>" + locale.get({lang: "please_wait_a_moment"}) + "</span>" +
                    "</div>" +
                    "</div>" +
                    "</form>";

            this.bubble = new gmap.Bubble({
                content: $(boxHtml),
                maxWidth: 800
            });
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
            this._renderMap();//加载点位地图
        },
        getLine:function(){
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
                 		
                 	//self.loadSiteData(this.map);
                 		
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
                                    $("#userline").append("<option value='" + lineData.result[i].id + "'>" + lineData.result[i].lineName + "</option>");
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
                self.getLine();
                Service.getSiteById(self.id, function(data) {
                    self.data = data;
                    $("#line option[value='"+data.result.lineId+"']").attr("selected","selected");
                    $("#siteName").attr("value", data.result.name == null ? "" : data.result.name);//点位名称
                    $("#siteId").attr("value", data.result.siteId == null ? "" : data.result.siteId);//点位ID
                    $("#cost").attr("value", data.result.cost == null ? "" : data.result.cost);//成本
                    $("#talkTime").val(data.result.talkTime == null ? "" : cloud.util.dateFormat(new Date(data.result.talkTime), "yyyy-MM-dd"));//谈成时间
                    $("#type").attr("value", data.result.type == null ? "" : data.result.type);//线路
                    $("#industry").attr("value", data.result.industry == null ? "" : data.result.industry);//行业
                    $("#loc").attr("value", data.result.address == null ? "" : data.result.address);//地理位置
                    $("#lng").val(data.result.location.longitude);
                    $("#lat").val(data.result.location.latitude);
                    $("#siteId").attr("disabled", true);
                    var lineId = data.result.lineId;
                    var lineName = data.result.lineName;
                   /* Service.getUserMessage(function(data) {
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
                                            $("#userline").append("<option value='" + lineData.result[i].id + "'>" + lineData.result[i].lineName + "</option>");
                                        }
                                    }
                                    $("#userline").val(lineId);
                                });
                            } else {
                                $("#line").show();
                                $("#userline").hide();
                                $("#line").val(lineName);
                            }
                        }
                    });*/
                    var lng = $("#lng").val();
                    var lat = $("#lat").val();
                    if (lng != "" && lat != "") {
                        var icon = "../images/green.png";
                        if (self.marker) {
                            self.marker.destroy();
                        }
                        var cp = {
                            lat: lat,
                            lon: lng
                        };
                        self.map.setCenter(cp);
                        self.map.setZoom(15);
                        self.marker = self.map.addMarker({
                            position: new gmap.LonLat(lng, lat),
                            title: "",
                            draggable: true, //控制是否可拖动
                            icon: require.toUrl(icon), //自定义的一个图片
                            visible: true
                        });
                        self.bubble.open(self.map, self.marker);
                        $("#info-serial-deviceType").text(data.result.address);
                    }
                    cloud.util.unmask("#siteForm");
                }, self);
            } else {
            	$("#line").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	self.getLine();
               // self.getUserRole();
            	$("#talkTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));//谈成时间
                var lng = 116.404;
                var lat = 39.915;
                var icon = "../images/green.png";
                if (self.marker) {
                    self.marker.destroy();
                }
                var cp = {
                    lat: lat,
                    lon: lng
                };
                self.map.setCenter(cp);
                self.map.setZoom(15);
                self.marker = self.map.addMarker({
                    position: new gmap.LonLat(lng, lat),
                    title: "",
                    draggable: true, //控制是否可拖动
                    icon: require.toUrl(icon), //自定义的一个图片
                    visible: true
                });
               // self.bubble.open(self.map, self.marker);
            }
        },
        _renderMap: function() {
            var self = this;
            this.map = new gmap.Map({
                selector: this.element.find("#container")
            });

            //移动地图 时将定位到当前视野的中心点
            this.map.addListener("dragend", function(event) {
                var cp = self.map.getCenter();

                $("#lng").val(cp.lon);
                $("#lat").val(cp.lat);
                var events = {};
                events.lonLat = {
                    lat: cp.lat,
                    lon: cp.lon
                };

                self.map.setCenter(cp);
                var icon = "../images/green.png";
                if (self.marker) {
                    self.marker.destroy();
                }
                self.marker = self.map.addMarker({
                    position: new gmap.LonLat(cp.lon, cp.lat),
                    title: "测试",
                    draggable: true, //控制是否可拖动
                    icon: require.toUrl(icon), //自定义的一个图片
                    visible: true
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
            this.loadSiteData(this.map);//获取该售货机的基本信息
        },
        getAddressBylonlat: function(event) {//根据经纬度获取地址信息
            var self = this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({location: new google.maps.LatLng(event.lonLat.lat, event.lonLat.lon)}, function geoResults(result, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var pos = "";
                    pos = result[0].formatted_address;
                    $("#loc").val(pos);

                    self.bubble.open(self.map, self.marker);
                    $("#info-serial-deviceType").text(pos);
                } else {

                }
            });
        },
        _renderBtn: function(map) {
            var self = this;
            //获取点位输入框事件并定位
            $('#loc').bind('input propertychange', function() {
                var inpuValue = $("#loc").val();
                $("#resultDiv").css("display", "block");
                Service.getAllPlaceGoogle(inpuValue, function(data) {
                    var datas = eval('(' + data + ')');
                    $("#results").empty();
                    if (datas && datas.predictions) {
                        if (datas.predictions.length > 0) {
                            for (var i = 0; i < datas.predictions.length; i++) {
                                if (i < 10) {
                                    var name = datas.predictions[i].description;

                                    var msg = "<li  style='cursor: pointer;' lat='' lng=''>" + name + "</li>";
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
                                $("#loc").val(text);
                                Service.getlatlonByAddress(text, function(data) {
                                    var newdata = eval('(' + data + ')');
                                    if (newdata && newdata.results[0]) {
                                        var location = newdata.results[0].geometry.location;

                                        var lat = "";
                                        var lng = "";
                                        if (location) {
                                            lat = location.lat;
                                            lng = location.lng;
                                        }
                                        if (lng && lat) {
                                            $("#lng").val(lng);
                                            $("#lat").val(lat);
                                            var icon = "../images/green.png";
                                            if (self.marker) {
                                                self.marker.destroy();
                                            }
                                            var cp = {
                                                lat: lat,
                                                lon: lng
                                            };
                                            self.map.setCenter(cp);
                                            self.map.setZoom(15);
                                            self.marker = map.addMarker({
                                                position: new gmap.LonLat(lng, lat),
                                                title: "",
                                                draggable: true, //控制是否可拖动
                                                icon: require.toUrl(icon), //自定义的一个图片
                                                visible: true
                                            });
                                        }

                                    }
                                });
                            });
                        }
                    } else {
                        var msg = "<li  style='cursor: pointer;' lat='' lng=''>" + locale.get({lang: "no_points"}) + "</li>";
                        $("#results").append(msg);
                    }
                });

            });
            $("#cancelBase").bind("click", function() {
                self.automatWindow.destroy();
            });

            //修改
            $("#saveBase").bind("click", function() {
                //修改售货机基本信息
                var flag = true;
                self.renderUpdateMachine(flag);
            });
            $("#talkTime").datetimepicker({
                format: 'Y-m-d',
                step: 1,
                lang: locale.current() === 1 ? "en" : "ch"
            });
        },
        renderUpdateMachine: function(flag) {
            var self = this;
            Service.getUserMessage(function(data) {
                var siteId = $("#siteId").val();//点位编号
                var siteName = $("#siteName").val();//点位名称
                var loc = $("#loc").val();//地理位置 
                var cost = $("#cost").val();//成本
                var talkTime = $("#talkTime").val();//谈成时间  
                var lineName = $("#line").find("option:selected").text();
                var lineId = $("#line").find("option:selected").val();
                var type = $("#type").val();//类型
                var industry = $("#industry").val();//行业
                var lng = $("#lng").val();//经度
                var lat = $("#lat").val();//纬度

                /*if (data.result) {
                    var roleName = data.result.roleName;
                    if (roleName == "DeviceSense") {//采购员身份
                        lineId = $("#userline").val();
                        lineName = $("#userline").find("option:selected").text();
                    } else {
                        lineName = $("#line").val();
                        //添加线路 
                        var lineData = {};
                        lineData.name = lineName;
                        Service.addLine(lineData, function(data) {
                            if (data && data.result && data.result._id) {
                                $("#lineId").val(data.result._id);
                            }
                        });
                        lineId = $("#lineId").val();
                    }
                }*/
                if (siteId == null || siteId == "") {
                    dialog.render({lang: "automat_enter_the_point_number"});
                    return;
                }
                if (siteName == null || siteName == "") {
                    dialog.render({lang: "automat_enter_name"});
                    return;
                }
                if (lineName == null || lineName == "" || lineName == locale.get({lang: "please_select"})) {
                    dialog.render({lang: "automat_enter_lineName"});
                    return;
                }
                if (loc == null || loc == "") {
                    dialog.render({lang: "automat_enter_address"});
                    return;
                }
                if (lng == null || lng == "" || lat == null || lat == "") {
                    dialog.render({lang: "points_not_null"});
                    return;
                }

                //添加点位
                var location = {};
                location.longitude = lng;
                location.latitude = lat;
                location.region = "";
                var data = {
                    siteId: siteId, //点位编号
                    name: siteName, //点位名称
                    location: location, //坐标
                    lineId: lineId, //线路ID
                    lineName: lineName, //线路名称
                    cost: cost, //成本
                    type: type, //类型
                    industry: industry, //行业
                    talkTime: new Date(talkTime).getTime() / 1000, //谈成时间
                    address: loc//地理位置
                };


                //判断点位名称是否发生变化
                if (self.id && self.id != "") {//存在点位编号 更新
                    self.renderUpdate(flag, self.id, data);
                } else {//不存在点位  新增
                    Service.addSite(data, function(retData) {
                        if (retData.error_code && retData.error_code == "20007") {//点位编号已存在
                            dialog.render({lang: "automat_point_number_exists"});
                        } else if (retData.error_code && retData.error_code == "21322") {//点位名称已存在
                            dialog.render({lang: "automat_site_name_exists"});
                        } else if (!retData.error_code) {
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
                    } else if (data.error_code == "21322") {
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