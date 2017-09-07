define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateDevice.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
    require("../add/css/default.css");
    require("../add/js/scrollable");
    var SelfConfigInfo = require("../selfConfig/selfConfig");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.deviceId = options.deviceId;
            this._renderWindow();
            this.data = null;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: locale.get({lang: "update_device"}),
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
            $("#selfConfig").css("display", "none");
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this._renderMap();//加载点位地图
            this.renderSecondSelfConfig();
        },
        loadDeviceData: function(map) {
            var self = this;
            cloud.util.mask("#deviceForm");
            Service.getAutomatById(self.deviceId, function(data) {
                self.data = data;
                $("#suggestId").attr("value", data.result.siteName == null ? "" : data.result.siteName);//点位名称
                $("#siteName").attr("value", data.result.siteName == null ? "" : data.result.siteName);//点位名称
                $("#siteId").attr("value", data.result.siteId == null ? "" : data.result.siteId);//点位ID

                $("#deviceName").attr("value", data.result.name == null ? "" : data.result.name);//售货机名称
                $("#assetId").val(data.result.assetId == null ? "" : data.result.assetId);//售货机编号
                $("#automat_model option[text='" + data.result.modelName + "']").attr("selected", "selected");
                $("#automat_model option:selected").attr("text", data.result.modelName);
                //$("#selectModels").val(data.result.modelId);

                if (data.result.goodsConfigs) {
                    self.goodsConfigs = data.result.goodsConfigs;
                    self.SelfConfig.saveGoodsConfig = data.result.goodsConfigs;
                }

                self.getModelData(data.result.modelName);
                //从现场列表中获取经纬度
                Service.getSiteByName(data.result.siteName, function(data) {
                    if (data.result.location) {
                        $("#lng").val(data.result.location.longitude);
                        $("#lat").val(data.result.location.latitude);
                        map.clearOverlays(); //清除
                        var new_point = new BMap.Point(data.result.location.longitude, data.result.location.latitude);
                        self.getCenter(map, new_point, data.result.name);
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
                    cloud.util.unmask("#deviceForm");
                });
            }, self);
        },
        renderSecondSelfConfig: function() {
            var self = this;
            this.SelfConfig = new SelfConfigInfo({
                selector: "#selfConfigInfo",
                automatWindow: self.automatWindow,
                events: {
                    "rendTableData": function() {
                        self.fire("getDeviceList");
                    }
                }
            });
        },
        getModelData: function(name) {
            var self = this;
            Service.getModelInfo(0, 500, function(data) {
                if (data.result && data.result.length > 0) {
                    $.each(data.result, function(n, item) {
                        if (name == item.name) {
                            $("#automat_model").append("<option value='" + item._id + "_" + item.roadNumber + "' selected='selected'>" + item.name + "</option>");
                            $("#selectModels").val(item._id + "_" + item.roadNumber);
                        } else {
                            $("#automat_model").append("<option value='" + item._id + "_" + item.roadNumber + "'>" + item.name + "</option>");
                        }
                    });
                }
            }, self);
        },
        getCenter: function(map, cp, text) {
            var geoc = new BMap.Geocoder();
            var suggestId = $("#suggestId").val();
            geoc.getLocation(cp, function(rs) {
                var addComp = rs.addressComponents;
                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (text) {
                    address = text;
                }
                //console.log(" getLocation  ... ",suggestId);
                if(suggestId==null || suggestId == ""){
                    $("#suggestId").val(address);
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
        _renderMap: function() {
            var self = this;
            var map = new BMap.Map("container");          // 创建地图实例  
            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
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

            this._renderBtn(map);//各个按钮事件
            this.loadDeviceData(map);//获取该售货机的基本信息
        },
        _renderBtn: function(map) {
            var self = this;
            //获取点位输入框事件并定位
            $('#suggestId').bind('input propertychange', function() {
                var inpuValue = $("#suggestId").val();
                $("#resultDiv").css("display", "block");
                 //console.log("inpuValue  ... ",inpuValue);
                Service.getAllPlace(inpuValue, function(data) {
                    $("#results").empty();
                    var newData = eval('(' + data + ')');
                    //console.log(" getplacce  ... ",newData);
                    if (newData.result.length > 0) {
                        //console.log("if  ... ",newData.result);
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
                            $("#suggestId").val(text);
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
                    }else{
                        //console.log("else  ... ",newData.result);
                        var msg = "<li  style='cursor: pointer;' lat='' lng=''>" + locale.get({lang: "no_points"}) + "</li>";
                        $("#results").append(msg);
                    }
                    //console.log("newData  ... ");
                });

            });
            //下一步
            $("#nextBase").bind("click", function() {

                self.SelfConfig.showAndInitRoads();
                //修改售货机基本信息
                self.renderUpdateMachine(false);
            });

            //修改
            $("#saveBase").bind("click", function() {
                //修改售货机基本信息
                var flag = true;
                self.renderUpdateMachine(flag);
            });

            $('#automat_model').change(function() {
                $("#selectModels").val($("#automat_model option:selected").val());
            });
        },
        renderUpdateMachine: function(flag) {
            var self = this;

            var assetId = $("#assetId").val();//售货机编号
            var deviceName = $("#deviceName").val();//售货机名称
            var modelId = $("#automat_model option:selected").val();
            var modelName = $("#automat_model option:selected").text();
            var siteName = $("#suggestId").val();//点位名称
            var lng = $("#lng").val();//经度
            var lat = $("#lat").val();//纬度
            
            if (deviceName == null || deviceName == "") {
                dialog.render({lang: "automat_name_not_exists"});
                return;
            }
            if (modelId == null || modelId == "") {
                dialog.render({lang: "pleas_add_least_one_model_record"});
                return;
            }
            if (siteName == null || siteName == "") {
                dialog.render({lang: "automat_enter_name"});
                return;
            }
            if (lng == null || lng == "" || lat == null || lat == "") {
                dialog.render({lang: "points_not_null"});
                return;
            } 
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
            if (siteName == siteName_old) {//未发生改变
                self.renderUpdate(flag, deviceName, modelId, modelName, siteId, siteName, assetId);
            } else {//发生改变
                Service.addSite(data, function(retData) {
                    if (retData.error_code && retData.error_code == "21322") {//点位名称已存在
                        Service.getSiteByNameFormDeviceList(siteName, function(data) {
                            if (data && data.result != null) {//该点位已挂售货机
                                dialog.render({lang: "automat_site_name_exists"});
                                return;
                            } else {//该点位没有挂售货机
                                self.renderUpdate(flag, deviceName, modelId, modelName, siteId, siteName, assetId);
                            }
                        });
                    } else if (!retData.error_code) {
                        self.renderUpdate(flag, deviceName, modelId, modelName, siteId, siteName, assetId);
                    }
                });
            }


        },
        renderUpdate: function(flag, deviceName, modelId, modelName, siteId, siteName, assetId) {
            var self = this;
            if (flag) {//点击“保存"按钮
                var area = null;
                var goodsConfigs = self.goodsConfigs;
                //修改售货机
                cloud.util.mask("#baseInfo");
                Service.updateAutomat(self.deviceId, area, deviceName, modelId, modelName, siteId, siteName, assetId, goodsConfigs, false, function(data) {
                    if (data.error_code == null) {
                        self.automatWindow.destroy();
                        self.fire("getDeviceList");
                        dialog.render({lang: "automat_goods_model_update_success"});
                    } else if (data.error_code == "20007") {
                        dialog.render({lang: "automat_name_exists"});
                        return;
                    }
                    cloud.util.unmask("#baseInfo");
                });
            } else {
                $("#selfConfig").css("display", "block");
                $("#baseInfo").css("display", "none");
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