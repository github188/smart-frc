define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("../../../service");

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
        },
        
        _renderForm: function() {
            var self = this;
            var $htmls = $(+"<div></div>" +
                    "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                    "<div style ='float: left;margin-left:5px;'>" +
                    "<select  id='userarea'  multiple='multiple'  style='width:150px;height: 28px;'></select>&nbsp;&nbsp;" + //	区域
                    "</div>" + 
                    "<div id='line_div' style='float:left;'>" +
                    "<select  id='userline'  multiple='multiple'  style='width:180px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
                    "</div>" +
                    "<div id='line_div' style='float:left;'>" +
                    "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"automat_no1"})+" </label>" +
                    "<input style='width:200px;margin-right: -2px;' type='text'  id='assetId' />&nbsp;&nbsp;"+ 
                    "</div>" +
                    "<div id='buttonDiv' style='float:left;'></div>" +
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
                $("#userline").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "automat_line"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 180,
                    height: 120
                });
            });
        
                
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
                    	self.fire("query");
                    }
                }
            });

           
            $("#"+queryBtn.id).addClass("readClass");

            $("#search-bar a").css({
                margin: "auto 0px auto 6px"
            });

        },
        destroy: function() {
            $("#search-bar").html("");
        }

    });

    return NoticeBar;

});

