define(function(require) {
    require("cloud/base/cloud");
    
    var transLocale = function(one){
    	var paramObj = one.params;
    	$.each(paramObj, function(i,val){
    		var paramStr = paramObj[i]?(paramObj[i]).replace(/ /g, "_"):paramObj[i]="";
    		//遍历参数---以防用户创建的资源与其他国际化名相同--最大化 保证 不会出现问题
    		switch (paramStr) {
			case "apply_config":
			case "auto_create_site":
			case "config_synchro_status":
			case "cost_timing_statistics":
			case "device_function_test":
			case "evt_files":
			case "flow_timing_statistics":
			case "get_formatting_parameters":
			case "import_upgrade_file":
			case "inrouter_certificate_profile":
			case "interactive_command":
			case "periodic_cleaning_access_token":
			case "remote_control":
			case "run_config_apply":
			case "sms_apply_config":
			case "tendency_chart":
			case "upload_files":
			case "visit_timing_statistics":
			case "vpn_link_order":
			case "vpn_temporary_channel_config":
			case "zip_format_config_file":
			case "set_running_config":
			case "get_running_config":
			case "set_ovdp_config":
			case "get_ovdp_config":
			case "device_upgrade":
			case "calculate_traffic":
			case "inform_new_task":
			case "check_channel_status":
			case "calculate_bill":
			case "calculate_api_access":
			case "check_token_expired":
			case "batch_favor":
			case "batch_share":
			case "batch_import_gateway_device":
			case "download_template_file":
			case "import_sn_file":
				paramObj[i] = locale.get(paramStr);
				break;
			default:
				break;
		}
    	});
		var localeName = locale.get(one.code, paramObj);
		one.content = localeName ? localeName : one.content;
	};
    
    var Service = Class.create({
        initialize: function(){
        },
        getMoreEmail:function(parameters,callback,context){
			cloud.Ajax.request({
                url : "mapi/moreEmail/send",
                type : "get",
                parameters:parameters,
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        addHelpDoc:function(obj,callback,context){
			cloud.Ajax.request({
                url : "mapi/helpdoc/add",
                type : "post",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getHelpDocById:function(id,callback,context){
			cloud.Ajax.request({
                url : "mapi/helpdoc/"+id,
                type : "get",
                parameters:{
                	verbose:100
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
		updateHelpDocById:function(id,obj,callback,context){
			cloud.Ajax.request({
                url : "mapi/helpdoc/"+id,
                type : "put",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
		deleteHelpDoc:function(id,callback,context){
			cloud.Ajax.request({
                url : "mapi/helpdoc/"+id,
                type : "delete",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
		getAllHelpDoc:function(searchData,limit,cursor,callback,context){
         	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "mapi/helpdoc/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
        getOidById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api2/organizations/"+id,
                type : "get",
                parameters:{
                	verbose:100
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
		updateOidById:function(id,obj,callback,context){
			cloud.Ajax.request({
                url : "api2/organizations/"+id,
                type : "put",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
        createInbox:function(obj,callback,context){
			cloud.Ajax.request({
                url : "api/versionconfig/add",
                type : "post",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		 getAllArea:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/areaMan/list",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
		updateAppVersionConfig:function(id,obj,callback,context){
			cloud.Ajax.request({
                url : "api/versionconfig/"+id,
                type : "put",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
		downloadInbox:function(fileId,callback,context){
			cloud.Ajax.request({
                url : "api/versionconfig/downloadZip",
                type : "get",
                parameters :{
                	configfileId:fileId
				},
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
        getModelConfig:function(obj,callback,context){
        	cloud.Ajax.request({
				url:"api/model/list",
				type : "GET",
				parameters:obj,
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getModelById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/model/"+id,
                type : "get",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        getTemplateById:function(id,callback,context){
        	       	       	
			cloud.Ajax.request({
                url : "api/automat/"+id+"/channelModel",
                type : "get",
                async: false,
                success : function(data) {
                   callback.call(context || this, data);
                },
                error:function(data){
                	  
	                  callback.call(context || this, data);
	              }
           });
		},
        getTemplateByMachineTypeAndVendor:function(obj,callback,context){
        	cloud.Ajax.request({
				url:"api/automat/list/channelModel",
				type : "GET",
				parameters:obj,
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getTypeByMachineTypeAndVendor:function(obj,callback,context){
        	cloud.Ajax.request({
				url:"api/automat/modelList",
				type : "GET",
				parameters:obj,
				async: false,
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getSystemconfig:function(obj,callback,context){
        	cloud.Ajax.request({
				url:"gapi/config/versionmanage",
				type : "GET",
				parameters:obj,
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getUserMessage:function(oid,callback,context){
        	cloud.Ajax.request({
				url:"api2/organizations/"+oid,
				type : "GET",
				parameters:{
					verbose:100
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        verificationOid:function(name,server,callback,context){
			cloud.Ajax.request({
                url : "gapi/modelmanage/organization?name="+name+"&server="+server,
                type : "get",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        addVersionDistribution:function(obj,callback,context){
			cloud.Ajax.request({
                url : "gapi/modelmanage/add",
                type : "post",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
		updateVersionDistribution:function(id,wechatObj,callback,context){
			cloud.Ajax.request({
                url : "gapi/modelmanage/"+id,
                type : "put",
                data:wechatObj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
		deleteVersionDistribution:function(id,callback,context){
				cloud.Ajax.request({
	                url : "gapi/modelmanage/"+id,
	                type : "delete",
	                success : function(data) {
	                   callback.call(context || this, data);
	                }
	           });
		},
		getVersionDistributionById:function(id,callback,context){
			cloud.Ajax.request({
                url : "gapi/modelmanage/"+id,
                type : "get",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        getVersionDistributionInfo:function(searchData,start,limit,callback,context){
        	searchData.limit = limit;
            searchData.cursor = start;
		    cloud.Ajax.request({
                url : "gapi/modelmanage/list",
                type : "get",
                parameters: searchData,
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   getAppVersionConfigInfo:function(desc,callback,context){
       	
		    cloud.Ajax.request({
               url : "api/versionconfig/appconfig",
               type : "get",
               parameters: {
					desc:desc
				},
               success : function(data) {
                  callback.call(context || this, data);
               }
          });
	   },
        deleteVersion:function(id,callback,context){
			cloud.Ajax.request({
                url : "gapi/model/"+id,
                type : "delete",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        getVersionById:function(id,callback,context){
			cloud.Ajax.request({
                url : "gapi/model/"+id,
                type : "get",
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
        getVersionInfo:function(start,limit,callback,context){
		    cloud.Ajax.request({
                url : "gapi/model/list",
                type : "get",
                parameters : {
                	cursor : start,
                    limit:limit
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   addVersion:function(obj,callback,context){
			cloud.Ajax.request({
                url : "gapi/model/add",
                type : "post",
                data:obj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
		updateVersion:function(id,wechatObj,callback,context){
			cloud.Ajax.request({
                url : "gapi/model/"+id,
                type : "put",
                data:wechatObj,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
	                  callback.call(context || this, data);
	              }
            });
		},
        createWechatConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/wechatPay/add",
                type : "post",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
           		     areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		
		getCardInfo:function(startTime,endTime,start,limit,callback,context){
		    cloud.Ajax.request({
                url : "api/card/list",
                type : "get",
                parameters : {
               	    startTime:startTime,
                	endTime:endTime,
                	cursor : start,
                    limit:limit
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
		updateWechatConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/wechatPay/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
               		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		updateCardConfig:function(id,name,wechatObj,callback,context){
			cloud.Ajax.request({
                url : "api/card/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getCardConfig:function(name,callback,context){
			cloud.Ajax.request({
                url : "api/card",
                type : "get",
                parameters : {
               	 name:name
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
		createCardConfig:function(name,wechatObj,callback,context){
			cloud.Ajax.request({
	               url : "api/card/add",
	               type : "post",
	               data:wechatObj,
	               parameters : {
	              	     name:name
	               },
	               success : function(data) {
	                   callback.call(context || this, data);
	               }
	           });
		},
		getIcbcConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/icbcPay",
                type : "get",
                parameters : {
               	 name:name,
               	 configflag:configflag,
               	 areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   updateIcbcConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/icbcPay/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
               		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		createIcbcConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
	               url : "api/icbcPay/add",
	               type : "post",
	               data:wechatObj,
	               parameters : {
	              	     name:name,
	              	     configflag:configflag,
	          		     areas:areaIds
	               },
	               success : function(data) {
	                   callback.call(context || this, data);
	               }
	           });
		},
		getQrcodepayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/qrcodepay",
                type : "get",
                parameters : {
               	 name:name,
               	 configflag:configflag,
               	 areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createQrcodepayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
	               url : "api/qrcodepay/add",
	               type : "post",
	               data:wechatObj,
	               parameters : {
	              	     name:name,
	              	     configflag:configflag,
	          		     areas:areaIds
	               },
	               success : function(data) {
	                   callback.call(context || this, data);
	               }
	           });
		},
		updateQrcodepayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/qrcodepay/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
               		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getunionPayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/unionPay",
                type : "get",
                parameters : {
               	 name:name,
               	 configflag:configflag,
               	 areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createunionPayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
               url : "api/unionPay/add",
               type : "post",
               data:wechatObj,
               parameters : {
              	     name:name,
              	     configflag:configflag,
          		     areas:areaIds
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
		updateunionPayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/unionPay/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
               		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getWechatConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                 url : "api/wechatPay",
                 type : "get",
                 parameters : {
                	 name:name,
                	 configflag:configflag,
                	 areas:areaIds
                 },
                 success : function(data) {
                    callback.call(context || this, data);
                 }
            });
	   },
	   getAreaByUserId: function(userId, callback, context) {
	     	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		   callback.call(context || this, data); 
		          }
           });
	    },
	    findTestResult:function(assetId,orderNo,callback,context){
	    	
	    	cloud.Ajax.request({
	              url : "api/pay/test_result",
	              type : "get",
	              parameters : {
	            	  assetId:assetId,
	            	  orderNo:orderNo
	              },
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
	    	
	    },
	   testWechatConfig:function(oid,areaId,configFlag,flag,wechatObj,callback,context){
		   
		   cloud.Ajax.request({
	              url : "api/pay/test",
	              type : "post",
	              data:wechatObj,
	              parameters : {
	            	  oid:oid,
	            	  areaId:areaId,
	            	  configFlag:configFlag,
	            	  flag:flag
	              },
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
		   
	   },
	   testBestPayConfig:function(oid,areaId,configFlag,flag,bestpayObj,callback,context){
		   
		   cloud.Ajax.request({
	              url : "api/bestpay/test",
	              type : "post",
	              data:bestpayObj,
	              parameters : {
	            	  oid:oid,
	            	  areaId:areaId,
	            	  configFlag:configFlag,
	            	  flag:flag
	              },
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
		   
	   },
	   testJDPayConfig:function(oid,areaId,configFlag,flag,jdpayObj,callback,context){
		   
		   cloud.Ajax.request({
	              url : "api/jdpay/test",
	              type : "post",
	              data:jdpayObj,
	              parameters : {
	            	  oid:oid,
	            	  areaId:areaId,
	            	  configFlag:configFlag,
	            	  flag:flag
	              },
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
		   
	   },
	   testAlipayConfig:function(oid,areaId,configFlag,flag,alipayObj,callback,context){
		   
		   cloud.Ajax.request({
	              url : "api/alipay/test",
	              type : "post",
	              data:alipayObj,
	              parameters : {
	            	  oid:oid,
	            	  areaId:areaId,
	            	  configFlag:configFlag,
	            	  flag:flag
	              },
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
		   
	   },
	   createBestPayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
              url : "api/best/add",
              type : "post",
              data:wechatObj,
              parameters : {
             	     name:name,
             	     configflag:configflag,
            		 areas:areaIds
              },
              success : function(data) {
                  callback.call(context || this, data);
              }
          });
		},
		updateBestPayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/best/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
            		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getBestPayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                 url : "api/best",
                 type : "get",
                 parameters : {
                	 name:name,
                	 configflag:configflag,
               		 areas:areaIds
                 },
                 success : function(data) {
                    callback.call(context || this, data);
                 }
            });
	   },
	   createJDPayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
             url : "api/jd/add",
             type : "post",
             data:wechatObj,
             parameters : {
            	     name:name,
            	     configflag:configflag,
           		 areas:areaIds
             },
             success : function(data) {
                 callback.call(context || this, data);
             }
         });
		},
		updateJDPayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
               url : "api/jd/"+id,
               type : "put",
               data:wechatObj,
               parameters : {
              	     name:name,
              	     configflag:configflag,
           		 areas:areaIds
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
		getJDPayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/jd",
                type : "get",
                parameters : {
               	 name:name,
               	 configflag:configflag,
              		 areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createVipPayConfig:function(name,vipObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
            url : "api/vippay/add",
            type : "post",
            data:vipObj,
            parameters : {
           	     name:name,
           	     configflag:configflag,
          		 areas:areaIds
            },
            success : function(data) {
                callback.call(context || this, data);
            }
        });
		},
		updateVipPayConfig:function(id,name,vipObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
              url : "api/vippay/"+id,
              type : "put",
              data:vipObj,
              parameters : {
             	     name:name,
             	     configflag:configflag,
          		 areas:areaIds
              },
              success : function(data) {
                  callback.call(context || this, data);
              }
          });
		},
	   getVipPayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
               url : "api/vippay",
               type : "get",
               parameters : {
              	 name:name,
              	 configflag:configflag,
             		 areas:areaIds
               },
               success : function(data) {
                  callback.call(context || this, data);
               }
          });
	   },
	   createBaiduConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
               url : "api/baiduPay/add",
               type : "post",
               data:wechatObj,
               parameters : {
              	     name:name,
              	     configflag:configflag,
             		 areas:areaIds
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
		updateBaiduConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/baiduPay/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
            		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getBaiduConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                 url : "api/baiduPay",
                 type : "get",
                 parameters : {
                	 name:name,
                	 configflag:configflag,
               		 areas:areaIds
                 },
                 success : function(data) {
                    callback.call(context || this, data);
                 }
            });
	   },
	   getParameterConfig:function(callback,context){
		    cloud.Ajax.request({
                url : "api/parameterconfig",
                type : "get",
                parameters : {
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createParameterConfig:function(configObj,callback,context){
			cloud.Ajax.request({
              url : "api/parameterconfig/add",
              type : "post",
              data:configObj,
              parameters : {
              },
              success : function(data) {
                  callback.call(context || this, data);
              }
          });
		},
		updateParameterConfig:function(id,configObj,callback,context){
			cloud.Ajax.request({
               url : "api/parameterconfig/"+id,
               type : "put",
               data:configObj,
               parameters : {
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
	   updateAbcConfig:function(id,name,wechatObj,callback,context){
			cloud.Ajax.request({
               url : "api/smartabcPay/"+id,
               type : "put",
               data:wechatObj,
               parameters : {
              	     name:name
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
	   createAbcConfig:function(name,wechatObj,callback,context){
			cloud.Ajax.request({
              url : "api/smartabcPay/add",
              type : "post",
              data:wechatObj,
              parameters : {
             	     name:name
              },
              success : function(data) {
                  callback.call(context || this, data);
              }
          });
		},
	   getAbcConfig:function(name,callback,context){
		    cloud.Ajax.request({
                url : "api/smartabcPay",
                type : "get",
                parameters : {
               	 name:name
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createAliPayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
              url : "api/stylealipay/add",
              type : "post",
              data:wechatObj,
              parameters : {
             	     name:name,
             	     configflag:configflag,
              		 areas:areaIds
              },
              success : function(data) {
                  callback.call(context || this, data);
              }
          });
		},
		updateAliPayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
               url : "api/stylealipay/"+id,
               type : "put",
               data:wechatObj,
               parameters : {
              	     name:name,
              	     configflag:configflag,
            		 areas:areaIds
               },
               success : function(data) {
                   callback.call(context || this, data);
               }
           });
		},
		getAliPayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/stylealipay",
                type : "get",
                parameters : {
               	    name:name,
               	    configflag:configflag,
               	    areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   getUserInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api2/users",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit,
                    verbose: 100
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		getAreaAll: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/smartArea",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		getLineAll: function(callback, context) {
   			cloud.Ajax.request({
                url : "api/automatline/all",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		getAreaInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/smartArea/list",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit,
                    verbose: 100
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		updateSmartUser:function(id,userData,callback,context){
 			cloud.Ajax.request({
                url : "api/smartUser/"+id,
                type : "PUT",
                data:userData,
                success : function(data) {
                	  callback.call(context || this,data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
   		addSmartUser:function(data,callback,context){
			cloud.Ajax.request({
	              url : "api/smartUser/add",
	              type : "post",
	              data:data,
	              success : function(data) {
	                  callback.call(context || this, data);
	              }
	          });
			},
   		addUser:function(data,callback,context){
			cloud.Ajax.request({
	              url : "api2/users",
	              type : "post",
	              data:data,
	              parameters: {
                  	language : locale.current(),
                    verbose: 4
                  },
	              success : function(data) {
	                  callback.call(context || this, data);
	              },
	              error:function(data){
	                  callback.call(context || this, data);
	              }
	          });
			},
		getSmartUserById:function(id,callback,context){
	     	    cloud.Ajax.request({
	   	    	      url:"api/smartUser/"+id,
			    	  type : "GET",
			    	  success : function(data) {
	           	      callback.call(context || this,data);
	             }
	          });
	        },
		getUserById:function(id,callback,context){
     	    cloud.Ajax.request({
   	    	      url:"api2/users/"+id,
   	    	      parameters : {
                      verbose: 100
                  },
		    	  type : "GET",
		    	  success : function(data) {
           	      callback.call(context || this,data);
             }
          });
        },
        updateUser:function(id,userData,callback,context){
 			cloud.Ajax.request({
                url : "api2/users/"+id,
                type : "PUT",
                data:userData,
                success : function(data) {
                	  callback.call(context || this,data);
                },
	            error:function(data){
	                  callback.call(context || this, data);
	            }
            });
       },
       deleteUser:function(id,callback,context){
    	    cloud.Ajax.request({
     	    	  url:"api2/users/"+id,
  		    	  type : "DELETE",
  		    	  success : function(data) {
             	      callback.call(context || this,data);
               }
            });
       },
       
       deleteRole:function(id,callback,context){
   	         cloud.Ajax.request({
		    	  url:"api2/roles/"+id,
		    	  type : "DELETE",
		    	  success : function(data) {
	       	          callback.call(context || this,data);
	              }
	         });
      },
      deleteSmartUser:function(id,email,callback,context){
	    var parameters={
                email:email
        };
   	    cloud.Ajax.request({
	    	  url:"api/smartUser/"+id,
	    	  type : "DELETE",
	    	  parameters : parameters,
	    	  success : function(data) {
       	      callback.call(context || this,data);
         }
         });
       },
       getUserList: function(name,start,limit,callback, context) {
    	   if(name){
    		  var parameters={
                   cursor : start,
                   limit:limit,
                   name:name,
                   verbose: 100
               };
    	   }else{
    		   var parameters={
                       cursor : start,
                       limit:limit,
                       verbose: 100
               };
    	   }
   			cloud.Ajax.request({
                url : "api2/users",
                type : "get",
                parameters : parameters,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		getpwdByOid:function(oid,email,callback,context){
     	    cloud.Ajax.request({
   	    	      url:"api/admin/pwd",
		    	  type : "get",
		    	  parameters :{
		    		  oid:oid,
		    		  email:email
		    	  },
		    	  success : function(data) {
           	          callback.call(context || this,data);
                 }
          });
   		},
   		getAllOid:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             searchData.verbose = 100;
             cloud.Ajax.request({
                 url: "mapi/organization/list",
                 type: "get",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        deleteOid:function(id,callback,context){
     	    cloud.Ajax.request({
     	    	  url:"api2/organizations/"+id,
  		    	  type : "DELETE",
  		    	  success : function(data) {
             	      callback.call(context || this,data);
               }
            });
     		},
   		getRoleList: function(name,start,limit,callback, context) {
     	   if(name){
     		  var parameters={
                    cursor : start,
                    limit:limit,
                    name:name,
                    verbose: 100
                };
     	   }else{
     		   var parameters={
                        cursor : start,
                        limit:limit,
                        verbose: 100
                };
     	   }
    			cloud.Ajax.request({
                 url : "api2/roles",
                 type : "get",
                 parameters : parameters,
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
    		},
   		    getRoleById: function(id,callback,context) {
   		    	cloud.Ajax.request({
 			    	  url:"api2/roles/"+id,
 			    	  type : "get",
 			    	 parameters : {
                         verbose: 100
                     },
 			    	  success : function(data) {
 		       	          callback.call(context || this,data);
 		              }
 		         });
   		    	
   		    },
    		getRoleInfo: function(start,limit,callback, context) {
       			cloud.Ajax.request({
                    url : "api2/roles",
                    type : "get",
                    parameters : {
                        cursor : start,
                        limit:limit,
                        verbose: 100
                    },
                    success : function(data) {
                        callback.call(context || this, data);
                    }
                });
       		},
    		
        getBehaveLogs: function(opt,start,limit,callback, context) {
        	 var self = this;
             var arrStr;
             if (opt.arr instanceof Array) {
             	arrStr = opt.arr.toString();
             }
             cloud.Ajax.request({
            	url: "api2/behav_log",
                type: "GET",
                dataType: "JSON",
                parameters: {
                	cursor:start,
                	limit:limit,
                	level:arrStr,
                    language:1,
                    start_time: opt.startTime,
                    end_time: opt.endTime
                },
                success: function(data) {
                	var result = data.result;
                	result.total=data.total;
                	result.cursor = data.cursor;
                	result.each(transLocale);
                    callback.call(context || this, result);
                }
            });
        },
        
        initializeRoles: function(callback,context) {
        	var self = this;
            cloud.Ajax.request({
                url: "api2/roles",
                type: "GET",
                dataType: "JSON",
                parameters: {
					limit:0,
                    verbose: 4
                },
                success: function(data) {
                    var result = data.result;
                    callback.call(context || this, result);
                }.bind(this)
            });
        },
        getFacebookConfig:function(callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: "api/facebook",
                type: "GET",
                dataType: "JSON",
                success: function(data) {
                    var result = data.result;
                    callback.call(context || this, result);
                }.bind(this)
            });
        }, updateFacebook:function(id,config,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: "api/facebook/"+id,
                type: "PUT",
                data:config,
                dataType: "JSON",
                success: function(data) {
                    var result = data.result;
                    callback.call(context || this, result);
                }.bind(this)
            });
        },addFacebook:function(config,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: "api/facebook",
                type: "POST",
                data:config,
                dataType: "JSON",
                success: function(data) {
                    var result = data.result;
                    callback.call(context || this, result);
                }.bind(this)
            });
        }
        
    });

    return new Service();
    
});