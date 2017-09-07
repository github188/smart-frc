define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./info.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var appcolumns= [ {
		"title":locale.get({lang:"automat_serial_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "20%",

	},{
		"title":locale.get({lang:"name1"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "50%"
	},{
		"title":locale.get({lang:"current_version"}),
		"dataIndex" : "version",
		"cls" : null,
		"width" : "30%"
	} ];
    var adcolumns= [ {
		"title":locale.get({lang:"automat_serial_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "30%",

	},{
		"title":locale.get({lang:"name1"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "40%"
	},{
		"title":locale.get({lang:"type"}),
		"dataIndex" : "type",
		"cls" : null,
		"width" : "30%",
		  render: function(data, type, row) {
              var display = "";
              if (data) {
                 if(data == "8001"){
                	 display = locale.get({lang: "advertisment"});
                 }
              } else {
                  display = '';
              }
              return display;
          }
	},{
		"title":locale.get({lang:"current_version"}),
		"dataIndex" : "version",
		"cls" : null,
		"width" : "30%"
	} ];
    function createNum(tableId){
    	   
    	var tr = [];
    	tr = $(tableId).find("tr");
    	for(var i=1;i<tr.length;i++){
    		var te = $(tableId).find("tr")[i];
    		var td = $(tableId).find(te).find("td");  
    		var tt = $(tableId).find(td)[0];
    		var numtext = $(tableId).find(tt).text();
    		if(td.length>1){
    			$(tableId).find(tt).text(i);   			
    		}
    	}
    	
    }
    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.render();
            this.inboxConfig = null;
            this.automatWindow = options.automatWindow;
        },
        render: function() {
         
        },
        renderAppList:function(){
        	 this.listTable = new Table({
                 selector: "#applist",
                 columns: appcolumns,
                 datas: [],
                 pageSize: 100,
                 autoWidth: false,
                 pageToolBar: false,
                 //checkbox: "full",
                 events: {
                     onRowClick: function(data) { 
                         this.listTable.unselectAllRows();
                         var rows = this.listTable.getClickedRow();
                         this.listTable.selectRows(rows);
                     },
                     onRowRendered: function(tr, data, index) {
                         var self = this; 
                     },
                     scope: this
                 }
             });
        },
        renderAdList:function(){
       	 this.adlistTable = new Table({
             selector: "#adlist",
             columns: adcolumns,
             datas: [],
             pageSize: 100,
             autoWidth: false,
             pageToolBar: false,
             //checkbox: "full",
             events: {
                 onRowClick: function(data) { 
                     this.adlistTable.unselectAllRows();
                     var rows = this.adlistTable.getClickedRow();
                     this.adlistTable.selectRows(rows);
                 },
                 onRowRendered: function(tr, data, index) {
                     var self = this; 
                 },
                 scope: this
             }
         });
    },
    loadData:function(){
        	if(this.inboxConfig){
        		if(this.inboxConfig.fireware){
        			$("#fireware").val(this.inboxConfig.fireware);
        		}else{
        			$("#fireware").val(locale.get({lang: "automat_unknown"}));
        		}
        		if(this.inboxConfig.apps){
        			this.listTable.render(this.inboxConfig.apps);
        		}
        		if(this.inboxConfig.vendingData){
        			this.adlistTable.render(this.inboxConfig.vendingData);
        		}
        		createNum("#applist-table");
        		createNum("#adlist-table");
        	}
    },
    btnEvent:function(){
    	//下一步
    	$("#detail_next_step").bind("click", function() {
            $("#statusInfo").css("display", "block");
            $("#detailInfo").css("display", "none");
            $("#tab2").removeClass("active");
            $("#tab3").addClass("active");
        });
    	//上一步
    	$("#detail_last_step").bind("click", function() {
    		 $("#baseInfo").css("display", "block");
             $("#detailInfo").css("display", "none");
             $("#tab2").removeClass("active");
             $("#tab1").addClass("active");
    	});
    },
    getData:function(inboxConfig){
        this.inboxConfig = inboxConfig;
        this.renderAppList();
        this.renderAdList();
        this.loadData();
        this.btnEvent();
     }
    });
    return config;
});