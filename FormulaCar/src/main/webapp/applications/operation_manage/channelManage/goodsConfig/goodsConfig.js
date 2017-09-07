define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./goodsConfig.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    require("../css/table.css");
    require("../css/style.css");
    require("../css/common.css");
    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.configData = null;  //上一页和详情传过来的数据包
            if(!this.realRoadsData||this.realRoadsData == null){
            	this.realRoadsData = new Object();
            	if(this.realRoadsData.goodsConfigs == null){
    				this.realRoadsData.goodsConfigs = new Array();
    			}
			}
			
            this.render();
            this.goodsWinWidth = 558;
            this.goodsWinHeight = 478;
            this.saveGoodsConfig = options.saveGoodsConfig;
           
        },
        render:function(){
		},
		renderGoodsShelf:function(){
			var self = this;
			self.saveGoodsConfig = self.realRoadsData.goodsConfigs;
			
		},
        // 初始化货道个数
        showAndInitRoads: function(saveGoodsConfig) {
            var self = this;
            self.showRoads(saveGoodsConfig);
            if (saveGoodsConfig && saveGoodsConfig != null) {
                self.initRoadWindowImage(saveGoodsConfig);
            }
            
            cloud.util.unmask("#automat_cargo_road_config");
        },
        //根据机型信息绘制货道个数
        showRoads: function(data) {
            var self = this;
            var width = $("#channel_list_table").width()*0.99+"px";
            $("#cargo_road_info").css("width",$("#channel_list_table").width());
            cloud.util.mask("#automat_cargo_road_config");
            var row = 0;
            var roadInfoHtml = "<table id='road_table' style='height:360px;margin-top: 10px;width:"+width+"'>";
            
			if(data){
				for (var i = 0; i < data.length; i++) {
	                if(data[i]!=null){
	                    if (i % 8 == 0) {
	                        row = row + 1;
	                        roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
	                    }

	                    var capacity = '';
	                    var valve = '';
	                    
	                    if(data[i].capacity != undefined ){
	                    	capacity = data[i].capacity;
	                    }
	                    if(data[i].valve != undefined){
	                    	valve = data[i].valve;
	                    }
	                    roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>" +
	                            "<table style='width:100%'>" +
	                            "<tr style='height:82px;width:100%'>"+
	                               "<td id='" + data[i].location_id + "' class='road_td_image' style='font-size:20px;'></td>"+
	                            "</tr>" +
	                            "<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='" + data[i].location_id + "_goods_name'>"+
	                               "<td><div id='"+data[i].location_id+ "_name_div' style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'><span style='font-weight:600' id='" + data[i].location_id + "_name_content'>&nbsp;" + "</span></div></td>"+
	                            "</tr>" +
	                            "<tr style='width:100%;text-align:center;font-size:10px;' id='" + data[i].location_id + "_goods_price'>"+
	                               "<td><input type='text' style='width:40px;height: 10px;text-align: center;'  id='" + data[i].location_id + "_price_content' />&nbsp;" + "<span>"+locale.get({lang: "china_yuan"})+"</span><span id='" + data[i].location_id + "_del'></span></td>"+
	                            "</tr>" +
	                            "<tr style='width:100%;font-size:10px;line-height: 30px;' id='" + data[i].location_id + "_capacity_threshold'>"+
	                               "<td>"+
	                                  "<div style='float:left;'><input type='text' style='width:40px;height: 10px;margin-left: 36px;text-align:center;line-height:16px;' value='"+capacity+"' id='" + data[i].location_id + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/></div>"+
	                                  "<div style='float:left;margin-left:5px;'><input type='text' style='width:40px;height: 10px;text-align:center;line-height:16px;' value='" + valve + "' id='" + data[i].location_id + "_valve_content' placeholder='"+locale.get({lang:"shelf_threshold"})+"'/></div>"+
	                               "</td>"+
	                            "</tr>"+
	                           "</table>" +
	                            "</td>";
	                    if (i % 8 == 8) {
	                        roadInfoHtml = roadInfoHtml + "</tr>";
	                    }
	                } 
	            }
	            $("#cargo_road_info").html(roadInfoHtml);
	            $("#cargo_road_info").html(roadInfoHtml);
	            $("#cargo_road_info").html(roadInfoHtml);
	    		$(".road_td_image").bind("click" , function(){
	        		self.showGoodsInfoWindow(this.id);
	        	});
			}
            
        },
        //根据货道配置填充货道
        initRoadWindowImage: function(data) {
            var self = this;
            if (data == null || data.length == 0) {
                cloud.util.unmask("#automat_cargo_road_config");
            } else {
                $.each(data, function(n, item) {
                    if (item != null) {
                        var imagepath = item.img;
                        var imageMd5 = item.imagemd5;

                        var goodsConfig = {
                            "location_id": item.location_id,
                            "goods_id": item.goods_id,
                            "goods_name": item.goods_name,
                            "goods_type": item.goods_type,
                            "goods_typeName": item.goods_typeName,
                            "price": item.price,
                            "img": item.img,
                            "alipay_url": item.alipay_url,
                            "imagemd5": item.imagemd5,
                            "capacity": item.capacity,
                            "valve": item.valve,
                        };
                       
                        self.realRoadsData.goodsConfigs[n] = goodsConfig;
                        self.renderGoodsShelf();
                        if (imagepath) {
                            var src = cloud.config.FILE_SERVER_URL + "/api/file/" + imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
                            $("#" + item.location_id).html("<div style='width: 20px;height: 10px;font-size: 12px;margin-left: 25px;'>" + item.location_id + "</div><img src='" + src + "' style='height:60px;'/>");
                            $("#" + item.location_id).append("<input type='hidden' id='imagemd5'/>");
                            $("#imagemd5").val(imageMd5);
                        } else {
                            $("#" + item.location_id).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-left: 25px;margin-top: -20%;    padding-top: 13px;'>" + item.location_id + "</div>+");
                        }
                        if (item.goods_name) {
                            $("#" + item.location_id + "_name_content").html(item.goods_name);
                            $("#" + item.location_id + "_name_div").bind("mouseover ",function(e){
        	                	this.title=item.goods_name;
        	                });
                        }
                        if (item.price) {
                        	$("#" + item.location_id + "_price_content").val(item.price);
                        	$("#" + item.location_id + "_price_content").css("margin-left","0px");
                            $("#" + item.location_id + "_del").html("        <a id='remove_road_"+item.location_id+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
                        }else{
                        	$("#" + item.location_id + "_price_content").val("0");
                        	$("#" + item.location_id + "_price_content").css("margin-left","-27px");
                        }
                       
                        $("#remove_road_"+item.location_id).bind('click',{n:n,location_id:item.location_id,capacity:item.capacity,valve:item.valve},function(e){
                        	
                        	var removeconfig = {
                        			alipay_url: "",
                        			goods_id: undefined,
                        			goods_name: undefined,
                        			goods_type: undefined,
                        			goods_typeName: undefined,
                        			imagemd5: undefined,
                        			img: undefined,
                        			location_id: e.data.location_id,
                        			price: undefined,
                        			capacity: e.data.capacity,
                                    valve: e.data.valve
                        	}
                        	
		    				self.realRoadsData.goodsConfigs[e.data.n] = removeconfig;
                        	self.renderGoodsShelf();
		    				$("#"+item.location_id).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;margin-left: 25px;    padding-top: 13px;position: relative;'>"+item.location_id+"</div>+");
		    				$("#"+item.location_id+"_name_content").html("&nbsp");
		    				$("#"+item.location_id+"_del").html("&nbsp");
		    				$("#" + item.location_id + "_price_content").val("0");
		    				$("#" + item.location_id + "_price_content").css("margin-left","-27px");
		    			});
                        $("#" + item.location_id + "_price_content").bind('input onchange',{n:n,location_id:item.location_id}, function(e) { 
                        	var price = $("#" + e.data.location_id + "_price_content").val();
                        	self.realRoadsData.goodsConfigs[e.data.n].price = price;
                        	self.renderGoodsShelf();
                        });
                        $("#" + item.location_id + "_capacity_content").bind('input onchange',{n:n,location_id:item.location_id}, function(e) { 
                        	var capacity = $("#" + e.data.location_id + "_capacity_content").val();
                        	self.realRoadsData.goodsConfigs[e.data.n].capacity = capacity;
                        	self.renderGoodsShelf();
                        });
                        $("#" + item.location_id + "_valve_content").bind('input onchange',{n:n,location_id:item.location_id}, function(e) { 
                        	var valve = $("#" + e.data.location_id + "_valve_content").val();
                        	self.realRoadsData.goodsConfigs[e.data.n].valve = valve;
                        	self.renderGoodsShelf();
                        });
                    }
                    if (n == data.length - 1) {
                        cloud.util.unmask("#automat_cargo_road_config");
                    }
                });
            }
        },
      //打开选择商品窗口
		showGoodsInfoWindow:function(roadId){
			var self = this;
			if(this.goodsWindow){
				this.goodsWindow.destroy();
			}
            this.goodsWindow =  new _Window({
            	container : "body",
                title : locale.get("automat_road_goods_choice",[roadId]),
                top: "center",
                left: "center",
                height: self.goodsWinHeight,
                width: self.goodsWinWidth,
                events : {
                    "onClose": function() {
                        self.goodsWindow = null;
                    },
                    scope : this
                }
            });
            this.goodsWindow.show();
            this.setGoodsContent(roadId);
		},
		//加载商品信息
		setGoodsContent:function(roadId){
			cloud.util.mask(".ui-window-content:last");
			var self = this;
			var html = "<div id='automat_cargo_road_config'>"+
						"<div style='margin:5px;'>"+
			              '<input id="goods_search_name_input" type="text" style="width: 230px;height: 25px;" class="search-input-name input-search c666 module-input-row-el">'+
						  '&nbsp;&nbsp;<a id="goods_search_btn" class="btn btn-primary submit search-btn" style="margin-top: -2px;width:20px;min-width:30px;" lang="text:query">'+locale.get("query")+'</a><br>'+
						  "</div>"+
					   	   "<div id='goods_image'>";
			var row = 0;
			Service.getGoodslist(name,0,24,function(data){
				if(data.result.length<=4){
					html =html+"<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
				}else{
					html =html+"<table id='goods_table'>";
				}
	    		for(var i=0;i<data.result.length;i++){
	        		if(i%4==0){
	        			row = row + 1;
	        			html = html + "<tr style='width:100%;'>";
	        		}
	        		var imagepath = data.result[i].imagepath;
        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        			html = html + "<td class='good_image_hover'width='20%' id="+data.result[i]._id+">"
        						+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
	        		if(i%4==3){
	        			html = html + "</tr>";
	        		}
	    		}
	    		html = html+"</table></div><a id='load' style='margin-left:44%;position:relative;font-size:15px;line-height:50px;'>加载更多商品</a></div>";
	    		
	    		this.goodsContentContainer =$(html)
	            .height(this.goodsWinHeight-50).width(this.goodsWinWidth-20);
		        this.goodsWindow.setContents(this.goodsContentContainer);
	    		
		        
		        $(".good_image_hover").click(function(event){
	    			var imagepath = event.target.id;
	    			var price = event.srcElement.attributes.price.value;
	    			var goodsId = this.id;
	    			var name = event.srcElement.attributes.name.value;
	    			var type = event.srcElement.attributes.type.value;
	    			var typeName = event.srcElement.attributes.typeName.value;
	    			var image_md5 = event.srcElement.attributes.md5.value;
	    			var capacity = $("#"+roadId+"_capacity_content").val();
	    			var valve =  $("#"+roadId+"_valve_content").val();
	    			
	    			
	    			var chooseCount = 0;
	    			
	    			if(event.srcElement.attributes.chooseCount){
	    				chooseCount = event.srcElement.attributes.chooseCount.value;
	    			}
	    			var goods = {
	    					"chooseCount":parseInt(chooseCount)+1
	    			};
	    			
	    			Service.updateGoods(goodsId,goods,function(data){
	    				
	    				
	    			});
	    			
	    			var goodsConfig = {
	    				"location_id":roadId,
	    				"goods_id":goodsId,
	    				"goods_name":name,
	    				"goods_type":type,
	    				"goods_typeName":typeName,
	    				"price":price,
	    				"img":imagepath,
	    				"imagemd5":image_md5,
	    				"capacity":capacity,
	    				"valve":valve
	    			};
	    			
	    			for(var ii =0;ii<self.realRoadsData.goodsConfigs.length;ii++){
	    				if(self.realRoadsData.goodsConfigs[ii].location_id == roadId){
	    					self.realRoadsData.goodsConfigs[ii] = goodsConfig;
	    					
	    					self.renderGoodsShelf();
	    					
	    	    			self.goodsWindow.hiden();
	    	    			
	    	    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    	    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;margin-left: 25px;'>"+roadId+"</div><img src='"+src+"' style='height:60px;'/>");
	    	    			$("#"+roadId+"_name_content").html(name);
	    	    			$("#" + roadId + "_name_div").bind("mouseover ",function(e){
	        	                	this.title=name;
	        	            });
	    	    			$("#" + roadId + "_price_content").css("margin-left","0px");
	                        $("#" + roadId + "_price_content").val(price);
	                        $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	    	    			$("#remove_road_"+roadId).bind('click',{ii:ii,roadId:roadId,capacity:capacity,valve:valve},function(e){
	    	    				var removeconfig = {
	                        			alipay_url: "",
	                        			goods_id: undefined,
	                        			goods_name: undefined,
	                        			goods_type: undefined,
	                        			goods_typeName: undefined,
	                        			imagemd5: undefined,
	                        			img: undefined,
	                        			location_id: e.data.roadId,
	                        			price: undefined,
	                        			capacity:e.data.capacity,
	                        			valve:e.data.valve
	                        	}
	    	    				self.realRoadsData.goodsConfigs[e.data.ii] = removeconfig;
	    	    				
	    	    				self.renderGoodsShelf();
	    	    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;margin-left: 25px;    padding-top: 13px;position: relative;'>"+roadId+"</div>+");
	    		    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
	    		    			$("#"+e.data.roadId+"_del").html("&nbsp");
	    	    				$("#" + e.data.roadId + "_price_content").val("0");
	    	    				$("#" + e.data.roadId + "_price_content").css("margin-left","-27px");
	    	    			});
	    	    		    $("#" + roadId + "_price_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
	                         	var price = $("#" + e.data.roadId + "_price_content").val();
	                         	self.realRoadsData.goodsConfigs[e.data.ii].price = price;
	                         	self.renderGoodsShelf();
	                        });
	    	    		    $("#" + roadId + "_capacity_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
	                        	var capacity = $("#" + e.data.roadId + "_capacity_content").val();
	                        	self.realRoadsData.goodsConfigs[e.data.ii].capacity = capacity;
	                        	self.renderGoodsShelf();
	                        });
	                        $("#" + roadId + "_valve_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
	                        	var valve = $("#" + e.data.roadId + "_valve_content").val();
	                        	self.realRoadsData.goodsConfigs[e.data.ii].valve = valve;
	                        	self.renderGoodsShelf();
	                        });
	    				}
	    			}
	    			self.renderGoodsShelf();
	    			self.goodsWindow.destroy();
	        	});
                $("#load").click(function(){
		        	
		        	var temp = $("#goods_table").find("td");
		        	
		        	var cousor = temp.length;
                	cloud.util.mask(".ui-window-content:last");
                	Service.getGoodslist(name,cousor,24,function(data){
            			
            			self.loadGoods(data,roadId);
            			cloud.util.unmask(".ui-window-content:last");
                	},self);
		        });
		        $("#goods_search_name_input").keydown(function(e){
		        	  var key = e.which;
		        	  if(key== 13){
		        		  $(".search-btn").click();
		        	  }
		        });
		        $(".search-btn").click(function(){
		        	var name = $(".search-input-name").val();
                	cloud.util.mask(".ui-window-content:last");
                	Service.getGoodslist(name,0,1000,function(data){
            			$("#goods_image").html("");
            			$("#load").css("display","none");
            			self.initGoodsView(data,roadId);
            			cloud.util.unmask(".ui-window-content:last");
                	},self);
		        });
		        $("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
	    		cloud.util.unmask(".ui-window-content:last");
	         },self);
		},
		loadGoods:function(data,roadId){
			var self = this;
			if(data.result.length<24){
				$("#load").css("display","none");
			}
    		for(var i=0;i<data.result.length;i++){
        		if(i%4==0){

        			$("#goods_table").append("<tr style='width:100%;'>");
        		}
        		var imagepath = data.result[i].imagepath;
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			$("#goods_table").find("tbody").append("<td class='good_image_hover' width='20%' id="+data.result[i]._id+">"
				+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>");
        		if(i%4==3){
        			$("#goods_table").append("</tr>");
        		}
    		}
    		
    		$(".good_image_hover").click(function(event){
    			
    			var imagepath = event.target.id;
    			var price = event.srcElement.attributes.price.value;
    			var goodsId = this.id;
    			var name = event.srcElement.attributes.name.value;
    			var type = event.srcElement.attributes.type.value;
    			var typeName = event.srcElement.attributes.typeName.value;
    			var image_md5 = event.srcElement.attributes.md5.value;
    			var capacity = $("#"+roadId+"_capacity_content").val();
    			var valve = $("#"+roadId+"_valve_content").val();
    			var chooseCount = 0;
    			if(event.srcElement.attributes.chooseCount){
    				chooseCount = event.srcElement.attributes.chooseCount.value;
    			}
    			var goods = {
    					"chooseCount":parseInt(chooseCount)+1
    			};
    			Service.updateGoods(goodsId,goods,function(data){
    				
    			});
    			var goodsConfig = {
        				"location_id":roadId,
        				"goods_id":goodsId,
        				"goods_name":name,
        				"goods_type":type,
        				"goods_typeName":typeName,
        				"price":price,
        				"img":imagepath,
        				"imagemd5":image_md5,
        				"capacity":capacity,
        				"valve":valve
        			};
        			for(var ii =0;ii<self.realRoadsData.goodsConfigs.length;ii++){
        				if(self.realRoadsData.goodsConfigs[ii].location_id == roadId){
        					self.realRoadsData.goodsConfigs[ii] = goodsConfig;
        					self.renderGoodsShelf();
        	    			self.goodsWindow.hiden();
        	    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        	    			$("#"+roadId).html("<div style='width: 20px;height: 10px;font-size: 12px;'>"+roadId+"</div><img src='"+src+"' style='height:60px;'/>");
        	    			$("#"+roadId+"_name_content").html(name);
        	    			//$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
        	    			  $("#" + roadId + "_name_div").bind("mouseover ",function(e){
            	                	this.title=name;
            	                });
        	    			$("#" + roadId + "_price_content").val(price);
        	                $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
        	    			
        	    			$("#remove_road_"+roadId).bind('click',{ii:ii,roadId:roadId},function(e){
        	    				var removeconfig = {
        	                			alipay_url: "",
        	                			goods_id: undefined,
        	                			goods_name: undefined,
        	                			goods_type: undefined,
        	                			goods_typeName: undefined,
        	                			imagemd5: undefined,
        	                			img: undefined,
        	                			location_id: e.data.roadId,
        	                			price: undefined,
        	                			capacity:capacity,
        	                			valve:valve
        	                	}
        	    				self.realRoadsData.goodsConfigs[e.data.ii] = removeconfig;
        	    				self.renderGoodsShelf();
        	    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;    padding-top: 13px;position: relative;'>"+roadId+"</div>+");
        		    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
        		    			$("#"+e.data.roadId+"_del").html("&nbsp");
        	    				$("#" + e.data.roadId + "_price_content").val("0");
        	    			});
        	    			$("#" + roadId + "_price_content").bind('input onchange',{ii:ii,roadId:roadId},function(e) { 
        	                 	var price = $("#" + e.data.roadId + "_price_content").val();
        	                 	self.realRoadsData.goodsConfigs[e.data.ii].price = price;
        	                 	self.renderGoodsShelf();
        	                 	
        	                });
        	    			$("#" + roadId + "_capacity_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
	                        	var capacity = $("#" + e.data.roadId + "_capacity_content").val();
	                        	self.realRoadsData.goodsConfigs[e.data.ii].capacity = capacity;
	                        	self.renderGoodsShelf();
	                        });
	                        $("#" + roadId + "_valve_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
	                        	var valve = $("#" + e.data.roadId + "_valve_content").val();
	                        	self.realRoadsData.goodsConfigs[e.data.ii].valve = valve;
	                        	self.renderGoodsShelf();
	                        });
        				}
        			}
    			
    			//self.renderGoodsShelf();
    			self.goodsWindow.destroy();
    			
        	});   			        
	       
		},
		initGoodsView:function(data,roadId){
			var self = this;
			$("#goods_image").html("");
			var goodsInfoHtml = "<table id='goods_table'>";
			if(data.result.length<=4){
				goodsInfoHtml = "<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
			}
        	var row = 0;
    		for(var i=0;i<data.result.length;i++){
        		if(i%4==0){
        			row = row + 1;
        			goodsInfoHtml = goodsInfoHtml + "<tr style='width:100%;'>";
        		}
        		var imagepath = data.result[i].imagepath;
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			goodsInfoHtml = goodsInfoHtml + "<td class='good_image_hover' width='20%' id="+data.result[i]._id+">"
				+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
        		if(i%4==3){
        			goodsInfoHtml = goodsInfoHtml + "</tr>";
        		}
    		}
    		goodsInfoHtml = goodsInfoHtml+"</table>"
    		$("#goods_image").html(goodsInfoHtml);
    		$("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
    		$(".good_image_hover").click(function(event){
    			var imagepath = event.target.id;
    			var price = event.srcElement.attributes.price.value;
    			var goodsId = this.id;
    			var name = event.srcElement.attributes.name.value;
    			var type = event.srcElement.attributes.type.value;
    			var typeName = event.srcElement.attributes.typeName.value;
    			var image_md5 = event.srcElement.attributes.md5.value;
    			var capacity = $("#"+roadId+"_capacity_content").val();
    			var valve = $("#"+roadId+"_valve_content").val();
    			/*if(self.realRoadsData == null||self.realRoadsData.goodsConfigs == null){
    				self.realRoadsData = new Object();
    				self.realRoadsData.goodsConfigs = new Array();
    			}*/
    			var chooseCount = 0;
    			if(event.srcElement.attributes.chooseCount){
    				chooseCount = event.srcElement.attributes.chooseCount.value;
    			}
    			var goods = {
    					"chooseCount":parseInt(chooseCount)+1
    			};
    			Service.updateGoods(goodsId,goods,function(data){
    				
    			});
    			var goodsConfig = {
    				"location_id":roadId,
    				"goods_id":goodsId,
    				"goods_name":name,
    				"goods_type":type,
    				"goods_typeName":typeName,
    				"price":price,
    				"img":imagepath,
    				"imagemd5":image_md5,
    				"capacity":capacity,
    				"valve":valve
    			};
    			for(var ii =0;ii<self.realRoadsData.goodsConfigs.length;ii++){
    				if(self.realRoadsData.goodsConfigs[ii].location_id == roadId){
    					self.realRoadsData.goodsConfigs[ii] = goodsConfig;
    					self.renderGoodsShelf();
    	    			self.goodsWindow.hiden();
    	    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    	    			$("#"+roadId).html("<div style='width: 20px;height: 10px;font-size: 12px;'>"+roadId+"</div><img src='"+src+"' style='height:60px;'/>");
    	    			$("#"+roadId+"_name_content").html(name);
    	    			//$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
/*    	    		  	 $("#" + roadId+ "_name_div").css("overflow","hidden");
                         $("#" + roadId + "_name_div").css("text-overflow","ellipsis");
                         $("#" + roadId + "_name_div").css("white-space","nowrap");*/
    	    			  $("#" + roadId + "_name_div").bind("mouseover ",function(e){
      	                	this.title=name;
      	                });
                         
    	    			$("#" + roadId + "_price_content").val(price);
    	                $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
    	              
    	    			$("#remove_road_"+roadId).bind('click',{ii:ii,roadId:roadId},function(e){
    	    				var removeconfig = {
    	                			alipay_url: "",
    	                			goods_id: undefined,
    	                			goods_name: undefined,
    	                			goods_type: undefined,
    	                			goods_typeName: undefined,
    	                			imagemd5: undefined,
    	                			img: undefined,
    	                			location_id: e.data.roadId,
    	                			price: undefined,
    	                			capacity:capacity,
    	                			valve:valve
    	                	}
    	    				self.realRoadsData.goodsConfigs[e.data.ii] = removeconfig;
    	    				self.renderGoodsShelf();
    	    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;    padding-top: 13px;position: relative;'>"+roadId+"</div>+");
    		    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
    		    			$("#"+e.data.roadId+"_del").html("&nbsp");
    	    				$("#" + e.data.roadId + "_price_content").val("0");
    	    			});
    	    			$("#" + roadId + "_price_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
    	                 	var price = $("#" + e.data.roadId + "_price_content").val();
    	                 	self.realRoadsData.goodsConfigs[e.data.ii].price = price;
    	                 	self.renderGoodsShelf();
    	                 	
    	                });
    	    			$("#" + roadId + "_capacity_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
                        	var capacity = $("#" + e.data.roadId + "_capacity_content").val();
                        	self.realRoadsData.goodsConfigs[e.data.ii].capacity = capacity;
                        	self.renderGoodsShelf();
                        });
                        $("#" + roadId + "_valve_content").bind('input onchange',{ii:ii,roadId:roadId}, function(e) { 
                        	var valve = $("#" + e.data.roadId + "_valve_content").val();
                        	self.realRoadsData.goodsConfigs[e.data.ii].valve = valve;
                        	self.renderGoodsShelf();
                        });
    				}
    			}
    			
    			self.goodsWindow.destroy();
    			
        	});
		}
    });
    return config;
});