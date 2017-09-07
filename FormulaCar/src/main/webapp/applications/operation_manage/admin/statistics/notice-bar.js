define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery-ui");
    require("./js/jquery.combox");
    require("cloud/resources/css/jquery-ui.css");
    require("./css/style.css");
    require("cloud/resources/css/jquery.multiselect.css");
    require("cloud/resources/css/jquery.multiselect.filter.css");
    require("cloud/components/jquery.multiselect.filter");
    
    var Service = require("../../service");
    var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            
            this.areaIds = [];
            this.lineIds = [];
            this.deviceIds = [];
            this._render();
        },
        _render: function() {
        	
            this.draw();
            this.getData();
        },
        draw: function() {
            var self = this; 
            var $htmls = $(+"<div></div>" +
        	        "<div style='margin-top: 5px;margin-bottom: 5px;height: 20px;' id='search'>" +
        	        "<div style='float:left;margin-left: 2%;'>" +
	                    "<select id='reportType'  name='reportType' style='width:100px;height: 28px;'>" +
		                    "<option value='1' selected = 'selected'>" + locale.get({lang: "daily_chart"}) + "</option>" +
		                    "<option value='2'>" + locale.get({lang: "monthly_report"}) + "</option>" +
		                    "<option value='3'>" + locale.get({lang: "year_report"}) + "</option>" +
		                    "<option value='4'>" + locale.get({lang: "custom_report"}) +"</option>" +
	                    "</select>&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;height: 28px;'>" +
                    	"<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_date' />&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;height: 28px;margin-left:-10px;'>" +
                    	"<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_month'/>&nbsp;&nbsp;" +
                    "</div>" +
		            "<div style='float:left;height: 28px;'>" +
		            	"<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_startTime' />&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;height: 28px;'>" +
	                	"<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_endTime'/>" +
	                "</div>" +
	                "<div style='float:left;height: 28px;margin-left:-15px;margin-right: 10px;'>" +
		                "<select id='summary_year' style='height: 28px;display:none;width:122px'>" +
		                      "<option value='2015' selected='selected'>2015</option>" +
		                      "<option value='2016'>2016</option>" +
		                      "<option value='2017'>2017</option>" +
		                      "<option value='2018'>2018</option>" +
		                      "<option value='2019'>2019</option>" +
		                "</select>" +
	                "</div>" +
	                "<div style ='float: left;'>" +
                    "<select  id='organ'  multiple='multiple'   class='form-control multi-select' style='width:180px;height: 28px;'></select>&nbsp;&nbsp;" + //
                    "</div>" + 
                    
                    "<div id='buttonDiv' style='float:left;height: 28px;margin-left:5px;'></div>" +
		  			
		          "</div>");
            this.element.append($htmls);

            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#organ").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "organization_name"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 185,
                    height: 120
                });
            });
           
            $("#summary_month").val("");
            $("#summary_year").val("");
            $("#trade").unmask();
            this._renderBar();
            this._renderSelect();
            this._renderBtn();
            
            $(document).ready(function() {
            	$('#combox').combox({assetIds:[],ids:[]});
            })
        },
        compare:function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            } 
        },
        getData: function() {
        	var self = this;
        	
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];

            Service.getAllOrgan(function(data){
            	if(data && data.result){
            		var data_ = data.result.sort(self.compare("name"));//对机构进行排序
            		for(var i=0;i<data_.length;i++){
            			var org = data_[i];
            			$("#organ").append("<option id='"+org._id+"' value='" + org._id + "'>" + org.name + "</option>");
            		}
            		require(["cloud/lib/plugin/jquery.multiselect"], function() {
            			$("#organ").multiselect("refresh");
            		});
            	}
            });
            
        },
        _renderBar: function() {
            var self = this;
            $("#reportType").bind('change', function() {
                var selectedId = $("#reportType").find("option:selected").val();
                if (selectedId == "1") {
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_date").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_year").val("");
                    $("#summary_month").val("");
                    $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                } else if (selectedId == "2") {
                    $("#summary_date").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_month").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_date").val("");
                    $("#summary_year").val("");
                    $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM"));
                } else if (selectedId == "3") {
                    $("#summary_date").css("display", "none");
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_date").val("");
                    $("#summary_month").val("");
                }else if(selectedId == "4"){
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_date").css("display", "none");
                    $("#summary_startTime").css("display", "block");
                    $("#summary_endTime").css("display", "block");
                    $("#summary_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 

60 * 60)), "yyyy/MM/dd"));
                    $("#summary_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                }
            });
        },
        _renderSelect: function() {
            $(function() {
                $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

"yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
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
                    },
                })

                $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

"yyyy/MM")).datetimepicker({
                    timepicker: false,
                    format: 'Y/m',
                    onShow: function() {
                        $(".xdsoft_calendar").hide();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    lang: locale.current() === 1 ? "en" : "ch"
                })
                $("#summary_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 

60)), "yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				 $("#summary_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
            });
        },
        _renderBtn: function() {
            var self = this;
            //查询
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
            if(permission.app("transaction_summary").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
        }

    });

    return NoticeBar;

});
