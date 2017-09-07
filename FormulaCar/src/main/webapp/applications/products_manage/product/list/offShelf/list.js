define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./list.html");
    require("cloud/lib/plugin/jquery-ui");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var Service = require("../../../service");
    require("cloud/base/fixTableHeader");
    var NoticeBar = require("./notice-bar");
    var columns = [{
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "25%"
    }, {
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
    
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.goodId = options.goodId;
            this.gwindow = options.gwindow;
            this.deviceId=[];
            this.elements = {
                bar: {
                    id: "dev_list_bar",
                    "class": null
                },
                table: {
                    id: "dev_list_table",
                    "class": null
                }
            };
           
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderTable();
            this._renderNoticeBar();
        },
        _renderHtml: function() {
            this.element.html(html);
            $("#dev_list").css("width",$("#deviceInfo").width());
			
			var listHeight = $("#dev_list").height();
		    var barHeight = $("#dev_list_bar").height();
			var tableHeight=listHeight - barHeight;
			$("#dev_list_table").css("height",tableHeight);

        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#dev_list_bar",
                events: {
                	query:function(){
                		self.loadData();
                	}
                }
            });
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderTable: function() {
        	var self = this;
            this.listTable = new Table({
                selector: "#dev_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data) {
                       // this.listTable.unselectAllRows();
                       // var rows = this.listTable.getClickedRow();
                       // this.listTable.selectRows(rows);
                       
                        var id = data.assetId;
                        if(self.deviceId.indexOf(id)>-1){//存在
                        	 for(var i=0; i<self.deviceId.length; i++) {
                        		 if(self.deviceId[i] == id) {
                        		      self.deviceId.splice(i, 1);
                        		      break;
                        		 }
                        	 }
                        }else{
                        	self.deviceId.push(id);
                        }
                        console.log(self.deviceId);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });
            var height = $("#dev_list_table").height()+"px";
            $("#dev_list_table-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
            this.renderBtn();
        },
        renderBtn:function(){
        	var self = this;
        	$("#save").bind("click",function(){
        		 var idsArr =self.deviceId;
        		 if (idsArr.length == 0) {
        			 dialog.render({lang: "please_select_at_least_one_config_item"});
                     return;
        		 }else{
                     var contentdata={
                    		 assetIds:idsArr,
                    		 goods_id:self.goodId
                     };
                     
                     dialog.render({
                         lang: "affirm_off_the_shelf",
                         buttons: [{
                                 lang: "affirm",
                                 click: function() {
                                	 Service.updateAutomatByGoodsId(contentdata,function(data) {
                                    	 console.log(data);
                                    	 self.gwindow.destroy();
                                    	 self.fire("getAll");
                                    	 dialog.render({lang: "off_the_shelf_goods_success"});
                                     });
                                	 dialog.close();
                                 }
                         },
                         {
                             lang: "cancel",
                             click: function() {
                                 dialog.close();
                             }
                         }]
                     });
        		 }
 		    	
 		    });
        	$("#cancel").bind("click",function(){
 		    	self.gwindow.destroy();
 		    });
        },
        loadData: function() {
            cloud.util.mask("#dev_list_table");
            var self = this;
            var areaId = "";
            var lineId = "";
            
            if($("#userarea").attr("multiple") != undefined){
             	areaId = $("#userarea").multiselect("getChecked").map(function() {//
                   return this.value;
                }).get();
            	lineId = $("#userline").multiselect("getChecked").map(function() {//
                  return this.value;
                }).get();
            }
            
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId,function(areadata){
            	var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                }
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
	   	    	      url:"api/automatline/list",
			    	  type : "GET",
			    	  parameters : {
			    		  areaId: areaIds,
			    		  cursor:0,
			    		  limit:-1
	                  },
			    	  success : function(linedata) {
			    		  var lineIds=[];
  			    		  if(linedata && linedata.result && linedata.result.length>0){
  			    			  for(var i=0;i<linedata.result.length;i++){
  			    				  lineIds.push(linedata.result[i]._id);
  			    			  }
  		                   }
  			    		  
  			    		  if(roleType == 51 && areaId.length == 0){
  			    			  lineIds = [];
  			              }
  			    		  if(lineId.length != 0){
  			    			  lineIds = lineId;
  			    		  }else{
  			    			  if(lineFlag == 0){
  			    				  lineIds = ["000000000000000000000000"];
  			    			  }
  			    		  }
  			    		  
  			    		  if(roleType != 51 && lineIds.length == 0){
  			    			   lineIds = ["000000000000000000000000"];
  			    		  }
  			              self.lineIds = lineIds;
  			              var assetId =$("#assetId").val();
  			             Service.getAutoByGoodsId(self.goodId,lineIds,assetId,function(data){
  							console.log(data);
  							 self.listTable.render(data.result);
  							 cloud.util.unmask("#dev_list_table");
  						 });
  			              
			    	  }
                });
            });
           
        },
       
        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.listTable && self.listTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});