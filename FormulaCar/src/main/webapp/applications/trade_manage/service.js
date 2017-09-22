define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAllLine:function(searchData,limit,cursor,callback,context){
        	 var self = this;
           searchData.limit = limit;
           searchData.cursor = cursor;
           cloud.Ajax.request({
               url: "api/automatline/list",
               type: "GET",
               parameters: searchData,
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
      },
        getLinesByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		  if(data && data.result && data.result.area && data.result.area.length>0){
		    			  cloud.Ajax.request({
			   	    	      url:"api/automatline/list",
					    	  type : "GET",
					    	  parameters : {
					    		  areaId: data.result.area,
					    		  cursor:0,
					    		  limit:-1
			                  },
					    	  success : function(data) {
					    		  callback.call(context || this, data);
					    	  }
		    			  });
		    		  }else{
		    			  callback.call(context || this, data); 
		    		  }
		    	  }
          });
        },
        getLineInfoByUserId:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/automatline/"+id+"/line",
				type : "GET",
				parameters:{
					limit:-1,
					cursor:0
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getUserMessage:function(callback,context){
        	cloud.Ajax.request({
				url:"api2/users/this",
				type : "GET",
				parameters:{
					verbose:100
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getGoodsTypeInfo: function(callback, context) {
   			cloud.Ajax.request({
                url : "api/goods/type",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		refundQrcodePay:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/pay/qrcoderefund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
   		refundAbc:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/abc/refund",
                type : "get",
                parameters : {
                	orderNo : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		
		refundBest:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/bestpay/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		refundVip:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/pay/vipRefund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		refundJD:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/jdpay/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		refundUnionPay:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/pay/unionpay/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
        refundBaifubao:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/baifubao/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
        refund:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/pay/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		refundAlipay:function(orderNo,oid,id,callback,context){
			cloud.Ajax.request({
                url : "api/alipay/refund",
                type : "get",
                parameters : {
                	order_no : orderNo,
                    oid:oid,
                    id:id
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
        getTradeInfo: function(start,limit,callback, context) {
        	var aucmas = 0;
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){//澳柯玛longyuniot.com
        		aucmas = 1;
        	}
   			cloud.Ajax.request({
                url : "api/order/list",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit,
                    aucmas:aucmas
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		getTradeById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/order/"+id,
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		createTradeExcel: function(uid,userName,payStyle, searchValue_assetId,searchValue_goodsName,searchValue_orderNo,searchValue_siteName, startTime,endTime,refundStatus,payStatus,userline,deliverStatus,machineType,time,refundStatus,language,callback, context) {
   			var parameters = {};
   			if(uid != null && uid != ""){
   				parameters.uid = uid;
   			}
   			if(userName != null && userName != ""){
   				parameters.userName = userName;
   			}
   			if(searchValue_assetId != null && searchValue_assetId != ""){
   				parameters.assetId = searchValue_assetId;
   			}
   			if(searchValue_goodsName != null && searchValue_goodsName != ""){
   				parameters.goodsName = searchValue_goodsName;
   			}
   			if(searchValue_orderNo != null && searchValue_orderNo != ""){
   				parameters.orderNo = searchValue_orderNo;
   			}
   			if(searchValue_siteName != null && searchValue_siteName != ""){
   				parameters.siteName = searchValue_siteName;
   			}
   			if(payStyle != null && payStyle.length >0){
   				parameters.payStyle = payStyle;
   			}
   			
   			if(startTime != null && startTime != "" && endTime != null && endTime != ""){
   				parameters.startTime = startTime;
   				parameters.endTime = endTime;
   			}
   			
   			if(refundStatus != null){
   				parameters.refundStatus = refundStatus;
   			}
   			
   			if(userline != null && userline.length >0){
   				parameters.lineId = userline;
   			}
   			
   			if(payStatus != null && payStatus != "-1"){
   				parameters.payStatus = payStatus;
   			}
   			
   			if(machineType != null && machineType != "0"){
   				parameters.machineType = machineType;
   			}
   			
   			if(deliverStatus != null && deliverStatus != "1"){
   				parameters.deliverStatus = deliverStatus;
   			}   			
   			if(time != null){
   				parameters.time = time;
   			}
   			if(refundStatus != null){
   				parameters.refundStatus = refundStatus;
   			}
   			if(language!=null){
   				parameters.language = language;
   			}
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/trade/create",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		findTradeExcel:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findTradeExcel",
                type : "get",
                parameters : {
                	path : "/home/trade/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
		
   		getTradeList: function(start,limit,startTime,endTime, callback, context) {
   			var parameters = {};
   			
   			if(startTime != null && startTime != "" && endTime != null && endTime != ""){
   				parameters.startTime = startTime;
   				parameters.endTime = endTime;
   			}
   			
   	    	cloud.Ajax.request({
   	    		url : "api/basic/trade/list",
	   	        type : "post",
	   	        parameters : {
                   cursor : start,
                   limit:limit
                },
	   	        //data : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
        
    });

    return new Service();
    
});