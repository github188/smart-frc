define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./addplan.html");
    var Table = require("cloud/components/table");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("../service");

    var DevicelistInfo = require("../config/deviceList");

    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
				
            this.equipstatus = options.equipstatus;
            this.lineIds = options.lineIds;
            this.assetIds = options.assetIds;
            
			this._renderWindow();
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "create_replenish_plan"}),
                top: "center",
                left: "center",
                height: 650,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        self.fire("getplanList");
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            
            this._render();
            locale.render({element: this.element});
        },
        _render:function(){
        	//this._renderHtml();
        	var self = this;
        	var searchData = {};
        	Service.getAllReplenishPlanCount(searchData,function(data){
   			      var total = data.result;
	   			  var num = total+"";
	              var len = 6 - num.split("").length;
	             
	              var tnum = "";
	              for(var i=0;i<len;i++){
	              	tnum += "0";
	              }
	              tnum = "A"+tnum+num;
	              
	              $("#planNumber").val(tnum);
   			 
   		    }, self);
        	
			this._renderBtn();
			$(function(){
				$("#executiveTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
				//$("#startTime").val("");

			});
			require(["cloud/lib/plugin/jquery.multiselect"], function() {

            	$("#executive_person").multiselect({
                    header: false,
                    noneSelectedText: locale.get({lang: "please_select_executive_person"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    multiple: false,
                    selectedList: 1,
                    minWidth: 200,
                    height: 150
                });
                $("#replenishline").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "automat_line"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 200,
                    height: 150
                });
            });
			Service.getUserInfo(0, 1000,function(data) {
				if(data && data.result){
					
					var len = data.result.length;
                    for(var i=0;i<len;i++){
						
						$("#executive_person").append("<option id='"+data.result[i]._id+"' value='"+data.result[i].email+"'>"+data.result[i].name+"</option>");
					}
					
					$("#executive_person").multiselect('refresh');
					
				}
			});
			
            
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
        	Service.getLinesByUserId(userId,function(linedata){
            	var lineIds=[];
            	if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                }
            	if(roleType == 51){
	    			 lineIds = [];
                }
            	if(roleType != 51 && lineIds.length == 0){
	                    lineIds = ["000000000000000000000000"];
	            }
                var searchData = {
        				"lineId":lineIds
        		};

            	Service.getAllLine(searchData,-1,0,function(lineData){
            		if (lineData && lineData.result.length > 0) {
            			self.lineData = lineData.result;
                        for (var j = 0; j < lineData.result.length; j++) {
                        	if($.inArray(lineData.result[j]._id,self.lineIds) > -1){
                        		$("#replenishline").append("<option value='" + lineData.result[j]._id + "' selected='selected'>" + lineData.result[j].name + "</option>");
                        	}else{
                        		$("#replenishline").append("<option value='" + lineData.result[j]._id + "'>" + lineData.result[j].name + "</option>");
                        	}
                        }
                        $("#replenishline").multiselect('refresh');
                    }
  			    }, self);

            	
            });
		
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
 
        _renderBtn: function() {
        	var self = this;
        	$("#nextBase").bind("click", function() {

        		var number = $("#planNumber").val();
        		var remark = $("#planRemark").val();
        		
        		var executiveTime = $("#executiveTime").val();
        		
        		
        		if(executiveTime){
        			executiveTime = (new Date(executiveTime)).getTime()/1000;
        		}
        		/*if(name == null || name.replace(/(^\s*)|(\s*$)/g,"")==""){
        			dialog.render({lang:"please_enter_plan_name"});
           			return;
        		}*/
        		var executivePersonId = $("#executive_person").find("option:selected").attr('id');
        		var executivePersonEmail = $("#executive_person").find("option:selected").val();
        		var executivePersonName = $("#executive_person").find("option:selected").text();
        		
        		var replenishLine = $("#replenishline").multiselect("getChecked").map(function() {//线路
                    return this.value;
                }).get();
        		
        		if(executivePersonId == null || executivePersonId == ""){
        			dialog.render({lang:"please_select_executive_person"});
           			return;
        		}
        		if(replenishLine.length == 0){
        			dialog.render({lang:"please_select_replenish_line"});
           			return;
        		}
        		var replenishLineName = $("#replenishline").find("option:selected");
                var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var userName = cloud.storage.sessionStorage("accountInfo").split(",")[5].split(":")[1];
                var email = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
                self.basedata={
                		executivePersonId:executivePersonId,
                		executivePerson:executivePersonName,
                		executiveTime:executiveTime,
                		lineIds:replenishLine,
                		createPersonId:userId,
                		createPerson:userName,
                		number:number,
                		remark:remark,
                	    cpemail:email,
                	    epemail:executivePersonEmail
                		
                };
                
                var line = [];
                for(var m=0;m<replenishLine.length;m++){
                	var info = {
                			"lineId":replenishLine[m],
                			"lineName":replenishLineName.eq(m).text()
                	}
                	line.push(info);
                }
                self.line = line;
            						
				$("#devicelist").css("display", "block");

                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                this.Devicelist = new DevicelistInfo({
                    selector: "#devicelistInfo",
                    automatWindow: self.adWindow,
                    basedata:self.basedata,
                    lines:self.line,
                    assetIds:self.assetIds,
                    events: {
                        "getplanList": function() {
                            self.fire("getplanList");
                        }
                    }
                });

        	});
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
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