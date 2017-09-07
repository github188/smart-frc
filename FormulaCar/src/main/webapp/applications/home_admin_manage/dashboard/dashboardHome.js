define(function(require) {
  require("cloud/base/cloud");
  require("cloud/lib/plugin/jquery.dataTables");
  var html = require("text!./dashboardHome.html");
  require("./css/default.css");
  require("cloud/components/chart");
  var Service = require("./service");
  var operationMenu = Class.create(cloud.Component, {
    initialize: function($super, options) {
      $super(options);
      this.element.html(html);
      this._render();
    },
    _render: function() {
      $("#forCount").css("width", $(".container-bd").width());
      $("#chart").css("width", $(".container-bd").width());
      $("#homePage").css("height", $(".container-bd").height());
      var self = this;
      var myDate = new Date();
      var full = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var date = full + "/" + month + "/" + day;
      var startTime = (new Date(date + " 00:00:00")).getTime() / 1000;
      var endTime = (new Date(date + " 23:59:59")).getTime() / 1000;
      var dates = full + "/" + month + "/" + day;
      self.getCountOfAll(startTime, endTime, full, month, dates); //今日销售额、销售量、设备在线数
      self.getTopTen(startTime, endTime, full, month, date);
      this.bindEvent();

      if (cloud.interval) {
        clearInterval(cloud.interval);
      }

      var interval = setInterval(function() {
        self.getCountOfAll(startTime, endTime, full, month, dates); //今日销售额、销售量、设备在线数
        self.getTopTen(startTime, endTime, full, month, date);
      }, 300000);
      cloud.interval = interval;

    },
    bindEvent: function() {
      var self = this;
      $("#amounts").click(function() {
        var obj = {
          name: "transaction_summary",
          order: 0,
          defaultOpen: true,
          defaultShow: true,
          url: "../../operation_manage/status/statistics/statisticsMain.js"
        };
        $("#monitor_one").css("border-bottom", "0px");
        $("#statistics_one").css("border-bottom", "2px solid #09c");
        $("#monitor_one").removeClass("current");
        $("#statistics_one").addClass("current");

        if (cloud.interval) {
          clearInterval(cloud.interval);
        }

        self.loadApplication(obj);
      });
      $("#counts").click(function() {
        var obj = {
          name: "transaction_summary",
          order: 0,
          defaultOpen: true,
          defaultShow: true,
          url: "../../operation_manage/status/statistics/statisticsMain.js"
        };
        $("#monitor_one").css("border-bottom", "0px");
        $("#statistics_one").css("border-bottom", "2px solid #09c");
        $("#monitor_one").removeClass("current");
        $("#statistics_one").addClass("current");
        if (cloud.interval) {
          clearInterval(cloud.interval);
        }
        self.loadApplication(obj);
      });

      $("#online").click(function() {
        var obj = {
          name: "vendingMachine_manage",
          order: 0,
          defaultOpen: true,
          defaultShow: true,
          url: "../../operation_manage/vendingMachine/vendingMachineMain.js"
        };
        $("#monitor_one").css("border-bottom", "0px");
        $("#smartVm_one").css("border-bottom", "2px solid #09c");
        $("#monitor_one").removeClass("current");
        $("#smartVm_one").addClass("current");

        if (cloud.interval) {
          clearInterval(cloud.interval);
        }

        cloud.online = 0;
        cloud.style = 1;
        self.loadApplication(obj);
      });
      $("#offline").click(function() {
        var obj = {
          name: "vendingMachine_manage",
          order: 0,
          defaultOpen: true,
          defaultShow: true,
          url: "../../operation_manage/vendingMachine/vendingMachineMain.js"
        };
        $("#monitor_one").css("border-bottom", "0px");
        $("#smartVm_one").css("border-bottom", "2px solid #09c");
        $("#monitor_one").removeClass("current");
        $("#smartVm_one").addClass("current");

        if (cloud.interval) {
          clearInterval(cloud.interval);
        }
        cloud.online = 1;
        cloud.style = 1;
        self.loadApplication(obj);
      });
    },
    loadApplication: function(application) {
      var msg = this.msgToSend;
      this.msgToSend = null;
      var appUrl = application.url;
      cloud.util.setCurrentApp(application);
      if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
        this.currentApplication.destroy();
        this.currentApplication = null;
      }
      if (appUrl.endsWith(".html")) {
        $("#user-content").load(appUrl);
        this.appNow = application;
        msg && this.sendMsg(application.name, msg);
      } else {
        cloud.util.mask("#user-content");
        this.requestingApplication = appUrl;
        require([appUrl], function(Application) {
          //judge if the previous requesting application is canceled.
          if (this.requestingApplication === appUrl) {
            if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
              this.currentApplication.destroy();
              this.currentApplication = null;
            }
            $("#user-content").empty();
            cloud.util.unmask("#user-content");
            if (Application) {
              this.currentApplication = new Application({
                container: "#user-content"
              });
              this.appNow = application;
              msg && this.sendMsg(application.name, msg);
            }
          } else {
            console.log("app ignored: " + appUrl)
          }
        }.bind(this));
      }
    },
    getCountOfAll: function(startTime, endTime, full, month, date) {
      this.getEveryDay(startTime, endTime, null, date);
      this.getMonth(full, month);
      this.getYear(full);
    },
    getTopTen: function(startTime, endTime, full, month, date) {
      this.getDeviceTopTen(startTime, endTime, full, month, date);
      this.getGoodsTopTen(startTime, endTime, full, month, date);
    },
    getPayStyleChart: function(finalData, sum) {
      var flag = 0;
      if (finalData != null && finalData.length > 0) {
        for (var i = 0; i < finalData.length; i++) {
          for (var j = 0; j < finalData[i].length; j++) {
            if (parseInt(finalData[i][1] * 100) > 0) {
              flag = flag + 1;
            }
          }
        }
      }
      var today = new Date();
      $("#todayTitle").html( today.toLocaleDateString() + "  " + locale.get( "sales_amount") + "/" + locale.get( "bind_car") );
      if (flag > 0) {
        // 总销量 //售出量 // 车辆绑定量
        $('#pay').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: $("#forCount").width() * 0.26,
            height: 400,
          },
          title: {
            text: '<table><tr><td style="text-align: center;"><span style="font-size:18px;"><b>' + locale.get("sales_amount") + '</b></span></td></tr><tr><td style="text-align: center;"><span style="font-size:20px;color: #09c;"><b>' + sum + '</b></span></td></tr></table>',
            floating: true,
            useHTML: true
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            formatter: function() {
              return '<table><tr><td><b>' + this.point.name.split(":")[0] + ':</b></td><td>' + Highcharts.numberFormat(this.percentage, 1) + '% </td></tr><tr><td></td><td>' + this.point.name.split(":")[1] + '辆</td></tr></table>';
            },
            shared: true,
            useHTML: true
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            innerSize: '22',
            data: finalData
          }]
        }, function(c) {
          // 环形图圆心
          var centerY = c.series[0].center[1],
            titleHeight = parseInt(c.title.styles.fontSize);
          c.setTitle({
            y: centerY
          });
          chart = c;
        });
      } else {
        $("#todayTitle").remove();
        $('#payTitle').text( today.toLocaleDateString() + "  " + locale.get( "sales_amount") + "/" + locale.get( "bind_car") + locale.get( "percent_bind"));
      }
    },
    getGoodsTopTen: function(startTime, endTime, full, month, date) {
      var time = (new Date(date + " 00:00:00")).getTime() / 1000;
      this.getEveryDayOfGoodsTop(time);
    },
    getDeviceTopTen: function(startTime, endTime, full, month, date) {
      this.getEveryDayOfDeviceTop(startTime, endTime, null);
    },
    getEveryDayOfDeviceTop: function(startTime, endTime, siteName) {
      var self = this;
      var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
      var roleType = permission.getInfo().roleType;
      Service.getLinesByUserId(userId, function(linedata) {
        var lineIds = [];
        if (linedata && linedata.result && linedata.result.length > 0) {
          for (var i = 0; i < linedata.result.length; i++) {
            lineIds.push(linedata.result[i]._id);
          }
        }
        if (roleType == 51) {
          lineIds = [];
        }
        if (roleType != 51 && lineIds.length == 0) {
          lineIds = ["000000000000000000000000"];
        }
        self.lineIds = lineIds;
        Service.getDeviceDayStatistic(startTime, endTime, siteName, lineIds, function(data) {

          if (data.result) {
            var site = data.result[0].site;
            var siteName = data.result[0].siteName;
            var siteAmount = data.result[0].siteAmount;

            if (siteName.length > 10) {
              var newsiteName = [];
              for (var i = 0; i < siteName.length; i++) {
                if (i > 9) {

                } else {
                  var names = "";
                  if (siteName[i].length <= 10) { //返回中文的个数 小于10个汉字
                    names = siteName[i];
                    newsiteName.push(siteName[i]);
                  } else {
                    names = siteName[i].substring(0, 10) + "...";
                    newsiteName.push(siteName[i] + "***" + names);
                  }

                }
              }
              siteName = newsiteName;
            }
            if (siteAmount.length > 10) {
              var newsiteAmount = [];
              for (var i = 0; i < siteAmount.length; i++) {
                if (i > 9) {

                } else {
                  newsiteAmount.push(siteAmount[i]);
                }
              }
              siteAmount = newsiteAmount;
            }
            var id = "deviceTop10";
            var title = locale.get("today") + " " + locale.get( "hot_stage") + " " + locale.get( "top10");
            var wid = $("#deviceTop10").width();

            var common = new Map();
            if (siteName.length > 0) {
              for (var i = 0; i < siteName.length; i++) {
                if (siteName[i].indexOf("***") > 0) {
                  common[siteName[i].split("***")[1]] = siteName[i].split("***")[0];
                } else {
                  common[siteName[i]] = siteName[i];
                }
              }
            }
            self.renderbarChart(siteName, siteAmount, id, title, wid, common);
          }
        });
      });
    },
    getEveryDayOfGoodsTop: function(time) {
      var self = this;
      var top = 10;
      var type = 1;

      var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
      var roleType = permission.getInfo().roleType;
      Service.getLinesByUserId(userId, function(linedata) {
        var lineIds = [];
        if (linedata && linedata.result && linedata.result.length > 0) {
          for (var i = 0; i < linedata.result.length; i++) {
            lineIds.push(linedata.result[i]._id);
          }
        }
        if (roleType == 51) {
          lineIds = [];
        }
        if (roleType != 51 && lineIds.length == 0) {
          lineIds = ["000000000000000000000000"];
        }
        self.lineIds = lineIds;

        Service.getGoodsStatistic(type, top, time, lineIds, function(data) {
          var name = data.result.amount;
          var goodsName = [];
          var common = new Map();
          var count = [];
          if (name.length > 0) {
            for (var i = 0; i < name.length; i++) {
              if (i > 9) {

              } else {
                var names = "";
                if (name[i].goodsName.length <= 10) { //返回中文的个数 小于10个汉字
                  names = name[i].goodsName;
                  goodsName.push(names);
                } else {
                  names = name[i].goodsName.substring(0, 10) + "...";
                  goodsName.push(name[i].goodsName + "***" + names);
                }

                count.push(name[i].amount / 100);
              }
            }
          }
          var id = "goodsTop10";
          var title = locale.get( "regist_of_today") + " " + locale.get( "top10");
          var wid = $("#goodsTop10").width();
          if (goodsName.length > 0) {
            for (var i = 0; i < goodsName.length; i++) {
              if (goodsName[i].indexOf("***") > 0) {
                common[goodsName[i].split("***")[1]] = goodsName[i].split("***")[0];
              } else {
                common[goodsName[i]] = goodsName[i];
              }
            }
          }

          self.renderbarChart(goodsName, count, id, title, wid, common);
        }, self);
      });
    },
    renderbarChart: function(bar, type, id, title, wid, common) {
      var result = type;
      var categorie = [];
      if (bar.length > 0) {
        for (var i = 0; i < bar.length; i++) {
          if (bar[i].indexOf("***") > 0) {
            bar[i] = bar[i].split("***")[1];
          }
          categorie.push(bar[i]);
        }
      }
      $('#' + id).highcharts({
        chart: {
          type: 'bar',
          height: 400,
          width: wid
        },
        title: {
          text: title,
        },
        navigator: {
          enabled: false
        },
        rangeSelector: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        xAxis: {
          categories: categorie,
          min: 0,
          gridLineWidth: 0
        },
        yAxis: {
          min: 0,
          gridLineWidth: 0,
          labels: {
            enabled: false
          },
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function() {
            var x = this.x;
            var str = '<table><tr><td><b>' + common[x] + ':</b></td><td><b>' + this.y + locale.get("bought") +'</b></td></tr></table>';
            return str;
          },
          shared: true,
          useHTML: true
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          },
          series: {
            pointWidth: 15
          }
        },
        legend: {
          backgroundColor: '#FFFFFF',
          reversed: true
        },
        series: [{
          name: locale.get("bought"),
          type: 'bar',
          data: result
        }]
      });
    },
    magic_number: function(value, id) { //数字的动态效果
      var num = $("#" + id);
      if (value) {
        num.animate({
          count: value
        }, {
          duration: 3000,
          step: function() {
            num.text(String(parseInt(this.count)));
          },
          complete: function() {
            num.text(value);
          }
        });
      }
    },
    magic_number_o: function(value, id) { //数字的动态效果
      var num = $("#" + id);
      if (value) {
        num.animate({
          count: value
        }, {
          duration: 3000,
          step: function() {
            num.text(String(parseFloat(this.count).toFixed(2)));
          },
          complete: function() {
            num.text(value);
          }
        });
      }
    },
    getEveryDay: function(startTime, endTime, assetId, dates) {
      var self = this;
      var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
      var roleType = permission.getInfo().roleType;
      Service.getAreaByUserId(userId, function(areadata) {
        var areaIds = [];
        if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
          areaIds = areadata.result.area;
        }
        if (roleType == 51) {
          areaIds = [];
        }

        if (roleType != 51 && areaIds.length == 0) {
          areaIds = ["000000000000000000000000"];
        }
        cloud.Ajax.request({
          url: "api/automatline/list",
          type: "GET",
          parameters: {
            areaId: areaIds,
            cursor: 0,
            limit: -1
          },
          success: function(linedata) {
            var lineIds = [];
            if (linedata && linedata.result && linedata.result.length > 0) {
              for (var i = 0; i < linedata.result.length; i++) {
                lineIds.push(linedata.result[i]._id);
              }
            }
            if (roleType == 51) {
              lineIds = [];
            }

            if (roleType != 51 && lineIds.length == 0) {
              lineIds = ["000000000000000000000000"];
            }
            Service.getDayAllStatisticByArea(startTime, endTime, areaIds, function(data) {
              var amount = data.result[0].amountOnLine + data.result[0].amountOutLine + data.result[0].amountOutLine; //
              var sum = data.result[0].sumOnLine + data.result[0].sumOutLine;

              self.magic_number_o( amount.toFixed(2), "amounts");
              self.magic_number( sum, "counts");

              var sumAmount = data.result[0].sumAmount;
              var newTimes = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

              var wid = $("#forCount").width() * 0.5;
              var title = locale.get("all_sales_today"); //今日销售汇总
              var height = 370;
              // home statics
              var id = "time-content";
              var color = "#FFF263";
              self.renderLineChart(sumAmount, newTimes, title, wid, height, id, color);

              var dataP = data.result[0].payStylesum;
              var finalData = [];
              if (dataP) {
                for (var i = 0; i < dataP.length; i++) {
                  if (dataP[i][1]) {
                    var data_ = [];
                    if (dataP[i][0] == "wechat") {
                      dataP[i][0] = "微信:" + dataP[i][2];
                    } else if (dataP[i][0] == "alipay") {
                      dataP[i][0] = "支付宝:" + dataP[i][2];
                    } else if (dataP[i][0] == "baifubao") {
                      dataP[i][0] = "百付宝:" + dataP[i][2];
                    } else if (dataP[i][0] == "other") {
                      dataP[i][0] = "现金:" + dataP[i][2];
                    } else if (dataP[i][0] == "alipaySoundWave") {
                      dataP[i][0] = "声波支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "swingCard") {
                      dataP[i][0] = "刷卡:" + dataP[i][2];
                    } else if (dataP[i][0] == "posMachine") {
                      dataP[i][0] = "pos机:" + dataP[i][2];
                    } else if (dataP[i][0] == "oneCardsolution") {
                      dataP[i][0] = "一卡通:" + dataP[i][2];
                    } else if (dataP[i][0] == "agriculturalBank") {
                      dataP[i][0] = "农行支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "game") {
                      dataP[i][0] = "游戏:" + dataP[i][2];
                    } else if (dataP[i][0] == "vipPay") {
                      dataP[i][0] = "会员支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "bestPay") {
                      dataP[i][0] = "翼支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "jdpay") {
                      dataP[i][0] = "京东支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "wechatBarcode") {
                      dataP[i][0] = "微信反扫:" + dataP[i][2];
                    } else if (dataP[i][0] == "alipayBarcode") {
                      dataP[i][0] = "支付宝反扫:" + dataP[i][2];
                    } else if (dataP[i][0] == "otherPayStyle") {
                      dataP[i][0] = "其他:" + dataP[i][2];
                    } else if (dataP[i][0] == "unionpay") {
                      dataP[i][0] = "银联支付:" + dataP[i][2];
                    } else if (dataP[i][0] == "qrcodepay") {
                      dataP[i][0] = "扫码:" + dataP[i][2];
                    } else if (dataP[i][0] == "icbcpay") {
                      dataP[i][0] = "融e联:" + dataP[i][2];
                    }
                    data_.push(dataP[i][0]);
                    data_.push(dataP[i][1]);
                    finalData.push(data_);
                  }
                }
              }
              self.getPayStyleChart(finalData, sum);
            });
            var datas = {
              "lineId": lineIds
            };
            Service.getCount(datas, function(data) {
              // console.log( "This is test'data,", data);
              $("#online").text( data.count);
              $("#offline").text( data.countOnline  + "/" + data.countOffline );
              // self.magic_number(data.countOnline + "/" + data.count, "online");
              // self.magic_number(data.countOffline + "/" + data.count, "offline");
            });
          }
        });
      });
    },
    getEveryYear: function(startTime, endTime, assetId) {
      var self = this;
      var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
      var roleType = permission.getInfo().roleType;
      Service.getAreaByUserId(userId, function(areadata) {
        var areaIds = [];
        if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
          areaIds = areadata.result.area;
        }
        if (roleType == 51) {
          areaIds = [];
        }

        if (roleType != 51 && areaIds.length == 0) {
          areaIds = ["000000000000000000000000"];
        }
        cloud.Ajax.request({
          url: "api/automatline/list",
          type: "GET",
          parameters: {
            areaId: areaIds,
            cursor: 0,
            limit: -1
          },
          success: function(linedata) {
            var lineIds = [];
            if (linedata && linedata.result && linedata.result.length > 0) {
              for (var i = 0; i < linedata.result.length; i++) {
                lineIds.push(linedata.result[i]._id);
              }
            }
            if (roleType == 51) {
              lineIds = [];
            }

            if (roleType != 51 && lineIds.length == 0) {
              lineIds = ["000000000000000000000000"];
            }
            // Change
            Service.getYearAllStatisticByArea(startTime, endTime, areaIds, function(data) {
              var sumAmount = data.result[0].sumAmount;

              var date = new Date;
              var year = date.getFullYear();
              var wid = $("#column-content").width();
              // var title = year + "" + locale.get("all_register_user") + "" + "(" + locale.get("all_register_cars") + ")";
              var title = year + " " + locale.get( "salse_top10");
              var height = 178;
              self.renderColumnChart(sumAmount, title, wid, height);
            });
          }
        });
      });
    },
    renderColumnChart: function(result, title, wid, height) {
      //console.log(result);
      var categories = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      $('#column-content').highcharts({
        chart: {
          type: 'column',
          height: height,
          width: wid,
        },
        title: {
          text: title
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: locale.get("car_amount"),
          data: result[0].data
        }, {
          name: locale.get("sales_no"),
          data: result[1].data
        }]
      });
    },
    renderLineChart: function(result, newTimes, title, wid, height, id, color) {
      var money = result[0].name;
      var count = result[1].name;
      $('#' + id).highcharts({
        chart: {
          type: 'line',
          height: height,
          width: wid,
        },
        title: {
          text: title
        },
        xAxis: {
          categories: newTimes
        },
        yAxis: {
          title: {
            text: ''
          },
          min: 0
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false
            }
          },
        },
        tooltip: {
          shared: true
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name:  locale.get( "sales_sum"), //销售金额
          color: '#24CBE5',
          type: 'spline',
          data: result[0].data,
          tooltip: {
            valueSuffix: locale.get({
              lang: "yuan"
            })
          }

        }, {
          name: locale.get( "sales_volume"), //销售量
          color: '#458B00',
          type: 'spline',
          data: result[1].data,
          tooltip: {
            valueSuffix: locale.get({
              lang: "yuan"
            })
          }
        }, {
          name: locale.get( "car_number"), //跑车次数
          color: '#458B00',
          type: 'spline',
          data: result[1].data,
          tooltip: {
            valueSuffix: locale.get({
              lang: "times"
            })
          }
        }]
      });
    },
    getEveryMonth: function(startTime, endTime, assetId, year, months) {
      var self = this;
      var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
      var roleType = permission.getInfo().roleType;
      Service.getAreaByUserId(userId, function(areadata) {
        var areaIds = [];
        if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
          areaIds = areadata.result.area;
        }
        if (roleType == 51) {
          areaIds = [];
        }

        if (roleType != 51 && areaIds.length == 0) {
          areaIds = ["000000000000000000000000"];
        }
        cloud.Ajax.request({
          url: "api/automatline/list",
          type: "GET",
          parameters: {
            areaId: areaIds,
            cursor: 0,
            limit: -1
          },
          success: function(linedata) {
            var lineIds = [];
            if (linedata && linedata.result && linedata.result.length > 0) {
              for (var i = 0; i < linedata.result.length; i++) {
                lineIds.push(linedata.result[i]._id);
              }
            }
            if (roleType == 51) {
              lineIds = [];
            }

            if (roleType != 51 && lineIds.length == 0) {
              lineIds = ["000000000000000000000000"];
            }
            //Service.getMonthAllStatistic(startTime, endTime, assetId,lineIds, function(data) {
            Service.getMonthAllStatisticByArea(startTime, endTime, areaIds, function(data) {
              //console.log(data);
              var sumAmount = data.result[0].sumAmount;
              var maxday = new Date(year, months, 0).getDate();
              var newTimes = [];
              if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
              } else if (months == 2) {

                newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
                if (maxday > 28) {
                  newTimes[28] = "29";
                }
              } else {
                newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
              }
              var wid = $("#lines-content").width();
              var title = months + locale.get("_month") + locale.get("all_sales");
              var height = 180;
              var id = "lines-content";
              var color = "#66ccff";
              self.renderLineChart(sumAmount, newTimes, title, wid, height, id, color);
            });
          }
        });
      });
    },
    getMonth: function(year, months) {
      var maxday = new Date(year, months, 0).getDate();
      var startTime = null,
        endTime = null;
      if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
        startTime = (new Date(year + "/" + months + "/01" + " 00:00:00")).getTime() / 1000;
        endTime = (new Date(year + "/" + months + "/31" + " 23:59:59")).getTime() / 1000;
      } else if (months == 2) {
        startTime = (new Date(year + "/" + months + "/01" + " 00:00:00")).getTime() / 1000;
        endTime = (new Date(year + "/" + months + "/" + maxday + " 23:59:59")).getTime() / 1000;
      } else {
        startTime = (new Date(year + "/" + months + "/01" + " 00:00:00")).getTime() / 1000;
        endTime = (new Date(year + "/" + months + "/30" + " 23:59:59")).getTime() / 1000;
      }
      this.getEveryMonth(startTime, endTime, null, year, months);
    },
    getYear: function(year) {
      startTime = (new Date(year + "/01/01" + " 00:00:00")).getTime() / 1000;
      endTime = (new Date(year + "/12/31" + " 23:59:59")).getTime() / 1000;
      this.getEveryYear(startTime, endTime, null);
    }

  });
  return operationMenu;
});