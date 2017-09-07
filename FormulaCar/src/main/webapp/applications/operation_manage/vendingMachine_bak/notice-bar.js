define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("./service");
	require("/");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.drawV2();
        },
        drawV2:function(){
        	var self = this;
   		       Service.getUserMessage(function(data) {
				 if(data.result){
					 var userId = data.result._id;
					 Service.getLineInfoByUserId(userId,function(data){
						 var lineData = data;;
					     self._renderForm(lineData);
					     self._renderSelect();
					     self._renderGetData();
					 });
				 }
			  });
        },
        _renderForm:function(lineData){
			 var self = this;
  		     var $htmls = $(+"<div></div>" +
  				  "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
  				  "<div style='float:left;'>"+
  	                "<select id='online'  name='online' style='width:90px;height: 28px;'>"+
  	                 "<option value='-1'>"+locale.get({lang:"online_state"})+"</option>"+
  	                 "<option value='0'>"+locale.get({lang:"online"})+"</option>"+
  	                 "<option value='1'>"+locale.get({lang:"offline"})+"</option>"+
  	                "</select>"+
  	              "</div>"+
	   	          "<div style='margin-left:5px;float:left;'>"+
	                 "<select  id='userline'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;"+//线路
	              "</div>"+
	   	          "<div style='float:left;'>"+
	                 "<select id='search'  name='search' style='width:120px;height: 28px;'>"+
  	                  "<option value='0'>"+locale.get({lang:"automat_no1"})+"</option>"+
  	                  "<option value='1'>"+locale.get({lang:"automat_site_name"})+"</option>"+
  	                 "</select>&nbsp;&nbsp;"+
  	              "</div>"+
	   	          "<div style='float:left;margin-left:5px;'>"+
  	                 "<input style='width:120px' type='text'  id='searchValue' />"  +
  	              "</div>"+
  	              "<div id='buttonDiv' style='float:left;'></div>"+
  		          "</div>");
  		
            this.element.append($htmls);
            require(["cloud/lib/plugin/jquery.multiselect"],function(){
					$("#userline").multiselect({ 
						header:true,
						checkAllText:locale.get({lang:"check_all"}),
						uncheckAllText:locale.get({lang:"uncheck_all"}),
						noneSelectedText:locale.get({lang:"automat_line"}),
						selectedText:"# "+locale.get({lang:"is_selected"}),
						minWidth:170,
						height:120
					});
		       });
             if(lineData && lineData.result.length > 0){
			 	 for(var i =0;i<lineData.result.length;i++){
					 $("#userline").append("<option value='" +lineData.result[i].id + "'>" +lineData.result[i].lineName+"</option>");
				 }
			 }
		},
    	draw:function(){
    		  var selectHtml1 = "&nbsp;&nbsp;&nbsp;&nbsp;<select id='automat-toolbar-package1' style='width:100px;height: 28px;'>";
              var data1 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"create_time"})},
                                    {"optionsId":"1","optionsName":locale.get({lang:"activate_time"})},
                                    {"optionsId":"2","optionsName":locale.get({lang:"online"})},
                                    {"optionsId":"3","optionsName":locale.get({lang:"offline"})}
              					 ]};
              if(data1!=null&&data1.result!=null&&data1.result.length>0){
              	$.each(data1.result,function(n,item) {   
      				selectHtml1 = selectHtml1 + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
      			});
              }
              selectHtml1 = selectHtml1 + "</select>";
              
              var selectHtml2 = "<select id='automat-toolbar-package2' style='width:100px;height: 28px;'>";
              /*var data2 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"automat_site_name"})},
                                    {"optionsId":"1","optionsName":locale.get({lang:"automat_name"})},
                                    {"optionsId":"2","optionsName":locale.get({lang:"automat_of_group"})}
              					 ]};*/
              var data2 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"automat_site_name"})},
                                     {"optionsId":"1","optionsName":locale.get({lang:"automat_name"})}
               					 ]};
              
              if(data2!=null&&data2.result!=null&&data2.result.length>0){
              	$.each(data2.result,function(n,item) {   
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
            	       "<table>"+
            	         "<tr>"+
            	             "<td>"+selectHtml1+"</td>"+
            	             "<td>&nbsp;&nbsp;<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_start_time"})+"</label></td>"+
            	             "<td>&nbsp;&nbsp;<input style='width:80px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' /></td>"+
            	             "<td>&nbsp;&nbsp;<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_end_time"})+"</label>"+"</td>"+
            	             "<td>&nbsp;&nbsp;<input style='width:80px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' /></td>"+
            	             "<td>"+selectHtml2+"</td>"+
            	             "<td>&nbsp;&nbsp;<input style='width:100px' type='text'  id='search_input_name' /></td>"+
            	             "<td><div  id='button-bar'></div></td>"+
            	         "</tr>"+
            	       "</table>"+
                  "</div>"
              );
              this.element.append($htmls);
		},
		showAddView:function(){
			this.fire("click");
		},
		deleteAutomat:function(){
			this.fire("click","delete");
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				});
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				});
				$("#startTime").val("");
				$("#endTime").val("");
			});
		},
		 _renderGetData:function(){
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
        _renderBtn: function(area){
            var self = this;
            
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                    	var areaVal = $("#devicecitysValue").val() + "." + $("#devicezonesValue").val();
                        self.fire("query",areaVal);
                    }
                }
            });

	        /*var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });*/

            var catBtn = new Button({
                text: locale.get({lang:"price_see"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                    	self.fire("see");
                    }
                }
            });
	        var updateBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                    	self.fire("update");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                    	self.fire("del");
                    }
                }
            });
            var importBtn = new Button({
                 text: locale.get({lang:"import"}),
                 container: $("#buttonDiv"),
                 events: {
				    click:function(){
					   self.fire("imReport");
				     }
			     }
           });
            $("#search-bar a").css({
                margin: "auto 0px auto 10px"
            });
            
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
        destroy:function(){
        	$("#search-bar").html("");
        }
        
    });
    
    return NoticeBar;
    
});

