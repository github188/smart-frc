define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./goodsConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../service");
	require("./css/table.css");
	require("./css/style.css");
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.roadStartingNumber = options.roadStartingNumber;
			this.allNumber = options.allNumber;
			this.machineType = options.machineType;
			this.vender= options.vender;
			this.modelName= options.modelName;
			this.rowList = options.rowList;
			this.otherRowConfig=[];
			this.rowData = options.rowData;
			this.id = options.id;
			this.render();
			this.goodsWinWidth = 458;
	        this.goodsWinHeight = 378;
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			if(this.machineType == 1){//饮料机
				this.showAndInitRoads_main();
			}else if(this.machineType == 2 ||this.machineType == 3){//弹簧机 格子柜
				this.showAndInitRoads_other(this.rowData);
			}
			this.bindEvent();
		},
		showAndInitRoads_main:function(){
			var roadStartingNumber = this.roadStartingNumber;
			var roadNumber = this.allNumber;
			var roadNumber_new;
			if(roadStartingNumber == 0){
				roadNumber_new = parseInt(roadNumber);
			}else{
				roadNumber_new = parseInt(roadNumber) + parseInt(roadStartingNumber);
			}
			var roadInfoHtml = "<table id='road_table' style='width:860px;'>";
			var row = 0;
			for(var i=0;i<roadNumber_new;i++){
				if(i < roadStartingNumber){
    			}else{
    				var numbers = parseInt(roadStartingNumber);
    				if(i%8 == numbers){
            			row = row + 1;
            			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
            		}
    				
    				var total = (roadNumber)/8;
	        		var sp = (roadNumber)%8;
	        		var width=0;
	        		if(total<1){
	        			width = sp*12.5;
	        			
	        		}else{
	        			width = 100;
	        			
	        		}
            		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
            										"<table style='width:"+width+"%'>"+
            											"<tr style='height:82px;width:100%'><td id='"+i+"' class='road_td_image' style='font-size:20px;'><div style='width: 20px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+i+"</div></td></tr>"+
            										"</table>"+
            									  "</td>";
            		if(i%8 == (7+numbers)){
            			roadInfoHtml = roadInfoHtml + "</tr>";
            		}
    			}
    		}
			$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		//$("#road_table").css({"height":"auto"});
		},
		showAndInitRoads_other:function(rowData){
			var self = this;
			var roadInfoHtml = "<table id='road_table' style='width:860px;height:400px;table-layout:fixed;'>" +
					"<tr style='width:100%;height:0'>";
					
			var maxnum = 0;
			for(var k=0;k<self.rowList.length;k++){
				var num = self.rowList[k].number;
				if(parseInt(num) > parseInt(maxnum)){
					maxnum = parseInt(num);
				}
			}
			for(var j=0;j<maxnum;j++){
				roadInfoHtml = roadInfoHtml + "<td style='width:108px;'></td>";
				if(j == maxnum){
					roadInfoHtml = roadInfoHtml + "</tr>";
				}
			}
			
			if(rowData){
				var rows = this.rowList;
				var count = 0;
				var row = 0;
				var roadStartingNumber =0;
				if(rows && rows.length >0){
					for(var m=0;m<rows.length;m++){
						
						var numbers = parseInt(roadStartingNumber);
	            			
	            		roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px;overflow:auto;white-space:nowrap;'>";
	            		
						//count = count + parseInt(rows[m].number);
						
						for(var i=0;i<parseInt(rows[m].number);i++){
							if(i < roadStartingNumber){
			    			}else{
			            		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
			            										"<table style='width:100%'>"+
			            											"<tr style='height:82px;width:100%'><td id='"+count+"' class='road_td_image' style='font-size:20px;'></td></tr>"+
			            											"<tr style='width:100%;text-align:center;font-size:10px;' id='" + count + "_road'><td><div style='width: 40px;height: 10px;margin-top: -25px;position: relative;margin-left: 35px;'><input type='text' class='shelfCls'  style='width:40px;height: 10px;'  id='" + rowData[count].shelvesId + "_cid'  value='"+rowData[count].shelvesId+"' />&nbsp;</div></td></tr>" +
			            										"</table>"+
			            									  "</td>";
			            		this.otherRowConfig[count]=count+"";
			            		count++;
			            		
			    			}
			    		}
						
	            		roadInfoHtml = roadInfoHtml + "</tr>";
	            		
					}
				}
			}else{
				var rows = this.rowList;
				var count = 0;
				var row = 0;
				var roadStartingNumber =0;
				if(rows && rows.length >0){
					for(var m=0;m<rows.length;m++){
						
						var numbers = parseInt(roadStartingNumber);
	            			
	            		roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px;overflow:auto;white-space:nowrap;'>";
	            		
						//count = count + parseInt(rows[m].number);
						
						for(var i=0;i<parseInt(rows[m].number);i++){
							if(i < roadStartingNumber){
			    			}else{
			            		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
			            										"<table style='width:100%'>"+
			            											"<tr style='height:82px;width:100%'><td id='"+count+"' class='road_td_image' style='font-size:20px;'></td></tr>"+
			            											"<tr style='width:100%;text-align:center;font-size:10px;' id='" + count + "_road'><td><div style='width: 40px;height: 10px;margin-top: -25px;position: relative;margin-left: 35px;'><input type='text' class='shelfCls'  style='width:40px;height: 10px;'  id='" + count + "_cid'  value='"+count+"' />&nbsp;</div></td></tr>" +
			            										"</table>"+
			            									  "</td>";
			            		this.otherRowConfig[count]=count+"";
			            		count++;
			            		
			    			}
			    		}
						
	            		roadInfoHtml = roadInfoHtml + "</tr>";
	            		
					}
				}
				
				
			}
			$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		//$("#road_table").css({"height":"auto"});
    		
    		$(".shelfCls").bind("input onchange" , function(){
    			var shelvesId = $("#" + this.id).val();
    			var i=this.id.split("_")[0];
    			self.otherRowConfig[i]=shelvesId;
    		});
		},
		bindEvent:function(){
			var self = this;
			//上一步
			$("#model_last_step").click(function(){
				$("#selfConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab1").addClass("active");
			});
			//完成
            $("#model_submit").click(function(){
            	var roadStartingNumber = self.roadStartingNumber;
            	var roadNumber = self.allNumber;
            	var machineType = self.machineType;
            	var vender= self.vender;
            	var modelName= self.modelName;
            	
            	var shelves=[];
            	var typeconfig=[];
            	
            	if(machineType == 1){
            		var roadNumber_new;
        			if(roadStartingNumber == 0){
        				roadNumber_new = parseInt(roadNumber);
        			}else{
        				roadNumber_new = parseInt(roadNumber) + parseInt(roadStartingNumber);
        			}
        			for(var i=roadStartingNumber;i<roadNumber_new;i++){
        				var config={
        						shelvesId:i+""
        				};
        				shelves.push(config);
        			}
        			
        			var typeObj={
        					row:roadStartingNumber,
        					number:roadNumber
        			};
        			typeconfig.push(typeObj);
        			
            	}else if(machineType == 2 || machineType == 3){
            		if(self.otherRowConfig && self.otherRowConfig.length>0){
            			for(var i =0;i<self.otherRowConfig.length;i++){
            				var config={
            						shelvesId:self.otherRowConfig[i]+""
            				};
            				shelves.push(config);
            			}
            		}
            		typeconfig = self.rowList;
            	}
            	var finalData = {
            	     name:modelName,
            		 vender:vender,
            		 machineType:machineType,
            		 shelves:shelves,
            		 config:typeconfig
            	};
            	if(self.id){
            		Service.updateModel(self.id,finalData,function(data){
                		if (data.error_code == null) {
                			self.automatWindow.destroy();
         	             	self.fire("rendTableData");
                        } else if (data.error_code == "70011") {//
                            dialog.render({lang: "model_name_num_exists"});
                            return;
                        }
                	});
            	}else{
            		Service.addModel(finalData,function(data){
                		if (data.error_code == null) {
                			self.automatWindow.destroy();
         	             	self.fire("rendTableData");
                        } else if (data.error_code == "70011") {//
                            dialog.render({lang: "model_name_num_exists"});
                            return;
                        }
                		
                	});
            	}
            	
			});
		}
		
	});
	return config;
});