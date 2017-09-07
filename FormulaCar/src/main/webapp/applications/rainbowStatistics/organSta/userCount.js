/**
 * Created by inhand on 14-6-10.
 */
define(function(require){
   var DashBoard = require("../../components/dashweight/dashboard");
//   require("cloud/lib/plugin/highstock.src");
//    require("http://code.highcharts.com/stock/highstock.js")
//    require("cloud/lib/plugin/exporting.src")
//   var chart = require("../../components/content-chart");
    var Service = require("./service");

   var winHeight = 524;
   var winWidth = 1100;

   var userCount = Class.create(cloud.Component,{
       initialize : function($super,options){

           $super(options)

           this.service = Service;

           this.render();

           this.setContent();

           this.renderChart();

           this.getData(this.options.oid);

           this.refresh(1000*60*2)


       },

       refresh:function(time){
           var self = this;
           this.timer = setInterval(function(){
               self.refreshData(self.options.oid);
           },time);
       },
       stoprefresh:function(){
           var self = this;
           this.timer && clearInterval(self.timer);
           this.service.abort();
       },

       render:function(){
           var self = this;
           this.dialog = new DashBoard({
                selector : this.element,
                title : "用户数量统计",
                width : 520,
                winHeight:winHeight,
                winWidth:winWidth,
                events:{
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : function(){
                        self.refreshData(self.options.oid,true);
                    }

//                   "onWinShow":function(){
//                       self.setWindowContent();
//                   }

               }
           });

           this.dialogContent = this.dialog.getContent();
           //console.log(this.dialogContent);
       },

       setContent : function(){
           var html = "<div class='usercount ui-helper-clearfix'>" +
                    "<div class='usercount-left'>" +
                       "<div class='usercount-item-onlineblock item-block'>" +
                           "<p class='usercount-item-onlineblock-title item-block-title'>在线用户</p>"+
                           "<p class='usercount-item-onlineblock-value item-block-value'></p>"+
                       "</div>" +
                       "<div class='usercount-item-historyblock item-block'>" +
                           "<p class='usercount-item-historyblock-title item-block-title'>总用户</p>"+
                           "<p class='usercount-item-historyblock-value item-block-value'></p>"+
                       "</div>" +
                    "</div>"+
                    "<div class='usercount-right'></div>"+
               "</div>"
            this.dialogContent.html(html)

       },

       setCurrentOnline:function(curOnline){

           this.element.find(".usercount-item-onlineblock-value").text(curOnline);
       },

       setCurrentTotal:function(curTotal){

           this.element.find(".usercount-item-historyblock-value").text(curTotal);
       },


       setWindowContent:function(){
           this.winCharContainer = $("<div class='usercount-chart-container'></div>")
               .height(winHeight-50).width(winWidth-20);
           this.dialog.setWinContent(this.winCharContainer);
           this.winCharContainer.highcharts("StockChart",{
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
                               ["day",[1]],
                               ['week',[1]],
                               ["month",[1]]
                           ]
                       }
                   },
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
                           forced:true,
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
                       },
                       x : -970
                   },
                   min : 0,
                   minPadding : 5,
                   title: {
                       margin : -970,
                       text: '接入用户数',
                       style: {
                           color: '#89A54E'
                       }
                   }
               }, { // Secondary yAxis
                   title: {
                       text:"总用户数",
                       style: {
                           color: '#4572A7'
                       }
                   },
                   min:0,
                   labels: {
                       style: {
                           color: '#4572A7'
                       }
                   },
                   opposite: true
               }],
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
                   name: '总用户',
                   color: '#4572A7',
                   type: 'area',
                   yAxis: 1,
                   data: this.totalData,
                   tooltip: {
                       valueSuffix: '人'
                   }

               }, {
                   name: '接入用户',
                   color: '#89A54E',
                   type: 'line',
                   data: this.onlineData,
                   tooltip: {
                       valueSuffix: '人',
                       dateTimeLabelFormats:{
                           millisecond: '%A, %b %e, %H:%M:%S.%L',
                           second: '%A, %b %e, %H:%M:%S',
                           minute: '%A, %b %e, %H:%M',
                           hour: '%A, %b %e, %H:%M',
                           day: '%A, %b %e, %Y',
                           week: 'Week from %A, %b %e, %Y',
                           month: '%B %Y',
                           year: '%Y'
                       }
                   }
               }]
           })




       },

       refreshData:function(oid,mask){
           mask = mask || false;
           mask && cloud.util.mask(this.dialogContent);
           var self = this;
           var date = new Date().getTime();
           var data = {
               endTime : date,
               startTime : this.endTime,
               oid:oid
           }
           this.endTime = date;
           this.chart = this.element.find(".usercount-right").highcharts()

           this.service.getOnlineUser(data,function(result){
               if(result){
                   self.onlineData = self.onlineData.concat(result);

                   var onlineUserChart = self.chart.get("onlineUser")
                   if(onlineUserChart){//update
                       var i = 0;
                       for (i; i < result.length; i++) {
                           onlineUserChart.addPoint(result[i], false);
                       }
//                   onlineUserChart.setData(result);
                       self.chart.redraw();
                   }else{//add
                       self.chart.addSeries({
                           id:"onlineUser",
                           name: '接入用户',
                           color: '#89A54E',
                           type: 'line',
                           data: result,
                           tooltip: {
                               valueSuffix: '人'
                           }
                       });
                   }
               }
               cloud.util.unmask(self.dialogContent);
           });

           this.service.getTotalUser(data,function(result){
               if(result){
                   self.totalData = self.totalData.concat(result);

                   var totalUserChart = self.chart.get("totalUser");
                   if(totalUserChart){
                       totalUserChart.setData(self.totalData)
                   }else{
                       self.chart.addSeries({
                           id:"totalUser",
                           name: '总用户',
                           color: '#4572A7',
                           type: 'area',
                           yAxis: 1,
                           data: self.totalData,
                           tooltip: {
                               valueSuffix: '人'
                           }
                       });
                   }
               }


           });

           this.service.getUserCount(oid,function(data){
               if(data.all){
                   self.setCurrentTotal(data.all.count)
               }
               if(data.online){
                   self.setCurrentOnline(data.online.count)
               }

           });

       },
       getData:function(oid){
           cloud.util.mask(this.dialogContent);
           var self = this;
           var date = new Date().getTime();
           var data = {
               endTime : date,
//               endTime : 1398000000000,
               startTime : date - 6*30*86400*1000,
               oid:oid
           }
           this.endTime = data.endTime;
           this.chart = this.element.find(".usercount-right").highcharts()

           this.service.getOnlineUser(data,function(result){
               self.onlineData = result;

               var onlineUserChart = self.chart.get("onlineUser")
               if(onlineUserChart){//update
                   onlineUserChart.setData(result);
               }else{//add
                   self.chart.addSeries({
                       id:"onlineUser",
                       name: '接入用户',
                       color: '#89A54E',
                       type: 'line',
                       data: result,
                       tooltip: {
                           valueSuffix: '人'
                       }
                   });
               }

               cloud.util.unmask(self.dialogContent);
           });

           this.service.getTotalUser(data,function(result){
               self.totalData = result;

               var totalUserChart = self.chart.get("totalUser");
               if(totalUserChart){
                   totalUserChart.setData(result)
               }else{
                   self.chart.addSeries({
                       id:"totalUser",
                       name: '总用户',
                       color: '#4572A7',
                       type: 'area',
                       yAxis: 1,
                       data: result,
                       tooltip: {
                           valueSuffix: '人'
                       }
                   });
               }


           });

           this.service.getUserCount(oid,function(data){
               if(data.all){
                   self.setCurrentTotal(data.all.count)
               }
               if(data.online){
                   self.setCurrentOnline(data.online.count)
               }

           });

       },

       renderChart : function(onlineData,totalData){
           this.element.find(".usercount-right").highcharts("StockChart",{
               chart: {
                   zoomType: 'x',
                   spacingLeft : 15
               },
               navigator:{
                   enabled:false
               },
               rangeSelector:{
                   enabled:false
               },
               scrollbar:{
                   enabled:false
               },
               credits:{
                    enabled:false
                },
               exporting:{
                   enabled:false
               },
               title:{
                 text:""
               },
               legend: {
                   enabled: false
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
                           enabled: false
                       },
                       shadow: false,
                       states: {
                           hover: {
                               lineWidth: 1
                           }
                       },
                       threshold: null,
                       dataGrouping:{
                           forced:true,
                           approximation:"high",
                           units:[
                               ["day",[1]]
                           ]
                       }
                   },
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
                           forced:true,
                           approximation:"high",
                           units:[
                               ["day",[1]]
                           ]
                       }
                   }
               },
               xAxis:{
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
               yAxis: [{ // Primary yAxis
                   labels: {
                       align:"left",
                       x: -370,
                       y: 0,
                       style: {
                           color: '#89A54E'
                       }
                   },
                   min:0,
                   title: {
                       text: '',
                       style: {
                           color: '#89A54E'
                       }
                   }
               }, { // Secondary yAxis
                   title: {
                       text:"",
                       style: {
                           color: '#4572A7'
                       }
                   },
                   min:0,
                   labels: {
                       align:"right",
                       x: 0,
                       y: 0,
                       style: {
                           color: '#4572A7'
                       }
                   },
                   opposite: true
               }],
               tooltip: {
                   shared: true,
                   xDateFormat: '%Y-%m-%d'
               },
               series: [{
               }]
           })
       },



       destroy : function($super){
           this.stoprefresh();

           $super()
       }
   });

    return userCount
});
