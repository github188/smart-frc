define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./goodsConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("../css/table.css");
	require("../css/style.css");
	var KeyConfigInfo = require("../keyConfig/keyInfoconfig");
	var Service = require("../../../service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			
			this.machineType = options.machineType;//货柜类型
			this.vender= options.vender;//厂家
			this.modelName= options.modelName;//型号
			this.number = options.number;
			
			this.startNumber= options.startNumber;
            this.allNumber= options.allNumber;
            
			this.ids = options.id;
			this.shelves = options.shelves;
	        this.keyConfig = options.keyConfig;
	        this.itemNumberConfig = options.itemNumberConfig;
			this.render();
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.renderSelf();
			this.bindEvent();
		},
		renderSelf:function(){
			$('#editSelf').html('');
			var roadNumber_new;
			if(this.startNumber == 0){
				roadNumber_new = parseInt(this.startNumber);
			}else{
				roadNumber_new = parseInt(this.allNumber) + parseInt(this.startNumber);
			}
			var roadInfoHtml = "<table id='road_table' style='width:100%;'>";
			var row = 0;
			for(var i=0;i<roadNumber_new;i++){
				if(i < this.startNumber){
    			}else{
    				var numbers = parseInt(this.startNumber);
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
			$("#editSelf").html(roadInfoHtml);
		},
		bindEvent:function(){
			var self = this;
			//上一步
			$("#model_last_step").click(function(){
				$("#selfConfig").css("display", "none");//货道信息
                $("#baseInfo").css("display", "block");//基本信息
                $("#keyConfig").css("display", "none");//键盘信息
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab1").addClass("active");
			});
			//完成
            $("#model_submit").click(function(){
            	var selfList=[];
            	var tableObj = document.getElementById("road_table");
            	if(tableObj){
            		if(tableObj.rows.length>0){
            			for(var i=0;i<tableObj.rows.length;i++){
            				var columnList=[];
                    		for(var j=0;j<tableObj.rows[i].cells.length;j++){
                    			var obj={};
                    			var cell = tableObj.rows[i].cells[j].children[0].innerText;
                    			obj.shelvesId = cell;
                    			columnList.push(obj);
                    		}
                    		selfList.push(columnList);
            			}
            		}
            	}
            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	console.log(finalData);
            	if(self.ids){
            		Service.updateModel(eurl,self.ids,finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                	});
            	}else{
            		Service.addModel(eurl,finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                	});
            	}
            	
			});
            //下一步
            $("#model_next_step").click(function(){
            	var selfList=[];
            	var tableObj = document.getElementById("road_table");
            	if(tableObj){
            		if(tableObj.rows.length>0){
            			for(var i=0;i<tableObj.rows.length;i++){
            				var columnList=[];
                    		for(var j=0;j<tableObj.rows[i].cells.length;j++){
                    			var obj={};
                    			var cell = tableObj.rows[i].cells[j].children[0].innerText;
                    			obj.shelvesId = cell;
                    			columnList.push(obj);
                    		}
                    		selfList.push(columnList);
            			}
            		}
            	}
            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	 this.KeyConfig = new KeyConfigInfo({
   	                 selector: "#keyConfig",
   	                 automatWindow: self.automatWindow,
   	                 id:self.ids,
   	                 data:finalData,
   	                 keyConfig:self.keyConfig,
   	                itemNumberConfig:self.itemNumberConfig,
   	                 events: {
   	                      "rendTableData": function() {
   	                           self.fire("rendTableData");
   	                       }
   	                  }
   	             });
            	
				$("#selfConfig").css("display", "none");//货道信息
                $("#baseInfo").css("display", "none");//基本信息
                $("#keyConfig").css("display", "block");//键盘信息
                $("#tab2").removeClass("active");
                $("#tab1").removeClass("active");
                $("#tab3").addClass("active");
			});
		}
		
	});
	return config;
});