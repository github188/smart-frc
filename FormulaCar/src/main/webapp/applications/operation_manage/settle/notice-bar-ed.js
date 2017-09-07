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
            this._render();
        },
        _render: function() {
        	var self = this;
        	
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			Service.getAreaByUserId(userId,function(areaData){
            	var areaId = [];
            	if(roleType != 51){
            		
                	if(areaData && areaData.result){
                		areaId = areaData.result.area
                		
                	}else{
                		areaId.push("000000000000000000000000");
                	}
                }
            	Service.getAreaList(areaId,function(data){
            		
                    self._renderForm(data);
                    
                });
            });
        	
        	//this._renderForm();
        	//this._renderSelect();
        	//this._renderGetData();
        },
        _renderForm: function(areasData) {
            var self = this;
            var $htmls = $("<div style='margin-top: 5px;'>" +
                    "<div class='select_time'><label style='float: left;' for='times_start'>"+locale.get({lang: "start_time"})+"</label>" +
                    "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_start'/>&nbsp;&nbsp;" +
                    "</div>" +
                    "<div class='select_time'><label style='float: left;' for='times_end'>"+locale.get({lang: "end_time"})+"</label>" +
                    "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_end' />&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='width: 166px;float: left;height:30px'>"  +
                    "<select  id='areas'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
                    "</div>" +
                    "<div id='buttonDiv' style='float:left;'></div>" +
            		"</div>");

            this.element.append($htmls);

            require(["cloud/lib/plugin/jquery.multiselect"], function() {

                $("#areas").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "user_area"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 160,
                    height: 120
                });
            });
            
            if (areasData && areasData.result.length > 0) {
                for (var i = 0; i < areasData.result.length; i++) {
                    $("#areas").append("<option value='" + areasData.result[i]._id + "'>" + areasData.result[i].name + "</option>");
                }
            }
            
            self._renderSelect();
            self._renderGetData();
                
        },

        _renderSelect: function() {
            $(function() {
                $("#times_start").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 
60)), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch",
            		timepicker: false,
            		maxDate:'0',
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
                $("#times_end").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

                "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch",
            		timepicker: false,
            		maxDate:'0',
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
                $("#times_start").val("");
                $("#times_end").val("");
                
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
            /*var exportBtn = new Button({
                text: locale.get({lang: "export"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("exReport");
                    }
                }
            });*/
            //权限控制按钮的显隐
            
            if(permission.app("query_has_been_settled").read){
            	if(queryBtn) queryBtn.show();
            	//if(exportBtn) exportBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            /*if(permission.app("settle_list").write){
            	if(exportBtn) exportBtn.show();
            }else{
            	if(exportBtn) exportBtn.show();
            }*/
            $("#search-bar a").css({
                margin: "auto 0px auto 10px"
            });


        },
        destroy: function() {
            $("#search-bar").html("");
        }

    });

    return NoticeBar;

});

