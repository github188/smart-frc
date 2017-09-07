define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Service = require("../service");
	var Button = require("cloud/components/button");
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
    	draw:function(){
    		  var self = this;
    		  var $htmls = $(+"<div></div>" +
    				  "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    				  "<table><tr>"+
    				  "<td>"+
    				  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"alarm_produce_time"})+"</label>&nbsp;&nbsp;"+
    				  "<input style='width:100px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_date' />&nbsp;&nbsp;"+
    				  "<label class='notice-bar-calendar-text'>-</label>&nbsp;&nbsp;"+
    				  "<input style='width:100px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_enddate' />&nbsp;&nbsp;"+
   				      "</td>"+
    				   "<td>"+
    				   "<label>"+locale.get({lang:"trade_automat_number"})+" </label>" +
    		           "<input style='width:100px' type='text'  id='assetId' />&nbsp;&nbsp;"  +
    				   "</td>"+
    				   "<td>"+
    				   "<select  id='userarea'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
    				   "</td>"+
    				   "<td>"+
    				   "<select  id='lineIds'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
    				   "</td>"+
    				   "<td>"+
    				   "<label>"+locale.get({lang:"site_name"})+" </label>" +
    		           "<input style='width:100px' type='text'  id='siteName' />&nbsp;&nbsp;"  +
    				   "</td>"+
    				   "<td>"+
    				   "<select id='automat_maintenance_type'  name='automat_maintenance_type' style='width:120px;  height: 28px; '>"+
    	               "<option value='0'>"+locale.get({lang:"all_maintenance_status"})+"</option>"+
    	               "<option value='6'>"+locale.get({lang:"event_app_update"})+"</option>"+
    	               "<option value='12'>"+locale.get({lang:"firmware_version_upgrade"})+"</option>"+
    	               "<option value='13'>"+locale.get({lang:"vsi_upgrade"})+"</option>"+
    	               "<option value='1'>"+locale.get({lang:"gate_event"})+"</option>"+
    	               "<option value='15'>"+locale.get({lang:"restart_of_industrial_control"})+"</option>"+
    	               "<option value='14'>"+locale.get({lang:"replenishment_start"})+"</option>"+
    	               "<option value='4'>"+locale.get({lang:"replenishment_finish"})+"</option>"+
    	               "<option value='5'>"+locale.get({lang:"vcs_re_register"})+"</option>"+
    	               "<option value='2'>"+locale.get({lang:"synchronous_channel_configuration"})+"</option>"+
    	               "<option value='3'>"+locale.get({lang:"Synchronizing_commodity_information"})+"</option>"+
    	               "<option value='11'>"+locale.get({lang:"sync_model_configuration"})+"</option>"+
    	               "<option value='7'>"+locale.get({lang:"sync_ad_file"})+"</option>"+
    	               "<option value='8'>"+locale.get({lang:"synchronous_lottery_allocation"})+"</option>"+
    	               "<option value='10'>"+locale.get({lang:"update_channel_configuration"})+"</option>"+
    	               "<option value='17'>点位更改</option>"+
    	               "</select>&nbsp;&nbsp;"+
    				   "</td>"+
    				   "<td>"+
    				   "<div id='button-bar'></div>"+
    				   "</td>"+
    				  "</tr></table>"+
    		          "</div>");
              this.element.append($htmls);
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	  $("#userarea").multiselect({
                      header: false,
                      checkAllText: locale.get({lang: "check_all"}),
                      uncheckAllText: locale.get({lang: "uncheck_all"}),
                      noneSelectedText: locale.get({lang: "user_area"}),
                      selectedText: "# " + locale.get({lang: "is_selected"}),
                      minWidth: 130,
                      height: 120
                  });
                  $("#lineIds").multiselect({
                      header: true,
                      checkAllText: locale.get({lang: "check_all"}),
                      uncheckAllText: locale.get({lang: "uncheck_all"}),
                      noneSelectedText: locale.get({lang: "automat_line"}),
                      selectedText: "# " + locale.get({lang: "is_selected"}),
                      minWidth: 130,
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
            $("#search-bar a").css({
                margin: "auto 0px auto 0px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
