define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./content.html");
    require("cloud/lib/plugin/jquery-ui");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Table = require("cloud/components/table");
    var Service = require('../service');

    var columns = [{
        "title": locale.get({
            lang: "line_man_name"
        }),
        "dataIndex": "linename",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "total_volume1"
        }),
        "dataIndex": "lineTotal",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "total_turnover1"
        }),
        "dataIndex": "lineAmount",
        "cls": null,
        "width": "10%",
    }, {
        "title": locale.get({
            lang: "wechat_amount"
        }),
        "dataIndex": "wechat",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "wechat_sum"
        }),
        "dataIndex": "wechatS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "alipay_amount"
        }),
        "dataIndex": "alipay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "alipay_sum"
        }),
        "dataIndex": "alipayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "cash_amount"
        }),
        "dataIndex": "other",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "cash_sum"
        }),
        "dataIndex": "otherS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "baifubao_amount"
        }),
        "dataIndex": "baifubao",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "baifubao_sum"
        }),
        "dataIndex": "baifubaoS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "swingcard_amount"
        }),
        "dataIndex": "swingCard",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "swingcard_sum"
        }),
        "dataIndex": "swingCardS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "onecard_amount"
        }),
        "dataIndex": "oneCardsolution",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "onecard_sum"
        }),
        "dataIndex": "oneCardsolutionS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "soundwave_amount"
        }),
        "dataIndex": "alipaySoundWave",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "soundwave_sum"
        }),
        "dataIndex": "alipaySoundWaveS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "abc_amount"
        }),
        "dataIndex": "agriculturalBank",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "abc_sum"
        }),
        "dataIndex": "agriculturalBankS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "pos_amount"
        }),
        "dataIndex": "posMachine",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "pos_sum"
        }),
        "dataIndex": "posMachineS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "game_amount"
        }),
        "dataIndex": "game",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "game_sum"
        }),
        "dataIndex": "gameS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "vippay_amount"
        }),
        "dataIndex": "vipPay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "vippay_sum"
        }),
        "dataIndex": "vipPayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "bestpay_amount"
        }),
        "dataIndex": "bestPay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "bestpay_sum"
        }),
        "dataIndex": "bestPayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "jdpay_amount"
        }),
        "dataIndex": "jdpay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "jdpay_sum"
        }),
        "dataIndex": "jdpayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "wechat_barcode_amount"
        }),
        "dataIndex": "wechatBarcode",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "wechat_barcode_sum"
        }),
        "dataIndex": "wechatBarcodeS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "alipay_barcode_amount"
        }),
        "dataIndex": "alipayBarcode",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "alipay_barcode_sum"
        }),
        "dataIndex": "alipayBarcodeS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "unionpay_amount"
        }),
        "dataIndex": "unionpay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "unionpay_sum"
        }),
        "dataIndex": "unionpayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": "扫码支付(元)",
        "dataIndex": "qrcodepay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": "扫码支付(单)",
        "dataIndex": "qrcodepayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": "融e联(元)",
        "dataIndex": "icbcpay",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": "融e联(单)",
        "dataIndex": "icbcpayS",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "otherpay_amount"
        }),
        "dataIndex": "otherPayStyle",
        "cls": null,
        "width": "10%",
        render: FormatMon
    }, {
        "title": locale.get({
            lang: "otherpay_sum"
        }),
        "dataIndex": "otherPayStyleS",
        "cls": null,
        "width": "10%",
        render: FormatMon

    }];

    function FormatMon(value, type) {
        var display = "";
        var num = value;
        if ("display" == type) {
            num = num + "";
            if (num.indexOf(".") != -1) {
                if (isNaN(num))
                    num = "0";
                sign = (num == (num = Math.abs(num)));
                num = Math.floor(num * 100 + 0.50000000001);
                cents = num % 100;
                num = Math.floor(num / 100).toString();
                if (cents < 10)
                    cents = "0" + cents;
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));
                return (((sign) ? '' : '-') + num + '.' + cents);
            } else {
                if (isNaN(num))
                    num = "0";

                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));
                return num;
            }

        } else {
            return value;
        }


    }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.data = options.data;
            //          this.service = new Service();
            this.elements = {
                table: {
                    id: "trade_sta_list_table",
                    "class": null
                },
                paging: {
                    id: "trade_sta_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderTable();


        },
        _renderHtml: function() {
            this.element.html(html);
        },
        _renderTable: function() {
            var self = this;
            this.listTable = new Table({
                selector: "#trade_sta_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    scope: this
                }
            });
            $("#trade_sta_list_table-table").css("margin-bottom", "80px");
            self.setDataTable();
        },

        setDataTable: function() {
            cloud.util.mask("#trade_sta_list_table");
            var self = this;
            var arr = [];
            var linePay = self.data.result[0].linePay;
            for (var i = 0; i < linePay.length; i++) {
                var a = linePay[i];
                var agriculturalBank = a.agriculturalBank;
                var alipay = a.alipay;
                var alipaySoundWave = a.alipaySoundWave;
                var baifubao = a.baifubao;
                var game = a.game;
                var oneCardsolution = a.oneCardsolution;
                var other = a.other;
                var otherPayStyle = a.otherPayStyle;
                var posMachine = a.posMachine;
                var swingCard = a.swingCard;
                var vipPay = a.vipPay;
                var wechat = a.wechat;
                var bestPay = a.bestPay;
                var jdpay = a.jdpay;
                var wechatBarcode = a.wechatBarcode;
                var alipayBarcode = a.alipayBarcode;
                var qrcodepay = a.qrcodepay;
                var unionpay = a.unionpay;
                var icbcpay = a.icbcpay;
                var sum = icbcpay + qrcodepay + unionpay + agriculturalBank + alipay + alipaySoundWave + baifubao + game + oneCardsolution + other + otherPayStyle + posMachine + swingCard + vipPay + wechat + bestPay + jdpay + wechatBarcode + alipayBarcode;
                sum = parseFloat(sum).toFixed(2);

                var agriculturalBankS = a.agriculturalBankS;
                var alipayS = a.alipayS;
                var alipaySoundWaveS = a.alipaySoundWaveS;
                var baifubaoS = a.baifubaoS;
                var gameS = a.gameS;
                var oneCardsolutionS = a.oneCardsolutionS;
                var otherS = a.otherS;
                var otherPayStyleS = a.otherPayStyleS;
                var posMachineS = a.posMachineS;
                var swingCardS = a.swingCardS;
                var vipPayS = a.vipPayS;
                var wechatS = a.wechatS;
                var bestPayS = a.bestPayS;
                var jdpayS = a.jdpayS;
                var wechatBarcodeS = a.wechatBarcodeS;
                var alipayBarcodeS = a.alipayBarcodeS;
                var qrcodepayS = a.qrcodepayS;
                var unionpayS = a.unionpayS;
                var icbcpayS = a.icbcpayS;
                var sumS = icbcpayS + qrcodepayS + unionpayS + agriculturalBankS + alipayS + alipaySoundWaveS + baifubaoS + gameS + oneCardsolutionS + otherS + otherPayStyleS + posMachineS + swingCardS + vipPayS + wechatS + bestPayS + jdpayS + wechatBarcodeS + alipayBarcodeS;
                a.lineAmount = sum;
                a.lineTotal = sumS;
            }
            arr = self.data.result[0].linePay;
            self.listTable.render(arr);

            var sl = $("#trade_sta_list_table-table").find("thead th");

            var tableObj = document.getElementById("trade_sta_list_table-table");
            var cell = [];

            if (self.data.result[0].linePay.length > 0) {
                //将支付方式数据为空的列隐掉      
                for (var j = 2; j < sl.length - 1; j++) {

                    var tf = false;

                    for (var k = 1; k < tableObj.rows.length; k++) {

                        var td = tableObj.rows[k].cells[j].innerHTML;
                        if (td != 0) {
                            tf = true;
                        }
                    }

                    if (!tf) {
                        cell.push(j);
                    }

                }

                if (cell.length >= 38) {
                    $("#trade_sta_list_table-table").find("thead th").eq(0).css("display", "none");
                    $("#trade_sta_list_table-table").find("thead th").eq(1).css("display", "none");
                }
                for (var m = 0; m < cell.length; m++) {
                    $("#trade_sta_list_table-table").find("thead th").eq(cell[m]).css("display", "none");
                    var ll = $("#trade_sta_list_table-table").find("tbody tr");

                    for (var i = 0; i < ll.length; i++) {
                        $(ll).eq(i).find("td").eq(cell[m]).css("display", "none");
                    }
                }
            } else {
                $("#trade_sta_list_table-table").find("thead").css("display", "none");

            }


            //self._renderpage(data, 1);
            cloud.util.unmask("#trade_sta_list_table");

        },
        _renderpage: function(data, start) {
            var self = this;

            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#trade_sta_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        Service.getTradeList(options.cursor, options.limit, self.startTime, self.endTime, self.assetId, function(data) {
                            callback(data);
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        }
    });
    return list;
});