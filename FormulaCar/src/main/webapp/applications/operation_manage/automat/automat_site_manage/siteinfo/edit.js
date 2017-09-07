/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var infoHtml = require("text!./info.html");
	var validator = require("cloud/components/validator");
	require("../css/table.css");
	require("cloud/components/Lmap");
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.service = options.service;
			this._id = options.id;
			this.element.html(infoHtml);
			locale.render({element:this.element});
            this._render();
		},
		_render:function(){
			this.loadData();
			this.renderMap();
			
		},
	       
        loadData:function(){
        	var self = this;
        	cloud.util.mask("#automat-site-info");
        	self.service.getSiteById(this._id,function(data){
				$("#automat_site_name").val(data.result.name==null?"":data.result.name);
				$("#automat_site_address").val(data.result.address==null?"":data.result.address);
				$("#automat_site_desc").val(data.result.description==null?"":data.result.description);
				self.online = data.result.online;
				var location = data.result.location;
				if(location){
					self.locMarker = L.marker([location.latitude,location.longitude],{
		                draggable : true
		            }).addTo(self.map);
				}else{
					var languge= localStorage.getItem("language");
					if(languge == "en"){
						self.locMarker = L.marker([ 38.634036452919226,-100.08544921874999],{
			                draggable : true
			            }).addTo(self.map);
					}else{
						self.locMarker = L.marker([ 39.926588,116.407013],{
			                draggable : true
			            }).addTo(self.map);
					}
				}
				var city ='';
				var zone='';
				if(data.result.area){
					city = data.result.area.split(".")[0];
		    	    zone = data.result.area.split(".")[1];
				}
	    	   
	     		self.loadAreaData(city,zone);
			}, self);
        },
		loadAreaData:function(city,zone){
			var self = this;
			var pageDisplay = 3000000;
			this.service.getAreaInfo(0, pageDisplay,function(data) {
				var area={};
				var code=[];
				var city0='';
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#sitecity").append("<option value='" +data.result[i].code + "'>" +data.result[i].city+"</option>");
						area[data.result[i].code] = data.result[i].zone;
						if(data.result[i].code == city){
							code = data.result[i].zone;
						}else{
							code = data.result[0].zone;
						}
						city0 = data.result[0].code;
					}
				    for(var j=0;j<code.length;j++){
						$("#sitecode").append("<option value='" +code[j].code+ "'>" +code[j].name+"</option>");
					}
				}
				 if(city){
	     			 $("#sitecity").find("option[value="+city+"]").attr("selected",true);
	     			$("#cityValue").val(city);
	     		 }else{
	 	        	$("#cityValue").val(city0);
		        	$("#zoneValue").val(code[0].code);
		         }
				 console.log("city==="+city+"===zone=="+zone);
	     		 if(zone){
	    			 $("#zoneValue").val(zone);
	    			 $("#sitecode").find("option[value="+zone+"]").attr("selected",true);
	    		 }else{
	    			 $("#zoneValue").val(zone);
	    			 $("#sitecode").find("option[value='all']").attr("selected",true);
	    		 }
				self._renderBtn(area);
				cloud.util.unmask("#automat-site-info");
			});
			
			
		},
		
		_renderBtn:function(area){
			var self = this;
			 $("#sitecity").bind('change', function () {
		        	$("#sitecode").empty();
					var selectedId = $("#sitecity").find("option:selected").val();
					 for(var item in area){  
					      if(item==selectedId){  
					           var value=area[item];
					           console.log(value); 
					           if(value){
					        	   $("#sitecode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
									for(var i=0;i<value.length;i++){
										$("#sitecode").append("<option value='" +value[i].code + "'>" +value[i].name+"</option>");
									}
								}
					      }  
					 }
					 $("#cityValue").val(selectedId);
	         });
		     $("#sitecode").bind('change', function () {
		        	var codeId = $("#sitecode").find("option:selected").val();
		        	if(codeId == "all"){
		        		$("#zoneValue").val('');
		        	}else{
		        		$("#zoneValue").val(codeId);
		        	}
		      });
		     
			$("#automat_site_add").bind("click",function(){
				cloud.util.mask("#automat-site-info");
				var data = {};
				var location = {};
				var name = $("#automat_site_name").val();
        		var address = $("#automat_site_address").val();
        		var description = $("#automat_site_desc").val();
        		var areaVal = $("#cityValue").val() + "." + $("#zoneValue").val();
             	
        		if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
        			dialog.render({lang:"automat_enter_name"});
        			return;
        		}
        		if(address==null||address.replace(/(^\s*)|(\s*$)/g,"")==""){
        			dialog.render({lang:"automat_enter_address"});
        			return;
        		}
        		
        		var lonlat = self.locMarker.getLatLng();
        		data.name = name;
        		data.address = address;
        		data.description = description;
        		data.online = self.online;
        		data.area = areaVal;
        		
        		location.longitude = lonlat.lng;
        		location.latitude = lonlat.lat;
        		location.region = "";
        		data.location = location;
        		self.service.updateSite(data,self._id,function(retData){
        			if(retData.error_code&&retData.error_code=="20007"){
        				dialog.render({lang:"automat_site_name_exists"});
        				return;
        			}else if(!retData.error_code){
            			self.fire("refreshTable");
            			dialog.render({lang:"automat_goods_model_update_success"});
        			}
        			cloud.util.unmask("#automat-site-info");
        		},self);
				
			});
			
			$("#automat-site-cancel").bind("click",function(){
		    	self.fire("hide");
		    });
		},
		
		 /**
         * 初始化地图
         */
        renderMap: function() {
            /*this.map = new maps.Map({
                selector: this.element.find("#info-map"),
                zoomControl: true,
                panControl: false
            });*/
            if(this.map){
                this.map.remove();
            }
            var languge= localStorage.getItem("language");
            if(languge == "en"){
            	 this.map = L.map(this.element.find("#info-map")[0],{
                     zoomControl : false
                 }).setView([ 38.634036452919226,-100.08544921874999],6);
            }else{
            	 this.map = L.map(this.element.find("#info-map")[0],{
                     zoomControl : false
                 }).setView([ 39.926588,116.407013],6);
            }
           

            cloud.Lmap.getTile(this.map);
            
            //this.renderLocMarker([39.926588,116.407013]);
        },
        
        renderLocMarker : function(data){
//        	if (data.location && (!this.locMarker)){
            if (this.locMarker) {
                this.locMarker.onRemove(this.map);
                this.locMarker = null;
            }
            var self = this;
            /*var iconUrl = this.iconMapping(data);
             this.locMarker = this.map.addMarker({
             position: new maps.LonLat(data.location.longitude, data.location.latitude),
             title: data.name,
             draggable: false,
             icon : require.toUrl(iconUrl)
             });*/
            this.locMarker = L.marker([ data[0],data[1]],{
                draggable : true
            }).addTo(this.map);
            
            this.map.setView([ data[0],data[1]],6);
//        	}
        },
 
		
		setInfoData:function(){
			var self = this;
			var id = self.infoId;
			cloud.util.mask("#add_or_edit_site");
			
		}
		
	});	
	return InfoModel;
    
});