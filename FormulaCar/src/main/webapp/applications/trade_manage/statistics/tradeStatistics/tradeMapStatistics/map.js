define(function(require){
    var DashBoard = require("../../../../components/dashweight/dashboard");
    require("./js/echarts-plain1.js");
    require("./js/echarts-plain-map1.js");
    var tradeAmountBar = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this._render();
            this.setContent();
            //this.renderChart();
            this.setData(options.mapData);
        },
        _render:function(){
        	var self = this;
            var width = this.element.width;
            this.element.addClass("weightContainer");
            this.element.addClass("map");
            this.element.id = "test";
            this.dialog = new DashBoard({
                selector : this.element,
                title : "",
                width:width
            });
            $(".map").css("width",$("#trade_statistics_map").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent:function(){
            var html = "<div class='map'>" +          
            				"<div class='map_content' id='map_content' style='height:300px;'></div>" +
			           "</div>";
            this.dialogContent.html(html);           
        },
        //刷新
        setData:function(mapData){
            //$("#bar").html("<img width='200px' height='200px' src='../resources/img/wait.gif'/>");
            var arr = mapData.data;
            for(var i=0;i<arr.length;i++){
                //console.log(arr[i]);
                
                //if(arr[i].value<30){
                //  arr[i].symbolSize = 5;
                //}else{
                    arr[i].symbolSize = 0.12*arr[i].value;
                //}
            }
            mapData.data = arr;
            this.renderChart(mapData);
        },

        renderChart:function(mapData){
        	var actCount = mapData.activities;
            // 基于准备好的dom，初始化echarts图表
            var myChart = echarts.init(document.getElementById('map_content')); 
            var  option = {
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['echarts map demo']
                    },
                    dataRange: {
                        min : 0,
                        max : 500,
                        calculable : false,
                        color: ['maroon','purple','red','orange','yellow','lightgreen']
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params,ticket,callback) {
                            var res = '抽奖人数 : <br/>';
                            res += params[1] + ' : ' + params[2]+"人";
                            return res;
                        }
                    },
                    series : [
                        {
                            name: '抽奖人数',
                            type: 'map',
                            mapType: 'china',
                            hoverable: false,
                            roam:false,
                            data : [],
                            markPoint : {
                                symbolSize: 5,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                                itemStyle: {
                                    normal: {
                                        borderColor: '#87cefa',
                                        borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                                        label: {
                                            show: false
                                        }
                                    },
                                    emphasis: {
                                        borderColor: '#1e90ff',
                                        borderWidth: 5,
                                        label: {
                                            show: false
                                        }
                                    }
                                },
                                data :mapData.data
                            },
                            geoCoord: mapData.map
                        }
                    ]
                };
                                    
            // 为echarts对象加载数据 
            myChart.setOption(option); 	
        },
        destroy:function($super){
            $super();
        }
    });

    return tradeAmountBar;
});