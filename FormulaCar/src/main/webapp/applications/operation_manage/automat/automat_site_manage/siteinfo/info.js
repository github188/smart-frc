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
			this.element.html(infoHtml);
			locale.render({element:this.element});
            this._render();
		},
		_render:function(){
			this.loadAreaData();
			
			this.renderMap();
		},
		loadAreaData:function(){
			cloud.util.mask("#automat-site-info");
			var self = this;
			var pageDisplay = 3000000;
			this.service.getAreaInfo(0, pageDisplay,function(data) {
				var area={};
				var code=[];
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#sitecity").append("<option value='" +data.result[i].code + "'>" +data.result[i].city+"</option>");
						area[data.result[i].code] = data.result[i].zone;
						code = data.result[0].zone;
						$("#cityValue").val(data.result[0].code);
					}
				}
				self._renderBtn(area,code);
				cloud.util.unmask("#automat-site-info");
			});
			
			
		},
		_renderBtn:function(area,code){
			var self = this;
			for(var j=0;j<code.length;j++){
				 $("#sitecode").append("<option value='" +code[j].code+ "'>" +code[j].name+"</option>");
			}
		    $("#sitecode").find("option[value='all']").attr("selected",true);
		    $("#zoneValue").val('');
		    
		    $("#sitecity").bind('change', function () {
		        	$("#sitecode").empty();
					var selectedId = $("#sitecity").find("option:selected").val();
					 for(var item in area){  
					      if(item==selectedId){  
					           var value=area[item];
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
        		if(name==null||name==""){
        			cloud.util.unmask("#automat-site-info");
        			dialog.render({lang:"automat_enter_name"});
        			return;
        		}
        		if(address==null||address==""){
        			cloud.util.unmask("#automat-site-info");
        			dialog.render({lang:"automat_enter_address"});
        			return;
        		}
        		
        		var lonlat = self.locMarker.getLatLng();
        		data.name = name;
        		data.address = address;
        		data.description = description;
        		data.area = areaVal;
        		location.longitude = lonlat.lng;
        		location.latitude = lonlat.lat;
        		location.region = "";
        		data.location = location;
        		self.service.addSite(data,function(retData){
        			if(retData.error_code&&retData.error_code=="21322"){
        				dialog.render({lang:"automat_site_name_exists"});
        				return;
        			}else if(!retData.error_code){
            			self.fire("refreshTable");
            			dialog.render({lang:"save_success"});
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
            if(this.map){
                this.map.remove();
            }
            
            this.map = L.map(this.element.find("#info-map")[0],{
                zoomControl : false
            });

            cloud.Lmap.getTile(this.map);
            var languge= localStorage.getItem("language");
            if(languge == "en"){
            	 this.renderLocMarker([38.634036452919226,-100.08544921874999]);
            }else{
            	 this.renderLocMarker([39.926588,116.407013]);
            }
           
        },
        
        renderLocMarker : function(data){
            if (this.locMarker) {
                this.locMarker.onRemove(this.map);
                this.locMarker = null;
            }
            var self = this;
            this.locMarker = L.marker([ data[0],data[1]],{
                draggable : true
            }).addTo(this.map);
            
            this.map.setView([ data[0],data[1]],6);
        },
		
		setInfoData:function(){
			var self = this;
			var id = self.infoId;
			cloud.util.mask("#automat-site-info");
			self.service.getSiteById(id,function(data){
				$("#automat_site_name").val(data.result.name==null?"":data.result.name);
				$("#automat_site_address").val(data.result.address==null?"":data.result.address);
				$("#automat_site_desc").val(data.result.description==null?"":data.result.description);
				cloud.util.unmask("#automat-site-info");
			}, self);
		}
		
	});	
	return InfoModel;
    
});