/**
 * Created by zhang on 14-9-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var Window = require('cloud/components/window');
    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;
    var TotalData = [[1394899200000,14873],[1394985600000,15032],[1395072000000,15290],[1395158400000,15436],[1395244800000,15494],[1395331200000,15587],[1395417600000,15825],[1395504000000,16121],[1395590400000,16243],[1395676800000,16451],[1395763200000,16509],[1395849600000,16723],[1395936000000,16849],[1396022400000,16967],[1396108800000,17119],[1396195200000,17385],[1396281600000,17550],[1396368000000,17621],[1396454400000,17783],[1396540800000,17852],[1396627200000,18086],[1396713600000,18312],[1396800000000,18527],[1396886400000,18753],[1396972800000,18784],[1397059200000,19011],[1397145600000,19203],[1397232000000,19423],[1397318400000,19561],[1397404800000,19678],[1397491200000,19836],[1397577600000,19969],[1397664000000,20200],[1397750400000,20235],[1397836800000,20524],[1397923200000,20546],[1398009600000,20716],[1398096000000,20784],[1398182400000,20944],[1398268800000,21058],[1398355200000,21271],[1398441600000,21347],[1398528000000,21574],[1398614400000,21743],[1398700800000,21953],[1398787200000,22228],[1398873600000,22500],[1398960000000,22756],[1399046400000,22786],[1399132800000,23084],[1399219200000,23123],[1399305600000,23215],[1399392000000,23370],[1399478400000,23569],[1399564800000,23705],[1399651200000,23808],[1399737600000,24022],[1399824000000,24279],[1399910400000,24308],[1399996800000,24453],[1400083200000,24538],[1400169600000,24544],[1400256000000,24743],[1400342400000,24990],[1400428800000,25127],[1400515200000,25394],[1400601600000,25587],[1400688000000,25795],[1400774400000,25929],[1400860800000,26144],[1400947200000,26380],[1401033600000,26405],[1401120000000,26691],[1401206400000,26828],[1401292800000,27068],[1401379200000,27141],[1401465600000,27199],[1401552000000,27336],[1401638400000,27605],[1401724800000,27615],[1401811200000,27643],[1401897600000,27662],[1401984000000,27870],[1402070400000,28011],[1402156800000,28015],[1402243200000,28240],[1402329600000,28522],[1402416000000,28527],[1402502400000,28709],[1402588800000,28760],[1402675200000,28943],[1402761600000,28960],[1402848000000,29038],[1402934400000,29250],[1403020800000,29494],[1403107200000,29533],[1403193600000,29718],[1403280000000,30015],[1403366400000,30035],[1403452800000,30136],[1403539200000,30350],[1403625600000,30607],[1403712000000,30730],[1403798400000,30887],[1403884800000,30948],[1403971200000,31044],[1404057600000,31302],[1404144000000,31486],[1404230400000,31531],[1404316800000,31821],[1404403200000,32031],[1404489600000,32249],[1404576000000,32540],[1404662400000,0],[1404748800000,8],[1404835200000,9],[1404921600000,9],[1405008000000,9],[1405094400000,9],[1405180800000,9],[1405267200000,9],[1405353600000,9],[1405427400000,9],[1405429200000,9],[1405431000000,9],[1405432800000,10],[1405434600000,11],[1405436400000,12],[1405438200000,12],[1405440000000,9],[1405441800000,12],[1405443600000,12],[1405445400000,12],[1405447200000,12],[1405449000000,12],[1405450800000,12],[1405526400000,10],[1405612800000,36],[1405699200000,36],[1405785600000,37],[1405872000000,43],[1405958400000,43],[1406044800000,43],[1406131200000,45],[1406217600000,46],[1406304000000,46],[1406390400000,46],[1406476800000,47],[1406563200000,47],[1406649600000,47],[1406736000000,47],[1406822400000,47],[1406908800000,47],[1406995200000,47],[1407081600000,48],[1407168000000,48],[1407254400000,51],[1407340800000,49],[1407427200000,49],[1407513600000,49],[1407600000000,49],[1407686400000,51],[1407772800000,53],[1407859200000,53],[1407945600000,56],[1408032000000,25],[1408118400000,25],[1408204800000,25],[1408291200000,29],[1408377600000,34],[1408464000000,33],[1408550400000,40],[1408636800000,41],[1408723200000,42],[1408809600000,42],[1408896000000,43],[1408982400000,44],[1409068800000,45],[1409155200000,45],[1409241600000,47],[1409328000000,47],[1409414400000,47],[1409500800000,48],[1409587200000,49],[1409673600000,51],[1409760000000,56],[1409846400000,57],[1409932800000,57],[1410019200000,58],[1410105600000,58],[1410192000000,58],[1410278400000,59],[1410364800000,60]];


    var totalTerminal = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.service = Service;

            this.siteId = options.siteId;
            this._render();
        },

        _render:function(){
            var self = this;
            var width = this.element.width() * 0.25 - 31;
            this.element.addClass("weightContainer");

            var html = "<div class='sta-box-terminal sta-box'>" +
                "<div class='sta-box-title'>"+locale.get("total_access_terminals")+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker'>" +
                "<img src='./rainbowStatistics/apStatistics/img/mobile_phone.png'>" +
                "</div>" +
                "<div class='sta-box-details'></div>" +
                "</div>" +
                "</div>";
            this.element.html(html);
//            this.element.find(".sta-box-details").width(width-100);
            this.setData();
            this.element.find(".sta-box-terminal").width(width).bind("click",function(){
                self._renderAndOpenWin();
//                self.setData();
            }).hover(function(){
                    $(this).addClass("hover-shadow");
                },function(){
                    $(this).removeClass("hover-shadow");
                });

        },

        setData:function(){

            var self = this;
            var date = new Date().getTime();
            var data = {
                siteId : this.siteId,
                endTime : date,
                startTime : date - 6*30*86400*1000
            };
            this.service.getTotalTerminal(data,function(result){
//                result = TotalData;
                self.totalData = result;
                if(result.length > 0){
                    var total = result.last().last();
                    var container = self.element.find(".sta-box-details");
                    $("<div class='sta-box-main'>"+total+"</div>").appendTo(container);
                    var increase = self.procData(result);
                    if(increase){
                        $("<div class='sta-box-description'>"+locale.get("rise_30")+"<span>"+increase+"</span>"+"</div>").appendTo(container);
                    }else{

                    }

//                    self._renderAndOpenWin();
                }
            });
        },

        procData:function(data){
            var today = new Date().getTime();
            var newDate = data.last();
            data.sort().reverse();
            var lastDate = data.find(function(one){
                return one[0] <= today - 30 * 86400000;
            });
            data.sort();

            if(lastDate){
                return (((newDate[1]-lastDate[1])/newDate[1])*100).toFixed(0) + "%"
            }else{
                return false
            }

        },

        _renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : locale.get("terminal_statistics"),
                    top: "center",
                    left: "center",
                    height: winHeight,
                    width: winWidth,
                    mask: true,
                    blurClose:true,
//                    content : self.options.winContent,
                    events : {
                        "onClose": function() {
                            this.window = null;
                        },
//                        "afterShow": function(){
//                            this.fire("onWinShow");
//                        },
//                        "afterCreated":function(){
//                            this.fire("onAfterCreated")
//                        },

                        scope : this
                    }
                })
            }
            this.window.show();

            this.setWindowContent();

        },

        setWindowContent:function(){
            this.winChartContainer =$("<div class='total-terminal-container'></div>")
                .height(winHeight-50).width(winWidth-20);

            this.window.setContents(this.winChartContainer);

            this.winChartContainer.highcharts("StockChart",{
                chart: {
                    zoomType: 'y',
                    spacingLeft : 40
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
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataGrouping:{
                            approximation:"high",
                            forced:true,
                            units:[
                                ["day",[1,7]],
//                               ['week',[1]],
                                ["month",[1]]
                            ]
                        }
                    }
                },
                xAxis:{
                    type : "datetime"

                },
                yAxis: {
                    title: {
                        text: locale.get("total_terminal"),//"总用户数",
                        style: {
                            color: '#4572A7'
                        }
                    },
                    min:0,
                    labels: {
                        style: {
                            color: '#4572A7'
                        }
                    }
                },
                navigator:{
                    baseSeries: 1
                },
                rangeSelector: {
                    selected : 0,
                    inputEnabled : true
                },
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: locale.get("total_terminal"),//'',
                    color: '#4572A7',
                    type: 'area',
                    data: this.totalData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                }]
            })
        },


        destroy:function($super){
            $super();
        }

    });

    return totalTerminal
});