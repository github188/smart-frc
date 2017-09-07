define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./allConfig.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("../../service");
    var UpdateSelfConfigInfo = require("./updateSelfConfig");
    	
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.data = options.data;
            this.server = options.server;
            this.version = options.version;
            this.orgName = options.orgName;
            this.desc = options.desc;
            this._renderWindow();
            this.systemData={};
            this.finalData={};
            this.baseData={};
            this.mutiselect=[];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "appVersions_down"}),
                top: "center",
                left: "center",
                height: 600,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#lastBase").val(locale.get({lang: "price_step"}));
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#nowBase").val(locale.get({lang: "immediate_upgrade"}));
            this.renderFirstPage();//绘制系统配置界面
            this.renderBtn();
        },
        renderBtn: function() {
        	var self = this;
        	$("#nextBase").bind("click", function() {
        		
        		$("#hint").text(locale.get({lang: "shelf_config_instruction"}));
        		self.finalData.server = self.server;
        		self.finalData.apps = self.data.result.config.apps;
        		self.baseData.vendor = self.data.result.vender;
        		self.baseData.orgName = self.orgName;
        		self.baseData.desc = self.desc;
        		self.mutiselect = [];
            	var data = self.data;
            		if(data.result && data.result.config){
            			if(data.result.config.systemConfig && data.result.config.systemConfig.length > 0){
            				for(var i=0;i<data.result.config.systemConfig.length;i++){
            					if(data.result.config.systemConfig[i].showType == 'text'){
            						data.result.config.systemConfig[i].value = $("#"+data.result.config.systemConfig[i].name).val();
            					}else if(data.result.config.systemConfig[i].showType == 'select'){
            						var maxSelect = data.result.config.systemConfig[i].max;
            						for(var m=0;m<maxSelect;m++){
            							var sel = $("#"+m).val();
            							if(sel != 0 && sel != null){
            								if($.inArray(sel,self.mutiselect) != -1){
            									dialog.render({lang:"paystyle_not_same"});
            				           			return;
            								}else{
            									self.mutiselect.push(sel);
            								}
            								
            							}
            							
            						}
            						
            						data.result.config.systemConfig[i].value =self.mutiselect;
            					}else if(data.result.config.systemConfig[i].showType == 'multiselect'){
            						var selectResult = $("#"+data.result.config.systemConfig[i].name).multiselect("getChecked").map(function() { 
            			                return this.value;
            			            }).get(); 
            						data.result.config.systemConfig[i].value =selectResult;
            					}else if(data.result.config.systemConfig[i].showType == 'checkBox'){
            						if(data.result.config.systemConfig[i].condition && data.result.config.systemConfig[i].condition.length>0){
            							for(var ii=0;ii<data.result.config.systemConfig[i].condition.length;ii++){
            								if(data.result.config.systemConfig[i].condition[ii].showType == 'text'){
            									data.result.config.systemConfig[i].condition[ii].value = $("#"+data.result.config.systemConfig[i].condition[ii].name).val();
            								}else if(data.result.config.systemConfig[i].condition[ii].showType == 'select'){
            									var selectResult = $("#"+data.result.config.systemConfig[i].condition[ii].name).multiselect("getChecked").map(function() { 
                        			                return this.value;
                        			            }).get(); 
            									data.result.config.systemConfig[i].condition[ii].value =selectResult;
            								}
            							}
            						}
            						data.result.config.systemConfig[i].value = $("#"+data.result.config.systemConfig[i].name).val();
            					}
            				}
            			}
            			self.finalData.systemConfig = data.result.config.systemConfig;
            			
            			this.SelfConfig = new UpdateSelfConfigInfo({
           	                  selector: "#selfConfigInfo",
           	                  automatWindow: self.adWindow,
           	                  data:self.finalData,
           	                  basedata:self.baseData,
           	                  version:self.version,
           	                  alldata:self.data,
           	                  events: {
           	                        "rendTableData": function() {
           	                             self.fire("getVersionList");
           	                         }
           	                  }
           	            });
            			$("#selfConfig").css("display", "block");
                        $("#baseInfo").css("display", "none");
                        $("#tab1").removeClass("active");
                        $("#tab2").addClass("active");
            		}
            	
        	});
        },
        renderFirstPage:function(){
        	var self = this;
        	
        	self.checkboxObj=[];
        	cloud.util.mask("#baseInfo");
        	
        	$("#hint").text(locale.get({lang: "system_config_instruction"}));
        	
        	$("#sysTab").empty();
        	var datas = self.data;
            
        	cloud.util.unmask("#baseInfo");
        		if(datas.result && datas.result.config){
        			if(datas.result.config.systemConfig && datas.result.config.systemConfig.length > 0){
        				for(var i=0;i<datas.result.config.systemConfig.length;i++){
        					if(datas.result.config.systemConfig[i].showType == 'text'){
        						
        						if(datas.result.config.systemConfig[i].value.replace(/(^\s*)|(\s*$)/g,"")=="" || datas.result.config.systemConfig[i].value == null){
        							if(datas.result.config.systemConfig[i].desc){
        								$("#sysTab").append("<tr>" +
              								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
              								   "<td width='20%'><input type='text' class='input'  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' placeholder='"+datas.result.config.systemConfig[i].format+"' style='width:200px;height:25px;'/></td>"+
              								  "<td style='color: #8d8d8d;font-size: 14px;letter-spacing: 0.8px;'><span>"+locale.get({lang: "notes"}) +":"+datas.result.config.systemConfig[i].desc+"</span></td>"+	  
             							"</tr>");
        							}else{
        								$("#sysTab").append("<tr>" +
              								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
              								   "<td><input type='text' class='input'  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' placeholder='"+datas.result.config.systemConfig[i].format+"' style='width:200px;height:25px;'/></td>"+
             							"</tr>");
        							}
        							
        						}else{
        							if(datas.result.config.systemConfig[i].desc){
        								$("#sysTab").append("<tr>" +
              								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
              								   "<td width='20%'><input type='text' class='input'  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' value='"+datas.result.config.systemConfig[i].value+"' style='width:200px;height:25px;'/></td>"+
              								  "<td style='color: #8d8d8d;font-size: 14px;letter-spacing: 0.8px;'><span>"+locale.get({lang: "notes"}) +":"+datas.result.config.systemConfig[i].desc+"</span></td>"+		  
             							"</tr>");
        							}else{
        								$("#sysTab").append("<tr>" +
              								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
              								   "<td><input type='text' class='input'  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' value='"+datas.result.config.systemConfig[i].value+"' style='width:200px;height:25px;'/></td>"+
             							"</tr>");
        							}
        							
        						}
        						
        					}else if(datas.result.config.systemConfig[i].showType == 'select'){
        						var maxSelect = datas.result.config.systemConfig[i].max;
        						var td = "<td width='55%'>";
    							for(var m=0;m<maxSelect;m++){
    								if(m != 0){
    									td = td+
  								      "<select  id='"+m+"' name='"+datas.result.config.systemConfig[i].name+"' style='width:110px;height: 30px;margin-left: 10px;border-radius: 5px;'>"+
  								      "<option value='0'>" +locale.get({lang: "please_select"})+"</option>"+
  								      "</select>"
    								}else{
    									td = td+
  								      "<select  id='"+m+"' name='"+datas.result.config.systemConfig[i].name+"' style='width:110px;height: 30px;border-radius: 5px;'>"+
  								      "<option value='0'>" +locale.get({lang: "please_select"})+"</option>"+
  								      "</select>"
    								}
    								
    							}
        						td = td + "</td>";
        						if(datas.result.config.systemConfig[i].desc){
        							
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   td+
          								  "<td style='color: #8d8d8d;font-size: 14px;letter-spacing: 0.8px;'><span>"+locale.get({lang: "notes"}) +":"+datas.result.config.systemConfig[i].desc+"</span></td>"+		  
             						"</tr>");
        						}else{
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   td+
             						"</tr>");
        						}
        						
        						if(datas.result.config.systemConfig[i].items && datas.result.config.systemConfig[i].items.length >0 ){
        							for(var j=0;j<datas.result.config.systemConfig[i].items.length;j++){
        								if(datas.result.config.systemConfig[i].value && datas.result.config.systemConfig[i].value.length >0){
        									    var valuec = datas.result.config.systemConfig[i].value;
        									    
        										if(valuec.indexOf(datas.result.config.systemConfig[i].items[j].value)!=-1){
        											for(var n=0;n<maxSelect;n++){
        												if(n == valuec.indexOf(datas.result.config.systemConfig[i].items[j].value)){
        													$("#"+n).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "' selected='selected'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        												}else{
        													$("#"+n).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        												}
        												
        											}
        											
        										}else{
        											for(var n=0;n<maxSelect;n++){
        												$("#"+n).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        											}
        											
        										}
        										
        									
        									
        								}else{
        									for(var n=0;n<maxSelect;n++){
        									      $("#"+n).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        									}
        								}
        								
        							}
        						}
        	                    
        					}else if(datas.result.config.systemConfig[i].showType == 'multiselect'){
        						
        						if(datas.result.config.systemConfig[i].desc){
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   "<td width='20%'>"+
          								      "<select  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' multiple='multiple' style='width:200px;height: 28px;'"+
          								      "</select>"+
          								   "</td>"+
          								  "<td style='color: #8d8d8d;font-size: 14px;letter-spacing: 0.8px;'><span>"+locale.get({lang: "notes"}) +":"+datas.result.config.systemConfig[i].desc+"</span></td>"+		  
             						"</tr>");
        						}else{
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   "<td>"+
          								      "<select  id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' multiple='multiple' style='width:200px;height: 28px;'"+
          								      "</select>"+
          								   "</td>"+
             						"</tr>");
        						}
        						
        						if(datas.result.config.systemConfig[i].items && datas.result.config.systemConfig[i].items.length >0 ){
        							for(var j=0;j<datas.result.config.systemConfig[i].items.length;j++){
        								if(datas.result.config.systemConfig[i].value && datas.result.config.systemConfig[i].value.length >0){
        									    var valuec = datas.result.config.systemConfig[i].value;
        									    
        										if(valuec.indexOf(datas.result.config.systemConfig[i].items[j].value)!=-1){
        											$("#"+datas.result.config.systemConfig[i].name).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "' selected='selected'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        										}else{
        											
        											$("#"+datas.result.config.systemConfig[i].name).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        										}
        										
        									
        									
        								}else{
        									
        									$("#"+datas.result.config.systemConfig[i].name).append("<option id='"+datas.result.config.systemConfig[i].items[j].name+"' value='" + datas.result.config.systemConfig[i].items[j].value + "'>" + datas.result.config.systemConfig[i].items[j].title + "</option>");
        								}
        								
        							}
        						}
        	                    $("#"+datas.result.config.systemConfig[i].name).multiselect({
        	                            header: true,
        	                            checkAllText: locale.get({lang: "check_all"}),
        	                            uncheckAllText: locale.get({lang: "uncheck_all"}),
        	                            noneSelectedText: locale.get({lang: "all_payment_types"}),
        	                            selectedText: "# " + locale.get({lang: "is_selected"}),
        	                            minWidth: 160,
        	                            height: 120
        	                     });
        					}else if(datas.result.config.systemConfig[i].showType == 'checkBox'){
        						
        						if(datas.result.config.systemConfig[i].desc){
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   "<td width='20%'><input type='checkbox' id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' style='width:20px;height:25px;margin-top: 10px;'/></td>"+
          								  "<td style='color: #8d8d8d;font-size: 14px;letter-spacing: 0.8px;'><span>"+locale.get({lang: "notes"}) +":"+datas.result.config.systemConfig[i].desc+"</span></td>"+		  
             						"</tr>");
        						}else{
        							$("#sysTab").append("<tr>" +
          								   "<td width='20%'><label><span>"+datas.result.config.systemConfig[i].title+"</span></label></td>"+
          								   "<td><input type='checkbox' id='"+datas.result.config.systemConfig[i].name+"' name='"+datas.result.config.systemConfig[i].name+"' style='width:20px;height:25px;margin-top: 10px;'/></td>"+
             						"</tr>");
        						}
        						
        						self.checkboxObj.push(datas.result.config.systemConfig[i]);
        						var value ='';
        						$("#"+datas.result.config.systemConfig[i].name).bind('click', function() {
        							var checked = $(this).context.attributes[1].value;
        							if(self.checkboxObj && self.checkboxObj.length >0){
        								for(var m=0;m<self.checkboxObj.length;m++){
        									if(checked == self.checkboxObj[m].name){
        										 var flag = $(this).attr("checked");
        	        							 if(flag == 'checked'){
        	        								 value='true';
        	        							 }else{
        	        								 value='false';
        	        							 }
        	        							 if(self.checkboxObj[m].condition){
    	        									 if(self.checkboxObj[m].condition.length >0){
    	            									 for(var j=0;j<self.checkboxObj[m].condition.length;j++){
    	            										 if(self.checkboxObj[m].condition[j].showType == 'text'){
    	            											 
    	            											 if(value == 'true'){
    	            												 
    	            												 if(self.checkboxObj[m].condition[j].value == null || self.checkboxObj[m].condition[j].value == undefined){
    	            													 
    	            													 $("#"+self.checkboxObj[m].name).after("<div style='margin-top: -20px;' id='"+self.checkboxObj[m].condition[j].title+"'><span>"+self.checkboxObj[m].condition[j].title+"</span><input type='text' class='input'  id='"+self.checkboxObj[m].condition[j].name+"' name='"+self.checkboxObj[m].condition[j].name+"' placeholder='"+self.checkboxObj[m].condition[j].format+"'   style='width:100px;height:25px;'/></div>");
    	            												 }else{
    	            													 $("#"+self.checkboxObj[m].name).after("<div style='margin-top: -20px;' id='"+self.checkboxObj[m].condition[j].title+"'><span>"+self.checkboxObj[m].condition[j].title+"</span><input type='text' class='input'  id='"+self.checkboxObj[m].condition[j].name+"' name='"+self.checkboxObj[m].condition[j].name+"'  value='"+self.checkboxObj[m].condition[j].value+"'  style='width:100px;height:25px;'/></div>");
    	            												 }
    	            												 
    	            											 }else{
    	            												 $("#"+self.checkboxObj[m].condition[j].title).remove();
    	            											 }
    	            										 }else if(self.checkboxObj[m].condition[j].showType == 'select'){
    	            											 if(value == 'true'){
    	            												 $("#"+self.checkboxObj[m].name).after("<div style='margin-top: -20px;' id='"+self.checkboxObj[m].condition[j].title+"'><span>"+self.checkboxObj[m].condition[j].title+"</span><select  id='"+self.checkboxObj[m].condition[j].name+"' name='"+self.checkboxObj[m].condition[j].name+"' multiple='multiple' style='width:200px;height: 28px;'></select></div>");
    	            											 }else{
    	            												 $("#"+self.checkboxObj[m].condition[j].title).remove();
    	            											 }
    	            											 $("#"+self.checkboxObj[m].condition[j].name).multiselect({
    	            			        	                            header: true,
    	            			        	                            checkAllText: locale.get({lang: "check_all"}),
    	            			        	                            uncheckAllText: locale.get({lang: "uncheck_all"}),
    	            			        	                            noneSelectedText: locale.get({lang: "all_payment_types"}),
    	            			        	                            selectedText: "# " + locale.get({lang: "is_selected"}),
    	            			        	                            minWidth: 160,
    	            			        	                            height: 120
    	            			        	                     });
    	            										 }
    	            									 }
    	            								 }
    	        								 }
        	        							 if(self.checkboxObj[m].items && self.checkboxObj[m].items.length >0){
        	    									 for(var j=0;j<self.checkboxObj[m].items.length;j++){
        	    										 if(self.checkboxObj[m].items[j].title == value){
        	    											 $("#"+self.checkboxObj[m].name).val(self.checkboxObj[m].items[j].value);
        	    										 }
        	    									 }
        	    								 }
        	        							 
        									}
        								}
        							}
        						});
        						
        						if(datas.result.config.systemConfig[i].condition){
        							
        							if(datas.result.config.systemConfig[i].value && datas.result.config.systemConfig[i].value!="on"){
        								
        								$("#"+datas.result.config.systemConfig[i].name).attr("checked",true);
            							$("#"+datas.result.config.systemConfig[i].name).click();
            							$("#"+datas.result.config.systemConfig[i].name).attr("checked",true);
        							}
        							
        							
        						}else{
        							
        							var items = datas.result.config.systemConfig[i].items;
            						var value = datas.result.config.systemConfig[i].value;
            						for(var l=0;l<items.length;l++){
            							if(value == items[l].value){
            								if(items[l].title == "true"){
            									$("#"+datas.result.config.systemConfig[i].name).attr("checked",items[l].title);
            								}
        									
        									$("#"+datas.result.config.systemConfig[i].name).attr("value",value);
            								
            							}       							
            						}
        							
        						}
        						
        						
        					}
        				}
        			}
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