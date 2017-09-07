/**
 * Created by inhand on 14-6-27.
 */
define(function(require){

    require("cloud/base/cloud");
    var Window = require("cloud/components/window");
    var Button = require("cloud/components/button");
    var html = require("text!./monitorInfo.html");
    var Table = require("cloud/components/table");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/highstock.src");
    require("cloud/lib/plugin/exporting.src")
    var Paging = require("cloud/components/paging");
    var Service = require('./service');
    var winHeight = 424;
    var winWidth = 800;
    var COLOR = Highcharts.getOptions().colors[0];
    var COLOR1	= Highcharts.getOptions().colors[1];
    var dateFormat=function(date,format){
        date = new Date(date.getTime());
        var o = {
            "M+" : date.getMonth() + 1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth() + 3) / 3),
            "S" : date.getMilliseconds()
        };
        if (/(y+)/.test(format)){
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for ( var k in o){
            if (new RegExp("(" + k + ")").test(format)){
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    var MonitorInfo = Class.create(cloud.Component , {
        initialize:function($super,options){
            $super(options);
            this.siteId = options.siteId;
            this.cursor=0;
            this.display = null;
			this.pageDisplay = 30;
            this.draw();
            this.getData();
        },
        getData:function(){
        	//console.log("siteId======"+this.siteId); 
        	cloud.util.mask(".monitor-info-content");
        	var myDate=new Date();
        	var full = myDate.getFullYear(); 
        	var month = myDate.getMonth() +1;
        	var day = myDate.getDate();
        	var date =  full+"/"+month+"/"+day;
        	var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
        	var endTime = (new Date(date+" 23:59:59")).getTime()/1000; 
        	Service.getDayAllStatisticBySiteId(this.siteId,startTime,endTime,function(data){
        		//console.log(data);
        		cloud.util.unmask(".monitor-info-content");
        	    var amountOnLine = data.result[0].amountOnLine;
   			    var sumOnLine = data.result[0].sumOnLine;
   			    var amountOutLine = data.result[0].amountOutLine;
   			    var sumOutLine = data.result[0].sumOutLine;
   			    
        		if(data.result && data.result[0].amountOnLine){
        			$("#monitor-info-number_of_transactions").text(amountOnLine);//线上金额
        		}else{
        			$("#monitor-info-number_of_transactions").text("0");
        		}
        		if(data.result && data.result[0].amountOutLine){
        			$("#monitor-info-amount").text(amountOutLine);//线下金额
        		}else{
        			$("#monitor-info-amount").text("0");
        		}
        		if(data.result &&  data.result[0].sumOnLine){
        			$("#monitor-info-alarm").text(sumOnLine);//线上交易数
        		}else{
        			$("#monitor-info-alarm").text("0");
        		}
        		if(data.result &&  data.result[0].sumOutLine){
        			$("#monitor-info-online-rate").text(sumOutLine);//线下交易数
        		}else{
        			$("#monitor-info-online-rate").text("0");
        		}
        		
        	});
        },
        draw:function(){
            this.element.html(html);

            locale.render({element:this.element});
            this.$name = this.element.find("#monitor-info-name");
            this.$address = this.element.find("#monitor-info-location");
            this.$user = this.element.find("#monitor-info-number_of_transactions");//交易数
            this.$terminal = this.element.find("#monitor-info-amount");//金额
            this.$online_rate = this.element.find("#monitor-info-online-rate");//在线率
            this.$alarm = this.element.find("#monitor-info-alarm");//告警
            this.$traffic = this.element.find("#monitor-info-traffic");
            
            this.bindEvent();
            this.drawOptbar();
        },


        drawOptbar:function(){
            var self = this;
            var Wapper = this.element.parent();
            /*var container = $("<div class='monitor-info-optbar'></div>").appendTo(Wapper);
            new Button({
                container:container,
                imgCls : "cloud-icon-history",
                events:{
                       click:function(){
                           var win = self.openWin(500,1040);

                           self.renderStat(win);
                       }
                }
            });*/
          /*  new Button({
                container:container,
                imgCls:"cloud-icon-label",
                events:{
                    click:function(){
                        var win=self.openWin(560,1040);
                        self.renderMacTrace(win);
                    }
                }
            })*/
        },

        bindEvent:function(){
            var self = this;
            this.element.find("#monitor-info-name").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');
            });
            //线上金额
            this.element.find("#monitor-info-number_of_transactions").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
           //线下金额
            this.element.find("#monitor-info-amount").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');
            });
        
            this.element.find("#monitor-info-alarm").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
            this.element.find("#monitor-info-online-rate").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
            

        },

        renderStat:function(window){
            var windowContent = $("<div>").addClass("monitor-user-content");
            window.setTitle(locale.get("user_ter_stat")+"-"+this.site.name);
            window.setContents(windowContent);


            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                textKey: 'downloadPNG',
                                onclick: function () {
                                    this.exportChart();
                                }
                            }, {
                                textKey: 'downloadJPEG',
                                onclick: function () {
                                    this.exportChart({
                                        type: 'image/jpeg'
                                    });
                                }
                            }]
                        }
                    }
                },
                xAxis:{
                    allowDecimals:false
                },
                yAxis:{
                    allowDecimals:false
                }
            });

            windowContent.highcharts("StockChart",{
                chart: {
                    zoomType: 'y'
//                    spacingLeft : 40
                },
                credits:{
                    enabled:false
                },
                title:{
                    text:""
                },
                legend: {
                    enabled: true
                },
                plotOptions:{
                    line:{
                        marker:{
                            enabled: false
                        },
                        lineWidth : 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        dataGrouping:{
//                           enabled:false,
                            approximation:"high",
                            groupPixelWidth:15,
                            forced:false,
                            units:[
                                ['minute',[10]],
                                ["hour",[1]],
                                ["day",[1]]

                            ]
                        }
                    }
                },
                xAxis:{
                    type : "datetime"

                },
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: '#89A54E'
                        }
                    },
                    min : 0,
                    minPadding : 5
                }]
            });

            var chart = windowContent.highcharts();


            cloud.util.mask(window.contents);
            this.getStat(function(data){
                cloud.util.unmask(window.contents);
                //console.log(data);
                var flag = false;
                var vars = data.result[0].vars;
                var values = vars.pluck("values");
                values.each(function(value){
                    if(value.length>0){
                        flag = true;
                    }
                })
                if(flag){

                    data.result[0] && data.result[0].vars.each(function(one){
                        if(one.varId == 310001){//
                            var userChart = chart.get("310001");
                            if(userChart){
                                userChart.setData(one.values);
                            }else{
                                chart.addSeries({
                                    id:"310001",
                                    name: locale.get("user"),//'用户',
                                    color: 'rgb(135, 139, 239)',
                                    type: 'line',
                                    data: one.values,
                                    tooltip: {
                                        valueSuffix: locale.get("ren")//'人'
                                    }
                                })
                            }
                        }
                        if(one.varId == 310002){
                            var terminalChart = chart.get("310002");
                            if(terminalChart){
                                terminalChart.setData(one.values);
                            }else{
                                chart.addSeries({
                                    id:"310002",
                                    name: locale.get("terminal"),//'终端',
                                    color: '#89A54E',
                                    type: 'line',
                                    data: one.values,
                                    tooltip: {
                                        valueSuffix: locale.get("ren")//'人'
                                    }
                                })
                            }

                        }

                    });
                }else{
                    chart.destroy();
                    windowContent.html("<p style='text-align:center'>"+locale.get("no_data")+"<p>")
                }
            },function(xhr){
                var value = (xhr.loaded / xhr.total * 100).toFixed(0)+"%"
                cloud.util.setMasklab(window.contents,value);
            })


        },
        renderMacTrace:function(window){
            var self = this;
            var windowContent = $("<div><div id='table_toolbar_mac_trace'></div><div id='table_content_mac_trace'></div><div id='table_pagin_mac_trace'></div></div>").addClass("monitor-mac-content");
//            var pagingContent=$("<div>").after(windowContent);
            windowContent.find("#table_content_mac_trace").css({
                "height":"460px",
                "overflow":"auto"
            });
            window.setTitle(locale.get("visitor_records"));
            window.setContents(windowContent);

//            var ids = self.userList.pluck("userId");
//            ids && self.getUserName(ids,function(data){

            self.macTraceTable = new Table({
                selector: "#table_content_mac_trace",
                columns:[{
                    "title":"MAC",
                    "lang":"{text:mac_addr}",
                    "dataIndex":"mac",
                    "width":"13%"
                },
                {
                    "title":"时间",
                    "lang":"{text:time}",
                    "dataIndex":"timestamp",
                    "width":"13%",
                    render:function(value,type){
                        if(type=="display"){
                            return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                        }else{
                            return value;
                        }
                    }
                },{
                    "title":"源IP",
                    "lang":"{text:source_ip}",
                    "dataIndex":"sIp",
                    "width":"13%"
                },{
                    "title":"源端口",
                    "lang":"{text:source_port}",
                    "dataIndex":"sPort",
                    "width":"8%"
                },{
                    "title":"目标IP",
                    "lang":"{text:desination_ip}",
                    "dataIndex":"dIp",
                    "width":"13%"
                },{
                    "title":"目标端口",
                    "lang":"{text:desination_port}",
                    "dataIndex":"dPort",
                    "width":"8%"
                },{
                    "title":"协议",
                    "lang":"{text:protocol}",
                    "dataIndex":"proto",
                    "width":"8%"
                },{
                    "title":"NAT源IP",
                    "lang":"{text:nat_source_ip}",
                    "dataIndex":"natSourceIp",
                    "width":"13%"
                },{
                    "title":"NAT源端口",
                    "lang":"{text:nat_source_port}",
                    "dataIndex":"natSourcePort",
                    "width":"11%"
                }],
                datas:[],
                events:{

                }
            });
            locale.render();
            self.renderToolbar();
            self.setDataToTable();
        },
        requestTraceRecord:function(options,callback,context){
            cloud.util.mask($("body").find("#ui-window-body"));
            cloud.Ajax.request({
                url:"api/wifi/log",
                type:"GET",
                parameters:options,
                success:function(data){
                    if(!data.total){
                        data={
                            cursor:self.cursor,
                            limit:self.pageDisplay,
                            total:0,
                            result:[]
                        }
                    }
                    callback.call(context||this,data);
                    cloud.util.unmask($("body").find("#ui-window-body"));
                },
                error:function(data){
                    cloud.util.unmask($("body").find("#ui-window-body"));
                }
            });
        },
        renderToolbar:function(){
            var self=this;
            var divHtml=$("<div style='text-align: left'><label style='display:inline-block;margin-left:10px;font-weight:bold;font-size:14px;' lang='{text:device_name+:}'></label><input type='text'  id='mac_trace_device_name' disabled/><input type='text' id='mac_trace_start_time' /><span class='middle_to' lang='text:to'></span><input type='text' id='mac_trace_end_time' /><span id='mac_trace_query_button'></span></div>");
            if(locale.current()==2){
                divHtml.find("#mac_trace_start_time").css({
                    "margin-left":"450px"
                })
            }else{
                divHtml.find("label").css({
                    "width":"100px"
                })
                divHtml.find("#mac_trace_start_time").css({
                    "margin-left":"400px"
                })
            }
            divHtml.find(".middle_to").css({
                "display":"inline-block",
                "width":"30px",
                "line-height":"38px",
                "text-align":"center"
            });
            if(self.device.result[0]){
                divHtml.find("#mac_trace_device_name").val(self.device.result[0].name).css({
                    "color":"rgb(0,0,0)",
                    "font-weight":"bold",
                    "font-size":"14px"
                });
            }
            divHtml.find("#mac_trace_query_button").css({
                "margin-left":"15px",
                "position":'relative',
                "top":"-2px"
            });
            divHtml.find("#mac_trace_start_time").val(dateFormat(new Date((new Date()).getTime()-1000*60*60*24*3),"yyyy/MM/dd hh:mm")).datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });
            divHtml.find("#mac_trace_end_time").val(dateFormat(new Date((new Date()).getTime()+1000*60*60*24*4),"yyyy/MM/dd hh:mm")).datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });
            new Button({
                container:divHtml.find("#mac_trace_query_button"),
                text:locale.get("query"),
                events:{
                    click:function(){
                        var startTime=$("#mac_trace_start_time").val();
                        startTime=(new Date(startTime)).getTime();
                        self.opt.start_time=startTime;
                        var endTime=$("#mac_trace_end_time").val();
                        endTime=(new Date(endTime)).getTime();
                        if(startTime>endTime){
                            dialog.render({lang:"start_date_cannot_be_greater_than_end_date"})
                        }else{
                            self.opt.end_time=endTime;
                            self.cursor=0;
                            self.opt.cursor=self.cursor;
//                            cloud.util.mask("#table_content_mac_trace")
                            self.requestTraceRecord(self.opt,function(data){
                                self.macTraceTable.render(data.result);
                                self.pageUp.disable();
                                if(data.result.length==0){
                                    self.pageDown.disable();
                                }
                                else{
                                    self.pageDown.enable();
                                }
//                                cloud.util.unmask("#table_content_mac_trace");
                            },this)
                        }
                    },
                    scope:this
                }
            })
            divHtml.appendTo($("#table_toolbar_mac_trace").css({
                height:"38px"
            }));
            locale.render({element:divHtml});
        },
        renderPaging:function(data){
            var self = this;
//            this.paging = null;
            var divHtml=$("<div><span id='button_page_up'></span><span id='button_page_down'></span></div>");
            divHtml.appendTo($("#table_pagin_mac_trace")).css({
                "text-align":"center"
            });
            self.pageUp=new Button({
                container:$("#table_pagin_mac_trace").find("#button_page_up"),
                text:locale.get("previous_page"),
                events:{
                    click:function(){
                        self.opt.cursor=--self.cursor;
                        self.requestTraceRecord(self.opt,function(returnData){
//                            self.renderPaging(returnData);
//                            cloud.util.unmask("#table_content_mac_trace");
                            self.macTraceTable.render(returnData.result);
                            if(self.cursor==0){
                                self.pageUp.disable();
                            }
                            self.pageDown.enable();
                        },this);
                    },
                    scope:this
                }
            });
            self.pageDown=new Button({
                container:$("#table_pagin_mac_trace").find("#button_page_down"),
                text:locale.get("next_page"),
                events:{
                    click:function(){
                        self.opt.cursor=++self.cursor;
                        self.requestTraceRecord(self.opt,function(returnData){
//                            self.renderPaging(returnData);
//                            cloud.util.unmask("#table_content_mac_trace");
                            self.macTraceTable.render(returnData.result);
                            if(returnData.result.length==0){
                                self.pageDown.disable();
                            }
                            self.pageUp.enable();
                        },this)
                    },
                    scope:this
                }
            });
            if(data.result==0){
                self.pageDown.disable();
            }
            self.pageUp.disable();
//            cloud.util.unmask("#table_content_mac_trace");
            self.macTraceTable.render(data.result);
        },
        setDataToTable:function(){
            var self=this;
            var startTime=$("#mac_trace_start_time").val();
            startTime=(new Date(startTime)).getTime();
            var endTime=$("#mac_trace_end_time").val();
            endTime=(new Date(endTime)).getTime();
//            var mac=self.data.mac;
            self.opt={
                cursor:self.cursor,
                device_id:self.deviceId,
                start_time:startTime,
                end_time:endTime
//                mac:mac
            };
//            var data={
//                    total:1,
//                    cursor:0,
//                    limit:30,
//                    result:[{
//                        "timestamp":"1404201635000",
//                        "url":"www.baidu.com"
//                    }]
//                };
//            self.renderPaging(data);
            if(self.opt.device_id){
                self.requestTraceRecord(self.opt,function(returnData){
                    self.renderPaging(returnData);
                },this)
            }else{
                var returnData={
                    cursor:0,
                    limit:1,
                    total:1,
                    result:[]
                };
                self.renderPaging(returnData)
            }
        },
        procTime:function(seconds){
            seconds *= 1;
            var strTime = "";

            function saveInteger(data){
                data += "";
                if(data.indexOf(".") > 0){
                    data = data.substring(0,data.indexOf("."));
                }
                return data;
            }
            if(seconds < 60){
                strTime = seconds + locale.get("seconds");
            }else if(seconds >= 60 && seconds < 3600){
                strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
                strTime += seconds % 60 + locale.get("seconds");
            }else if(seconds > 3600 && seconds < 3600 * 24){
                strTime += saveInteger(seconds / (60 * 60)) + locale.get("hours");
                strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
                strTime += seconds % 60 + locale.get("seconds");
            }else{
                strTime += saveInteger(seconds / (60 * 60 * 24)) + locale.get("days");
                strTime += saveInteger(seconds / (60 * 60) % 24) + locale.get("hours");
                strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
                strTime += seconds % 60 + locale.get("seconds");
            }
            return strTime;
        },
        //交易数
        renderNumber_transactionsWin:function(window){
            var self = this;
            var windowContent =$("<div class='monitor-user-content'></div>");
            var $htmls = $(+"<div></div>" +
                  "<div id='search-bar' style='width:auto;height:30px;margin-top:3px;margin-left:3px;'>" +
      			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"from"})+"</label>&nbsp;&nbsp;"+
      			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
      			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"to"})+"</label>&nbsp;&nbsp;"+
      			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
      			  "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"automat_name_of_commodity"})+" </label>" +
      			  "<input style='width:200px' type='text'  id='' />&nbsp;&nbsp;"  +
                  "</div>");
            windowContent.append($htmls);
           
            window.setTitle(locale.get("automat_trade_detail")+"-"+this.site.name);
            window.setContents(windowContent);
            this._renderSelect();
            
            this.number_transactions_table = new Table({
                    selector: ".monitor-user-content",
                    columns:[{
                        "title":locale.get("automat_serial_number"),//"序号",
                        "dataIndex":"serial_number",
                        "width":"5%"
                    },{
                        "title":locale.get("automat_transaction_serial_number"),//"交易流水号",
                        "dataIndex":"transaction_serial_number",
                        "width":"20%"
                    },{
                        "title":locale.get("automat_exchange_hour"),//"交易时间",
                        "dataIndex":"exchange_hour",
                        "width":"15%",
                        render:function(data){
                            return cloud.util.dateFormat(new Date(data),"yyyy-MM-dd hh:mm:ss",false)
                        }
                    },{
                        "title":locale.get("automat_machine_number"),//"自贩机编号",
                        "dataIndex":"machine_number",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_item_number"),//"商品编号",
                        "dataIndex":"item_number",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_description_of_the_goods"),//"商品描述",
                        "dataIndex":"description_of_the_goods",
                        "width":"20%"
                    },{
                        "title":locale.get("automat_bargain_price"),//"交易价格",
                        "dataIndex":"bargain_price",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_transaction_mode"),//"交易方式",
                        "dataIndex":"transaction_mode",
                        "width":"10%"
                    }],
                    datas:[],
                    events:{

                    }
                });
            var data = {"total":15,"cursor":0,"limit":30,
					   "result":[
					             {"serial_number":"1","transaction_serial_number":"00111203375678","exchange_hour":"2014-11-19 19:31:24","machine_number":"00001","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
					             {"serial_number":"2","transaction_serial_number":"00111203375677","exchange_hour":"2014-11-19 19:31:24","machine_number":"00002","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"现金"},
					             {"serial_number":"3","transaction_serial_number":"00111203375676","exchange_hour":"2014-11-19 19:31:24","machine_number":"00003","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
					             {"serial_number":"4","transaction_serial_number":"00111203375675","exchange_hour":"2014-11-19 19:31:24","machine_number":"00004","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"微信"}
					             ]
					    };
            //this.getUsers(this.deviceId,function(data){
            this.number_transactions_table.render(data.result);
            //})
            
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    }
                }
            });
            var $paging = $("<div id='number-transactions-paging' style='margin-top:500px;'></div>");
            windowContent.append($paging);
            this._render_number_transactions_page(data, 1);
        },
        _render_number_transactions_page:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#number-transactions-paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var data = {"total":15,"cursor":0,"limit":30,
        						   "result":[
        						             {"serial_number":"1","transaction_serial_number":"00111203375678","exchange_hour":"2014-11-19 19:31:24","machine_number":"00001","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
        						             {"serial_number":"2","transaction_serial_number":"00111203375677","exchange_hour":"2014-11-19 19:31:24","machine_number":"00002","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"现金"},
        						             {"serial_number":"3","transaction_serial_number":"00111203375676","exchange_hour":"2014-11-19 19:31:24","machine_number":"00003","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
        						             {"serial_number":"4","transaction_serial_number":"00111203375675","exchange_hour":"2014-11-19 19:31:24","machine_number":"00004","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"微信"}
        						             ]
        						    };	
        				callback(data);

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.number_transactions_table.clearTableData();
        			    self.number_transactions_table.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        },    
        _renderSelect:function(){
			$(function(){
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
			});
		},
		//金额
		renderAmountWin:function(window){
			var self = this;
            var windowContent =$("<div class='monitor-amount-content'></div>");
            var $htmls = $(+"<div></div>" +
                  "<div id='search-bar' style='width:auto;height:30px;margin-top:3px;margin-left:3px;'>" +
      			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"from"})+"</label>&nbsp;&nbsp;"+
      			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
      			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"to"})+"</label>&nbsp;&nbsp;"+
      			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
      			  "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"automat_name_of_commodity"})+" </label>" +
      			  "<input style='width:200px' type='text'  id='' />&nbsp;&nbsp;"  +
                  "</div>");
            windowContent.append($htmls);
           
            window.setTitle(locale.get("automat_trade_detail")+"-"+this.site.name);
            window.setContents(windowContent);
            this._renderSelect();
            
            this.amount_table = new Table({
                    selector: ".monitor-amount-content",
                    columns:[{
                        "title":locale.get("automat_serial_number"),//"序号",
                        "dataIndex":"serial_number",
                        "width":"5%"
                    },{
                        "title":locale.get("automat_transaction_serial_number"),//"交易流水号",
                        "dataIndex":"transaction_serial_number",
                        "width":"20%"
                    },{
                        "title":locale.get("automat_exchange_hour"),//"交易时间",
                        "dataIndex":"exchange_hour",
                        "width":"15%",
                        render:function(data){
                            return cloud.util.dateFormat(new Date(data),"yyyy-MM-dd hh:mm:ss",false)
                        }
                    },{
                        "title":locale.get("automat_machine_number"),//"自贩机编号",
                        "dataIndex":"machine_number",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_item_number"),//"商品编号",
                        "dataIndex":"item_number",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_description_of_the_goods"),//"商品描述",
                        "dataIndex":"description_of_the_goods",
                        "width":"20%"
                    },{
                        "title":locale.get("automat_bargain_price"),//"交易价格",
                        "dataIndex":"bargain_price",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_transaction_mode"),//"交易方式",
                        "dataIndex":"transaction_mode",
                        "width":"10%"
                    }],
                    datas:[],
                    events:{

                    }
                });
            var data = {"total":15,"cursor":0,"limit":30,
					   "result":[
					             {"serial_number":"1","transaction_serial_number":"00111203375678","exchange_hour":"2014-11-19 19:31:24","machine_number":"00001","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
					             {"serial_number":"2","transaction_serial_number":"00111203375677","exchange_hour":"2014-11-19 19:31:24","machine_number":"00002","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"现金"},
					             {"serial_number":"3","transaction_serial_number":"00111203375676","exchange_hour":"2014-11-19 19:31:24","machine_number":"00003","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
					             {"serial_number":"4","transaction_serial_number":"00111203375675","exchange_hour":"2014-11-19 19:31:24","machine_number":"00004","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"微信"}
					             ]
					    };
            //this.getUsers(this.deviceId,function(data){
            this.amount_table.render(data.result);
            //})
            
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    }
                }
            });
            var $paging = $("<div id='amount-paging' style='margin-top:500px;'></div>");
            windowContent.append($paging);
            this._amount_table_page(data, 1);
        },
        _amount_table_page:function(data, start){
        	var self = this;
        	if(this.amountpage){
        		this.amountpage.reset(data);
        	}else{
        		this.amountpage = new Paging({
        			selector : $("#amount-paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var data = {"total":15,"cursor":0,"limit":30,
        						   "result":[
        						             {"serial_number":"1","transaction_serial_number":"00111203375678","exchange_hour":"2014-11-19 19:31:24","machine_number":"00001","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
        						             {"serial_number":"2","transaction_serial_number":"00111203375677","exchange_hour":"2014-11-19 19:31:24","machine_number":"00002","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"现金"},
        						             {"serial_number":"3","transaction_serial_number":"00111203375676","exchange_hour":"2014-11-19 19:31:24","machine_number":"00003","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"支付宝声波"},
        						             {"serial_number":"4","transaction_serial_number":"00111203375675","exchange_hour":"2014-11-19 19:31:24","machine_number":"00004","item_number":"6875757","description_of_the_goods":"统一冰红茶瓶装(500ml)","bargain_price":"4","transaction_mode":"微信"}
        						             ]
        						    };	
        				callback(data);

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.amount_table.clearTableData();
        			    self.amount_table.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        },    
        //在线率
        render_Online_rate_Win:function(window){
        	var self = this;
        	
        	this.winChartContainer = $("<div class='online-chart-container'></div>")
             .height(winHeight-50).width(winWidth-20);
        	
            window.setTitle(locale.get("automat_online_detail")+"-"+this.site.name);
            window.setContents(this.winChartContainer);
            
            this.data1= [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
            this.data2= [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8];
                    
            this.winChartContainer.highcharts("StockChart",{
                chart: {
                    type: 'line',
                    zoomType:"y",
                    spacingLeft:40
                },
                title: {
                    text: ''
                },
                xAxis: {
                	 dateTimeLabelFormats: {
                         second: '%H:%M:%S',
                         minute: '%H:%M',
                         hour: '%H:%M',
                         day: '%m-%d',
                         week: '%m-%d',
                         month: '%Y-%m',
                         year: '%Y'
                       },
                       type : "datetime"
                },
                yAxis: {
                	title: {
                        text: locale.get("online_rate")
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                navigator:{
                    baseSeries: 1
                },
                rangeSelector: {
                    selected : 0,
                    inputEnabled : true
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                series: [{
                    name: locale.get("automat_terminal"),
                    color: COLOR,
                    type: 'line',
                    data: this.data1,
                    tooltip: {
                        valueSuffix: locale.get("ren")
                    }

                },{
                    name: locale.get("automat_user"),
                    color: COLOR1,
                    type: 'line',
                    data: this.data2,
                    tooltip: {
                        valueSuffix: locale.get("ren")
                    }

                }]
            });
        },
        render_alarm_Win:function(window){
			var self = this;
            var windowContent =$("<div class='monitor-alarm-content'></div>");
           
            window.setTitle(locale.get("automat_alarm_list"));
            window.setContents(windowContent);
            this._renderSelect();
            
            this.alarm_table = new Table({
                    selector: ".monitor-alarm-content",
                    columns:[{
                        "title":locale.get("automat_serial_number"),//"序号",
                        "dataIndex":"serial_number",
                        "width":"5%"
                    },{
                        "title":locale.get("automat_alarm_number"),//"告警编号",
                        "dataIndex":"alarm_number",
                        "width":"20%"
                    },{
                        "title":locale.get("automat_list_alarm_time"),//"告警时间",
                        "dataIndex":"alarm_time",
                        "width":"25%",
                        render:function(data){
                            return cloud.util.dateFormat(new Date(data),"yyyy-MM-dd hh:mm:ss",false)
                        }
                    },{
                        "title":locale.get("automat_machine_number"),//"自贩机编号",
                        "dataIndex":"machine_number",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_list_type"),//"类型",
                        "dataIndex":"type",
                        "width":"10%"
                    },{
                        "title":locale.get("automat_list_description"),//"告警描述",
                        "dataIndex":"description",
                        "width":"30%"
                    }],
                    datas:[],
                    events:{

                    }
                });
            var data = {"total":15,"cursor":0,"limit":30,
					   "result":[
					             {"serial_number":"1","alarm_number":"00111203375678","alarm_time":"2014-11-19 19:31:24","machine_number":"00001","type":"掉线","description":"统一冰红茶瓶装(500ml)"},
					             {"serial_number":"2","alarm_number":"00111203375677","alarm_time":"2014-11-19 19:31:24","machine_number":"00002","type":"超流量","description":"统一冰红茶瓶装(500ml)"},
					             {"serial_number":"3","alarm_number":"00111203375676","alarm_time":"2014-11-19 19:31:24","machine_number":"00003","type":"缺货","description":"统一冰红茶瓶装(500ml)"},
					             {"serial_number":"4","alarm_number":"00111203375675","alarm_time":"2014-11-19 19:31:24","machine_number":"00004","type":"缺硬币","description":"统一冰红茶瓶装(500ml)"}
					             ]
					    };
            //this.getUsers(this.deviceId,function(data){
            this.alarm_table.render(data.result);
            //})
        },
        openWin:function(height,width){
            var window = new Window({
                container: "body",
//                title: title,
                top: "center",
                left: "center",
                height: height || 600,
                width: width || 800,
                mask: true,
                drag:true,
                blurClose:true,
//                content: windowContent,
                events: {
                    "onClose": function() {
                        window = null;
                        this.cursor=0;
                    },
                    scope: this
                }
            });

            window.show();

            return window;

        },

        renderLoction:function(data){
            var location = data.location;
            var self = this;
            if(data.address){
                self.$address.text(data.address)
            }else{
                if(locale.current() == 2){
                    $.ajax({
                        url:"http://api.map.baidu.com/geocoder/v2/?ak=igOsSxpE8m53VyD8gl8zB79M&location="+location.latitude+","+location.longitude+"&output=json&pois=0",
                        dataType:"jsonp",
                        success:function(data){
                            self.$address.text(data.result.formatted_address)
                        }
                    });
                }else{
                    self.$address.text("");
                }

            }


        },

        setCount:function(){
            var self = this;
            self.getCurrent(function(data){
                var userCount,terminalCount;
                data.result[0].vars.each(function(one){
                    if(one.id == "310001"){
                        userCount = one.value;
                    }
                    if(one.id == "310002"){
                        terminalCount = one.value;
                    }
                });

                self.$user.text(userCount);
                self.$terminal.text(terminalCount);
            });

        },

        render:function(data){
            this.site = data;
            var self = this;
            self.$online_rate.text("");
            self.$alarm.text("0");
            this.$name.text(data.name);
            this.renderLoction(data);
           /* this.getDevBySiteid(data._id,function(data){
                self.device = data;
                if(data.result[0]){
                    self.deviceId = data.result[0]._id;

                    self.setCount();
                    self.timer = setInterval(function(){
                        self.setCount()
                    },120*1000);


                    self.getTrffic(self.deviceId,function(data){
//                    console.log(data,'trffic');
                        var value = cloud.util.unitConversion(data.result[0].total)
                        self.$traffic.text(value);
                    });
                }
            });*/


        },

        enable:function(){

        },

        setLocation:function(){

        },

        getCurrent:function(callback){
            var self = this;
            cloud.Ajax.request({
                url: "api/rt_data",
                type: "post",
                dataType: "JSON",
                parameters: {
                },
                data:{
                    "devices":[{
                        "deviceId":self.deviceId,
                        "varIds":["310001","310002"]
                    }]
                },
                success:function(data){
                    callback.call(this,data);
                }
            });

        },

        getStat:function(callback,progressCb){
            var self = this;
            var date = new Date()
            var endTime = (date.getTime()/1000).toFixed(0);
            var startTime = endTime - 3*30*86400;
            cloud.Ajax.request({
                url: "api/data",
                type: "post",
                dataType: "JSON",
                parameters: {
                    start_time : startTime,
                    end_time : endTime
                },
                data:{
                    "devices":[{
                        "deviceId":self.deviceId,
                        "varIds":["310001","310002"]
                    }]
                },
                progress:function(xhrProgressEvent,progress){
                    progressCb.call(this,xhrProgressEvent);
//                    console.log(xhrProgressEvent.loaded / xhrProgressEvent.total * 100+"%");
                },
                success:function(data){
                    callback.call(this,data);
                }
            });
        },

        getTrffic:function(id,callback){
            var date = new Date()
            var mon = date.getMonth() + 1;
            var year = date.getFullYear();
            var month;
            if(mon<10){
                month = year+"0"+mon;
            }else{
                month = year+""+mon;
            }
            cloud.Ajax.request({
                url: "api/traffic_month/list",
                type: "post",
                dataType: "JSON",
                parameters: {
                    month:month
                },
                data:{resourceIds:[id]},
                success:function(data){
                    callback.call(this,data);
                }
            })
        },

        getUserName:function(ids,callback){
            cloud.Ajax.request({
                url:"api/Wi-Fi_user/",
                type:"post",
                dataType:"JSON",
                data:{resourceIds:ids},
                success:function(data){
                    callback.call(this,data);
                }
            })
        },

        getTerminals:function(id,callback){
            cloud.Ajax.request({
                url:"api/device/"+id+"/terminals",
                parameters:{},
                success:function(data){
                    callback.call(this,data);
                }
            })
        },

        getUsers:function(id,callback){
            cloud.Ajax.request({
                url:"api/device/"+id+"/users",
                parameters:{},
                success:function(data){
                    callback.call(this,data);
                }
            })
        },

        getDevBySiteid:function(id,callback){
            cloud.Ajax.request({
                url:"api/devices",
                parameters: {
                    site_id:id
                },
                success:function(data){
                    callback.call(this,data);
                }
            })

        },

        destroy:function($super){
            this.timer && clearInterval(this.timer)

            $super();

        }

    });

    return MonitorInfo;

})