define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./info.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    
    var columnsFaultCode= [ {
		"title":locale.get({lang:"automat_serial_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "20%",

	},{
		"title":locale.get({lang:"automat_fault_code"}),
		"dataIndex" : "code",
		"cls" : null,
		"width" : "80%"
	}];
    
    var columns= [ {
		"title":locale.get({lang:"automat_serial_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "20%",

	},{
		"title":locale.get({lang:"device_shelf_number"}),
		"dataIndex" : "cid",
		"cls" : null,
		"width" : "20%"

	},{
		"title":locale.get({lang:"automat_fault_type"}),
		"dataIndex" : "pcode",
		"cls" : null,
		"width" : "30%",
		 render: function(data, type, row) {
             var display = "";
             if (data) {
                if(data == "9001"){
               	   display = locale.get({lang: "automat_system_failure"});//系统故障
                }else if(data == "9002"){
               	   display = locale.get({lang: "automat_note_machine_fault"});//纸币器故障
                }else if(data == "9003"){
               	   display = locale.get({lang: "automat_coin_device_failure"});//硬币器故障
                }else if(data == "9004"){
               	   display = locale.get({lang: "automat_communication_failure"});//通讯故障
                }
             } else {
                 display = '';
             }
             return display;
         }
	},{
		"title":locale.get({lang:"automat_fault_name"}),
		"dataIndex" : "ccode",
		"cls" : null,
		"width" : "50%",
		render: function(data, type, row) {
            var display = "";
            if (data) {
               if(data == "90011"){
              	   display = "驱动板故障";
               }else if(data == "90012"){
              	   display = "系统时钟故障";
               }else if(data == "90013"){
              	   display = "左室传感器故障";
               }else if(data == "90014"){
              	   display = "右室传感器故障";
               }else if(data == "90015"){
              	   display = "红外模块故障";
               }else if(data == "90016"){
              	   display = "读卡器故障";
               }else if(data == "90021"){
              	   display = "连接故障";
               }else if(data == "90022"){
              	   display = "纸币器驱动马达故障";
               }else if(data == "90023"){
              	   display = "纸币器钱箱被移除";
               }else if(data == "90024"){
              	   display = "纸币器钱箱已满";
               }else if(data == "90025"){
              	   display = "纸币器rom校验错误";
               }else if(data == "90026"){
              	   display = "纸币器传感器故障";
               }else if(data == "90027"){
              	   display = "纸币器堵塞";
               }else if(data == "90028"){
            	   display = "纸币器停用";
               }else if(data == "90031"){
              	   display = "硬币器连接故障";
               }else if(data == "90032"){
              	   display = "硬币器工作电压低";
               }else if(data == "90033"){
              	   display = "硬币器传感器故障";
               }else if(data == "90034"){
              	   display = "硬币器ROM校验错误";
               }else if(data == "90035"){
              	   display = "硬币器接收堵塞";
               }else if(data == "90036"){
              	   display = "硬币器支出堵塞";
               }else if(data == "90037"){
              	   display = "5角缺币";
               }else if(data == "90038"){
              	   display = "1元缺币";
               }else if(data == "90039"){
              	   display = "硬币器异常移除";
               }else if(data == "900311"){
              	   display = "硬币器停用";
               }else if(data == "90041"){
              	   display = "扩展柜1通讯故障";
               }else if(data == "90042"){
              	   display = "扩展柜2通讯故障";
               }else if(data == "90043"){
              	   display = "扩展柜3通讯故障";
               }else if(data == "90044"){
              	   display = "扩展柜4通讯故障";
               }else if(data == "90045"){
              	   display = "扩展柜5通讯故障";
               }else if(data == "90046"){
              	   display = "扩展柜6通讯故障";
               }else if(data == "90047"){
              	   display = "扩展柜7通讯故障";
               }else if(data == "90048"){
              	   display = "扩展柜8通讯故障";
               }
            } else {
                display = '';
            }
            return display;
        }
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
            this.assetId = options.assetId;
            this.automatNo=options.automatNo;
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.render();
            this.vendingState = null;
            this.automatWindow = options.automatWindow;
        },
        render: function() {
         
        },
        renderFaultList:function(){
       	 this.listTable = new Table({
                selector: "#faultlist",
                columns: columns,
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
       renderFaultCode:function(){
    	   this.faultCodeList = new Table({
    		   selector:"#faultCode",
    		   columns:columnsFaultCode,
    		   datas:[],
    		   pageSize: 100,
    		   autoWidth: false,
               pageToolBar: false,
               events: {
                   onRowClick: function(data) { 
                       this.faultCodeList.unselectAllRows();
                       var rows = this.faultCodeList.getClickedRow();
                       this.faultCodeList.selectRows(rows);
                   },
                   onRowRendered: function(tr, data, index) {
                       var self = this; 
                   },
                   scope: this
               }
    	   })
       },
       renderAutomateList:function(){
           if(document.getElementById("auto_table")) { 
         	  $("#auto_table").remove();
           }
//           if(document.getElementById("biaoHaoLabel")) { 
//          	  $("#biaoHaoLabel").remove();
//            }
//           $("#autoBianHao").append("<label id='biaoHaoLabel'>["+this.automatNo+"]：</label>");
    	   $("#automateNo").append("<table id='auto_table' width='100%'>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('open_time')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='engyOnT' name='engyOnT' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('closing_time')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='engyOffT' name='engyOffT' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('sun_open')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='lampOnT' name='lampOnT' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('sun_closing')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='lampOffT' name='lampOffT' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('uplimit')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='cryTemUL' name='cryTemUL' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('downlimit')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='cryTemDL' name='cryTemDL' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('heat_uplimit')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='heatTemUL' name='heatTemUL' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('heat_downlimit')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='heatTemDL' name='heatTemDL' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('left_tep')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='leftRmTem' name='leftRmTem' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('right_tep')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='rightRmTem' name='rightRmTem' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('left_ref')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='leftRmRef' name='leftRmRef' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('right_ref')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='rightRmRef' name='rightRmRef' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('left_heat')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='leftRmHeat' name='leftRmHeat' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('right_heat')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='rightRmHeat' name='rightRmHeat' style='width:100px;height:25px;'/></td>"+
					        "    <td><label>"+locale.get('all_open')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='lampNorOp' name='lampNorOp' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        " <tr>"+
					        "    <td width='10px'></td>"+
					        "    <td><label>"+locale.get('hand_open')+"：</label></td>"+
					        "    <td><input type='text' class='input' disabled='disabled' id='lampAut' name='lampAut' style='width:100px;height:25px;'/></td>"+
					        "  </tr>"+
					        "  </table>");
       },
        loadData:function(){
        	if(this.vendingState){
        		if(this.vendingState.doorState && this.vendingState.doorState == 1){
        			var display = locale.get({lang: "automat_open_the_door"});
    				$("#doorState").val(display);
        		}else if(this.vendingState.doorState == 0){
        			var display = locale.get({lang: "automat_close_the_door"});
             	    $("#doorState").val(display);
        		}else if(this.vendingState.doorState == -1){
        			var display = locale.get({lang: "automat_unknown"});
        			$("#doorState").val(display);
        		}else{
        			var display = locale.get({lang: "automat_unknown"});
        			$("#doorState").val(display);
        		}
        		
        		if(this.vendingState.vmcOnline && this.vendingState.vmcOnline == 1){
        			var display = locale.get({lang:"automat_vmcconnection_state_conn"});
        			$("#vmcConnection").val(display);
        		}else if(this.vendingState.vmcOnline == 0){
        			var display = locale.get({lang:"automat_vmcconnection_state_off"});
        			$("#vmcConnection").val(display);
        		}else if(this.vendingState.vmcOnline == -1){
        			var display = locale.get({lang: "automat_unknown"});
        			$("#vmcConnection").val(display);
        		}else{
        			var display = locale.get({lang: "automat_unknown"});
        			$("#vmcConnection").val(display);
        		}
        		
        		if(this.vendingState.isSale && this.vendingState.isSale == 1){
        			var display = locale.get({lang: "automat_can_be_sold"});
    				$("#isSale").val(display);
        		}else if(this.vendingState.isSale == 0){
        			var display = locale.get({lang: "automat_can_not_be_sold"});
            	    $("#isSale").val(display);
        		}else if(this.vendingState.isSale == -1){
        			var display = locale.get({lang: "automat_unknown"});
         			$("#isSale").val(display);
        		}else{
        			var display = locale.get({lang: "automat_unknown"});
         			$("#isSale").val(display);
        		}
        		
        		if(this.vendingState.coin5Count || this.vendingState.coin5Count == 0){
        			if(this.vendingState.coin5Count <0){
            		    var display = locale.get({lang: "automat_unknown"});
            			$("#coin5Count").val(display);
            		}else{
            			 $("#coin5Count").val(this.vendingState.coin5Count);
            		}
        		}else{
        			var display = locale.get({lang: "automat_unknown"});
        			$("#coin5Count").val(display);
        		}
        		
        		if(this.vendingState.coin10Count || this.vendingState.coin10Count ==0){
        			if(this.vendingState.coin10Count <0){
            		    var display = locale.get({lang: "automat_unknown"});
            			$("#coin10Count").val(display);
            		}else{
            			$("#coin10Count").val(this.vendingState.coin10Count);
            		}
        		    
        		}else{
        			var display = locale.get({lang: "automat_unknown"});
        			$("#coin10Count").val(display);
        		}
        		
        		if(this.vendingState.vendingFault){
        			this.listTable.render(this.vendingState.vendingFault);
        		}
        		if(this.vendingState.faultCode && this.vendingState.faultCode.length>0){
        			var faultCodeList = [];
        			for(var i=0;i<this.vendingState.faultCode.length;i++){
        				var codeInfo = {};
        				if(this.vendingState.faultCode[i] != 0){
        					codeInfo.code = this.vendingState.faultCode[i]+"";
        					faultCodeList.push(codeInfo);
        				}
        			}
        			this.faultCodeList.render(faultCodeList);
        		}
        	}else{
        		var display = locale.get({lang: "automat_unknown"});
    			$("#doorState").val(display);
    			$("#isSale").val(display);
    			$("#coin5Count").val(display);
    			$("#coin10Count").val(display);
    			$("#vmcConnection").val(display);
        	}
        	
        	createNum("#faultlist-table");
        	createNum("#faultCode-table");
      },
      appendData:function(){
      	if(this.vendingState){
    		if (this.vendingState.temperState && this.vendingState.temperState.length>0) {
            	for(var i=0;i<this.vendingState.temperState.length;i++){
            		if(this.vendingState.temperState[i].cid == 'master'){
            			if(this.vendingState.temperState[i].temperDetail.engyOnT){
            				var engyOnT = this.vendingState.temperState[i].temperDetail.engyOnT;
                			$("#engyOnT").val(engyOnT);
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#engyOnT").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.engyOffT){
            				var engyOffT = this.vendingState.temperState[i].temperDetail.engyOffT;
                			$("#engyOffT").val(engyOffT);
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#engyOffT").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.lampOnT){
            				var lampOnT = this.vendingState.temperState[i].temperDetail.lampOnT;
                			$("#lampOnT").val(lampOnT);
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#lampOnT").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.lampOffT){
            				var lampOffT = this.vendingState.temperState[i].temperDetail.lampOffT;
                			$("#lampOffT").val(lampOffT);
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#lampOffT").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.cryTemUL){
            				var cryTemUL = this.vendingState.temperState[i].temperDetail.cryTemUL;
                			$("#cryTemUL").val(cryTemUL+"℃");
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#cryTemUL").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.cryTemDL){
            				var cryTemDL = this.vendingState.temperState[i].temperDetail.cryTemDL;
                			$("#cryTemDL").val(cryTemDL+"℃");
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#cryTemDL").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.heatTemUL){
            				var heatTemUL = this.vendingState.temperState[i].temperDetail.heatTemUL;
                			$("#heatTemUL").val(heatTemUL+"℃");
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#heatTemUL").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.heatTemDL){
            				var heatTemDL = this.vendingState.temperState[i].temperDetail.heatTemDL;
                			$("#heatTemDL").val(heatTemDL+"℃");
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#heatTemDL").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.leftRmTem){
            				var leftRmTem = this.vendingState.temperState[i].temperDetail.leftRmTem;
            				if(leftRmTem>=-30){
            					$("#leftRmTem").val(leftRmTem+"℃");
            				}else{
            					display = locale.get({lang: "automat_unknown"});
                				$("#leftRmTem").val(display);
            				}
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#leftRmTem").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.rightRmTem){
            				var rightRmTem = this.vendingState.temperState[i].temperDetail.rightRmTem;
            				if(rightRmTem>=-30){
            					$("#rightRmTem").val(rightRmTem+"℃");
            				}else{
            					display = locale.get({lang: "automat_unknown"});
            					$("#rightRmTem").val(display);
            				}
            			}else{
            				display = locale.get({lang: "automat_unknown"});
            				$("#rightRmTem").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.leftRmRef == 1){
            				var display = locale.get({lang: "open"});
                    		$("#leftRmRef").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.leftRmRef == 0){
        					var display = locale.get({lang: "close"});
                			$("#leftRmRef").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#leftRmRef").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.rightRmRef == 1){
            				var display = locale.get({lang: "open"});
                    		$("#rightRmRef").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.rightRmRef == 0){
        					var display = locale.get({lang: "close"});
                			$("#rightRmRef").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#rightRmRef").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.leftRmHeat == 1){
            				var display = locale.get({lang: "open"});
                    		$("#leftRmHeat").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.leftRmHeat == 0){
        					var display = locale.get({lang: "close"});
                			$("#leftRmHeat").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#leftRmHeat").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.rightRmHeat == 1){
            				var display = locale.get({lang: "open"});
                    		$("#rightRmHeat").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.rightRmHeat == 0){
        					var display = locale.get({lang: "close"});
                			$("#rightRmHeat").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#rightRmHeat").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.lampNorOp == 1){
            				var display = locale.get({lang: "open"});
                    		$("#lampNorOp").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.lampNorOp == 0){
        					var display = locale.get({lang: "close"});
                			$("#lampNorOp").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#lampNorOp").val(display);
            			}
            			if(this.vendingState.temperState[i].temperDetail.lampAut == 1){
            				var display = locale.get({lang: "open"});
                    		$("#lampAut").val(display);
            			}else if(this.vendingState.temperState[i].temperDetail.lampAut == 0){
        					var display = locale.get({lang: "close"});
                			$("#lampAut").val(display);
            			}else {
            				display = locale.get({lang: "automat_unknown"});
            				$("#lampAut").val(display);
            			}
            			
            		}
           	}
          }
        } 
      },
      btnEvent:function(){
    	//下一步
    	$("#status_next_step").bind("click", function() {
            $("#selfConfig").css("display", "block");
            $("#statusInfo").css("display", "none");
            $("#tab3").removeClass("active");
            $("#tab4").addClass("active");
        });
    	//上一步
    	$("#status_last_step").bind("click", function() {
    		 $("#detailInfo").css("display", "block");
             $("#statusInfo").css("display", "none");
             $("#tab3").removeClass("active");
             $("#tab2").addClass("active");
    	});
      },
      getData:function(vendingState){
          this.vendingState = vendingState;
          this.renderFaultList();
          this.renderFaultCode();
          this.renderAutomateList();
          this.loadData();
          this.appendData();
          this.btnEvent();
      }
    });
    return config;
});