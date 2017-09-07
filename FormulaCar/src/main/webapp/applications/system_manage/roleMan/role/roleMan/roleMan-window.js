define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.layout");
	var _Window = require("cloud/components/window");
    var Table = require("cloud/components/table");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var html= require("text!./roleMan.html");
    require("./content.css");
    
    var HistoryTrend = Class.create(cloud.Component, {
        initialize:function($super, options){
            $super(options);
            this.navList = [];
            this.appMap={};
            this.draw();
            this._loadApps();
            this.bindEvent();
            this.bindBtnEvent();
            locale.render(this);
            
        },
        containsKey:function(map,_key) {  
            var bln = false;  
            try {  
                for (i = 0; i < map.elements.length; i++) {  
                    if (map.elements[i].key == _key) {  
                        bln = true;  
                    }  
                }  
            } catch (e) {  
                bln = false;  
            }  
            return bln;  
        },  
        draw : function(){
            this.element.css({
                height : "100%"
            }).html(html);
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            Array.prototype.unique = function()
            {
            	var n = []; //一个新的临时数组
            	for(var i = 0; i < this.length; i++) //遍历当前数组
            	{
            		//如果当前数组的第i已经保存进了临时数组，那么跳过，
            		//否则把当前项push到临时数组里面
            		if (n.indexOf(this[i]) == -1) n.push(this[i]);
            	}
            	return n;
            }
            this.drawLayout();
        },
        drawLayout : function(){
            this.layout = this.element.find("div.iwos-history-content").layout({
                defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 6,
                    "spacing_closed": 6,
                    "togglerLength_closed": 50,
                    togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),  
                    resizable: false,
                    slidable: false
                },
                north: {
                    paneSelector: "#iwos-history-north",
                    size: 185
                },
                center: {
                    paneSelector: "#iwos-history-south"
                }
            });
            
            this.northLayout = this.element.find(".iwos-history-south").layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,   
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 0,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "div.iwos-history-south-toolbar",
                    size: 31
                },
                center: {
                    paneSelector: "div.iwos-history-south-charts"
              
                }
            });
        },
        _loadApps:function(){
        	 var self = this;
        	 var navs = [];
        	 var appModules = cloud.appModules;
             appModules.modules.each(function(m){
            	 if(m.id == 'smartvm-admin'){
            	 }else{
            		if(m.subNavs[0].defaultShow){
                     	navs.push(m);
                    }
            	 }
             });
             if(navs.length>0){
            	 for(var i=0;i<navs.length;i++){
            		 $("#roleapps").append("<div class='iwos-shortlist-wrapper'  style='float:left;margin-left:5px;border: 2px solid rgb(57, 181, 74);'>"+
                           "<div class='iwos-shortlist-item'><span style='letter-spacing: 1px;display:inline-block;width:133px'>"+locale.get(navs[i].name)+"</span></div>"+
                           "<em class='checkbox' style='display: inline;' id="+navs[i].id+" navName="+locale.get(navs[i].name)+"></em>"+
                        "</div>");
            		 if(navs[i].subNavs[0].subModule && navs[i].subNavs[0].subModule.length >0){
            			 for(var j=0;j<navs[i].subNavs[0].subModule.length;j++){
            				 if(navs[i].subNavs[0].subModule[j].subApp && navs[i].subNavs[0].subModule[j].subApp.length>0){
            					 for(var k=0;k<navs[i].subNavs[0].subModule[j].subApp.length;k++){
            						 if(navs[i].subNavs[0].subModule[j].subApp[k].defaultShow){
            							 var navObj={
        										 id:navs[i].id,
        										 name:navs[i].subNavs[0].subModule[j].subApp[k].name,
        			            		         operation:navs[i].subNavs[0].subModule[j].subApp[k].operation
        								 };
        								 self.navList.push(navObj);
                					 }
            					 }
            					
            				 }else{
            					 if(navs[i].subNavs[0].subModule[j].defaultShow){
    								 var navObj={
    										 id:navs[i].id,
    										 name:navs[i].subNavs[0].subModule[j].name,
    			            		         operation:navs[i].subNavs[0].subModule[j].operation
    								 };
    								 self.navList.push(navObj);
    							 }
            				 }
            							 
            			 }
            		 }
            	 }
             }
        },
        bindEvent:function(){
        	var self = this;
        	var items = $('.iwos-shortlist-wrapper');
        	items.click(function() {
				var checkbox = $(this).find('em');
				var id = checkbox[0].attributes[2].value;
				var height = 100;
				if(id == 'smartvm-statistics'){
					height = 150;
				}else if(id == 'smartvm-monitor'){
					height = 95;
				}else if(id == 'smartvm-system_vm'){
					height = 210
				}else if(id == 'smartvm-app'){
					height = 150;
				}else if(id == 'smartvm-smartVm'){
					height = 150;
				}else if(id == 'smartvm-services'){
					height = 150;
				}
				var navName = checkbox[0].attributes[3].value;
				var	className = checkbox.attr('class');
				if(className.indexOf('checkbox-checked') >= 0) {
					checkbox.removeClass('checkbox-checked');
					self.removeRolePermission(id);
				} else {
					checkbox.addClass('checkbox-checked');
					self.addRolePermission(id,navName,height);
				}
			});
        },
        addRolePermission:function(id,navName,height){
        	var self = this;
        	$("#rolePermission").append("<div class='iwos-history-vardata ui-helper-clearfix' id='per_"+id+"' style='height:"+height+"px;background-color: #F5F6F9;'>"+
        			"<div class='per-history-vars-header'>"+
                     "<span style='letter-spacing: 1px;'>"+navName+"</span>"+
                    "</div>"+ 
                    "<div id='role_"+id+"'></div>"+
        	"</div>");
        	if(id =='smartvm-monitor'){
        		$("#role_"+id).append("<div class='module-info-role-items'>"+
         			   "<div class='module-info-role-items-text'>"+
         			        "<input id='ih_apGis' class='father' type='checkbox' group='1' number='0'>"+
         			        "<label for='ih_apGis' lang='text:monitor' style='color: rgb(0, 0, 0);letter-spacing: 1px;'>"+locale.get({lang:"monitor"})+"</label>"+
         			   "</div>"+
         			   "<div class='module-info-role-item'>"+
 			                "<input id='ih_apGis_r' class='child' type='checkbox' group='1' number='1' oper='r'>"+
 			                "<label for='ih_apGis_r' lang='text:read' style='color: rgb(0, 0, 0);letter-spacing: 1px;'>"+locale.get({lang:"role_r"})+"</label>"+
 		               "</div>"+
         			"</div>");
        		$("#ih_apGis_r").attr("checked",true);
				$("#ih_apGis").attr("checked",true);
	    		var per=permission.appInfo("apGis");
				
    			if(per.read && per.read.length>0){
    				var list = [];
    				for(var m=0;m<per.read.length;m++){
    					list.push(per.read[m]);
	    			}
    				if(self.appMap["ih_apGis"]){
    					for(var n=0;n<list.length;n++){
    						self.appMap["ih_apGis"].push(list[n]);
		    			}
    				}else{
    					self.appMap["ih_apGis"] = list;
    				}
    			}
        	}else{
        		if(this.navList && this.navList.length >0){
        			for(var i=0;i<this.navList.length;i++){
        				if(id == this.navList[i].id && this.navList[i].name != 'role_manage' && this.navList[i].name != 'user_manager'){
        					$("#role_"+id).append("<div class='module-info-role-items' style='float: left;'>"+
        		         			   "<div class='module-info-role-items-text'>"+
        		         			        "<input id='ih_"+this.navList[i].name+"' class='father' type='checkbox' group='1' number='0'>"+
        		         			        "<label for='ih_"+this.navList[i].name+"'  style='color: rgb(0, 0, 0);letter-spacing: 1px;'>"+locale.get(this.navList[i].name)+"</label>"+
        		         			   "</div>"+
        		         			   "<div class='module-info-role-item' id='"+this.navList[i].name+"_0'>"+
        		 		               "</div>"+
        		         			"</div>");
        					if(this.navList[i].operation && this.navList[i].operation.length >0){
        						for(var j=0;j<this.navList[i].operation.length;j++){
        							$("#"+this.navList[i].name+"_0").append("<input id='ih_"+this.navList[i].name+"_"+this.navList[i].operation[j]+"' class='child'  oper='"+this.navList[i].operation[j]+"' style='margin: 5px;padding: 5px;' type='checkbox' group='1' number='1'>"+
			                         "<label style='color: rgb(0, 0, 0);letter-spacing: 1px;'>"+locale.get("role_"+this.navList[i].operation[j])+"</label>");
        							if(this.navList[i].operation[j]=='r'){
        								$("#ih_"+this.navList[i].name+"_"+this.navList[i].operation[j]).attr("checked",true);
        								$("#ih_"+this.navList[i].name).attr("checked",true);
        								var str=$("#ih_"+this.navList[i].name).attr('id');
        					    		var per=permission.appInfo(this.navList[i].name);
        				    			if(per.read && per.read.length>0){
        				    				var list = [];
        				    				for(var m=0;m<per.read.length;m++){
        				    					list.push(per.read[m]);
        					    			}
        				    				if(self.appMap[str]){
        				    					for(var n=0;n<list.length;n++){
        				    						self.appMap[str].push(list[n]);
        						    			}
        				    				}else{
        				    					self.appMap[str] = list;
        				    				}
        				    			}
        				    			
        							}
        						}
        					}
                        }
        			}
        		}
        	}
        	this.checkboxClickEvent();
        },
        checkboxClickEvent:function(){
        	var self = this;
        	$(".father").unbind();
        	$(".father").bind("click",function(){
        		var str=$(this)[0].id;
        		str = str.substring(3,str.length);
        		var per=permission.appInfo(str);
        		if($(this).attr("checked")){
        			$("#"+$(this)[0].id+"_r").attr("checked", true);
        			if(per.read && per.read.length>0){
        				var list = [];
        				for(var i=0;i<per.read.length;i++){
        					list.push(per.read[i]);
		    			}
        				if(self.appMap[$(this)[0].id]){
        					for(var i=0;i<list.length;i++){
        						self.appMap[$(this)[0].id].push(list[i]);
    		    			}
        				}else{
        					self.appMap[$(this)[0].id] = list;
        				}
        			}
        		}else{
        			$("#"+$(this)[0].id+"_r").attr("checked", false);
		    		$("#"+$(this)[0].id+"_w").attr("checked", false);
    				self.appMap[$(this)[0].id]=[];
        		}

        	});
        	$(".child").unbind();
        	$(".child").bind("click",function(){
        		var str=$(this)[0].id;
        		var str1 = str.substring(3,str.length);
        		var newstr = str.substring(0,str.length-2);
        		var str2=str1.substring(0,str1.length-2);
		    	var per=permission.appInfo(str2);
		    	if($(this).attr("oper") == 'r'){
		    		if($(this).attr("checked")){
		    			$("#"+newstr).attr("checked", true);
		    			if(per.read && per.read.length>0){
	        				var list = [];
	        				for(var i=0;i<per.read.length;i++){
	        					list.push(per.read[i]);
			    			}
	        				if(self.appMap[$(this)[0].id]){
	        					for(var i=0;i<list.length;i++){
	        						self.appMap[newstr].push(list[i]);
	    		    			}
	        				}else{
	        					self.appMap[newstr] = list;
	        				}
	        			}
		    		}else{
		    			$("#"+newstr).attr("checked", false);
		    			$("#"+newstr+"_w").attr("checked", false);
		    			self.appMap[newstr]=[];
		    		}
		    	}else if($(this).attr("oper") == 'w'){
		    		if($(this).attr("checked")){
		    			if(per.write && per.write.length>0){
	        				var list = [];
	        				for(var i=0;i<per.write.length;i++){
	        					list.push(per.write[i]);
			    			}
	        				for(var i=0;i<per.read.length;i++){
	        					list.push(per.read[i]);
			    			}
	        				if(self.appMap[newstr]){
	        					for(var i=0;i<list.length;i++){
	        						self.appMap[newstr].push(list[i]);
	    		    			}
	        				}else{
	        					self.appMap[newstr] = list;
	        				}
	        			}
		    			$("#"+newstr).attr("checked", true);
		    			$("#"+newstr+"_r").attr("checked", true);
		    		}else{
		    			$("#"+newstr+"_w").attr("checked", false);
		    			if(per.write && per.write.length>0){
			    			for(var i=0;i<per.write.length;i++){
			    				if(self.appMap[newstr].indexOf(per.write[i])>-1){
			    					self.appMap[newstr].remove(per.write[i]);
			    				}
			    			}
			    		}
		    		}
		    	}

        	});
        },
        bindBtnEvent:function(){
        	var self = this;
        	$("#submit").bind("click",function(){
        		self.acceptList = [];
        		for (var key in self.appMap) { 
        			for(var i=0;i<self.appMap[key].length;i++){
        				self.acceptList.push(self.appMap[key][i]);
        			}
			    } 
        		
        		var roleName = $("#roleName").val();
        		var record = {};
            	record.name = roleName;
            	record.type = 52;
            	record.privileges = {
            		"accept": self.acceptList.unique(),
            		"deny": [],
            		"default": "none"
            	};
            	if(roleName==null||roleName==""){
            		dialog.render({lang:"role_name_is_not_null"});
            	    return;
                }
            	if(self.acceptList.unique().length>0){
            	}else{
            		dialog.render({lang:"please_select_at_least_one_of_the_permissions"});
            	    return;
            	}
            	cloud.Ajax.request({
        			url: "api2/roles",
        			type: "POST",
        			data:record,
        			error: function(err) {
        				if(err.error.indexOf("already exists") > -1) {
        					dialog.render({lang:"role_already_exists"});
        				}
        			},
        			success: function(data) {
        				if(data.result._id) {
        					dialog.render({lang:"save_success"});
        					self.fire("onClose");
        				}
        			}
        		});
        	});
            $("#cancel").bind("click",function(){
 		    	self.fire("onClose");
 		    });
        },
        removeRolePermission:function(id){
        	var self = this;
        	$("#per_"+id).remove();
        	$("#role_"+id).remove();
        	var navs = [];
        	var appModules = cloud.appModules;
            appModules.modules.each(function(m){
            	if(m.subNavs[0].defaultShow){
            		navs.push(m);
            	}
            });
            
            var navsnameA = id.split("-");
            var navsname = navsnameA[navsnameA.length-1];
            for(var i=0;i<navs.length;i++){
            	if(navsname == navs[i].name){
            		
            		if(navsname == "monitor"){
            			
            			self.appMap["ih_apGis"] = [];
            			
            		}else{
                        for(var j=0;j<navs[i].subNavs[0].subModule.length;j++){
                			
            				if(navs[i].subNavs[0].subModule[j].subApp && navs[i].subNavs[0].subModule[j].subApp.length>0){
	            				
            					for(var k=0;k<navs[i].subNavs[0].subModule[j].subApp.length;k++){
                    				
                    				self.appMap["ih_"+navs[i].subNavs[0].subModule[j].subApp[k].name] = [];
                    				
                    			}
            					
	            			}else{
	                				
	                				self.appMap["ih_"+navs[i].subNavs[0].subModule[j].name] = [];
	            				
	            			}
                			
                		}
            		}
            		
            	}
            	
            	
            }
            
        },
        destroy : function(){
        }
    });
    return HistoryTrend;
});