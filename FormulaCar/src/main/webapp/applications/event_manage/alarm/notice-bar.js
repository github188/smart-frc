define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../service");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.drawV2();
        	this.getData();
        },
        drawV2: function() {
            var self = this;
            self.draw();
            self._renderSelect();
            self._renderBtn();
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
                        	var le = $("#lineIds").find("option").length;
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
          			                        $("#lineIds").append("<option id='"+areaid+"_"+linedata.result[j]._id+"' value='" + linedata.result[j]._id + "'>" + 

          			                        		linedata.result[j].name + "</option>");
          			                      $("#lineIds").multiselect("refresh");
          					    		}  
          					    	  }
          		    			  });
                        	    //}
                        	}else{
                        		//取消则删除相应的线路和售货机
                        		
                        		if(le > 0){
                        			var we = $("#lineIds").find("option");
                        			for(var j=0;j<we.length;j++){
                        				var id = we.eq(j).attr("id");
                            			var basearea = id.split("_")[0];
                            			var baseline = id.split("_")[1];                          			
                            			if(basearea == areaid){
                            				we.eq(j).remove();
                            			}
                        			}
                        			$("#lineIds").multiselect("refresh");
                            	}
                        	}
                        });
            		}
            	}
            });      
        },
    	draw:function(lineData){
    		  var self = this;
    		  var $htmls = $(+"<div></div>" +
    				  "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    				  "<table><tr style='height: 35px;'>"+
    				  "<td>"+
    				  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"alarm_produce_time"})+"</label>&nbsp;&nbsp;"+
    				  "<input style='width:90px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_date' />&nbsp;&nbsp;"+
    				  "<label class='notice-bar-calendar-text'>-</label>&nbsp;&nbsp;"+
    				  "<input style='width:90px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_enddate' />&nbsp;&nbsp;"+
   				      "</td>"+
	   				   "<td>"+
					   "<select  id='userarea'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
					   "</td>"+
   				       "<td>"+
				       "<select  id='lineIds'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
				       "</td>"+
	   				   "<td>"+
					   "<label>"+locale.get({lang:"site_name"})+" </label>" +
			           "<input style='width:120px' type='text'  id='siteName' />&nbsp;&nbsp;"  +
					   "</td>"+
    				   "<td>"+
    				   "<label>"+locale.get({lang:"trade_automat_number"})+" </label>" +
    		           "<input style='width:120px' type='text'  id='assetId' />&nbsp;&nbsp;"  +
    				   "</td>"+
    				  "</tr>"+
    				  "<tr style='margin-top:5px;'>"+
    				  "<td>"+
	   	               "<select id='type'  name='type' style='width:120px;  height: 28px; '>"+
	   	               "<option value='0'>"+locale.get({lang:"all_alarm_type"})+"</option>"+
	   	               "<option value='9001'>"+locale.get({lang:"automat_system_failure"})+"</option>"+
	   	               "<option value='9002'>"+locale.get({lang:"automat_note_machine_fault"})+"</option>"+
	   	               "<option value='9003'>"+locale.get({lang:"automat_coin_device_failure"})+"</option>"+
	   	               "<option value='9004'>"+locale.get({lang:"automat_communication_failure"})+"</option>"+
	   	               "<option value='90051'>"+locale.get({lang:"network_connection_exception"})+"</option>"+
	   	               "<option value='90052'>"+locale.get({lang:"be_out_of_stock"})+"</option>"+
	   	               "</select>&nbsp;&nbsp;"+
	   				 
	   	               "<select id='level'  name='level' style='width:130px;  height: 28px; '>"+
	   	               "<option value='0'>"+locale.get({lang:"all_alarm_level"})+"</option>"+
	   	               "<option value='1'>"+locale.get({lang:"event_admonish"})+"</option>"+
	   	               "<option value='2'>"+locale.get({lang:"event_important_warning"})+"</option>"+
	   	               "<option value='3'>"+locale.get({lang:"event_minor_alarm"})+"</option>"+
	   	               "</select>&nbsp;&nbsp;"+
	   				   "</td>"+
	   				   "<td>"+
	   				   "<select id='state'  name='state' style='width:150px;  height: 28px;'>"+
	   	               "<option value='0'>"+locale.get({lang:"all_alarm_state"})+"</option>"+
	   	               "<option value='1'>"+locale.get({lang:"alarm_produce"})+"</option>"+
	   	               "<option value='2'>"+locale.get({lang:"automatic_recovery"})+"</option>"+
	   	              /* "<option value='3'>"+locale.get({lang:"manual_recovery"})+"</option>"+*/
	   	               "</select>&nbsp;&nbsp;"+
	   				   "</td>"+
	   				   "<td>"+
	   				   "<div id='button-bar'></div>"+
	   				   "</td>"+
	   				   "<td></td>"+
	   				   "<td></td>"+
    				  "</tr>"+
    				  "</table>"+
    		          "</div>");
              this.element.append($htmls);
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
                  $("#lineIds").multiselect({
                      header: true,
                      checkAllText: locale.get({lang: "check_all"}),
                      uncheckAllText: locale.get({lang: "uncheck_all"}),
                      noneSelectedText: locale.get({lang: "automat_line"}),
                      selectedText: "# " + locale.get({lang: "is_selected"}),
                      minWidth: 120,
                      height: 120
                  });
              });
             
            
		},
		_renderSelect:function(){
			$(function(){
				$("#times_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#times_date").val("");
			});
			$(function(){
				$("#times_enddate").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#times_enddate").val("");
			});
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            /*var manual_recoveryBtn = new Button({
                text: locale.get({lang:"manual_recovery"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                        self.fire("recovery");
                    }
                }
            });*/
            if(permission.app("alarm_list").read){
            	if(queryBtn) queryBtn.show();
            	//if(exportBtn) exportBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
           /* if(permission.app("alarm_list").write){
            	if(manual_recoveryBtn) manual_recoveryBtn.show();
            	//if(exportBtn) exportBtn.show();
            }else{
            	if(manual_recoveryBtn) manual_recoveryBtn.hide();
            }*/
            $("#search-bar a").css({
                margin: "auto 6px auto 0px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
