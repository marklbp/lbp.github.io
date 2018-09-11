export default {
	agency : {
		getInfoList: {
			url: '/agency/open_account'
			,config: {
				method: 'get'
				,params: {
					start: 1
					,limit: 10
				}
			}
			,name: '获取经销商列表'
		},
		getGroupsListByAgencyType: {
			url: '/agency/open_account'
			,config: {
				method: 'get'
				,params: {
					start: 1
					,limit: 100000
					,agencyType: 20
				}
			}
			,name: '获取经销商列表'
		},
		getDetailById: {
			url: '/agency/open_account/{id}'
			,config: {
				method: 'get'
				//,params: {id: 0}
			}
			,name: '获取该经销商数据'
		}
		,postAgencyData: {
			url: '/agency/open_account'
			,config: {
				method: 'post'
				,data: {
					contactsList: []
					,user: {}
					,fileIds: []
				}
			}
			,name: '开户申请'
		}
		,getAdmissionList: {
			// 集团|经销商|公司准入申请列表
			url: '/agency/admission/ccg'
			,config: {
				method: 'get'
				,params: {
					start: 1
					,limit: 10
					,code: ''
					,name: ''
					,agencyType: 0
				}
			}
			,name: '获取准入申请列表'
		}
		,getDetailBaseByAgencyId: {
			url: '/agency/admission/ccg/{agencyId}/base'
			,config: {
				method: 'get'
        ,params: {
        }
			}
			,name: '获取准入详情'
		}
		,postAdmissionBase: {
			 url: 'agency/admission/ccg/base'
			 ,config: {
			 	 method: 'post'
			 	 ,data: {
			 	 	agencyId: ''
			 	 	,lenderId: ''
			 	 	,cooperativeStartDate: ''
			 	 	,cooperativeEndDate: ''
			 	 }
			 }
			 ,name: '准入申请基本信息提交'
		}
		,getFileList: {
			 url: '/agency/admission/{id}/file'
			 ,config: {
			 	 method: 'get'
			 	 /*,data: {
			 	 	 id: ''
			 	 }*/
			 }
		}
		,getGuarantorInfo: {
			url: '/agency/admission/{id}/bond'
			,config: {
				method: 'get'
				/*
				params: {id}//参数注释表示实际请求无需传参，但业务代码里需要传入参数来替换url中的{参数}
				*/
			}
		}
		,postGuarantorInfo: {
			url: '/agency/admission/{type}/{id}/bond'
			,config: {
				method: 'post'
				,data: {
					/*type|id*/
				}
			}
		}
		,getAccountList: {
			 url: '/agency/admission/{type}/{id}/account_info'
			 ,config: {
			 	 method: 'get',
			 	 // params: {
			 	 // 		type: '',
					// 	id: ''
			 	 // }
			 }
		}
		,getAccountInfo:{
      url: '/agency/admission/{type}/{id}/account_info'
      ,config: {
        method: 'get',
        // params: {
        // 		type: '',
        // 	id: ''
        // }
      }
    }
		,postAccountInfoList: {
			url: '/agency/admission/{type}/{id}/account_info'
			,config: {
				method: 'post'
				,data: {
					type: ''
					,id: ''
					,accountInfoFormList: []
				}
			}
		}
		,postAdmissionFileList: {
			url: '/agency/admission/{type}/{id}/file'
			,config: {
				method: 'post'
				,data: {
					/*type|id*/
					formList: []
				}
			}
		}
		,getAdmissionRecordList: {
			url: '/agency/admission/applyfor/ccg/{id}'
			,config: {
				method: 'get'
				/*
				params: {id}
				*/
				,params: {
					regDate: ''
					,status: '-1'
				}
			}
		}
		,getRecordDetailId:{
      url: '/agency/admission/ccg/{agencyId}/detail'
      ,config: {
        method: 'get'
        /*,params: {
                        type: 'ss'||'ccg'
                        ,id: ''
                }*/
      }
    }
		,getStore2ShopAdmissionList: {
			// 经销商管理之展厅门店准入列表
			url: '/agency/admission/ss'
			,config: {
				method: 'get'
				,params: {
					agencyType: '',//50展厅|门店*/
					code: '',
					name: '',
					parentName: '',
					cityId: '',
					start: 1,
					limit: 10
				}
			}
		}
		,getStore2ShopDetail: {
			url: 'agency/admission/ss/{stype}/{id}/base'
			,config: {
				method: 'get'
				/*,params: {
					stype|id
				}*/
			}
		}
		,postStore2ShopAdmissionBase: {
			url: '/agency/admission/ss/{sType}/base'
			,config: {
				method: 'post'
				,data: {
					/*sType: 40|50, id: agencyId*/
					id: '',
					name: '',
					parentId: '',
					lenderId: '',
					representUserId: '',
					area: '',
					belongCity: '',
					belongCarFactory: '',
					hierarchy: '',
					bussType: '',
					email: '',
					provinceId: '',
					cityId: '',
					areaId: '',
					address: '',
					nationality: ''
				}
			}
		}
		,getGroupNameByAgencyId: {
			url: '/agency/admission/ss/{agencyId}/group'
			,config: {
				method: 'get'
				/*params: {agencyId}*/
			}
		}
		,getLenderIdByAgencyId: {
			url: '/agency/admission/ss/{agencyId}/lender'
			,config: {
				method: 'get'
				/*params: {agencyId}*/
			}
		}
		,getRepresentUserIdByLenderId: {
			url: '/agency/admission/ss/{lenderId}/represent_user'
			,config: {
				method: 'get'
				/*params: {lenderId}*/
			}
		}
		,getOutAccount: {
			url: '/agency/admission/ss/{stype}/{id}/out_account'
			,config: {
				method: 'get'
				/*params: {stype: 40|50, id: admissionBaseId}*/
			}
		}
		,postOutAccount: {
			url: '/agency/admission/ss/{sType}/{id}/out_account'
			,config: {
				method: 'post'
				,data: {
					/*sType: 40|50, id: admissionBaseId*/
					accountLevel: '',
					accountMode: 0
				}
			}
		}
		,getContact: {
			url: 'agency/admission/ss/{id}/contacts'
			,config: {
				method: 'get'
				/*params: {id}*/
			}
		}
		,postContact: {
			url: 'agency/admission/ss/{id}/contacts'
			,config: {
				method: 'post'
				,data: {
					/*id*/
					contactsList: []
				}
			}
		}
    ,getStoreOrShopRegDetail: {
      url: 'agency/admission/ss/{agencyId}/detail'
      ,config: {
        method: 'get'
      }
    }
    ,postCheckSubmitInfo: {
      url: '/agency/admission/{type}/{id}/check'
      ,config: {
        method: 'post'
        ,data: {
          /*type|id*/
        }
      }
    }
    ,getLenderId: {
    	// 获取登录资方的信息
    	url: 'agency/admission/user/lender'
    	,config: {
    		method: 'get'
    	}
    }
    ,getAdmissionDetailByCard: {
    	url: '/agency/admission/ccg/{cardType}/{cardNo}/{agencyType}/detail'
    	,config: {
    		method: 'get'
    	}
    }
	}
}
