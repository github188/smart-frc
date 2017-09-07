define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeModel.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var Vender = require("./vender/list/list");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this.name = options.name;
            this._renderWindow();
            this.shelves = null;
            this.keyConfig = null;
            this.existstag = false;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: this.name,
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
            this.automatWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this.render();
        },
        render:function(){
        	var self = this;
        	this.renderMachineType();//获取货柜类型
        	
        	var language = locale._getStorageLang();
             if(language =='en'){
            	 this._renderGetVender();//获取厂家
             }else{
              	$("#vender_add_button").css("display","none");
              	this.init();
             }

             this.bindEvent();
	        if(this.id){
	        	Service.existsAutomat(this.id,function(data){
            		if(data.error!=null){
            			 if(data.error_code == "70028"){
            				 self.existstag = true;
                             $("#vender").attr('disabled', 'true');
                             $("#machineType").attr('disabled', 'true');
                             $("#modelName").attr('disabled', 'true');
            			 }
            		}
            	});
	           this.getData();
	        }      
        },
        init:function(){
        	var currentHost=window.location.hostname;
        	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
        	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
        	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
        	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
        	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
        	$("#vender").append("<option value='leiyunfeng'>"+locale.get({lang: "leiyunfeng"})+"</option>");
        },
        renderMachineType:function(){
        	$("#machineType").html("");
        	$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	
        	var languge = localStorage.getItem("language");
            if (languge == "en") {
    			$("#machineType").append("<option value='1'>Beverage machine</option>");
            	$("#machineType").append("<option value='2'>Snack machine</option>");
            }else{
            	$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
            	$("#machineType").append("<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>");
            	$("#machineType").append("<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>");
            }
        },
        getData:function(){
        	var self = this;
        	var language = locale._getStorageLang();
            cloud.util.mask("#baseInfo");
        	Service.getModelById(eurl,self.id, function(data) {
        		console.log(data.result);
       		    $("#modelName").val(data.result.name==null?"":data.result.name);
       		    $("#vender option[value='"+data.result.number+"']").attr("selected","selected");
       		    if(data.result.number == "fuji"){
       		    	$("#machineType").append("<option value='4'>"+locale.get({lang:"coffee_machine"})+"</option>");
       		    	$("#machineType").append("<option value='5'>"+locale.get({lang:"wine_machine"})+"</option>");
       		    }
       		    $("#machineType option[value='"+data.result.machineType+"']").attr("selected","selected");
       		    self.shelves = data.result.shelves;
				self.keyConfig = data.result.keyConfig;
				self.itemNumberConfig = data.result.itemNumberConfig;
				
				if(data.result.machineType == 1&&language!="en" || data.result.machineType == 4 || data.result.machineType == 5){
        			$("#zhugui").css("display","block");
        		}else{
        			$("#zhugui").css("display","none");
        		}
				
				if(data.result.machineType == 1 || data.result.machineType == 5){//饮料机 白酒机
					self.renderYL(data);
				}else if(data.result.machineType == 4){//咖啡机
					self.renderCoffee(data);
				}else{//弹簧机或者格子柜
					self.renderTG(data);
				}
				cloud.util.unmask("#baseInfo");
        	});
        },
        renderYL:function(data){//饮料机
        	$('#editSelf').html('');
			if(data.result.shelves && data.result.shelves.length>0){
    		    var startNumber = data.result.shelves[0][0].shelvesId;
    			var allNumber=0;
    			for(var i=0;i<data.result.shelves.length;i++){
    			   allNumber = allNumber + data.result.shelves[i].length;
    		    }
    			
    			var roadNumber_new;
				if(this.startNumber == 0){
					roadNumber_new = parseInt(startNumber);
				}else{
					roadNumber_new = parseInt(allNumber) + parseInt(startNumber);
				}
				var roadInfoHtml = "<table id='road_table' style='width:100%;'>";
				var row = 0;
				for(var i=0;i<roadNumber_new;i++){
					if(i < startNumber){
	    			}else{
	    				var numbers = parseInt(startNumber);
	    				if(i%6 == numbers){
	            			row = row + 1;
	            			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:50px;'>";
	            		}
	            		
	            		roadInfoHtml = roadInfoHtml +"<td><div id='"+i+"' class='selfTableOther' style='width:80px;'>"+i+"</div></td>";
	            		
	            		if(i%6 == (5+numbers)){
	            			roadInfoHtml = roadInfoHtml + "</tr>";
	            		}
	    			}
	    		}
    	    }
			
			$("#editSelf").html(roadInfoHtml);
        },
        renderTG:function(data){//弹簧机 格子柜
        	if(data.result.shelves && data.result.shelves.length>0){
				$('#editSelf').html('');
				var flag = 1000000;
				for(var i=0;i<data.result.shelves.length;i++){
					$('#editSelf').append("<table id='"+flag+"_table' class='selfClass'><tr id='"+flag+"_tr'></tr></table>");
					for(var j=0;j<data.result.shelves[i].length;j++){
						$("#"+flag+"_tr").append("<td><div id='"+j+"_"+flag+"' class='selfTableOther' title='"+locale.get({lang: "edit_self_number"})+"'>"+data.result.shelves[i][j].shelvesId+"</div></td>");
					}
					if(!this.existstag){
						$("#"+flag+"_tr").append("<td><div class='selfTable_grey' title='"+locale.get({lang: "each_licensed_channel_numbe"})+"'>"+data.result.shelves[i].length+"</div></td>");
					}
					flag = flag+1;
				 }
		     }		
        },
        renderCoffee:function(data){
        	var shelves = data.result.shelves;
			$(".shelfTable").each(function(){
				$(this).css("background","white");
			});
			self.fixrow = shelves.length + 1;
			for(var i=0;i<shelves.length;i++){
				var tableObj = shelves[i];
				$("#editSelf").append("<table style='border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;margin:10px;' id='table_"+i+"' class='selfClass'><tr id='tr_"+i+"'><td id='td_"+i+"'></td></tr></table>");
                for(var j=0;j<tableObj.length;j++){
					var location_id = tableObj[j].shelvesId;
					var type = tableObj[j].goodstype;
					var sugar = tableObj[j].sugar;
					var sugarText = "";
					if(sugar == "true"){
						sugarText = "加糖";
					}
					var milk = tableObj[j].milk;
					var milkText = "";
					if(milk == "true"){
						milkText = "加奶";
					}
					var measurement = tableObj[j].measurement;
					var measurementText = "";
					if(measurement == "1"){
						measurementText = "小杯";
					}else if (measurement == "2"){
						measurementText = "大杯";
					}
					var tempmode = tableObj[j].tempmode;
					var tempmodeText = "";
					if(tempmode == "0"){
						tempmodeText = "常温";
					}else if(tempmode == "1"){
						tempmodeText = "冷";
					}else if(tempmode == "2"){
						tempmodeText = "热";
					}
					var ice = tableObj[j].ice;
					var iceText = "";
					if(ice == "true"){
						iceText = "加冰";
					}
					
					var sv = type+"-"+tempmode+"-"+sugar+"-"+milk+"-"+measurement+"-"+ice;
					/*if(j == tableObj.length-1){
						$("#td_"+i).before("<td><div id='div_"+location_id+"' class='selfTableCoffee_'><span class='shelfNum' id='"+sv+"'>"+location_id+"</span><span class='shelft'>"+type+"</span><span class=''></span><span class='shelfb'>"+measurementText+"</span><span class='shelfb'>"+sugarText+"</span><span class='shelfb' >"+tempmodeText+"</span><span class='shelfb' >"+milkText+"</span><span class='shelfb' >"+iceText+"</span></div></td>");
					}else{
						$("#td_"+i).before("<td style='border-right: 1px solid black;'><div id='div_"+location_id+"' class='selfTableCoffee_'><span class='shelfNum' id='"+sv+"'>"+location_id+"</span><span class='shelft'>"+type+"</span><span class=''></span><span class='shelfb'>"+measurementText+"</span><span class='shelfb'>"+sugarText+"</span><span class='shelfb' >"+tempmodeText+"</span><span class='shelfb' >"+milkText+"</span><span class='shelfb' >"+iceText+"</span></div></td>");
					}*/
					$("#td_"+i).before("<td style='border-right: 1px solid black;'><div id='div_"+location_id+"' class='selfTableCoffee_'><span class='shelfNum' id='"+sv+"'>"+location_id+"</span><span class='shelft'>"+type+"</span><span class=''></span><span class='shelfb'>"+measurementText+"</span><span class='shelfb'>"+sugarText+"</span><span class='shelfb' >"+tempmodeText+"</span><span class='shelfb' >"+milkText+"</span><span class='shelfb' >"+iceText+"</span></div></td>");
					
				}
			}
        },
        bindEvent:function(){
        	var self =this;
        	$("#closeBase").bind("click", function() {
        		self.automatWindow.destroy();
        	});
        },
        _renderGetVender:function(){
        	var self = this;
        	$("#vender").html("");
			$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList(eurl,0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender").append("<option value='" +data.result[i].number + "'>" +data.result[i].name+"</option>");
					}
					
				}
				
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
