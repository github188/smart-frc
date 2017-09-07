define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("./service");

    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.onlineType = options.onlineType;
            this._render();
        },
        _render: function() {
            this.drawV2();
            this.getData();
        },
        drawV2: function() {
            var self = this;
            self._renderForm();
            self._renderSelect();
            self._renderGetData();
            self.renderVender_zh_cn();
        },
        
        _renderForm: function() {
            var self = this;
            var $htmls = $(+"<div></div>" +
                    "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                    "<div style='float:left;margin-left:5px;' id='selecta'>" +
                    "<select id='online'  name='online' style='width:100px;height: 28px;'>" +
                    "<option value='-1'>" + locale.get({lang: "online_state"}) + "</option>" +
                    "<option value='0'>" + locale.get({lang: "online"}) + "</option>" +
                    "<option value='1'>" + locale.get({lang: "offline"}) + "</option>" +
                    "</select>" +
                    "</div>" +
                    "<div style ='float: left;margin-left:5px;'>" +
                    "<select  id='userarea'  multiple='multiple'  style='width:150px;height: 28px;'></select>&nbsp;&nbsp;" + //	区域
                    "</div>" + 
                    "<div id='line_div' style='float:left;'>" +
                    "<select  id='userline'  multiple='multiple'  style='width:180px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
                    "</div>" +
                    "<div style='float:left;margin-left: 2px;'>" +
                    "<select id='search'  name='search' style='width:110px;height: 28px; margin-left: -3px;'>" +
                    "<option value='0'>" + locale.get({lang: "automat_no1"}) + "</option>" +
                    "<option value='1'>" + locale.get({lang: "automat_site_name"}) + "</option>" +
                    "<option value='2'>" + locale.get({lang: "automat_name"}) + "</option>" +
                    "<option value='3'>厂家</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;margin-left:8px;'>" +
                    "<input style='width:150px; margin-left: -9px;' type='text'  id='searchValue' />" +
                    "</div>" +
                    "<div style='float:left;'>"+
                    "<select id='vender'  name='vender'  style='width:150px;height: 28px;margin-top: 0px;display:none;'>"+
                    "</select>"+
                    "</div>"+
                    "<div id='buttonDiv' style='float:left;'></div>" +
                    "</div>");

            this.element.append($htmls);
            
            $("#search").bind('change',function(){
            	var search_value = $('#search option:selected').val();
            	if(search_value == 3){
            		$("#vender").css("display","block");
            		$("#searchValue").css("display","none");
            	}else{
            		$("#searchValue").css("display","block");
            		$("#vender").css("display","none");
            	}
            });
            
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#userarea").multiselect({
                	
                    header: false,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "user_area"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 150,
                    height: 120
                    
                });
                $("#userline").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "automat_line"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 180,
                    height: 120
                });
                if(cloud.style == 1){
                	if(cloud.online!=null && cloud.online == 0){
       	            	$("#online option[value='0']").attr("selected","selected");
       	            }else if(cloud.online && cloud.online == 1){
       	            	$("#online option[value='1']").attr("selected","selected");
       	            }
                }
              
            });
        
                
        },
        renderVender_zh_cn:function(){
			$("#vender").html("");
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){
        		$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            }else if(currentHost == "www.dfbs-vm.com"){
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            }else {
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
            	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
            	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
            	$("#vender").append("<option value='leiyunfeng'>雷云峰</option>"); 
            }
		},
        getData: function() {
        	var self = this;
        	
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //获取用户区域
            Service.getAreaDataByUserId(userId,function(data){
            	
            	if(data && data.result){
            		for (var i = 0; i < data.result.length; i++) {
            			//添加区域option
                        $("#userarea").append("<option id='"+data.result[i]._id+"' value='" + data.result[i]._id + "'>" + data.result[i].name + "</option>");
                        $("#userarea").multiselect("refresh");
                        //添加option的点击事件
                        $("#ui-multiselect-"+data.result[i]._id).die();
                        $("#ui-multiselect-"+data.result[i]._id).live('click',{areaid:data.result[i]._id},function(e){
                        	var bool = $(this).attr("aria-selected");
                        	var le = $("#userline").find("option").length;
                        	var areaid = e.data.areaid;
                            //判断是选中还是取消
                        	if(bool == "true"){
                        		
                                    //获取选中区域的线路
                        			cloud.Ajax.request({
          			   	    	      url:"api/automatline/list",
          					    	  type : "GET",
          					    	  parameters : {
          					    		  areaId: areaid,
          					    		  cursor:0,
          					    		  limit:-1
          			                  },
          					    	  success : function(linedata) {
          					    		
                                        //添加线路option          					    		
          					    		for (var j = 0; j < linedata.result.length; j++) {
          					    			$("#"+areaid+"_"+linedata.result[j]._id).remove();
          			                        $("#userline").append("<option id='"+areaid+"_"+linedata.result[j]._id+"' value='" + linedata.result[j]._id + "'>" + 

          			                        		linedata.result[j].name + "</option>");
          			                      $("#userline").multiselect("refresh");
          					    		}  
          					    		
          					    	  }
          		    			  });
                        	    //}
                        	}else{
                        		//取消则删除相应的线路和售货机
                        		
                        		if(le > 0){
                        			var we = $("#userline").find("option");
                        			
                        			for(var j=0;j<we.length;j++){
                        				var id = we.eq(j).attr("id");
                        				
                            			var basearea = id.split("_")[0];
                            			var baseline = id.split("_")[1];                          			
                            			
                            			if(basearea == areaid){
                            				
                            				we.eq(j).remove();
                            			}
                        			}
                        			$("#userline").multiselect("refresh");
                            		
                            	}
                        	}
                        	
                        });
                        
            		}
            	
            	}
            	
            	
            });      

            
        },
        draw: function() {
            var selectHtml1 = "&nbsp;&nbsp;&nbsp;&nbsp;<select id='automat-toolbar-package1' style='width:100px;height: 28px;'>";
            var data1 = {"result": [{"optionsId": "0", "optionsName": locale.get({lang: "create_time"})},
                    {"optionsId": "1", "optionsName": locale.get({lang: "activate_time"})},
                    {"optionsId": "2", "optionsName": locale.get({lang: "online"})},
                    {"optionsId": "3", "optionsName": locale.get({lang: "offline"})}
                ]};
            if (data1 != null && data1.result != null && data1.result.length > 0) {
                $.each(data1.result, function(n, item) {
                    selectHtml1 = selectHtml1 + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
                });
            }
            selectHtml1 = selectHtml1 + "</select>";

            var selectHtml2 = "<select id='automat-toolbar-package2' style='width:100px;height: 28px;'>";
            /*var data2 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"automat_site_name"})},
             {"optionsId":"1","optionsName":locale.get({lang:"automat_name"})},
             {"optionsId":"2","optionsName":locale.get({lang:"automat_of_group"})}
             ]};*/
            var data2 = {"result": [{"optionsId": "0", "optionsName": locale.get({lang: "automat_site_name"})},
                    {"optionsId": "1", "optionsName": locale.get({lang: "automat_name"})}
                ]};

            if (data2 != null && data2.result != null && data2.result.length > 0) {
                $.each(data2.result, function(n, item) {
                    selectHtml2 = selectHtml2 + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
                });
            }
            selectHtml2 = selectHtml2 + "</select>";

            /* var $htmls = $(
             "<div id='search-bar' style='width:auto;margin-bottom:4px;margin-left:0px;margin-top: 10px;'>" +
             selectHtml1+
             "&nbsp;&nbsp;<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_start_time"})+"</label>&nbsp;&nbsp;"+
             "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
             "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_end_time"})+"</label>&nbsp;&nbsp;"+
             "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
             selectHtml2+
             "&nbsp;&nbsp;"+
             "<input style='width:100px' type='text'  id='search_input_name' />"  +
             "<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span style='margin-top:10px'>"+locale.get({lang:"automat_area"}) +"&nbsp;&nbsp;</span>"+
             "<select id='devicecity'  name='city' style='width: 100px;height: 28px;margin-top:10px'>"+
             "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
             "</select>&nbsp;&nbsp;"+
             "<select id='devicecode'  name='code' style='width: 100px;height: 28px;margin-top:10px'>"+
             "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
             "</select>"+
             "<input type='hidden'  id='devicecitysValue' />"+
             "<input type='hidden'  id='devicezonesValue' />"+
             "</div>"
             );*/
            var $htmls = $(
                    "<div id='search-bar' style='width:auto;margin-bottom:4px;margin-left:0px;margin-top: 10px;'>" +
                    "<table>" +
                    "<tr>" +
                    "<td>" + selectHtml1 + "</td>" +
                    "<td>&nbsp;&nbsp;<label class='notice-bar-calendar-text'>" + locale.get({lang: "automat_list_start_time"}) + "</label></td>" +
                    "<td>&nbsp;&nbsp;<input style='width:80px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' /></td>" +
                    "<td>&nbsp;&nbsp;<label class='notice-bar-calendar-text'>" + locale.get({lang: "automat_list_end_time"}) + "</label>" + "</td>" +
                    "<td>&nbsp;&nbsp;<input style='width:80px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' /></td>" +
                    "<td>" + selectHtml2 + "</td>" +
                    "<td>&nbsp;&nbsp;<input style='width:100px' type='text'  id='search_input_name' /></td>" +
                    "<td><div  id='button-bar'></div></td>" +
                    "</tr>" +
                    "</table>" +
                    "</div>"
                    );
            this.element.append($htmls);
        },
        showAddView: function() {
            this.fire("click");
        },
        deleteAutomat: function() {
            this.fire("click", "delete");
        },
        _renderSelect: function() {
            $(function() {
                $("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                $("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                $("#startTime").val("");
                $("#endTime").val("");
            });
        },
        _renderGetData: function() {
            var self = this;
            self._renderBtn(null);
            /*Service.getAreaInfo(0, 0,function(data) {
             var area={};
             if(data.result){
             for(var i=0;i<data.result.length;i++){
             $("#devicecity").append("<option value='" +data.result[i].code + "'>" +data.result[i].city+"</option>");
             area[data.result[i].code] = data.result[i].zone;
             if(i == data.result.length-1){
             self._renderBtn(area);
             }
             }
             }else{
             self._renderBtn(area);
             }
             
             });*/
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderBtn: function(area) {
            var self = this;

            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                    	var online = $("#online").val();
        	            if (online) {
        	                //0 在线 1离线
        	                if (online == -1) {
        	                    online = '';
        	                }
        	            } else {
        	                //查所有
        	            }
        	            
        	            var	areaId = $("#userarea").multiselect("getChecked").map(function() {//
        		                return this.value;
        		            }).get();
        	            var	lineId = $("#userline").multiselect("getChecked").map(function() {//
        	                      return this.value;
        	                  }).get();

        	                  var lineFlag = 1;
        	                  if(areaId.length != 0){
        	                  	if($("#userline").find("option").length <=0){
        	                      	lineFlag = 0;
        	                      }
        	                  }
        	                  var search = $("#search").val();
        	                  var searchValue = $("#searchValue").val();
        	                  if (searchValue) {
        	                      searchValue = self.stripscript(searchValue);
        	                  }

        	                  var siteName = null;
        	                  var assetId = null;
        	                  var name = null;
        	                  if (search) {
        	                      if (search == 0) {
        	                          assetId = $("#searchValue").val();
        	                      } else if (search == 1) {
        	                          siteName = searchValue;//点位名称
        	                      }else if (search == 2) {
        	                          name = searchValue;//售货机名称
        	                      }
        	                  }

                        var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                        var roleType = permission.getInfo().roleType;
                        Service.getAreaByUserId(userId,function(areadata){
    	                  	
    	                  	var areaIds=[];
    	                      if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
    	                      	areaIds = areadata.result.area;
    	                      }
    	                      if(roleType == 51){
    	                      	areaIds = [];
    	                      }
    	                      if(areaId.length != 0){
    	                      	areaIds = areaId;
    	                      }
    	                      
    	                      if(roleType != 51 && areaIds.length == 0){
    	                      	areaIds = ["000000000000000000000000"];
    	                      }
    	                      cloud.Ajax.request({
    	      	   	    	      url:"api/automatline/list",
    	      			    	  type : "GET",
    	      			    	  parameters : {
    	      			    		  areaId: areaIds,
    	      			    		  cursor:0,
    	      			    		  limit:-1
    	      	                  },
    	      			    	  success : function(linedata) {
    	      			    		  var lineIds=[];
    	      			    		  if(linedata && linedata.result && linedata.result.length>0){
    	      			    			  for(var i=0;i<linedata.result.length;i++){
    	      			    				  lineIds.push(linedata.result[i]._id);
    	      			    			  }
    	      		                   }
    	      			    		  
    	      			    		  if(roleType == 51 && areaId.length == 0){
    	      			    			  lineIds = [];
    	      			              }
    	      			    		  if(lineId.length != 0){
    	      			    			  lineIds = lineId;
    	      			    		  }else{
    	      			    			  if(lineFlag == 0){
    	      			    				  lineIds = ["000000000000000000000000"];
    	      			    			  }
    	      			    		  }
    	      			    		  
    	      			    		  if(roleType != 51 && lineIds.length == 0){
    	      			    			   lineIds = ["000000000000000000000000"];
    	      			    		  }
    	      			                self.lineIds = lineIds;
    	      			                if(self.onlineType){
    	      			                  	self.searchData = {
    	      			                              "online": online,
    	      			                              "siteName": siteName,
    	      			                              "assetId": assetId,
    	      			                              "lineId": lineIds,
    	      			                              "name":name,
    	      			                              "onlineType":self.onlineType
    	      			                          };
    	      			                  }else{
    	      			                  	self.searchData = {
    	      			                              "online": online,
    	      			                              "siteName": siteName,
    	      			                              "assetId": assetId,
    	      			                              "name":name,
    	      			                              "lineId": lineIds
    	      			                      };
    	      			                  }
    	      			            	 
    	      			                 self.fire("query",self.searchData);
    	                      
    	      			    	  }
    	       			     });
    	                  });
                    
                       
                    }
                }
            });

           
            $("#"+queryBtn.id).addClass("readClass");

            var catBtn = new Button({
                text: locale.get({lang: "price_see"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("see");
                    }
                }
            });
            $("#"+catBtn.id).addClass("readClass");
            
            
            
            if(self.onlineType && self.onlineType == 1){
            }else{
            	  var addBtn = new Button({
                      text: locale.get({lang: "add"}),
                      container: $("#buttonDiv"),
                      events: {
                          click: function() {
                              self.fire("add");
                          }
                      }
                  });
            	  
            }
            var updateBtn = new Button({
                text: locale.get({lang: "modify"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("update");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang: "delete"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("del");
                    }
                }
            });
            
            if(self.onlineType && self.onlineType == 1){
              	 var authenticationBtn = new Button({
                       text: locale.get({lang: "smart_authentication"}),
                       container: $("#buttonDiv"),
                       events: {
                           click: function() {
                               self.fire("auth");
                           }
                       }
                   });
              }else{
            	   var importBtn = new Button({
                      text: locale.get({lang: "import"}),
                      container: $("#buttonDiv"),
                      events: {
                          click: function() {
                              self.fire("imReport");
                          }
                      }
                   });
	           	   var exportBtn = new Button({
	                      text: locale.get({lang: "export"}),
	                      container: $("#buttonDiv"),
	                      events: {
	                          click: function() {
	                              self.fire("exReport");
	                          }
	                      }
	                });
              	 
              	  $("#"+exportBtn.id).addClass("readClass");
              }
            //权限控制按钮的显隐
            if(permission.app("vendingMachine_manage").read){
            	if(queryBtn) queryBtn.show();
            	if(catBtn) catBtn.show();
            	if(exportBtn) exportBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(catBtn) catBtn.hide();
            }
            if(permission.app("vendingMachine_manage").write){
            	if(addBtn) addBtn.show();
            	if(updateBtn) updateBtn.show();
            	if(deleteBtn) deleteBtn.show();
            	if(importBtn) importBtn.show();
            	if(authenticationBtn) authenticationBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(updateBtn) updateBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(importBtn) importBtn.hide();
            	if(authenticationBtn) authenticationBtn.hide();
            }
            $("#search-bar a").css({
                margin: "auto 0px auto 6px"
            });
           // $("#line_div").find("button").css("height","200px"); 
            /* $("#devicecity").bind('change', function () {
             $("#devicecode").empty();
             $("#devicezonesValue").val('');
             var selectedId = $("#devicecity").find("option:selected").val();
             if(selectedId == "all"){
             $("#devicecode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
             $("#devicecitysValue").val('');
             }else{
             for(var item in area){  
             if(item==selectedId){  
             var value=area[item];
             if(value){
             $("#devicecode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
             for(var i=0;i<value.length;i++){
             $("#devicecode").append("<option value='" +value[i].code + "'>" +value[i].name+"</option>");
             }
             }
             }  
             }
             $("#devicecitysValue").val(selectedId);
             }
             
             
             });
             
             $("#devicecode").bind('change', function () {
             var codeId = $("#devicecode").find("option:selected").val();
             if(codeId == "all"){
             $("#devicezonesValue").val('');
             }else{
             $("#devicezonesValue").val(codeId);
             }
             });*/

        },
        destroy: function() {
            $("#search-bar").html("");
        }

    });

    return NoticeBar;

});

