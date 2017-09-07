define(function(require) {
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var service = require("./service");
     var InfoModule = require("./info");
    var monitorInfo = require("./monitorInfo")
    
//    require("../../../lib/plugins/leaflet.draw-src");
//    require("../../../lib/plugins/leaflet-Layer.Deferred");
    require("cloud/components/Lmap");
    
    var iconBaseUrl = "cloud/lib/plugin/leaflet/images/"

    var baseZIndex = 0;
    var myIcon = L.icon({
        iconUrl: require.toUrl("cloud/resources/images/ui-gis-normal1.png"),
//            iconSize: [38, 95],
        iconAnchor: [10, 36],
        popupAnchor: [0, -36],
        shadowUrl: require.toUrl(iconBaseUrl + 'marker-shadow.png'),//require.toUrl("cloud/resources/images/shadow.png"),
//            shadowRetinaUrl: require.toUrl(iconBaseUrl + 'my-icon-shadow@2x.png'),
//            shadowSize: [68, 95],
        shadowAnchor: [13, 43]
    });
    
    var MyControl = L.Control.extend({

        initialize : function(el, options) {
            if ((el instanceof jQuery) && (el.length > 0)) {
                el = el[0]
            }
            this._cloud_el = el;
            L.Util.setOptions(this, options);
        },

        onAdd : function(map) {
            var container = L.DomUtil.create('div', 'my-custom-control');

            // ... initialize other DOM elements, add listeners, etc.

            return this._cloud_el;
        }
    });
    
    L.Marker.include({
        setTitle : function(title){
            this._icon.title= title;
        }
    });
    
    var INFO_POPUP_CTNT = $("<div>").addClass("gis-map-popup");
    var INFO_POPUP_CFG = {
            minWidth : 230,
//            autoPan : true,
//            autoPanPadding : new L.Point(500, 500)//TODO
        }
    
    var GisMap = Class.create(cloud.Component, {
        initialize : function($super, options) {
            var self = this;
            this.service = service;
            this.moduleName = "site-gis-map";
            $super(options);
            
            markers = this.markers = $H();
            
            this.initMap();
//            this.addControls();

            locale.render({
                element : this.element
            });
        },

        initMap : function() {
        	var self = this;
            var defaultLoc;

            switch (locale.current()){
                case 1://en
                    defaultLoc = {
                        longitude: -100.08544921874999,
                        latitude: 38.634036452919226

                    }
                    break;
                case 2://zh_CN
                    defaultLoc = {
                        longitude: 116.407013,
                        latitude: 39.926588
                    }
            }

            var map = this.map = L.map(this.element[0]).setView(
                    [ defaultLoc.latitude, defaultLoc.longitude ], 5);


            cloud.util.getCurrentLocation(function(position){
                latlng = [position.latitude,position.longitude];
                map.setView(latlng,5);

            },false,defaultLoc);
            window.map = map;
            //updata by zyl
            var tiles = cloud.Lmap.getTiles(map);
            L.control.layers(
            		{
            			"Map":tiles.arcWorld
            			//"ArcGisChina":tiles.arcChina,
            			//"Google":tiles.google,
            			//'ArcGisWorld':tiles.arcWorld
            		},{}
            	).addTo(map);
            
            map.on("baselayerchange",function(layer){
            	var maxzoom = {};
            	switch(layer.name){
            	case "Google":
            		maxzoom = tiles.google.maxZoom;
            		break;
            	case "ArcGisChina":
            		maxzoom = tiles.arcChina.maxZoom;
            		break;
            	case "Map":
            		maxzoom = tiles.arcWorld.maxZoom;
            		break;
            	}
            	var currzoom = map.getZoom();
            	if(maxzoom <currzoom){
            		map.setZoom(maxzoom);
            	}
            	
            	cloud.Lmap.setMap(layer.name);
//            	cloud.storage.sessionStorage("currentMap", layer.name);
            }).on("mousedown", function(e){
                self.element.trigger("mousedown", [e])
            });
            
            
            
            var markerGroup = this.markerGroup = new L.FeatureGroup();
            map.addLayer(markerGroup);
//            var drawControl = new L.Control.Draw({
//                draw:false,
//                edit: {
//                    featureGroup: markerGroup,
//                    remove:false
//                }
//            });
//
//            this.drawControl = drawControl;
//
//            map.addControl(drawControl);
            
            this.bindMapEvts()
        },

        cancleDelete:function(){
            var deleltebtn = $H(this.drawControl._toolbars).values()[1];
            if(deleltebtn._activeMode){
                deleltebtn._activeMode.handler.revertLayers();
            }
        },
        
        bindMapEvts : function(){
            var self = this;
            var markerGroup = this.markerGroup;
            this.map/*.on('draw:editstart', function (e) {
//                console.log("draw:editstart", e);
            }).on('draw:editestop', function (e) {
//                console.log("draw:drawstop", e)
            })*/.on('draw:created', function (e) {
//                console.log("draw:created", e)
                var type = e.layerType,
                    layerItem = e.layer;

                if (type === 'marker') {
                    var marker = layerItem;
//                    var info = null
                    self.procMarker(marker, null);
                    markerGroup.addLayer(marker);
                    marker.openPopup();
                }

            }).on('draw:edited', function (e) {
                var layers = e.layers.getLayers();
                $A(layers).each(function(marker){
                    var siteId = marker.siteId;
                    var location = marker.newLoc;
                    self.updateLocation(siteId, location);
                });
    
            }).on('draw:deleted', function (e) {
                var layers = e.layers.getLayers();
                
                self.deleteSites(layers);
                
                $A(layers).each(function(marker){
                    var siteId = marker.siteId;
                    self.deleteLocation(siteId);
                });
            }).on('draw:editstart', function (e) {
                    //console.log("draw:editstart",e)
                    markerGroup.eachLayer(function(marker){
                        marker.closePopup();
                    });

//                    self.markers.each(function(marker){
//                        var mak = marker[1];
//                        if(mak.data.autoNavi == 1){
//                            self.toggleMarker(mak,false);
//                            mak.dragging.disable();
//                        }
//                    })

                    if (e.handler == "remove"){
                        self.states = "REMOVING";
                    }else if(e.handler == "edit"){
                        self.states = "EDITING"
                    }
            }).on('draw:editstop', function (e) {
//                    console.log("draw:editstop",e)
                    markerGroup.eachLayer(function(marker){
                        marker.closePopup();
                    });

//                    self.markers.each(function(marker){
//                        var mak = marker[1];
//                        if(mak.data.autoNavi == 1){
//                            self.toggleMarker(mak,true);
//                            mak.dragging.disable();
//                        }
//                    })

//                if (e.handler == "remove"){
                    self.states = null;
//                }
            })

        },


        toggleMarker:function(marker,show){
            var toolbar  = $H(this.drawControl._toolbars).find(function(toolbar){
                    if(toolbar.value._modes.edit){
                        return toolbar[1]
                    }
            });
            if(!L.DomUtil.hasClass(marker._icon, 'leaflet-edit-marker-selected') && show){
                toolbar[1]._modes.edit.handler._toggleMarkerHighlight(marker);
            }
            if(L.DomUtil.hasClass(marker._icon, 'leaflet-edit-marker-selected') && !show){
                toolbar[1]._modes.edit.handler._toggleMarkerHighlight(marker);
            }
//            marker.dragging.disable();
        },
        

        updateLocation : function(siteId, location){
            cloud.Ajax.request({
                url: "api/sites/" + siteId,
                type: "put",
                data: {
                    location: location
                },
                success: function(data) {
                    var marker = self.markers.get(siteId);
                    marker.data.location = location
//                    self.disable();
                }
            });
        },
        
        deleteMarkers : function(resources){
            var self = this;
            if (resources){
                //TODO
            }else{
                this.markers.each(function(obj){
                    var key = obj.key;
                    var marker = obj.value;
                    try {
                        marker.onRemove(self.map);
                    } catch (e) {
                        //console.log("ERROR ocured when deleting markers")
                    }
                    self.markers.unset(key);
                });
            }
        },
        
        procMarker : function(marker, data){
            var self = this;
            var info = null;
            
            var clearContent = function(content){
                info && info.destroy();
                $(content).empty();
                info = null;
            };
            
            marker.siteId = data ? data._id : null;
            marker.data = data;
            marker.bindPopup(INFO_POPUP_CTNT[0], INFO_POPUP_CFG)
            .on("popupopen", function(event){
//                this.dragging.enable();
                if(self.states != null){
                    this.closePopup();
                    return;
                };
                self.openId = data._id;
                if (self.states != "REMOVING"){
                    clearContent(event.popup.getContent());
                    
                    info = self.renderPopup(marker, event.popup.getContent());
                    event.popup.update();
                }
                info && info.setLocation({
                    longitude : this.getLatLng().lng,
                    latitude : this.getLatLng().lat
                });
                    self.info = info;
                /*if (!marker.siteId){
                    info && info.setLocation({
                        longitude : this.getLatLng().lng,
                        latitude : this.getLatLng().lat
                    });
                    info.on({
                        "afterInfoCreated": function(id, data){
//                            marker.setTitle(data.name);
//                            marker.siteId = id;
//                            self.markers.set(id, marker);
                            self.fire("afterCreated", id, data);
                        },
                        "afterInfoUpdated" : function(id){
                            this.service.getTableResourcesById(id, function(data) {
                                
                            }, this);
                            self.fire("afterUpdated", id)
                        }
                    });
                }*/
            })
            .on("popupclose", function(event){
                clearContent(event.popup.getContent());

//                self.openId = null
                
                if (!marker.siteId){
                    marker.onRemove(self.map);
                }
            })
            /*.on("click", function(){
                this.dragging.enable();
            })*/
            .on("mouseover", function(){
                if (self.states === "REMOVING"){
                    this.setOpacity(0.6)
                }
            })
            .on("mouseout", function(){
                if (self.states === "REMOVING"){
                    this.setOpacity(1)
                }
            })
            .on("dragend", function(){
//                console.log(this.getLatLng(), "dragend");
                marker.newLoc = {
                    longitude : this.getLatLng().lng,
                    latitude : this.getLatLng().lat
                };
                /*info && info.setLocation({
                    longitude : this.getLatLng().lng,
                    latitude : this.getLatLng().lat
                })*/
            })
        },

        openPopup:function(){
            if(this.openId){
                var marker = this.markers.get(this.openId);
                marker.openPopup()
            }
        },

        addMarkers : function(datas) {
            var self = this;
//            var popupContent = INFO_POPUP_CTNT;
//            try {
            datas.each(function(data){
            	
            	if(data.location){
            		var loc = data.location;
            		if(loc.latitude && loc.longitude){
            			var info = null;
                        var icon = self._getIcon(data);
                        var marker = L.marker([loc.latitude, loc.longitude],{
                            icon : icon,
                            title : data.name,
                            draggable : false
                        })
                        self.procMarker(marker, data);
                        //.addTo(self.map);
                        
                        self.markerGroup.addLayer(marker);
                        self.markers.set(data._id, marker);
            		}
            	}
                
            });
                            
//            } catch (e) {
//                // TODO: handle exception
//            }
        },

        updateMarkers:function(data){
            //console.log(data);
            var marker = this.markers.get(data._id)
            var icon = this._getIcon(data)
            marker.setIcon(icon);
            marker.setLatLng({
                lon:data.location.longitude,
                lat:data.location.latitude
            });
            marker.title = data.name;
            marker.data = data;
        },
        
        jumpToSite : function(siteId){
            var marker = this.markers.get(siteId);
            if (marker){
                var latlon = marker.getLatLng();
                this.map.panTo(latlon);
                marker.openPopup();
                baseZIndex += 5;
                marker.setZIndexOffset(baseZIndex);
            }
        },
        
        renderPopup : function(marker, popupContent){
            var self = this;
            var siteId = marker.siteId;
            var info = new monitorInfo({
                container : popupContent,
                siteId:siteId
            });
            
            /*info.on({
                "afterInfoCreated": function(id, data){
//                    marker.setTitle(data.name);
//                    marker.siteId = id;
//                    self.markers.set(id, marker);
                    self.fire("afterCreated", id, data);
                },
                "afterInfoUpdated" : function(id,isSelected){
                    self.service.getTableResourcesById(id, function(data) {
                        data = data[0];

                        marker.data = data;
                        if(isSelected){
                            marker.setLatLng({
                                lon: data.location.longitude,
                                lat: data.location.latitude
                            });
                        }

                        var icon = this._getIcon(data);
                        marker.setIcon(icon);
//                        if(L.DomUtil.hasClass(marker._icon,"leaflet-edit-marker-selected")){
//                            marker.setIcon(icon);
//                            self.toggleMarker(marker,true)
//                        }else{
//                            marker.setIcon(icon);
//                        }

                        marker.setTitle(data.name);

                        console.log("set icon end");

                        self.fire("afterUpdated", id, data);
                    }, self);
                }
//                "onAutoPos" : function(data,auto){
//                    var marker = self.markers.get(data._id);
//                    if(auto){
//                        marker.data.autoNavi = 1;
//                    }else{
//                        marker.data.autoNavi = 0;
//                    }
//                }
            });*/
            
            info.render(marker.data);
            if (!marker.siteId){
                info.enable();
            }
            return info;
        },
        

        resize : function(){
            this.map.invalidateSize();
        },
        
        _getIcon : function(data){
            if (data){
                var iconUrl = this._iconUrlMapping(data);
            }
            
            var icon = L.icon({
                iconUrl: require.toUrl(iconUrl),
//                iconSize: [38, 95],
                iconAnchor: [10, 36],
                popupAnchor: [0, -36],
                shadowUrl: require.toUrl(iconBaseUrl + 'marker-shadow.png'),//require.toUrl("cloud/resources/images/shadow.png"),
//                shadowRetinaUrl: require.toUrl(iconBaseUrl + 'my-icon-shadow@2x.png'),
//                shadowSize: [68, 95],
                shadowAnchor: [13, 43]
            });
            
            return icon;
        },
        
        _iconUrlMapping : function(resource){
        	
            var preStr = "cloud/resources/images/";
            
            var iconUrl = preStr + "ui-gis-";
            
            switch (resource.businessState){
                case 1 : iconUrl += "normal";break;
                case 0 : iconUrl += "setting";break;
                case 3 : iconUrl += "fix";break;
                case 2 : iconUrl += "gaojing";break;
                default : iconUrl += "normal";
            }
            if (resource.online == 1) {
                if (resource.alarmCount){
                    iconUrl += "3"
                }else {
                    iconUrl += "4"
                }
            } else if(resource.online == 0){
                if (resource.alarmCount){
                    iconUrl += "1"
                }else {
                    iconUrl += "2"
                }
            }
            
            return iconUrl + ".png";
        },

        destroy : function($super) {
            this.info && this.info.destroy();
            this.map.remove();
            $super();
        }
        
    });

    return GisMap;
});