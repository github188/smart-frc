define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	//var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	require("async!http://maps.google.cn/maps/api/js?key=AIzaSyByYMmT7xdYCvpj5UQHZFSJdv21PlOQJYk&libraries=places");
	
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		
		_renderWindow:function(){
			var bo = $("body");
			var title_win='';
			if(this._id){
				title_win = locale.get({lang:"warehouse_management_update"});
			}else{
				title_win = locale.get({lang:"warehouse_management_add"});
			}
			
			
			var self = this;
			this.window = new _Window({
				container: "body",
				title: title_win,
				top: "center",
				left: "center",
				height:500,
				width: 500,
				mask: true,
				drag:true,
				content: "<div id='typeWinContent' style='border-top: 1px solid #e7e7eb;margin-top: 5px;'></div>",
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
			 this._renderGetData();
			this._renderBtn();
		   
			},
		
			_renderForm:function(){				
				
				var htmls1= "<table width='90%' style='margin-left:9%;margin-top:10%;' border='1'>"
//					        +"<tr style='height:30px;'>"
//						      + "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"numbers"})+"</label></td>"
//						      + "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 22px;' type='text' id='type-number' value='' name='number' /></td>"
//						    +"</tr>"
						    +"<tr style='height:30px;'>"
							+ "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"enter_warehouse_name"})+"</label></td>"
							+ "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 22px;' type='text' id='type-name' value='' name='name' /></td>"
							+"</tr>"
						     +"<tr style='height:30px;'>"
								+ "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"enter_warehouse_address"})+"</label></td>"
								+ "<td  height='20px'> <input style='border-radius: 4px;width: 270px;height: 22px;' type='text'  id='type_address'  placeholder='Enter an address' /></td>"
								+"</tr>"
						    + " </table>"
						 //   +"<div> <input style='border-radius: 4px;width: 270px;height: 22px;' type='text'  id='type_address'  placeholder='donuts' /></div>"
						    +"<div id=map style='height:270px;width:450px;margin-right: 30px;margin-left: 20px;margin-top:10px'></div>"
						    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-type-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-type-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
		        $("#typeWinContent").append(htmls1);
			},
			
			_renderBtn:function(){
				var self = this;
				var location={};
				var map;
				 this.map = new google.maps.Map(document.getElementById('map'), {
				      //设置经纬度  
	        			center: {lat: 41.85, lng: -87.65},
	        	         // center: new google.maps.LatLng(-34.397, 150.644),  
	        	          zoom: 6,//地图的缩放度  
					    mapTypeId: google.maps.MapTypeId.ROADMAP
					  });
				  map=this.map;
				  var address = $("#type_address").val();
				  var inputs =  document.getElementById('type_address');
				//  var inputs = document.getElementsByClassName('waypoints');
				  var markers = [];
			  var searchBox = new google.maps.places.SearchBox(inputs);
			  
			  searchBox.addListener('places_changed', function() {
			            var places = searchBox.getPlaces();

			            if (places.length == 0) {
			              return;
			            };
			            markers.forEach(function(marker) {
			                marker.setMap(null);
			              });
			              markers = [];
			            var bounds = new google.maps.LatLngBounds();
			            places.forEach(function(place) {
			            	location.longitude=place.geometry.location.lng();
			            	location.latitude=place.geometry.location.lat();
			                var icon = {
			                        url: place.icon,
			                        size: new google.maps.Size(71, 71),
			                        origin: new google.maps.Point(0, 0),
			                        anchor: new google.maps.Point(17, 34),
			                        scaledSize: new google.maps.Size(25, 25)
			                      };
			                markers.push(new google.maps.Marker({
			                    map: map,
			                    icon: icon,
			                    title: place.name,
			                    position: place.geometry.location
			                  }));
			                if (place.geometry.viewport) {
			                    // Only geocodes have viewport.
			                    bounds.union(place.geometry.viewport);
			                  } else {
			                    bounds.extend(place.geometry.location);
			                  }
			            });
			            map.fitBounds(bounds);
			      });
				  map.addListener('bounds_changed', function() {
			    	    var bounds = map.getBounds();
			    	    searchBox.setBounds(bounds);
			    	  });
			    //取消
			    $("#product-type-config-cancel").bind("click",function(){
			    	self.window.destroy();
			    });
	            //保存
			    $("#product-type-config-save").bind("click",function(){
		        	   var name=$("#type-name").val();
		        	   address = $("#type_address").val();
		     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
	          			    dialog.render({lang:"enter_the_warehouse_name"});
	          			    return;
	          		  };
	          		  if(address==null||address.replace(/(^\s*)|(\s*$)/g,"")==""){
	          		    dialog.render({lang:"enter_the_warehouse_address"});
          			    return;
	          		  }
		     		  if(name && address){//判断不能为空
		     			    var typedata={
		 	             		name:name,
		 	             		address:address,
		 	             		location:location
		 	                }
		     			   if(self._id){
		     				  Service.updateWarehouse(self._id,typedata,function(data){
		     					
		                    	  if(data.error != null){
		    	                	   if(data.error_code == "20007"){
		    							   dialog.render({lang:"warehouse_name_exists"});
		    							   return;
		    						   }else{
		    							   dialog.render({lang:"warehouse_update_error"});
		    							   return; 
		    						   }
		    	                	}else{
		    							self.window.destroy();
		    		 	             	self.fire("getWarehouseList");	    		 	             	
		    						}
		    			       });
		     			   }else{
		     				 
		     				  Service.addWarehouse(typedata,function(data){
			 	                	
			 	                	if(data.error!=null){
			 	                	   if(data.error_code == "70043"){
										   dialog.render({lang:"warehouse_name_exists"});
										   return;
		    						   }else{
		    							   dialog.render({lang:"warehouse_update_error"});
		    							   return; 
		    						   }
			 	                	}else{
										self.window.destroy();
					 	             	self.fire("getWarehouseList");
									}
			 	             	  
			 				   });
		     			
		     			   }
		 	                
		     		  }
		                
		        });
			},
			_renderGetData:function(){
				var self = this;
				if(this._id){
					Service.getWarehouseList("",this._id,0,100,function(data){
			     		 $("#type-name").val(data.result[0].name);
			     		$("#type_address").val(data.result[0].address);
					});
				}
			},
			destroy:function(){
				if(this.window){
					this.window.destroy();
				}else{
					this.window = null;
				}
			}
	});
	return  Window;
	
	
});