let menuConfig = [{
    name: '准入审查',
    unicode: '&#xe643;',
    path: '/saas/reviewEnter',
    id: 85,
    pathMap: {
        '/saas/reviewEnter/group': ['准入审查', '集团准入审查'],
        '/saas/reviewEnter/group/processing': ['准入审查', '集团准入审查', '待审查列表'],
        '/saas/reviewEnter/group/over': ['准入审查', '集团准入审查', '已审查列表'],
        '/saas/reviewEnter/channel': ['准入审查', '经销商准入审查'],
        '/saas/reviewEnter/channel/processing': ['准入审查', '经销商准入审查', '待审查列表'],
        '/saas/reviewEnter/channel/over': ['准入审查', '经销商准入审查', '已审查列表'],
        '/saas/reviewEnter/company': ['准入审查', '公司准入审查'],
        '/saas/reviewEnter/company/processing': ['准入审查', '公司准入审查', '待审查列表'],
        '/saas/reviewEnter/company/over': ['准入审查', '公司准入审查', '已审查列表'],
        '/saas/reviewEnter/shop': ['准入审查', '展厅准入审查'],
        '/saas/reviewEnter/shop/processing': ['准入审查', '展厅准入审查', '待审查列表'],
        '/saas/reviewEnter/shop/over': ['准入审查', '展厅准入审查', '已审查列表'],
        '/saas/reviewEnter/store': ['准入审查', '门店准入审查'],
        '/saas/reviewEnter/store/processing': ['准入审查', '门店准入审查', '待审查列表'],
        '/saas/reviewEnter/store/over': ['准入审查', '门店准入审查', '已审查列表'],
    },
    menu: [
        {
            name: '集团准入审查'
            , path: '/saas/reviewEnter/group'
            , menu: [
                {
                    name: '待审查列表',
                    path: '/saas/reviewEnter/group/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审查列表',
                    path: '/saas/reviewEnter/group/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '经销商准入审查'
            , path: '/saas/reviewEnter/channel'
            , menu: [
                {
                    name: '待审查列表',
                    path: '/saas/reviewEnter/channel/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审查列表',
                    path: '/saas/reviewEnter/channel/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '公司准入审查'
            , path: '/saas/reviewEnter/company'
            , menu: [
                {
                    name: '待审查列表',
                    path: '/saas/reviewEnter/company/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审查列表',
                    path: '/saas/reviewEnter/company/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '展厅准入审查'
            , path: '/saas/reviewEnter/shop'
            , menu: [
                {
                    name: '待审查列表',
                    path: '/saas/reviewEnter/shop/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审查列表',
                    path: '/saas/reviewEnter/shop/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '门店准入审查'
            , path: '/saas/reviewEnter/store'
            , menu: [
                {
                    name: '待审查列表',
                    path: '/saas/reviewEnter/store/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审查列表',
                    path: '/saas/reviewEnter/store/over',
                    id: 84,
                    permissions: []
                }
            ]
        }
    ]
},{
    name: '准入审批',
    unicode: '&#xe643;',
    path: '/saas/approvalEnter',
    id: 85,
    pathMap: {
        '/saas/approvalEnter/group': ['准入审批', '集团准入审批'],
        '/saas/approvalEnter/group/processing': ['准入审批', '集团准入审批', '待审批列表'],
        '/saas/approvalEnter/group/over': ['准入审批', '集团准入审批', '已审批列表'],
        '/saas/approvalEnter/channel': ['准入审批', '经销商准入审批'],
        '/saas/approvalEnter/channel/processing': ['准入审批', '经销商准入审批', '待审批列表'],
        '/saas/approvalEnter/channel/over': ['准入审批', '经销商准入审批', '已审批列表'],
        '/saas/approvalEnter/company': ['准入审批', '公司准入审批'],
        '/saas/approvalEnter/company/processing': ['准入审批', '公司准入审批', '待审批列表'],
        '/saas/approvalEnter/company/over': ['准入审批', '公司准入审批', '已审批列表'],
        '/saas/approvalEnter/shop': ['准入审批', '展厅准入审批'],
        '/saas/approvalEnter/shop/processing': ['准入审批', '展厅准入审批', '待审批列表'],
        '/saas/approvalEnter/shop/over': ['准入审批', '展厅准入审批', '已审批列表'],
        '/saas/approvalEnter/store': ['准入审批', '门店准入审批'],
        '/saas/approvalEnter/store/processing': ['准入审批', '门店准入审批', '待审批列表'],
        '/saas/approvalEnter/store/over': ['准入审批', '门店准入审批', '已审批列表'],
    },
    menu: [
        {
            name: '集团准入审批'
            , path: '/saas/approvalEnter/group'
            , menu: [
                {
                    name: '待审批列表',
                    path: '/saas/approvalEnter/group/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审批列表',
                    path: '/saas/approvalEnter/group/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '经销商准入审批'
            , path: '/saas/approvalEnter/channel'
            , menu: [
                {
                    name: '待审批列表',
                    path: '/saas/approvalEnter/channel/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审批列表',
                    path: '/saas/approvalEnter/channel/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '公司准入审批'
            , path: '/saas/approvalEnter/company'
            , menu: [
                {
                    name: '待审批列表',
                    path: '/saas/approvalEnter/company/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审批列表',
                    path: '/saas/approvalEnter/company/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '展厅准入审批'
            , path: '/saas/approvalEnter/shop'
            , menu: [
                {
                    name: '待审批列表',
                    path: '/saas/approvalEnter/shop/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审批列表',
                    path: '/saas/approvalEnter/shop/over',
                    id: 84,
                    permissions: []
                }
            ]
        },
        {
            name: '门店准入审批'
            , path: '/saas/approvalEnter/store'
            , menu: [
                {
                    name: '待审批列表',
                    path: '/saas/approvalEnter/store/processing',
                    id: 84,
                    permissions: []
                }, {
                    name: '已审批列表',
                    path: '/saas/approvalEnter/store/over',
                    id: 84,
                    permissions: []
                }
            ]
        }
    ]
}];
export default menuConfig
