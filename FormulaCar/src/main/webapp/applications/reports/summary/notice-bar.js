define(function(require){
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    var Button = require("cloud/components/button");
    //	require("./jquery.multiselect.css");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this.businessType=options.businessType;
			this.service=options.service;
//			this._setCount();
			this._render();
            this.pars = null;
        },
        _render: function(){
            this._draw();
            this._renderSelect();
            //			this._queryFun();
        },
		_setCount:function(){
			var self =this;
			if(this.businessType=="sitereprot"){
				var sucess = 0;
				this.service.getSiteCount("0,1,2,3",true,function(data){
					self.online = data.online;
					self.offline = data.total - data.online;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getSiteCount("0",false,function(data){
					self.construction = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getSiteCount("1",false,function(data){
					self.commissionin = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getSiteCount("2",false,function(data){
					self.fault = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getSiteCount("3",false,function(data){
					self.overhaul = data;
					sucess++;
					if(sucess===5)self._render();
				});
			}else if(this.businessType=="devicereprot"){
				var sucess = 0;
				this.service.getDeviceCount("0,1,2,3",true,function(data){
					self.online = data.online;
					self.offline = data.total - data.online;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getDeviceCount("0",false,function(data){
					self.construction = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getDeviceCount("1",false,function(data){
					self.commissionin = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getDeviceCount("2",false,function(data){
					self.fault = data;
					sucess++;
					if(sucess===5)self._render();
				});
				this.service.getDeviceCount("3",false,function(data){
					self.overhaul = data;
					sucess++;
					if(sucess===5)self._render();
				});
			}else if(this.businessType=="alarmreprot"){
				self._drawalarmbar();
				self._renderSelect();
			}
		},
        
        _drawalarmbar: function(){
            var self = this;
            var $htmls = $(+"<div></div>" +
            "<div id='notice-bar' style='width:auto'>" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"business_state"}) + "</label>" +
            "<input id='sitname' style='width:85px' type='text'   />" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"fault_origin"}) + "</label>" +
            "<input id='sourcename' style='width:85px' type='text'    />" +
//            "<label style='margin:auto 10px auto 10px'>故障名称</label>" +
//            "<input style='width:85px' type='text'  />" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"create_time"}) + "</label>" +
            "<input style='width:125px' type='text' readonly='readonly' id='startTime' class='dateStyle' />" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"to"}) + "</label>" +
            "<input style='width:125px' type='text' readonly='readonly' id='endTime' class='dateStyle' />"  +
//			"</br>"+
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"serious_level"}) + "</label>" +
            "<select  id='multiselect1' class='multiselect' multiple='multiple'>" +
            "<option value='5' selected='selected'>" + locale.get({lang:"serious"}) + "</option>" +
            "<option value='4' selected='selected'>" + locale.get({lang:"important"}) + "</option>" +
            "<option value='3' selected='selected'>" + locale.get({lang:"minor"}) + "</option>" +
            "<option value='2' selected='selected'>" + locale.get({lang:"notice"}) + "</option>" +
            "<option value='1' selected='selected'>" + locale.get({lang:"remind"}) + "</option>" +
            "</select>" +
//            "<label style='margin:auto 10px auto 10px'>紧急程度:</label>" +
//            "<select  id='multiselect2' class='multiselect' multiple='multiple'>" +
//			"<option value='1' selected='selected'>未确认</option>" +
//            "<option value='0' selected='selected'>已确认</option>" +
//            "<option value='-1' selected='selected'>已清除</option>" +
//            "</select>" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"state+:"}) + "</label>" +
            "<select  id='multiselect2' class='multiselect' multiple='multiple'>" +
        	"<option value='0' selected='selected'>" + locale.get({lang:"urgency"}) + "</option>" +
            "<option value='1' selected='selected'>" + locale.get({lang:"medium"}) + "</option>" +
            "<option value='1' selected='selected'>" + locale.get({lang:"low"}) + "</option>" +
            "</select>" +
			"</div>");
            this.element.append($htmls);
        },
        _draw: function(){
            var self = this;
            var $htmls = $(+"<div></div>" +
            "<div id='notice-bar' style='width:100%;margin-top:3px'>" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"business_state"}) + "</label>" +
            "<select  id='multiselect1' class='multiselect' multiple='multiple'>" +
            "<option value='1' selected='selected'>" + locale.get({lang:"commissionin"}) + "</option>" +
            "<option value='2' selected='selected'>" + locale.get({lang:"fault"}) + "</option>" +
            "<option value='0' selected='selected'>" + locale.get({lang:"construction"}) + "</option>" +
            "<option value='3' selected='selected'>" + locale.get({lang:"overhaul"}) + "</option>" +
            "</select>" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"networking_state"}) + "</label>" +
            "<select  id='multiselect2' class='multiselect' multiple='multiple'>" +
            "<option value='0' selected='selected'>" + locale.get({lang:"offline"}) + "</option>" +
            "<option value='1' selected='selected'>" + locale.get({lang:"online"}) + "</option>" +
            "</select>" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"create_time_from"}) + "</label>" +
            "<input style='width:125px' type='text' readonly='readonly' id='startTime' class='dateStyle' />" +
            "<label style='margin:auto 10px auto 10px'>" + locale.get({lang:"to"}) + "</label>" +
            "<input style='width:125px' type='text' readonly='readonly' id='endTime' class='dateStyle' />"  +
            "</div>");
            this.element.append($htmls);
            
            var defautMutiselectCfg = {
                    checkAllText:locale.get({lang:"check_all"}),
                    uncheckAllText:locale.get({lang:"uncheck_all"})
                };
            
        },
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#notice-bar"),
                events: {
                    click: function(){
						var opts = self.getOptions();
                        if (opts) {
                            self.fire("query", opts);
                        }
                    }
                }
            });
            var exportBtn = new Button({
                text: locale.get({lang:"export"}),
                container: $("#notice-bar"),
                imgCls : "cloud-icon-daochu",
                events: {
					click:function(){
						self.fire("exReport");
					}
				}
            });
            $("#notice-bar a").css({
                margin: "-3px 0 0 10px"
            });
        },
		getOptions: function(){
						var values1 = $("#multiselect1").multiselect("getChecked").map(function(){
                            return parseFloat(this.value);
                        }).get(values1);
                        var values2 = $("#multiselect2").multiselect("getChecked").map(function(){
                            return parseFloat(this.value);	
                        }).get();
                        values3 = values2.length === 2 ? null : values2[0];
                        var startTime = (new Date($("#startTime").val())).getTime() / 1000;
                        var endTime = ((new Date($("#endTime").val())).getTime() + 59000) / 1000;
                        var is = this._checkFormat(values1, values2, startTime, endTime);
						if(self.businessType==="alarmreprot"){
							var sitename=$("#sitname").val();
							var sourcename=$("#sourcename").val();
							var obj={
								level: values1,
	                            state: values2,
	                            startTime: startTime,
	                            endTime: endTime,
								sitename:sitename,
								sourcename:sourcename
							};
						}else{
							var obj = {
	                            arr: values1,
	                            //net: values2,
	                            startTime: startTime,
	                            endTime: endTime
	                       	};
							if(values3 !== null){
								obj.net = values3;
							}
						}
						return is===0 ? obj : false;
		},
        _renderSelect: function(){
			var self =this;
            $(function(){
				self._renderBtn();
				
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
                require(["cloud/lib/plugin/jquery.multiselect"], function(){
                    var muOp1 = {
                		header: true,
                		checkAllText:locale.get({lang:"check_all"}),
                        uncheckAllText:locale.get({lang:"uncheck_all"}),
                		noneSelectedText:locale.get({lang:"please_select"}),
                		selectedText: "# " + locale.get({lang:"is_selected"}),
                		minWidth: 120,
                		height: 100,
                    };
                    var muOp2 = {
                		header: true,
                		checkAllText:locale.get({lang:"check_all"}),
                        uncheckAllText:locale.get({lang:"uncheck_all"}),
                		noneSelectedText:locale.get({lang:"please_select"}),
                		selectedText: "# " + locale.get({lang:"is_selected"}),
                		minWidth: 120,
                		height: 100,
                    };
                	$("#multiselect1").multiselect(muOp1);
                	$("#multiselect2").multiselect(muOp2);
                    $(".ui-multiselect-menu").width("160");
                });
            });
        },
        _checkFormat: function(values1, values2, startTime, endTime){
            var isTrue = 0;
            if (values1.length === 0) {
            	dialog.render({lang:"business_state_cannot_be_empty"});
                isTrue += 1;
            }
            if (values2.length === 0) {
                dialog.render({lang:"networking_state_cannot_be_empty"});
                isTrue += 1;
            }
            if (startTime > endTime) {
                dialog.render({lang:"start_date_cannot_be_greater_than_end_date"});
                isTrue += 1;
            }
            return isTrue;
        }
        
    });
    
    return NoticeBar;
    
});
